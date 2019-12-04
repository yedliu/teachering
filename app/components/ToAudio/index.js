import React from 'react';
import { Button, message, Switch } from 'antd';
import { filterToText, isFunc } from 'components/CommonFn';
import getAudioUrl from 'api/qb-cloud/trans-text-to-audio';
import ossApi from 'api/tr-cloud/oss-endpoint';

// 如需抽离，建议放到 components/EditItemQuestion/childBU-quesTypes 中或者 将其一起抽离
const synthesizeAudioStatusEnum = [
  {
    type: 'empty',        // 状态
    label: '未合成',      // 状态表示
    btnLabel: '合成音频', // 按钮显示文字
    operational: true,   // 可操作：操作是否被允许
    optional: false,     // 可选用：是否可以选择该内容
  },
  {
    type: 'synthesize',
    label: '合成中...',
    btnLabel: '合成中...',
    operational: false,
    optional: false,
  },
  {
    type: 'synthesized',
    label: '已合成',
    btnLabel: '已合成',
    operational: false,
    optional: true,
  },
  {
    type: 'resynthesize',
    label: '需更新',
    btnLabel: '重新合成',
    operational: true,
    optional: false,
  }
];
const uploadAudioStatusEnum = [
  {
    type: 'empty',
    label: '未上传',
    btnLabel: '上传音频',
    operational: true,
    optional: false,
  },
  {
    type: 'uploading',
    label: '上传中...',
    btnLabel: '上传中...',
    operational: false,
    optional: false,
  },
  {
    type: 'synthesized',
    label: '已上传',
    btnLabel: '重新上传',
    operational: true,
    optional: true,
  },
];

export default class ToAudio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      syntheticalStatus: void 0,
      uploadStatus: void 0,
    };
  }
  validdateText = (text) => {
    if (!text) {
      message.warn('请输入有效的信息后再转换！');
      return false;
    }
    return true;
  }
  // 通过调后台科大讯飞的服务将主题干转换成音频
  translateToAudio = () => {
    // eslint-disable-next-line no-unused-vars
    const { text = '', questionId = null, audio: [synthesizeAudio, uploadAudio] } = this.props;
    if (!this.validdateText(text)) return;

    /*
    this.setAudio({
      audioPath: void 0,
      content: {
        audioFlag: 3,
        syntheticalAudioPath: void 0,
        uploadAudioPath: uploadAudio.audioPath || void 0,
      },
    });
    */
    this.setState({ syntheticalAudioStatus: 1 }, () => {
      getAudioUrl({ text: filterToText(text), questionId }).then(res => {
        // console.log('getAudioUrl', res);
        const { audioPath: url, message: msg } = res;
        if (!url) {
          if (msg) {
            message.error(`${msg} 请稍后重试`);
            this.setAudio({
              audioPath: void 0,
              questionContent: {
                audioFlag: uploadAudio.audioPath ? 2 : 3,
                syntheticalAudioPath: void 0,
                uploadAudioPath: uploadAudio.audioPath,
              },
            });
          }
        } else {
          // 后端转换成功后
          this.setAudio({
            audioPath: url,
            content: {
              audioFlag: 1,
              syntheticalAudioPath: url,
              uploadAudioPath: uploadAudio.audioPath,
            }
          });
        }
        this.setState({ syntheticalAudioStatus: void 0 });
      // }).then(() => {
      });
    });
  }

  setAudio = (data) => {
    const { setAudio } = this.props;
    if (isFunc(setAudio)) {
      setAudio(data);
    }
  };

  handleClickForTransform = () => {
    this.translateToAudio();
  }
  handleClickForUpload = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const input = document.createElement('input');
    input.onchange = (elm) => {
      const file = elm.target.files[0] || {};
      // console.dir(elm.target);
      console.log('file: ', file);
      if (file.size > 5 * 1024 * 1024) {
        message.warn('请选择小于 5 MB 的文件上传');
        return;
      } if (file.size > 0 && /audio\/(wav|mp3|x-m4a)/.test(file.type)) {
        this.uploadAudio(file);
      } else {
        file.size > 0 && message.warn('请上传 mp3 或 wav 格式的音频文件');
      }
    };
    input.type = 'file';
    input.accept = 'audio/wav,audio/mp3,audio/x-m4a';
    input.click();
  }
  /**
   * 上传手动选择的音频
   * @param file {File} 选择的音频文件
   */
  uploadAudio = (file) => {
    // eslint-disable-next-line no-unused-vars
    const { audio: [synthesizeAudio, uploadAudio] } = this.props;
    // console.log('uploadAudio: ', file);
    /*
    this.setAudio({
      audioPath: void 0,
      content: {
        audioFlag: 3,
        syntheticalAudioPath: synthesizeAudio.audioPath || void 0,
        uploadAudioPath: void 0,
      }
    });
    */
    this.setState({ uploadStatus: 1 }, () => {
      ossApi.uploadFileToAliOSS(file).then(({ url }) => {
        if (!url) {
          message.error('上传失败');
          this.setAudio({
            audioPath: void 0,
            questionContent: {
              audioFlag: synthesizeAudio.audioPath ? 1 : 3,
              syntheticalAudioPath: synthesizeAudio.audioPath,
              uploadAudioPath: void 0,
            },
          });
        } else {
          this.setAudio({
            audioPath: url,
            content: {
              audioFlag: 2,
              syntheticalAudioPath: synthesizeAudio.audioPath,
              uploadAudioPath: url,
            }
          });
        }
        this.setState({ uploadStatus: void 0 });
      // }).then(() => {
      });
    });
  }
  switchAudio = (checked) => {
    const { audio: [synthesizeAudio, uploadAudio] } = this.props;
    if (!checked && synthesizeAudio.audioPath) {
      this.MyAudio && this.MyAudio.pause();
      this.setAudio({
        audioPath: synthesizeAudio.audioPath,
        content: {
          audioFlag: 1,
          syntheticalAudioPath: synthesizeAudio.audioPath,
          uploadAudioPath: uploadAudio.audioPath,
        }
      });
    } else if (checked && uploadAudio.audioPath) {
      this.MyAudio && this.MyAudio.pause();
      this.setAudio({
        audioPath: uploadAudio.audioPath,
        content: {
          audioFlag: 2,
          syntheticalAudioPath: synthesizeAudio.audioPath,
          uploadAudioPath: uploadAudio.audioPath,
        }
      });
    }
  }

  render() {
    const { audioUrl, audio: [synthesizeAudio, uploadAudio], audioFlag } = this.props;
    const { syntheticalStatus, uploadStatus } = this.state;

    const syntheticalAudioStatus = synthesizeAudioStatusEnum[syntheticalStatus || synthesizeAudio.status];
    const uploadAudioStatus = uploadAudioStatusEnum[uploadStatus || uploadAudio.status];
    const optional = syntheticalAudioStatus.optional || uploadAudioStatus.optional;
    const loading = synthesizeAudio.status === 1 || uploadAudio.status === 1;
    return (
      <div style={{ margin: '5px 0 5px 20px' }}>
        <strong style={{ fontSize: 14, marginLeft: 10 }}>音频状态：</strong>
        {syntheticalAudioStatus.label}
        <Button
          size="small"
          type="primary"
          disabled={!syntheticalAudioStatus.operational}
          style={{ margin: '0 5px 0 3px' }}
          onClick={this.handleClickForTransform}>
          {syntheticalAudioStatus.btnLabel}
        </Button>
        {uploadAudioStatus.label}
        <Button
          size="small"
          type="primary"
          disabled={!uploadAudioStatus.operational}
          style={{ margin: '0 5px 0 3px' }}
          onClick={this.handleClickForUpload}>
          {uploadAudioStatus.btnLabel}
        </Button>
        {optional ? <strong style={{ fontSize: 14, marginLeft: 10 }}>选择音频：</strong> : null}
        {optional ? (<Switch
          checkedChildren="上传音频"
          unCheckedChildren="合成音频"
          disabled={loading}
          checked={audioFlag === 2}
          onChange={this.switchAudio}
        />) : null}
        {audioUrl ? (<audio
          controls={!loading}
          style={{ height: '28px', outline: 'none' }}
          ref={(audio) => { this.MyAudio = audio }}
          src={audioUrl}
        />) : null}
      </div>
    );
  }
}