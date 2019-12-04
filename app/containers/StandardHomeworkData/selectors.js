import { createSelector } from 'reselect';

/**
 * Direct selector to the standardHomeworkData state domain
 */
const selectStandardHomeworkDataDomain = () => (state) => state.get('standardHomeworkData');

/**
 * Other specific selectors
 */


/**
 * Default selector used by StandardHomeworkData
 */

const makeSelectStandardHomeworkData = () => createSelector(
  selectStandardHomeworkDataDomain(),
  (substate) => substate.toJS()
);

export default makeSelectStandardHomeworkData;
export {
  selectStandardHomeworkDataDomain,
};
