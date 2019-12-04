import {
  take,
  put,
  select,
  cancel,
  takeLatest
} from 'redux-saga/effects';
import { fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import { message } from 'antd';
import {
  GET_SUBJECTS_ACTION,
  GET_SALARYCONFIGLIST_ACTION,
  OPERATE_SALARYCONFIGITEM_ACTION
} from './constants';
import {
  setSubjectsAction,
  setSelectSubjectAction,
  getSalaryConfigListAction,
  setSalaryConfigListAction,
  setOperateModalOpenAction
} from './actions';
import {
  makeSelectLevelValue,
  makeSelectSubjectValue,
  makeSelectOperateItem
} from './selectors';
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}

import subjectApi from '../../api/tr-cloud/subject-endpoint';
import salaryStandardConfigApi from '../../api/qb-cloud/salary-standard-config-end-point';

// 学科
export function* getCourseWareSubjectData() {
  // const requestURL = `${Config.trlink}/api/subject`;
  try {
    const repos = yield subjectApi.getAllSubject();
    switch (repos.code.toString()) {
      case '0':
        yield put(
          setSubjectsAction(
            fromJS(repos.data && repos.data.length > 0 ? repos.data : [])
          )
        );
        yield put(
          setSelectSubjectAction(
            repos.data && repos.data.length > 0 ? repos.data[0].name : ''
          )
        );
        yield put(getSalaryConfigListAction());
        break;
      default:
        yield put(setSubjectsAction(fromJS([])));
        yield put(setSelectSubjectAction(''));
        break;
    }
  } catch (err) {
    yield put(setSubjectsAction(fromJS([])));
    yield put(setSelectSubjectAction(''));
  }
}
// 查询所有
export function* getSalaryConfigListData() {
  // const requestURL = `${Config.trlink_qb}/api/salaryStandardConfig`;
  const stage = yield select(makeSelectLevelValue());
  const subject = yield select(makeSelectSubjectValue());
  try {
    const repos = yield salaryStandardConfigApi.findAll({ stage, subject });
    switch (repos.code.toString()) {
      case '0':
        yield put(
          setSalaryConfigListAction(
            fromJS(repos.data && repos.data.length > 0 ? repos.data : [])
          )
        );
        break;
      default:
        yield put(setSalaryConfigListAction(fromJS([])));
        break;
    }
  } catch (err) {
    yield put(setSalaryConfigListAction(fromJS([])));
  }
}
// 操作工价
export function* operateSalaryConfigItemData() {
  // const requestURL = `${Config.trlink_qb}/api/salaryStandardConfig`;
  const selectItem = yield select(makeSelectOperateItem());
  const params = {
    questionTypeId: selectItem.get('questionTypeId'),
    cutUnitPrice: selectItem.get('cutUnitPrice'),
    cutAuditUnitPrice: selectItem.get('cutAuditUnitPrice'),
    entryUnitPrice: selectItem.get('entryUnitPrice'),
    entryAuditUnitPrice: selectItem.get('entryAuditUnitPrice'),
    tagUnitPrice: selectItem.get('tagUnitPrice'),
    tagAuditUnitPrice: selectItem.get('tagAuditUnitPrice'),
    finalAuditUnitPrice: selectItem.get('finalAuditUnitPrice'),
    stage: selectItem.get('stage'),
    subject: selectItem.get('subject')
  };
  try {
    const repos = yield salaryStandardConfigApi.save(params);
    switch (repos.code.toString()) {
      case '0':
        message.success('操作成功！', 2);
        yield put(setOperateModalOpenAction(false));
        yield put(getSalaryConfigListAction());
        break;
      default:
        message.warning('操作失败！', 2);
        break;
    }
  } catch (err) {
    message.error('操作失败！', 2);
  }
}
export function* getCourseWareSubjectSagas() {
  const watcher = yield takeLatest(
    GET_SUBJECTS_ACTION,
    getCourseWareSubjectData
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getSalaryConfigListSagas() {
  const watcher = yield takeLatest(
    GET_SALARYCONFIGLIST_ACTION,
    getSalaryConfigListData
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* operateSalaryConfigItemSagas() {
  const watcher = yield takeLatest(
    OPERATE_SALARYCONFIGITEM_ACTION,
    operateSalaryConfigItemData
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  defaultSaga,
  getCourseWareSubjectSagas,
  getSalaryConfigListSagas,
  operateSalaryConfigItemSagas
];
