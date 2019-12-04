import { createSelector } from 'reselect';

/**
 * Direct selector to the standardWagesDataWrapper state domain
 */
const selectStandardWagesDataWrapperDomain = () => (state) => state.get('standardWagesDataWrapper');

/**
 * Other specific selectors
 */


/**
 * Default selector used by StandardWagesDataWrapper
 */

const makeSelectStandardWagesDataWrapper = () => createSelector(
  selectStandardWagesDataWrapperDomain(),
  (substate) => substate.toJS()
);
const makeSelectDate = () => createSelector(
  selectStandardWagesDataWrapperDomain(),
  (substate) => substate.get('selectDate')
);

const makeSearchMobileValue = () => createSelector(
  selectStandardWagesDataWrapperDomain(),
  (substate) => substate.get('searchMobileValue')
);
const makeSearchNameValue = () => createSelector(
  selectStandardWagesDataWrapperDomain(),
  (substate) => substate.get('searchNameValue')
);
const makeSalaryDataData = () => createSelector(
  selectStandardWagesDataWrapperDomain(),
  (substate) => substate.get('salaryData')
);
const makeTotalCountValue = () => createSelector(
  selectStandardWagesDataWrapperDomain(),
  (substate) => substate.get('totalCount')
);
const makeCurrentPageNumberValue = () => createSelector(
  selectStandardWagesDataWrapperDomain(),
  (substate) => substate.get('currentPageNumber')
);
const makeLoadingState = () => createSelector(
  selectStandardWagesDataWrapperDomain(),
  (substate) => substate.get('loading')
);
const makeDataModalOpenValue = () => createSelector(
  selectStandardWagesDataWrapperDomain(),
  (substate) => substate.get('dataModalOpen')
);
const makeSelectSalaryItem = () => createSelector(
  selectStandardWagesDataWrapperDomain(),
  (substate) => substate.get('selectSalaryItem')
);
const makeSelectSalaryDetail = () => createSelector(
  selectStandardWagesDataWrapperDomain(),
  (substate) => substate.get('selectSalaryDetail')
);
const makeSelectedDate = () => createSelector(
  selectStandardWagesDataWrapperDomain(),
  (substate) => substate.get('selecteddata')
);
const makePersonalTableMsg = () => createSelector(
  selectStandardWagesDataWrapperDomain(),
  (substate) => substate.get('personalTableMsg')
);

export default makeSelectStandardWagesDataWrapper;
export {
  selectStandardWagesDataWrapperDomain,
  makeSelectDate,
  makeSearchMobileValue,
  makeSearchNameValue,
  makeSalaryDataData,
  makeTotalCountValue,
  makeCurrentPageNumberValue,
  makeLoadingState,
  makeDataModalOpenValue,
  makeSelectSalaryItem,
  makeSelectSalaryDetail,
  makeSelectedDate,
  makePersonalTableMsg,
};
