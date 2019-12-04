import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

const getChildGrade = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/child/getChildGrade`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const getChildSubject = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/child/getChildSubject`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const offline = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/child/offline`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()), params);
};

const online = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/child/online`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()), params);
};

const deleteExamPaper = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/child/delete`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()), params);
};

const saveExamPaper = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/child/saveExamPaper`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const updateExamPaper = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/child/updateExamPaper`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const queryExamPaper = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/child/queryExamPaper`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const findExamPaperDetail = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/child/findExamPaperDetail`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()), params);
};

export default {
  getChildGrade,
  getChildSubject,
  offline,
  online,
  deleteExamPaper,
  saveExamPaper,
  updateExamPaper,
  queryExamPaper,
  findExamPaperDetail
};