// import queryNodeList from 'api/qb-cloud/sys-dict-end-point/queryNodesByGroupList';
import queryRegion from 'api/qb-cloud/region-end-point';
import examSituationApi from 'api/qb-cloud/exam-situation-endpoint';
import questionApi from 'api/qb-cloud/question-endpoint/index.js';
import { handleRequest } from 'utils/helpfunc';
import { message } from 'antd';
// 获取筛选条件的数据
export const getFieldsData = (params = []) => {
  return handleRequest(examSituationApi.getOptionData);
};
// 获取省份
export const getProvince = async () => {
  try {
    let res = await queryRegion.getProvince();
    if (res.code === '0') {
      return  res.data;
    } else {
      message.warning(res.message);
    }
  } catch (e) {
    message.warning('获取省份数据失败');
  }
};
// 获取城市
export const getCity = async (provinceId) => {
  if (!provinceId) return null;
  try {
    let res = await queryRegion.getCityByProvinceId(provinceId);
    if (res.code === '0') {
      return res.data;
    } else {
      message.warning(res.message);
    }
  } catch (e) {
    message.warning('获取城市数据失败');
  }
};

// 获取模块分析数据
export const getModuleReport = (params) => {
  return handleRequest(examSituationApi.getModuleReport, { params });
};

// 知识点分析
export const getKnowledgeReport = (params) => {
  return handleRequest(examSituationApi.getKnowledgeReport, { params });
};

// 难度分析
export const getDifficultReport = (params) => {
  return handleRequest(examSituationApi.getDifficultReport, { params });
};

// 难度趋势
export const getDifficultTrend = (params) => {
  return handleRequest(examSituationApi.getDifficultTrend, { params });
};

// 题型分析
export const getQuestionTypeReport = (params) => {
  return handleRequest(examSituationApi.getQuestionTypeReport, { params });
};

// 题目ids
export const getQuestionDetail = (params) => {
  return handleRequest(examSituationApi.getQuestionDetail, { params });
};

// 获取题目详情
export const getOneQuestion = (params) => {
  return handleRequest(questionApi.getQuestionById, { params: params.id, target: {}});
};
