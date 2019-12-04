import request, {
  postjsontokenoptions,
  gettockenurloptions,
} from 'utils/request';
import Config from 'utils/config';

// 查询测评课作业
const findTestHomework = (params = {}) => {
  const requestURL = `${Config.zchlink}/api/testLessonHomework/list`;
  return request(
    requestURL,
    Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }),
  );
};

// 获取单份测评课作业
const getTestHomeworkById = id => {
  const requestURL = `${Config.zchlink}/api/testLessonHomework/${id}`;
  return request(requestURL, Object.assign({}, gettockenurloptions()));
};

// 创建一份测评课作业
const createTestHw = (params = {}) => {
  const requestURL = `${Config.zchlink}/api/testLessonHomework/create`;
  return request(
    requestURL,
    Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }),
  );
};

// 修改一份测评课作业
const updateTestHw = (params = {}, id) => {
  const requestURL = `${Config.zchlink}/api/testLessonHomework/update/${id}`;
  return request(
    requestURL,
    Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }),
  );
};

// 删除测评课作业
const deleteTestHw = id => {
  const requestURL = `${Config.zchlink}/api/testLessonHomework/delete/${id}`;
  return request(
    requestURL,
    Object.assign({}, postjsontokenoptions()),
  );
};

export default {
  findTestHomework,
  getTestHomeworkById,
  createTestHw,
  updateTestHw,
  deleteTestHw,
};
