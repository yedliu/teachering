/*
 *
 * Login actions
 *
 */

import {
  DEFAULT_ACTION,
  CHANGE_MOBILE_ACTION,
  CHANGE_PASSWORD_ACTION,
  CHANGE_IS_LOADING_ACTION,
  CHANGE_SHOW_PASSWORD_ACTION,
  CHANGE_LOGIN_SUCCESS_ACTION,
  //
  CHANGE_OPEN_OR_CLOSE_ALERT_ACTION,
  SET_LOGIN_MISS_TEXT_ACTION,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function changeMobileAction(num) {
  return {
    type: CHANGE_MOBILE_ACTION,
    num,
  };
}
export function changePassWordAction(password) {
  return {
    type: CHANGE_PASSWORD_ACTION,
    password,
  };
}
export function changeIsLoadingAction(isLoading) {
  return {
    type: CHANGE_IS_LOADING_ACTION,
    isLoading,
  };
}
export function changeShowPasswordAction(showPassword) {
  return {
    type: CHANGE_SHOW_PASSWORD_ACTION,
    showPassword,
  };
}
export function changeLoginSuccessAction(loginSuccess) {
  return {
    type: CHANGE_LOGIN_SUCCESS_ACTION,
    loginSuccess,
  };
}


export function changeOpenOrCloseAlertAction(open) {
  return {
    type: CHANGE_OPEN_OR_CLOSE_ALERT_ACTION,
    open,
  };
}
export function setLoginMissTextAction(str) {
  return {
    type: SET_LOGIN_MISS_TEXT_ACTION,
    str,
  };
}
