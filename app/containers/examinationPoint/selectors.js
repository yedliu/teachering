import { createSelector } from 'reselect';

/**
 * Direct selector to the knowledge state domain
 */
const selectKnowledgeDomain = () => (state) => state.get('examinationPoint');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Knowledge
 */

// const makeSelectKnowledge = () => createSelector(
//   selectKnowledgeDomain(),
//   (substate) => substate.toJS()
// );

const makeSelectPhaseSubjectList = () => createSelector(
  selectKnowledgeDomain(),
  (substate) => substate.get('phaseSubjectList')
);

const makeSelectPhaseSubject = () => createSelector(
  selectKnowledgeDomain(),
  (substate) => substate.get('phaseSubject')
);

const makeSelectExamPointList = () => createSelector(
  selectKnowledgeDomain(),
  (substate) => substate.get('examPointList')
);

const makeSelectSelectedExamPointList = () => createSelector(
  selectKnowledgeDomain(),
  (substate) => substate.get('selectedExamPointList')
);

const makeSelectKnowledge = () => createSelector(
  selectKnowledgeDomain(),
  (substate) => substate.get('knowledge')
);

const makeSelectInputDto = () => createSelector(
  selectKnowledgeDomain(),
  (substate) => substate.get('inputDto')
);

const makeSelectCrudId = () => createSelector(
  selectKnowledgeDomain(),
  (substate) => substate.get('crudId')
);
const makeSelectCrudLevel = () => createSelector(
  selectKnowledgeDomain(),
  (substate) => substate.get('crudLevel')
);
const makeSelectModalAttr = () => createSelector(
  selectKnowledgeDomain(),
  (substate) => substate.get('modalAttr')
);
export default makeSelectKnowledge;
export {
  selectKnowledgeDomain,
  makeSelectPhaseSubjectList,
  makeSelectPhaseSubject,
  makeSelectExamPointList,
  makeSelectSelectedExamPointList,
  makeSelectKnowledge,
  makeSelectInputDto,
  makeSelectCrudId,
  makeSelectModalAttr,
  makeSelectCrudLevel
};
