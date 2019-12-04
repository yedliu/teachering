import { createSelector } from 'reselect';

/**
 * Direct selector to the temporaryPersonnel state domain
 */
const selectTemporaryPersonnelDomain = () => state =>
  state.get('temporaryPersonnel');

/**
 * Other specific selectors
 */

/**
 * Default selector used by TemporaryPersonnel
 */

const makeSelectTemporaryPersonnel = () =>
  createSelector(
    selectTemporaryPersonnelDomain(),
    substate => substate.toJS()
  );
const makeSelectModalShow = () =>
  createSelector(
    selectTemporaryPersonnelDomain(),
    substate => substate.get('modal')
  );
const makeSelectInputDTO = () =>
  createSelector(
    selectTemporaryPersonnelDomain(),
    substate => substate.get('inputDTO')
  );
const makeSelectTableData = () =>
  createSelector(
    selectTemporaryPersonnelDomain(),
    substate => substate.get('data')
  );
const makeSelectPagination = () =>
  createSelector(
    selectTemporaryPersonnelDomain(),
    substate => substate.get('pagination')
  );
const makeSelectQueryParam = () =>
  createSelector(
    selectTemporaryPersonnelDomain(),
    substate => substate.get('queryParam')
  );
const makeSelectAuthority = () =>
  createSelector(
    selectTemporaryPersonnelDomain(),
    substate => substate.get('authority')
  );
const makeSelectRoles = () =>
  createSelector(
    selectTemporaryPersonnelDomain(),
    substate => substate.get('allRoles')
  );
const makeSelectEditId = () =>
  createSelector(
    selectTemporaryPersonnelDomain(),
    substate => substate.get('editId')
  );
const makeSelectAddingMode = () =>
  createSelector(
    selectTemporaryPersonnelDomain(),
    substate => substate.get('add')
  );
export default makeSelectTemporaryPersonnel;
export {
  selectTemporaryPersonnelDomain,
  makeSelectModalShow,
  makeSelectInputDTO,
  makeSelectTableData,
  makeSelectPagination,
  makeSelectQueryParam,
  makeSelectAuthority,
  makeSelectRoles,
  makeSelectEditId,
  makeSelectAddingMode
};
