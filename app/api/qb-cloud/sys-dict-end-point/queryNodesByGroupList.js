import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';
import cacheData from './cache';

// 请求数据字典(批量查询)
const queryNodesByGroupList = async (typeList) => {
  const type = typeList.sort().join('-');
  const cacheTypeData = cacheData[type] || {};
  const nowTime = new Date().getTime();
  if (nowTime - cacheTypeData.fetchTime < cacheData.cacheTime) {
    return cacheTypeData;
  }
  const reqUrl = `${Config.zmcqLink}/api/sysDict/queryNodesByGroupList`;
  const repos = request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(typeList) }));
  return repos.then((res) => {
    const data = res.data || {};
    // eslint-disable-next-line guard-for-in
    for (let key in data) {
      data[key] = data[key].map((item) => Object.assign({}, item, { id: item.itemCode, name: item.itemName }));
    }
    if (Number(res.code) === 0) {
      const newData = Object.assign({}, res, {
        fetchTime: nowTime,
        data,
      });
      cacheData[type] = newData;
    } else {
      cacheData[type] = res;
    }
    return cacheData[type];
  });
};

export default queryNodesByGroupList;

// QB_CORRECTION_MODULE                 题目纠错模块
// QB_EXAM_TYPE                         卷型
// QB_QUESTION_TYPE                     题型
// QB_EXAM_PAPER_TYPE                   试卷类型
// QB_CORRECTION_ERR_TYPE               纠错错误类型
// QB_RATING                            题目评级
// QB_QUESTION_DIFFICULTY               题目难度
// QB_TEACHER_APP_QUESTION_TYPE         老师端APP-题型
// QB_TEACHER_APP_QUESTION_DIFFICULTY   老师端APP-难度
// QB_EXAM_PAPER_SOURCE                 试卷来源
// QB_YEAR                              题库-年份
// QB_EXAM_PAPER_TARGET                 试卷测评对象
// QB_EXAM_PAPER_PURPOSE                试卷测评对象
// QB_EXAM_PAPER_PURPOSE                试卷测评用途
// QB_EXAM_PAPER_BU                     试卷适用BU
// QB_EXAM_PAPER_DIFFICULTY             试卷难度
// QB_ONLINE_FLAG                       题库-上下架状态
// QB_DISTINCTION                       区分度
// QB_COMPREHENSIVE_DEGREE              综合度
// QB_RECOMMENDATION_INDEX              推荐指数
// QB_PAPER_CARD                        名片
// QB_SCENE                             场景
// QB_PURPOSE                           用途
// QB_APP_STU_FILTER_SUBJECT            app学生端:学段-学科过滤关系-小学
// QB_APP_STU_FILTER_SUBJECT            app学生端:学段-学科过滤关系-初中
// QB_APP_STU_FILTER_SUBJECT            app学生端:学段-学科过滤关系-高中
// QB_UKE_SUBJECT                       优课-学科
// QB_EXAM_ANSWER_RULE                  所有的 answerRule(选做题类别)