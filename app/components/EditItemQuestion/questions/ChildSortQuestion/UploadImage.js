import React from 'react';
import styled from 'styled-components';
import { Icon, message, Modal, Spin } from 'antd';
import ossApi from 'api/tr-cloud/oss-endpoint';

const UploadWrapper = styled.div`
  display: inline-block;
  position: relative;
  margin: 0 10px;
  line-height: 1.5;
  .option-uploader {
    width: 82px;
    height: 82px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    .option-uploader-plus {
      font-size: 20px;
      color: #999;
      line-height: 1;
    }
    .option {
      width: 80px;
      height: 80px;
      img {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
    }
  }
  .option-tips {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    padding-top: 15px;
    visibility: hidden;
    border-radius: 4px;
  }
  &:hover {
    .option-tips {
      visibility: visible;
    }
  }
`;

const UploadButton = styled.div`
  text-align: center;
  padding: 5px;
`;

export default class UploadImage extends React.Component {
  state = {
    previewVisible: false,
    loading: false,
  };

  beforeUpload = file => {
    return (
      /^image\/(png|jpeg)$/.test(file.type) && file.size <= 5 * 1024 * 1024
    );
  };
  // 重新上传图片
  reUploadImage = () => {
    this.input.click();
  }

  changeFile = async e => {
    e.stopPropagation();
    const { preUploadImg, onChange } = this.props;
    const file = e.target.files[0] || null;
    if (preUploadImg) {
      preUploadImg();
    }
    if (this.beforeUpload(file)) {
      this.setState({ loading: true });
      const url = await this.uploadImage(file);
      this.setState({ loading: false });
      if (onChange) onChange(url);
    } else {
      message.warn('请上传上传 png、jpg 或 jpeg 格式下小于 5m 的图片');
    }
  };

  uploadImage = file => {
    return ossApi.uploadFileToAliOSS(file).then(({ url }) => {
      if (!url) {
        message.error('上传失败');
        return '';
      }
      return url;
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = e => {
    e.stopPropagation();
    this.setState({ previewVisible: true });
  };

  render() {
    const { imageUrl } = this.props;
    const { loading } = this.state;
    return (
      <Spin spinning={loading}>
        <UploadWrapper>
          <label className="option-uploader">
            {imageUrl ? (
              <div className="option">
                <img src={imageUrl} />
              </div>
            ) : (
                !loading && <Icon type="plus" className="option-uploader-plus" />
              )}
            <input
              style={{ display: 'none' }}
              type="file"
              onChange={this.changeFile}
              ref={x => {
                this.input = x;
              }}
              multiple={false}
              value=""
              accept="image/png,image/jpeg"
            />
          </label>
          {imageUrl &&
            <div className="option-tips">
              <UploadButton onClick={this.handlePreview}>
                预览大图
              </UploadButton>
              <UploadButton onClick={this.reUploadImage}>重新上传</UploadButton>
            </div>
          }
          <Modal
            visible={this.state.previewVisible}
            footer={null}
            onCancel={this.handleCancel}
          >
            <img
              alt="互动排序题"
              style={{ width: '100%', maxWidth: '550px' }}
              src={imageUrl}
            />
          </Modal>
        </UploadWrapper>
      </Spin>
    );
  }
}
