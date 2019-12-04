import { call, cancel, put, select, take, takeEvery, } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';
import { questionMapper } from 'containers/HomeWorkInfo/helperfunc';
import {
  SEND_MARK_MORE_WORK_DATA_ACTION,
  GET_HOMEWORK_MARK_LIST_ACTION,
} from './constants';
import {
  setHomeWorkMarkDataAction, setAlertMsg, setSelectStudent,
} from './actions';
import {
  makeSelectHomeWorkMarkData, makeSelectTeaTotalComment, makeSelectStudentItem, makeSelectAlertMsg,
} from './selectors';
import Config from '../../utils/config';
import request, { posthomeworkjsonoptions, getjsonoptions } from '../../utils/request';

const posthomeworkjsonoptionsCom = posthomeworkjsonoptions();
delete posthomeworkjsonoptionsCom.headers.mobile;
delete posthomeworkjsonoptionsCom.headers.password;
const getjsonoptionsCom = getjsonoptions();
delete getjsonoptionsCom.headers.mobile;
delete getjsonoptionsCom.headers.password;

// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}

export function* sendHomeWorkMarkData() {
  // const requestURL = `${Config.tkurl}/api/homeworkLesson/teaCorrect`;
  const alertMsg = yield select(makeSelectAlertMsg());
  // const requestURL = `${Config.apiurl4}/api/train/homework/teaCorrect`;
  const requestURL = `${Config.chaturl}/api/train/homework/teaCorrect`;
  const data = yield select(makeSelectHomeWorkMarkData());
  const id = data.get('id');
  const state = 2;
  // const stuGetScore = data.get('homeworkLessonQuestionDTOList').map((it) => it.get('stuGetScore')).reduce((p, n) => (n ? n : 0) + (p ? p : 0));
  let stuGetScore = 0;
  const teaTotalComment = yield select(makeSelectTeaTotalComment());
  // console.log('******************************',data.get('homeworkLessonQuestionDTOList').toJS());
  const teaCorrectItemDTOList = data.get('homeworkLessonQuestionDTOList')
      .map((it) => {
        const res = {
          correctResult: it.get('correctResult') || '',
          // id: it.get('id'),
          id: it.get('questionOutputDTO').get('stuAnsId'),
          stuGetScore: it.get('stuGetScore') || 0,
        };
        if (it.get('questionOutputDTO').get('sub')) {
          let totalGetScore = 0;
          const children = [];
          it.get('questionOutputDTO').get('children').forEach((it2) => {
            totalGetScore += it2.get('stuGetScore') || 0;
            children.push({
              correctResult: it2.get('correctResult') || '',
              id: it2.get('subStuAnsId') || '',
              stuGetScore: it2.get('stuGetScore') || 0,
            });
          });
          res.children = children;
          res.stuGetScore = totalGetScore;
          stuGetScore += totalGetScore;
        } else {
          stuGetScore += it.get('stuGetScore') || 0;
        }
        return res;
      }).toJS();

  const form = { id, stuGetScore, teaTotalComment, state, teaCorrectItemDTOList };
  console.log(teaCorrectItemDTOList);
  // console.log(data.toJS(),'---------------------------------',teaCorrectItemDTOList);
  try {
    const repos = yield call(request, requestURL, Object.assign({}, posthomeworkjsonoptionsCom, { body: JSON.stringify(form) }));
    // console.log('reposTockenreposTockenreposTocken', reposTocken);
    switch (repos.code.toString()) {
      case '0':
        yield put(setAlertMsg(alertMsg.set('alertmessage', '批改成功').set('open', true)));
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
  const id = selecteditem.get('id');
  const requestURL = `${Config.chaturl}/api/train/homework/autoCorrectHomework`;
  try {
    const repos = yield call(request, requestURL, Object.assign({}, posthomeworkjsonoptionsCom, {}), { id });
    switch (repos.code.toString()) {
      case '0':
        repos.data.homeworkLessonQuestionDTOList = repos.data.homeworkQuestionDTOList;
        questionMapper(repos.data.homeworkQuestionDTOList);
        yield put(setHomeWorkMarkDataAction(fromJS(repos.data)));
        yield put(setSelectStudent(selecteditem.set('hwid', repos.data.hwId)));
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
