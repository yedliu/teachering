/*
 *
 * RolesManage actions
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
  SUBMIT_ACTION,
  SET_QUERY_PARAMS,
  SET_EDIT_ID,
  SET_ADDING_MODE,
  SUBMIT_EDIT_ACTION,
  DELETE_ROLE_ACTION
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION
  };
}
export function setModalAction(boolean) {
  return {
    type: SET_MODAL_ACTION,
    boolean
  };
}
export function setInputDTO(data) {
  return {
    type: SET_INPUTDTO,
    data
  };
}
export function setTableData(data) {
  return {
    type: SET_TABLE_DATA,
    data
  };
}
export function setPainationAction(data) {
  return {
    type: SET_PAGEINATION_ACTION,
    data
  };
}
export function getDataAction(name) {
  return {
    type: GET_DATA,
    name
  };
}
export function getAuthorityList() {
  return {
    type: GET_AUTHORITY_LIST
  };
}
export function setAuthorityList(data) {
  return {
    type: SET_AUTHORITY_LIST,
    data
  };
}
export function submitAction() {
  return {
    type: SUBMIT_ACTION
  };
}
export function submitEditAction() {
  return {
    type: SUBMIT_EDIT_ACTION
  };
}
export function setQueryParams(data) {
  return {
    type: SET_QUERY_PARAMS,
    data
  };
}
export function setEditId(id) {
  return {
    type: SET_EDIT_ID,
    id
  };
}
export function setAddingMode(bool) {
  return {
    type: SET_ADDING_MODE,
    bool
  };
}
export function deleteRole() {
  return {
    type: DELETE_ROLE_ACTION
  };
}
