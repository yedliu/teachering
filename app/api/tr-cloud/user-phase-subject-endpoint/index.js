import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

// 获取教研有权限的学段
const findPhase = (params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/userPhaseSubject/findPhase`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const findSubjectByPhase = (phaseId, params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/userPhaseSubject/findSubjectByPhase/${phaseId}`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const findGrade = (params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/userPhaseSubject/findGrade`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const findSubjectByGrade = (gradeId, params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/userPhaseSubject/findSubjectByGrade/${gradeId}`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

export default {
  findPhase,
  findSubjectByPhase,
  findGrade,
  findSubjectByGrade
};