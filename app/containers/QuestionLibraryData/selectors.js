import { createSelector } from 'reselect';

/**
 * Direct selector to the questionLibraryData state domain
 */
const selectQuestionLibraryDataDomain = () => (state) => state.get('questionLibraryData');

/**
 * Other specific selectors
 */


/**
 * Default selector used by QuestionLibraryData
 */

const makeSelectQuestionLibraryData = () => createSelector(
  selectQuestionLibraryDataDomain(),
  (substate) => substate.toJS()
);

export default makeSelectQuestionLibraryData;
export {
  selectQuestionLibraryDataDomain,
};
