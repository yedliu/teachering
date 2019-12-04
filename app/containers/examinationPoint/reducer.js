/*
 *
 * Knowledge reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  SET_PHASE_SUBJECT_LIST_ACTION,
  SET_PHASE_SUBJECT_ACTION,
  SET_EXAMPOINT_LIST_ACTION,
  SET_INPUT_DTO_ACTION,
  SET_CRUD_ID_ACTION, SET_SELECTED_EXAMINATIONPOINT_LIST_ACTION,
  SET_MODAL_ATTR_ACTION,
  SET_CRUD_LEVEL_ACTION
} from './constants';

const initialState = fromJS({
  phaseSubjectList: [],
  phaseSubject: { id: 0, name: '' },//年级科目
  examPointList: [],
  selectedExamPointList: [],
  crudId: 0,
  cruLevel: 0,
  inputDto: { level: 0, index: 0, name: '', phaseSubjectId: 0, comprehensiveDegree: 0, examFrequency: 0, id: 0, labelList: [], sceneList: [], sort: 0 },
  modalAttr: { visible: false, action: '' },
});

function examinationPointReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_PHASE_SUBJECT_LIST_ACTION:
      return state.set('phaseSubjectList', action.phaseSubjectList);
    case SET_PHASE_SUBJECT_ACTION:
      return state.set('phaseSubject', action.phaseSubject);
    case SET_EXAMPOINT_LIST_ACTION:
      return state.set('examPointList', action.knowledgeList);
    case SET_SELECTED_EXAMINATIONPOINT_LIST_ACTION:
      console.log('selectedExamPointList', action.selectedExamPoint.toJS())
      return state.set('selectedExamPointList', action.selectedExamPoint);
    case SET_INPUT_DTO_ACTION:
      return state.set('inputDto', action.inputDto);
    case SET_CRUD_ID_ACTION:
      return state.set('crudId', action.crudId);
    case SET_CRUD_LEVEL_ACTION:
      return state.set('crudLevel', action.level);
    case SET_MODAL_ATTR_ACTION:
      return state.set('modalAttr', action.modalAttr);
    default:
      return state;
  }
}

export default examinationPointReducer;
