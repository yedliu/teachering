import { message } from 'antd';
import questionApi from '../../api/qb-cloud/question-endpoint';
// import gradeApi from 'api/tr-cloud/grade-endpoint';
import queryNodeApi from 'api/qb-cloud/sys-dict-end-point';
import regionApi from 'api/qb-cloud/region-end-point';
import termApi from 'api/tr-cloud/term-endpoint';
import phaseSubjectApi from 'api/tr-cloud/phase-subject-endpoint';
import knowledgeApi from 'api/tr-cloud/knowledge-endpoint';
import childExamApi from 'api/qb-cloud/child-exam-paper-endpoint';

export const getPhaseSubject = async () => {
  try {
    const res = await phaseSubjectApi.findAllPhaseSubject();
    if (`${res.code}` === '0') {
      return res.data || [];
    } else {
      message.error(res.message || '获取学段学科失败');
      return [];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getKnowledge = async (phaseSubjectId) => {
  try {
    const res = await knowledgeApi.findAllByPhaseSubjectIdForTr({ phaseSubjectId });
    if (`${res.code}` === '0') {
      return res.data || [];
    } else {
      message.error(res.message || '获取知识点失败');
      return [];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getProvince = async () => {
  try {
    const res = await regionApi.getProvince();
    if (`${res.code}` === '0') {
      return [{ id: 0, name: '全国' }].concat(res.data) || [];
    } else {
      message.error(res.message || '获取省失败');
      return [];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getCity = async provinceId => {
  try {
    const res = await regionApi.getCityByProvinceId(provinceId);
    if (`${res.code}` === '0') {
      return res.data || [];
    } else {
      message.error(res.message || '获取市失败');
      return [];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getCounty = async cityId => {
  try {
    const res = await regionApi.getCountyByCityId(cityId);
    if (`${res.code}` === '0') {
      return res.data || [];
    } else {
      message.error(res.message || '获取区失败');
      return [];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getGrade = async () => {
  try {
    const res = await childExamApi.getChildGrade();
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

export const getTerm = async () => {
  try {
    const res = await termApi.getAllTerm();
    if (`${res.code}` === '0') {
      return res.data || [];
    } else {
      message.error(res.message || '获取学期失败');
      return [];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getQuestionType = async () => {
  try {
    const res = await queryNodeApi.queryChildQuestionType();
    if (`${res.code}` === '0') {
      return res.data || [];
    } else {
      message.error(res.message || '获取题型失败');
      return [];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getDictData = async () => {
  const groupEnum = {
    QB_EXAM_TYPE: 'examTypeList', // 卷型
    QB_EXAM_PAPER_TYPE: 'paperTypeList', // 试卷类型
    QB_YEAR: 'yearList', // 题库-年份
    QB_QUESTION_DIFFICULTY: 'difficultyList', // 题目难度
  };
  const groupList = Object.keys(groupEnum);
  let data = {};
  try {
    const res = await queryNodeApi.queryNodesByGroupList(groupList);
    if (`${res.code}` === '0') {
      data = res.data || {};
    } else {
      message.error(res.message || '获取数据失败');
    }
  } catch (err) {
    console.error(err);
  }
  const newData = {};
  groupList.forEach(el => {
    newData[groupEnum[el]] = data[el] || [];
  });
  return newData;
};

export const getQuestion = async (params) => {
  try {
    const res = await questionApi.getQuestionWithEncryptForTr(params);
    if (`${res.code}` === '0') {
      return res.data || {};
    } else {
      message.error(res.message || '获取题目数据失败');
      return {};
    }
  } catch (err) {
    console.error(err);
    return {};
  }
};

export const getKnowledgeType = async () => {
  try {
    const res = await queryNodeApi.queryKnowledgeType();
    if (`${res.code}` === '0') {
      return res.data || [];
    } else {
      message.error(res.message || '获取知识点类型失败');
      return [];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};
