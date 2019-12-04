import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';
import Config from 'utils/config';
import { toNumber, toString, toBoolean, ingadoToArr, mathToUnify } from 'components/CommonFn';
import moment from 'moment';
import request, { postjsonoptions, getjsonoptions, putjsonoptions, getjsontokenoptions } from 'utils/request';
import { message } from 'antd';
// import AppLocalStorage from 'utils/localStorage';
// import { loadImage } from './loadImages';
import { changeDataIsLoadingAction, changeBtnCanClickAction, changeBackPromptAlertShowAction } from 'containers/LeftNavC/actions';
import exampaperApi from 'api/qb-cloud/exam-paper-end-point';
import { verifyQuestion } from './verifyData';
import { submitAdoptTypeList } from './finalConfig';
import {
  GET_PAPER_LIST_ACTION,
  CHANGE_NEED_VERIFY_PAPER_ID_ACTION,
  REMOVE_BIG_QUESTION_ACTION,
  REMOVE_SMALL_QUESTION_ACTION,
  GET_ALL_QUESTION_TYPE_LIST_ACTION,
  GET_POINT_LIST_ACTION,
  SUBMIT_QUESTION_ITEM_ACTION,
  SAVE_WAREHOUSE_ACTION,
  GET_PAPER_MSG_LIST_ACTION,
  GET_EDITION_ACTION,
  GET_CITY_ACTION,
  GET_COUNTY_ACTION,
  CHANGE_PAPER_MSG_ACTION,
  CHANGE_BIG_NAME_ACTION,
  SUMBIT_ADOPT_FEED_BACK_ACTION,
} from './constants';
import {
  makePaperParams,
  makePaperNumber,
  makePaperNeedVerifyId,
  makeQuestionsList,
  makeRemoveIndex,
  makePaperMsgData,
  makeCommoninfo,
  makePointList,
  makeNewQuestion,
  makeQuestionParams,
  makeBigQuestionMsg,
  makePaperMsgList,
  makeInputDto,
  maekIsAddOrEdit,
} from './selectors';
import {
  setPaperNumberAction,
  setPaperDataList,
  setPaperParams,
  setPaperMsgDataAction,
  // setCommonInfoAction,
  setPaperDownloadMsgAction,
  setQuestionsListAction,
  // setBigQuestionAction,
  setAllQuestionTypeListAction,
  setPointListAction,
  getPointListAction,
  changeQuestionEditStateAction,
  setClickTargetAction,
  // setQuestionParamsAction,
  initQuestionListData,
  setPaperMsgListAction,
  setInputDtoAction,
  // getCityListAction,
  getCountyListAction,
  setIsAddOrEditAction,
  setPointIdListAction,
  filterPointAction,
} from './actions';
import { filterCartoon } from 'utils/templateMapper';
// import { simulateData } from './mock';

// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}

export function* getPaperMsg() {  // eslint-disable-line
  // console.log('getPaperListAction');
  const requestURL = `${Config.trlink_qb}/api/examPaper`;
  const params = yield select(makePaperParams());
  let paperNumber = yield select(makePaperNumber());
  const state = params.get('paperState');
  const params1 = params.set('stateStr', '11,17').delete('paperState').delete('pageState').toJS();
  const params2 = params.set('stateStr', '18').set('userRole', 10).delete('paperState').delete('pageState').toJS();
  console.log(state, paperNumber.toJS());
  try {
    yield put(changeDataIsLoadingAction(true));
    if (state === 11) {
      const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params1);
      if (!repos.data) repos.data = {};
      switch (repos.code.toString()) {
        case '0':
          yield put(setPaperNumberAction(paperNumber.set('notGetPaperCount', repos.data.total || 0)));
          yield put(setPaperDataList(fromJS(repos.data.data || [])));
          break;
        default:
          yield put(setPaperNumberAction(paperNumber.set('notGetPaperCount', 0)));
          yield put(setPaperDataList(fromJS([])));
          message.warning(repos.message || '系统异常，请稍等片刻后尝试再次');
          break;
      }
      yield put(changeDataIsLoadingAction(false));
      const res = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params2);
      switch (res.code.toString()) {
        case '0':
          paperNumber = yield select(makePaperNumber());
          yield put(setPaperNumberAction(paperNumber.set('hasGetPaperCount', res.data.total || 0)));
          break;
        default:
          message.warning(res.message || '获取已领取试卷数量异常');
          break;
      }
    } else if (state === 18) {
      const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params2);
      if (!repos.data) repos.data = {};
      switch (repos.code.toString()) {
        case '0':
          yield put(setPaperNumberAction(paperNumber.set('hasGetPaperCount', repos.data.total || 0)));
          yield put(setPaperDataList(fromJS(repos.data.data || [])));
          break;
        case '1':
          break;
        default:
          yield put(setPaperNumberAction(paperNumber.set('hasGetPaperCount', 0)));
          yield put(setPaperDataList(fromJS([])));
          message.warning(repos.message || '系统异常，请稍等片刻后尝试再次');
          break;
      }
      yield put(changeDataIsLoadingAction(false));
      const res = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params1);
      switch (res.code.toString()) {
        case '0':
          paperNumber = yield select(makePaperNumber());
          yield put(setPaperNumberAction(paperNumber.set('notGetPaperCount', res.data.total || 0)));
          break;
        case '1':
          break;
        default:
          message.warning(res.message || '获取未领取试卷数量异常');
          break;
      }
    }
  } catch (err) {
    console.log('fail to getData: ', err);
    yield put(changeDataIsLoadingAction(false));
  }
}
export function* getAllQuestionTypeList() {
  const requestURL = `${Config.trlink_qb}/api/questionType`;
  try {
    const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()));
    switch (repos.code.toString()) {
      case '0':
        // console.log(repos, 'getPaperMsg -- saga -- 21');
        yield put(setAllQuestionTypeListAction(filterCartoon(fromJS([{ id: -1, name: '请选择题型' }].concat(repos.data)))));
        break;
      default:
        message.warning(repos.message || '系统异常');
        yield put(setAllQuestionTypeListAction(fromJS([{ id: -1, name: '请选择题型' }])));
        break;
    }
  } catch (err) {
    // err Msg
  }
}
export function* getPaperNeedVerify() {
  const needVerifyPaper = yield select(makePaperNeedVerifyId());
  const requestURL = `${Config.trlink_qb}/api/examPaper/${needVerifyPaper.get('id')}/action/preFinalAudit`;
  const paperParams = yield select(makePaperParams());
  try {
    if (needVerifyPaper.get('state') !== 11) {
      yield put(changeBackPromptAlertShowAction(true));
    }
    const repos = yield call(request, requestURL, Object.assign({}, postjsonoptions()));
    // const repos = simulateData;
    switch (repos.code.toString()) {
      case '0':
        yield put(setPaperDownloadMsgAction(fromJS({ fileUrl: repos.data.fileUrl, fileName: `${repos.data.name}(${repos.data.year})` })));
        yield put(setPaperMsgDataAction(fromJS(repos.data || {})));
        yield put(initQuestionListData());
        yield put(setPaperParams(paperParams.set('pageState', 1)));
        yield put(getPointListAction());
        break;
      default:
        message.error(repos.message || '系统异常');
        break;
    }
    yield put(changeBackPromptAlertShowAction(false));
  } catch (err) {
    // err Msg
    yield put(changeBackPromptAlertShowAction(false));
    message.error('执行错误');
    console.log(err);
  }
}
export function* getPaperMsgList() {
  const subjectRequestURL = `${Config.trlink}/api/subject`;
  const gradeRequestURL = `${Config.trlink}/api/grade`;
  const termRequestURL = `${Config.trlink}/api/term`;
  const provinceRequestURL = `${Config.trlink_qb}/api/region/province`;
  // const inputDto = yield select(makeInputDto());
  const endDate = moment().format('YYYY/MM/DD');
  const startDate = `${new Date().getFullYear() - 1}${endDate.slice(4)}`;
  const termParams = { startDate, endDate };
  const paperMsgList = yield select(makePaperMsgList());
  let subjectList = fromJS([{ id: 0, name: '请选择学科' }]);
  let gradeList = fromJS([{ id: 0, name: '请选择年级' }]);
  let termList = fromJS([{ id: 0, name: '请选择学期' }]);
  let provinceList = fromJS([{ id: 0, name: '请选择省' }]);
  try {
    const subjectRepos = yield call(request, subjectRequestURL, Object.assign({}, getjsonoptions()));
    if (toString(subjectRepos.code === '0')) {
      subjectList = subjectRepos.data || [];
      subjectList.unshift({ id: 0, name: '请选择学科' });
      yield put(setPaperMsgListAction(paperMsgList.set('subjectList', fromJS(subjectList))));
    } else {
      subjectList = [{ id: 0, name: '请选择学科' }];
      yield put(setPaperMsgListAction(paperMsgList.set('subjectList', fromJS(subjectList))));
    }
  } catch (err) {
    console.log(err);
    message.error('执行错误导致学科列表获取失败,请刷新后重试');
  }
  try {
    const gradeRepos = yield call(request, gradeRequestURL, Object.assign({}, getjsonoptions()));
    if (toString(gradeRepos.code === '0')) {
      gradeList = gradeRepos.data || [];
      gradeList.unshift({ id: 0, name: '请选择年级' });
    } else {
      gradeList = [{ id: 0, name: '请选择年级' }];
    }
  } catch (err) {
    console.log(err);
    message.error('执行错误导致年级列表获取失败,请刷新后重试');
  }
  try {
    const termRepos = yield call(request, termRequestURL, Object.assign({}, getjsonoptions()), termParams);
    if (toString(termRepos.code === '0')) {
      termList = termRepos.data || [];
      termList.unshift({ id: 0, name: '请选择学期' });
    } else {
      termList = [{ id: 0, name: '请选择学期' }];
    }
  } catch (err) {
    console.log(err);
    message.error('学期列表获取失败,请刷新后重试');
  }
  try {
    const provinceRepos = yield call(request, provinceRequestURL, Object.assign({}, getjsonoptions()));
    if (toString(provinceRepos.code === '0')) {
      provinceList = provinceRepos.data || [];
      provinceList.unshift({ id: 1, name: '全国' });
      provinceList.unshift({ id: 0, name: '请选择省' });
    } else {
      provinceList = [{ id: 0, name: '请选择省' }];
    }
    const newPaperMsgList = paperMsgList.set('subjectList', fromJS(subjectList)).set('gradeList', fromJS(gradeList)).set('termList', fromJS(termList)).set('provinceList', fromJS(provinceList));
    yield put(setPaperMsgListAction(newPaperMsgList));
  } catch (err) {
    console.log(err);
    message.error('执行错误导致年级列表获取失败,请刷新后重试');
  }
}

export function* getEditionList() {
  const requestURL = `${Config.zmtrlink}/api/edition`;
  const inputDto = yield select(makeInputDto());
  const params = {
    gradeId: inputDto.get('gradeId'),
    subjectId: inputDto.get('subjectId'),
  };
  const paperMsgList = yield select(makePaperMsgList());
  try {
    const repos = yield call(request, requestURL, Object.assign({}, getjsontokenoptions()), params);
    if (toString(repos.code) === '0') {
      const editionList = repos.data || [];
      editionList.unshift({ id: 0, name: '请选择版本' });
      yield put(setPaperMsgListAction(paperMsgList.set('editionList', fromJS(editionList))));
    } else {
      const editionList = [{ id: 0, name: '请选择版本' }];
      yield put(setPaperMsgListAction(paperMsgList.set('editionList', fromJS(editionList))));
    }
  } catch (err) {
    console.log(err);
    // message.error('执行错误导致数据获取失败,请刷新后重试');
  }
}
export function* getCityList() {
  const requestURL = `${Config.trlink_qb}/api/region/city`;
  const inputDto = yield select(makeInputDto());
  const params = { provinceId: inputDto.get('provinceId') };
  const paperMsgList = yield select(makePaperMsgList());
  if (!params.provinceId) {
    return;
  }
  try {
    const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params);
    if (toString(repos.code) === '0') {
      const cityList = repos.data || [];
      cityList.unshift({ id: 0, name: '请选择市' });
      yield put(setPaperMsgListAction(paperMsgList.set('cityList', fromJS(cityList))));
      yield put(getCountyListAction());
    } else {
      const cityList = [{ id: 0, name: '请选择市' }];
      yield put(setPaperMsgListAction(paperMsgList.set('cityList', fromJS(cityList))));
    }
  } catch (err) {
    console.log(err);
    // message.error('执行错误导致数据获取失败,请刷新后重试');
  }
}
export function* getCountyList() {
  const requestURL = `${Config.trlink_qb}/api/region/county`;
  const inputDto = yield select(makeInputDto());
  const params = { cityId: inputDto.get('cityId') };
  const paperMsgList = yield select(makePaperMsgList());
  try {
    const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params);
    if (toString(repos.code) === '0') {
      const countyList = repos.data || [];
      countyList.unshift({ id: 0, name: '请选择县' });
      yield put(setPaperMsgListAction(paperMsgList.set('countyList', fromJS(countyList))));
    } else {
      const countyList = [{ id: 0, name: '请选择县' }];
      yield put(setPaperMsgListAction(paperMsgList.set('countyList', fromJS(countyList))));
    }
  } catch (err) {
    console.log(err);
    // message.error('执行错误导致数据获取失败,请刷新后重试');
  }
}
export function* changePaperMsg() {
  const info = yield select(makeCommoninfo());
  const epId = info.get('epId');
  const requestURL = `${Config.trlink_qb}/api/examPaper/${epId}`;
  const inputDto = yield select(makeInputDto());
  const params = inputDto.delete('seeModel').toJS();
  const paperMsgData = yield select(makePaperMsgData());
  params.questionAmount = toNumber(inputDto.get('questionAmount'));
  // log(info.toJS(), params, 'changePaperMsg');
  const verifyRes = verifyQuestion('paperMsg', params);
  if (!verifyRes.passVerify) {
    message.warn(`${verifyRes.errMsg.value}${verifyRes.errMsg.i ? verifyRes.errMsg.i : ''}`);
    return;
  }
  try {
    yield put(changeBtnCanClickAction(false));
    const repos = yield call(request, requestURL, Object.assign({}, { body: JSON.stringify(params) }, putjsonoptions()));
    if (toString(repos.code) === '0') {
      message.success('修改成功');
      const newPaperMsgData = paperMsgData
        .set('name', params.name)
        .set('businessCardId', params.businessCardId)
        .set('subjectId', params.subjectId)
        .set('gradeId', params.gradeId)
        .set('termId', params.termId)
        .set('provinceId', params.provinceId)
        .set('cityId', params.cityId)
        .set('countyId', params.countyId)
        .set('editionId', params.editionId)
        .set('year', params.year)
        .set('examTypeId', params.examTypeId)
        .set('typeId', params.typeId)
        .set('questionAmount', params.questionAmount);
      yield put(setPaperMsgDataAction(fromJS(newPaperMsgData || {})));
      yield put(initQuestionListData());
      yield put(setInputDtoAction(inputDto.set('seeModel', false)));
    } else {
      message.warn(repos.message || '系统错误导致修改失败');
    }
    yield put(changeBtnCanClickAction(true));
  } catch (err) {
    yield put(changeBtnCanClickAction(true));
    console.log(err);
    message.error('执行错误导致修改失败，请尝试关闭重新修改或刷新后重试');
  }
}
export function* getKnowledgeAndExamPointList() {
  const requestURL1 = `${Config.trlink}/api/knowledge`;
  const requestURL2 = `${Config.trlink}/api/examPoint`;
  const info = yield select(makeCommoninfo());
  const pointLists = yield select(makePointList());
  let newPointList = pointLists || fromJS({});
  const params = mathToUnify({
    gradeId: info.get('gradeId'),
    subjectId: info.get('subjectId'),
  });
  // const pointIdList = {};
  try {
    const res1 = yield call(request, requestURL1, Object.assign({}, getjsonoptions()), params);
    const res2 = yield call(request, requestURL2, Object.assign({}, getjsonoptions()), params);
    if (res1 && toString(res1.code) === '0') {
      const knowledgeIdList = ingadoToArr(res1.data || []);
      yield put(setPointIdListAction('knowledgeIdList', fromJS(knowledgeIdList)));
      newPointList = newPointList.set('knowledgeIdList', fromJS(res1.data || []));
      yield put(filterPointAction('knowledgeIdList'));
    } else {
      message.error(res1.message || '系统异常错误导致获取知识点失败。');
      newPointList = newPointList.set('knowledgeIdList', fromJS([]));
    }
    if (res2 && toString(res2.code) === '0') {
      const examPointIdList = ingadoToArr(res2.data || []);
      yield put(setPointIdListAction('examPointIdList', fromJS(examPointIdList)));
      newPointList = newPointList.set('examPointIdList', fromJS(res2.data || []));
      yield put(filterPointAction('examPointIdList'));
    } else {
      message.error(res2.message || '系统异常错误导致获取考点失败。');
      yield put(setPointListAction(pointLists.set('examPointIdList', fromJS([]))));
      newPointList = newPointList.set('examPointIdList', fromJS([]));
    }
    // log(newPointList.toJS(), 'newPointList');
    // console.log(pointIdList, 'pointIdList');
    yield put(setPointListAction(newPointList));
  } catch (e) {
    message.error('执行错误导致获取知识点失败。');
    console.log('get point list err: ', e);
  }
}
export function* removeBigQuestion() {
  const requestURL = `${Config.trlink_qb}/api/examPaper/deleteEpContent`;
  const paperMsgData = yield select(makePaperMsgData());
  const delItemIndex = yield select(makeRemoveIndex());
  const bigIndex = delItemIndex.get('bigIndex');
  const examPaperContentOutputDTOList = paperMsgData.get('examPaperContentOutputDTOList');
  const bigId = examPaperContentOutputDTOList.get(bigIndex).get('id');
  const params = { epcId: bigId, epcIdList: examPaperContentOutputDTOList.map((item) => item.get('id')).filter((id) => id !== bigId).toJS() };
  // console.log(epId, bigId, params, 'params -- removeBigQuestion');
  log(params);
  try {
    const repos = yield call(request, requestURL, Object.assign({}, { body: JSON.stringify(params) }, postjsonoptions()));
    // const repos = { code: '0' };
    switch (toString(repos.code)) {
      case '0':  // eslint-disable-line
        const newExamPaperContentOutputDTOList = examPaperContentOutputDTOList.filter((item) => item.get('id') !== bigId);
        const newPaperMsgData = paperMsgData.set('examPaperContentOutputDTOList', newExamPaperContentOutputDTOList);
        // console.log(newExamPaperContentOutputDTOList.toJS(), newPaperMsgData.toJS(), 'newExamPaperContentOutputDTOList');
        yield put(setPaperMsgDataAction(newPaperMsgData));
        yield put(initQuestionListData());
        message.success('删除成功');
        break;
      default:
        message.warn(repos.message || '系统异常导致删除失败');
        break;
    }
  } catch (err) {
    console.log(err);
    message.error('执行错误导致删除失败');
  }
}
export function* removeSmallQuestion() {
  const requestURL = `${Config.trlink_qb}/api/examPaper/deleteQuestion`;
  const questionsList = yield select(makeQuestionsList());
  const paperMsgData = yield select(makePaperMsgData());
  const delItemIndex = yield select(makeRemoveIndex());
  const epId = paperMsgData.get('id');
  const smallIndex = delItemIndex.get('smallIndex');
  const questionItem = questionsList.get(smallIndex);
  const bigId = questionItem.get('bigId');
  const smallId = questionItem.get('questionId');
  const examPaperContentOutputDTOList = paperMsgData.get('examPaperContentOutputDTOList');
  const params = { epId, questionId: smallId, questionIdList: examPaperContentOutputDTOList.find((item) => item.get('id') === bigId).get('examPaperContentQuestionOutputDTOList').map((item) => item.get('id')).filter((id) => id !== smallId).toJS() };
  console.log(params, 'removeSmallQuestion');
  try {
    const repos = yield call(request, requestURL, Object.assign({}, { body: JSON.stringify(params) }, postjsonoptions()));
    // const repos = { code: '0' };
    switch (toString(repos.code)) {
      case '0':  // eslint-disable-line
        const newExamPaperContentOutputDTOList = examPaperContentOutputDTOList.map((item) => {
          const newExamPaperContentQuestionOutputDTOList = item.get('examPaperContentQuestionOutputDTOList').filter((it) => it.get('questionId') !== smallId);
          return item.set('examPaperContentQuestionOutputDTOList', newExamPaperContentQuestionOutputDTOList);
        });
        // .filter((item) => item.get('examPaperContentQuestionOutputDTOList').count() > 0);
        const newPaperMsgData = paperMsgData.set('examPaperContentOutputDTOList', newExamPaperContentOutputDTOList);
        // console.log(newExamPaperContentOutputDTOList.toJS(), newPaperMsgData.toJS(), 'newExamPaperContentOutputDTOList');
        yield put(setPaperMsgDataAction(newPaperMsgData));
        yield put(initQuestionListData());
        message.success('删除成功');
        break;
      default:
        message.warn(repos.message || '系统异常导致删除失败');
        break;
    }
  } catch (err) {
    console.log(err);
  }
}
export function* submitQuestionItem() {
  const requestURL = `${Config.trlink_qb}/api/examPaper/updateQuestion`;
  const newQuestion = yield select(makeNewQuestion());
  const questionParams = yield select(makeQuestionParams());
  const questionsList = yield select(makeQuestionsList());
  const pointLists = yield select(makePointList());
  const info = yield select(makeCommoninfo());
  const newQuestionItem = newQuestion.toJS();
  const params = {
    epId: newQuestionItem.epId,
    epcId: newQuestionItem.epcId,
    questionInputDTO: {
      id: newQuestionItem.id,
      examPointIdList: newQuestionItem.examPointIdList,
      knowledgeIdList: newQuestionItem.knowledgeIdList,
      analysis: newQuestionItem.analysis,
      answerList: newQuestionItem.answerList,
      optionList: newQuestionItem.optionList,
      title: newQuestionItem.title,
      typeId: newQuestionItem.typeId,
      score: (newQuestionItem.templateType === 1 && newQuestionItem.children && newQuestionItem.children.length > 0) ? newQuestionItem.children.map((item) => (item.score || 3)).reduce((a, b) => a + b) : (newQuestionItem.score || 3),
      difficulty: newQuestionItem.difficulty,
      distinction: newQuestionItem.distinction,
      rating: newQuestionItem.rating,
      templateType: newQuestionItem.templateType,
      comprehensiveDegreeId: newQuestionItem.comprehensiveDegreeId,
    },
  };
  if (newQuestionItem.templateType === 1 && newQuestionItem.children && newQuestionItem.children.length > 0) {
    params.questionInputDTO.subQuestionInputDTOList = newQuestionItem.children.map((item) => {
      return {
        id: item.id,
        analysis: item.analysis,
        answerList: item.answerList,
        optionList: item.optionList,
        title: item.title,
        subQuestionId: item.questionId,
        typeId: item.typeId,
        score: item.score || 3,
        knowledgeIdList: item.knowledgeIdList || [],
        examPointIdList: item.examPointIdList || [],
      };
    });
  }
  const verifyRes = verifyQuestion('changeQuestion', params, newQuestionItem.templateType, pointLists.toJS(), info.toJS());
  if (!verifyRes.passVerify) {
    message.warn(`${verifyRes.errMsg.value}`);
    return;
  }
  console.log(params, 'submitQuestionItem');
  try {
    yield put(changeBackPromptAlertShowAction(true));
    const repos = yield call(request, requestURL, Object.assign({}, postjsonoptions(), { body: JSON.stringify(params) }));
    if (toString(repos.code) === '0') {
      const newQuestionsList = questionsList.setIn([questionParams.get('questionIndex'), 'questionOutputDTO'], newQuestion);
      yield put(setQuestionsListAction(newQuestionsList));
      yield put(changeQuestionEditStateAction(0));
      yield put(setClickTargetAction(''));
    } else {
      message.warn(repos.message || '系统错误导致修改失败，请稍后再尝试');
    }
    yield put(changeBackPromptAlertShowAction(false));
  } catch (err) {
    yield put(changeBackPromptAlertShowAction(false));
    console.log(err);
    message.error('执行错误导致修改失败，请重新尝试');
  }
}
export function* changeBigName() {
  const requestURL = `${Config.trlink_qb}/api/examPaper/updateEpContent`;
  const info = yield select(makeCommoninfo());
  const isAddOrEdit = yield select(maekIsAddOrEdit());
  const bigQuestionMsg = yield select(makeBigQuestionMsg());
  console.log(info.toJS(), isAddOrEdit.toJS(), bigQuestionMsg.toJS(), 'changeBigName');
  const params = {
    epcId: bigQuestionMsg.getIn([isAddOrEdit.getIn(['oldMsg', 'index']), 'id']),
    name: bigQuestionMsg.getIn([isAddOrEdit.getIn(['oldMsg', 'index']), 'name']) || '',
  };
  try {
    const repos = yield call(request, requestURL, Object.assign({}, { body: JSON.stringify(params) }, postjsonoptions()));
    if (toString(repos.code)) {
      // yield put(setBigQuestionAction(newBigQuestionMsg));
      yield put(setIsAddOrEditAction(isAddOrEdit.set('openAlert', false)));
    } else {
      message.warning(repos.message || '系统异常');
    }
  } catch (err) {

  }
}
export function* saveWarehouse() {
  const paperParams = yield select(makePaperParams());
  // const pointLists = yield select(makePointList());
  const info = yield select(makeCommoninfo());
  // const params = {
  //   epId: info.get('epId'),
  // };
  const id = info.get('epId');
  const requestURL = `${Config.trlink_qb}/api/examPaper/${id}/action/finalAudit`;
  console.log('stop!');
  try {
    yield put(changeBtnCanClickAction(false));
    // console.log(params, 'saveWarehouse');
    const repos = yield call(request, requestURL, Object.assign({}, postjsonoptions()));
    if (toString(repos.code) === '0') {
      message.success('入库成功');
      exampaperApi.flushQuestionInfoByExamPaper(id);
      yield put(setPaperParams(paperParams.set('pageState', 0)));
    } else {
      message.warn(repos.message || '系统异常导致入库操作失败，您可以稍后再次尝试');
    }
    yield put(changeBtnCanClickAction(true));
  } catch (err) {
    yield put(changeBtnCanClickAction(true));
    console.log(err);
    message.error('执行错误导致操作失败，您可以检查下内容后重新尝试');
  }
}
export function* adoptFeedback() {
  const requestURL = `${Config.trlink_qb}/api/examPaper/adoptFeedback`;
  const questionsList = yield select(makeQuestionsList());
  const params = questionsList.toJS().map((item) => {
    const questionOutputDTO = item.questionOutputDTO;
    return {
      questionId: item.questionId,
      tagUser1FeedbackAdoptFlag: toBoolean(questionOutputDTO[submitAdoptTypeList[0]]),
      tagUser2FeedbackAdoptFlag: toBoolean(questionOutputDTO[submitAdoptTypeList[1]]),
      auditTagUserFeedbackAdoptFlag: toBoolean(questionOutputDTO[submitAdoptTypeList[2]]),
    };
  });
  console.log(params, 'adoptFeedback');
  try {
    const repos = yield call(request, requestURL, Object.assign({}, postjsonoptions(), { body: JSON.stringify(params) }));
    if (toString(repos.code === '0')) {
      console.log(repos.message || '采纳保存成功');
    } else {
      console.log(repos.message || '采纳保存失败');
    }
  } catch (err) {
    console.log('异常错误-采纳保存失败');
  }
}

export function* getPaperMsgSaga() {
  const watcher = yield takeLatest(GET_PAPER_LIST_ACTION, getPaperMsg);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getAllQuestionTypeListSaga() {
  const watcher = yield takeLatest(GET_ALL_QUESTION_TYPE_LIST_ACTION, getAllQuestionTypeList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getPaperNeedVerifySaga() {
  const watcher = yield takeLatest(CHANGE_NEED_VERIFY_PAPER_ID_ACTION, getPaperNeedVerify);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getKnowledgeAndExamPointListSaga() {
  const watcher = yield takeLatest(GET_POINT_LIST_ACTION, getKnowledgeAndExamPointList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* removeBigQuestionSaga() {
  const watcher = yield takeLatest(REMOVE_BIG_QUESTION_ACTION, removeBigQuestion);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* removeSmallQuestionSaga() {
  const watcher = yield takeLatest(REMOVE_SMALL_QUESTION_ACTION, removeSmallQuestion);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* submitQuestionItemSaga() {
  const watcher = yield takeLatest(SUBMIT_QUESTION_ITEM_ACTION, submitQuestionItem);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* saveWarehouseSaga() {
  const watcher = yield takeLatest(SAVE_WAREHOUSE_ACTION, saveWarehouse);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}


export function* getPaperMsgListSaga() {
  const watcher = yield takeLatest(GET_PAPER_MSG_LIST_ACTION, getPaperMsgList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getEditionListSaga() {
  const watcher = yield takeLatest(GET_EDITION_ACTION, getEditionList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getCityListSaga() {
  const watcher = yield takeLatest(GET_CITY_ACTION, getCityList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getCountyListSaga() {
  const watcher = yield takeLatest(GET_COUNTY_ACTION, getCountyList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* changePaperMsgSaga() {
  const watcher = yield takeLatest(CHANGE_PAPER_MSG_ACTION, changePaperMsg);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* changeBigNameSage() {
  const watcher = yield takeLatest(CHANGE_BIG_NAME_ACTION, changeBigName);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* adoptFeedbackSaga() {
  const watcher = yield takeLatest(SUMBIT_ADOPT_FEED_BACK_ACTION, adoptFeedback);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
  getPaperMsgSaga,
  getPaperNeedVerifySaga,
  removeBigQuestionSaga,
  removeSmallQuestionSaga,
  getAllQuestionTypeListSaga,
  getKnowledgeAndExamPointListSaga,
  submitQuestionItemSaga,
  saveWarehouseSaga,
  getPaperMsgListSaga,
  getEditionListSaga,
  getCityListSaga,
  getCountyListSaga,
  changePaperMsgSaga,
  changeBigNameSage,
  adoptFeedbackSaga,
];
