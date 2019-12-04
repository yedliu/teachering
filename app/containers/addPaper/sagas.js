/* eslint-disable no-case-declarations */
import { call, cancel, put, select, take, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';
import { message } from 'antd';
// import moment from 'moment';
import { changeBackPromptAlertShowAction } from 'containers/LeftNavC/actions';
import queryNode from '../../api/qb-cloud/sys-dict-end-point/';
import QBPaperApi from '../../api/qb-cloud/exam-paper-end-point';
import {
  GET_PHASE_SUBJECT_LIST_ACTION,
  GET_GRADE_LIST_ACTION,
  GET_TERM_LIST_ACTION,
  GET_DATA_ACTION,
  GET_FORM_GRADE_LIST,
  ADD_NEW_PAPER_ACTION,
  GET_CITY_LIST_ACITON,
  GET_COUNTY_LIST_ACITON,
  GET_AREA_LIST_ACTION,
  GET_CITY_LIST_ADD_ACITON,
  GET_COUNTY_ADD_LIST_ACITON,
  SET_TABLE_STATE,
  SUBMIT_MODIFY_PAPER,
  DELETE_PAPER_ACTION,
  GET_EDITION_ACTION,
  // SET_EDITION_ACTION,
  CHANGE_WASH_STATE_ACTION, GET_OPERATORS_ACTION, FORCED_RELEASE_ACTION,
  FORCE_SAVE_ACTION, CONVERT_TO_PIC_ACTION,
  QUERY_NODES_ACTION,
  GET_PAPER_TYPE,
  GET_PAPER_PURPOSE,
  GET_PAPER_TARGET,
} from './constants';
import {
  setPhaseSubjectListAction,
  setGradeListaction,
  setSelected,
  setTermListAction,
  setFormGradeListaction,
  setAreaListAction,
  setProvinceIdAction,
  setAreaListAddAction,
  setTableState,
  setTableData,
  setUIStatus,
  setToggleEditModal,
  getDataAction,
  setEditionAction,
  getEditionAction,
  getCountyListAddAction,
  setShowPaperMsgAction, setOperatorsAction, setForcedReleaseModalAction,
  showSamePaperAction,
  setSamePaperListAction,
  changeForceSavingAction,
  setStoreItemAction,
  setPaperType,
  setPaperPurpose,
  setPaperTarget
} from './actions';
import {
  makeSelectphaseSubject,
  makeSelectSelected,
  makeSelectInputDto,
  makeSelectAreaList,
  makeSelectAreaAddList,
  makeSelectTableState,
  makeSelectUIStatus,
  makeSelectEditPaperId,
  makeWashState,
  makeShowPaperMsg,
  makePaperNameForSearch,
  makeSelectPaperType,
} from './selectors';
import Config from '../../utils/config';
import request, { geturloptions, postjsonoptions, gettockenurloptions } from '../../utils/request';
import { saveValidate } from './common';
import { getPaperFields } from 'utils/paperUtils';

const getPaperFieldsFn = getPaperFields();

// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}
export function* getPhaseSubjectList() {
  const requestURL = `${Config.trlink}/api/subject`;
  try {
    const res = yield call(request, requestURL, Object.assign({}, geturloptions()));
    switch (res.code.toString()) {
      case '0':
        yield put(setPhaseSubjectListAction(fromJS(res.data || [])));
        break;
      default:
        console.log('出错');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}
export function* getAllPaperType() {
  try {
    const repos = yield call(queryNode.queryExamPaperTypeV1);
    switch (repos.code.toString()) {
      case '0':
        // eslint-disable-next-line eqeqeq
        yield put(setPaperType(fromJS(repos.data.filter(e => e.id != 20)))); // 不需要心理测评
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
    // console.log('repos', repos)
    switch (repos.code.toString()) {
      case '0':
        yield put(setPaperPurpose(fromJS(repos.data)));
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
        yield put(setPaperTarget(fromJS(repos.data)));
        break;
      default:
        break;
    }
  } catch (err) {

  }
}

export function* getGradeList() {
  // const params = {phaseId:curPhaseSubject.get("phaseId")}
  const requestURL = `${Config.trlink}/api/grade`;
  try {
    const res = yield call(request, requestURL, Object.assign({}, geturloptions()), {});
    switch (res.code.toString()) {
      case '0':
        const data = fromJS(res.data || []);
        yield put(setGradeListaction(data));
        yield put(setFormGradeListaction(data));
        yield put(getEditionAction());
        // yield put(setSelected(selected.set('grade',res.data[0].id)));
        break;
      default:
        message.warning(res.message || '年级列表获取失败');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}
export function* getTermList() {
  const selected = yield select(makeSelectSelected());
  // const params = { startDate: '2017/01/01', endDate: '2018/01/01' }
  const requestURL = `${Config.trlink}/api/term`;
  try {
    const res = yield call(request, requestURL, Object.assign({}, geturloptions()));
    switch (res.code.toString()) {
      case '0':
        const data = fromJS(res.data || []);
        yield put(setTermListAction(data));
        yield put(setSelected(selected.set('termId', '')));
        break;
      default:
        message.warning(res.message || '系统异常');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}
export function* getDataList() {
  // console.log('getDataList');
  const selected = yield select(makeSelectSelected());
  const subjectId = yield select(makeSelectphaseSubject());
  let tableState = yield select(makeSelectTableState());
  const paperNameForSearch = yield select(makePaperNameForSearch());
  let tableStateJs = tableState.toJS();
  let Obj = selected.toJS();
  Obj.pageIndex = tableStateJs.pagination.current || 1;
  Obj.sort = tableStateJs.sort || '';
  Obj.subjectId = subjectId.get('id') || '';
  // console.log(Obj)

  let params = (() => {
    for (let i in Obj) {
      if (!Obj[i]) {
        delete Obj[i];
      }
    }
    return Obj;
  })();
  if (params.exStartDate) {
    params.exStartDate += ' 00:00:00';
  }
  if (params.exEndDate) {
    params.exEndDate += ' 23:59:59';
  }
  params.searchAllFlag = true;
  if (paperNameForSearch.replace(/\s+/g, '')) params.name = paperNameForSearch;
  // const requestURL = `${Config.trlink_qb}/api/examPaper`;
  try {
    const res = yield QBPaperApi.findExamPaper(params);
    switch (res.code.toString()) {
      case '0':
        const data = fromJS(res.data.list);
        tableStateJs.pagination.total = res.data.total;
        tableStateJs.pagination.totalPage = res.data.pageCount;
        yield put(setTableState(fromJS(tableStateJs)));
        yield put(setTableData(data));
        break;
      default:
        message.warning(res.message || '系统异常');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}
export function* getFormGradeList() {
  const requestURL = `${Config.trlink}/api/grade`;
  try {
    const res = yield call(request, requestURL, Object.assign({}, geturloptions()), {});
    switch (res.code.toString()) {
      case '0':
        const data = fromJS(res.data || []);
        yield put(setFormGradeListaction(data));
        yield put(getEditionAction());
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
// flag 用于判断是否强制提交
export function* addNewPaper(flag, item) {
  yield put(changeForceSavingAction(true));
  const dto = yield select(makeSelectInputDto());
  const UIstatus = yield select(makeSelectUIStatus());
  const paperType = yield select(makeSelectPaperType());
  const params = dto.toJS();
  let needFields = [];
  if (params.typeId) {
    try {
      needFields = [...getPaperFieldsFn(params.typeId, paperType.toJS(), 'extra')];
    } catch (error) {
      message.error('试卷类型数据异常, 请重试');
      return;
    }
    needFields.push('typeId');
    needFields.push('fileUrl');
    if (needFields.includes('editionId')) {
      needFields.push('editionName');
      needFields.push('systemValue');
    }
    if (needFields.includes('teachingEditionId')) {
      needFields.push('teachingEditionName');
      needFields.push('versionValue');
    }
    // 把不需要的字段删了
    for (let key in params) {
      if (!needFields.includes(key)) {
        if (key === 'gradeId') {
          params[key] = '';
        } else {
          params[key] = null;
        }
      }
    }
  }

  delete params.phaseId;
  if (!saveValidate(paperType.toJS(), params)) {
    return;
  }
  params.forceSaveFlag = flag;
  try {
    // const res = yield call(request, requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
    const res = yield QBPaperApi.paperInfoSave(params);
    switch (res.code.toString()) {
      case '0':
        yield put(showSamePaperAction(false));
        yield put(setUIStatus(UIstatus.set('addStp', 3)));
        break;
      case '2':
        message.info(res.message || '已存在类似试卷');
        yield put(setSamePaperListAction(fromJS(res.data || [])));
        yield put(showSamePaperAction(true));
        break;
      default:
        message.warning(res.message || '添加失败');
        break;
    }
    yield put(changeForceSavingAction(false));
  } catch (e) {
    console.log('出错啦~', e);
    yield put(changeForceSavingAction(false));
  }
}
export function* modifyPaper(item) {
  const dto = yield select(makeSelectInputDto());
  const id = yield select(makeSelectEditPaperId());
  const paperType = yield select(makeSelectPaperType());
  // const requestURL = `${Config.trlink_qb}/api/examPaper/${id}`;
  const params = dto.toJS();
  let needFields = [];
  try {
    console.log(params, paperType.toJS(), 22222);
    needFields = [...getPaperFieldsFn(params.typeId, paperType.toJS(), 'extra')];
  } catch (error) {
    message.error('试卷类型数据异常, 请重试');
    return;
  }
  needFields.push('typeId');
  if (needFields.includes('editionId')) {
    needFields.push('editionName');
    needFields.push('systemValue');
  }
  if (needFields.includes('teachingEditionId')) {
    needFields.push('teachingEditionName');
    needFields.push('versionValue');
  }
  // 把不需要的字段删了
  for (let key in params) {
    if (!needFields.includes(key)) {
      if (key === 'gradeId') {
        params[key] = '';
      } else {
        params[key] = null;
      }
    }
  }

  delete params.fileUrl;
  delete params.phaseId;
  if (!saveValidate(paperType.toJS(), params)) {
    return;
  }
  delete params.phaseId;
  params.id = id;
  try {
    const res = yield QBPaperApi.paperInfoModify(params);
    switch (res.code.toString()) {
      case '0':
        message.success('修改成功！');
        yield put(getDataAction());
        yield put(setToggleEditModal());
        break;
      default:
        message.warning(res.message || '修改失败！');
        console.log('modifyPaper出错');
        break;
    }
  } catch (e) {
    console.log('modifyPaper出错啦~', e);
  }
}
export function* deletePaper() {
  const id = yield select(makeSelectEditPaperId());
  // const requestURL = `${Config.trlink_qb}/api/examPaper/${id}`;
  try {
    // const res = yield call(request, requestURL, Object.assign({}, deletejsonoptions()), {});
    const res = yield QBPaperApi.paperDelete(id);
    switch (res.code.toString()) {
      case '0':
        message.warning('删除成功！');
        yield put(getDataAction());
        break;
      default:
        message.warning(res.message || '删除失败！');
        console.log('删除失败！');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}
export function* getCityList(bool) {
  const selected = yield select(makeSelectSelected());
  const areaList = yield select(makeSelectAreaList());
  const requestURL = `${Config.trlink_qb}/api/region/city`;
  const params = { provinceId: selected.get('provinceId') };
  if (!selected.get('provinceId')) {
    return;
  }
  try {
    const res = yield call(request, requestURL, Object.assign({}, geturloptions()), params);
    switch (res.code.toString()) {
      case '0':
        const citys = areaList.set('city', res.data);
        yield put(setAreaListAction(citys));
        break;
      default:
        message.warning(res.message || '城市列表获取失败');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}
export function* getCityListAdd() {
  const dto = yield select(makeSelectInputDto());
  const areaList = yield select(makeSelectAreaAddList());
  const requestURL = `${Config.trlink_qb}/api/region/city`;
  const params = { provinceId: dto.get('provinceId') };
  if (!params.provinceId) {
    return;
  }
  try {
    const res = yield call(request, requestURL, Object.assign({}, geturloptions()), params);
    switch (res.code.toString()) {
      case '0':
        const citys = areaList.set('city', res.data);
        yield put(setAreaListAddAction(citys));
        yield put(getCountyListAddAction());
        break;
      default:
        message.warning(res.message || '系统异常');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}
export function* getCountyList(bool) {
  const selected = yield select(makeSelectSelected());
  const areaList = yield select(makeSelectAreaList());
  const requestURL = `${Config.trlink_qb}/api/region/county`;
  const params = { cityId: selected.get('cityId') };
  if (!selected.get('cityId')) {
    return;
  }
  try {
    const res = yield call(request, requestURL, Object.assign({}, geturloptions()), params);
    switch (res.code.toString()) {
      case '0':
        const citys = areaList.set('county', res.data);
        yield put(setAreaListAction(citys));
        break;
      default:
        message.warning(res.message || '系统异常');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}
export function* getCountyListAdd() {
  const dto = yield select(makeSelectInputDto());
  const areaList = yield select(makeSelectAreaAddList());
  const requestURL = `${Config.trlink_qb}/api/region/county`;
  const params = { cityId: dto.get('cityId') };
  if (!dto.get('cityId')) {
    return;
  }
  try {
    const res = yield call(request, requestURL, Object.assign({}, geturloptions()), params);
    switch (res.code.toString()) {
      case '0':
        const citys = areaList.set('county', res.data);
        yield put(setAreaListAddAction(citys));
        break;
      default:
        message.warning(res.message || '系统异常');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}
export function* getProvinceIdList() {
  const requestURL = `${Config.trlink_qb}/api/region/province`;
  try {
    const res = yield call(request, requestURL, Object.assign({}, geturloptions()), {});
    switch (res.code.toString()) {
      case '0':
        res.data.unshift({ id: 0, name: '全国' });
        yield put(setProvinceIdAction(fromJS(res.data)));
        break;
      default:
        message.warning(res.message || '系统异常');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}

export function* getEditionList() {
  const dto = yield select(makeSelectInputDto());
  const subjectId = dto.get('subjectId');
  const gradeId = dto.get('gradeId');
  if (!subjectId || !gradeId) {
    return false;
  }
  let params = {
    subjectId,
    gradeId,
  };

  const requestURL = `${Config.zmtrlink}/api/edition`;
  try {
    const res = yield call(request, requestURL, Object.assign({}, gettockenurloptions()), params);
    switch (res.code.toString()) {
      case '0':
        yield put(setEditionAction(fromJS(res.data || [])));
        break;
      default:
        console.log('出错');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}
export function* getSeePaperData() {
  const washState = yield select(makeWashState());
  const url1 = `${Config.trlink_qb}/api/examPaper/${washState.get('id')}`;
  const url2 = `${Config.trlink_qb}/api/examPaper/getNewOne`;
  const showMsg = yield select(makeShowPaperMsg());
  let requestURL = '';
  let params = {};
  if (washState.get('state') === 'before') {
    requestURL = url1;
    params = {};
  } else {
    requestURL = url2;
    params = { id: washState.get('id') };
  }
  const bigMsg = [];
  const questionsList = [];
  try {
    yield put(changeBackPromptAlertShowAction(true));
    const res = yield call(request, requestURL, Object.assign({}, geturloptions()), params);
    switch (res.code.toString()) {
      case '0':
        if (!res.data.examPaperContentOutputDTOList || res.data.examPaperContentOutputDTOList.length <= 0) {
          message.warn('该试卷还未录入或录入数据为空。');
        } else {
          res.data.examPaperContentOutputDTOList.forEach((item, index) => {
            bigMsg.push({ count: item.examPaperContentQuestionOutputDTOList.length, name: item.name, serialNumber: item.serialNumber });
            item.examPaperContentQuestionOutputDTOList.forEach((it, i) => {
              questionsList.push(it);
            });
          });
          yield put(setShowPaperMsgAction(showMsg.set('showView', true).set('questionList', fromJS(questionsList || [])).set('bigMsg', fromJS(bigMsg) || []).set('paperData', fromJS(res.data))));
        }
        break;
      default:
        message.warn(res.message || '系统错误导致获取失败试卷');
        break;
    }
    yield put(changeBackPromptAlertShowAction(false));
  } catch (err) {
    console.log('出错啦~', err);
    message.error('执行错误导致获取试卷失败');
    yield put(changeBackPromptAlertShowAction(false));
  }
}

export function* getOperators() {
  const id = yield select(makeSelectEditPaperId());
  const requestURL = `${Config.trlink_qb}/api/examPaper/${id}/action/findOperatorsByEpId`;
  try {
    const res = yield call(request, requestURL, Object.assign({}, geturloptions()));
    switch (res.code.toString()) {
      case '0':
        if (res.data != null) {
          yield put(setOperatorsAction(fromJS(res.data || {})));
        } else {
          message.error('没有查询到数据，请稍后再试', 2);
        }
        break;
      default:
        console.log('出错');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}

export function* makeGetOperators() {
  const watcher = yield takeLatest(GET_OPERATORS_ACTION, getOperators);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* forcedRelease() {
  const id = yield select(makeSelectEditPaperId());
  const requestURL = `${Config.trlink_qb}/api/examPaper/${id}/action/forcedRelease`;
  try {
    const res = yield call(request, requestURL, Object.assign({}, postjsonoptions()));
    switch (res.code.toString()) {
      case '0':
        message.success('释放成功', 2);
        yield put(setForcedReleaseModalAction(false));
        yield put(getDataAction());
        break;
      default:
        message.error('释放失败', 2);
        console.log('出错');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}

export function* convertToPic() {
  const id = yield select(makeSelectEditPaperId());
  const requestURL = `${Config.trlink_qb}/api/examPaper/${id}/action/convertToPic`;
  try {
    const res = yield call(request, requestURL, Object.assign({}, postjsonoptions()));
    switch (res.code.toString()) {
      case '0':
        message.success('转化中', 2);
        yield put(getDataAction());
        break;
      default:
        message.error('操作失败', 2);
        console.log('出错');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}

export function* queryNodes() {
  const repos = yield queryNode.queryNodesByGroupList(['QB_YEAR', 'QB_EXAM_PAPER_SOURCE', 'QB_PAPER_CARD', 'QB_TERM_TYPE', 'QB_EXAM_TYPE']);
  if (repos.code.toString() === '0') {
    const data = repos.data || {};
    const { QB_YEAR, QB_EXAM_PAPER_SOURCE, QB_PAPER_CARD, QB_TERM_TYPE, QB_EXAM_TYPE } = data;
    yield put(setStoreItemAction('yearList', fromJS(QB_YEAR || [])));
    yield put(setStoreItemAction('businessCardList', fromJS(QB_PAPER_CARD || [])));
    yield put(setStoreItemAction('termList', fromJS(QB_TERM_TYPE || [])));
    yield put(setStoreItemAction('formTermList', fromJS(QB_TERM_TYPE || [])));
    yield put(setStoreItemAction('examTypeList', fromJS(QB_EXAM_TYPE || [])));
    yield put(setStoreItemAction('examPaperSourceList', fromJS(QB_EXAM_PAPER_SOURCE || [])));
  }
}

export function* queryNodesSaga() {
  const watcher = yield takeLatest(QUERY_NODES_ACTION, queryNodes);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* makeGetPhaseSubjectList() {
  const watcher = yield takeLatest(GET_PHASE_SUBJECT_LIST_ACTION, getPhaseSubjectList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* makeGetGradeList() {
  const watcher = yield takeLatest(GET_GRADE_LIST_ACTION, getGradeList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* makeGetTermList() {
  const watcher = yield takeLatest(GET_TERM_LIST_ACTION, getTermList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* makeDataList() {
  const watcher = yield takeLatest(GET_DATA_ACTION, getDataList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* makeFormGradeList() {
  const watcher = yield takeLatest(GET_FORM_GRADE_LIST, getFormGradeList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* makeAddNewPaper() {
  const watcher = yield takeLatest(ADD_NEW_PAPER_ACTION, (item) => addNewPaper(false, item)); // 传入参数，否则默认的参数为 constants 的值
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* makeGetCityListAction() {
  const watcher = yield takeLatest(GET_CITY_LIST_ACITON, getCityList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* makeGetCountyIdListAction() {
  const watcher = yield takeLatest(GET_COUNTY_LIST_ACITON, getCountyList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* makeGetCityListAddAction() {
  const watcher = yield takeLatest(GET_CITY_LIST_ADD_ACITON, getCityListAdd);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* makeGetCountyIdListAddAction() {
  const watcher = yield takeLatest(GET_COUNTY_ADD_LIST_ACITON, getCountyListAdd);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* makeGetProvinceIdAction() {
  const watcher = yield takeLatest(GET_AREA_LIST_ACTION, getProvinceIdList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
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

export function* makeGetTableAction() {
  // console.log('makeGetTableAction');
  const watcher = yield takeLatest(SET_TABLE_STATE, getTableData);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher); s;
}
export function* makeModifyPaper() {
  const watcher = yield takeLatest(SUBMIT_MODIFY_PAPER, modifyPaper);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* makeDeletePaper() {
  const watcher = yield takeLatest(DELETE_PAPER_ACTION, deletePaper);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* makeGetEditonList() {
  const watcher = yield takeLatest(GET_EDITION_ACTION, getEditionList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getSeePaperDataSaga() {
  const watcher = yield takeLatest(CHANGE_WASH_STATE_ACTION, getSeePaperData);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* makeForcedRelease() {
  const watcher = yield takeLatest(FORCED_RELEASE_ACTION, forcedRelease);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* forceSaveSaga() {
  const watcher = yield takeLatest(FORCE_SAVE_ACTION, (item) => addNewPaper(true, item)); // 传递 flag，强制保存并发布试卷
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* convertToPicSaga() {
  const watcher = yield takeLatest(CONVERT_TO_PIC_ACTION, convertToPic); // 传递 flag，强制保存并发布试卷
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
  makeGetPhaseSubjectList,
  makeGetGradeList,
  makeGetTermList,
  makeDataList,
  makeFormGradeList,
  makeAddNewPaper,
  makeGetCityListAction,
  makeGetCountyIdListAction,
  makeGetProvinceIdAction,
  makeGetCityListAddAction,
  makeGetCountyIdListAddAction,
  makeModifyPaper,
  makeDeletePaper,
  makeGetEditonList,
  getSeePaperDataSaga,
  makeGetOperators,
  makeForcedRelease,
  forceSaveSaga,
  convertToPicSaga,
  queryNodesSaga,
  getPaperTypeSaga,
  getPaperPurposeSaga,
  getPaperTargetSaga,
];
