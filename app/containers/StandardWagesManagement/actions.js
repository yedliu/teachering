/*
 *
 * StandardWagesManagement actions
 *
 */

import {
  DEFAULT_ACTION,
  SET_SELECTLEVELVALUE_ACTION,
  SET_OPERATEMODALOPEN_ACTION,
  SET_SELECTOPERATEITEM_ACTION,
  SET_OPERATEWAGESITEMFIELD_ACTION,
  GET_SUBJECTS_ACTION,
  SET_SUBJECTS_ACTION,
  SET_SELECTSUBJECT_ACTION,
  GET_SALARYCONFIGLIST_ACTION,
  SET_SALARYCONFIGLIST_ACTION,
  OPERATE_SALARYCONFIGITEM_ACTION
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION
  };
}
export function setSelectLevelValueAction(val) {
  return {
    type: SET_SELECTLEVELVALUE_ACTION,
    val
  };
}
export function setOperateModalOpenAction(bol) {
  return {
    type: SET_OPERATEMODALOPEN_ACTION,
    bol
  };
}
export function setSelectOperateItemAction(item) {
  return {
    type: SET_SELECTOPERATEITEM_ACTION,
    item
  };
}
export function setOperateWagesItemFieldAction(field, val) {
  return {
    type: SET_OPERATEWAGESITEMFIELD_ACTION,
    field,
    val
  };
}
export function getSubjectsAction() {
  return {
    type: GET_SUBJECTS_ACTION
  };
}
export function setSubjectsAction(list) {
  return {
    type: SET_SUBJECTS_ACTION,
    list
  };
}
export function setSelectSubjectAction(val) {
  return {
    type: SET_SELECTSUBJECT_ACTION,
    val
  };
}
export function getSalaryConfigListAction() {
  return {
    type: GET_SALARYCONFIGLIST_ACTION
  };
}
export function setSalaryConfigListAction(list) {
  return {
    type: SET_SALARYCONFIGLIST_ACTION,
    list
  };
}
export function operateSalaryConfigItemAction() {
  return {
    type: OPERATE_SALARYCONFIGITEM_ACTION
  };
}
