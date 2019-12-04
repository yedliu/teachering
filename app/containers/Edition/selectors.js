import { createSelector } from 'reselect';

/**
 * Direct selector to the edition state domain
 */
const selectEditionDomain = () => (state) => state.get('edition');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Edition
 */

// const makeSelectEdition = () => createSelector(
//   selectEditionDomain(),
//   (substate) => substate.toJS()
// );

const makeSelectPhaseSubjectList = () => createSelector(
  selectEditionDomain(),
  (substate) => substate.get('phaseSubjectList')
);

const makeSelectPhaseSubject = () => createSelector(
  selectEditionDomain(),
  (substate) => substate.get('phaseSubject')
);

const makeSelectEditionList = () => createSelector(
  selectEditionDomain(),
  (substate) => substate.get('editionList')
);

const makeSelectEdition = () => createSelector(
  selectEditionDomain(),
  (substate) => substate.get('edition')
);

const makeSelectInputDto = () => createSelector(
  selectEditionDomain(),
  (substate) => substate.get('inputDto')
);

const makeSelectCrudId = () => createSelector(
  selectEditionDomain(),
  (substate) => substate.get('crudId')
);

const makeSelectModalAttr = () => createSelector(
  selectEditionDomain(),
  (substate) => substate.get('modalAttr')
);

const makeSelectBuList = () => createSelector(
  selectEditionDomain(),
  (substate) => substate.get('buList')
);

const makeSelectClassTypeCode = () => createSelector(
  selectEditionDomain(),
  (substate) => substate.get('classTypeCode')
);
const makeSelectEdtionType = () => createSelector(
  selectEditionDomain(),
  (substate) => substate.get('editionType')
);
const makeSelectAddedState = () => createSelector(
  selectEditionDomain(),
  (substate) => substate.get('state')
);

export default makeSelectEdition;
export {
  selectEditionDomain,
  makeSelectPhaseSubjectList,
  makeSelectPhaseSubject,
  makeSelectEditionList,
  makeSelectEdition,
  makeSelectInputDto,
  makeSelectCrudId,
  makeSelectModalAttr,
  makeSelectBuList,
  makeSelectClassTypeCode,
  makeSelectAddedState,
  makeSelectEdtionType
};
