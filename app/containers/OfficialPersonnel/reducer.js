/*
 *
 * OfficialPersonnel reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  SET_MODAL_ACTION,
  SET_INPUTDTO,
  SET_PAGEINATION_ACTION,
  SET_TABLE_DATA,
  SET_AUTHORITY_LIST,
  SET_ROLE_LIST,
  SET_QUERY_PARAMS,
  SET_EDIT_ID,
  SET_ADDING_MODE,
} from './constants';

const initialState = fromJS({
  modal: false,
  add: false,
  editId: '',
  data: [],
  authority: [],
  allRoles: [],
  pagination: {
    pageSize: 20,
    current: 1,
    loading: true
  },
  loading: false,
  queryParam: {},
  inputDTO: {
    name: { value: '' },
    mobile: { value: '' },
    roleIdList: { value: '-1' },
    phaseSubjectIdList: { value: [], name: 'phaseSubjectIdList' },
  },
});

function officialPersonnelReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_MODAL_ACTION:
      return state.set('modal', action.boolean);
    case SET_INPUTDTO:
      return state.set('inputDTO', action.data);
    case SET_PAGEINATION_ACTION:
      return state.set('pagination', action.data);
    case SET_TABLE_DATA:
      return state.set('data', action.data);
    case SET_AUTHORITY_LIST:
      return state.set('authority', action.data);
    case SET_ROLE_LIST:
      return state.set('allRoles', action.data);
    case SET_QUERY_PARAMS:
      return state.set('queryParam', action.data);
    case SET_EDIT_ID:
      return state.set('editId', action.id);
    case SET_ADDING_MODE:
      return state.set('add', action.bool);
    default:
      return state;
  }
}

export default officialPersonnelReducer;
