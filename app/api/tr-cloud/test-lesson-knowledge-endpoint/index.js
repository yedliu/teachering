import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

// 获取教材版本
const getTestLessonKnowledge = (params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/testLessonKnowledge/findAll`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const saveTestLessonKnowledge = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/testLessonKnowledge/save`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const updateTestLessonKnowledge = (id, params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/testLessonKnowledge/update/${id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const deleteTestLessonKnowledge = (id, params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/testLessonKnowledge/delete/${id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const sortTestLessonKnowledge = (params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/testLessonKnowledge/action/sort`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 测评课体系更新 hot 标识
const updateHot = (id, isHot) => {
  const requestURL = `${Config.zmtrlink}/api/testLessonKnowledge/updateHot/${id}/${isHot}`;
  return request(requestURL, Object.assign({}, postjsontokenoptions()));
};

export default {
  getTestLessonKnowledge,
  saveTestLessonKnowledge,
  updateTestLessonKnowledge,
  deleteTestLessonKnowledge,
  sortTestLessonKnowledge,
  updateHot,
};