/*
 *
 * StandardWagesDataWrapper reducer
 *
 */

import { fromJS } from 'immutable';
import moment from 'moment';
import {
  DEFAULT_ACTION,
  SET_SELECTDATE_ACTION,
  SET_SEARCHMOBILE_ACTION,
  SET_SEARCHNAMEVALUE_ACTION,
  SET_SALARYDATE_ACTION,
  SET_TOTALCOUNT_ACTION,
  SET_CURRENTPAGENUMBER_ACTION,
  SET_LOADINGSTATE_ACTION,
  SET_SHOWDATAMODALOPEN_ACTION,
  SET_SELECTDALARYITEM_ACTION,
  HANDLE_SELECTED_ACTION,
  SET_SALARY_DETAIL_ACTION,
  SET_PERSONAL_MSG_ACTION
} from './constants';

const initialState = fromJS({
  selectDate: moment().add(-1, 'month'),
  searchMobileValue: '',
  searchNameValue: '',
  salaryData: {},
  totalCount: 0,
  currentPageNumber: 1,
  loading: false,
  dataModalOpen: { isOpen: false, title: '', tag: 1 },
  selectSalaryItem: {},
  selectSalaryDetail: {},
  selecteddata: {
    startDate: '',
    endDate: ''
  },
  personalTableMsg: {
    total: 0,
    currentPageNumber: 1,
    size: 10,
    workerUserId: 0
  }
});

function standardWagesDataWrapperReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_SELECTDATE_ACTION:
      return state.set('selectDate', action.date);
    case SET_SEARCHMOBILE_ACTION:
      return state.set('searchMobileValue', action.val);
    case SET_SEARCHNAMEVALUE_ACTION:
      return state.set('searchNameValue', action.val);
    case SET_SALARYDATE_ACTION:
      return state.set('salaryData', action.item);
    case SET_TOTALCOUNT_ACTION:
      return state.set('totalCount', action.num);
    case SET_CURRENTPAGENUMBER_ACTION:
      return state.set('currentPageNumber', action.num);
    case SET_LOADINGSTATE_ACTION:
      return state.set('loading', action.bol);
    case SET_SHOWDATAMODALOPEN_ACTION:
      return state.set('dataModalOpen', action.obj);
    case SET_SELECTDALARYITEM_ACTION:
      return state.set('selectSalaryItem', action.item);
    case SET_SALARY_DETAIL_ACTION:
      return state.set('selectSalaryDetail', action.item);
    case HANDLE_SELECTED_ACTION:
      return state.setIn(['selecteddata', action.ty], action.val);
    case SET_PERSONAL_MSG_ACTION:
      return state.set('personalTableMsg', action.item);
    default:
      return state;
  }
}

export default standardWagesDataWrapperReducer;
