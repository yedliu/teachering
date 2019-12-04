import _ from 'lodash';

// 数组随机打乱
const randomArr = (arr) => {
  if (!_.isArray(arr) || arr.length <= 0) return [];
  if (arr.length <= 1) {
    return arr;
  }
  const index = Math.floor(Math.random() * arr.length);
  const resArr = arr.splice(index, 1);
  return resArr.concat(randomArr(arr));
};

/**
 * 判断少儿题型选项中是否需要音频
 * @param {number} typeId 题型 Id
 */
const childQuestionAudioVerify = (typeId) => {
  // 少儿提醒中目前就 单选、多选、判断 有选项，其他都没有选项需要语音情况
  return ![1, 2, 6].includes(parseInt(typeId, 10));
};

/**
 * 对返回的题目数据处理，如果是有音频则进行更改字段名，因为保存和获取到的字段名不一致（修改和新增是同一个接口的原因导致）
 * @param {Question} question 题目数据
 */
const formatAudioInfo = (question) => {
  if (question.questionContentInfo) {
    question.questionContent = question.questionContentInfo;
    if (question.questionOptionOutList && question.questionOptionOutList.length > 0) {
      question.questionOptionList = question.questionOptionOutList;
    } else if (question.optionList && question.optionList.length > 0) {
      const questionOptionOutList = question.questionOptionOutList || [];
      question.questionOptionList = question.optionList.map((item, index) => {
        return Object.assign({
          audioFlag: 3,
          questionOption: item,
          audioPath: null,
          uploadAudioPath: null,
        }, questionOptionOutList[index] || {});
      });
    }
    if (childQuestionAudioVerify(question.typeId)) {
      delete question.questionOptionList;
    }
  }
  return question;
};

export default {
  randomArr,
  formatAudioInfo,
  childQuestionAudioVerify,
};