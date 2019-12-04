import React, { PropTypes } from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import ossApi from 'api/tr-cloud/oss-endpoint';
// const fileList = [{
//   uid: -1,
//   name: 'xxx.png',
//   status: 'done',
//   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
// }];
class ImgUpload extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
    };
  }
  handleImgCancel = () => this.setState({ previewVisible: false })

  handleImgPreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  handleImgChange = ({ fileList }) => {
    console.log('handleImgChange', fileList);
  }
  // onStart = (file) => {
  //   console.log('onStart', file, file.name);
  // }
  onSuccess = ({ res, url }, file) => {
    console.log('onSuccess', res, file);
  }
  onError = (err) => {
    console.error('onError', err);
  }
  beforeUpload = (file) => {
    console.log(file, 'beforeUpload');
    const isJPG = ['image/jpeg', 'image/png'].includes(file.type);
    if (!isJPG) {
      message.error('只能上传 JPG、PNG 格式的图片文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片必须小于 2MB!');
    }
    return isJPG && isLt2M;
  }
  uploadImg = (file) => {
    const { getItemContent } = this.props;
    console.log('getItemContent', getItemContent);
    return ossApi.uploadFileToAliOSS(file).then((res) => {
      const { url } = res;
      console.log('uploadImg', url);
      if (!url) {
        message.error('上传失败');
        return;
      }
      // 将 oss 信息返回给后台
      getItemContent({
        'optionElementContent': url,
        'optionElementDesc': file.name,
        'optionElementType': 3, // 音频
      });
      return url;
    });
  }
  customRequest = ({
    action,
    data,
    file,
    filename,
    headers,
    onError,
    onProgress,
    onSuccess,
    withCredentials,
  }) => {
    this.beforeUpload &&
    this.uploadImg(file).then((res) => {
      console.log(res, 'res -- res');
      onSuccess(res, file);
    }
    ).catch(onError);

  }
  render() {
    const { previewVisible, previewImage } = this.state;
    const {
      optionElementItem,
      index: i = 0,
      getIndex,
     } = this.props;
    const url = optionElementItem[`optionElementContent`] || '';
    const name = optionElementItem[`optionElementDesc`] || '';
    const fileList = url ? [{
      uid: -1,
      name: name,
      status: 'done',
      url: url,
    }] : [];
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div style={{
          'marginTop': '8px',
          'fontSize': '12px',
          'color': '#666',
        }}
        >
          添加图片
        </div>
      </div>
      );
    return (
      <span>
        <Upload
          customRequest={this.customRequest}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handleImgPreview}
          onChange={this.handleImgChange}
          beforeUpload={this.beforeUpload}
          onSuccess={this.onSuccess}
          onError={this.onError}
          onRemove={(file) => getIndex(i, file)}
          accept="image/*"
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleImgCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </span>
    );
  }
}
ImgUpload.propTypes = {
  index: PropTypes.number,
  optionElementItem: PropTypes.object,
  getIndex: PropTypes.func,
  getItemContent: PropTypes.func,
};
export default ImgUpload;
