import { createSelector } from 'reselect';

/**
 * Direct selector to the tagsVerify state domain
 */
const selectTagsVerifyDomain = () => (state) => state.get('tagsVerify');

/**
 * Other specific selectors
 */


/**
 * Default selector used by TagsVerify
 */

const makeSelectTagsVerify = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.toJS()
);
const makeInputDTO = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('inputDTO')
);
const makeModalShow = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('modal')
)
const makeCommonInfo = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('commonInfo')
)
const makeEditionList = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('editionList')
)
const makeCourseSystem = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('courseSystem')
)
const makeCourseChecked = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get("courseChecked")
)
const makePageState = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('pageState')
)
const makeAlertModalState = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('alert')
)
const makePaperState = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('paperState')
)
const makePaperList = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('paperList'),
);
const makeHasGetPaperCount = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('hasGetPaperCount')
)
const makeNotGetPaperCount = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('notGetPaperCount')
)
const makePageSize = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('pageSize'),
);
const makePageIndex = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('pageIndex'),
);
const makeSelectedEPID = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('epid')
);
const makeQuestionList = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('questionList')
)
const makeQuestionIndex = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('questionIndex')
)
const makeQuestionListOrigin = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('questionListOrigin')
)
const makeFinishedList = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('finished')
);
const makePaperTitle = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('paperTitle')
);
const toGetPaperId = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('toGet')
);
const getResult = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('result')
);
const toGetSort = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('sort')
);
const makePaperDownloadMsg = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('paperDownloadMsg')
);

const getExamPointList = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('examPointList')
);
const getKnowledgeList = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('knowledgeList')
);
const makeShowSubmitBtn = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('showSubmitBtn')
);
const makeCurrentPaperData = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('currentPaperData'),
);
const makeBigQuestionMsg = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('bigQuestionMsg'),
);
const makeQuestionsList = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('questionsList'),
);
const makeQuestionsIndex = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('questionsIndex'),
);
const makeVerifyTagsSelectDrop = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('verifyTagsSelectDrop'),
);
const makeShowChildrenVerify = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('showChildrenVerify'),
);
const maekChildrenIndex = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('childrenSelectIndex'),
);
const makeShowTree = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('showTree'),
);
const makePointIdList = () => createSelector(
  selectTagsVerifyDomain(),
  (substate) => substate.get('pointIdList'),
);

export default makeSelectTagsVerify;
export {
  selectTagsVerifyDomain,
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
  getResult,
  toGetSort,
  makePaperDownloadMsg,
  getExamPointList,
  getKnowledgeList,
  makeShowSubmitBtn,
  makeCurrentPaperData,
  makeBigQuestionMsg,
  makeQuestionsList,
  makeQuestionsIndex,
  makeVerifyTagsSelectDrop,
  makeShowChildrenVerify,
  maekChildrenIndex,
  makeShowTree,
  makePointIdList,
};
