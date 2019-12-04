import { createSelector } from 'reselect';

/**
 * Direct selector to the textbookEdition state domain
 */
const selectTextbookEditionDomain = () => (state) => state.get('textbookEdition');

/**
 * Other specific selectors
 */

/**
 * Default selector used by TextbookEdition
 */

const makeSelectTextbookEdition = () => createSelector(selectTextbookEditionDomain(), (substate) => substate.toJS());

const makeSelectPhase = () => createSelector(selectTextbookEditionDomain(), (substate) => substate.get('phase'));

const makeSelectAddNew = () => createSelector(selectTextbookEditionDomain(), (substate) => substate.get('models'));

const makeSelectPhaseList = () =>
	createSelector(selectTextbookEditionDomain(), (substate) => substate.get('phaseList'));

const makeSelectSubjectList = () =>
	createSelector(selectTextbookEditionDomain(), (substate) => substate.get('subjectList'));

const makeSelectSubject = () => createSelector(selectTextbookEditionDomain(), (substate) => substate.get('subject'));

const makeSelectGradeList = () =>
	createSelector(selectTextbookEditionDomain(), (substate) => substate.get('gradeList'));

const makeSelectGradeId = () => createSelector(selectTextbookEditionDomain(), (substate) => substate.get('gradeId'));

const makeSelectSubjectId = () =>
	createSelector(selectTextbookEditionDomain(), (substate) => substate.get('subjectId'));

const makeSelectSubjectEditionList = () =>
	createSelector(selectTextbookEditionDomain(), (substate) => substate.get('subjectEditionList'));

const makeSelectInputChangeList = () =>
	createSelector(selectTextbookEditionDomain(), (substate) => substate.get('inputList'));

const makeSelectTextbookList = () =>
	createSelector(selectTextbookEditionDomain(), (substate) => substate.get('textbookList'));

const makeSelectTextbook = () => createSelector(selectTextbookEditionDomain(), (substate) => substate.get('textbook'));

const makeSelectCrudId = () => createSelector(selectTextbookEditionDomain(), (substate) => substate.get('crudId'));

const makeSelectEditionList = () =>
	createSelector(selectTextbookEditionDomain(), (substate) => substate.get('editionList'));

const makeSelectEditionId = () =>
	createSelector(selectTextbookEditionDomain(), (substate) => substate.get('editionId'));

const makeSelectKnowledgeList = () =>
	createSelector(selectTextbookEditionDomain(), (substate) => substate.get('knowledgeList'));

const makeSelectSelectedKnowledgeList = () =>
	createSelector(selectTextbookEditionDomain(), (substate) => substate.get('selectedKnowledgeList'));

const makeSelectKnowledge = () =>
	createSelector(selectTextbookEditionDomain(), (substate) => substate.get('knowledge'));

const makeSelectKnowledgeCrudId = () =>
	createSelector(selectTextbookEditionDomain(), (substate) => substate.get('knowledgeCrudId'));

const makeSelectInputDto = () => createSelector(selectTextbookEditionDomain(), (substate) => substate.get('inputDto'));

const makeSelectFirstNodeList = () =>
	createSelector(selectTextbookEditionDomain(), (substate) => substate.get('firstNodeList'));

const makeSelectFirstNodeId = () =>
	createSelector(selectTextbookEditionDomain(), (substate) => substate.get('firstNodeId'));

const makeSelectAddExit = () => createSelector(selectTextbookEditionDomain(), (substate) => substate.get('addExist'));

const makeSelectSecondNodeList = () =>
	createSelector(selectTextbookEditionDomain(), (substate) => substate.get('secondNodeList'));

const makeSelectSecondNodeId = () =>
	createSelector(selectTextbookEditionDomain(), (substate) => substate.get('secondNodeId'));

const makeSelectThreeNodeList = () =>
	createSelector(selectTextbookEditionDomain(), (substate) => substate.get('threeNodeList'));

const makeSelectThreeNodeId = () =>
	createSelector(selectTextbookEditionDomain(), (substate) => substate.get('threeNodeId'));

const makeSelectFourNodeList = () =>
	createSelector(selectTextbookEditionDomain(), (substate) => substate.get('fourNodeList'));

const makeSelectFourNodeId = () =>
	createSelector(selectTextbookEditionDomain(), (substate) => substate.get('fourNodeId'));

const makeSelectModalAttr = () =>
	createSelector(selectTextbookEditionDomain(), (substate) => substate.get('modalAttr'));

const makeSelectAddLevel = () => createSelector(selectTextbookEditionDomain(), (substate) => substate.get('addLevel'));

export default makeSelectTextbookEdition;
export {
	selectTextbookEditionDomain,
	makeSelectPhase,
	makeSelectAddNew,
	makeSelectPhaseList,
	makeSelectSubjectList,
	makeSelectSubject,
	makeSelectGradeList,
	makeSelectGradeId,
	makeSelectSubjectId,
	makeSelectSubjectEditionList,
	makeSelectInputChangeList,
	makeSelectTextbookList,
	makeSelectTextbook,
	makeSelectCrudId,
	makeSelectEditionList,
	makeSelectEditionId,
	makeSelectKnowledgeList,
	makeSelectSelectedKnowledgeList,
	makeSelectKnowledge,
	makeSelectKnowledgeCrudId,
	makeSelectInputDto,
	makeSelectFirstNodeList,
	makeSelectFirstNodeId,
	makeSelectAddExit,
	makeSelectSecondNodeList,
	makeSelectSecondNodeId,
	makeSelectThreeNodeList,
	makeSelectThreeNodeId,
	makeSelectFourNodeList,
	makeSelectFourNodeId,
	makeSelectModalAttr,
	makeSelectAddLevel
};
