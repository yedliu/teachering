import { createSelector } from 'reselect';

/**
 * Direct selector to the paperCutVerify state domain
 */
const selectPaperCutVerifyDomain = () => (state) => state.get('paperCutVerify');

/**
 * Other specific selectors
 */


/**
 * Default selector used by PaperCutVerify
 */

const makeSelectPaperCutVerify = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.toJS()
);
const makePageState = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.get('pageState'),
);
const makeImgSrc = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.get('imgSrc'),
);
const makePageIndex = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.get('pageIndex'),
);
const makeSubjectId = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.get('subjectId'),
);
const makeGradeId = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.get('gradeId'),
);
const makePaperState = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.get('paperState'),
);
const makeGetAlertShowOrHide = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.get('alertShowOrHide'),
);
const makePaperList = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.get('paperList'),
);
const makeNotGetPaperCount = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.get('notGetPaperCount'),
);
const makeHasGetPaperCount = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.get('hasGetPaperCount'),
);
const makePageSize = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.get('pageSize'),
);
const makeCurrentPaperItem = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.get('currentPaperItem'),
);
const makeQuestionSelectedIndex = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.get('questionSelectedIndex'),
);
const makeQuestionsList = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.get('questionsList'),
);
const makeQuestionMsgList = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.get('questionMsgList'),
);
const makeNeedVerifyPaper = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.get('needVerifyPaper'),
);
const makePreviewImgSrc = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.get('previewImgSrc'),
);
const makeErrTextareaShow = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.get('errTextareaShow'),
);
const makeQuestionTypeList = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.get('questionTypeList'),
);
const makeQuestionResult = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.get('questionResult'),
);
const makeRealQuestionsCount = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.get('realQuestionsCount'),
);
const makeQuestionResultState = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.get('questionResultState'),
);
const makeSort = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.get('sort')
);
const makePaperDownloadMsg = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.get('paperDownloadMsg')
);
const makeShowSubmitBtn = () => createSelector(
  selectPaperCutVerifyDomain(),
  (substate) => substate.get('showSubmitBtn')
);

export default makeSelectPaperCutVerify;
export {
  selectPaperCutVerifyDomain,
  makePageState,
  makeImgSrc,
  makePageIndex,
  makeSubjectId,
  makeGradeId,
  makePaperState,
  makeGetAlertShowOrHide,
  makePaperList,
  makeNotGetPaperCount,
  makeHasGetPaperCount,
  makePageSize,
  makeCurrentPaperItem,
  makeQuestionSelectedIndex,
  makeQuestionsList,
  makeQuestionMsgList,
  makeNeedVerifyPaper,
  makePreviewImgSrc,
  makeErrTextareaShow,
  makeQuestionTypeList,
  makeQuestionResult,
  makeRealQuestionsCount,
  makeQuestionResultState,
  makeSort,
  makePaperDownloadMsg,
  makeShowSubmitBtn,
};
