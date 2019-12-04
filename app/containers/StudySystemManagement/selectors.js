import { createSelector } from 'reselect';

/**
 * Direct selector to the studySystemManagement state domain
 */
const selectStudySystemManagementDomain = () => (state) => state.get('studySystemManagement');

/**
 * Other specific selectors
 */


/**
 * Default selector used by StudySystemManagement
 */

const makeSelectStudySystemManagement = () => createSelector(
  selectStudySystemManagementDomain(),
  (substate) => substate.toJS()
);
const makeSelectGradeSubjectList = () => createSelector(
  selectStudySystemManagementDomain(),
  (substate) => substate.get('gradeSubjectList')
);
const makeSelectGrade = () => createSelector(
  selectStudySystemManagementDomain(),
  (substate) => substate.get('grade')
);
const makeSelectGradeList = () => createSelector(
  selectStudySystemManagementDomain(),
  (substate) => substate.get('gradeList')
);
const makeSelectGradeSubject = () => createSelector(
  selectStudySystemManagementDomain(),
  (substate) => substate.get('gradeSubject')
);
const makeClassTypeList = () => createSelector(
  selectStudySystemManagementDomain(),
  (substate) => substate.get('classTypeList')
);
const makeClassType = () => createSelector(
  selectStudySystemManagementDomain(),
  (substate) => substate.get('classType')
);
const makeSelectPid = () => createSelector(
  selectStudySystemManagementDomain(),
  (substate) => substate.get('pid')
);
const makeSelectFirstLevel = () => createSelector(
  selectStudySystemManagementDomain(),
  (substate) => substate.get('firstLevel')
);
const makeSelectFirstLevelId = () => createSelector(
  selectStudySystemManagementDomain(),
  (substate) => substate.get('firstLevelId')
);
const makeSelectSecondlevel = () => createSelector(
  selectStudySystemManagementDomain(),
  (substate) => substate.get('secondlevel')
);

const makeSelectSecondLevelId = () => createSelector(
  selectStudySystemManagementDomain(),
  (substate) => substate.get('secondLevelId')
  );
const makeSelectThreeLevelId = () => createSelector(
  selectStudySystemManagementDomain(),
  (substate) => substate.get('threeLevelId')
  );
const makeSelectThreelevel = () => createSelector(
  selectStudySystemManagementDomain(),
  (substate) => substate.get('threelevel')
);
const makeSelectInputDto = () => createSelector(
  selectStudySystemManagementDomain(),
  (substate) => substate.get('inputDto')
);
const makeSelectAddExit = () => createSelector(
  selectStudySystemManagementDomain(),
  (substate) => substate.get('addExist')
);
const makeSelectCrudId = () => createSelector(
  selectStudySystemManagementDomain(),
  (substate) => substate.get('crudId')
);
const makeEditionList = () => createSelector(
  selectStudySystemManagementDomain(),
  (substate) => substate.get('editionList')
);
const makeEdition = () => createSelector(
  selectStudySystemManagementDomain(),
  (substate) => substate.get('edition')
);
export default makeSelectStudySystemManagement;
export {
  selectStudySystemManagementDomain,
  makeSelectGradeList,
  makeSelectGrade,
  makeSelectGradeSubjectList,
  makeSelectGradeSubject,
  makeClassTypeList,
  makeClassType,
  makeSelectPid,
  makeSelectFirstLevel,
  makeSelectFirstLevelId,
  makeSelectSecondlevel,
  makeSelectSecondLevelId,
  makeSelectThreelevel,
  makeSelectInputDto,
  makeSelectAddExit,
  makeSelectCrudId,
  makeSelectThreeLevelId,
  makeEditionList,
  makeEdition
};
