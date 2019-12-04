/**
 * 算分数
 * @param bigList 大题列表
 * @returns {{score: string, num: number}}
 */
export const countScore = (bigList = []) => {
  let score = 0;
  let num = 0;
  if (bigList.length > 0) {
    bigList.forEach(item => {
      let smallList = item.examPaperContentQuestionList;
      if (smallList && smallList.length > 0) {
        smallList.forEach(item1 => {
          score += item1.score;
          num += 1;
        });
      }
    });
  }
  return {
    score: score.toFixed(1),
    num
  };
};
/**
 * 根据key查找对应的label
 * @param dict
 * @param key
 * @param code
 * @returns {string}
 */
export const findLabel = (dict = [], key, code) => {
  let label = '';
  dict.forEach(item => {
    if (item.key === key) {
      item.data.forEach(item => {
        if (item.itemCode === code) {
          label = item.itemName;
        }
      }
      );
    }
  });
  return label;
};
