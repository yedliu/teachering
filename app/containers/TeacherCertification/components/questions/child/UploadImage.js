import React from 'react';
import styled from 'styled-components';
import ossApi from 'api/tr-cloud/oss-endpoint';
import { Icon, message, Modal } from 'antd';

const UploadWrapper = styled.div`
  display: inline-block;
  position: relative;
  margin: 0 10px;
  .option-uploader {
    width: 80px;
    height: 80px;
    display: flex;
    font-size: 20px;
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
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    visibility: hidden;
    width: 80px;
    height: 80px;
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
  };

  beforeUpload = file => {
    return (
      /^image\/(png|jpeg)$/.test(file.type) && file.size <= 5 * 1024 * 1024
    );
  };

  reUploadImage = () => {
    this.input.click();
  }

  changeFile = async e => {
    const { preUploadImg, onChange } = this.props;
    const file = e.target.files[0] || null;
    if (preUploadImg) {
      preUploadImg();
    }
    if (this.beforeUpload(file)) {
      const url = await this.uploadImage(file);
      if (onChange) onChange(url);
    } else {
      message.warn('请上传 png、jpg 或 jpeg 格式下小于 5m 的图片');
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
    return (
      <UploadWrapper>
        <label className="option-uploader">
          {imageUrl ? (
            <div className="option">
              <img src={imageUrl} />
            </div>
          ) : (
            <Icon type="plus" className="option-uploader-plus" />
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
            alt="example"
            style={{ width: '100%', maxWidth: '550px' }}
            src={imageUrl}
          />
        </Modal>
      </UploadWrapper>
    );
  }
}
