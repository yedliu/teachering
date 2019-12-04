/* eslint-disable no-case-declarations */
/* eslint-disable array-callback-return */
import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import Config from 'utils/config';
import { fromJS } from 'immutable';
import request, {  getjsonoptions, geturlnoauthoptions } from 'utils/request';
import AppLocalStorage from 'utils/localStorage';
import { message } from 'antd';
import {
  SUBMIT_CHANGE_MSG_ACTION, GET_USER_MSG_ACTION,
  PAY_MENT_INFO,
  GET_BANK_LIST,
  GET_PROVINCE_LIST,
  GET_AREA_LIST_ACTION,
  SUBMIT_ACTION,
  GET_QRCODE_URL,
  GET_PAY_DATA_ACTION,
  GET_PAPER_INFO_ACTION,
  GET_PERSONAL_MSG_ACTION,
} from './constants';
import {
  changeIsSubmitIngAction,
  changeEditStateAction,
  setUserMsgAction,
  setPayInputDto,
  setPayInfo,
  setBankList,
  setProvinceIdAction,
  setAreaListAction,
  getPaymentInfo,
  setQrcodeUrl,
  getAreaListAction,
  setSalaryData,
  setShowPaperMsgAction,
  setPersonalMsgAction,
} from './actions';
import {
  makeUserMsg,
  makeInputDTO,
  makeProvinceList,
  makeSelectedDate,
  makePageIndex,
  makeShowPaperMsg,
  makePersonalTableMsg,
} from './selectors';
import regionApi from 'api/qb-cloud/region-end-point';
import userApi from 'api/tr-cloud/user-endpoint';
import workloadApi from 'api/qb-cloud/workload-endpoint';
import paymentApi from 'api/qb-cloud/salary-standard-config-end-point';
import examPaperApi from 'api/qb-cloud/exam-paper-end-point';

// 获取省份
export function* getProvinceIdList() {
  try {
    const res = yield call(regionApi.getProvince);
    switch (res.code.toString()) {
      case '0':
        yield put(setProvinceIdAction(fromJS(res.data)));
        // yield put(setSelected(selected.set('grade',res.data[0].id)));
        break;
      default:
        console.error(Response.message || '出错');
        break;
    }
  } catch (e) {
    console.error('出错啦~', e);
  }
}
// 获取市
export function* getCityList() {
  const Dto = yield select(makeInputDTO());
  const Dtojs = Dto.toJS();
  const provinceList = yield select(makeProvinceList());
  const province = Dtojs.bankProvince || {};
  let id;
  if (province) {
    provinceList.map(e => {
      if (e.get('name') === province.value) {
        id = e.get('id');
      }
    });
  }
  if (!id) {
    return;
  }
  try {
    const res = yield call(regionApi.getCityByProvinceId, id);
    console.log(res);
    switch (res.code) {
      case '0':
        yield put(setAreaListAction(fromJS(res.data)));
        break;
      default:
        console.error(Response.message || '出错');
        break;
    }
  } catch (e) {
    console.error('出错啦~', e);
  }
}
// 获取银行信息
export function* getBankList() {
  try {
    const repos = yield call(paymentApi.queryBankInfo);
    switch (repos.code.toString()) {
      case '0':
        yield put(setBankList(fromJS(repos.data)));
        break;
      default:
    }
  } catch (e) {
    console.error('getBankList', e);
  }
}
// 获取支付信息
export function* getPayInfo() {
  try {
    const repos = yield call(paymentApi.getUserPayment);
    switch (repos.code.toString()) {
      case '0':
        const data = repos.data || {};
        yield put(setPayInfo(fromJS(data)));
        yield put(setPayInputDto(fromJS({
          idCardNumber: { value: data.idCardNumber },
          bankAccount: { value: data.bankAccount },
          bankName: { value: data.bankName },
          bankProvince: { value: data.bankProvince },
          bankCity: { value: data.bankCity },
          bankBranch: { value: data.bankBranch },
          bankAccountMobile: { value: data.bankAccountMobile },
          remark: { value: data.remark },
          bankAccountUsername: { value: data.bankAccountUsername }
        })));
        yield put(getAreaListAction());
        yield put(setQrcodeUrl(data.gongmallUrl || ''));
        break;
      default:
    }
  } catch (e) {
    console.error('getPayInfo', e);
  }
}
// Individual exports for testing
export function* getUserMsg() {
  const usrId = AppLocalStorage.getUserInfo().id;
  try {
    const repos = yield call(userApi.getOne, usrId);
    switch (repos.code.toString()) {
      case '0':
        if (repos.data) {
          yield put(setUserMsgAction(fromJS({
            name: repos.data.name || '',
            mobile: repos.data.mobile || '',
            power: repos.data.roleList.map((item) => item.name) || '',
            dataPower: repos.data.phaseSubjectList.map((item) => item.name) || [],
            id: repos.data.id || '',
            phaseSubjectIdList: repos.data.phaseSubjectList.map((item) => item.id) || [],
            roleIdList: repos.data.roleList.map((item) => item.id) || [],
          })));
          yield put(changeIsSubmitIngAction(2));
        } else {
          message.warn('数据异常。');
          yield put(setUserMsgAction(fromJS({})));
          yield put(changeIsSubmitIngAction(3));
        }
        break;
      default:
        message.warn(repos.message || '系统异常导致获取信息失败。');
        yield put(changeIsSubmitIngAction(3));
        break;
    }
  } catch (err) {
    console.log(err);
    yield put(changeIsSubmitIngAction(3));
    message.error('执行错误导致获取失败，请刷新后再次尝试');
  }
}
export function* submitChangeMsg() {
  const userMsg = yield select(makeUserMsg());
  const userInfo = AppLocalStorage.getUserInfo();
  // const requestURL = `${Config.trlink}/api/user/${userInfo.id}`;
  const name = userMsg.get('name');
  const mobile = userMsg.get('mobile');
  const phaseSubjectIdList = userMsg.get('phaseSubjectIdList');
  const roleIdList = userMsg.get('roleIdList');

  // name.replace(/^([\u4e00-\u9fa5])((·|[\u4e00-\u9fa5]+){1,4})?[\u4e00-\u9fa5]+([（(][\u4e00-\u9fa5]+[）)])?$/, '');
  if (!/^([\u4e00-\u9fa5])((·|[\u4e00-\u9fa5]+){1,4})?[\u4e00-\u9fa5]+([（(][\u4e00-\u9fa5]+[）)])?$/.test(name) || name.length < 2 || name.length > 10) {
    message.warn('姓名必须为2-10位的中文或点、括号组成。');
    return;
  }
  const params = {
    name,
    mobile,
    phaseSubjectIdList,
    roleIdList
  };
  // return;
  const hide = message.loading('正在提交...', 0);
  try {
    const repos = yield call(userApi.update, userInfo.id, params);
    // const requestURL = `${Config.trlink}/api/user/${userInfo.id}`;
    // const repos = yield call(request, requestURL, Object.assign({}, putjsonoptions(), { body: JSON.stringify(params) }));
    switch (repos.code.toString()) {
      case '0':
        hide();
        message.success('修改成功');
        yield put(changeEditStateAction(false));
        userInfo.name = name;
        yield AppLocalStorage.setUserInfo(userInfo);
        setTimeout(() => {
          location.reload();
        }, 300);
        break;
      default:
        hide();
        message.error(repos.message || '修改失败');
        break;
    }
  } catch (err) {
    console.error(err);
    hide();
    message.error('提交失败');
  }
}
export function* submit() {
  const inputDTO = yield select(makeInputDTO());
  const inputDTOJS = inputDTO.toJS();
  let params = {};
  // eslint-disable-next-line guard-for-in
  for (let v in inputDTOJS) {
    params[v] = inputDTOJS[v].value;
  }
  // const requestURL = `${Config.trlink}/api/user/updateSalaryPayment`;
  console.log('params', params);
  try {
    const res = yield userApi.updateSalaryPayment(params);
    // call(request, requestURL, Object.assign({}, postjsonoptions(), { body: JSON.stringify(params) }));
    switch (res.code.toString()) {
      case '0':
        message.success('保存成功');
        yield put(getPaymentInfo());
        // yield put(getQrcodeUrl())
        break;
      default:
        message.warning(res.message || '保存失败');
        console.log('出错');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}
export function* getQRCodeUrl() {
  const mobile = AppLocalStorage.getMobile();
  const username = AppLocalStorage.getUserName();
  const data = yield select(makeInputDTO());
  const dataJS = data.toJS();
  const idCardNumber = dataJS.idCardNumber;
  const bankName = dataJS.bankName;
  const bankAccount = dataJS.bankAccount;
  const requestURL = `${Config.chaturl}/api/teacherSalaryAccount/getGongmallUrl`;

  try {
    const repos = yield call(request, requestURL, Object.assign({}, geturlnoauthoptions()), { mobile, username, idCardNumber: idCardNumber.value, bankName: bankName.value, bankAccount: bankAccount.value });
    switch (repos.code.toString()) {
      case '1':
        yield put(setQrcodeUrl(repos.data));
        break;
      case '0':
        message.error('生成二维码失败！');
      // eslint-disable-next-line no-fallthrough
      default:
        break;
    }
  } catch (err) {
    console.log('getQRCodeUrl', err);
  }


}

export function* getPayData() {
  const selectedDate = yield select(makeSelectedDate());
  const pageIndex = yield select(makePageIndex());
  const startDateInit = selectedDate.get('startDate');
  const endDateInit = selectedDate.get('endDate');
  if (!startDateInit) {
    message.info('请选择开始时间');
    return;
  }
  if (!endDateInit) {
    message.info('请选择结束时间');
    return;
  }
  startDateInit.hours(0);
  startDateInit.minutes(0);
  startDateInit.seconds(0);
  startDateInit.milliseconds(0);
  const start = startDateInit.format();
  endDateInit.hours(23);
  endDateInit.minutes(59);
  endDateInit.seconds(59);
  endDateInit.milliseconds(999);
  const end = endDateInit.format();
  // console.log(endDateInit.format(), 'millisecond()');
  if (start.replace('/', '') > end.replace('/', '')) {
    message.info('开始时间不能小于结束时间');
    return;
  }
  const startDate = new Date(start);
  const endDate = new Date(end);
  const days = (endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24;
  if (days > 60) {
    message.info('所隔天数不能超过60天');
    return;
  }
  const params = {
    startDate,
    endDate,
    pageIndex,
    pageSize: 10,
  };
  try {
    const repos = yield call(workloadApi.findSelf, params);
    // console.log('res', repos);
    switch (repos.code.toString()) {
      case '0':
        yield put(setSalaryData(fromJS(repos.data)));
        break;
      default:
        break;
    }
  } catch (e) {
    console.error('出错啦~', e);
  }
}
export function* getPaperInfo(id) {
  // const requestURL = `${Config.trlink_qb}/api/examPaper/${id.val}`;
  const bigMsg = [];
  const questionsList = [];
  const showMsg = yield select(makeShowPaperMsg());
  try {
    const res = yield examPaperApi.getOnePaperForCut({ examPaperId: id.val });
    // call(request, requestURL, Object.assign({}, getjsonoptions()));
    console.log('res', res);
    switch (res.code.toString()) {
      case '0':
        // yield put(setPaperData(fromJS(res.data)));
        if (!res.data.examPaperContentOutputDTOList || res.data.examPaperContentOutputDTOList.length <= 0) {
          message.warn('该试卷还未录入或录入数据为空。');
        } else {
          console.log('res.data.examPaperContentOutputDTOList', res.data.examPaperContentOutputDTOList);
          res.data.examPaperContentOutputDTOList.forEach((item, index) => {
            bigMsg.push({ count: item.examPaperContentQuestionOutputDTOList.length, name: item.name, serialNumber: item.serialNumber });
            item.examPaperContentQuestionOutputDTOList.forEach((it, i) => {
              questionsList.push(it);
            });
          });
          yield put(setShowPaperMsgAction(showMsg.set('showView', true).set('questionList', fromJS(questionsList || [])).set('bigMsg', fromJS(bigMsg) || []).set('paperData', fromJS(res.data))));
        }
        break;
      default:
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}

export function* getPersonalMsg() {
  console.log('saga start');
  const requestURL = `${Config.trlink_qb}/api/workload/findPersonal`;
  const personalTableMsg = yield select(makePersonalTableMsg());
  const userInfo = AppLocalStorage.getUserInfo() || {};
  console.log('personalTableMsg', personalTableMsg.toJS());
  const params = {
    pageIndex: personalTableMsg.get('currentPageNumber'),
    pageSize: personalTableMsg.get('size'),
    workerUserId: userInfo.id,
  };
  console.log(params, 'params');
  if (params.workerUserId <= 0) {
    message.warn('获取明细数据失败');
    return;
  }
  try {
    const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params);
    switch (repos.code.toString()) {
      case '0':
        yield put(setPersonalMsgAction(personalTableMsg
          .set('total', repos.data.page.total || 0)
          // .set('size', repos.data.size || 10)
          .set('data', fromJS((repos.data.page.data)))
        ));
        break;
      default:
        yield put(setPersonalMsgAction(personalTableMsg
          .set('total', 0)
          // .set('size', 10)
          .set('data', fromJS([]))
          .set('currentPageNumber', 1)
        ));
        break;
    }
  } catch (err) {

  }
}

export function* getUserMsgSage() {
  const watcher = yield takeLatest(GET_USER_MSG_ACTION, getUserMsg);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* submitChangeMsgSaga() {
  const watcher = yield takeLatest(SUBMIT_CHANGE_MSG_ACTION, submitChangeMsg);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getPaymentInfoSaga() {
  const watcher = yield takeLatest(PAY_MENT_INFO, getPayInfo);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getBankListsagas() {
  const watcher = yield takeLatest(GET_BANK_LIST, getBankList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getProvinceListSaga() {
  const watcher = yield takeLatest(GET_PROVINCE_LIST, getProvinceIdList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getAreaListSaga() {
  const watcher = yield takeLatest(GET_AREA_LIST_ACTION, getCityList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* submitSagas() {
  const watcher = yield takeLatest(SUBMIT_ACTION, submit);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getQRCodeUrlSaga() {
  const watcher = yield takeLatest(GET_QRCODE_URL, getQRCodeUrl);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getPayDataSaga() {
  const watcher = yield takeLatest(GET_PAY_DATA_ACTION, getPayData);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getPaperInfoSaga() {
  const watcher = yield takeLatest(GET_PAPER_INFO_ACTION, getPaperInfo);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getPersonalMsgSaga() {
  const watcher = yield takeLatest(GET_PERSONAL_MSG_ACTION, getPersonalMsg);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded
export default [
  getUserMsgSage,
  submitChangeMsgSaga,
  getPaymentInfoSaga,
  getBankListsagas,
  getAreaListSaga,
  getProvinceListSaga,
  submitSagas,
  getQRCodeUrlSaga,
  getPayDataSaga,
  getPaperInfoSaga,
  getPersonalMsgSaga,
];
