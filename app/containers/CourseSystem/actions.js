/*
 *
 * AppHeader actions
 *
 */

import {
  DEFAULT_ACTION,
  DELETE_ACTION,
  GET_CLASS_TYPE_ACTION,
  GET_COURSE_CONTENT_ACTION,
  GET_COURSE_MODULE_ACTION,
  GET_COURSE_TYPE_ACTION,
  GET_EDITION_ACTION,
  GET_GRADE_ACTION,
  GET_SUBJECT_ACTION,
  SAVE_ACTION,
  SET_CLASS_TYPE_ID_ACTION, SET_CLASS_TYPE_LIST_ACTION,
  SET_COURSE_CONTENT_ID_ACTION, SET_COURSE_CONTENT_LIST_ACTION,
  SET_COURSE_MODULE_ID_ACTION, SET_COURSE_MODULE_LIST_ACTION,
  SET_COURSE_TYPE_ID_ACTION, SET_COURSE_TYPE_LIST_ACTION,
  SET_CRUD_ID_ACTION,
  SET_EDITION_ID_ACTION, SET_EDITION_LIST_ACTION,
  SET_GRADE_ID_ACTION, SET_GRADE_LIST_ACTION,
  SET_INPUT_DTO_ACTION,
  SET_SUBJECT_ID_ACTION, SET_SUBJECT_LIST_ACTION, SORT_ACTION, SET_ADD_EXIST,
  SET_MODAL_ATTR_ACTION,
  TO_GET_KNOWLEDGE,
  SET_KNOWLEDGE_LIST,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getGradeAction() {
  return {
    type: GET_GRADE_ACTION,
  };
}

export function setGradeListAction(gradeList) {
  return {
    type: SET_GRADE_LIST_ACTION,
    gradeList,
  };
}

export function setGradeIdAction(gradeId) {
  return {
    type: SET_GRADE_ID_ACTION,
    gradeId,
  };
}

export function getSubjectAction() {
  return {
    type: GET_SUBJECT_ACTION,
  };
}

export function setSubjectListAction(subjectList) {
  return {
    type: SET_SUBJECT_LIST_ACTION,
    subjectList,
  };
}

export function setSubjectIdAction(subjectId) {
  return {
    type: SET_SUBJECT_ID_ACTION,
    subjectId,
  };
}

export function getEditionAction() {
  return {
    type: GET_EDITION_ACTION,
  };
}

export function setEditionListAction(editionList) {
  return {
    type: SET_EDITION_LIST_ACTION,
    editionList,
  };
}

export function setEditionIdAction(editionId) {
  return {
    type: SET_EDITION_ID_ACTION,
    editionId,
  };
}

export function getClassTypeAction() {
  return {
    type: GET_CLASS_TYPE_ACTION,
  };
}

export function setClassTypeListAction(classTypeList) {
  return {
    type: SET_CLASS_TYPE_LIST_ACTION,
    classTypeList,
  };
}

export function setClassTypeIdAction(classTypeId) {
  return {
    type: SET_CLASS_TYPE_ID_ACTION,
    classTypeId,
  };
}

export function getCourseTypeAction() {
  return {
    type: GET_COURSE_TYPE_ACTION,
  };
}

export function setCourseTypeListAction(courseTypeList) {
  return {
    type: SET_COURSE_TYPE_LIST_ACTION,
    courseTypeList,
  };
}

export function setCourseTypeIdAction(courseTypeId) {
  return {
    type: SET_COURSE_TYPE_ID_ACTION,
    courseTypeId,
  };
}

export function getCourseModuleAction() {
  return {
    type: GET_COURSE_MODULE_ACTION,
  };
}

export function setCourseModuleListAction(courseModuleList) {
  return {
    type: SET_COURSE_MODULE_LIST_ACTION,
    courseModuleList,
  };
}

export function setCourseModuleIdAction(courseModuleId) {
  return {
    type: SET_COURSE_MODULE_ID_ACTION,
    courseModuleId,
  };
}

export function getCourseContentAction() {
  return {
    type: GET_COURSE_CONTENT_ACTION,
  };
}

export function setCourseContentListAction(courseContentList) {
  return {
    type: SET_COURSE_CONTENT_LIST_ACTION,
    courseContentList,
  };
}

export function setCourseContentIdAction(courseContentId) {
  return {
    type: SET_COURSE_CONTENT_ID_ACTION,
    courseContentId,
  };
}

export function setInputDtoAction(inputDto) {
  return {
    type: SET_INPUT_DTO_ACTION,
    inputDto,
  };
}

export function saveAction() {
  return {
    type: SAVE_ACTION,
  };
}

export function setCrudIdAction(crudId) {
  return {
    type: SET_CRUD_ID_ACTION,
    crudId,
  };
}

export function deleteAction() {
  return {
    type: DELETE_ACTION,
  };
}

export function sortAction() {
  return {
    type: SORT_ACTION,
  };
}
export function setAddExit(addExist) {
  return {
    type: SET_ADD_EXIST,
    addExist,
  };
}
export function setModalAttrAction(modalAttr) {
  return {
    type: SET_MODAL_ATTR_ACTION,
    modalAttr,
  };
}

export function getknowledgeTreeAction() {
  return {
    type: TO_GET_KNOWLEDGE,
  };
}

export function setKnowLedgeList(list) {
  return {
    type: SET_KNOWLEDGE_LIST,
    list,
  };
}
