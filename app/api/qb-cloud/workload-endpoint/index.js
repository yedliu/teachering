import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

const findAll = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/workload/findAll`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const findSelf = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/workload/findSelf`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const findPersonal = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/workload/findPersonal`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

export default {
  findAll,
  findSelf,
  findPersonal,
};