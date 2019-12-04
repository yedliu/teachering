import React from 'react';
import { toString } from 'lodash';
import { Button, message, Popconfirm } from 'antd';
import testReportApi from 'api/tr-cloud/test-lesson-recommended-content-endpoint';
import ossApi from 'api/tr-cloud/oss-endpoint';
import { CenterWrapper } from './style';

class UpLoadImage extends React.Component {
  upLoad = () => {
    if (this.input) {
      this.input.click();
    }
  }
  beforeUpload = (file) => {
    return /^image\/(png|jpeg)$/.test(file.type) && file.size <= 5 * 1024 * 1024;
  }
  changeFile = (e) => {
    const { type, moduleId, preUploadImg } = this.props;
    const file = e.target.files[0] || null;
    if (preUploadImg) {
      preUploadImg();
    }
    if (this.beforeUpload(file)) {
      const res = this.uploadImg(type, { file, id: moduleId });
      if (res) {
        res.then((res) => {
          if (toString(res.code) === '0') {
            message.success(res.message || '上传成功');
            const { finishUpload } = this.props;
            finishUpload && finishUpload(res.data);
          } else {
            message.warn(res.message || '上传失败');
          }
        });
      }
    } else {
      message.warn('请上传上传 png、jpg 或 jpeg 格式下小于 5m 的图片');
    }
  }
  uploadImg = (type, { file, id }) => {
    return ossApi.uploadFileToAliOSS(file).then(({ url }) => {
      if (!url) {
        message.error('上传失败');
        return;
      }
      if (type === 'PC') {
        return this.uploadImgForPC({ id, pcPicUrl: url });
      } else if (type === 'h5') {
        return this.uploadImgForH5({ id, h5PicUrl: url });
      }
    });
  }
  uploadImgForPC = (params) => {
    return testReportApi.uploadImgForPC(params);
  }
  uploadImgForH5 = (params) => {
    return testReportApi.uploadImgForH5(params);
  }
  preview = () => {
    const { type, moduleId, previewImg, url } = this.props;
    // console.log(type, moduleId, previewImg, url, 'type, moduleId, previewImg, url');
    if (previewImg) {
      previewImg({
        type,
        url,
        id: moduleId,
      });
    }
  }
  delete = () => {
    let res = null;
    const { type, moduleId } = this.props;
    if (type === 'PC') {
      res = this.uploadImgForPC({ id: moduleId, pcPicUrl: '' });
    } else if (type === 'h5') {
      res = this.uploadImgForH5({ id: moduleId, h5PicUrl: '' });
    }
    if (res) {
      res.then((res) => {
        if (toString(res.code) === '0') {
          message.success(res.message || '删除成功');
          const { finishUpload } = this.props;
          finishUpload && finishUpload(res.data);
        } else {
          message.warn(res.message || '删除失败');
        }
      });
    }
  }
  render() {
    const { btnText = '上传', btnType = 'primary', style = {}, size = 'default', showType = 'all' } = this.props;
    const preViewShow = ['all'].includes(showType);
    const preUpload = ['all', 'upload', 'preview'].includes(showType);
    const preDelete = ['all', 'preview'].includes(showType);
    return (
      <div style={style}>
        <CenterWrapper>
          {preViewShow ? <Button style={{ margin: '0 5px' }} type={btnType} size={size} onClick={this.preview}>预览</Button> : null}
          {preUpload ? <Button style={{ margin: '0 5px' }} type={btnType} size={size} onClick={this.upLoad}>{btnText}</Button> : null}
          {/* {preDelete ? <Button style={{ margin: '0 5px' }} type={btnType} size={size} onClick={this.delete}>删除</Button> : null} */}
          {preDelete ? (<Popconfirm title="确定删除图片？" onConfirm={this.delete} okText="确定" cancelText="取消">
            <Button style={{ margin: '0 5px' }} type={btnType} size={size}>删除</Button>
          </Popconfirm>) : null}
        </CenterWrapper>
        <input style={{ display: 'none' }} type="file" onChange={this.changeFile} ref={x => { this.input = x }} multiple={false} value="" accept="image/png,image/jpeg" />
      </div>
    );
  }
}

export default UpLoadImage;