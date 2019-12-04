import { createSelector } from 'reselect';

/**
 * Direct selector to the leftNavC state domain
 */
const selectLeftNavCDomain = () => (state) => state.get('leftNavC');

/**
 * Other specific selectors
 */


/**
 * Default selector used by LeftNavC
 */

const makeSelectLeftNavC = () => createSelector(
  selectLeftNavCDomain(),
  (substate) => substate.toJS()
);
const makeGradeListData = () => createSelector(
  selectLeftNavCDomain(),
  (substate) => substate.get('grade')
);
const makeSubjectListData = () => createSelector(
  selectLeftNavCDomain(),
  (substate) => substate.get('subject')
);
const makeLessonTypeData = () => createSelector(
  selectLeftNavCDomain(),
  (substate) => substate.get('lessontype')
);
const makeAlertShowOrHide = () => createSelector(
  selectLeftNavCDomain(),
  (substate) => substate.get('alertShowOrHide')
);
const makeAlertStates = () => createSelector(
  selectLeftNavCDomain(),
  (substate) => substate.get('alertStates')
);
const makeDataIsGetting = () => createSelector(
  selectLeftNavCDomain(),
  (substate) => substate.get('dataIsGetting')
);
const makeBackPromptAlertShow = () => createSelector(
  selectLeftNavCDomain(),
  (substate) => substate.get('backPromptAlertShow')
);
const makebackAlertStates = () => createSelector(
  selectLeftNavCDomain(),
  (substate) => substate.get('backAlertStates')
);
const makeBtnCanClick = () => createSelector(
  selectLeftNavCDomain(),
  (substate) => substate.get('btnCanClick'),
);
const makeIsLoading = () => createSelector(
  selectLeftNavCDomain(),
  (substate) => substate.get('isLoading'),
);

export default makeSelectLeftNavC;
export {
  selectLeftNavCDomain,
  makeGradeListData,
  makeSubjectListData,
  makeLessonTypeData,
  makeAlertShowOrHide,
  makeAlertStates,
  makeDataIsGetting,
  makeBackPromptAlertShow,
  makebackAlertStates,
  makeBtnCanClick,
  makeIsLoading,
};
