import { call, cancel, put, select, take, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';
import request, { geturloptions } from 'utils/request';
import { Config } from 'utils/config';

import { GET_REPORTLIST_ACTION, GET_SUBJECT_LIST_ACTION } from './constants';
import { setLoadStateAction, setSubjectListAction, setReportListAction } from './actions';
import { makeSelectedRangeDateValue, makeSearchItemValue } from './selectors';
import subjectApi from 'api/tr-cloud/subject-endpoint';

// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}

/**
 * 获取统计结果
 */
function* getReportData() {
  // 调用接口获取数据，写入list
  const requestURL = `${Config.data}/api/data-report/homework-report`;
  const range = yield select(makeSelectedRangeDateValue());
  const SearchItems = yield select(makeSearchItemValue());
  const formatStr = 'YYYY-MM-DD';
  const param = {
    startTime: range[0].format(formatStr),
    endTime: range[1].format(formatStr),
    subject: SearchItems.get('subject') || '',
    homeworkType: SearchItems.get('homeType') || '1',
  };
  try {
    yield put(setLoadStateAction(true));
    const repos = yield call(request, requestURL, Object.assign({}, geturloptions()), param);
    switch (repos.code.toString()) {
      case '0':
        yield put(setReportListAction(fromJS(repos.data && repos.data.length > 0 ? repos.data : [])));
        yield put(setLoadStateAction(false));
        break;
      default:
        yield put(setReportListAction(fromJS([])));
        yield put(setLoadStateAction(false));
        break;
    }
  } catch (err) {
    yield put(setReportListAction(fromJS([])));
    yield put(setLoadStateAction(false));
  }
}

/**
 * 获取科目列表
 */
export function* getSubjectListData() {
  // const requestURL = `${Config.trlink}/api/subject`;
  try {
    const repos = yield subjectApi.getAllSubject();
    // call(request, requestURL, Object.assign({}, geturloptions()), {});
    switch (repos.code.toString()) {
      case '0':
        yield put(setSubjectListAction(fromJS(repos.data && repos.data.length > 0 ? repos.data : [])));
        break;
      default:
        yield put(setSubjectListAction(fromJS([])));
        break;
    }
  } catch (err) {
    yield put(setSubjectListAction(fromJS([])));
  }
}


// ALL WACTHER SAGAS
/**
 * 获取通用学科
 */
export function* wacthSubjectSagas() {
  const watcher = yield takeLatest(GET_SUBJECT_LIST_ACTION, getSubjectListData);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getReportDataSagas() {
  const watcher = yield takeLatest(GET_REPORTLIST_ACTION, getReportData);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}


// All sagas to be loaded
export default [
  defaultSaga,
  getReportDataSagas,
  wacthSubjectSagas,
];
