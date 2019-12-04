import { createSelector } from 'reselect';

/**
 * Direct selector to the PaperAnalysis state domain
 */
const selectPaperAnalysisDomain = () => state => state.get('paperAnalysis');

/**
 * Other specific selectors
 */

/**
 * Default selector used by PaperAnalysis
 */

const makeSelectPaperAnalysis = () =>
  createSelector(selectPaperAnalysisDomain(), substate => substate.toJS());

export const makeSelectQuestionList = () =>
  createSelector(selectPaperAnalysisDomain(), substate =>
    substate.get('questionList')
  );
export default makeSelectPaperAnalysis;
export { selectPaperAnalysisDomain };
