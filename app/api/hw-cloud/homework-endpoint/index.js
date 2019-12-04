import request, {
  postjsontokenoptions,
  gettockenurloptions,
  putjsontokenoptions,
  deletejsontokenoptions,
} from 'utils/request';
import Config from 'utils/config';

// 获取作业
const getHomework = (params = {}) => {
  const requestURL = `${Config.zchlink}/api/homework`;
  return request(requestURL, Object.assign({}, gettockenurloptions()), params);
};

// 创建作业
const createHomework = (params = {}) => {
  const requestURL = `${Config.zchlink}/api/homework`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 修改作业
const editHomework = (params = {}) => {
  const requestURL = `${Config.zchlink}/api/homework`;
  return request(requestURL, Object.assign({}, putjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 获取单份作业
const getHomeworkItemById = id => {
  const requestURL = `${Config.zchlink}/api/homework/${id}`;
  return request(requestURL, Object.assign({}, gettockenurloptions()));
};

const findChild = (params = {}) => {
  const requestURL = `${Config.zchlink}/api/homework/findChild`;
  return request(
    requestURL,
    Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }),
  );
};

const saveHomeWOrk = (params = {}) => {
  const requestURL = `${Config.zchlink}/api/homework`;
  return request(
    requestURL,
    Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }),
  );
};

const changeState = params => {
  const requestURL = `${Config.zchlink}/api/homework/changeState`;
  return request(
    requestURL,
    Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }),
  );
};

const deleteQuestion = id => {
  const requestURL = `${Config.zchlink}/api/homework/${id}`;
  return request(requestURL, Object.assign({}, deletejsontokenoptions()));
};

export default {
  getHomework,
  createHomework,
  editHomework,
  getHomeworkItemById,
  findChild,
  saveHomeWOrk,
  changeState,
  deleteQuestion,
};
