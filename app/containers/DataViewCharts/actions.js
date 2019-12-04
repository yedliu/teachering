/*
 *
 * DataViewCharts actions
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
  SET_SEARCH_TYPE_ACTION,
  SET_SEARCH_TYPE_LIST_ACTION,
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

export function setSearchTypeListAction(typeList) {
  return {
    type: SET_SEARCH_TYPE_LIST_ACTION,
    typeList,
  };
}

export function setSearchTypeAction(typeObj) {
  return {
    type: SET_SEARCH_TYPE_ACTION,
    typeObj,
  };
}
