import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

// 更新题目
const modifyTsQuesion = (params) => {
  const reqUrl = `${Config.zmcqLink}/api/tsQuestion/modifyTsQuesion`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 根据题目 id 查询题目
const queryByIdList = (idList) => {
  const reqUrl = `${Config.zmcqLink}/api/tsQuestion/queryByIdList`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()), { idList });
};
// 保存题目
const saveTsQuesion = (params) => {
  const reqUrl = `${Config.zmcqLink}/api/tsQuestion/saveTsQuesion`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 修改题目标签
const tagTsQuesion = (params) => {
  const reqUrl = `${Config.zmcqLink}/api/tsQuestion/tagTsQuesion`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 查询题目
const queryQuestion = (params) => {
  const reqUrl = `${Config.zmcqLink}/api/tsQuestion/queryQuestion`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 删除题目
const deleteQuestion = (questionId) => {
  const reqUrl = `${Config.zmcqLink}/api/tsQuestion/deleteQuestion`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()), { questionId });
};

export default {
  modifyTsQuesion,
  queryByIdList,
  saveTsQuesion,
  tagTsQuesion,
  queryQuestion,
  deleteQuestion
};
