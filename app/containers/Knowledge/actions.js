/*
 *
 * Knowledge actions
 *
 */

import {
  DEFAULT_ACTION,
  DELETE_ACTION,
  GET_KNOWLEDGE_ACTION,
  GET_KNOWLEDGE_LIST_ACTION,
  GET_MODAL_ATTR_ACTION,
  GET_PHASE_SUBJECT_ACTION,
  GET_PHASE_SUBJECT_LIST_ACTION,
  GET_SELECTED_KNOWLEDGE_LIST_ACTION,
  SAVE_ACTION,
  SET_CRUD_ID_ACTION,
  SET_INPUT_DTO_ACTION,
  // SET_KNOWLEDGE_ACTION,
  SET_KNOWLEDGE_LIST_ACTION,
  SET_MODAL_ATTR_ACTION,
  SET_PHASE_SUBJECT_ACTION,
  SET_PHASE_SUBJECT_LIST_ACTION,
  SET_SELECTED_KNOWLEDGE_LIST_ACTION,
  SORT_ACTION,
  SET_ORIGIN_KNOWLEDGE_ACTION,
  GET_ORIGIN_KNOWLEDGE_ACTION,
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

export function getKnowledgeListAction() {
  return {
    type: GET_KNOWLEDGE_LIST_ACTION,
  };
}

export function setKnowledgeListAction(knowledgeList) {
  return {
    type: SET_KNOWLEDGE_LIST_ACTION,
    knowledgeList,
  };
}

export function getSelectedKnowledgeListAction() {
  return {
    type: GET_SELECTED_KNOWLEDGE_LIST_ACTION,
  };
}

export function setSelectedKnowledgeListAction(selectedKnowledgeList) {
  return {
    type: SET_SELECTED_KNOWLEDGE_LIST_ACTION,
    selectedKnowledgeList,
  };
}

export function getKnowledgeAction(id) {
  return {
    type: GET_KNOWLEDGE_ACTION,
    id,
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

export function saveAction(Knowledge, CopyWriting) {
  return {
    type: SAVE_ACTION,
    Knowledge,
    CopyWriting
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

export function getOriginKnowledgeListAction() {
  return {
    type: GET_ORIGIN_KNOWLEDGE_ACTION,
  };
}

export function setOriginKnowledgeList(list) {
  return {
    type: SET_ORIGIN_KNOWLEDGE_ACTION,
    list,
  };
}
