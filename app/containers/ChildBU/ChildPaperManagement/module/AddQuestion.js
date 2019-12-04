/** 单题录入的组件， EditItemQuestion 中对 url 做了判断，含有 childBU 的 url 都不显示模板 */

import React from 'react';
import { fromJS } from 'immutable';
import { message, Modal } from 'antd';
import EditItemQuestion from 'components/EditItemQuestion';
import QuestionTag from 'components/QuestionTag';
import questionApi from 'api/qb-cloud/question-endpoint';
import {
  validateClassifyAndMatch,
  validateSavedQuestion,
} from 'components/EditItemQuestion/common';

class AddQuestion extends React.Component {
  state = {
    showQuestionTag: false, // 是否显示题目标签
    showItemQuestion: true, // 是否显示录入题目
    newQuestion: fromJS({}), // 题目数据
    visible: true, // 是否显示题目标签，添加这个是为了点击上一步的时候缓存数据
  }

  setNewQuestionData = (data) => {
    this.setState({
      newQuestion: data,
    });
  }

  changeQuestionEditState = () => {
    this.closeOrOpenItemQuestion(false);
    this.setState({
      newQuestion: fromJS({}),
      curTagQ: fromJS({}),
    });
  }

  // 开关新增题目面板
  closeOrOpenItemQuestion = (isOpen) => {
    this.setState({
      showItemQuestion: isOpen,
    });
    // 关闭的时候把弹窗恢复默认状态
    if (!isOpen) {
      this.setState({
        visible: true,
        showQuestionTag: false,
      });
      const { onClose } = this.props;
      if (typeof onClose === 'function') onClose();
    }
  }

  // 同步输入内容
  setClickTargetAction = (str) => {
    this.setState({
      clickTarget: str,
    });
  }

  editQuestionSubmit = (type) => {
    const { newQuestion } = this.state;
    if ([5, 6].includes(newQuestion.get('templateType'))) {
      const response = validateClassifyAndMatch(newQuestion);
      if (response.errorMsg) {
        message.warning(response.errorMsg || '录入有误，请检查');
        return false;
      } else {
        this.setState({
          curTagQ: response.data
        });
      }
    } else {
      const errorMsg = validateSavedQuestion(newQuestion);
      if (errorMsg === '题目未设置音频') {  // 如果一个音频都没有设置的话
        const ref = Modal.confirm({
          title: '提示',
          content: '题目未设置音频',
          okText: '确定',
          cancelText: '取消',
          zIndex: 1001,
          onCancel: () => {
            ref.destroy();
            this.setState({
              curTagQ: newQuestion,
              showQuestionTag: true,
              visible: true,
            });
          },
          onOk: () => {
            ref.destroy();
            this.setState({
              curTagQ: newQuestion,
              showQuestionTag: true,
              visible: true,
            });
          },
        });
        return;
      } else if (errorMsg) {
        message.error(errorMsg);
        return false;
      }
      this.setState({
        curTagQ: newQuestion,
      });
    }
    if (!(type === 'view')) {
      // this.openOrCloseTagWindow(true);
      this.setState({
        visible: true,
        showQuestionTag: true,
      });
    }
    return true;
  }

  openOrCloseTagWindow = (bool) => {
    this.setState({
      showQuestionTag: bool,
    });
  }

  // 单题录入弹框
  makeEditOrAddQuestion = () => {
    const { questionTypeList } = this.props;
    const { clickTarget, newQuestion, questionEditState } = this.state;
    return (
      <EditItemQuestion
        isOpen
        questionTypeList={questionTypeList}
        curTagQ={this.state.curTagQ}
        questionEditState={questionEditState || 0}
        newQuestion={newQuestion}
        clickTarget={clickTarget}
        setNewQuestionData={this.setNewQuestionData}
        changeQuestionEditState={this.changeQuestionEditState}
        setClickTarget={this.setClickTargetAction}
        soucre="questionPicker"
        source2="questionManagement"
        submitQuestionItem={this.editQuestionSubmit}
      />
    );
  }

  // 展示标签
  makeEditQuestionTag = () => {
    const { curTagQ, isCacheWhenClose, visible } = this.state;
    return (
      <QuestionTag
        question={curTagQ.toJS()}
        visible={visible}
        cancelText={isCacheWhenClose ? '上一步' : '取消'}
        close={() => {
          if (isCacheWhenClose) {
            this.setState({
              visible: false,
            });
            this.closeOrOpenItemQuestion(true);
          } else {
            this.setState({
              showQuestionTag: false,
            });
          }
        }}
        submitTags={tags => {
          this.submitSingleQuestion(tags);
        }}
      />
    );
  }

  async submitSingleQuestion(tags) {
    const { curTagQ } = this.state;
    const tagData = curTagQ.toJS();
    const data = await questionApi.saveQuestion(Object.assign(tagData, tags));
    if (data && Number(data.code) === 0) {
      message.success(data.message || '保存成功');
      this.setState({
        showQuestionTag: false,
        showItemQuestion: false,
        newQuestion: fromJS({}),
      }, () => {
        const { onClose, addNew } = this.props;
        if (typeof addNew === 'function') addNew(data.data);
        if (typeof onClose === 'function') onClose();
      });
    } else {
      message.error((data && data.message) || '保存出错');
    }
    this.setState({ clickTarget: '' });
  }

  render() {
    const { showItemQuestion, showQuestionTag } = this.state;
    return (
      <div>
        {showItemQuestion ? this.makeEditOrAddQuestion() : ''}
        {showQuestionTag ? this.makeEditQuestionTag() : ''}
      </div>
    );
  }
}

export default AddQuestion;
