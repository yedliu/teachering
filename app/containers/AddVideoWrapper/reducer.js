/*
 *
 * AddVideoWrapper reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  SET_CURRENTMENU_ACTION,
  SET_CHOOSEWATCHEROPEN_ACTION,
  SET_UPLOADMODALOPEN_ACTION,
  SET_UPLOADMODALCONTENTINDEX_ACTION,
  SET_SELECTSUBJECT_ACTION,
  SET_SELECTGRADE_ACTION,
  SET_TEACHERPHONE_ACTION,
  SET_STUDENTPHONE_ACTION,
  SET_SELECTLESSONTYPE_ACTION,
  SET_CHANGESTATUS_ACTION,
  SET_SELECTSTARTTIME_ACTION,
  SET_SELECTENDTIME_ACTION,
  SET_SEARCHFIELDVALUE_ACTION,
  SET_VIDEORECORDLIST_ACTION, //+
  SET_VIDEORECORDTOTALCOUNT_ACTION,
  SET_CURRENTPAGINATIONINDEX_ACTION,
  SET_LOADINGSTATE_ACTION,
  REMOVE_SELETEVIDEOS_ACTION,
  SET_CHOOSEWATCHERROLES_ACTION,
  SET_SELECTADDLESSONVIDEO_ACTION,
  SET_UPLOADFILEINFO_ACTION,
  SET_GRADELIST_ACTION,
  SET_SUBJECTLIST_ACTION,
  SET_LESSONTYPELIST_ACTION,
  SET_BATVHADDVIDEOITEMS_ACTION,
  SET_ISBATCHADDVIDEO_ACTION,
  SET_USERIDITEM_ACTION,
  SET_CHANGEFULLNAMEVALUE_ACTION,
  SET_STUDENTUSERIDSITEM_ACTION,
  SET_UPLOADFILEINFOINIT_ACTION,
  SET_BUTTONLOADING_ACTION,
} from './constants';

const initialState = fromJS({
  currentMenu:'add',
  modalopen:false,
  uploadModalOpen:false,
  contentIndex:0,
  selectSubject:'',
  selectGrade:'',
  teacherPhone:'',
  studentPhone:'',
  lessonType:'',
  changeStatus:'',
  startTime:'',
  endTime:'',
  searchItem:{},
  videoList:[],
  totalCount:0,
  currentPageIndex:1,
  loading:false,
  removeItemID:'',
  chooseWatcherRoles:[],
  addVideoItem:{},
  uploadFileInfo:{},
  grade:[],
  subject:[],
  lessontype:[],
  batchVideoItems:[],
  isBatchAddVideo:false,
  userIds:[],
  studentIds:[],
  fullName:{label:'',value:''},
  buttonLoad:false,
});

function addVideoWrapperReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_CURRENTMENU_ACTION:
      return state.set('currentMenu',action.menu);
    case SET_CHOOSEWATCHEROPEN_ACTION:
      return state.set('modalopen',action.bol);
    case SET_UPLOADMODALOPEN_ACTION:
      return state.set('uploadModalOpen',action.bol);
    case SET_UPLOADMODALCONTENTINDEX_ACTION:
      return state.set('contentIndex',action.idx);
    case SET_SELECTSUBJECT_ACTION:
      return state.set('selectSubject',action.item);
    case SET_SELECTGRADE_ACTION:
      return state.set('selectGrade',action.item);
    case SET_TEACHERPHONE_ACTION:
      return state.set('teacherPhone',action.val);
    case SET_STUDENTPHONE_ACTION:
      return state.set('studentPhone',action.val);
    case SET_SELECTLESSONTYPE_ACTION:
      return state.set('lessonType',action.item);
    case SET_CHANGESTATUS_ACTION:
      return state.set('changeStatus',action.item);
    case SET_SELECTSTARTTIME_ACTION:
      return state.set('startTime',action.val);
    case SET_SELECTENDTIME_ACTION:
      return state.set('endTime',action.val);
    case SET_SEARCHFIELDVALUE_ACTION:
      return state.set('searchItem',state.get('searchItem').setIn([action.field],action.value));
    case SET_VIDEORECORDLIST_ACTION:
      return state.set('videoList',action.item);
    case SET_VIDEORECORDTOTALCOUNT_ACTION:
      return state.set('totalCount',action.num);
    case SET_CURRENTPAGINATIONINDEX_ACTION:
      return state.set('currentPageIndex',action.num);
    case SET_LOADINGSTATE_ACTION:
      return state.set('loading',action.bol);
    case REMOVE_SELETEVIDEOS_ACTION:
      return state.set('removeItemID',action.id);
    case SET_CHOOSEWATCHERROLES_ACTION:
      return state.set('chooseWatcherRoles',action.item);
    case SET_SELECTADDLESSONVIDEO_ACTION:
      return state.set('addVideoItem',action.item);
    case SET_UPLOADFILEINFO_ACTION:
      return state.set('uploadFileInfo',state.get('uploadFileInfo').set(action.field,action.value));
    case SET_GRADELIST_ACTION:
      return state.set('grade',action.item);
    case SET_SUBJECTLIST_ACTION:
      return state.set('subject',action.item);
    case SET_LESSONTYPELIST_ACTION:
      return state.set('lessontype',action.item);
    case SET_BATVHADDVIDEOITEMS_ACTION:
      return state.set('batchVideoItems',action.item);
    case SET_ISBATCHADDVIDEO_ACTION:
      return state.set('isBatchAddVideo',action.bol);
    case SET_USERIDITEM_ACTION:
      return state.set('userIds',action.item);
    case SET_CHANGEFULLNAMEVALUE_ACTION:
      return state.set('fullName',action.name);
    case SET_STUDENTUSERIDSITEM_ACTION:
      return state.set('studentIds',action.item);
    case SET_UPLOADFILEINFOINIT_ACTION:
      return state.set('uploadFileInfo',action.item);
    case SET_BUTTONLOADING_ACTION:
      return state.set('buttonLoad',action.bol);
    default:
      return state;
  }
}

export default addVideoWrapperReducer;
