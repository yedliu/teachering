/*
 *
 * Header actions
 *
 */

import {
  DEFAULT_ACTION,
  SET_HEADER,
  CHANGE_VERIFY_CODE_ACTION,
  GET_VERIFY_CODE_ACTION,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function setHeader(info) {
  return {
    type: SET_HEADER,
    info
  };
}
export function changeVerifyCodeAction(iType, item) {
  return {
    type: CHANGE_VERIFY_CODE_ACTION,
    iType,
    item,
  };
}
export function getVerifyCodeAction() {
  return {
    type: GET_VERIFY_CODE_ACTION,
  };
}
