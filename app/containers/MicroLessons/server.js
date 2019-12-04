import phaseApi from 'api/tr-cloud/phase-subject-endpoint/index.js';
import editionApi from 'api/tr-cloud/textbook-edition-endpoint/index.js';
import allPhaseApi from 'api/tr-cloud/phase-endpoint/index.js';
import microLessonApi from 'api/tr-cloud/micro-course-content-endpoint/index.js';
import { handleRequest } from 'utils/helpfunc';
// allPhaseApi.getPhase获取学段
// phaseApi.findAllSubject 查学科
// phaseApi.findGradeByPhaseId  查年级
// editionApi.getTextbookEdition 查版本

export const getAllPhase = () => {
  return handleRequest(allPhaseApi.getPhase);
};

export const getSubject = (params) => { // phaseId
  return handleRequest(phaseApi.findAllSubject, { params });
};

export const getGrade = (phaseId) => {
  return handleRequest(phaseApi.findGradeByPhaseId, { params: phaseId });
};

export const getEdition = (params) => { // phaseId, subjectId
  return handleRequest(editionApi.getTextbookEdition, { params });
};

// 获取课程内容列表
export const getMicroLessonList = (params) => {
  return handleRequest(microLessonApi.getContentList, { params });
};

// 删除
export const delContent = (params) => {
  return handleRequest(microLessonApi.delMicroCourseContent, { params, code: true });
};

// 新增
export const addContent = (params) => {
  return handleRequest(microLessonApi.addMicroCourseContent, { params, code: true });
};

// 编辑
export const editContent = (params) => {
  return handleRequest(microLessonApi.editMicroCourseContent, { params, code: true });
};

// 上传图片policy
export const getUploadImgPolicy = () => {
  return handleRequest(microLessonApi.getUploadImgPolicy);
};

// 获取视频
export const getAllVideo = (params) => {
  return handleRequest(microLessonApi.getAllVideo, { params });
};

// 添加视频
export const addVideo = (params) => {
  return handleRequest(microLessonApi.addVideo, { params, code: true });
};
// 更新视频
export const updateVideo = (params) => {
  return handleRequest(microLessonApi.updateVideo, { params, code: true });
};
// 删除视频
export const delVideo = (params) => {
  return handleRequest(microLessonApi.delVideo, { params, code: true });
};
// 排序
export const sortVideo = (params) => {
  return handleRequest(microLessonApi.sortVideo, { params, code: true });
};
// 设置oss权限
export const sortOssAcl = (params) => {
  return handleRequest(microLessonApi.sortOssAcl, { params, code: true });
};
