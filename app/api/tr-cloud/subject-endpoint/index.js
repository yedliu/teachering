import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

/**
 * 获取所有学科
 * @param {*} params 可以不传
 */
const getAllSubject = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/subject/findAll`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
/**
 * 根据年级id获取学科
 * @param gradeId
 */
const getSubjectByGradeId = (gradeId) => {
  const reqUrl = `${Config.zmtrlink}/api/subject/findSubjectListByGradeId`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()), { gradeId });
};
/**
 * 获取少儿学科
 * @param params
 */
const getChildSubject = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/subject/findChildSubject`;
  return request(
    reqUrl,
    Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) })
  );
};
/**
 * 获取少儿学科和年级
 * @param params
 */
const getChildSubjectGrade = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/subject/findChildSubjectGrade`;
  return request(
    reqUrl,
    Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) })
  );
};
const getChildGrade = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/grade/findChildGrade`;
  return request(
    reqUrl,
    Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) })
  );
};
const getChildCourses = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/zmChildCourseSystem/findAll`;
  return request(
    reqUrl,
    Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) })
  );
};
const findSubjectByGradeDictCode = (gradeDictCode) => {
  const reqUrl = `${Config.zmtrlink}/api/subject/findSubjectByGradeDictCode/${gradeDictCode}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()));
};
/**
 * 视频录播课列表（mock）
 * @param gradeDictCode
 */
const getCourseSystemVideos = (params) => {
  const reqUrl = `${Config.zmtrlink}/api/zmChildCsAudio/findAll`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
export default {
  getChildSubject,
  getChildSubjectGrade,
  getChildGrade,
  getChildCourses,
  getAllSubject,
  getSubjectByGradeId,
  findSubjectByGradeDictCode,
  getCourseSystemVideos
};
