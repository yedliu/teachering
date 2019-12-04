/*
 *
 * AddVideoWrapper actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_SUBJECT_ACTION,
  GET_GRADE_ACTION,
  GET_LESSONTYPE_ACTION,
  SET_CURRENTMENU_ACTION,
  SET_CHOOSEWATCHEROPEN_ACTION,
  SET_UPLOADMODALOPEN_ACTION,
  SET_UPLOADMODALCONTENTINDEX_ACTION,
  GET_VIDEORECORDLIST_ACTION,
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
  SET_REMOVEVIDEO_ACTION,
  SET_ADDLESSONVIDEO_ACTION,
  SET_CHOOSEWATCHERROLES_ACTION,
  SET_SELECTADDLESSONVIDEO_ACTION,
  SET_UPLOADFILEINFO_ACTION,
  SET_GRADELIST_ACTION,
  SET_SUBJECTLIST_ACTION,
  SET_LESSONTYPELIST_ACTION,
  SET_UPLOADFILE_ACTION,
  SET_BATCHADDVIDEO_ACTION,
  SET_BATVHADDVIDEOITEMS_ACTION,
  SET_ISBATCHADDVIDEO_ACTION,
  GET_USERID_ACTION,
  SET_USERIDITEM_ACTION,
  SET_CHANGEFULLNAMEVALUE_ACTION,
  SET_STUDENTUSERIDSITEM_ACTION,
  SET_UPLOADFILEINFOINIT_ACTION,
  SET_BUTTONLOADING_ACTION,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function setGradeListAction(item) {
  return {
    type: SET_GRADELIST_ACTION,
    item,
  };
}
export function getGradeAction() {
  return {
    type: GET_GRADE_ACTION,
  };
}
export function getSubjectAction() {
  return {
    type: GET_SUBJECT_ACTION,
  };
}
export function setSubjectListAction(item) {
  return {
    type: SET_SUBJECTLIST_ACTION,
    item,
  };
}
export function getLessonTypeAction() {
  return {
    type: GET_LESSONTYPE_ACTION,
  };
}
export function setLessonTypeListAction(item) {
  return {
    type: SET_LESSONTYPELIST_ACTION,
    item,
  };
}

export function setCurrentMenuAction(menu) {
  return {
    type: SET_CURRENTMENU_ACTION,
    menu,
  };
}
export function setChooseWatcherOpenAction(bol) {
  return {
    type: SET_CHOOSEWATCHEROPEN_ACTION,
    bol,
  };
}
export function setUploadModalOpenAction(bol) {
  return {
    type: SET_UPLOADMODALOPEN_ACTION,
    bol,
  };
}
export function setUploadModalContentIndexAction(idx) {
  return {
    type: SET_UPLOADMODALCONTENTINDEX_ACTION,
    idx,
  };
}
export function getVideoRecordListAction() {
  return {
    type: GET_VIDEORECORDLIST_ACTION,
  };
}
export function setSelectSubjectAction(item) {
  return {
    type: SET_SELECTSUBJECT_ACTION,
    item,
  };
}
export function setSelectGradeAction(item) {
  return {
    type: SET_SELECTGRADE_ACTION,
    item,
  };
}
export function setTeacherPhoneAction(val) {
  return {
    type: SET_TEACHERPHONE_ACTION,
    val,
  };
}
export function setStudentPhoneAction(val) {
  return {
    type: SET_STUDENTPHONE_ACTION,
    val,
  };
}
export function setSelectLessonTypeAction(item) {
  return {
    type: SET_SELECTLESSONTYPE_ACTION,
    item,
  };
}
export function setChangeStatusAction(item) {
  return {
    type: SET_CHANGESTATUS_ACTION,
    item,
  };
}
export function setSelectStartTimeAction(val) {
  return {
    type: SET_SELECTSTARTTIME_ACTION,
    val,
  };
}
export function setSelectEndTimeAction(val) {
  return {
    type: SET_SELECTENDTIME_ACTION,
    val,
  };
}
export function setSearchFieldValueAction(field,value) {
  console.log('ffff',field,value)
  return {
    type: SET_SEARCHFIELDVALUE_ACTION,
    field,
    value,
  };
}
export function setVideoRecordListAction(item) {
  return {
    type: SET_VIDEORECORDLIST_ACTION,
    item,
  };
}
export function setVideoRecordTotalCountAction(num) {
  return {
    type: SET_VIDEORECORDTOTALCOUNT_ACTION,
    num,
  };
}
export function setCurrentPageIndexAction(num) {
  return {
    type: SET_CURRENTPAGINATIONINDEX_ACTION,
    num,
  };
}
export function setLoadStateAction(bol) {
  return {
    type: SET_LOADINGSTATE_ACTION,
    bol,
  };
}
export function removeSelectVideosAction(id) {
  return {
    type: REMOVE_SELETEVIDEOS_ACTION,
    id
  };
}
export function setRemoveVideoAction() {
  return {
    type: SET_REMOVEVIDEO_ACTION,
  };
}
export function setAddLessonVideoAction() {
  return {
    type: SET_ADDLESSONVIDEO_ACTION,
  };
}
export function setChooseWatcherRolesAction(item) {
  return {
    type: SET_CHOOSEWATCHERROLES_ACTION,
    item
  };
}
export function setSelectAddLessonVideoAction(item) {
  return {
    type: SET_SELECTADDLESSONVIDEO_ACTION,
    item
  };
}
export function setUploadFileInfoAction(field,value) {
  return {
    type: SET_UPLOADFILEINFO_ACTION,
    field,
    value,
  };
}

export function setUploadFileAction() {
  return {
    type: SET_UPLOADFILE_ACTION,
  };
}
export function setBatchAddVideoAction() {
  return {
    type: SET_BATCHADDVIDEO_ACTION,
  };
}
export function setBatchAddVideoItemsAction(item) {
  return {
    type: SET_BATVHADDVIDEOITEMS_ACTION,
    item,
  };
}
export function setIsBatchAddVideoAction(bol) {
  return {
    type: SET_ISBATCHADDVIDEO_ACTION,
    bol,
  };
}
export function getUserIdAction() {
  return {
    type: GET_USERID_ACTION,
  };
}
export function setUserIdItemAction(item) {
  return {
    type: SET_USERIDITEM_ACTION,
    item,
  };
}
export function setChangeFullNameValueAction(name) {
  return {
    type: SET_CHANGEFULLNAMEVALUE_ACTION,
    name,
  };
}
export function setStudentIdsItemAction(item) {
  return {
    type: SET_STUDENTUSERIDSITEM_ACTION,
    item,
  };
}
export function setUploadFileInfoInitAction(item) {
  return {
    type: SET_UPLOADFILEINFOINIT_ACTION,
    item,
  };
}
export function setButtonLoadingAction(bol) {
  return {
    type: SET_BUTTONLOADING_ACTION,
    bol,
  };
}





