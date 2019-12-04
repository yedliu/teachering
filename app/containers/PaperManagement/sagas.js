/* eslint-disable no-case-declarations */
import { take, call, put, select, takeLatest, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';
import _ from 'lodash';
import { message } from 'antd';
// import request, { postjsontokenoptions } from '../../utils/request';
import QBPaperApi from '../../api/qb-cloud/exam-paper-end-point';
// import Config from '../../utils/config';
import queryNode from '../../api/qb-cloud/sys-dict-end-point';
import {
  SEARCH_PAPER_ACTION,
  REMOVE_ONE_PAPER_ACTION,
  GET_PAPER_MSG_ACTION,
  ASSEMBLE_EXAM_PAPER_ACTION,
  GET_CITY_LIST_ACTION,
  GET_COUNTY_LIST_ACTION,
  GET_EDITION_LIST_ACTION,
  GET_TEXTBOOK_EDITION_ACTION,
  QUERY_NODES_ACTION,
  UPDATE_ONLINE_FLAG,
  GET_PAPER_TYPE,
  GET_PAPER_PURPOSE,
  GET_PAPER_TARGET,
  GET_EP_BU,
  GET_CITIES_FOR_CREATE_ACTION,
  GET_COUNTY_FOR_CREATE_ACTION,
  GET_SUBJECTS_ACTION,
} from './constants';
import {
  setPaperList,
  setTableState,
  setTotalPapers,
  searchPaper as searchPaperAction,
  setPaperMsgAction,
  setTeachingVersion,
  setCourseSystem,
  setPaperType,
  setCreatePaperMsgAction,
  setSelectedRowKeys
} from './actions';
import {
  makeSelectPaperProperty,
  makeSelectTableState,
  makeAssemblePaperMsgList,
  makeCreatePaperMsgList,
  makeTeachingVersion,
  makeCourseSystem,
} from './selectors';
import regionApi from 'api/qb-cloud/region-end-point';
import editionApi from 'api/tr-cloud/edition-endpoint';
import textbookEditionApi from 'api/tr-cloud/textbook-edition-endpoint';
import gradeApi from 'api/tr-cloud/grade-endpoint';
import subjectApi from 'api/tr-cloud/subject-endpoint';
import termApi from 'api/tr-cloud/term-endpoint';
import QbSubjectApi from 'api/qb-cloud/subject-end-point';

export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}

export function* getAllPaperType() {
  try {
    const repos = yield call(queryNode.queryExamPaperTypeV1);
    switch (repos.code.toString()) {
      case '0':
        yield put(setPaperType(fromJS(repos.data)));
        const paperTypeList = repos.data;
        yield put(setPaperMsgAction('paperTypeId', fromJS(paperTypeList)));
        yield put(setCreatePaperMsgAction('paperTypeId', fromJS(paperTypeList)));
        break;
      default:
        break;
    }
  } catch (err) {
  }
}

export function* getPaperPurpose() {
  try {
    const repos = yield call(queryNode.queryPaperPurpose);
    switch (repos.code.toString()) {
      case '0':
        // yield put(setPaperPurpose(fromJS(repos.data)));
        yield put(setPaperMsgAction('evaluationPurpose', fromJS(repos.data)));
        yield put(setCreatePaperMsgAction('evaluationPurpose', fromJS(repos.data)));
        break;
      default:
        break;
    }
  } catch (err) {
  }
}

export function* getPaperTarget() {
  try {
    const repos = yield call(queryNode.queryPaperTarget);
    // console.log('repos', repos)
    switch (repos.code.toString()) {
      case '0':
        // yield put(setPaperTarget(fromJS(repos.data)));
        yield put(setPaperMsgAction('evaluationTarget', fromJS(repos.data)));
        yield put(setCreatePaperMsgAction('evaluationTarget', fromJS(repos.data)));
        break;
      default:
        break;
    }
  } catch (err) {
  }
}

export function* getEpBu() {
  try {
    const repos = yield call(queryNode.queryEpBu);
    // console.log('repos', repos)
    switch (repos.code.toString()) {
      case '0':
        // yield put(setPaperTarget(fromJS(repos.data)));
        yield put(setPaperMsgAction('epBu', fromJS(repos.data)));
        yield put(setCreatePaperMsgAction('epBu', fromJS(repos.data)));
        break;
      default:
        break;
    }
  } catch (err) {
  }
}

export function* getAllGrade() {
  try {
    const repos = yield queryNode.queryExamPaperType();
    switch (repos.code.toString()) {
      case '0':
        yield put(setPaperType(fromJS(repos.data)));
        const paperTypeList = repos.data;
        yield put(setPaperMsgAction('paperTypeId', fromJS(paperTypeList)));
        yield put(setCreatePaperMsgAction('paperTypeId', fromJS(paperTypeList)));
        break;
      default:
        break;
    }
  } catch (err) {
  }
}

export function* searchPaper(item) {
  // 排序方式
  const sort = item.val;
  const tableState = yield select(makeSelectTableState());
  const paperPropertyJS = yield select(makeSelectPaperProperty());
  const param = paperPropertyJS.filter(item => item).toJS();
  // eslint-disable-next-line eqeqeq
  if (param.typeId == 0) {
    param.typeId = '';
  }
  // 检查时间
  const startDateInit = param.startDate;
  const endDateInit = param.endDate;
  if (!startDateInit && endDateInit) {
    message.info('请选择开始时间');
    yield put(setTableState(tableState.set('loading', false)));
    return;
  }
  if (!endDateInit && startDateInit) {
    message.info('请选择结束时间');
    yield put(setTableState(tableState.set('loading', false)));
    return;
  }
  if (endDateInit && startDateInit) {
    const start = startDateInit.format('YYYY/MM/DD');
    const end = endDateInit.format('YYYY/MM/DD');
    if (start.replace('/', '') > end.replace('/', '')) {
      message.info('开始时间不能小于结束时间');
      yield put(setTableState(tableState.set('loading', false)));
      return;
    }
  }
  // eslint-disable-next-line no-undefined
  param.submitFlag === undefined ? param.submitFlag = false : '';
  if (sort) {
    if (sort.name === '默认') {
      param.sort = 1;
    } else if (sort.name === '修改时间') {
      if (sort.sortUp) {
        param.sort = 1;
      } else {
        param.sort = 0;
      }
    } else if (sort.name === '使用次数') {
      if (sort.sortUp) {
        param.sort = 3;
      } else {
        param.sort = 2;
      }
    }
  } else {
    param.sort = 1;
  }
  // const requestURL = `http://192.168.6.171:8082/api/examPaper/action/findAssembleExamPaper`;
  // const requestURL = `${Config.trlink_qb}/api/examPaper/action/findAssembleExamPaper`;
  try {
    const repos = yield call(QBPaperApi.findAssembleExamPaper, Object.assign({}, {
      ...param,
      pageSize: tableState.get('pageSize'),
      pageIndex: tableState.get('pageIndex'),
    }));
    switch (repos.code.toString()) {
      case '0':
        yield put(setTableState(tableState.set('loading', false)));
        // 处理数据 把教材版本和课程体系根据id查询出所有名称
        yield put(setPaperList(fromJS(repos.data.list)));
        yield put(setTotalPapers(fromJS(repos.data.total)));
        yield put(setSelectedRowKeys([]));
        break;
      default:
        yield put(setTableState(tableState.set('loading', false)));
        message.error('数据查询失败');
        break;
    }
  } catch (err) {
    yield put(setTableState(tableState.set('loading', false)));
    message.error('系统异常');
  }
}
export function* removeOnePaper(item) {
  const tableState = yield select(makeSelectTableState());
  try {
    const res = yield QBPaperApi.paperDelete(item.onePaper.id);
    switch (res.code.toString()) {
      case '0':
        message.success('删除成功');
        yield put(setTableState(tableState.set('loading', true)));
        yield put(searchPaperAction());
        break;
      default:
        message.error('删除失败');
        break;
    }
  } catch (e) {
    message.error('系统异常');
  }
}


const judgeCode = async (res) => _.toString(res.code) === '0';

// 获取城市
export function* getCities() {
  const assemblePaperMsgList = yield select(makeAssemblePaperMsgList());
  // const requestURL = `${Config.trlink_qb}/api/region/city`;
  const province = assemblePaperMsgList.find((item) => item.get('type') === 'provinceId');
  // const params = { provinceId: province.get('value') };
  const provinceId = province.get('value');
  // if (!province) {
  //   return;
  // }
  try {
    const res = yield regionApi.getCityByProvinceId(provinceId);
    // call(request, requestURL, Object.assign({}, geturloptions()), params);
    switch (_.toString(res.code)) {
      case '0':
        yield put(setPaperMsgAction('cityId', fromJS(res.data || [])));
        break;
      default:
        message.warning(res.message || '城市列表获取失败');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}

// 创建试卷
export function* getCitiesForCreate() {
  const assemblePaperMsgList = yield select(makeCreatePaperMsgList());
  // const requestURL = `${Config.trlink_qb}/api/region/city`;
  const province = assemblePaperMsgList.find((item) => item.get('type') === 'provinceId');
  const provinceId = province.get('value');
  // const params = { provinceId: province.get('value') };
  if (!province) {
    return;
  }
  try {
    const res = yield regionApi.getCityByProvinceId(provinceId);
    // call(request, requestURL, Object.assign({}, geturloptions()), params);
    switch (_.toString(res.code)) {
      case '0':
        yield put(setCreatePaperMsgAction('cityId', fromJS(res.data || [])));
        break;
      default:
        message.warning(res.message || '城市列表获取失败');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}
// 获取区县
export function* getCountyList() {
  const assemblePaperMsgList = yield select(makeAssemblePaperMsgList());
  // const requestURL = `${Config.trlink_qb}/api/region/county`;
  const province = assemblePaperMsgList.find((item) => item.get('type') === 'provinceId');
  const city = assemblePaperMsgList.find((item) => item.get('type') === 'cityId');
  // const params = { cityId: city.get('value') };
  if (!(city.get('value') && province.get('value'))) {
    return;
  }
  try {
    const res = yield regionApi.getCountyByCityId(city.get('value'));
    // call(request, requestURL, Object.assign({}, geturloptions()), params);
    switch (res.code.toString()) {
      case '0':
        yield put(setPaperMsgAction('countyId', fromJS(res.data || [])));
        yield put(setCreatePaperMsgAction('countyId', fromJS(res.data || [])));
        break;
      default:
        message.warning(res.message || '系统异常');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}

// 获取区县新建试卷
export function* getCountyListForCreate() {
  const assemblePaperMsgList = yield select(makeCreatePaperMsgList());
  // const requestURL = `${Config.trlink_qb}/api/region/county`;
  const province = assemblePaperMsgList.find((item) => item.get('type') === 'provinceId');
  const city = assemblePaperMsgList.find((item) => item.get('type') === 'cityId');
  // const params = { cityId: city.get('value') };
  if (!(city.get('value') && province.get('value'))) {
    return;
  }
  try {
    const res = yield regionApi.getCountyByCityId(city.get('value'));
    // call(request, requestURL, Object.assign({}, geturloptions()), params);
    switch (res.code.toString()) {
      case '0':
        yield put(setCreatePaperMsgAction('countyId', fromJS(res.data || [])));
        break;
      default:
        message.warning(res.message || '系统异常');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}

// 获取课程体系
export function* getEdition() {
  const assemblePaperMsgList = yield select(makeCreatePaperMsgList());
  const courseSystem = yield select(makeCourseSystem());
  // const requestURL = `${Config.zmtrlink}/api/edition`;
  const subject = assemblePaperMsgList.find((item) => item.get('type') === 'subjectId');
  const grade = assemblePaperMsgList.find((item) => item.get('type') === 'gradeId');
  const params = { gradeId: grade.get('value'), subjectId: subject.get('value') };
  if (subject.get('value') <= 0 || grade.get('value') <= 0) {
    return;
  }
  try {
    const res = yield editionApi.getEdition(params);
    // call(request, requestURL, Object.assign({}, gettockenurloptions()), params);
    switch (res.code.toString()) {
      case '0':
        // yield put(setPaperMsgAction('editionId', fromJS(res.data || [])));
        yield put(setCourseSystem(courseSystem.set('data', fromJS(res.data || []))));
        break;
      default:
        message.warning(res.message || '系统异常');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}
// 获取教材版本
export function* getTextBookEdition() {
  const assemblePaperMsgList = yield select(makeCreatePaperMsgList());
  // const requestURL = `${Config.trlink}/api/textbookEdition`;
  const subject = assemblePaperMsgList.find((item) => item.get('type') === 'subjectId');
  const grade = assemblePaperMsgList.find((item) => item.get('type') === 'gradeId');
  const gradeValue = grade.get('value');
  const subjectValue = subject.get('value');
  const teachingVersion = yield select(makeTeachingVersion());
  if (subjectValue <= 0 || gradeValue <= 0) {
    return;
  }
  const selectGrade = grade.get('data').find(item => item.get('id') === gradeValue);
  const params = { phaseId: selectGrade.get('phaseId'), subjectId: subjectValue };
  try {
    const res = yield textbookEditionApi.getTextbookEdition(params);
    // call(request, requestURL, Object.assign({}, geturloptions()), params);
    switch (res.code.toString()) {
      case '0':
        yield put(setTeachingVersion(teachingVersion.set('data', fromJS(res.data || []))));
        break;
      default:
        message.warning(res.message || '系统异常');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}
// 获取筛选数据
export function* getSelectMsg() {
  // const assemblePaperMsgList = yield select(makeAssemblePaperMsgList());
  // const gradeURL = `${Config.trlink}/api/grade`;  // 年级
  // const subjectURL = `${Config.trlink}/api/subject`;  // 学科
  // const termURL = `${Config.trlink}/api/term`;  // 学期
  // const provinceURL = `${Config.trlink_qb}/api/region/province`;  // 省
  // const examTypeURL = `${Config.trlink_qb}/api/examType`;
  try {
    const gradeRes = yield gradeApi.getGrade();
    // call(request, gradeURL, Object.assign({}, getjsonoptions()));
    if (judgeCode(gradeRes)) {
      yield put(setPaperMsgAction('gradeId', fromJS(gradeRes.data || [])));
      yield put(setCreatePaperMsgAction('gradeId', fromJS(gradeRes.data || [])));
    }
    const subjectRes = yield subjectApi.getAllSubject();
    // call(request, subjectURL, Object.assign({}, getjsonoptions()));
    if (judgeCode(subjectRes)) {
      yield put(setPaperMsgAction('subjectId', fromJS(subjectRes.data || [])));
      // yield put(setCreatePaperMsgAction('subjectId', fromJS(subjectRes.data || [])));
    }
    const termRes = yield termApi.getAllTerm();
    // call(request, termURL, Object.assign({}, getjsonoptions()));
    if (judgeCode(termRes)) {
      yield put(setPaperMsgAction('termId', fromJS(termRes.data || [])));
      yield put(setCreatePaperMsgAction('termId', fromJS(termRes.data || [])));
    }
    const provinceRes = yield regionApi.getProvince();
    // call(request, provinceURL, Object.assign({}, getjsonoptions()));
    if (judgeCode(provinceRes)) {
      const newProvinceResData = provinceRes.data || [];
      newProvinceResData.unshift({ id: 0, name: '全国' });
      yield put(setPaperMsgAction('provinceId', fromJS(newProvinceResData)));
      yield put(setCreatePaperMsgAction('provinceId', fromJS(newProvinceResData)));
    }
    const examTypeRes = yield queryNode.queryExamType();
    // call(request, examTypeURL, Object.assign({}, getjsonoptions()));
    if (judgeCode(examTypeRes)) {
      yield put(setPaperMsgAction('examTypeId', fromJS(examTypeRes.data || [])));
      yield put(setCreatePaperMsgAction('examTypeId', fromJS(examTypeRes.data || [])));
    }
  } catch (err) {
    console.log(err);
  } finally {
    console.log('%c筛选数据获取结束。', 'color:rgb(0, 200, 50);font-size:16px;font-weigth:600;');
  }
}

// 保存试卷
export function* assembleExamPaper() {
  //
}

export function* queryNodes() {
  // const repos = yield queryNodesByGroupList(['QB_EXAM_TYPE', 'QB_EXAM_PAPER_TYPE', 'QB_YEAR']);
  try {
    const repos = yield queryNode.queryNodesByGroupList(['QB_YEAR', 'QB_EXAM_PAPER_SOURCE', 'QB_PURPOSE', 'QB_EXAM_PAPER_DIFFICULTY', 'QB_ONLINE_FLAG', 'QB_PAPER_CARD']);
    if (repos.code.toString() === '0') {
      const data = repos.data || {};
      const { QB_YEAR, QB_EXAM_PAPER_SOURCE, QB_PURPOSE, QB_EXAM_PAPER_DIFFICULTY, QB_ONLINE_FLAG, QB_PAPER_CARD } = data;
      yield put(setPaperMsgAction('year', fromJS(QB_YEAR || [])));
      yield put(setPaperMsgAction('source', fromJS(QB_EXAM_PAPER_SOURCE || [])));
      yield put(setPaperMsgAction('purpose', fromJS(QB_PURPOSE || [])));
      yield put(setPaperMsgAction('difficulty', fromJS(QB_EXAM_PAPER_DIFFICULTY || [])));
      yield put(setPaperMsgAction('onlineFlag', fromJS(QB_ONLINE_FLAG || [])));
      yield put(setPaperMsgAction('businessCardId', fromJS(QB_PAPER_CARD || [])));
      yield put(setCreatePaperMsgAction('year', fromJS(QB_YEAR || [])));
      yield put(setCreatePaperMsgAction('source', fromJS(QB_EXAM_PAPER_SOURCE || [])));
      yield put(setCreatePaperMsgAction('purpose', fromJS(QB_PURPOSE || [])));
      yield put(setCreatePaperMsgAction('difficulty', fromJS(QB_EXAM_PAPER_DIFFICULTY || [])));
      yield put(setCreatePaperMsgAction('onlineFlag', fromJS(QB_ONLINE_FLAG || [])));
      yield put(setCreatePaperMsgAction('businessCardId', fromJS(QB_PAPER_CARD || [])));
    }
  } catch (err) {
    //
  }
}

// 获取试卷类型
export function* getPaperTypeSaga() {
  const watcher = yield takeLatest(GET_PAPER_TYPE, getAllPaperType);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 获取测评用途
export function* getPaperPurposeSaga() {
  const watcher = yield takeLatest(GET_PAPER_PURPOSE, getPaperPurpose);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 获取测评对象
export function* getPaperTargetSaga() {
  const watcher = yield takeLatest(GET_PAPER_TARGET, getPaperTarget);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* queryNodesSaga() {
  const watcher = yield takeLatest(QUERY_NODES_ACTION, queryNodes);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* updateOnlineFlag({ data }) {
  const tableState = yield select(makeSelectTableState());
  const { examPaperId, flag } = data;
  console.log(222222222, data);
  try {
    let res;
    if (flag) {
      res = yield call(QBPaperApi.paperOffline, examPaperId);
    } else {
      res = yield call(QBPaperApi.paperOnline, examPaperId);
    }
    const msg = flag ? '下架' : '上架';
    switch (res.code.toString()) {
      case '0':
        message.success(`${msg}成功`);
        yield put(setTableState(tableState.set('loading', true)));
        yield put(searchPaperAction());
        break;
      default:
        message.error(res.message || `${msg}失败`);
        break;
    }
  } catch (e) {
    message.error('系统异常');
  }
}

// 根据试卷类型获取学科
export function* getSubjectByPaperType(action) {
  // const subjectURL = `${Config.zmcqLink}/api/subject/querySubjectByExamPaperType?examPaperType=${action.paperTypeId}`;
  try {
    const res = yield QbSubjectApi.querySubjectByExamPaperType(action.paperTypeId);
    // call(request, subjectURL, Object.assign({}, postjsontokenoptions()));
    if (judgeCode(res)) {
      yield put(setCreatePaperMsgAction('subjectId', fromJS(res.data || [])));
    } else {
      message.error(res.message || '获取学科失败');
    }
  } catch (err) {
    console.log(err);
  }
}

// 查找试卷
export function* getSubjectByPaperTypeSaga() {
  const watcher = yield takeLatest(GET_SUBJECTS_ACTION, getSubjectByPaperType);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// 查找试卷
export function* searchPaperSaga() {
  const watcher = yield takeLatest(SEARCH_PAPER_ACTION, searchPaper);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 删除试卷
export function* removeOnePaperSaga() {
  const watcher = yield takeLatest(REMOVE_ONE_PAPER_ACTION, removeOnePaper);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 获取市
export function* getCitiesSaga() {
  const watcher = yield takeLatest(GET_CITY_LIST_ACTION, getCities);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 获取区县
export function* getCountyListSaga() {
  const watcher = yield takeLatest(GET_COUNTY_LIST_ACTION, getCountyList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getCitiesForCreateSaga() {
  const watcher = yield takeLatest(GET_CITIES_FOR_CREATE_ACTION, getCitiesForCreate);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 获取区县
export function* getCountyListForCreateSaga() {
  const watcher = yield takeLatest(GET_COUNTY_FOR_CREATE_ACTION, getCountyListForCreate);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// 获取版本
export function* getEditionSaga() {
  const watcher = yield takeLatest(GET_EDITION_LIST_ACTION, getEdition);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 获取试卷相关数据
export function* getSelectMsgSaga() {
  const watcher = yield takeLatest(GET_PAPER_MSG_ACTION, getSelectMsg);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 发布试卷
export function* assembleExamPaperSaga() {
  const watcher = yield takeLatest(ASSEMBLE_EXAM_PAPER_ACTION, assembleExamPaper);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 获取教材版本
export function* getTextBookEditionSaga() {
  const watcher = yield takeLatest(GET_TEXTBOOK_EDITION_ACTION, getTextBookEdition);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* updateOnlineFlagSaga() {
  const watcher = yield takeLatest(UPDATE_ONLINE_FLAG, updateOnlineFlag);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getEpBuSaga() {
  const watcher = yield takeLatest(GET_EP_BU, getEpBu);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
  searchPaperSaga,
  removeOnePaperSaga,
  assembleExamPaperSaga,
  getSelectMsgSaga,
  getCitiesSaga,
  getCountyListSaga,
  getEditionSaga,
  getTextBookEditionSaga,
  queryNodesSaga,
  updateOnlineFlagSaga,
  getPaperTypeSaga,
  getPaperPurposeSaga,
  getPaperTargetSaga,
  getEpBuSaga,
  getCitiesForCreateSaga,
  getCountyListForCreateSaga,
  getSubjectByPaperTypeSaga
];
