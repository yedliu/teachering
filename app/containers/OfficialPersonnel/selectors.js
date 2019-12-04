import { createSelector } from 'reselect';

/**
 * Direct selector to the officialPersonnel state domain
 */
const selectOfficialPersonnelDomain = () => state =>
  state.get('officialPersonnel');

/**
 * Other specific selectors
 */

/**
 * Default selector used by OfficialPersonnel
 */

const makeSelectOfficialPersonnel = () =>
  createSelector(
    selectOfficialPersonnelDomain(),
    substate => substate.toJS()
  );
const makeSelectModalShow = () =>
  createSelector(
    selectOfficialPersonnelDomain(),
    substate => substate.get('modal')
  );
const makeSelectInputDTO = () =>
  createSelector(
    selectOfficialPersonnelDomain(),
    substate => substate.get('inputDTO')
  );
const makeSelectTableData = () =>
  createSelector(
    selectOfficialPersonnelDomain(),
    substate => substate.get('data')
  );
const makeSelectPagination = () =>
  createSelector(
    selectOfficialPersonnelDomain(),
    substate => substate.get('pagination')
  );
const makeSelectQueryParam = () =>
  createSelector(
    selectOfficialPersonnelDomain(),
    substate => substate.get('queryParam')
  );
const makeSelectAuthority = () =>
  createSelector(
    selectOfficialPersonnelDomain(),
    substate => substate.get('authority')
  );
const makeSelectRoles = () =>
  createSelector(
    selectOfficialPersonnelDomain(),
    substate => substate.get('allRoles')
  );
const makeSelectEditId = () =>
  createSelector(
    selectOfficialPersonnelDomain(),
    substate => substate.get('editId')
  );
export default makeSelectOfficialPersonnel;
export {
  selectOfficialPersonnelDomain,
  makeSelectModalShow,
  makeSelectInputDTO,
  makeSelectTableData,
  makeSelectPagination,
  makeSelectQueryParam,
  makeSelectAuthority,
  makeSelectRoles,
  makeSelectEditId,
};
