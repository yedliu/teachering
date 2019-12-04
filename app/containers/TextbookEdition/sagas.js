/* eslint-disable no-case-declarations */
import { cancel, put, select, take, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';
import { message } from 'antd';

import {
  setPhaseListAction,
  setPhaseAction,
  setSubjectListAction,
  setSubjectAction,
  getSubjectListAction,
  setGradeListAction,
  setGradeIdAction,
  setSubjectIdAction,
  setSubjectEditionList,
  getSubjectAction,
  setTextbookListAction,
  setTextbookAction,
  getTextbookListAction,
  setAddNew,
  setEditionListAction,
  setEditionIdAction,
  getEditionListAction,
  setFirstNodeListAction,
  getFirstNodeListAction,
  setFirstNodeIdAction,
  setSecondNodeListAction,
  setSecondNodeIdAction,
  getSecondNodeListAction,
  setThreeNodeListAction,
  getThreeNodeListAction,
  setThreeNodeIdAction,
  setFourNodeListAction,
  setFourNodeIdAction,
  setKnowledgeListAction,
  setModalAttrAction,
  getFourNodeListAction,
  setKnowledgeCrudIdAction,
  setAddLevelAction
} from './actions';
import {
  GET_PHASE_LIST_ACTION,
  GET_SUBJECT_LIST_ACTION,
  GET_GRADE_ACTION,
  GET_SUBJECT_ACTION,
  GET_TEXTBOOK_LIST_ACTION,
  SAVE_TEXTBOOK_ACTION,
  DELETE_ACTION,
  GET_EDITION_LIST_ACTION,
  GET_FIRST_NODE_LSIT_ACTION,
  DELETE_NODE_ACTION,
  SAVE_ACTION,
  GET_SECOND_NODE_LSIT_ACTION,
  GET_THREE_NODE_LIST_ACTION,
  GET_FOUR_NODE_LIST_ACTION,
  GET_KNOWLEDGE_LIST_ACTION,
  DELETE_LEVEL_ACTION,
  SORT_ACTION
} from './constants';
import {
  makeSelectPhase,
  makeSelectSubject,
  makeSelectGradeId,
  makeSelectSubjectId,
  makeSelectInputChangeList,
  makeSelectAddNew,
  makeSelectTextbookList,
  makeSelectCrudId,
  makeSelectEditionId,
  makeSelectInputDto,
  makeSelectKnowledgeCrudId,
  makeSelectFirstNodeId,
  makeSelectSecondNodeId,
  makeSelectThreeNodeId,
  makeSelectModalAttr,
  makeSelectAddLevel,
  makeSelectFirstNodeList,
  makeSelectSecondNodeList,
  makeSelectThreeNodeList,
  makeSelectFourNodeList
} from './selectors';

import userPhaseSubjectApi from '../../api/tr-cloud/user-phase-subject-endpoint';
import textbookEditionApi from '../../api/tr-cloud/textbook-edition-endpoint';
import textbookApi from '../../api/tr-cloud/textbook-endpoint';
import knowledgeApi from '../../api/tr-cloud/knowledge-endpoint';

// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}

export function* getPhaseList() {
  console.log('getPhaseList');
  const params = { excludeIds: 5 };
  try {
    const res = yield userPhaseSubjectApi.findPhase(params);
    let result = res.data.map((o) => {
      return { id: o.phaseId, name: o.name };
    });
    switch (res.code.toString()) {
      case '0':
        yield put(setPhaseListAction(fromJS(result)));
        yield put(setPhaseAction(fromJS(result[0])));
        yield put(getSubjectListAction());
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

export function* getSubjectList() {
  const phase = yield select(makeSelectPhase());
  const phaseId = phase.get('id');
  const params = { excludeIds: 17 };
  try {
    const res = yield userPhaseSubjectApi.findSubjectByPhase(phaseId, params);
    let result = res.data.map((o) => {
      return { id: o.subjectId, name: o.name };
    });
    switch (res.code.toString()) {
      case '0':
        if (res.data && res.data.length > 0) {
          yield put(setSubjectListAction(fromJS(result)));
          yield put(setSubjectAction(fromJS(result[0])));
          yield put(getTextbookListAction());
        } else {
          // return;
        }

        break;
      default:
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('出错啦~~');
  }
}

export function* makeGetSubjectList() {
  console.log('makeGetSubjectList');
  const watcher = yield takeLatest(GET_SUBJECT_LIST_ACTION, getSubjectList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getGradeAll() {
  console.log('准备获取grade');
  const params = { excludeIds: '13,14,15' };
  try {
    const res = yield userPhaseSubjectApi.findGrade(params);
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

  const params = { excludeIds: 17 };
  try {
    const res = yield userPhaseSubjectApi.findSubjectByGrade(gradeId, params);
    switch (res.code.toString()) {
      case '0':
        if (res.data && res.data.length > 0) {
          yield put(setSubjectEditionList(fromJS(res.data)));
          yield put(setSubjectIdAction(fromJS(res.data[0].id)));
          yield put(getEditionListAction());
        } else {
          yield put(setSubjectEditionList(fromJS(res.data)));
          yield put(setSubjectIdAction());
          yield put(getEditionListAction());
        }

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

export function* getTextbookList() {
  const phase = yield select(makeSelectPhase());
  const subject = yield select(makeSelectSubject());
  const subjectId = subject.get('id');
  const phaseId = phase.get('id');
  const params = { phaseId, subjectId };
  if (!subjectId) {
    message.error('科目不能为空');
    return;
  }
  if (!phaseId) {
    message.error('学段不能为空');
    return;
  }
  console.log('params:', params);
  try {
    const res = yield textbookEditionApi.getTextbookEdition(params);
    switch (res.code.toString()) {
      case '0':
        yield put(setTextbookListAction(fromJS(res.data)));
        if (res.data && res.data.length > 0) {
          yield put(setTextbookAction(fromJS(res.data[0])));
        }
        break;
      default:
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('getTextbookList()出错啦~~~', e);
  }
}

export function* makeGetTextbookList() {
  console.log('makeGetKnowledge');
  const watcher = yield takeLatest(GET_TEXTBOOK_LIST_ACTION, getTextbookList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* TextbookSave() {
  const textbookList = yield select(makeSelectTextbookList());
  const inputList = yield select(makeSelectInputChangeList());
  const id = yield select(makeSelectCrudId());
  const models = yield select(makeSelectAddNew());
  try {
    let list = inputList.set('sort', textbookList.size);
    let res;
    if (id === 0) {
      // 新增
      res = yield textbookEditionApi.saveTextbookEdition(list.toJS());
    } else {
      // 修改
      list = {
        name: inputList.get('name'),
        phaseId: inputList.get('phaseId'),
        subjectId: inputList.get('subjectId')
      };
      res = yield textbookEditionApi.updateTextbookEdition(id, list);
    }

    switch (res.code.toString()) {
      case '0':
        message.success('保存成功');
        yield put(getTextbookListAction());
        yield put(setAddNew(models.set('visible', false)));
        break;
      default:
        if (!res.message) {
          message.error('保存失败');
        } else {
          message.error(res.message);
        }

        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('save()出错啦~~~', e);
  }
}

export function* makeTextbookSave() {
  // console.log('监听makeSave()');
  const watcher = yield takeLatest(SAVE_TEXTBOOK_ACTION, TextbookSave);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* deleteById() {
  const id = yield select(makeSelectCrudId());
  try {
    const res = yield textbookEditionApi.deleteTextbookEdition(id);
    switch (res.code.toString()) {
      case '0':
        yield put(getTextbookListAction());
        message.success('删除成功');
        break;
      default:
        if (!res.message) {
          message.error('删除失败');
        } else {
          message.error(res.message);
        }
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

export function* getEditionList() {
  const gradeId = yield select(makeSelectGradeId());
  const subjectId = yield select(makeSelectSubjectId());
  console.log('准备获取edition:', gradeId, subjectId);
  // const params = { gradeId, subjectId };
  if (gradeId && subjectId) {
    try {
      const res = yield textbookEditionApi.getEditionList(gradeId, subjectId);
      console.log(res, 'res');
      switch (res.code.toString()) {
        case '0':
          if (res.data && res.data.length > 0) {
            yield put(setEditionListAction(fromJS(res.data)));
            yield put(setEditionIdAction(fromJS(res.data[0].id)));
            yield put(getFirstNodeListAction());
          } else {
            yield put(setEditionListAction(fromJS([])));
            // yield put(setEditionListAction());
            yield put(setEditionIdAction(0));
          }

          break;
        default:
          console.log('出错啦~返回code=1');
          break;
      }
    } catch (e) {
      console.log('出错啦~~');
    }
  }
}

export function* makeGetEditionList() {
  console.log('监听getEdition');
  const watcher = yield takeLatest(GET_EDITION_LIST_ACTION, getEditionList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getFirstNodeList() {
  const editionId = yield select(makeSelectEditionId());
  const gradeId = yield select(makeSelectGradeId());
  const params = { editionId, gradeId };
  if (!editionId) {
    message.error('版本不能为空');
    return;
  }
  if (!gradeId) {
    message.error('年级不能为空');
    return;
  }
  try {
    const res = yield textbookApi.getTextbook(params);
    switch (res.code.toString()) {
      case '0':
        res.data.map((item) => {
          item.editable = false;
          item.toolBarVisible = false;
          return item;
        });
        console.log('数据来了', res.data);
        yield put(setFirstNodeListAction(fromJS(res.data)));
        if (res.data && res.data.length > 0) {
          yield put(setFirstNodeIdAction(fromJS(res.data[0].id)));
          yield put(getSecondNodeListAction());
        } else {
          yield put(setSecondNodeListAction(fromJS([])));
          yield put(setThreeNodeListAction(fromJS([])));
          yield put(setFourNodeListAction(fromJS([])));
        }
        break;
      default:
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('getFirstNodeList()出错啦~~~', e);
  }
}

export function* makeGetFirstNodeList() {
  const watcher = yield takeLatest(GET_FIRST_NODE_LSIT_ACTION, getFirstNodeList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getSecondNodeList() {
  const editionId = yield select(makeSelectEditionId());
  let parentId = yield select(makeSelectFirstNodeId());
  const gradeId = yield select(makeSelectGradeId());
  const params = { editionId, parentId, gradeId };
  try {
    const res = yield textbookApi.getTextbook(params);
    switch (res.code.toString()) {
      case '0':
        res.data.map((item) => {
          item.editable = false;
          item.toolBarVisible = false;
          return item;
        });
        console.log('数据来了', res.data);
        yield put(setSecondNodeListAction(fromJS(res.data)));
        if (res.data && res.data.length > 0) {
          yield put(setSecondNodeIdAction(fromJS(res.data[0].id)));
          yield put(getThreeNodeListAction());
        } else {
          yield put(setThreeNodeListAction(fromJS([])));
          yield put(setFourNodeListAction(fromJS([])));
        }
        break;
      default:
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('getSecondNodeList()出错啦~~~', e);
  }
}

export function* makeGetSecondNodeList() {
  const watcher = yield takeLatest(GET_SECOND_NODE_LSIT_ACTION, getSecondNodeList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getThreeNodeList() {
  const editionId = yield select(makeSelectEditionId());
  let parentId = yield select(makeSelectSecondNodeId());
  const gradeId = yield select(makeSelectGradeId());
  const params = { editionId, parentId, gradeId };
  try {
    const res = yield textbookApi.getTextbook(params);
    switch (res.code.toString()) {
      case '0':
        res.data.map((item) => {
          item.editable = false;
          item.toolBarVisible = false;
          return item;
        });
        console.log('数据来了', res.data);
        yield put(setThreeNodeListAction(fromJS(res.data)));
        if (res.data && res.data.length > 0) {
          yield put(setThreeNodeIdAction(fromJS(res.data[0].id)));
          yield put(getFourNodeListAction());
        } else {
          yield put(setFourNodeListAction(fromJS([])));
        }
        break;
      default:
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('getThreeNodeList()出错啦~~~', e);
  }
}

export function* makeGetThreeNodeList() {
  const watcher = yield takeLatest(GET_THREE_NODE_LIST_ACTION, getThreeNodeList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getFourNodeList() {
  const editionId = yield select(makeSelectEditionId());
  let parentId = yield select(makeSelectThreeNodeId());
  const gradeId = yield select(makeSelectGradeId());
  const params = { editionId, parentId, gradeId };
  try {
    const res = yield textbookApi.getTextbook(params);
    switch (res.code.toString()) {
      case '0':
        res.data.map((item) => {
          item.editable = false;
          item.toolBarVisible = false;
          return item;
        });
        console.log('数据来了', res.data);
        yield put(setFourNodeListAction(fromJS(res.data)));
        if (res.data && res.data.length > 0) {
          yield put(setFourNodeIdAction(fromJS(res.data[0].id)));
        }
        break;
      default:
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('getFourNodeList()出错啦~~~', e);
  }
}

export function* makeGetFourNodeList() {
  const watcher = yield takeLatest(GET_FOUR_NODE_LIST_ACTION, getFourNodeList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* save() {
  const gradeId = yield select(makeSelectGradeId());
  const subjectId = yield select(makeSelectSubjectId());
  const editionId = yield select(makeSelectEditionId());
  const inputDto = yield select(makeSelectInputDto());
  const id = yield select(makeSelectKnowledgeCrudId());
  const modalAttr = yield select(makeSelectModalAttr());
  if (!inputDto.get('name').length) {
    message.error('输入不能为空');
    return;
  }
  if (!editionId) {
    message.error('版本不能为空');
    return;
  }
  try {
    const level = inputDto.get('level');
    let dto = inputDto.set('gradeId', gradeId).set('subjectId', subjectId).set('editionId', editionId);
    if (level === 1) {
      const firstNodeList = yield select(makeSelectFirstNodeList());
      dto = dto.set('parentId', 0).set('sort', firstNodeList.size);
    } else if (level === 2) {
      const secondNodeList = yield select(makeSelectSecondNodeList());
      let parentId = yield select(makeSelectFirstNodeId());
      dto = dto.set('parentId', parentId).set('sort', secondNodeList.size);
    } else if (level === 3) {
      const threeNodeList = yield select(makeSelectThreeNodeList());
      let parentId = yield select(makeSelectSecondNodeId());
      dto = dto.set('parentId', parentId).set('sort', threeNodeList.size);
    } else if (level === 4) {
      const fourNodeList = yield select(makeSelectFourNodeList());
      let parentId = yield select(makeSelectThreeNodeId());
      dto = dto.set('parentId', parentId).set('sort', fourNodeList.size);
    }
    let res;
    console.log('id', id);
    if (id === 0) {
      // 新增
      console.log('需要保存的数据:', dto.toJS());
      res = yield textbookApi.saveTextbook(dto.toJS());
    } else {
      // 修改
      dto = {
        name: inputDto.get('name'),
        knowledgeIds: inputDto.get('knowledgeIds')
      };
      console.log('需要修改的数据:', dto);
      res = yield textbookApi.updateTextbook(id, dto);
    }

    switch (res.code.toString()) {
      case '0':
        message.success('保存成功');
        if (level === 1) {
          yield put(getFirstNodeListAction());
        } else if (level === 2) {
          yield put(getSecondNodeListAction());
          yield put(setModalAttrAction(modalAttr.set('visible', false)));
        } else if (level === 3) {
          yield put(getThreeNodeListAction());
          yield put(setModalAttrAction(modalAttr.set('visible', false)));
        } else if (level === 4) {
          yield put(getFourNodeListAction());
          yield put(setModalAttrAction(modalAttr.set('visible', false)));
        }
        yield put(setKnowledgeCrudIdAction(0));
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
  // console.log('监听makeSave()');
  const watcher = yield takeLatest(SAVE_ACTION, save);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* deleteNodeById() {
  const id = yield select(makeSelectKnowledgeCrudId());
  const inputDto = yield select(makeSelectInputDto());
  console.log('delete():', id);
  try {
    const res = yield textbookApi.deleteTextbook(id);
    switch (res.code.toString()) {
      case '0':
        const level = inputDto.get('level');
        if (level === 1) {
          yield put(getFirstNodeListAction());
        } else if (level === 2) {
          yield put(getSecondNodeListAction());
        } else if (level === 3) {
          yield put(getThreeNodeListAction());
        } else if (level === 4) {
          yield put(getFourNodeListAction());
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

export function* makeNodeDelete() {
  console.log('监听makeDelete()');
  const watcher = yield takeLatest(DELETE_NODE_ACTION, deleteNodeById);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* deleteLevelById(action) {
  const inputDto = yield select(makeSelectInputDto());
  let parentId = action.id;
  // const params = { parentId };
  console.log('action', action);
  try {
    const res = yield textbookApi.deleteTextbookByPId(parentId);
    switch (res.code.toString()) {
      case '0':
        const level = inputDto.get('level');
        let addLevel = yield select(makeSelectAddLevel());
        if (res.data && res.data.length > 0) {
          if (level === 3) {
            yield put(getThreeNodeListAction());
          } else if (level === 4) {
            yield put(getFourNodeListAction());
          }
        } else {
          if (level === 3) {
            yield put(setAddLevelAction(addLevel.set('showThree', false)));
            yield put(getThreeNodeListAction());
          } else if (level === 4) {
            yield put(setAddLevelAction(addLevel.set('showFour', false)));
          }
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

export function* makeLevelDelete() {
  console.log('监听makeDelete()');
  const watcher = yield takeLatest(DELETE_LEVEL_ACTION, deleteLevelById);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getKnowledgeList() {
  const gradeId = yield select(makeSelectGradeId());
  const subjectId = yield select(makeSelectSubjectId());
  if (gradeId < 0 || subjectId < 0) {
    return;
  }
  const res = yield knowledgeApi.getAllKnowledge({ gradeId, subjectId });
  try {
    if (res && res.code.toString() === '0') {
      console.log('获取知识点成功。', res);
      yield put(setKnowledgeListAction(fromJS(res.data || [])));
    } else {
      message.error(res.message || '系统异常错误导致获取知识点失败。');
      yield put(setKnowledgeListAction(fromJS([])));
    }
  } catch (e) {
    message.error('执行错误导致获取知识点失败。');
    console.log('getKnowledge 出错>>>', e);
  }
}
export function* GetKnowledgeList() {
  const watcher = yield takeLatest(GET_KNOWLEDGE_LIST_ACTION, getKnowledgeList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* sort() {
  const inputDto = yield select(makeSelectInputDto());
  const level = inputDto.get('level');
  let list;
  if (level === 1) {
    list = yield select(makeSelectFirstNodeList());
  } else if (level === 2) {
    list = yield select(makeSelectSecondNodeList());
  } else if (level === 3) {
    list = yield select(makeSelectThreeNodeList());
  } else if (level === 4) {
    list = yield select(makeSelectFourNodeList());
  }
  const idList = list.toJS().map((item) => item.id);
  console.log('sort():参数为：', idList);
  try {
    const res = yield textbookApi.textbookSort({ idList });
    switch (res.code.toString()) {
      case '0':
        if (level === 1) {
          yield put(getFirstNodeListAction());
        } else if (level === 2) {
          yield put(getSecondNodeListAction());
        } else if (level === 3) {
          yield put(getThreeNodeListAction());
        } else if (level === 4) {
          yield put(getFourNodeListAction());
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
  const watcher = yield takeLatest(SORT_ACTION, sort);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
  makeGetPhaseList,
  makeGetSubjectList,
  makeGetGradeAll,
  makeGetSubjectAll,
  makeGetTextbookList,
  makeTextbookSave,
  makeDelete,
  makeGetEditionList,
  makeGetFirstNodeList,
  makeSave,
  makeNodeDelete,
  makeGetSecondNodeList,
  makeGetThreeNodeList,
  makeGetFourNodeList,
  GetKnowledgeList,
  makeLevelDelete,
  makeSort
];
