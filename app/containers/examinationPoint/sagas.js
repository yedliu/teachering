/* eslint-disable no-case-declarations */
import { cancel, put, select, take, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';
import { message } from 'antd';
import { changeIsLoadingStateAction } from 'containers/LeftNavC/actions';

import {
  GET_PHASE_SUBJECT_LIST_ACTION,
  GET_EXAMINATIONPOINT_LIST_ACTION,
  SAVE_ACTION,
  SORT_ACTION,
  DELETE_ACTION,
  GET_EXAMPOINT_ACTION,
} from './constants';
import {
  setPhaseSubjectListAction,
  setPhaseSubjectAction,
  getExaminationPoint,
  setExamPointListAction,
  setSelectedExaminationListAction,
  setModalAttrAction,
  setCrudIdAction,
} from './actions';
import {
  makeSelectPhaseSubject,
  makeSelectCrudId,
  makeSelectExamPointList,
  makeSelectInputDto,
  makeSelectSelectedExamPointList,
  makeSelectModalAttr,
} from './selectors';
import phaseSubjectApi from '../../api/tr-cloud/phase-subject-endpoint';
import examPointApi from '../../api/tr-cloud/exam-point-endpoint';
// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}

export function* getPhaseSubjectList() {
  console.log('examination    getPhaseSubjectList');
  try {
    const res = yield phaseSubjectApi.getAll();
    switch (res.code.toString()) {
      case '0':
        yield put(setPhaseSubjectListAction(fromJS(res.data)));
        yield put(setPhaseSubjectAction(fromJS(res.data[0])));
        yield put(getExaminationPoint());
        break;
      default:
        console.log('出错');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}

export function* makeGetPhaseSubjectList() {
  console.log('makeGetPhaseSubjectList');
  const watcher = yield takeLatest(GET_PHASE_SUBJECT_LIST_ACTION, getPhaseSubjectList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// function handleKnowledgeList(knowledgeList, selectedKnowledgeList, data) {
//   knowledgeList.push(data.map((item, index) => {
//     item.editable = false;
//     item.toolBarVisible = false;
//     if (index === 0) {
//       selectedKnowledgeList.push(item);
//     }
//     return item;
//   }));
//   if (data[0].children) {
//     handleKnowledgeList(knowledgeList, selectedKnowledgeList, data[0].children);
//   }
// }
function handleExaminationPoint(list, selectList, all) {
  if (all && all.length) {
    list.push(all.map((item, index) => {
      item.editable = false;
      item.toolBarVisible = false;
      if (index === 0) {
        selectList.push(item);
      }
      return item;
    }));
  }
  if (selectList && selectList.length) {
    const last = selectList[selectList.length - 1];
    if (last && last.children && last.children.length) {
      handleExaminationPoint(list, selectList, last.children);
    }
  }
}
export function* getExaminationPointList() {
  yield put(changeIsLoadingStateAction(true));
  const phaseSubject = yield select(makeSelectPhaseSubject());
  console.log('phaseSubject>>>>>>>>>', phaseSubject.toJS());
  const params = { phaseSubjectId: phaseSubject.get('id') };
  try {
    const res = yield examPointApi.getExamPoint(params);
    switch (res.code.toString()) {
      case '0':
        const examinationPoint = [];
        const selectedExaminationList = [];
        if (res.data && res.data.length > 0) {
          handleExaminationPoint(examinationPoint, selectedExaminationList, res.data);
        }
        console.log('selectedExaminationList', selectedExaminationList);

        yield put(setSelectedExaminationListAction(fromJS(selectedExaminationList)));
        yield put(setExamPointListAction(fromJS(examinationPoint)));
        // if (res.data && res.data.length > 0) {
        //   yield put(setKnowledgeAction(fromJS(res.data[0])));
        // }
        break;
      default:
        console.log('出错');
        break;
    }
    yield put(changeIsLoadingStateAction(false));
  } catch (e) {
    yield put(changeIsLoadingStateAction(false));
    console.log('saga getExaminationPointList出错', e);
  }
}

export function* makeGetExaminationPointList() {
  console.log('makeGet_EXAMINATION_POINT_List');
  const watcher = yield takeLatest(GET_EXAMINATIONPOINT_LIST_ACTION, getExaminationPointList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getExamPoint() {
  const id = yield select(makeSelectCrudId());
  const inputDto = yield select(makeSelectInputDto());
  const level = inputDto.get('level');

  const examPointList = yield select(makeSelectExamPointList());
  const selectedexamPointList = yield select(makeSelectSelectedExamPointList());
  const _examPointList = examPointList.toJS();
  const _selectedexamPointList = selectedexamPointList.toJS();
  try {
    const res = yield examPointApi.getOneExamPoint(id);
    switch (res.code.toString()) {
      case '0':
        let _newList = [];
        let _newSelectList = [];
        let list = [];
        let selectList = [];
        handleExaminationPoint(list, selectList, res.data.children || []);
        if (_examPointList.length && _selectedexamPointList.length) {
          _newList = _examPointList.slice(0, level + 1).concat(list);
          _newSelectList = _selectedexamPointList.slice(0, level + 1).concat(selectList);
        }
        yield put(setSelectedExaminationListAction(fromJS(_newSelectList)));
        yield put(setExamPointListAction(fromJS(_newList)));
        yield put(setCrudIdAction(0));
        break;
      default:
        console.log('出错');
        break;
    }
  } catch (e) {
    console.log('saga getExamPoint出错', e);
  }
}

export function* makeGetExamPoint() {
  console.log('makeGetExamPoint');
  const watcher = yield takeLatest(GET_EXAMPOINT_ACTION, getExamPoint);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* save() {
  const phaseSubject = yield select(makeSelectPhaseSubject());
  const examPointList = yield select(makeSelectExamPointList());
  const selectedExamPointList = yield select(makeSelectSelectedExamPointList());
  const inputDto = yield select(makeSelectInputDto());
  const id = yield select(makeSelectCrudId());
  try {
    const level = inputDto.get('level');
    const curLevelList = examPointList.get(level) || [];
    let pId = 0;
    if (level !== 0) {
      pId = selectedExamPointList.get(level - 1).get('id');
    }
    const dto = inputDto.set('phaseSubjectId', phaseSubject.get('id')).set('pId', pId);
    let res;
    if (id === 0) {
      // 新增
      let _dto = dto.set('sort', curLevelList.size || 0);
      console.log('需要保存的数据:', _dto.toJS());
      res = yield examPointApi.saveExamPoint(_dto.toJS());
    } else {
      console.log('需要修改的数据:', dto);
      res = yield examPointApi.updateExamPoint(id, dto.toJS());
    }

    switch (res.code.toString()) {
      case '0':
        message.success('保存成功');
        const modalattr = yield select(makeSelectModalAttr());
        yield put(setModalAttrAction(modalattr.set('visible', false)));
        yield put(setCrudIdAction(0));
        yield put(getExaminationPoint());
        // const data = res.data;
        // data.editable = false;
        // const saveObj = fromJS(data);
        // let list;
        // if (id === 0) {
        //   if (examPointList.size <= level) {
        //     list = examPointList.push(fromJS([data]));
        //     yield put(setExamPointListAction(list));
        //     console.log('>>>>>>>>>>>>>>>>>>>', selectedExamPointList);
        //     yield put(setSelectedExaminationListAction(selectedExamPointList.push(fromJS(data))));
        //   } else {
        //     list = examPointList.get(level).push(saveObj);
        //     yield put(setExamPointListAction(examPointList.set(level, list)));
        //   }
        // } else {
        //   list = examPointList.get(level).set(inputDto.get('index'), saveObj);
        //   yield put(setExamPointListAction(examPointList.set(level, list)));
        // }
        break;
      default:
        console.log('出错');
        break;
    }
  } catch (e) {
    console.log('save出错', e);
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
  console.log('delete():', id);
  try {
    const res = yield examPointApi.deleteExamPoint(id);
    switch (res.code.toString()) {
      case '0':
        yield put(getExaminationPoint());
        message.success('删除成功');
        break;
      default:
        console.log('出错');
        break;
    }
  } catch (e) {
    console.log('delete()出错', e);
  }
}

export function* makeDelete() {
  console.log('监听makeDelete()');
  const watcher = yield takeLatest(DELETE_ACTION, deleteById);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* sort() {
  const list = yield select(makeSelectExamPointList());
  const inputDto = yield select(makeSelectInputDto());
  const level = inputDto.toJS().level;
  const idList = list.toJS()[level].map((item) => item.id);
  console.log('sort():参数为：', idList);
  try {
    const res = yield examPointApi.examPointSort({ idList });
    switch (res.code.toString()) {
      case '0':
        yield put(getExaminationPoint());
        break;
      default:
        console.log('出错');
        break;
    }
  } catch (e) {
    console.log('sort()出错', e);
  }
}

export function* makeSort() {
  console.log('监听makeSort()');
  const watcher = yield takeLatest(SORT_ACTION, sort);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
  makeGetPhaseSubjectList,
  makeGetExaminationPointList,
  makeGetExamPoint,
  makeSave,
  makeDelete,
  makeSort,
];
