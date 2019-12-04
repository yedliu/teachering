/*
 *
 * PersonMsgManager reducer
 *
 */

import { fromJS } from 'immutable';
import moment from 'moment';
import {
  DEFAULT_ACTION,
  CHANGE_EDIT_STATE_ACTION,
  SET_USER_MSG_ACTION,
  CHANGE_IS_SUBMIT_ING_ACTION,
  SET_TAG_INDEX,
  SET_PAY_INPUT_DTO,
  SET_PAY_INFO,
  SET_BANK_LIST,
  SET_PROVINCE_LIST,
  SET_AREA_LIST_ACTION,
  SET_QRCODE_URL,
  SET_SELECT_DATE_ACTION,
  HANDLE_SELECTED_ACTION,
  SET_PAGEINDEX_ACTION,
  SET_SALARY_DATA_ACTION,
  SET_PAPER_DATA_ACTION,
  SET_SHOW_PAPER_MSG_ACTION,
  SET_PERSONAL_MSG_ACTION,
} from './constants';

const nowDate1 = new Date();
const nowDate2 = new Date();
nowDate1.setDate('01');
const startDate = moment(nowDate1.getTime());
const endDate = moment(nowDate2.getTime());

const initialState = fromJS({
  editState: false,
  stateNum: 0,
  tagIndex:0,
  userMsg: {},
  bankList:[],
  provinceList:[],
  areaList:[],
  qrcodeUrl:'',
  PayInputDTO:{
    idCardNumber:{value:''},
    bankAccount:{value:''},
    bankName:{value:''},
    bankAccountUsername:{value:''},
    alipayAccount:{value:''},
    bankProvince:{value:''},
    bankCity:{value:''},
    bankBranch:{value:''},
    bankAccountMobile:{value:''},
    remark:{value:''}
  },
  payInfo:{},
  selecteddata:{
    startDate,
    endDate,
  },
  pageIndex: 1,
  salarydata: {},
  paperData: {},
  showPaperMsg: {
    paperData: {},
    bigMsg: [],
    questionList: [],
  },
  personalTableMsg: {
    total: 0,
    currentPageNumber: 1,
    size: 10,
    workerUserId: 0,
    showMsg: false,
  },
});

function personMsgManagerReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case CHANGE_EDIT_STATE_ACTION:
      return state.set('editState', action.bol);
    case SET_USER_MSG_ACTION:
      return state.set('userMsg', action.item);
    case CHANGE_IS_SUBMIT_ING_ACTION:
      return state.set('stateNum', action.num);
    case SET_TAG_INDEX:
      return state.set('tagIndex',action.num).set('editState',false)
    case SET_PAY_INPUT_DTO:
      return state.set('PayInputDTO',action.data)
    case SET_PAY_INFO:
      return state.set('payInfo',action.data)
    case SET_BANK_LIST:
      return state.set('bankList',action.list)
    case SET_PROVINCE_LIST:
      return state.set('provinceList',action.list)
    case SET_AREA_LIST_ACTION:
      return state.set('areaList',action.list)
    case SET_QRCODE_URL:
      return state.set('qrcodeUrl',action.str)
    case SET_SELECT_DATE_ACTION:
      return state.set('selectdate',action.val)
    case HANDLE_SELECTED_ACTION:
      return state.setIn(['selecteddata',action.ty],action.val)
    case SET_PAGEINDEX_ACTION:
      return state.set('pageIndex', action.val)
    case SET_SALARY_DATA_ACTION:
      return state.set('salarydata', action.item)
    case SET_PAPER_DATA_ACTION:
      return state.set('paperData', action.val)
    case SET_SHOW_PAPER_MSG_ACTION:
      return state.set('showPaperMsg', action.item);
    case SET_PERSONAL_MSG_ACTION:
      return state.set('personalTableMsg', action.item);
    default:
      return state;
  }
}

export default personMsgManagerReducer;
