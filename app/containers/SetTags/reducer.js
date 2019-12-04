/*
 *
 * SetTags reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  SET_INPUTDTO_ACTION,
  SET_EDITION_LIST_ACTION,
  SET_COURSE_SYSTEM,
  SET_COURSE_CHECKED,
  SET_MODAL_TOGGLE,
  CHANGE_PAPER_STATE_ACTION,
  CHANGE_NOT_GET_PAPER_COUNT_ACTION,
  CHANGE_HAS_GET_PAPER_COUNT_ACTION,
  SET_PAPER_LIST_ACTION,
  SET_EP_ID,
  // GET_CUR_PAPER,
  SET_QUESTION_LIST,
  SET_QUESTION_INDEX,
  CHANGE_PAGE_STATE,
  NEXT_QUES_ACTION,
  SET_COMMON_INFO,
  SET_QUESTION_LIST_ORIGIN,
  // SET_FINISHED_LIST,
  SET_PAPER_TITLE,
  SET_TO_GET,
  TOGGLE_DIALOG_MODAL,
  SET_PAGE_INDEX,
  // SET_PAGE_SIZE,
  SET_SORT,
  SET_PAPER_DOWNLOAD_MSG_ACTION,
  SET_EXAMPOINT_LIST,
  SET_KNOWLEDGE_LIST,
  CHANGE_IS_OPEN_CHILDREN_TAGS_ACTION,
  CHANGE_CHILDREN_SELECTED_INDEX_ACTION,
  SET_CHILDREN_QUESTION_MSG_ACTION,
  SET_QUESTION_TYPE_LIST_ACTION,
  SET_BIG_MSG_ACTION,
  SET_CHILDREN_TAGS_ACTION,
  SET_SHOW_QUESTION_TREE_ACTION,
  SEE_PAPER_VERIFY_RESULT_ACTION,
  SET_PAPER_MSG_ACTION,
  SET_TAGS_MEMORY_ACTION,
  SET_HIGHLIGHT_ITEM_ACTION,
  INIT_HIGHLIGHT_ITEM_ACTION,
  SET_POINT_ID_LIST_ACTION,
  SELECT_PAPEER_STATE_ACTION,
} from './constants';

const initialState = fromJS({
  modal: false,
  alert: false,
  epid: 65,
  toGet: 0,
  pageState: 0,   // 0: 表格页面；1: 审核页面
  paperTitle: '',
  paperState: 8,  // 试卷状态页面 已领取、未领取...
  paperList: [],
  pageSize: 20,
  pageIndex: 1,
  sort: 0,
  hasGetPaperCount: 0,
  notGetPaperCount: 0,
  commonInfo: {},
  editionList: [],
  courseSystem: [],
  questionList: [],
  questionListOrigin: [],
  questionIndex: 1,
  examPointList: [],
  knowledgeList: [],
  // courseChecked:{fullChecked:[],halfChecked:[],checkedNodes:[]},
  // finished:[],
  inputDTO: {
    questionId: '',
    difficulty: 1,
    distinction: 1,
    recommendationIndex: 3,
    rating: 1,
    chapterIdList: [],
    keywordList: '',
    comprehensiveDegreeId: '1',
    editionIdList: [],
    subjectCharacteristicIdList: ['1'],
    abilityIdList: ['1'],
    coreLiteracyIdList: ['1'],
    courseSystemIdList: [],
    examPointIdList: [],
    knowledgeIdList: [],
    tagExamPaperSubQuesInputDTOList: null,
    showTextArea: false,
    errReason: '',
  },
  paperDownloadMsg: {},  // 下载试卷所需数据
  isOpenChildrenTags: false,
  childrenSelectedIndex: 1,
  childrenQuestionMsg: [],
  childrenTags: [],
  questionTypeList: [],
  bigMsg: [],
  showTree: {
    itemTree: true,
    childrenTrree: true,
  },
  paperVerifyRes: [],
  paperMsg: {},
  childrenTagsMemory: [],
  highlightItem: {
    knowledgeKeyword: '',
    knowledgeExpandedKeys: [],
    knowledgeAutoExpandParent: true,
    exampointKeyword: '',
    examPointExpandedKeys: [],
    examPointAutoExpandParent: true,
    childKnowledgeKeyword: '',
    childKnowledgeExpandedKeys: [],
    childKnowledgeAutoExpandParent: true,
    childExampointKeyword: '',
    childExamPointExpandedKeys: [],
    childExamPointAutoExpandParent: true,
    showTextArea: false,
    errReason: '',
  },
  pointIdList: {
    knowledgeIdList: [],
    examPointIdList: [],
  },
  selectedPaperStateIndex: 1, // 表格头部的领取、已领取
});

// eslint-disable-next-line complexity
function setTagsReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_INPUTDTO_ACTION:
      return state.set('inputDTO', action.inputDTO);
    case SET_EDITION_LIST_ACTION:
      return state.set('editionList', action.list);
    case SET_COURSE_SYSTEM:
      return state.set('courseSystem', action.list);
    case SET_COURSE_CHECKED:
      return state.set('courseChecked', action.obj);
    case SET_MODAL_TOGGLE:
      return state.set('modal', !state.get('modal'));
    case CHANGE_PAPER_STATE_ACTION: {
      let res = state.set('paperState', action.num);
      if (state.get('paperState') !== action.num) {
        res = res.set('pageIndex', 1);
      }
      return res;
    }
    case CHANGE_PAGE_STATE:
      return state.set('pageState', action.num);
    case CHANGE_NOT_GET_PAPER_COUNT_ACTION:
      return state.set('notGetPaperCount', action.num);
    case CHANGE_HAS_GET_PAPER_COUNT_ACTION:
      return state.set('hasGetPaperCount', action.num);
    case SET_PAPER_LIST_ACTION:
      return state.set('paperList', action.item);
    case SET_QUESTION_LIST:
      return state.set('questionList', action.list);
    case SET_QUESTION_INDEX:
      return state.set('questionIndex', action.index);
    case SET_EP_ID:
      return state.set('epid', action.epid);
    case NEXT_QUES_ACTION:
      return state.set('questionIndex', action.index);
    case SET_COMMON_INFO:
      return state.set('commonInfo', action.obj);
    case SET_QUESTION_LIST_ORIGIN:
      return state.set('questionListOrigin', action.list);
    // case SET_FINISHED_LIST :
    //   return state.set('SET_FINISHED_LIST',action.list)
    case SET_PAPER_TITLE:
      return state.set('paperTitle', action.str);
    case SET_TO_GET:
      return state.set('toGet', action.num);
    case TOGGLE_DIALOG_MODAL:
      return state.set('alert', action.bool);
    case SET_PAGE_INDEX:
      return state.set('pageIndex', action.obj.page || 1).set('pageSize', action.obj.size || state.get('pageSize'));
    case SET_SORT:
      return state.set('sort', action.num);
    case SET_PAPER_DOWNLOAD_MSG_ACTION:
      return state.set('paperDownloadMsg', action.item);
    case SET_EXAMPOINT_LIST:
      return state.set('examPointList', action.list);
    case SET_KNOWLEDGE_LIST:
      return state.set('knowledgeList', action.list);
    case CHANGE_IS_OPEN_CHILDREN_TAGS_ACTION:
      return state.set('isOpenChildrenTags', action.bol);
    case CHANGE_CHILDREN_SELECTED_INDEX_ACTION:
      return state.set('childrenSelectedIndex', action.num);
    case SET_CHILDREN_QUESTION_MSG_ACTION:
      return state.set('childrenQuestionMsg', action.item);
    case SET_QUESTION_TYPE_LIST_ACTION:
      return state.set('questionTypeList', action.item);
    case SET_BIG_MSG_ACTION:
      return state.set('bigMsg', action.item);
    case SET_CHILDREN_TAGS_ACTION:
      return state.set('childrenTags', action.item);
    case SET_SHOW_QUESTION_TREE_ACTION:
      return state.set('showTree', action.item);
    case SEE_PAPER_VERIFY_RESULT_ACTION:
      return state.set('paperVerifyRes', action.item);
    case SET_PAPER_MSG_ACTION:
      return state.set('paperMsg', action.item);
    case SET_TAGS_MEMORY_ACTION:
      return state.set('childrenTagsMemory', action.item);
    case SET_HIGHLIGHT_ITEM_ACTION:
      return state.set('highlightItem', action.item);
    case SET_POINT_ID_LIST_ACTION: {
      const pointIdList = state.get('pointIdList');
      const newPointIdList = pointIdList.set(action.idType, action.item);
      return state.set('pointIdList', newPointIdList);
    }
    case SELECT_PAPEER_STATE_ACTION:
      return state.set('selectedPaperStateIndex', action.num);
    case INIT_HIGHLIGHT_ITEM_ACTION:
      return state.set('highlightItem', fromJS({
        knowledgeKeyword: '',
        knowledgeExpandedKeys: [],
        knowledgeAutoExpandParent: true,
        exampointKeyword: '',
        examPointExpandedKeys: [],
        examPointAutoExpandParent: true,
        childKnowledgeKeyword: '',
        childKnowledgeExpandedKeys: [],
        childKnowledgeAutoExpandParent: true,
        childExampointKeyword: '',
        childExamPointExpandedKeys: [],
        childExamPointAutoExpandParent: true,
      }));
    default:
      return state;
  }
}

export default setTagsReducer;
