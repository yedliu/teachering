import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';
import { message } from 'antd';

const getAllKnowledge = (params) => {
  const requestURL = `${Config.zmtrlink}/api/knowledge/findAll`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 获取知识点
const findFirstLevelByPhaseSubjectIdForTr = (params) => {
  const reqUrl = `${Config.zmtrlink}/api/knowledge/findFirstLevelByPhaseSubjectIdForTr`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()), params);
};

// 删除指定知识点
const deleteOne = (id) => {
  const reqUrl = `${Config.zmtrlink}/api/knowledge/cascadeDelete/${id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()));
};

// 根据id查询子节点数据
const findChildrenById = (id) => {
  const reqUrl = `${Config.zmtrlink}/api/knowledge/findChildrenById/${id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()));
};

// 保存知识点
const save = (params) => {
  const reqUrl = `${Config.zmtrlink}/api/knowledge/save`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 修改知识点
const update = (id, params) => {
  const reqUrl = `${Config.zmtrlink}/api/knowledge/update/${id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 根据课程 id 获取知识点
const findKnowledgeIdListByCsId = (id, params) => {
  const reqUrl = `${Config.zmtrlink}/api/knowledge/findKnowledgeIdListByCsId/${id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()));
};

// 修改知识点
const findByParentId = (params) => {
  const reqUrl = `${Config.zmtrlink}/api/knowledge/findByParentId`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()), params);
};

// 获取所有知识点
const findAllByPhaseSubjectIdForTr = (params) => {
  if (!params.phaseSubjectId) {
    message.error('获取知识点缺少phaseSubjectId');
    return;
  }
  const reqUrl = `${Config.zmtrlink}/api/knowledge/findAllByPhaseSubjectIdForTr`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()), params);
};

// 获取某个知识点
const getOne = (params) => {
  if (!params.id) {
    message.error('获取知识点缺少id');
    return;
  }
  const reqUrl = `${Config.zmtrlink}/api/knowledge/getOne/${params.id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()), {});
};

const sort = (params) => {
  const reqUrl = `${Config.zmtrlink}/api/knowledge/action/sort`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 根据知识点id查询前后置知识点
const getFrontAndBackById = (id) => {
  const reqUrl = `${Config.zmtrlink}/api/knowledge/findFrontAndBackKnowledgeById/${id}`;
  // const reqUrl = `http://192.168.7.222:8086/api/knowledge/findFrontAndBackKnowledgeById/${id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()), {});
};
// 教材 ID 查询当前管理的知识点
const findCurrentTextBookKnowledge = (textBookId) => {
  const reqUrl = `${Config.zmtrlink}//api/knowledge/findCurrentTextBookKnowledge/${textBookId}`;
  // const reqUrl = `http://192.168.7.222:8086/api/knowledge/findFrontAndBackKnowledgeById/${id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()), {});
};

export default {
  findFirstLevelByPhaseSubjectIdForTr,
  deleteOne,
  findChildrenById,
  save,
  update,
  findByParentId,
  findAllByPhaseSubjectIdForTr,
  findKnowledgeIdListByCsId,
  getOne,
  getAllKnowledge,
  sort,
  getFrontAndBackById,
  findCurrentTextBookKnowledge,
};
