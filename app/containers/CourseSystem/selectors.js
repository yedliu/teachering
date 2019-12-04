import { createSelector } from 'reselect';

/**
 * Direct selector to the appBody state domain
 */
const selectCourseSystemDomain = () => (state) => state.get('courseSystem');

/**
 * Other specific selectors
 */


/**
 * Default selector used by AppBody
 */

const makeSelectCourseSystem = () => createSelector(
  selectCourseSystemDomain(),
  (substate) => substate.toJS()
);

const makeSelectGradeList = () => createSelector(
  selectCourseSystemDomain(),
  (substate) => substate.get('gradeList')
);

const makeSelectGradeId = () => createSelector(
  selectCourseSystemDomain(),
  (substate) => substate.get('gradeId')
);

const makeSelectSubjectList = () => createSelector(
  selectCourseSystemDomain(),
  (substate) => substate.get('subjectList')
);

const makeSelectSubjectId = () => createSelector(
  selectCourseSystemDomain(),
  (substate) => substate.get('subjectId')
);

const makeSelectEditionList = () => createSelector(
  selectCourseSystemDomain(),
  (substate) => substate.get('editionList')
);

const makeSelectEditionId = () => createSelector(
  selectCourseSystemDomain(),
  (substate) => substate.get('editionId')
);

const makeSelectClassTypeList = () => createSelector(
  selectCourseSystemDomain(),
  (substate) => substate.get('classTypeList')
);

const makeSelectCourseTypeList = () => createSelector(
  selectCourseSystemDomain(),
  (substate) => substate.get('courseTypeList')
);

const makeSelectCourseModuleList = () => createSelector(
  selectCourseSystemDomain(),
  (substate) => substate.get('courseModuleList')
);

const makeSelectCourseContentList = () => createSelector(
  selectCourseSystemDomain(),
  (substate) => substate.get('courseContentList')
);

const makeSelectClassTypeId = () => createSelector(
  selectCourseSystemDomain(),
  (substate) => substate.get('classTypeId')
);

const makeSelectCourseTypeId = () => createSelector(
  selectCourseSystemDomain(),
  (substate) => substate.get('courseTypeId')
);

const makeSelectCourseModuleId = () => createSelector(
  selectCourseSystemDomain(),
  (substate) => substate.get('courseModuleId')
);

const makeSelectCourseContentId = () => createSelector(
  selectCourseSystemDomain(),
  (substate) => substate.get('courseContentId')
);

const makeSelectInputDto = () => createSelector(
  selectCourseSystemDomain(),
  (substate) => substate.get('inputDto')
);

const makeSelectCrudId = () => createSelector(
  selectCourseSystemDomain(),
  (substate) => substate.get('crudId')
);
const makeSelectAddExit = () => createSelector(
  selectCourseSystemDomain(),
  (substate) => substate.get('addExist')
);

const makeSelectModalAttr = () => createSelector(
  selectCourseSystemDomain(),
  (substate) => substate.get('modalAttr')
);
const getKnowledgeList = () => createSelector(
  selectCourseSystemDomain(),
  (substate) => substate.get('knowledgeList')
);
export default makeSelectCourseSystem;
export {
  selectCourseSystemDomain,
  makeSelectGradeList,
  makeSelectSubjectList,
  makeSelectGradeId,
  makeSelectSubjectId,
  makeSelectEditionList,
  makeSelectEditionId,
  makeSelectClassTypeList,
  makeSelectCourseTypeList,
  makeSelectCourseModuleList,
  makeSelectCourseContentList,
  makeSelectClassTypeId,
  makeSelectCourseTypeId,
  makeSelectCourseModuleId,
  makeSelectCourseContentId,
  makeSelectInputDto,
  makeSelectCrudId,
  makeSelectAddExit,
  makeSelectModalAttr,
  getKnowledgeList,
};
