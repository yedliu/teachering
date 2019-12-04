import { createSelector } from 'reselect';

/**
 * Direct selector to the errorCorrectManagement state domain
 */
const selectErrorCorrectManagementDomain = () => (state) => state.get('errorCorrectManagement');

/**
 * Other specific selectors
 */


/**
 * Default selector used by ErrorCorrectManagement
 */

const makeSelectErrorCorrectManagement = () => createSelector(
  selectErrorCorrectManagementDomain(),
  (substate) => substate.toJS()
);

export const makeSelectFilterList = () => createSelector(
  selectErrorCorrectManagementDomain(),
  (substate) => substate.get('filterList')
);
export const makeSelectSelectFilter = () => createSelector(
  selectErrorCorrectManagementDomain(),
  (substate) => substate.get('selectFilter')
);

export const makeSelectQuestionStatistics = () => createSelector(
  selectErrorCorrectManagementDomain(),
  (substate) => substate.get('questionStatistics')
);

export const makeSelectPageState = () => createSelector(
  selectErrorCorrectManagementDomain(),
  (substate) => substate.get('pageState')
);

export const makeSelectQuestionList = () => createSelector(
  selectErrorCorrectManagementDomain(),
  (substate) => substate.get('questionList')
);

export default makeSelectErrorCorrectManagement;
export {
  selectErrorCorrectManagementDomain,
};
