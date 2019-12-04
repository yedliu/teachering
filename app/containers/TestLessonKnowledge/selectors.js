import { createSelector } from 'reselect';

/**
 * Direct selector to the testLessonKnowledge state domain
 */
const selectTestLessonKnowledgeDomain = () => (state) => state.get('testLessonKnowledge');

/**
 * Other specific selectors
 */


/**
 * Default selector used by TestLessonKnowledge
 */

// const makeSelectTestLessonKnowledge = () => createSelector(
//   selectTestLessonKnowledgeDomain(),
//   (substate) => substate.toJS()
// );
const makeSelectPhaseList = () => createSelector(
  selectTestLessonKnowledgeDomain(),
  (substate) => substate.get('phaseList')
);

const makeSelectClassTypeList = () => createSelector(
  selectTestLessonKnowledgeDomain(),
  (substate) => substate.get('classTypeList')
);

const makeSelectPhase = () => createSelector(
  selectTestLessonKnowledgeDomain(),
  (substate) => substate.get('phase')
);

const makeSelectGradeList = () => createSelector(
  selectTestLessonKnowledgeDomain(),
  (substate) => substate.get('gradeList')
);

const makeSelectGrade = () => createSelector(
  selectTestLessonKnowledgeDomain(),
  (substate) => substate.get('grade')
);

const makeSelectSubjectList = () => createSelector(
  selectTestLessonKnowledgeDomain(),
  (substate) => substate.get('subjectList')
);

const makeSelectSubject = () => createSelector(
  selectTestLessonKnowledgeDomain(),
  (substate) => substate.get('subject')
);

const makeSelectBuObject = () => createSelector(
  selectTestLessonKnowledgeDomain(),
  (substate) => substate.get('buObject')
);

const makeSelectTestLessonKnowledgeList = () => createSelector(
  selectTestLessonKnowledgeDomain(),
  (substate) => substate.get('testLessonKnowledgeList')
);

const makeSelectTestLessonKnowledge = () => createSelector(
  selectTestLessonKnowledgeDomain(),
  (substate) => substate.get('testLessonKnowledge')
);

const makeSelectInputDto = () => createSelector(
  selectTestLessonKnowledgeDomain(),
  (substate) => substate.get('inputDto')
);

const makeSelectCrudId = () => createSelector(
  selectTestLessonKnowledgeDomain(),
  (substate) => substate.get('crudId')
);

const makeSelectModalAttr = () => createSelector(
  selectTestLessonKnowledgeDomain(),
  (substate) => substate.get('modalAttr')
);

const makeSelectTextbookEditionList = () => createSelector(
  selectTestLessonKnowledgeDomain(),
  (substate) => substate.get('textbookEditionList')
);

const makeSelectTextbookEdition = () => createSelector(
  selectTestLessonKnowledgeDomain(),
  (substate) => substate.get('textbookEdition')
);

const makeSelectLoading = () => createSelector(
  selectTestLessonKnowledgeDomain(),
  (substate) => substate.get('loading')
);

export default makeSelectTestLessonKnowledge;
export {
  selectTestLessonKnowledgeDomain,
  makeSelectPhaseList,
  makeSelectGradeList,
  makeSelectSubjectList,
  makeSelectPhase,
  makeSelectGrade,
  makeSelectSubject,
  makeSelectBuObject,
  makeSelectTestLessonKnowledgeList,
  makeSelectTestLessonKnowledge,
  makeSelectInputDto,
  makeSelectCrudId,
  makeSelectModalAttr,
  makeSelectClassTypeList,
  makeSelectTextbookEditionList,
  makeSelectTextbookEdition,
  makeSelectLoading
};
