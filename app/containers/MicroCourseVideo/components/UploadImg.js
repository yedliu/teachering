import React from 'react';
import { Progress, Button, Icon, message } from 'antd';
import { getUploadImgPolicy, sortOssAcl } from '../../MicroLessons/server';
import plupload from 'plupload';
import hash from 'hash.js';
import styled from 'styled-components';
import { deleteMoxie } from './deleteMoxie';
import { Text } from '../style';
const SmallImg = styled.img`
width: 50px;
height: 50px;
border: 1px solid #999;
cursor: pointer;
z-index: 1;
`;

const iconStyle = {
  cursor: 'pointer', marginLeft: 10, position: 'absolute', top: -5, right: -5
};
class UploadImg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileName: '',
      showImg: false,
      progress: 0,
      showProgress: false,
      url: ''
    };
  }
  componentDidMount() {
    this.initUploader();
  }
  handleDel=() => {
    this.setState({ fileName: '', showProgress: false, progress: 1, url: '' }, () => {
      this.props.onChange('');
      this.uploader.stop();
      // 删除上传节点
      deleteMoxie(this.uploaderWrapper);
      this.initUploader();
    });
    this.props.onUndone(false);
  }
  handleBigImg=() => {
    window.open(this.state.url || this.props.imgUrl, '_blank');
  }
  initUploader=() => {
    this.uploader = new plupload.Uploader({
      url: 'http://oss.aliyuncs.com',
      browse_button: document.querySelector(`.${this.props.btnClass}`),
      filters: {
        mime_types: [// 允许文件上传类型
          { title: 'files', extensions: 'png,jpeg,jpg,gif' }
        ],
        max_file_size: '20mb',
      },
    });
    let uploader = this.uploader;
    uploader.init();
    let objectName = '';
    let fileSize = 0;
    uploader.bind('FilesAdded', async (uploader, files) => {
      if (files.length !== 1) {
        message.warning('只能传一个');
        return;
      }
      // 删除上传节点
      deleteMoxie(this.uploaderWrapper);
      let file = files[0];
      this.setState({ showImg: true, fileName: files[0].name, showProgress: true, progress: 1 });
      // uploader.disableBrowse();
      let hashCode = hash.sha256().update(Number(new Date()) + file.name).digest('hex');
      const fileName = `${hashCode}${file.name.replace(/^.*(\.\w+)$/, '$1')}`;
      let res = await getUploadImgPolicy();
      if (!res.dir) {
        message.warning('获取policy失败，请重试');
        this.handleDel();
        uploader.removeFile(file);
        return;
      }
      objectName = res.dir + fileName;
      fileSize = file.size;
      this.setState({ url: res.host + '/' + objectName });
      uploader.setOption({
        'url': res.host,
        'multipart_params': {
          key: objectName,
          'policy': res.policy,
          'OSSAccessKeyId': res.accessId,
          'success_action_status': '200',
          // 'callback': res.callback,
          'signature': res.signature,
        },
      });
      uploader.start();
      this.props.onUndone(true);
    });
    uploader.bind('UploadProgress', (up, file) => {
      let per = up.total.percent;
      this.setState({ progress: per });
    });
    uploader.bind('FileUploaded', (uploader, files, data) => {
      console.log(data, objectName);
      sortOssAcl({ pathPrefix: objectName }).then(code => {
        if (code === '0') {
          this.props.onChange(this.state.url, fileSize, objectName);
          this.setState({ progress: 100 });
        }
      });
      this.props.onUndone(false);
    });
    uploader.bind('Error', (uploader, error) => {
      switch (error.code) {
        case -601:
          message.warning('类型不对，请传图片');
          break;
        case -600:
          message.warning('请传20兆以下图片');
          break;
        default:
          message.warning(error.message);
      }
      this.props.onUndone(false);
    });
  }
  render() {
    const { children, btnClass, imgUrl } = this.props;
    const { showProgress, progress, url } = this.state;
    return (
      <div ref={(e) => { this.uploaderWrapper = e }}>
        <div>
          {
             imgUrl  ?
               <div style={{ width: 52, height: 52, position: 'relative' }}>
                 <SmallImg src={imgUrl} onClick={this.handleBigImg} />
                 <Icon type="close-circle" style={iconStyle} onClick={this.handleDel} />
               </div>
               : null
                }
          {showProgress && progress < 100 && <div><Text>{`${this.state.fileName}`}</Text><Icon type="close-circle"  onClick={this.handleDel} style={{ cursor: 'pointer' }} /></div> }
        </div>
        {
          showProgress ?
            <Progress percent={this.state.progress} /> :
           null
        }
        <Button type="primary"  className={btnClass} style={{ display: url || imgUrl ? 'none' : 'inline-block' }}>
          {children}
        </Button>
      </div>
    );
  }
}

export default UploadImg;

