import { createSelector } from 'reselect';

/**
 * Direct selector to the paperShowPage state domain
 */
const selectPaperShowPageDomain = () => (state) => state.get('paperShowPage');

/**
 * Other specific selectors
 */


/**
 * Default selector used by PaperShowPage
 */

const makeSelectPaperShowPage = () => createSelector(
  selectPaperShowPageDomain(),
  (substate) => substate.toJS()
);
const makeIndex = () => createSelector(
  selectPaperShowPageDomain(),
  (substate) => substate.get('index')
);

export default makeSelectPaperShowPage;
export {
  selectPaperShowPageDomain,
  makeIndex,
};
