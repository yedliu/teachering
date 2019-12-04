/*
 *
 * ErrorCorrectManagement actions
 *
 */

import {
  DEFAULT_ACTION,
  INIT_ACTION,
  GET_PHASE_LIST,
  GET_SUBJECT_LIST,
  SET_SUBJECT_LIST,
  SET_PHASE_LIST,
  SET_SELECT_FILTER,
  INIT_SELECT_FILTER,
  GO_SEARCH,
  SET_QUESTION_STATISTICS,
  CHANGE_PAGE_STATE,
  DELETE_QUESTION_ACTION,
  SET_QUESTION_LIST,
  SET_VALUE_OF_QUESTION_LIST,
  ADOPT_MESSAGE,
  FINISH_ACTION,
  SET_PERMISSIONSUBJECTS_LIST,
  SET_SOURCE_LIST,
  GET_SOURCE_LIST,
  GET_ROLE_LIST,
  SET_ROLE_LIST,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function initAction() {
  return {
    type: INIT_ACTION,
  };
}

export function setPermissionSubjects(list) {
  return {
    type: SET_PERMISSIONSUBJECTS_LIST,
    list,
  };
}


export function finish(question) {
  return {
    type: FINISH_ACTION,
    question,
  };
}

// 采纳
export function adoptMessage(adoptStats, handleId, id, location) {
  return {
    type: ADOPT_MESSAGE,
    adoptStats,
    handleId,
    id,
    location
  };
}

// 改变question数组里某些值让页面局部刷新
export function setValueOfQuestionList(id, errorId, key, value) {
  return {
    type: SET_VALUE_OF_QUESTION_LIST,
    id, errorId, key, value
  };
}

export function setQuestionList(list) {
  return {
    type: SET_QUESTION_LIST,
    list,
  };
}

export function deleteQuestionAction(id) {
  return {
    type: DELETE_QUESTION_ACTION,
    id,
  };
}

export function changePageState(key, value) {
  return {
    type: CHANGE_PAGE_STATE,
    key,
    value
  };
}

export function setQuestionStatistics(item) {
  return {
    type: SET_QUESTION_STATISTICS,
    item
  };
}

export function goSearch() {
  return {
    type: GO_SEARCH,
  };
}

export function initSelectFilter() {
  return {
    type: INIT_SELECT_FILTER,
  };
}

export function setSelectFilter(key, value) {
  return {
    type: SET_SELECT_FILTER,
    key,
    value
  };
}

export function setPhaseList(list) {
  return {
    type: SET_PHASE_LIST,
    list
  };
}

export function setSubjectList(list) {
  return {
    type: SET_SUBJECT_LIST,
    list
  };
}

export function getSubjectList() {
  return {
    type: GET_SUBJECT_LIST,
  };
}

export function getPhaseList() {
  console.log('获取学段action？？');
  return {
    type: GET_PHASE_LIST,
  };
}

export function setSourceList(list) {
  return {
    type: SET_SOURCE_LIST,
    list
  };
}

export function getSourceList() {
  return {
    type: GET_SOURCE_LIST,
  };
}

export function getRoleList() {
  return {
    type: GET_ROLE_LIST,
  };
}
export function setRoleList(list) {
  return {
    type: SET_ROLE_LIST,
    list,
  };
}

