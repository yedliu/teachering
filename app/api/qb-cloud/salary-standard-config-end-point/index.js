import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

const findAll = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/salaryStandardConfig/findAll`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const getOne = (id) => {
  const reqUrl = `${Config.zmcqLink}/api/salaryStandardConfig/getOne`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify({ id }) }));
};

const getUserPayment = () => {
  const reqUrl = `${Config.zmcqLink}/api/salaryStandardConfig/getSalaryPayment`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), {}));
};

const queryBankInfo = () => {
  const reqUrl = `${Config.zmcqLink}/api/salaryStandardConfig/queryBankInfo`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), {}));
};

const save = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/salaryStandardConfig/save`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

export default {
  findAll,
  getOne,
  getUserPayment,
  queryBankInfo,
  save,
};