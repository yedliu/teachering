/*
 *
 * QuestionManagement actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_PHASE_SUBJECT_LIST_ACTION,
  SET_PHASE_SUBJECT_LIST_ACTION,
  GET_GRADE_LIST_ACTION,
  SET_PHASE_SUBJECT_ACTION,
  SET_SELECTED_TYPE_ACTION,
  GET_EXAM_POINT_ACTION,
  GET_KNOWNLEDGE_ACTION,
  SET_SELECTED_TREE_ITEM,
  SET_KNOWLEDGE_LIST_ACTION,
  SET_FILTER_FIELDS,
  SEARCH_QUESTIONS_ACTION,
  GET_QUESTIONS_TYPE_ACTION,
  SET_CUR_FILTER_FIELDS_ACTION,
  SET_ORDER_PARAMS_ACTION,
  GET_PROVINCE_ACTION,
  SET_PROVINCE_ACTION,
  GET_CITIES_ACTION,
  SET_CITY_ACTION,
  GET_DISTRICT_ACTION,
  SET_DISTRICT_ACTION,
  SET_QUESTION_DATA_ACTION,
  ADD_HOMEWORK_QUESTION_ACTION,
  REMOVE_HOMEWORK_QUESTION_ACTION,
  SET_PAPER_CONTENT_LIST_ACTION,
  ASSEMBLE_EXAM_PAPER_ACTION,
  SET_PAPER_PROPERTY_ACTION,
  GET_GRADE_ACTION,
  SET_GRADE_ACTION,
  GET_SUBJECT_ACTION,
  SET_SUBJECT_ACTION,
  SET_PAGE_STATE_ACTION,
  SET_TOTAL_QUESTION_ACTION,
  SET_REDUCER_INITAL,
  SET_QUESTION_PAGE_INDEX,
  GET_USER_BY_ID,
  SET_USER_MAP,
  SET_PAPER_PROPERTIES_ACTION,
  CHANGE_COLLEGE_EXAMPAPER_ACTION,
  SET_SEARCH_DATA_ACTION,
  DELETE_QUESTION_ACTION,
  SET_QUESTION_PAGE_SIZE,
  SET_PAPER_TYPE_ACTION,
  GET_PAPER_TYPE_ACTION,
  UPDATE_HOMEWORK_QUESTION_ACTION,
  SET_HW_QUESTION_ACTION,
  GET_ALL_CHOOSEQUESTION_RULE,
  SET_ALL_CHOOSEQUESTION_RULE,
  SET_KNOWLEDGEIDS,
  SET_GRADE_SUBJECT,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
// set用户信息
export function setUserMap(id, name) {
  return {
    type: SET_USER_MAP,
    id,
    name
  };
}
export function getUserById(val) {
  return {
    type: GET_USER_BY_ID,
    val
  };
}
// 初始化reducer
export function setReducerInital() {
  return {
    type: SET_REDUCER_INITAL,
  };
}
// 总数
export function setTotalQuestion(val) {
  return {
    type: SET_TOTAL_QUESTION_ACTION,
    val
  };
}
// 页面状态
export function setPageState(key, val) {
  return {
    type: SET_PAGE_STATE_ACTION,
    key,
    val
  };
}
// SET 学科
export function setSubject(list) {
  return {
    type: SET_SUBJECT_ACTION,
    list
  };
}
// 获取学科
export function getSubject() {
  return {
    type: GET_SUBJECT_ACTION,
  };
}
// 设置年级
export function setGrade(list) {
  return {
    type: SET_GRADE_ACTION,
    list
  };
}
// 获取年级
export function getGrade() {
  return {
    type: GET_GRADE_ACTION,
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
// 发布试卷
export function assembleExamPaper(submitFlag, MentalityData, paperType, setPaperEditModalState) {
  return {
    type: ASSEMBLE_EXAM_PAPER_ACTION,
    submitFlag,
    MentalityData,
    paperType, // 试卷类型
    setPaperEditModalState, // 执行完的回调关闭弹框
  };
}
// set试卷content list
export function setPaperContentList(list) {
  return {
    type: SET_PAPER_CONTENT_LIST_ACTION,
    list,
  };
}
// 移出作业篮
export function removeHomeWorkQuestionAction(item, isRemoveBig) {
  return {
    type: REMOVE_HOMEWORK_QUESTION_ACTION,
    item,
    isRemoveBig
  };
}
// 加入试题篮
export function addHomeWorkQuestionAction(item) {
  return {
    type: ADD_HOMEWORK_QUESTION_ACTION,
    item,
  };
}
// 更新试卷篮
export function updateHomeWorkQuestionAction(item) {
  return {
    type: UPDATE_HOMEWORK_QUESTION_ACTION,
    item,
  };
}

// set 题目数据
export function setQuestionData(list) {
  return {
    type: SET_QUESTION_DATA_ACTION,
    list
  };
}
// set 区县
export function setDistrictAction(list) {
  return {
    type: SET_DISTRICT_ACTION,
    list
  };
}
// 查询区县
export function getDistrict() {
  return {
    type: GET_DISTRICT_ACTION,
  };
}
// set城市
export function setCityAction(list) {
  return {
    type: SET_CITY_ACTION,
    list
  };
}
// 获取城市
export function getCities() {
  return {
    type: GET_CITIES_ACTION,
  };
}
// 设置省份
export function setProvinceAction(list) {
  return {
    type: SET_PROVINCE_ACTION,
    list
  };
}
// 获取省份
export function getProvince() {
  return {
    type: GET_PROVINCE_ACTION,
  };
}
// 设置当前删选条件
export function setCurFilterFields(key, val) {
  return {
    type: SET_CUR_FILTER_FIELDS_ACTION,
    key,
    val
  };
}
// 设置排序筛选条件
export function setOrderParams(key, val) {
  return {
    type: SET_ORDER_PARAMS_ACTION,
    key,
    val
  };
}

// 获得题型
export function getQuestionType() {
  return {
    type: GET_QUESTIONS_TYPE_ACTION,
  };
}

// 正式查询
export function searchQuestions() {
  return {
    type: SEARCH_QUESTIONS_ACTION,
  };
}

// set筛选条件
export function setFilterFields(key, list) {
  return {
    type: SET_FILTER_FIELDS,
    key,
    list
  };
}

// set科目列表
export function setKnownLedgeList(list) {
  return {
    type: SET_KNOWLEDGE_LIST_ACTION,
    list
  };
}

// 获取考点列表
export function getExamPointList() {
  return {
    type: GET_EXAM_POINT_ACTION,
  };
}

// 获取知识点列表
export function getKnownLedgeList() {
  return {
    type: GET_KNOWNLEDGE_ACTION,
  };
}

export function getPhaseSubjectListAction() {
  return {
    type: GET_PHASE_SUBJECT_LIST_ACTION,
  };
}

// set每页显示
export function setPageSize(item) {
  return {
    type: SET_QUESTION_PAGE_SIZE,
    item
  };
}
// set页数
export function setPageIndex(val) {
  return {
    type: SET_QUESTION_PAGE_INDEX,
    val
  };
}

export function setPhaseSubjectListAction(phaseSubjectList) {
  return {
    type: SET_PHASE_SUBJECT_LIST_ACTION,
    phaseSubjectList,
  };
}

export function getGradeListAction() {
  return {
    type: GET_GRADE_LIST_ACTION
  };
}

export function setPhaseSubjectAction(phaseSubject) {
  return {
    type: SET_PHASE_SUBJECT_ACTION,
    phaseSubject,
  };
}

export function setSelectedTypeAction(selectedType) {
  return {
    type: SET_SELECTED_TYPE_ACTION,
    selectedType,
  };
}

export function setSelectedTreeItem(item) {
  return {
    type: SET_SELECTED_TREE_ITEM,
    item,
  };
}
export function setPaperPropertiesAction(item) {
  return {
    type: SET_PAPER_PROPERTIES_ACTION,
    item,
  };
}
export function changeIsCollegeEnteranceExamPaperAction(bool) {
  return {
    type: CHANGE_COLLEGE_EXAMPAPER_ACTION,
    bool,
  };
}
export function setSearchDataAction(item) {
  return {
    type: SET_SEARCH_DATA_ACTION,
    item,
  };
}
export function deleteQuestionAction(id) {
  return {
    type: DELETE_QUESTION_ACTION,
    id,
  };
}
export function setPaperType(list) {
  return {
    type: SET_PAPER_TYPE_ACTION,
    list
  };
}

export function getPaperType() {
  return {
    type: GET_PAPER_TYPE_ACTION,
  };
}

export function getAllChooseQuestionRuleAction() {
  return {
    type: GET_ALL_CHOOSEQUESTION_RULE,
  };
}
export function setChooseQuestionRuleAction(data) {
  return {
    type: SET_ALL_CHOOSEQUESTION_RULE,
    data,
  };
}
export function setHwQuestionAndPaperAction(data, showSort) {
  return {
    type: SET_HW_QUESTION_ACTION,
    sort: showSort,
    data,
  };
}

export function setKnowledgeIds(knowledgeIds) {
  return {
    type: SET_KNOWLEDGEIDS,
    knowledgeIds
  };
}

export function setGradeSubjectAction(gradeSubject) {
  return {
    type: SET_GRADE_SUBJECT,
    gradeSubject,
  };
}

