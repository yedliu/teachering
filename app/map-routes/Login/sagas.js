/* eslint-disable no-case-declarations */
import { take, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { message } from 'antd';
import { browserHistory } from 'react-router';
import AppLocalStorage from 'utils/localStorage';
import loginApi from 'api/RSA/login';

import { DEFAULT_ACTION } from './constants';
import { makeMobile, makePassword } from './selectors';
import { changeLoginSuccessAction, setLoginMissTextAction } from './actions';
import { encryptPublicKey } from './common';
// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}

export function* userLoginIn() {
  const mobile = yield select(makeMobile());
  let password = yield select(makePassword());
  const params = { mobile };
  const loginFunc = msg => {
    AppLocalStorage.setUserInfo(msg);
  };
  loginFunc({ mobile, password });
  try {
    const repos = yield loginApi.applyPublicKey(params);
    switch (repos.code.toString()) {
      case '0':
        const encryptParams = encryptPublicKey(
          repos.data.publicKey,
          mobile,
          password,
        );
        const reopsLogin = yield loginApi.login(encryptParams);
        switch (reopsLogin.code.toString()) {
          case '0':
            const accessToken = reopsLogin.data.token;
            AppLocalStorage.setOauthToken(accessToken);
            const getInfoRepos = yield loginApi.getInfo(accessToken);
            switch (getInfoRepos.code.toString()) {
              case '0':
                if (!getInfoRepos.data) {
                  message.error('获取用户信息失败，请重新登录');
                  return;
                }
                AppLocalStorage.setPermissions(
                  getInfoRepos.data.permissionList || [],
                );
                getInfoRepos.data.password = password;
                yield loginFunc(getInfoRepos.data);
                yield put(changeLoginSuccessAction(true));
                sessionStorage.setItem('menuKeys', JSON.stringify(['/parttime/home']));
                AppLocalStorage.setIsLogin(true);
                browserHistory.replace('/parttime/home');
                // setTimeout(() => {
                //   /**
                //    * 以前权限在登陆时，同一台电脑切换账号后权限不能及时刷新
                //    * 使用 location.reload() 使更新的权限能够立马生效
                //    */
                //   browserHistory.replace('/home');
                //   // location.reload();
                // }, 30);
                break;
              default:
                yield put(
                  setLoginMissTextAction(
                    getInfoRepos.message || '账号或密码错误',
                  ),
                );
            }
            break;
          default:
            yield put(
              setLoginMissTextAction(reopsLogin.message || '账号或密码错误'),
            );
        }
        break;
      default:
        break;
    }
  } catch (err) {
    alert('err msg:' + err);
  }
}

export function* makeUserLoginIn() {
  const watcher = yield takeLatest(DEFAULT_ACTION, userLoginIn);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded
export default [defaultSaga, makeUserLoginIn];
