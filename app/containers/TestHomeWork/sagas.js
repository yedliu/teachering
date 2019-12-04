import {
  take,
  // call,
  put,
  select,
  cancel,
  takeLatest,
} from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
// import request, { getjsonoptions } from 'utils/request';
// import Config from 'utils/config';
import { fromJS } from 'immutable';
import { message } from 'antd';
import {
  toNumber,
  toString,
  backfromZmStandPrev,
  filterHtmlForm,
} from 'components/CommonFn';
import {
  changeAlertShowOrHideAction,
  setAlertStatesAction as setGlobalAlertStatesAction,
} from 'containers/LeftNavC/actions';
// import { questionsData } from './mockquestion';
import {
  backDefaultKnowledge,
  backPath,
  // pathFinish,
} from 'containers/StandHomeWork/common';
import { backChildren } from 'containers/StandHomeWork/TreeRender';
import questionApi from '../../api/qb-cloud/question-endpoint';
import knowledgeApi from 'api/tr-cloud/knowledge-endpoint';
import testHwApi from 'api/hw-cloud/test-lesson-homework-endpoint';
import editionApi from 'api/tr-cloud/edition-endpoint';
import gradeApi from 'api/tr-cloud/grade-endpoint';
import phaseSubjectApi from 'api/tr-cloud/phase-subject-endpoint';
import subjectApi from 'api/tr-cloud/subject-endpoint';
import phaseApi from 'api/tr-cloud/phase-endpoint';
import testLessonKnowledgeApi from 'api/tr-cloud/test-lesson-knowledge-endpoint';
import queryNodeApi from 'api/qb-cloud/sys-dict-end-point';

import {
  GET_PHASE_LIST_ACTION,
  GET_GRADE_LIST_ACTION,
  GET_SUBJECT_LIST_ACTION,
  CHANGE_SELECTED_PHASE_ACTION,
  CHANGE_SELECTED_GRADE_ACTION,
  GET_TEST_LESSON_KNOWLEDGE_ACTION,
  CHANGE_SELECT_KNOWLEDGE_ITEM_ACTION,
  CHANGE_SELECTED_SUBJECT_ACTION,
  GET_HOMEWORK_SUBJECT_DARA_ACTION,
  // CHANGE_SELECTED_HOMEWORK_SUBJECT_ITEM_ACTION,
  CHANGE_SELECTED_TREE_NODE_ACTION,
  GET_QUESTION_TYPE_LIST_ACTION,
  GET_VERSION_LIST_ACTION,
  CHANGE_SELECTED_VERSION_ACTION,
  GET_KNOWLWDGE_TREE_DATA_ACTION,
  CHANGE_SELECTED_GRADE_DATA_ACTION,
  SEARCH_QUESTION_LIST_ACTION,
  SUBMIT_TEST_HOMEWOK_ONE_ACTION,
  EDITOR_HOMEWORK_ACTION,
  PREVIEW_HOMEWORK_ITEM_ACTION,
  CHANGE_TEST_HOMEWORK_TYPE_ACTION,
  GET_TEST_HOMEWORK_ACTION,
  DELETE_HOMEWORK_ACTION,
} from './constants';
import {
  setPhaseListAction,
  setGradeListAction,
  setSubjectListAction,
  changeSelectedPhaseAction,
  changeSelectedGradeAction,
  changeSelectedSubjectAction,
  setTestLessonKnowledgeAction,
  changeSelectKnowledgeItemAction,
  setHomeworkMsgListAction,
  setHomeWorkSubujectListAction,
  changeSelectedHomeworkSubjectItemAction,
  setKnowledgeTreeDataAction,
  changeSelectedTreeNodeAction,
  setQuestionTypeList,
  getQuestionTypeList,
  setSearchBackQuestionsAction,
  // setVersionListAction,
  changeSelectedVersionAction,
  setGradeListDataAction,
  changeSelectedGradeDataAction,
  // getKnowledgeTreeDataAction,
  getChapterAction,
  changeShowAnalysisAction,
  // changeIsSubmitAction,
  setAlertStatesAction,
  changeCreateHomeworkStepAction,
  setHomeworkSkepAction,
  setTestPaperOneAction,
  changecreateHomeworkShowStateAction,
  setTestHomeworkItemAction,
  changePreviewModalShowStateAction,
  // changeQuestionType,
  changeIsEditorOrReviseStateAction,
  // changeGetGradeStepAction,
  // getGradeListAction,
  setPaperTotalAction,
  changeLoadingOverAction,
  changeQuestionLoadingAction,
  // changeTreeNodePathAction,
  changeKnowledgeIsLoadingAction,
  changeHomeworkTypeAction,
  getTestHomeWorkAction,
} from './actions';
import {
  makeSelectedGrade,
  makeSelectedSubject,
  makeSelectedknowledgeItem,
  makeSelectedSubjectItem,
  makeSelectedTreeNode,
  makePageIndex,
  makePageSize,
  makeSelectedVersion,
  // makeSelectedGradeData,
  makeHomeworkSkep,
  makeHomeworkDiff,
  makeTestHomeworkOnepaperMsg,
  makeHomeworkPaperMsg,
  makeIsEditorOrReviseState,
  makeSelectedTestType,
  makeHomeworkType,
  makePaperIndex,
  makeSearchParams,
} from './selectors';

// 获取学段
export function* getPhaseList() {
  try {
    const repos = yield phaseApi.getPhase();
    switch (repos.code.toString()) {
      case '0':
        yield put(setPhaseListAction(fromJS(repos.data)));
        if (repos.data.length > 0) {
          yield put(changeSelectedPhaseAction(fromJS(repos.data[0])));
        } else {
          yield put(
            changeSelectedPhaseAction(fromJS({ id: -1, name: '未获取到数据' })),
          );
        }
        break;
      default:
        yield put(setPhaseListAction(fromJS([])));
        if (repos.message) {
          message.warning(repos.message);
        } else {
          message.warning('获取学段失败');
        }
        break;
    }
  } catch (err) {
    // err Msg
    message.warning('获取学段异常');
  }
}
// 获取年级
export function* getGradeList() {
  try {
    const repos = yield gradeApi.getGrade();
    switch (repos.code.toString()) {
      case '0':
        yield put(setGradeListAction(fromJS(repos.data)));
        if (repos.data.length > 0) {
          yield put(changeSelectedGradeAction(fromJS(repos.data[0])));
        } else {
          yield put(
            changeSelectedGradeAction(fromJS({ id: -1, name: '暂无' })),
          );
        }
        break;
      default:
        yield put(setGradeListAction(fromJS([])));
        if (repos.message) {
          message.warning(repos.message);
        } else {
          message.warning('获取年级失败');
        }
        break;
    }
  } catch (err) {
    // err Msg
    message.warning('获取年级异常');
  }
}
// 获取学科
export function* getSubjectList() {
  // const requestURL = `${Config.trlink}/api/phaseSubject/subject`;
  const selectedGrade = yield select(makeSelectedGrade());
  const gradeId = selectedGrade.get('id');
  try {
    const repos = yield subjectApi.getSubjectByGradeId(gradeId);
    switch (repos.code.toString()) {
      case '0':
        yield put(setSubjectListAction(fromJS(repos.data)));
        if (repos.data.length > 0) {
          yield put(changeSelectedSubjectAction(fromJS(repos.data[0])));
        } else {
          yield put(
            changeSelectedSubjectAction(
              fromJS({ id: -1, name: '未获取到数据' }),
            ),
          );
        }
        break;
      default:
        yield put(setSubjectListAction(fromJS([])));
        if (repos.message) {
          message.warning(repos.message);
        } else {
          message.warning('获取学科失败');
        }
        break;
    }
  } catch (err) {
    // err Msg
    message.warning('获取学科异常');
  }
}
// 获取知识点列表
export function* getTestLessonKnowledge() {
  // const requestURL = `${Config.trlink}/api/testLessonKnowledge`;
  const selectedGrade = yield select(makeSelectedGrade());
  const selectedSubject = yield select(makeSelectedSubject());
  const gradeId = selectedGrade.get('id');
  const subjectId = selectedSubject.get('id');
  try {
    // const repos = yield call(request, requestURL, Object.assign({}, getjsonoptions()), { gradeId, subjectId });
    const repos = yield testLessonKnowledgeApi.getTestLessonKnowledge({ gradeId, subjectId });
    switch (repos.code.toString()) {
      case '0':
        yield put(setTestLessonKnowledgeAction(fromJS(repos.data || [])));
        if (repos.data.length > 0) {
          yield put(
            changeSelectKnowledgeItemAction(
              fromJS({ id: repos.data[0].id, name: repos.data[0].name }),
            ),
          );
        } else {
          yield put(
            changeSelectKnowledgeItemAction(fromJS({ id: -1, name: '暂无' })),
          );
        }
        break;
      default:
        yield put(setTestLessonKnowledgeAction(fromJS([])));
        break;
    }
  } catch (err) {
    // err Msg
    message.warning('获取知识点异常');
  }
}
// 获取当前知识点的作业列表
export function* getTestHomeWork() {
  const tlkItem = yield select(makeSelectedknowledgeItem());
  const selectedTestType = yield select(makeSelectedTestType());
  const pageIndex = yield select(makePaperIndex());
  const tlkId = tlkItem.get('id');
  if (tlkId === -1) {
    return;
  }
  const params = {
    pageIndex,
    pageSize: 20,
    tlkId,
    type: selectedTestType.get('id'),
    questionSource: 2,
  };
  try {
    yield put(changeLoadingOverAction(false));
    const repos = yield testHwApi.findTestHomework(params);
    switch (repos.code.toString()) {
      case '0':
        yield put(setHomeworkMsgListAction(fromJS(repos.data.list || [])));
        yield put(setPaperTotalAction(repos.data.total));
        break;
      default:
        yield put(setHomeworkMsgListAction(fromJS([])));
        yield put(setPaperTotalAction(0));
        message.warning(repos.message || '获取作业失败，请稍后尝试');
        break;
    }
    yield put(changeLoadingOverAction(true));
  } catch (err) {
    // err Msg
    message.error('获取作业列表失败，发生意外错误');
    yield put(changeLoadingOverAction(true));
  }
}
// 获取科目类型列表
export function* getHomeWorkSubjectData() {
  let selectPhaseSubject = fromJS({ id: -1, name: '未获取到学段列表' });
  try {
    const repos = yield phaseSubjectApi.findAllPhaseSubject();
    switch (repos.code.toString()) {
      case '0':
        if (repos.data && repos.data.length > 0) {
          selectPhaseSubject = repos.data[0];
        }
        yield put(
          setHomeWorkSubujectListAction(
            fromJS(repos.data || [selectPhaseSubject]),
          ),
        );
        if (repos.data.length > 0) {
          // console.log(repos, 'getHomeWorkSubjectData -- 233');
          yield put(
            changeSelectedHomeworkSubjectItemAction(fromJS(selectPhaseSubject)),
          );
          // yield put(getQuestionTypeList());
          // yield put(getKnowledgeTreeDataAction());
        }
        break;
      default:
        break;
    }
  } catch (err) {
    // yield put(repoLoadingError(err));
  }
}
// 获取树型知识点
export function* getHomeWorkKnownledgeTreeData() {
  yield put(changeKnowledgeIsLoadingAction(true));
  const selectSubject = yield select(makeSelectedSubjectItem());
  const phaseSubjectId = selectSubject.get('id');
  const params = { phaseSubjectId };
  let selectKnowledge = { id: -1, name: '', idList: [], path: [] };
  try {
    const repos = yield knowledgeApi.getAllKnowledge(params);
    switch (repos.code.toString()) {
      case '0':
        // console.log(repos, 'getHomeWorkKnownledgeTreeData -- 259');
        // res = repos.data;
        if (repos.data && repos.data.length > 0) {
          const defaultSelect =
            backDefaultKnowledge(repos.data) || selectKnowledge;
          // console.log(backDefaultKnowledge(repos.data), 'backDefaultKnowledge - saga');
          // console.log(defaultSelect, [toString(defaultSelect.id)], backChildren(defaultSelect.children, 'saga'), 'backChildren - saga');
          selectKnowledge = {
            id: defaultSelect.id,
            name: defaultSelect.name,
            idList: [toString(defaultSelect.id)].concat(
              backChildren(defaultSelect.children, 'saga'),
            ),
            path: backPath(repos.data || [selectKnowledge]),
          };
        }
        // console.log(repos, selectKnowledge, 'getHomeWorkKnownledgeTreeData');
        yield put(setKnowledgeTreeDataAction(fromJS(repos.data || [])));
        yield put(changeSelectedTreeNodeAction(fromJS(selectKnowledge)));
        // yield put(/* 获取questionList */);
        /*
          if (repos.data.length && repos.data.length > 0) {
            yield put(changeSelectedTreeNodeAction(fromJS({ id: toNumber(repos.data[0].No), level: 1 })));
          } else {
            yield put(changeSelectedTreeNodeAction(fromJS({ id: '-1', level: 1 })));
          }
        */
        break;
      case '':
        message.warning(repos.message || '系统异常导致获取知识点失败');
        break;
      default:
        break;
    }
    yield put(changeKnowledgeIsLoadingAction(false));
  } catch (err) {
    message.warning('执行错误导致知识点获取失败');
    console.log('getHomeWorkKnownledgeTreeData', err);
    yield put(changeKnowledgeIsLoadingAction(false));
    // yield put(repoLoadingError(err));
  }
}
// 获取题目类型列表
export function* getQuestionTypeListData() {
  // const requestURL = `${Config.tklink}/api/questionType`;
  // const selectSubject = yield select(makeSelectedSubjectItem());
  // const phaseSubjectId = selectSubject.get('id');
  let res = null;
  try {
    // const repos = yield call(
    //   request,
    //   requestURL,
    //   Object.assign({}, getjsonoptions()),
    //   { phaseSubjectId },
    // );
    const repos = yield queryNodeApi.queryAllQuestionType();
    switch (repos.code.toString()) {
      case '0':
        res = fromJS([{ id: '-1', name: '全部' }].concat(repos.data));
        yield put(setQuestionTypeList(res));
        // yield put(changeQuestionType(res.get(0)));
        break;
      default:
        break;
    }
  } catch (err) {
    // err Msg
  }
}
// 获取题目
// eslint-disable-next-line complexity
export function* getQuestionListData() {
  const selectedTreeNode = yield select(makeSelectedTreeNode());
  const pageIndex = yield select(makePageIndex());
  const pageSize = yield select(makePageSize());
  const searchParams = yield select(makeSearchParams());
  const searchParamsJS = searchParams.toJS();
  const params = {
    pageIndex,
    pageSize,
    templateTypes: '2',
  };
  params.knowledgeIds = selectedTreeNode
    .get('idList')
    .toJS()
    .join(',');
  if (!params.knowledgeIds && !params.examPointIds) {
    yield put(changeQuestionLoadingAction(true));
    yield put(
      setSearchBackQuestionsAction(
        fromJS({ totalElements: 0, content: [] }),
      ),
    );
    return;
  }
  if (toNumber(searchParamsJS.grade.id) >= 0) {
    params.gradeId = searchParamsJS.grade.id;
  }
  if (toNumber(searchParamsJS.year.id) >= 0) {
    params.year = searchParamsJS.year.name;
  }
  if (toNumber(searchParamsJS.term.id) >= 0) {
    params.termId = searchParamsJS.term.id;
  }
  if (toNumber(searchParamsJS.province.id) >= 0) {
    params.provinceId = searchParamsJS.province.id;
  }
  if (toNumber(searchParamsJS.city.id) >= 0) {
    params.cityId = searchParamsJS.city.id;
  }
  if (toNumber(searchParamsJS.county.id) >= 0) {
    params.countyId = searchParamsJS.county.id;
  }
  if (toNumber(searchParamsJS.paperType.id) >= 0) {
    params.examPaperTypeId = searchParamsJS.paperType.id;
  }
  if (toNumber(searchParamsJS.questionType.id) >= 0) {
    params.typeId = searchParamsJS.questionType.id;
  }
  if (toNumber(searchParamsJS.difficulty.id) >= 0) {
    params.difficulty = searchParamsJS.difficulty.id;
  }
  // 知识点类型
  if (toNumber(searchParamsJS.knowledgeType.id) >= 0) {
    params.knowledgeType = searchParamsJS.knowledgeType.id;
  }
  // 卷型
  if (toNumber(searchParamsJS.examType.id) >= 0) {
    params.examTypeId = searchParamsJS.examType.id;
  }
  if (toString(searchParamsJS.input).length > 0) {
    params.keyword = searchParamsJS.input;
  }
  if (searchParamsJS.id > 0) params.id = searchParamsJS.id;
  params.excludeInfo = {
    excludeTypeIdList: [50, 51, 52],
  };
  try {
    yield put(changeQuestionLoadingAction(false));
    const repos = yield questionApi.getQuestionWithEncryptForTr(params);
    switch (repos.code.toString()) {
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
        const res = {
          totalElements: repos.data.total,
          content: questionDataList,
        };
        yield put(
          setSearchBackQuestionsAction(
            fromJS(res || { totalElements: 0, content: [] }),
          ),
        );
        if (res && res.content.length > 0) {
          yield put(
            changeShowAnalysisAction(
              res.content.every(item => item.showAnalysis),
            ),
          );
        }
        break;
      }
      case '7':
        yield put(
          setSearchBackQuestionsAction(
            fromJS({ totalElements: 0, content: [] }),
          ),
        );
        yield put(changeShowAnalysisAction(false));
        break;
      default:
        message.warning(repos.message || '服务器异常');
        yield put(
          setSearchBackQuestionsAction(
            fromJS({ totalElements: 0, content: [] }),
          ),
        );
        yield put(changeShowAnalysisAction(false));
        break;
    }
    yield put(changeQuestionLoadingAction(true));
  } catch (err) {
    message.warning('未知错误导致获取题目列表失败');
    console.log('getQuestionListData', err);
    yield put(changeQuestionLoadingAction(true));
  }
}
// 获取版本列表
export function* getVersionListData() {
  const selectSubject = yield select(makeSelectedSubjectItem());
  const phaseSubjectId = selectSubject.get('id');
  let res = '';
  try {
    const repos = yield editionApi.getEdition({ phaseSubjectId });
    switch (repos.code.toString()) {
      case '1':
        res = (repos.data || []).map(item => ({
          id: item.Key,
          name: item.Value,
        }));
        // console.log(res, 'getVersionListData -- 362');
        // yield put(setVersionListAction(fromJS(res)));
        if (res && res.length > 0) {
          yield put(changeSelectedVersionAction(fromJS(res[0])));
        } else {
          yield put(
            changeSelectedVersionAction(fromJS({ id: '-1', name: '暂无' })),
          );
        }
        break;
      default:
        break;
    }
  } catch (err) {
    // err Msg
  }
}
// 获取按章节选题处学科列表
export function* getGradeListData() {
  // const requestURL = `${Config.tklink}/api/grade`;
  const selectSubject = yield select(makeSelectedSubjectItem());
  const selectedVersion = yield select(makeSelectedVersion());
  const phaseSubjectId = selectSubject.get('id');
  const editionId = selectedVersion.get('id');
  let res = '';
  try {
    const repos = yield gradeApi.getGrade({ phaseSubjectId, editionId });
    switch (repos.code.toString()) {
      case '1':
        res = (repos.data || []).map(item => ({
          id: item.ID,
          name: item.Name,
        }));
        yield put(setGradeListDataAction(fromJS(res)));
        if (res && res.length > 0) {
          yield put(changeSelectedGradeDataAction(fromJS(res[0])));
        } else {
          yield put(
            changeSelectedGradeDataAction(fromJS({ id: '-1', name: '全部' })),
          );
        }
        yield put(getQuestionTypeList());
        yield put(getChapterAction());
        break;
      default:
        break;
    }
  } catch (err) {
    // err Msg
  }
}
// 获取树状章节列表
// 测评作业不需要根据章节选题
export function* getChapterList() {
  // const requestURL = `${Config.tklink}/api/chapter`;
  // const selectSubject = yield select(makeSelectedSubjectItem());
  // const selectedVersion = yield select(makeSelectedVersion());
  // const selectedGrade = yield select(makeSelectedGradeData());
  // const phaseSubjectId = selectSubject.get('id');
  // const editionId = selectedVersion.get('id');
  // const gradeId = selectedGrade.get('id');
  // try {
  //   const repos = yield call(
  //     request,
  //     requestURL,
  //     Object.assign({}, getjsonoptions()),
  //     { phaseSubjectId, editionId, gradeId },
  //   );
  //   console.log(repos, 'getChapterList -- 417');
  //   switch (repos.code.toString()) {
  //     case '1':
  //       yield put(setKnowledgeTreeDataAction(fromJS(repos.data || [])));
  //       if (repos.data.length && repos.data.length > 0) {
  //         yield put(
  //           changeSelectedTreeNodeAction(
  //             fromJS({ id: toNumber(repos.data[0].ID), level: 1 }),
  //           ),
  //         );
  //       } else {
  //         yield put(
  //           changeSelectedTreeNodeAction(fromJS({ id: '-1', level: 1 })),
  //         );
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  // } catch (err) {
  //   // err Msg
  // }
}
// 提交制作好的测评课课前作业
export function* submitTestHomework1() {
  const homeworkSkep = yield select(makeHomeworkSkep());
  const homeworkDiff = yield select(makeHomeworkDiff());
  const testHomeworkOnepaperMsg = yield select(makeTestHomeworkOnepaperMsg());
  const selectedknowledgeItem = yield select(makeSelectedknowledgeItem());
  const isEditorOrReviseState = yield select(makeIsEditorOrReviseState());
  const testHomeworkType = yield select(makeHomeworkType());
  const params = {
    children: homeworkSkep.toJS().map(item => {
      return {
        questionId: item.id,
        score: item.score || 3,
        name: item.name,
        starLevel: item.starLevel,
        rightEstimate: item.rightEstimate,
        wrongEstimate: item.wrongEstimate,
        questionSource: 2,
      };
    }),
    diff: homeworkDiff.get('id') === -1 ? 1 : toNumber(homeworkDiff.get('id')),
    name: testHomeworkOnepaperMsg.get('name') || '这份试卷没名称',
    tlkId: selectedknowledgeItem.get('id') || '-1',
    type: testHomeworkType,
    questionSource: 2,
  };
  if (toNumber(testHomeworkType) < 0) {
    message.warn('作业类型出现错误');
    return;
  }
  try {
    let repos = '';
    if (isEditorOrReviseState === 0) {
      repos = yield testHwApi.createTestHw(params);
    } else if (isEditorOrReviseState === 1) {
      repos = yield testHwApi.updateTestHw(
        params,
        testHomeworkOnepaperMsg.get('id'),
      );
    }
    switch (repos.code.toString()) {
      case '0':
        yield put(
          setAlertStatesAction(
            fromJS({
              title:
                isEditorOrReviseState === 0 ? '试卷保存成功' : '试卷修改成功',
              buttonsType: '1',
              imgType: 'success',
            }),
          ),
        );
        yield put(changeCreateHomeworkStepAction(4));
        yield put(changeIsEditorOrReviseStateAction(0));
        break;
      default:
        yield put(
          setAlertStatesAction(
            fromJS({
              title:
                isEditorOrReviseState === 0 ? '试卷保存失败' : '试卷修改失败',
              warningMsg: repos.message || '未知错误',
              buttonsType: '1',
              imgType: 'error',
              showDouble: true,
            }),
          ),
        );
        break;
    }
  } catch (err) {
    // err Msg
    console.warn(err, 'err');
    yield put(
      setAlertStatesAction(
        fromJS({
          title: isEditorOrReviseState === 0 ? '试卷保存失败' : '试卷修改失败',
          warningMsg:
            '未知错误，可刷新后重试，但本份作业将无法保存，请慎重处理！',
          buttonsType: '1',
          imgType: 'error',
          showDouble: true,
        }),
      ),
    );
  }
}
// 修改时获取单份试卷
export function* getSingleHomework() {
  const homeworkPaperMsg = yield select(makeHomeworkPaperMsg());
  const id = homeworkPaperMsg.get('id');
  if (!id || id === -1) return;
  // const requestURL = `${Config.tklink}/api/testLessonHomework/${id}`;
  const testHomeworkOnepaperMsg = yield select(makeTestHomeworkOnepaperMsg());
  yield put(setGlobalAlertStatesAction(fromJS({ title: '试卷数据获取中...' })));
  yield put(changeAlertShowOrHideAction(true));
  try {
    const repos = yield testHwApi.getTestHomeworkById(id);
    switch (repos.code.toString()) {
      case '0':
        if (repos.data && repos.data.children.length > 0) {
          if (repos.data.children[0].questionSource === 2) {
            const homeworkSkep = yield repos.data.children.map(item => {
              const questionOutputDTO = item.questionOutputDTO;
              // console.log(questionOutputDTO, 'questionOutputDTO');
              return Object.assign({}, questionOutputDTO, {
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
                questionId: item.questionId,
                score: item.score,
                name: item.name,
                starLevel: item.starLevel,
                rightEstimate: item.rightEstimate,
                wrongEstimate: item.wrongEstimate,
              });
            });
            yield put(setHomeworkSkepAction(fromJS(homeworkSkep)));
          } else {
            const homeworkSkep = repos.data.children.map(item => {
              const questionEsDto = item.questionEsDto;
              return Object.assign({}, questionEsDto, {
                title: backfromZmStandPrev(questionEsDto.title, 'createHw'),
                analysis: backfromZmStandPrev(
                  questionEsDto.analysis,
                  'createHw',
                ),
                optionList: (questionEsDto.optionList || [])
                  .map(it => backfromZmStandPrev(it, 'createHw'))
                  .filter(it => filterHtmlForm(it)),
                answerList: (questionEsDto.answerList || []).map(it =>
                  backfromZmStandPrev(it, 'createHw'),
                ),
                questionId: item.questionId,
                score: item.score,
                name: item.name,
                starLevel: item.starLevel,
                rightEstimate: item.rightEstimate,
                wrongEstimate: item.wrongEstimate,
              });
            });
            yield put(setHomeworkSkepAction(fromJS(homeworkSkep)));
          }
        }
        yield put(
          setTestPaperOneAction(
            fromJS(
              Object.assign({}, testHomeworkOnepaperMsg.toJS(), {
                name: repos.data.name,
                id: repos.data.id,
              }),
            ),
          ),
        );
        yield put(changeCreateHomeworkStepAction(2));
        yield put(changeHomeworkTypeAction(repos.data.type || 0));
        yield put(changecreateHomeworkShowStateAction(true));
        yield put(changePreviewModalShowStateAction(false));
        break;
      default:
        if (repos.message) {
          message.warning(repos.message);
        } else {
          message.warning('操作失败');
        }
        break;
    }
    yield put(setGlobalAlertStatesAction(fromJS({})));
    yield put(changeAlertShowOrHideAction(false));
  } catch (err) {
    // err Msg
    yield put(setGlobalAlertStatesAction(fromJS({})));
    yield put(changeAlertShowOrHideAction(false));
    message.warning('获取试卷信息异常');
    console.log(err);
  }
}
// 获取单份试卷
export function* getPreviewHomeworkPaper() {
  const homeworkPaperMsg = yield select(makeHomeworkPaperMsg());
  const id = homeworkPaperMsg.get('id');
  if (!id || id === -1) return;
  // const requestURL = `${Config.tklink}/api/testLessonHomework/${id}`;
  yield put(setGlobalAlertStatesAction(fromJS({ title: '试卷数据获取中...' })));
  yield put(changeAlertShowOrHideAction(true));
  try {
    const repos = yield testHwApi.getTestHomeworkById(id);
    // console.log(repos, 'getSingleHomework -- 536');
    switch (repos.code.toString()) {
      case '0':
        repos.data.children = repos.data.children.map(item => {
          const questionOutputDTO = item.questionOutputDTO;
          questionOutputDTO.showAnalysis = false;
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
        yield put(setTestHomeworkItemAction(fromJS(repos.data || {})));
        yield put(changePreviewModalShowStateAction(true));
        break;
      default:
        if (repos.message) {
          message.warning(repos.message);
        } else {
          message.warning('操作失败');
        }
        break;
    }
    yield put(setGlobalAlertStatesAction(fromJS({})));
    yield put(changeAlertShowOrHideAction(false));
  } catch (err) {
    // err Msg
    yield put(setGlobalAlertStatesAction(fromJS({})));
    yield put(changeAlertShowOrHideAction(false));
    message.warning('获取试卷信息异常');
    console.log(err);
  }
}

/** 删除作业 */
function* deleteSubmit() {
  const homeworkPaperMsg = yield select(makeHomeworkPaperMsg());
  const id = homeworkPaperMsg.get('id');
  console.log(id, 'id');
  if (!id || id === -1) return;
  try {
    const repos = yield testHwApi.deleteTestHw(id);
    switch (repos.code.toString()) {
      case '0':
        message.success('删除作业成功');
        yield put(getTestHomeWorkAction());
        break;
      default:
        message.error('删除作业失败');
        break;
    }
  } catch (err) {
    // err Msg
    console.log(err);
    message.warning('删除失败');
  }
}

export function* getPhaseListSaga() {
  const watcher = yield takeLatest(GET_PHASE_LIST_ACTION, getPhaseList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getGradeListSaga() {
  const watcher = yield takeLatest(GET_GRADE_LIST_ACTION, getGradeList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getSubjectListSaga() {
  const watcher = yield takeLatest(GET_SUBJECT_LIST_ACTION, getSubjectList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* changeSelectedPhaseSaga() {
  const watcher = yield takeLatest(CHANGE_SELECTED_PHASE_ACTION, getGradeList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* changeSelectedGradeSaga() {
  const watcher = yield takeLatest(
    CHANGE_SELECTED_GRADE_ACTION,
    getSubjectList,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* changeSelectedSubjectSaga() {
  const watcher = yield takeLatest(
    CHANGE_SELECTED_SUBJECT_ACTION,
    getTestLessonKnowledge,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getTestLessonKnowledgeSaga() {
  const watcher = yield takeLatest(
    GET_TEST_LESSON_KNOWLEDGE_ACTION,
    getTestLessonKnowledge,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getTestHomeWorkSaga() {
  const watcher = yield takeLatest(
    CHANGE_SELECT_KNOWLEDGE_ITEM_ACTION,
    getTestHomeWork,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getHomeWorkSubjectDataSaga() {
  const watcher = yield takeLatest(
    GET_HOMEWORK_SUBJECT_DARA_ACTION,
    getHomeWorkSubjectData,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getHomeWorkKnownledgeTreeDataSaga() {
  const watcher = yield takeLatest(
    GET_KNOWLWDGE_TREE_DATA_ACTION,
    getHomeWorkKnownledgeTreeData,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getQuestionTypeListDataSaga() {
  const watcher = yield takeLatest(
    GET_QUESTION_TYPE_LIST_ACTION,
    getQuestionTypeListData,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getQuestionListDataSaga() {
  const watcher = yield takeLatest(
    CHANGE_SELECTED_TREE_NODE_ACTION,
    getQuestionListData,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getVersionListDataSaga() {
  const watcher = yield takeLatest(GET_VERSION_LIST_ACTION, getVersionListData);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getGradeListDataSaga() {
  const watcher = yield takeLatest(
    CHANGE_SELECTED_VERSION_ACTION,
    getGradeListData,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getChapterSaga() {
  const watcher = yield takeLatest(
    CHANGE_SELECTED_GRADE_DATA_ACTION,
    getChapterList,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* searchQuestionListSaga() {
  const watcher = yield takeLatest(
    SEARCH_QUESTION_LIST_ACTION,
    getQuestionListData,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* submitHomework1Saga() {
  const watcher = yield takeLatest(
    SUBMIT_TEST_HOMEWOK_ONE_ACTION,
    submitTestHomework1,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getSingleHomeworkSaga() {
  const watcher = yield takeLatest(EDITOR_HOMEWORK_ACTION, getSingleHomework);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getPreviewHomeworkPaperSaga() {
  const watcher = yield takeLatest(
    PREVIEW_HOMEWORK_ITEM_ACTION,
    getPreviewHomeworkPaper,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getTestHomeWorkFromTestTypeSaga() {
  const watcher = yield takeLatest(
    CHANGE_TEST_HOMEWORK_TYPE_ACTION,
    getTestHomeWork,
  );
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getTestHomeWorkFromTestActionSaga() {
  const watcher = yield takeLatest(GET_TEST_HOMEWORK_ACTION, getTestHomeWork);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

/**
 * 在DELETE_HOMEWORK_ACTION被触发后， 派生一个新的deleteSubmit任务
 */
function* watchDeleteHomeworkActionSaga() {
  const watcher = yield takeLatest(DELETE_HOMEWORK_ACTION, deleteSubmit);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All  to be loaded
export default [
  getPhaseListSaga,
  getGradeListSaga,
  getSubjectListSaga,
  changeSelectedPhaseSaga,
  changeSelectedGradeSaga,
  changeSelectedSubjectSaga,
  getTestLessonKnowledgeSaga,
  getTestHomeWorkSaga,
  getHomeWorkSubjectDataSaga,
  getHomeWorkKnownledgeTreeDataSaga,
  getQuestionTypeListDataSaga,
  getQuestionListDataSaga,
  getVersionListDataSaga,
  getGradeListDataSaga,
  getChapterSaga,
  searchQuestionListSaga,
  submitHomework1Saga,
  getSingleHomeworkSaga,
  getPreviewHomeworkPaperSaga,
  getTestHomeWorkFromTestTypeSaga,
  getTestHomeWorkFromTestActionSaga,
  watchDeleteHomeworkActionSaga,
];
