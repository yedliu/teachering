/*
 *
 * Edition actions
 *
 */

import {
  DEFAULT_ACTION,
  DELETE_ACTION,
  GET_EDITION_LIST_ACTION,
  GET_MODAL_ATTR_ACTION,
  SET_CRUD_ID_ACTION,
  SET_EDITION_ACTION,
  SET_EDITION_LIST_ACTION,
  SET_INPUT_DTO_ACTION,
  SET_MODAL_ATTR_ACTION,
  SORT_ACTION,
  SAVE_ACTION,
  GET_PHASE_SUBJECT_LIST_ACTION,
  GET_BU_LIST_ACTION,
  SET_PHASE_SUBJECT_LIST_ACTION,
  SET_PHASE_SUBJECT_ACTION,
  SET_BU_LIST_ACTION,
  GET_EDITION_SEARCH_ACTION,
  SET_CLASSTYPE_ACTION,
  Added_ACTION,
  SET_EDITIONTYPE_ACTION
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

export function setPhaseSubjectAction(phaseSubject) {
  return {
    type: SET_PHASE_SUBJECT_ACTION,
    phaseSubject,
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
export function getBUListAction() {
  return {
    type: GET_BU_LIST_ACTION,
  };
}

export function setBUListAction(list) {
  return {
    type: SET_BU_LIST_ACTION,
    list,
  };
}

export function getEditionSearchAction() {
  return {
    type: GET_EDITION_SEARCH_ACTION,
  };
}

export function setClassTypeCodeAction(code) {
  return {
    type: SET_CLASSTYPE_ACTION,
    code,
  };
}
export function setEditionTypeAction(code) {
  return {
    type: SET_EDITIONTYPE_ACTION,
    code
  };
}
// 上架状态
export function setAddedState(value) {
  return {
    type: Added_ACTION,
    value
  };
}
