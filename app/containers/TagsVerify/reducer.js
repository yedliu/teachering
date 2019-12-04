/*
 *
 * TagsVerify reducer
 *
 */
import { toNumber, filterTreeNode } from 'components/CommonFn';

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
  SET_QUESTION_LIST,
  SET_QUESTION_INDEX,
  CHANGE_PAGE_STATE,
  NEXT_QUES_ACTION,
  SET_COMMON_INFO,
  SET_QUESTION_LIST_ORIGIN,
  SET_PAPER_TITLE,
  SET_TO_GET,
  TOGGLE_DIALOG_MODAL,
  SET_PAGE_INDEX,
  SET_RESULT,
  SET_SORT,
  SET_PAPER_DOWNLOAD_MSG_ACTION,
  SET_EXAMPOINT_LIST,
  SET_KNOWLEDGE_LIST,
  CHANGE_SHOW_SUBMIT_BTN_ACTION,
  SET_CURRENT_PAPER_DATA,
  SET_QUESTION_MSG_LIST_ACTION,
  SET_QUESTIONS_LIST_ACTION,
  CHANGE_QUESTIONS_INDEX_ACTION,
  CHANGE_SHOW_CHILDREN_VERIFY_ACTION,
  CHANGE_CHILDREN_SELECT_INDEX_ACTION,
  SET_SHOW_QUESTION_TREE_ACTION,
  SET_POINT_ID_LIST_ACTION,
  FILTER_POINT_ACTION,
} from './constants';

const initialState = fromJS({
  modal: false,
  alert: false,
  epid: {},  // 要审核的试卷的信息，用于获取试卷具体内容的
  toGet: 0,
  pageState: 0,  // 0: 表格页面；1: 审核页面
  paperTitle: '',
  paperState: 10,  // 试卷状态页面 已领取、未领取...
  paperList: [],
  pageSize: 20,
  pageIndex: 1,
  sort: 0,
  hasGetPaperCount: 0,
  notGetPaperCount: 0,
  commonInfo: {
    gradeId: 2,
    subjectId: 2,
  },
  editionList: [],
  courseSystem: [],
  questionList: [],
  questionListOrigin: [],
  questionIndex: 1,
  examPointList: [],
  knowledgeList: [],
  result: [],
  inputDTO: {
    questionId: '',
    difficulty: {},
    distinction: {},
    recommendationIndex: {},
    rating: {},
    keywordList: {},
    subjectCharacteristicIdList: {},
    abilityIdList: {},
    coreLiteracyIdList: {},
    comprehensiveDegreeId: {},
    courseSystemIdList: {},
    examPointIdList: {},
    knowledgeIdList: {},
  },
  paperDownloadMsg: {},  // 下载试卷所需数据
  showSubmitBtn: false,
  currentPaperData: {},
  bigQuestionMsg: [],
  questionsList: [],
  questionsIndex: 0,
  verifyTagsSelectDrop: {
    difficulty: 0,
    distinction: 0,
    comprehensiveDegreeId: 0,
    rating: 0,
    knowledgeIdList: [],
    examPointIdList: [],
  },
  showChildrenVerify: false,
  childrenSelectIndex: 0,
  showTree: {
    itemTree: true,
    childrenTree: true,
  },
  pointIdList: {
    knowledgeIdList: [],
    examPointIdList: [],
  },
});

// eslint-disable-next-line complexity
function tagsVerifyReducer(state = initialState, action) {
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
    case CHANGE_PAPER_STATE_ACTION:
      return state.set('paperState', action.num).set('pageIndex', 1);
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
    case SET_PAPER_TITLE:
      return state.set('paperTitle', action.str);
    case SET_TO_GET:
      return state.set('toGet', action.num);
    case TOGGLE_DIALOG_MODAL:
      return state.set('alert', action.bool);
    case SET_PAGE_INDEX:
      return state.set('pageIndex', action.obj.page || 1).set('pageSize', action.obj.size || state.get('pageSize'));
    case SET_RESULT:
      return state.set('result', action.list);
    case SET_SORT:
      return state.set('sort', action.num);
    case SET_PAPER_DOWNLOAD_MSG_ACTION:
      return state.set('paperDownloadMsg', action.item);
    case SET_EXAMPOINT_LIST:
      return state.set('examPointList', action.list);
    case SET_KNOWLEDGE_LIST:
      return state.set('knowledgeList', action.list);
    case CHANGE_SHOW_SUBMIT_BTN_ACTION:
      return state.set('showSubmitBtn', action.bol);
    case SET_CURRENT_PAPER_DATA:
      return state.set('currentPaperData', action.item);
    case SET_QUESTION_MSG_LIST_ACTION:
      return state.set('bigQuestionMsg', action.item);
    case SET_QUESTIONS_LIST_ACTION:
      return state.set('questionsList', action.item);
    case CHANGE_QUESTIONS_INDEX_ACTION:
      return state.set('questionsIndex', action.num);
    case CHANGE_SHOW_CHILDREN_VERIFY_ACTION:
      return state.set('showChildrenVerify', action.bol);
    case CHANGE_CHILDREN_SELECT_INDEX_ACTION:
      return state.set('childrenSelectIndex', action.num);
    case SET_SHOW_QUESTION_TREE_ACTION:
      return state.set('showTree', action.item);
    case SET_POINT_ID_LIST_ACTION:
      return state.set('pointIdList', state.get('pointIdList').set(action.idType, action.item));
    // eslint-disable-next-line no-case-declarations
    case FILTER_POINT_ACTION:
      const pointIdList = state.get('pointIdList');
      const pointItemList = pointIdList.get(action.idType).toJS();
      const questionsList = state.get('questionsList');
      const newQuesitonsList = questionsList.map((item) => {
        const tags = item.getIn(['questionOutputDTO', 'questionTag']) || fromJS({});
        const itemIdList = (tags.get(action.idType) || fromJS([])).toJS();
        const newpointIdList = filterTreeNode(pointItemList, itemIdList.map((it) => toNumber(it)));
        // console.log(action.idType, newpointIdList, itemIdList, pointItemList);
        let newItem = item.setIn(['questionOutputDTO', 'questionTag', action.idType], fromJS(newpointIdList));
        const children = tags.get('children');
        if (children && children.count() > 0) {
          const newChildren = children.map((it) => {
            const childPointList = it.get(action.idType).toJS();
            const newChildPointList = filterTreeNode(pointItemList, childPointList.map((iit) => toNumber(iit)));
            return it.set(action.idType, fromJS(newChildPointList));
          });
          newItem = newItem.setIn(['questionOutputDTO', 'questionTag', 'children'], newChildren);
        }
        return newItem;
      });
      // console.log(pointIdList.toJS(), newQuesitonsList.toJS(), 'newQuesitonsList');
      return state.set('questionsList', newQuesitonsList);
    default:
      return state;
  }
}

export default tagsVerifyReducer;
