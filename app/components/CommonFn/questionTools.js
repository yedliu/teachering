import { Map, fromJS } from 'immutable';
/**
 * 题目数据格式化
 * @param {Map|{}} question 需要格式化的题目数据
 * @returns {Map} newQuestion
 */
export const fomatQuestion = (question) => {
  const isMap = Map.isMap(question);
  let newQuestion = question;
  if (isMap) {
    const isComplex = question.get('templateType') === 1;
    if (isComplex) {
      const children = (question.get('children') || fromJS([])).map((it) => it.merge(fromJS({
        score: Math.floor(it.get('score')) || 3,
      })));
      const score = children.map((it) => it.get('score')).unshift(0).reduce((a, b) => a + b);
      // 组成新的题目数据
      newQuestion = question.merge(fromJS(({
        score,
      })).set('children', children));
    } else {
      newQuestion = question.merge(fromJS({
        score: Math.floor(question.get('score')) || 3,
      }));
    }
  } else {
    const isComplex = question.templateType === 1;
    if (isComplex) {
      const children = (question.children || []).map((it) => ({
        ...it,
        score: Math.floor(it.score) || 3,
      }));
      const score = children.map((it) => it.score).unshift(0).reduce((a, b) => a + b);
      // 组成新的题目数据
      newQuestion = ({
        ...question,
        children,
        score,
      });
    } else {
      newQuestion = ({
        ...question,
        score: Math.floor(question.score) || 3,
      });
    }
  }
  return newQuestion;
};
