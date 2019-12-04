/*
 *
 * PersonMsgManager actions
 *
 */

import {
  DEFAULT_ACTION,
  CHANGE_EDIT_STATE_ACTION,
  SET_USER_MSG_ACTION,
  CHANGE_IS_SUBMIT_ING_ACTION,
  SUBMIT_CHANGE_MSG_ACTION,
  GET_USER_MSG_ACTION,
  SET_TAG_INDEX,
  PAY_MENT_INFO,
  SET_PAY_INPUT_DTO,
  SET_PAY_INFO,
  SET_BANK_LIST,
  GET_BANK_LIST,
  GET_PROVINCE_LIST,
  SET_AREA_LIST_ACTION,
  SET_PROVINCE_LIST,
  GET_AREA_LIST_ACTION,
  SET_PROVINCE_ACTION,
  SUBMIT_ACTION,
  SET_QRCODE_URL,
  GET_QRCODE_URL,
  GET_PAY_DATA_ACTION,
  HANDLE_SELECTED_ACTION,
  SET_PAGEINDEX_ACTION,
  SET_SALARY_DATA_ACTION,
  GET_PAPER_INFO_ACTION,
  SET_PAPER_DATA_ACTION,
  SET_SHOW_PAPER_MSG_ACTION,
  SET_PERSONAL_MSG_ACTION,
  GET_PERSONAL_MSG_ACTION,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function setShowPaperMsgAction(item) {
  return {
    type: SET_SHOW_PAPER_MSG_ACTION,
    item,
  };
}
// 设置试卷数据
export function setPaperData(val) {
  return {
    type: SET_PAPER_DATA_ACTION,
    val
  };
}
// 获取试卷
export function getPaperInfo(val) {
  return {
    type: GET_PAPER_INFO_ACTION,
    val
  };
}
// 设置数据
export function setSalaryData(item) {
  return {
    type: SET_SALARY_DATA_ACTION,
    item
  };
}
//设置页数
export function setPageIndex(val) {
  return {
    type: SET_PAGEINDEX_ACTION,
    val
  };
}
// 设置选项
export function handleSelected(ty, val) {
  return {
    type: HANDLE_SELECTED_ACTION,
    ty,
    val
  };
}
// 查找数据
export function getPersonPay() {
  return {
    type: GET_PAY_DATA_ACTION
  };
}

export function changeEditStateAction(bol) {
  return {
    type: CHANGE_EDIT_STATE_ACTION,
    bol,
  };
}
export function setUserMsgAction(item) {
  return {
    type: SET_USER_MSG_ACTION,
    item,
  };
}
export function changeIsSubmitIngAction(num) {
  return {
    type: CHANGE_IS_SUBMIT_ING_ACTION,
    num,
  };
}
export function getUserMsgAction() {
  return {
    type: GET_USER_MSG_ACTION,
  };
}
export function submitChangeMsgAction() {
  return {
    type: SUBMIT_CHANGE_MSG_ACTION,
  };
}
export function setTagIndexAction(num){
  return {
      type:SET_TAG_INDEX,
      num
  }
}
export function getPaymentInfo(){
  return {
    type:PAY_MENT_INFO
  }
}
export function setPayInputDto(data){
  return {
    type:SET_PAY_INPUT_DTO,
    data
  }
}
export function setPayInfo(data){
  return {
    type:SET_PAY_INFO,
    data
  }
}
export function getBankList(){
  return {
    type:GET_BANK_LIST
  }
}
export function setBankList(list){
  return {
    type:SET_BANK_LIST,
    list
  }
}
export function setProvinceIdAction(list){
    return {
      type:SET_PROVINCE_LIST,
      list
    }
}
export function setAreaListAction(list){
  return{
    type:SET_AREA_LIST_ACTION,
    list
  }
}
export function getProvinceIdAction(){
    return {
      type:GET_PROVINCE_LIST
    }
}
export function getAreaListAction(){
  return{
    type:GET_AREA_LIST_ACTION
  }
}
export function setProvinceAction(str){
  return {
    type:SET_PROVINCE_ACTION,
    str
  }
}
export function submitAction(){
  return {
    type:SUBMIT_ACTION
  }
}
export function getQrcodeUrl(){
  return {
    type:GET_QRCODE_URL
  }
}
export function setQrcodeUrl(str){
  return {
    type:SET_QRCODE_URL,
    str
  }
}
export function setPersonalMsgAction(item) {
  return {
    type: SET_PERSONAL_MSG_ACTION,
    item,
  };
}
export function getPersonalMsgAction() {
  console.log('action start');
  return {
    type: GET_PERSONAL_MSG_ACTION,
  };
}
