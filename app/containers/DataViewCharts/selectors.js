import { createSelector } from 'reselect';

/**
 * Direct selector to the DataViewCharts state domain
 */

const selectDataViewChartsDomain = () => (state) => state.get('DataViewCharts');

const makeSelectTypeList = () => createSelector(
  selectDataViewChartsDomain(),
  (substate) => substate.get('typeList')
);

const makeSelectType = () => createSelector(
  selectDataViewChartsDomain(),
  (substate) => substate.get('type')
);

const makeSelectList = () => createSelector(
  selectDataViewChartsDomain(),
  (substate) => substate.get('list')
);

const makeSelectParams = () => createSelector(
  selectDataViewChartsDomain(),
  (substate) => substate.get('params')
);

const makeSelectSearchTypeList = () => createSelector(
  selectDataViewChartsDomain(),
  (substate) => substate.get('searchTypeList')
);

const makeSelectSearchType = () => createSelector(
  selectDataViewChartsDomain(),
  (substate) => substate.get('searchType')
);

export {
  makeSelectTypeList,
  makeSelectType,
  makeSelectList,
  makeSelectParams,
  makeSelectSearchTypeList,
  makeSelectSearchType,
  };
