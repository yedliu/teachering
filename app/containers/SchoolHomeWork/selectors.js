import { createSelector } from 'reselect';

/**
 * Direct selector to the standHomeWork state domain
 */
const selectStandHomeWorkDomain = () => (state) => state.get('schoolHomeWork');

/**
 * Other specific selectors
 */


/**
 * Default selector used by StandHomeWork
 */

const makeSelectStandHomeWork = () => createSelector(
  selectStandHomeWorkDomain(),
  (substate) => substate.toJS()
);
const makePrviewSelectObj = () => createSelector(
  selectStandHomeWorkDomain(),
  (substate) => substate.get('prviewSelectObj')
);
const makeSerachParams = () => createSelector(
  selectStandHomeWorkDomain(),
  (substate) => substate.get('serachParams')
);
const makeSearchQuestionParams = () => createSelector(
  selectStandHomeWorkDomain(),
  (substate) => substate.get('searchQuestionParams')
);
const makeCreateHomeworkStepParams = () => createSelector(
  selectStandHomeWorkDomain(),
  (substate) => substate.get('createHomeworkStepParams')
);
const makePreviewHomework = () => createSelector(
  selectStandHomeWorkDomain(),
  (substate) => substate.get('previewHomework')
);
const makeGradeList = () => createSelector(
  selectStandHomeWorkDomain(),
  (substate) => substate.get('gradeList')
);
const makeIsReEditHomeWork = () => createSelector(
  selectStandHomeWorkDomain(),
  (substate) => substate.get('isReEditHomeWork')
);
const makeHomeworkType = () => createSelector(
  selectStandHomeWorkDomain(),
  (substate) => substate.get('homeworkType')
);
const makeAIHomeworkParams = () => createSelector(
  selectStandHomeWorkDomain(),
  (substate) => substate.get('AIHomeworkParams')
);
const makePageState = () => createSelector(
  selectStandHomeWorkDomain(),
  (substate) => substate.get('pageState')
);
export default makeSelectStandHomeWork;
export {
  selectStandHomeWorkDomain,
  makePrviewSelectObj,
  makeSerachParams,
  makeSearchQuestionParams,
  makeCreateHomeworkStepParams,
  makePreviewHomework,
  makeGradeList,
  makeIsReEditHomeWork,
  makeHomeworkType,
  makeAIHomeworkParams,
  makePageState,
};
