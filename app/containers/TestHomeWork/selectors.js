import { createSelector } from 'reselect';

/**
 * Direct selector to the testHomeWork state domain
 */
const selectTestHomeWorkDomain = () => (state) => state.get('testHomeWork');

/**
 * Other specific selectors
 */


/**
 * Default selector used by TestHomeWork
 */

const makeSelectTestHomeWork = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.toJS()
);
const makePhaseList = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('phaseList')
);
const makeGradeList = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('gradeList')
);
const makeSubjectList = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('subjectList')
);
const makeSelectedPhase = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('selectedPhase')
);
const makeSelectedGrade = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('selectedGrade')
);
const makeSelectedSubject = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('selectedSubject')
);
const makeTestkonwleadgeList = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('testkonwleadgeList')
);
const makeSelectedknowledgeItem = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('selectedknowledgeItem')
);
const makeHomeworkMsgList = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('homeworkMsgList')
);
const makePreviewModalShow = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('previewModalShow')
);
const makeCreateModalShow = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('createModalShow')
);
const makeHomeworkStep = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('homeworkStep')
);
const makeHomeworksubjectlist = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('homeworksubjectlist')
);
const makeSelectedSubjectItem = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('selectedSubjectItem')
);
const makeKnowledgeTreeDataList = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('knowledgeTreeData')
);
const makeSelectedType = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('selectedType')
);
const makeSelectedTreeNode = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('selectedTreeNode')
);
const makeSelectQuestionTypeList = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('selectQuestionTypeList')
);
const makeQuestionlevellist = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('questionlevellist')
);
const makeQuestionkindlist = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('questionkindlist')
);
const makeFitstage = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('fitstage')
);
const makeSuggeststart = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('suggeststart')
);
const makeSelectQuestionType = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('selectQuestionType')
);
const makeSelectedQuestionLevel = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('selectedQuestionLevel')
);
const makeSelectedQuestionKind = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('selectedQuestionKind')
);
const makeSelectfitstage = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('selectfitstage')
);
const makeSelectsuggeststart = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('selectsuggeststart')
);
const makeSearchKeyword = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('keyword')
);
const makePageIndex = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('pageIndex')
);
const makePageSize = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('pageSize')
);
const makeShowAnalysis = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('showAnalysis')
);
const makeSearchBackQuestions = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('searchBackQuestions')
);
const makeHomeworkSkep = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('homeworkSkep')
);
const makeVersionList = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('versionList')
);
const makeSelectedVersion = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('selectedVersion')
);
const makeGradeListData = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('gradeListData')
);
const makeSelectedGradeData = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('selectedGradeData')
);
const makeAlertStates = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('alertStates')
);
const makeIsSubmit = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('isSubmit')
);
const makeTestHomeworkOnepaperMsg = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('testHomeworkOnepaperMsg')
);
const makeHomeworkDiff = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('homeworkDiff')
);
const makeHomeworkPaperMsg = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('homeworkPaperMsg')
);
const makeTestHomeworkItem = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('testHomeworkItem')
);
const makePaginationMsg = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('paginationMsg')
);
const makeHomeworkType = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('homeworkType')
);
const makeIsEditorOrReviseState = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('isEditorOrReviseState')
);
const makeSelectedTestType = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('selectedTestType')
);
const makeTestTypeList = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('testTypeList')
);
const makePaperTotal = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('paperTotal')
);
const makePaperIndex = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('paperIndex')
);
const makeLoadingOver = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('loadingOver')
);
const makeQuestionListLoadingOver = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('questionListLoadingOver')
);
const makeTreeNodePath = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('treeNodePath')
);
const makeKnowledgeListIsLoading = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('knowledgeListIsLoading')
);
const makeSearchParams = () => createSelector(
  selectTestHomeWorkDomain(),
  (substate) => substate.get('searchParams')
);

export default makeSelectTestHomeWork;
export {
  selectTestHomeWorkDomain,
  makePhaseList,
  makeGradeList,
  makeSubjectList,
  makeSelectedPhase,
  makeSelectedGrade,
  makeSelectedSubject,
  makeTestkonwleadgeList,
  makeSelectedknowledgeItem,
  makeHomeworkMsgList,
  makePreviewModalShow,
  makeCreateModalShow,
  makeHomeworkStep,
  makeHomeworksubjectlist,
  makeSelectedSubjectItem,
  makeKnowledgeTreeDataList,
  makeSelectedType,
  makeSelectedTreeNode,
  makeSelectQuestionTypeList,
  makeQuestionlevellist,
  makeQuestionkindlist,
  makeFitstage,
  makeSuggeststart,
  makeSelectQuestionType,
  makeSelectedQuestionLevel,
  makeSelectedQuestionKind,
  makeSelectfitstage,
  makeSelectsuggeststart,
  makeSearchKeyword,
  makePageIndex,
  makePageSize,
  makeShowAnalysis,
  makeSearchBackQuestions,
  makeHomeworkSkep,
  makeVersionList,
  makeSelectedVersion,
  makeGradeListData,
  makeSelectedGradeData,
  makeAlertStates,
  makeIsSubmit,
  makeTestHomeworkOnepaperMsg,
  makeHomeworkDiff,
  makeHomeworkPaperMsg,
  makeTestHomeworkItem,
  makePaginationMsg,
  makeHomeworkType,
  makeIsEditorOrReviseState,
  makeSelectedTestType,
  makeTestTypeList,
  makePaperTotal,
  makePaperIndex,
  makeLoadingOver,
  makeQuestionListLoadingOver,
  makeTreeNodePath,
  makeKnowledgeListIsLoading,
  makeSearchParams,
};
