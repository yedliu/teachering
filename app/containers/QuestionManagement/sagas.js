/* eslint-disable no-case-declarations */
import { take, call, put, select, takeLatest, cancel, takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';
import { message } from 'antd';
import { toNumber, toString } from 'lodash';
// import Config from 'utils/config';
// import request, { geturloptions } from 'utils/request';
import questionApi from 'api/qb-cloud/question-endpoint';
import { filterToText } from 'components/CommonFn';

import {
  GET_PHASE_SUBJECT_LIST_ACTION,
  GET_EXAM_POINT_ACTION,
  GET_KNOWNLEDGE_ACTION,
  SEARCH_QUESTIONS_ACTION,
  GET_QUESTIONS_TYPE_ACTION,
  GET_PROVINCE_ACTION,
  GET_CITIES_ACTION,
  GET_DISTRICT_ACTION,
  ASSEMBLE_EXAM_PAPER_ACTION,
  GET_GRADE_ACTION,
  GET_SUBJECT_ACTION,
  GET_USER_BY_ID,
  DELETE_QUESTION_ACTION,
  GET_PAPER_TYPE_ACTION,
  GET_ALL_CHOOSEQUESTION_RULE,
} from './constants';
import {
  setPhaseSubjectListAction,
  getGradeListAction,
  setKnownLedgeList,
  setFilterFields,
  setProvinceAction,
  setCityAction,
  setDistrictAction,
  setQuestionData,
  setGrade,
  setSubject,
  setPageState,
  setTotalQuestion,
  getUserById as getUserByIdAction,
  setUserMap,
  searchQuestions,
  setPaperType,
  setChooseQuestionRuleAction,
} from './actions';
import {
  makeSelectphaseSubject,
  makeSelectType,
  makeSelectSelectedTreeitem,
  makeSelectQuestionPageIndex,
  makeSelectQuestionPageSize,
  makeSelectCurFilterFields,
  makeSelectOrderParams,
  makeSelectPaperProperty,
  // makeSelectPaperContentList,
  makeSelectPageState,
  makeSelectphaseSubjectList,
  makeSelectChooosedQuestions,
  makeChooseQuestionRule,
  makeKnowledgeIds,
  makeSelectGradeSubject,
} from './selectors';
import { backChildren } from '../StandHomeWork/TreeRender';
import { isMentality, isMentalityQuestion } from './MentalityEdit/utils';
import { getPaperFields } from 'utils/paperUtils';
import { getPaperContentListByQuestions, verifyChooseGroup, isCollegeExamPaper } from './utils';
import phaseSubjectApi from 'api/tr-cloud/phase-subject-endpoint';
import examApi from 'api/tr-cloud/exam-point-endpoint';
import knowledgeApi from 'api/tr-cloud/knowledge-endpoint';
import userApi from 'api/tr-cloud/user-endpoint';
import regionApi from 'api/qb-cloud/region-end-point';
import gradeApi from 'api/tr-cloud/grade-endpoint';
import subjectApi from 'api/tr-cloud/subject-endpoint';
import QBPaperApi from 'api/qb-cloud/exam-paper-end-point';
import queryNodeApi from 'api/qb-cloud/sys-dict-end-point';

const getPaperFieldsFn = getPaperFields(2);

// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}

export function* getPhaseSubjectList() {
  // const requestURL = `${Config.trlink}/api/phaseSubject`;
  try {
    const res = yield phaseSubjectApi.getAll();
    switch (res.code.toString()) {
      case '0':
        yield put(setPhaseSubjectListAction(fromJS(res.data)));
        yield put(getGradeListAction());
        break;
      default:
        console.log('出错');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}

export function* getExamPointData() {
  // const requestURL = `${Config.trlink}/api/examPoint`;
  const selectSubject = yield select(makeSelectphaseSubject());

  try {
    const phaseSubjectId = selectSubject.get('id');
    const repos = yield examApi.getExamPoint({ phaseSubjectId });
    switch (repos.code.toString()) {
      case '0':
        // 注释掉默认选中
        // if (repos.data && repos.data.length > 0) {
        //   yield put(setSelectedTreeItem(fromJS(repos.data[0])));
        // } else {
        //   yield put(setKnownLedgeList(fromJS([])));
        // }
        yield put(setKnownLedgeList(fromJS(repos.data || [])));
        break;
      default:
        break;
    }
  } catch (err) {
    //
  }
}

export function* getHomeWorkKnownledgeTreeData() {
  // const requestURL = `${Config.trlink}/api/knowledge`;
  const selectSubject = yield select(makeSelectphaseSubject());
  try {
    // 学科id
    const phaseSubjectId = selectSubject.get('id');
    if (!phaseSubjectId) return;
    const repos = yield knowledgeApi.getAllKnowledge({ phaseSubjectId });
    // call(request, requestURL, Object.assign({}, geturloptions(), {}), { phaseSubjectId });
    switch (repos.code.toString()) {
      case '0':
        // 注释掉默认选中
        // if (repos.data && repos.data.length > 0) {
        //   yield put(setSelectedTreeItem(fromJS(repos.data[0])));
        // } else {
        //   yield put(setKnownLedgeList(fromJS([])));
        // }
        yield put(setKnownLedgeList(fromJS(repos.data || [])));
        break;
      default:
        break;
    }
  } catch (err) {
    //
  }
}

// eslint-disable-next-line complexity
export function* searchQuestionsData() {
  // 获得知识点还是考点
  const selectedType = yield select(makeSelectType());
  // console.log('获得知识点还是考点', selectedType);
  // 获得已选节点
  const selectedtreeitem = yield select(makeSelectSelectedTreeitem());
  // console.log('获得已选节点', selectedtreeitem.toJS());
  const paperProperty = yield select(makeSelectPaperProperty());

  // 获取排序方式
  const orderParams = yield select(makeSelectOrderParams());
  const updatedTimeSort = orderParams.get('updatedTime');
  const quoteCountSort = orderParams.get('quoteCount');
  // 获得已选知识点
  let subject = yield select(makeSelectphaseSubject());
  const subjectList = yield select(makeSelectphaseSubjectList());
  // eslint-disable-next-line array-callback-return
  subjectList.map(item => {
    if (item.get('id') == subject.get('id')) {  // eslint-disable-line
      subject = subject.set('subjectId', item.get('subjectId'))
        .set('phaseId', item.get('phaseId'));
    }
  });
  const knowledgeIds = selectedtreeitem.get('children') ? backChildren(selectedtreeitem.get('children').toJS(), 'saga') : [];
  selectedtreeitem.get('id') ? knowledgeIds.unshift(selectedtreeitem.get('id')) : '';
  // if (paperPropertyJS.get('typeId') != '11' && knowledgeIds.length === 0) {
  //   message.info('请选择知识点');
  //   return;
  // }
  // console.log('获得已选知识点', knowledgeIds);
  // 获得filter
  const curFilterFields = yield select(makeSelectCurFilterFields());
  // 获得请求信息
  const pageIndex = yield select(makeSelectQuestionPageIndex());
  const pageSize = yield select(makeSelectQuestionPageSize());
  const pageState = yield select(makeSelectPageState());
  // 第一期只能选客观题
  // console.log('paperProperty', paperProperty.toJS());
  if (pageState.get('isGroup') && !(curFilterFields.get('typeId') > 0)) {
    // eslint-disable-next-line eqeqeq
    if (!paperProperty.get('purpose') || paperProperty.get('purpose') == -1 && ![18, 19, 20].includes(Number(paperProperty.get('typeId')))) {
      message.info('请选择试卷用途');
      return;
    }
    // 点击“查询”按钮时，放开线上测评对于题目题型的限制
    // if (toNumber(paperProperty.get('typeId')) !== 11 && paperProperty.get('purpose') == '1') {  // eslint-disable-line
    //   // 试卷用途为“线上测评”
    //   message.info('试卷是用于线上测评的，选题有题型限制，请选择题型');
    //   return;
    // }
    // 心理测评必须选题型
    if (isMentality(paperProperty.get('typeId'))) {
      message.info('请选择心理测评题型');
      return;
    }
  }
  // const requestURL = `${Config.trlink_qb}/api/question/encrypt`;
  const paramsData = {};
  // console.log(curFilterFields.toJS());
  Object.keys(curFilterFields.toJS()).map((key) => {
    if (curFilterFields.get(key) > 0) {
      paramsData[key] = curFilterFields.get(key);
    } else if (key === 'sceneIds' && toNumber(curFilterFields.get(key)) !== -1) {
      paramsData[key] = curFilterFields.get(key);
    }
    return '';
  });
  if (curFilterFields.get('keyword')) {
    paramsData.keyword = curFilterFields.get('keyword');
  }
  // console.log(paramsData, 'paramsData');
  // 如果不是高考真题则不穿卷型，只有高考真题才传卷型。
  // if (toNumber(paramsData.sourceId) !== 19 && paramsData.examTypeId) {
  //   delete paramsData.examTypeId;
  // }
  yield put(setPageState('loading', true));
  try {
    let params = {
      pageIndex,
      pageSize,
      // ...curFilterFields.toJS()
      ...paramsData,
    };
    console.log(updatedTimeSort, quoteCountSort);
    if (updatedTimeSort || quoteCountSort) {
      params.orderByFieldStr = `${updatedTimeSort ? `updatedTime,` : ''}${quoteCountSort ? `quoteCount` : ''}`;
      params.orderByDirectionStr = `${updatedTimeSort ? `${updatedTimeSort},` : ''}${quoteCountSort ? `${quoteCountSort}` : ''}`;
    }

    // 组卷暂时只能选择选择题模板(除了高考真题)
    const paperTypeId = paperProperty.get('typeId');
    // eslint-disable-next-line eqeqeq
    // 取消线上测评组卷时搜题对于题型的限制
    const isGaokaozhenti = paperTypeId && toNumber(paperTypeId) === 11;
    // eslint-disable-next-line eqeqeq
    if (pageState.get('isGroup') && paperProperty && paperProperty.get('purpose') == '1' && !isGaokaozhenti) {
      // 只能保存所有选择题或子题全为选择题的复合题模版的题目，缩小需要校验的范围
      // 查询时将复合题和选择题都查询，保存时后端校验是否满足条件
      params.templateTypes = '1,2';
    }
    // 心理测评只能选择选择题模板
    if (isMentality(paperTypeId)) {
      params.templateTypes = '2,8';
    }
    // 没选知识点说明是根据学科查询
    if (knowledgeIds.length > 0) {
      // 0代表知识点选题 1代表考点选题
      if (selectedType === '0') {
        params.knowledgeIds = knowledgeIds.join(',');
      } else if (selectedType === '1') {
        params.examPointIds = knowledgeIds.join(',');
      }
    }
    if (selectedType === '2') {
      const knowledgeIds = yield select(makeKnowledgeIds());
      // 如果没有题目 ID，且没有知识点不请求后端数据
      if (knowledgeIds.length === 0 && !curFilterFields.get('id')) {
        yield put(setQuestionData(fromJS([])));
        yield put(setTotalQuestion(0));
        yield put(setPageState('loading', false));
        return;
      }
      const gradeSubject = yield select(makeSelectGradeSubject());
      params.subjectId = gradeSubject.get('subjectId');
      params.gradeId = gradeSubject.get('gradeId');
      params.knowledgeIds = knowledgeIds.join(',');
    } else {
      params.subjectId = subject.get('subjectId') || '';
      params.phaseId = subject.get('phaseId') || '';
    }

    if (pageState.get('isGroup')) {
      // 组卷去除听力项  TK-533
      params.excludeInfo = {
        excludeTypeIdList: [50, 51, 52],
      };
    }

    if (curFilterFields.get('id')) {
      // 有id就不要其他条件了
      params = {
        pageIndex,
        pageSize,
        id: curFilterFields.get('id'),
      };
    }

    // console.log('查询数据了', params);
    // const repos = yield call(request, requestURL, Object.assign({}, postjsonoptions(), { body: JSON.stringify(params) }));
    const repos = yield questionApi.getQuestionWithEncryptForTr(params);
    switch (repos.code.toString()) {
      case '0':
        console.log('查到数据啦', repos.data);
        console.log('主题干', repos.data.data.map((item) => item.title), repos.data.data.map((item) => filterToText(item.title)));
        yield put(setQuestionData(fromJS(repos.data.data)));
        yield put(setTotalQuestion(fromJS(repos.data.total)));
        const allUpdateUserId = [];
        const _map = {};
        repos.data.data.filter(it => it.updatedUser || it.createdUser)
          // eslint-disable-next-line array-callback-return
          .map(ix => {
            const user = ix.updatedUser || ix.createdUser;
            if (!_map[user]) {
              _map[user] = 1;
              allUpdateUserId.push(user);
            }
          });
        // 根据userid查用户
        for (let i = 0; i < allUpdateUserId.length; i++) {
          // console.log('i', i);
          yield put(getUserByIdAction(allUpdateUserId[i]));
        }
        yield put(setPageState('loading', false));
        break;
      case '7':
        yield put(setQuestionData(fromJS([])));
        yield put(setTotalQuestion(fromJS(0)));
        yield put(setPageState('loading', false));
        break;
      default:
        yield put(setPageState('loading', false));
        message.error('查询题目出错');
        break;
    }
  } catch (e) {
    yield put(setPageState('loading', false));
    message.error('系统异常');
  }
}

export function* getUserById(item) {
  const id = item.val;
  // const requestURL = `${Config.trlink}/api/user/${id}`;
  try {
    const repos = yield userApi.getOne(id);
    // call(request, requestURL, Object.assign({}, geturloptions(), {}), {});
    switch (repos.code.toString()) {
      case '0':
        yield put(setUserMap(id, repos.data.name));
        break;
      default:
    }
  } catch (e) {
    //
  } finally {
    //
  }
}

export function* getQuestionType() {
  // const requestURL = `${Config.trlink_qb}/api/questionType`;
  const selectSubject = yield select(makeSelectphaseSubject());

  try {
    const phaseSubjectId = selectSubject.get('id');
    if (!phaseSubjectId) {
      return;
    }
    // const repos = yield queryNodeApi.queryQuestionType();
    // const repos = yield call(request, requestURL, Object.assign({}, geturloptions(), {}), { phaseSubjectId });
    const repos = yield queryNodeApi.queryAllQuestionType();
    // console.log('reposTockenreposTockenreposTocken', reposTocken);
    switch (repos.code.toString()) {
      case '0':
        // yield put(setFilterFields('typeId', fromJS([{ value: '', label: '全部' }].concat(repos.data.map((item) => ({ value: item.id, label: item.name }))))));
        yield put(setFilterFields('typeId', fromJS(repos.data || [])));
        break;
      default:
        break;
    }
  } catch (err) {
    // yield put(repoLoadingError(err));
  }
}

export function* getProvince() {
  // const requestURL = `${Config.trlink_qb}/api/region/province`;
  try {
    const res = yield regionApi.getProvince();
    // call(request, requestURL, Object.assign({}, geturloptions()), {});
    switch (res.code.toString()) {
      case '0':
        yield put(setProvinceAction(fromJS(res.data.map(item => {
          const newItem = {};
          newItem.value = item.id;
          newItem.label = item.name;
          return newItem;
        }))));
        // yield put(setSelected(selected.set('grade',res.data[0].id)));
        break;
      default:
        message.warning(res.message || '系统异常');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}

export function* getCities() {
  // const requestURL = `${Config.trlink_qb}/api/region/city`;
  const curFilterFields = yield select(makeSelectCurFilterFields());
  const province = curFilterFields.get('province');
  // const params = { provinceId: province };
  if (!province) {
    yield put(setCityAction(fromJS([])));
    return;
  }
  try {
    const res = yield regionApi.getCityByProvinceId(province);
    // call(request, requestURL, Object.assign({}, geturloptions()), params);
    switch (res.code.toString()) {
      case '0':
        yield put(setCityAction(fromJS(res.data.map(item => {
          const newItem = {};
          newItem.value = item.id;
          newItem.label = item.name;
          return newItem;
        }))));
        // yield put(setAreaListAction(citys))
        break;
      default:
        message.warning(res.message || '城市列表获取失败');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}

export function* getDistrict() {
  // const requestURL = `${Config.trlink_qb}/api/region/county`;
  const curFilterFields = yield select(makeSelectCurFilterFields());
  const city = curFilterFields.get('city');
  const province = curFilterFields.get('province');
  // const params = { cityId: city };
  if (!(city && province)) {
    yield put(setDistrictAction(fromJS([])));
    return;
  }
  try {
    const res = yield regionApi.getCountyByCityId(city);
    // call(request, requestURL, Object.assign({}, geturloptions()), params);
    switch (res.code.toString()) {
      case '0':
        yield put(setDistrictAction(fromJS(res.data.map(item => {
          const newItem = {};
          newItem.value = item.id;
          newItem.label = item.name;
          return newItem;
        }))));
        // yield put(setSelected(selected.set('grade',res.data[0].id)));
        break;
      default:
        message.warning(res.message || '系统异常');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}

export function* getAllGrade() {
  // const requestURL = `${Config.trlink}/api/grade`;
  try {
    const repos = yield gradeApi.getGrade();
    // call(request, requestURL, Object.assign({}, geturloptions()), {});
    switch (repos.code.toString()) {
      case '0':
        yield put(setGrade(fromJS(repos.data)));
        break;
      default:
        break;
    }
  } catch (err) {
    //
  }
}

export function* getAllSubject() {
  // const requestURL = `${Config.trlink}/api/subject`;
  try {
    const repos = yield subjectApi.getAllSubject();
    // call(request, requestURL, Object.assign({}, geturloptions()), {});
    switch (repos.code.toString()) {
      case '0':
        yield put(setSubject(fromJS(repos.data)));
        break;
      default:
        break;
    }
  } catch (err) {
    //
  }
}

// eslint-disable-next-line complexity
export function* assembleExamPaper(item) {
  yield put(setPageState('isSubmit', true));
  // 获取试卷属性
  const paperPropertyJS = yield select(makeSelectPaperProperty());
  const paperProperty = paperPropertyJS.toJS();
  paperProperty.submitFlag = item.submitFlag;
  const properties = Object.assign({}, paperProperty);

  // id 为 -1 的表示选择‘全部’，不能移除，不然会出现想要移除设置却移出不掉
  // if (toNumber(properties.provinceId) < 0) delete properties.provinceId;
  // if (toNumber(properties.cityId) < 0) delete properties.cityId;
  // if (toNumber(properties.countyId) < 0) delete properties.countyId;
  // if (toNumber(properties.editionId) < 0) delete properties.editionId;
  // if (toNumber(properties.examTypeId) < 0) delete properties.examTypeId;
  // if (toNumber(properties.businessCardId) < 0) delete properties.businessCardId;
  // 删去不必要的
  delete properties.showSystemList;
  // console.log('properties前', JSON.parse(JSON.stringify(properties)));
  let needFields = [];
  if (properties.typeId) {
    try {
      const list = item.paperType.toJS();
      needFields = getPaperFieldsFn(properties.typeId, list);
    } catch (error) {
      message.error('试卷类型数据异常, 请重试');
      return;
    }
    needFields.push('typeId');
    needFields.push('systemValue');
    needFields.push('versionValue');
    needFields.push('epName');
    needFields.push('submitFlag');
    needFields.push('epId');
    needFields.push('editionName');
    needFields.push('teachingEditionName');
    // 第一步把不需要课程和教材的相关字段删除
    const hasTeachingVersion = needFields.includes('teachingEditionId');
    const hasCourseSystem = needFields.includes('editionId');
    if (!hasTeachingVersion) {
      properties.versionValue = null;
    }
    if (!hasCourseSystem) {
      properties.systemValue = null;
    }
    // 第二步把不需要的字段删了
    for (let key in properties) {
      if (!needFields.includes(key)) {
        if (key === 'gradeId') {
          properties[key] = '';
        } else {
          properties[key] = -1;
        }
      }
    }
  }

  // 获取试卷试题列表
  // const paperContentList = yield select(makeSelectPaperContentList());
  const chooosedQuestions = yield select(makeSelectChooosedQuestions());

  // 校验题目对于选做题分组设置
  const ruleList = yield select(makeChooseQuestionRule());
  const verify = verifyChooseGroup(chooosedQuestions, ruleList);
  if (!verify.pass) {
    message.warn(verify.errorMsg || '请检查您的选做题设置');
    return;
  } else {
    // 如果校验通过则可以关闭弹框了
    item.setPaperEditModalState(false);
  }

  // 获取试卷试题列表
  const paperContentList = getPaperContentListByQuestions(chooosedQuestions, isCollegeExamPaper(paperPropertyJS.get('typeId')));
  // const requestURL = `${Config.trlink_qb}/api/examPaper/action/assembleExamPaper`;
  const requestContentList = paperContentList.map(it1 => {
    return it1.set('entryExamPaperQuesInputDTOList',
      it1.get('entryExamPaperQuesInputDTOList').map(it2 => {
        const answerRule = it2.get('answerRule') || 1;
        const chooseGroup = answerRule > 1 ? it2.get('chooseGroup') : null;
        let subQuestionScoreList = null;
        if (it2.get('children')) {
          subQuestionScoreList = it2.get('children').map(child => {
            return {
              subQuestionId: child.get('id'),
              score: child.get('epScore')
            };
          });
        }
        let saveQuesrion = fromJS({
          questionId: it2.get('id'),
          serialNumber: it2.get('serialNumber'),
          answerRule,
          chooseGroup
        });
        if (subQuestionScoreList) {
          saveQuesrion = saveQuesrion.set('subQuestionScoreList', subQuestionScoreList);
        }
        if (isMentalityQuestion(it2.get('typeId'))) {
          return saveQuesrion.set('scoreList', it2.get('scoreList'));
        } else {
          return saveQuesrion.set('score', it2.get('score') || 3);
        }
      }));
  });
  console.log(requestContentList.toJS(), 'requestContentList');
  // 心理测评新增字段start
  if (isMentality(properties.typeId)) {
    const { rateList, totalScore, minScore } = item.MentalityData;
    properties.rateList = rateList.toJS();
    properties.totalScore = totalScore;
    properties.minScore = minScore;
  }
  // 心理测评新增字段end
  properties.questionAmount = requestContentList.toJS().reduce((total, item) => {
    return total + item.entryExamPaperQuesInputDTOList.length;
  }, 0);
  const assembleExamPaperInputDTO = Object.assign({
    entryExamPaperContentInputDTOList: requestContentList.toJS(),
  }, properties);
  console.log(assembleExamPaperInputDTO, '要保存啦assembleExamPaperInputDTO');
  // return;
  // 如果是平行组卷删除id
  if (item.MentalityData.isParallel) {
    delete assembleExamPaperInputDTO.epId;
  }
  // 埋点：捕获serialNumber重复的情况
  buryPoint(assembleExamPaperInputDTO.entryExamPaperContentInputDTOList);
  // 请求接口前对serialNumber进行处理，防止重复
  assembleExamPaperInputDTO.entryExamPaperContentInputDTOList = handleSerialNumber(assembleExamPaperInputDTO.entryExamPaperContentInputDTOList);
  try {
    const res = yield call(QBPaperApi.assembleExamPaper, assembleExamPaperInputDTO);
    console.log('res', res);
    switch (res.code.toString()) {
      case '0':
        yield put(setPageState('state', (item.submitFlag ? 'publishSuccess' : 'draftSuccess')));
        yield put(setPageState('isSubmit', false));
        break;
      default:
        yield put(setPageState('state', (item.submitFlag ? 'publishFailed' : 'draftFailed')));
        message.error(res.message || '保存失败');
        yield put(setPageState('isSubmit', false));
        break;
    }
  } catch (e) {
    message.error('数据异常，请稍后再试');
  } finally {
    //
  }
}

/**
 * 处理题目数据，防止出现重复的serialNumber导致保存试卷不成功
 * @param entryExamPaperContentInputDTOList：大题列表
 * @returns {Array}
 */
function handleSerialNumber(entryExamPaperContentInputDTOList) {
  if (entryExamPaperContentInputDTOList && entryExamPaperContentInputDTOList instanceof Array) {
    entryExamPaperContentInputDTOList.forEach((item1, index1) => {
      item1.serialNumber = index1 + 1;
      if (item1.entryExamPaperQuesInputDTOList && item1.entryExamPaperQuesInputDTOList instanceof Array) {
        item1.entryExamPaperQuesInputDTOList.forEach((item2, index2) => {
          item2.serialNumber = index2 + 1;
        });
      }
    });
  }
  return entryExamPaperContentInputDTOList;
}

/**
 * sentry埋点，记录serialNumber重复的情况
 * @param arr：大题列表
 */
function buryPoint(arr) {
  let serialNums = [];
  if (arr && arr instanceof Array) {
    for (let i = 0; i < arr.length; i++) {
      if (serialNums.includes(arr[i].serialNumber) && localStorage.eventRecords) {
        let log = JSON.parse(localStorage.eventRecords);
        if (log && window.sentry) {
          window.sentry.captureMessage(JSON.stringify(log.clicks));
          window.sentry.captureMessage(JSON.stringify(log.func));
        }
        break;
      } else {
        serialNums.push(arr[i].serialNumber);
      }
    }
  }
}
export function* deleteQuestion(e) {
  // console.log(e, 'deleteQuestion - deleteQuestion');
  if (!(toNumber(e.id) > 0)) {
    message.warn('删除操作出现异常情况');
    return;
  }
  // const requestURL = `${Config.trlink_qb}/api/question/${e.id}`;
  try {
    const res = yield questionApi.deleteQuestion({ id: e.id });
    switch (toString(res.code)) {
      case '0':
        message.success('删除成功');
        yield put(searchQuestions());
        break;
      default:
        message.warn('删除失败');
        break;
    }
  } catch (err) {
    console.log(err);
  }
}

export function* getAllPaperType() {
  try {
    const repos = yield call(queryNodeApi.queryExamPaperTypeV1);
    switch (repos.code.toString()) {
      case '0':
        yield put(setPaperType(fromJS(repos.data)));
        break;
      default:
        break;
    }
  } catch (err) {
  }
}

export function* getAllChooseQuestionRule() {
  try {
    const res = yield queryNodeApi.queryExamAnswerRule();
    console.log(res.data, 'QB_EXAM_ANSWER_RULE');
    if (res.code.toString() === '0') {
      yield put(setChooseQuestionRuleAction(fromJS((res.data || []).filter(item => item.itemCode > 1))));
    } else {
      message.error(res.message || '选作题信息获取失败');
    }
  } catch (err) {
    console.log(err);
  }
}

// 获取试卷选做题规则
export function* getAllChooseQuestionRuleSaga() {
  const watcher = yield takeLatest(GET_ALL_CHOOSEQUESTION_RULE, getAllChooseQuestionRule);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// 获取试卷类型
export function* getPaperTypeSaga() {
  const watcher = yield takeLatest(GET_PAPER_TYPE_ACTION, getAllPaperType);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// 删除题目
export function* deleteQuestionSaga() {
  const watcher = yield takeLatest(DELETE_QUESTION_ACTION, deleteQuestion);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* makeGetPhaseSubjectList() {
  const watcher = yield takeLatest(GET_PHASE_SUBJECT_LIST_ACTION, getPhaseSubjectList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 考点查询
export function* getExamPointSaga() {
  const watcher = yield takeLatest(GET_EXAM_POINT_ACTION, getExamPointData);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 知识点查询
export function* getKnownLedgeTreeSaga() {
  const watcher = yield takeLatest(GET_KNOWNLEDGE_ACTION, getHomeWorkKnownledgeTreeData);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 查询试题
export function* searchQuestionsSaga() {
  const watcher = yield takeLatest(SEARCH_QUESTIONS_ACTION, searchQuestionsData);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 获得题型
export function* getQuestionTypeSaga() {
  const watcher = yield takeLatest(GET_QUESTIONS_TYPE_ACTION, getQuestionType);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 获取省份
export function* getProvinceSaga() {
  const watcher = yield takeLatest(GET_PROVINCE_ACTION, getProvince);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 获取城市
export function* getCitiesSaga() {
  const watcher = yield takeLatest(GET_CITIES_ACTION, getCities);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 获取地区
export function* getDistrictSaga() {
  const watcher = yield takeLatest(GET_DISTRICT_ACTION, getDistrict);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 发布试卷
export function* assembleExamPaperSaga() {
  const watcher = yield takeLatest(ASSEMBLE_EXAM_PAPER_ACTION, assembleExamPaper);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 获取年级
export function* getAllGradeSaga() {
  const watcher = yield takeLatest(GET_GRADE_ACTION, getAllGrade);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getAllSubjectSaga() {
  const watcher = yield takeLatest(GET_SUBJECT_ACTION, getAllSubject);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getUserByIdSaga() {
  const watcher = yield takeEvery(GET_USER_BY_ID, getUserById);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// All sagas to be loaded
export default [
  defaultSaga,
  makeGetPhaseSubjectList,
  getExamPointSaga,
  getKnownLedgeTreeSaga,
  searchQuestionsSaga,
  getQuestionTypeSaga,
  getProvinceSaga,
  getCitiesSaga,
  getDistrictSaga,
  assembleExamPaperSaga,
  getAllGradeSaga,
  getAllSubjectSaga,
  getUserByIdSaga,
  deleteQuestionSaga,
  getPaperTypeSaga,
  getAllChooseQuestionRuleSaga,
];
