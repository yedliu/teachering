/*
 *
 * PaperInputVerify actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_PAPER_MSG_ACTION,
  CHANGE_PAGE_INDEX_ACTION,
  CHANGE_PAPER_STATE_ACTION,
  SET_PAPER_LIST_ACTION,
  CHANGE_NOT_GET_PAPER_COUNT_ACTION,
  CHANGE_HAS_GET_PAPER_COUNT_ACTION,
  CHANGE_NEED_VERIFY_PAPER_ID_ACTION,
  CHANGE_NEED_VERIFY_PAPER_ACTION,
  CHANGE_PAGE_STATE_ACTION,
  CHANGE_ALERT_SHOW_OR_HIDE_ACTION,
  CHANGE_QUESTION_LIST_ACTION,
  CHANGE_QUESTION_MSG_LIST_ACTION,
  CHANGE_REAL_QUESTION_COUNT_ACTION,
  CHANGE_QUESTION_RESULT_ACTION,
  SET_ALL_QUESTION_TYPE_LIST_ACTION,
  GET_ALL_QUESTION_TYPE_LIST_ACTION,
  CHANGE_SELECTED_QUESTION_INDEX_ACTION,
  CHANGE_ERR_TEXTAREA_SHOW_ACTION,
  CHANGE_QUESTION_RESULT_STATE_ACTION,
  CHANGE_PREVIEW_IMG_SRC_ACTION,
  SUBMIT_QUESTION_CUT_VERIFY_ACTION,
  CHANGE_SORT_ACTION,
  SET_PAPER_DOWNLOAD_MSG_ACTION,
  INIT_VERIFY_DATA_ACTION,
  CHANGE_SHOW_SUBMIT_BTN_ACTION,
  CHANGE_QUESTION_EDIT_STATE_ACTION,
  SET_CLICK_TARGET_ACTION,
  SUBMIT_QUESTION_ITEM_ACTION,
  SET_NEW_QUESTION_MSG_ACTION,
  SET_QUESTIONS_ACTION,
  CHANGE_NEED_VERIFY_PAPER_ITEM_ACTION,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
// 获取试卷信息
export function getPaperMsgAction() {
  return {
    type: GET_PAPER_MSG_ACTION,
  };
}
// 改变当前页数
export function changePageIndexAction(num) {
  return {
    type: CHANGE_PAGE_INDEX_ACTION,
    num,
  };
}
// 改变试卷状态
export function changePaperStateAction(num) {
  return {
    type: CHANGE_PAPER_STATE_ACTION,
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
// 改变未领取的数量
export function changeNotGetPaperCountAction(num) {
  return {
    type: CHANGE_NOT_GET_PAPER_COUNT_ACTION,
    num,
  };
}
// 保存已领取的数量
export function changeHasGetPaperCountAction(num) {
  return {
    type: CHANGE_HAS_GET_PAPER_COUNT_ACTION,
    num,
  };
}
// 保存需要切割的试卷的 id
export function changeNeedVerifyPaperIdAction(num) {
  return {
    type: CHANGE_NEED_VERIFY_PAPER_ID_ACTION,
    num,
  };
}
// 保存需要切割的试卷的 item
export function changeNeedVerifyPaperItemAction(item) {
  return {
    type: CHANGE_NEED_VERIFY_PAPER_ITEM_ACTION,
    item,
  };
}
// 保存要审核的试卷
export function changePaperNeedVerifyAction(item) {
  return {
    type: CHANGE_NEED_VERIFY_PAPER_ACTION,
    item,
  };
}
// 切换页面显示状态
export function changePageStateAction(num) {
  return {
    type: CHANGE_PAGE_STATE_ACTION,
    num,
  };
}
// 切换弹框显示状态
export function changeAlertShowOrHideAction(bol) {
  return {
    type: CHANGE_ALERT_SHOW_OR_HIDE_ACTION,
    bol,
  };
}
// 设置信息列表
export function changeQuestionListAction(item) {
  return {
    type: CHANGE_QUESTION_LIST_ACTION,
    item,
  };
}
// 设置大题信息列表
export function changeQuestionMsgListAction(item) {
  return {
    type: CHANGE_QUESTION_MSG_LIST_ACTION,
    item,
  };
}
// 保存实际上题目的数量
export function changeRealQuestionsCountAction(num) {
  return {
    type: CHANGE_REAL_QUESTION_COUNT_ACTION,
    num,
  };
}
// 保存题目的错误信息
export function changeQuestionResultAction(item) {
  return {
    type: CHANGE_QUESTION_RESULT_ACTION,
    item,
  };
}
// 保存所有题型
export function setAllQuestionTypeListAction(item) {
  return {
    type: SET_ALL_QUESTION_TYPE_LIST_ACTION,
    item,
  };
}
// 获取所有题型
export function getAllQuestionTypeListAction() {
  return {
    type: GET_ALL_QUESTION_TYPE_LIST_ACTION,
  };
}
// 切换点击的题目的序号
export function changeSelectedQuestionIndexAction(num) {
  return {
    type: CHANGE_SELECTED_QUESTION_INDEX_ACTION,
    num,
  };
}
// 切换错误描述填写框显示状态
export function changeErrTextareaShowAction(bol) {
  return {
    type: CHANGE_ERR_TEXTAREA_SHOW_ACTION,
    bol,
  };
}
// 更换当前题目通过与否状态
export function changeQuestionResultStateAction(num) {
  return {
    type: CHANGE_QUESTION_RESULT_STATE_ACTION,
    num,
  };
}
// 切换预览图片
export function changePreviewImgSrcAction(str) {
  return {
    type: CHANGE_PREVIEW_IMG_SRC_ACTION,
    str,
  };
}
// 提交审核结果
export function submitQuestionCutVerifyAction() {
  return {
    type: SUBMIT_QUESTION_CUT_VERIFY_ACTION,
  };
}
// 切换排序顺序
export function changeSortAction(num) {
  return {
    type: CHANGE_SORT_ACTION,
    num,
  };
}
// 设置下载试卷所需信息
export function setPaperDownloadMsgAction(item) {
  return {
    type: SET_PAPER_DOWNLOAD_MSG_ACTION,
    item,
  };
}
// 初始化数据
export function initVerifyDataAction() {
  return {
    type: INIT_VERIFY_DATA_ACTION,
  };
}
export function changeShowSubmitBtnAction(bol) {
  return {
    type: CHANGE_SHOW_SUBMIT_BTN_ACTION,
    bol,
  };
}
export function changeQuestionEditStateAction(num) {
  return {
    type: CHANGE_QUESTION_EDIT_STATE_ACTION,
    num,
  };
}
export function setClickTargetAction(str) {
  return {
    type: SET_CLICK_TARGET_ACTION,
    str,
  };
}
export function submitQuestionItemAction() {
  return {
    type: SUBMIT_QUESTION_ITEM_ACTION,
  };
}
export function setNewQuestionMsgAction(item) {
  return {
    type: SET_NEW_QUESTION_MSG_ACTION,
    item,
  };
}
export function setQuestionsListAction(item) {
  return {
    type: SET_QUESTIONS_ACTION,
    item,
  };
}
