/*
 *
 * Login reducer
 *
 */

import { fromJS } from 'immutable';
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

const initialState = fromJS({
  mobile: '',
  password: '',
  isLoading: false,
  showPassword: false,
  loginSuccess: false,
  openOrCloseAlert: false,
  loginMissText: '',
});

function loginReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case CHANGE_MOBILE_ACTION:
      return state.set('mobile', action.num);
    case CHANGE_PASSWORD_ACTION:
      return state.set('password', action.password);
    case CHANGE_IS_LOADING_ACTION:
      return state.set('isLoading', action.isLoading);
    case CHANGE_SHOW_PASSWORD_ACTION:
      return state.set('showPassword', action.showPassword);
    case CHANGE_LOGIN_SUCCESS_ACTION:
      return state.set('loginSuccess', action.loginSuccess);
    //
    case CHANGE_OPEN_OR_CLOSE_ALERT_ACTION:
      return state.set('openOrCloseAlert', action.open);
    case SET_LOGIN_MISS_TEXT_ACTION:
      return state.set('loginMissText', action.str);
    default:
      return state;
  }
}

export default loginReducer;
