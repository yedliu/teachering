import React from 'react';
import { Modal, message, Spin } from 'antd';
import { connect } from 'react-redux';
import { togglePaperPreview } from '../redux/action';
import Config from 'utils/config';

class PreviewPaper extends React.Component {
  state = {
    loading: true
  }
  componentDidMount() {
    window.addEventListener('message', this.messageHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.messageHandler);
  }

  messageHandler = ({ data }) => {
    const { action } = data;

    switch (action) {
      case 'ready': // 加载完毕，可以发送数据
        this.sendPaperData();
        break;
      case 'back': // 点击了关闭按钮
        this.props.onClose();
        break;
      default:
        console.warn('未知 action');
        break;
    }
  };

  // 向 iframe 发送消息
  sendMessage = (action, data) => {
    this.previewModal.contentWindow.postMessage({ action, data }, '*');
  };

  // 发送试卷信息
  sendPaperData = () => {
    const paperData = this.getPaperData();
    this.sendMessage('testPreview', paperData);
    this.setState({ loading: false });
  }

  // 处理试卷数据
  getPaperData = () => {
    const { paperData, paperParams } = this.props;
    const showQuestionType = [1, 2, 6, 7, 35, 36, 37, 51]; // 支持展示的题型
    const _questionList = [];
    paperData.forEach(element => {
      const questions = element.examPaperContentQuestionList
        ? element.examPaperContentQuestionList.map(item => item.questionOutputDto)
        : [];
      _questionList.push(...questions);
    });
    // 过滤不支持的题型
    const questionList = _questionList.filter(question => showQuestionType.includes(question.typeId));
    if (_questionList.length !== questionList.length) {
      message.warning('试卷中存在不支持的题型，已进行过滤处理');
    }

    const suggestTime = 40; // 后端默认是 40 分钟
    const name = paperParams.name || '-';
    return { name, suggestTime, questionList };
  }

  render() {
    return (
      <Modal visible onClose={this.props.onClose} width="1200" footer={null} closable={false}>
        <Spin spinning={this.state.loading}>
          <iframe
            ref={el => {
              this.previewModal = el;
            }}
            width="1160"
            height="600"
            frameBorder="0"
            src={`${Config.childH5}/#/preview/multiple`}
          />
        </Spin>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  const subState = state.get('childPaperManagement');
  return {
    paperData: subState.get('paperData').toJS(),
    paperParams: subState.get('paperParams').toJS(),
  };
};

const mapDispatchToProps = dispatch => ({
  onClose: () => {
    dispatch(togglePaperPreview(false));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PreviewPaper);
