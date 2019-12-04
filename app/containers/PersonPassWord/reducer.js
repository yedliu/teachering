/*
 *
 * PersonPassWord reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  INPUT_ONE,
  INPUT_TWO,
  INPUT_THREE,
  SET_CAN_SUBMIT,
  GET_CAN_SUBMIT,
  SUBMIT_CHANGE_PASSWORD,
  CLICK_TO_CHANGE_PASSWORD,
  CHANGE_PASSWORD_IS_SAME_ACTION,
} from './constants';

const initialState = fromJS({
  oldpasswordisright: true,
  newpasswordispass: true,
  newpasswordagainispass: true,
  cansubmit: false,
  useraccess: '',
  oldpassword: '',
  newpassword: '',
  newpasswordagain: '',
  changeresponse: {},
  clicktochcangepassword: false,
  passwordIsSame: false,
});

function personPassWordReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case INPUT_ONE:
      return state.set('oldpassword', action.val);
    case INPUT_TWO:
      return state.set('newpassword', action.val);
    case INPUT_THREE:
      return state.set('newpasswordagain', action.val);
    case SET_CAN_SUBMIT:
      return state.set('cansubmit', action.bol);
    case GET_CAN_SUBMIT:
      return state;
    case SUBMIT_CHANGE_PASSWORD:
      return state.set('changeresponse', action.item);
    case CLICK_TO_CHANGE_PASSWORD:
      return state.set('clicktochcangepassword', action.tosubmit);
    case CHANGE_PASSWORD_IS_SAME_ACTION:
      return state.set('passwordIsSame', action.bol);
    default:
      return state;
  }
}

export default personPassWordReducer;
