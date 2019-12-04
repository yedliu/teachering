/*
 *
 * StandHomeWork actions
 *
 */

import * as ACTIONS from './constants';

export function defaultAction() {
  return {
    type: ACTIONS.DEFAULT_ACTION,
  };
}
export function changePageState(key, value) {
  return {
    type: ACTIONS.CAHNGE_PAGE_STATE,
    key,
    value
  };
}
export function getGradeListAction() {
  return {
    type: ACTIONS.GET_GRADE_LIST_ACTION,
  };
}
export function getSubjectListAction() {
  return {
    type: ACTIONS.GET_SUBJECT_LIST_ACTION,
  };
}
export function getEditionListAction() {
  return {
    type: ACTIONS.GET_EDITION_LIST_ACTION,
  };
}
export function getCourseListAction() {
  return {
    type: ACTIONS.GET_COURSE_LIST_ACTION,
  };
}
export function setPreviewSelectObjAction(item) {
  // console.log(item.toJS(), 'setPreviewSelectObjAction')
  return {
    type: ACTIONS.SET_PREVIEW_SELECT_OBJ_ACTION,
    item,
  };
}
export function setSearchParamsAction(item) {
  return {
    type: ACTIONS.SET_SEARCH_PARAMS_ACTION,
    item,
  };
}
export function getPhaseSubjectAction(getType) {
  return {
    type: ACTIONS.GET_PHASE_SUBJECT_ACTION,
    getType,
  };
}
export function getKnowledgeListAction(getType) {
  return {
    type: ACTIONS.GET_KNOWLEDEGE_LIST_ACTION,
    getType,
  };
}
export function setSearchQuestionParamsAction(item) {
  // console.log(item.toJS(), 'action - setSearchQuestionParamsAction');
  return {
    type: ACTIONS.SET_SEARCH_QUESTION_PARAMS_ACTION,
    item,
  };
}
export function setSearchQuestionParamsItemAction(attr, item) {
  // console.log(item.toJS(), attr, 'setSearchQuestionParamsAction');
  return {
    type: ACTIONS.SET_SEARCH_QUESTION_PARAMS_ITEM_ACTION,
    item,
    attr,
  };
}
export function getQuestionTypeListActioin() {
  return {
    type: ACTIONS.GET_QUESTION_TYPE_LIST_ACTION,
  };
}
export function setCreateHomeworkStepParamsAction(item) {
  return {
    type: ACTIONS.SET_CREATE_HOMEWORK_STEP_PARAMS_ACTION,
    item,
  };
}
export function getQuestionListAction() {
  return {
    type: ACTIONS.GET_QUESTION_LIST_ACTION,
  };
}
export function saveStandHomeworkAction() {
  return {
    type: ACTIONS.SAVE_STAND_HOMEWORK_ACTION,
  };
}
export function initDataWhenCloseAction() {
  return {
    type: ACTIONS.INIT_DATA_WHEN_CLOSE_ACTION,
  };
}
export function getStandhomeworkListAction() {
  return {
    type: ACTIONS.GET_STAND_HOMEWORK_LIST_ACTION,
  };
}
export function getPreviewHomeworkDataListAction() {
  return {
    type: ACTIONS.GET_PREVIEW_HOMEWORK_DATA_LIST_ACTION,
  };
}
export function setPreviewHomeworkDataListAction(item) {
  return {
    type: ACTIONS.SET_PREVIEW_HOMEWORK_DATA_LIST_ACTION,
    item,
  };
}
export function editorHomeworkAction() {
  return {
    type: ACTIONS.EDIT_HOMEWORK_ACTION,
  };
}
// export function initPreviewDataAction() {
//   return {
//     type: INIT_PREVIEW_DATA_ACTION,
//   };
// }
export function getAllGradeListAction() {
  return {
    type: ACTIONS.GET_ALL_GRADE_LIST_ACTION,
  };
}

export function setAllGradeListAction(item) {
  return {
    type: ACTIONS.SET_ALL_GRADE_LIST_ACTION,
    item,
  };
}


export function deleteHomeworkAction() {
  return {
    type: ACTIONS.DELETE_HOMEWORK_ACTION,
  };
}

export function changeIsReEditHomeworkAction(bol) {
  return {
    type: ACTIONS.CHANGE_IS_REEDIT_HOMEWORK_ACTION,
    bol,
  };
}

export function changeHomeworkTypeAction(num) {
  return {
    type: ACTIONS.CHANGE_HOMEWORK_TYPE_ACTION,
    num,
  };
}

export function getKnowledgeListByCsidAction() {
  return {
    type: ACTIONS.GET_KNOWLEDGELIST_BY_CSID_ACTION,
  };
}
export function setAIHWParamsItemAction(AItype, item) {
  return {
    type: ACTIONS.SET_AI_HOMEWORK_PARAMS_ITEM_ACTION,
    AItype,
    item,
  };
}
export function getQuestionType4AiHwAction() {
  return {
    type: ACTIONS.GET_QUESTION_TYPE_FOR_AIHW_ACTION,
  };
}
export function setAIHWParamsAction(item) {
  return {
    type: ACTIONS.SET_AI_HOMEWORK_PARAMS_ACTION,
    item,
  };
}
export function getQuestion4AIHWAction() {
  return {
    type: ACTIONS.GET_QUESTION_FOR_AIHW_ACTION,
  };
}
export function saveAIHomeworkAction() {
  return {
    type: ACTIONS.SAVE_AI_HOMEWORK_ACTION,
  };
}
export function setCreateHomeworkStepParamsItemAction(AItype, item) {
  return {
    type: ACTIONS.SET_CREATE_HOMEWORK_STEP_PARAMS_ITEM_ACTION,
    AItype,
    item,
  };
}
export function getChangeItemDataListAction(AItype) {
  return {
    type: ACTIONS.GET_CHANGE_ITEMDATALIST_ACTION,
    AItype,
  };
}
