/**
 * AI阶段测评接口
 * 接口 swagger: http://10.81.173.206:8080/swagger-ui.html#!/exam-info-ai-phase-endpoint/proEvalExam
 */
import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

// 获取报告列表
const getReportData = (params = {}) => {
  const reqUrl = `${Config.zmceLink}/AI/examInfo/proEvalStac`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 获取报告总览
const getReportProfile = (params = {}) => {
  const reqUrl = `${Config.zmceLink}/AI/examInfo/proEvalStacProfile`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 获取算法筛选列表
const getBiRule = (params = {}) => {
  const reqUrl = `${Config.zmceLink}/AI/examInfo/getBiRule`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 获取报告详情
const getReportDetail = (params = {}) => {
  const reqUrl = `${Config.zmceLink}/AI/examInfo/evaldetailForPro`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 教研提交评价
const proEvalExam = (params = {}) => {
  const reqUrl = `${Config.zmceLink}/AI/examInfo/proEvalExam`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 获取单个题目
const getQuestion = (params = {}) => {
  const reqUrl = `${Config.zmceLink}/AI/examInfo/getQuestionDetailReport`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

export default {
  getReportProfile,
  getReportData,
  getBiRule,
  getReportDetail,
  proEvalExam,
  getQuestion
};