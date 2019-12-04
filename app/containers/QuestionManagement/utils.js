import { fromJS, Set } from 'immutable';
import _, { toString, toNumber } from 'lodash';
import {
  isMentalityQuestion,
} from './MentalityEdit/utils';
import { AppLocalStorage } from 'utils/localStorage';

// 格式化选做题类型和分组
const formatQuestion = (question) => {
  const answerRule = question.get('answerRule') || 1;
  const chooseGroup = answerRule > 1 ? question.get('chooseGroup') : null;
  return question.set('answerRule', answerRule).set('chooseGroup', chooseGroup);
};

const formatScoreIfMentality = (it) => {
  let newIt = it;
  if (isMentalityQuestion(it.get('typeId')) && !it.get('scoreList')) {
    const optionCount = it.get('optionList') ? it.get('optionList').count() : 0;
    newIt = it.set('scoreList', fromJS(new Array(optionCount).fill('')).map((ee, index) => index));
    newIt = newIt.set('score', newIt.get('scoreList').max());
  }
  return newIt;
};

// 根据 typeId 分组
const sortQuestionByTypeId = (questions) => {
  return questions.sortBy(question => question.get('typeId'));
};

// 初始化选做题和分组情况，针对存在分组序号断档，并非从 1开始的自然数循序开始的处理。
export const initChooseGroup = (questions) => {
  let newQuestions = questions;
  const chooseGroupList = newQuestions.filter((question) => question.get('chooseGroup') > 0).map((question) => question.get('chooseGroup'));
  const chooseGroupPureList = Array.from(new Set(chooseGroupList).sort());
  if (!chooseGroupPureList.every((groupNumber, i) => groupNumber === (i + 1))) {
    const groupObj = {};
    chooseGroupPureList.forEach((groupNumber, i) => {
      groupObj[groupNumber] = i + 1;
    });
    newQuestions = newQuestions.map((question) => {
      const chooseGroup = question.get('chooseGroup');
      if (groupObj[chooseGroup]) {
        return question.set('chooseGroup', groupObj[chooseGroup]);
      }
      return question;
    });
  }
  return newQuestions;
};

// 设置主观选择题分数，同时进行根据题型排序操作
// 高考真题不排序，因为要全部放到一个大题中让教研手动排序 2019-06-06（昨晚才来的要求，前后端家产品商量最终的临时方案）
export const setScoreIfMentality = (questions, sort, isCollegeExamPaper) => {
  // 先处理主管选择题
  let newQuestions = questions.map(it => formatQuestion(formatScoreIfMentality(it)));

  // 排序处理
  if (sort && !isCollegeExamPaper) {
    newQuestions = sortQuestionByTypeId(newQuestions);
  }

  return initChooseGroup(newQuestions);
};


export const addQuestion = (questions, newIt) => {
  // const questionTypeIdLastIndex = questions.findLastIndex((it) => it.get('typeId') === newIt.get('typeId'));
  // if (questionTypeIdLastIndex >= 0) {
  //   return questions.insert(questionTypeIdLastIndex + 1, newIt);
  // }
  // return questions.push(newIt);
  let paperData = AppLocalStorage.getPaperData();
  let list = questions.toJS();
  let newQuestion = newIt.toJS();
  if (paperData.firstEnterEdit || paperData.paperContent) {
    // 已有试卷数据的情况,无需自动归集, 全塞最后一大题
    if (list.length > 0) {
      list[list.length - 1].examPaperContentQuestionOutputDTOList.push(newQuestion);
    } else {
      list.push({
        name: newQuestion.questionType,
        examPaperContentQuestionOutputDTOList: [newQuestion]
      });
    }
  } else {
    // 需自动归集的情况
    let bigIndex = _.findIndex(list, item => item.name === newQuestion.questionType);
    if (bigIndex > -1) {
      list[bigIndex].examPaperContentQuestionOutputDTOList.push(newQuestion);
    } else {
      list.push({
        name: newQuestion.questionType,
        examPaperContentQuestionOutputDTOList: [newQuestion]
      });
    }
  }
  return fromJS(list);
  // list.
};

// 获取试卷结构数据
// export const getPaperContentListByQuestions = (questions, isCollegeExamPaper) => {
//   let res = questions.map((question, index) => {
//     return question.merge(fromJS({
//       serialNumber: index + 1,
//       answerRule: question.get('answerRule') || 1,
//       chooseGroup: question.get('answerRule') > 1 ? question.get('chooseGroup') : null,
//     }));
//   });
//   if (isCollegeExamPaper) {
//     res = fromJS([]).push(fromJS({
//       name: '高考真题卷',
//       serialNumber: 1,
//     }).set('entryExamPaperQuesInputDTOList', questions));
//   } else {
//     res = res.groupBy((question) => question.get('questionType')).entrySeq().map(([key, item], index) => {
//       return fromJS({
//         name: key,
//         serialNumber: index + 1,
//       }).set('entryExamPaperQuesInputDTOList', item);
//     });
//   }
//   return res;
// };
export const getPaperContentListByQuestions = (questions) => {
  let list = questions.toJS();
  let questionIndex = 1;
  list.forEach((big) => {
    big.entryExamPaperQuesInputDTOList = big.examPaperContentQuestionOutputDTOList || big.entryExamPaperQuesInputDTOList;
    delete big.examPaperContentQuestionOutputDTOList;
    big.entryExamPaperQuesInputDTOList.forEach((small, index) => {
      Object.assign(small, {
        serialNumber: index + 1,
        questionIndex: questionIndex,
        answerRule: small.answerRule || 1,
        chooseGroup: small.answerRule > 1 ? small.chooseGroup : null,
      });
      questionIndex += 1;
    });
  });
  return fromJS(list);
};
// 获取题目中选做题分组信息
export const getGroupList = (originQuestionList, ruleList) => {
  let questionList = flatQuestionData(originQuestionList);
  let res = fromJS([]);
  if (ruleList.count() <= 0) return res;
  try {
    res = questionList.map((question, index) => fromJS({
      questionIndex: index + 1,
      answerRule: question.get('answerRule') || 1,
      chooseGroup: question.get('chooseGroup') || null,
      score: question.get('score')
    })).sortBy(item => item.get('chooseGroup'))
      .groupBy((item) => item.get('chooseGroup'))
      .entrySeq()
      .filter(([key, item]) => key > 0)
      .map(([key, item]) => {
        const answerRule = toString(item.getIn([0, 'answerRule']));
        const targetRule = ruleList.find((rule) => rule.get('itemCode') === answerRule);
        return fromJS({
          name: targetRule.get('itemName'),
          groupIndex: item.getIn([0, 'chooseGroup']),
          extra: toNumber(targetRule.get('extra')),
          orderNum: toNumber(targetRule.get('orderNum')),
          id: targetRule.get('itemCode'),
        }).set('list', item.map(it => toString(it.get('questionIndex')))).set('scores', item.map(it => it.get('score')));
      });
  } catch (err) {
    console.log('getGroupList - err：', err);
  }
  return res;
};
export const flatQuestionData = (list) => {
  let questionList = [];
  list.toJS().forEach(item => {
    let smallList = item.examPaperContentQuestionOutputDTOList;
    if (smallList) {
      questionList.push(...smallList);
    }
  });
  questionList = fromJS(questionList);
  return questionList;
};
// 获取题目总分(根据题目，根据分组调整分数)
export const getScoreSumByQuestionListWithChooseGroup = (questions, groupJSList) => {
  let newQuestions = questions;
  groupJSList.map((group, index) => {
    group.list.map((questionIndex, i) => {
      if (i >= group.orderNum) {
        newQuestions = newQuestions.setIn([questionIndex - 1, 'scoreFlag'], true);
      }
      return questionIndex;
    });
    return group;
  });
  return newQuestions.filter(question => !question.get('scoreFlag')).reduce((sum, item) => sum + parseFloat(item.get('score')), 0);
};

export const verifyOverlapping = (questions, data) => {
  const { questionIndexList, selectedType, groupIndex } = data;
  let errorMsg = '';
  let verify = true;
  questions.map((question, index) => {
    console.log(
      '当前chooseGroup: ', question.get('chooseGroup'),
      ', 设置chooseGroup: ', groupIndex,
      ', 当前answerRule', question.get('answerRule'),
      ', 设置answerRule', selectedType,
      ', 当前题号', index + 1,
      ', 设置题号', questionIndexList.toString(),
      ', 题目分数：', question.get('score'),
      ', 题目id：', question.get('id'),
    );
    if ((question.get('chooseGroup') > 0 && question.get('chooseGroup') !== groupIndex) && (questionIndexList.includes(index + 1))) {
      verify = false;
      errorMsg = '选择的题目与其他分组重合';
    }
    return question;
  });
  return {
    pass: verify,
    errorMsg,
  };
};

// 校验分组设置
export const verifyChooseGroup = (questions, ruleList, verifyConfig = {}) => {
  const initVerifyConfig = Object({
    socre: true,
    count: true,
  }, verifyConfig);
  // 获取分组的数据，进行校验
  const groupList = questions.map((question) => fromJS({
    answerRule: question.get('answerRule') || 1,
    chooseGroup: question.get('chooseGroup') || null,
    score: question.get('score'),
  })).sortBy((item) => item.get('chooseGroup')).groupBy((item) => item.get('chooseGroup')).entrySeq();


  let errorMsg = '';
  const verify = groupList.every(([key, item], index) => {
    // key 为 chooseGroup 的值，分组只有大于零的需要校验
    if (key > 0) {
      const groupIndex = item.getIn([0, 'chooseGroup']);
      // 校验同组中分数是否一样
      const verifyScore = new Set(item.map((it) => it.get('score')).toJS()).size === 1;
      if (initVerifyConfig.socre && !verifyScore) {
        errorMsg = `第${groupIndex}组的分数设置不一致`;
        return false;
      }
      // 分组中题目数量是否符合选做类型的题目数量设置
      const useRule = ruleList.find(rule => toNumber(rule.get('itemCode')) === toNumber(item.getIn([0, 'answerRule'])));
      const listCount = toNumber(useRule.get('extra'));
      const verifyGroup = item.count() === listCount;
      if (initVerifyConfig.count && !verifyGroup) {
        errorMsg = `第${groupIndex}组题目设置数量不对`;
        return false;
      }
    }
    return true;
  });
  return {
    pass: verify,
    errorMsg,
  };
};
// 算总分和总数
export const calculateSum = (list, smallKey, groupJSList) => {
  console.log(list.toJS(), smallKey);
  let count = 0;
  let score = 0;
  let questions = flatQuestionData(list);
  score = getScoreSumByQuestionListWithChooseGroup(questions, groupJSList, smallKey);
  score = score.toFixed(1);
  count = questions.count();
  return { count, score };
};
export const isCollegeExamPaper = (typeId) => toNumber(typeId) === 11;
// 判断是否有空的大题
export const emptyBig = (list) => {
  let flag = false;
  for (let i = 0; i < list.length; i++) {
    if (list[i].entryExamPaperQuesInputDTOList.length === 0) {
      flag = true;
      break;
    }
  }
  return flag;
};

// 给原始question数据加index
export const addQuestionIndex = (questions) => {
  let list = questions.toJS();
  let questionIndex = 1;
  let renderList = [];
  list.forEach((big) => {
    let renderSmallList = [];
    big.examPaperContentQuestionOutputDTOList.forEach((small, index) => {
      if (small.templateType === 1 && small.children && small.children.length > 0 && !small.children.some(item => item.epScore || item.epScore === 0)) {
        // 如果是复合题要检验子题的epScore是否存在，如果不存在给个默认值（score字段）
        let cloneSmallChildren = _.cloneDeep(small.children);
        let sum = 0;
        small.children.forEach(item => {
          item.epScore = item.score;
          sum += Number(item.epScore);
        });
        if (sum.toFixed(1) !== Number(small.score).toFixed(1)) {
          small.children = cloneSmallChildren;
        }
      }
      Object.assign(small, {
        questionIndex: questionIndex,
      });
      questionIndex += 1;
      renderSmallList.push(Object.assign({}, small, {
        serialNumber: index + 1,
        questionIndex: questionIndex,
        answerRule: small.answerRule || 1,
        chooseGroup: small.answerRule > 1 ? small.chooseGroup : null,
      }));
    });
    renderList.push(Object.assign({}, big, {
      entryExamPaperQuesInputDTOList: renderSmallList,
      examPaperContentQuestionOutputDTOList: null
    }));
  });
  return {
    originList: fromJS(list),
    renderList: fromJS(renderList)
  };
};

// 查哪题下面子题分数未设置
export const verifyChildQuestionScore = (list) => {
  let flatList = flatQuestionData(list);
  flatList = flatList.toJS();
  let arr = flatList.filter(item => {
    if (item.templateType === 1 && item.children && item.children.length > 0) {
      let flag = item.children.some(it => it.epScore === null);
      return flag;
    }
    return false;
  });
  arr = arr.map(item => item.questionIndex);
  return arr;
};

// 查选做题是否有分数不等的
export const verifyGroupScore = (groupList) => {
  let groupIndex = [];
  groupList.forEach((item, index) => {
    let scores = item.get('scores');
    if (scores.count() > 1) {
      let cache = scores[0];
      for (let i = 0; i < scores.count(); i++) {
        if (i > 0 && scores.get(i) !== cache) {
          groupIndex.push(index + 1);
          break;
        }
        cache = scores.get(i);
      }
    }
  });
  return groupIndex;
};

// 处理在试题篮编辑了复合题后更新题目数据
export const combineComplexQuestion = (origin, update) => {
  if (origin.templateType === 1) {
    let children = origin.children;
    update.children.forEach(item => {
      children.forEach(it => {
        if (item.id === it.id && (it.epScore || it.epScore === 0)) {
          item.epScore = it.epScore;
        }
      });
    });
    update.score = origin.score;
  }
  return update;
};
