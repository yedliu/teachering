import { createSelector } from 'reselect';

/**
 * Direct selector to the setTags state domain
 */
const selectSetTagsDomain = () => (state) => state.get('setTags');

/**
 * Other specific selectors
 */


/**
 * Default selector used by SetTags
 */

const makeSelectSetTags = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.toJS()
);
const makeInputDTO = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('inputDTO')
);
const makeModalShow = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('modal')
);
const makeCommonInfo = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('commonInfo')
);
const makeEditionList = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('editionList')
);
const makeCourseSystem = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('courseSystem')
);
const makeCourseChecked = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('courseChecked')
);
const makePageState = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('pageState')
);
const makeAlertModalState = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('alert')
);
const makePaperState = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('paperState')
);
const makePaperList = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('paperList'),
);
const makeHasGetPaperCount = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('hasGetPaperCount')
);
const makeNotGetPaperCount = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('notGetPaperCount')
);
const makePageSize = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('pageSize'),
);
const makePageIndex = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('pageIndex'),
);
const makeSelectedEPID = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('epid')
);
const makeQuestionList = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('questionList')
);
const makeQuestionIndex = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('questionIndex')
);
const makeQuestionListOrigin = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('questionListOrigin')
);
const makeFinishedList = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('finished')
);
const makePaperTitle = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('paperTitle')
);
const toGetPaperId = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('toGet')
);
const toGetSort = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('sort')
);
const makePaperDownloadMsg = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('paperDownloadMsg')
);

const getExamPointList = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('examPointList')
);
const getKnowledgeList = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('knowledgeList')
);
const makeIsOpenChildrenTags = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('isOpenChildrenTags')
);
const makeChildrenSelectedIndex = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('childrenSelectedIndex')
);
const makeQuestionTypeList = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('questionTypeList')
);
const makeBigMsg = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('bigMsg')
);
const makeChildrenQuestionMsg = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('childrenQuestionMsg')
);
const makeChildrenTags = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('childrenTags')
);
const makeShowTree = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('showTree'),
);
const makePaperVerifyRes = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('paperVerifyRes'),
);
const makePaperMsg = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('paperMsg'),
);
const makeChildrenTagsMemory = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('childrenTagsMemory'),
);
const makeHighlightItem = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('highlightItem'),
);
const makePointIdList = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('pointIdList'),
);
const makeSelectedPaperStateIndex = () => createSelector(
  selectSetTagsDomain(),
  (substate) => substate.get('selectedPaperStateIndex'),
);

export default makeSelectSetTags;
export {
  selectSetTagsDomain,
  makeInputDTO,
  makeModalShow,
  makeCommonInfo,
  makeEditionList,
  makeCourseSystem,
  makeCourseChecked,
  makePageState,
  makeAlertModalState,
  makePaperState,
  makePaperList,
  makeHasGetPaperCount,
  makeNotGetPaperCount,
  makePageIndex,
  makePageSize,
  makeSelectedEPID,
  makeQuestionList,
  makeQuestionIndex,
  makeQuestionListOrigin,
  makeFinishedList,
  makePaperTitle,
  toGetPaperId,
  toGetSort,
  makePaperDownloadMsg,
  getExamPointList,
  getKnowledgeList,
  makeIsOpenChildrenTags,
  makeChildrenSelectedIndex,
  makeQuestionTypeList,
  makeBigMsg,
  makeChildrenQuestionMsg,
  makeChildrenTags,
  makeShowTree,
  makePaperVerifyRes,
  makePaperMsg,
  makeChildrenTagsMemory,
  makeHighlightItem,
  makePointIdList,
  makeSelectedPaperStateIndex,
};
