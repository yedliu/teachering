/*
 *
 * addPaper reducer
 *
 */

import { fromJS } from 'immutable';
import moment from 'moment';
// import { formTermList, examTypeList as examList } from 'utils/zmConfig';
import { paperTypeList as typeList } from 'utils/immutableEnum';
// import { samePaper } from './mockSamePaper';

import {
  DEFAULT_ACTION,
  SET_SELECTED,
  SET_DATA_LIST,
  SET_UISTATUS,
  // GET_PHASE_SUBJECT_ACTION,
  // GET_PHASE_SUBJECT_LIST_ACTION,
  SET_PHASE_SUBJECT_ACTION,
  SET_PHASE_SUBJECT_LIST_ACTION,
  // GET_GRADE_LIST_ACTION,
  SET_GRADE_LIST_ACTION,
  // GET_TERM_LIST_ACTION,
  SET_TERM_LIST_ACTION,
  // GET_AREA_LIST_ACTION,
  SET_AREA_LIST_ACTION,
  SET_INPUT_DTO_ACTION,
  SET_FORM_GRADE_LIST,
  SET_PROVINCELIST_ACTION,
  SET_AREA_LIST_ADD_ACTION,
  SET_TABLE_STATE,
  SET_TABLE_DATA,
  SET_TOGGLE_EDITMODAL,
  SET_EDIT_PAPER_ID,
  SET_EDITION_ACTION,
  CHANGE_NOT_ISSUE_ACTION,
  CHANGE_WASH_STATE_ACTION,
  SET_SHOW_PAPER_MSG_ACTION, SET_OPERATOR_MODAL_VISIBLE_ACTION, SET_OPERATORS_ACTION, SET_FORCED_RELEASE_MODAL_ACTION,
  CHANGE_PAPER_FOR_SEARCH_ACTION,
  SHOW_SAME_PAPER_ACTION,
  SET_SAME_PAPER_LIST_ACTION,
  SET_FORCE_SAVE_ACTION,
  SET_STORE_ALL_ACTION,
  SET_STORE_ITEM_ACTION,
  SET_PAPER_TYPE,
  SET_PAPER_PURPOSE,
  SET_PAPER_TARGET,
} from './constants';
// const termList = fromJS(formTermList || []);

const initialState = fromJS({
  operatorModalVisible: false,
  forcedReleaseModalVisible: false,
  operators: { createUserName: '', updatedUserName: '', cutUserName: '', auditCutUserName: '', entryUserName: '', auditEntryUserName: '', tagUserName1: '', tagUserName2: '', auditTagUserName: '', finalAuditUserName: '' },
  editModal: false,
  editPaperId: 0,
  UIstatus: { adding: false, addStp: 1 },
  paperType: [],
  paperPurpose: [],
  paperTarget: [],
  gradeList: [],
  termList: [],
  editionList: [],
  provinceList: [{ id: '0', name: '全国' }],
  areaList: { city: [], county: [] },
  areaListAdd: { city: [], county: [] },
  yearList: [],
  examPaperSourceList: [],
  statusList: [
    {
      id: '',
      name: '全部',
    },
    {
      id: '15,16',
      name: '转化中',
    },
    {
      id: '0',
      name: '待领取',
    },
    {
      id: '1,2,3,12',
      name: '切割中',
    },
    {
      id: '4,5,6,7,13',
      name: '录入中',
    },
    {
      id: '8,9,10,14',
      name: '标注中',
    },
    {
      id: '11,17',
      name: '终审中',
    },
    {
      id: '18',
      name: '已入库',
    },
  ],
  phaseSubjectList: [],
  phaseSubject: { id: '', phaseId: '' },
  selected: { gradeId: 0, termId: 0, area: 0, year: 0, stateStr: '', exStartDate: '', exEndDate: '', sort: 0, provinceId: '', cityId: '', countyId: '', pageSize: 20, pageIndex: 1 },
  inputDto: {
    name: '',
    businessCardId: '1',
    subjectId: '',
    phaseId: '',
    gradeId: '',
    termId: '',
    provinceId: '',
    cityId: '',
    countyId: '',
    editionId: '',
    year: moment().format('YYYY'),
    examTypeId: '',
    typeId: '',
    fileUrl: '',
    source: '2', // 默认是教育资源
    teachingEditionId: '',
  },
  dataList: [],
  formGradeList: [],
  // formTermList: [{ id: 1, name: "上学期" }, { id: 2, name: "下学期" }, { id: 3, name: "暑假" }, { id: 4, name: "寒假" }],
  formTermList: [],
  tableState: {
    data: [],
    pagination: { pageSize: 20 },
    loading: false,
  },
  tableData: [],
  notIssue: false,
  washState: {},
  showPaperMsg: {
    showView: false,
    paperData: {},
    bigMsg: [],
    questionList: [],
  },
  paperNameForSearch: '',
  // showSamePaper: true,
  // samePaperList: samePaper.data,
  showSamePaper: false,
  samePaperList: [],
  paperTypeList: typeList.toJS(),
  examTypeList: [],
  forceSaving: false,
  businessCardList: [],
});

function addPaperReducer(state = initialState, action) { // eslint-disable-line
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_SELECTED:
      return state.set('selected', action.selected);
    case SET_DATA_LIST:
      return state.set('dataList', action.dataList);
    case SET_UISTATUS:
      return state.set('UIstatus', action.UIstatus);
    case SET_PHASE_SUBJECT_LIST_ACTION:
      return state.set('phaseSubjectList', action.phaseSubjectList);
    case SET_PHASE_SUBJECT_ACTION:
      return state.set('phaseSubject', action.phaseSubject);
    case SET_GRADE_LIST_ACTION:
      return state.set('gradeList', action.gradeList);
    case SET_TERM_LIST_ACTION:
      return state.set('termList', action.termList);
    case SET_AREA_LIST_ACTION:
      return state.set('areaList', action.areaList);
    case SET_INPUT_DTO_ACTION:
      return state.set('inputDto', action.inputDto);
    case SET_FORM_GRADE_LIST:
      return state.set('formGradeList', action.formGradeList);
    case SET_PROVINCELIST_ACTION:
      return state.set('provinceList', action.provinceList);
    case SET_AREA_LIST_ADD_ACTION:
      return state.set('areaListAdd', action.areaList);
    case SET_TABLE_STATE:
      return state.set('tableState', action.tableState);
    case SET_TABLE_DATA:
      return state.set('tableData', action.tableData);
    case SET_TOGGLE_EDITMODAL:
      return state.set('editModal', !state.get('editModal'));
    case SET_EDIT_PAPER_ID:
      return state.set('editPaperId', action.id);
    case SET_EDITION_ACTION:
      return state.set('editionList', action.list);
    case CHANGE_NOT_ISSUE_ACTION:
      return state.set('notIssue', action.bol);
    case CHANGE_WASH_STATE_ACTION:
      return state.set('washState', action.item);
    case SET_SHOW_PAPER_MSG_ACTION:
      return state.set('showPaperMsg', action.item);
    case SET_OPERATOR_MODAL_VISIBLE_ACTION:
      return state.set('operatorModalVisible', action.item);
    case SET_OPERATORS_ACTION:
      return state.set('operators', action.item);
    case SET_FORCED_RELEASE_MODAL_ACTION:
      return state.set('forcedReleaseModalVisible', action.item);
    case CHANGE_PAPER_FOR_SEARCH_ACTION:
      return state.set('paperNameForSearch', action.val);
    case SHOW_SAME_PAPER_ACTION:
      return state.set('showSamePaper', action.bol);
    case SET_SAME_PAPER_LIST_ACTION:
      return state.set('samePaperList', action.item);
    case SET_FORCE_SAVE_ACTION:
      return state.set('forceSaving', action.bol);
    case SET_STORE_ALL_ACTION:
      return state.merge(action.item);
    case SET_STORE_ITEM_ACTION:
      return state.set(action.dataType, action.data);
    case SET_PAPER_TYPE:
      return state.set('paperType', action.list);
    case SET_PAPER_PURPOSE:
      return state.set('paperPurpose', action.list);
    case SET_PAPER_TARGET:
      return state.set('paperTarget', action.list);
    default:
      return state;
  }
}

export default addPaperReducer;
