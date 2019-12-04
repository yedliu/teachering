import { createSelector } from 'reselect';

/**
 * Direct selector to the getAndInputPaper state domain
 */
const selectGetAndInputPaperDomain = () => (state) => state.get('getAndInputPaper');

/**
 * Other specific selectors
 */


/**
 * Default selector used by GetAndInputPaper
 */

const makeSelectGetAndInputPaper = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.toJS()
);
const makePageState = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('pageState')
);
const makeProvinceList = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('provinceList')
);
const makeCityList = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('cityList')
);
const makeCountyList = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('countyList')
);
const makeSelectedProvince = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('selectedProvince')
);
const makeSelectedCity = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('selectedCity')
);
const makeSelectedCounty = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('selectedCounty')
);
const makeSubjectList = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('subjectList')
);
const makeSelectedSubject = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('selectedSubject')
);
const makeSelectedEPID = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('epid')
);
const makeCurPaper = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('curPaper')
);
const makeCurIndex = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('curIndex')
);
const makeCurItem = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('curItem')
);
const makeResultList = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('resultList')
);
const makeCurQuesResult = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('curQues')
);
const makePageSize = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('pageSize'),
);
const makePageIndex = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('pageIndex'),
);
const makePaperState = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('paperState'),
);
const makeNotGetPaperCount = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('notGetPaperCount'),
);
const makeHasGetPaperCount = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('hasGetPaperCount'),
);
const makePaperList = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('paperList'),
);
const makeAlertModalShow = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('alertModalShow'),
);
const makeAlertModalStates = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('alertModalStates'),
);
const makePaperWhichNeedGetId = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('paperWhichNeedGetId'),
);
const makePaperWhichNeedInputId = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('paperWhichNeedInputId'),
);
const makePaperWhichNeedInputItem = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('paperWhichNeedInputItem'),
);
const makeComplexQuestionItemMsg = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('complexQuestionItemMsg')
);
const makeComplexQuestionItem = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('complexQuestionItem')
);
const makeFinishModal = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('finishModal'),
);
const makeAllQuestionTypeList = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('allQuestionTypeList'),
);
const makeAllDone = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('allDone')
);
const makeSort = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('sort')
);
const makePaperDownloadMsg = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('paperDownloadMsg')
);
const makeTemplateList = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('templateList')
);
const makeSlectedTemplate = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('slectedTemplate')
);
const makeErrList = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('errList')
);
const makeOthersData = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('othersData')
);
const makeQuestionsList = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('questionsList')
);
const makeQuestionsIndex = () => createSelector(
  selectGetAndInputPaperDomain(),
  (substate) => substate.get('questionsIndex')
);

export default makeSelectGetAndInputPaper;
export {
  selectGetAndInputPaperDomain,
  makePageState,
  makeProvinceList,
  makeCityList,
  makeCountyList,
  makeSelectedProvince,
  makeSelectedCity,
  makeSelectedCounty,
  makeSubjectList,
  makeSelectedSubject,
  makeSelectedEPID,
  makeCurPaper,
  makeCurItem,
  makeCurIndex,
  makeResultList,
  makeCurQuesResult,
  makePageSize,
  makePageIndex,
  makePaperState,
  makeNotGetPaperCount,
  makeHasGetPaperCount,
  makePaperList,
  makeAlertModalShow,
  makeAlertModalStates,
  makePaperWhichNeedGetId,
  makePaperWhichNeedInputId,
  makePaperWhichNeedInputItem,
  makeComplexQuestionItemMsg,
  makeComplexQuestionItem,
  makeFinishModal,
  makeAllQuestionTypeList,
  makeAllDone,
  makeSort,
  makePaperDownloadMsg,
  makeTemplateList,
  makeSlectedTemplate,
  makeErrList,
  makeOthersData,
  makeQuestionsList,
  makeQuestionsIndex,
};
