/**
 * 课程体系管理内比较通用的接口
 * getSubjectGrade => 获取少儿所有的科目年级
 * getState => 获取上下架状态 暂时是前端写死的
 **/

import { message } from 'antd';
import chapterApi from 'api/tqb-cloud/chapter-endpoint';
import queryNode from 'api/qb-cloud/sys-dict-end-point';
import { handleRequest } from 'utils/helpfunc';

// 模块
export const findModuleList = async params => {
  const res = await chapterApi.findModuleList(params);
  let data = [];
  if (Number(res.code) === 0) {
    data = res.data;
  } else {
    message.error(res.message || '获取模块科目失败');
  }
  return data;
};

// 筛选条件,学段
export const getHeaderFilter = async () => {
  const res = await queryNode.queryNodesByGroupList([
    'TS_EXAM_PAPER_PHASE',
  ]);
  let data = {};
  if (Number(res.code) === 0) {
    data = res.data;
  } else {
    message.error(res.message || '获取筛选条件失败');
  }
  const {
    TS_EXAM_PAPER_PHASE: phaseList = [],
  } = data;
  return { phaseList };
};

// 知识点列表

export const getKnowledgeList = (params) => {
  return handleRequest(chapterApi.getKnowledgeList, { params });
};

// 新增知识点
export const addKnowledge = (params) => {
  return handleRequest(chapterApi.addKnowledge, { params });
};

// 编辑知识点
export const editKnowledge = (params) => {
  return handleRequest(chapterApi.editKnowledge, { params });
};

// 删除知识点
export const delKnowledge = (params) => {
  return handleRequest(chapterApi.delKnowledge, { params });
};

// 排序
export const sortKnowledge = (params) => {
  return handleRequest(chapterApi.sortKnowledge, { params });
};
