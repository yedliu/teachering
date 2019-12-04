import { message } from 'antd';
import gradeApi from '../../../api/tr-cloud/grade-endpoint';
import subjectApi from '../../../api/tr-cloud//subject-endpoint';
import examAIApi from '../../../api/exam-cloud/exam-info-ai-phase-endpoint';
import examSafeApi from '../../../api/exam-cloud/exam-info-safe-endpoint';
import {
  getPaperNode,
  getPaperNodes
} from '../../../api/exam-cloud/exam-info-dict-endpoint';
console.log('getPaperNode', getPaperNode);
const errorTips = (msg = '系统异常，请稍后再试') => {
  message.error(msg);
};
/**
 * @description 简单封装获取数据的方法
 * @param {fn} fetch 请求接口的方法
 * @param {string} defaultMsg 请求失败默认给的提示
 * @param {fn} defaultData 请求失败默认返回的数据
 * @param {*} params 请求的参数
 * @return {*}
 */
const getData = async ({
  fetch,
  defaultMsg = '获取数据失败',
  defaultData,
  params,
}) => {
  try {
    const res = await fetch(params);
    if (`${res.code}` === '0') {
      return res.data || true;
    } else {
      errorTips(res.message || defaultMsg);
      return defaultData;
    }
  } catch (error) {
    errorTips();
    return defaultData;
  }
};

/**
 * @description 获取题目详情
 * @param {number} examInfoId 报告 id
 * @param {number} id 题目 id
 * @return {Promise} 请求完成之后会返回一个对象
 */
export const getQuestionById = async (examInfoId, id) => {
  if (!id) {
    errorTips('题目 ID 不能为空');
    return {};
  }
  return getData({
    fetch: examAIApi.getQuestion,
    defaultMsg: '获取题目失败',
    defaultData: {},
    params: { questionId: id, examInfoId }
  });
};

/**
 * @description 获取年级列表
 * @return {Promise} 请求完成之后会返回年级数据
 */
export const getGrade = async () => {
  return getData({
    fetch: gradeApi.getGrade,
    defaultMsg: '获取年级失败',
    defaultData: [],
  });
};

/**
 * @description 获取学科列表
 * @param {number} gradeId 年级 id
 * @return {Promise} 请求完成之后会返回一个学科数组
 */
export const getSubject = async (gradeId) => {
  if (!gradeId) return [];
  return getData({
    fetch: subjectApi.getSubjectByGradeId,
    defaultMsg: '获取学科失败',
    defaultData: [],
    params: gradeId
  });
};

/**
 * @description 获取算法筛选列表
 * @return {Promise} 请求完成之后会返回一个数组
 */
export const getBIRuleList = async () => {
  return getData({
    fetch: examAIApi.getBiRule,
    defaultMsg: '获取算法筛选失败',
    defaultData: [],
  });
};
/**
 * @description 获取难度评价列表
 * @return {Promise} 请求完成之后会返回一个数组
 */
// export const getDiffEvalList = async () => {
//   return getPaperNode({
//     params: 'DIFFICULT_EVAL'
//   });
// };
/**
 * @description 批量获取枚举列表
 * @return {Promise} 请求完成之后会返回一个对象
 */
export const getNodesList = async () => {
  return getPaperNodes({
    params: {
      'groupCodeList': [
        'DIFFICULT_EVAL', 'ACCURATE_EVAL', 'AI_EXAMTYPE'
      ]
    }
  });
};

// 评价人
const APPRAISER = [{ id: 2, name: '老师' }, { id: 3, name: '教研' }];

/**
 * @description 获取评价人
 * @returns {Promise}
 */
export const getRoleList = async () => {
  return new Promise(resolve => {
    resolve(APPRAISER);
  });
};

/**
 * @description 获取报告数据
 * @param {object} params 获取报告的参数
 * @return {Promise} 请求完成之后会返回一个数组
 */
export const getReportData = async (params) => {
  return getData({
    fetch: examAIApi.getReportData,
    defaultMsg: '获取报告数据失败',
    defaultData: [],
    params,
  });
};

/**
 * @description 获取报告总览数据
 * @param {object} params 获取报告的参数
 * @return {Promise} 请求完成之后会返回一个对象
 */
export const getReportProfile = async (params) => {
  return getData({
    fetch: examAIApi.getReportProfile,
    defaultMsg: '获取报告数据失败',
    defaultData: {},
    params,
  });
};

/**
 * @description 获取报告详情的数据
 * @param {number} params 报告详情参数
 * @return {Promise} 请求完成之后会返回一个对象
 */
export const getDetailData = (params) => {
  return getData({
    fetch: examAIApi.getReportDetail,
    defaultMsg: '获取详情失败',
    defaultData: { pageInfo: {}},
    params,
  });
};

/**
 * @description 获取加密字符串用来获取报告
 * @param {number} id 报告 id
 * @return {Promise}
 */
export const getExamEncrypt = (id) => {
  return getData({
    fetch: examSafeApi.getEncrypt,
    defaultMsg: '获取报告失败，请稍后再试',
    defaultData: false,
    params: id,
  });
};

/**
 * @description 教研老师提交评价的方法
 * @param {object} params 参数
 * @return {Promise} 请求完成之后会返回一个布尔值
 */
export const submitFeedbackByTr = (params) => {
  return getData({
    fetch: examAIApi.proEvalExam,
    defaultMsg: '提交评价失败，请稍后再试',
    defaultData: false,
    params,
  });
};
