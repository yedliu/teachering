/*
 *
 * addpaper actions
 *
 */

import {
  DEFAULT_ACTION,
  SET_SELECTED,
  SET_DATA_LIST,
  SET_UISTATUS,
  GET_PHASE_SUBJECT_ACTION,
  GET_PHASE_SUBJECT_LIST_ACTION,
  SET_PHASE_SUBJECT_ACTION,
  SET_PHASE_SUBJECT_LIST_ACTION,
  GET_GRADE_LIST_ACTION,
  SET_GRADE_LIST_ACTION,
  GET_TERM_LIST_ACTION,
  SET_TERM_LIST_ACTION,
  GET_AREA_LIST_ACTION,
  SET_AREA_LIST_ACTION,
  GET_DATA_ACTION,
  SET_INPUT_DTO_ACTION,
  GET_FORM_GRADE_LIST,
  SET_FORM_GRADE_LIST,
  ADD_NEW_PAPER_ACTION,
  SET_CITY_LIST_ACTION,
  GET_CITY_LIST_ACITON,
  GET_COUNTY_LIST_ACITON,
  SET_COUNTY_LIST_ACITON,
  SET_PROVINCELIST_ACTION,
  GET_CITY_LIST_ADD_ACITON,
  GET_COUNTY_ADD_LIST_ACITON,
  SET_AREA_LIST_ADD_ACTION,
  SET_TABLE_STATE,
  SET_TABLE_DATA,
  SET_TOGGLE_EDITMODAL,
  SET_EDIT_PAPER_ID,
  SUBMIT_MODIFY_PAPER,
  DELETE_PAPER_ACTION,
  GET_EDITION_ACTION,
  SET_EDITION_ACTION,
  CHANGE_NOT_ISSUE_ACTION,
  CHANGE_WASH_STATE_ACTION,
  SET_SHOW_PAPER_MSG_ACTION, SET_OPERATOR_MODAL_VISIBLE_ACTION, SET_OPERATORS_ACTION, GET_OPERATORS_ACTION,
  SET_FORCED_RELEASE_MODAL_ACTION, GET_FORCED_RELEASE_MODAL_ACTION, FORCED_RELEASE_ACTION,
  CHANGE_PAPER_FOR_SEARCH_ACTION,
  SHOW_SAME_PAPER_ACTION,
  SET_SAME_PAPER_LIST_ACTION,
  FORCE_SAVE_ACTION,
  SET_FORCE_SAVE_ACTION, CONVERT_TO_PIC_ACTION,
  QUERY_NODES_ACTION,
  SET_STORE_ALL_ACTION,
  SET_STORE_ITEM_ACTION,
  GET_PAPER_TYPE,
  SET_PAPER_TYPE,
  GET_PAPER_PURPOSE,
  SET_PAPER_PURPOSE,
  GET_PAPER_TARGET,
  SET_PAPER_TARGET,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function getPhaseSubjectListAction() {
  return {
    type: GET_PHASE_SUBJECT_LIST_ACTION,
  };
}

export function setPhaseSubjectListAction(phaseSubjectList) {
  return {
    type: SET_PHASE_SUBJECT_LIST_ACTION,
    phaseSubjectList,
  };
}

export function getPhaseSubjectAction() {
  return {
    type: GET_PHASE_SUBJECT_ACTION,
  };
}

export function setPhaseSubjectAction(phaseSubject) {
  return {
    type: SET_PHASE_SUBJECT_ACTION,
    phaseSubject,
  };
}
export function setSelected(selected) {
  return {
    type: SET_SELECTED,
    selected
  };
}
export function setUIStatus(UIstatus) {
  return {
    type: SET_UISTATUS,
    UIstatus
  };
}
export function getGradeListAction() {
  return {
    type: GET_GRADE_LIST_ACTION
  };
}
export function setGradeListaction(gradeList) {
  return {
    type: SET_GRADE_LIST_ACTION,
    gradeList
  };
}
export function setTermListAction(termList) {
  return {
    type: SET_TERM_LIST_ACTION,
    termList
  };
}
export function getTermListAction() {
  return {
    type: GET_TERM_LIST_ACTION,
  };
}
export function getProvinceIdAction() {
  return {
    type: GET_AREA_LIST_ACTION
  };
}
export function setProvinceIdAction(provinceList) {
  return {
    type: SET_PROVINCELIST_ACTION,
    provinceList
  };
}
export function setAreaListAction(areaList) {
  return {
    type: SET_AREA_LIST_ACTION,
    areaList
  };
}
export function setAreaListAddAction(areaList) {
  return {
    type: SET_AREA_LIST_ADD_ACTION,
    areaList
  };
}
export function getDataAction() {
  return {
    type: GET_DATA_ACTION
  };
}
export function setInputDtoAction(inputDto) {
  return {
    type: SET_INPUT_DTO_ACTION,
    inputDto,
  };
}
export function getFormGradeList() {
  return {
    type: GET_FORM_GRADE_LIST
  };
}
export function setFormGradeListaction(formGradeList) {
  return {
    type: SET_FORM_GRADE_LIST,
    formGradeList
  };
}
export function addNewPaperAction(teachingVersion, courseSystem) {
  return {
    type: ADD_NEW_PAPER_ACTION,
    teachingVersion,
    courseSystem
  };
}
export function getCityListAction() {
  return {
    type: GET_CITY_LIST_ACITON
  };
}
export function getCityListAddAction() {
  return {
    type: GET_CITY_LIST_ADD_ACITON
  };
}
export function setCityListAction(city) {
  return {
    type: SET_CITY_LIST_ACTION,
    city
  };
}

export function getCountyListAction() {
  return {
    type: GET_COUNTY_LIST_ACITON
  };
}
export function getCountyListAddAction() {
  return {
    type: GET_COUNTY_ADD_LIST_ACITON
  };
}
export function setTableState(tableState) {
  return {
    type: SET_TABLE_STATE,
    tableState
  };
}
export function setTableData(tableData) {
  return {
    type: SET_TABLE_DATA,
    tableData
  };
}
export function setToggleEditModal() {
  return {
    type: SET_TOGGLE_EDITMODAL
  };
}
export function setEditPaperId(id) {
  return {
    type: SET_EDIT_PAPER_ID,
    id
  };
}
export function submitModifyPaper(teachingVersion, courseSystem) {
  return {
    type: SUBMIT_MODIFY_PAPER,
    teachingVersion,
    courseSystem
  };
}
export function deletePaperAction() {
  return {
    type: DELETE_PAPER_ACTION
  };
}
export function getEditionAction() {
  return {
    type: GET_EDITION_ACTION
  };
}
export function setEditionAction(list) {
  return {
    type: SET_EDITION_ACTION,
    list
  };
}
//
export function changeNotIssueAction(bol) {
  return {
    type: CHANGE_NOT_ISSUE_ACTION,
    bol,
  };
}
export function changeWashStatAction(item) {
  return {
    type: CHANGE_WASH_STATE_ACTION,
    item,
  };
}
export function setShowPaperMsgAction(item) {
  return {
    type: SET_SHOW_PAPER_MSG_ACTION,
    item,
  };
}
export function setOperatorModalVisibleAction(item) {
  return {
    type: SET_OPERATOR_MODAL_VISIBLE_ACTION,
    item,
  };
}
export function setOperatorsAction(item) {
  return {
    type: SET_OPERATORS_ACTION,
    item,
  };
}
export function getOperatorsAction() {
  return {
    type: GET_OPERATORS_ACTION,
  };
}
export function setForcedReleaseModalAction(item) {
  return {
    type: SET_FORCED_RELEASE_MODAL_ACTION,
    item,
  };
}
export function getForcedReleaseModalAction() {
  return {
    type: GET_FORCED_RELEASE_MODAL_ACTION,
  };
}
export function forcedReleaseAction() {
  return {
    type: FORCED_RELEASE_ACTION,
  };
}
export function changePaperForSearch(val) {
  return {
    type: CHANGE_PAPER_FOR_SEARCH_ACTION,
    val,
  };
}

export function showSamePaperAction(bol) {
  return {
    type: SHOW_SAME_PAPER_ACTION,
    bol,
  };
}
export function setSamePaperListAction(item) {
  return {
    type: SET_SAME_PAPER_LIST_ACTION,
    item,
  };
}
export function forceSaveFlagAction() {
  return {
    type: FORCE_SAVE_ACTION,
  };
}
export function changeForceSavingAction(bol) {
  return {
    type: SET_FORCE_SAVE_ACTION,
    bol,
  };
}
export function convertToPicAction() {
  return {
    type: CONVERT_TO_PIC_ACTION,
  };
}
export function queryNodesAction() {
  return {
    type: QUERY_NODES_ACTION,
  };
}
export function setStoreAllAction(item) {
  return {
    type: SET_STORE_ALL_ACTION,
    item,
  };
}
export function setStoreItemAction(dataType, data) {
  return {
    type: SET_STORE_ITEM_ACTION,
    dataType,
    data,
  };
}

export function getPaperType() {
  return {
    type: GET_PAPER_TYPE,
  };
}

export function setPaperType(list) {
  return {
    type: SET_PAPER_TYPE,
    list,
  };
}

export function getPaperPurpose() {
  return {
    type: GET_PAPER_PURPOSE,
  };
}

export function setPaperPurpose(list) {
  return {
    type: SET_PAPER_PURPOSE,
    list,
  };
}

export function getPaperTarget() {
  return {
    type: GET_PAPER_TARGET,
  };
}

export function setPaperTarget(list) {
  return {
    type: SET_PAPER_TARGET,
    list,
  };
}
