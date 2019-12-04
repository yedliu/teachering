import { createSelector } from 'reselect';

export const subState = () => (state) => state.get('childPaperManagement');

export const makePaperData = () => createSelector(
  subState(),
  (subState) => subState.get('paperData')
);

export const makeSelectedId = () => createSelector(
  subState(),
  (subState) => subState.get('selectedId')
);

export const makeSaveParams = () => createSelector(
  subState(),
  (subState) => subState.get('paperParams')
);

export const makeSearchParams = () => createSelector(
  subState(),
  (subState) => subState.get('searchParams')
);

export const makeDataList = () => createSelector(
  subState(),
  (subState) => subState.get('dataList')
);
