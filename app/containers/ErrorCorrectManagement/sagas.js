/* eslint-disable no-case-declarations */
import { take, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { toString, toNumber } from 'lodash';
import {
  GET_PHASE_LIST, GET_SUBJECT_LIST, GO_SEARCH,
  DELETE_QUESTION_ACTION, ADOPT_MESSAGE, FINISH_ACTION, GET_SOURCE_LIST,
  GET_ROLE_LIST,
} from './constants';
import { message } from 'antd';
import { LOCATION_CHANGE } from 'react-router-redux';
// import request, { deletejsonoptions, postjsonoptions, getjsonoptions, postjsontokenoptions } from 'utils/request';
// import Config from 'utils/config';
import { fromJS } from 'immutable';
import {
  setPhaseList, setSubjectList, setQuestionStatistics, setSourceList,
  changePageState, setSelectFilter, setQuestionList, goSearch as goSearchAction,
  setRoleList,
} from './actions';
import {
  makeSelectSelectFilter, makeSelectQuestionList,
  makeSelectPageState
} from './selectors';
import { AppLocalStorage } from 'utils/localStorage';
import phaseApi from 'api/tr-cloud/phase-endpoint';
import subjectApi from 'api/tr-cloud/subject-endpoint';
import queryNode from 'api/qb-cloud/sys-dict-end-point';
import questionCorrentionApi from 'api/qb-cloud/question-corrention-controller';
import questionApi from 'api/qb-cloud/question-endpoint';


export function* defaultSaga() {
  //
}

export function* getPhaseList() {
  try {
    const repos = yield phaseApi.getPhase();
    switch (repos.code.toString()) {
      case '1':
        const standardList = repos.data.map(item => {
          return {
            value: String(item.pharseid),
            label: item.pharsename
          };
        });
        standardList.unshift({ value: '-1', label: '全部' });
        yield put(setPhaseList(fromJS(standardList)));
        yield put(setSelectFilter('phase', '-1'));
        break;
      default:
        break;
    }
  } catch (err) {
    console.error('getPhaseErr', err);
  }
}

export function* getSubjectList() {
  try {
    const repos = yield subjectApi.getAllSubject();
    switch (repos.code.toString()) {
      case '0':
        const standardList = repos.data.map(item => {
          return {
            value: String(item.id),
            label: item.name
          };
        });
        standardList.unshift({ value: '-1', label: '全部' });
        yield put(setSubjectList(fromJS(standardList)));
        yield put(setSelectFilter('subjects', '-1'));
        break;
      default:
        break;
    }
  } catch (err) {
    console.error('getSubjectErr', err);
  }
}

export function* getSourceList() {
  try {
    const res = yield queryNode.queryNodesTree('QB_CORRECTION_SOURCE');
    const allFilterObj = { value: '-1', label: '全部' };
    if (toString(res.code)) {
      const dataList = (res.data['QB_CORRECTION_SOURCE'] || []).map((item) => ({
        value: item.itemCode,
        label: item.itemName,
      }));
      dataList.unshift(allFilterObj);
      yield put(setSourceList(fromJS(dataList)));
      yield put(setSelectFilter('source', '-1'));
    } else {
      yield put(setSourceList(fromJS(allFilterObj)));
    }
  } catch (err) {
    console.error('getRoleList', err);
  }
}

export function* goSearch() {
  const selectFilter = yield select(makeSelectSelectFilter());
  console.log('selectFilter', selectFilter.toJS());
  const { examPaperId } = selectFilter.toJS();
  const pageState = yield select(makeSelectPageState());
  // eslint-disable-next-line
  const isFinished = selectFilter.get('status') == '2';
  let fetchFn = questionCorrentionApi.findUnhandle;
  if (examPaperId) {
    fetchFn = questionCorrentionApi.getPaperCorrention;
  } else {
    if (isFinished) {
      fetchFn = questionCorrentionApi.findHandle;
    }
  }
  // 如果满足条件就加到param
  const filter = (key, searchKey, param, isNum) => {
    let value = selectFilter.get(key);
    if (!value) return;
    if (isNum) {
      selectFilter.get(key) > 0
        ? param[searchKey] = value
        : '';
    } else {
      if (key === 'startTime') {
        value = new Date(value).toLocaleDateString().replace(/\//g, '-') + ' 00:00:00';
        value = new Date(value);
      } else if (key === 'endTime') {
        value = new Date(value).toLocaleDateString().replace(/\//g, '-') + ' 23:59:59';
        value = new Date(value);
      }
      param[searchKey] = value;
    }
  };
  const param = {
    pageIndex: pageState.get('pageIndex'),
    pageSize: pageState.get('pageSize'),
  };
  // filter('status', param, true);
  filter('errorTypes', 'correctionType', param, true, '');
  filter('subjects', 'subjectId', param, true);
  filter('phase', 'phaseId', param, true);
  filter('source', 'parentPresentSource', param, true);
  filter('role', 'parentPresentRole', param, true);
  filter('correctionId', 'correctionId', param, true);
  if (isFinished) {
    filter('name', 'handleUserName', param);
    filter('startTime', 'beginTime', param);
    filter('endTime', 'endTime', param);
    filter('adoptStats', 'adoptStats', param, true);
  }
  if (examPaperId) {
    filter('examPaperId', 'examPaperId', param, true);
  }
  try {
    const repos = yield fetchFn(param);
    //   {
    //     body: JSON.stringify(param)
    //   }
    //  ));
    switch (repos.code.toString()) {
      case '0':
        yield put(setQuestionStatistics(fromJS(repos.data)));
        if (repos.data.page.list && repos.data.page.list.length > 0) {
          yield put(setQuestionList(fromJS(repos.data.page.list)));
        } else {
          yield put(setQuestionList(fromJS([])));
        }
        yield put(changePageState('isLoading', false));
        break;
      default:
        message.error(repos.message || '获取题目出错');
        yield put(changePageState('isLoading', false));
        break;
    }
  } catch (err) {
    console.error('goSearchErr', err);
  }
}

export function* deleteQuestion(e) {
  if (!(toNumber(e.id) > 0)) {
    message.warn('删除操作出现异常情况');
    return;
  }
  try {
    const res = yield questionApi.deleteQuestion({ id: e.id });
    switch (toString(res.code)) {
      case '0':
        message.success('删除成功');
        yield put(changePageState('isLoading', true));
        yield put(goSearchAction());
        break;
      default:
        message.error('删除失败');
        break;
    }
  } catch (err) {
    console.log(err);
  }
}

export function* adoptMessage(item) {
  const questionList = yield select(makeSelectQuestionList());
  const param = {
    adoptStats: item.adoptStats,
    handleId: item.handleId,
    adoptUser: AppLocalStorage.getUserInfo().id,
    id: item.id,
  };
  try {
    const res = yield questionCorrentionApi.adopt(param);
    switch (toString(res.code)) {
      case '0':
        message.success('操作成功');
        // 把这道题目更新到questionList
        const location = item.location;
        console.log('location', location);
        yield put(setQuestionList(questionList.setIn(location, fromJS(res.data))));
        yield put(changePageState('curCorrentionLoading', ''));
        break;
      default:
        message.error(res.message || '操作失败');
        yield put(changePageState('curCorrentionLoading', ''));
        break;
    }
  } catch (err) {
    console.error('adoptMessageErr', err);
  }
}

export function* finish(item) {
  const question = item.question;
  const param = {
    id: question.id,
    questionId: question.questionOutputDTO.id,
    handleUser: AppLocalStorage.getUserInfo().id,
    handleId: question.id,
  };
  try {
    const res = yield questionCorrentionApi.handle(param);
    switch (toString(res.code)) {
      case '0':
        message.success('操作成功');
        yield put(changePageState('isLoading', true));
        yield put(goSearchAction());
        break;
      default:
        message.error(res.message || '操作失败');
        break;
    }
  } catch (err) {
    console.error('finishErr', err);
  }
}

export function* getRoleList() {
  try {
    const res = yield queryNode.queryNodesTree('QB_CORRECTION_ROLE');
    if (toString(res.code) === '0') {
      const dataList = (res.data['QB_CORRECTION_ROLE'] || []).map((item) => ({
        value: item.itemCode,
        label: item.itemName,
      }));
      dataList.unshift({ value: '-1', label: '全部' });
      yield put(setRoleList(fromJS(dataList)));
    } else {
      yield put(setRoleList(fromJS(allFilterObj)));
    }
  } catch (err) {
    console.error('getRoleList', err);
  }
}

export function* getSubjectListSaga() {
  const watcher = yield takeLatest(GET_SUBJECT_LIST, getSubjectList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getPhaseListSaga() {
  const watcher = yield takeLatest(GET_PHASE_LIST, getPhaseList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* goSearchSaga() {
  const watcher = yield takeLatest(GO_SEARCH, goSearch);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// 删除题目
export function* deleteQuestionSaga() {
  const watcher = yield takeLatest(DELETE_QUESTION_ACTION, deleteQuestion);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* adoptMessageSaga() {
  const watcher = yield takeLatest(ADOPT_MESSAGE, adoptMessage);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* finishSaga() {
  const watcher = yield takeLatest(FINISH_ACTION, finish);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getSourceListSaga() {
  const watcher = yield takeLatest(GET_SOURCE_LIST, getSourceList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getRoleListSaga() {
  const watcher = yield takeLatest(GET_ROLE_LIST, getRoleList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
  getSubjectListSaga,
  getPhaseListSaga,
  goSearchSaga,
  deleteQuestionSaga,
  adoptMessageSaga,
  finishSaga,
  getSourceListSaga,
  getRoleListSaga,
];
