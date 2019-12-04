/*
 *
 * TestHomeWork reducer
 *
 */

import { fromJS } from 'immutable';
import { difficultyList } from 'utils/zmConfig';
import {
  DEFAULT_ACTION,
  SET_PHASE_LIST_ACTION,
  SET_GRADE_LIST_ACTION,
  SET_SUBJECT_LIST_ACTION,
  CHANGE_SELECTED_PHASE_ACTION,
  CHANGE_SELECTED_GRADE_ACTION,
  CHANGE_SELECTED_SUBJECT_ACTION,
  SET_TEST_LESSON_KNOWLEDGE_ACTION,
  CHANGE_SELECT_KNOWLEDGE_ITEM_ACTION,
  SET_HOMEWORK_MSG_LIST_ACTION,
  CHANGE_PREVIEW_MODAL_SHOW_STATE_ACTION,
  CHANGE_CREATE_HOMEWORK_SHOW_STATE_ACTION,
  CHANGE_CREATE_HOMEWORK_STEP_ACTION,
  SET_HOMEWORK_SUBJECT_LIST_ACTION,
  CHANGE_SELECTED_HOMEWORK_SUBJECT_ITEM_ACTION,
  SET_KNOWLEDGE_TREE_DATA_ACTION,
  CHANGE_SELECTED_TYPE_ACTION,
  CHANGE_SELECTED_TREE_NODE_ACTION,
  CHANGE_QUESTION_TYPE_ACTION,
  CHANGE_QUESTION_LEVEL_ACTION,
  CHANGE_QUESTION_KIND_ACTION,
  CHANGE_QUESTION_FITSTAGE_ACTION,
  CHANGE_QUESTION_SUGGEST_ACTION,
  SET_QUESTION_TYPE_LIST_ACTION,
  CHANGE_SEARCH_KEYWORD_ACTION,
  CHANGE_SHOW_ANALYSIS_ACTION,
  SET_SEARCH_BACK_QUESTION_LIST_ACTION,
  SET_HOMEWORK_SKEP_ACTION,
  SET_VERSION_LIST_ACTION,
  CHANGE_SELECTED_VERSION_ACTION,
  SET_GRADE_LIST_DATA_ACTION,
  CHANGE_SELECTED_GRADE_DATA_ACTION,
  CHANGE_IS_SUBMIT_ACTION,
  SET_TEST_PAPER_ONE_ACTION,
  SET_ALERT_STATES_ACTION,
  CHANGE_HOMEWORK_PAPER_ITEM_ACTION,
  SET_TEST_HOMEWORK_ITEM_ACTION,
  CHANGE_PAGE_INDEX_ACTION,
  CHANGE_IS_EDITOR_OR_REVISE_STATE_ACTION,
  CHANGE_HOMEWORK_TYPE_ACTION,
  CHANGE_TEST_HOMEWORK_TYPE_ACTION,
  SET_PAPER_TOTAL_ACTION,
  SET_PAPER_INDEX_ACTION,
  CHANGE_LOADING_OVER_ACTION,
  CHANGE_QUESTION_LOADING_OVER_ACTION,
  SET_TREENODE_PATH_ACTION,
  CHANGE_KNOWLEDGE_LIST_IS_LOADING_ACTION,
  SET_SEARCH_PARAMS_ACTION,
} from './constants';

const defaultSelect = { id: -1, name: '全部' };

const initialState = fromJS({
  homeworkType: 0,  // 作业类型  0：测评课前作业、1：测评课后测评
  pageIndex: 1,     // 当前页数，制作作业是弹框内的页数
  pageSize: 20,
  paperTotal: 0,    // 查询到的试卷总数
  paperIndex: 1,    // 查询试卷时的当前页数
  loadingOver: false,  // 试卷列表已经获取完成...
  phaseList: [],    // 学段(已弃)
  gradeList: [],    // 年级
  subjectList: [],  // 学科
  testTypeList: [{ id: 0, name: '课前测评' }, { id: 1, name: '课后作业' }],  // 测评课作业类型(课前测评、课后作业)
  selectedPhase: { id: -1, name: '暂无' },      // 选择的学段
  selectedGrade: { id: -1, name: '暂无' },      // 选择的年级
  selectedSubject: { id: -1, name: '暂无' },    // 选择的学科
  selectedTestType: { id: 0, name: '课前测评' }, // 选择的测评课作业类型
  testkonwleadgeList: [],                           // 测评课知识点获取
  selectedknowledgeItem: { id: -1, name: '暂无' },  // 选中的知识点
  homeworkMsgList: [],      // 获取到的作业列表
  previewModalShow: false,  // 查看试卷弹框显示状态
  createModalShow: false,   // 只做作业弹框状态
  homeworkStep: 1,          // 制作作业的进度
  homeworksubjectlist: [],  // 制作作业选则学科的学科列表
  knowledgeTreeData: [],    // 树状知识点列表
  selectedSubjectItem: { id: '-1', name: '暂无' },   // 选中的学科
  selectedType: { id: 0, name: '按知识点选题' },      // 选中的选择方式
  treeNodePath: [],
  knowledgeListIsLoading: true,
  selectedTreeNode: { id: '-1', level: 1 },          // 选中的树状节点
  selectQuestionTypeList: [],  // 题目类型
  selectQuestionType: { id: '1', name: '单选题' },     // 选择的题目类型
  questionlevellist: difficultyList, // 难度等级
  selectedQuestionLevel: { id: '-1', name: '全部' },  // 选择的题目难度
  questionkindlist: [
    { id: '-1', name: '全部' }, { id: '1', name: '月考' }, { id: '2', name: '模拟考' }, { id: '3', name: '中考题' }, { id: '4', name: '高考题' }, { id: '5', name: '学业考试' }, { id: '6', name: '其他' },
  ],
  selectedQuestionKind: { id: '-1', name: '全部' },   // 选择的题类
  fitstage: [  // 阶段
    { id: '-1', name: '全部' }, { id: '1', name: '预习' }, { id: '2', name: '同步' }, { id: '3', name: '一轮' }, { id: '4', name: '二轮' }, { id: '5', name: '冲刺' }, { id: '0', name: '无' }
  ],
  selectfitstage: { id: '-1', name: '全部' },         // 选择的阶段
  suggeststart: [
    { id: '-1', name: '全部' }, { id: '5', name: '五星' }, { id: '4', name: '四星' }, { id: '3', name: '三星' }, { id: '2', name: '二星' }, { id: '1', name: '一星' }, { id: '0', name: '无' }
  ],
  selectsuggeststart: { id: '-1', name: '全部' },     // 选择的星级
  keyword: '',                                        // 关键字
  showAnalysis: false,
  searchBackQuestions: {},    // 查询到的题目列表
  homeworkSkep: [],           // 作业篮
  versionList: [],                                // 版本列表
  selectedVersion: { id: '-1', name: '暂无' },    // 选中的版本
  gradeListData: [],    // 章节选题处的年级列表
  selectedGradeData: { id: '-1', name: '全部' },  // 章节选题处选中的年级
  isSubmit: false,      // 显示上传弹框
  alertStates: {},      // 弹框状态
  testHomeworkOnepaperMsg: {},  // 该份作业信息(课前测评课作业)
  //
  homeworkDiff: { id: -1, name: '暂无' },  // 试卷难度
  homeworkPaperMsg: {},  // 要查询的作业试卷
  testHomeworkItem: {},  // 获取回来的作业（测评课课前作业）
  isEditorOrReviseState: 0,  // 但前是编辑状态还是修改状态
  questionListLoadingOver: false,  // 题目列表已经获取完毕?
  searchParams: {
    grade: defaultSelect,
    year: defaultSelect,
    term: defaultSelect,
    province: defaultSelect,
    city: defaultSelect,
    county: defaultSelect,
    paperType: defaultSelect,
    examType: defaultSelect,
    questionType: defaultSelect,
    difficulty: defaultSelect,
    knowledgeType: defaultSelect,
  },
});

// eslint-disable-next-line
function testHomeWorkReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case CHANGE_PAGE_INDEX_ACTION:
      return state.set('pageIndex', action.num);
    case SET_PHASE_LIST_ACTION:
      return state.set('phaseList', action.item);
    case SET_GRADE_LIST_ACTION:
      return state.set('gradeList', action.item);
    case SET_SUBJECT_LIST_ACTION:
      return state.set('subjectList', action.item);
    case CHANGE_SELECTED_PHASE_ACTION:
      return state.set('selectedPhase', action.item);
    case CHANGE_SELECTED_GRADE_ACTION:
      return state.set('selectedGrade', action.item);
    case CHANGE_SELECTED_SUBJECT_ACTION:
      return state.set('selectedSubject', action.item);
    case SET_TEST_LESSON_KNOWLEDGE_ACTION:
      return state.set('testkonwleadgeList', action.item);
    case CHANGE_SELECT_KNOWLEDGE_ITEM_ACTION:
      return state.set('selectedknowledgeItem', action.item);
    case SET_HOMEWORK_MSG_LIST_ACTION:
      return state.set('homeworkMsgList', action.item);
    case CHANGE_PREVIEW_MODAL_SHOW_STATE_ACTION:
      return state.set('previewModalShow', action.bol);
    case CHANGE_CREATE_HOMEWORK_SHOW_STATE_ACTION:
      return state.set('createModalShow', action.bol);
    case CHANGE_CREATE_HOMEWORK_STEP_ACTION:
      return state.set('homeworkStep', action.num);
    case SET_HOMEWORK_SUBJECT_LIST_ACTION:
      return state.set('homeworksubjectlist', action.item);
    case CHANGE_SELECTED_HOMEWORK_SUBJECT_ITEM_ACTION:
      return state.set('selectedSubjectItem', action.item);
    case SET_KNOWLEDGE_TREE_DATA_ACTION:
      return state.set('knowledgeTreeData', action.item);
    case CHANGE_SELECTED_TYPE_ACTION:
      return state.set('selectedType', action.item);
    case CHANGE_SELECTED_TREE_NODE_ACTION:
      return state.set('selectedTreeNode', action.item);
    case CHANGE_KNOWLEDGE_LIST_IS_LOADING_ACTION:
      return state.set('knowledgeListIsLoading', action.bol);
    case SET_TREENODE_PATH_ACTION:
      return state.set('treeNodePath', action.item);
    case SET_QUESTION_TYPE_LIST_ACTION:
      return state.set('selectQuestionTypeList', action.item);
    case CHANGE_QUESTION_TYPE_ACTION:
      return state.set('selectQuestionType', action.item);
    case CHANGE_QUESTION_LEVEL_ACTION:
      return state.set('selectedQuestionLevel', action.item);
    case CHANGE_QUESTION_KIND_ACTION:
      return state.set('selectedQuestionKind', action.item);
    case CHANGE_QUESTION_FITSTAGE_ACTION:
      return state.set('selectfitstage', action.item);
    case CHANGE_QUESTION_SUGGEST_ACTION:
      return state.set('selectsuggeststart', action.item);
    case CHANGE_SEARCH_KEYWORD_ACTION:
      return state.set('keyword', action.str);
    case CHANGE_SHOW_ANALYSIS_ACTION:
      return state.set('showAnalysis', action.bol);
    case SET_SEARCH_BACK_QUESTION_LIST_ACTION:
      return state.set('searchBackQuestions', action.item);
    case SET_HOMEWORK_SKEP_ACTION:
      return state.set('homeworkSkep', action.item);
    case SET_VERSION_LIST_ACTION:
      return state.set('versionList', action.item);
    case CHANGE_SELECTED_VERSION_ACTION:
      return state.set('selectedVersion', action.item);
    case SET_GRADE_LIST_DATA_ACTION:
      return state.set('gradeListData', action.item);
    case CHANGE_SELECTED_GRADE_DATA_ACTION:
      return state.set('selectedGradeData', action.item);
    case CHANGE_IS_SUBMIT_ACTION:
      return state.set('isSubmit', action.bol);
    case SET_TEST_PAPER_ONE_ACTION:
      return state.set('testHomeworkOnepaperMsg', action.item);
    case SET_ALERT_STATES_ACTION:
      return state.set('alertStates', action.item);
    case CHANGE_HOMEWORK_PAPER_ITEM_ACTION:
      return state.set('homeworkPaperMsg', action.item);
    case SET_TEST_HOMEWORK_ITEM_ACTION:
      return state.set('testHomeworkItem', action.item);
    case CHANGE_IS_EDITOR_OR_REVISE_STATE_ACTION:
      return state.set('isEditorOrReviseState', action.num);
    case CHANGE_HOMEWORK_TYPE_ACTION:
      return state.set('homeworkType', action.num);
    case CHANGE_TEST_HOMEWORK_TYPE_ACTION:
      return state.set('selectedTestType', action.item);
    case SET_PAPER_TOTAL_ACTION:
      return state.set('paperTotal', action.num);
    case SET_PAPER_INDEX_ACTION:
      return state.set('paperIndex', action.num);
    case CHANGE_LOADING_OVER_ACTION:
      return state.set('loadingOver', action.bol);
    case CHANGE_QUESTION_LOADING_OVER_ACTION:
      return state.set('questionListLoadingOver', action.bol);
    case SET_SEARCH_PARAMS_ACTION:
      return state.set('searchParams', action.item);
    default:
      return state;
  }
}

export default testHomeWorkReducer;
