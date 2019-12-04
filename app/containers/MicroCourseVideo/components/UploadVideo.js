import React from 'react';
import { Progress, Button, Icon, message } from 'antd';
import { getUploadPolicy } from '../server';
import plupload from 'plupload';
import hash from 'hash.js';
import { deleteMoxie } from './deleteMoxie';
import { Text, InlineDiv } from '../style';
class UploadVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 1,
      showProgress: false,
      fileName: ''
    };
  }
  componentDidMount() {
    this.initUploader();
  }
  initUploader=() => {
    this.uploader = new plupload.Uploader({
      url: 'http://oss.aliyuncs.com',
      browse_button: document.querySelector('.upload-btn'),
      filters: {
        mime_types: [// 允许文件上传类型
          { title: 'files', extensions: 'mpg,m4v,mp4,flv,3gp,mov,avi,rmvb,mkv,wmv' }
        ],
        max_file_size: '500mb', // 最大只能上传400KB的文件
      },
    });
    let uploader = this.uploader;
    uploader.init();
    let objectName = '';
    let fileSize = 0;
    uploader.bind('FilesAdded', async (uploader, files) => {
      if (files.length !== 1) {
        message.warning('只能传一个视频');
        return;
      }
      // 删除上传节点
      deleteMoxie(this.uploaderWrapper);
      let file = files[0];
      this.setState({ showProgress: true, fileName: files[0].name,  progress: 1 });
      let hashCode = hash.sha256().update(Number(new Date()) + file.name).digest('hex');
      const fileName = `${hashCode}${file.name.replace(/^.*(\.\w+)$/, '$1')}`;
      let res = await getUploadPolicy();
      if (!res.dir) {
        message.warning('获取policy失败，请重试');
        this.handleDel();
        uploader.removeFile(file);
        return;
      }
      objectName = res.dir + fileName;
      fileSize = file.size;
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
      console.log(data, files);
      this.props.onChange(objectName, fileSize, files.name);
      this.setState({ progress: 100 });
      this.props.onUndone(false);
    });
    uploader.bind('Error', (uploader, error) => {
      this.props.onUndone(false);
      switch (error.code) {
        case -601:
          message.warning('类型不对，请传视频');
          break;
        case -600:
          message.warning('请传500兆以下视频');
          break;
        default:
          message.warning(error.message);
      }
    });
  }
  handleDel=() => {
    this.setState({ fileName: '', showProgress: false, progress: 1 }, () => {
      this.props.onChange('');
      // 删除上传节点
      this.uploader.stop();
      deleteMoxie(this.uploaderWrapper);
      this.initUploader();
    });
    this.props.onUndone(false);
  }
  render() {
    return (
      <div>
        {
          this.state.showProgress ?
            <div>
              <div>
                {this.state.progress === 100 ?
                  <InlineDiv><Text>{`${this.state.fileName}`}</Text>上传成功</InlineDiv> :
                  <InlineDiv><Text>{`${this.state.fileName}`}</Text>上传中...</InlineDiv>}
                <Icon type="close-circle" style={{ cursor: 'pointer', marginLeft: 10 }} onClick={this.handleDel} />
              </div>
              <Progress percent={this.state.progress} />
            </div>
            :
            <div ref={(e) => { this.uploaderWrapper = e }}>
              <Button type="primary"  className="upload-btn">
                上传视频
              </Button>
            </div>
        }
      </div>
    );
  }
}

export default UploadVideo;

