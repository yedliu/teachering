/*
 *
 * StandardWagesDataWrapper actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_SALARY_DETAIL_ACTION,
  GET_SALARYDATA_ACTION,
  HANDLE_SELECTED_ACTION,
  SET_CURRENTPAGENUMBER_ACTION,
  SET_LOADINGSTATE_ACTION,
  SET_SALARY_DETAIL_ACTION,
  SET_SALARYDATE_ACTION,
  SET_SEARCHMOBILE_ACTION,
  SET_SEARCHNAMEVALUE_ACTION,
  SET_SELECTDALARYITEM_ACTION,
  SET_SELECTDATE_ACTION,
  SET_SHOWDATAMODALOPEN_ACTION,
  SET_TOTALCOUNT_ACTION,
  SET_PERSONAL_MSG_ACTION,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
// 设置时间
// 设置选项
export function handleSelected(ty, val) {
  return {
    type: HANDLE_SELECTED_ACTION,
    ty,
    val
  };
}
export function setSelectDateAction(date) {
  return {
    type: SET_SELECTDATE_ACTION,
    date,
  };
}
export function setSearchMobileValueAction(val) {
  return {
    type: SET_SEARCHMOBILE_ACTION,
    val,
  };
}
export function setSearchNameValueAction(val) {
  return {
    type: SET_SEARCHNAMEVALUE_ACTION,
    val,
  };
}
export function getSalaryDtaAction() {
  return {
    type: GET_SALARYDATA_ACTION,
  };
}
export function setSalaryDtaAction(item) {
  return {
    type: SET_SALARYDATE_ACTION,
    item,
  };
}
export function setTotalCountAction(num) {
  return {
    type: SET_TOTALCOUNT_ACTION,
    num,
  };
}
export function setCurrentPageNumberAction(num) {
  return {
    type: SET_CURRENTPAGENUMBER_ACTION,
    num,
  };
}
export function setLoadingStateAction(bol) {
  return {
    type: SET_LOADINGSTATE_ACTION,
    bol,
  };
}
export function showDataModalOpenAction(obj) {
  return {
    type: SET_SHOWDATAMODALOPEN_ACTION,
    obj,
  };
}
export function setSelectSalaryItemAction(item) {
  return {
    type: SET_SELECTDALARYITEM_ACTION,
    item,
  };
}
export function getSalaryDetailAction() {
  return {
    type: GET_SALARY_DETAIL_ACTION,
  };
}
export function setSalaryDetailAction(item) {
  return {
    type: SET_SALARY_DETAIL_ACTION,
    item,
  };
}
export function setPersonalMsgAction(item) {
  return {
    type: SET_PERSONAL_MSG_ACTION,
    item,
  };
}
