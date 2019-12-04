import { createSelector } from 'reselect';

/**
 * Direct selector to the personPassWord state domain
 */
const selectPersonPassWordDomain = () => (state) => state.get('personPassWord');

/**
 * Other specific selectors
 */


/**
 * Default selector used by PersonPassWord
 */

const makeSelectPersonPassWord = () => createSelector(
  selectPersonPassWordDomain(),
  (substate) => substate.toJS()
);
const makeInputOne = () => createSelector(
  selectPersonPassWordDomain(),
  (substate) => substate.get('oldpassword')
);
const makeInputTwo = () => createSelector(
  selectPersonPassWordDomain(),
  (substate) => substate.get('newpassword')
);
const makeInputThree = () => createSelector(
  selectPersonPassWordDomain(),
  (substate) => substate.get('newpasswordagain')
);
const makeChangeResponse = () => createSelector(
  selectPersonPassWordDomain(),
  (substate) => substate.get('changeresponse')
);
const makeGetPassWordIsSameFlage = () => createSelector(
  selectPersonPassWordDomain(),
  (substate) => substate.get('passwordIsSame')
);
const makeCanSubmit = () => createSelector(
  selectPersonPassWordDomain(),
  (substate) => substate.get('cansubmit')
);

export default makeSelectPersonPassWord;
export {
  selectPersonPassWordDomain,
  makeInputOne,
  makeInputTwo,
  makeInputThree,
  makeCanSubmit,
  makeChangeResponse,
  makeGetPassWordIsSameFlage,
};
