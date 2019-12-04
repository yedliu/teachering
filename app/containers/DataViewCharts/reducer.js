/*
 *
 * DataViewCharts reducer
 *
 */

import { fromJS } from 'immutable';

import {
  DEFAULT_ACTION,
  SET_TYPE_LIST_ACTION,
  SET_TYPE_ACTION,
  SET_LIST_ACTION,
  SET_PARAMS_ACTION,
  SET_SEARCH_TYPE_LIST_ACTION,
  SET_SEARCH_TYPE_ACTION,
  } from './constants';

const initialState = fromJS({
  typeList: [],
  type: { id: 1, name: '' }, // 查询类型
  list: [],
  params: { startDate: '', endDate: '', dateTimeType: 4, pageSize: 100, pageIndex: 1 },
  searchTypeList: [],
  searchType: { id: 1, name: '' }, // 查询时间类型
});

export default function (state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_TYPE_LIST_ACTION:
      return state.set('typeList', action.typeList);
    case SET_TYPE_ACTION:
      return state.set('type', action.typeObj);
    case SET_LIST_ACTION:
      return state.set('list', action.list);
    case SET_PARAMS_ACTION:
      return state.set('params', action.params);
    case SET_SEARCH_TYPE_LIST_ACTION:
      return state.set('searchTypeList', action.typeList);
    case SET_SEARCH_TYPE_ACTION:
      console.log(action.typeObj.toJS());
      return state.set('searchType', action.typeObj);
    default:
      return state;
  }
}
