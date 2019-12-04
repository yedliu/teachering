/*
 *
 * ErrorCorrectManagement reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  INIT_ACTION,
  SET_PHASE_LIST,
  SET_SUBJECT_LIST,
  SET_SELECT_FILTER,
  INIT_SELECT_FILTER,
  SET_QUESTION_STATISTICS,
  CHANGE_PAGE_STATE,
  SET_QUESTION_LIST,
  SET_PERMISSIONSUBJECTS_LIST,
  SET_SOURCE_LIST,
  SET_ROLE_LIST,
} from './constants';

// hasAll是否有全部选项
const strToObj = (list, hasAll) => {
  let objList = [];
  if (hasAll) {
    objList.push({ value: '-1', label: '全部' });
  }
  // eslint-disable-next-line array-callback-return
  list.map((str, index) => {
    objList.push({ value: String(index + 1), label: str });
  });
  return objList;
};

const initialState = fromJS({
  filterList: [
    { key: 'status', name: '状态', values: strToObj(['未处理', '已处理']) },
    // {key: 'subjects', name: '学科' , values: []},
    // {key: 'phase', name: '学段', values: []},
    { key: 'permissionSubjects', name: '科目', values: [] },
    { key: 'errorTypes', name: '错误类型', values: strToObj(['题干错误', '答案错误', '解析错误', '知识体系不符', '图片或格式问题', '其他'], true) },
    { key: 'source', name: '来源', values: [] },
    { key: 'role', name: '用户角色', values: [] }
  ],
  selectFilter: {
    status: '1',
    errorTypes: '-1',
    phase: '',
    subjects: '',
    source: '-1',
    role: '-1',
    permissionSubjects: '-1',
    name: '',
    adoptStats: '2',
    startTime: null, // 处理起始时间
    endTime: null, // 处理结束时间
    correctionId: -1,
    examPaperId: null, // 试卷ID
  },
  questionStatistics: {},
  pageState: {
    isLoading: true,
    curQuestionLiading: '', // 局部刷新题目loading
    curCorrentionLoading: '', // 局部刷新纠错信息loading
    pageIndex: 1,
    pageSize: 20
  },
  questionList: [],
});

function errorCorrectManagementReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_ACTION:
      return initialState;
    case DEFAULT_ACTION:
      return state;
    case CHANGE_PAGE_STATE:
      return state.setIn(['pageState', action.key], action.value);
    case INIT_SELECT_FILTER:
      return state.set('selectFilter', initialState.get('selectFilter').set('status', state.getIn(['selectFilter', 'status'])));
    case SET_SUBJECT_LIST:
      return state.setIn(['filterList', 1, 'values'], action.list);
    case SET_PHASE_LIST:
      return state.setIn(['filterList', 2, 'values'], action.list);
    case SET_PERMISSIONSUBJECTS_LIST:
      return state.setIn(['filterList', 1, 'values'], action.list);
    case SET_SELECT_FILTER:
      return state.setIn(['selectFilter', action.key], action.value);
    case SET_QUESTION_STATISTICS:
      return state.set('questionStatistics', action.item);
    case SET_QUESTION_LIST:
      return state.set('questionList', action.list);
    case SET_SOURCE_LIST:
      return state.setIn(['filterList', 3, 'values'], action.list);
    case SET_ROLE_LIST:
      return state.setIn(['filterList', 4, 'values'], action.list);
    default:
      return state;
  }
}

export default errorCorrectManagementReducer;
