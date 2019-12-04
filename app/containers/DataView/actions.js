/*
 *
 * DataView actions
 *
 */
import {
  DEFAULT_ACTION,
  GET_TYPE_LIST_ACTION,
  SET_TYPE_LIST_ACTION,
  GET_TYPE_ACTION,
  SET_TYPE_ACTION,
  GET_LIST_ACTION,
  SET_LIST_ACTION,
  SET_PARAMS_ACTION,
  SET_SHOW_OR_HIDE_ACTION,
  SET_SELECT_LESSON_TYPE,
  SET_LESSON_LIST_ACTION,
  GET_ONE_TO_ONE_CLASS_ACTION,
  GET_SMALL_CLASS_ACTION,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getTypeListAction() {
  return {
    type: GET_TYPE_LIST_ACTION,
  };
}

export function setTypeListAction(typeList) {
  return {
    type: SET_TYPE_LIST_ACTION,
    typeList,
  };
}
export function setLessonListAction(item) {
  return {
    type: SET_LESSON_LIST_ACTION,
    item,
  };
}

export function getTypeAction() {
  return {
    type: GET_TYPE_ACTION,
  };
}

export function setTypeAction(typeObj) {
  return {
    type: SET_TYPE_ACTION,
    typeObj,
  };
}

export function getListAction() {
  return {
    type: GET_LIST_ACTION,
  };
}

export function setListAction(list) {
  return {
    type: SET_LIST_ACTION,
    list,
  };
}

export function setParamsAction(params) {
  return {
    type: SET_PARAMS_ACTION,
    params,
  };
}
export function setShowOrHideAction(bool) {
  return {
    type: SET_SHOW_OR_HIDE_ACTION,
    bool,
  };
}
export function setSelectLessonType(item) {
  return {
    type: SET_SELECT_LESSON_TYPE,
    item,
  };
}
export function getOneToOneClassAction() {
  return {
    type: GET_ONE_TO_ONE_CLASS_ACTION,
  };
}
export function getSmallClassAction() {
  return {
    type: GET_SMALL_CLASS_ACTION,
  };
}
