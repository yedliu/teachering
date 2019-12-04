/*
 *
 * SetTags actions
 *
 */

import {
  DEFAULT_ACTION,
  SET_INPUTDTO_ACTION,
  GET_EDITION_LIST,
  SET_EDITION_LIST_ACTION,
  GET_COURSE_SYSTEM,
  SET_COURSE_SYSTEM,
  SET_COURSE_CHECKED,
  SET_MODAL_TOGGLE,
  CHANGE_PAPER_STATE_ACTION,
  GET_PAPER_MSG_ACTION,
  CHANGE_NOT_GET_PAPER_COUNT_ACTION,
  CHANGE_HAS_GET_PAPER_COUNT_ACTION,
  SET_PAPER_LIST_ACTION,
  SET_EP_ID,
  GET_CUR_PAPER,
  SUBMIT_ACTION,
  SET_QUESTION_LIST,
  SET_QUESTION_INDEX,
  INIT_CUR_INPUT,
  CHANGE_PAGE_STATE,
  NEXT_QUES_ACTION,
  SET_COMMON_INFO,
  SET_QUESTION_LIST_ORIGIN,
  SET_FINISHED_LIST,
  SET_PAPER_TITLE,
  SET_TO_GET,
  TO_GET_PAPER,
  TOGGLE_DIALOG_MODAL,
  SET_PAGE_SIZE,
  SET_PAGE_INDEX,
  SUBMIT_VERIFY,
  SET_SORT,
  SET_PAPER_DOWNLOAD_MSG_ACTION,
  SET_EXAMPOINT_LIST,
  SET_KNOWLEDGE_LIST,
  TO_GET_KNOWLEDGE,
  TO_GET_EXAMPOINT,
  CHANGE_IS_OPEN_CHILDREN_TAGS_ACTION,
  CHANGE_CHILDREN_SELECTED_INDEX_ACTION,
  SET_CHILDREN_QUESTION_MSG_ACTION,
  SET_QUESTION_TYPE_LIST_ACTION,
  GET_QUESTION_TYPE_LIST_ACTION,
  SET_BIG_MSG_ACTION,
  SET_CHILDREN_TAGS_ACTION,
  SET_SHOW_QUESTION_TREE_ACTION,
  GET_PAPER_MSG_TO_SEE_ACTION,
  SEE_PAPER_VERIFY_RESULT_ACTION,
  SET_PAPER_MSG_ACTION,
  SET_TAGS_MEMORY_ACTION,
  SET_HIGHLIGHT_ITEM_ACTION,
  INIT_HIGHLIGHT_ITEM_ACTION,
  SET_POINT_ID_LIST_ACTION,
  SELECT_PAPEER_STATE_ACTION,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function setInputDTOAction(inputDTO) {
  return {
    type: SET_INPUTDTO_ACTION,
    inputDTO
  };
}
export function getEditionList() {
  return {
    type: GET_EDITION_LIST
  };
}
export function setEditionListAction(list) {
  return {
    type: SET_EDITION_LIST_ACTION,
    list
  };
}
export function getCourseSystemAction() {
  return {
    type: GET_COURSE_SYSTEM
  };
}
export function setCourseSystemAction(list) {
  return {
    type: SET_COURSE_SYSTEM,
    list
  };
}
export function setCourseCheckedAction(obj) {
  return {
    type: SET_COURSE_CHECKED,
    obj
  };
}
export function setToggleModalAction() {
  return {
    type: SET_MODAL_TOGGLE
  };
}
// 切换页面
export function changePageState(num) {
  return {
    type: CHANGE_PAGE_STATE,
    num,
  };
}
// 切换要查询的试卷状态 同时页码重置1
export function changePaperStateAction(num) {
  return {
    type: CHANGE_PAPER_STATE_ACTION,
    num,
  };
}
export function getPaperMsgAction() {
  return {
    type: GET_PAPER_MSG_ACTION,
  };
}
// 更换未领取试卷页数
export function changeNotGetPaperCountAction(num) {
  return {
    type: CHANGE_NOT_GET_PAPER_COUNT_ACTION,
    num,
  };
}
// 改变已经领到的试卷的数量
export function changeHasGetPaperCountAction(num) {
  return {
    type: CHANGE_HAS_GET_PAPER_COUNT_ACTION,
    num,
  };
}
// 保存试卷列表
export function setPaperListAction(item) {
  return {
    type: SET_PAPER_LIST_ACTION,
    item,
  };
}
// 设置要标记的试卷id
export function setEpid(epid) {
  return {
    type: SET_EP_ID,
    epid
  };
}
export function getCurPaperAction() {
  return {
    type: GET_CUR_PAPER,
  };
}
export function submitAction() {
  return {
    type: SUBMIT_ACTION
  };
}
export function setQuestionList(list) {
  return {
    type: SET_QUESTION_LIST,
    list
  };
}
export function setQuestionListOrigin(list) {
  return {
    type: SET_QUESTION_LIST_ORIGIN,
    list
  };
}
export function setQuestionIndex(index) {
  return {
    type: SET_QUESTION_INDEX,
    index
  };
}
export function initCurInputAction() {
  return {
    type: INIT_CUR_INPUT
  };
}
export function nextQuesAction(index) {
  return {
    type: NEXT_QUES_ACTION,
    index
  };
}
export function setCommonInfo(obj) {
  return {
    type: SET_COMMON_INFO,
    obj
  };
}
export function setFinishedList(list) {
  return {
    type: SET_FINISHED_LIST,
    list
  };
}
export function setPaperTitle(str) {
  return {
    type: SET_PAPER_TITLE,
    str
  };
}
export function setToGet(num) {
  return {
    type: SET_TO_GET,
    num
  };
}
export function toGetPaper() {
  return {
    type: TO_GET_PAPER
  };
}
export function toggleDialogModal(bool) {
  return {
    type: TOGGLE_DIALOG_MODAL,
    bool
  };
}
export function setPageIndex(obj) {
  return {
    type: SET_PAGE_INDEX,
    obj
  };
}
export function setPageSize(num) {
  return {
    type: SET_PAGE_SIZE,
    num
  };
}
export function submitVerify() {
  return {
    type: SUBMIT_VERIFY
  };
}
export function setSort(num) {
  return {
    type: SET_SORT,
    num
  };
}
// 设置下载试卷所需信息
export function setPaperDownloadMsgAction(item) {
  return {
    type: SET_PAPER_DOWNLOAD_MSG_ACTION,
    item,
  };
}
export function setExamPointList(list) {
  return {
    type: SET_EXAMPOINT_LIST,
    list
  };
}
export function setKnowLedgeList(list) {
  return {
    type: SET_KNOWLEDGE_LIST,
    list
  };
}
export function getExamPointAction() {
  return {
    type: TO_GET_KNOWLEDGE,
  };
}
export function getKnowledgeAction() {
  return {
    type: TO_GET_EXAMPOINT,
  };
}
export function changeIsOpenAction(bol) {
  return {
    type: CHANGE_IS_OPEN_CHILDREN_TAGS_ACTION,
    bol,
  };
}
export function changeChildrenSelectedIndexAction(num) {
  return {
    type: CHANGE_CHILDREN_SELECTED_INDEX_ACTION,
    num,
  };
}
export function setChildrenQuestionMsgAction(item) {
  return {
    type: SET_CHILDREN_QUESTION_MSG_ACTION,
    item,
  };
}
export function getQuestionTypeListAction() {
  return {
    type: GET_QUESTION_TYPE_LIST_ACTION,
  };
}
export function setQuestionTYpeListAction(item) {
  return {
    type: SET_QUESTION_TYPE_LIST_ACTION,
    item,
  };
}
export function setBigMsgAction(item) {
  return {
    type: SET_BIG_MSG_ACTION,
    item,
  };
}
export function setChildrenTagsAction(item) {
  return {
    type: SET_CHILDREN_TAGS_ACTION,
    item,
  };
}
export function setShowQuestionTreeAction(item) {
  return {
    type: SET_SHOW_QUESTION_TREE_ACTION,
    item,
  };
}
export function getPaperMsgToSeeAction() {
  return {
    type: GET_PAPER_MSG_TO_SEE_ACTION,
  };
}
export function setPaperVerifyResult(item) {
  return {
    type: SEE_PAPER_VERIFY_RESULT_ACTION,
    item,
  };
}
export function setPaperMsgAction(item) {
  return {
    type: SET_PAPER_MSG_ACTION,
    item,
  };
}
export function setTagsMemoryAction(item) {
  return {
    type: SET_TAGS_MEMORY_ACTION,
    item,
  };
}
export function setHighlightItemAction(item) {
  return {
    type: SET_HIGHLIGHT_ITEM_ACTION,
    item,
  };
}
export function initHighlightItemAction() {
  return {
    type: INIT_HIGHLIGHT_ITEM_ACTION,
  };
}
export function setPointListAction(idType, item) {
  return {
    type: SET_POINT_ID_LIST_ACTION,
    item,
    idType,
  };
}
export function changeSelectedPaperStateIndexAction(num) {
  return {
    type: SELECT_PAPEER_STATE_ACTION,
    num,
  };
}
