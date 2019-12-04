import React from 'react';
import { Modal, Spin } from 'antd';
import Config from 'utils/config';

export default class PreviewChildQuestion extends React.Component {
  state = {
    loading: true,
  };
  componentDidMount() {
    window.addEventListener('message', this.messageHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.messageHandler);
  }

  messageHandler = ({ data }) => {
    const { action } = data;
    switch (action) {
      case 'ready':
        this.sendQuestionData();
        break;
      case 'back':
        this.props.onClose();
        break;
      default:
        console.warn('未知 action');
        break;
    }
  };

  sendMessage = (action, data) => {
    this.previewModal.contentWindow.postMessage({ action, data }, '*');
  };

  // 发送题目数据
  sendQuestionData = () => {
    const { data, questionTypeList } = this.props;
    const templateList = [5, 6, 7]; // 互动题型模板
    const answerList = []; // 连线题需要答案
    const typeId = data.typeId;

    // 少儿 根据题型的名称判断题型
    let questionType = '';
    questionTypeList.some(el => {
      if (String(el.get('itemCode')) === String(typeId)) {
        questionType = el.get('itemName');
        return true;
      }
      return false;
    });
    data.questionType = questionType;
    if (!Array.isArray(data.answerList) || data.answerList.length === 0) {
      data.answerList = ['A'];
    }

    // 互动题型的数据需要处理一下
    if (data.children && templateList.includes(data.templateType)) {
      const count = data.children.length || 0;
      const newChildren = data.children.map((el, i) => {
        const answer = {};
        el.id = Number('1' + i);
        answer.id = el.id;
        answer.items = [];
        el.questionId = Number('1' + i);
        // 字段名称不一致
        el.subQuestionMemberList = el.members.map((item, index) => {
          item.showOrder = index === 0 ? i : count - i; // 展示的顺序
          item.id = Number('1' + i + index);
          answer.items.push(item.id);
          return item;
        });
        el.members = void 0;
        answerList.push(JSON.stringify(answer));
        return el;
      });
      data.children = newChildren;
      data.answerList = answerList;
    }
    if (data.layoutStyle) {
      data.layoutStyle = Number(data.layoutStyle);
    }

    this.sendMessage('questionPreview', data);
    this.setState({ loading: false });
  };

  render() {
    return (
      <Modal
        visible
        onClose={this.props.onClose}
        width="1200"
        footer={null}
        closable={false}
      >
        <Spin spinning={this.state.loading}>
          <iframe
            ref={el => {
              this.previewModal = el;
            }}
            width="1160"
            height="600"
            frameBorder="0"
            src={`${Config.childH5}/#/preview/single`}
          />
        </Spin>
      </Modal>
    );
  }
}
