import Config from 'utils/config';
import { mathToUnify } from 'components/CommonFn';
import request, { postjsonoptions, geturloptions, deletejsonoptions, gettockenurloptions, postjsontokenoptions } from 'utils/request';
import { AppLocalStorage } from 'utils/localStorage';
import questionAip from '../../api/qb-cloud/question-endpoint';
import courseSystemApi from 'api/tr-cloud/course-system-endpoint';

// 某个需要指定头信息的请求
const requestTimeOut = 30 * 1000;
const normalputheader = {
  method: 'PUT',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
    mobile: AppLocalStorage.getMobile(),
    password: AppLocalStorage.getPassWord(),
  }
};

// 获取年级科目信息
export const getPhaseSubjectList = () => {
  const reqUrl = `${Config.trlink}/api/user/findPhaseSubjectList`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()));
};
// 获取筛选条件下的游戏列表
export const getSearchGame = (options) => {
  const reqUrl = `${Config.trlink}/api/game/search`;
  const queryOption = {};
  Object.assign(queryOption, options);
  queryOption.pageIndex = Number(options.pageIndex) || 0;
  queryOption.pageSize = Number(options.pageSize) || 20;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), { ...queryOption });
};
// 获取游戏场景字典
export const getGameScene = () => {
  const reqUrl = `${Config.trlink}/api/dict/findSystemDictByGroupCode`;
  const queryOption = {
    groupCode: 'GAME_SCENE'
  };
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), { ...queryOption });
};
// 根据id获取具体游戏
export const getGameById = (id) => {
  const reqUrl = `${Config.trlink}/api/game/getOne`;
  const queryOption = {
    id
  };
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), { ...queryOption });
};
// 获取学段信息
export const getPhaseList = () => {
  const reqUrl = `${Config.trlink}/api/userPhaseSubject/findPhase`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()));
};

// 根据学段获取科目信息
export const getSubjectByPhase = (phaseId) => {
  const reqUrl = `${Config.trlink}/api/userPhaseSubject/findSubjectByPhase`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), { phaseId });
};

// 获取对应年级科目的知识元目录
export const getFeatureList = (phaseId = 0, subjectId = 0) => {
  const reqUrl = `${Config.trlink}/api/knowledgeElement/findAll`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), { phaseId, subjectId });
};

// 获取切片难度
export const getFeatureDifficulty = () => {
  const reqUrl = `${Config.trlink}/api/dict/findCodeAndValue`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), { code: 'SLICE_DIFFICULTY' });
};

// 获取切片场景
export const getFeatureScene = () => {
  const reqUrl = `${Config.trlink}/api/dict/findCodeAndValue`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), { code: 'SLICE_SCENE' });
};

export const getFeatureSlidesList = (option) => {
  const reqUrl = `${Config.trCourseOrFeature}/zhangmen-client-courseware/slice/search`;
  const reqOption = {
    knowledgeElementId: Number(option.knowledgeElementId),
    level: Number(option.level),
    difficulty: Number(option.difficulty) || '',
    scene: Number(option.scene) || '',
    name: option.name,
    buClassType: option.buClassType,
    editionId: option.editionId,
    pageIndex: Number(option.pageIndex) || 1,
    pageSize: Number(option.pageSize) || 20,
    online: option.online || 0
  };
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions(), { body: JSON.stringify(reqOption) }));
};

// 更新切片到所有的 课件
export const updateSlideForCourse = id => {
  const reqUrl = `${Config.trCourseOrFeature}/zhangmen-client-courseware/slice/handleSliceUpdate/${id}`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions()));
};
// 获取切片内容
export const getFeatureByIdForSlide = (id, queryOption = {}) => {
  const reqUrl = `${Config.trCourseOrFeature}/zhangmen-client-courseware/slice/getEditOne/${id}`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions()));
};
// 获取发布版本切片 内容
export const getFeatureById = (id, queryOption = {}) => {
  const reqUrl = `${Config.trCourseOrFeature}/zhangmen-client-courseware/slice/getReleaseOne/${id}`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions()));
};
// 切片引用次数
export const getSlideUsedCount = id => {
  const reqUrl = `${Config.trCourseOrFeature}/zhangmen-client-courseware/slice/getUseCount/${id}`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions()));
};
// 删除切片元素
export const removeFeatureById = (id) => {
  const reqUrl = `${Config.trCourseOrFeature}/zhangmen-client-courseware/slice/delete/${id}`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions()));
};

// 查询切片引用课件
export const searchCourseListForSlide = option => {
  const reqUrl = `${Config.trCourseOrFeature}/zhangmen-client-courseware/slice/searchCourseware`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions(), { body: option }));
};


// 获取知识点
export const getKonwLeadgeList = (phaseSubjectId) => {
  const reqUrl = `${Config.trlink}/api/knowledge`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), { phaseSubjectId });
};

// 获取考点
export const getExamPoint = (phaseSubjectId) => {
  const reqUrl = `${Config.trlink}/api/examPoint`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), { phaseSubjectId });
};

// 获取题目类型
export const getQuestionTypes = () => {
  const reqUrl = `${Config.trlink_qb}/api/questionType`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), {});
};

// 获取题目
export const getQuestionsList = (option) => {
  const queryOption = {};
  Object.assign(queryOption, option);
  queryOption.knowledgeIds = (option.knowledgeIds || []).join(',');
  queryOption.pageIndex = Number(option.pageIndex) || 0;
  queryOption.pageSize = Number(option.pageSize) || 20;
  queryOption.typeId = Number(option.typeId) || '';
  queryOption.difficulty = Number(option.difficulty) || '';
  queryOption.query = option.query || '';

  queryOption.excludeInfo = {
    excludeTypeIdList: [50, 51, 52],
  };

  // TODO: encrypt add questionId for search
  // const reqUrl = `${Config.trlink_qb}/api/question/encrypt`;
  // return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsonoptions(), { body: JSON.stringify(queryOption) }));
  return questionAip.getQuestionWithEncryptForTr(queryOption);
};

// 创建切片
export const createFeature = (options) => {
  const reqUrl = `${Config.trCourseOrFeature}/zhangmen-client-courseware/slice/create`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions(), { body: JSON.stringify(options) }));
};

// 更新切片内容
export const updateFeature = (options) => {
  const reqUrl = `${Config.trCourseOrFeature}/zhangmen-client-courseware/slice/update`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions(), { body: JSON.stringify(options) }));
};

// 获取年级
export const getGradeData = (options) => {
  const reqUrl = `${Config.trlink}/api/courseSystem/grade`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()));
};

// 获取知识点
export const getKonwLeadgeWithGraAndSub = (gradeId, subjectId) => {
  const reqUrl = `${Config.trlink}/api/knowledge`;
  const params = mathToUnify({
    gradeId,
    subjectId,
  });
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), params);
};

// 获取考点
export const getExamPointList = (gradeId, subjectId) => {
  const reqUrl = `${Config.trlink}/api/examPoint`;
  const params = mathToUnify({
    gradeId,
    subjectId,
  });
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), params);
};

// 获取省份
export const getProvince = () => {
  const reqUrl = `${Config.trlink_qb}/api/region/province`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()));
};

// 获取城市
export const getCity = (provinceId) => {
  const reqUrl = `${Config.trlink_qb}/api/region/city`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), { provinceId });
};

// 获取地区
export const getDistrict = (city) => {
  const reqUrl = `${Config.trlink_qb}/api/region/county`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), { cityId: city });
};

// 获取课件列表
export const getCourseSlidesList = (option) => {
  // eslint-disable-next-line no-unused-vars
  const { courseType, sortByUseNumDesc, ...params } = option;

  const reqUrl = `${Config.trCourseOrFeature}/zhangmen-client-courseware/${courseType ? 'testC' : 'c'}oursewareHfive/search`;

  !courseType && (delete params.testLessonKnowledgeId);

  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions(), {
    body: JSON.stringify(params)
  }));
};

// 获取课件编辑器中备注选项
export const getSlideRemarkOption = () => {
  const reqUrl = `${Config.trlink}/api/coursewareHfive/findChapter`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), {});
};

// 获取单个课件信息
export const getCourseById = (id, queryOption = {}, courseType) => {
  const isBigclass = courseType === 'bigClass';
  let reqUrl = '';

  if (isBigclass) { reqUrl += `${Config.trlink}/api/lectureCoursewareHfive/getOne` }
  else {
    reqUrl += `${Config.trCourseOrFeature}/zhangmen-client-courseware/`;
    reqUrl += `${courseType === 'test'
                ? 'testC'
                : 'c'}oursewareHfive/getOne`;
  }


  const body = { id };
  !isBigclass && Object.assign(body, { released: queryOption.releasedStat || 0 });

  return request(
      reqUrl,
      Object.assign(
        { _timeout: requestTimeOut },
        isBigclass ? geturloptions() : Object.assign(postjsontokenoptions(), { body: JSON.stringify(body) })),
      isBigclass && Object.assign({ id }, queryOption)
      )
    .then((res) => {
    // 请求失败的情况
      if (!res.data || !res.data.content) { return new Promise((resolve) => resolve(res)) }
    // 临时兼容oss未上线的情形
      if (res.data.content.indexOf('http') !== 0) { return new Promise((resolve) => resolve(res)) }
    // 将oss获取的结果拼接成原来的数据格式
      return fetch(res.data.content).then((_res) => _res.text().then(jsonStr => {
        res.data.content = jsonStr;
        return new Promise((resolve) => resolve(res));
      }));
    });
};


// 获取年级
export const getGradeList = () => {
  const reqUrl = `${Config.trlink}/api/grade`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), {});
};

// 获取科目
export const getSubjectList = (gradeId) => {
  const reqUrl = `${Config.trlink}/api/phaseSubject/subject`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), { gradeId });
};

// 获取版本
export const getVersionList = (gradeId, subjectId) => {
  const reqUrl = `${Config.zmtrlink}/api/edition`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, gettockenurloptions()), { gradeId, subjectId });
};

// 获取版本
export const getVersionListForSlide = (phaseId, subjectId) => {
  const reqUrl = `${Config.zmtrlink}/api/edition`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, gettockenurloptions()), { phaseId, subjectId });
};

// 获取课件难度
export const getCourseDifficulty = () => {
  const reqUrl = `${Config.trlink}/api/dict/findCodeAndValue`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), { code: 'COURSEWARE_HFIVE_DIFFICULTY' });
};

// 获取课件场景
export const getCourseScene = () => {
  const reqUrl = `${Config.trlink}/api/dict/findCodeAndValue`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), { code: 'COURSEWARE_HFIVE_SCENE' });
};

// 获取课件状态
export const getCourseState = () => {
  const reqUrl = `${Config.trlink}/api/dict/findSystemDictByGroupCode`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), { groupCode: 'COURSEWARE_STATE' });
};

// 获取课程目录
export const getCourseContents = (gradeId, subjectId, editionId) => {
  // const reqUrl = `${Config.trlink}/api/courseSystem`;
  return courseSystemApi.getClassType({ gradeId, subjectId, editionId });
};

// 删除H5课件
export const removeCourseById = (id, courseType) => {
  const reqUrl = `${Config.trlink}/api/coursewareHfive${courseType === 'test' ? 'Test' : ''}/delete`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, deletejsonoptions()), { id });
};

// 获取课件列表
export const getCourseList = () => {
  const reqUrl = `${Config.trlink}/api/knowledgeElement/findAll`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), { phaseSubjectId: 0, parentId: 0 });
};

// 创建课件
export /**
 *用于创建课件
 *1. 正式 2.测试
 * @param {*} options 课件内容
 * @param {*} courseType 课件类型
 * @returns promise
 */
  const createCourse = (options, courseType) => {
    // Config.trCourseOrFeature
    const reqUrl = `${Config.trCourseOrFeature}/zhangmen-client-courseware${courseType === 'test' ? '/testCoursewareHfive' : '/coursewareHfive'}/create`;

    return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions(), { body: JSON.stringify(options) }));
  };

// 更新课件属性或内容
export const updateCourse = (options, updataType, courseType) => {
  const commonPath = `${Config.trCourseOrFeature}/zhangmen-client-courseware${courseType === 'test' ? '/testCoursewareHfive' : '/coursewareHfive'}/`;

  const reqUrl1 = `${commonPath}updateAttribute`;
  const reqUrl2 = `${commonPath}updateContent`;

  const { content, sliceIdList = '', tag } = options;

  delete options.content;
  delete options.sliceIdList;
  delete options.tag;
  let parmas = [];

  if (updataType === 'attr') parmas = [reqUrl1, Object.assign({ _timeout: requestTimeOut }, normalputheader, postjsontokenoptions(), { body: JSON.stringify(options) })];

  if (updataType === 'content') parmas = [reqUrl2, Object.assign({ _timeout: requestTimeOut }, normalputheader, postjsontokenoptions(), { body: JSON.stringify({ id: options.id, content, sliceIdList, tag }) })];

  return request(...parmas);
};

// 获取媒体目录
export const getMaterialDirectoryList = (type) => {
  const reqUrl = `${Config.trlink}/api/materialDirectory/findAll`;
  const param = { type };
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), param);
};

// 查询媒体内容
export const getMaterialList = (type, materialDirectoryFirstId = '', materialDirectorySecondId = '', materialDirectoryThirdId = '', name, pageInfo) => {
  const reqUrl = `${Config.trlink}/api/material/search`;
  const param = { type, materialDirectoryFirstId, materialDirectorySecondId, materialDirectoryThirdId, name, sortOrder: 1, pageIndex: pageInfo.pageIndex, pageSize: pageInfo.pageSize };
  if (!param.name) {
    delete param.name;
  }
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), param);
};

// 课件上下架切换
export const changeCourseState = (id, state, courseType) => {
  const reqUrl = `${Config.trlink}/api/coursewareHfive${courseType === 'test' ? 'Test' : ''}/changeState`;
  const param = { id, state };
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), param);
};

// 切片上下架切换
export const changeSlideState = (id, state) => {
  const reqUrl = `${Config.trCourseOrFeature}/zhangmen-client-courseware/slice/changeState`;
  const param = JSON.stringify({ id, state });
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions(), { body: param }));
};

// 测评课类型
export const getCourseType = type => {
  const reqUrl = `${Config.trlink}/api/dict/findSystemDictByGroupCode`;
  const param = { groupCode: type ? type : 'CLASSTYPE' };
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), param);
};

// 获取测评课体系
export const getTestCourseContents = (gradeId, subjectId, gradeName, lessonType) => {
  const reqUrl = `${Config.trlink}/api/testLessonKnowledge/findList`;
  const param = { gradeId, subjectId, gradeName, lessonType };
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()), param);
};

// 获取logo列表
export const getLogoList = () => {
  const reqUrl = `${Config.trlink}/api/logo/find`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()));
};

// 获取题目
export const getQuestionsFindByIdList = (option) => {
  const reqUrl = `${Config.trlink_qb}/api/question/findByIdList`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsonoptions(), { body: JSON.stringify(option) }));
};

// 课件版本回退
// 正式课件
export const revertCourseContent = id => {
  const reqUrl = `${Config.RSA}/zhangmen-client-courseware/coursewareHfive/revertContent/${id}`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions()));
};
// 测评课件
export const revertTestCourseContent = id => {
  const reqUrl = `${Config.RSA}/zhangmen-client-courseware/testCoursewareHfive/revertContent/${id}`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions()));
};
// 切片版本回退
export const revertFeatureContent = id => {
  const reqUrl = `${Config.RSA}/zhangmen-client-courseware/slice/revertContent/${id}`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions()));
};

// 调试课课件管理接口
const coursewareUrl = `${Config.RSA}/zhangmen-client-courseware`;
// 创建调试课课件
export const createDebugCoursewareApi = (options) => {
  const reqUrl = `${coursewareUrl}/debugCoursewareHfive/create`;
  const params = {
    ...options,
  };
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 删除调试课课件
export const deleteDebugCoursewareApi = (id) => {
  const reqUrl = `${coursewareUrl}/debugCoursewareHfive/delete/${id}`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions()));
};
// 获取调试课件详情
export const getDebugCoursewareDetailApi = (options) => {
  const reqUrl = `${coursewareUrl}/debugCoursewareHfive/getOne`;
  const params = {
    ...options,
  };
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions(), { body: JSON.stringify(params) })).then((res) => {
    // 请求失败的情况
    if (!res.data || !res.data.content) { return new Promise((resolve) => resolve(res)) }
    // 临时兼容oss未上线的情形
    if (res.data.content.indexOf('http') !== 0) { return new Promise((resolve) => resolve(res)) }
    // 将oss获取的结果拼接成原来的数据格式
    return fetch(res.data.content).then((_res) => _res.text().then(jsonStr => {
      res.data.content = jsonStr;
      return new Promise((resolve) => resolve(res));
    }));
  });
};
// 分页搜索调试课件
export const searchDebugCoursewareApi = (options) => {
  const reqUrl = `${coursewareUrl}/debugCoursewareHfive/search`;
  const params = {
    ...options,
  };
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 选择调试课件
export const selectDebugCoursewareApi = (options) => {
  const reqUrl = `${coursewareUrl}/debugCoursewareHfive/select`;
  const params = {
    ...options,
  };
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 更新调试课课件属性
export const updateDebugCoursewareAttrApi = (options) => {
  const reqUrl = `${coursewareUrl}/debugCoursewareHfive/updateAttr`;
  const params = {
    ...options,
  };
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 更新调试课课件内容
export const updateDebugCoursewareContentApi = (options) => {
  const reqUrl = `${coursewareUrl}/debugCoursewareHfive/updateContent`;
  const params = {
    ...options,
  };
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 更新调试课课件状态
export const updateDebugCoursewareStateApi = (options) => {
  const reqUrl = `${coursewareUrl}/debugCoursewareHfive/updateState`;
  const params = {
    ...options,
  };
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
