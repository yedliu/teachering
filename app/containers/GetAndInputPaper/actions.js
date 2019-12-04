/*
 *
 * GetAndInputPaper actions
 *
 */

import {
  DEFAULT_ACTION,
  CHANGE_PAGE_SATE_ACTION,
  GET_PROVINCE_LIST_ACTION,
  GET_CITY_LIST_ACTIOHN,
  GET_COUNTY_LIST_ACTION,
  SET_PROVINCE_LIST_ACTION,
  SET_CITY_LIST_ACTION,
  SET_COUNTY_LIST_ACTION,
  SET_SELECTED_PROVINCE_ACTION,
  SET_SELECTED_CITY_ACTION,
  SET_SELECTED_COUNTY_ACTION,
  GET_GRADE_LIST_ACTION,
  SET_GRADE_LIST_ACTION,
  SET_SELECTED_GRADE_ACTION,
  GET_SUBJECT_LIST_ACTION,
  SET_SUBJECT_LIST_ACTION,
  SET_SELECTED_SUBJECT_ACTION,
  SET_PAGE_STATE_ENTERING,
  GET_CUR_PAPER,
  SET_RESULT_LIST,
  INDEX_INCREASE,
  SET_CUR_INDEX,
  SET_CUR_ITEM,
  SET_CUR_QUES,
  SUBMIT_CUR_QUES,
  BACK_FORWARD,
  SET_CUR_PAPER,
  SET_EP_ID,
  GET_PAPER_MSG_ACTION,
  CHANGE_NOT_GET_PAPER_COUNT_ACTION,
  CHANGE_HAS_GET_PAPER_COUNT_ACTION,
  SET_PAPER_LIST_ACTION,
  CHANGE_PAPER_STATE_ACTION,
  CHANGE_ALERT_MODAL_SHOW_ACTION,
  CHANG_ALERT_MODAL_STATES_ACTION,
  CHANGE_PAPER_NEED_GET_ACTION,
  GET_INPUT_PAPER_TASK_ACTION,
  CHANGE_NEED_INPUT_PAPER_ACTION,
  SET_COMPLEX_QUESTION_MSG_ACTION,
  SET_COMPLEX_QUESTION_ACTION,
  TOGGLE_FINISH_MODAL,
  SUBMIT_COMPLEX_QUESTION_ACTION,
  SET_COMPLEX_QUESTION_ITEM_AND_MSG_ACTION,
  GET_ALL_QUESTION_TYPE_LIST_ACTION,
  SET_ALL_QUESTION_TYPE_LIST_ACTION,
  SUBMIT_PAPER_TO_VERIFY,
  SET_ALL_DONE,
  CHANGE_SORT_ACTION,
  SET_PAPER_DOWNLOAD_MSG_ACTION,
  CHANGE_PAGE_INDEX_ACTION,
  SET_SELECTED_TEMPLATE_ACTION,
  SET_ERROR_LIST_ACTION,
  SAVE_OTHERS_MSG_ACTION,
  SET_QUESTIONS_LIST_ACTION,
  CHANGE_QUESTIONS_INDEX_ACTION,
  SUBMIT_CURRENT_QUESTION_ACTION,
  CHANGE_TEMPLATE_LIST,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function changePageStateAction(num) {
  return {
    type: CHANGE_PAGE_SATE_ACTION,
    num,
  };
}
export function getProvinceListAction() {
  return {
    type: GET_PROVINCE_LIST_ACTION,
  };
}
export function getCityListActiion() {
  return {
    type: GET_CITY_LIST_ACTIOHN,
  };
}
export function getCountyListActiion() {
  return {
    type: GET_COUNTY_LIST_ACTION,
  };
}
export function setProvinceListAction(item) {
  return {
    type: SET_PROVINCE_LIST_ACTION,
    item,
  };
}
export function setCityListAction(item) {
  return {
    type: SET_CITY_LIST_ACTION,
    item,
  };
}
export function setCountyListAction(item) {
  return {
    type: SET_COUNTY_LIST_ACTION,
    item,
  };
}
export function setSelectedProvinceAction(item) {
  return {
    type: SET_SELECTED_PROVINCE_ACTION,
    item,
  };
}
export function setSelectedCityAction(item) {
  return {
    type: SET_SELECTED_CITY_ACTION,
    item,
  };
}
export function setSelectedCountyAction(item) {
  return {
    type: SET_SELECTED_COUNTY_ACTION,
    item,
  };
}
export function getSubjectListAction() {
  return {
    type: GET_SUBJECT_LIST_ACTION,
  };
}
export function setSubjectListAction(item) {
  return {
    type: SET_SUBJECT_LIST_ACTION,
    item,
  };
}
export function setSelectedSubjectAction(item) {
  return {
    type: SET_SELECTED_SUBJECT_ACTION,
    item,
  };
}
export function getGradeListAction() {
  return {
    type: GET_GRADE_LIST_ACTION,
  };
}
export function setGradeListAction(item) {
  return {
    type: SET_GRADE_LIST_ACTION,
    item,
  };
}
export function setSelectedGradeAction(item) {
  return {
    type: SET_SELECTED_GRADE_ACTION,
    item,
  };
}
export function setPageStateEntring() {
  return {
    type: SET_PAGE_STATE_ENTERING
  }
}
export function getCurPaper() {
  return {
    type: GET_CUR_PAPER
  }
}
export function setResultList(index, value) {
  return {
    type: SET_RESULT_LIST,
    playLoad: { index: index, value: value }
  }
}
export function indexIncrease() {
  return {
    type: INDEX_INCREASE,
  };
}
export function setCurIndex(curIndex) {
  return {
    type: SET_CUR_INDEX,
    curIndex
  }
}
export function setCurItem(curItem) {
  return {
    type: SET_CUR_ITEM,
    curItem
  }
}
export function setCurQues(curQues) {
  return {
    type: SET_CUR_QUES,
    curQues
  }
}
export function submintCur() {
  return {
    type: SUBMIT_CUR_QUES
  }
}
export function setCurPaper(paper) {
  return {
    type: SET_CUR_PAPER,
    paper
  }
}
export function setBackForward() {
  return {
    type: BACK_FORWARD,
  }
}
export function setEpid(epid) {
  return {
    type: SET_EP_ID,
    epid
  }
}
// 查询试卷
export function getPaperMsgAction() {
  return {
    type: GET_PAPER_MSG_ACTION,
  };
}
// 更换未领取试卷页数
export function changePaperCountAction(num) {
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
// 切换要查询的试卷状态
export function changePaperStateAction(num) {
  return {
    type: CHANGE_PAPER_STATE_ACTION,
    num,
  };
}
// 切换弹框显示状态
export function changeAlertModalShowAction(bol) {
  return {
    type: CHANGE_ALERT_MODAL_SHOW_ACTION,
    bol,
  };
}
// 更换弹框控制属性对象
export function changeAlertModalStatesAvtion(bol) {
  return {
    type: CHANG_ALERT_MODAL_STATES_ACTION,
    bol,
  };
}
// 切换当前要领取的试卷的 id
export function changePaperNeedGetAction(num) {
  return {
    type: CHANGE_PAPER_NEED_GET_ACTION,
    num,
  };
}
// 切换当前要领取的试卷的 id
export function getInputPaperTaskAction() {
  return {
    type: GET_INPUT_PAPER_TASK_ACTION,
  };
}
// 记录切割的试卷的 id
export function changeNeedInputPaperAction(num, item) {
  return {
    type: CHANGE_NEED_INPUT_PAPER_ACTION,
    num,
    item,
  };
}
// 设置复合题信息
export function setComplexQuestionItemMsgAction(item) {
  return {
    type: SET_COMPLEX_QUESTION_MSG_ACTION,
    item,
  };
}
// 设置复合题内容
export function setComplexQuestionItemAction(item) {
  return {
    type: SET_COMPLEX_QUESTION_ACTION,
    item,
  };
}
export function toggleFinishModal() {
  return {
    type: TOGGLE_FINISH_MODAL,
  };
}
// 提交复合题
export function submitComplexQuestionAction() {
  return {
    type: SUBMIT_COMPLEX_QUESTION_ACTION,
  };
}
// 设置符合提的数据
export function setComplexQuestionItemAndMsgAction() {
  return {
    type: SET_COMPLEX_QUESTION_ITEM_AND_MSG_ACTION,
  };
}
// 获取所有题型
export function getAllQuestionListAction() {
  return {
    type: GET_ALL_QUESTION_TYPE_LIST_ACTION,
  };
}
// 保存所有题型
export function setAllQuestionListAction(item) {
  return {
    type: SET_ALL_QUESTION_TYPE_LIST_ACTION,
    item,
  };
}
export function submitPaperVerify() {
  return {
    type: SUBMIT_PAPER_TO_VERIFY,
  };
}
export function setSubmitAllDone(bool) {
  return {
    type: SET_ALL_DONE,
    bool,
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
// 改变当前页数
export function changePageIndexAction(num) {
  return {
    type: CHANGE_PAGE_INDEX_ACTION,
    num,
  };
}
export function setSelectedTemplateAction(item) {
  return {
    type: SET_SELECTED_TEMPLATE_ACTION,
    item,
  };
}
export function setErrListAction(item) {
  return {
    type: SET_ERROR_LIST_ACTION,
    item,
  };
}
export function saveOthersMsgAction(item) {
  return {
    type: SAVE_OTHERS_MSG_ACTION,
    item,
  };
}
export function setQuestionsListAction(item) {
  return {
    type: SET_QUESTIONS_LIST_ACTION,
    item,
  };
}
export function changeQuestionsIndexAction(num) {
  return {
    type: CHANGE_QUESTIONS_INDEX_ACTION,
    num,
  };
}
export function submitCurrentQuestionAction() {
  return {
    type: SUBMIT_CURRENT_QUESTION_ACTION,
  };
}
// 改变模板list
export function changeTemplateList(list) {
  return {
    type: CHANGE_TEMPLATE_LIST,
    list
  };
}
