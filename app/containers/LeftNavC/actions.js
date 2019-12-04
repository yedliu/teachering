/*
 *
 * LeftNavC actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_SUBJECT_ACTION,
  GET_GRADE_ACTION,
  GET_LESSONTYPE_ACTION,
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

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function setGradeListAction(item) {
  return {
    type: SET_GRADELIST_ACTION,
    item,
  };
}
export function getGradeAction() {
  return {
    type: GET_GRADE_ACTION,
  };
}
export function getSubjectAction() {
  return {
    type: GET_SUBJECT_ACTION,
  };
}
export function setSubjectListAction(item) {
  return {
    type: SET_SUBJECTLIST_ACTION,
    item,
  };
}
export function getLessonTypeAction() {
  return {
    type: GET_LESSONTYPE_ACTION,
  };
}
export function setLessonTypeListAction(item) {
  return {
    type: SET_LESSONTYPELIST_ACTION,
    item,
  };
}
export function changeAlertShowOrHideAction(bol) {
  return {
    type: CHANGE_ALERT_SHOW_OR_HIDE_ACTION,
    bol,
  };
}
export function setAlertStatesAction(item) {
  return {
    type: SET_ALERT_STATES_ACTION,
    item,
  };
}
export function changeDataIsLoadingAction(bol) {
  return {
    type: CHANGE_DATA_GETTING_STATE_ACTION,
    bol,
  };
}
export function changeBackPromptAlertShowAction(bol) {
  return {
    type: CHANGE_BACK_PROMPT_ALERT_SHOW_ACTION,
    bol,
  };
}
export function setBackAlertStatesAction(item) {
  return {
    type: SET_BACK_ALERT_STATES_ACTION,
    item,
  };
}
export function changeBtnCanClickAction(bol) {
  return {
    type: CHANGE_BTN_CAN_CLICK_ACTION,
    bol,
  };
}
export function changeIsLoadingStateAction(bol) {
  return {
    type: CHANGE_ISLOADING_STATE_ACTION,
    bol,
  };
}
