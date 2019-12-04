import request, {
  postjsontokenoptions,
} from 'utils/request';

import Config from 'utils/config';

// 获取年级
const getCourseSystem = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/zmChildCourseSystem/findAll`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const getCourseSystemByPId = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/zmChildCourseSystem/findChildrenByParentId`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()), params);
};

const createCourseSystem = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/zmChildCourseSystem/save`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const updateCourseSystem = (id, params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/zmChildCourseSystem/update/${id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const deleteCourseSystem = (id) => {
  const reqUrl = `${Config.zmtrlink}/api/zmChildCourseSystem/delete/${id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()));
};

const sortCourseSystem = (idList) => {
  const reqUrl = `${Config.zmtrlink}/api/zmChildCourseSystem/action/sort`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify({ idList }) }));
};
const setZmChildCourseContent = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/zmChildCourseSystem/setZmChildCourseContent`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

export default {
  getCourseSystem,
  getCourseSystemByPId,
  createCourseSystem,
  updateCourseSystem,
  deleteCourseSystem,
  sortCourseSystem,
  setZmChildCourseContent
};