/*
 *
 * TestLessonKnowledge actions
 *
 */

import {
  DEFAULT_ACTION,
  DELETE_ACTION,
  GET_GRADE_LIST_ACTION, GET_MODAL_ATTR_ACTION, GET_PHASE_LIST_ACTION,
  GET_SUBJECT_LIST_ACTION,
  GET_TEST_LESSON_KNOWLEDGE_LIST_ACTION,
  SAVE_ACTION,
  SET_CRUD_ID_ACTION,
  SET_GRADE_ACTION,
  SET_GRADE_LIST_ACTION,
  SET_INPUT_DTO_ACTION, SET_MODAL_ATTR_ACTION, SET_PHASE_ACTION, SET_PHASE_LIST_ACTION,
  SET_SUBJECT_ACTION,
  SET_SUBJECT_LIST_ACTION,
  SET_TEST_LESSON_KNOWLEDGE_ACTION,
  SET_TEST_LESSON_KNOWLEDGE_LIST_ACTION,
  SORT_ACTION,
  SET_BU_ACTION,
  GET_CLASSTYPE_LIST_ACTION,
  SET_CLASSTYPE_LIST_ACTION,
  GET_TEXTBOOK_EDITION_LIST_ACTION,
  SET_TEXTBOOK_EDITION_LIST_ACTION,
  SET_TEXTBOOK_EDITION_ACTION,
  UPDATE_HOT,
  UPDATE_LOADING
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getPhaseListAction() {
  return {
    type: GET_PHASE_LIST_ACTION,
  };
}

export function getClassTypeListAction() {
  return {
    type: GET_CLASSTYPE_LIST_ACTION,
  };
}

export function setPhaseListAction(phaseList) {
  return {
    type: SET_PHASE_LIST_ACTION,
    phaseList,
  };
}

export function setClassTypeListAction(classTypeList) {
  return {
    type: SET_CLASSTYPE_LIST_ACTION,
    classTypeList,
  };
}

export function setPhaseAction(phase) {
  return {
    type: SET_PHASE_ACTION,
    phase,
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
export function setBuAction(bu) {
  return {
    type: SET_BU_ACTION,
    bu,
  };
}

export function getSubjectListAction() {
  return {
    type: GET_SUBJECT_LIST_ACTION,
  };
}

export function setSubjectListAction(subjectList) {
  return {
    type: SET_SUBJECT_LIST_ACTION,
    subjectList,
  };
}

export function setSubjectAction(subject) {
  return {
    type: SET_SUBJECT_ACTION,
    subject,
  };
}

export function getTestLessonKnowledgeListAction() {
  return {
    type: GET_TEST_LESSON_KNOWLEDGE_LIST_ACTION,
  };
}

export function setTestLessonKnowledgeListAction(testLessonKnowledgeList) {
  return {
    type: SET_TEST_LESSON_KNOWLEDGE_LIST_ACTION,
    testLessonKnowledgeList,
  };
}

export function setTestLessonKnowledgeAction(testLessonKnowledge) {
  return {
    type: SET_TEST_LESSON_KNOWLEDGE_ACTION,
    testLessonKnowledge,
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

export function getModalAttrAction() {
  return {
    type: GET_MODAL_ATTR_ACTION,
  };
}

export function setModalAttrAction(modalAttr) {
  return {
    type: SET_MODAL_ATTR_ACTION,
    modalAttr,
  };
}

export function getTextbookEditionListAction() {
  return {
    type: GET_TEXTBOOK_EDITION_LIST_ACTION,
  };
}

export function setTextbookEditionListAction(textbookEditionList) {
  return {
    type: SET_TEXTBOOK_EDITION_LIST_ACTION,
    textbookEditionList,
  };
}

export function setTextbookEditionAction(textbookEdition) {
  return {
    type: SET_TEXTBOOK_EDITION_ACTION,
    textbookEdition,
  };
}

export function updateHot(id, isHot) {
  return {
    type: UPDATE_HOT,
    id,
    isHot,
  };
}

export function updateLoading(loading) {
  return {
    type: UPDATE_LOADING,
    loading
  };
}
