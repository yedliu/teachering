/*
 *
 * HomeWorkDataView actions
 *
 */

import {
  DEFAULT_ACTION,
  SET_REPORTLIST_ACTION,
  GET_REPORTLIST_ACTION,
  GET_SUBJECT_LIST_ACTION,
  SET_SUBJECT_LIST_ACTION,
  SET_SELECT_DATA_RANGE_ACTION,
  SET_SEARCHFIELDVALUE_ACTION,
  SET_LOADINGSTATE_ACTION,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getReportListAction() {
  return {
    type: GET_REPORTLIST_ACTION,
  };
}

export function setReportListAction(list) {
  return {
    type: SET_REPORTLIST_ACTION,
    list,
  };
}


export function getSubjectListAction() {
  return {
    type: GET_SUBJECT_LIST_ACTION,
  };
}

export function setSubjectListAction(list) {
  return {
    type: SET_SUBJECT_LIST_ACTION,
    list,
  };
}

export function setSelectedDateRangeAction(range) {
  return {
    type: SET_SELECT_DATA_RANGE_ACTION,
    range,
  };
}


export function setSearchFieldValueAction(field, value) {
  return {
    type: SET_SEARCHFIELDVALUE_ACTION,
    field,
    value: value || '',
  };
}

export function setLoadStateAction(bol) {
  return {
    type: SET_LOADINGSTATE_ACTION,
    bol,
  };
}
