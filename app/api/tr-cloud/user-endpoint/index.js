import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

const findAll = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/user/findAll`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const getOne = (id) => {
  const reqUrl = `${Config.zmtrlink}/api/user/getOne/${id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), {}));
};

const save = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/user/save`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const update = (id, params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/user/update/${id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const resetPassword = (id, params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/user/${id}/resetPassword`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const findPhaseSubjectList = (params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/user/findPhaseSubjectList`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const updateSalaryPayment = (params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/user/updateSalaryPayment`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

export default {
  getOne,
  findAll,
  save,
  update,
  resetPassword,
  findPhaseSubjectList,
  updateSalaryPayment,
};