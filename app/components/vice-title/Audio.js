import React, { Component } from 'react';
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
    {status === 'pending' ? '音频正在上传...' : (url ? '重新上传' : '上传')}
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
  /**
   * 提交前验证文件格式
   * @param { File } file
   */
  fileTypeApproved = (file) => {
    const isWAV = ['audio/wav', 'audio/mp3', 'audio/x-m4a'].includes(file.type);
    const isLt50M = file.size < (50 * 1024 * 1024);
    if (!isWAV || !isLt50M) {
      message.warn('请上传小于 50MB 的格式为 wav、mp3 的音频文件!', 2.5);
    }
    return isWAV && isLt50M;
  };
  uploadAudio = (file) => {
    this.setState({
      fileName: file.name,
      status: 'pending'
    });
    return ossApi.uploadFileToAliOSS(file).then((res) => {
      const { url } = res;
      if (!url) {
        message.error('上传失败');
        return '';
      }
      this.setState({
        status: 'success'
      });
      return res;
    });
  }
  handleFileChange = (e) => {
    const fileList = e.target.files;
    const objUrl = getObjectURL(fileList[0]);
    const { getItemContent } = this.props;
    // console.log('objUrl', objUrl);
    if (this.fileTypeApproved(fileList[0])) {
      this.uploadAudio(fileList[0]).then((res) => {
        const { url } = res;
        getItemContent({
          'stemBusiType': 'listenFile',
          'stemElementType': 4,
          'stemElementContent': url,
          'stemElementDesc': this.state.fileName,
          'stemElementOrder': 1
        });
        this.setState({
          fileList,
          src: url || objUrl,
          isPlay: false,
        });
      });
    }
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
      fileList,
      status
    } = this.state;
    const {
      multiple,
      url,
      stemElementDesc
    } = this.props;
    // console.log('audio.props', this.props,);
    // console.log('url', url)
    return <span
      style={{ display: 'inline-block', marginBottom: '8px' }}
    >
      <input
        ref={x => { this.Input = x }}
        type="file"
        key={JSON.stringify(fileList)}
        multiple={multiple || 'multiple'}
        onChange={this.handleFileChange}
        style={{ display: 'none' }}
        accept="audio/*"
      />
      {url ? null : <UploadButton url={url} handleUpload={this.handleUpload} status={status} />}
      {url ? <Audio src={url || src} onPlay={this.onPlay} /> : null}
      <span
        title={stemElementDesc}
        style={{
          display: 'inline-block',
          margin: '0 6px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '300px',
          verticalAlign: 'middle',
        }}
      >{stemElementDesc}</span>
      {url ? <UploadButton key={url} url={url} handleUpload={this.handleUpload} status={status} /> : null}
    </span>;
  }
}

export default AudioUpload;

