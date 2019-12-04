import { call, cancel, put, select, take, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';
import { message } from 'antd';
import moment from 'moment';
// import moment from 'moment';
import {
  GET_LIST_ACTION,
  GET_ONE_TO_ONE_CLASS_ACTION,
  GET_SMALL_CLASS_ACTION,
} from './constants';
import {
  setListAction,
} from './actions';
import {
  // makeSelectType,
  makeSelectParams,
} from './selectors';
import Config from '../../utils/config';
import request, { geturloptions, posturloptions, JsonToUrlParams } from '../../utils/request';

// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}

export function* getList() {
  // console.log('getList');
  // const type = yield select(makeSelectType());
  const params = yield select(makeSelectParams());
  const data = {};
  // const id = type.get('id').toString();
  // const requestURL = `${Config.tklink}/api/homeworkLesson4Report/findAll`;
  const requestURL = `${Config.trlink}/api/dataReport`;
  try {
    // console.log(params.get('startDate'),params.get('endDate'));
    const res = yield call(request, requestURL, Object.assign({}, geturloptions()), { startDate: new Date(params.get('startDate')), endDate: new Date(params.get('endDate')), dateTimeType: params.get('dateTimeType'), pageSize: params.get('pageSize'), pageIndex: params.get('pageIndex') });
    const resData = res.data;
    let list = [];
    switch (res.code.toString()) {
      case '0':
        if (resData) {
          list = resData.data || [];
        }
        yield put(setListAction(fromJS(list)));
        break;
      default:
        message.error('出错');
        break;
    }
  } catch (e) {
    message.error(e);
  }
}
export function* getOneToOneList() {
  const paramsInfo = yield select(makeSelectParams());
  const requestURL = `${Config.trlink}/api/numberOfClassesStatistic/queryOneToOneClassNumber`;
  const params = {
    startDate: moment(paramsInfo.get('startDate')).format('YYYY-MM-DD'),
    endDate: moment(paramsInfo.get('endDate')).format('YYYY-MM-DD'),
  };
  try {
    const res = yield call(request, requestURL, Object.assign({}, posturloptions, { body: JsonToUrlParams(params) }));
    switch (res.code.toString()) {
      case '0':
        yield put(setListAction(fromJS(res.data ? res.data : [])));
        break;
      default:
        yield put(setListAction(fromJS([])));
        message.warning(res.message || '查询失败');
        break;
    }
  } catch (e) {
    message.warning(res.message || '查询失败');
    message.error(e);
  }
}
export function* getSmallClassList() {
  const paramsInfo = yield select(makeSelectParams());
  const requestURL = `${Config.trlink}/api/numberOfClassesStatistic/queryLittleClassNumber`;
  const params = {
    startDate: moment(paramsInfo.get('startDate')).format('YYYY-MM-DD'),
    endDate: moment(paramsInfo.get('endDate')).format('YYYY-MM-DD'),
  };
  try {
    // console.log(paramsInfo.get('startDate'), paramsInfo.get('endDate'));
    // const res = yield call(request, requestURL, Object.assign({}, posturloptions()), { startDate: new Date(params.get('startDate')), endDate: new Date(params.get('endDate')), dateTimeType: params.get('dateTimeType'), pageSize: params.get('pageSize'), pageIndex: params.get('pageIndex') });
    const res = yield call(request, requestURL, Object.assign({}, posturloptions, { body: JsonToUrlParams(params) }));
    switch (res.code.toString()) {
      case '0':
        yield put(setListAction(fromJS(res.data ? res.data : [])));
        break;
      default:
        yield put(setListAction(fromJS([])));
        message.warning(res.message || '查询失败');
        break;
    }
  } catch (e) {
    message.warning(res.message || '查询失败');
    message.error(e);
  }
}

export function* makeGetList() {
  const watcher = yield takeLatest(GET_LIST_ACTION, getList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* makeGetOneToOneList() {
  const watcher = yield takeLatest(GET_ONE_TO_ONE_CLASS_ACTION, getOneToOneList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* makeGetSmallClassList() {
  const watcher = yield takeLatest(GET_SMALL_CLASS_ACTION, getSmallClassList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
  makeGetList,
  makeGetOneToOneList,
  makeGetSmallClassList,
];
