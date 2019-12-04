/* eslint-disable array-callback-return */
/* eslint-disable no-case-declarations */
// import { take, call, put, select } from 'redux-saga/effects';
import {
  cancel,
  put,
  select,
  take,
  takeLatest
} from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';
import { message } from 'antd';
import {
  GET_DATA,
  GET_AUTHORITY_LIST,
  SUBMIT_ACTION,
  SUBMIT_EDIT_ACTION,
  DELETE_ROLE_ACTION
} from './constants';
import {
  setModalAction,
  setTableData,
  setAuthorityList,
  getDataAction
} from './actions';
import {
  makeSelectInputDTO,
  makeSelectEditId
} from './selectors';
import roleApi from '../../api/tr-cloud/role-endpoint';
import permissionApi from '../../api/tr-cloud/permission-endpoint';

// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}
export function* getData(action) {
  // const requestURL = `${Config.trlink}/api/role`;
  const name = action.name || null;
  // console.log('action', action);
  const params = { name };
  try {
    const res = yield roleApi.getRole(params);
    switch (res.code.toString()) {
      case '0':
        yield put(setTableData(fromJS(res.data || [])));
        break;
      default:
        console.log('出错');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}
export function* getAuthority() {
  // const requestURL = `${Config.trlink}/api/permission`;
  try {
    const res = yield permissionApi.getPermission();
    switch (res.code.toString()) {
      case '0':
        yield put(setAuthorityList(fromJS(res.data || [])));
        break;
      default:
        console.log('出错');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}
export function* submit() {
  const inputDTO = yield select(makeSelectInputDTO());
  let params = {};
  inputDTO.map(e => {
    if (e.value) {
      if (e.name === 'roleIdList') {
        params[e.name] = [parseInt(e.value, 10)];
      } else {
        params[e.name] = e.value;
      }
    }
  });
  console.log('submit', params);
  // const requestURL = `${Config.trlink}/api/role`;
  try {
    const res = yield roleApi.saveRole(params);
    switch (res.code.toString()) {
      case '0':
        message.success('保存成功');
        yield put(getDataAction());
        yield put(setModalAction(false));
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
export function* editSubmit() {
  const inputDTO = yield select(makeSelectInputDTO());
  const id = yield select(makeSelectEditId());
  let params = {};
  inputDTO.map(e => {
    if (e.value) {
      if (e.name === 'roleIdList') {
        params[e.name] = [parseInt(e.value, 10)];
      } else {
        params[e.name] = e.value;
      }
    }
  });
  console.log('submit', params);
  // const requestURL = `${Config.trlink}/api/role/${id}`;
  try {
    const res = yield roleApi.updateRole(id, params);
    switch (res.code.toString()) {
      case '0':
        message.success('保存成功');
        yield put(getDataAction());
        yield put(setModalAction(false));
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
export function* deleteSubmit() {
  const id = yield select(makeSelectEditId());
  // const requestURL = `${Config.trlink}/api/role/${id}`;
  try {
    const res = yield roleApi.deleteRole(id);
    switch (res.code.toString()) {
      case '0':
        message.success('删除成功');
        yield put(getDataAction());
        break;
      default:
        message.warning(res.message || '删除失败');
        console.log('出错');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}
export function* makeGetData() {
  const watcher = yield takeLatest(GET_DATA, getData);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* makeAuthority() {
  const watcher = yield takeLatest(GET_AUTHORITY_LIST, getAuthority);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* makeSubmit() {
  const watcher = yield takeLatest(SUBMIT_ACTION, submit);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* makeEditSubmit() {
  const watcher = yield takeLatest(SUBMIT_EDIT_ACTION, editSubmit);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* makeDelete() {
  const watcher = yield takeLatest(DELETE_ROLE_ACTION, deleteSubmit);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// All sagas to be loaded
export default [
  defaultSaga,
  makeGetData,
  makeAuthority,
  makeSubmit,
  makeEditSubmit,
  makeDelete
];
