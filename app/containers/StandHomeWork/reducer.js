/*
 *
 * schoolHomeWork reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  SET_PREVIEW_SELECT_OBJ_ACTION,
  SET_SEARCH_PARAMS_ACTION,
  SET_SEARCH_QUESTION_PARAMS_ACTION,
  SET_SEARCH_QUESTION_PARAMS_ITEM_ACTION,
  SET_CREATE_HOMEWORK_STEP_PARAMS_ACTION,
  INIT_DATA_WHEN_CLOSE_ACTION,
  SET_PREVIEW_HOMEWORK_DATA_LIST_ACTION,
  SET_ALL_GRADE_LIST_ACTION,
  CHANGE_IS_REEDIT_HOMEWORK_ACTION,
  CHANGE_HOMEWORK_TYPE_ACTION,
  SET_AI_HOMEWORK_PARAMS_ITEM_ACTION,
  SET_AI_HOMEWORK_PARAMS_ACTION,
  SET_CREATE_HOMEWORK_STEP_PARAMS_ITEM_ACTION,
  CAHNGE_PAGE_STATE,
  CLASS_TYPE_CODE,
  SAVE_RE_EDIT_HOMEOWK_ACTION,
  SET_SLIDER_STATE,
  RESET_STATE,
} from './constants';
const defaultSelect = { id: -1, name: '全部' };

const initialState = fromJS({
  // 搜多作业相关参数
  prviewSelectObj: {
    selectGrade: { id: -1, name: '年级' },
    selectSubject: { id: -1, name: '学科' },
    selectEdition: { id: -1, name: '版本' },
    selectTree: {},
    gradeList: [{ id: -1, name: '年级' }],
    sudjectList: [{ id: -1, name: '学科' }],
    editionList: [{ id: -1, name: '版本' }],
    treeList: [],
    standHomeWorkList: [],
    treeDataIsLoading: true,
    paperTotal: 0,
  },
  // 搜寻已有作业相关参数
  serachParams: {
    state: 0,
    diff: 4,
    level: 1,
    type: 1,
    pageSize: 20,
    pageIndex: 1,
    keyword: '',
    schoolType: '4'
  },
  pageState: {
    isLoading: true
  },
  // 制作作业时的搜索题目的相关参数
  searchQuestionParams: {
    pageIndex: 1,
    pageSize: 20,
    selectPhaseSubject: {},
    phaseSubjectList: [],
    selectKnowledge: {},
    knowledgeList: [],
    selectCourseSystemPath: [],
    showCreateHomeworkModal: false,  // 控制制作作业弹框的展示 默认值为 false 才对，如果不对请改成 false.
    knowledgeListIsLoading: true,   // 当前正在请求知识点列表
    selectedition: defaultSelect,
    editionList: [defaultSelect],
    selectedGrade: defaultSelect,
    gradeList: [defaultSelect],
    year: defaultSelect,
    term: defaultSelect,
    paperType: defaultSelect,
    examType: defaultSelect,
    province: defaultSelect,
    city: defaultSelect,
    county: defaultSelect,
    difficulty: defaultSelect,
    knowledgeType: defaultSelect,
    questionType: defaultSelect,
    schoolType: 4,
    updatedTime: '',           // 时间排序，DESC：倒叙；ASC：正序。
    quoteCount: '',               // 使用次数排序
    saveGrade: [defaultSelect],
    saveSubject: [defaultSelect],
  },
  // 记录作业制作进度以及相关的参数
  createHomeworkStepParams: {
    homeworkStep: 1,
    showStepOneAnalyze: false,
    showStepTwoAnalyze: false,
    showStepThreeAnalyze: false,
    questionListLoadingOver: false,
    questionDataList: [],
    questionTotal: 0,
    homeworkSkep: [],
    homeworkDiff: { id: 2, name: '中档' },
    homeworkDiffList: [{ id: 1, name: '基础' }, { id: 2, name: '中档' }, { id: 3, name: '困难' }],
    // homeworkName: { knowledge: '', diff: '' },
    homeworkName: '',
    selectedItem: {},             // 当前点击选中的题号对应的题目
    AIChangeQuestionTarget: {},   // 要被替换掉的题目
    isLoadingChangeItem: true,    // 是否正在获取 10 道用于筛选的题目
    AIChangeQuestionList: [],     // 换题用于筛选的 10 道题
    schoolType: '4' // 类型 只在学堂作业用
  },
  // 预览作业相关参数
  previewHomework: {
    showAnalysis: false,
    isOpen: false,
    homeworkDataList: {},
    homeworkId: -1,
  },
  gradeList: [],
  isReEditHomeWork: false, // 是否为修改当前作业
  reEditHomework: {},      // 正在被修改作业的数据
  // 增加智能作业
  homeworkType: 1, // 1 手动制作；2 智能作业, 默认状态为 1 ，如果不是请将其修改为 1.
  AIHomeworkParams: {
    state: 1,                     // 当前状态，1：表单选择，2：题目编辑。  // 记得默认值为 1 才对
    AIknowledgeList: [],          // 选中的知识点
    investigateScope: 2,          // 考察范围
    gradeId: 0,                   // 使用年级
    termId: 0,                    // 使用学期
    questionTypeList: [],         // 题型题量设置
    isGettingAIHWQuestionList: true,
    difficulty: 2,                // 题目难度
    // 上面为组作业搜索题目时所用
    // 下面为保存作业时才需要的数据
    grade: '',                    // 当前作业是几年级的 string[CN]
    subject: '',                  // 当前作业的所属学科 sting[CN]
    selectCourseSystem: {         // 当前选中的课程点
      id: 0, name: '',
    },
    homeworkDiff: {               // 当前作业难度
      id: 2,
      name: '中档'
    },
    csId: 0,                      // 课程点 Id
    csName: '',                   // 课程点 name，用于在自动命名作业名时用到
    homeworkName: '',             // 作业标题
    AIHWQuestionList: [],         // 智能作业返回题目
    isSaveAIHomeworking: false,   // 正在提交作业
    selectedItem: {},             // 当前点击选中的题号对应的题目
    AIChangeQuestionTarget: {},   // 要被替换掉的题目
    isLoadingChangeItem: true,    // 是否正在获取 10 道用于筛选的题目
    AIChangeQuestionList: [],     // 换题用于筛选的 10 道题
  },
  classTypeCode: '',
  sliderState: '1', // 选题的类型 1: 知识点选题  2: 教材目录选题
});

function schoolHomeWorkReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case CAHNGE_PAGE_STATE:
      return state.setIn(['pageState', action.key], action.value);
    case SET_PREVIEW_SELECT_OBJ_ACTION:
      return state.set('prviewSelectObj', action.item);
    case SET_SEARCH_PARAMS_ACTION:
      return state.set('serachParams', action.item);
    case SET_SEARCH_QUESTION_PARAMS_ACTION:
      return state.set('searchQuestionParams', action.item);
    case SET_SEARCH_QUESTION_PARAMS_ITEM_ACTION:
      return state.setIn(['searchQuestionParams', action.attr], action.item);
    case SET_CREATE_HOMEWORK_STEP_PARAMS_ACTION:
      return state.set('createHomeworkStepParams', action.item);
    case SET_CREATE_HOMEWORK_STEP_PARAMS_ITEM_ACTION:
      return state.set('createHomeworkStepParams', state.get('createHomeworkStepParams').set(action.AItype, action.item));
    case SET_PREVIEW_HOMEWORK_DATA_LIST_ACTION:
      return state.set('previewHomework', action.item);
    case SET_ALL_GRADE_LIST_ACTION:
      return state.set('gradeList', action.item);
    case CHANGE_IS_REEDIT_HOMEWORK_ACTION:
      return state.set('isReEditHomeWork', action.bol);
    case SAVE_RE_EDIT_HOMEOWK_ACTION:
      return state.set('reEditHomework', action.item);
    case CHANGE_HOMEWORK_TYPE_ACTION:
      return state.set('homeworkType', action.num);
    case SET_AI_HOMEWORK_PARAMS_ITEM_ACTION:
      return state.set('AIHomeworkParams', state.get('AIHomeworkParams').set(action.AItype, action.item));
    case SET_AI_HOMEWORK_PARAMS_ACTION:
      return state.set('AIHomeworkParams', action.item);
    case INIT_DATA_WHEN_CLOSE_ACTION: // eslint-disable-line
      const searchQuestionParams = state.get('searchQuestionParams');
      // const createHomeworkStepParams = state.get('createHomeworkStepParams');
      // const homeworkName = createHomeworkStepParams.get('homeworkName');
      const prviewSelectObj = state.get('prviewSelectObj');
      const createHomeworkStepParams = state.get('createHomeworkStepParams');
      const newCreateHomeworkStepParams = createHomeworkStepParams
        .set('homeworkStep', 1)
        .set('showStepOneAnalyze', false)
        .set('showStepTwoAnalyze', false)
        .set('showStepThreeAnalyze', false)
        .set('questionListLoadingOver', false)
        .set('questionDataList', fromJS([]))
        .set('questionTotal', 0)
        .set('homeworkSkep', fromJS([]))
        .set('homeworkName', `${prviewSelectObj.getIn(['selectTree', 'name'])}--中档`)
        .set('homeworkDiff', fromJS({ id: 2, name: '中档' }));
      const newSearchQuestionParams = searchQuestionParams
        .set('showCreateHomeworkModal', false)
        .set('pageIndex', 1);
      const newPreviewHomework = fromJS({
        showAnalysis: false,
        isOpen: false,
        homeworkDataList: {},
        homeworkId: -1,
      });
      const AIHomeworkParams = state.get('AIHomeworkParams');
      const newAIHomeworkParams = AIHomeworkParams
        .set('state', 1)
        .set('AIknowledgeList', fromJS([]))
        .set('homeworkName', `${AIHomeworkParams.getIn(['selectCourseSystem', 'name'])}--${AIHomeworkParams.get('homeworkDiff').get('name')}`)
        .set('isSaveAIHomeworking', false);
      const newState = state
        .set('searchQuestionParams', newSearchQuestionParams)
        .set('createHomeworkStepParams', newCreateHomeworkStepParams)
        .set('previewHomework', newPreviewHomework)
        .set('isReEditHomeWork', false)
        .set('homeworkType', 1)
        .set('sliderState', '1')
        .set('AIHomeworkParams', newAIHomeworkParams);
      return newState;
    case CLASS_TYPE_CODE:
      return state.set('classTypeCode', action.code);
    case SET_SLIDER_STATE:
      return state.set('sliderState', action.state);
    case RESET_STATE:
      return initialState;
    default:
      return state;
  }
}

export default schoolHomeWorkReducer;
