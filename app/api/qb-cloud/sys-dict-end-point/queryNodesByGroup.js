import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';
import cacheData from './cache';
import { toNumber } from 'components/CommonFn';

// 请求数据字典(单个查询)
const queryNodesByGroup = async (type) => {
  const cacheTypeData = cacheData[type] || {};
  const nowTime = new Date().getTime();
  if (nowTime - cacheTypeData.fetchTime < cacheData.cacheTime) {
    return cacheTypeData;
  }
  const reqUrl = `${Config.zmcqLink}/api/sysDict/queryNodesByGroup`;
  const repos = request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: type }));
  return repos.then((res) => {
    const dataList = res.data || [];
    if (Number(res.code) === 0 && dataList.length > 0) {
      const data = Object.assign({}, res, {
        fetchTime: nowTime,
        data: dataList.map((item) => Object.assign({}, item, { id: item.itemCode, name: item.itemName })),
      });
      cacheData[type] = data;
    } else {
      cacheData[type] = res;
    }
    return cacheData[type];
  });
};

// 按照分组查询两级数据字典
const queryNodesMapByGroup = async (type) => {
  const cacheTypeData = cacheData[type] || {};
  const nowTime = new Date().getTime();
  if (nowTime - cacheTypeData.fetchTime < cacheData.cacheTime) {
    return cacheTypeData;
  }
  const reqUrl = `${Config.zmcqLink}/api/sysDict/queryNodesMapByGroup`;
  const repos = request(reqUrl, Object.assign({}, postjsontokenoptions()), { groupCode: type });
  return repos.then((res) => {
    const resData = res.data || [];
    // console.log(resData, 'resData');
    if (Number(res.code) === 0 && resData.length > 0) {
      const data = Object.assign({}, res, {
        fetchTime: nowTime,
        data: resData,
      });
      cacheData[type] = data;
    } else {
      cacheData[type] = res;
    }
    return cacheData[type];
  });
};

// 按照分组查询两级数据字典
const queryNodesMapListByGroup = async (type) => {
  const cacheTypeData = cacheData[type] || {};
  const nowTime = new Date().getTime();
  if (nowTime - cacheTypeData.fetchTime < cacheData.cacheTime) {
    return cacheTypeData;
  }
  const reqUrl = `${Config.zmcqLink}/api/sysDict/queryNodesMapListByGroup`;
  const repos = request(reqUrl, Object.assign({}, postjsontokenoptions()), { groupCode: type });
  return repos.then((res) => {
    const resData = res.data || [];
    // console.log(resData, 'resData');
    if (Number(res.code) === 0 && resData.length > 0) {
      const data = Object.assign({}, res, {
        fetchTime: nowTime,
        data: resData,
      });
      cacheData[type] = data;
    } else {
      cacheData[type] = res;
    }
    return cacheData[type];
  });
};


const queryOtherNodesByGroup = async (otherType) => {
  const type = `other_${otherType}`;
  const cacheTypeData = cacheData[type] || {};
  const nowTime = new Date().getTime();
  if (nowTime - cacheTypeData.fetchTime < cacheData.cacheTime) {
    return cacheTypeData;
  }
  const reqUrl = `${Config.zmcqLink}/api/sysDict/querySecondLevelNodesByGroup`;
  const repos = request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: otherType }));
  return repos.then((res) => {
    const dataList = res.data || [];
    if (Number(res.code) === 0 && dataList.length > 0) {
      const data = Object.assign({}, res, {
        fetchTime: nowTime,
        data: dataList.map((item) => Object.assign({}, item, { id: toNumber(item.itemCode), name: item.itemName })),
      });
      cacheData[type] = data;
    } else {
      cacheData[type] = res;
    }
    return cacheData[type];
  });
};

// 题目纠错模块
const queryCorrectionModule = () => queryNodesByGroup('QB_CORRECTION_MODULE');

// 卷型
const queryExamType = () => queryNodesByGroup('QB_EXAM_TYPE');

// 题型(父级题型)
const queryQuestionType = () => queryNodesByGroup('QB_QUESTION_TYPE');

// 题型（所有的子级题型）
const queryAllQuestionType = () => queryOtherNodesByGroup('QB_QUESTION_TYPE');

// 试卷类型
const queryExamPaperType = () => queryNodesByGroup('QB_EXAM_PAPER_TYPE');

// 新的查询试卷类型的接口
const queryExamPaperTypeV1 = () => queryNodesByGroup('QB_EXAM_PAPER_TYPE_v1');

// 纠错错误类型
const queryCorrectionErrorType = () => queryNodesByGroup('QB_CORRECTION_ERR_TYPE');

// 题目评级
const queryRating = () => queryNodesByGroup('QB_RATING');

// 题目难度
const queryQuestionDifficulty = () => queryNodesByGroup('QB_QUESTION_DIFFICULTY');

// 老师端APP-题型
const queryTeacherAppQuestionType = () => queryNodesByGroup('QB_TEACHER_APP_QUESTION_TYPE');

// 老师端APP-难度
const queryTeacherAppQuestionDifficulty = () => queryNodesByGroup('QB_TEACHER_APP_QUESTION_DIFFICULTY');

// 试卷来源
const queryExamPaperSource = () => queryNodesByGroup('QB_EXAM_PAPER_SOURCE');

// 年份
const queryYear = () => queryNodesByGroup('QB_YEAR');

// 年份
const queryPurpose = () => queryNodesByGroup('QB_PURPOSE');

// 测评用途
const queryPaperPurpose = () => queryNodesByGroup('QB_EXAM_PAPER_PURPOSE');

// 试卷测评对象
const queryPaperTarget = () => queryNodesByGroup('QB_EXAM_PAPER_TARGET');

// 获取适用BU
const queryEpBu = () => queryNodesByGroup('QB_EXAM_PAPER_BU');

// 获取使用场景
const queryScene = () => queryNodesByGroup('QB_QUESTION_SCENE');

// 查询所有 answerRule
const queryExamAnswerRule = () => queryNodesByGroup('QB_EXAM_ANSWER_RULE');

// 查询教资题库 题目来源
const queryTCQusetionSource = () => queryNodesByGroup('TS_QUESTION_SOURCE');

// 查询教资题库 题目类型
const queryTCQusetionType = () => queryNodesByGroup('TS_QUESTION_TYPE');

// 查询教资题库 使用场景
const queryTCQusetionScence = () => queryNodesByGroup('TS_QUESTION_SCENCE');

// 查询所有题型对应模版关系，返回值为 Map数据
const queryQuestionTypeToTemplateMap = () => queryNodesMapByGroup('QB_QUESTION_TYPE_TO_TEMPLATE');

// 查询所有题型对应模版关系，返回值为数组
const queryQuestionTypeToTemplateList = () => queryNodesMapListByGroup('QB_QUESTION_TYPE_TO_TEMPLATE');

// 少儿题型
const queryChildQuestionType = () => queryOtherNodesByGroup('QB_CHILD_QUESTION_TYPE');

// 少儿年份
const queryChildYear = () => queryNodesByGroup('QB_CHILD_YEAR');

// 少儿难度
const queryChildDifficulty = () => queryNodesByGroup('QB_CHILD_DIFFICULTY');

// 少儿试卷类型
const queryChildPaperType = () => queryNodesByGroup('QB_CHILD_EXAM_PAPER_TYPE');

// 上下架状态
const queryOnlineFlag = () => queryNodesByGroup('QB_ONLINE_FLAG');

// 知识点类型
const queryKnowledgeType = () => queryNodesByGroup('QB_KNOWLEDGE_TYPE');

// 题目来源
const queryQuestionSource = () => queryNodesByGroup('QB_QUESTION_SOURCE');

// 试卷难度
const queryPaperDifficulty = () => queryNodesByGroup('QB_EXAM_PAPER_DIFFICULTY');
// 区分度
const queryDistinction = () => queryNodesByGroup('QB_DISTINCTION');
// 综合度
const queryComprehensiveDegree = () => queryNodesByGroup('QB_COMPREHENSIVE_DEGREE');
// 试卷名片
const queryPaperCard = () => queryNodesByGroup('QB_PAPER_CARD');

export default {
  queryYear,
  queryExamPaperSource,
  queryQuestionType,
  queryExamPaperType,
  queryExamPaperTypeV1,
  queryCorrectionModule,
  queryCorrectionErrorType,
  queryExamType,
  queryRating,
  queryQuestionDifficulty,
  queryTeacherAppQuestionType,
  queryTeacherAppQuestionDifficulty,
  queryPaperPurpose,
  queryPaperTarget,
  queryEpBu,
  queryScene,
  queryExamAnswerRule,
  queryTCQusetionSource,
  queryTCQusetionType,
  queryTCQusetionScence,
  queryQuestionTypeToTemplateMap,
  queryQuestionTypeToTemplateList,
  queryAllQuestionType,
  queryChildQuestionType,
  queryChildYear,
  queryChildDifficulty,
  queryChildPaperType,
  queryOnlineFlag,
  queryKnowledgeType,
  queryQuestionSource,
  queryPurpose,
  queryPaperDifficulty,
  queryDistinction,
  queryComprehensiveDegree,
  queryPaperCard
};
