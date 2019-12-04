// import Config from 'utils/config';
// import request, { geturloptions } from 'utils/request';
import { mathToUnify } from 'components/CommonFn';
import { message } from 'antd';
import subjectApi from 'api/tr-cloud/subject-endpoint';
import knowledgeApi from 'api/tr-cloud/knowledge-endpoint';
import gradeApi from 'api/tr-cloud/grade-endpoint';
import examPointApi from 'api/tr-cloud/exam-point-endpoint';
import regionApi from 'api/qb-cloud/region-end-point';
import queryNodeApi from 'api/qb-cloud/sys-dict-end-point';
import testCourseSystemApi from 'api/tr-cloud/zm-child-test-course-system-endpoint';
import phaseSubjectApi from 'api/tr-cloud/phase-subject-endpoint';

// 获取年级
export const getGradeData = options => {
  // let reqUrl = `${Config.trlink}/api/courseSystem/grade`;
  // return request(reqUrl, Object.assign({}, geturloptions()));
  return gradeApi.getGrade();
};

// 获取学科
export const getSubjectListWithGrade = gradeId => {
  // console.log('获取学科根据年级gradeId', gradeId);
  // if (gradeId < 0) return;
  // const reqUrl = `${Config.trlink}/api/phaseSubject/subject`;
  // return request(reqUrl, Object.assign({}, geturloptions()), { gradeId });
  return subjectApi.getSubjectByGradeId(gradeId);
};

// 获取知识点
export const getKonwLeadgeWithGraAndSub = (gradeId, subjectId) => {
  // const reqUrl = `${Config.trlink}/api/knowledge`;
  const params = mathToUnify({
    gradeId,
    subjectId,
  });
  // return request(reqUrl, Object.assign({}, geturloptions()), params);
  return knowledgeApi.findAllByPhaseSubjectIdForTr(params);
};

// 获取考点
export const getExamPointList = (gradeId, subjectId) => {
  // const reqUrl = `${Config.trlink}/api/examPoint`;
  const params = mathToUnify({
    gradeId,
    subjectId,
  });
  // return request(reqUrl, Object.assign({}, geturloptions()), params);
  return examPointApi.getExamPoint(params);
};

// 获取题型
export const getQuestionTypes = () => {
  // const reqUrl = `${Config.trlink_qb}/api/questionType`;
  // return request(reqUrl, Object.assign({}, geturloptions()), {});
  return queryNodeApi.queryAllQuestionType();
};

// 获取省份
export const getProvince = () => {
  // const reqUrl = `${Config.trlink_qb}/api/region/province`;
  // return request(reqUrl, Object.assign({}, geturloptions()), {});
  return regionApi.getProvince();
};

// 获取少儿BU课程
export const fetchChildBUCourses = async params => {
  const res = await subjectApi.getChildCourses(params);
  let data = [];
  if (Number(res.code) === 0) {
    const resData = res.data || [];
    data = resData;
  } else {
    message.error(res.message || '获取课程失败');
  }
  return new Promise(resolve => resolve(data));
};

// 获取少儿测评课课程
export const getTestCourseSystem = async params => {
  let data = [];
  try {
    const res = await testCourseSystemApi.getTestCourseSystem(params);
    if (Number(res.code) === 0) {
      data = res.data || [];
    } else {
      message.error(res.message || '获取测评课课程失败');
    }
  } catch (error) {
    console.log(error);
    message.error('系统异常，获取测评课课程失败');
  }
  return data;
};
// 根据学段获取所属年级学科
export const getFirstGradeSubject = async parseSubjectId => {
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
export const getParseSubject = async (gradeId, subjectId) => {
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
