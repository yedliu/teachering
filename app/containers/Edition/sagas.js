/* eslint-disable no-case-declarations */
import { call, cancel, put, select, take, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';
import { message } from 'antd';

import {
  getEditionListAction,
  setEditionListAction,
  setModalAttrAction,
  setEditionAction,
  setPhaseSubjectListAction,
  setPhaseSubjectAction, setInputDtoAction,
  setBUListAction,
} from './actions';
import {
  makeSelectCrudId,
  makeSelectInputDto,
  makeSelectModalAttr,
  makeSelectEditionList,
  makeSelectPhaseSubject,
  // makeSelectClassTypeCode,
  makeSelectAddedState,
  makeSelectEdtionType
} from './selectors';
import {
  DELETE_ACTION,
  GET_EDITION_LIST_ACTION,
  GET_PHASE_SUBJECT_LIST_ACTION,
  SAVE_ACTION,
  GET_BU_LIST_ACTION,
  GET_EDITION_SEARCH_ACTION,
} from './constants';
import phaseSubjectApi from '../../api/tr-cloud/phase-subject-endpoint';
import DictApi from '../../api/tr-cloud/dict-endpoint';
import editionApi from '../../api/tr-cloud/edition-endpoint';

export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}

export function* getPhaseSubjectList() {
  try {
    const res = yield phaseSubjectApi.findAllPhaseSubject();
    switch (res.code.toString()) {
      case '0':
        yield put(setPhaseSubjectListAction(fromJS(res.data)));
        yield put(setPhaseSubjectAction(fromJS(res.data[0])));
        const inputDto = yield select(makeSelectInputDto());
        yield put(setInputDtoAction(inputDto.set('phaseSubjectId', res.data[0].id)));
        break;
      default:
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('出错啦~');
  }
}


export function* makeGetPhaseSubjectList() {
  console.log('makeGetPhaseSubjectList');
  const watcher = yield takeLatest(GET_PHASE_SUBJECT_LIST_ACTION, getPhaseSubjectList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getBUList() {
  const groupCode = 'CLASSTYPE';
  try {
    const res = yield DictApi.findSystemDictByGroupCode(groupCode);
    switch (res.code.toString()) {
      case '0':
        const arr = res.data;
        arr.unshift({ code: '', value: '全部' });
        yield put(setBUListAction(fromJS(arr)));
        const inputDto = yield select(makeSelectInputDto());
        yield put(setInputDtoAction(inputDto.set('classTypeCode', res.data[0].code)));
        break;
      default:
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('出错啦~');
  }
}


export function* makeGetBUList() {
  const watcher = yield takeLatest(GET_BU_LIST_ACTION, getBUList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getEditionList() {
  const phaseSubject = yield select(makeSelectPhaseSubject());
  // const classTypeCode = yield select(makeSelectClassTypeCode());
  const editionType = yield select(makeSelectEdtionType());
  let state = yield select(makeSelectAddedState());
  // state = state === '上架' ? 1 : state === '隐藏' ? 0 : '';
  const params = { phaseSubjectId: phaseSubject.get('id'), editionType, state };
  try {
    const res = yield editionApi.getEdition(params);
    switch (res.code.toString()) {
      case '0':
        yield put(setEditionListAction(fromJS(res.data)));
        if (res.data && res.data.length > 0) {
          yield put(setEditionAction(fromJS(res.data[0])));
        }
        break;
      default:
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('getClassType()出错啦~~~', e);
  }
}

export function* makeGetEditionList() {
  console.log('makeGetKnowledge');
  const watcher = yield takeLatest(GET_EDITION_LIST_ACTION, getEditionList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* save() {
  const editionList = yield select(makeSelectEditionList());
  const inputDto = yield select(makeSelectInputDto());
  const id = yield select(makeSelectCrudId());
  const modalAttr = yield select(makeSelectModalAttr());
  try {
    let dto = inputDto.set('sort', editionList.size);
    let res;
    if (id === 0) {
      // 新增
      let params = dto.toJS();
      delete params.classTypeCode;
      res = yield editionApi.saveEdition(params);
    } else {
      // 修改
      dto = { name: inputDto.get('name'), phaseSubjectId: inputDto.get('phaseSubjectId'), editionType: inputDto.get('editionType'), state: inputDto.get('state') };
      res = yield editionApi.updateEdition(id, dto);
    }

    switch (res.code.toString()) {
      case '0':
        message.success('保存成功');
        yield put(getEditionListAction());
        yield put(setModalAttrAction(modalAttr.set('visible', false)));
        break;
      default:
        message.error(res.message || '保存失败');
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    message.error('系统异常');
    console.log('save()出错啦~~~', e);
  }
}

export function* makeSave() {
  // console.log('监听makeSave()');
  const watcher = yield takeLatest(SAVE_ACTION, save);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* deleteById() {
  const id = yield select(makeSelectCrudId());
  try {
    const res = yield editionApi.deleteEdition(id);
    switch (res.code.toString()) {
      case '0':
        yield put(getEditionListAction());
        message.success('删除成功');
        break;
      default:
        message.error(res.message || '删除失败');
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    message.error('系统异常');
    console.log('delete()出错啦~~~', e);
  }
}

export function* makeDelete() {
  console.log('监听makeDelete()');
  const watcher = yield takeLatest(DELETE_ACTION, deleteById);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getEditionSearch() {
  yield [call(getPhaseSubjectList), call(getBUList)];
  yield put(getEditionListAction());
}

export function* getEditionSearchData() {
  const watcher = yield takeLatest(GET_EDITION_SEARCH_ACTION, getEditionSearch);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
  makeGetPhaseSubjectList,
  makeGetBUList,
  makeGetEditionList,
  makeSave,
  makeDelete,
  getEditionSearchData,
];
