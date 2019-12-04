import gradeApi from 'api/tr-cloud/grade-endpoint/index.js';
import subjectApi from 'api/tr-cloud/subject-endpoint/index.js';
import editionApi from 'api/tr-cloud/edition-endpoint/index.js';
import courseApi from 'api/tr-cloud/course-system-endpoint/index.js';
import { handleRequest } from 'utils/helpfunc';
// 年级
export const getGrade = async () => {
  let data = await handleRequest(gradeApi.getGrade);
  return  data;
};
// 学科
export const getSubject = async (gradeId) => {
  let data = await handleRequest(subjectApi.getSubjectByGradeId, { params: gradeId });
  return  data;
};
// 版本
export const getEdition = async (params) => {
  let data = await handleRequest(editionApi.getEdition, { params });
  return  data;
};
// 课程体系
export const getCourse = async (params) => {
  let data = await handleRequest(courseApi.getClassType, { params });
  return  data;
};
