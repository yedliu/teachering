// import { take, call, put, select } from 'redux-saga/effects';
import {
  take,
  call,
  put,
  select,
  cancel,
  takeLatest,
} from 'redux-saga/effects';
import { fromJS } from 'immutable';
import { message } from 'antd';
import { LOCATION_CHANGE } from 'react-router-redux';
import request, {
  geturloptions,
  deletejsonoptions,
  postjsonoptions,
} from 'utils/request';
import { Config } from 'utils/config';
import {
  GET_GRADE_ACTION,
  GET_SUBJECT_ACTION,
  GET_VIDEORECORDLIST_ACTION,
  SET_REMOVEVIDEO_ACTION,
  SET_ADDLESSONVIDEO_ACTION,
  GET_LESSONTYPE_ACTION,
  SET_UPLOADFILE_ACTION,
  SET_BATCHADDVIDEO_ACTION,
  GET_USERID_ACTION,
} from './constants';
import {
  makeSearchItemValue,
  makeCurrentPageIndex,
  makeRemoveSelectVideoId,
  makeSelectAddLessonVideoItem,
  makeChooseWatcherRoles,
  makeUploadFileInfo,
  makeBatchAddVideoItems,
  makeFullNameValue,
} from './selectors';
import {
  setVideoRecordListAction,
  setVideoRecordTotalCountAction,
  setLoadStateAction,
  setGradeListAction,
  setSubjectListAction,
  setLessonTypeListAction,
  setChooseWatcherOpenAction,
  setChooseWatcherRolesAction,
  setBatchAddVideoItemsAction,
  setSelectAddLessonVideoAction,
  setUserIdItemAction,
  setStudentIdsItemAction,
} from './actions';
import dictApi from 'api/tr-cloud/dict-endpoint';

export function* getVideoRecordListData() {
  const requestURL = `${
    Config.trlink
  }/api/lessonGoodVideo/pageFindEndedLessonVideo`;
  const SearchItems = yield select(makeSearchItemValue());
  const PageIndex = yield select(makeCurrentPageIndex());
  const StartTime = SearchItems.get('lesStartTime');
  const EndTime = SearchItems.get('lesEndTime');
  const params = {
    // lesSubject:SearchItems.get('lesSubject',''),
    // stuGrade:SearchItems.get('stuGrade',''),
    teaUserId: SearchItems.get('teaUserId', ''),
    teaMobile: SearchItems.get('teaMobile', ''),
    stuUserId: SearchItems.get('stuUserId', ''),
    stuMobile: SearchItems.get('stuMobile', ''),
    lesType: SearchItems.get('lesType', ''),
    transFormed: SearchItems.get('transFormed', ''),
    lesStartTime: StartTime ? StartTime.format('YYYY-MM-DD') : '',
    lesEndTime: EndTime ? EndTime.format('YYYY-MM-DD') : '',
    pageIndex: PageIndex,
    pageSize: 25,
  };
  console.log('paramssss', params);
  try {
    yield put(setLoadStateAction(true));
    const repos = yield call(
      request,
      requestURL,
      Object.assign({}, geturloptions()),
      params,
    );
    switch (repos.code.toString()) {
      case '0':
        yield put(
          setVideoRecordListAction(
            fromJS(repos.data.data ? repos.data.data : []),
          ),
        );
        yield put(
          setVideoRecordTotalCountAction(
            repos.data.total ? repos.data.total : 0,
          ),
        );
        yield put(setLoadStateAction(false));
        break;
      case '1':
        yield put(setVideoRecordListAction(fromJS([])));
        yield put(setVideoRecordTotalCountAction(0));
        yield put(setLoadStateAction(false));
        message.warning(repos.message || '查询条件有误');
        break;
      default:
        break;
    }
  } catch (err) {
    yield put(setLoadStateAction(false));
  }
}
// 获取年级，科目，课程类型
export function* getGradeData() {
  // const requestURL = `${Config.trlink}/api/dict/findItemsByDictCode`;
  const grade = { itemCode: '年级', itemValue: '' };
  const dictCode = 'TEACHER_GRADE_TYPE';
  try {
    const repos = yield dictApi.findItemsByDictCode(dictCode);
    // call(
    //   request,
    //   requestURL,
    //   Object.assign({}, geturloptions()),
    //   { dictCode: 'TEACHER_GRADE_TYPE' },
    // );
    switch (repos.code.toString()) {
      case '0':
        repos.data.unshift(grade);
        yield put(setGradeListAction(fromJS(repos.data)));
        break;
      default:
        break;
    }
  } catch (err) {
    console.log('error');
  }
}
export function* getSubjetData() {
  // const requestURL = `${Config.trlink}/api/dict/findItemsByDictCode`;
  const dictCode = 'LESSON_SUBJECT';
  const subject = { itemCode: '学科', itemValue: '' };
  try {
    const repos = yield dictApi.findItemsByDictCode(dictCode);
    // call(
    //   request,
    //   requestURL,
    //   Object.assign({}, geturloptions()),
    //   { dictCode: SUBJECT_LIST },
    // );
    switch (repos.code.toString()) {
      case '0':
        repos.data.unshift(subject);
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
  const lessontype = { itemValue: '', itemCode: '课程类型' };
  try {
    const repos = yield dictApi.findItemsByDictCode(dictCode);
    // call(
    //   request,
    //   requestURL,
    //   Object.assign({}, geturloptions()),
    //   { dictCode: LESSONTYPE_LIST },
    // );
    switch (repos.code.toString()) {
      case '0':
        repos.data.unshift(lessontype);
        yield put(setLessonTypeListAction(fromJS(repos.data)));
        break;
      default:
        break;
    }
  } catch (err) {
    console.log('error');
  }
}

// 移除视频
export function* removeVideoAction() {
  const requestURL = `${Config.trlink}/api/lessonGoodVideo/delete`;
  const LessonId = yield select(makeRemoveSelectVideoId());
  try {
    const repos = yield call(
      request,
      requestURL,
      Object.assign({}, deletejsonoptions()),
      { ids: LessonId },
    );
    switch (repos.code.toString()) {
      case '0':
        message.success(repos.message, 2);
        break;
      default:
        message.error('移除视频失败！', 2);
        break;
    }
  } catch (err) {
    message.error('移除视频失败！', 2);
  }
}
// 添加视频
export function* setAddLessonVideoAction() {
  const requestURL = `${Config.trlink}/api/lessonGoodVideo/addLessonVideo`;
  const watcherRoles = yield select(makeChooseWatcherRoles());
  const addVideoItem = yield select(makeSelectAddLessonVideoItem());
  const params = {
    belongTypes: watcherRoles.join(','),
    grade: addVideoItem.get('stuGrade'),
    lesStartTime: addVideoItem.get('lesStartedAt'),
    lessonId: addVideoItem.get('lessonId'),
    lessonType: addVideoItem.get('lesType'),
    subject: addVideoItem.get('lesSubject'),
    teacherName: addVideoItem.get('teacherName'),
    lessonUid: addVideoItem.get('lessonUid'),
    ossUrl: '',
    videoType: '',
    userId: '',
  };
  try {
    const repos = yield call(
      request,
      requestURL,
      Object.assign({}, postjsonoptions(), { body: JSON.stringify(params) }),
    );
    switch (repos.code.toString()) {
      case '0':
        message.success(repos.message, 2);
        yield put(setChooseWatcherRolesAction(fromJS([])));
        yield put(setChooseWatcherOpenAction(false));
        yield put(setSelectAddLessonVideoAction(fromJS({})));
        break;
      default:
        message.error('添加失败！', 2);
        break;
    }
  } catch (err) {
    console.log('err', err);
    message.error('添加失败！', 2);
  }
}
// 批量添加
export function* setBatchAddVideoAction() {
  const requestURL = `${Config.trlink}/api/lessonGoodVideo/batchAdd`;
  const videoItems = yield select(makeBatchAddVideoItems());
  const watcherRoles = yield select(makeChooseWatcherRoles());
  const postList = videoItems.map(item => {
    return {
      belongTypes: watcherRoles.join(','),
      grade: item.get('stuGrade'),
      lesStartTime: item.get('lesStartedAt'),
      lessonId: item.get('lessonId'),
      lessonType: item.get('lesType'),
      subject: item.get('lesSubject'),
      teacherName: item.get('teacherName'),
      lessonUid: item.get('lessonUid'),
      ossUrl: '',
      videoType: '',
      userId: '',
    };
  });
  console.log('paramsssss', postList.toJS());
  try {
    const repos = yield call(
      request,
      requestURL,
      Object.assign({}, postjsonoptions(), {
        body: JSON.stringify(postList.toJS()),
      }),
    );
    switch (repos.code.toString()) {
      case '0':
        message.success(repos.message, 3);
        yield put(setChooseWatcherOpenAction(false));
        yield put(setChooseWatcherRolesAction(fromJS([])));
        yield put(setBatchAddVideoItemsAction(fromJS([])));
        break;
      default:
        message.error('添加失败！', 3);
        break;
    }
  } catch (err) {
    console.log('err', err);
    message.error('添加失败！', 3);
  }
}
// 上传MP4XX
export function* setUploadFileAction() {
  const requestURL = `${Config.trlink}/api/lessonGoodVideo/uploadMp4`;
  // const requestURL = `http://192.168.51.142:8080/tr-web/api/lessonGoodVideo/uploadMp4`;
  const uploadFileInfo = yield select(makeUploadFileInfo());
  // const params = Object.assign(
  //   {},
  //   uploadFileInfo.toJS(),
  //   { file: uploadFileInfo.get('file') },
  //   { lesStartTime: uploadFileInfo.get('lesStartTime').format('YYYY-MM-DD') },
  // );
  let fd = new FormData();
  fd.append('file', uploadFileInfo.get('file'));
  fd.append('belongTypes', uploadFileInfo.get('belongTypes'));
  fd.append('grade', uploadFileInfo.get('grade'));
  fd.append(
    'lesStartTime',
    uploadFileInfo.get('lesStartTime').format('YYYY-MM-DD'),
  );
  fd.append('lessonType', uploadFileInfo.get('lessonType'));
  fd.append('subject', uploadFileInfo.get('subject'));
  fd.append('teacherName', uploadFileInfo.get('teacherName'));
  // console.log('paramsinfooo',params,JSON.stringify(params));
  try {
    const repos = yield call(
      request,
      requestURL,
      Object.assign({}, postjsonoptions(), { body: String(fd) }),
    );
    switch (repos.code.toString()) {
      case '1':
        alert(repos.message);
        console.log('message', repos);
        break;
      default:
        break;
    }
  } catch (err) {
    console.log('error', err);
    message.error('上传失败!', 3);
  }
}
// usreIds
export function* getUserIdsAction() {
  const requestURL = `${Config.trlink}/api/user/findUserInfoByFullname`;
  const fullName = yield select(makeFullNameValue());
  try {
    const repos = yield call(
      request,
      requestURL,
      Object.assign({}, geturloptions()),
      { fullname: fullName.get('value') },
    );
    switch (repos.code.toString()) {
      case '0':
        if (fullName.get('label') === 'teacher') {
          yield put(setUserIdItemAction(fromJS(repos.data ? repos.data : [])));
        } else {
          yield put(
            setStudentIdsItemAction(fromJS(repos.data ? repos.data : [])),
          );
        }

        break;
      default:
        break;
    }
  } catch (err) {
    // alert(JSON.stringify('删除失败'));
  }
}
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}

// All sagas to be loaded
export function* getVideoRecordListSagas() {
  const watcher = yield takeLatest(
    GET_VIDEORECORDLIST_ACTION,
    getVideoRecordListData,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getGradeSagas() {
  const watcher = yield takeLatest(GET_GRADE_ACTION, getGradeData);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getSubjetsagas() {
  const watcher = yield takeLatest(GET_SUBJECT_ACTION, getSubjetData);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getLessonTypeSagas() {
  const watcher = yield takeLatest(GET_LESSONTYPE_ACTION, getLessonTypeData);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* removeVideoSagas() {
  const watcher = yield takeLatest(SET_REMOVEVIDEO_ACTION, removeVideoAction);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* setAddLessonVideoSagas() {
  const watcher = yield takeLatest(
    SET_ADDLESSONVIDEO_ACTION,
    setAddLessonVideoAction,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* setUploadFileSagas() {
  const watcher = yield takeLatest(SET_UPLOADFILE_ACTION, setUploadFileAction);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* setBatchAddVideoSagas() {
  const watcher = yield takeLatest(
    SET_BATCHADDVIDEO_ACTION,
    setBatchAddVideoAction,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getUserIdsSagas() {
  const watcher = yield takeLatest(GET_USERID_ACTION, getUserIdsAction);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  defaultSaga,
  getGradeSagas,
  getSubjetsagas,
  getLessonTypeSagas,
  getVideoRecordListSagas,
  removeVideoSagas,
  setAddLessonVideoSagas,
  setUploadFileSagas,
  setBatchAddVideoSagas,
  getUserIdsSagas,
];
