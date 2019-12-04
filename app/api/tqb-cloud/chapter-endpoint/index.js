import request, { postjsontokenoptions, gettockenurloptions } from 'utils/request';
import Config from 'utils/config';

const cal = (url, params) => {
  const reqUrl = `${Config.tqbLink}${url}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
/**
 * 创建章节
 * @param {number} columnId 科目 id
 * @param {number} moduleId 模块 id
 * @param {string} name 章节名称
 * @param {number} state 上下架状态 0: 上架， 1 下架
 */
const createChapter = (params = {}) => {
  const reqUrl = `${Config.tqbLink}/api/chapter/create`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

/**
 * 删除章节
 * @param {number} id 章节 id
 */
const deleteChapter = (params = {}) => {
  const reqUrl = `${Config.tqbLink}/api/chapter/delete`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()), params);
};

/**
 * 获取章节列表
 * @param {number} columnId 科目 id
 * @param {number} moduleId 模块 id
 */
const findChapters = (params = {}) => {
  const reqUrl = `${Config.tqbLink}/api/chapter/findAll`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 获取模块和科目
const findModuleList = (params = {}) => {
  const reqUrl = `${Config.tqbLink}/api/chapter/findModuleList`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 获取笔试模块下的所有节点
const findPracticalList = (params = {}) => {
  const reqUrl = `${Config.tqbLink}/api/chapter/findPracticalList`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

/**
 * 获取章节列表
 * @param {number} id 章节id
 * @param {number} sortChange 排序变更值(-1: 上移，1：下移)
 */
const sortChapters = (params = {}) => {
  const reqUrl = `${Config.tqbLink}/api/chapter/moveSort`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()), params);
};

/**
 * 更新章节
 * @param {number} id 章节 id
 * @param {number} columnId 科目 id
 * @param {number} moduleId 模块 id
 * @param {string} name 章节名称
 * @param {number} state 上下架状态 0: 上架， 1 下架
 */
const updateChapter = (params = {}) => {
  const reqUrl = `${Config.tqbLink}/api/chapter/update`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 获取知识点
const getKnowledgeList = (params = {}) => {
  return cal('/api/chapterDirectory/findAll', params);
};
// 新增知识点
const addKnowledge = (params = {}) => {
  return cal('/api/chapterDirectory/create', params);
};
// 更新知识点
const editKnowledge = (params = {}) => {
  return cal('/api/chapterDirectory/update', params);
};
// 删除知识点
const delKnowledge = (params = {}) => {
  return cal(`/api/chapterDirectory/delete?id=${params.id}`, {});
};
// 排序
const sortKnowledge = (params = {}) => {
  return cal(`/api/chapterDirectory/sort`, params);
};

// 显示章节路径的全名称
const showKnowledgeName = (params = {}) => {
  const requestURL = `${Config.tqbLink}/api/chapterDirectory/getFullPath`;
  return request(requestURL, Object.assign({}, gettockenurloptions()), params);
};
// 校验章节目录
const verifyChapterMenu = (params) => {
  return cal(`/api/chapterDirectory/checkSamePhase?idList=${params.idList}`, {});
};
export default {
  createChapter,
  deleteChapter,
  findChapters,
  findModuleList,
  findPracticalList,
  sortChapters,
  updateChapter,
  getKnowledgeList,
  addKnowledge,
  editKnowledge,
  delKnowledge,
  sortKnowledge,
  showKnowledgeName,
  verifyChapterMenu
};
