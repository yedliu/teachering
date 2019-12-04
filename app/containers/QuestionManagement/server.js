import Config from 'utils/config';
import request, { geturloptions } from 'utils/request';
import { mathToUnify } from 'components/CommonFn';
import courseSystemApi from 'api/tr-cloud/course-system-endpoint';
import examPaperEndPoint from '../../api/qb-cloud/exam-paper-end-point';
import { message } from 'antd';
import gradeApi from 'api/tr-cloud/grade-endpoint';
import phaseSubjectApi from 'api/tr-cloud/phase-subject-endpoint';
// 获取年级
export const getGradeData = options => {
  // const reqUrl = `${Config.trlink}/api/courseSystem/grade`;
  return gradeApi.getGrade();
  // request(reqUrl, Object.assign({}, geturloptions()));
};

// 获取学科
export const getSubjectListWithGrade = gradeId => {
  console.log('获取学科根据年级gradeId', gradeId);
  if (gradeId < 0) return;
  const reqUrl = `${Config.trlink}/api/phaseSubject/subject`;
  return request(reqUrl, Object.assign({}, geturloptions()), {
    gradeId: gradeId,
  });
};

// 获取知识点
export const getKonwLeadgeWithGraAndSub = (gradeId, subjectId) => {
  const reqUrl = `${Config.trlink}/api/knowledge`;
  const params = mathToUnify({
    gradeId: gradeId,
    subjectId: subjectId,
  });
  return request(reqUrl, Object.assign({}, geturloptions()), params);
};

// 获取考点
export const getExamPointList = (gradeId, subjectId) => {
  const reqUrl = `${Config.trlink}/api/examPoint`;
  const params = mathToUnify({
    gradeId: gradeId,
    subjectId: subjectId,
  });
  return request(reqUrl, Object.assign({}, geturloptions()), params);
};

export const getQuestionTypes = () => {
  const reqUrl = `${Config.trlink_qb}/api/questionType`;
  return request(reqUrl, Object.assign({}, geturloptions()), {});
};

// 获取教材目录
export const getTeachingVersions = (subjectId, gradeId, gradeList) => {
  // eslint-disable-next-line eqeqeq
  const curGrade = gradeList.find(item => item.id == gradeId);
  const reqUrl = `${Config.trlink}/api/textbookEdition`;
  return request(reqUrl, Object.assign({}, geturloptions()), {
    subjectId,
    phaseId: curGrade.phaseId,
  });
};

// 获取教材版本
export const getTeachingVersionList = (editionId, parentId, gradeId) => {
  const reqUrl = `${Config.trlink}/api/textbook/list`;
  return request(reqUrl, Object.assign({}, geturloptions()), {
    editionId,
    parentId,
    gradeId,
  });
};

// 获取课程体系版本
export const getCourseSystemVersion = (subjectId, gradeId) => {
  const reqUrl = `${Config.trlink}/api/edition`;
  return request(reqUrl, Object.assign({}, geturloptions()), {
    subjectId,
    gradeId,
  });
};

// 获取课程体系
export const getCourseSystemList = (gradeId, subjectId, editionId) => {
  // const reqUrl = `${Config.trlink}/api/courseSystem`;
  // return request(reqUrl, Object.assign({}, geturloptions()), { gradeId, subjectId, editionId });
  return courseSystemApi.getClassType({ gradeId, subjectId, editionId });
};

// 智能换题
export const getAiReplaceQuestions = async params => {
  try {
    let res = await examPaperEndPoint.getAiReplaceQuestion(params);
    if (res.code === '0') {
      return res.data;
    } else {
      message.warning(res.message);
      return [];
    }
  } catch (e) {
    console.error(e);
    return [];
  }
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
