import { createSelector } from 'reselect';

/**
 * Direct selector to the knowledge state domain
 */
const selectKnowledgeDomain = () => (state) => state.get('knowledge');

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

const makeSelectKnowledgeList = () => createSelector(
  selectKnowledgeDomain(),
  (substate) => substate.get('knowledgeList')
);

const makeSelectSelectedKnowledgeList = () => createSelector(
  selectKnowledgeDomain(),
  (substate) => substate.get('selectedKnowledgeList')
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

const makeSelectModalAttr = () => createSelector(
  selectKnowledgeDomain(),
  (substate) => substate.get('modalAttr')
);

const makeSelectOriginKnowledgeList = () => createSelector(
  selectKnowledgeDomain(),
  (substate) => substate.get('originKnowledgeList')
);

export default makeSelectKnowledge;
export {
  selectKnowledgeDomain,
  makeSelectPhaseSubjectList,
  makeSelectPhaseSubject,
  makeSelectKnowledgeList,
  makeSelectSelectedKnowledgeList,
  makeSelectKnowledge,
  makeSelectInputDto,
  makeSelectCrudId,
  makeSelectModalAttr,
  makeSelectOriginKnowledgeList,
};
