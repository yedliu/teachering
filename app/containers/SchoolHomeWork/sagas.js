/* eslint-disable complexity */
/* eslint-disable no-case-declarations */
import React from 'react';
import {
  take,
  call,
  put,
  select,
  cancel,
  takeLatest,
} from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import request, {
  getjsonoptions,
  // postjsontokenoptions,
  // putjsontokenoptions,
} from 'utils/request';
import Config from 'utils/config';
import { fromJS } from 'immutable';
import { message, Modal } from 'antd';
import {
  toNumber,
  toString,
  backfromZmStandPrev,
  isNumber,
  filterHtmlForm,
  backPhaseId,
  homeworkGradeList,
} from 'components/CommonFn';
import {
  changeBtnCanClickAction,
  changeAlertShowOrHideAction,
  setAlertStatesAction,
} from 'containers/LeftNavC/actions';
// import { questionData, homeworkList } from './mockjson';
import { backChildren } from './TreeRender';
import {
  GET_GRADE_LIST_ACTION,
  GET_SUBJECT_LIST_ACTION,
  GET_EDITION_LIST_ACTION,
  GET_COURSE_LIST_ACTION,
  GET_PHASE_SUBJECT_ACTION,
  GET_KNOWLEDEGE_LIST_ACTION,
  GET_QUESTION_TYPE_LIST_ACTION,
  GET_QUESTION_LIST_ACTION,
  SAVE_STAND_HOMEWORK_ACTION,
  GET_STAND_HOMEWORK_LIST_ACTION,
  GET_PREVIEW_HOMEWORK_DATA_LIST_ACTION,
  EDIT_HOMEWORK_ACTION,
  GET_ALL_GRADE_LIST_ACTION,
  DELETE_HOMEWORK_ACTION,
  GET_KNOWLEDGELIST_BY_CSID_ACTION,
  GET_QUESTION_TYPE_FOR_AIHW_ACTION,
  GET_QUESTION_FOR_AIHW_ACTION,
  SAVE_AI_HOMEWORK_ACTION,
  GET_CHANGE_ITEMDATALIST_ACTION,
} from './constants';
import {
  makeSerachParams,
  makePrviewSelectObj,
  makeSearchQuestionParams,
  makeCreateHomeworkStepParams,
  makePreviewHomework,
  makeAIHomeworkParams,
} from './selectors';
import {
  setPreviewSelectObjAction,
  getSubjectListAction,
  getEditionListAction,
  getCourseListAction,
  setSearchQuestionParamsAction,
  getKnowledgeListAction,
  getQuestionTypeListActioin,
  getQuestionListAction,
  setCreateHomeworkStepParamsAction,
  // initDataWhenCloseAction,
  getStandhomeworkListAction,
  setPreviewHomeworkDataListAction,
  getAllGradeListAction,
  setAllGradeListAction,
  setAIHWParamsAction,
  getQuestionType4AiHwAction,
  setAIHWParamsItemAction,
  initDataWhenCloseAction,
  getKnowledgeListByCsidAction,
  changePageState,
} from './actions';
import {
  backDefaultKnowledge,
  backPath,
  pathFinish,
  getTreePath,
  getDifficultyList,
} from './common';

import questionAip from '../../api/qb-cloud/question-endpoint';
import courseSystemApi from 'api/tr-cloud/course-system-endpoint';
import knowledgeApi from 'api/tr-cloud/knowledge-endpoint';
import gradeApi from 'api/tr-cloud/grade-endpoint';
import subjectApi from 'api/tr-cloud/subject-endpoint';
import editionApi from 'api/tr-cloud/edition-endpoint';
import homeworkApi from 'api/hw-cloud/homework-endpoint';
import phaseSubjectApi from 'api/tr-cloud/phase-subject-endpoint';
import queryNodeApi from 'api/qb-cloud/sys-dict-end-point';

const judgeScoolType = (serachParams, params) => {
  const schoolType = serachParams.get('schoolType');
  if (schoolType && Number(schoolType) !== 4) {
    params.zmxtType = schoolType;
  }
};

export function* getGradeList() {
  const prviewSelectObj = yield select(makePrviewSelectObj());
  const defaultGrade = { id: -1, name: '年级' };
  try {
    const repos = yield gradeApi.getGrade();
    // console.log(repos, 'getGradeList');
    switch (repos.code.toString()) {
      case '0':
        const selectedGrade = repos.data[0] || defaultGrade;
        console.log('selectedGrade', selectedGrade);
        yield put(setAIHWParamsItemAction('grade', selectedGrade.name));
        yield put(
          setPreviewSelectObjAction(
            prviewSelectObj
              .set('gradeList', fromJS(repos.data || [defaultGrade]))
              .set('selectGrade', fromJS(selectedGrade)),
          ),
        );
        yield put(getSubjectListAction());
        break;
      default:
        yield put(prviewSelectObj.set('gradeList', fromJS([])));
        yield put(
          setPreviewSelectObjAction(
            prviewSelectObj
              .set('gradeList', fromJS([defaultGrade]))
              .set('selectGrade', fromJS(defaultGrade)),
          ),
        );
        message.warning(repos.message || '获取年级列表失败');
        break;
    }
  } catch (err) {
    message.warning('执行感错误导致获取年级列表异常');
    console.log('show err', err);
  }
}
export function* getSudjectList() {
  // const requestURL = `${Config.trlink}/api/phaseSubject/subject`;
  const prviewSelectObj = yield select(makePrviewSelectObj());
  const gradeId = prviewSelectObj.getIn(['selectGrade', 'id']) || -1;
  if (gradeId < 0) return;
  // const params = { gradeId };
  const defaultSubject = { id: -1, name: '学科' };
  try {
    const repos = yield subjectApi.getSubjectByGradeId(gradeId);
    switch (repos.code.toString()) {
      case '0':
        const selectSubject = repos.data[0] || defaultSubject;
        yield put(setAIHWParamsItemAction('subject', selectSubject.name));
        yield put(
          setPreviewSelectObjAction(
            prviewSelectObj
              .set('sudjectList', fromJS(repos.data || [defaultSubject]))
              .set('selectSubject', fromJS(selectSubject)),
          ),
        );
        yield put(getEditionListAction());
        break;
      default:
        yield put(
          setPreviewSelectObjAction(
            prviewSelectObj
              .set('sudjectList', fromJS([defaultSubject]))
              .set('selectSubject', fromJS(defaultSubject)),
          ),
        );
        yield put(
          prviewSelectObj.set(
            'sudjectList',
            fromJS([{ id: -1, name: '请选择' }]),
          ),
        );
        message.warning(repos.message || '获取学科列表失败');
        break;
    }
  } catch (err) {
    message.warning('执行错误导致获取学科列表异常');
    console.log('show err', err);
  }
}
export function* getEditionList() {
  const prviewSelectObj = yield select(makePrviewSelectObj());
  const gradeId = prviewSelectObj.getIn(['selectGrade', 'id']) || -1;
  const subjectId = prviewSelectObj.getIn(['selectSubject', 'id']) || -1;
  if (gradeId < 0) return;
  const params = { gradeId, subjectId };
  const defaultEditon = { id: -1, name: '版本' };
  try {
    const repos = yield editionApi.getEdition(params);
    switch (repos.code.toString()) {
      case '0': {
        yield put(
          setPreviewSelectObjAction(
            prviewSelectObj
              .set('editionList', fromJS(repos.data || [defaultEditon]))
              .set('selectEdition', fromJS(repos.data[0] || defaultEditon)),
          ),
        );
        const searchQuestionParams = yield select(makeSearchQuestionParams());
        yield put(
          setSearchQuestionParamsAction(
            searchQuestionParams.set(
              'editionList',
              fromJS(repos.data || []).unshift(
                fromJS({ id: -1, name: '全部' }),
              ),
            ),
          ),
        );
        yield put(getCourseListAction());
        break;
      }
      default:
        yield put(
          setPreviewSelectObjAction(
            prviewSelectObj
              .set('editionList', fromJS([defaultEditon]))
              .set('selectEdition', fromJS(defaultEditon)),
          ),
        );
        message.warning(repos.message || '获取版本列表失败');
        break;
    }
  } catch (err) {
    message.warning('执行错误导致获取版本列表异常');
    console.log('show err', err);
  }
}

export function* getCourseList() {
  let prviewSelectObj = yield select(makePrviewSelectObj());
  yield put(setPreviewSelectObjAction(prviewSelectObj.set('treeDataIsLoading', true)));
  const AIHomeworkParams = yield select(makeAIHomeworkParams());
  // const requestURL = `${Config.trlink}/api/courseSystem`;
  const gradeId = prviewSelectObj.getIn(['selectGrade', 'id']) || -1;
  const subjectId = prviewSelectObj.getIn(['selectSubject', 'id']) || -1;
  const editionId = prviewSelectObj.getIn(['selectEdition', 'id']) || -1;
  if (gradeId < 0) return;
  const params = { gradeId, subjectId, editionId };
  let selectKnowledge = { id: -1, name: '未找到课程体系', level: 0 };
  try {
    const repos = yield courseSystemApi.getClassType(params);
    prviewSelectObj = yield select(makePrviewSelectObj());
    switch (toString(repos.code)) {
      case '0':
        if (repos.data && repos.data.length > 0) {
          const defaultSelect = yield backDefaultKnowledge(repos.data) ||
            selectKnowledge;
          selectKnowledge = {
            id: defaultSelect.id,
            name: defaultSelect.name,
            level: defaultSelect.level,
            path: getTreePath(fromJS(repos.data || []), [0, 0, 0, 0]),
          };
          const path = yield pathFinish(
            backPath(repos.data || [selectKnowledge]),
          );
          // console.log(path, 'path - getCourseList');
          const searchQuestionParams = yield select(makeSearchQuestionParams());
          yield put(
            setSearchQuestionParamsAction(
              searchQuestionParams.set('selectCourseSystemPath', fromJS(path)),
            ),
          );
          const createHomeworkStepParams = yield select(
            makeCreateHomeworkStepParams(),
          );
          // yield put(setCreateHomeworkStepParamsAction(createHomeworkStepParams.set('homeworkName', fromJS({ knowledge: selectKnowledge.name, diff: '基础' }))));
          yield put(
            setCreateHomeworkStepParamsAction(
              createHomeworkStepParams.set(
                'homeworkName',
                `${selectKnowledge.name}--${createHomeworkStepParams.getIn([
                  'homeworkDiff',
                  'name',
                ])}`,
              ),
            ),
          );
          yield put(
            setAIHWParamsAction(
              AIHomeworkParams.set(
                'homeworkName',
                `${selectKnowledge.name}--${AIHomeworkParams.getIn([
                  'homeworkDiff',
                  'name',
                ])}`,
              ).set(
                'selectCourseSystem',
                fromJS({
                  id: selectKnowledge.id,
                  name: selectKnowledge.name,
                  level: selectKnowledge.level,
                }),
              ),
            ),
          );
        }
        yield put(
          setPreviewSelectObjAction(
            prviewSelectObj
              .set('treeList', fromJS(repos.data || []))
              .set('selectTree', fromJS(selectKnowledge))
              .set('treeDataIsLoading', false),
          ),
        );
        yield put(getStandhomeworkListAction());
        break;
      default:
        message.warning(repos.message || '获取课程体系失败');
        yield put(
          setPreviewSelectObjAction(
            prviewSelectObj
              .set('treeList', fromJS(repos.data || []))
              .set('selectTree', fromJS(selectKnowledge))
              .set('treeDataIsLoading', false),
          ),
        );
        break;
    }
  } catch (err) {
    yield put(
      setPreviewSelectObjAction(
        prviewSelectObj.set('treeDataIsLoading', false),
      ),
    );
    message.warning('执行错误导致获取课程体系异常');
    console.log('show err', err);
  }
}
export function* getStandhomeworkList() {
  yield put(changePageState('isLoading', true));
  // const requestURL = `${Config.tklink}/api/homework`;
  const prviewSelectObj = yield select(makePrviewSelectObj());
  const serachParams = yield select(makeSerachParams());
  const params = {
    pageIndex: serachParams.get('pageIndex'),
    pageSize: serachParams.get('pageSize'),
    keyword: serachParams.get('keyword'),
    state: serachParams.get('state'),
    type: serachParams.get('type'),
    grade: prviewSelectObj.getIn(['selectGrade', 'name']),
    subject: prviewSelectObj.getIn(['selectSubject', 'name']),
    questionSource: 2,
  };
  params.useDepartment = 2;
  judgeScoolType(serachParams, params);
  try {
    const repos = yield homeworkApi.getHomework(params);
    switch (toString(repos.code)) {
      case '0':
        yield put(changePageState('isLoading', false));
        yield put(
          setPreviewSelectObjAction(
            prviewSelectObj
              .set('standHomeWorkList', fromJS(repos.data.list || []))
              .set('paperTotal', repos.data.total || 0),
          ),
        );
        break;
      default:
        yield put(
          setPreviewSelectObjAction(
            prviewSelectObj.set('standHomeWorkList', fromJS([])),
          ),
        );
        yield put(changePageState('isLoading', false));
        message.warning(repos.message || '获取作业列表失败');
        break;
    }
  } catch (err) {
    yield put(changePageState('isLoading', false));
    message.error('执行错误导致获取作业列表失败');
    console.log('getStandhomeworkList', err);
  }
}
export function* getPhaseSubject(action) {
  // const requestURL = `${Config.trlink}/api/phaseSubject`;
  const prviewSelectObj = yield select(makePrviewSelectObj());
  // const homeworkType = yield select(makeHomeworkType());
  const selectGrade = prviewSelectObj.get('selectGrade');
  const selectSubject = prviewSelectObj.get('selectSubject');
  let selectPhaseSubject = fromJS({ id: -1, name: '未获取到学段列表' });
  try {
    const repos = yield phaseSubjectApi.findAllPhaseSubject();
    // console.log(repos, 'getPhaseSubject');
    switch (repos.code.toString()) {
      case '0': {
        console.log(selectGrade.toJS(), 'selectGrade');
        if (repos.data && repos.data.length > 0) {
          selectPhaseSubject =
            repos.data.find(item => {
              if (
                item.phaseId === backPhaseId(selectGrade.get('id')) &&
                item.subjectId === selectSubject.get('id')
              ) {
                return item;
              }
              return null;
            }) || repos.data[0];
        }
        const searchQuestionParams = yield select(makeSearchQuestionParams());
        yield put(
          setSearchQuestionParamsAction(
            searchQuestionParams
              .set(
                'phaseSubjectList',
                fromJS(repos.data || [selectPhaseSubject]),
              )
              .set('selectPhaseSubject', fromJS(selectPhaseSubject)),
          ),
        );
        yield put(getKnowledgeListAction(action.getType));
        yield put(getAllGradeListAction());
        if (action.getType === 2) {
          yield put(getKnowledgeListByCsidAction());
        }
        break;
      }
      default:
        message.warning(repos.message || '获取学段列表失败');
        break;
    }
  } catch (err) {
    message.warning('执行错误导致获取学段列表异常');
    console.log('show err', err);
  }
}
export function* getKnowledgeList(action) {
  // const requestURL = `${Config.trlink}/api/knowledge`;

  let searchQuestionParams = yield select(makeSearchQuestionParams());
  yield put(
    setSearchQuestionParamsAction(
      searchQuestionParams.set('knowledgeListIsLoading', true),
    ),
  );
  const phaseSubjectId =
    searchQuestionParams.getIn(['selectPhaseSubject', 'id']) || -1;
  const selectSubjectId =
    searchQuestionParams.getIn(['selectPhaseSubject', 'subjectId']) || -1;
  // console.log(searchQuestionParams.toJS(), 'searchQuestionParams');
  // console.log(searchQuestionParams.get('selectPhaseSubject').toJS(), 'selectPhaseSubject');
  if (phaseSubjectId < 0 || selectSubjectId < 0) {
    message.warning('请选择正确的学段学科');
    return;
  }
  const params = { phaseSubjectId };
  // const requestURL = pointToUnity(toNumber(selectSubjectId)) ? requestURL2 : requestURL1;
  let selectKnowledge = { id: -1, name: '', idList: [], path: [] };
  try {
    const repos = yield knowledgeApi.findAllByPhaseSubjectIdForTr(params);
    // console.log(repos, 'getKnowledgeList');
    searchQuestionParams = yield select(makeSearchQuestionParams());
    switch (repos.code.toString()) {
      case '0':
        if (repos.data && repos.data.length > 0) {
          const defaultSelect =
            backDefaultKnowledge(repos.data) || selectKnowledge;
          selectKnowledge = {
            id: defaultSelect.id,
            name: defaultSelect.name,
            idList: [toString(defaultSelect.id)].concat(
              backChildren(defaultSelect.children, 'saga'),
            ),
            path: backPath(repos.data || [selectKnowledge]),
          };
        }
        yield put(
          setSearchQuestionParamsAction(
            searchQuestionParams
              .set('knowledgeList', fromJS(repos.data || []))
              .set('selectKnowledge', fromJS(selectKnowledge))
              .set('knowledgeListIsLoading', false),
          ),
        );
        if (action.getType !== 2) {
          yield put(getQuestionTypeListActioin());
          yield put(getQuestionListAction());
        }
        break;
      default:
        yield put(
          setSearchQuestionParamsAction(
            searchQuestionParams
              .set('knowledgeList', fromJS(repos.data || []))
              .set('selectKnowledge', fromJS(selectKnowledge))
              .set('knowledgeListIsLoading', false),
          ),
        );
        message.warning(repos.message || '获取知识点列表失败');
        break;
    }
  } catch (err) {
    yield put(
      setSearchQuestionParamsAction(
        searchQuestionParams.set('knowledgeListIsLoading', false),
      ),
    );
    message.warning('执行错误导致获取知识点列表异常');
    console.log('show err', err);
  }
}
export function* getQuestionTypeList() {
  // console.log('getQuestionTypeList');
  // const requestURL = `${Config.trlink_qb}/api/questionType`;
  const searchQuestionParams = yield select(makeSearchQuestionParams());
  const selectType = { id: -1, name: '全部' };
  try {
    // const repos = yield call(
    //   request,
    //   requestURL,
    //   Object.assign({}, getjsonoptions()),
    // );
    const repos = yield queryNodeApi.queryAllQuestionType();
    switch (toString(repos.code)) {
      case '0': {
        const res = fromJS([selectType].concat(repos.data || []));
        yield put(
          setSearchQuestionParamsAction(
            searchQuestionParams.set('questionTypeList', fromJS(res)),
          ),
        );
        break;
      }
      default:
        message.warning(repos.message || '获取题型列表失败');
        break;
    }
  } catch (err) {
    // err Msg
    console.log(err, 'err');
  }
}
export function* getQuestionList() {
  // console.log('getQuestionList');
  let createHomeworkStepParams = yield select(makeCreateHomeworkStepParams());
  yield put(
    setCreateHomeworkStepParamsAction(
      createHomeworkStepParams
        .set('questionDataList', fromJS([]))
        .set('questionListLoadingOver', false)
        .set('questionTotal', 0),
    ),
  );
  let searchQuestionParams = yield select(makeSearchQuestionParams());
  const searchQuestionParamsJS = searchQuestionParams.toJS();
  const params = {
    knowledgeIds: searchQuestionParams
      .getIn(['selectKnowledge', 'idList'])
      .toJS()
      .join(','),
    pageIndex: searchQuestionParamsJS.pageIndex || 1,
    pageSize: searchQuestionParamsJS.pageSize || 20,
    templateTypes: '1,2,3,4',
    orderByFieldStr: 'quoteCount,updatedTime',
    orderByDirectionStr: `${searchQuestionParamsJS.updatedTime},${
      searchQuestionParamsJS.quoteCount
      }`,
  };
  if (toNumber(searchQuestionParamsJS.selectedGrade.id) >= 0) {
    params.gradeId = searchQuestionParamsJS.selectedGrade.id;
  }
  if (toNumber(searchQuestionParamsJS.year.id) >= 0) {
    params.year = searchQuestionParamsJS.year.name;
  }
  if (toNumber(searchQuestionParamsJS.term.id) >= 0) {
    params.termId = searchQuestionParamsJS.term.id;
  }
  if (toNumber(searchQuestionParamsJS.province.id) >= 0) {
    params.provinceId = searchQuestionParamsJS.province.id;
  }
  if (toNumber(searchQuestionParamsJS.city.id) >= 0) {
    params.cityId = searchQuestionParamsJS.city.id;
  }
  if (toNumber(searchQuestionParamsJS.county.id) >= 0) {
    params.countyId = searchQuestionParamsJS.county.id;
  }
  if (toNumber(searchQuestionParamsJS.examType.id) >= 0) {
    params.examTypeId = searchQuestionParamsJS.examType.id;
  }
  if (toNumber(searchQuestionParamsJS.paperType.id) >= 0) {
    params.examPaperTypeId = searchQuestionParamsJS.paperType.id;
  }
  if (toNumber(searchQuestionParamsJS.questionType.id) >= 0) {
    params.typeId = searchQuestionParamsJS.questionType.id;
  }
  if (toNumber(searchQuestionParamsJS.difficulty.id) >= 0) {
    params.difficulty = searchQuestionParamsJS.difficulty.id;
  }
  if (searchQuestionParamsJS.input) {
    params.keyword = searchQuestionParamsJS.input;
  }
  if (!params.knowledgeIds && !params.examPointIds) {
    yield put(
      setCreateHomeworkStepParamsAction(
        createHomeworkStepParams
          .set('questionDataList', fromJS([]))
          .set('questionListLoadingOver', true)
          .set('questionTotal', 0),
      ),
    );
    return;
  }
  params.excludeInfo = {
    excludeTypeIdList: [50, 51, 52],
  };
  try {
    const repos = yield questionAip.getQuestionWithEncryptForTr(params);
    // const repos = questionData;
    createHomeworkStepParams = yield select(makeCreateHomeworkStepParams());
    switch (toString(repos.code)) {
      case '0': {
        const questionDataList = (repos.data.data || []).map(item => {
          const res = Object.assign({}, item, {
            title: backfromZmStandPrev(item.title || '', 'createHw'),
            optionList: (item.optionList || []).map(iit =>
              backfromZmStandPrev(iit, 'createHw'),
            ),
            answerList: (item.answerList || []).map(iit =>
              backfromZmStandPrev(iit, 'createHw'),
            ),
            analysis: backfromZmStandPrev(item.analysis || '', 'createHw'),
            showAnalysis: false,
          });
          if (item.children && item.children.length > 0) {
            res.showChild = true;
            res.children = item.children.map(it => {
              return Object.assign({}, it, {
                title: backfromZmStandPrev(it.title || '', 'createHw'),
                optionList: (it.optionList || []).map(iit =>
                  backfromZmStandPrev(iit, 'createHw'),
                ),
                answerList: (it.answerList || []).map(iit =>
                  backfromZmStandPrev(iit, 'createHw'),
                ),
                analysis: backfromZmStandPrev(it.analysis || '', 'createHw'),
              });
            });
          }
          return res;
        });
        yield put(
          setCreateHomeworkStepParamsAction(
            createHomeworkStepParams
              .set('questionDataList', fromJS(questionDataList))
              .set('questionListLoadingOver', true)
              .set('showStepOneAnalyze', false)
              .set('questionTotal', repos.data.total || 0),
          ),
        );
        break;
      }
      case '7':
        yield put(
          setCreateHomeworkStepParamsAction(
            createHomeworkStepParams
              .set('questionDataList', fromJS([]))
              .set('questionListLoadingOver', true)
              .set('questionTotal', 0),
          ),
        );
        searchQuestionParams = yield select(makeSearchQuestionParams());
        yield put(
          setSearchQuestionParamsAction(
            searchQuestionParams.set('pageIndex', 1),
          ),
        );
        break;
      default:
        yield put(
          setCreateHomeworkStepParamsAction(
            createHomeworkStepParams
              .set('questionDataList', fromJS([]))
              .set('questionListLoadingOver', true)
              .set('questionTotal', 0),
          ),
        );
        searchQuestionParams = yield select(makeSearchQuestionParams());
        yield put(
          setSearchQuestionParamsAction(
            searchQuestionParams.set('pageIndex', 1),
          ),
        );
        message.warning(repos.message || '获取试题列表失败');
        break;
    }
  } catch (err) {
    // err Msg
    console.log(err, 'err');
    yield put(
      setCreateHomeworkStepParamsAction(
        createHomeworkStepParams
          .set('questionDataList', fromJS([]))
          .set('questionListLoadingOver', true)
          .set('questionTotal', 0),
      ),
    );
    searchQuestionParams = yield select(makeSearchQuestionParams());
    yield put(
      setSearchQuestionParamsAction(searchQuestionParams.set('pageIndex', 1)),
    );
  }
}
export function* saveStandHomework() {
  yield put(changeBtnCanClickAction(false));
  // const requestURL = `${Config.zchlink}/api/homework`;
  const prviewSelectObj = yield select(makePrviewSelectObj());
  const selectGrade = prviewSelectObj.get('selectGrade').toJS();
  const selectSubject = prviewSelectObj.get('selectSubject').toJS();
  const createHomeworkStepParams = yield select(makeCreateHomeworkStepParams());
  // console.log('标准作业', createHomeworkStepParams.toJS());
  const homeworkName = createHomeworkStepParams.get('homeworkName');
  const homeworkSkep = createHomeworkStepParams.get('homeworkSkep').toJS();
  const homeworkDiff = (
    createHomeworkStepParams.get('homeworkDiff') || fromJS({})
  ).toJS();

  const previewHomework = yield select(makePreviewHomework());
  const paperId = previewHomework.get('homeworkId');
  {
    const errList = [];
    homeworkSkep.forEach((item, index) => {
      if (item.score <= 0 || !isNumber(item.score)) {
        errList.push({
          type: 'scoreErr',
          value: '请设置分数在0.5-99之间',
          index,
        });
      }
      if (item.id <= 0 || !isNumber(item.id)) {
        errList.push({
          type: 'questionIdErr',
          value: '题目id可能丢失，建议更换一道题目',
          index,
        });
      }
    });
    if (homeworkDiff.id < 0) {
      errList.push({
        type: 'homeworkDiffErr',
        value: '请选择作业难度',
        index: -1,
      });
    }
  }

  const params = {
    children: homeworkSkep.map(item => {
      const res = { questionId: item.id, score: item.score, questionSource: 2 };
      const children = item.children;
      if (children && children.length > 0) {
        res.children = children.map(it => {
          return { subQuestionId: it.id, score: it.score };
        });
      }
      return res;
    }),
    grade: selectGrade.name,
    name: homeworkName,
    questionAmount: homeworkSkep.length,
    subject: selectSubject.name,
    totalScore: (homeworkSkep.map(it => it.score) || fromJS([])).reduce(
      (a, b) => a + b,
    ),
    questionSource: 2,
  };
  judgeScoolType(createHomeworkStepParams, params);
  params.useDepartment = 2;
  params.grade = createHomeworkStepParams.getIn(['saveGrade', 'name']);
  params.subject = createHomeworkStepParams.getIn(['saveSubject', 'name']);
  let ajaxWay = homeworkApi.createHomework;
  if (isReEdit) {
    params.id = paperId;
    params.csId = reEditHomework.csId;
    ajaxWay = homeworkApi.editHomework;
  }
  // console.log(previewHomework.toJS(), 'previewHomework');
  console.log(homeworkSkep, params, 'params - params');
  yield put(setAlertStatesAction(fromJS({ title: '正在保存作业...' })));
  yield put(changeAlertShowOrHideAction(true));
  try {
    // const repos = yield call(
    //   request,
    //   requestURL,
    //   Object.assign({}, ajaxWay(), { body: JSON.stringify(params) }),
    // );
    const repos = yield ajaxWay(params);
    // const repos = { code: '0' };
    switch (toString(repos.code)) {
      case '1':
        yield put(initDataWhenCloseAction());
        yield put(getStandhomeworkListAction());
        const ref = Modal.success({
          title: '发布作业',
          content: <div>发布成功</div>,
          width: 300,
          zIndex: 1001,
          onCancel: () => ref.destroy(),
        });
        setTimeout(() => clearTimeout(ref), 1500);
        break;
      default:
        message.warning(repos.message || '发布失败');
        break;
    }
    yield put(setAlertStatesAction(fromJS({})));
    yield put(changeAlertShowOrHideAction(false));
    yield put(changeBtnCanClickAction(true));
  } catch (err) {
    yield put(setAlertStatesAction(fromJS({})));
    yield put(changeAlertShowOrHideAction(false));
    yield put(changeBtnCanClickAction(true));
    message.error('执行错误导致保存失败');
    console.log('saveStandHomework', err);
  }
}
/**
 * 获取预览作业
 */
export function* getPreviewHomeworkData() {
  let previewHomework = yield select(makePreviewHomework());
  const id = previewHomework.get('homeworkId');
  if (id <= 0) {
    message.error('获取试卷失败，请刷新后再次尝试');
    return;
  }
  yield put(setAlertStatesAction(fromJS({ title: '正在获取数据...' })));
  yield put(changeAlertShowOrHideAction(true));
  try {
    const repos = yield homeworkApi.getHomeworkItemById(id);
    // console.log(repos, 'getPreviewHomeworkData');
    previewHomework = yield select(makePreviewHomework());
    switch (toString(repos.code)) {
      case '0':
        repos.data.children = repos.data.homeworkQuestionDTOList.map(item => {
          const questionOutputDTO = item.questionOutputDTO;
          const newItem = Object.assign({}, item, {
            questionOutputDTO: Object.assign({}, questionOutputDTO, {
              title: backfromZmStandPrev(questionOutputDTO.title, 'createHw'),
              analysis: backfromZmStandPrev(
                questionOutputDTO.analysis,
                'createHw',
              ),
              optionList: (questionOutputDTO.optionList || [])
                .map(it => backfromZmStandPrev(it, 'createHw'))
                .filter(it => filterHtmlForm(it)),
              answerList: (questionOutputDTO.answerList || []).map(it =>
                backfromZmStandPrev(it, 'createHw'),
              ),
            }),
          });
          const children = questionOutputDTO.children;
          if (children && children.length > 0) {
            newItem.questionOutputDTO.children = children.map(it => {
              return Object.assign(
                {},
                {
                  title: backfromZmStandPrev(it.title, 'createHw'),
                  analysis: backfromZmStandPrev(it.analysis, 'createHw'),
                  optionList: (it.optionList || [])
                    .map(itt => backfromZmStandPrev(itt, 'createHw'))
                    .filter(itt => filterHtmlForm(itt)),
                  answerList: (it.answerList || []).map(itt =>
                    backfromZmStandPrev(itt, 'createHw'),
                  ),
                },
              );
            });
          }
          return newItem;
        });
        // console.log(repos.data.children, 'children');
        yield put(
          setPreviewHomeworkDataListAction(
            previewHomework
              .set('homeworkDataList', fromJS(repos.data || {}))
              .set('isOpen', true),
          ),
        );
        break;
      default:
        message.warning('系统异常导致获取作业预览失败');
        break;
    }
    yield put(setAlertStatesAction(fromJS({})));
    yield put(changeAlertShowOrHideAction(false));
  } catch (err) {
    yield put(setAlertStatesAction(fromJS({})));
    yield put(changeAlertShowOrHideAction(false));
    message.error('执行错误导致获取作业预览失败');
    console.log('getPreviewHomeworkData', err);
  }
}
export function* editorHomework() {
  const previewHomework = yield select(makePreviewHomework());
  yield put(
    setPreviewHomeworkDataListAction(previewHomework.set('isOpen', false)),
  );
  const id = previewHomework.get('homeworkId');
  if (id <= 0) {
    message.error('获取试卷失败，请刷新后再次尝试');
    return;
  }
  // const requestURL = `${Config.tklink}/api/homework/${id}`;
  yield put(setAlertStatesAction(fromJS({ title: '正在获取数据...' })));
  yield put(changeAlertShowOrHideAction(true));
  try {
    const repos = yield homeworkApi.getHomeworkItemById(id);
    // previewHomework = yield select(makePreviewHomework());
    const searchQuestionParams = yield select(makeSearchQuestionParams());
    const createHomeworkStepParams = yield select(
      makeCreateHomeworkStepParams(),
    );
    switch (toString(repos.code)) {
      case '0': {
        repos.data.children = repos.data.homeworkQuestionDTOList || [];
        // console.log(repos, 'editorHomework');
        const homeworkSkep = yield repos.data.children.map(item => {
          return Object.assign({}, item.questionOutputDTO, {
            questionSource: item.questionSource,
            questionId: item.questionId,
            score: item.score || 3,
          });
        });
        // console.log(homeworkSkep, 'homeworkSkep');
        const newHomeworkSkep = yield homeworkSkep.map(item => {
          const children = item.children;
          const newItem = Object.assign(item, {
            title: backfromZmStandPrev(item.title, 'createHw'),
            analysis: backfromZmStandPrev(item.analysis, 'createHw'),
            optionList: (item.optionList || [])
              .map(it => backfromZmStandPrev(it, 'createHw'))
              .filter(it => filterHtmlForm(it)),
            answerList: (item.answerList || []).map(it =>
              backfromZmStandPrev(it, 'createHw'),
            ),
          });
          if (children && children.length > 0) {
            let itemScore = 0;
            newItem.children = children.map(it => {
              const itScore = it.score || 3;
              itemScore += itScore;
              return Object.assign(
                {},
                {
                  title: backfromZmStandPrev(it.title, 'createHw'),
                  analysis: backfromZmStandPrev(it.analysis, 'createHw'),
                  optionList: (it.optionList || [])
                    .map(itt => backfromZmStandPrev(itt, 'createHw'))
                    .filter(itt => filterHtmlForm(itt)),
                  answerList: (it.answerList || []).map(itt =>
                    backfromZmStandPrev(itt, 'createHw'),
                  ),
                  id: it.id,
                  score: itScore,
                },
              );
            });
            newItem.score = itemScore;
          }
          return newItem;
        });
        // console.log(newHomeworkSkep, 'newHomeworkSkep');
        const homeworkDiffList = createHomeworkStepParams.get(
          'homeworkDiffList',
        );
        const homeworkName = repos.data.name || '';
        const newCreateHomeworkStepParams = yield createHomeworkStepParams
          .set('homeworkSkep', fromJS(newHomeworkSkep))
          .set('homeworkStep', 2)
          // .set('homeworkName', fromJS({ knowledge: homeworkName.slice(0, -4), diff: homeworkName.slice(-2) }))
          .set('homeworkName', homeworkName)
          .set(
            'homeworkDiff',
            homeworkDiffList.find(it => repos.data.diff === it.get('id')),
          );
        // console.log(newCreateHomeworkStepParams.toJS(), 'newCreateHomeworkStepParams');
        yield put(
          setCreateHomeworkStepParamsAction(newCreateHomeworkStepParams),
        );
        yield put(
          setSearchQuestionParamsAction(
            searchQuestionParams.set('showCreateHomeworkModal', true),
          ),
        );
        break;
      }
      default:
        message.warning('系统异常导致获取作业预览失败');
        break;
    }
    yield put(setAlertStatesAction(fromJS({})));
    yield put(changeAlertShowOrHideAction(false));
  } catch (err) {
    yield put(setAlertStatesAction(fromJS({})));
    yield put(changeAlertShowOrHideAction(false));
    message.error('执行错误导致获取作业预览失败');
    console.log('getPreviewHomeworkData', err);
  }
}
export function* getAllGradeList() {
  // const requestURL = `${Config.trlink}/api/grade`;
  try {
    const repos = yield gradeApi.getGrade();
    switch (repos.code.toString()) {
      case '0': {
        const allGradeList = fromJS(repos.data || []);
        yield put(setAllGradeListAction(fromJS(repos.data || [])));
        const searchQuestionParams = yield select(makeSearchQuestionParams());
        const selectPhaseSubject = searchQuestionParams.get(
          'selectPhaseSubject',
        );
        const newGradeList = homeworkGradeList(
          allGradeList,
          selectPhaseSubject,
        );
        yield put(
          setSearchQuestionParamsAction(
            searchQuestionParams.set('gradeList', newGradeList),
          ),
        );
        break;
      }
      default:
        yield put(setAllGradeListAction(fromJS([])));
        message.warning(repos.message || '获取年级列表失败');
        break;
    }
  } catch (err) {
    message.warning('执行错误导致获取年级列表异常');
  }
}

/** 删除作业 */
function* deleteHomework() {
  const homeworkPaperMsg = yield select(makePreviewHomework());
  const id = homeworkPaperMsg.get('homeworkId');
  if (!id || id === -1) return;
  // const requestURL = `${Config.tklink}/api/homework/${id}`;
  try {
    const repos = yield homeworkApi.deleteQuestion(id);
    switch (repos.code.toString()) {
      case '0':
        message.success('删除作业成功');
        yield put(initDataWhenCloseAction());
        yield put(getStandhomeworkListAction());
        break;
      default:
        message.error('删除作业失败');
        break;
    }
  } catch (err) {
    // err Msg
    message.warning('删除失败');
  }
}
// AI作业获取选中的课程体系对应的知识点
function* getKnowledgeListByCsId() {
  const prviewSelectObj = yield select(makePrviewSelectObj());
  const csId = prviewSelectObj.getIn(['selectTree', 'id']) || -1;
  if (csId <= 0) return;
  const requestURL = `${
    Config.trlink
    }/api/courseSystem/findKnowledgeListByCsId`;
  try {
    const repos = yield call(
      request,
      requestURL,
      Object.assign({}, getjsonoptions()),
      { csId },
    );
    switch (toString(repos.code)) {
      case '0':
        yield put(
          setAIHWParamsItemAction('AIknowledgeList', fromJS(repos.data || [])),
        );
        yield put(getQuestionType4AiHwAction());
        break;
      default:
        break;
    }
  } catch (err) {
    console.log(err, 'getKnowledgeListByCsIdSaga');
  }
}
// 获取AI作业中题型
function* getQuestionType4AiHw() {
  // const requestURL = `${Config.trlink_qb}/api/question/action/findQuestionType4AiHw`;
  const searchQuestionParams = yield select(makeSearchQuestionParams());
  const AIHomeworkParams = yield select(makeAIHomeworkParams());
  const phaseSubjectId =
    searchQuestionParams.getIn(['selectPhaseSubject', 'id']) || -1;
  const params = {
    difficultyList: getDifficultyList(AIHomeworkParams.get('difficulty')),
    knowledgeIdList: AIHomeworkParams.get('AIknowledgeList')
      .map(item => item.get('id'))
      .toJS(),
    phaseSubjectId,
    investigateScope: AIHomeworkParams.get('investigateScope'),
  };
  // console.log(searchQuestionParams.get('phaseSubjectList').toJS(), 'searchQuestionParams');
  if (AIHomeworkParams.get('termId') > 0) {
    params.termId = AIHomeworkParams.get('termId');
  }
  if (AIHomeworkParams.get('gradeId') > 0) {
    params.gradeId = AIHomeworkParams.get('gradeId');
  }
  try {
    const repos = yield questionAip.findQuestionType4AiHw(params);
    // console.log(repos, 'getQuestionType4AiHw');
    switch (toString(repos.code)) {
      case '0':
        const data = repos.data || [];
        // const activeCount = data.length >= 3 ? 3 : data.length;
        const subjectId = searchQuestionParams.getIn([
          'selectPhaseSubject',
          'subjectId',
        ]);
        yield put(
          setAIHWParamsAction(
            AIHomeworkParams.set(
              'questionTypeList',
              fromJS(data || []).map(item => {
                const questionCount = item.get('questionAmount') || 0;
                let newItem = item.set('questionCount', questionCount);
                if (subjectId === 1) {
                  switch (item.get('name')) {
                    case '选择题':
                      newItem = newItem
                        .set(
                          'questionAmount',
                          questionCount >= 6 ? 6 : questionCount,
                        )
                        .set('isActive', true);
                      break;
                    case '填空题':
                      newItem = newItem
                        .set(
                          'questionAmount',
                          questionCount >= 2 ? 2 : questionCount,
                        )
                        .set('isActive', true);
                      break;
                    case '阅读题':
                      newItem = newItem
                        .set(
                          'questionAmount',
                          questionCount >= 1 ? 1 : questionCount,
                        )
                        .set('isActive', true);
                      break;
                    case '写作题':
                      newItem = newItem
                        .set(
                          'questionAmount',
                          questionCount >= 1 ? 1 : questionCount,
                        )
                        .set('isActive', true);
                      break;
                    default:
                      newItem = newItem
                        .set('questionAmount', 0)
                        .set('isActive', false);
                      break;
                  }
                } else {
                  switch (item.get('name')) {
                    case '选择题':
                      newItem = newItem
                        .set(
                          'questionAmount',
                          questionCount >= 10 ? 10 : questionCount,
                        )
                        .set('isActive', true);
                      break;
                    case '填空题':
                      newItem = newItem
                        .set('questionAmount', 0)
                        .set('isActive', true);
                      break;
                    case '解答题':
                      newItem = newItem
                        .set('questionAmount', 0)
                        .set('isActive', true);
                      break;
                    default:
                      newItem = newItem
                        .set('questionAmount', 0)
                        .set('isActive', false);
                      break;
                  }
                }
                return newItem;
              }),
            ),
          ),
        );
        break;
      default:
        break;
    }
  } catch (err) {
    console.log(err, 'getQuestionType4AiHw');
  }
}
function* getQuestion4AIHW() {
  // const requestURL = `${Config.trlink_qb}/api/question/action/findQuestion4AiHw`;
  const searchQuestionParams = yield select(makeSearchQuestionParams());
  yield put(setAIHWParamsItemAction('isGettingAIHWQuestionList', true));
  const AIHomeworkParams = yield select(makeAIHomeworkParams());
  const phaseSubjectId =
    searchQuestionParams.getIn(['selectPhaseSubject', 'id']) || -1;
  // console.log(AIHomeworkParams.toJS(), AIHomeworkParams.get('AIknowledgeList').map(item => item.get('id')).toJS(), 'AIHomeworkParams - ');
  const params = {
    difficultyList: getDifficultyList(AIHomeworkParams.get('difficulty')),
    // gradeId: AIHomeworkParams.get('gradeId') || null,
    itemDTOList: AIHomeworkParams.get('questionTypeList')
      .filter(item => item.get('isActive') && item.get('questionAmount') > 0)
      .map(item => ({
        id: item.get('id'),
        questionAmount: item.get('questionAmount'),
      }))
      .toJS(),
    knowledgeIdList: AIHomeworkParams.get('AIknowledgeList')
      .map(item => item.get('id'))
      .toJS(),
    phaseSubjectId,
    investigateScope: AIHomeworkParams.get('investigateScope'),
    // termId: AIHomeworkParams.get('termId') || null,
    templateTypes: '1,2,3,4',
  };
  if (AIHomeworkParams.get('termId') > 0) {
    params.termId = AIHomeworkParams.get('termId');
  }
  if (AIHomeworkParams.get('gradeId') > 0) {
    params.gradeId = AIHomeworkParams.get('gradeId');
  }
  // console.log(JSON.stringify(params), 'params');
  try {
    const repos = yield questionAip.findQuestion4AiHw(params);
    // const repos = questionData;
    console.log(repos, 'getQuestion4AIHW');
    const data = repos.data || fromJS([]);
    switch (toString(repos.code)) {
      case '0':
        // yield put(setAIHWParamsItemAction('AIHWQuestionList', fromJS(repos.data || [])));
        yield put(
          setAIHWParamsAction(
            AIHomeworkParams.set(
              'AIHWQuestionList',
              fromJS(data)
                .sortBy(item => item.get('parentTypeId'))
                .map(item =>
                  item.set('showTools', false).set('showAnalysis', false),
                ),
            )
              .set('state', 2)
              .set('isGettingAIHWQuestionList', false),
          ),
        );
        break;
      default:
        break;
    }
  } catch (err) {
    console.log(err, 'getQuestion4AIHW');
  }
}
export function* saveAIHomework() {
  yield put(changeBtnCanClickAction(false));
  // const requestURL = `${Config.tklink}/api/homework`;
  const AIHomeworkParams = yield select(makeAIHomeworkParams());
  console.log('saveAIHomework', AIHomeworkParams.toJS());
  if (AIHomeworkParams.getIn(['selectCourseSystem', 'id', 'level']) < 4) {
    message.warning('请选择正确的的课程内容');
    return;
  }
  // const knowledgeList = searchQuestionParams.get('knowledgeList');
  const homeworkSkep = AIHomeworkParams.get('AIHWQuestionList').toJS();
  const params = {
    children: homeworkSkep.map(item => {
      const res = { questionId: item.id, score: item.score, questionSource: 2 };
      const children = item.children;
      if (children && children.length > 0) {
        res.children = children.map(it => {
          return { subQuestionId: it.id, score: it.score || 3 };
        });
      }
      return res;
    }),
    csId: AIHomeworkParams.getIn(['selectCourseSystem', 'id']),
    diff: AIHomeworkParams.get('difficulty'),
    grade: AIHomeworkParams.get('grade'),
    name: AIHomeworkParams.get('homeworkName'),
    questionAmount: homeworkSkep.length,
    subject: AIHomeworkParams.get('subject'),
    totalScore: homeworkSkep.map(it => it.score || 3).reduce((a, b) => a + b),
    questionSource: 2,
  };
  console.log(params, 'params');
  try {
    const repos = yield homeworkApi.saveHomeWOrk(params);
    // const repos = { code: '0' };
    switch (toString(repos.code)) {
      case '1':
        yield put(initDataWhenCloseAction());
        yield put(getStandhomeworkListAction());
        const ref = Modal.success({
          title: '发布作业',
          content: <div>发布成功</div>,
          width: 300,
          zIndex: 1001,
          onCancel: () => ref.destroy(),
        });
        setTimeout(() => clearTimeout(ref), 1500);
        break;
      default:
        message.warning(repos.message || '发布失败');
        break;
    }
  } catch (err) {
    message.warning('发布失败，意外错误');
    console.log('saveStandHomework', err);
  }
}
const backDifficutyType = difficulty => {
  let res = [];
  if ([1, 2].includes(difficulty)) {
    res = [1, 2];
  } else if (difficulty === 3) {
    res = [3];
  } else if ([4, 5].includes(difficulty)) {
    res = [4, 5];
  }
  return res;
};
export function* getChangeItemDataList(action) {
  // const requestURL = `${Config.trlink_qb}/api/question/action/findQuestion4AiHw`;
  yield put(setAIHWParamsItemAction('isLoadingChangeItem', true));
  const AIHomeworkParams = yield select(makeAIHomeworkParams());
  const createHomeworkStepParams = yield select(makeCreateHomeworkStepParams());
  const searchQuestionParams = yield select(makeSearchQuestionParams());
  const phaseSubjectList =
    searchQuestionParams.get('phaseSubjectList') || fromJS([]);
  const isCustomHw = action.AItype === 1;
  const homeworkParams = isCustomHw
    ? createHomeworkStepParams
    : AIHomeworkParams;
  const setParams = isCustomHw
    ? setCreateHomeworkStepParamsAction
    : setAIHWParamsAction;
  const questionTarget = homeworkParams.get('AIChangeQuestionTarget').toJS();
  if (!(questionTarget.id > 0)) return;
  const params = {
    difficultyList: backDifficutyType(
      questionTarget.difficulty || AIHomeworkParams.get('difficulty'),
    ),
    itemDTOList: [{ id: questionTarget.parentTypeId, questionAmount: 11 }],
    knowledgeIdList: questionTarget.knowledgeIdList,
    phaseSubjectId: (
      phaseSubjectList.find(
        item => item.get('subjectId') === questionTarget.subjectId,
      ) || fromJS({ id: null })
    ).get('id'),
    investigateScope: AIHomeworkParams.get('investigateScope'),
    templateTypes: '1,2,3,4',
  };
  if (questionTarget.termId > 0) params.termId = questionTarget.termId;
  if (questionTarget.gradeId > 0) params.gradeId = questionTarget.gradeId;
  if (!questionTarget.id) return;
  try {
    const repos = yield questionAip.findQuestion4AiHw(params);
    // const repos = questionData;
    console.log(repos, 'getChangeItemDataList');
    const data = fromJS(repos.data || [])
      .filter(item => item.get('id') !== questionTarget.id)
      .slice(0, 10);
    switch (toString(repos.code)) {
      case '0':
        yield put(
          setParams(
            homeworkParams
              .set(
                'AIChangeQuestionList',
                fromJS(data || []).map(item =>
                  item.set('showTools', false).set('showAnalysis', true),
                ),
              )
              .set('isLoadingChangeItem', false),
          ),
        );
        break;
      default:
        yield put(
          setParams(
            homeworkParams
              .set('AIChangeQuestionList', fromJS([]))
              .set('isLoadingChangeItem', false),
          ),
        );
        break;
    }
  } catch (err) {
    console.log(err, 'getChangeItemDataList');
    yield put(
      setParams(
        homeworkParams
          .set('AIChangeQuestionList', fromJS([]))
          .set('isLoadingChangeItem', false),
      ),
    );
  }
}

export function* getGradeListSaga() {
  const watcher = yield takeLatest(GET_GRADE_LIST_ACTION, getGradeList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getSudjectListSaga() {
  const watcher = yield takeLatest(GET_SUBJECT_LIST_ACTION, getSudjectList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getEditionListSaga() {
  const watcher = yield takeLatest(GET_EDITION_LIST_ACTION, getEditionList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getCourseListSaga() {
  const watcher = yield takeLatest(GET_COURSE_LIST_ACTION, getCourseList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getPhaseSubjectSaga() {
  const watcher = yield takeLatest(GET_PHASE_SUBJECT_ACTION, getPhaseSubject);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getKnowledgeListSaga() {
  const watcher = yield takeLatest(
    GET_KNOWLEDEGE_LIST_ACTION,
    getKnowledgeList,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getQuestionTypeListSaga() {
  const watcher = yield takeLatest(
    GET_QUESTION_TYPE_LIST_ACTION,
    getQuestionTypeList,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getQuestionListSaga() {
  const watcher = yield takeLatest(GET_QUESTION_LIST_ACTION, getQuestionList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* saveStandHomeworkSaga() {
  const watcher = yield takeLatest(
    SAVE_STAND_HOMEWORK_ACTION,
    saveStandHomework,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getStandhomeworkListSaga() {
  const watcher = yield takeLatest(
    GET_STAND_HOMEWORK_LIST_ACTION,
    getStandhomeworkList,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getPreviewHomeworkDataSaga() {
  const watcher = yield takeLatest(
    GET_PREVIEW_HOMEWORK_DATA_LIST_ACTION,
    getPreviewHomeworkData,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* editorHomeworkSaga() {
  const watcher = yield takeLatest(EDIT_HOMEWORK_ACTION, editorHomework);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getAllGradeListSaga() {
  const watcher = yield takeLatest(GET_ALL_GRADE_LIST_ACTION, getAllGradeList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

/**  */
export function* watchDeleteHomeworkActionSaga() {
  const watcher = yield takeLatest(DELETE_HOMEWORK_ACTION, deleteHomework);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// 智能作业
export function* getKnowledgeListByCsIdSaga() {
  const watcher = yield takeLatest(
    GET_KNOWLEDGELIST_BY_CSID_ACTION,
    getKnowledgeListByCsId,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getQuestionType4AiHwSaga() {
  const watcher = yield takeLatest(
    GET_QUESTION_TYPE_FOR_AIHW_ACTION,
    getQuestionType4AiHw,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getQuestion4AIHWSaga() {
  const watcher = yield takeLatest(
    GET_QUESTION_FOR_AIHW_ACTION,
    getQuestion4AIHW,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* saveAIHomeworkSaga() {
  const watcher = yield takeLatest(SAVE_AI_HOMEWORK_ACTION, saveAIHomework);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getChangeItemDataListSaga() {
  const watcher = yield takeLatest(
    GET_CHANGE_ITEMDATALIST_ACTION,
    getChangeItemDataList,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded
export default [
  // defaultSaga,
  getGradeListSaga,
  getSudjectListSaga,
  getEditionListSaga,
  getCourseListSaga,
  getPhaseSubjectSaga,
  getKnowledgeListSaga,
  getQuestionTypeListSaga,
  getQuestionListSaga,
  saveStandHomeworkSaga,
  getStandhomeworkListSaga,
  getPreviewHomeworkDataSaga,
  editorHomeworkSaga,
  getAllGradeListSaga,
  watchDeleteHomeworkActionSaga,
  getKnowledgeListByCsIdSaga,
  getQuestionType4AiHwSaga,
  getQuestion4AIHWSaga,
  saveAIHomeworkSaga,
  getChangeItemDataListSaga,
];
