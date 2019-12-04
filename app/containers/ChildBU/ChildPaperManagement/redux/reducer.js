import { fromJS } from 'immutable';
import * as contants from './contants';

const initState = fromJS({
  dataList: {
    gradeList: [], // 年级
    yearList: [], // 年份
    paperTypeList: [], // 试卷类型
    subjectList: [],
    paperDifficulty: [], // 试卷难度
    stateList: [], // 上下架状态
    courseSystemList: [],
  },
  searchParams: { // 搜索试卷列表的参数
    pageIndex: 1,
    pageSize: 10,
    sort: 1,
  },
  currentPage: 'home',
  paperListLoading: false, // 试卷列表 Table loading
  paperListTotal: 0, // 试卷总数
  paperListData: [], // 试卷列表数据
  showAddQuestion: false, // 单题录入弹框的显示隐藏
  errorMessage: {}, // 试卷编辑页校验的错误信息
  preview: false, // 预览弹框显示隐藏
  spinning: false, // Spin 显示隐藏
  paperParams: {
    typeId: '1',
    difficulty: '2',
  }, // 试卷的基本信息
  paperData: [], // 试卷题目的数据
  selectedId: '', // 试卷编辑页选中的题目
  editScoreData: { // 设置题目的分数
    visible: false,
    ids: [],
    score: 0,
    isBatch: false,
  }
});

export default function reducer(state = initState, action) {
  switch (action.type) {
    case contants.CHANGE_PAGE:
      return state.set('currentPage', action.data);
    case contants.SET_PAPER_DATA:
      return state.set('paperData', action.data);
    case contants.SET_SELECTED_ID:
      return state.set('selectedId', action.id);
    case contants.SET_EDIT_SCORE_DATA:
      return state.set('editScoreData', action.data);
    case contants.SET_LIST_DATA:
      return state.setIn(['dataList', action.dataType], action.data);
    case contants.SET_PAPER_PARAMS:
      return state.setIn(['paperParams', action.key], action.value);
    case contants.SET_SEARCH_PARAMS:
      return state.setIn(['searchParams', action.key], action.value);
    case contants.SHOW_ADD_QUESTION_MODAL:
      return state.set('showAddQuestion', action.status);
    case contants.SER_ERROR_MESSAGE:
      return state.set('errorMessage', action.message);
    case contants.SET_EXAM_PAPER_LIST:
      return state.set('paperListData', action.data);
    case contants.TOGGLE_PAPER_PREVIEW:
      return state.set('preview', action.status);
    case contants.ALL_PAPER_PARAMS:
      return state.set('paperParams', action.data);
    case contants.SET_PAPER_LIST_LOADING:
      return state.set('paperListLoading', action.loading);
    case contants.SET_PAPER_LIST_TOTAL:
      return state.set('paperListTotal', action.total);
    case contants.SET_SPINNING:
      return state.set('spinning', action.spinning);
    default:
      return state;
  }
}