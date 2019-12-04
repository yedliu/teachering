import React, { Component, PropTypes } from 'react';
import { Button, message } from 'antd';
import ossApi from 'api/tr-cloud/oss-endpoint';

// 把文件转换成可读 URL
function getObjectURL(file) {
  let url = null;
  if (window.createObjectURL !== void 0) { // basic
    url = window.createObjectURL(file);
  } else if (window.URL !== void 0) { // mozilla(firefox)
    url = window.URL.createObjectURL(file);
  } else if (window.webkitURL !== void 0) { // webkit or chrome
    url = window.webkitURL.createObjectURL(file);
  }
  return url;
}

const UploadButton = ({ handleUpload, url, status }) => (
  <Button loading={status === 'pending'} type={status === 'pending' ? 'dashed' : 'primary'} onClick={handleUpload} style={{ margin: '0 10px' }}>
    {status === 'pending' ? '音频正在上传...' : (url ? '重新上传' : '上传音频文件')}
  </Button>
);
const Audio = ({ src, ...rest }) => (
  <audio
    id="audio"
    controls
    src={src}
    style={{
      height: '28px',
      verticalAlign: 'top'
    }}
    {...rest}
  >您的浏览器不支持 <code>audio</code> 标签，建议使用最新版的 Chrome 浏览器！</audio>
);

class AudioUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      src: ''
    };
  }
  beforeUpload = (file) => {
    const isWAV = ['audio/wav', 'audio/mp4'].includes(file.type);
    if (!isWAV) {
      message.error('只能上传 wav、mp4 格式的音频文件!');
    }
    const isLt50M = file.size / 1024 / 1024 < 50;
    if (!isLt50M) {
      message.error('音频必须小于 50MB!');
    }
    return isJPG && isLt2M;
  };
  uploadAudio = (file) => {
    this.setState({
      fileName: file.name,
      status: 'pending'
    });
    const response = ossApi.uploadFileToAliOSS(file).then((res) => {
      const { getStatus } = this.props;
      const { url } = res;
      if (!url) {
        message.error('上传失败');
        return '';
      }
      this.setState({
        status: 'success'
      });
      getStatus('success');
      message.success('上传成功');
      return res;
    }).catch((err) => {
      this.setState({
        status: 'error',
        i: this.state.i++, // i 記錄調用 OSS 失敗的次數
      });
      if (this.state.i < 3) {
        this.uploadAudio(file); // 失敗自動重傳
      } else {
        message.error('网络慢，请稍后重试');
        console.log(err);
        return;
      }
    });
    return response;
  }
  handleFileChange = (e) => {
    const fileList = e.target.files;
    const objUrl = getObjectURL(fileList[0]);
    this.setState({ src: objUrl });
    const { getItemContent } = this.props;
    console.log('objUrl', objUrl);
    this.beforeUpload && this.uploadAudio(fileList[0]).then((res) => {
      const { url } = res;
      url &&
        getItemContent({
          'optionElementContent': url,
          'optionElementDesc': this.state.fileName,
          'optionElementType': 4, // 音频
        });
    });
  }

  handleUpload = () => {
    this.Input.click();
  }
  onPlay = (e) => {
    this.setState({
      isPlay: true,
    });
    console.log(e.target, 'onPlay');
  }
  render() {
    const {
      src,
      status
    } = this.state;
    const {
      multiple,
      optionElementItem,
    } = this.props;
    // console.log('audio.props', this.props, optionElementItem, fileList);
    const url = optionElementItem[`optionElementContent`] || '';
    // const reg = /([^\\/]+)\.([^\\/]+)/i; // 通过路径截取文件名字
    // debugger
    return <span
      style={{ display: 'inline-block', marginBottom: '8px' }}
    >
      <input
        ref={x => { this.Input = x }}
        type="file"
        multiple={multiple || 'multiple'}
        onChange={this.handleFileChange}
        style={{ display: 'none' }}
        accept="audio/*"
      />
      {url ? null : <UploadButton url={url} handleUpload={this.handleUpload} status={status} />}
      {url ? <Audio src={url || src} onPlay={this.onPlay} /> : null}
      {url ? <UploadButton url={url} handleUpload={this.handleUpload} status={status} /> : null}
    </span>;
  }
}
AudioUpload.propTypes = {
  index: PropTypes.number,
  optionElementItem: PropTypes.object,
  getIndex: PropTypes.func,
  getItemContent: PropTypes.func,
};
export default AudioUpload;

