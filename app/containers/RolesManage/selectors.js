import { createSelector } from 'reselect';

/**
 * Direct selector to the rolesManage state domain
 */
const selectRolesManageDomain = () => (state) => state.get('rolesManage');

/**
 * Other specific selectors
 */


/**
 * Default selector used by RolesManage
 */

const makeSelectRolesManage = () => createSelector(
  selectRolesManageDomain(),
  (substate) => substate.toJS()
);
const makeSelectModalShow = () => createSelector(
  selectRolesManageDomain(),
  (substate) => substate.get('modal')
);
const makeSelectInputDTO = () => createSelector(
  selectRolesManageDomain(),
  (substate) => substate.get('inputDTO')
);
const makeSelectTableData = () => createSelector(
  selectRolesManageDomain(),
  (substate) => substate.get('data')
);
const makeSelectPagination = () => createSelector(
  selectRolesManageDomain(),
  (substate) => substate.get('pagination')
);
const makeSelectQueryParam = () => createSelector(
  selectRolesManageDomain(),
  (substate) => substate.get('queryParam')
);
const makeSelectAuthority = () => createSelector(
  selectRolesManageDomain(),
  (substate) => substate.get('authority')
);
const makeSelectRoles = () => createSelector(
  selectRolesManageDomain(),
  (substate) => substate.get('allRoles')
);
const makeSelectEditId = ()=>createSelector(
  selectRolesManageDomain(),
  (substate)=>substate.get('editId')
)
const makeSelectAddingMode = ()=>createSelector(
  selectRolesManageDomain(),
  (substate)=>substate.get('add')
)
export default makeSelectRolesManage;
export {
  selectRolesManageDomain,
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
