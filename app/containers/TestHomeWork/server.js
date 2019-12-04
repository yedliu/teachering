import phaseSubjectApi from 'api/tr-cloud/phase-subject-endpoint';

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
