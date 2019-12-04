/*
 *
 * Header reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION, SET_HEADER,
  CHANGE_VERIFY_CODE_ACTION,
} from './constants';

const defaultVerificationCode = {
  src: '',
  show: false,
  code: '',
  source: '',
  title: '系统提示',
  children: '',
  canSubmit: false,
};

const initialState = fromJS({
  headerInfo: {},
  verificationCode: defaultVerificationCode,
});

function headerReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_HEADER:
      return state.set('headerInfo', action.info);
    case CHANGE_VERIFY_CODE_ACTION:
      if (action.iType === 'default') {
        return state.set('verificationCode', fromJS(defaultVerificationCode));
      } else if (action.iType === 'all') {
        return state.set('verificationCode', state.get('verificationCode').merge(action.item));
      }
      return state.set('verificationCode', state.get('verificationCode').set(action.iType, action.item));
    default:
      return state;
  }
}

export default headerReducer;
