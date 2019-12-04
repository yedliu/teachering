/*
 *
 * OfficialPersonnel actions
 *
 */

import {
  DEFAULT_ACTION,
  SET_MODAL_ACTION,
  SET_INPUTDTO,
  SET_PAGEINATION_ACTION,
  SET_TABLE_DATA,
  GET_DATA,
  GET_AUTHORITY_LIST,
  SET_AUTHORITY_LIST,
  GET_ROLE_LIST,
  SET_ROLE_LIST,
  SET_QUERY_PARAMS,
  SET_EDIT_ID,
  SET_ADDING_MODE,
  SUBMIT_EDIT_ACTION,
  GET_ONE_USER,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION
  };
}
export function setModalAction(boolean) {
  return {
    type: SET_MODAL_ACTION,
    boolean,
  };
}
export function setInputDTO(data) {
  return {
    type: SET_INPUTDTO,
    data,
  };
}
export function setTableData(data) {
  return {
    type: SET_TABLE_DATA,
    data,
  };
}
export function setPainationAction(data) {
  return {
    type: SET_PAGEINATION_ACTION,
    data,
  };
}
export function getDataAction() {
  return {
    type: GET_DATA,
  };
}
export function getAuthorityList() {
  return {
    type: GET_AUTHORITY_LIST,
  };
}
export function setAuthorityList(data) {
  return {
    type: SET_AUTHORITY_LIST,
    data,
  };
}
export function getRoleList() {
  return {
    type: GET_ROLE_LIST,
  };
}
export function setRoleList(data) {
  return {
    type: SET_ROLE_LIST,
    data,
  };
}
export function setQueryParams(data) {
  return {
    type: SET_QUERY_PARAMS,
    data,
  };
}
export function setEditId(id) {
  return {
    type: SET_EDIT_ID,
    id,
  };
}
export function setAddingMode(bool) {
  return {
    type: SET_ADDING_MODE,
    bool,
  };
}
export function submitEditAction() {
  return {
    type: SUBMIT_EDIT_ACTION,
  };
}

export function getOneUser() {
  return {
    type: GET_ONE_USER
  };
}
