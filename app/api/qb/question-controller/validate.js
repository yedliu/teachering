import util from './util';

const handleBrforeSubmit = (question) => {
  const { children, childrenSelect } = question;
  if (children) {
    children.map(child => {
      if (child.subQuestionMemberList && !child.subQuestionItemInputDTOList) {
        // 历史原因，接口输入输出不一致，需要转化
        child.subQuestionItemInputDTOList = child.subQuestionMemberList;
      }
    });
  }
  // 给子题添加知识点 考点
  childrenSelect && childrenSelect.forEach((e, index) => {
    if (e.selectedExamPoint && e.selectedExamPoint.length > 0) {
      question.children[index].examPointIdList = e.selectedExamPoint;
    }
    if (e.selectedKnowledge && e.selectedKnowledge.length > 0) {
      question.children[index].knowledgeIdList = e.selectedKnowledge;
    }
  });
  if (Number(question.templateType) === 7) {
    // 选词填空随机打乱答案
    const randomOptionList = util.randomArr(question.optionList);
    question.optionList = randomOptionList;
  }
  // 设置总分数
  question.score = (question.children && question.children.reduce((pre, next) => pre + next.score, 0)) || question.score || 3;
  return question;
};

export default {
  handleBrforeSubmit,
};