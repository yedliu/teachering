import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';
import Config from 'utils/config';
import { toNumber } from 'components/CommonFn';
import request, { postjsonoptions, getjsonoptions } from 'utils/request';
import { message, Modal } from 'antd';
// import AppLocalStorage from 'utils/localStorage';
// import { loadImage } from './loadImages';
import { changeDataIsLoadingAction } from 'containers/LeftNavC/actions';
import { changeVerifyCodeAction } from 'containers/Header/actions';
import { makeVerificationCode } from 'containers/Header/selectors';
import { cutData } from './mockdata';

import {
  GET_PAPER_MSG_ACTION, GET_CUT_PAPER_TASK_ACTION, GET_CUT_PAPER_ITEM_ACTION, GET_ALL_QUESTION_TYPE_LIST_ACTION,
  SUNMIT_CUT_PAPER_ACTION, CHANGE_SORT_ACTION,
} from './constants';
import {
  setPaperListAction, changePaperCountAction, getPaperMsgAction, setPicUrlListAction,
  changePaperIsBeCutItemAction, setAllQuestionTypeListAction, changeHasGetPaperCountAction, changeAlertStatesAction,
  saveQuestionListAction,
  setEditorBigQuestionAction, changeIsSubmitIngAction,
  changeImgCountCriticalAction,
  changeImgStepAction,
  setPicInputDTOListAction,
} from './actions';
import {
  makePageIndex, makePaperState, makePageSize, makeCurrentPaperItem,
  makeNeedCutPaperId, makeQuestionsList, makeSort,
  makePicInputDTOList,
} from './selectors';
import { filterCartoon } from 'utils/templateMapper';

// 获取 paperList
export function* getPaperMsg() {
  const requestURL = `${Config.trlink_qb}/api/examPaper`;
  const pageSize = yield select(makePageSize());
  const pageIndex = yield select(makePageIndex());
  const sort = yield select(makeSort());
  const state = yield select(makePaperState());
  const params1 = { pageSize, pageIndex, sort, stateStr: '0' };
  const params2 = { pageSize, pageIndex, sort, stateStr: '', userRole: 1 };
  try {
    yield put(changeDataIsLoadingAction(true));
    if (state === 0) {
      const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params1);
      switch (repos.code.toString()) {
        case '0':
          yield put(changePaperCountAction(repos.data.total));
          yield put(setPaperListAction(fromJS(repos.data.data)));
          break;
        default:
          yield put(changePaperCountAction(0));
          yield put(setPaperListAction(fromJS([])));
          message.warning(repos.message || '系统异常，请稍等片刻后尝试再次');
          break;
      }
      yield put(changeDataIsLoadingAction(false));
      const res = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params2);
      switch (res.code.toString()) {
        case '0':
          yield put(changeHasGetPaperCountAction(res.data.total));
          break;
        default:
          message.warning(res.message || '获取已领取试卷数量异常');
          break;
      }
    } else if (state === 1) {
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
          message.warning(repos.message || '系统异常，请稍等片刻后尝试再次');
          break;
      }
      yield put(changeDataIsLoadingAction(false));
      const res = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params1);
      switch (res.code.toString()) {
        case '0':
          yield put(changePaperCountAction(res.data.total));
          break;
        case '1':
          break;
        default:
          message.warning(res.message || '获取未领取试卷数量异常');
          break;
      }
    }
    // const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params);
    // switch (repos.code.toString()) {
    //   case '0':
    //     console.log(repos.data.count, 'count -- 27');
    //     if (state === 0) {
    //       yield put(changePaperCountAction(repos.data.total));
    //     } else if (state === 1) {
    //       yield put(changeHasGetPaperCountAction(repos.data.total));
    //     }
    //     yield put(setPaperListAction(fromJS(repos.data.data.reverse())));
    //     break;
    //   default:
    //     break;
    // }
  } catch (err) {
    // err Msg
    yield put(changeDataIsLoadingAction(false));
  }
}
// 领取切割任务
export function* getCutPaperTask() {
  const id = yield select(makeCurrentPaperItem());
  const verificationCode = yield select(makeVerificationCode());
  // const id = paperItem.get('id');
  const requestURL = `${Config.trlink_qb}/api/examPaper/${id}/action/receiveCut`;
  const params = { captcha: verificationCode.get('code') };
  if (!params.captcha) {
    message.warning('请输入验证码后再提交！');
    return;
  }
  try {
    const repos = yield call(request, requestURL, Object.assign({ body: JSON.stringify(params) }, postjsonoptions()));
    switch (repos.code.toString()) {
      case '0':
        message.success('领取成功');
        yield put(changeVerifyCodeAction('default'));
        yield put(getPaperMsgAction());
        break;
      default:
        message.error(repos.message || '系统异常');
        // yield put(changeVerifyCodeAction('default'));
        break;
    }
  } catch (err) {
    // err Msg
    message.error('执行错误');
    // yield put(changeVerifyCodeAction('default'));
  }
}
// 获取要切割的单份试卷
export function* getCutPaperItem() {
  const id = yield select(makeNeedCutPaperId());
  const requestURL = `${Config.trlink_qb}/api/examPaper/${id}`;
  try {
    const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()));
    // console.log(repos, 'repos');
    switch (repos.code.toString()) {
      case '0': // eslint-disable-line
        const subjectId = repos.data.subjectId;
        yield put(changeImgCountCriticalAction(subjectId === 1 ? 15 : 10));
        yield put(changeImgStepAction(subjectId === 1 ? 10 : 8));
        yield put(setPicUrlListAction(fromJS(repos.data.picUrlList)));
        yield put(changePaperIsBeCutItemAction(fromJS(repos.data)));
        if ((repos.data.examPaperLongPicUrlOutputDTOList || []).length > 0) {
          const picInputDTOList = repos.data.examPaperLongPicUrlOutputDTOList.map((item, index) => {
            const oldChildren = (item.children || []);
            if (oldChildren.length <= 0) return { children: [] };
            const children = oldChildren.map((it) => ({ index: it.longPicIndex || it.picIndex, ySplit: it.ySplit || it.ysplit }));
            const start = (children[0] || { index: 0 }).index;
            const end = start + children.length;
            return {
              index,
              start,
              end,
              longPicUrl: item.longPicUrl,
              xLength: item.xLength || item.xlength,
              yLength: item.yLength || item.ylength,
              children,
            };
          });
          console.log(picInputDTOList, 'picInputDTOList');
          yield put(setPicInputDTOListAction(fromJS(picInputDTOList)));
        } else {
          yield put(setPicInputDTOListAction(fromJS([])));
        }
        if (repos.data.examPaperContentOutputDTOList.length > 0) {
          const questionsList = repos.data.examPaperContentOutputDTOList.map((item) => {
            // questionsList.push();
            return {
              name: item.name,
              // count: item.examPaperContentQuestionOutputDTOList.length,
              // serialNumber: item.serialNumber,
              children: item.examPaperContentQuestionOutputDTOList.map((it) => {
                return {
                  picUrl: it.questionOutputDTO.picUrl,
                  // smallSerialNumber: it.serialNumber,
                  smallTypeId: it.questionOutputDTO.typeId,
                  errState: it.questionOutputDTO.state === 2 ? -1 : (it.questionOutputDTO.state === 3 ? 0 : 1),
                  errReason: it.questionOutputDTO.errReason ? it.questionOutputDTO.errReason : '',
                  longPicIndex: it.questionOutputDTO.eplpuIndex || it.questionOutputDTO.picIndex,
                  x1: it.questionOutputDTO.x1,
                  x2: it.questionOutputDTO.x2,
                  y1: it.questionOutputDTO.y1,
                  y2: it.questionOutputDTO.y2,
                };
              }) || [],
            };
          });
          yield put(saveQuestionListAction(fromJS(questionsList)));
        } else {
          yield put(setEditorBigQuestionAction(fromJS({ name: '1', id: '1', value: '' })));
          // yield put(changeBigQuestiolnMsgShowAction(true));
        }
        break;
      default:
        message.warning(repos.message || '系统异常');
        yield put(changePaperIsBeCutItemAction(fromJS({ picUrlList: [] })));
        break;
    }
  } catch (err) {
    // err Msg
    console.log(err);
    // alert(err.message);
  }
}
// 获取题型列表
export function* getAllQuestionTypeList() {
  const requestURL = `${Config.trlink_qb}/api/questionType`;
  try {
    const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()));
    switch (repos.code.toString()) {
      case '0':
        yield put(setAllQuestionTypeListAction(filterCartoon(fromJS([{ id: -1, name: '请选择题型' }].concat(repos.data)))));
        break;
      case '1':
        if (repos.message) {
          alert(repos.message);
        } else {
          alert('系统异常');
        }
        break;
      default:
        yield put(setAllQuestionTypeListAction(fromJS([{ id: -1, name: '题型获取失败' }])));
        break;
    }
  } catch (err) {
    // err Msg
  }
}
// 提交切割好的的试卷
export function* submitCutPaper() {
  const epId = yield select(makeNeedCutPaperId());
  const requestURL = `${Config.trlink_qb}/api/examPaper/${epId}/action/cut`;
  const questionList = yield select(makeQuestionsList());
  const picInputDTOList = yield select(makePicInputDTOList());
  let questionCount = 0;
  const errList = [];
  if (questionList.count() <= 0) {
    errList.push({ type: 'compositionError', value: '试卷怎么可能一大题都没有，再检查一下吧^_^', index: 1 });
  }
  const cutExamPaperInputDTO = {
    epId,
    examPaperContentInputDTOList: questionList.toJS().map((item, index) => {
      if (!item.children || item.children.length <= 0) {
        errList.push({ type: 'compositionError', value: '怎么可能一小题题都没有，再检查一下吧^_^', index: index + 1 });
      }
      console.log(item, 'children - item');
      return {
        name: item.name,
        serialNumber: index + 1,
        examPaperContentQuestionInputDTOList: item.children.map((it, i) => {
          questionCount += 1;
          const typeId = toNumber(it.smallTypeId);
          if (typeof typeId !== 'number' || typeId <= 0) {
            errList.push({ type: 'typeSelectError', value: '选择题目类型出现问题-_-|', index: index + 1, i: i + 1 });
          }
          return {
            picUrl: it.picUrl,
            questionTypeId: typeId,
            serialNumber: questionCount,
            longPicIndex: it.longPicIndex,
            x1: it.x1,
            y1: it.y1,
            x2: it.x2,
            y2: it.y2,
          };
        }),
      };
    }),
    examPaperLongPicInputDTOList: (picInputDTOList || fromJS([])).map((item) => item.delete('index').delete('start').delete('end')).toJS(),
  };
  if (errList.length > 0) {
    Modal.error({
      title: '系统警告',
      content: errList[0].value,
    });
    console.log(`${errList[0].type}：${errList[0].value}，位置：第 ${errList[0].index} 大题。${errList[0].i ? `第 ${errList[0].i} 小题` : ''}`);
    return;
  }
  yield put(changeIsSubmitIngAction(true));
  console.log(cutData, 'cutData');
  try {
    const repos = yield call(request, requestURL, Object.assign({}, postjsonoptions(), { body: JSON.stringify(cutExamPaperInputDTO) }));
    // const repos = yield call(request, requestURL, Object.assign({}, postjsonoptions(), { body: JSON.stringify(cutData) }));
    switch (repos.code.toString()) {
      case '0':
        yield put(changeAlertStatesAction(fromJS({
          buttonsType: '1',
          imgType: 'success',
          title: '试卷上传成功',
        })));
        break;
      default:
        yield put(changeAlertStatesAction(fromJS({
          buttonsType: '1',
          imgType: 'error',
          title: repos.message || '试卷上传失败',
          warningMsg: repos.message || '上传失败',
          showDouble: true,
        })));
        break;
    }
  } catch (err) {
    yield put(changeIsSubmitIngAction(false));
    Modal.error({
      title: '系统异常',
      content: '上传失败！',
    });
  }
}

export function* getPaperMsgSaga() {
  const watcher = yield takeLatest(GET_PAPER_MSG_ACTION, getPaperMsg);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getCutPaperTaskSaga() {
  const watcher = yield takeLatest(GET_CUT_PAPER_TASK_ACTION, getCutPaperTask);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getCutPaperItemSaga() {
  const watcher = yield takeLatest(GET_CUT_PAPER_ITEM_ACTION, getCutPaperItem);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getAllQuestionTypeListSaga() {
  const watcher = yield takeLatest(GET_ALL_QUESTION_TYPE_LIST_ACTION, getAllQuestionTypeList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* submitCutPaperSage() {
  const watcher = yield takeLatest(SUNMIT_CUT_PAPER_ACTION, submitCutPaper);
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
  getCutPaperTaskSaga,
  getCutPaperItemSaga,
  getAllQuestionTypeListSaga,
  submitCutPaperSage,
  getPaperMsgFromSort,
];
