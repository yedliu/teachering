import { createSelector } from 'reselect';

/**
 * Direct selector to the testPaper state domain
 */
const selectTestPaperDomain = () => (state) => state.get('testPaper');

/**
 * Other specific selectors
 */


/**
 * Default selector used by TestPaper
 */

const makeSelectTestPaper = () => createSelector(
  selectTestPaperDomain(),
  (substate) => substate.toJS()
);

export default makeSelectTestPaper;
export {
  selectTestPaperDomain,
};
