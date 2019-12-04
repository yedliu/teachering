import { createSelector } from 'reselect';

/**
 * Direct selector to the paperInputVerify state domain
 */
const selectPaperInputVerifyDomain = () => (state) => state.get('paperInputVerify');

/**
 * Other specific selectors
 */


/**
 * Default selector used by PaperInputVerify
 */

const makeSelectPaperInputVerify = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.toJS()
);
const makePageState = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.get('pageState'),
);
const makePaperState = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.get('paperState'),
);
const makePaperList = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.get('paperList'),
);
const makePageSize = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.get('pageSize'),
);
const makePageIndex = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.get('pageIndex'),
);
const makeNotGetPaperCount = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.get('notGetPaperCount'),
);
const makeHasGetPaperCount = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.get('hasGetPaperCount'),
);
const makePaperNeedVerifyId = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.get('paperNeedVerifyId'),
);
const makePaperNeedVerify = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.get('paperNeedVerify'),
);
const makeQuestionMsgList = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.get('questionMsgList'),
);
const makeQuestionSelectedIndex = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.get('questionSelectedIndex'),
);
const makePreviewImgSrc = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.get('previewImgSrc'),
);
const makeQuestionResult = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.get('questionResult'),
);
const makeErrTextareaShow = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.get('errTextareaShow'),
);
const makeQuestionsList = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.get('questionsList'),
);
const makeQuestionTypeList = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.get('questionTypeList'),
);
const makeGetAlertShowOrHide = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.get('alertShowOrHide'),
);
const makeRealQuestionsCount = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.get('realQuestionsCount'),
);
const makeQuestionResultState = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.get('questionResultState'),
);
const makeSort = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.get('sort')
);
const makePaperDownloadMsg = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.get('paperDownloadMsg')
);
const makeShowSubmitBtn = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.get('showSubmitBtn')
);
const makeQuestionEditState = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.get('questionEditState')
);
const makeClickTarget = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.get('clickTarget')
);
const makeNewQuestion = () => createSelector(
  selectPaperInputVerifyDomain(),
  (substate) => substate.get('newQuestion')
);

export default makeSelectPaperInputVerify;
export {
  selectPaperInputVerifyDomain,
  makePageState,
  makePaperState,
  makePaperList,
  makePageSize,
  makePageIndex,
  makeNotGetPaperCount,
  makeHasGetPaperCount,
  makePaperNeedVerifyId,
  makePaperNeedVerify,
  makeQuestionMsgList,
  makeQuestionSelectedIndex,
  makePreviewImgSrc,
  makeQuestionResult,
  makeErrTextareaShow,
  makeQuestionsList,
  makeQuestionTypeList,
  makeGetAlertShowOrHide,
  makeRealQuestionsCount,
  makeQuestionResultState,
  makeSort,
  makePaperDownloadMsg,
  makeShowSubmitBtn,
  makeQuestionEditState,
  makeClickTarget,
  makeNewQuestion,
};
