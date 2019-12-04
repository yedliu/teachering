import {
  take,
  put,
  takeLatest,
  cancel
} from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';
import _ from 'lodash';
import { message } from 'antd';
// import request, {
//   geturloptions
// } from '../../utils/request';
// import Config from '../../utils/config';
import {
  GET_QUESTION_LIST
} from './constants';
import {
  setQuestionList
} from './actions';
import examPaperApi from 'api/qb-cloud/exam-paper-end-point';

export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}

export function* getQuestionList({ id }) {
  // const requestURL = `${Config.trlink_qb}/api/examPaper/action/findExamPaperContentOutputDTOList`;
  // const params = { epId: id };
  if (!id) {
    return;
  }
  try {
    const res = yield examPaperApi.getEditPaper(id);
    // call(
    //   request,
    //   requestURL,
    //   Object.assign({}, geturloptions()),
    //   params
    // );
    switch (_.toString(res.code)) {
      case '0':
        yield put(setQuestionList(fromJS(res.data || [])));
        break;
      default:
        message.warning(res.message || '试卷分析获取失败');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}

export function* getQuestionListSaga() {
  const watcher = yield takeLatest(GET_QUESTION_LIST, getQuestionList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
  getQuestionListSaga
];
