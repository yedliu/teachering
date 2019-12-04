import { handleRequest } from 'utils/helpfunc';
import tqbPaperApi from 'api/tqb-cloud/paper-endpoint';
import tqbChapterApi from 'api/tqb-cloud/chapter-endpoint';
import queryNode from 'api/qb-cloud/sys-dict-end-point/queryNodesByGroupList';
import testLessonApi from 'api/qb-cloud/test-lesson-recommended-content-endpoint/index.js';
// 获取科目
export const getSubjects = () => {
  return handleRequest(tqbChapterApi.findModuleList, { target: [] });
};
// 查数据字典
export const queryDict = () => {
  let params = ['TS_EXAM_PAPER_TYPE', 'TS_EXAM_PAPER_PHASE',  'TS_EXAM_PAPER_YEAR', 'QB_ONLINE_FLAG', 'TS_QUESTION_TYPE'];
  return handleRequest(queryNode, { params, target: {}});
};
// 试卷列表
export const getPaperList = (params = {}) => {
  return handleRequest(tqbPaperApi.getPaperList, { params });
};
// 试卷详情
export const getPaperDetail = (id) => {
  return handleRequest(tqbPaperApi.getPaperDetail, { params: { id }});
};
// 上下架
export const onOffFlag = (params, flag) => {
  if (flag === 1) {
    return handleRequest(tqbPaperApi.onPaper, { params });
  } else if (flag === 2) {
    return handleRequest(tqbPaperApi.offPaper, { params });
  }
};
// 删除试卷
export const deletePaper = (id) => {
  return handleRequest(tqbPaperApi.deletePaper, { params: { id }, code: true });
};
// 编辑试卷
export const editPaper = (params) => {
  return handleRequest(tqbPaperApi.editPaper, { params, code: true });
};
// 新增试卷
export const addPaper = (params) => {
  return handleRequest(tqbPaperApi.addPaper, { params, code: true });
};
// 保存题目
export const saveQuestion = (params) => {
  return handleRequest(testLessonApi.saveTsQuesion, { params, target: {}});
};

// 编辑题目

export const editQuestion = (params) => {
  return handleRequest(testLessonApi.modifyTsQuesion, { params, target: {}});
};
