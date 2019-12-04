/*
 *
 * DataView reducer
 *
 */

import { fromJS } from 'immutable';

import {
  DEFAULT_ACTION,
  SET_TYPE_LIST_ACTION,
  SET_TYPE_ACTION,
  SET_LIST_ACTION,
  SET_PARAMS_ACTION,
  SET_SHOW_OR_HIDE_ACTION,
  SET_SELECT_LESSON_TYPE,
  SET_LESSON_LIST_ACTION,
  } from './constants';

const initialState = fromJS({
  typeList: [],
  type: { id: 1, name: '' }, // 查询类型
  list: [],
  params: { startDate: '', endDate: '', dateTimeType: 4, pageSize: 1000, pageIndex: 1 },
  showorhide: false,
  selectedlessontype: { id: 1, name: '' },
  lessonlist: [],
});

export default function (state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_TYPE_LIST_ACTION:
      return state.set('typeList', action.typeList);
    case SET_LESSON_LIST_ACTION:
      return state.set('lessonlist', action.item);
    case SET_TYPE_ACTION:
      return state.set('type', action.typeObj);
    case SET_LIST_ACTION:
      return state.set('list', action.list);
    case SET_PARAMS_ACTION:
      return state.set('params', action.params);
    case SET_SHOW_OR_HIDE_ACTION:
      return state.set('showorhide', action.bool);
    case SET_SELECT_LESSON_TYPE:
      return state.set('selectedlessontype', action.item);
    default:
      return state;
  }
}
