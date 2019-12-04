import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

// 获取教材版本
const getTextbook = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/textbook/findAll`;
  if (!params.parentId) params.parentId = void 0;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const saveTextbook = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/textbook/create`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const updateTextbook = (id, params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/textbook/update/${id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const deleteTextbook = (id, params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/textbook/delete/${id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const deleteTextbookByPId = (parentId, params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/textbook/deleteByPId/${parentId}`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const textbookSort = (params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/textbook/action/sort`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const getOne = (id) => {
  const requestURL = `${Config.zmtrlink}/api/textbook/getOne/${id}`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), {}));
};

// 获取教材版本
const findAllByCondition = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/textbook/findAllByCondition`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const findKnowledges = (textBookId, params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/textbook/findKnowledges/${textBookId}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};



export default {
  getTextbook,
  saveTextbook,
  updateTextbook,
  deleteTextbook,
  deleteTextbookByPId,
  textbookSort,
  getOne,
  findAllByCondition,
  findKnowledges
};