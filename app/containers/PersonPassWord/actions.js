/*
 *
 * PersonPassWord actions
 *
 */

import {
  DEFAULT_ACTION,
  INPUT_ONE,
  INPUT_TWO,
  INPUT_THREE,
  SET_CAN_SUBMIT,
  GET_CAN_SUBMIT,
  CLICK_TO_CHANGE_PASSWORD,
  SUBMIT_CHANGE_PASSWORD,
  CHANGE_PASSWORD_IS_SAME_ACTION,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function inputOne(val) {
  return {
    type: INPUT_ONE,
    val,
  };
}

export function inputTwo(val) {
  return {
    type: INPUT_TWO,
    val,
  };
}

export function inputThree(val) {
  return {
    type: INPUT_THREE,
    val,
  };
}

export function setCanSubmit(bol) {
  return {
    type: SET_CAN_SUBMIT,
    bol,
  };
}

export function getCanSubmit() {
  return {
    type: GET_CAN_SUBMIT,
  };
}

export function submitChangePassWord(tosubmit) {
  return {
    type: CLICK_TO_CHANGE_PASSWORD,
    tosubmit,
  };
}

export function getChangePassWordRepos(item) {
  return {
    type: SUBMIT_CHANGE_PASSWORD,
    item,
  };
}

export function changepasswordissame(bol) {
  return {
    type: CHANGE_PASSWORD_IS_SAME_ACTION,
    bol,
  };
}