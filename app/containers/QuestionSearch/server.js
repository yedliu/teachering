import questionAip from '../../api/qb-cloud/question-endpoint';
import courseSystemApi from 'api/tr-cloud/course-system-endpoint';
import knowledgeApi from 'api/tr-cloud/knowledge-endpoint';
import gradeApi from 'api/tr-cloud/grade-endpoint';
import phaseSubjectApi from 'api/tr-cloud/phase-subject-endpoint';

const requestTimeOut = 30 * 1000;

function backPromise(dataList) {
  return new Promise((re1, re2) => {
    if (dataList.length > 0) {
      re1({ code: '0', data: dataList, message: '' });
    } else {
      re2({ code: '1', data: [], message: '初始化失败' });
    }
  });
}
// 年级
const grade = () => {
  return gradeApi.getGrade();
};
const phaseSubject = () => {
  return phaseSubjectApi.findAllPhaseSubject();
};
const knowledge = (params) => {
  // const reqUrl = `${Config.trlink}/api/knowledge`;
  if (params && params.phaseSubjectId > 0) {
    // return request(reqUrl, Object.assign({}, getjsonoptions()), params);
    return knowledgeApi.findAllByPhaseSubjectIdForTr(params);
  }
  if (!params || !params.phaseSubjectId) {
    console.log('%c获取版本时必须传入年级与学科的 id', 'color:red;text-shadow:1px 2px 0 rgba(255, 0, 0, .3);font-size:16px;'); // eslint-disable-line
  }
  return backPromise([]);
};
const courseSystem = (params) => {
  // const reqUrl = `${Config.trlink}/api/courseSystem`;
  if (params && params.gradeId > 0 && params.subjectId > 0 && params.editionId) {
    return courseSystemApi.getClassType(params);
  }
  if (!params || !params.gradeId || !params.subjectId) {
    console.log('%c获取版本时必须传入年级与学科的 id', 'color:red;text-shadow:1px 2px 0 rgba(255, 0, 0, .3);font-size:16px;'); // eslint-disable-line
  }
  return backPromise([]);
};
const questions = (params) => {
  params.excludeInfo = {
    excludeTypeIdList: [50, 51, 52],
  };
  return questionAip.getQuestionWithEncryptForTr(params, requestTimeOut);
};

// 根据学段获取所属年级学科
const getFirstGradeSubject = async parseSubjectId => {
  let data = {};
  try {
    const res = await phaseSubjectApi.getFirstGradeSubject(parseSubjectId);
    if (Number(res.code) === 0) {
      data = res.data || {};
    } else {
      message.error(res.message || '获取年级学科失败');
    }
  } catch (error) {
    console.log(error);
    message.error('系统异常，获取年级学科失败');
  }
  return data;
};
// 根据年级学科获取所属学段
const getParseSubject = async (gradeId, subjectId) => {
  let data = void 0;
  try {
    const res = await phaseSubjectApi.getParseSubject(gradeId, subjectId);
    if (Number(res.code) === 0) {
      data = res.data || void 0;
    } else {
      message.error(res.message || '获取学段失败');
    }
  } catch (error) {
    console.log(error);
    message.error('系统异常，获取学段失败');
  }
  return data;
};

const getData = {
  grade,
  phaseSubject,
  knowledge,
  courseSystem,
  questions,
  getFirstGradeSubject,
  getParseSubject,
};
export default getData;
