/*
 *
 * StandardWagesManagement reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  SET_SELECTLEVELVALUE_ACTION,
  SET_OPERATEMODALOPEN_ACTION,
  SET_SELECTOPERATEITEM_ACTION,
  SET_OPERATEWAGESITEMFIELD_ACTION,
  SET_SUBJECTS_ACTION,
  SET_SELECTSUBJECT_ACTION,
  SET_SALARYCONFIGLIST_ACTION
} from './constants';

const initialState = fromJS({
  SelectLevelValue: 1,
  operateModalOpen: false,
  selectOperateItem: {},
  subjectList: [],
  selectSubject: '',
  salaryConfigList: []
});

function standardWagesManagementReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_SELECTLEVELVALUE_ACTION:
      return state.set('SelectLevelValue', action.val);
    case SET_OPERATEMODALOPEN_ACTION:
      return state.set('operateModalOpen', action.bol);
    case SET_SELECTOPERATEITEM_ACTION:
      return state.set('selectOperateItem', action.item);
    case SET_OPERATEWAGESITEMFIELD_ACTION:
      return state.set(
        'selectOperateItem',
        state.get('selectOperateItem').set(action.field, action.val)
      );
    case SET_SUBJECTS_ACTION:
      return state.set('subjectList', action.list);
    case SET_SELECTSUBJECT_ACTION:
      return state.set('selectSubject', action.val);
    case SET_SALARYCONFIGLIST_ACTION:
      return state.set('salaryConfigList', action.list);
    default:
      return state;
  }
}

export default standardWagesManagementReducer;
