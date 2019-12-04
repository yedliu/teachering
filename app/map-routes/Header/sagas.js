import { take, call, put, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import request, { geturloptions } from 'utils/request';
import Config from 'utils/config';
import { fromJS } from 'immutable';
import {
  GET_VERIFY_CODE_ACTION,
} from './constants';
import {
  changeVerifyCodeAction,
} from './actions';

// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}

export function* getVerifyCode() {
  const requestURL = `${Config.trlink_qb}/api/captcha`;
  try {
    const repos = yield call(request, requestURL, Object.assign({}, geturloptions()));
    switch (repos.code.toString()) {
      case '0':
        yield put(changeVerifyCodeAction('all', fromJS({
          src: repos.data.replace('\n', '') || '',
          show: true,
        })));
        break;
      default:
        yield put(changeVerifyCodeAction('src', ''));
        break;
    }
  } catch (err) {
    console.log('error');
    yield put(changeVerifyCodeAction('src', ''));
  }
}

export function* getVerifyCodeSaga() {
  const watcher = yield takeLatest(GET_VERIFY_CODE_ACTION, getVerifyCode);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
  getVerifyCodeSaga,
];
