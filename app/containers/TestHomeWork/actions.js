/*
 *
 * TestHomeWork actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_PHASE_LIST_ACTION,
  GET_GRADE_LIST_ACTION,
  GET_SUBJECT_LIST_ACTION,
  SET_PHASE_LIST_ACTION,
  SET_GRADE_LIST_ACTION,
  SET_SUBJECT_LIST_ACTION,
  CHANGE_SELECTED_PHASE_ACTION,
  CHANGE_SELECTED_GRADE_ACTION,
  CHANGE_SELECTED_SUBJECT_ACTION,
  GET_TEST_LESSON_KNOWLEDGE_ACTION,
  SET_TEST_LESSON_KNOWLEDGE_ACTION,
  CHANGE_SELECT_KNOWLEDGE_ITEM_ACTION,
  SET_HOMEWORK_MSG_LIST_ACTION,
  CHANGE_PREVIEW_MODAL_SHOW_STATE_ACTION,
  CHANGE_CREATE_HOMEWORK_SHOW_STATE_ACTION,
  CHANGE_CREATE_HOMEWORK_STEP_ACTION,
  GET_HOMEWORK_SUBJECT_DARA_ACTION,
  SET_HOMEWORK_SUBJECT_LIST_ACTION,
  CHANGE_SELECTED_HOMEWORK_SUBJECT_ITEM_ACTION,
  SET_KNOWLEDGE_TREE_DATA_ACTION,
  CHANGE_SELECTED_TYPE_ACTION,
  CHANGE_SELECTED_TREE_NODE_ACTION,
  GET_QUESTION_TYPE_LIST_ACTION,
  SET_QUESTION_TYPE_LIST_ACTION,
  CHANGE_QUESTION_TYPE_ACTION,
  CHANGE_QUESTION_LEVEL_ACTION,
  CHANGE_QUESTION_KIND_ACTION,
  CHANGE_QUESTION_FITSTAGE_ACTION,
  CHANGE_QUESTION_SUGGEST_ACTION,
  CHANGE_SEARCH_KEYWORD_ACTION,
  CHANGE_SHOW_ANALYSIS_ACTION,
  SET_SEARCH_BACK_QUESTION_LIST_ACTION,
  SET_HOMEWORK_SKEP_ACTION,
  GET_VERSION_LIST_ACTION,
  SET_VERSION_LIST_ACTION,
  CHANGE_SELECTED_VERSION_ACTION,
  GET_CHAPTER_ACTION,
  SET_GRADE_LIST_DATA_ACTION,
  CHANGE_SELECTED_GRADE_DATA_ACTION,
  GET_KNOWLWDGE_TREE_DATA_ACTION,
  SEARCH_QUESTION_LIST_ACTION,
  CHANGE_IS_SUBMIT_ACTION,
  SUBMIT_TEST_HOMEWOK_ONE_ACTION,
  SET_TEST_PAPER_ONE_ACTION,
  SET_ALERT_STATES_ACTION,
  CHANGE_HOMEWORK_PAPER_ITEM_ACTION,
  SET_TEST_HOMEWORK_ITEM_ACTION,
  PREVIEW_HOMEWORK_ITEM_ACTION,
  EDITOR_HOMEWORK_ACTION,
  DELETE_HOMEWORK_ACTION,
  CHANGE_PAGE_INDEX_ACTION,
  CHANGE_IS_EDITOR_OR_REVISE_STATE_ACTION,
  CHANGE_HOMEWORK_TYPE_ACTION,
  CHANGE_TEST_HOMEWORK_TYPE_ACTION,
  GET_TEST_HOMEWORK_ACTION,
  SET_PAPER_TOTAL_ACTION,
  SET_PAPER_INDEX_ACTION,
  CHANGE_LOADING_OVER_ACTION,
  CHANGE_QUESTION_LOADING_OVER_ACTION,
  SET_TREENODE_PATH_ACTION,
  CHANGE_KNOWLEDGE_LIST_IS_LOADING_ACTION,
  SET_SEARCH_PARAMS_ACTION,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
// 获取学段
export function getPhaseListAction() {
  return {
    type: GET_PHASE_LIST_ACTION,
  };
}
// 获取年级
export function getGradeListAction() {
  return {
    type: GET_GRADE_LIST_ACTION,
  };
}
// 获取学科
export function getSubjectListAction() {
  return {
    type: GET_SUBJECT_LIST_ACTION,
  };
}
// 保存学段
export function setPhaseListAction(item) {
  return {
    type: SET_PHASE_LIST_ACTION,
    item,
  };
}
// 保存年级
export function setGradeListAction(item) {
  return {
    type: SET_GRADE_LIST_ACTION,
    item,
  };
}
// 保存年级
export function setSubjectListAction(item) {
  return {
    type: SET_SUBJECT_LIST_ACTION,
    item,
  };
}
// 保存选中学段
export function changeSelectedPhaseAction(item) {
  return {
    type: CHANGE_SELECTED_PHASE_ACTION,
    item,
  };
}
// 保存选中年级
export function changeSelectedGradeAction(item) {
  return {
    type: CHANGE_SELECTED_GRADE_ACTION,
    item,
  };
}
// 保存选中年级
export function changeSelectedSubjectAction(item) {
  return {
    type: CHANGE_SELECTED_SUBJECT_ACTION,
    item,
  };
}
// 获取测评课知识点
export function getTestLessonKnowledgeAction() {
  return {
    type: GET_TEST_LESSON_KNOWLEDGE_ACTION,
  };
}
// 保存测评课知识点
export function setTestLessonKnowledgeAction(item) {
  return {
    type: SET_TEST_LESSON_KNOWLEDGE_ACTION,
    item,
  };
}
// 切换当前选中的知识点
export function changeSelectKnowledgeItemAction(item) {
  return {
    type: CHANGE_SELECT_KNOWLEDGE_ITEM_ACTION,
    item,
  };
}
// 保存获取到的作业列表
export function setHomeworkMsgListAction(item) {
  return {
    type: SET_HOMEWORK_MSG_LIST_ACTION,
    item,
  };
}
// 切换预览试卷弹框显示状态
export function changePreviewModalShowStateAction(bol) {
  return {
    type: CHANGE_PREVIEW_MODAL_SHOW_STATE_ACTION,
    bol,
  };
}
// 切换制作作业弹框状态
export function changecreateHomeworkShowStateAction(bol) {
  return {
    type: CHANGE_CREATE_HOMEWORK_SHOW_STATE_ACTION,
    bol,
  };
}
// 跟新布置作业进度
export function changeCreateHomeworkStepAction(num) {
  return {
    type: CHANGE_CREATE_HOMEWORK_STEP_ACTION,
    num,
  };
}
// 获取选题学科列表
export function getHomeWorkSubjectDataAction() {
  return {
    type: GET_HOMEWORK_SUBJECT_DARA_ACTION,
  };
}
// 设置选题学科列表
export function setHomeWorkSubujectListAction(item) {
  return {
    type: SET_HOMEWORK_SUBJECT_LIST_ACTION,
    item,
  };
}
// 切换选中的学段
export function changeSelectedHomeworkSubjectItemAction(item) {
  return {
    type: CHANGE_SELECTED_HOMEWORK_SUBJECT_ITEM_ACTION,
    item,
  };
}
// 获取树状知识点
export function getKnowledgeTreeDataAction() {
  return {
    type: GET_KNOWLWDGE_TREE_DATA_ACTION,
  };
}
// 保存获取的树状知识点列表
export function setKnowledgeTreeDataAction(item) {
  return {
    type: SET_KNOWLEDGE_TREE_DATA_ACTION,
    item,
  };
}
// 切换选择方式
export function changeSelectedTypeAction(item) {
  return {
    type: CHANGE_SELECTED_TYPE_ACTION,
    item,
  };
}
// 切换当前选中的树节点
export function changeSelectedTreeNodeAction(item) {
  return {
    type: CHANGE_SELECTED_TREE_NODE_ACTION,
    item,
  };
}
// 获取题目类型列表
export function getQuestionTypeList() {
  return {
    type: GET_QUESTION_TYPE_LIST_ACTION,
  };
}
// 保存题目类型列表
export function setQuestionTypeList(item) {
  return {
    type: SET_QUESTION_TYPE_LIST_ACTION,
    item,
  };
}
// 切换题型
export function changeQuestionType(item) {
  return {
    type: CHANGE_QUESTION_TYPE_ACTION,
    item,
  };
}
// 切换难度等级
export function changeQuestionLevel(item) {
  return {
    type: CHANGE_QUESTION_LEVEL_ACTION,
    item,
  };
}
// 切换题类
export function changeQuestionKind(item) {
  return {
    type: CHANGE_QUESTION_KIND_ACTION,
    item,
  };
}
// 切换阶段
export function changeQuestionFistage(item) {
  return {
    type: CHANGE_QUESTION_FITSTAGE_ACTION,
    item,
  };
}
// 切换星级
export function changeQuestionSuggest(item) {
  return {
    type: CHANGE_QUESTION_SUGGEST_ACTION,
    item,
  };
}
// 跟新关键字
export function changekeywordAction(str) {
  return {
    type: CHANGE_SEARCH_KEYWORD_ACTION,
    str,
  };
}
// 切换解析与答案显示状态
export function changeShowAnalysisAction(bol) {
  return {
    type: CHANGE_SHOW_ANALYSIS_ACTION,
    bol,
  };
}
// 保存查询到的题目列表
export function setSearchBackQuestionsAction(item) {
  return {
    type: SET_SEARCH_BACK_QUESTION_LIST_ACTION,
    item,
  };
}
// 添加到作业篮
export function setHomeworkSkepAction(item) {
  return {
    type: SET_HOMEWORK_SKEP_ACTION,
    item,
  };
}
// 获取版本列表
export function getVersionListAction() {
  return {
    type: GET_VERSION_LIST_ACTION,
  };
}
// 保存版本列表
export function setVersionListAction(item) {
  return {
    type: SET_VERSION_LIST_ACTION,
    item,
  };
}
// 切换版本
export function changeSelectedVersionAction(item) {
  return {
    type: CHANGE_SELECTED_VERSION_ACTION,
    item,
  };
}
// 获取章节选题年级
export function setGradeListDataAction(item) {
  return {
    type: SET_GRADE_LIST_DATA_ACTION,
    item,
  };
}
// 切换章节选题选中年级
export function changeSelectedGradeDataAction(item) {
  return {
    type: CHANGE_SELECTED_GRADE_DATA_ACTION,
    item,
  };
}
// 获取 chapter
export function getChapterAction() {
  return {
    type: GET_CHAPTER_ACTION,
  };
}
// 查询题目
export function searchQuestionListAction() {
  return {
    type: SEARCH_QUESTION_LIST_ACTION,
  };
}
// 提交制作好的作业
export function submitHomeworkAction() {
  return {
    type: SUBMIT_TEST_HOMEWOK_ONE_ACTION,
  };
}
// 切换提交作业弹框显示状态
export function changeIsSubmitAction(bol) {
  return {
    type: CHANGE_IS_SUBMIT_ACTION,
    bol,
  };
}
// 设置测评课试卷类型1 数据（课前测评课作业）
export function setTestPaperOneAction(item) {
  return {
    type: SET_TEST_PAPER_ONE_ACTION,
    item,
  };
}
// 设制作作业置弹框内容
export function setAlertStatesAction(item) {
  return {
    type: SET_ALERT_STATES_ACTION,
    item,
  };
}
// 切换要查询的作业
export function changeHomeworkPaperItemAcction(item) {
  return {
    type: CHANGE_HOMEWORK_PAPER_ITEM_ACTION,
    item,
  };
}
// 预览试卷
export function previewHomeworkAction() {
  return {
    type: PREVIEW_HOMEWORK_ITEM_ACTION,
  };
}
// 编辑试卷
export function editorHomeworkAction() {
  return {
    type: EDITOR_HOMEWORK_ACTION,
  };
}

/** 删除作业 */
export function deleteHomeworkAction() {
  return {
    type: DELETE_HOMEWORK_ACTION,
  };
}

// 保存获取回来的测评课作业
export function setTestHomeworkItemAction(item) {
  return {
    type: SET_TEST_HOMEWORK_ITEM_ACTION,
    item,
  };
}
// 换页
export function changePageIndexAction(num) {
  return {
    type: CHANGE_PAGE_INDEX_ACTION,
    num,
  };
}
// 切换编辑试卷还是修改试卷状态
export function changeIsEditorOrReviseStateAction(num) {
  return {
    type: CHANGE_IS_EDITOR_OR_REVISE_STATE_ACTION,
    num,
  };
}
// 切换要制作的作业的类型
export function changeHomeworkTypeAction(num) {
  return {
    type: CHANGE_HOMEWORK_TYPE_ACTION,
    num,
  };
}
// 切换要制作的作业的类型
export function changeTestTypeAction(item) {
  return {
    type: CHANGE_TEST_HOMEWORK_TYPE_ACTION,
    item,
  };
}
// 获取测评作业
export function getTestHomeWorkAction() {
  return {
    type: GET_TEST_HOMEWORK_ACTION,
  };
}
// 更改获取到的试卷总数
export function setPaperTotalAction(num) {
  return {
    type: SET_PAPER_TOTAL_ACTION,
    num,
  };
}
// 更改当前试卷所在页
export function setPaperIndexAction(num) {
  return {
    type: SET_PAPER_INDEX_ACTION,
    num,
  };
}
// 更改加载是否完成状态
export function changeLoadingOverAction(bol) {
  return {
    type: CHANGE_LOADING_OVER_ACTION,
    bol,
  };
}
// 更改加载是否完成状态
export function changeQuestionLoadingAction(bol) {
  return {
    type: CHANGE_QUESTION_LOADING_OVER_ACTION,
    bol,
  };
}
export function changeTreeNodePathAction(item) {
  return {
    type: SET_TREENODE_PATH_ACTION,
    item,
  };
}
export function changeKnowledgeIsLoadingAction(bol) {
  return {
    type: CHANGE_KNOWLEDGE_LIST_IS_LOADING_ACTION,
    bol,
  };
}
export function setSearchParamsAction(item) {
  return {
    type: SET_SEARCH_PARAMS_ACTION,
    item,
  };
}

export default {
  defaultAction,
  getPhaseListAction,
  getGradeListAction,
  getSubjectListAction,
  getTestLessonKnowledgeAction,
  getHomeWorkSubjectDataAction,
  getKnowledgeTreeDataAction,
  getQuestionTypeList,
  getVersionListAction,

  setPhaseListAction,
  setGradeListAction,
  setSubjectListAction,
  setTestLessonKnowledgeAction,
  setHomeworkMsgListAction,
  setHomeWorkSubujectListAction,
  setKnowledgeTreeDataAction,
  setQuestionTypeList,
  setSearchBackQuestionsAction,
  setHomeworkSkepAction,
  setGradeListDataAction,
  setVersionListAction,

  changeSelectedPhaseAction,
  changeSelectedGradeAction,
  changeSelectKnowledgeItemAction,
  changePreviewModalShowStateAction,
  changecreateHomeworkShowStateAction,
  changeCreateHomeworkStepAction,
  changeSelectedHomeworkSubjectItemAction,
  changeSelectedTypeAction,
  changeSelectedTreeNodeAction,
  changeQuestionType,
  changeQuestionLevel,
  changeQuestionKind,
  changeQuestionFistage,
  changeQuestionSuggest,
  changekeywordAction,
  changeShowAnalysisAction,
  changeSelectedVersionAction,
  changeSelectedGradeDataAction,


  setSearchParamsAction,
};
