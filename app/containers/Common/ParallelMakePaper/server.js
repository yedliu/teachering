import queryNode from '../../../api/qb-cloud/sys-dict-end-point';
import queryGrade from '../../../api/tr-cloud/grade-endpoint';
import queryTerm from '../../../api/tr-cloud/term-endpoint';
import queryRegion from '../../../api/qb-cloud/region-end-point';
// import queryExamType from '../../../api/qb/exam-type-controller';
// import queryNode from '../../../api/qb-cloud/sys-dict-end-point'
import queryNodeList from '../../../api/qb-cloud/sys-dict-end-point/queryNodesByGroupList';
import parallelPaper from '../../../api/qb-cloud/exam-paper-end-point';
import { handleRequest } from 'utils/helpfunc';
import { message } from 'antd';
export const getFieldsData = async (allFormData, that, selectPaper) => {
  let target = allFormData;
  let apis = [
    queryGrade.getGrade,
    queryNode.queryPaperPurpose,
    queryNode.queryPaperTarget,
    queryNode.queryEpBu,
    queryTerm.getAllTerm,
    queryRegion.getProvince,
    queryNode.queryExamType,
  ];
  let types = [
    'gradeId',
    'evaluationPurpose',
    'evaluationTarget',
    'epBu',
    'termId',
    'provinceId',
    'examTypeId',
  ];
  for (let i = 0; i < apis.length; i++) {
    apis[i]().then(res => {
      if (res.code === '0') {
        target.forEach((item, index) => {
          if (item.type === types[i]) {
            target[index].data = res.data;
            if (item.type === 'provinceId') {
              target[index].data.unshift({ id: 0, name: '全国' });
            }
            /* if (item.type === 'termId') {
              target[index].data.unshift({ id: -1, name: '全部' });
            } */
          }
        });
        that.setState({ allFormListData: target });
      } else {
        message.warning(`${res.message}`);
      }
    });
  }
  // 年份和来源
  let res = await queryNodeList(['QB_EXAM_PAPER_SOURCE', 'QB_YEAR', 'QB_PURPOSE', 'QB_EXAM_PAPER_DIFFICULTY', 'QB_ONLINE_FLAG', 'QB_PAPER_CARD']);
  if (res.code === '0') {
    target.forEach((item, index) => {
      if (item.type === 'source') {
        target[index].data = res.data['QB_EXAM_PAPER_SOURCE'];
      }
      if (item.type === 'year') {
        target[index].data = res.data['QB_YEAR'];
      }
      if (item.type === 'purpose') {
        const data = res.data['QB_PURPOSE'];
        data.unshift({ id: -1, name: '全部' });
        target[index].data = data;
      }
      if (item.type === 'onlineFlag') {
        target[index].data = res.data['QB_ONLINE_FLAG'];
      }
      if (item.type === 'difficulty') {
        target[index].data = res.data['QB_EXAM_PAPER_DIFFICULTY'];
      }
      if (item.type === 'businessCardId') {
        target[index].data = res.data['QB_PAPER_CARD'];
      }
    });
  } else {
    message.warning(`${res.message}`);
  }
  // 如果有省则查市，如果有市再查县/区
  if (selectPaper.provinceId) {
    let cities = await getCityData(selectPaper.provinceId);
    target.forEach((item, index) => {
      if (item.type === 'cityId') {
        target[index].data = cities;
      }
    });
  }
  if (selectPaper.cityId) {
    let countries = await getCountryData(selectPaper.cityId);
    target.forEach((item, index) => {
      if (item.type === 'countyId') {
        target[index].data = countries;
      }
    });
  }
  that.setState({ allFormListData: target });
  return target;
};

export const getCityData = async provinceId => {
  let res = await queryRegion.getCityByProvinceId(provinceId);
  if (res.code === '0') {
    return res.data;
  } else {
    message.warning(`${res.message}`);
    return [];
  }
};

export const getCountryData = async cityId => {
  let res = await queryRegion.getCountyByCityId(cityId);
  if (res.code === '0') {
    return res.data;
  } else {
    message.warning(`${res.message}`);
    return [];
  }
};

export const getParallelPaper = async examPaperId => {
  let res = await parallelPaper.getParallelPaper({ examPaperId });
  if (res.code === '0') {
    return res.data;
  } else {
    message.warning(`${res.message}`);
    return {};
  }
};

// 获取推荐题目id
export const getRecommendQuestionIds = async (params) => {
  let res = await  handleRequest(parallelPaper.queryParallelQuestionIds, { params });
  res = await handleBatchGetQuestions(res, params.examPaperId);
  return res;
};

// 根据ids分批拿题目
export const getQuestionsByIds = (params) => {
  return handleRequest(parallelPaper.queryParallelQuestionsByIds, { params });
};

// 分批获取题目详情
const handleBatchGetQuestions =  async (data, epId) => {
  // questions 大题列表
  // examPaperContentQuestionOutputDTOList 小题列表
  let questions = data.examPaperContentOutputDTOList;
  if (!questions) {
    message.warning('获取数据失败');
    return {};
  }
  let questionIdList = [];
  questions.forEach(item => {
    item.examPaperContentQuestionOutputDTOList.forEach(it => {
      questionIdList.push(it.questionId);
    });
  });
  let queryQueue = [];
  let limit = 5;
  let obj = { ids: [] };
  questionIdList.forEach((item, index) => {
    if (index > 0 && index % limit === 0) {
      queryQueue.push(obj);
      obj = { ids: [] };
    }
    obj.ids.push(item);
  });
  if (obj.ids.length > 0) {
    queryQueue.push(obj);
  }
  let target = {};
  let exceptIdList = questionIdList;
  async function loop(ids, len, index) {
    await getQuestionsByIds({ questionIdList: ids, epId, exceptIdList }).then(async res => {
      target = { ...target, ...res };
      exceptIdList = [...exceptIdList, ...getOneBatchIds(res)];
      if (index < len - 1) {
        await loop(queryQueue[index + 1].ids, len, index + 1);
      } else {
        return target;
      }
    });
  }
  await loop(queryQueue[0].ids, queryQueue.length, 0);
  let unRecommondQuestionNum = 0;
  questions.forEach(item => {
    item.examPaperContentQuestionOutputDTOList.forEach(it => {
      if (target[it.questionId]) {
        it.recommendNewQuestionOutputDTO = target[it.questionId];
      } else {
        unRecommondQuestionNum += 1;
      }
    });
  });
  data.examPaperContentOutputDTOList = questions;
  data.unRecommondQuestionNum = unRecommondQuestionNum;
  return data;
};

// 获取每批题目id
const getOneBatchIds = (data) => {
  let arr = Object.values(data);
  arr = arr.map(item => item.id);
  return arr;
};
