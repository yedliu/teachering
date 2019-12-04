// import Config from 'utils/config';
// import {
//   distinctionList,
//   comprehensiveDegreeList,
//   ratingList,
//   paperCardList,
// } from 'utils/zmConfig';
// import { purposeList } from 'utils/immutableEnum';
// import request, { getjsonoptions } from 'utils/request';
import queryNode from '../../api/qb-cloud/sys-dict-end-point';
import termApi from 'api/tr-cloud/term-endpoint';
import regionApi from 'api/qb-cloud/region-end-point';
import gradeApi from 'api/tr-cloud/grade-endpoint';
import subjectApi from 'api/tr-cloud/subject-endpoint';
import editionApi from 'api/tr-cloud/edition-endpoint';

// 去掉所有的这个选项
// const removeAllSelect = list => {
//   if (list && (!list[0].id || list[0].name === '全部')) {
//     list.shift();
//   }
//   return list;
// };

export const backPromise = dataList => {
  return new Promise((re1, re2) => {
    if (dataList.length > 0) {
      re1({ code: '0', data: dataList, message: '' });
    } else {
      re2({ code: '1', data: [], message: '初始化失败' });
    }
  });
};

export const paperType = () => {
  return queryNode.queryExamPaperType();
};

const grade = () => {
  // const reqUrl = `${Config.trlink}/api/grade`;
  // return request(reqUrl, Object.assign({}, getjsonoptions()));
  return gradeApi.getGrade();
};
// 学科，所有的
const subject = () => {
  // const reqUrl = `${Config.trlink}/api/subject`;
  // return request(reqUrl, Object.assign({}, getjsonoptions()));
  return subjectApi.getAllSubject();
};

const year = () => {
  return queryNode.queryYear();
};

const difficulty = () => {
  return queryNode.queryPaperDifficulty();
};
const scene = () => {
  // 改成线上数据
  return queryNode.queryScene();
};
const distinction = () => {
  // const list = removeAllSelect(distinctionList);
  // return backPromise(list);
  return queryNode.queryDistinction();
};
const comprehensiveDegree = () => {
  // const list = removeAllSelect(comprehensiveDegreeList);
  // return backPromise(list);

  return queryNode.queryComprehensiveDegree();
};
// 评级
const rating = () => {
  // const list = removeAllSelect(ratingList);
  // return backPromise(list);
  return queryNode.queryRating();
};
// 试卷名片
const businessCard = () => {
  // const list = removeAllSelect(paperCardList);
  // return backPromise(list);
  return queryNode.queryPaperCard();
};
// 用途
const purpose = () => {
  return queryNode.queryPurpose();
};

// 学期
const term = () => {
  // const reqUrl = `${Config.trlink}/api/term`;
  // return request(reqUrl, Object.assign({}, getjsonoptions()));
  return termApi.getAllTerm();
};
// 版本
const edition = params => {
  // const reqUrl = `${Config.trlink}/api/edition`;
  // if (params && params.gradeId > 0 && params.subjectId > 0) {
  //   return request(reqUrl, Object.assign({}, getjsonoptions()), params);
  // }
  // if (!params || !params.gradeId || !params.subjectId) {
  //   console.log('%c获取版本时必须传入年级与学科的 id', 'color:red;text-shadow:1px 2px 0 rgba(255, 0, 0, .3);font-size:16px;');
  // }
  // return backPromise([]);
  return editionApi.getEdition(params);
};
// 省
const province = () => {
  // const reqUrl = `${Config.trlink_qb}/api/region/province`;
  // return request(reqUrl, Object.assign({}, getjsonoptions()));
  return regionApi.getProvince();
};
// 市
const city = params => {
  // const reqUrl = `${Config.trlink_qb}/api/region/city`;
  // if (params && params.provinceId > 0) {
  //   return request(reqUrl, Object.assign({}, getjsonoptions()), params);
  // }
  // if (!params || !params.provinceId) {
  //   console.log('%c获取城市列表时必须传入省 id', 'color:red;text-shadow:1px 2px 0 rgba(255, 0, 0, .3);font-size:16px;');
  // }
  // return backPromise([]);
  return regionApi.getCityByProvinceId(params.provinceId);
};
// 县
const county = params => {
  // const reqUrl = `${Config.trlink_qb}/api/region/county`;
  // if (params && params.cityId > 0) {
  //   return request(reqUrl, Object.assign({}, getjsonoptions()), params);
  // }
  // if (!params || !params.cityId) {
  //   console.log('%c获取县列表时必须传入城市 id', 'color:red;text-shadow:1px 2px 0 rgba(255, 0, 0, .3);font-size:16px;');
  // }
  // return backPromise([]);
  return regionApi.getCountyByCityId(params.cityId);
};
// 题型
const questionType = () => {
  // const reqUrl = `${Config.trlink_qb}/api/questionType`;
  // return request(reqUrl, Object.assign({}, getjsonoptions()));
  return queryNode.queryAllQuestionType();
};
// 题目来源
const source = () => {
  // console.log('questionSource - questionSource');
  // const reqUrl = `${Config.trlink_qb}/api/questionSource/root`;
  // return request(reqUrl, Object.assign({}, getjsonoptions()));
  return queryNode.queryQuestionSource();
};
// 来源明细
// const sourceChilds = (num) => {
//   const reqUrl = `${Config.trlink_qb}/api/questionSource/childs/${num}`;
//   return request(reqUrl, Object.assign({}, getjsonoptions()));
// };
// 卷型
const examType = () => {
  // const reqUrl = `${Config.trlink_qb}/api/examType`;
  // return request(reqUrl, Object.assign({}, getjsonoptions()));
  return queryNode.queryExamType();
};

// 试卷来源
const examPaperSource = () => {
  return queryNode.queryExamPaperSource();
};

const evaluationTarget = () => {
  return queryNode.queryPaperTarget();
};

const evaluationPurpose = () => {
  return queryNode.queryPaperPurpose();
};

const epBu = () => {
  return queryNode.queryEpBu();
};

const knowledgeType = () => {
  return queryNode.queryKnowledgeType();
};

const getData = {
  grade,
  year,
  paperType,
  term,
  edition,
  province,
  city,
  businessCard,
  county,
  examType,
  difficulty,
  questionType,
  source,
  scene,
  distinction,
  comprehensiveDegree,
  rating,
  subject,
  purpose,
  examPaperSource,
  evaluationTarget,
  evaluationPurpose,
  epBu,
  knowledgeType
};

export default getData;
