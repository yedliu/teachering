/* eslint-disable complexity */
/* eslint-disable max-nested-callbacks */
/* eslint-disable no-case-declarations */
/* eslint-disable no-console */
import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { fromJS } from 'immutable';
import Config from 'utils/config';
import { LOCATION_CHANGE } from 'react-router-redux';
import { message } from 'antd';
import { AppLocalStorage } from 'utils/localStorage';
import request, { postjsonoptions, getjsonoptions, getjsontokenoptions } from 'utils/request';
import { changeDataIsLoadingAction, changeBackPromptAlertShowAction, changeBtnCanClickAction } from 'containers/LeftNavC/actions';
import { changeVerifyCodeAction } from 'containers/Header/actions';
import { makeVerificationCode } from 'containers/Header/selectors';
import { toString, backfromZmStand, toNumber, filterTreeNode, ingadoToArr, mathToUnify, toBoolean } from 'components/CommonFn';
import { pointToUnity } from './verifyPointRule';
// import { paperImitation } from './mockQuestion';
import {
  GET_EDITION_LIST,
  GET_COURSE_SYSTEM,
  GET_PAPER_MSG_ACTION,
  GET_CUR_PAPER,
  SUBMIT_ACTION,
  INIT_CUR_INPUT,
  TO_GET_PAPER,
  SUBMIT_VERIFY,
  TO_GET_KNOWLEDGE,
  TO_GET_EXAMPOINT,
  GET_QUESTION_TYPE_LIST_ACTION,
  GET_PAPER_MSG_TO_SEE_ACTION,
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
  makeEditionList,
  toGetPaperId,
  toGetSort,
  makeChildrenTags,
  makeShowTree,
  getKnowledgeList,
  getExamPointList,
  makePointIdList,
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
  setQuestionListOrigin,
  setPaperTitle,
  getPaperMsgAction,
  setPaperDownloadMsgAction,
  setExamPointList,
  setKnowLedgeList,
  getKnowledgeAction,
  getExamPointAction,
  setQuestionTYpeListAction,
  setBigMsgAction,
  changePageState,
  setChildrenTagsAction,
  setShowQuestionTreeAction,
  setPaperVerifyResult,
  setPaperMsgAction,
  setPointListAction,
  changePaperStateAction,
  changeSelectedPaperStateIndexAction,
} from './actions';
import courseSystemApi from 'api/tr-cloud/course-system-endpoint';

const strToArr = (str, flag) => {
  // log(str, typeof str);
  let res = [];
  if (typeof str === 'string' && str.length > 0) {
    res = str.split(flag);
  }
  return res;
};

// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}


// 查询待贴标签的试卷数量
function* findWait4TagCount() {
  const URL = `${Config.trlink_qb}/api/examPaper/findWait4TagCount`;
  const userInfo = AppLocalStorage.getUserInfo();
  const param = {
    mobile: userInfo.mobile,
    password: userInfo.password,
  };
  const resp = yield call(request, URL, Object.assign({}, getjsonoptions()), param);
  switch (resp.code.toString()) {
    case '0':
      yield put(changeNotGetPaperCountAction(resp.data || 0));
      break;
    default:
      message.warning(resp.message ? resp.message : '获取待贴标签的试卷数量异常');
      break;
  }
}

// 获取 paperList
export function* getPaperMsg() {
  // const requestURL1 = `${Config.trlink_qb}/api/examPaper/getRandomOne`;
  const requestURL1 = `${Config.trlink_qb}/api/examPaper`;
  const requestURL2 = `${Config.trlink_qb}/api/examPaper`;
  const pageSize = yield select(makePageSize());
  const pageIndex = yield select(makePageIndex());
  const sort = yield select(toGetSort());
  const state = yield select(makePaperState());
  // const params1 = { pageSize, pageIndex, sort, stateStr: '8' };
  const params1 = { pageSize, pageIndex, stateStr: '8' };
  const params2 = { pageSize, pageIndex, sort, stateStr: '', userRole: 5 };
  const userInfo = AppLocalStorage.getUserInfo();
  try {
    yield put(changeDataIsLoadingAction(true));
    if (state === 8) {
      const repos = yield call(request, requestURL1, Object.assign({}, getjsonoptions()), params1);
      // let filterCount = 0;
      switch (repos.code.toString()) {
        case '0': {
          const data = fromJS(repos.data ? repos.data.data.filter((item) => {
            let res = true;
            if (!item) return false;
            const tagUserIdList = [item.tagUserId1, item.tagUserId2];
            if (tagUserIdList.indexOf(userInfo.id) > -1) {
              res = false;
            }
            return res;
          }) : []);
          // 渲染列表
          yield put(setPaperListAction(data));
          // yield put(changeNotGetPaperCountAction((repos.data || {}).total || 0));
          // 设置待领取的数量
          yield findWait4TagCount();
          break;
        }
        default:
          yield put(changeNotGetPaperCountAction(0));
          yield put(setPaperListAction(fromJS([])));
          message.warning(repos.message || '系统异常，导致获取数据失败，请稍等片刻后再次尝试。');
          break;
      }
      yield put(changeDataIsLoadingAction(false));
      const res = yield call(request, requestURL2, Object.assign({}, getjsonoptions()), params2);
      switch (res.code.toString()) {
        case '0':
          yield put(changeHasGetPaperCountAction(res.data.total));
          break;
        default:
          if (res.message) {
            message.warning(res.message);
          } else {
            message.warning('获取已标注试卷数量异常');
          }
          break;
      }
    } else if (state === 9) {
      const repos = yield call(request, requestURL2, Object.assign({}, getjsonoptions()), params2);
      switch (repos.code.toString()) {
        case '0':
          const data = repos.data || { data: [], total: 0 };
          yield put(changeHasGetPaperCountAction(data.total));
          yield put(setPaperListAction(fromJS(data.data.map((item) => {
            const res = Object.assign({}, item);
            const tagUserIdList = [res.tagUserId1, res.tagUserId2];
            const submitList = [res.tag1SubmitFlag, res.tag2SubmitFlag];
            const tagIndex = tagUserIdList.indexOf(userInfo.id);
            if (item.state === 8 && tagIndex > -1) {
              if (submitList[tagIndex]) {
                res.state = 10;
              } else {
                res.state = 9;
              }
            } else if (item.state === 9 && tagIndex > -1) {
              if (submitList[tagIndex]) {
                res.state = 10;
              }
            }
            // log(userInfo.id, tagUserIdList, tagIndex);
            // log(res.state, 'res state');
            // log(submitList, 'submitList');
            return res;
          }))));
          break;
        case '1':
          break;
        default:
          yield put(changeHasGetPaperCountAction(0));
          yield put(setPaperListAction(fromJS([])));
          if (repos.message) {
            message.warning(repos.message);
          } else {
            message.warning('系统异常，导致获取数据失败，请稍等片刻后再次尝试。');
          }
          break;
      }
      yield put(changeDataIsLoadingAction(false));
      yield findWait4TagCount();
    }
  } catch (err) {
    // err Msg
    console.log(err);
    message.warning('服务异常');
    yield put(changeDataIsLoadingAction(false));
  }
}
export function* getCurPaperTags() {
  const userInfo = AppLocalStorage.getUserInfo();
  const epid = yield select(makeSelectedEPID());
  const requestURL = `${Config.trlink_qb}/api/examPaper/${epid}`;
  let realQuestionsCount = 0;
  // const params = {id:_index}
  // console.log('试卷id', epid);
  try {
    yield put(changeBackPromptAlertShowAction(true));
    const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()));
    // const repos = paperImitation;
    // repos.state = 9;
    // repos.auditTagUserId = null;
    // repos.auditEntryUserId = null;
    if (repos.code.toString() === '0') {
      yield put(setPaperDownloadMsgAction(fromJS({ fileUrl: repos.data.fileUrl, fileName: `${repos.data.name}(${repos.data.year})` })));
      const paperList = repos.data.examPaperContentOutputDTOList;
      const newList = [];
      const bigMsg = [];
      // let caption;
      // let supSerialNumber;
      if (repos.data) {
        repos.data.examPaperContentOutputDTOList.forEach((item, index) => {
          realQuestionsCount += 1;
          bigMsg.push({ count: item.examPaperContentQuestionOutputDTOList.length, name: item.name, serialNumber: item.serialNumber });
          item.examPaperContentQuestionOutputDTOList.forEach((it, i) => {
            // log((i + 1) * (index + 1));
            const res = { questionTag: {}};
            if (it.questionOutputDTO.tagUserId1 === userInfo.id) {
              res.questionTag = it.questionOutputDTO.questionTag1;
            } else if (it.questionOutputDTO.tagUserId2 === userInfo.id) {
              res.questionTag = it.questionOutputDTO.questionTag2;
            } else {
              // res.questionTag = ;
            }
            if (res.questionTag && res.questionTag.difficulty) {
              res.errState = 1;
            } else {
              res.errState = -1;
            }
            // const questionItem = Object.assign({}, it, { questionOutputDTO: }res);
            const questionItem = it;
            questionItem.supSerialNumber = index + 1;
            questionItem.caption = item.name;
            let errReason = '';
            if (repos.data.tagUserId1 === userInfo.id) {
              errReason = it.questionOutputDTO.tagFeedback1;
            } else if (repos.data.tagUserId2 === userInfo.id) {
              errReason = it.questionOutputDTO.tagFeedback2;
            } else {
              errReason = '';
            }
            const newQuestionOutputDTO = {
              title: backfromZmStand(it.questionOutputDTO.title || ''),
              analysis: backfromZmStand(it.questionOutputDTO.analysis || ''),
              answerList: (it.questionOutputDTO.answerList || []).map((iit) => backfromZmStand(iit || '')),
              optionList: (it.questionOutputDTO.optionList || []).map((iit) => backfromZmStand(iit || '')),
              showTextArea: toBoolean(errReason),
              errReason,
            };
            if (it.questionOutputDTO.children && it.questionOutputDTO.children.length > 0) {
              newQuestionOutputDTO.children = it.questionOutputDTO.children.map((itt) => {
                return {
                  id: itt.id,
                  score: itt.score,
                  title: backfromZmStand(itt.title || ''),
                  optionList: (itt.optionList || []).map((iit) => backfromZmStand(iit || '')),
                  answerList: (itt.answerList || []).map((iit) => backfromZmStand(iit || '')),
                  analysis: backfromZmStand(itt.analysis || ''),
                  typeId: itt.typeId,
                };
              });
            }
            questionItem.questionOutputDTO = Object.assign({}, questionItem.questionOutputDTO, res, newQuestionOutputDTO);
            // questionItem.title = it.questionOutputDTO
            // console.log(questionItem, 'questionItem');
            newList.push(questionItem);
          });
        });
      }
      /*
      const iteratePaperList = (data, bool) => {
        data.map(function (e, i) {
          let tar = e.examPaperContentQuestionOutputDTOList
          caption = e.name ? e.name : caption
          if (!bool) {
            supSerialNumber = e.serialNumber;
          }
          if (tar && tar.length) {
            e.count = tar.length || 0
            iteratePaperList(tar, true);
            // }
            // else if(e.questionOutputDTO && e.questionOutputDTO.children && e.questionOutputDTO.children.length)
            // {
            //   iteratePaperList(e.questionOutputDTO.children)
          } else {
            e.caption = caption;
            e.supSerialNumber = supSerialNumber;
            if (e.questionOutputDTO.difficulty && e.questionOutputDTO.questionTag1.difficulty) {
              e.errState = 0;
            } else {
              e.errState = -1;
            }
            _newList.push(e);
          }
        });
      }
      iteratePaperList(paperList);
      */
      // console.log('iteratePaperList', newList);
      // console.log('获取试卷信息', paperList);
      yield put(setQuestionListOrigin(fromJS(paperList)));
      const commoninfo = {
        epId: repos.data.id,
        gradeId: repos.data.gradeId,
        subjectId: repos.data.subjectId,
        name: repos.data.name,
        questionCount: repos.data.questionAmount,
        realQuestionsCount,
        tagUserId1: repos.data.tagUserId1,
        tagUserId2: repos.data.tagUserId2,
      };
      yield put(setPaperTitle(repos.data.name));
      yield put(setQuestionList(fromJS(newList)));
      // log(newList, 'newList');
      yield put(setQuestionIndex(0));
      yield put(setCommonInfo(fromJS(commoninfo)));
      yield put(setBigMsgAction(fromJS(bigMsg)));
      yield put(getKnowledgeAction());
      yield put(getExamPointAction());
      yield put(initCurInputAction());
      yield put(changePageState(1));
    } else {
      message.warning(repos.message || '获取试卷信息失败！');
    }
    yield put(changeBackPromptAlertShowAction(false));
  } catch (err) {
    // err Msg
    yield put(changeBackPromptAlertShowAction(false));
    message.error('获取试卷信息失败，刷新后尝试，如多次尝试无效请联系技术人员。');
    console.log('getCurPaperPic 失败 > ', err);
  }
}
export function* wcbinitCurInput() {  // 切换题目数据
  const showTree = yield select(makeShowTree());
  // log(showTree, showTree.toJS(), 'show tree')
  yield put(setShowQuestionTreeAction(showTree.set('itemTree', false)));
  const pointIdList = yield select(makePointIdList());
  // console.log(pointIdList.toJS(), 'pointIdList -- ');
  const knowledgeIdList = pointIdList.get('knowledgeIdList').toJS();
  const examPointIdList = pointIdList.get('examPointIdList').toJS();
  // console.log(pointIdList.toJS(), 'pointIdList');
  try {
    const questionIndex = yield select(makeQuestionIndex());
    const questionList = yield select(makeQuestionList());
    const curQuesJS = questionList.toJS()[questionIndex];
    // log(curQuesJS, 'curQuesJS -------------------------------------------');res
    const dto = yield select(makeInputDTO());
    let dtoJS = dto.toJS();
    // console.log('dtoJS', questionList.toJS(), questionIndex, curQuesJS);
    const o_dto = curQuesJS.questionOutputDTO.questionTag || {};
    // console.log(o_dto, 'o_dto');
    dtoJS.questionId = curQuesJS.questionId;
    dtoJS.abilityIdList = o_dto.abilityIdList || [];
    dtoJS.chapterIdList = o_dto.chapterIdList || [];
    dtoJS.comprehensiveDegreeId = o_dto.comprehensiveDegreeId || 1;
    dtoJS.coreLiteracyIdList = o_dto.coreLiteracyIdList || [];
    dtoJS.courseSystemIdList = o_dto.courseSystemIdList || [];
    dtoJS.difficulty = o_dto.difficulty || 1;
    dtoJS.distinction = o_dto.distinction || 1;
    dtoJS.editionIdList = o_dto.editionIdList || [];
    // console.log((o_dto.knowledgeIdList || strToArr(o_dto.knowledgeIds, ',') || []), 'knowledgeIdList - knowledgeIdList');
    // console.log(filterTreeNode(knowledgeIdList, (o_dto.knowledgeIdList || strToArr(o_dto.knowledgeIds, ',') || []).map((it) => toNumber(it))), 'knowledgeIdListknowledgeIdList');
    dtoJS.knowledgeIdList = filterTreeNode(knowledgeIdList, (o_dto.knowledgeIdList || strToArr(o_dto.knowledgeIds, ',') || []).map((it) => toNumber(it)));
    dtoJS.examPointIdList = filterTreeNode(examPointIdList, (o_dto.examPointIdList || strToArr(o_dto.examPointIds, ',') || []).map((it) => toNumber(it)));
    // dtoJS.examPointIdList = filterTreeNode((o_dto.examPointIdList || strToArr(o_dto.examPointIds, ',') || []).map((it) => toNumber(it)));
    dtoJS.rating = o_dto.rating || 1;
    dtoJS.recommendationIndex = 3;
    dtoJS.subjectCharacteristicIdList = o_dto.subjectCharacteristicIdList || [];
    dtoJS.errReason = o_dto.errReason || curQuesJS.questionOutputDTO.errReason || '';
    const showTextArea = toBoolean(dtoJS.errReason);
    dtoJS.showTextArea = o_dto.showTextArea || showTextArea;
    // dtoJS.tagExamPaperSubQuesInputDTOList = o_dto.children || [];
    if (curQuesJS.questionOutputDTO.templateType === 1 && curQuesJS.questionOutputDTO.children) {
      const children = (o_dto.children && o_dto.children.length > 0 ? o_dto.children : curQuesJS.questionOutputDTO.children) || [];
      const childrenTags = children.map((item) => {
        return {
          subQuestionId: item.id,
          knowledgeIdList: strToArr(item.knowledgeIds, ','),
          examPointIdList: strToArr(item.examPointIds, ','),
        };
      });
      yield put(setChildrenTagsAction(fromJS(childrenTags)));
      // const achildrenTags = yield select(makeChildrenTags());
      // log(childrenTags, 'childrenTags -------------------------------------');
    } else {
      yield put(setChildrenTagsAction(fromJS([])));
    }
    yield put(setInputDTOAction(fromJS(dtoJS)));
    yield put(setShowQuestionTreeAction(showTree.set('itemTree', true)));
    // log('questionsIndex: ', questionIndex);
    // log('curQuesJS: ', curQuesJS);
    // log('o_dto: ', o_dto);
    // log('dtoJS: ', dtoJS);
  } catch (err) {
    console.log(`try error: ${err.toString()}`);
    yield put(setShowQuestionTreeAction(showTree.set('itemTree', true)));
  }
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
  const eList = yield select(makeEditionList());
  const editionIdList = eList.toJS() || [];
  // const requestURL = `${Config.trlink}/api/courseSystem`;
  let courseSystem = [];
  // console.log('editionIdList', editionIdList);

  for (let i = 0; i < editionIdList.length; i++) {
    if (editionIdList[i].name === '通用版') {
      params.editionId = editionIdList[i].id;
      let res = yield courseSystemApi.getClassType(params);
      try {
        if (res && toString(res.code) === '0') {
          courseSystem = res.data;
        }
      } catch (e) {
        console.log('wcbGetEditionList 出错>>>', e);
      }
    }
  }
  // console.log('courseSystem', courseSystem);
  yield put(setCourseSystemAction(fromJS(courseSystem)));
}
export function* getKnowledge() {
  const info = yield select(makeCommonInfo());
  const requestURL = `${Config.trlink}/api/knowledge`;
  const params = mathToUnify(info.toJS());
  const gradeId = params.gradeId;
  const subjectId = params.subjectId;
  if (gradeId < 0 || subjectId < 0) {
    return;
  }
  const res = yield call(request, requestURL, Object.assign({}, getjsonoptions()), { gradeId, subjectId });
  try {
    if (res && res.code.toString() === '0') {
      // console.log(res);
      const knowledgeIdList = ingadoToArr(res.data || []);
      // console.log(knowledgeIdList, 'knowledgeIdList - getKnowledge');
      // const pointIdList = yield select(makePointIdList());
      yield put(setPointListAction('knowledgeIdList', fromJS(knowledgeIdList)));
      yield put(setKnowLedgeList(fromJS(res.data || [])));
      yield put(initCurInputAction());
    } else {
      message.error(res.message || '系统异常错误导致获取知识点失败。');
      yield put(setKnowLedgeList(fromJS([])));
    }
  } catch (e) {
    message.error('执行错误导致获取知识点失败。');
    console.log('getKnowledge 出错>>>', e);
  }
}
export function* getExamPoint() {
  const info = yield select(makeCommonInfo());
  const requestURL = `${Config.trlink}/api/examPoint`;
  const params = mathToUnify(info.toJS());
  const gradeId = params.gradeId;
  const subjectId = params.subjectId;
  if (gradeId < 0 || subjectId < 0) {
    return;
  }
  const res = yield call(request, requestURL, Object.assign({}, getjsonoptions()), { gradeId, subjectId });
  try {
    if (res && res.code.toString() === '0') {
      // console.log(res);
      const examPointIdList = ingadoToArr(res.data || []);
      yield put(setPointListAction('examPointIdList', fromJS(examPointIdList)));
      yield put(setExamPointList(fromJS(res.data || [])));
      yield put(initCurInputAction());
    } else {
      message.error(res.message || '系统异常错误导致获取考点失败。');
      yield put(setExamPointList(fromJS([])));
    }
  } catch (e) {
    message.error('执行错误导致获取考点失败。');
    console.log('getKnowledge 出错>>>', e);
  }
}
export function* submit() {
  // 提交接口……
  const userInfo = AppLocalStorage.getUserInfo();
  const dto = yield select(makeInputDTO());
  const epId = yield select(makeSelectedEPID());
  const index = yield select(makeQuestionIndex());
  const list = yield select(makeQuestionList());
  const childrenTags = yield select(makeChildrenTags());
  const commoninfo = yield select(makeCommonInfo());
  const knowledgeList = yield select(getKnowledgeList());
  const examPointList = yield select(getExamPointList());
  const dtoJS = dto.toJS();
  if (knowledgeList.count() > 0 && (dtoJS.knowledgeIdList || []).length <= 0) {
    message.error('请选择知识点后提交');
    return;
  }
  // if ((dtoJS.knowledgeIdList || []).length <= 0) {
  //   message.error('请选择知识点后提交');
  //   return;
  // }
  if (!pointToUnity(commoninfo.get('subjectId'), commoninfo.get('gradeId'))) {
    if (examPointList.count() > 0 && (dtoJS.examPointIdList || []).length <= 0) {
      message.error('请选择考点后提交');
      return;
    }
  }
  delete dtoJS.subjectCharacteristicIdList;
  delete dtoJS.abilityIdList;
  delete dtoJS.coreLiteracyIdList;
  delete dtoJS.courseSystemIdList;
  delete dtoJS.chapterIdList;
  delete dtoJS.keywordList;
  delete dtoJS.editionIdList;
  delete dtoJS.showTextArea;
  const errReason = dtoJS.errReason;
  if (commoninfo.get('tagUserId1') === userInfo.id) {
    dtoJS.tagFeedback1 = dtoJS.errReason;
  } else if (commoninfo.get('tagUserId2') === userInfo.id) {
    dtoJS.tagFeedback2 = dtoJS.errReason;
  } else {
    dtoJS.tagFeedback1 = dtoJS.errReason;
  }
  delete dtoJS.errReason;
  // log(childrenTags.toJS(), 'childrenTags');
  // return;
  dtoJS.tagExamPaperSubQuesInputDTOList = childrenTags.toJS();
  // .filter((item) => {
  //   return item.subQuestionId > 0 && (item.knowledgeIdList.length > 0 || item.examPointIdList.length > 0);
  // });

  const requestURL = `${Config.trlink_qb}/api/examPaper/${epId}/action/tag`;
  // const params = {id:_index}
  const params = { epId, tagExamPaperQuesInputDTOList: [dtoJS], submitFlag: false };
  console.log('params', errReason, params);
  try {
    yield put(changeBtnCanClickAction(false));
    const repos = yield call(request, requestURL, Object.assign({}, postjsonoptions(), { body: JSON.stringify(params) }));
    if (repos.code.toString() === '0') {
      const listJS = list.toJS();
      const oItem = listJS[index];
      // if (o_item.questionOutputDTO.questionTag) {
      //   o_item.questionOutputDTO.questionTag = [];
      // }
      const questionTag = Object.assign({}, oItem.questionOutputDTO.questionTag, dtoJS);
      // (questionTag.children || []).map((item) => {
      //   const res = item;
      //   questionTag.tagExamPaperSubQuesInputDTOList.forEach((it, i) => {
      //     if (it.subQuestionId === item.subQuestionId) {
      //       res.examPointIds = it.examPointIdList.join(',');
      //       res.knowledgeIds = it.knowledgeIdList.join(',');
      //     }
      //   });
      //   return res;
      // });
      if (oItem.questionOutputDTO.templateType === 1) {
        const children = questionTag.children || [];
        questionTag.children = (questionTag.tagExamPaperSubQuesInputDTOList || []).map((it, i) => {
          const res = children[i] || {};
          res.subQuestionId = it.subQuestionId;
          res.examPointIds = it.examPointIdList.join(',');
          res.knowledgeIds = it.knowledgeIdList.join(',');
          return res;
        });
      }
      console.log(questionTag, 'questionTag');
      // questionTag.children =
      const nItem = Object.assign({}, oItem.questionOutputDTO, { questionTag }, { errState: 1, errReason, showTextArea: toBoolean(errReason) });
      listJS[index].questionOutputDTO = nItem;
      // listJS[index].errState = 0;
      yield put(setQuestionList(fromJS(listJS)));
      if (index + 1 < list.size) {
        yield put(setQuestionIndex(index + 1));
        yield put(initCurInputAction());
      } else {
        message.info('没有下一题了');
      }
      message.success('保存成功！');
      // yield put(setFinishedList(fromJS(finishedJS.push(index))))
    } else {
      message.warning(repos.message || '系统异常导致提交失败，请稍后或刷新后再试。');
    }
    yield put(changeBtnCanClickAction(true));
  } catch (err) {
    // err Msg
    console.log('submit 失败 > ', err);
    message.warn('意外情况导致提交失败。');
    yield put(changeBtnCanClickAction(true));
  }
  // success
}
// 提交至审核
export function* submitVerify() {
  const epId = yield select(makeSelectedEPID());
  const requestURL = `${Config.trlink_qb}/api/examPaper/${epId}/action/tag`;
  // const params = {id:_index}
  const params = { epId, tagExamPaperQuesInputDTOList: [], submitFlag: true };
  console.log('params', params);
  try {
    const repos = yield call(request, requestURL, Object.assign({}, postjsonoptions(), { body: JSON.stringify(params) }));
    if (repos.code.toString() === '0') {
      message.success('已提交审核！');
      yield put(changePageState(0));
    } else {
      message.warning(repos.message || '系统异常导致提交失败，请稍后或刷新后再试。');
    }
  } catch (err) {
    // err Msg
    console.log('submit error: ', err);
    message.warn('意外情况导致提交失败。');
  }
}
export function* getPaper() {
  const id = yield select(toGetPaperId());
  const verificationCode = yield select(makeVerificationCode());
  const requestURL = `${Config.trlink_qb}/api/examPaper/${id}/action/receiveTag`;
  const params = { captcha: verificationCode.get('code') };
  if (!params.captcha) {
    message.warning('请输入验证码后再提交！');
    return;
  }
  try {
    const repos = yield call(request, requestURL, Object.assign({ body: JSON.stringify(params) }, postjsonoptions()));
    // const repos = { code: '0' };
    if (repos.code.toString() === '0') {
      message.success('领取成功！');
      yield put(changeVerifyCodeAction('default'));
      yield put(changeSelectedPaperStateIndexAction(2));
      yield put(changePaperStateAction(9));
      yield put(getPaperMsgAction());
    } else {
      // message.warning(repos.message || '系统异常导致领取失败，请稍后或刷新后再试。');
      message.error(repos.message || '系统异常');
      yield put(getPaperMsgAction());
      // yield put(changeVerifyCodeAction('default'));
    }
  } catch (err) {
    // err Msg
    console.log('getPaper 失败 > ', err);
    message.error('执行错误');
    // yield put(changeVerifyCodeAction('default'));
  }
}
export function* getTypeList() {
  const requestURL = `${Config.trlink_qb}/api/questionType`;
  try {
    const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()));
    switch (repos.code.toString()) {
      case '0':
        // console.log(repos, 'getPaperMsg -- saga -- 21');
        yield put(setQuestionTYpeListAction(fromJS(repos.data)));
        break;
      default:
        yield put(setQuestionTYpeListAction(fromJS([])));
        break;
    }
  } catch (err) {
    // err Msg
  }
}
// 查看审核结果获取试卷详情
export function* getPaperSeeMsg() {
  const userInfo = AppLocalStorage.getUserInfo();
  const epid = yield select(makeSelectedEPID());
  const requestURL = `${Config.trlink_qb}/api/examPaper/${epid}`;
  const newList = [];
  const bigMsg = [];
  let paperMsg = {};
  try {
    const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()));
    console.log(repos.data);
    switch (toString(repos.code)) {
      case '0':
        repos.data.examPaperContentOutputDTOList.forEach((item) => {
          bigMsg.push({ count: item.examPaperContentQuestionOutputDTOList.length, name: item.name, serialNumber: item.serialNumber });
          item.examPaperContentQuestionOutputDTOList.forEach((it) => {
            const res = { questionTag: null };
            let whichTager = 0;
            if (it.questionOutputDTO.tagUserId1 === userInfo.id) {
              res.questionTag = it.questionOutputDTO.questionTag1;
              whichTager = 1;
            } else if (it.questionOutputDTO.tagUserId2 === userInfo.id) {
              res.questionTag = it.questionOutputDTO.questionTag2;
              whichTager = 2;
            }
            const questionItem = it;
            questionItem.bigName = item.name;
            questionItem.bigNumber = item.serialNumber;
            if (whichTager === 1) {
              questionItem.questionOutputDTO.errState = questionItem.questionOutputDTO.tagUser1AdoptFlag ? 1 : 0;
            } else if (whichTager === 2) {
              questionItem.questionOutputDTO.errState = questionItem.questionOutputDTO.tagUser2AdoptFlag ? 1 : 0;
            }
            questionItem.questionOutputDTO = Object.assign({}, questionItem.questionOutputDTO, res);
            newList.push(questionItem);
          });
        });
        paperMsg = repos.data;
        paperMsg.examPaperContentOutputDTOList = null;
        paperMsg.picUrlList = null;
        // console.log(newList, 'newList');
        const commoninfo = {
          gradeId: repos.data.gradeId,
          subjectId: repos.data.subjectId,
          name: repos.data.name,
          questionCount: repos.data.questionAmount,
          realQuestionsCount: newList.length,
        };
        yield put(setCommonInfo(fromJS(commoninfo)));
        yield put(getKnowledgeAction());
        yield put(getExamPointAction());
        yield put(setBigMsgAction(fromJS(bigMsg)));
        yield put(setPaperMsgAction(fromJS(paperMsg)));
        yield put(setPaperVerifyResult(fromJS(newList)));
        yield put(changePageState(2));
        break;
      default:
        // yield put();
        break;
    }
    yield put(changeBackPromptAlertShowAction(false));
  } catch (err) {
    yield put(changeBackPromptAlertShowAction(false));
    message.error('执行错误导致获取试卷失败。请刷新后重试。');
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
  const watcher = yield takeLatest(SUBMIT_ACTION, submit);
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
export function* toVerify() {
  const watcher = yield takeLatest(SUBMIT_VERIFY, submitVerify);
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
export function* getTypeListSaga() {
  const watcher = yield takeLatest(GET_QUESTION_TYPE_LIST_ACTION, getTypeList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getPaperMsgToSeeActionSaga() {
  const watcher = yield takeLatest(GET_PAPER_MSG_TO_SEE_ACTION, getPaperSeeMsg);
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
  toVerify,
  toGetExamPoint,
  toGetKnowledge,
  getTypeListSaga,
  getPaperMsgToSeeActionSaga,
];
