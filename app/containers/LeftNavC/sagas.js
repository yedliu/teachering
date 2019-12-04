import { take, put, cancel, takeLatest } from 'redux-saga/effects';
import { fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
// import request, { geturloptions } from 'utils/request';
// import { Config } from 'utils/config';
import { GET_LESSONTYPE_ACTION, GET_GRADE_ACTION, GET_SUBJECT_ACTION } from './constants';
import { setGradeListAction, setLessonTypeListAction, setSubjectListAction } from './actions';
import dictApi from 'api/tr-cloud/dict-endpoint';
// Individual exports for testing
export function* getGradeData() {
  // const requestURL = `${Config.trlink}/api/dict/findItemsByDictCode`;
  const dictCode = 'TEACHER_GRADE_TYPE';
  try {
    const repos = yield dictApi.findItemsByDictCode(dictCode);
    // call(request, requestURL, Object.assign({}, geturloptions()), { dictCode: 'TEACHER_GRADE_TYPE' });
    switch (repos.code.toString()) {
      case '0':
        // repos.data.unshift(grade);
        yield put(setGradeListAction(fromJS(repos.data)));
        break;
      default:
        break;
    }
  } catch (err) {
    console.log('error');
  }
}
export function* getSubjectData() {
  // const requestURL = `${Config.trlink}/api/dict/findItemsByDictCode`;
  const dictCode = 'LESSON_SUBJECT';
  // const subject = {'itemCode':'请选择学科','itemValue':''};
  try {
    const repos = yield dictApi.findItemsByDictCode(dictCode);
    // call(request, requestURL, Object.assign({}, geturloptions()), { dictCode: SUBJECT_LIST });
    switch (repos.code.toString()) {
      case '0':
        // repos.data.unshift(subject);
        yield put(setSubjectListAction(fromJS(repos.data)));
        break;
      default:
        break;
    }
  } catch (err) {
    console.log('error');
  }
}
export function* getLessonTypeData() {
  // const requestURL = `${Config.trlink}/api/dict/findItemsByDictCode`;
  const dictCode = 'LESSON_TYPE';
  // const lessontype = {itemValue:'请选择课程类型',itemCode:''}
  try {
    const repos = yield dictApi.findItemsByDictCode(dictCode);
    // const repos = yield call(request, requestURL, Object.assign({}, geturloptions()), { dictCode: LESSONTYPE_LIST });
    switch (repos.code.toString()) {
      case '0':
        // repos.data.unshift(lessontype);
        yield put(setLessonTypeListAction(fromJS(repos.data)));
        break;
      default:
        break;
    }
  } catch (err) {
    console.log('error');
  }
}
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}
export function* getGradeSagas() {
  const watcher = yield takeLatest(GET_GRADE_ACTION, getGradeData);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getSubjectSagas() {
  const watcher = yield takeLatest(GET_SUBJECT_ACTION, getSubjectData);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getLessonTypeSagas() {
  const watcher = yield takeLatest(GET_LESSONTYPE_ACTION, getLessonTypeData);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// All sagas to be loaded
export default [
  defaultSaga,
  getGradeSagas,
  getSubjectSagas,
  getLessonTypeSagas,
];
