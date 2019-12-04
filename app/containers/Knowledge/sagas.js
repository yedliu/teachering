/* eslint-disable no-case-declarations */
import { cancel, put, select, take, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';
import { message } from 'antd';
import { changeIsLoadingStateAction } from 'containers/LeftNavC/actions';
import {
  GET_PHASE_SUBJECT_LIST_ACTION,
  GET_KNOWLEDGE_LIST_ACTION,
  SAVE_ACTION,
  SORT_ACTION,
  DELETE_ACTION, GET_KNOWLEDGE_ACTION,
  GET_ORIGIN_KNOWLEDGE_ACTION,
} from './constants';
import {
  setPhaseSubjectListAction,
  setPhaseSubjectAction,
  // setKnowledgeAction,
  getKnowledgeListAction,
  setKnowledgeListAction,
  setSelectedKnowledgeListAction,
  setCrudIdAction,
  setModalAttrAction,
  getKnowledgeAction,
  setInputDtoAction,
  setOriginKnowledgeList,
  getOriginKnowledgeListAction,
} from './actions';
import {
  makeSelectPhaseSubject,
  makeSelectCrudId,
  makeSelectKnowledgeList,
  makeSelectInputDto,
  makeSelectSelectedKnowledgeList, makeSelectModalAttr,
} from './selectors';
import phaseSubjectEndpiont from '../../api/tr-cloud/phase-subject-endpoint';
import knowledgeEndPoint from '../../api/tr-cloud/knowledge-endpoint';

// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}

export function* getPhaseSubjectList() {
  try {
    const res = yield phaseSubjectEndpiont.findAllPhaseSubject();
    switch (res.code.toString()) {
      case '0':
        yield put(setPhaseSubjectListAction(fromJS(res.data)));
        yield put(setPhaseSubjectAction(fromJS(res.data[0])));
        yield put(getKnowledgeListAction());
        yield put(getOriginKnowledgeListAction()); // 获取所有知识点节点
        break;
      default:
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    console.log('出错啦~', e);
  }
}

export function* makeGetPhaseSubjectList() {
  // console.log('makeGetPhaseSubjectList');
  const watcher = yield takeLatest(GET_PHASE_SUBJECT_LIST_ACTION, getPhaseSubjectList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getKnowledgeList() {
  yield put(changeIsLoadingStateAction(true));
  const phaseSubject = yield select(makeSelectPhaseSubject());
  const params = { phaseSubjectId: phaseSubject.get('id') };
  try {
    const res = yield knowledgeEndPoint.findFirstLevelByPhaseSubjectIdForTr(params);
    switch (res.code.toString()) {
      case '0':
        const knowledgeList = fromJS(res.data || []).map((item) => {
          // eslint-disable-next-line no-param-reassign
          item = item.set('editable', false).set('toolBarVisible', false);
          return item;
        });
        if (knowledgeList.count() > 0) {
          yield put(setKnowledgeListAction(fromJS([]).push(knowledgeList)));
          const selectedKnowledgeOne = knowledgeList.get(0) || fromJS({});
          yield put(setSelectedKnowledgeListAction(fromJS([]).push(selectedKnowledgeOne)));
          const inputDto = yield select(makeSelectInputDto());
          const newIputDto = inputDto.set('level', selectedKnowledgeOne.get('level'));
          yield put(setInputDtoAction(newIputDto));
          yield put(getKnowledgeAction(selectedKnowledgeOne.get('id')));
          // console.log(newIputDto.toJS(), 'newIputDto');
          // console.log(selectedKnowledgeOne.toJS(), 'selectedKnowledgeList');
        } else {
          yield put(setKnowledgeListAction(fromJS([]).push(knowledgeList)));
        }
        // if (res.data && res.data.length > 0) {
        //   yield put(setKnowledgeAction(fromJS(res.data[0])));
        // }
        break;
      default:
        console.log('出错啦~返回code=1');
        break;
    }
    yield put(changeIsLoadingStateAction(false));
  } catch (e) {
    yield put(changeIsLoadingStateAction(false));
    console.log('getKnowledgeList()出错啦~~~', e);
  }
}

export function* makeGetKnowledgeList() {
  console.log('makeGetKnowledgeList');
  const watcher = yield takeLatest(GET_KNOWLEDGE_LIST_ACTION, getKnowledgeList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getKnowledge(action) {
  yield put(changeIsLoadingStateAction(true));
  const inputDto = yield select(makeSelectInputDto());
  const level = inputDto.get('level');
  const id = action.id ? action.id : yield select(makeSelectCrudId());
  const knowledgeList = yield select(makeSelectKnowledgeList());
  let selectedKnowledgeList = yield select(makeSelectSelectedKnowledgeList());
  const levelPrevOne = knowledgeList.get(level - 1).find((item) => item.get('id') === id);
  // console.log(inputDto.toJS(), levelPrevOne.toJS(), 'levelPrevOne');
  if (!levelPrevOne || !(id > 0)) {
    yield put(changeIsLoadingStateAction(false));
    return;
  }
  try {
    const res = yield knowledgeEndPoint.findByParentId({ parentId: id });
    switch (res.code.toString()) {
      case '0':
        const knowledgeList2 = fromJS(res.data || []).map((item, index) => {
          // eslint-disable-next-line no-param-reassign
          item = item.set('editable', false).set('toolBarVisible', false);
          return item;
        });
        if (knowledgeList2.count() > 0) {
          let selectedKnowledge = knowledgeList2.get(0) || fromJS({});
          selectedKnowledgeList = selectedKnowledgeList.set(level, selectedKnowledge);
          const newKnowledgeList = knowledgeList.set(level, knowledgeList2);
          // console.log(level, id, selectedKnowledgeList.toJS(), knowledgeList.toJS(), newKnowledgeList.toJS());
          yield put(setKnowledgeListAction(newKnowledgeList.slice(0, level + 1)));
          yield put(setSelectedKnowledgeListAction(selectedKnowledgeList));
          yield put(setCrudIdAction(selectedKnowledgeList.getIn([level, 'id'] || 0)));
          const newIputDto = inputDto.set('level', selectedKnowledge.get('level'));
          yield put(setInputDtoAction(newIputDto));
          yield put(getKnowledgeAction(selectedKnowledge.get('id')));
        } else {
          yield put(setKnowledgeListAction(knowledgeList.slice(0, level)));
          yield put(setSelectedKnowledgeListAction(selectedKnowledgeList.slice(0, level)));
          yield put(setCrudIdAction(0));
        }
        break;
      default:
        console.log('出错啦~返回code!==0');
        break;
    }
    yield put(changeIsLoadingStateAction(false));
  } catch (e) {
    console.log('getKnowledge()出错啦~~~', e);
    yield put(changeIsLoadingStateAction(false));
  }
}

export function* makeGetKnowledge() {
  // console.log('makeGetKnowledge');
  const watcher = yield takeLatest(GET_KNOWLEDGE_ACTION, getKnowledge);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* save(item) {
  console.log(item, 'eee');
  const phaseSubject = yield select(makeSelectPhaseSubject());
  const knowledgeList = yield select(makeSelectKnowledgeList());
  const selectedKnowledgeList = yield select(makeSelectSelectedKnowledgeList());
  const inputDto = yield select(makeSelectInputDto());
  const id = yield select(makeSelectCrudId());
  try {
    console.log(inputDto && inputDto.toJS());
    const level = inputDto.get('level');
    console.log(knowledgeList && knowledgeList.toJS());
    const curLevelList = knowledgeList.get(level) || [];
    let pId = 0;
    if (level > 1) {
      pId = selectedKnowledgeList.get(level - 2).get('id');
    }
    // 增加前置知识点
    const { Knowledge = fromJS([]) } = item;
    let dto = inputDto.set('phaseSubjectId', phaseSubject.get('id')).set('pId', pId).set('frontKnowledge', Knowledge.map(it => Number(it)));
    let res;
    if (id === 0) {
      // 新增
      dto = dto.set('sort', curLevelList.size || 0);
      let params = handleCopyWriting(dto.toJS(), item.CopyWriting);
      res = yield knowledgeEndPoint.save(params);
    } else {
      // 修改
      let params = handleCopyWriting(dto.toJS(), item.CopyWriting);
      res = yield knowledgeEndPoint.update(id, params);
    }

    switch (res.code.toString()) {
      case '0':
        message.success('保存成功');
        const modalAttr = yield select(makeSelectModalAttr());
        yield put(setModalAttrAction(modalAttr.set('visible', false)));
        // console.log('selectedKnowledge', selectedKnowledgeList.toJS(), selectedKnowledge && selectedKnowledge.toJS());
        const selectedKnowledge = selectedKnowledgeList.get(level - 2);
        if (level > 1 && selectedKnowledge) {
          yield put(setInputDtoAction(inputDto.set('level', level - 1)));
          yield put(getKnowledgeAction(selectedKnowledge.get('id')));
        } else if (level === 1) {
          yield put(getKnowledgeListAction());
        }
        yield put(getOriginKnowledgeListAction()); // 获取所有知识点节点
        break;
      default:
        message.error('保存失败');
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
  const inputDto = yield select(makeSelectInputDto());
  const level = inputDto.get('level');
  try {
    const res = yield knowledgeEndPoint.deleteOne(id);
    switch (res.code.toString()) {
      case '0':
        const selectedKnowledgeList = yield select(makeSelectSelectedKnowledgeList());
        const selectedKnowledge = selectedKnowledgeList.get(level - 2);
        if (level > 1 && selectedKnowledge) {
          yield put(setInputDtoAction(inputDto.set('level', level - 1)));
          yield put(getKnowledgeAction(selectedKnowledge.get('id')));
        } else if (level === 1) {
          yield put(getKnowledgeListAction());
        }
        yield put(getOriginKnowledgeListAction()); // 获取所有知识点节点
        message.success('删除成功');
        break;
      default:
        message.error('删除失败');
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    message.error('异常异常');
    console.log('delete()出错啦~~~', e);
  }
}

export function* makeDelete() {
  const watcher = yield takeLatest(DELETE_ACTION, deleteById);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* sort() {
  const list = yield select(makeSelectKnowledgeList());
  const inputDto = yield select(makeSelectInputDto());
  const level = inputDto.get('level');
  const idList = list.get(level).map((item) => {
    return item.get('id');
  });
  try {
    const res = yield knowledgeEndPoint.sort({ idList: idList.toJS() });
    switch (res.code.toString()) {
      case '0':
        message.success('操作成功');
        yield put(getKnowledgeListAction());
        break;
      default:
        message.error('操作失败');
        console.log('出错啦~返回code=1');
        break;
    }
  } catch (e) {
    message.error('系统异常');
    console.log('sort()出错啦~~~', e);
  }
}

export function* makeSort() {
  const watcher = yield takeLatest(SORT_ACTION, sort);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getOriginKnowledgeSaga() {
  const watcher = yield takeLatest(GET_ORIGIN_KNOWLEDGE_ACTION, getOriginKnowledge);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getOriginKnowledge() {
  const phaseSubject = yield select(makeSelectPhaseSubject());
  try {
    const res = yield knowledgeEndPoint.findAllByPhaseSubjectIdForTr({ phaseSubjectId: phaseSubject.get('id') });
    switch (res.code.toString()) {
      case '0':
        yield put(setOriginKnowledgeList(fromJS(res.data)));
        break;
      default:
        message.error(res.message || '获取知识点失败');
        break;
    }
  } catch (error) {
    message.error('获取知识点程序异常');
  }
}
const handleCopyWriting = (params, copyWriting) => {
  console.log(params, copyWriting);
  if (copyWriting) {
    let { studySuggestionEasy, studySuggestionMiddle, studySuggestionDifficulty } = copyWriting;
    params.studySuggestionEasy = studySuggestionEasy;
    params.studySuggestionMiddle = studySuggestionMiddle;
    params.studySuggestionDifficulty = studySuggestionDifficulty;
  }
  return params;
};
// All sagas to be loaded
export default [
  defaultSaga,
  makeGetPhaseSubjectList,
  makeGetKnowledgeList,
  makeGetKnowledge,
  makeSave,
  makeDelete,
  makeSort,
  getOriginKnowledgeSaga,
];
