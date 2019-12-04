/*
 *
 * PaperCutVerify reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  CHANGE_PAGE_STATE_ACTION,
  CHANGE_IMG_SRC_ACTION,
  CHANGE_PAPER_STATE_ACTION,
  CHANGE_ALERT_SHOW_OR_HIDE_ACTION,
  SET_PAPER_LIST_ACTION,
  CHANGE_NOT_GET_PAPER_COUNT_ACTION,
  CHANGE_HAS_GET_PAPER_COUNT_ACTION,
  CHANGE_CURRENT_PAPER_ITEM_ACTION,
  CHANGE_NEED_VERIFY_PAPER_ID_ACTION,
  CHANGE_NEED_VERIFY_PAPER_ITEM_ACTION,
  CHANGE_SELECTED_QUESTION_INDEX_ACTION,
  CHANGE_QUESTION_LIST_ACTION,
  CHANGE_QUESTION_MSG_LIST_ACTION,
  CHANGE_PREVIEW_IMG_SRC_ACTION,
  SET_ALL_QUESTION_TYPE_LIST_ACTION,
  CHANGE_ERR_TEXTAREA_SHOW_ACTION,
  CHANGE_QUESTION_RESULT_ACTION,
  CHANGE_REAL_QUESTION_COUNT_ACTION,
  CHANGE_QUESTION_RESULT_STATE_ACTION,
  CHANGE_PAGE_INDEX_ACTION,
  CHANGE_SORT_ACTION,
  INIT_VERIFY_DATA_ACTION,
  SET_PAPER_DOWNLOAD_MSG_ACTION,
  CHANGE_SHOW_SUBMIT_BTN_ACTION,
} from './constants';

const loading = window._baseUrl.imgCdn + '02f36e7d-35d2-4a79-a407-847ed60a6923.gif';

const initialState = fromJS({
  pageState: 0,  // 领取页面还是审核页面
  pageIndex: 1,  // 当前页数
  pageSize: 20,  // 每页条数
  paperState: 2,  // 试卷状态页面 已领取、未领取...
  sort: 0,       // 排序方式(0: 默认排序， 1：时间排序)
  subjectId: -1,
  gradeId: -1,
  imgSrc: `${loading}`,
  alertShowOrHide: false,  // 领取审核任务的弹框的状态
  paperList: [],  // 表格中试卷列表
  notGetPaperCount: 0,  // 未领取试卷总数
  hasGetPaperCount: 0,  // 已领取试卷总数
  currentPaperItem: {},  // 选中要领取的试卷项
  questionTypeList: [],  // 所有题型列表
  //
  needVerifyPaper: {},  // 要审核的试卷
  questionSelectedIndex: 0,  // 当前选中的题号
  questionsList: [],  // 所有题目的信息
  questionMsgList: [],  // 大题的信息
  previewImgSrc: `${loading}`, // 要预览的图片的 src
  questionResult: [],  // 所有题目错误信息所在
  errTextareaShow: false,  // 是否显示错误输入框
  realQuestionsCount: 0,  // 实际获取到的题目数量
  questionResultState: -1,  // 当前题目正确与否状态，-1:无状态、0:错误、1正确
  paperDownloadMsg: {},  // 下载试卷所需数据
  showSubmitBtn: false,
});

function paperCutVerifyReducer(state = initialState, action) { // eslint-disable-line
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case CHANGE_PAGE_STATE_ACTION:
      return state.set('pageState', action.num);
    case CHANGE_IMG_SRC_ACTION:
      return state.set('imgSrc', action.str);
    case CHANGE_PAPER_STATE_ACTION:
      return state.set('paperState', action.num);
    case CHANGE_ALERT_SHOW_OR_HIDE_ACTION:
      return state.set('alertShowOrHide', action.bol);
    case SET_PAPER_LIST_ACTION:
      return state.set('paperList', action.item);
    case CHANGE_NOT_GET_PAPER_COUNT_ACTION:
      return state.set('notGetPaperCount', action.num);
    case CHANGE_HAS_GET_PAPER_COUNT_ACTION:
      return state.set('hasGetPaperCount', action.num);
    case CHANGE_CURRENT_PAPER_ITEM_ACTION:
      return state.set('currentPaperItem', action.item);
    case CHANGE_NEED_VERIFY_PAPER_ID_ACTION:
      return state.set('needVerifyPaper', action.num);
    case CHANGE_NEED_VERIFY_PAPER_ITEM_ACTION:
      return state.set('needVerifyPaper', action.item);
    case CHANGE_SELECTED_QUESTION_INDEX_ACTION:
      return state.set('questionSelectedIndex', action.num);
    case CHANGE_QUESTION_LIST_ACTION:
      return state.set('questionsList', action.item);
    case CHANGE_QUESTION_MSG_LIST_ACTION:
      return state.set('questionMsgList', action.item);
    case CHANGE_PREVIEW_IMG_SRC_ACTION:
      return state.set('previewImgSrc', action.str);
    case SET_ALL_QUESTION_TYPE_LIST_ACTION:
      return state.set('questionTypeList', action.item);
    case CHANGE_ERR_TEXTAREA_SHOW_ACTION:
      return state.set('errTextareaShow', action.bol);
    case CHANGE_QUESTION_RESULT_ACTION:
      return state.set('questionResult', action.item);
    case CHANGE_REAL_QUESTION_COUNT_ACTION:
      return state.set('realQuestionsCount', action.num);
    case CHANGE_QUESTION_RESULT_STATE_ACTION:
      return state.set('questionResultState', action.num);
    case CHANGE_PAGE_INDEX_ACTION:
      return state.set('pageIndex', action.num);
    case CHANGE_SORT_ACTION:
      return state.set('sort', action.num);
    case SET_PAPER_DOWNLOAD_MSG_ACTION:
      return state.set('paperDownloadMsg', action.item);
    case CHANGE_SHOW_SUBMIT_BTN_ACTION:
      return state.set('showSubmitBtn', action.bol);
    case INIT_VERIFY_DATA_ACTION:
      return state.set('needVerifyPaperId', -1)
        .set('questionSelectedIndex', 0)
        .set('questionsList', fromJS([]))
        .set('questionMsgList', fromJS([]))
        .set('previewImgSrc', `${loading}`)
        .set('questionResult', fromJS([]))
        .set('errTextareaShow', false)
        .set('realQuestionsCount', 0)
        .set('questionResultState', -1)
        .set('paperDownloadMsg', fromJS({}));
    default:
      return state;
  }
}

export default paperCutVerifyReducer;
