/*
 *
 * StudySystemManagement actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_CLASS_TYPE_LIST_ACTION,
  GET_GRADE_LIST_ACTION,
  SET_GRADE_LIST_ACTION,
  SET_GRADE_ACTION,
  GET_GRADE_SUBJECT_LIST_ACTION,
  SET_GRADE_SUBJECT_LIST_ACTION,
  SET_GRADE_SUBJECT_ACTION,
  SET_CLASS_TYPE_LIST_ACTION,
  SET_CLASS_TYPE_ACTION,
  GET_LIST_LEVE_FIRST_ACTION,
  SET_SELECT_PID_ACTION,
  SET_LEVE_FIRST_LIST_ACTION,
  SET_LEVE_FIRST_ID_ACTION,
  GET_SECOND_LEVE_LIST_ACTION,
  SET_LEVE_SECOND_LIST_ACTION,
  SET_LEVE_SECOND_ID_ACTION,
  SET_INPUT_DTO_ACTION,
  SET_ADD_EXIST,
  SET_LEVE_THREE_LIST_ACTION,
  SAVE_ACTION,
  SET_CRUD_ID_ACTION,
  DELETE_ACTION,
  GET_THREE_LEVEL_LIST_ACTION,
  SET_LEVE_THREE_ID_ACTION,
  SORT_ACTION,
  GET_EDITION_LIST_ACTION,
  SET_EDITION_LIST_ACTION,
  SET_EDITION_ACTION
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function getClassTypeListAction() {
  return {
    type: GET_CLASS_TYPE_LIST_ACTION,
  };
}
export function setClaseTypeListAction(classTypeList) {
  return {
    type: SET_CLASS_TYPE_LIST_ACTION,
    classTypeList,
  };
}
export function setClaseTypeAction(classType) {
  return {
    type: SET_CLASS_TYPE_ACTION,
    classType,
  };
}
export function getGradeListAction() {
  return {
    type: GET_GRADE_LIST_ACTION,
  };
}
export function setGradeListAction(gradeList) {
  return {
    type: SET_GRADE_LIST_ACTION,
    gradeList,
  };
}
export function setGradeAction(grade) {
  return {
    type: SET_GRADE_ACTION,
    grade,
  };
}
export function getGradeSubjectListAction() {
  return {
    type: GET_GRADE_SUBJECT_LIST_ACTION,
  };
}
export function setGradeSubjectListAction(gradeSubjectList) {
  return {
    type: SET_GRADE_SUBJECT_LIST_ACTION,
    gradeSubjectList,
  };
}
export function setGradeSubjectAction(gradeSubject) {
  return {
    type: SET_GRADE_SUBJECT_ACTION,
    gradeSubject,
  };
}
export function getListLeveFirstAction() {
  return {
    type: GET_LIST_LEVE_FIRST_ACTION,
  };
}
export function getSecondLevelListAction() {
  return {
    type: GET_SECOND_LEVE_LIST_ACTION,
  };
}
export function getThreeLevelListAction() {
  return {
    type: GET_THREE_LEVEL_LIST_ACTION,
  };
}
export function setSelectPidAction(pid) {
  return {
    type: SET_SELECT_PID_ACTION,
    pid,
  };
}
export function setLeveFirstListAction(item) {
  return {
    type: SET_LEVE_FIRST_LIST_ACTION,
    item,
  };
}
export function setLeveFirstIdAction(id) {
  return {
    type: SET_LEVE_FIRST_ID_ACTION,
    id,
  };
}
export function setLeveThreeIdAction(id) {
  return {
    type: SET_LEVE_THREE_ID_ACTION,
    id,
  };
}
export function setLeveSecondListAction(item) {
  return {
    type: SET_LEVE_SECOND_LIST_ACTION,
    item,
  };
}
export function setLeveThreeListAction(item) {
  return {
    type: SET_LEVE_THREE_LIST_ACTION,
    item,
  };
}
export function setLeveSecondIdAction(id) {
  return {
    type: SET_LEVE_SECOND_ID_ACTION,
    id,
  };
}
export function setInputDtoAction(inputDto) {
  return {
    type: SET_INPUT_DTO_ACTION,
    inputDto,
  };
}
export function setAddExit(addExist) {
  return {
    type: SET_ADD_EXIST,
    addExist,
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

export function getEditionListAction() {
  return {
    type: GET_EDITION_LIST_ACTION,
  };
}

export function setEditionListAction(editionList) {
  return {
    type: SET_EDITION_LIST_ACTION,
    editionList,
  };
}

export function setEditionAction(edition) {
  return {
    type: SET_EDITION_ACTION,
    edition,
  };
}
