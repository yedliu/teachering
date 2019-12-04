/* eslint-disable array-callback-return */
/* eslint-disable no-case-declarations */
// import { take, call, put, select } from 'redux-saga/effects';
import { cancel, put, select, take, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';
import { message } from 'antd';
import {
  GET_DATA,
  GET_AUTHORITY_LIST,
  GET_ROLE_LIST,
  SUBMIT_ACTION,
  SUBMIT_EDIT_ACTION,
  REST_PASSWORD_ACTION,
  GET_ONE_USER
} from './constants';
import {
  setModalAction,
  setPainationAction,
  setTableData,
  setAuthorityList,
  setRoleList,
  getDataAction,
  setAddingMode,
  setInputDTO
} from './actions';
import {
  makeSelectInputDTO,
  makeSelectPagination,
  makeSelectQueryParam,
  makeSelectEditId
} from './selectors';
import userApi from '../../api/tr-cloud/user-endpoint';
import phaseSubjectApi from '../../api/tr-cloud/phase-subject-endpoint';
import roleApi from '../../api/tr-cloud/role-endpoint';

// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}
export function* getData() {
  const params = yield select(makeSelectQueryParam());
  const pagination = yield select(makeSelectPagination());
  let query = params.toJS();
  if (query.name && !/[\u4e00-\u9fa5a-zA-Z]{2}$/g.test(query.name)) {
    message.warning('请输入正确格式的姓名');
    return false;
  }
  if (query.mobile && !/^1\d{10}$/g.test(query.mobile)) {
    message.warning('请输入正确格式的号码');
    return false;
  }
  if (!query.roleId) {
    delete query.roleId;
  }
  // const requestURL = `${Config.trlink}/api/user`;
  try {
    const param = Object.assign({}, query, {
      type: 2,
      pageIndex: pagination.get('current'),
      pageSize: pagination.get('pageSize')
    });
    const res = yield userApi.findAll(param);
    switch (res.code.toString()) {
      case '0':
        const data = res.data;
        yield put(setTableData(fromJS(data.list || [])));
        yield put(
          setPainationAction(
            pagination.set('total', data.total).set('loading', false)
          )
        );
        break;
      default:
        console.log('出错');
        yield put(setPainationAction(pagination.set('loading', false)));
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
    yield put(setPainationAction(pagination.set('loading', false)));
  }
}
export function* getAuthority() {
  // const requestURL = `${Config.trlink}/api/phaseSubject/findAllPhaseSubject`
  try {
    const res = yield phaseSubjectApi.findAllPhaseSubject();
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
export function* getRoleList() {
  // const requestURL = `${Config.trlink}/api/role`
  try {
    const res = yield roleApi.getRole({ type: 2 }); // type = 2 获取临时人员角色
    switch (res.code.toString()) {
      case '0':
        yield put(setRoleList(fromJS(res.data || [])));
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
  console.log('submit', params, inputDTO);
  // const requestURL = `${Config.trlink}/api/user`
  try {
    const res = yield userApi.save(params);
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
  if (!id) {
    message.warning('出错了！');
    console.log('未能获得要编辑的记录id');
  }
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
  // const requestURL = `${Config.trlink}/api/user/${id}`;
  try {
    const res = yield userApi.update(id, params);
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
export function* makeGetRoleList() {
  const watcher = yield takeLatest(GET_ROLE_LIST, getRoleList);
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

export function* resetPassword() {
  const id = yield select(makeSelectEditId());
  // console.log(id);
  if (!id) {
    message.warning('出错了！');
    console.log('未能获得要编辑的记录id');
  }
  // const requestURL = `${Config.trlink}/api/user/${id}/resetPassword`;
  try {
    const res = yield userApi.resetPassword(id);
    switch (res.code.toString()) {
      case '0':
        message.success('重置成功');
        break;
      default:
        message.warning(res.message || '重置失败');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}

export function* makeResetPassword() {
  const watcher = yield takeLatest(REST_PASSWORD_ACTION, resetPassword);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getOneUser() {
  const id = yield select(makeSelectEditId());
  const inputDTO = yield select(makeSelectInputDTO());
  // console.log(id);
  if (!id) {
    message.warning('出错了！');
    console.log('未能获得要编辑的记录id');
  }
  // const requestURL = `${Config.trlink}/api/user/${id}/resetPassword`;
  try {
    const res = yield userApi.getOne(id);
    switch (res.code.toString()) {
      case '0':
        const { roleList, name, mobile, phaseSubjectList } = res.data;
        const _DTO = inputDTO
          .set('name', { value: name, name: 'name' })
          .set('mobile', { value: mobile, name: 'mobile' })
          .set('roleIdList', {
            value: roleList[0].id || -1,
            name: 'roleIdList'
          })
          .set('phaseSubjectIdList', {
            value: phaseSubjectList.map(item => item.id),
            name: 'phaseSubjectIdList'
          });
        yield put(setInputDTO(_DTO));
        yield put(setAddingMode(false));
        yield put(setModalAction(true));
        break;
      default:
        message.warning(res.message || '获取用户信息失败');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}

export function* makeGetOneUser() {
  const watcher = yield takeLatest(GET_ONE_USER, getOneUser);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
  makeGetData,
  makeAuthority,
  makeGetRoleList,
  makeSubmit,
  makeEditSubmit,
  makeResetPassword,
  makeGetOneUser
];
