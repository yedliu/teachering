/* eslint-disable guard-for-in */
/* eslint-disable max-nested-callbacks */
/* eslint-disable no-case-declarations */
/* eslint-disable no-console */
import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { fromJS } from 'immutable';
import Config from 'utils/config';
import { LOCATION_CHANGE } from 'react-router-redux';
import { message, Modal } from 'antd';
import request, { postjsonoptions, getjsonoptions, getjsontokenoptions } from 'utils/request';
import { changeDataIsLoadingAction, changeBtnCanClickAction, changeBackPromptAlertShowAction } from 'containers/LeftNavC/actions';
import { changeVerifyCodeAction } from 'containers/Header/actions';
import { makeVerificationCode } from 'containers/Header/selectors';
import { strToArr } from 'containers/SetTags/tags';
import { backArr, limitCount, backfromZmStand, ingadoToArr, mathToUnify } from 'components/CommonFn';
import { verifyDataForSubmit } from './verifyDataForSubmit';
import exampaperApi from 'api/qb-cloud/exam-paper-end-point';
// import { paperData } from './paperData';
import {
  GET_EDITION_LIST,
  GET_COURSE_SYSTEM,
  GET_PAPER_MSG_ACTION,
  GET_CUR_PAPER,
  SUBMIT_ACTION,
  INIT_CUR_INPUT,
  TO_GET_PAPER,
  SAVE_SUBMIT,
  TO_GET_KNOWLEDGE,
  TO_GET_EXAMPOINT,
  SUBMIT_VERIFY_PAPER_ACTION,
  JUST_INTO_DEPOT_ACTION,
} from './constants';
import {
  makeInputDTO,
  makeCommonInfo,
  makePaperState,
  makePageSize,
  makePageIndex,
  makeSelectedEPID,
  makeQuestionList,
  makeQuestionIndex,
  toGetPaperId,
  getResult,
  toGetSort,
  makeQuestionsList,
  getKnowledgeList,
  getExamPointList,
} from './selectors';
import {
  setEditionListAction,
  setCourseSystemAction,
  changeNotGetPaperCountAction,
  changeHasGetPaperCountAction,
  setPaperListAction,
  setQuestionList,
  setInputDTOAction,
  setQuestionIndex,
  initCurInputAction,
  setCommonInfo,
  getCourseSystemAction,
  setPaperTitle,
  getPaperMsgAction,
  changePageState,
  setResult,
  setExamPointList,
  setKnowLedgeList,
  getKnowledgeAction,
  getExamPointAction,
  setCurrentPaperAction,
  setQuestionsListAction,
  setBigQuestionAction,
  setPointIdListAction,
  filterPointAction,
} from './actions';
import courseSystemApi from 'api/tr-cloud/course-system-endpoint';

// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}
// 获取 paperList
export function* getPaperMsg() {
  const requestURL = `${Config.trlink_qb}/api/examPaper`;
  const pageSize = yield select(makePageSize());
  const pageIndex = yield select(makePageIndex());
  const sort = yield select(toGetSort());
  const state = yield select(makePaperState());
  /*
    let _state = '10,14';
    if (state == 10) {
      state = '10,14';
      _state = '11';
    }
    let params = { pageSize, pageIndex, stateStr: state, sort };
    yield put(changeDataIsLoadingAction(true));
    try {
      const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params);
      switch (repos.code.toString()) {
        case '0':
          console.log(repos.data.total, 'count -- 27');
          if (state == '10,14') {
            yield put(changePaperCountAction(repos.data.total));
          } else if (state == 11) {
            yield put(changeHasGetPaperCountAction(repos.data.total));
          }
          yield put(setPaperListAction(fromJS(repos.data.data.reverse())));
          break;
        case '1':
          if (repos.message) {
            alert(repos.message);
          } else {
            alert('系统异常');
          }
          break;
        default:
          break;
      }
    } catch (err) {
      // err Msg
    }
    yield put(changeDataIsLoadingAction(false));
    try {
      let _params = { pageSize, pageIndex, stateStr: _state, sort };
      const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()), _params);
      switch (repos.code.toString()) {
        case '0':
          console.log(repos.data.total, 'count -- 27');
          if (_state == '10,14') {
            yield put(changePaperCountAction(repos.data.total));
          } else if (_state == 11) {
            yield put(changeHasGetPaperCountAction(repos.data.total));
          }
          break;
        default:
          break;
      }
  */
  const params1 = { pageSize, pageIndex, sort, stateStr: '10, 14' };
  const params2 = { pageSize, pageIndex, sort, stateStr: '', userRole: 6 };
  try {
    yield put(changeDataIsLoadingAction(true));
    if (state === 10) {
      const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params1);
      switch (repos.code.toString()) {
        case '0':
          yield put(setPaperListAction(fromJS(repos.data.data)));
          yield put(changeNotGetPaperCountAction(repos.data.total || 0));
          break;
        default:
          yield put(changeNotGetPaperCountAction(0));
          yield put(setPaperListAction(fromJS([])));
          message.warning(repos.message || '系统异常，请稍等片刻后再次尝试');
          break;
      }
      yield put(changeDataIsLoadingAction(false));
      const res = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params2);
      switch (res.code.toString()) {
        case '0':
          yield put(changeHasGetPaperCountAction(res.data.total || 0));
          break;
        default:
          if (res.message) {
            message.warning(res.message);
          } else {
            message.warning('获取已审核试卷数量异常');
          }
          break;
      }
    } else if (state === 11) {
      const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params2);
      switch (repos.code.toString()) {
        case '0':
          yield put(changeHasGetPaperCountAction(repos.data.total || 0));
          yield put(setPaperListAction(fromJS(repos.data.data)));
          break;
        case '1':
          break;
        default:
          yield put(changeHasGetPaperCountAction(0));
          yield put(setPaperListAction(fromJS([])));
          if (repos.message) {
            message.warning(repos.message);
          } else {
            message.warning('系统异常，请稍等片刻后尝试再次');
          }
          break;
      }
      yield put(changeDataIsLoadingAction(false));
      const res = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params1);
      // let filterCount = 0;
      // let total = 0;
      switch (res.code.toString()) {
        case '0':
          yield put(changeNotGetPaperCountAction(res.data.total || 0));
          break;
        case '1':
          break;
        default:
          if (res.message) {
            message.warning(res.message);
          } else {
            message.warning('获取未审核试卷数量异常');
          }
          break;
      }
    }
  } catch (err) {
    // err Msg
  }
  yield put(changeDataIsLoadingAction(false));
}

export function* getCurPaperTags() {
  const epId = yield select(makeSelectedEPID());
  const verificationCode = yield select(makeVerificationCode());
  const requestURL = `${Config.trlink_qb}/api/examPaper/${epId.get('id')}/action/preAuditTag`;
  const questionsList = [];
  const bigMsg = [];
  let realQuestionsCount = 0;
  const params = { captcha: verificationCode.get('code') };
  if (epId.get('state') === 10 && !params.captcha) {
    message.warning('请输入验证码后再提交！');
    return;
  }
  try {
    const repos = yield call(request, requestURL, Object.assign({ body: JSON.stringify(params) }, postjsonoptions()));
    // const repos = paperData;
    switch (repos.code.toString()) {
      case '0':
        yield put(changeVerifyCodeAction('default'));
        yield put(setCurrentPaperAction(fromJS(repos.data)));
        if (repos.data) {
          repos.data.examPaperContentOutputDTOList.forEach((item, index) => {
            bigMsg.push({
              count: item.examPaperContentQuestionOutputDTOList.length,
              name: item.name,
              serialNumber: index + 1,
            });
            item.examPaperContentQuestionOutputDTOList.forEach((it, i) => {
              realQuestionsCount += 1;
              const childrenCount = (it.questionOutputDTO.children || []).length;
              if (!it.questionOutputDTO.questionTag1) {
                // console.log('未找到部分标签内容,系统将使用默认参数替代', `第${index + 1}大题`, `低${i + 1} 小题`, 'examPaperContentQuestionOutputDTOList', 'tag1');
                it.questionOutputDTO.questionTag1 = {
                  comprehensiveDegreeId: 1,
                  difficulty: 1,
                  distinction: 1,
                  rating: 1,
                  examPointIds: null,
                  knowledgeIds: null,
                };
              }
              if (!it.questionOutputDTO.questionTag2) {
                // console.log('未找到部分标签内容,系统将使用默认参数替代', `第${index + 1}大题`, `低${i + 1} 小题`, 'examPaperContentQuestionOutputDTOList', 'tag2');
                it.questionOutputDTO.questionTag2 = {
                  comprehensiveDegreeId: 1,
                  difficulty: 1,
                  distinction: 1,
                  rating: 1,
                  examPointIds: null,
                  knowledgeIds: null,
                };
              }
              const knowledgeIdList1 = strToArr(it.questionOutputDTO.questionTag1.knowledgeIds, ',');
              const examPointIdList1 = strToArr(it.questionOutputDTO.questionTag1.examPointIds, ',');
              const knowledgeIdList2 = strToArr(it.questionOutputDTO.questionTag2.knowledgeIds, ',');
              const examPointIdList2 = strToArr(it.questionOutputDTO.questionTag2.examPointIds, ',');
              const knowledgeIdList = new Set([].concat(knowledgeIdList1, knowledgeIdList2));
              const examPointIdList = new Set([].concat(examPointIdList1, examPointIdList2));
              const children1 = it.questionOutputDTO.questionTag1.children || [];
              const children2 = it.questionOutputDTO.questionTag2.children || [];
              const newIt = it;
              newIt.questionOutputDTO.errState = -1;
              newIt.questionOutputDTO.verifyTagsSelect = {
                difficulty: 0,
                distinction: 0,
                comprehensiveDegreeId: 0,
                rating: 0,
                knowledgeIdList: 0,
                examPointIdList: 0,
              };
              newIt.questionOutputDTO.verifyTagsSelectDrop = {
                difficulty: 0,
                distinction: 0,
                comprehensiveDegreeId: 0,
                rating: 0,
                knowledgeIdList: [],
                examPointIdList: [],
              };
              newIt.questionOutputDTO.questionTag = {
                difficulty: 0,
                distinction: 0,
                comprehensiveDegreeId: 0,
                rating: 0,
                knowledgeIdList: Array.from(knowledgeIdList),
                examPointIdList: Array.from(examPointIdList),
                tagAdopt: 0,
                tagReason: '',
                questionId: it.questionId,
                errReason: '',
                showTextArea: false,
                children: backArr(childrenCount > 0, () => {
                  // console.log(children1, children2, 'children');
                  return new Array(childrenCount).fill('').map((iit, i) => {
                    const childrenKnowledgeList1 = strToArr((children1[i] || {}).knowledgeIds, ',');
                    const childrenExampointList1 = strToArr((children1[i] || {}).examPointIds, ',');
                    const childrenKnowledgeList2 = strToArr((children2[i] || {}).knowledgeIds, ',');
                    const childrenExampointList2 = strToArr((children2[i] || {}).examPointIds, ',');
                    const childrenKnowledgeList = new Set([].concat(childrenKnowledgeList1, childrenKnowledgeList2));
                    const childrenExampointList = new Set([].concat(childrenExampointList1, childrenExampointList2));
                    return {
                      knowledgeIdList: Array.from(childrenKnowledgeList),
                      examPointIdList: Array.from(childrenExampointList),
                      subQuestionId: it.questionOutputDTO.children[i].id,
                    };
                  });
                }),
              };
              const newQuestionOutputDTO = {
                title: backfromZmStand(it.questionOutputDTO.title || ''),
                analysis: backfromZmStand(it.questionOutputDTO.analysis || ''),
                answerList: (it.questionOutputDTO.answerList || []).map((iit) => backfromZmStand(iit || '')),
                optionList: (it.questionOutputDTO.optionList || []).map((iit) => backfromZmStand(iit || '')),
              };
              if (it.questionOutputDTO.children && it.questionOutputDTO.children.length > 0) {
                newQuestionOutputDTO.children = it.questionOutputDTO.children.map((itt) => {
                  return {
                    score: itt.score,
                    title: backfromZmStand(itt.title || ''),
                    optionList: (itt.optionList || []).map((iit) => backfromZmStand(iit || '')),
                    answerList: (itt.answerList || []).map((iit) => backfromZmStand(iit || '')),
                    analysis: backfromZmStand(itt.analysis || ''),
                    typeId: itt.typeId,
                  };
                });
              }
              newIt.questionOutputDTO = Object.assign({}, newIt.questionOutputDTO, newQuestionOutputDTO);
              questionsList.push(newIt);
            });
            item.examPaperContentQuestionOutputDTOList.map((it) => {
              const newIt = it;
              newIt.questionOutputDTO.questionTag1.knowledgeIdList = strToArr(it.questionOutputDTO.questionTag1.knowledgeIds, ',');
              newIt.questionOutputDTO.questionTag1.examPointIdList = strToArr(it.questionOutputDTO.questionTag1.examPointIds, ',');
              newIt.questionOutputDTO.questionTag1.children = (it.questionOutputDTO.questionTag1.children || []).map((iit) => {
                return {
                  knowledgeIdList: strToArr(iit.knowledgeIds, ','),
                  examPointIdList: strToArr(iit.examPointIds, ','),
                };
              });
              newIt.questionOutputDTO.questionTag2.knowledgeIdList = strToArr(it.questionOutputDTO.questionTag2.knowledgeIds, ',');
              newIt.questionOutputDTO.questionTag2.examPointIdList = strToArr(it.questionOutputDTO.questionTag2.examPointIds, ',');
              newIt.questionOutputDTO.questionTag2.children = (it.questionOutputDTO.questionTag2.children || []).map((iit) => {
                return {
                  knowledgeIdList: strToArr(iit.knowledgeIds, ','),
                  examPointIdList: strToArr(iit.examPointIds, ','),
                };
              });
              return newIt;
            });
          });
        }
        const commoninfo = {
          gradeId: repos.data.gradeId,
          subjectId: repos.data.subjectId,
          name: repos.data.name,
          questionCount: repos.data.questionAmount,
          realQuestionsCount,
        };
        // console.log(questionsList, 'questionsList - saga');
        yield put(setCommonInfo(fromJS(commoninfo)));
        yield put(setPaperTitle(repos.data.name));
        yield put(setBigQuestionAction(fromJS(bigMsg)));
        yield put(setQuestionsListAction(fromJS(questionsList)));
        yield put(changePageState(1));
        // yield put(changeRealQuestionsCountAction(realQuestionsCount));
        yield put(getKnowledgeAction());
        yield put(getExamPointAction());
        break;
      default:
        message.error(repos.message || '系统异常');
        // yield put(changeVerifyCodeAction('default'));
        break;
    }
    yield put(changeBackPromptAlertShowAction(false));
  } catch (err) {
    // console.log(err);
    message.error('执行错误');
    // yield put(changeVerifyCodeAction('default'));
    yield put(changeBackPromptAlertShowAction(false));
  }
}
export function* wcbinitCurInput() {
  const questionIndex = yield select(makeQuestionIndex());

  const questionList = yield select(makeQuestionList());
  const curQuesJS = questionList.toJS()[questionIndex];

  const dto = yield select(makeInputDTO());
  // console.log('questionIndex', dto);
  let dtoJS = dto.toJS();
  dtoJS.questionId = curQuesJS.questionId;
  const o_dto = curQuesJS.questionOutputDTO;
  for (let i in dtoJS) {
    if (i !== 'questionId') {
      dtoJS[i].local = 3;
    }
  }
  console.log('o_dto', o_dto);
  dtoJS.abilityIdList.value = o_dto.abilityIdList || [];
  dtoJS.comprehensiveDegreeId.value = o_dto.comprehensiveDegreeId || 1;
  dtoJS.coreLiteracyIdList.value = o_dto.coreLiteracyIdList || [];
  dtoJS.courseSystemIdList.value = o_dto.courseSystemIdList || [];
  dtoJS.difficulty.value = o_dto.difficulty || 1;
  dtoJS.distinction.value = o_dto.distinction || 1;
  // dtoJS.editionIdList.value = o_dto.editionIdList || []
  dtoJS.examPointIdList.value = o_dto.examPointIdList || [];
  // dtoJS.keywordList.value = (o_dto.keywordList && o_dto.keywordList.join('#')) || ''
  dtoJS.knowledgeIdList.value = o_dto.knowledgeIdList;
  dtoJS.rating.value = o_dto.rating || 1;
  dtoJS.recommendationIndex.value = o_dto.recommendationIndex || 1;
  dtoJS.subjectCharacteristicIdList.value = o_dto.subjectCharacteristicIdList || [];
  yield put(setInputDTOAction(fromJS(dtoJS)));
}
export function* wcbGetEditionList() {
  const info = yield select(makeCommonInfo());
  const requestURL = `${Config.zmtrlink}/api/edition`;
  const params = {
    gradeId: info.get('gradeId'),
    subjectId: info.get('subjectId'),
  };
  const res = yield call(request, requestURL, Object.assign({}, getjsontokenoptions()), params);
  try {
    if (res && Number(res.code) === 0) {
      console.log(res);
      yield put(setEditionListAction(fromJS(res.data)));
      yield put(getCourseSystemAction());
    }
  } catch (e) {
    console.log('wcbGetEditionList 出错>>>', e);
  }
}
export function* wcbGetCourseSystem() {
  const info = yield select(makeCommonInfo());
  const params = info.toJS();
  // const eList = yield select(makeEditionList());
  // const editionIdList = eList.toJS() || [];
  // const requestURL = `${Config.trlink}/api/courseSystem`;
  let courseSystem = [];
  params.editionId = '1';
    // || editionIdList[i].id;
  let res = yield courseSystemApi.getClassType(params);
  try {
    if (res && Number(res.code) === 0) {
      courseSystem = res.data || [];
    }
  } catch (e) {
    console.log('wcbGetEditionList 出错>>>', e);
  }
  //   }
  // }
  console.log('courseSystem', courseSystem);
  yield put(setCourseSystemAction(fromJS(courseSystem)));
}
export function* getKnowledge() {
  const info = yield select(makeCommonInfo());
  const requestURL = `${Config.trlink}/api/knowledge`;
  const params = mathToUnify(info.toJS());
  const res = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params);
  // const requestURL = `https://tr.zmlearn.com/api/knowledge`;
  // const res = yield call(request, requestURL, Object.assign({}, getjsonoptions()), { phaseSubjectId: 2 });
  try {
    if (res && res.code.toString() === '0') {
      // console.log(res);
      const knowledgeIdList = ingadoToArr(res.data || []);
      yield put(setPointIdListAction('knowledgeIdList', fromJS(knowledgeIdList)));
      yield put(setKnowLedgeList(fromJS(res.data || [])));
      yield put(filterPointAction('knowledgeIdList'));
    } else {
      message.warn('获取知识点失败');
    }
  } catch (e) {
    console.log('getKnowledge 出错>>>', e);
    message.warn('执行错误导致获取知识点失败。');
  }
}
export function* getExamPoint() {
  const info = yield select(makeCommonInfo());
  const requestURL = `${Config.trlink}/api/examPoint`;
  const params = mathToUnify(info.toJS());
  const res = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params);
  // const requestURL = `https://tr.zmlearn.com/api/examPoint`;
  // const res = yield call(request, requestURL, Object.assign({}, getjsonoptions()), { phaseSubjectId: 2 });
  try {
    if (res && res.code.toString() === '0') {
      // console.log(res)
      const examPointIdList = ingadoToArr(res.data || []);
      yield put(setPointIdListAction('examPointIdList', fromJS(examPointIdList)));
      yield put(setExamPointList(fromJS(res.data || [])));
      yield put(filterPointAction('examPointIdList'));
    } else {
      message.warn('获取考点失败');
    }
  } catch (e) {
    console.log('getKnowledge 出错>>>', e);
    message.warn('执行错误导致获取考点失败。');
  }
}
export function* save() {
  // 提交接口……
  const dto = yield select(makeInputDTO());
  const index = yield select(makeQuestionIndex());
  const list = yield select(makeQuestionList());
  let final = { questionId: dto.get('questionId') };
  const dtoJS = dto.toJS();
  let perfect = true;
  // 隐藏部分字段
  delete dtoJS.subjectCharacteristicIdList;
  delete dtoJS.abilityIdList;
  delete dtoJS.coreLiteracyIdList;
  delete dtoJS.courseSystemIdList;
  delete dtoJS.chapterIdList;

  console.log('dtoJS', dtoJS);

  for (let i in dtoJS) {
    let v = dtoJS[i];
    if (!perfect) {
      return;
    }
    if (v && v.local) {
      let _v = Number(v.local) === 3 ? v.value : v._value;
      if (!_v || (Object.prototype.toString.call(_v) === '[object Array]') && !_v.length) {
        message.warning('请完善选项！');
        perfect = false;
      }
      if (i === 'keywordList' && _v) {
        _v = _v.split('#');
      }
      final[i] = _v;
    }
  }
  if (!perfect) {
    return false;
  }
  console.log('dtoJS', dtoJS);
  // 改成整体提交
  const result = yield select(getResult());
  const _result = result.set(index, final);
  yield put(setResult(_result));
  let listJS = list.toJS();
  let o_item = listJS[index];
  let n_item = Object.assign({}, o_item.questionOutputDTO, final, { state: 12 });
  listJS[index].questionOutputDTO = n_item;
  listJS[index].errState = 1;
  yield put(setQuestionList(fromJS(listJS)));
  if (index + 1 < list.size) {
    yield put(setQuestionIndex(index + 1));
    yield put(initCurInputAction());
  } else {
    message.info('没有下一题了');
  }
}
export function* submit() {
  // 提交接口……
  const dto = yield select(makeInputDTO());
  const epId = yield select(makeSelectedEPID());
  const index = yield select(makeQuestionIndex());
  const list = yield select(makeQuestionList());
  let final = { questionId: dto.get('questionId') };
  const dtoJS = dto.toJS();
  let perfect = true;
  console.log('dtoJS', dtoJS);
  for (let i in dtoJS) {
    let v = dtoJS[i];
    if (!perfect) {
      return;
    }
    if (v && v.local) {
      let _v = Number(v.local) === 3 ? v.value : v._value;
      if (!_v || (Object.prototype.toString.call(_v) === '[object Array]') && !_v.length) {
        message.warning('请完善选项！');
        perfect = false;
      }
      if (i === 'keywordList') {
        _v = _v.split('#');
      }
      final[i] = _v;
    }
  }
  if (!perfect) {
    return false;
  }
  // 改成整体提交
  const result = yield select(getResult());
  const _result = result.set(index, final);
  yield put(setResult(_result));
  let listJS = list.toJS();
  let o_item = listJS[index];
  let n_item = Object.assign({}, o_item.questionOutputDTO, final, { state: 12 });
  listJS[index].questionOutputDTO = n_item;
  listJS[index].errState = 1;
  yield put(setQuestionList(fromJS(listJS)));
  try {
    const requestURL = `${Config.trlink_qb}/api/examPaper/${epId.get('id')}/action/auditTag`;
    let params = { epId: epId.get('id'), tagExamPaperQuesInputDTOList: _result.toJS() };
    const repos = yield call(request, requestURL, Object.assign({}, postjsonoptions(), { body: JSON.stringify(params) }));
    if (repos.code.toString() === '0') {
      message.success('提交成功！你可以返回继续审核其他试卷');
    } else {
      message.warning(repos.message || '系统异常');
    }
  } catch (e) {
    console.log('提交出错', e);
  }
}
// 暂时不用
export function* _submit() {
  // 提交接口……
  const dto = yield select(makeInputDTO());
  const epId = yield select(makeSelectedEPID());
  const index = yield select(makeQuestionIndex());
  const list = yield select(makeQuestionList());
  let final = { questionId: dto.get('questionId') };
  const dtoJS = dto.toJS();
  let perfect = true;
  for (let i in dtoJS) {
    let v = dtoJS[i];
    if (!perfect) {
      return;
    }
    if (v && v.local) {
      let _v = Number(v.local) === 3 ? v.value : v._value;
      if (!_v || (Object.prototype.toString.call(_v) === '[object Array]') && !_v.length) {
        message.warning('请完善选项！');
        perfect = false;
      }
      if (i === 'keywordList') {
        _v = _v.split('#');
      }
      final[i] = _v;
    }
  }
  if (!perfect) {
    return;
  }
  const requestURL = `${Config.trlink_qb}/api/examPaper/${epId.get('id')}/action/auditTag`;
  let params = { epId: epId.get('id'), tagExamPaperQuesInputDTOList: [final] };
  try {
    const repos = yield call(request, requestURL, Object.assign({}, postjsonoptions(), { body: JSON.stringify(params) }));
    if (repos.code.toString() === '0') {
      let listJS = list.toJS();
      let o_item = listJS[index];
      let n_item = Object.assign({}, o_item.questionOutputDTO, final, { state: 12 });
      listJS[index].questionOutputDTO = n_item;
      listJS[index].errState = 1;
      console.log('after submit', listJS);
      yield put(setQuestionList(fromJS(listJS)));
      if (index + 1 < list.size) {
        yield put(setQuestionIndex(index + 1));
        yield put(initCurInputAction());
      } else {
        message.info('没有下一题了');
      }
      message.success('保存成功！');
    } else {
      message.warning('提交失败！');
    }
  } catch (err) {
    // err Msg
    console.log('submit 失败 > ', err);
  }
  // success
}


export function* getPaper() {
  const id = yield select(toGetPaperId());
  const requestURL = `${Config.trlink_qb}/api/examPaper/${id}/action/receiveTag`;
  console.log('getPaper id', id);
  try {
    const repos = yield call(request, requestURL, Object.assign({}, postjsonoptions(), { body: JSON.stringify({ id }) }));
    if (repos.code.toString() === '0') {
      message.success('领取成功！');
      yield put(getPaperMsgAction());
    } else {
      message.warning(repos.message || '领取失败！');
    }
  } catch (err) {
    // err Msg
    console.log('getPaper 失败 > ', err);
  }
}

const backAdoptUserTagBool = (arr, judg) => {
  return arr.indexOf(judg) > -1;
};

export function* submitVerifyPaper(depot) {
  const epId = yield select(makeSelectedEPID());
  const requestURL = `${Config.trlink_qb}/api/examPaper/${epId.get('id')}/action/auditTag`;
  const questionsList = yield select(makeQuestionsList());
  const commonInfo = yield select(makeCommonInfo());
  const knowledgeIdList = yield select(getKnowledgeList());
  const examPointIdList = yield select(getExamPointList());
  let errList = [];
  // console.log(questionsList.toJS(), 'questionsList');
  // console.log(questionsList.toJS());
  // console.log(commonInfo.toJS());
  // console.log(limitCount);
  // console.log(knowledgeIdList.toJS());
  // console.log(examPointIdList.toJS());
  try {
    errList = verifyDataForSubmit(questionsList, commonInfo, limitCount, knowledgeIdList, examPointIdList);
  } catch (err) {
    console.log('err: ', err);
    errList.push({ type: 'codeRunning', value: '试卷数据出错，请刷新后重试。' });
  }
  if (errList.length > 0) {
    const childrenErr = errList[0].i ? `第${errList[0].i}小题；` : '';
    const errMsg = `错误信息：${errList[0].value}；错误位置：第 ${errList[0].index + 1} 题;${childrenErr}`;
    Modal.warning({
      title: '信息校验',
      content: errMsg,
      zIndex: 9,
    });
    return;
  }
  const params = {
    epId: epId.get('id'),
    finalAuditFlag: depot,
    tagExamPaperQuesInputDTOList: questionsList.toJS().map((item) => {
      const tags = item.questionOutputDTO.questionTag;
      return {
        difficulty: tags.difficulty,
        distinction: tags.distinction,
        comprehensiveDegreeId: tags.comprehensiveDegreeId,
        rating: tags.rating,
        knowledgeIdList: tags.knowledgeIdList,
        examPointIdList: tags.examPointIdList,
        tagAdopt: tags.tagAdopt,
        tagReason: tags.tagReason,
        tagUser1AdoptFlag: backAdoptUserTagBool([1, 3], tags.tagAdopt),
        tagUser2AdoptFlag: backAdoptUserTagBool([2, 3], tags.tagAdopt),
        questionId: tags.questionId,
        tagExamPaperSubQuesInputDTOList: tags.children,
        auditTagFeedback: tags.errReason,
      };
    }),
  };
  console.log(params, 'submitVerifyPaper');
  const ref = Modal.info({
    content: '请您稍作等待',
    iconType: 'loading',
    maskClosable: false,
    title: '试卷提交中...',
  });
  try {
    yield put(changeBtnCanClickAction(false));
    const repos = yield call(request, requestURL, Object.assign({}, postjsonoptions(), { body: JSON.stringify(params) }));
    switch (repos.code.toString()) {
      case '0':
        message.success('提交成功！');
        if (depot) {
          exampaperApi.flushQuestionInfoByExamPaper(epId.get('id'));
        }
        yield put(changePageState(0));
        break;
      default:
        message.warn(repos.message || '系统错误导致提交失败');
        break;
    }
    yield put(changeBtnCanClickAction(true));
    ref.destroy();
  } catch (err) {
    console.log(err);
    message.warn('执行错误导致提交失败');
    yield put(changeBtnCanClickAction(true));
    ref.destroy();
  }
}
export function* watchGetEditionList() {
  const watcher = yield takeLatest(GET_EDITION_LIST, wcbGetEditionList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* watchGetCourseSystem() {
  const watcher = yield takeLatest(GET_COURSE_SYSTEM, wcbGetCourseSystem);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getPaperMsgSaga() {
  const watcher = yield takeLatest(GET_PAPER_MSG_ACTION, getPaperMsg);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getCurPaper() {
  const watcher = yield takeLatest(GET_CUR_PAPER, getCurPaperTags);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* submitTags() {
  const watcher = yield takeLatest(SUBMIT_ACTION, save);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* initCurInput() {
  const watcher = yield takeLatest(INIT_CUR_INPUT, wcbinitCurInput);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* toGetPaper() {
  const watcher = yield takeLatest(TO_GET_PAPER, getPaper);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* saveSubmit() {
  const watcher = yield takeLatest(SAVE_SUBMIT, submit);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* toGetExamPoint() {
  const watcher = yield takeLatest(TO_GET_EXAMPOINT, getExamPoint);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* toGetKnowledge() {
  const watcher = yield takeLatest(TO_GET_KNOWLEDGE, getKnowledge);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* submitVerifyPaperSaga() {
  const watcher = yield takeLatest(SUBMIT_VERIFY_PAPER_ACTION, () => submitVerifyPaper(false));
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* justInToDepotSaga() {
  const watcher = yield takeLatest(JUST_INTO_DEPOT_ACTION, () => submitVerifyPaper(true));
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
  watchGetEditionList,
  watchGetCourseSystem,
  getPaperMsgSaga,
  getCurPaper,
  submitTags,
  initCurInput,
  toGetPaper,
  saveSubmit,
  toGetExamPoint,
  toGetKnowledge,
  submitVerifyPaperSaga,
  justInToDepotSaga,
];
