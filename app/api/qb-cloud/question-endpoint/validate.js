import util from './util';
import { Modal } from 'antd';
import { filterHtmlForm } from 'components/CommonFn';

const handleBrforeSubmit = (question) => {
  let newAnswerList = [];
  if (question.children) {
    const { childrenSelect } = question;
    question.children.forEach(child => {
      if (child.subQuestionMemberList && !child.subQuestionItemInputDTOList) {
        // 历史原因，接口输入输出不一致，需要转化
        child.subQuestionItemInputDTOList = child.subQuestionMemberList;
      }
    });
    // 给子题添加知识点 考点
    childrenSelect && childrenSelect.forEach((e, index) => {
      if (e.selectedExamPoint && e.selectedExamPoint.length > 0) {
        question.children[index].examPointIdList = e.selectedExamPoint;
      }
      if (e.selectedKnowledge && e.selectedKnowledge.length > 0) {
        question.children[index].knowledgeIdList = e.selectedKnowledge;
      }
      if (e.selectedMainKnowledge) {
        if (e.selectedMainKnowledge.length > 0) {
          question.children[index].mainKnowledgeId = e.selectedMainKnowledge[0];
        } else {
          question.children[index].mainKnowledgeId = null;
        }
      }
    });
  }
  if (question.answerList && question.answerList instanceof Array) {
    // 处理单选题的情况下，答案有重复的情况，类似于answerList:["B","B"]这种情况
    // newAnswerList = Array.from(new Set(question.answerList));
    const list = [];
    const answerIndexList = [];
    question.answerList.forEach((it, i) => {
      const answerString = filterHtmlForm(it);
      if (!list.includes(answerString)) {
        list.push(answerString);
        answerIndexList.push(i);
      }
    });
    newAnswerList = question.answerList.filter((it, i) => answerIndexList.includes(i));
  }
  if (Number(question.templateType) === 7) {
    // 选词填空随机打乱答案
    const randomOptionList = util.randomArr(question.optionList);
    question.optionList = randomOptionList;
  }
  // 设置总分数
  const score = (question.children && question.children.reduce((pre, next) => pre + next.score, 0)) || question.score || 3;
  question.score = Number(score.toFixed(1));

  return new Promise((resolve, reject) => {
    if (newAnswerList.length > 0 && (newAnswerList.length < question.answerList.length)) {
      const ref = Modal.confirm({
        content: '答案中存在相同项，是否进行过滤后保存？',
        cancelText: '不过滤保存',
        maskClosable: false,
        okText: '过滤后保存',
        okType: 'primary',
        zIndex: 9999,
        onCancel: () => {
          ref.destroy();
          resolve(question);
        },
        onOk: () => {
          question.answerList = newAnswerList;
          ref.destroy();
          resolve(question);
        }
      });
    } else {
      resolve(question);
    }
  });
};
export default {
  handleBrforeSubmit,
};
