import request, {
  postjsontokenoptions,
  putjsontokenoptions,
  deletejsontokenoptions
} from 'utils/request';

import Config from 'utils/config';

// 获取年级
const getTestCourseSystem = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/zmChildTestCourseSystem/findAll`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const createTestCourseSystem = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/zmChildTestCourseSystem`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const updateTestCourseSystem = (id, params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/zmChildTestCourseSystem/${id}`;
  return request(reqUrl, Object.assign({}, putjsontokenoptions(), { body: JSON.stringify(params) }));
};

const deleteTestCourseSystem = (id) => {
  const reqUrl = `${Config.zmtrlink}/api/zmChildTestCourseSystem/${id}`;
  return request(reqUrl, Object.assign({}, deletejsontokenoptions()));
};

const setZmChildTestCourseContent = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/zmChildTestCourseSystem/setZmChildTestCourseContent`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};


export default {
  getTestCourseSystem,
  createTestCourseSystem,
  updateTestCourseSystem,
  deleteTestCourseSystem,
  setZmChildTestCourseContent,
};