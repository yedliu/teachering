import { createSelector } from 'reselect';

/**
 * Direct selector to the addVideoWrapper state domain
 */
const selectAddVideoWrapperDomain = () => (state) => state.get('addVideoWrapper');

/**
 * Other specific selectors
 */


/**
 * Default selector used by AddVideoWrapper
 */

const makeSelectAddVideoWrapper = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.toJS()
);
const makeCurrentMenuValue = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('currentMenu')
);
const makeChooseWatcherOpen = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('modalopen')
);
const makeUploadModalOpen = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('uploadModalOpen')
);
const makeUploadModalContentIndex = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('contentIndex')
);
const makeSelectSubjectValue = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('selectSubject')
);
const makeSelectGradeValue = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('selectGrade')
);
const makeTeacherPhoneValue = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('teacherPhone')
);
const makeStudentPhoneValue = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('studentPhone')
);
const makeSelectLessonTypeValue = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('lessonType')
);
const makeChangeStatusValue = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('changeStatus')
);
const makeSelectStartTimeValue = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('startTime')
);
const makeSelectEndTimeValue = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('endTime')
);
const makeSearchItemValue = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('searchItem')
);
const makeVideoRecordList = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('videoList')
);
const makeVideoRecordTotalCount = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('totalCount')
);
const makeCurrentPageIndex = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('currentPageIndex')
);
const makeLoadingState = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('loading')
);
const makeRemoveSelectVideoId = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('removeItemID')
);
const makeChooseWatcherRoles = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('chooseWatcherRoles')
);
const makeSelectAddLessonVideoItem = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('addVideoItem')
);
const makeUploadFileInfo = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('uploadFileInfo')
);
const makeGradeListData = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('grade')
);
const makeSubjectListData = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('subject')
);
const makeLessonTypeData = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('lessontype')
);
const makeBatchAddVideoItems = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('batchVideoItems')
);
const makeIsBatchAddVideoValue = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('isBatchAddVideo')
);
const makeUserIdsValue = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('userIds')
);
const makeFullNameValue = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('fullName')
);
const makeStudentIdsValue = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('studentIds')
)
const makeButtonLoadState = () => createSelector(
  selectAddVideoWrapperDomain(),
  (substate) => substate.get('buttonLoad')
)

export default makeSelectAddVideoWrapper;
export {
  selectAddVideoWrapperDomain,
  makeCurrentMenuValue,
  makeChooseWatcherOpen,
  makeUploadModalOpen,
  makeUploadModalContentIndex,
  makeSelectSubjectValue,
  makeSelectGradeValue,
  makeTeacherPhoneValue,
  makeStudentPhoneValue,
  makeSelectLessonTypeValue,
  makeChangeStatusValue,
  makeSelectStartTimeValue,
  makeSelectEndTimeValue,
  makeSearchItemValue,
  makeVideoRecordList,//+
  makeVideoRecordTotalCount,
  makeCurrentPageIndex,
  makeLoadingState,
  makeRemoveSelectVideoId,
  makeChooseWatcherRoles,
  makeSelectAddLessonVideoItem,
  makeUploadFileInfo,
  makeGradeListData,
  makeSubjectListData,
  makeLessonTypeData,
  makeBatchAddVideoItems,
  makeIsBatchAddVideoValue,
  makeUserIdsValue,
  makeFullNameValue,
  makeStudentIdsValue,
  makeButtonLoadState,
};
