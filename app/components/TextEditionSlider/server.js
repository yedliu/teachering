import { message } from 'antd';
import gradeApi from 'api/tr-cloud/grade-endpoint';
import subjectApi from 'api/tr-cloud/user-phase-subject-endpoint';
import editionApi from 'api/tr-cloud/textbook-edition-endpoint';
import textbookApi from 'api/tr-cloud/textbook-endpoint';
import knowledgeApi from 'api/tr-cloud/knowledge-endpoint';

export const getGradeList = async () => {
  try {
    const res = await gradeApi.getGrade();
    if (`${res.code}` === '0') {
      return res.data || [];
    } else {
      message.error(res.message || '获取年级失败');
      return [];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getSubjectList = async (gradeId) => {
  try {
    const res = await subjectApi.findSubjectByGrade(gradeId);
    if (`${res.code}` === '0') {
      return res.data || [];
    } else {
      message.error(res.message || '获取学科失败');
      return [];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getEdition = async (gradeId, subjectId) => {
  let data = [];
  try {
    const res = await editionApi.getEditionList(gradeId, subjectId);
    if (Number(res.code) === 0) {
      data =
        (res.data &&
          res.data.map(item => {
            return { id: `${item.id}`, name: item.name };
          })) ||
        [];
    } else {
      message.error(res.message || '获取课程体系失败');
    }
  } catch (err) {
    console.error(err);
    message.error('系统异常请稍后再试');
  }
  return data;
};

export const getTextbook = async (gradeId, subjectId, editionId) => {
  let data = [];
  try {
    const res = await textbookApi.findAllByCondition({ gradeId, subjectId, editionId });
    if (Number(res.code) === 0) {
      data = res.data || [];
    } else {
      message.error(res.message || '获取教材目录失败');
    }
  } catch (err) {
    console.error(err);
    message.error('系统异常请稍后再试');
  }
  return data;
};

export const findKnowledges = async (textbookId) => {
  let data = [];
  try {
    const res = await textbookApi.findKnowledges(textbookId);
    if (Number(res.code) === 0) {
      data = res.data || [];
    } else {
      message.error(res.message || '获取教材目录失败');
    }
  } catch (err) {
    console.error(err);
    message.error('系统异常请稍后再试');
  }
  return data;
};

export const findCurrentTextBookKnowledge = async (textbookId) => {
  let data = [];
  try {
    const res = await knowledgeApi.findCurrentTextBookKnowledge(textbookId);
    if (Number(res.code) === 0) {
      data = res.data || [];
    } else {
      message.error(res.message || '获取知识点失败');
    }
  } catch (err) {
    console.error(err);
    message.error('系统异常请稍后再试');
  }
  return data;
};

