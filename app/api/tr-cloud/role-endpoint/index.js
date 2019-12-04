import request, {
  postjsontokenoptions,
} from 'utils/request';

import Config from 'utils/config';

// 获取角色
const getRole = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/role/findAll`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const saveRole = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/role/save`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const updateRole = (id, params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/role/update/${id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const deleteRole = (id, params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/role/delete/${id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const getOne = (id) => {
  const reqUrl = `${Config.zmtrlink}/api/role/getOne/${id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), {}));
};

export default {
  getRole,
  saveRole,
  updateRole,
  deleteRole,
  getOne,
};
