import request, { postjsontokenoptions, gettockenurloptions } from 'utils/request';
import Config from 'utils/config';

// 获取班型
const getClassType = (params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/courseSystem/findAll`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 获取第一层课程体系
const findFirstLevelCourseSystem = () => {
  const requestURL = `${Config.zmtrlink}/api/courseSystem/findFirstLevelCourseSystem`;
  return request(requestURL, Object.assign({}, gettockenurloptions()));
};

// 根据父级 id 获取子节点
const findCourseSystemByParentId = (pId, params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/courseSystem/findChildrenByParentId`;
  return request(requestURL, Object.assign({}, gettockenurloptions()), { pId });
};
// 获取第一级班型数据
const getFirstLevelClassType = (params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/courseSystem/findAllFieldsByParentId/0`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 保存
const saveCourseSystem = (params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/courseSystem/save`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 更新
const updateCourseSystem = (id, params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/courseSystem/update/${id}`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 删除
const deleteCourseSystem = (id, params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/courseSystem/cascadeDelete/${id}`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 排序
const sortCourseSystem = (params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/courseSystem/action/sort`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 上架课程体系
const upCourseSystem = (params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/courseSystem/shelve`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 下架课程体系
const downCourseSystem = (params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/courseSystem/unshelve`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 设置ILA
const enableILA = (params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/courseSystem/enableILA`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 取消ILA
const disableILA = (params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/courseSystem/disableILA`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const getOne = (id) => {
  const requestURL = `${Config.zmtrlink}/api/courseSystem/getOne/${id}`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), {}));
};


export default {
  getClassType,
  findFirstLevelCourseSystem,
  findCourseSystemByParentId,
  saveCourseSystem,
  updateCourseSystem,
  deleteCourseSystem,
  sortCourseSystem,
  upCourseSystem,
  downCourseSystem,
  enableILA,
  disableILA,
  getFirstLevelClassType,
  getOne,
};
