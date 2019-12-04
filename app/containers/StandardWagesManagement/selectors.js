import { createSelector } from 'reselect';

/**
 * Direct selector to the standardWagesManagement state domain
 */
const selectStandardWagesManagementDomain = () => state =>
  state.get('standardWagesManagement');

/**
 * Other specific selectors
 */

/**
 * Default selector used by StandardWagesManagement
 */

const makeSelectStandardWagesManagement = () =>
  createSelector(
    selectStandardWagesManagementDomain(),
    substate => substate.toJS()
  );
const makeSelectLevelValue = () =>
  createSelector(
    selectStandardWagesManagementDomain(),
    substate => substate.get('SelectLevelValue')
  );
const makeOperateModalOpen = () =>
  createSelector(
    selectStandardWagesManagementDomain(),
    substate => substate.get('operateModalOpen')
  );
const makeSelectOperateItem = () =>
  createSelector(
    selectStandardWagesManagementDomain(),
    substate => substate.get('selectOperateItem')
  );
const makeSubjectList = () =>
  createSelector(
    selectStandardWagesManagementDomain(),
    substate => substate.get('subjectList')
  );
const makeSelectSubjectValue = () =>
  createSelector(
    selectStandardWagesManagementDomain(),
    substate => substate.get('selectSubject')
  );
const makeSalaryConfigList = () =>
  createSelector(
    selectStandardWagesManagementDomain(),
    substate => substate.get('salaryConfigList')
  );

export default makeSelectStandardWagesManagement;
export {
  selectStandardWagesManagementDomain,
  makeSelectLevelValue,
  makeOperateModalOpen,
  makeSelectOperateItem,
  makeSubjectList,
  makeSelectSubjectValue,
  makeSalaryConfigList
};
