import { createSelector } from 'reselect';

/**
 * Direct selector to the personMsgManager state domain
 */
const selectPersonMsgManagerDomain = () => (state) => state.get('personMsgManager');

const makeSelectPersonMsgManager = () => createSelector(
  selectPersonMsgManagerDomain(),
  (substate) => substate.toJS()
);
const makeUserMsg = () => createSelector(
  selectPersonMsgManagerDomain(),
  (substate) => substate.get('userMsg')
);
const makeEditState = () => createSelector(
  selectPersonMsgManagerDomain(),
  (substate) => substate.get('editState')
);
const makeStateNum = () => createSelector(
  selectPersonMsgManagerDomain(),
  (substate) => substate.get('stateNum')
);
const makeTagIndex = () => createSelector(
  selectPersonMsgManagerDomain(),
  (substate) => substate.get('tagIndex')
);
const makeInputDTO = () => createSelector(
  selectPersonMsgManagerDomain(),
  (substate) => substate.get('PayInputDTO')
);
const makePayInfo = () => createSelector(
  selectPersonMsgManagerDomain(),
  (substate) => substate.get('payInfo')
);
const makeBankList = () => createSelector(
  selectPersonMsgManagerDomain(),
  (substate) => substate.get('bankList')
);
const makeProvinceList = () => createSelector(
  selectPersonMsgManagerDomain(),
  (substate) => substate.get('provinceList')
);
const makeAreaList = () => createSelector(
  selectPersonMsgManagerDomain(),
  (substate) => substate.get('areaList')
);
const makeQrcodeUrl = () => createSelector(
  selectPersonMsgManagerDomain(),
  (substate) => substate.get('qrcodeUrl')
);
const makeSelectedDate = () => createSelector(
  selectPersonMsgManagerDomain(),
  (substate) => substate.get('selecteddata')
);
const makePageIndex = () => createSelector(
  selectPersonMsgManagerDomain(),
  (substate) => substate.get('pageIndex')
);
const makeSalarydata = () => createSelector(
  selectPersonMsgManagerDomain(),
  (substate) => substate.get('salarydata')
);
const makePaperdata = () => createSelector(
  selectPersonMsgManagerDomain(),
  (substate) => substate.get('paperData')
);
const makeShowPaperMsg = () => createSelector(
  selectPersonMsgManagerDomain(),
  (substate) => substate.get('showPaperMsg')
);
const makePersonalTableMsg = () => createSelector(
  selectPersonMsgManagerDomain(),
  (substate) => substate.get('personalTableMsg')
);

export default makeSelectPersonMsgManager;
export {
  selectPersonMsgManagerDomain,
  makeUserMsg,
  makeEditState,
  makeStateNum,
  makeTagIndex,
  makeInputDTO,
  makePayInfo,
  makeBankList,
  makeProvinceList,
  makeAreaList,
  makeQrcodeUrl,
  makeSelectedDate,
  makePageIndex,
  makeSalarydata,
  makePaperdata,
  makeShowPaperMsg,
  makePersonalTableMsg,
};
