import request, {
  putjsontokenoptions,
  postjsontokenoptions,
  deletejsontokenoptions,
} from 'utils/request';

import Config from 'utils/config';

// 获取年级
const getEdition = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/zmChildEdition/findAll`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const createEdition = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/zmChildEdition`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const updateEdition = (id, params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/zmChildEdition/${id}`;
  return request(reqUrl, Object.assign({}, putjsontokenoptions(), { body: JSON.stringify(params) }));
};

const deleteEdition = (id) => {
  const reqUrl = `${Config.zmtrlink}/api/zmChildEdition/${id}`;
  return request(reqUrl, Object.assign({}, deletejsontokenoptions()));
};

// 设置默认
const setDefaultCourse = (params) => {
  const reqUrl = `${Config.zmtrlink}/api/zmChildTestCourseSystem/setDefault/${params.id}`;
  return request(reqUrl, Object.assign({}, putjsontokenoptions(), { body: JSON.stringify(params) }));
};
export default {
  getEdition,
  createEdition,
  updateEdition,
  deleteEdition,
  setDefaultCourse
};
