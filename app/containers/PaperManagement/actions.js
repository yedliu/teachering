/*
 *
 * PaperManagement actions
 *
 */

import {
  DEFAULT_ACTION,
  SET_GRADE_ACTION,
  SET_SUBJECT_ACTION,
  SET_PAPER_PROPERTY_ACTION,
  SEARCH_PAPER_ACTION,
  SET_TABLE_STATE,
  SET_PAPER_LIST_STATE,
  SET_ONE_PAPER_ACTION,
  REMOVE_ONE_PAPER_ACTION,
  SET_TOTAL_PAPER_ACTION,
  ASSEMBLE_EXAM_PAPER_ACTION,
  SET_PAPER_MSG_ACTION,
  GET_PAPER_MSG_ACTION,
  GET_CITY_LIST_ACTION,
  SET_PAPER_MSG_SELECT_ACTION,
  GET_COUNTY_LIST_ACTION,
  GET_EDITION_LIST_ACTION,
  SET_PAPER_MSG_VALUE_ACTION,
  SET_TEACHING_VERSION_ACTION,
  SET_COURSE_SYSTEM_ACTION,
  GET_TEXTBOOK_EDITION_ACTION,
  SET_AREA_LIST,
  INIT_PROPERTY_ACTION,
  QUERY_NODES_ACTION,
  UPDATE_ONLINE_FLAG,
  GET_PAPER_TYPE,
  SET_PAPER_TYPE,
  GET_PAPER_PURPOSE,
  GET_PAPER_TARGET,
  GET_EP_BU,
  SET_CREATE_PAPER_MSG_ACTION,
  GET_COUNTY_FOR_CREATE_ACTION,
  GET_CITIES_FOR_CREATE_ACTION,
  GET_SUBJECTS_ACTION,
  SET_SELECTED_ROW_KEYS
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
// 设置试卷总数
export function setTotalPapers(val) {
  return {
    type: SET_TOTAL_PAPER_ACTION,
    val
  };
}
// 删除试卷
export function removeOnePaper(onePaper) {
  return {
    type: REMOVE_ONE_PAPER_ACTION,
    onePaper
  };
}
// 设置单张试卷信息
export function setOnePaperContent(item) {
  return {
    type: SET_ONE_PAPER_ACTION,
    item
  };
}
// 试卷数据
export function setPaperList(list) {
  return {
    type: SET_PAPER_LIST_STATE,
    list
  };
}
// 表格数据
export function setTableState(tableState) {
  return {
    type: SET_TABLE_STATE,
    tableState
  };
}
// 查找试卷
export function searchPaper(val) {
  return {
    type: SEARCH_PAPER_ACTION,
    val
  };
}
// 设置试卷属性
export function setPaperProperty(field, val) {
  return {
    type: SET_PAPER_PROPERTY_ACTION,
    field,
    val,
  };
}

// 设置年级
export function setGrade(list) {
  return {
    type: SET_GRADE_ACTION,
    list
  };
}

// SET 学科
export function setSubject(list) {
  return {
    type: SET_SUBJECT_ACTION,
    list
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

// 适用BU
export function getEpBu() {
  return {
    type: GET_EP_BU,
  };
}

export function getPaperTarget() {
  return {
    type: GET_PAPER_TARGET,
  };
}

// 获取所需数据
export function getSelectMsgAction() {
  return {
    type: GET_PAPER_MSG_ACTION,
  };
}

// 设置试卷信息
export function setPaperMsgAction(setType, item) {
  return {
    type: SET_PAPER_MSG_ACTION,
    setType,
    item,
  };
}

export function setCreatePaperMsgAction(setType, item) {
  return {
    type: SET_CREATE_PAPER_MSG_ACTION,
    setType,
    item,
  };
}

export function setPaperMsgSelectAction(setType, num) {
  return {
    type: SET_PAPER_MSG_SELECT_ACTION,
    setType,
    num,
  };
}
export function setPaperMsgValueAction(item) {
  return {
    type: SET_PAPER_MSG_VALUE_ACTION,
    item,
  };
}


// 保存试卷
export function assemleExamPaperAction() {
  return {
    type: ASSEMBLE_EXAM_PAPER_ACTION,
  };
}

// 获取市
export function getCityListAction() {
  return {
    type: GET_CITY_LIST_ACTION,
  };
}
// 获取区县
export function getCountyListAction() {
  return {
    type: GET_COUNTY_LIST_ACTION,
  };
}
// 获取课程体系
export function getEditionAction() {
  return {
    type: GET_EDITION_LIST_ACTION,
  };
}
// 获取教材版本
export function getTextBookEditionAction() {
  return {
    type: GET_TEXTBOOK_EDITION_ACTION,
  };
}
// 设置较长版本
export function setTeachingVersion(item) {
  return {
    type: SET_TEACHING_VERSION_ACTION,
    item
  };
}
// 设置课程体系
export function setCourseSystem(item) {
  return {
    type: SET_COURSE_SYSTEM_ACTION,
    item
  };
}
// 设置地区数据
export function setAreaList(key, data) {
  return {
    type: SET_AREA_LIST,
    key,
    data
  };
}
// 初始化筛选条件
export function initProperty() {
  return {
    type: INIT_PROPERTY_ACTION,
  };
}

// 查询年纪
export function queryNodesAction() {
  return {
    type: QUERY_NODES_ACTION,
  };
}

export function updateOnlineFlag(data) {
  return {
    type: UPDATE_ONLINE_FLAG,
    data,
  };
}

// 获取市
export function getCityListForCreateAction() {
  return {
    type: GET_CITIES_FOR_CREATE_ACTION,
  };
}
// 获取区县
export function getCountyListForCreateAction() {
  return {
    type: GET_COUNTY_FOR_CREATE_ACTION,
  };
}

export function getSubjectsAction(paperTypeId) {
  return {
    type: GET_SUBJECTS_ACTION,
    paperTypeId
  };
}

export function setSelectedRowKeys(list) {
  return {
    type: SET_SELECTED_ROW_KEYS,
    list
  };
}
