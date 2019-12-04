import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
// import { browserHistory } from 'react-router';
import { fromJS } from 'immutable';
import Config from 'utils/config';
import request, { postjsonoptions, getjsonoptions } from 'utils/request';
// import AppLocalStorage from 'utils/localStorage';
import { message, Modal } from 'antd';
import { filterHtmlForm, letterOptions, formatZmStand, backfromZmStand } from 'components/CommonFn';
import { changeDataIsLoadingAction, changeBtnCanClickAction } from 'containers/LeftNavC/actions';
import { changeVerifyCodeAction } from 'containers/Header/actions';
import { makeVerificationCode } from 'containers/Header/selectors';
import { getDefaultTemplate, getTemplatesByTypeId } from 'utils/templateMapper';
import { validateTemplate } from './enteringWrapper';
import {
  GET_PROVINCE_LIST_ACTION,
  GET_CITY_LIST_ACTIOHN,
  GET_COUNTY_LIST_ACTION,
  CHANGE_NEED_INPUT_PAPER_ACTION,
  GET_SUBJECT_LIST_ACTION,
  // GET_GRADE_LIST_ACTION,
  GET_PAPER_MSG_ACTION,
  GET_INPUT_PAPER_TASK_ACTION,
  GET_CUR_PAPER,
  INDEX_INCREASE,
  // SUBMIT_CUR_QUES,
  BACK_FORWARD,
  // SUBMIT_COMPLEX_QUESTION_ACTION,
  GET_ALL_QUESTION_TYPE_LIST_ACTION,
  SUBMIT_PAPER_TO_VERIFY,
  CHANGE_SORT_ACTION,
  SUBMIT_CURRENT_QUESTION_ACTION,
  CHANGE_QUESTIONS_INDEX_ACTION,
} from './constants';
import {
  setProvinceListAction, setCityListAction, setCountyListAction, setPaperListAction,
  setSelectedProvinceAction, setSelectedCityAction, setSelectedCountyAction, getPaperMsgAction,
  getCityListActiion, getCountyListActiion, setSubjectListAction, setSelectedSubjectAction,
  changePaperCountAction, changeHasGetPaperCountAction,
  setCurIndex, setCurItem, setCurPaper, setAllQuestionListAction,
  changePageStateAction, toggleFinishModal, setComplexQuestionItemAndMsgAction, setSubmitAllDone,
  setPaperDownloadMsgAction,
  setSelectedTemplateAction,
  setErrListAction,
  // setComplexQuestionItemAction,
  saveOthersMsgAction,
  setQuestionsListAction,
  changeQuestionsIndexAction,
  changeTemplateList,
} from './actions';
import {
  makePageSize, makePageIndex, makePaperState,
  makePaperWhichNeedGetId, makePaperWhichNeedInputId, makePaperWhichNeedInputItem,
  makeSelectedProvince, makeSelectedCity,
  makeSelectedEPID,
  makeCurIndex,
  makeCurPaper,
  // makeResultList,
  // makeCurQuesResult,
  // makeComplexQuestionItem,
  // makeComplexQuestionItemMsg,
  makeSort,
  // makeSlectedTemplate,
  makeTemplateList,
  makeQuestionsList,
  makeQuestionsIndex,
  makeOthersData,
  // makeErrList,
} from './selectors';

// 获取 paperList
export function* getPaperMsg() {
  const requestURL = `${Config.trlink_qb}/api/examPaper`;
  const pageSize = yield select(makePageSize());
  const pageIndex = yield select(makePageIndex());
  const sort = yield select(makeSort());
  const state = yield select(makePaperState());
  const params1 = { pageSize, pageIndex, sort, stateStr: '4' };
  const params2 = { pageSize, pageIndex, sort, stateStr: '', userRole: 3 };
  try {
    yield put(changeDataIsLoadingAction(true));
    if (state === 4) {
      const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params1);
      switch (repos.code.toString()) {
        case '0':
          yield put(changePaperCountAction(repos.data.total));
          yield put(setPaperListAction(fromJS(repos.data.data || [])));
          break;
        default:
          yield put(changePaperCountAction(0));
          yield put(setPaperListAction(fromJS([])));
          // if (repos.message) {
          message.warning(repos.message || '系统异常，请稍等片刻后尝试再次');
          // } else {
          //   message.warning('');
          // }
          break;
      }
      yield put(changeDataIsLoadingAction(false));
      const res = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params2);
      switch (res.code.toString()) {
        case '0':
          yield put(changeHasGetPaperCountAction(res.data.total));
          break;
        default:
          if (res.message) {
            message.warning(res.message);
          } else {
            message.warning('获取已领取试卷数量异常');
          }
          break;
      }
    } else if (state === 5) {
      const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params2);
      switch (repos.code.toString()) {
        case '0':
          yield put(changeHasGetPaperCountAction(repos.data.total));
          yield put(setPaperListAction(fromJS(repos.data.data || [])));
          break;
        case '1':
          break;
        default:
          yield put(changeHasGetPaperCountAction(0));
          yield put(setPaperListAction(fromJS([])));
          // if (repos.message) {
          //   message.warning(repos.message);
          // } else {
          message.warning(repos.message || '系统异常，请稍等片刻后尝试再次');
          // }
          break;
      }
      yield put(changeDataIsLoadingAction(false));
      const res = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params1);
      switch (res.code.toString()) {
        case '0':
          yield put(changePaperCountAction(res.data.total));
          break;
        case '1':
          break;
        default:
          if (res.message) {
            message.warning(res.message);
          } else {
            message.warning('获取未领取试卷数量异常');
          }
          break;
      }
    }
  } catch (err) {
    // err Msg
    message.error('执行错误导致数据获取失败！');
    yield put(changeDataIsLoadingAction(false));
  }
}

// 获取 省
export function* getProvinceList() {
  const requestURL = `${Config.trlink_qb}/api/region/province`;
  try {
    const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()));
    switch (repos.code.toString()) {
      case '0':
        if (!repos.data || repos.data.length === 0) {
          return;
        }
        yield put(setProvinceListAction(fromJS(repos.data)));
        yield put(setSelectedProvinceAction(fromJS(repos.data[0])));
        yield put(getCityListActiion());
        break;
      default:
        yield put(setSelectedCityAction(fromJS({ id: -1, name: '获取省份失败' })));
        break;
    }
  } catch (err) {
    // err Msg
    message.error('执行错误导致数据获取失败！');
  }
}
// 获取 市
export function* getCityList() {
  const requestURL = `${Config.trlink_qb}/api/region/city`;
  // const selectProvince = yield select(makeSelectedProvince());
  const paperItem = yield select(makePaperWhichNeedInputItem());
  const params = { provinceId: paperItem.get('provinceId') };
  if (!params.provinceId) {
    return;
  }
  try {
    const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params);
    switch (repos.code.toString()) {
      case '0':
        if (!repos.data || repos.data.length === 0) {
          return;
        }
        yield put(setCityListAction(fromJS(repos.data)));
        yield put(setSelectedCityAction(fromJS(repos.data[0])));
        yield put(getCountyListActiion());
        break;
      default:
        yield put(setSelectedCityAction(fromJS({ id: -1, name: '获取城市失败' })));
        break;
    }
  } catch (err) {
    // err Msg
    message.error('执行错误导致数据获取失败！');
  }
}
// 获取 县
export function* getCountyList() {
  const requestURL = `${Config.trlink_qb}/api/region/county`;
  const paperItem = yield select(makePaperWhichNeedInputItem());
  // const selectProvince = yield select(makeSelectedProvince());
  // const selectedCity = yield select(makeSelectedCity());
  const params = { provinceId: paperItem.get('provinceId'), cityId: paperItem.get('cityId') };
  try {
    const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params);
    switch (repos.code.toString()) {
      case '0':
        if (!repos.data || repos.data.length === 0) {
          return;
        }
        yield put(setCountyListAction(fromJS(repos.data)));
        yield put(setSelectedCountyAction(fromJS(repos.data[0])));
        break;
      default:
        yield put(setSelectedCountyAction(fromJS({ id: -1, name: '获取区县失败' })));
        break;
    }
  } catch (err) {
    // err Msg
    message.error('执行错误导致数据获取失败！');
  }
}
// 获取 学科列表
export function* getSubjectList() {
  const requestURL = `${Config.trlink_qb}/api/questionTypeSubject`;
  const selectProvince = yield select(makeSelectedProvince());
  const selectedCity = yield select(makeSelectedCity());
  const params = { provinceId: selectProvince.get('id'), cityId: selectedCity.get('id') };
  try {
    const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params);
    switch (repos.code.toString()) {
      case '0':
        if (!repos.data || repos.data.length === 0) {
          return;
        }
        console.log(repos.data, '-- repos.data');
        yield put(setSubjectListAction(fromJS(repos.data)));
        yield put(setSelectedSubjectAction(fromJS(repos.data[0])));
        break;
      case '1':
        if (repos.message) {
          alert(repos.message);
        } else {
          alert('系统异常');
        }
        break;
      default:
        yield put(setSelectedSubjectAction(fromJS({ id: -1, name: '获取年级失败' })));
        break;
    }
  } catch (err) {
    // err Msg
    message.error('执行错误导致数据获取失败！');
  }
}

// 获取 年级列表
/*
export function* getGradeList() {
  const requestURL = `${Config.trlink_qb}/api/questionTypeSubject`;
  const selectProvince = yield select(makeSelectedProvince());
  const selectedCity = yield select(makeSelectedCity());
  const params = { provinceId: selectProvince.get('id'), cityId: selectedCity.get('id') };
  try {
    const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()), params);
    switch (repos.code.toString()) {
      case '0':
        yield put(setGradeListAction(fromJS(repos.data)));
        yield put(setSelectedGradeAction(fromJS(repos.data[0])));
        break;
      default:
        yield put(setSelectedCountyAction(fromJS({ id: -1, name: '获取区县失败' })));
        break;
    }
  } catch (err) {
    // err Msg
  }
}
*/
// 领取录入任务
export function* getInputPaperTask() {
  const id = yield select(makePaperWhichNeedGetId());
  const requestURL = `${Config.trlink_qb}/api/examPaper/${id}/action/receiveEntry`;
  const verificationCode = yield select(makeVerificationCode());
  const params = { captcha: verificationCode.get('code') };
  if (!params.captcha) {
    message.warning('请输入验证码后再提交！');
    return;
  }
  try {
    const repos = yield call(request, requestURL, Object.assign({ body: JSON.stringify(params) }, postjsonoptions()));
    switch (repos.code.toString()) {
      case '0':
        // console.log(repos, 'repos --- 193');
        message.success('领取成功');
        yield put(changeVerifyCodeAction('default'));
        yield put(getPaperMsgAction());
        break;
      default:
        message.error(repos.message || '系统异常');
        // yield put(changeVerifyCodeAction('default'));
        break;
    }
  } catch (err) {
    // err Msg
    message.error('执行错误');
    // yield put(changeVerifyCodeAction('default'));
  }
}
// 获取即将录入的试卷
export function* getCurPaperPic() {
  const epid = yield select(makeSelectedEPID());
  const requestURL = `${Config.trlink_qb}/api/examPaper/${epid}`;
  // const templateList = yield select(makeTemplateList());
  // let templateTypeId = null;
  // let templateTypeIndex = null;
  // let typeId = null;
  const questionsList = [];
  let icount = 0;
  const errList = [];
  // const params = {id:_index}
  console.log('试卷id', epid);
  try {
    const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()));
    switch (repos.code.toString()) {
      case '0':
        yield put(setPaperDownloadMsgAction(fromJS({ fileUrl: repos.data.fileUrl, fileName: `${repos.data.name}(${repos.data.year})` })));
        repos.data.examPaperContentOutputDTOList.forEach((item) => {
          item.examPaperContentQuestionOutputDTOList.forEach((it) => {
            const iIt = it;
            if (!iIt.questionOutputDTO.templateType || typeof iIt.questionOutputDTO.templateType !== 'number') {
              iIt.questionOutputDTO.templateType = getDefaultTemplate(iIt.questionOutputDTO.typeId);
            } else {
              iIt.questionOutputDTO.templateType = it.questionOutputDTO.templateType || 1;
            }
            if (iIt.questionOutputDTO.templateType === 1 && (!it.questionOutputDTO.children || it.questionOutputDTO.children.length === 0)) {
              iIt.questionOutputDTO.children = it.questionOutputDTO.children || [{
                score: 3,
                title: '',
                optionList: ['', '', '', ''],
                answerList: [''],
                analysis: '',
                typeId: -1,
              }];
              iIt.questionOutputDTO.score = 3;
            } else {
              iIt.questionOutputDTO.children = (it.questionOutputDTO.children || []).map((itt) => {
                return {
                  score: itt.score,
                  title: backfromZmStand(itt.title),
                  optionList: itt.optionList.map((iit) => backfromZmStand(iit)), // eslint-disable-line
                  answerList: itt.answerList.map((iit) => backfromZmStand(iit)), // eslint-disable-line
                  analysis: backfromZmStand(itt.analysis),
                  typeId: itt.typeId,
                };
              });
            }
            if (repos.data.state === 5) {
              iIt.questionOutputDTO.errReason = '';
              iIt.questionOutputDTO.errState = -1;
            }
            iIt.bigNum = item.serialNumber;
            iIt.bigName = item.name;
            iIt.questionOutputDTO.score = it.questionOutputDTO.score || 3;
            iIt.questionOutputDTO.title = backfromZmStand(it.questionOutputDTO.title || '');
            iIt.questionOutputDTO.optionList = (((it.questionOutputDTO.optionList && it.questionOutputDTO.optionList.length > 0) ? it.questionOutputDTO.optionList : '') || ['', '', '', '']).map((iit) => backfromZmStand(iit));
            iIt.questionOutputDTO.answerList = (((it.questionOutputDTO.answerList && it.questionOutputDTO.answerList.length > 0) ? it.questionOutputDTO.answerList : '') || (iIt.questionOutputDTO.templateType === 2 ? [] : [''])).map((iit) => backfromZmStand(iit));
            iIt.questionOutputDTO.analysis = backfromZmStand(iIt.questionOutputDTO.analysis || '');
            questionsList.push(iIt);
            icount += 1;
            if (it.questionOutputDTO.errReason !== '') {
              errList.push(icount);
            }
          });
        });
        yield put(setSubmitAllDone(false));
        // console.log(errList, 'errList');
        yield put(saveOthersMsgAction(fromJS({
          subjectId: repos.data.subjectId,
          gradeId: repos.data.gradeId,
          realQuestionCount: questionsList.length,
        })));
        // console.log(questionsList, 'questionsList');
        yield put(setQuestionsListAction(fromJS(questionsList)));
        yield put(setErrListAction(fromJS(errList)));
        yield put(changePageStateAction(2));
        break;
      default:
        break;
    }
  } catch (err) {
    // err Msg
    message.error('执行错误导致数据获取失败！');
    console.log('getCurPaperPic 失败 > ', err);
  }
}

// 获取录入的试卷并跳转到填写信息界面
export function* changeNeedInputPaper() {
  console.log('去吧小试卷');
  const id = yield select(makePaperWhichNeedInputId());
  const requestURL = `${Config.trlink_qb}/api/examPaper/${id}`;
  // const params = {id:_index}
  try {
    const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()));
    switch (repos.code.toString()) {
      case '0': // eslint-disable-line
        if (!repos.data || repos.data.length === 0) {
          return;
        }
        const paperList = repos.data.examPaperContentOutputDTOList;
        yield put(setCurPaper(fromJS(paperList)));
        yield put(setCurIndex(fromJS({ index: 0, subIndex: 0, totalIndex: 0 })));
        yield put(setCurItem(paperList[0].examPaperContentQuestionOutputDTOList[0]));
        console.log(repos);
        yield put(changePageStateAction(4));
        break;
      case '1':
        if (repos.message) {
          alert(repos.message);
        } else {
          alert('系统异常,请刷新重试');
        }
        break;
      default:
        // yield put(setSelectedSubjectAction(fromJS({ id: -1, name: '获取年级失败' })));
        break;
    }
  } catch (err) {
    // err Msg
    message.error('执行错误导致数据获取失败！');
  }
}
// 切换下一题
export function* makeIndexIncrease() {
  const _index = yield select(makeCurIndex());
  const curPaper = yield select(makeCurPaper());
  const supIndex = _index.get('index');
  const subIndex = _index.get('subIndex');
  const totalIndex = _index.get('totalIndex');
  const curPaperJS = curPaper.toJS();
  const templateList = yield select(makeTemplateList());
  let templateTypeId = null;
  let typeId = null;
  console.log('curPaperJS', curPaperJS[0].examPaperContentQuestionOutputDTOList);
  if (!curPaperJS || !curPaperJS.length) {
    return;
  }
  // let n_index = supIndex;
  // let n_subindex = subIndex;
  const curSubQues = curPaperJS[supIndex].examPaperContentQuestionOutputDTOList;
  if (curSubQues && subIndex < curSubQues.length - 1) {
    yield put(setCurIndex(_index.set('subIndex', subIndex + 1).set('totalIndex', totalIndex + 1)));
    console.log('indexIncrease', supIndex, subIndex + 1, totalIndex + 1);
    const curItem = curPaperJS[supIndex].examPaperContentQuestionOutputDTOList[subIndex + 1];
    console.log('set cur item ', curItem);
    yield put(setCurItem(fromJS(curItem)));
    templateTypeId = curItem.questionOutputDTO.templateType;
    typeId = curItem.questionOutputDTO.typeId;
    if (templateTypeId) {
      yield put(setSelectedTemplateAction(templateList.get(templateTypeId - 1)));
    } else {
      yield put(setSelectedTemplateAction(templateList.get(getDefaultTemplate(typeId) - 1)));
    }
    if (Number(templateTypeId) === 1 || Number(getDefaultTemplate(typeId)) === 1) {
      yield put(setComplexQuestionItemAndMsgAction());
    }
  } else {
    if (supIndex + 1 === curPaperJS.length) {
      yield put(toggleFinishModal());
      yield put(setSubmitAllDone(true));
      return false;
    } else {
      yield put(setCurIndex(_index.set('subIndex', 0).set('index', supIndex + 1).set('totalIndex', totalIndex + 1)));
      const curItem = curPaperJS[supIndex + 1].examPaperContentQuestionOutputDTOList[0];
      console.log('indexIncrease', supIndex + 1, 0, totalIndex + 1);
      console.log('set cur item - 2', curItem);
      yield put(setCurItem(fromJS(curItem)));
      templateTypeId = curItem.questionOutputDTO.templateType;
      typeId = curItem.questionOutputDTO.typeId;
      if (templateTypeId) {
        yield put(setSelectedTemplateAction(templateList.get(templateTypeId - 1)));
      } else {
        yield put(setSelectedTemplateAction(templateList.get(getDefaultTemplate(typeId) - 1)));
      }
      if (Number(templateTypeId) === 1 || Number(getDefaultTemplate(typeId)) === 1) {
        yield put(setComplexQuestionItemAndMsgAction());
      }
    }
  }
}
export function* indexDecrease() {
  const _index = yield select(makeCurIndex());
  const curPaper = yield select(makeCurPaper());
  const supIndex = _index.get('index');
  const subIndex = _index.get('subIndex');
  const totalIndex = _index.get('totalIndex');
  const curPaperJS = curPaper.toJS();
  const templateList = yield select(makeTemplateList());
  let templateTypeId = null;
  let typeId = null;
  if (!curPaperJS || !curPaperJS.length) {
    return;
  }
  let n_index = supIndex;
  let n_subindex = subIndex;
  if (String(subIndex) === '0') {
    if (String(supIndex) === '0') {
      alert('没有上一题了');
      return false;
    }
    n_index = n_index - 1;
    while (n_index > 0 && !curPaperJS[n_index].examPaperContentQuestionOutputDTOList.length) {
      n_index = n_index - 1;
    }
    n_subindex = curPaperJS[n_index].examPaperContentQuestionOutputDTOList.length - 1;
    yield put(setCurIndex(_index.set('index', n_index).set('subIndex', n_subindex).set('totalIndex', totalIndex - 1)));
    console.log('indexDecrease1', n_index, n_subindex, totalIndex - 1);
    const curItem = curPaperJS[n_index].examPaperContentQuestionOutputDTOList[n_subindex];
    console.log('set cur item ', curItem);
    yield put(setCurItem(fromJS(curItem)));
    templateTypeId = curItem.questionOutputDTO.templateType;
    typeId = curItem.questionOutputDTO.typeId;
    if (templateTypeId) {
      yield put(setSelectedTemplateAction(templateList.get(templateTypeId - 1)));
    } else {
      yield put(setSelectedTemplateAction(templateList.get(getDefaultTemplate(typeId) - 1)));
    }
    if (Number(templateTypeId) === 1 || Number(getDefaultTemplate(typeId)) === 1) {
      yield put(setComplexQuestionItemAndMsgAction());
    }
  } else {
    yield put(setCurIndex(_index.set('subIndex', n_subindex - 1).set('totalIndex', totalIndex - 1)));
    // console.log('indexDecrease2', supIndex, n_subindex - 1, totalIndex - 1);
    const curItem = curPaperJS[n_index].examPaperContentQuestionOutputDTOList[n_subindex - 1];
    // console.log('set cur item ', curItem);
    yield put(setCurItem(fromJS(curItem)));
    templateTypeId = curItem.questionOutputDTO.templateType;
    typeId = curItem.questionOutputDTO.typeId;
    if (templateTypeId) {
      yield put(setSelectedTemplateAction(templateList.get(templateTypeId - 1)));
    } else {
      yield put(setSelectedTemplateAction(templateList.get(getDefaultTemplate(typeId) - 1)));
    }
    if (Number(templateTypeId) === 1 || Number(getDefaultTemplate(typeId)) === 1) {
      yield put(setComplexQuestionItemAndMsgAction());
    }
  }
}
/*
export function* subMitCurQues() {
  const result = yield select(makeCurQuesResult());
  let copy_result = Object.assign({}, result.toJS());
  const id = yield select(makeSelectedEPID());
  const curPaper = yield select(makeCurPaper());
  const curIndex = yield select(makeCurIndex());
  let curIndexJS = curIndex.toJS();
  let curPaperJS = curPaper.toJS();
  const slectedTemplate = yield select(makeSlectedTemplate());
  const params = Object.assign({}, result.toJS(), { templateType: Number(slectedTemplate.get('id')) });
  log(slectedTemplate.toJS(), 'slectedTemplate -- slectedTemplate');
  console.log('params', params);
  // return false;
  const requestURL = `${Config.trlink_qb}/api/examPaper/${id}/action/entry`;
  // console.log('提交后',curPaperJS)
  try {
    yield put(changeBtnCanClickAction(false));
    const repos = yield call(request, requestURL, Object.assign({}, postjsonoptions(), { body: JSON.stringify({ entryExamPaperQuesInputDTOList: [params], epId: id, submitFlag: false }) }));
    if (repos.code == 0) {
      message.success('提交成功');
      // 编辑结果赋值给试卷切割列表中对应字段，供再次预览编辑
      let o_curItem = curPaperJS[curIndexJS.index].examPaperContentQuestionOutputDTOList[curIndexJS.subIndex].questionOutputDTO;
      curPaperJS[curIndexJS.index].examPaperContentQuestionOutputDTOList[curIndexJS.subIndex].questionOutputDTO = Object.assign({}, o_curItem, copy_result);
      yield put(setCurPaper(fromJS(curPaperJS)));
      yield put(indexIncrease());
      console.log(repos);
    } else {
      message.warning(repos.message || '提交失败');
    }
    yield put(changeBtnCanClickAction(true));
  } catch (err) {
    // err Msg
    message.error('执行错误导致保存失败！');
    yield put(changeBtnCanClickAction(true));
  }
}
export function* submitComplexQuestion() {
  const questionList = yield select(makeComplexQuestionItem());
  const questionMsg = yield select(makeComplexQuestionItemMsg());
  const slectedTemplate = yield select(makeSlectedTemplate());
  const id = yield select(makeSelectedEPID());
  //
  const curPaper = yield select(makeCurPaper());
  const curIndex = yield select(makeCurIndex());
  const curIndexJS = curIndex.toJS();
  let curPaperJS = curPaper.toJS();
  const requestURL = `${Config.trlink_qb}/api/examPaper/${id}/action/entry`;
  console.log(questionList.toJS(), questionList.count(), 'questionList');
  const entryExamPaperInputDTO = {
    entryExamPaperQuesInputDTOList: [{
      score: questionMsg.get('score'),
      title: questionMsg.get('title'),
      questionId: questionMsg.get('questionId'),
      typeId: questionMsg.get('typeId'),
      answerList: [],
      optionList: [],
      templateType: Number(slectedTemplate.get('id')),
      children: questionList.toJS().map((it) => {
        return {
          score: it.score,
          title: it.title,
          optionList: it.optionList,
          answerList: it.answerList,
          analysis: it.analysis,
          typeId: it.typeId,
        };
      }),
    }],
    epId: id,
    submitFlag: false,
  };
  // }
  console.log(entryExamPaperInputDTO, 'entryExamPaperInputDTO - entryExamPaperInputDTO');
  // return false;
  try {
    yield put(changeBtnCanClickAction(false));
    const repos = yield call(request, requestURL, Object.assign({}, postjsonoptions(), { body: JSON.stringify(entryExamPaperInputDTO) }));
    // console.log(repos, 'repos -- 456');
    const oldCurItem = curPaperJS[curIndexJS.index].examPaperContentQuestionOutputDTOList[curIndexJS.subIndex].questionOutputDTO;
    switch (repos.code.toString()) {
      case '0':
        curPaperJS[curIndexJS.index].examPaperContentQuestionOutputDTOList[curIndexJS.subIndex].questionOutputDTO = Object.assign({}, oldCurItem, entryExamPaperInputDTO.entryExamPaperQuesInputDTOList[0]);
        // log(curPaperJS, 'curPaperJS -- curPaperJS', entryExamPaperInputDTO.entryExamPaperQuesInputDTOList);
        yield put(setCurPaper(fromJS(curPaperJS)));
        message.success('提交成功');
        yield put(indexIncrease());
        break;
      case '1':
        if (repos.message) {
          message.warning(repos.message);
        } else {
          message.warning('系统异常，请稍等片刻后尝试');
        }
        break;
      default:
        break;
    }
    yield put(changeBtnCanClickAction(true));
  } catch (err) {
    // err Msg
    console.log('try error');
    // message.warning('系统异常');
    message.error('执行错误导致保存失败！');
    yield put(changeBtnCanClickAction(true));
  }
}
*/
// 获取题目类型
export function* getAllQuestionTypeList() {
  const requestURL = `${Config.trlink_qb}/api/questionType`;
  try {
    const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()));
    switch (repos.code.toString()) {
      case '0':
        // console.log(repos, 'repos -- 497');
        yield put(setAllQuestionListAction(fromJS(repos.data)));
        break;
      case '1':
        if (repos.message) {
          message.warning(repos.message);
        } else {
          message.warning('系统异常，获取题目类型失败');
        }
        break;
      default:
        break;
    }
  } catch (err) {
    // err Msg
    message.warning('无法获取题目类型列表');
  }
}
export function* submitPaperVerify() {
  const id = yield select(makeSelectedEPID());
  const requestURL = `${Config.trlink_qb}/api/examPaper/${id}/action/entry`;
  const entryExamPaperInputDTO = {
    entryExamPaperQuesInputDTOList: [],
    submitFlag: true,
    epId: id,
  };
  try {
    yield put(changeBtnCanClickAction(false));
    const repos = yield call(request, requestURL, Object.assign({}, postjsonoptions(), { body: JSON.stringify(entryExamPaperInputDTO) }));
    switch (repos.code.toString()) {
      case '0':
        message.success('提交审核成功！');
        yield put(changePageStateAction(0));
        break;
      case '1':
        message.warn(repos.message || '提交失败，请稍后重试。');
        break;
      default:
        break;
    }
    yield put(changeBtnCanClickAction(true));
  } catch (e) {
    message('提交审核发生错误，请刷新后重试。');
    yield put(changeBtnCanClickAction(true));
  }
}

export function* submitCurrentQuestion() { // eslint-disable-line
  const id = yield select(makeSelectedEPID());
  const requestURL = `${Config.trlink_qb}/api/examPaper/${id}/action/entry`;
  const questionsList = yield select(makeQuestionsList());
  const questionsIndex = yield select(makeQuestionsIndex());
  const othersData = yield select(makeOthersData());
  // const questionErrList = yield select(makeErrList());
  const currentQuestion = questionsList.get(questionsIndex);
  const questionOutputDTO = currentQuestion.get('questionOutputDTO');
  const templateType = questionOutputDTO.get('templateType');
  const children = templateType === 1 ? questionOutputDTO.get('children').toJS() : null;
  let optionList = templateType === 2 ? questionOutputDTO.get('optionList').toJS() : [];
  let answerList = [];
  const curAnswerList = (questionOutputDTO.get('answerList') || fromJS([''])).toJS();
  let analysis = questionOutputDTO.get('analysis');
  const errList = [];
  if (!filterHtmlForm(questionOutputDTO.get('title'))) errList.push({ type: 'titleError', value: '(主)题干不可以为空。' });
  if (templateType === 1) {
    optionList = [];
    answerList = [];
    analysis = '';
    questionOutputDTO.get('children').forEach((item, index) => {
      // if (item.get('questionId') <= 0) errList.push({ type: 'questionIdError', value: '题目id获取错误，请重新尝试。', index });
      if (item.get('score') <= 0) errList.push({ type: 'socre', value: '分数未设置或设置错误。', index });
      if (item.get('typeId') <= 0) errList.push({ type: 'typeIdError', value: '子题类型设置错误或未选择。', index });
      if (item.get('answerList').count() <= 0) errList.push({ type: 'answerListError', value: '答案为必填项，请选择(填写)答案。', index });
      if (item.get('typeId') === 2) {
        if (!item.get('optionList') || item.get('optionList').count() <= 0) errList.push({ type: 'optionListError', value: '选项获取错误。', index });
        if (!item.get('optionList').every((it) => filterHtmlForm(it))) errList.push({ type: 'optionListError', value: '有选项未填写。', index });
        if (!item.get('answerList').every((it) => letterOptions.indexOf(it) > -1)) errList.push({ type: 'answerListError', value: '答案检验出错，请取消并重新选择答案。', index });
      } else if (!item.get('answerList').every((it) => filterHtmlForm(it))) {
        errList.push({ type: 'answerListError', value: '答案内容不可以为空。', index });
      }
      if (!filterHtmlForm(item.get('analysis'))) errList.push({ type: 'analysisError', value: '解析不可以为空。', index });
    });
  } else {
    if (questionOutputDTO.get('questionId') <= 0) errList.push({ type: 'questionIdError', value: '题目id获取错误，请重新尝试。' });
    if (questionOutputDTO.get('score') <= 0) errList.push({ type: 'scoreError', value: '分数最小未0.5分。' });
    if (questionOutputDTO.get('typeId') <= 0) errList.push({ type: 'typeIdError', value: '题型id获取错误，请重新尝试。' });
    if (Number(questionOutputDTO.get('typeId')) === 1 && questionOutputDTO.get('answerList').count() !== 1) errList.push({ type: 'typeIdError', value: '单选题有且只有一个答案' });
    if (Number(questionOutputDTO.get('typeId')) === 2 && questionOutputDTO.get('answerList').count() < 2) errList.push({ type: 'typeIdError', value: '多选题必须有多个答案' });
    if (templateType !== 1) {
      if (templateType !== 2) {
        if (templateType === 4 && curAnswerList.length > 1) errList.push({ type: 'answerListError', value: '请确认答案数量是否正确。' });
        if (!curAnswerList.every((it) => filterHtmlForm(it))) errList.push({ type: 'answerListError', value: '答案内容不可以为空。' });
      }
      if (templateType === 2 && !questionOutputDTO.get('optionList').every((it) => filterHtmlForm(it))) errList.push({ type: 'optionListError', value: '选项内容不可以为空。' });
      if (curAnswerList.length <= 0) errList.push({ type: 'questionIdError', value: '题目至少得有一个答案。' });
      else if (templateType === 2 && !curAnswerList.every((it) => letterOptions.indexOf(it) > -1)) errList.push({ type: 'questionIdError', value: '答案检验出错，请取消并重新选择答案。' });
      if (!filterHtmlForm(questionOutputDTO.get('analysis'))) errList.push({ type: 'analysisError', value: '解析不可以为空。' });
      // if (questionOutputDTO.get('questionId') || questionOutputDTO.get('questionId') <= 0) errList.push({ type: 'questionIdError', value: '题目id获取错误，请重新尝试。' });
    }
    answerList = curAnswerList;
  }
  const params = {
    entryExamPaperQuesInputDTOList: [{
      questionId: currentQuestion.get('questionId'),
      score: questionOutputDTO.get('score'),
      title: formatZmStand(questionOutputDTO.get('title')),
      optionList: (optionList || []).map((it) => formatZmStand(it)),
      answerList: (answerList || []).map((it) => formatZmStand(it)),
      analysis: formatZmStand(analysis),
      typeId: questionOutputDTO.get('typeId'),
      children: (children || []).map((item) => {
        return {
          title: formatZmStand(item.title),
          analysis: formatZmStand(item.analysis),
          answerList: (item.answerList || []).map((it) => formatZmStand(it)),
          optionList: (item.optionList || []).map((it) => formatZmStand(it)),
          score: item.score,
          typeId: item.typeId,
        };
      }),
      templateType,
    }],
    submitFlag: false,
    epId: id,
  };
  console.log(params, 'params');
  if (errList.length > 0) {
    const msg = errList[0];
    message.warn(`${msg.value}${msg.index + 1 ? '位置：子题' + (msg.index + 1) + '。' : ''}`);
    console.log(`${msg.type}：${msg.value}${msg.index + 1 ? '位置：子题' + (msg.index + 1) + '。' : ''}`);
    return;
  }
  try {
    yield put(changeBtnCanClickAction(false));
    const repos = yield call(request, requestURL, Object.assign({}, postjsonoptions(), { body: JSON.stringify(params) }));
    switch (repos.code.toString()) {
      case '0':
        // if (questionErrList.count() > 0) {
        //   if (questionErrList.last() === questionsIndex + 1) {
        //     yield put(setSubmitAllDone(true));
        //     const modal = Modal.success({
        //       title: '保存成功且没有更多错题了！',
        //       content: '点击右上角“提交审核”按钮，试卷将再次进入录入审核阶段。',
        //     });
        //     setTimeout(() => {
        //       modal.destroy();
        //     }, 1500);
        //   } else {
        //     message.success('保存成功');
        //     const index = questionErrList.indexOf(questionsIndex + 1);
        //     const nextIndex = questionErrList.get(index + 1);
        //     console.log(questionsIndex, index, nextIndex, 'questionsIndex, index, nextIndex');
        //     yield put(changeQuestionsIndexAction(nextIndex - 1));
        //   }
        // } else {
        if (othersData.get('realQuestionCount') === questionsIndex + 1) {
          yield put(setSubmitAllDone(true));
          const modal = Modal.success({
            title: '保存成功且没有更多试题了！',
            content: '点击右上角“提交审核”按钮，试卷将进入录入审核阶段。',
          });
          setTimeout(() => {
            modal.destroy();
          }, 1500);
        } else {
          message.success('保存成功');
          yield put(changeQuestionsIndexAction(questionsIndex + 1));
        }
        // }
        break;
      default:
        message.warn(repos.message || '保存失败，请稍后重试。');
        break;
    }
    yield put(changeBtnCanClickAction(true));
  } catch (err) {
    message.error('执行错误导致保存失败，请刷新后重新执行操作。');
    yield put(changeBtnCanClickAction(true));
    console.log('err message', err);
  }
}

export function* changeQuestionIndex(item) {
  const questionsList = yield select(makeQuestionsList());
  const question = questionsList.getIn([item.num, 'questionOutputDTO']);
  console.log('question', item.num, question.toJS());
  const temps = getTemplatesByTypeId(question.get('typeId'));
  validateTemplate(temps, question.get('templateType'));
  // 切换可以选择的模板
  yield put(changeTemplateList(fromJS(temps)));
}

export function* getProvinceListSaga() {
  const watcher = yield takeLatest(GET_PROVINCE_LIST_ACTION, getProvinceList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getCityListSaga() {
  const watcher = yield takeLatest(GET_CITY_LIST_ACTIOHN, getCityList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getCountyListSaga() {
  const watcher = yield takeLatest(GET_COUNTY_LIST_ACTION, getCountyList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getSubjectListSaga() {
  const watcher = yield takeLatest(GET_SUBJECT_LIST_ACTION, getSubjectList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getPaperMsgSaga() {
  const watcher = yield takeLatest(GET_PAPER_MSG_ACTION, getPaperMsg);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getInputPaperTaskSaga() {
  const watcher = yield takeLatest(GET_INPUT_PAPER_TASK_ACTION, getInputPaperTask);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* changeNeedInputPaperSaga() {
  const watcher = yield takeLatest(CHANGE_NEED_INPUT_PAPER_ACTION, changeNeedInputPaper);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getCurPaper() {
  const watcher = yield takeLatest(GET_CUR_PAPER, getCurPaperPic);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* setIndexIncrease() {
  const watcher = yield takeLatest(INDEX_INCREASE, makeIndexIncrease);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
/*
export function* submit() {
  const watcher = yield takeLatest(SUBMIT_CUR_QUES, subMitCurQues);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
*/
export function* backforward() {
  const watcher = yield takeLatest(BACK_FORWARD, indexDecrease);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
/*
export function* submitComplexQuestionSage() {
  const watcher = yield takeLatest(SUBMIT_COMPLEX_QUESTION_ACTION, submitComplexQuestion);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
*/
export function* getAllQuestionTypeListSaga() {
  const watcher = yield takeLatest(GET_ALL_QUESTION_TYPE_LIST_ACTION, getAllQuestionTypeList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* submitVerify() {
  const watcher = yield takeLatest(SUBMIT_PAPER_TO_VERIFY, submitPaperVerify);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getPaperMsgFromSort() {
  const watcher = yield takeLatest(CHANGE_SORT_ACTION, getPaperMsg);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* submitCurrentQuestionSaga() {
  const watcher = yield takeLatest(SUBMIT_CURRENT_QUESTION_ACTION, submitCurrentQuestion);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* changeQuestionIndexSaga() {
  const watcher = yield takeLatest(CHANGE_QUESTIONS_INDEX_ACTION, changeQuestionIndex);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded  SUBMIT_PAPER_TO_VERIFY
export default [
  // defaultSaga,
  getProvinceListSaga,
  getCityListSaga,
  getCountyListSaga,
  getSubjectListSaga,
  // getGradeListSaga,
  getCurPaper,
  // setIndexIncrease,
  // submit,
  // backforward,
  getPaperMsgSaga,
  getInputPaperTaskSaga,
  // changeNeedInputPaperSaga,  // 暂不使用
  // submitComplexQuestionSage,
  getAllQuestionTypeListSaga,
  submitVerify,
  getPaperMsgFromSort,
  submitCurrentQuestionSaga,
  changeQuestionIndexSaga,
];
