import { cancel, put, select, take, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { message } from 'antd';
import { fromJS } from 'immutable';
import * as contants from './contants';
import {
  setPaperData,
  setListData,
  setErrorMessage,
  changePage,
  setPaperList,
  getPaperList,
  getEditionList,
  getCourseSystemList,
  togglePaperPreview,
  setPaperListLoading,
  setPaperListTotal,
  setSpining,
  setAllPaperParams,
  setSearchParams,
} from './action';
import {
  makePaperData,
  makeSaveParams,
  makeSearchParams,
  makeDataList,
} from './selectors';
import * as server from '../server';
import { verifyPaperData } from '../utils';

// 学科
export function* getSubject(action) {
  const { params } = action;
  const data = yield server.getSubjectGrade(params);
  yield put(setListData(fromJS(data), 'subjectList'));
}

export function* getSubjectSaga() {
  const watcher = yield takeLatest(contants.GET_SUBJECT_LIST, getSubject);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 题型
export function* getQuestionTypeList(action) {
  const { params } = action;
  const data = yield server.getQuestionType(params);
  yield put(setListData(fromJS(data), 'questionTypeList'));
}

export function* getQuestionTypeListSaga() {
  const watcher = yield takeLatest(
    contants.GET_QUESTION_TYPE_LIST,
    getQuestionTypeList,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 试卷类型
export function* getPaperTypeList(action) {
  const { params } = action;
  const data = yield server.getChildPaperType(params);
  yield put(setListData(fromJS(data), 'paperTypeList'));
}

export function* getPaperTypeListSaga() {
  const watcher = yield takeLatest(
    contants.GET_PAPER_TYPE_LIST,
    getPaperTypeList,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 试卷难度
export function* getPaperDifficulty(action) {
  const { params } = action;
  const data = yield server.getChildDifficulty(params);
  yield put(setListData(fromJS(data), 'paperDifficulty'));
}

export function* getPaperDifficultySaga() {
  const watcher = yield takeLatest(
    contants.GET_DIFFICULTY_LIST,
    getPaperDifficulty,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 年份
export function* getYearList(action) {
  const { params } = action;
  const data = yield server.getYearList(params);
  yield put(setListData(fromJS(data), 'yearList'));
}

export function* getYearListSaga() {
  const watcher = yield takeLatest(contants.GET_YEAR_LIST, getYearList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 上下架
export function* getStateList(action) {
  const { params } = action;
  const data = yield server.getStateList(params);
  yield put(setListData(fromJS(data), 'stateList'));
}

export function* getStateListSaga() {
  const watcher = yield takeLatest(contants.GET_STATE_LIST, getStateList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 课程体系
export function* getEdition(action) {
  const { params } = action;
  const data = yield server.getEdition(params);
  yield put(setListData(fromJS(data), 'editionList'));
}

export function* getEditonListSaga() {
  const watcher = yield takeLatest(contants.GET_EDITION_LIST, getEdition);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 正式课课程
export function* getCourseSystem(action) {
  const { params } = action;
  const data = yield server.getCourseSystem(params);
  yield put(setListData(fromJS(data), 'courseSystemList'));
}

export function* getCourseSystemListSaga() {
  const watcher = yield takeLatest(contants.GET_COURSE_SYSTEM, getCourseSystem);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 试卷列表
export function* getExamPaperList() {
  yield put(setPaperListLoading(true));
  const params = (yield select(makeSearchParams())).toJS();
  const data = yield server.getExamPaperList(params);
  const pageIndex = params.pageIndex;
  if (data.list && data.list.length === 0 && pageIndex > 1) {
    yield put(setSearchParams('pageIndex', pageIndex - 1));
    yield put(getPaperList());
  } else {
    yield [
      put(setPaperList(fromJS(data.list || []))),
      put(setPaperListLoading(false)),
      put(setPaperListTotal(data.total || 0)),
    ];
  }
}

export function* getExamPaperListSaga() {
  const watcher = yield takeLatest(
    contants.GET_EXAM_PAPER_LIST,
    getExamPaperList,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* changePaperOnlineFlag(action) {
  const { isOffline, id } = action;
  let succeed;
  if (isOffline) {
    succeed = yield server.onlineExamPaper({ examPaperId: id });
  } else {
    succeed = yield server.offlineExamPaper({ examPaperId: id });
  }
  if (succeed) yield put(getPaperList());
}

export function* changePaperOnlineFlagSaga() {
  const watcher = yield takeLatest(
    contants.CHANGE_PAPER_ONLINE_FLAG,
    changePaperOnlineFlag,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* deletePaper(action) {
  const { id } = action;
  const succeed = yield server.deleteExamPaper({ id });
  if (succeed) yield put(getPaperList());
}

export function* deletePaperSaga() {
  const watcher = yield takeLatest(contants.DETELE_PAPER, deletePaper);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getPaperDetail(action) {
  const { id, nextType } = action;
  yield put(setSpining(true));
  const data = yield server.getExamPaperDetail({ id });
  if (!data) {
    yield put(setSpining(false));
    return;
  }
  const {
    id: paperId,
    onlineFlag,
    subjectDictCode,
    gradeDictCode,
    difficulty,
    typeId,
    year,
    name,
    examPaperContentOutpuDtoList,
    totalScore,
    questionAmount,
    quoteCount,
    courseSystem = {},
    typeName,
    courseSystemName
  } = data;
  const { courseSystemId, editionId } = courseSystem;
  const paperData = examPaperContentOutpuDtoList.map(el => {
    el.typeId =
      el.examPaperContentQuestionList[0].questionOutputDto &&
      el.examPaperContentQuestionList[0].questionOutputDto.typeId;
    return el;
  });
  const dataList = yield select(makeDataList());
  const subjectList = dataList.get('subjectList');
  let gradeList = fromJS([]);
  subjectList.some(el => {
    if (el.get('id') === subjectDictCode) {
      gradeList = el.get('children');
      return true;
    }
    return false;
  });
  yield [
    put(setAllPaperParams(fromJS({
      id: paperId,
      onlineFlag,
      subjectDictCode,
      gradeDictCode,
      difficulty,
      typeId,
      year,
      name,
      examPaperContentOutpuDtoList,
      totalScore,
      questionAmount,
      quoteCount,
      typeName,
      courseSystemName,
      courseSystemId,
      editionId,
    }))),
    put(setPaperData(fromJS(paperData))),
  ];

  yield [
    put(setListData(gradeList, 'gradeList')),
    put(getEditionList({ subjectDictCode, gradeDictCode })),
    put(getCourseSystemList({ subjectDictCode, gradeDictCode, editionId })),
    put(setSpining(false)),
  ];

  if (nextType === 'edit') {
    yield put(changePage('edit'));
  }
  if (nextType === 'preview') {
    yield put(togglePaperPreview(true));
  }
}

export function* getPaperDetailSaga() {
  const watcher = yield takeLatest(
    contants.GET_EXAM_PAPER_DETAIL,
    getPaperDetail,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* showAnswer(action) {
  const { ids, flag } = action;
  const paperData = yield select(makePaperData());
  const newPaperData = paperData.map(el => {
    const questionList = el
      .get('examPaperContentQuestionList')
      .map(question => {
        const showAnalysis = question.get('showAnalysis');
        const id = question.get('questionId');
        if (ids.includes(id)) {
          return typeof flag === 'boolean'
            ? question.set('showAnalysis', flag)
            : question.set('showAnalysis', !showAnalysis);
        }
        return question;
      });
    return el.set('examPaperContentQuestionList', questionList);
  });
  yield put(setPaperData(newPaperData));
}

export function* toggleShowAnswer() {
  const watcher = yield takeLatest(contants.TOGGLE_SHOW_ANSWER, showAnswer);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* showAllAnswer(action) {
  const { status } = action;
  const paperData = yield select(makePaperData());
  const newPaperData = paperData.map(el => {
    const questionList = el
      .get('examPaperContentQuestionList')
      .map(question => {
        return question.set('showAnalysis', status);
      });
    return el.set('examPaperContentQuestionList', questionList);
  });
  yield put(setPaperData(newPaperData));
}

export function* toggleShowAllAnswer() {
  const watcher = yield takeLatest(contants.SHOW_ALL_ANSWER, showAllAnswer);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* setQuestionScore(action) {
  const { ids, score } = action;
  const paperData = yield select(makePaperData());
  const newPaperData = paperData.map(el => {
    const examPaperContentQuestionList = el
      .get('examPaperContentQuestionList')
      .map(question => {
        if (ids.includes(question.get('questionId'))) {
          return question.set('score', score);
        }
        return question;
      });
    return el.set('examPaperContentQuestionList', examPaperContentQuestionList);
  });
  yield put(setPaperData(newPaperData));
}

export function* setQuestionScoreSaga() {
  const watcher = yield takeLatest(
    contants.SET_QUESTION_SCORE,
    setQuestionScore,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* deleteBigQuestion(action) {
  const { index } = action;
  const paperData = yield select(makePaperData());
  const newPaperData = paperData.splice(index, 1);
  yield put(setPaperData(newPaperData));
}

export function* deleteBigQuestionSaga() {
  const watcher = yield takeLatest(
    contants.DELETE_BIG_QUESTION,
    deleteBigQuestion,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* deleteSmallQuestion(action) {
  const { id } = action;
  const paperData = yield select(makePaperData());
  const newPaperData = paperData.map(el => {
    const examPaperContentQuestionList = el
      .get('examPaperContentQuestionList')
      .filter(question => {
        return question.get('questionId') !== id;
      });
    return el.set('examPaperContentQuestionList', examPaperContentQuestionList);
  });
  yield put(setPaperData(newPaperData));
}

export function* deleteSmallQuestionSaga() {
  const watcher = yield takeLatest(
    contants.DELETE_SMALL_QUESTION,
    deleteSmallQuestion,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* orderQuestion(action) {
  const { id, orderType, index } = action;
  const paperData = yield select(makePaperData());
  const questionList = paperData.getIn([index, 'examPaperContentQuestionList']);
  let newQuestionList;
  for (let i = 0; i < questionList.count(); i++) {
    if (questionList.getIn([i, 'questionId']) === id) {
      if (orderType === 'up') {
        if (i === 0) return message.error('已经是第一位了');
        const item = questionList.get(i);
        newQuestionList = questionList.splice(i, 1).splice(i - 1, 0, item);
      }
      if (orderType === 'down') {
        if (i === questionList.count() - 1) {
          return message.error('已经是最后一位了');
        }
        const item = questionList.get(i);
        newQuestionList = questionList.splice(i, 1).splice(i + 1, 0, item);
      }
    }
  }
  const newPaperData = paperData.setIn(
    [index, 'examPaperContentQuestionList'],
    newQuestionList,
  );
  yield put(setPaperData(newPaperData));
}

export function* orderQuestionSaga() {
  const watcher = yield takeLatest(contants.ORDER_QUESTION, orderQuestion);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// 保存试卷
export function* saveExamPaper() {
  const params = (yield select(makeSaveParams())).toJS();
  const paperData = (yield select(makePaperData())).toJS();
  const {
    id,
    courseSystemId,
    difficulty,
    gradeDictCode,
    name,
    onlineFlag,
    subjectDictCode,
    typeId,
    year,
    editionId,
  } = params;

  const examPaperContentOutpuDtoList = paperData.map(el => {
    el.typeId = void 0;
    el.examPaperContentQuestionList = el.examPaperContentQuestionList.map(
      (question, index) => ({
        questionId: question.questionId,
        serialNumber: index + 1,
        score: question.score,
      }),
    );
    return el;
  });
  const newParams = {
    id,
    courseSystemId,
    difficulty,
    gradeDictCode,
    name,
    onlineFlag,
    subjectDictCode,
    typeId,
    year,
    editionId,
    examPaperContentOutpuDtoList,
  };
  const errMessage = verifyPaperData(newParams);
  console.log(errMessage, 'message');
  yield put(setErrorMessage(fromJS(errMessage)));
  if (Object.keys(errMessage).length > 0) return;
  let success;
  if (id) { // 存在 id 更新试卷
    success = yield server.updateExamPaper(newParams);
  } else { // 新增试卷
    success = yield server.saveExamPaper(newParams);
  }

  if (success) {
    yield [
      put(changePage('home')),
      put(setPaperData(fromJS([]))),
      put(setAllPaperParams(fromJS({ typeId: '1', difficulty: '2', }))),
    ];
    yield put(getPaperList());
  }
}

export function* saveExamPaperSaga() {
  const watcher = yield takeLatest(contants.SAVE_EXAM_PAPER, saveExamPaper);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  toggleShowAnswer,
  setQuestionScoreSaga,
  deleteBigQuestionSaga,
  deleteSmallQuestionSaga,
  orderQuestionSaga,
  getSubjectSaga,
  getQuestionTypeListSaga,
  getPaperTypeListSaga,
  getPaperDifficultySaga,
  getYearListSaga,
  getStateListSaga,
  saveExamPaperSaga,
  getEditonListSaga,
  getCourseSystemListSaga,
  getExamPaperListSaga,
  changePaperOnlineFlagSaga,
  deletePaperSaga,
  getPaperDetailSaga,
  toggleShowAllAnswer,
];
