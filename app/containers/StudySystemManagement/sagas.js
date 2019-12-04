/* eslint-disable no-case-declarations */
// import { take, call, put, select } from 'redux-saga/effects';
import {
  // call,
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
  GET_CLASS_TYPE_LIST_ACTION,
  GET_GRADE_LIST_ACTION,
  GET_GRADE_SUBJECT_LIST_ACTION,
  GET_LIST_LEVE_FIRST_ACTION,
  GET_SECOND_LEVE_LIST_ACTION,
  GET_THREE_LEVEL_LIST_ACTION,
  SAVE_ACTION,
  DELETE_ACTION,
  SORT_ACTION,
  GET_EDITION_LIST_ACTION
} from './constants';
import {
  setGradeListAction,
  setGradeAction,
  getGradeSubjectListAction,
  setGradeSubjectListAction,
  setGradeSubjectAction,
  setClaseTypeListAction,
  setClaseTypeAction,
  getListLeveFirstAction,
  setLeveFirstListAction,
  setLeveFirstIdAction,
  getSecondLevelListAction,
  setLeveSecondListAction,
  setLeveSecondIdAction,
  setLeveThreeListAction,
  setCrudIdAction,
  getThreeLevelListAction,
  setLeveThreeIdAction,
  setAddExit,
  getEditionListAction,
  setEditionListAction,
  setEditionAction,
} from './actions';
import {
  makeSelectGrade,
  makeClassType,
  makeSelectGradeSubject,
  makeSelectPid,
  makeSelectFirstLevelId,
  makeSelectSecondLevelId,
  makeSelectInputDto,
  makeSelectFirstLevel,
  makeSelectSecondlevel,
  makeSelectThreelevel,
  makeSelectCrudId,
  makeEdition
} from './selectors';
// import Config from '../../utils/config';
// import request, {
//   geturloptions,
//   deletejsontokenoptions,
//   postjsontokenoptions,
//   gettockenurloptions
// } from '../../utils/request';
import trDictApi from 'api/tr-cloud/dict-endpoint';
import userPhaseSubjectApi from 'api/tr-cloud/user-phase-subject-endpoint';
import editionApi from 'api/tr-cloud/edition-endpoint';
import trainingMaterialsSystemApi from 'api/fileSystem/training-materials-system';

// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}
export function* getClaseTypeList() {
  // const phase = yield select(makeSelectPhase());
  const groupCode = 'TRAINING_CLASS_TYPE';
  // const requestURL = `${Config.zmtrlink}/api/dict/findSystemDictByGroupCode/${groupCode}`;
  try {
    // const res = yield call(request, requestURL, Object.assign({}, postjsontokenoptions()));
    const res = yield trDictApi.findSystemDictByGroupCode(groupCode);
    switch (res.code.toString()) {
      case '0':
        yield put(setClaseTypeListAction(fromJS(res.data ? res.data : [])));
        yield put(setClaseTypeAction(fromJS(res.data ? res.data[0] : [])));
        break;
      default:
        message.error(res.message || '出错');
        break;
    }
  } catch (e) {
    message.error(e);
  }
}
export function* getGradeList() {
  // const requestURL = `${Config.zmtrlink}/api/userPhaseSubject/findGrade`;
  try {
    // const res = yield call(
    //   request,
    //   requestURL,
    //   Object.assign({}, postjsontokenoptions(), { body: JSON.stringify({}) })
    // );
    const res = yield userPhaseSubjectApi.findGrade();
    switch (res.code.toString()) {
      case '0':
        yield put(setGradeListAction(fromJS(res.data ? res.data : [])));
        yield put(setGradeAction(fromJS(res.data ? res.data[0] : [])));
        yield put(getGradeSubjectListAction());
        break;
      default:
        message.error(res.message || '出错');
        break;
    }
  } catch (e) {
    message.error(e);
  }
}

export function* getGradeSubjectList() {
  const grade = yield select(makeSelectGrade());
  const gradeId = grade.get('id');
  try {
    const res = yield userPhaseSubjectApi.findSubjectByGrade(gradeId);
    switch (res.code.toString()) {
      case '0':
        yield put(setGradeSubjectListAction(fromJS(res.data)));
        yield put(setGradeSubjectAction(fromJS(res.data[0])));
        yield put(getEditionListAction());
        // yield put(getListLeveFirstAction());
        break;
      default:
        message.error(res.message || '出错');
        break;
    }
  } catch (e) {
    message.error(e);
  }
}
export function* getEditionList() {
  const grade = yield select(makeSelectGrade());
  const selectGradeSubject = yield select(makeSelectGradeSubject());

  const gradeId = grade.get('id');
  const subjectId = selectGradeSubject.get('id');
  // const requestURL = `${Config.zmtrlink}/api/edition/findByGradeIdAndSubjectId`;
  try {
    // const res = yield call(
    //   request,
    //   requestURL,
    //   Object.assign({}, gettockenurloptions()),
    //   { gradeId, subjectId }
    // );
    const res = yield editionApi.findEditionByGradeIdAndSubjectId({ gradeId, subjectId });
    switch (res.code.toString()) {
      case '0':
        const editionList = res.data.map(item => ({
          id: item.id,
          name: `${item.name}${item.state === 0 ? ' (已下架)' : ''}`
        }));
        yield put(setEditionListAction(fromJS(editionList)));
        yield put(setEditionAction(fromJS(editionList[0] || [])));
        yield put(getListLeveFirstAction());
        break;
      default:
        message.error(res.message || '出错');
        break;
    }
  } catch (e) {
    message.error(e);
  }
}
export function* getLeveFirstList() {
  const selectGrade = yield select(makeSelectGrade());
  const classType = yield select(makeClassType());
  const selectGradeSubject = yield select(makeSelectGradeSubject());
  const edition = yield select(makeEdition());
  const pid = yield select(makeSelectPid());

  const params = {
    pid,
    gradeId: selectGrade.get('id'),
    subjectId: selectGradeSubject.get('id'),
    classType: classType.get('code'),
    editionId: edition.get('id')
  };
  // const requestURL = `${Config.trlink}/api/userPhaseSubject/findSubjectByPhase`;
  // const requestURL = `${Config.studySys}/trainingMaterialsSystem`;

  try {
    const res = yield trainingMaterialsSystemApi.getTrainingMaterialsSystem(params);
    switch (res.code.toString()) {
      case '0':
        if (res.data && res.data.length > 0) {
          yield put(setLeveFirstListAction(fromJS(res.data)));
          yield put(setLeveFirstIdAction(fromJS(res.data[0].id)));
          yield put(getSecondLevelListAction());
          yield put(setAddExit(false));
        } else {
          yield put(setLeveFirstListAction(fromJS([])));
          yield put(setLeveSecondListAction(fromJS([])));
          yield put(setLeveThreeListAction(fromJS([])));
          yield put(setAddExit(false));
        }
        break;
      default:
        message.error(res.message || '出错');
        break;
    }
  } catch (e) {
    yield put(setAddExit(false));
    message.error(e);
  }
}
export function* getSecondLevelList() {
  const selectGrade = yield select(makeSelectGrade());
  const classType = yield select(makeClassType());
  const selectGradeSubject = yield select(makeSelectGradeSubject());
  const edition = yield select(makeEdition());
  const pid = yield select(makeSelectFirstLevelId());

  const params = {
    pid,
    gradeId: selectGrade.get('id'),
    subjectId: selectGradeSubject.get('id'),
    classType: classType.get('code'),
    editionId: edition.get('id')
  };
  // const requestURL = `${Config.studySys}/trainingMaterialsSystem`;

  try {
    // const res = yield call(
    //   request,
    //   requestURL,
    //   Object.assign({}, gettockenurloptions()),
    //   params
    // );
    const res = yield trainingMaterialsSystemApi.getTrainingMaterialsSystem(params);
    switch (res.code.toString()) {
      case '0':
        if (res.data && res.data.length > 0) {
          yield put(setLeveSecondListAction(fromJS(res.data)));
          yield put(setLeveSecondIdAction(fromJS(res.data[0].id)));
          yield put(getThreeLevelListAction());
        } else {
          yield put(setLeveSecondListAction(fromJS([])));
          yield put(setLeveThreeListAction(fromJS([])));
        }
        break;
      default:
        message.error(res.message || '出错');
        break;
    }
  } catch (e) {
    message.error(e);
  }
}
export function* getThreeLevelList() {
  const selectGrade = yield select(makeSelectGrade());
  const classType = yield select(makeClassType());
  const selectGradeSubject = yield select(makeSelectGradeSubject());
  const edition = yield select(makeEdition());
  const pid = yield select(makeSelectSecondLevelId());

  const params = {
    pid,
    gradeId: selectGrade.get('id'),
    subjectId: selectGradeSubject.get('id'),
    classType: classType.get('code'),
    editionId: edition.get('id')
  };
  // const requestURL = `${Config.studySys}/trainingMaterialsSystem`;
  try {
    // const res = yield call(
    //   request,
    //   requestURL,
    //   Object.assign({}, gettockenurloptions()),
    //   params
    // );
    const res = yield trainingMaterialsSystemApi.getTrainingMaterialsSystem(params);
    switch (res.code.toString()) {
      case '0':
        if (res.data && res.data.length > 0) {
          yield put(setLeveThreeListAction(fromJS(res.data)));
          yield put(setLeveThreeIdAction(fromJS(res.data[0].id)));
        } else {
          yield put(setLeveThreeListAction(fromJS([])));
        }
        break;
      default:
        message.error(res.message || '出错');
        break;
    }
  } catch (e) {
    message.error(e);
  }
}
export function* save() {
  const classType = yield select(makeClassType());
  const subject = yield select(makeSelectGradeSubject());
  const grade = yield select(makeSelectGrade());
  const edition = yield select(makeEdition());
  const inputDto = yield select(makeSelectInputDto());
  const id = yield select(makeSelectCrudId());
  // 判断是否超过20字符
  if (inputDto.get('name').length > 20) {
    message.error('不能超过20个字符');
    return;
  }
  if (!inputDto.get('name').length) {
    message.error('输入不能为空');
    return;
  }
  try {
    const level = inputDto.get('level');
    let dto = inputDto
      .set('gradeId', grade.get('id'))
      .set('subjectId', subject.get('id'))
      .set('classType', classType.get('code'))
      .set('editionId', edition.get('id'));
    console.log('dto', dto.toJS());
    if (level === 1) {
      const classTypeList = yield select(makeSelectFirstLevel());
      dto = dto.set('pid', 0).set('sort', classTypeList.size);
    } else if (level === 2) {
      const courseTypeList = yield select(makeSelectSecondlevel());
      const pid = yield select(makeSelectFirstLevelId());
      dto = dto.set('pid', pid).set('sort', courseTypeList.size);
    } else if (level === 3) {
      const courseModuleList = yield select(makeSelectThreelevel());
      const pid = yield select(makeSelectSecondLevelId());
      dto = dto.set('pid', pid).set('sort', courseModuleList.size);
    }
    let res;
    if (id === 0) {
      // 新增
      console.log('需要保存的数据:', dto.toJS());
      res = yield trainingMaterialsSystemApi.setTrainingMaterialsSystem(dto.toJS());
    } else {
      // 修改
      dto = {
        name: inputDto.get('name')
      };
      res = yield trainingMaterialsSystemApi.setTrainingMaterialsSystemById(id, dto);
    }

    switch (res.code.toString()) {
      case '0':
        message.success('保存成功');
        if (level === 1) {
          yield put(getListLeveFirstAction());
        } else if (level === 2) {
          yield put(getSecondLevelListAction());
        } else if (level === 3) {
          yield put(getThreeLevelListAction());
        }
        yield put(setCrudIdAction(0));
        break;
      default:
        let msg = '保存失败';
        if (res.message) {
          msg = res.message;
        }
        message.error(res.message || msg);
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('save()出错啦~~~', e);
  }
}
export function* deleteById() {
  const id = yield select(makeSelectCrudId());
  const inputDto = yield select(makeSelectInputDto());
  // const requestURL = `${Config.studySys}/trainingMaterialsSystem/${id}`;
  console.log('delete():', id);
  try {
    // const res = yield call(
    //   request,
    //   requestURL,
    //   Object.assign({}, deletejsontokenoptions())
    // );
    const res = yield trainingMaterialsSystemApi.deleteTrainingMaterialsSystemById(id);
    switch (res.code.toString()) {
      case '0':
        const level = inputDto.get('level');
        if (level === 1) {
          yield put(getListLeveFirstAction());
        } else if (level === 2) {
          yield put(getSecondLevelListAction());
        } else if (level === 3) {
          yield put(getThreeLevelListAction());
        }
        message.success('删除成功');
        break;
      default:
        message.error(res.message || '删除失败');
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('delete()出错啦~~~', e);
  }
}
export function* sort() {
  const inputDto = yield select(makeSelectInputDto());
  // const requestURL = `${Config.studySys}/trainingMaterialsSystem/sort`;
  const level = inputDto.get('level');
  let list;
  if (level === 1) {
    list = yield select(makeSelectFirstLevel());
  } else if (level === 2) {
    list = yield select(makeSelectSecondlevel());
  } else if (level === 3) {
    list = yield select(makeSelectThreelevel());
  }
  const ids = list.toJS().map(item => item.id);
  console.log('sort():参数为：', ids);
  try {
    // const res = yield call(
    //   request,
    //   requestURL,
    //   Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(ids) })
    // );
    const res = yield trainingMaterialsSystemApi.sort(ids);
    switch (res.code.toString()) {
      case '0':
        if (level === 1) {
          yield put(getListLeveFirstAction());
        } else if (level === 2) {
          yield put(getSecondLevelListAction());
        } else if (level === 3) {
          yield put(getThreeLevelListAction());
        }
        break;
      default:
        message.error(res.message || '操作失败');
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('sort()出错啦~~~', e);
  }
}

export function* makeSort() {
  console.log('监听makeSort()');
  const watcher = yield takeLatest(SORT_ACTION, sort);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* makeDelete() {
  console.log('监听makeDelete()');
  const watcher = yield takeLatest(DELETE_ACTION, deleteById);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* makeSave() {
  // console.log('监听makeSave()');
  const watcher = yield takeLatest(SAVE_ACTION, save);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* makeGetGradeList() {
  const watcher = yield takeLatest(GET_GRADE_LIST_ACTION, getGradeList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* makeGetGradeSubjectList() {
  const watcher = yield takeLatest(
    GET_GRADE_SUBJECT_LIST_ACTION,
    getGradeSubjectList
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* makeGetClaseTypeList() {
  const watcher = yield takeLatest(
    GET_CLASS_TYPE_LIST_ACTION,
    getClaseTypeList
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* makeGetEditionList() {
  const watcher = yield takeLatest(
    GET_EDITION_LIST_ACTION,
    getEditionList
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* makeGetList() {
  const watcher = yield takeLatest(
    GET_LIST_LEVE_FIRST_ACTION,
    getLeveFirstList
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* makeGetSecondLevelList() {
  const watcher = yield takeLatest(
    GET_SECOND_LEVE_LIST_ACTION,
    getSecondLevelList
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* makeGetThreeLevelList() {
  const watcher = yield takeLatest(
    GET_THREE_LEVEL_LIST_ACTION,
    getThreeLevelList
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// All sagas to be loaded
export default [
  defaultSaga,
  makeGetClaseTypeList,
  makeGetGradeList,
  makeGetGradeSubjectList,
  makeGetList,
  makeGetSecondLevelList,
  makeSave,
  makeDelete,
  makeGetThreeLevelList,
  makeSort,
  makeGetEditionList
];
