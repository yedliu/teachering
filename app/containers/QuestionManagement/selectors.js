import { createSelector } from 'reselect';

/**
 * Direct selector to the questionManagement state domain
 */
const selectQuestionManagementDomain = () => (state) => state.get('questionManagement');

/**
 * Other specific selectors
 */


/**
 * Default selector used by QuestionManagement
 */

const makeSelectphaseSubjectList = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('phaseSubjectList')
);
const makeSelectphaseSubject = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('phaseSubject')
);

export const makeSelectGradeSubject = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('gradeSubject')
);

const makeSelectType = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('selectedType')
);
export const makeSelectSelectedTreeitem = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('selectedtreeitem')
);
export const makeSelectKnownLedgeList = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('knownLedgeList')
);
export const makeSelectFilterFields = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('filterFields')
);
export const makeSelectMoreFilterFields = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('moreFilterFields')
);
export const makeSelectQuestionPageIndex = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('questionpageindex')
);
export const makeSelectQuestionPageSize = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('questionpagesize')
);
export const makeSelectCurFilterFields = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('curFilterFields')
);
export const makeSelectOrderParams = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('orderParams')
);
export const makeSelectProvinceData = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('provinceData')
);
export const makeSelectCityData = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('cityData')
);
export const makeSelectDistrictData = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('districtData')
);
export const makeSelectQuestionData = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('questionData')
);
export const makeSelectChooosedQuestions = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('choosedquestions')
);
export const makeSelectPaperContentList = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('paperContentList')
);
export const makeSelectPaperProperty = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('paperProperty')
);
export const makeSelectGrade = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('grade')
);
export const makeSelectSubject = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('subject')
);
export const makeSelectPageState = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('pageState')
);
export const makeSelectTotalQuestion = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('totalQuestion')
);
export const makeSelectUserMap = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('userMap')
);
export const makeSearchData = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('searchData')
);
export const makePaperType = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('paperType')
);
export const makeChooseQuestionRule = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('ruleList')
);

export const makeKnowledgeIds = () => createSelector(
  selectQuestionManagementDomain(),
  (substate) => substate.get('knowledgeIds')
);

export {
  selectQuestionManagementDomain,
  makeSelectphaseSubjectList,
  makeSelectphaseSubject,
  makeSelectType,
};
