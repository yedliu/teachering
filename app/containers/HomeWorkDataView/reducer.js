/*
 *
 * HomeWorkDataView reducer
 *
 */

import { fromJS } from 'immutable';
import moment from 'moment';
import {
  DEFAULT_ACTION,
  SET_REPORTLIST_ACTION,
  SET_SUBJECT_LIST_ACTION,
  SET_SELECT_DATA_RANGE_ACTION,
  SET_SEARCHFIELDVALUE_ACTION,
  SET_LOADINGSTATE_ACTION,
} from './constants';

const endDate = moment();
const startDate = moment().subtract(7, 'days');
const initialState = fromJS({
  list: [],
  subjectList: [],
  selectedDateRange: [startDate, endDate],
  searchItem: {},
  loading: false,
});

function homeWorkDataViewReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_LOADINGSTATE_ACTION:
      return state.set('loading', action.bol);
    case SET_REPORTLIST_ACTION:
      return state.set('list', action.list);
    case SET_SUBJECT_LIST_ACTION:
      return state.set('subjectList', action.list);
    case SET_SELECT_DATA_RANGE_ACTION:
      return state.set('selectedDateRange', action.range);
    case SET_SEARCHFIELDVALUE_ACTION:
      return state.set('searchItem', state.get('searchItem').setIn([action.field], action.value));
    default:
      return state;
  }
}

export default homeWorkDataViewReducer;
