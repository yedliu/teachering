import { take, call, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
// import changePassWordReducer from './reducer';
import { Config } from 'utils/config';
import { AppLocalStorage } from 'utils/localStorage';
import request, { putjsonoptions } from 'utils/request';
import { message } from 'antd';
// import { logoutAction } from 'containers/App/actions';
import { browserHistory } from 'react-router';
// import { getChangePassWordRepos } from './actions';
import { CLICK_TO_CHANGE_PASSWORD } from './constants';
import { makeInputOne, makeInputTwo } from './selectors';

// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}

export function* toChangePassWord() {
  const usermobile = AppLocalStorage.getMobile();
  // const oldpassword = AppLocalStorage.getPassWord();
  // const [mobile, oldpassword, newpassword, newpasswordagain] = [AppLocalStorage.getMobile(), AppLocalStorage.getPassWord(), ..];
  const oldpassword = yield select(makeInputOne());
  const newpassword = yield select(makeInputTwo());
  // const newpasswordagain = yield select(makeInputThree());
  const requestURL = `${Config.trlink}/api/user/updatePassword`;
  // const requestURL = `${Config.appapichangePW}/api/oauth/changePasswd`; // 本地时地址
  // const exitLogin = () => {
  //   // console.log('will exit');
  //   localStorage.removeItem('user.password');
  //   localStorage.removeItem('user.mobile');
  //   AppLocalStorage.removeIsLogin();
  //   AppLocalStorage.removeUserInfo();
  //   AppLocalStorage.removeTocken();
  //   location.href = Config.apiurl;
  //   // location.href = Config.appapichangePW; // 本地时地址
  // };
  const params = { mobile: usermobile, oldPwd: oldpassword, newPwd: newpassword };
  console.log(params, 'params');
  try {
    console.log('发送');
    // Call our request helper (see 'utils/request')
    const repos = yield call(request, requestURL, Object.assign({}, putjsonoptions()), params);
    switch (repos.code.toString()) {
      case '0':
        // yield put(getChangePassWordRepos(fromJS(repos)));
        message.success(repos.message || '修改成功');
        console.log('put');
        // exitLogin();
        AppLocalStorage.setIsLogin(false);
        setTimeout(() => {
          browserHistory.push('/');
        }, 30);
        console.log('exit');
        break;
      default:
        message.warn(repos.message || '修改失败。');
        break;
    }
    console.log('获取了返回数据');
  } catch (err) {
    message.error('执行错误导致提交失败。');
    console.log(err);
  }
}

export function* makeChangePassWordSagas() {
  const watcher = yield takeLatest(CLICK_TO_CHANGE_PASSWORD, toChangePassWord);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}


// All sagas to be loaded
export default [
  defaultSaga,
  makeChangePassWordSagas,
];
