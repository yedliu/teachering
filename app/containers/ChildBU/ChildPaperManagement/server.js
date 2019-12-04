import { message } from 'antd';
import queryNodeApi from 'api/qb-cloud/sys-dict-end-point';
import childExamApi from 'api/qb-cloud/child-exam-paper-endpoint';
import editionApi from 'api/tr-cloud/zm-child-edition-endpoint';
import subjectApi from 'api/tr-cloud/subject-endpoint';
import courseSystemApi from 'api/tr-cloud/zm-child-course-system-endpoint';

export const getGradeList = async () => {
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

export const getChildPaperType = async () => {
  try {
    const res = await queryNodeApi.queryChildPaperType();
    if (`${res.code}` === '0') {
      return res.data || [];
    } else {
      message.error(res.message || '获取试卷类型失败');
      return [];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getSubjectGrade = async () => {
  try {
    const res = await subjectApi.getChildSubjectGrade();
    if (`${res.code}` === '0') {
      const resData = res.data || [];
      const data = resData.map(item => {
        return {
          id: item.value,
          name: item.label,
          children: item.children // 遍历出所有的年级改成 {id, name} 的格式。
            ? item.children.map(el => {
              return { id: el.value, name: el.label };
            })
            : []
        };
      });
      return data;
    } else {
      message.error(res.message || '获取学科失败');
      return [];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getChildDifficulty = async () => {
  try {
    const res = await queryNodeApi.queryChildDifficulty();
    if (`${res.code}` === '0') {
      return res.data || [];
    } else {
      message.error(res.message || '获取试卷难度失败');
      return [];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getYearList = async () => {
  try {
    const res = await queryNodeApi.queryYear();
    if (`${res.code}` === '0') {
      return res.data || [];
    } else {
      message.error(res.message || '获取年份失败');
      return [];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getStateList = async () => {
  try {
    const res = await queryNodeApi.queryOnlineFlag();
    if (`${res.code}` === '0') {
      return res.data || [];
    } else {
      message.error(res.message || '获取上下架状态失败');
      return [];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const saveExamPaper = async params => {
  try {
    const res = await childExamApi.saveExamPaper(params);
    if (`${res.code}` === '0') {
      return res.data || [];
    } else {
      message.error(res.message || '试卷保存失败');
      return false;
    }
  } catch (err) {
    console.error(err);
    message.error('系统异常请稍后再试');
    return false;
  }
};

export const updateExamPaper = async params => {
  try {
    const res = await childExamApi.updateExamPaper(params);
    if (`${res.code}` === '0') {
      return res.data || [];
    } else {
      message.error(res.message || '试卷更新失败');
      return false;
    }
  } catch (err) {
    console.error(err);
    message.error('系统异常请稍后再试');
    return false;
  }
};


export const getEdition = async params => {
  let data = [];
  try {
    const res = await editionApi.getEdition(params);
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

export const getCourseSystem = async params => {
  let data = [];
  try {
    const res = await courseSystemApi.getCourseSystem(params);
    if (Number(res.code) === 0) {
      data = res.data || [];
    } else {
      message.error(res.message || '获取正式课课程失败');
    }
  } catch (err) {
    console.error(err);
    message.error('系统异常请稍后再试');
  }
  return data;
};

export const getExamPaperList = async (params) => {
  let data = [];
  try {
    const res = await childExamApi.queryExamPaper(params);
    if (Number(res.code) === 0) {
      data = res.data || [];
    } else {
      message.error(res.message || '获取试卷列表失败');
    }
  } catch (err) {
    console.error(err);
    message.error('系统异常请稍后再试');
  }
  return data;
};

export const getExamPaperDetail = async (params) => {
  let data = [];
  try {
    const res = await childExamApi.findExamPaperDetail(params);
    if (Number(res.code) === 0) {
      data = res.data || {};
    } else {
      message.error(res.message || '获取试卷详情失败');
    }
  } catch (err) {
    console.error(err);
    message.error('系统异常请稍后再试');
  }
  return data;
};

export const deleteExamPaper = async (params) => {
  let succeed = false;
  try {
    const res = await childExamApi.deleteExamPaper(params);
    if (Number(res.code) === 0) {
      succeed = true;
    } else {
      message.error(res.message || '试卷删除失败');
    }
  } catch (err) {
    console.error(err);
    message.error('系统异常请稍后再试');
  }
  return succeed;
};

export const onlineExamPaper = async (params) => {
  let succeed = false;
  try {
    const res = await childExamApi.online(params);
    if (Number(res.code) === 0) {
      succeed = true;
    } else {
      message.error(res.message || '试卷上架失败');
    }
  } catch (err) {
    console.error(err);
    message.error('系统异常请稍后再试');
  }
  return succeed;
};

export const offlineExamPaper = async (params) => {
  let succeed = false;
  try {
    const res = await childExamApi.offline(params);
    if (Number(res.code) === 0) {
      succeed = true;
    } else {
      message.error(res.message || '试卷下架失败');
    }
  } catch (err) {
    console.error(err);
    message.error('系统异常请稍后再试');
  }
  return succeed;
};