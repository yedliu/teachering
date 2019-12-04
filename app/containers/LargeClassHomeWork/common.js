import { toNumber } from 'components/CommonFn';
import { fromJS } from 'immutable';

export const backDefaultKnowledge = (data) => {
  // console.log(data, 'backDefaultKnowledge');
  const defaultSelect = data[0];
  const children = defaultSelect.children;
  if (!children || children.length <= 0) {
    return defaultSelect;
  }
  return backDefaultKnowledge(children);
};
export const backPath = (data, resList = []) => {
  const res = resList;
  const defaultSelect = data[0];
  res.push(defaultSelect.id);
  const children = defaultSelect.children;
  if (!children || children.length <= 0) {
    return res;
  }
  return res.concat(backPath(children));
};
export const pathFinish = (data) => {
  let res = data;
  if (data.length < 4) {
    res.push(-1);
    res = pathFinish(res);
  }
  return res;
};
export const backPathArr = (data, resArr = []) => {
  let res = resArr;
  if (!data || data.length <= 0) return res;
  const item = data[0];
  // console.log(item, 'item');
  res.push(item.id);
  const itemChildren = item.children;
  if (itemChildren && itemChildren.length > 0) {
    res = backPathArr(itemChildren, res);
  }
  return res;
};
export const getTreePath = (dataList, pos, backRes = []) => {
  // console.log(dataList.toJS(), pos, backRes, 'getTreePath');
  let res = backRes;
  const item = dataList.get(toNumber(pos[0]));
  if (!item) return;
  res.push(item.get('id'));
  const child = item.get('children');
  if (!child || child.length <= 0) {
    return res;
  }
  pos.shift();
  if (pos.length > 0) {
    res = getTreePath(child, pos, res);
  }
  // console.log(res, 'getTreePath -- res');
  return res;
};

// 校验标准作业的题目内容是否可以提交
export const verifyStandHomeworkParams = (list) => {
  const errList = [];
  list.map((item, index) => {
    const templateType = item.get('templateType');
    const score = item.get('score') || 0;
    const answerList = item.get('answerList') || fromJS([]);
    if (templateType === 1) {
      const children = item.get('children') || fromJS([]);
      const allScore = children.map((it) => it.get('score') || 0).reduce((a, b) => a + b);
      if (children.count() <= 0) errList.push({ index, type: 'noChildren', value: '题目中存在内容缺失', msg: '点击纠错即可反馈纠错本题' });
      if (score !== allScore || allScore === 0) errList.push({ index, type: 'AllScoreError', value: '分数设置不对', msg: '点击纠错即可反馈纠错本题' });
      const childAnswerAllGet = children.every((it) => {
        return (it.get('answerList') || fromJS([])).map((itt) => itt).count() > 0;
      });
      if (!childAnswerAllGet) errList.push({ index, type: 'noChildrenAnswer', value: '题目中存在内容缺失', msg: '点击纠错即可反馈纠错本题' });
    } else if (templateType === 2) {
      const optionList = item.get('optionList') || fromJS([]);
      if (optionList.count() <= 0) errList.push({ index, type: 'noOption', value: '题目中存在内容缺失', msg: '点击纠错即可反馈纠错本题' });
    }
    // if ([2, 3, 4].includes(templateType)) {
    //   const analysis = item.get('analysis');
    //   if (!analysis) errList.push({ index, type: 'noAnalysis', value: '题目中存在内容缺失', msg: '点击纠错即可反馈纠错本题' });
    // }
    if (score <= 0) errList.push({ index, type: 'noScore', value: '题目分数未设置', msg: '点击纠错即可反馈纠错本题' });
    if ([2, 3, 4].includes(templateType) && answerList.count() <= 0) {
      errList.push({ index, type: 'noAnswer', value: '题目中存在内容缺失', msg: '点击纠错即可反馈纠错本题' });
    }
  });
  return errList;
};

// 校验生成作业的参数是否齐全了
export const VerifyAIHomeworkParams = (params) => {
  let res = true;
  if (params.get('AIknowledgeList').count() <= 0) res = false;
  if (!params.get('homeworkName')) res = false;
  const selectQuestionTypeList = params.get('questionTypeList').filter((item) => item.get('isActive'));
  if (selectQuestionTypeList.count() <= 0) res = false;
  return res;
};
// 难度
export const difficultyList = ['基础', '中档', '困难'];
export const homeworkDiffList = fromJS([{ id: 1, name: '基础' }, { id: 2, name: '中档' }, { id: 3, name: '困难' }]);
export const sceneList = fromJS([{id: '1',name: '同步作业'},{id: '2',name: '阶段测评'}])
// 智能作业返回实际难度数组
export const getDifficultyList = (difficulty) => {
  let res = [];
  const difficultyId = toNumber(difficulty);
  if (difficultyId === 1) res = [1, 2];
  if (difficultyId === 2) res = [3];
  if (difficultyId === 3) res = [4, 5];
  return res;
};
// 格式化答案
export const formatAnswerList = (list, isChoice) => {
  let res = '';
  if (isChoice) {
    res = list.join('') || '';
  } else {
    res = list.length > 1 ? (list.map((answer, i) => answer.replace('<p>', `<p>${i + 1}、`)).join('') || '') : list[0];
  }
  return res;
};
