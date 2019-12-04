import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

// 查能力列表
const getOptionData = (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examSituation/getIndexData`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 模块分析
const getModuleReport = (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examSituation/moduleAnalysisReport`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 知识点分析
const getKnowledgeReport = (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examSituation/knowledgeAnalysisReport`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 难度分析
const getDifficultReport = (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examSituation/difficultyAnalysisReport`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 难度趋势
const getDifficultTrend = (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examSituation/difficultyTrendAnalysisReport`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 题型分析
const getQuestionTypeReport = (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examSituation/quTypeAnalysisReport`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 题目详情
const getQuestionDetail = (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examSituation/getQuestionIds`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
export default {
  getOptionData, getModuleReport, getKnowledgeReport, getDifficultReport, getDifficultTrend, getQuestionTypeReport, getQuestionDetail
};
