export const isMentality = (typeId) => Number(typeId) === 20;

/**
 * 判断题目是否是准关选择题
 * @param {typeId: number|string} typeId 题目id
 */
export const isMentalityQuestion = (typeId) => Number(typeId) === 47;

export const validateMentality = (list, totalScore, minScore) => {
  // 检验是否是连续分数
  let errorMsg = '';
  list.reduce((pre, next) => {
    if (pre.get('maxScore') !== (next.get('minScore') - 1)) {
      errorMsg = '必须是连续的分数段';
    }
    return next;
  });
  // 覆盖所有分数段
  if (Number(list.getIn([list.count() - 1, 'maxScore'])) !== totalScore || Number(list.getIn([0, 'minScore'])) !== minScore) {
    errorMsg = `分数区间必须覆盖${minScore}~${totalScore}，请确保分数按从低到高排序`;
  }
  // 每一个最大分必须大于最小分
  list.some(item => {
    if (item.get('maxScore') <= item.get('minScore')) {
      errorMsg = '区间的最大分要大于最低分';
      return true;
    }
    return false;
  });
  // 评语必填
  list.every(item => {
    if (!item.get('comment').replace(/^\s+|\s+$/gm, '')) {
      errorMsg = '请填写评语';
      return false;
    }
    return true;
  });
  return errorMsg;
};
