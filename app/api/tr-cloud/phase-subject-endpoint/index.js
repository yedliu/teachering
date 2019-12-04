import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

const getAll = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/phaseSubject/findAll`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 获取学段学科
const findAllPhaseSubject = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/phaseSubject/findAllPhaseSubject`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const findAllSubject = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/phaseSubject/findSubject/subject`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const findGradeByPhaseId = (phaseId, params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/phaseSubject/findGrade/grade/${phaseId}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 根据学科idList获取学段
const getPhaseBySubjectList = (params) => {
  const reqUrl = `${Config.zmtrlink}/api/phaseSubject/findParseSubjectsBySubjectIdList`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 根据ParseSubjectId查询当前学段第一个年级加当前学科
const getFirstGradeSubject = (parseSubjectId, params) => {
  const reqUrl = `${Config.zmtrlink}/api/phaseSubject/getFirstGradeSubjectByParseSubjectId/${parseSubjectId}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 根据学段ID和学科ID查询学段学科ID
const getParseSubject = (gradeId, subjectId, params) => {
  const reqUrl = `${Config.zmtrlink}/api/phaseSubject/getParseSubjectByGradeSubject/${gradeId}/${subjectId}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
export default {
  getAll,
  findAllPhaseSubject,
  findAllSubject,
  findGradeByPhaseId,
  getPhaseBySubjectList,
  getFirstGradeSubject,
  getParseSubject
};
