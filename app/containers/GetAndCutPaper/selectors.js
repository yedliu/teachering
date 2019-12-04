import { createSelector } from 'reselect';

/**
 * Direct selector to the getAndCutPaper state domain
 */
const selectGetAndCutPaperDomain = () => (state) => state.get('getAndCutPaper');

/**
 * Other specific selectors
 */


/**
 * Default selector used by GetAndCutPaper
 */

const makeSelectGetAndCutPaper = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.toJS()
);
const makeQuestionsList = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('questionsList'),
);
const makeImgSrc = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('imgSrc'),
);
const makePageState = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('pageState'),
);
const makePreviewShow = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('previewShowOrHide'),
);
const makeImgSrcList = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('imgSrcList'),
);
const makeQuestionMsgList = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('questionMsgList'),
);
const makeQuestionSelectedIndex = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('questionSelectedIndex'),
);
const makeCurrentCutPaperImg = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('currentCutPaperImg'),
);
const makePageIndex = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('pageIndex'),
);
const makePaperState = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('paperState'),
);
const makeSubjectId = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('subjectId'),
);
const makeGradeId = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('gradeId'),
);
const makeAlertShowOrHide = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('alertShowOrHide'),
);
const makeCurrentPaperItem = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('currentPaperItem'),
);
const makePaperList = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('paperList'),
);
const makePaperCount = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('notGetPaperCount'),
);
const makeHasGetPaperCount = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('hasGetPaperCount'),
);
const makePageSize = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('pageSize'),
);
const makeNeedCutPaperId = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('needCutPaperId'),
);
const makeCanvasDOM = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('canvasDOM'),
);
const makePicUrlList = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('picUrlList')
);
const makeQuestionTypeList = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('questionTypeList')
);
const makeSelectedTquestionType = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('selectedTquestionType')
);
const makeBigQuestion = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('bigQuestion')
);
const makeSmallQuestion = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('smallQuestion')
);
const makePaperPreviewShow = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('questionPreviewShow')
);
const makePreviewPaperMsgShow = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('paperPreviewMsgShow')
);
const makePaperIsBeCutItem = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('paperIsBeCutItem')
);
const makePreviewImgSrc = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('previewImgSrc')
);
const makeIsSubmitIng = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('isSubmitIng')
);
const makeAlertStates = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('alertStates')
);
const makeSort = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('sort')
);
const makeImgStartIndex = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('imgStartIndex')
);
const makeImgStep = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('imgStep')
);
const makeImgCountCritical = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('imgCountCritical')
);
// const makeSelectInsertWayList = () => createSelector(
//   selectGetAndCutPaperDomain(),
//   (substate) => substate.get('selectInsertWayList')
// );
const makeSelectedBigQuestion = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('selectedBigQuestion')
);
// const makeSelectedInsertWay = () => createSelector(
//   selectGetAndCutPaperDomain(),
//   (substate) => substate.get('selectedInsertWay')
// );
const makeSelectedIndex = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('selectedIndex')
);
const makleSelectedInsertIndex = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('selectedInsertIndex')
);
const makeSetBigQuestionMsgShow = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('setBigQuestionMsgShow')
);
const makeEditorBigQuestion = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('editorBigQuestion')
);
const makePicInputDTOList = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('picInputDTOList')
);
const makeBigPicIndex = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('bigPicIndex')
);
const makeNeedCutPaperMsg = () => createSelector(
  selectGetAndCutPaperDomain(),
  (substate) => substate.get('needCutPaperMsg')
);

export default makeSelectGetAndCutPaper;
export {
  selectGetAndCutPaperDomain,
  makeQuestionsList,
  makeImgSrc,
  makePageState,
  makePreviewShow,
  makeImgSrcList,
  makeQuestionMsgList,
  makeQuestionSelectedIndex,
  makeCurrentCutPaperImg,
  makePageIndex,
  makePaperState,
  makeSubjectId,
  makeGradeId,
  makeAlertShowOrHide,
  makeCurrentPaperItem,
  makePaperList,
  makePaperCount,
  makePageSize,
  makeNeedCutPaperId,
  makeCanvasDOM,
  makePicUrlList,
  makeQuestionTypeList,
  makeSelectedTquestionType,
  makeBigQuestion,
  makeSmallQuestion,
  makePaperPreviewShow,
  makePreviewPaperMsgShow,
  makePaperIsBeCutItem,
  makePreviewImgSrc,
  makeHasGetPaperCount,
  makeIsSubmitIng,
  makeAlertStates,
  makeSort,
  makeImgStartIndex,
  makeImgStep,
  makeImgCountCritical,
  // makeSelectInsertWayList,
  makeSelectedBigQuestion,
  // makeSelectedInsertWay,
  makeSelectedIndex,
  makleSelectedInsertIndex,
  makeSetBigQuestionMsgShow,
  //
  makeEditorBigQuestion,
  makePicInputDTOList,
  makeBigPicIndex,
  makeNeedCutPaperMsg,
};
