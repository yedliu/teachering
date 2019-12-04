import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

// 查能力列表
const queryBaseAbility = (params) => {
  const reqUrl = `${Config.zmcqLink}/api/baseAbility/queryBaseAbility`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 新增能力
const addBaseAbility = (params) => {
  const reqUrl = `${Config.zmcqLink}/api/baseAbility/addBaseAbility`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 修改能力
const updateBaseAbility = (params) => {
  const reqUrl = `${Config.zmcqLink}/api/baseAbility/updateBaseAbility`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 查能力下的学科
const queryBaseAbilitySubjectList = (params) => {
  const reqUrl = `${Config.zmcqLink}/api/baseAbility/queryBaseAbilitySubjectList?abilityId=${params.abilityId}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()));
};
// 改备注
const updateBaseAbilitySubjectInfo = (params) => {
  const reqUrl = `${Config.zmcqLink}/api/baseAbility/updateBaseAbilitySubjectInfo`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 根据学科查所有能力
const queryBaseAbilityBySubject = (params) => {
  const reqUrl = `${Config.zmcqLink}/api/baseAbility/queryBaseAbilityBySubject?subjectId=${params.subjectId}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()));
};

// 根据学科学段查能力
const queryAbilityBySubjectAndPhase = (params) => {
  const reqUrl = `${Config.zmcqLink}/api/baseAbility/queryBySubjectIdPhaseId`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 根据学科年级查能力
const queryBySubjectIdGradeId = (params) => {
  const reqUrl = `${Config.zmcqLink}/api/baseAbility/queryBySubjectIdGradeId`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
export default {
  queryBaseAbility,
  addBaseAbility,
  updateBaseAbility,
  queryBaseAbilitySubjectList,
  updateBaseAbilitySubjectInfo,
  queryBaseAbilityBySubject,
  queryAbilityBySubjectAndPhase,
  queryBySubjectIdGradeId,
};
