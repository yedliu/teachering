import { createSelector } from 'reselect';

/**
 * Direct selector to the homeWorkSummary state domain
 */
const selectHomeWorkSummaryDomain = () => (state) => state.get('homeWorkSummary');

/**
 * Other specific selectors
 */


/**
 * Default selector used by HomeWorkSummary
 */

const makeSelectHomeWorkSummary = () => createSelector(
  selectHomeWorkSummaryDomain(),
  (substate) => substate.toJS()
);

export default makeSelectHomeWorkSummary;
export {
  selectHomeWorkSummaryDomain,
};
