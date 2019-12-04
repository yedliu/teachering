/*
 *
 * Knowledge reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  SET_CRUD_ID_ACTION,
  SET_INPUT_DTO_ACTION,
  // SET_KNOWLEDGE_ACTION,
  SET_KNOWLEDGE_LIST_ACTION,
  SET_MODAL_ATTR_ACTION,
  SET_PHASE_SUBJECT_ACTION,
  SET_PHASE_SUBJECT_LIST_ACTION,
  SET_SELECTED_KNOWLEDGE_LIST_ACTION,
  SET_ORIGIN_KNOWLEDGE_ACTION,
} from './constants';

const initialState = fromJS({
  phaseSubjectList: [],
  phaseSubject: { id: 0, name: '' },
  knowledgeList: [],
  selectedKnowledgeList: [],
  // knowledge: { id: 0, name: '' },
  crudId: 0,
  inputDto: { level: 0, index: 0, name: '', phaseSubjectId: 0, comprehensiveDegree: 0, examFrequency: 0, id: 0, labelList: [], sceneList: [], sort: 0 },
  modalAttr: { visible: false, action: '' },
  originKnowledgeList: [],
});

function knowledgeReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_PHASE_SUBJECT_LIST_ACTION:
      return state.set('phaseSubjectList', action.phaseSubjectList);
    case SET_PHASE_SUBJECT_ACTION:
      return state.set('phaseSubject', action.phaseSubject);
    case SET_KNOWLEDGE_LIST_ACTION :
      return state.set('knowledgeList', action.knowledgeList);
    case SET_SELECTED_KNOWLEDGE_LIST_ACTION :
      return state.set('selectedKnowledgeList', action.selectedKnowledgeList);
    // case SET_KNOWLEDGE_ACTION :
    //   return state.set('knowledge', action.knowledge);
    case SET_INPUT_DTO_ACTION :
      return state.set('inputDto', action.inputDto);
    case SET_CRUD_ID_ACTION :
      return state.set('crudId', action.crudId);
    case SET_MODAL_ATTR_ACTION:
      return state.set('modalAttr', action.modalAttr);
    case SET_ORIGIN_KNOWLEDGE_ACTION:
      return state.set('originKnowledgeList', action.list);
    default:
      return state;
  }
}

export default knowledgeReducer;
