import { createSelector } from 'reselect';

/**
 * Direct selector to the homeWorkDataView state domain
 */
const selectHomeWorkDataViewDomain = () => (state) => state.get('homeWorkDataView');

/**
 * Other specific selectors
 */


/**
 * Default selector used by HomeWorkDataView
 */

const makeSelectHomeWorkDataView = () => createSelector(
  selectHomeWorkDataViewDomain(),
  (substate) => substate.toJS()
);

const makeListData = () => createSelector(
  selectHomeWorkDataViewDomain(),
  (substate) => substate.get('list')
);

const makeSubjectListData = () => createSelector(
  selectHomeWorkDataViewDomain(),
  (substate) => substate.get('subjectList')
);

const makeSelectedRangeDateValue = () => createSelector(
  selectHomeWorkDataViewDomain(),
  (substate) => substate.get('selectedDateRange')
);

const makeSearchItemValue = () => createSelector(
  selectHomeWorkDataViewDomain(),
  (substate) => substate.get('searchItem')
);

const makeLoadingState = () => createSelector(
  selectHomeWorkDataViewDomain(),
  (substate) => substate.get('loading')
);

export default makeSelectHomeWorkDataView;
export {
  selectHomeWorkDataViewDomain,
  makeListData,
  makeSubjectListData,
  makeSelectedRangeDateValue,
  makeSearchItemValue,
  makeLoadingState,
};
