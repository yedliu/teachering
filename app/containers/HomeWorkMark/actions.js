/*
 *
 * HomeWorkMark actions
 *
 */
import {
  DEFAULT_ACTION,
  UPDATE_MARK_QUESTION_ITEM_ACTION,
  SET_HOME_WORK_MARK_DATA_ACTION,
  SET_TEA_TOTAL_COMMENT,
  SEND_MARK_MORE_WORK_DATA_ACTION,
  GET_HOMEWORK_MARK_LIST_ACTION,
  SET_SELECT_STUDENT,
  SET_ALERT_MSG,
  } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function updateMarkQuestionItemAction(index, item) {
  return {
    type: UPDATE_MARK_QUESTION_ITEM_ACTION,
    index,
    item,
  };
}

export function setHomeWorkMarkDataAction(item) {
  return {
    type: SET_HOME_WORK_MARK_DATA_ACTION,
    item,
  };
}

export function setTeaTotalCommentAction(item) {
  return {
    type: SET_TEA_TOTAL_COMMENT,
    item,
  };
}

export function sendMarkHomeWorkDataAction() {
  return {
    type: SEND_MARK_MORE_WORK_DATA_ACTION,
  };
}

export function getHomeWorkMarkListAction() {
  return {
    type: GET_HOMEWORK_MARK_LIST_ACTION,
  };
}

export function setSelectStudent(val) {
  return {
    type: SET_SELECT_STUDENT,
    val,
  }
}

export function setAlertMsg(val) {
  return {
    type: SET_ALERT_MSG,
    val,
  }
}






