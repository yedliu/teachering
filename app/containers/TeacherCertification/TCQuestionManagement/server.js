import { message } from 'antd';
import chapterApi from 'api/tqb-cloud/chapter-endpoint';
import tsQuesionApi from 'api/qb-cloud/test-lesson-recommended-content-endpoint';
import queryNode from 'api/qb-cloud/sys-dict-end-point';
import { handleRequest } from 'utils/helpfunc';
export const findPracticalList = async params => {
  const res = await chapterApi.findPracticalList(params);
  let data = [];
  if (Number(res.code) === 0) {
    data = res.data;
  } else {
    message.error(res.message || '获取笔试章节列表失败');
  }
  return data;
};

export const saveQuestion = async params => {
  const res = await tsQuesionApi.saveTsQuesion(params);
  let data = false;
  if (Number(res.code) === 0) {
    data = res.data;
    message.success('保存题目成功');
  } else {
    message.error(res.message || '保存题目失败');
  }
  return data;
};

export const saveQuestionTag = async params => {
  const res = await tsQuesionApi.tagTsQuesion(params);
  let data = false;
  if (Number(res.code) === 0) {
    data = res.data;
    message.success('保存题目标签成功');
  } else {
    message.error(res.message || '保存题目标签失败');
  }
  return data;
};

export const queryQuestion = async params => {
  const res = await tsQuesionApi.queryQuestion(params);
  let data = false;
  if (Number(res.code) === 0) {
    data = res.data;
  } else {
    message.error(res.message || '获取题目失败');
  }
  return data;
};

export const deleteQuestion = async id => {
  const res = await tsQuesionApi.deleteQuestion(id);
  let data = false;
  if (Number(res.code) === 0) {
    data = res.data;
    message.success('删除题目成功');
  } else {
    message.error(res.message || '删除题目失败');
  }
  return data;
};

export const updateQuestion = async (params) => {
  const res = await tsQuesionApi.modifyTsQuesion(params);
  let data = false;
  if (Number(res.code) === 0) {
    data = res.data;
    message.success('更新题目成功');
  } else {
    message.error(res.message || '更新题目失败');
  }
  return data;
};

export const getHeaderFilter = async () => {
  const res = await queryNode.queryNodesByGroupList([
    'TS_QUESTION_SOURCE',
    'TS_QUESTION_TYPE',
    'TS_QUESTION_SCENCE',
    'TS_EXAM_PAPER_PHASE',
  ]);
  let data = {};
  if (Number(res.code) === 0) {
    data = res.data;
  } else {
    message.error(res.message || '获取筛选条件失败');
  }
  const {
    TS_QUESTION_SOURCE: sourceList = [],
    TS_QUESTION_TYPE: questionTypeList = [],
    TS_QUESTION_SCENCE: tempSceneList = [],
    TS_EXAM_PAPER_PHASE: phaseList = [],
  } = data;
  // const phaseList = tempPhaseList.map(el => ({ id: el.itemCode, name: el.itemName }));
  const sceneList = tempSceneList.map(el => ({ label: el.name, value: el.id }));
  return { sourceList, questionTypeList, sceneList, phaseList };
};

//  显示章节路径的全名称
export const getKnowledgeNames = (params) => {
  return handleRequest(chapterApi.showKnowledgeName, { params });
};
// 校验是否有多个学段
export const verifyChapterMenu = (params) => {
  return handleRequest(chapterApi.verifyChapterMenu, { params });
};
