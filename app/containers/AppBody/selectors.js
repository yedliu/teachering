import { createSelector } from 'reselect';

/**
 * Direct selector to the appBody state domain
 */
const selectAppBodyDomain = () => (state) => state.get('appBody');

/**
 * Other specific selectors
 */


/**
 * Default selector used by AppBody
 */

const makeSelectAppBody = () => createSelector(
  selectAppBodyDomain(),
  (substate) => substate.toJS()
);

export default makeSelectAppBody;
export {
  selectAppBodyDomain,
};
