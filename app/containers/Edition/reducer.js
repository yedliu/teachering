/*
 *
 * Edition reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  SET_CRUD_ID_ACTION,
  SET_INPUT_DTO_ACTION,
  SET_MODAL_ATTR_ACTION,
  SET_EDITION_ACTION,
  SET_EDITION_LIST_ACTION,
  SET_PHASE_SUBJECT_LIST_ACTION,
  SET_PHASE_SUBJECT_ACTION,
  SET_BU_LIST_ACTION,
  SET_CLASSTYPE_ACTION,
  Added_ACTION,
  SET_EDITIONTYPE_ACTION
} from './constants';

const initialState = fromJS({
  phaseSubjectList: [],
  phaseSubject: { id: 0, name: '' },
  editionList: [],
  edition: { id: 0, name: '' },
  crudId: 0,
  classTypeCode: '',
  editionType: '',
  inputDto: { name: '', phaseSubjectId: 0, classTypeCode: '', sort: 0, state: '' },
  modalAttr: { visible: false, action: '' },
  buList: [],
  state: '' // 上架状态
});

function editionReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_PHASE_SUBJECT_LIST_ACTION:
      return state.set('phaseSubjectList', action.phaseSubjectList);
    case SET_PHASE_SUBJECT_ACTION:
      return state.set('phaseSubject', action.phaseSubject);
    case SET_EDITION_LIST_ACTION :
      return state.set('editionList', action.editionList);
    case SET_EDITION_ACTION :
      return state.set('edition', action.edition);
    case SET_INPUT_DTO_ACTION :
      return state.set('inputDto', action.inputDto);
    case SET_CRUD_ID_ACTION :
      return state.set('crudId', action.crudId);
    case SET_MODAL_ATTR_ACTION :
      return state.set('modalAttr', action.modalAttr);
    case SET_BU_LIST_ACTION :
      return state.set('buList', action.list);
    case SET_CLASSTYPE_ACTION :
      return state.set('classTypeCode', action.code);
    case SET_EDITIONTYPE_ACTION:
      return state.set('editionType', action.code);
    case Added_ACTION:
      return state.set('state', action.value);
    default:
      return state;
  }
}

export default editionReducer;
