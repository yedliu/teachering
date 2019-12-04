/*
 *
 * GetAndCutPaper actions
 *
 */

import {
  // DEFAULT_ACTION,
  CHANGE_PAGE_STATE_ACTION,
  PREVIEW_WRAPPER_SHOW_OR_HIDE_ACTION,
  CHANGE_SELECTED_QUESTION_INDEX_ACTION,
  CHANGE_IMGSRC_ACTION,
  CHANGE_CURRENT_CUT_PAPER_IMG_ACTION,
  GET_PAPER_MSG_ACTION,
  CHANGE_PAGE_INDEX_ACTION,
  CHANGE_PAPER_STATE_ACTION,
  CHANGE_SUBJECT_ID_ACTION,
  CHANGE_GRADE_ID_ACTION,
  CHANGE_ALERT_SHOW_OR_HIDE_ACTION,
  CHANGE_CURRENT_PAPER_ITEM_ACTION,
  SET_PAPER_LIST_ACTION,
  CHANGE_PAPER_COUNT_ACTION,
  GET_CUT_PAPER_TASK_ACTION,
  //
  GET_CUT_PAPER_ITEM_ACTION,
  CHANGE_NEED_CUT_PAPER_ID_ACTION,
  SET_PIC_URL_LIST_ACTION,
  CHANGE_PAPER_IS_BE_CUT_ITEM_ACTION,
  SET_CANVAS_DOM_ACTION,
  GET_ALL_QUESTION_TYPE_LIST_ACTION,
  SET_ALL_QUESTION_TYPE_LIST_ACTION,
  CHANGE_SELECTED_QUESTION_TYPE_ACTION,
  CHANGE_BIG_QUESTION_ACTION,
  SET_SMALL_QUESTION_ACTION,
  SAVE_QUESTION_MSG_LIST_ACTION,
  SAVE_QUESTION_LIST_ACTION,
  CHANGE_QUESTION_PREVIEW_SHOW_ACTION,
  CHANGE_PREVIEW_IMG_SRC_ACTION,
  CHANGE_PAPER_PREVIEW_SHOW_ACTION,
  SUNMIT_CUT_PAPER_ACTION,
  BACK_INIT_DATA_ACTION,
  CHANGE_HAS_GET_PAPER_COUNT_ACTION,
  CHANGE_IS_SUBMIT_ING_ACTION,
  CHANGE_ALERT_STATES_ACTION,
  CHANGE_SORT_ACTION,
  CHANGE_IMG_START_INDEX_ACTION,
  // SET_SELECT_INSERT_WAY_ACTION,
  SET_SELECT_BIG_QUESTION_ACTION,
  SET_SELECTED_INDEX_ACTION,
  SET_SELECTED_INSERT_INDEX_ACTION,
  SET_BIG_QUESTION_MSG_ACTION,
  SET_EDITOR_BIG_QUESTION_ACTION,
  IMG_COUNT_CRITICAL_ACTION,
  IMG_IMG_STEP_ACTION,
  SET_PIC_INPUT_DTO_LIST_ACTION,
  CHANGE_BIG_PIC_INDEX_ACTION,
  ADD_BIG_IMG_ACTION,
  SET_NEED_CUT_PAPER_ACTION,
} from './constants';

// 切换当前是领取界面还是切割界面
export function changePageStateAction(num) {
  return {
    type: CHANGE_PAGE_STATE_ACTION,
    num,
  };
}
// 控制预览界面的显示或隐藏
export function previewWrapperShowOrHideAction(bol) {
  return {
    type: PREVIEW_WRAPPER_SHOW_OR_HIDE_ACTION,
    bol,
  };
}
// 切换要查看的已切割的题目的序号
export function changeSelectedQuestionIndexAction(num) {
  return {
    type: CHANGE_SELECTED_QUESTION_INDEX_ACTION,
    num,
  };
}
// 切换需要切割的图片的 src
export function changeImgSrcAction(str) {
  return {
    type: CHANGE_IMGSRC_ACTION,
    str,
  };
}
// 切换当前已切割的图片的 src
export function changeCurrentCutPaperImgAction(str) {
  return {
    type: CHANGE_CURRENT_CUT_PAPER_IMG_ACTION,
    str,
  };
}
// 查询试卷
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
// 改变当前是领取状态还是未领取状态
export function changePaperStateAction(num) {
  return {
    type: CHANGE_PAPER_STATE_ACTION,
    num,
  };
}
// 切换当前学科 id list
export function changeSubjectIdAction(item) {
  return {
    type: CHANGE_SUBJECT_ID_ACTION,
    item,
  };
}
// 切换当前年级 id list
export function changeGradeIdAction(item) {
  return {
    type: CHANGE_GRADE_ID_ACTION,
    item,
  };
}
// 切换当前弹框组件显示与隐藏
export function changeAlertShowOrHideAction(bol) {
  return {
    type: CHANGE_ALERT_SHOW_OR_HIDE_ACTION,
    bol,
  };
}
// 点击领取时保存选中试卷
export function changeCurrentPaperIdAction(num) {
  return {
    type: CHANGE_CURRENT_PAPER_ITEM_ACTION,
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
// 更换页数
export function changePaperCountAction(num) {
  return {
    type: CHANGE_PAPER_COUNT_ACTION,
    num,
  };
}
// 领取切割任务
export function getCutPaperTaskAction() {
  return {
    type: GET_CUT_PAPER_TASK_ACTION,
  };
}

// cutPaperPage.js
// 获取要切割试卷信息
export function getCutPaperItemAction() {
  return {
    type: GET_CUT_PAPER_ITEM_ACTION,
  };
}
// 保存需要切割的试卷的 id
export function changeNeedCutPaperAction(num) {
  return {
    type: CHANGE_NEED_CUT_PAPER_ID_ACTION,
    num,
  };
}
// 设置需要切割的试卷的图片列表
export function setPicUrlListAction(item) {
  return {
    type: SET_PIC_URL_LIST_ACTION,
    item,
  };
}
// 保存正在做切割的试卷信息
export function changePaperIsBeCutItemAction(item) {
  return {
    type: CHANGE_PAPER_IS_BE_CUT_ITEM_ACTION,
    item,
  };
}
// canvas dom object
export function setCanvasDomAction(item) {
  return {
    type: SET_CANVAS_DOM_ACTION,
    item,
  };
}
// 获取所有题型
export function getAllQuestionTypeListAction() {
  return {
    type: GET_ALL_QUESTION_TYPE_LIST_ACTION,
  };
}
// 保存所有题型
export function setAllQuestionTypeListAction(item) {
  return {
    type: SET_ALL_QUESTION_TYPE_LIST_ACTION,
    item,
  };
}
// 保存选中的题型
export function changeSelectedQuestionTypeAction(item) {
  return {
    type: CHANGE_SELECTED_QUESTION_TYPE_ACTION,
    item,
  };
}
//
export function changeBigQuestionAction(item) {
  return {
    type: CHANGE_BIG_QUESTION_ACTION,
    item,
  };
}
//
export function changeSmallQuestionAction(item) {
  return {
    type: SET_SMALL_QUESTION_ACTION,
    item,
  };
}
// 保存试卷各题信息
export function saveQuestionMsgListAction(item) {
  return {
    type: SAVE_QUESTION_MSG_LIST_ACTION,
    item,
  };
}
// 保存题目数量列表
export function saveQuestionListAction(item) {
  return {
    type: SAVE_QUESTION_LIST_ACTION,
    item,
  };
}
// 是否显示预览
export function changeQuestionPreviewShowAction(bol) {
  return {
    type: CHANGE_QUESTION_PREVIEW_SHOW_ACTION,
    bol,
  };
}
// 切换要预览的题目的图片 src
export function changePreviewImgSrcAction(str) {
  return {
    type: CHANGE_PREVIEW_IMG_SRC_ACTION,
    str,
  };
}
// 是否显示预览试卷信息
export function changePaperPreviewShowAction(bol) {
  return {
    type: CHANGE_PAPER_PREVIEW_SHOW_ACTION,
    bol,
  };
}
// 提交已切割的试卷
export function submitCutPaperAction() {
  return {
    type: SUNMIT_CUT_PAPER_ACTION,
  };
}
// 初始化数据
export function backInitDataAction() {
  return {
    type: BACK_INIT_DATA_ACTION,
  };
}
// 改变已经领到的试卷的数量
export function changeHasGetPaperCountAction(num) {
  return {
    type: CHANGE_HAS_GET_PAPER_COUNT_ACTION,
    num,
  };
}
// 改变正在提交状态
export function changeIsSubmitIngAction(bol) {
  return {
    type: CHANGE_IS_SUBMIT_ING_ACTION,
    bol,
  };
}
// 改变弹出框的状态
export function changeAlertStatesAction(item) {
  return {
    type: CHANGE_ALERT_STATES_ACTION,
    item,
  };
}
// 切换排序顺序
export function changeSortAction(num) {
  return {
    type: CHANGE_SORT_ACTION,
    num,
  };
}
// 切换当前加载的页数
export function changeImgStartIndexAction(num) {
  return {
    type: CHANGE_IMG_START_INDEX_ACTION,
    num,
  };
}
// // 切换切割处的小题的插入方式
// export function setSelectInsertWayAction(item) {
//   return {
//     type: SET_SELECT_INSERT_WAY_ACTION,
//     item,
//   };
// }
// 切换切割处大题选择
export function setSelectBigQuestionAction(item) {
  return {
    type: SET_SELECT_BIG_QUESTION_ACTION,
    item,
  };
}
// 选中的小题的 index 对象
export function setSelectedIndexAction(item) {
  return {
    type: SET_SELECTED_INDEX_ACTION,
    item,
  };
}
// 要插入的位置
export function setSelectedInsertIndexAction(item) {
  return {
    type: SET_SELECTED_INSERT_INDEX_ACTION,
    item,
  };
}
// 大题信息弹框状态切换
export function changeBigQuestiolnMsgShowAction(bol) {
  return {
    type: SET_BIG_QUESTION_MSG_ACTION,
    bol,
  };
}
export function setEditorBigQuestionAction(item) {
  return {
    type: SET_EDITOR_BIG_QUESTION_ACTION,
    item,
  };
}
export function changeImgCountCriticalAction(num) {
  return {
    type: IMG_COUNT_CRITICAL_ACTION,
    num,
  };
}
export function changeImgStepAction(num) {
  return {
    type: IMG_IMG_STEP_ACTION,
    num,
  };
}
export function setPicInputDTOListAction(item) {
  return {
    type: SET_PIC_INPUT_DTO_LIST_ACTION,
    item,
  };
}
export function changeBigPicIndexAction(num) {
  return {
    type: CHANGE_BIG_PIC_INDEX_ACTION,
    num,
  };
}
export function addBigImgAction(needCutPaperId, item, start) {
  return {
    type: ADD_BIG_IMG_ACTION,
    needCutPaperId,
    item,
    start,
  };
}
export function setNeedCutPaperAction(item) {
  return {
    type: SET_NEED_CUT_PAPER_ACTION,
    item,
  };
}
