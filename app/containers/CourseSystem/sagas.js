/* eslint-disable no-case-declarations */
// import { take, call, put, select } from 'redux-saga/effects';
// Individual exports for testing
import { cancel, put, select, take, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';
import { message } from 'antd';
import {
  DELETE_ACTION,
  GET_CLASS_TYPE_ACTION,
  GET_COURSE_CONTENT_ACTION,
  GET_COURSE_MODULE_ACTION,
  GET_COURSE_TYPE_ACTION,
  GET_EDITION_ACTION,
  GET_GRADE_ACTION,
  GET_SUBJECT_ACTION,
  SAVE_ACTION,
  SORT_ACTION,
  TO_GET_KNOWLEDGE
} from './constants';
import {
  getClassTypeAction,
  getCourseContentAction,
  getCourseModuleAction,
  getCourseTypeAction,
  getEditionAction,
  getSubjectAction,
  setClassTypeIdAction,
  setClassTypeListAction,
  setCourseContentIdAction,
  setCourseContentListAction,
  setCourseModuleIdAction,
  setCourseModuleListAction,
  setCourseTypeIdAction,
  setCourseTypeListAction,
  setCrudIdAction,
  setEditionIdAction,
  setEditionListAction,
  setGradeIdAction,
  setGradeListAction,
  setSubjectIdAction,
  setSubjectListAction,
  setModalAttrAction,
  setKnowLedgeList,
  setAddExit
} from './actions';
import {
  makeSelectClassTypeId,
  makeSelectClassTypeList,
  makeSelectCourseContentList,
  makeSelectCourseModuleId,
  makeSelectCourseModuleList,
  makeSelectCourseTypeId,
  makeSelectCourseTypeList,
  makeSelectCrudId,
  makeSelectEditionId,
  makeSelectGradeId,
  makeSelectInputDto,
  makeSelectSubjectId,
  makeSelectModalAttr
} from './selectors';
import gradeApi from '../../api/tr-cloud/grade-endpoint';
import phaseSubjectApi from '../../api/tr-cloud/phase-subject-endpoint';
import editionApi from '../../api/tr-cloud/edition-endpoint';
import courseSystemApi from '../../api/tr-cloud/course-system-endpoint';
import knowledgeApi from '../../api/tr-cloud/knowledge-endpoint';


export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}

export function* getGradeAll() {
  console.log('准备获取grade');
  try {
    const res = yield gradeApi.getGrade();
    switch (res.code.toString()) {
      case '0':
        yield put(setGradeListAction(fromJS(res.data)));
        yield put(setGradeIdAction(fromJS(res.data[0].id)));
        yield put(getSubjectAction());
        break;
      default:
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('出错啦~');
  }
}

export function* makeGetGradeAll() {
  console.log('监听getGradeAll');
  const watcher = yield takeLatest(GET_GRADE_ACTION, getGradeAll);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getSubjectAll() {
  const gradeId = yield select(makeSelectGradeId());
  console.log('准备获取subject:', gradeId);
  const params = { gradeId };
  try {
    const res = yield phaseSubjectApi.findAllSubject(params);
    switch (res.code.toString()) {
      case '0':
        yield put(setSubjectListAction(fromJS(res.data)));
        yield put(setSubjectIdAction(fromJS(res.data[0].id)));
        yield put(getEditionAction());
        break;
      default:
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('出错啦~~');
  }
}

export function* makeGetSubjectAll() {
  console.log('监听getSubjectAll');
  const watcher = yield takeLatest(GET_SUBJECT_ACTION, getSubjectAll);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getEdition() {
  const gradeId = yield select(makeSelectGradeId());
  const subjectId = yield select(makeSelectSubjectId());
  console.log('准备获取edition:', gradeId, subjectId);
  const params = { gradeId, subjectId };
  try {
    const res = yield editionApi.getEdition(params);
    switch (res.code.toString()) {
      case '0':
        yield put(setEditionListAction(fromJS(res.data)));
        yield put(setEditionIdAction(fromJS(res.data[0].id)));
        yield put(getClassTypeAction());
        break;
      default:
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('出错啦~~');
  }
}

export function* makeGetEdition() {
  console.log('监听getEdition');
  const watcher = yield takeLatest(GET_EDITION_ACTION, getEdition);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getClassType() {
  const gradeId = yield select(makeSelectGradeId());
  const subjectId = yield select(makeSelectSubjectId());
  const editionId = yield select(makeSelectEditionId());
  // console.log('getClassType():', gradeId, subjectId, editionId);
  const params = { gradeId, subjectId, editionId };
  try {
    const res = yield courseSystemApi.getFirstLevelClassType(params);
    switch (res.code.toString()) {
      case '0':
        res.data.map((item) => {
          item.editable = false;
          item.toolBarVisible = false;
          return item;
        });
        console.log('数据来了', res.data);
        yield put(setClassTypeListAction(fromJS(res.data)));
        if (res.data && res.data.length > 0) {
          yield put(setClassTypeIdAction(fromJS(res.data[0].id)));
          yield put(getCourseTypeAction());
        } else {
          yield put(setCourseTypeListAction(fromJS([])));
          yield put(setCourseModuleListAction(fromJS([])));
          yield put(setCourseContentListAction(fromJS([])));
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

export function* makeGetClassType() {
  console.log('监听getClassType()');
  const watcher = yield takeLatest(GET_CLASS_TYPE_ACTION, getClassType);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getCourseType() {
  const cztId = yield select(makeSelectClassTypeId());
  // const gradeId = yield select(makeSelectGradeId());
  // const subjectId = yield select(makeSelectSubjectId());
  // const editionId = yield select(makeSelectEditionId());
  // const params = { gradeId, subjectId, editionId };
  // const requestURL = `${Config.trlink}/api/courseSystem/courseType`;
  try {
    const res = yield courseSystemApi.findCourseSystemByParentId(cztId);
    switch (res.code.toString()) {
      case '0':
        yield put(setCourseTypeListAction(fromJS(res.data)));
        if (res.data && res.data.length > 0) {
          yield put(setCourseTypeIdAction(fromJS(res.data[0].id)));
          yield put(getCourseModuleAction());
        } else {
          yield put(setCourseModuleListAction(fromJS([])));
          yield put(setCourseContentListAction(fromJS([])));
        }
        yield put(setAddExit(false));
        break;
      default:
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('getCourseType()出错啦~~~', e);
  }
}

export function* makeGetCourseType() {
  console.log('监听getCourseType()');
  const watcher = yield takeLatest(GET_COURSE_TYPE_ACTION, getCourseType);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getCourseModule() {
  const ctId = yield select(makeSelectCourseTypeId());
  // const gradeId = yield select(makeSelectGradeId());
  // const subjectId = yield select(makeSelectSubjectId());
  // const editionId = yield select(makeSelectEditionId());
  // const params = { gradeId, subjectId, editionId };
  // const requestURL = `${Config.trlink}/api/courseSystem/courseModule`;
  try {
    const res = yield courseSystemApi.findCourseSystemByParentId(ctId);
    switch (res.code.toString()) {
      case '0':
        yield put(setCourseModuleListAction(fromJS(res.data)));
        if (res.data && res.data.length > 0) {
          yield put(setCourseModuleIdAction(fromJS(res.data[0].id)));
          yield put(getCourseContentAction());
        } else {
          yield put(setCourseContentListAction(fromJS([])));
        }
        yield put(setAddExit(false));
        break;
      default:
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('getCourseModule()出错啦~~~', e);
  }
}

export function* makeGetCourseModule() {
  console.log('监听getCourseType()');
  const watcher = yield takeLatest(GET_COURSE_MODULE_ACTION, getCourseModule);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getCourseContent() {
  const cmId = yield select(makeSelectCourseModuleId());
  // const gradeId = yield select(makeSelectGradeId());
  // const subjectId = yield select(makeSelectSubjectId());
  // const editionId = yield select(makeSelectEditionId());
  // const params = { gradeId, subjectId, editionId };
  console.log('getCourseContent():', cmId);
  try {
    const res = yield courseSystemApi.findCourseSystemByParentId(cmId);
    switch (res.code.toString()) {
      case '0':
        yield put(setCourseContentListAction(fromJS(res.data)));
        if (res.data && res.data.length > 0) {
          yield put(setCourseContentIdAction(fromJS(res.data[0].id)));
        }
        yield put(setAddExit(false));
        break;
      default:
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('getCourseModule()出错啦~~~', e);
  }
}

export function* makeGetCourseContent() {
  console.log('监听getCourseContent()');
  const watcher = yield takeLatest(GET_COURSE_CONTENT_ACTION, getCourseContent);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* save() {
  const gradeId = yield select(makeSelectGradeId());
  const subjectId = yield select(makeSelectSubjectId());
  const editionId = yield select(makeSelectEditionId());
  const inputDto = yield select(makeSelectInputDto());
  const id = yield select(makeSelectCrudId());
  const modalAttr = yield select(makeSelectModalAttr());
  // 判断是否超过20字符
  // if (inputDto.get('name').length > 20) {
  //   message.error('不能超过20个字符');
  //   return;
  // }
  console.log(11111);
  if (!inputDto.get('name').length) {
    message.error('输入不能为空');
    return;
  }
  try {
    const level = inputDto.get('level');
    let dto = inputDto.set('gradeId', gradeId).set('subjectId', subjectId).set('editionId', editionId);
    if (level === 1) {
      const classTypeList = yield select(makeSelectClassTypeList());
      dto = dto.set('pid', 0).set('sort', classTypeList.size);
    } else if (level === 2) {
      const courseTypeList = yield select(makeSelectCourseTypeList());
      const classTypeId = yield select(makeSelectClassTypeId());
      dto = dto.set('pid', classTypeId).set('sort', courseTypeList.size);
    } else if (level === 3) {
      const courseModuleList = yield select(makeSelectCourseModuleList());
      const courseTypeId = yield select(makeSelectCourseTypeId());
      dto = dto.set('pid', courseTypeId).set('sort', courseModuleList.size);
    } else if (level === 4) {
      const courseContentList = yield select(makeSelectCourseContentList());
      const courseModuleId = yield select(makeSelectCourseModuleId());
      dto = dto.set('pid', courseModuleId).set('sort', courseContentList.size);
    }
    let res;
    if (id === 0) {
      // 新增
      console.log('需要保存的数据:', dto.toJS());
      // 新建课程类型，模块，课程内容时，传isILAFlag，且值与对应的班型的isILAFlag对应
      let classTypeId = yield select(makeSelectClassTypeId());
      let nowClassTypeList = (yield select(makeSelectClassTypeList())).toJS();
      let targetIsILAFlag = null;
      nowClassTypeList.forEach(item => {
        if (item.id === classTypeId) {
          targetIsILAFlag = item.ilaFlag;
        }
      });
      let params = dto.toJS();
      if (targetIsILAFlag === 0 || targetIsILAFlag === 1) {
        params.ilaFlag = targetIsILAFlag;
      }
      res = yield courseSystemApi.saveCourseSystem(params);
    } else {
      // 修改
      dto = dto.set('name', inputDto.get('name'))
               .set('courseHour', inputDto.get('courseHour'))
               .set('knowledgeIds', inputDto.get('knowledgeIds'));
      // {
      //   name: inputDto.get('name'),
      //   courseHour: inputDto.get('courseHour'),
      //   knowledgeIds: inputDto.get('knowledgeIds')
      // };
      console.log('需要修改的数据:', dto.toJS());
      res = yield courseSystemApi.updateCourseSystem(id, dto.toJS());
    }

    switch (res.code.toString()) {
      case '0':
        message.success('保存成功');
        if (level === 1) {
          yield put(getClassTypeAction());
        } else if (level === 2) {
          yield put(getCourseTypeAction());
        } else if (level === 3) {
          yield put(getCourseModuleAction());
          yield put(setModalAttrAction(modalAttr.set('nameModalVisible', false)));
        } else if (level === 4) {
          yield put(getCourseContentAction());
          yield put(setModalAttrAction(modalAttr.set('visible', false)));
        }
        yield put(setCrudIdAction(0));
        break;
      default:
        let msg = '保存失败';
        if (res.message) {
          msg = res.message;
        }
        message.error(msg);
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('save()出错啦~~~', e);
  }
}

export function* makeSave() {
  console.log('监听makeSave()');
  const watcher = yield takeLatest(SAVE_ACTION, save);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* deleteById() {
  const id = yield select(makeSelectCrudId());
  const inputDto = yield select(makeSelectInputDto());
  console.log('delete():', id);
  try {
    const res = yield courseSystemApi.deleteCourseSystem(id);
    switch (res.code.toString()) {
      case '0':
        const level = inputDto.get('level');
        if (level === 1) {
          yield put(getClassTypeAction());
        } else if (level === 2) {
          yield put(getCourseTypeAction());
        } else if (level === 3) {
          yield put(getCourseModuleAction());
        } else if (level === 4) {
          yield put(getCourseContentAction());
        }
        message.success('删除成功');
        break;
      default:
        message.error('删除失败');
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('delete()出错啦~~~', e);
  }
}

export function* makeDelete() {
  console.log('监听makeDelete()');
  const watcher = yield takeLatest(DELETE_ACTION, deleteById);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* sort() {
  const inputDto = yield select(makeSelectInputDto());
  const level = inputDto.get('level');
  let list;
  if (level === 1) {
    list = yield select(makeSelectClassTypeList());
  } else if (level === 2) {
    list = yield select(makeSelectCourseTypeList());
  } else if (level === 3) {
    list = yield select(makeSelectCourseModuleList());
  } else if (level === 4) {
    list = yield select(makeSelectCourseContentList());
  }
  const idList = list.toJS().map((item) => item.id);
  console.log('sort():参数为：', idList);
  try {
    const res = yield courseSystemApi.sortCourseSystem({ idList });
    switch (res.code.toString()) {
      case '0':
        if (level === 1) {
          yield put(getClassTypeAction());
        } else if (level === 2) {
          yield put(getCourseTypeAction());
        } else if (level === 3) {
          yield put(getCourseModuleAction());
        } else if (level === 4) {
          yield put(getCourseContentAction());
        }
        break;
      default:
        message.error('操作失败');
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

export function* getKnowledge() {
  const gradeId = yield select(makeSelectGradeId());
  const subjectId = yield select(makeSelectSubjectId());
  if (gradeId < 0 || subjectId < 0) {
    return;
  }
  const res = yield knowledgeApi.getAllKnowledge({ gradeId, subjectId });
  try {
    if (res && res.code.toString() === '0') {
      console.log('获取知识点成功。', res);
      // const knowledgeIdList = ingadoToArr(res.data || []);
      // yield put(setPointListAction('knowledgeIdList', fromJS(knowledgeIdList)));
      yield put(setKnowLedgeList(fromJS(res.data || [])));
      // yield put(initCurInputAction());
    } else {
      message.error(res.message || '系统异常错误导致获取知识点失败。');
      yield put(setKnowLedgeList(fromJS([])));
    }
  } catch (e) {
    message.error('执行错误导致获取知识点失败。');
    console.log('getKnowledge 出错>>>', e);
  }
}
export function* toGetKnowledge() {
  const watcher = yield takeLatest(TO_GET_KNOWLEDGE, getKnowledge);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// All sagas to be loaded
export default [
  defaultSaga,
  makeGetGradeAll,
  makeGetSubjectAll,
  makeGetEdition,
  makeGetClassType,
  makeGetCourseType,
  makeGetCourseModule,
  makeGetCourseContent,
  makeSave,
  makeDelete,
  makeSort,
  toGetKnowledge
];
