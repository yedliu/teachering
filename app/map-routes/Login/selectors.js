import { createSelector } from 'reselect';

/**
 * Direct selector to the login state domain
 */
const selectLoginDomain = () => (state) => state.get('login');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Login
 */

const makeSelectLogin = () => createSelector(
  selectLoginDomain(),
  (substate) => substate.toJS()
);
const makeMobile = () => createSelector(
  selectLoginDomain(),
  (substate) => substate.get('mobile')
);
const makePassword = () => createSelector(
  selectLoginDomain(),
  (substate) => substate.get('password')
);
const makeIsLoading = () => createSelector(
  selectLoginDomain(),
  (substate) => substate.get('isLoading')
);
const makeShowPassword = () => createSelector(
  selectLoginDomain(),
  (substate) => substate.get('showPassword')
);
const makeLoginSuccess = () => createSelector(
  selectLoginDomain(),
  (substate) => substate.get('loginSuccess')
);

//
const makeOpenOrCloseAlert = () => createSelector(
  selectLoginDomain(),
  (substate) => substate.get('openOrCloseAlert')
);
const makeLoginMissText = () => createSelector(
  selectLoginDomain(),
  (substate) => substate.get('loginMissText')
);

export default makeSelectLogin;
export {
  selectLoginDomain,
  makeMobile,
  makePassword,
  makeIsLoading,
  makeShowPassword,
  makeLoginSuccess,
  //
  makeOpenOrCloseAlert,
  makeLoginMissText,
};
