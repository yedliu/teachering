import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import Config from 'utils/config';
import { fromJS } from 'immutable';
import request, { postjsonoptions,  getjsonoptions } from 'utils/request';
import { message } from 'antd';
import { changeDataIsLoadingAction, changeBtnCanClickAction } from 'containers/LeftNavC/actions';
import { changeVerifyCodeAction } from 'containers/Header/actions';
import { makeVerificationCode } from 'containers/Header/selectors';
import {
  GET_PAPER_MSG_ACTION, CHANGE_NEED_VERIFY_PAPER_ID_ACTION, GET_ALL_QUESTION_TYPE_LIST_ACTION, SUBMIT_QUESTION_CUT_VERIFY_ACTION,
  CHANGE_SORT_ACTION,
} from './constants';
import {
  makePageIndex, makePaperState, makePageSize, makeNeedVerifyPaper, makeQuestionResult,
  makeRealQuestionsCount, makeSort,
} from './selectors';
import {
  setPaperListAction, changeNotGetPaperCountAction, changeHasGetPaperCountAction, changeQuestionListAction, changePageStateAction,
  changeQuestionMsgListAction, changeCurrentPaperItemAction, setAllQuestionTypeListAction, changeQuestionResultAction, changeRealQuestionsCountAction,
  initVerifyDataAction, setPaperDownloadMsgAction,
} from './actions';

// 获取 paperList
export function* getPaperMsg() {
  const requestURL = `${Config.trlink_qb}/api/examPaper`;
  const pageSize = yield select(makePageSize());
  const pageIndex = yield select(makePageIndex());
  const state = yield select(makePaperState());
  const sort = yield select(makeSort());
  const params1 = { pageSize, pageIndex, sort, stateStr: '2,12' };
  const params2 = { pageSize, pageIndex, sort, stateStr: '', userRole: 2 };
  try {
    yield put(changeDataIsLoadingAction(true));
    if (state === 2) {
      const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params1);
      switch (repos.code.toString()) {
        case '0':
          yield put(changeNotGetPaperCountAction(repos.data.total));
          yield put(setPaperListAction(fromJS(repos.data.data)));
          break;
        default:
          yield put(changeNotGetPaperCountAction(0));
          yield put(setPaperListAction(fromJS([])));
          // if (repos.message) {
          //   message.warning(repos.message);
          // } else {
          message.warning(repos.message || '系统异常，请稍等片刻后尝试再次');
          // }
          break;
      }
      yield put(changeDataIsLoadingAction(false));
      const res = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params2);
      switch (res.code.toString()) {
        case '0':
          yield put(changeHasGetPaperCountAction(res.data.total));
          break;
        default:
          if (res.message) {
            message.warning(res.message);
          } else {
            message.warning('获取已审核试卷数量异常');
          }
          break;
      }
    } else if (state === 3) {
      const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params2);
      switch (repos.code.toString()) {
        case '0':
          yield put(changeHasGetPaperCountAction(repos.data.total));
          yield put(setPaperListAction(fromJS(repos.data.data)));
          break;
        case '1':
          break;
        default:
          yield put(changeHasGetPaperCountAction(0));
          yield put(setPaperListAction(fromJS([])));
          // if (repos.message) {
          //   message.warning(repos.message);
          // } else {
          message.warning(repos.message || '系统异常，请稍等片刻后尝试再次');
          // }
          break;
      }
      yield put(changeDataIsLoadingAction(false));
      const res = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params1);
      switch (res.code.toString()) {
        case '0':
          yield put(changeNotGetPaperCountAction(res.data.total));
          break;
        case '1':
          break;
        default:
          if (res.message) {
            message.warning(res.message);
          } else {
            message.warning('获取未审核试卷数量异常');
          }
          break;
      }
    }
  } catch (err) {
    // err Msg
    yield put(changeDataIsLoadingAction(false));
  }
}
// 获取当前要审核的试卷信息
export function* getPaperToVerify() {
  const needVerifyPaper = yield select(makeNeedVerifyPaper());
  const verificationCode = yield select(makeVerificationCode());
  const requestURL = `${Config.trlink_qb}/api/examPaper/${needVerifyPaper.get('id')}/action/preAuditCut`;
  const questionsList = [];
  const questionMsgList = [];
  const questionResult = [];
  let realQuestionsCount = 0;
  const params = { captcha: verificationCode.get('code') };
  console.log(needVerifyPaper.toJS(), 'needVerifyPaper');
  if (needVerifyPaper.get('state') === 2 && !params.captcha) {
    message.warning('请输入验证码后再提交！');
    return;
  }
  try {
    const repos = yield call(request, requestURL, Object.assign({ body: JSON.stringify(params) }, postjsonoptions()));
    switch (repos.code.toString()) {
      case '0':
        yield put(changeVerifyCodeAction('default'));
        // console.log(repos, 'count -- 80');
        yield put(setPaperDownloadMsgAction(fromJS({ fileUrl: repos.data.fileUrl, fileName: `${repos.data.name}(${repos.data.year})` })));
        // if (repos.data.data.examPaperContentOutputDTOList.length <= 0) return;
        yield repos.data.examPaperContentOutputDTOList.forEach((item) => {
          questionsList.push({
            name: item.name,
            count: item.examPaperContentQuestionOutputDTOList.length,
            serialNumber: item.serialNumber,
          });
          item.examPaperContentQuestionOutputDTOList.forEach((it) => {
            questionMsgList.push({
              bigNum: item.serialNumber,
              bigName: item.name,
              picUrl: it.questionOutputDTO.picUrl,
              questionTypeId: it.questionOutputDTO.typeId,
              serialNumber: it.serialNumber,
            });
            questionResult.push({
              auditResult: true,
              questionId: it.questionId,
              errType: 0,
              errReason: '',
              errState: -1,
            });
            realQuestionsCount += 1;
          });
        });
        yield put(changeQuestionListAction(fromJS(questionsList)));
        yield put(changeQuestionMsgListAction(fromJS(questionMsgList)));
        yield put(changeCurrentPaperItemAction(fromJS(repos.data)));
        yield put(changeRealQuestionsCountAction(realQuestionsCount));
        yield put(changeQuestionResultAction(fromJS(questionResult)));
        yield put(changePageStateAction(1));
        break;
      default:
        message.error(repos.message || '系统异常');
        break;
    }
  } catch (err) {
    // err Msg
    console.log(err, 'err');
  }
}
// 获取题型列表
export function* getAllQuestionTypeList() {
  const requestURL = `${Config.trlink_qb}/api/questionType`;
  try {
    const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()));
    switch (repos.code.toString()) {
      case '0':
        // console.log(repos, 'getPaperMsg -- saga -- 21');
        yield put(setAllQuestionTypeListAction(fromJS(repos.data)));
        break;
      default:
        yield put(setAllQuestionTypeListAction(fromJS([])));
        break;
    }
  } catch (err) {
    // err Msg
  }
}
// 提交审核后的试卷
export function* submitQuestionCutVerify() {
  const needVerifyPaper = yield select(makeNeedVerifyPaper());
  const requestURL = `${Config.trlink_qb}/api/examPaper/${needVerifyPaper.get('id')}/action/auditCut`;
  const questionResult = yield select(makeQuestionResult());
  const realQuestionsCount = yield select(makeRealQuestionsCount());
  const hadVerifyCount = questionResult.filter((item) => item.get('errState') !== -1).count();
  // console.log(hadVerifyCount, realQuestionsCount);
  if (hadVerifyCount < realQuestionsCount) {
    alert('请审核完所有题目后再提交!');
    return;
  }
  const auditExamPaperDTO = {
    auditResult: questionResult.every((item) => item.get('auditResult')),
    epId: needVerifyPaper.get('id'),
    auditCutExamPaperQuesDTOList: questionResult.toJS(),
  };
  // console.log(auditExamPaperDTO, requestURL, 'auditExamPaperDTO ---- 132');
  try {
    const repos = yield call(request, requestURL, Object.assign({}, postjsonoptions(), { body: JSON.stringify(auditExamPaperDTO) }));
    switch (repos.code.toString()) {
      case '0':
        // console.log(repos, '提交成功，getPaperMsg -- saga -- 21');
        yield put(changePageStateAction(0));
        yield put(initVerifyDataAction());
        break;
      default:
        message.warn(repos.message || '提交失败');
        break;
    }
    yield put(changeBtnCanClickAction(true));
  } catch (err) {
    // err Msg
    message.warn('异常情况导致提交失败');
    yield put(changeBtnCanClickAction(true));
  }
}

export function* getPaperMsgSaga() {
  const watcher = yield takeLatest(GET_PAPER_MSG_ACTION, getPaperMsg);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getPaperToVerifySaga() {
  const watcher = yield takeLatest(CHANGE_NEED_VERIFY_PAPER_ID_ACTION, getPaperToVerify);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getAllQuestionTypeListSaga() {
  const watcher = yield takeLatest(GET_ALL_QUESTION_TYPE_LIST_ACTION, getAllQuestionTypeList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* submitQuestionCutVerifySaga() {
  const watcher = yield takeLatest(SUBMIT_QUESTION_CUT_VERIFY_ACTION, submitQuestionCutVerify);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getPaperMsgFromSort() {
  const watcher = yield takeLatest(CHANGE_SORT_ACTION, getPaperMsg);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded
export default [
  getPaperMsgSaga,
  getPaperToVerifySaga,
  getAllQuestionTypeListSaga,
  submitQuestionCutVerifySaga,
  getPaperMsgFromSort,
];
