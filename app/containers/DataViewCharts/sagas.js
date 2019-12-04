import { call, cancel, put, select, take, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';
import { message } from 'antd';
// import moment from 'moment';
import {
  GET_LIST_ACTION,
} from './constants';
import {
  setListAction,
} from './actions';
import {
  makeSelectType,
  makeSelectSearchType,
  makeSelectParams,
} from './selectors';
import Config from '../../utils/config';
import request, { geturloptions } from '../../utils/request';

// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}

export function* getList() {
  // const type = yield select(makeSelectType());
  const params = yield select(makeSelectParams());
  const searchType = yield select( makeSelectSearchType());
  const type = yield select( makeSelectType());
  let key = 'dailyMaxLesCount';
  if (searchType.get('id') == 1) {
    key = type.get('id');
  }
  const xAxisList = [];
  const yAxisList = [];
  // const id = type.get('id').toString();
  // const requestURL = `${Config.tklink}/api/homeworkLesson4Report/findAll`;
  let requestURL = `${Config.trlink}/api/dataReport`;
  if(searchType.get('id') == 2) {
    requestURL = requestURL + '/findLessonTimeCount';
  }
  try {
    const res = yield call(request, requestURL, Object.assign({}, geturloptions()), { startDate: new Date(params.get('startDate')), endDate: new Date(params.get('endDate')), dateTimeType: params.get('dateTimeType'), pageSize: params.get('pageSize'), pageIndex: params.get('pageIndex') });
    const resData = res.data;
    let list = [];
    switch (res.code.toString()) {
      case '0':
        if (searchType.get('id') == 2) {
          list = resData || [];
          list.forEach(function(item){
            let date = item.dateTime;
            let hour = '';
            let minute = '';
            let second = '';
            if (date) {
              date = new Date(date);
              hour = date.getHours();
              minute = date.getMinutes();
              second = date.getSeconds();
              if (second) {
                hour = `${hour}:${minute}:${second}`;
              } else {
                hour = `${hour}:${minute}`;
              }
            }
            yAxisList.push({ name: hour, value: item.count });
            xAxisList.push(hour);
          });
        }
        else if (resData) {
          list = resData.data || [];
          if (list.length > 12 && searchType.get('id') == 1) {
            list = list.slice(list.length - 12);
          }
          if (list.length > 90 && searchType.get('id') == 3) {
            list = list.slice(list.length - 90);
          }
          list.forEach(function(item){
            let x = item.dataDateStr.replace(/[年|月]/g, '-');
            x = x.replace(/[日]/g, '');
            if (typeof(item[key]) != 'undefined') {
              yAxisList.push({ name: x, value: item[key]});
              xAxisList.push(x);
            } else if (key === 'qbTotal') {
              const value = item['qbNotReceiveCount'] + item['qbCutAuditedCount'] + item['qbEntryAuditedCount'] + item['qbTagAuditedCount'] + item['qbStoragedCount'];
              yAxisList.push({ name: x, value});
              xAxisList.push(x);
            }
          });
        }
        // yield put(setListAction(fromJS(list)));
        // console.log(xAxisList,'xAxisList');
        params.get('props').drawCharts(xAxisList, yAxisList, searchType, type);
        break;
      default:
        message.error('出错');
        break;
    }
  } catch (e) {
    message.error(e);
  }
}

export function* makeGetList() {
  const watcher = yield takeLatest(GET_LIST_ACTION, getList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
  makeGetList,
];
