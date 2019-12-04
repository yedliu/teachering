import { cancel, put, select, take, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';
import { message } from 'antd';
import {
  getGradeListAction,
  getSubjectListAction,
  getTestLessonKnowledgeListAction,
  setGradeAction,
  setGradeListAction,
  setModalAttrAction,
  setPhaseAction,
  setPhaseListAction,
  setBuAction,
  setSubjectAction,
  setSubjectListAction,
  setTestLessonKnowledgeAction,
  setTestLessonKnowledgeListAction,
  setClassTypeListAction,
  setTextbookEditionListAction,
  getTextbookEditionListAction,
  setTextbookEditionAction,
  updateLoading
} from './actions';
import {
  makeSelectCrudId,
  makeSelectInputDto,
  makeSelectModalAttr,
  makeSelectPhase,
  makeSelectGrade,
  makeSelectSubject,
  makeSelectBuObject,
  makeSelectTestLessonKnowledgeList,
  makeSelectTextbookEdition,
} from './selectors';
import {
  DELETE_ACTION,
  GET_GRADE_LIST_ACTION,
  GET_PHASE_LIST_ACTION,
  GET_CLASSTYPE_LIST_ACTION,
  GET_SUBJECT_LIST_ACTION,
  GET_TEST_LESSON_KNOWLEDGE_LIST_ACTION,
  SAVE_ACTION,
  SORT_ACTION,
  GET_TEXTBOOK_EDITION_LIST_ACTION,
  UPDATE_HOT,
} from './constants';

import phaseApi from '../../api/tr-cloud/phase-endpoint';
import dictApi from '../../api/tr-cloud/dict-endpoint';
import phaseSubjectApi from '../../api/tr-cloud/phase-subject-endpoint';
import textbookEditionApi from '../../api/tr-cloud/textbook-edition-endpoint';
import testLessonKnowledgeApi from '../../api/tr-cloud/test-lesson-knowledge-endpoint';

export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}

export function* getPhaseList() {
  console.log('getPhaseList');
  try {
    const res = yield phaseApi.getPhase();
    switch (res.code.toString()) {
      case '0':
        yield put(setPhaseListAction(fromJS(res.data)));
        yield put(setPhaseAction(fromJS(res.data[0])));
        yield put(getSubjectListAction());
        yield put(getGradeListAction());
        break;
      default:
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('出错啦~');
  }
}

export function* makeGetPhaseList() {
  console.log('makeGetPhaseList');
  const watcher = yield takeLatest(GET_PHASE_LIST_ACTION, getPhaseList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getClassTypeList() {
  console.log('getClassTypeList');
  const groupCode = 'CLASSTYPE';
  try {
    const res = yield dictApi.findSystemDictByGroupCode(groupCode);
    switch (res.code.toString()) {
      case '0':
        yield put(setClassTypeListAction(fromJS(res.data)));
        yield put(setBuAction(fromJS(res.data[0])));
        break;
      default:
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('出错啦~');
  }
}

export function* makeGetClassTypeList() {
  const watcher = yield takeLatest(GET_CLASSTYPE_LIST_ACTION, getClassTypeList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getGradeList() {
  console.log('getGradeList');
  const phase = yield select(makeSelectPhase());
  const phaseId = phase.get('id');
  try {
    const res = yield phaseSubjectApi.findGradeByPhaseId(phaseId);
    switch (res.code.toString()) {
      case '0':
        yield put(setGradeListAction(fromJS(res.data)));
        yield put(setGradeAction(fromJS({ id: '-1', name: '全部年级' })));
        break;
      default:
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('出错啦~');
  }
}

export function* makeGetGradeList() {
  console.log('makeGetGradeList');
  const watcher = yield takeLatest(GET_GRADE_LIST_ACTION, getGradeList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getSubjectList() {
  const phase = yield select(makeSelectPhase());
  const params = { phaseId: phase.get('id') };
  try {
    const res = yield phaseSubjectApi.findAllSubject(params);
    switch (res.code.toString()) {
      case '0':
        yield put(setSubjectListAction(fromJS(res.data)));
        yield put(setSubjectAction(fromJS(res.data[0])));
        yield put(getTextbookEditionListAction());
        break;
      default:
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('出错啦~~');
  }
}

export function* updateHot(action) {
  const { id, isHot } = action;
  console.log('updateHot():', id);
  try {
    yield put(updateLoading(true));
    const res = yield testLessonKnowledgeApi.updateHot(id, isHot);
    switch (res.code.toString()) {
      case '0':
        yield put(getTestLessonKnowledgeListAction());
        message.success('Hot更新成功');
        break;
      default:
        yield put(updateLoading(false));
        message.error('Hot更新失败');
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    yield put(updateLoading(false));
    console.log('delete()出错啦~~~', e);
  }
}

export function* makeGetSubjectList() {
  console.log('makeGetSubjectList');
  const watcher = yield takeLatest(GET_SUBJECT_LIST_ACTION, getSubjectList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getTextbookEditionList() {
  console.log('getTextbookEditionList');
  const phase = yield select(makeSelectPhase());
  const subject = yield select(makeSelectSubject());
  const params = { phaseId: phase.get('id'), subjectId: subject.get('id') };
  try {
    const res = yield textbookEditionApi.getTextbookEdition(params);
    switch (res.code.toString()) {
      case '0':
        res.data.unshift({ id: -1, name: '全部版本' });
        yield put(setTextbookEditionListAction(fromJS(res.data)));
        yield put(setTextbookEditionAction(fromJS({ id: -1, name: '全部版本' })));
        yield put(getTestLessonKnowledgeListAction());
        break;
      default:
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('getTextbookEditionList 出错啦~~~', e);
  }
}

export function* makeTextbookEditionList() {
  console.log('makeTextbookEditionList');
  const watcher = yield takeLatest(GET_TEXTBOOK_EDITION_LIST_ACTION, getTextbookEditionList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getTestLessonKnowledge() {
  const phase = yield select(makeSelectPhase());
  const subject = yield select(makeSelectSubject());
  const buObject = yield select(makeSelectBuObject());
  const edition = yield select(makeSelectTextbookEdition());
  const grade = yield select(makeSelectGrade());
  // eslint-disable-next-line eqeqeq
  const textbookEditionId = edition.get('id') == -1 ? null : edition.get('id');
  const params = {
    phaseId: phase.get('id'),
    subjectId: subject.get('id'),
    lessonType: buObject.get('code'),
    textbookEditionId
  };
  if (grade.get('id') !== '-1') {
    params.gradeId = grade.get('id');
  }
  try {
    yield put(updateLoading(true));
    const res = yield testLessonKnowledgeApi.getTestLessonKnowledge(params);
    yield put(updateLoading(false));
    switch (res.code.toString()) {
      case '0':
        yield put(setTestLessonKnowledgeListAction(fromJS(res.data)));
        if (res.data && res.data.length > 0) {
          yield put(setTestLessonKnowledgeAction(fromJS(res.data[0])));
        }
        break;
      default:
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('getClassType()出错啦~~~', e);
    yield put(updateLoading(false));
  }
}

export function* makeGetTestLessonKnowledge() {
  console.log('makeGetKnowledge');
  const watcher = yield takeLatest(GET_TEST_LESSON_KNOWLEDGE_LIST_ACTION, getTestLessonKnowledge);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* save() {
  const phase = yield select(makeSelectPhase());
  const subject = yield select(makeSelectSubject());
  const buObject = yield select(makeSelectBuObject());
  const testLessonKnowledgeList = yield select(makeSelectTestLessonKnowledgeList());
  const inputDto = yield select(makeSelectInputDto());
  const id = yield select(makeSelectCrudId());
  const modalAttr = yield select(makeSelectModalAttr());
  try {
    yield put(updateLoading(true));
    let dto = inputDto
      .set('phaseId', phase.get('id'))
      .set('subjectId', subject.get('id'))
      .set('sort', testLessonKnowledgeList.size)
      .set('lessonType', buObject.get('code'));
    let res;
    if (id === 0) {
      // 新增
      console.log('需要保存的数据:', dto.toJS());
      res = yield testLessonKnowledgeApi.saveTestLessonKnowledge(dto.toJS());
    } else {
      // 修改
      dto = {
        name: inputDto.get('name'),
        difficulty: inputDto.get('difficulty'),
        gradeIdList: inputDto.get('gradeIdList'),
        remarks: inputDto.get('remarks'),
        textbookEditionIdList: inputDto.get('textbookEditionIdList')
      };
      console.log('需要修改的数据:', dto);
      res = yield testLessonKnowledgeApi.updateTestLessonKnowledge(id, dto);
    }

    switch (res.code.toString()) {
      case '0':
        message.success('保存成功');
        yield put(getTestLessonKnowledgeListAction());
        yield put(setModalAttrAction(modalAttr.set('visible', false)));
        break;
      default:
        yield put(updateLoading(false));
        message.error('保存失败');
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    yield put(updateLoading(false));
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
  console.log('delete():', id);
  try {
    yield put(updateLoading(true));
    const res = yield testLessonKnowledgeApi.deleteTestLessonKnowledge(id);
    switch (res.code.toString()) {
      case '0':
        yield put(getTestLessonKnowledgeListAction());
        message.success('删除成功');
        break;
      default:
        yield put(updateLoading(false));
        message.error('删除失败');
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    yield put(updateLoading(false));
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
  const list = yield select(makeSelectTestLessonKnowledgeList());
  const idList = list.toJS().map((item) => item.id);
  console.log('sort():参数为：', idList);
  try {
    const res = yield testLessonKnowledgeApi.sortTestLessonKnowledge(idList);
    switch (res.code.toString()) {
      case '0':
        yield put(getTestLessonKnowledgeListAction());
        break;
      default:
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

export function* makeUpdateHot() {
  console.log('makeUpdateHot()');
  const watcher = yield takeLatest(UPDATE_HOT, updateHot);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
  makeGetPhaseList,
  makeGetClassTypeList,
  makeGetGradeList,
  makeGetSubjectList,
  makeGetTestLessonKnowledge,
  makeSave,
  makeDelete,
  makeSort,
  makeTextbookEditionList,
  makeUpdateHot,
];
