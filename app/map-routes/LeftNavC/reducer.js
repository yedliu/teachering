/*
 *
 * LeftNavC reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  SET_GRADELIST_ACTION,
  SET_SUBJECTLIST_ACTION,
  SET_LESSONTYPELIST_ACTION,
  CHANGE_ALERT_SHOW_OR_HIDE_ACTION,
  SET_ALERT_STATES_ACTION,
  CHANGE_DATA_GETTING_STATE_ACTION,
  CHANGE_BACK_PROMPT_ALERT_SHOW_ACTION,
  SET_BACK_ALERT_STATES_ACTION,
  CHANGE_BTN_CAN_CLICK_ACTION,
  CHANGE_ISLOADING_STATE_ACTION,
} from './constants';

const initialState = fromJS({
  grade: [],
  subject: [],
  lessontype: [],
  alertShowOrHide: false,
  alertStates: {},
  dataIsGetting: true,  // 正在获取数据中
  backPromptAlertShow: false,
  backAlertStates: {},
  submitCanUse: true,  // 按钮是否可以使用的状态
  btnCanClick: true,  // 限制提交类按钮的是否可点击
  isLoading: false, // 正在请求中
});

function leftNavCReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_GRADELIST_ACTION:
      return state.set('grade', action.item);
    case SET_SUBJECTLIST_ACTION:
      return state.set('subject', action.item);
    case SET_LESSONTYPELIST_ACTION:
      return state.set('lessontype', action.item);
    case CHANGE_ALERT_SHOW_OR_HIDE_ACTION:
      return state.set('alertShowOrHide', action.bol);
    case SET_ALERT_STATES_ACTION:
      return state.set('alertStates', action.item);
    case CHANGE_DATA_GETTING_STATE_ACTION:
      return state.set('dataIsGetting', action.bol);
    case CHANGE_BACK_PROMPT_ALERT_SHOW_ACTION:
      if (!action.bol) {
        return state.set('backPromptAlertShow', action.bol).set('backAlertStates', fromJS({}));
      }
      return state.set('backPromptAlertShow', action.bol);
    case SET_BACK_ALERT_STATES_ACTION:
      return state.set('backAlertStates', action.item);
    case CHANGE_BTN_CAN_CLICK_ACTION:
      return state.set('btnCanClick', action.bol);
    case CHANGE_ISLOADING_STATE_ACTION:
      return state.set('isLoading', action.bol);
    default:
      return state;
  }
}

export default leftNavCReducer;
