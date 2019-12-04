import { createSelector } from 'reselect';

/**
 * Direct selector to the paperManagement state domain
 */
const selectPaperManagementDomain = () => (state) => state.get('paperManagement');

/**
 * Other specific selectors
 */


/**
 * Default selector used by PaperManagement
 */

const makeSelectPaperManagement = () => createSelector(
  selectPaperManagementDomain(),
  (substate) => substate.toJS()
);

export const makeSelectPaperType = () => createSelector(
  selectPaperManagementDomain(),
  (substate) => substate.get('paperType')
);

export const makeSelectGrade = () => createSelector(
  selectPaperManagementDomain(),
  (substate) => substate.get('grade')
);
export const makeSelectSubject = () => createSelector(
  selectPaperManagementDomain(),
  (substate) => substate.get('subject')
);
export const makeSelectPaperProperty = () => createSelector(
  selectPaperManagementDomain(),
  (substate) => substate.get('paperProperty')
);
export const makeSelectTableState = () => createSelector(
  selectPaperManagementDomain(),
  (substate) => substate.get('tableState')
);
export const makeSelectPaperList = () => createSelector(
  selectPaperManagementDomain(),
  (substate) => substate.get('paperList')
);
export const makeSelectTotalPapers = () => createSelector(
  selectPaperManagementDomain(),
  (substate) => substate.get('totalPapers')
);
export const makeAssemblePaperMsgList = () => createSelector(
  selectPaperManagementDomain(),
  (substate) => substate.get('assemblePaperMsgList')
);
export const makeTeachingVersion = () => createSelector(
  selectPaperManagementDomain(),
  (substate) => substate.get('teachingVersion')
);
export const makeCourseSystem = () => createSelector(
  selectPaperManagementDomain(),
  (substate) => substate.get('courseSystem')
);
export const makeAreaList = () => createSelector(
  selectPaperManagementDomain(),
  (substate) => substate.get('areaList')
);
export const makePaperPurpose = () => createSelector(
  selectPaperManagementDomain(),
  (substate) => substate.get('paperPurpose')
);
export const makePaperTarget = () => createSelector(
  selectPaperManagementDomain(),
  (substate) => substate.get('paperTarget')
);
export const makeCreatePaperMsgList = () => createSelector(
  selectPaperManagementDomain(),
  (substate) => substate.get('createPaperMsgList')
);
export const makeSelectedRowKeys = () => createSelector(
  selectPaperManagementDomain(),
  (substate) => substate.get('selectedRowKeys')
);
export default makeSelectPaperManagement;
export {
  selectPaperManagementDomain,
};
