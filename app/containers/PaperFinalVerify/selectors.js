import { createSelector } from 'reselect';

/**
 * Direct selector to the paperFinalVerify state domain
 */
const selectPaperFinalVerifyDomain = () => (state) => state.get('paperFinalVerify');

/**
 * Other specific selectors
 */


/**
 * Default selector used by PaperFinalVerify
 */

const makeSelectPaperFinalVerify = () => createSelector(
  selectPaperFinalVerifyDomain(),
  (substate) => substate.toJS()
);
const makePaperList = () => createSelector(
  selectPaperFinalVerifyDomain(),
  (substate) => substate.get('paperList'),
);
const makePaperParams = () => createSelector(
  selectPaperFinalVerifyDomain(),
  (substate) => substate.get('paperParams'),
);
const makePaperNumber = () => createSelector(
  selectPaperFinalVerifyDomain(),
  (substate) => substate.get('paperNumber')
);
const makeDataIsGetting = () => createSelector(
  selectPaperFinalVerifyDomain(),
  (substate) => substate.get('dataIsGetting')
);
const makePaperIndex = () => createSelector(
  selectPaperFinalVerifyDomain(),
  (substate) => substate.get('paperIndex')
);
const makePaperNeedVerifyId = () => createSelector(
  selectPaperFinalVerifyDomain(),
  (substate) => substate.get('paperNeedVerifyId')
);
const makePaperMsgData = () => createSelector(
  selectPaperFinalVerifyDomain(),
  (substate) => substate.get('paperMsgData')
);
const makeQuestionParams = () => createSelector(
  selectPaperFinalVerifyDomain(),
  (substate) => substate.get('questionParams')
);
const makeCommoninfo = () => createSelector(
  selectPaperFinalVerifyDomain(),
  (substate) => substate.get('commoninfo')
);
const makeQuestionsList = () => createSelector(
  selectPaperFinalVerifyDomain(),
  (substate) => substate.get('questionsList')
);
const makeBigQuestionMsg = () => createSelector(
  selectPaperFinalVerifyDomain(),
  (substate) => substate.get('bigQuestionMsg'),
);
const makeRemoveIndex = () => createSelector(
  selectPaperFinalVerifyDomain(),
  (substate) => substate.get('removeIndex'),
);
const makeQuestionTypeList = () => createSelector(
  selectPaperFinalVerifyDomain(),
  (substate) => substate.get('questionTypeList'),
);
const makeNewQuestion = () => createSelector(
  selectPaperFinalVerifyDomain(),
  (substate) => substate.get('newQuestion'),
);
const makePointList = () => createSelector(
  selectPaperFinalVerifyDomain(),
  (substate) => substate.get('pointList'),
);
const makeQuestionEditState = () => createSelector(
  selectPaperFinalVerifyDomain(),
  (substate) => substate.get('questionEditState'),
);
const makePaperDownloadMsg = () => createSelector(
  selectPaperFinalVerifyDomain(),
  (substate) => substate.get('paperDownloadMsg')
);
const makeClickTarget = () => createSelector(
  selectPaperFinalVerifyDomain(),
  (substate) => substate.get('clickTarget')
);
const makeInputDto = () => createSelector(
  selectPaperFinalVerifyDomain(),
  (substate) => substate.get('inputDto')
);
const makePaperMsgList = () => createSelector(
  selectPaperFinalVerifyDomain(),
  (substate) => substate.get('paperMsgList')
);
const maekIsAddOrEdit = () => createSelector(
  selectPaperFinalVerifyDomain(),
  (substate) => substate.get('isAddOrEdit')
);
const makePointIdList = () => createSelector(
  selectPaperFinalVerifyDomain(),
  (substate) => substate.get('pointIdList'),
);

export default makeSelectPaperFinalVerify;
export {
  selectPaperFinalVerifyDomain,
  makePaperList,
  makePaperParams,
  makePaperNumber,
  makeDataIsGetting,
  makePaperIndex,
  makePaperNeedVerifyId,
  makePaperMsgData,
  makeQuestionParams,
  makeCommoninfo,
  makeQuestionsList,
  makeBigQuestionMsg,
  makeRemoveIndex,
  makeQuestionTypeList,
  makeNewQuestion,
  makePointList,
  makeQuestionEditState,
  makePaperDownloadMsg,
  makeClickTarget,
  makeInputDto,
  makePaperMsgList,
  maekIsAddOrEdit,
  makePointIdList,
};
