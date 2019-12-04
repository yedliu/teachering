import { createSelector } from 'reselect';

/**
 * Direct selector to the standHomeWork state domain
 */
const selectStandHomeWorkDomain = () => (state) => state.get('standHomeWork');

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
const makeReEditHomework = () => createSelector(
  selectStandHomeWorkDomain(),
  (substate) => substate.get('reEditHomework')
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
const makeClassTypeCode = () => createSelector(
  selectStandHomeWorkDomain(),
  (substate) => substate.get('classTypeCode')
);

const makeSliderState = () => createSelector(
  selectStandHomeWorkDomain(),
  (substate) => substate.get('sliderState')
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
  makeReEditHomework,
  makeHomeworkType,
  makeAIHomeworkParams,
  makePageState,
  makeClassTypeCode,
  makeSliderState,
};
