import { cancel, put, select, take, takeLatest } from 'redux-saga/effects';

import { fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import { message } from 'antd';
import { GET_SALARY_DETAIL_ACTION, GET_SALARYDATA_ACTION, PAGE_SIZE } from './constants';
import {
  setLoadingStateAction, setSalaryDetailAction, setSalaryDtaAction, setTotalCountAction,
  setPersonalMsgAction,
} from './actions';
import {
  makeCurrentPageNumberValue,
  makeSearchMobileValue,
  makeSearchNameValue,
  // makeSelectDate,
  makeSelectedDate,
  makePersonalTableMsg,
} from './selectors';
import workloadApi from '../../api/qb-cloud/workload-endpoint';

export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}

// data
export function* getSalaryData() {
  // const requestURL = `${Config.trlink_qb}/api/workload`;
  yield put(setLoadingStateAction(true));
  // let data = [];
  // for(var i=0;i<30;i++){
  //   data.push({id:i,name:`name${i}`,role:`role${i}`,mobile:'11223344550',idCard:'001',bankId:'001',date:'2018-01-01',salary:'23.44'})
  // }
  // yield put(setTotalCountAction(30));
  // yield put(setCurrentPageNumberAction(1));
  // yield put(setSalaryDtaAction(fromJS(data)));
  // return;
  // const date = yield select(makeSelectDate());
  const betweenDate = yield select(makeSelectedDate());
  const startDateInit = betweenDate.get('startDate');
  const endDateInit = betweenDate.get('endDate');
  if (!startDateInit) {
    message.info('请选择开始时间');
    yield put(setLoadingStateAction(false));
    return;
  }
  if (!endDateInit) {
    message.info('请选择结束时间');
    yield put(setLoadingStateAction(false));
    return;
  }
  const start = startDateInit.format('YYYY/MM/DD HH:mm:ss');
  const end = endDateInit.format('YYYY/MM/DD HH:mm:ss');
  if (start.replace('/', '') > end.replace('/', '')) {
    message.info('开始时间不能小于结束时间');
    yield put(setLoadingStateAction(false));
    return;
  }
  const startDate = new Date(start);
  const endDate = new Date(end);
  const days = (endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24;
  if (days > 60) {
    message.info('所隔天数不能超过60天');
    yield put(setLoadingStateAction(false));
    return;
  }
  const pageIndex = yield select(makeCurrentPageNumberValue());
  const mobile = yield select(makeSearchMobileValue());
  const userName = yield select(makeSearchNameValue());
  const pageSize = PAGE_SIZE;
  console.log('params=>', startDate, endDate, mobile, userName);
  try {
    const repos = yield workloadApi.findAll({
      pageIndex, pageSize, startDate, endDate, mobile, userName
    });
    switch (repos.code.toString()) {
      case '0':
        yield put(setLoadingStateAction(false));
        yield put(setTotalCountAction(repos.data.page && repos.data.page.total >= 0 ? repos.data.page.total : 0));
        yield put(setSalaryDtaAction(fromJS(repos.data || [])));
        break;
      default:
        yield put(setLoadingStateAction(false));
        yield put(setTotalCountAction(0));
        yield put(setSalaryDtaAction(fromJS({})));
        break;
    }
  } catch (err) {
    yield put(setLoadingStateAction(false));
    yield put(setTotalCountAction(0));
    yield put(setSalaryDtaAction(fromJS({})));
  }
}

export function* getSalaryDetail() {
  // const requestURL = `${Config.trlink_qb}/api/workload/findPersonal`;
  yield put(setLoadingStateAction(true));
  // const pageIndex = yield select(makeCurrentPageNumberValue());
  const personalTableMsg = yield select(makePersonalTableMsg());
  // const workerUserId = yield select(makeWorkerUserId());
  // const workerUserId = 180;
  const betweenDate = yield select(makeSelectedDate());
  const startDateInit = betweenDate.get('startDate');
  const endDateInit = betweenDate.get('endDate');
  if (!startDateInit) {
    message.info('请选择开始时间');
    yield put(setLoadingStateAction(false));
    return;
  }
  if (!endDateInit) {
    message.info('请选择结束时间');
    yield put(setLoadingStateAction(false));
    return;
  }
  const start = startDateInit.format('YYYY/MM/DD HH:mm:ss');
  const end = endDateInit.format('YYYY/MM/DD HH:mm:ss');
  if (start.replace('/', '') > end.replace('/', '')) {
    message.info('开始时间不能小于结束时间');
    yield put(setLoadingStateAction(false));
    return;
  }
  const startDate = new Date(start);
  const endDate = new Date(end);

  const params = {
    pageIndex: personalTableMsg.get('currentPageNumber'),
    pageSize: personalTableMsg.get('size'),
    workerUserId: personalTableMsg.get('workerUserId'),
    startDate,
    endDate
  };
  if (params.workerUserId <= 0) {
    message.warn('获取明细数据失败');
    return;
  }
  try {
    const repos = yield workloadApi.findPersonal(params);
    switch (repos.code.toString()) {
      case '0':
        yield put(setLoadingStateAction(false));
        yield put(setSalaryDetailAction(fromJS(repos.data)));
        yield put(setPersonalMsgAction(personalTableMsg
          .set('total', repos.data.total || 0)
          // .set('size', repos.data.size || 10)
        ));
        break;
      default:
        yield put(setLoadingStateAction(false));
        yield put(setSalaryDetailAction(fromJS({})));
        yield put(setPersonalMsgAction(personalTableMsg
          .set('total', 0)
          // .set('size', 10)
          .set('currentPageNumber', 1)
        ));
        break;
    }
  } catch (err) {
    yield put(setLoadingStateAction(false));
    yield put(setSalaryDetailAction(fromJS({})));
  }
}

export function* getSalaryDataSagas() {
  const watcher = yield takeLatest(GET_SALARYDATA_ACTION, getSalaryData);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getSalaryDetailSagas() {
  const watcher = yield takeLatest(GET_SALARY_DETAIL_ACTION, getSalaryDetail);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  defaultSaga,
  getSalaryDataSagas,
  getSalaryDetailSagas,
];
