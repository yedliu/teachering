import { call, cancel, put, select, take, takeEvery, } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';
import { questionMapper } from './helperfunc';
import {
  SEND_MARK_MORE_WORK_DATA_ACTION,
  GET_HOMEWORK_MARK_LIST_ACTION,
} from './constants';
import {
  setHomeWorkMarkDataAction,
} from './actions';
import {
  makeSelectHomeWorkMarkData, makeSelectTeaTotalComment, makeSelectStudentItem,
} from './selectors';
import Config from '../../utils/config';
import request, { normlposturloptions, getjsonoptions, } from '../../utils/request';

const getjsonoptionsCom = getjsonoptions();
delete getjsonoptionsCom.headers.mobile;
delete getjsonoptionsCom.headers.password;

// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}

export function* sendHomeWorkMarkData() {
  // const requestURL = `${Config.tkurl}/api/homeworkLesson/teaCorrect`;
  const requestURL = `${Config.tkurl}/api/train/homework/teaCorrect`;
  const data = yield select(makeSelectHomeWorkMarkData());
  const id = data.get('id');
  const state = 2;
  const stuGetScore = data.get('homeworkLessonQuestionDTOList').map((it) => it.get('stuGetScore')).reduce((p, n) => p + n);
  const teaTotalComment = yield select(makeSelectTeaTotalComment());
  const teaCorrectItemDTOList = data.get('homeworkLessonQuestionDTOList')
      .map((it) => ({
      correctResult: it.get('correctResult'),
      id: it.get('id'),
      stuGetScore: it.get('stuGetScore'),
    })).toJS();
  const form = { id, stuGetScore, teaTotalComment, state, teaCorrectItemDTOList };
  try {
    const repos = yield call(request, requestURL, Object.assign({}, normlposturloptions(), { body: JSON.stringify(form) }));
    // console.log('reposTockenreposTockenreposTocken', reposTocken);
    switch (repos.code.toString()) {
      case '0':

        break;
      default:
        break;
    }
  } catch (err) {
    // yield put(repoLoadingError(err));
  }
}

export function* sendHomeWorkMarkDataSaga() {
  const watcher = yield takeEvery(SEND_MARK_MORE_WORK_DATA_ACTION, sendHomeWorkMarkData);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getHomeWorkMarkListData() {
  const selecteditem = yield select(makeSelectStudentItem());
  console.log(selecteditem.toJS());
  const id = selecteditem.get('hwUserId');

  const requestURL = selecteditem.get('type') ? `${Config.chaturl}/api/train/homework/getOne` : `${Config.chaturl}/api/train/homework/getStandHw`;
  const param = selecteditem.get('type') ? { id } : { hwId: id };
  try {
    const repos = yield call(request, requestURL, Object.assign({}, getjsonoptionsCom, {}), param);
    switch (repos.code.toString()) {
      case '0':
        repos.data.homeworkLessonQuestionDTOList = repos.data.homeworkQuestionDTOList;
        questionMapper(repos.data.homeworkQuestionDTOList);
        console.log(repos.data);
        yield put(setHomeWorkMarkDataAction(fromJS(repos.data)));
        break;
      default:
        break;
    }
  } catch (err) {
    // yield put(repoLoadingError(err));
  }


}

export function* getHomeWorkMarkListSaga() {
  const watcher = yield takeEvery(GET_HOMEWORK_MARK_LIST_ACTION, getHomeWorkMarkListData);
  // Suspend execution until location changes

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
  sendHomeWorkMarkDataSaga,
  getHomeWorkMarkListSaga,
];
