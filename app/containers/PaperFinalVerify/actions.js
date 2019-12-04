/*
 *
 * PaperFinalVerify actions
 *
 */

import {
  DEFAULT_ACTION,
  SET_PAPER_PARAMS_ACTION,
  SET_PAPER_NUMBER_ACTION,
  GET_PAPER_LIST_ACTION,
  SET_PAPER_LIST_ACTION,
  CHANGE_PAPER_INDEX_ACTION,
  CHANGE_NEED_VERIFY_PAPER_ID_ACTION,
  SET_PAPER_MSG_DATA_ACTION,
  SET_COMMFN_INFO_ACTION,
  SET_PAPER_DOWNLOAD_MSG_ACTION,
  SET_QUESTION_PARAMS_ACTION,
  SET_QUESTIONS_ACTION,
  SET_QUESTION_MSG_LIST_ACTION,
  REMOVE_BIG_QUESTION_ACTION,
  REMOVE_SMALL_QUESTION_ACTION,
  SET_REMOVE_INDEX_ACTION,
  GET_ALL_QUESTION_TYPE_LIST_ACTION,
  SET_ALL_QUESTION_TYPE_LIST_ACTION,
  SET_NEW_QUESTION_MSG_ACTION,
  GET_POINT_LIST_ACTION,
  SET_POINT_LIST_ACTION,
  CHANGE_QUESTION_EDIT_STATE,
  SUBMIT_QUESTION_ITEM_ACTION,
  SET_CLICK_TARGET_ACTION,
  INIT_QUESTION_LIST_DATA,
  SAVE_WAREHOUSE_ACTION,
  SET_INPUT_DTO_ACTION,
  GET_PAPER_MSG_LIST_ACTION,
  SET_PAPER_MSG_LIST_ACTION,
  GET_EDITION_ACTION,
  GET_COUNTY_ACTION,
  GET_CITY_ACTION,
  CHANGE_PAPER_MSG_ACTION,
  SET_IS_ADD_OR_EDIT_ACTION,
  CHANGE_BIG_NAME_ACTION,
  SET_POINT_ID_LIST_ACTION,
  FILTER_POINT_ACTION,
  SUMBIT_ADOPT_FEED_BACK_ACTION,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function setPaperParams(item) {
  return {
    type: SET_PAPER_PARAMS_ACTION,
    item,
  };
}
export function getPaperListAction() {
  return {
    type: GET_PAPER_LIST_ACTION,
  };
}
export function setPaperNumberAction(item) {
  return {
    type: SET_PAPER_NUMBER_ACTION,
    item,
  };
}
export function setPaperDataList(item) {
  return {
    type: SET_PAPER_LIST_ACTION,
    item,
  };
}
export function setPaperMsgDataAction(item) {
  return {
    type: SET_PAPER_MSG_DATA_ACTION,
    item,
  };
}
export function setQuestionsListAction(item) {
  return {
    type: SET_QUESTIONS_ACTION,
    item,
  };
}
export function changePaperIndexAction(num) {
  return {
    type: CHANGE_PAPER_INDEX_ACTION,
    num,
  };
}
export function changeNeedVerifyPaperIdAction(num) {
  return {
    type: CHANGE_NEED_VERIFY_PAPER_ID_ACTION,
    num,
  };
}
export function setCommonInfoAction(item) {
  return {
    type: SET_COMMFN_INFO_ACTION,
    item,
  };
}
export function setPaperDownloadMsgAction(item) {
  return {
    type: SET_PAPER_DOWNLOAD_MSG_ACTION,
    item,
  };
}
export function setQuestionParamsAction(item) {
  return {
    type: SET_QUESTION_PARAMS_ACTION,
    item,
  };
}
export function setBigQuestionAction(item) {
  return {
    type: SET_QUESTION_MSG_LIST_ACTION,
    item,
  };
}
export function removeBigQuestionAction() {
  return {
    type: REMOVE_BIG_QUESTION_ACTION,
  };
}
export function removeSmallQuestionAction() {
  return {
    type: REMOVE_SMALL_QUESTION_ACTION,
  };
}
export function setRemoveIndexAction(item) {
  return {
    type: SET_REMOVE_INDEX_ACTION,
    item,
  };
}
export function getAllQuestionTypeListAction() {
  return {
    type: GET_ALL_QUESTION_TYPE_LIST_ACTION,
  };
}
export function setAllQuestionTypeListAction(item) {
  return {
    type: SET_ALL_QUESTION_TYPE_LIST_ACTION,
    item,
  };
}
export function setNewQuestionMsgAction(item) {
  return {
    type: SET_NEW_QUESTION_MSG_ACTION,
    item,
  };
}
export function getPointListAction(item) {
  return {
    type: GET_POINT_LIST_ACTION,
    item,
  };
}
export function setPointListAction(item) {
  return {
    type: SET_POINT_LIST_ACTION,
    item,
  };
}
export function changeQuestionEditStateAction(num) {
  return {
    type: CHANGE_QUESTION_EDIT_STATE,
    num,
  };
}
export function submitQuestionItemAction() {
  return {
    type: SUBMIT_QUESTION_ITEM_ACTION,
  };
}
export function setClickTargetAction(str) {
  return {
    type: SET_CLICK_TARGET_ACTION,
    str,
  };
}
export function initQuestionListData() {
  return {
    type: INIT_QUESTION_LIST_DATA,
  };
}
export function saveWarehouseAction() {
  return {
    type: SAVE_WAREHOUSE_ACTION,
  };
}
export function setInputDtoAction(item) {
  return {
    type: SET_INPUT_DTO_ACTION,
    item,
  };
}
export function getPaperMsgListAction() {
  return {
    type: GET_PAPER_MSG_LIST_ACTION,
  };
}
export function setPaperMsgListAction(item) {
  // console.log(item.toJS(), 'setPaperMsgListAction');
  return {
    type: SET_PAPER_MSG_LIST_ACTION,
    item,
  };
}
export function getEditionListAction() {
  return {
    type: GET_EDITION_ACTION,
  };
}
export function getCityListAction() {
  return {
    type: GET_CITY_ACTION,
  };
}
export function getCountyListAction() {
  return {
    type: GET_COUNTY_ACTION,
  };
}
export function changePaperMsgAction() {
  return {
    type: CHANGE_PAPER_MSG_ACTION,
  };
}
export function setIsAddOrEditAction(item) {
  return {
    type: SET_IS_ADD_OR_EDIT_ACTION,
    item,
  };
}
export function changeBigNameAction() {
  return {
    type: CHANGE_BIG_NAME_ACTION,
  };
}
export function setPointIdListAction(idType, item) {
  return {
    type: SET_POINT_ID_LIST_ACTION,
    item,
    idType,
  };
}
export function filterPointAction(idType) {
  return {
    type: FILTER_POINT_ACTION,
    idType,
  };
}
export function submitAdoptFeedbackAction() {
  return {
    type: SUMBIT_ADOPT_FEED_BACK_ACTION,
  };
}
