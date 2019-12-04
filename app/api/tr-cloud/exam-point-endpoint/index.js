import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

// 获取考点
const getExamPoint = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/examPoint/findAll`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 获取考点
const getOneExamPoint = (id, params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/examPoint/getOne/${id}`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const saveExamPoint = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/examPoint/save`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const updateExamPoint = (id, params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/examPoint/update/${id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const deleteExamPoint = (id, params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/examPoint/delete/${id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};


const examPointSort = (params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/examPoint/action/sort`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

export default {
  getExamPoint,
  getOneExamPoint,
  saveExamPoint,
  updateExamPoint,
  deleteExamPoint,
  examPointSort,
};