import React from 'react';
import { Modal, message } from 'antd';
import TCQuestion from '../questions';
import queryNode from 'api/qb-cloud/sys-dict-end-point';

export default class QuestionModal extends React.Component {
  state = {
    questionTypeList: this.props.questionTypeList || [],
    questionType: this.props.questionType || '1', // 默认 1
  };

  componentDidMount() {
    if (!Array.isArray(this.props.questionTypeList)) {
      this.handleGetQuestionType();
    }
  }

  // 获取题型列表
  handleGetQuestionType = async () => {
    const res = await queryNode.queryTCQusetionType();
    if (`${res.code}` === '0') {
      this.setState({ questionTypeList: res.data });
      if (!this.props.questionType)
        { this.setState({
          questionType: res.data.length > 0 ? res.data[0].id : void 0,
        }); }
    } else {
      message.error(res.message || '获取题型失败');
    }
  };

  // 保存
  handleSave = data => {
    const newData = this.convertData(data);
    this.props.onSave(newData);
  };

  // 转换数据为保存到后端所需要的数据类型
  convertData = data => {
    const { questionType, optionType } = data;
    const newData = {};
    // 题干
    if (data.questionTitle) {
      newData.title = data.questionTitle;
    }
    // 解析
    if (data.analysis) {
      newData.analysis = data.analysis;
    }
    // 答案
    if (data.answer) {
      newData.answerList = [].concat(data.answer);
    }
    // 问题
    if (data.subQuestion) {
      newData.problemElementList = data.subQuestion.map((el, index) => ({
        problemElementType: 1,
        problemElementContent: el,
        problemElementDesc: '',
        problemElementOrder: index + 1,
      }));
    }
    // 材料
    newData.stemElementList = [];
    if (data.materials) {
      newData.stemElementList = newData.stemElementList.concat(
        Array.isArray(data.materials)
          ? data.materials.map((el, index) => ({
            stemBusiType: 'reference',
            stemElementType: 1,
            stemElementContent: el,
            stemElementDesc: '',
            stemElementOrder: index + 1,
          }))
          : [
            {
              stemBusiType: 'reference',
              stemElementType: 1,
              stemElementContent: data.materials,
              stemElementDesc: '',
              stemElementOrder: 1,
            },
          ],
      );
    }

    // 参考答案
    if (data.referenceAnswer) {
      newData.stemElementList = newData.stemElementList.concat(
        Array.isArray(data.referenceAnswer)
          ? data.materials.map((el, index) => ({
            stemBusiType: 'referenceAnswer',
            stemElementType: 1,
            stemElementContent: el,
            stemElementDesc: '',
            stemElementOrder: index + 1,
          }))
          : [
            {
              stemBusiType: 'referenceAnswer',
              stemElementType: 1,
              stemElementContent: data.referenceAnswer,
              stemElementDesc: '',
              stemElementOrder: 1,
            },
          ],
      );
    }
    // 选项
    if (data.options) {
      newData.optionElementList = data.options.map((el, index) => ({
        optionElementType: optionType === 'text' ? 2 : 3,
        optionElementContent: el,
        optionElementDesc: '',
        optionElementOrder: index + 1,
      }));
    }
    // 题型
    newData.typeId = questionType;
    return newData;
  };

  // 把题目数据转换为录题组件需要的数据
  getDataByProps = () => {
    const { data } = this.props;
    if (!data) return {};

    const questionTitle = data.title; // 题干
    const questionType = data.typeId || 1; // 题型
    const answer = data.answerList ? data.answerList[0] : void 0; // 答案
    const referenceAnswer = data.referenceAnswer && data.referenceAnswer.content; // 参考答案
    const materials = data.reference && data.reference.content; // 材料
    const analysis = data.analysis; // 解析
    const optionType = // 选项类型
      data.optionElementList &&
      data.optionElementList.length > 0 &&
      data.optionElementList[0].optionElementType === 3
        ? 'image'
        : 'text';
    // 选项
    const tempOptions = data.optionElementList
        ? data.optionElementList.map(el => el.optionElementContent)
        : [];
    const options = tempOptions.length === 0 ? void 0 : tempOptions;
    // 问题
    const tempSubQuestion = data.problemElementList
      ? data.problemElementList.map(el => el.problemElementContent)
      : [];
    const subQuestion = tempSubQuestion.length === 0 ? void 0 : tempSubQuestion;

    return {
      questionTitle,
      questionType,
      answer,
      referenceAnswer,
      materials,
      analysis,
      optionType,
      options,
      subQuestion,
    };
  };

  render() {
    const {
      visible = true,
      title = '新增题目',
      onCancel,
      loading,
      okText,
      selectDisabled,
    } = this.props;
    const { questionTypeList } = this.state;
    const data = this.getDataByProps();
    return (
      <div>
        {visible && (
          <Modal
            visible
            zIndex={800}
            width={1100}
            bodyStyle={{ height: 600, padding: 0, position: 'relative' }}
            title={title}
            onCancel={onCancel}
            footer={null}
          >
            <TCQuestion
              questionTypeList={questionTypeList}
              onCancel={onCancel}
              onSave={this.handleSave}
              loading={loading}
              okText={okText}
              selectDisabled={selectDisabled}
              {...data}
            />
          </Modal>
        )}
      </div>
    );
  }
}
