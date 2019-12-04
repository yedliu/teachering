/*
 *
 * PaperManagement reducer
 *
 */

import { fromJS } from 'immutable';
// import { paperCardList } from 'utils/zmConfig';
import { message } from 'antd';

import {
  DEFAULT_ACTION,
  SET_GRADE_ACTION,
  SET_SUBJECT_ACTION,
  SET_PAPER_PROPERTY_ACTION,
  SET_TABLE_STATE,
  SET_PAPER_LIST_STATE,
  SET_TOTAL_PAPER_ACTION,
  SET_PAPER_MSG_ACTION,
  SET_PAPER_MSG_SELECT_ACTION,
  SET_PAPER_MSG_VALUE_ACTION,
  SET_TEACHING_VERSION_ACTION,
  SET_COURSE_SYSTEM_ACTION,
  SET_AREA_LIST,
  SET_PAPER_TYPE,
  INIT_PROPERTY_ACTION,
  SET_PAPER_PURPOSE,
  SET_PAPER_TARGET,
  SET_CREATE_PAPER_MSG_ACTION,
  SET_SELECTED_ROW_KEYS
} from './constants';

const initialState = fromJS({
  paperType: [],
  grade: [],
  subject: [],
  areaList: {
    province: [],
    city: [],
    county: []
  },
  paperPurpose: [],
  paperTarget: [],
  paperProperty: {
    startDate: '',
    endDate: '',
    name: '',
    epName: '',
    submitFlag: true, // 已完成
  },
  tableState: {
    data: [],
    pageSize: 10,
    pageIndex: 1,
    loading: false,
  },
  paperList: [],
  totalPapers: 0,
  assemblePaperMsgList: [
    { type: 'epName', name: '试卷名称', value: '', data: '' },
    { type: 'gradeId', name: '年级', value: -1, flag: true, data: [] },
    { type: 'subjectId', name: '学科', value: -1, flag: true, data: [] },
    { type: 'year', name: '年份', value: -1, flag: true, data: [] },
    { type: 'difficulty', name: '试卷难度', value: -1, flag: true, data: [] },
    { type: 'paperTypeId', name: '试卷类型', value: -1, flag: true, data: [] },
    { type: 'termId', name: '学期', value: -1, flag: true, data: [] },
    { type: 'purpose', name: '用途', value: -1, flag: true, data: [] },
    { type: 'onlineFlag', name: '上架状态', value: 1, flag: true, data: [] },
    { type: 'provinceId', name: '省份', value: -1, flag: true, data: [] },
    { type: 'cityId', name: '市', value: -1, flag: false, data: [] },
    { type: 'countyId', name: '区/县', value: -1, flag: false, data: [] },
    { type: 'source', name: '试卷来源', value: -1, flag: true, data: [] },
    { type: 'examTypeId', name: '卷型', value: -1, flag: true, data: [] },
    { type: 'businessCardId', name: '试卷名片', value: '', flag: false, data: [] },
    { type: 'evaluationTarget', name: '测评对象', value: -1, flag: true, data: [] },
    { type: 'evaluationPurpose', name: '测评用途', value: -1, flag: true, data: [] },
    { type: 'epBu', name: '适用BU', value: -1, flag: true, data: [] },
    { type: 'teachingEditionId', name: '教材版本', value: -1, flag: true, data: [] },
    { type: 'editionId', name: '课程内容', value: -1, flag: true, data: [] },
  ],
  createPaperMsgList: [
    { type: 'epName', name: '试卷名称', value: '', data: '' },
    { type: 'gradeId', name: '年级', value: -1, flag: true, data: [] },
    { type: 'subjectId', name: '学科', value: -1, flag: true, data: [] },
    { type: 'year', name: '年份', value: -1, flag: true, data: [] },
    { type: 'difficulty', name: '试卷难度', value: -1, flag: true, data: [] },
    { type: 'paperTypeId', name: '试卷类型', value: -1, flag: true, data: [] },
    { type: 'termId', name: '学期', value: -1, flag: true, data: [] },
    { type: 'purpose', name: '用途', value: -1, flag: true, data: [] },
    { type: 'onlineFlag', name: '上架状态', value: 1, flag: true, data: [] },
    { type: 'provinceId', name: '省份', value: -1, flag: true, data: [] },
    { type: 'cityId', name: '市', value: -1, flag: false, data: [] },
    { type: 'countyId', name: '区/县', value: -1, flag: false, data: [] },
    { type: 'source', name: '试卷来源', value: -1, flag: true, data: [] },
    { type: 'examTypeId', name: '卷型', value: -1, flag: true, data: [] },
    { type: 'businessCardId', name: '试卷名片', value: '', flag: false, data: [] },
    { type: 'evaluationTarget', name: '测评对象', value: -1, flag: true, data: [] },
    { type: 'evaluationPurpose', name: '测评用途', value: -1, flag: true, data: [] },
    { type: 'epBu', name: '适用BU', value: -1, flag: true, data: [] },
  ],
  teachingVersion: {
    data: [],
    selectedId: '',
    versionTreeData: [],
    versionValue: null, // 最终选择的节点
    showTeachingList: [] // 显示的所有包括父节点
  },
  courseSystem: {
    data: [],
    selectedId: '',
    systemTreeData: [],
    systemValue: null, // 最终选择的节点
    showSystemList: [] // 显示的所有包括父节点
  },
  selectedRowKeys: []
});

const findIndexByType = (state, type, fields = 'assemblePaperMsgList') => {
  let itemIndex = -1;
  state.get(fields).find((item, index) => { // eslint-disable-line
    if (item.get('type') === type) {
      itemIndex = index;
      return true;
    }
  });
  if (itemIndex < 0) {
    message.error('未找到设置项');
    return;
  }
  return itemIndex;
};

function paperManagementReducer(state = initialState, action) { // eslint-disable-line
  let itemIndex = -1;
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_PAPER_TYPE:
      return state.set('paperType', action.list);
    case SET_GRADE_ACTION:
      return state.set('grade', action.list);
    case SET_SUBJECT_ACTION:
      return state.set('subject', action.list);
    // 设置试卷属性
    case SET_PAPER_PROPERTY_ACTION:
      // 每次改变条件 页码重置
      return state.setIn(['paperProperty', action.field], action.val).setIn(['tableState', 'pageIndex'], 1);
    case INIT_PROPERTY_ACTION:
      return state.set('paperProperty', initialState.get('paperProperty'));
    case SET_TABLE_STATE:
      return state.set('tableState', action.tableState);
    case SET_PAPER_LIST_STATE:
      return state.set('paperList', action.list);
    case SET_TOTAL_PAPER_ACTION:
      return state.set('totalPapers', action.val);
    case SET_PAPER_MSG_ACTION:
      itemIndex = findIndexByType(state, action.setType);
      if (itemIndex < 0) return;
      return state.setIn(['assemblePaperMsgList', itemIndex, 'data'], action.item);
    case SET_CREATE_PAPER_MSG_ACTION:
      itemIndex = findIndexByType(state, action.setType, 'createPaperMsgList');
      if (itemIndex < 0) return;
      return state.setIn(['createPaperMsgList', itemIndex, 'data'], action.item);
    case SET_PAPER_MSG_SELECT_ACTION:
      itemIndex = findIndexByType(state, action.setType, 'createPaperMsgList');
      if (itemIndex < 0) return;
      return state.setIn(['createPaperMsgList', itemIndex, 'value'], action.num);
    case SET_PAPER_MSG_VALUE_ACTION: // eslint-disable-line
      let createPaperMsgList = state.get('createPaperMsgList');
      Object.keys(action.item).forEach((it) => { // eslint-disable-line
        itemIndex = findIndexByType(state, it, 'createPaperMsgList');
        if (itemIndex < 0) return; // eslint-disable-line
        createPaperMsgList = createPaperMsgList.setIn([itemIndex, 'value'], action.item[it]);
      });
      return state.set('createPaperMsgList', createPaperMsgList);
    case SET_TEACHING_VERSION_ACTION:
      return state.set('teachingVersion', action.item);
    case SET_COURSE_SYSTEM_ACTION:
      return state.set('courseSystem', action.item);
    case SET_AREA_LIST:
      return state.setIn(['areaList', action.key], action.data);
    case SET_PAPER_PURPOSE:
      return state.set('paperPurpose', action.list);
    case SET_PAPER_TARGET:
      return state.set('paperTarget', action.list);
    case SET_SELECTED_ROW_KEYS:
      return state.set('selectedRowKeys', action.list);
    default:
      return state;
  }
}

export default paperManagementReducer;
