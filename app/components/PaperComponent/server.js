
import courseSystemApi from 'api/tr-cloud/course-system-endpoint';
import textbookApi from 'api/tr-cloud/textbook-endpoint';
import textbookEditionApi from 'api/tr-cloud/textbook-edition-endpoint';
import editionApi from 'api/tr-cloud/edition-endpoint';
import examPaperApi from 'api/qb-cloud/exam-paper-end-point';

// 获取教材版本
export const getTeachingVersionList = (editionId, parentId, gradeId) => {
  // const reqUrl = `${Config.trlink}/api/textbook`;
  return textbookApi.getTextbook({ editionId, parentId, gradeId });
  // request(reqUrl, Object.assign({ _timeout: 3000 }, geturloptions()), { editionId, parentId, gradeId });
};

// 根据id获取教材版本
export const getTeachingVersionById = (id, gradeId) => {
  // const reqUrl = `${Config.trlink}/api/textbook/${id}`;
  return textbookApi.getOne(id);
  // request(reqUrl, Object.assign({ _timeout: 3000 }, geturloptions()), { gradeId });
};

// 获取课程体系
export const getCourseSystemList = (gradeId, subjectId, editionId) => {
  // const reqUrl = `${Config.trlink}/api/courseSystem`;
  return courseSystemApi.getClassType({ gradeId, subjectId, editionId });
};

// 获取课程体系
export const getCourseSystemById = (id) => {
  // const reqUrl = `${Config.trlink}/api/courseSystem/${id}`;
  return courseSystemApi.getOne(id);
  // request(reqUrl, Object.assign({ _timeout: 3000 }, geturloptions()), {});
};

// 获取教材目录
export const getTeachingVersions = (subjectId, gradeId, gradeList) => {
  // console.log('gradeList', gradeList)
  const curGrade = gradeList.find(item => `${item.id}` === `${gradeId}`);
  // const reqUrl = `${Config.trlink}/api/textbookEdition`;
  return textbookEditionApi.getTextbookEdition({ subjectId, phaseId: curGrade.phaseId });
  // request(reqUrl, Object.assign({ _timeout: 3000 }, geturloptions()), { subjectId, phaseId: curGrade.phaseId });
};

// 获取课程体系版本
export const getCourseSystemVersions = (subjectId, gradeId) => {
  // const reqUrl = `${Config.zmtrlink}/api/edition`;
  return editionApi.getEdition({ subjectId, gradeId });
  // request(reqUrl, Object.assign({ _timeout: 3000 }, gettockenurloptions()), { subjectId, gradeId });
};

export const getExamPaperNumByCourseContent = (ids) => {
  // const reqUrl = `${Config.trlink_qb}/api/examPaper/action/getExamPaperNumByCourseContent`;
  return examPaperApi.getExamPaperNumByCourseContent({ ids });
  // request(reqUrl, Object.assign({ _timeout: 3000 }, postjsonoptions(), { body: JSON.stringify(ids) }));
};

export const getExamPaperNumByTextbook = (ids) => {
  // const reqUrl = `${Config.trlink_qb}/api/examPaper/action/getExamPaperNumByTextbook`;
  return examPaperApi.getExamPaperNumByTextbook(ids);
  // request(reqUrl, Object.assign({ _timeout: 3000 }, postjsonoptions(), { body: JSON.stringify(ids) }));
};
