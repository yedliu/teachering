/*
 *
 * Knowledge actions
 *
 */

import {
  DEFAULT_ACTION,
  DELETE_ACTION,
  GET_EXAMPOINT_ACTION,
  GET_PHASE_SUBJECT_ACTION,
  GET_PHASE_SUBJECT_LIST_ACTION,
  GET_SELECTED_KNOWLEDGE_LIST_ACTION,
  SAVE_ACTION,
  SET_CRUD_ID_ACTION,
  SET_CRUD_LEVEL_ACTION,
  SET_INPUT_DTO_ACTION,
  SET_EXAMPOINT_LIST_ACTION,
  SET_PHASE_SUBJECT_ACTION,
  SET_PHASE_SUBJECT_LIST_ACTION,
  SET_SELECTED_EXAMINATIONPOINT_LIST_ACTION,
  SORT_ACTION,
  GET_EXAMINATIONPOINT_LIST_ACTION,
  GET_MODAL_ATTR_ACTION,
  SET_MODAL_ATTR_ACTION
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

export function getExaminationPoint() {
  return {
    type: GET_EXAMINATIONPOINT_LIST_ACTION,
  };
}

export function setExamPointListAction(knowledgeList) {
  return {
    type: SET_EXAMPOINT_LIST_ACTION,
    knowledgeList,
  };
}

export function getSelectedKnowledgeListAction() {
  return {
    type: GET_SELECTED_KNOWLEDGE_LIST_ACTION,
  };
}

export function setSelectedExaminationListAction(selectedExamPoint) {
  return {
    type: SET_SELECTED_EXAMINATIONPOINT_LIST_ACTION,
    selectedExamPoint,
  };
}

export function getExamPointAction() {
  return {
    type: GET_EXAMPOINT_ACTION,
  };
}

// export function setKnowledgeAction(knowledge) {
//   return {
//     type: SET_KNOWLEDGE_ACTION,
//     knowledge,
//   };
// }

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
export function setCurdLevel(level) {
  return {
    type: SET_CRUD_LEVEL_ACTION,
    level
  }
}
