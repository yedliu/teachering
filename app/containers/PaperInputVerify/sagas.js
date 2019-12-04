import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import Config from 'utils/config';
import { fromJS } from 'immutable';
import request, { postjsonoptions, getjsonoptions } from 'utils/request';
import { message } from 'antd';
import {
  changeDataIsLoadingAction,
  changeBtnCanClickAction,
  changeBackPromptAlertShowAction
} from 'containers/LeftNavC/actions';
import { changeVerifyCodeAction } from 'containers/Header/actions';
import { makeVerificationCode } from 'containers/Header/selectors';
import { backfromZmStand, toString } from 'components/CommonFn';
import { validateSavedQuestion } from 'components/EditItemQuestion/common';
import {
  GET_PAPER_MSG_ACTION,
  CHANGE_NEED_VERIFY_PAPER_ID_ACTION,
  GET_ALL_QUESTION_TYPE_LIST_ACTION,
  SUBMIT_QUESTION_CUT_VERIFY_ACTION,
  CHANGE_SORT_ACTION,
  SUBMIT_QUESTION_ITEM_ACTION,
} from './constants';
import {
  changeNotGetPaperCountAction,
  changeHasGetPaperCountAction,
  setPaperListAction,
  changePaperNeedVerifyAction,
  changePageStateAction,
  changeQuestionListAction,
  changeQuestionMsgListAction,
  changeRealQuestionsCountAction,
  changeQuestionResultAction,
  setAllQuestionTypeListAction,
  setPaperDownloadMsgAction,
  changeShowSubmitBtnAction,
  initVerifyDataAction,
  changeQuestionEditStateAction,
  setClickTargetAction,
  changeNeedVerifyPaperIdAction,
} from './actions';
import {
  makePageSize,
  makePageIndex,
  makePaperState,
  makePaperNeedVerifyId,
  makeQuestionResult,
  makeRealQuestionsCount,
  makeSort,
  makeNewQuestion,
  makeQuestionSelectedIndex,
  makeQuestionMsgList,
} from './selectors';
import { filterCartoon } from 'utils/templateMapper';

// 获取 paperList
export function* getPaperMsg() {
  const requestURL = `${Config.trlink_qb}/api/examPaper`;
  const pageSize = yield select(makePageSize());
  const pageIndex = yield select(makePageIndex());
  const state = yield select(makePaperState());
  const sort = yield select(makeSort());
  const params1 = { pageSize, pageIndex, sort, stateStr: '6,13' };
  const params2 = { pageSize, pageIndex, sort, stateStr: '', userRole: 4 };
  try {
    yield put(changeDataIsLoadingAction(true));
    if (state === 6) {
      const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params1);
      switch (repos.code.toString()) {
        case '0':
          yield put(changeNotGetPaperCountAction(repos.data.total));
          yield put(setPaperListAction(fromJS(repos.data.data)));
          break;
        default:
          yield put(changeNotGetPaperCountAction(0));
          yield put(setPaperListAction(fromJS([])));
          message.warning(repos.message || '系统异常，请稍等片刻后再次尝试');
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
    } else if (state === 7) {
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
    message.warning('系统异常');
    yield put(changeDataIsLoadingAction(false));
  }
}

// 获取要审核的试卷
export function* getPaperNeedVerify() {
  const needVerifyPaper = yield select(makePaperNeedVerifyId());
  const verificationCode = yield select(makeVerificationCode());
  const requestURL = `${Config.trlink_qb}/api/examPaper/${needVerifyPaper.get('id')}/action/preAuditEntry`;
  const questionsList = [];
  const questionMsgList = [];
  const questionResult = (yield select(makeQuestionResult())).toJS(); // 合并已有的
  let realQuestionsCount = 0;
  const params = { captcha: verificationCode.get('code') };
  // if (needVerifyPaper.get('state') === 6 && !params.captcha) {
  //   message.warning('请输入验证码后再提交！');
  //   return;
  // }
  try {
    const repos = yield call(request, requestURL, Object.assign({ body: JSON.stringify(params) }, postjsonoptions()));
    switch (repos.code.toString()) {
      case '0':
        yield put(changeVerifyCodeAction('default'));
        yield put(setPaperDownloadMsgAction(fromJS({
          fileUrl: repos.data.fileUrl,
          fileName: `${repos.data.name}(${repos.data.year})`
        })));
        yield repos.data.examPaperContentOutputDTOList.map((item) => {  // eslint-disable-line
          questionsList.push({
            name: item.name,
            count: item.examPaperContentQuestionOutputDTOList.length,
            serialNumber: item.serialNumber,
          });
          item.examPaperContentQuestionOutputDTOList.map((it) => {  // eslint-disable-line
            // console.log(it, it.questionId, 'iii')
            const question = {
              id: it.id,
              questionId: it.questionId,
              epcId: item.id,
              epId: repos.data.id,
              bigNum: item.serialNumber,
              bigName: item.name,
              picUrl: it.questionOutputDTO.picUrl,
              questionTypeId: it.questionOutputDTO.typeId,
              questionType: it.questionOutputDTO.questionType,
              serialNumber: it.serialNumber,
              title: backfromZmStand(it.questionOutputDTO.title || ''),
              analysis: backfromZmStand(it.questionOutputDTO.analysis || ''),
              answerList: (it.questionOutputDTO.answerList || []).map((iit) => backfromZmStand(iit)),
              typeId: it.questionOutputDTO.typeId,
              optionList: (it.questionOutputDTO.optionList || []).map((iit) => backfromZmStand(iit)),
              templateTypeId: it.questionOutputDTO.templateType || -1,
              templateType: it.questionOutputDTO.templateType || -1,
              gradeId: it.questionOutputDTO.gradeId,
              subjectId: it.questionOutputDTO.subjectId,
              score: it.questionOutputDTO.score,
            };
            if (it.questionOutputDTO.children && it.questionOutputDTO.children.length > 0) {
              question.children = it.questionOutputDTO.children.map((itt) => {
                return {
                  score: itt.score,
                  title: backfromZmStand(itt.title || ''),
                  optionList: (itt.optionList || []).map((iit) => backfromZmStand(iit)),  // eslint-disable-line
                  answerList: (itt.answerList || []).map((iit) => backfromZmStand(iit)),  // eslint-disable-line
                  analysis: backfromZmStand(itt.analysis || ''),
                  typeId: itt.typeId,
                  subQuestionId: itt.questionId,
                  id: itt.id,
                };
              });
            }
            questionMsgList.push(question);
            const has = questionResult.some(e => `${e.questionId}` === `${it.questionId}`); // 合并现有的数据
            if (!has) {
              questionResult.push({
                auditResult: true,
                questionId: it.questionId,
                errType: 0,
                errReason: '',
                errState: -1,
              });
            }
            realQuestionsCount += 1;
          });
        });
        yield put(changeQuestionListAction(fromJS(questionsList)));
        yield put(changeQuestionMsgListAction(fromJS(questionMsgList)));
        yield put(changePaperNeedVerifyAction(fromJS(repos.data)));
        yield put(changeRealQuestionsCountAction(realQuestionsCount));
        yield put(changeQuestionResultAction(fromJS(questionResult)));
        yield put(changePageStateAction(1));
        break;
      default:
        message.error(repos.message || '系统异常');
        // yield put(changeVerifyCodeAction('default'));
        break;
    }
  } catch (err) {
    // err Msg
    message.warning('系统异常');
    // yield put(changeVerifyCodeAction('default'));
    console.log(err);
  }
}

// 获取题型列表
export function* getAllQuestionTypeList() {
  const requestURL = `${Config.trlink_qb}/api/questionType`;
  try {
    const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()));
    switch (repos.code.toString()) {
      case '0':
        console.log(repos, 'getPaperMsg -- saga -- 21');
        yield put(setAllQuestionTypeListAction(filterCartoon(fromJS(repos.data))));
        break;
      // case '1':
      // if (repos.message) {
      //   message.warning(repos.message);
      // } else {
      //   message.warning('系统异常，请稍等片刻后尝试再次');
      // }
      // break;
      default:
        yield put(setAllQuestionTypeListAction(fromJS([])));
        message.warning(repos.message || '系统异常，请稍等片刻后尝试再次');
        break;
    }
  } catch (err) {
    // err Msg
    message.warning('系统异常');
  }
}

// 提交审核后的试卷
export function* submitQuestionCutVerify() {
  const needVerifyPaper = yield select(makePaperNeedVerifyId());
  const requestURL = `${Config.trlink_qb}/api/examPaper/${needVerifyPaper.get('id')}/action/auditEntry`;
  const questionResult = yield select(makeQuestionResult());
  const realQuestionsCount = yield select(makeRealQuestionsCount());
  const hadVerifyCount = questionResult.filter((item) => item.get('errState') !== -1).count();
  // console.log(hadVerifyCount, realQuestionsCount);
  if (hadVerifyCount < realQuestionsCount) {
    message.error('请审核完所有题目!');
    return;
  }
  // console.log(questionResult.toJS(), 'questionResult -- 194');
  const auditExamPaperDTO = {
    auditResult: questionResult.every((item) => item.get('auditResult')),
    epId: needVerifyPaper.get('id'),
    auditCutExamPaperQuesDTOList: questionResult.map((item) => {
      return {
        auditResult: item.get('auditResult'),
        questionId: item.get('questionId'),
        errType: item.get('errType'),
        errReason: item.get('errReason'),
      };
    }).toJS(),
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
      case '1':
      default:
        // if (repos.message) {
        //   message.warning(repos.message);
        // } else {
        message.warning(repos.message || '系统异常');
        // }
        break;
    }
    yield put(changeShowSubmitBtnAction(false));
    yield put(changeBtnCanClickAction(true));
  } catch (err) {
    // err Msg
    yield put(changeBtnCanClickAction(true));
    message.error('提交失败');
  }
}

export function* submitQuestionItem() {
  const requestURL = `${Config.trlink_qb}/api/examPaper/updateQuestion`;
  const newQuestion = yield select(makeNewQuestion());
  const questionIndex = yield select(makeQuestionSelectedIndex());
  const questionMsgList = yield select(makeQuestionMsgList());
  // const pointLists = yield select(makePointList());
  // const info = yield select(makeCommoninfo());
  const newQuestionItem = newQuestion.toJS();
  // console.log(newQuestionItem, 'sdfsf');
  const params = {
    epId: newQuestionItem.epId,
    epcId: newQuestionItem.epcId,
    score: (newQuestionItem.templateType === 1 && newQuestionItem.children && newQuestionItem.children.length > 0) ? newQuestionItem.children.map((item) => (item.score || 3)).reduce((a, b) => a + b) : (newQuestionItem.score || 3),
    questionInputDTO: {
      // examPointIdList: newQuestionItem.examPointIdList,
      id: newQuestionItem.questionId,
      // knowledgeIdList: newQuestionItem.knowledgeIdList,
      analysis: newQuestionItem.analysis,
      answerList: newQuestionItem.answerList,
      optionList: newQuestionItem.optionList,
      title: newQuestionItem.title,
      typeId: newQuestionItem.typeId,
      templateType: newQuestionItem.templateType,
      score: (newQuestionItem.templateType === 1 && newQuestionItem.children && newQuestionItem.children.length > 0) ? newQuestionItem.children.map((item) => (item.score || 3)).reduce((a, b) => a + b) : (newQuestionItem.score || 3),
      // difficulty: newQuestionItem.difficulty,
      // distinction: newQuestionItem.distinction,
      // rating: newQuestionItem.rating,
      // comprehensiveDegreeId: newQuestionItem.comprehensiveDegreeId,
    },
  };
  // console.log('newQuestionItem', newQuestionItem);
  if (newQuestionItem.templateType === 1 && newQuestionItem.children && newQuestionItem.children.length > 0) {
    params.questionInputDTO.subQuestionInputDTOList = newQuestionItem.children.map((item) => {
      return {
        id: item.id,
        analysis: item.analysis,
        answerList: item.answerList,
        optionList: item.optionList,
        title: item.title,
        subQuestionId: item.subQuestionId,
        typeId: item.typeId,
        score: item.score,
        // knowledgeIdList: item.knowledgeIdList || [],
        // examPointIdList: item.examPointIdList || [],
      };
    });
  }
  const questionInputDTO = params.questionInputDTO;
  questionInputDTO.children = questionInputDTO.subQuestionInputDTOList;
  const error = validateSavedQuestion(fromJS(questionInputDTO));
  if (error) {
    message.warn(error);
    return;
  }
  try {
    yield put(changeBackPromptAlertShowAction(true));
    const repos = yield call(request, requestURL, Object.assign({}, postjsonoptions(), { body: JSON.stringify(params) }));
    if (toString(repos.code) === '0') {
      // console.log(questionMsgList.toJS(), newQuestion.toJS(), 'questionMsgList - questionMsgList');
      const newQuestionsList = questionMsgList.set(questionIndex - 1, newQuestion);
      yield put(changeQuestionMsgListAction(newQuestionsList));
      yield put(changeQuestionEditStateAction(0));
      yield put(setClickTargetAction(''));
      // 刷下页面数据
      const needVerifyPaper = yield select(makePaperNeedVerifyId());
      // console.log(needVerifyPaper, '----aaa')
      yield put(changeNeedVerifyPaperIdAction(needVerifyPaper));
    } else {
      message.warn('系统错误导致修改失败，请稍后再尝试');
    }
    yield put(changeBackPromptAlertShowAction(false));
  } catch (err) {
    yield put(changeBackPromptAlertShowAction(false));
    console.log(err);
    message.error('执行错误导致修改失败，请重新尝试');
  }
}

export function* getPaperMsgSaga() {
  const watcher = yield takeLatest(GET_PAPER_MSG_ACTION, getPaperMsg);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getPaperNeedVerifySaga() {
  const watcher = yield takeLatest(CHANGE_NEED_VERIFY_PAPER_ID_ACTION, getPaperNeedVerify);
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

export function* submitQuestionItemSaga() {
  const watcher = yield takeLatest(SUBMIT_QUESTION_ITEM_ACTION, submitQuestionItem);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded
export default [
  // defaultSaga,
  getPaperMsgSaga,
  getPaperNeedVerifySaga,
  getAllQuestionTypeListSaga,
  submitQuestionCutVerifySaga,
  getPaperMsgFromSort,
  submitQuestionItemSaga,
];
