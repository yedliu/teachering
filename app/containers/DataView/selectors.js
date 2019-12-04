import { createSelector } from 'reselect';

/**
 * Direct selector to the DataView state domain
 */

const selectDataViewDomain = () => (state) => state.get('DataView');

const makeSelectTypeList = () => createSelector(
  selectDataViewDomain(),
  (substate) => substate.get('typeList')
);

const makeSelectType = () => createSelector(
  selectDataViewDomain(),
  (substate) => substate.get('type')
);

const makeSelectList = () => createSelector(
  selectDataViewDomain(),
  (substate) => substate.get('list')
);

const makeSelectParams = () => createSelector(
  selectDataViewDomain(),
  (substate) => substate.get('params')
);

const makeSelectShowOrHide = () => createSelector(
  selectDataViewDomain(),
  (substate) => substate.get('showorhide')
);

const makeSelectLessonType = () => createSelector(
  selectDataViewDomain(),
  (substate) => substate.get('selectedlessontype')
);

const makeSelectLessonList = () => createSelector(
  selectDataViewDomain(),
  (substate) => substate.get('lessonlist')
);

export {
  makeSelectTypeList,
  makeSelectType,
  makeSelectList,
  makeSelectParams,
  makeSelectShowOrHide,
  makeSelectLessonType,
  makeSelectLessonList,
};
