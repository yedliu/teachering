import { createSelector } from 'reselect';

/**
 * Direct selector to the addPaper state domain
 */
const selectAddPaperDomain = () => (state) => state.get('addPaper');

/**
 * Other specific selectors
 */

const makeSelectphaseSubjectList = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('phaseSubjectList')
);
const makeSelectphaseSubject = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('phaseSubject')
);
const makeSelectGradeList = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('gradeList')
);
const makeSelectTermList = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('termList')
);
const makeSelectAreaList = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('areaList')
);
const makeSelectAreaAddList = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('areaListAdd')
);
const makeSelectYearList = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('yearList')
);
const makeSelectStatusList = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('statusList')
);
const makeSelectSelected = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('selected')
);
const makeSelectInputDto = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('inputDto')
);
const makeSelectUIStatus = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('UIstatus')
);
const makeSelectFormGrade = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('formGradeList')
);
const makeSelectFormTerm = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('formTermList')
);
const makeSelectProvice = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('provinceList')
);
const makeSelectTableState = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('tableState')
);
const makeSelectTableData = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('tableData')
);
const makeSelectEditModal = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('editModal')
);
const makeSelectEditPaperId = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('editPaperId')
);
const makeSelectEditionList = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('editionList')
);
const makeNotIssue = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('notIssue')
);
const makeWashState = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('washState')
);
const makeShowPaperMsg = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('showPaperMsg')
);
const makeSelectOperatorModalVisible = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('operatorModalVisible')
);
const makeSelectOperators = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('operators')
);
const makeSelectForcedReleaseModalVisible = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('forcedReleaseModalVisible')
);
const makePaperNameForSearch = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('paperNameForSearch')
);
const makeShowSamePaper = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('showSamePaper')
);
const makeSamePaperList = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('samePaperList')
);
const makePaperTypeList = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('paperTypeList')
);
const makeExamTypeList = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('examTypeList')
);
const makeForceSaving = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('forceSaving')
);
const makeBusinessCardList = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('businessCardList')
);
const makeExamPaperSourceList = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('examPaperSourceList')
);

const makeSelectPaperType = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('paperType')
);

const makePaperPurpose = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('paperPurpose')
);

const makePaperTarget = () => createSelector(
  selectAddPaperDomain(),
  (substate) => substate.get('paperTarget')
);

export {
  selectAddPaperDomain,
  makeSelectphaseSubjectList,
  makeSelectphaseSubject,
  makeSelectGradeList,
  makeSelectTermList,
  makeSelectAreaList,
  makeSelectYearList,
  makeSelectStatusList,
  makeSelectSelected,
  makeSelectInputDto,
  makeSelectUIStatus,
  makeSelectFormTerm,
  makeSelectFormGrade,
  makeSelectProvice,
  makeSelectAreaAddList,
  makeSelectTableState,
  makeSelectTableData,
  makeSelectEditModal,
  makeSelectEditPaperId,
  makeSelectEditionList,
  makeNotIssue,
  makeWashState,
  makeShowPaperMsg,
  makeSelectOperatorModalVisible,
  makeSelectOperators,
  makeSelectForcedReleaseModalVisible,
  makePaperNameForSearch,
  makeShowSamePaper,
  makeSamePaperList,
  makePaperTypeList,
  makeExamTypeList,
  makeForceSaving,
  makeBusinessCardList,
  makeSelectPaperType,
  makePaperPurpose,
  makePaperTarget,
  makeExamPaperSourceList,
};
