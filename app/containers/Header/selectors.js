import { createSelector } from 'reselect';

/**
 * Direct selector to the header state domain
 */
const selectHeaderDomain = () => (state) => state.get('header');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Header
 */

const makeSelectHeader = () => createSelector(
  selectHeaderDomain(),
  (substate) => substate.get('headerInfo')
);
const makeVerificationCode = () => createSelector(
  selectHeaderDomain(),
  (substate) => substate.get('verificationCode')
);

export default makeSelectHeader;
export {
  selectHeaderDomain,
  makeVerificationCode,
};
