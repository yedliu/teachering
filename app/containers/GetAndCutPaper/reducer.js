/*
 *
 * GetAndCutPaper reducer
 *
 */

import { fromJS } from 'immutable';
import {
  // DEFAULT_ACTION,
  CHANGE_PAGE_STATE_ACTION,
  PREVIEW_WRAPPER_SHOW_OR_HIDE_ACTION,
  CHANGE_SELECTED_QUESTION_INDEX_ACTION,
  CHANGE_IMGSRC_ACTION,
  CHANGE_CURRENT_CUT_PAPER_IMG_ACTION,
  CHANGE_PAGE_INDEX_ACTION,
  CHANGE_PAPER_STATE_ACTION,
  CHANGE_SUBJECT_ID_ACTION,
  CHANGE_GRADE_ID_ACTION,
  CHANGE_ALERT_SHOW_OR_HIDE_ACTION,
  CHANGE_CURRENT_PAPER_ITEM_ACTION,
  SET_PAPER_LIST_ACTION,
  CHANGE_PAPER_COUNT_ACTION,
  CHANGE_HAS_GET_PAPER_COUNT_ACTION,
  CHANGE_NEED_CUT_PAPER_ID_ACTION,
  SET_PIC_URL_LIST_ACTION,
  CHANGE_PAPER_IS_BE_CUT_ITEM_ACTION,
  SET_CANVAS_DOM_ACTION,
  SET_ALL_QUESTION_TYPE_LIST_ACTION,
  CHANGE_SELECTED_QUESTION_TYPE_ACTION,
  SET_SMALL_QUESTION_ACTION,
  SAVE_QUESTION_MSG_LIST_ACTION,
  SAVE_QUESTION_LIST_ACTION,
  CHANGE_QUESTION_PREVIEW_SHOW_ACTION,
  CHANGE_PREVIEW_IMG_SRC_ACTION,
  CHANGE_PAPER_PREVIEW_SHOW_ACTION,
  BACK_INIT_DATA_ACTION,
  CHANGE_IS_SUBMIT_ING_ACTION,
  CHANGE_ALERT_STATES_ACTION,
  CHANGE_SORT_ACTION,
  CHANGE_IMG_START_INDEX_ACTION,
  // SET_SELECT_INSERT_WAY_ACTION,
  SET_SELECT_BIG_QUESTION_ACTION,
  SET_SELECTED_INDEX_ACTION,
  SET_SELECTED_INSERT_INDEX_ACTION,
  SET_BIG_QUESTION_MSG_ACTION,
  SET_EDITOR_BIG_QUESTION_ACTION,
  IMG_COUNT_CRITICAL_ACTION,
  IMG_IMG_STEP_ACTION,
  SET_PIC_INPUT_DTO_LIST_ACTION,
  CHANGE_BIG_PIC_INDEX_ACTION,
  ADD_BIG_IMG_ACTION,
  SET_NEED_CUT_PAPER_ACTION,
} from './constants';
const loading = window._baseUrl.imgCdn + '02f36e7d-35d2-4a79-a407-847ed60a6923.gif';
// console.log(loading, 'loading - loading');

const initialState = fromJS({
  pageState: 0,  // 领取页面还是切割页面
  notGetPaperCount: 0,  // 未领取试卷总数
  hasGetPaperCount: 0,  // 已领取试卷总数
  pageSize: 20,  // 每页条数
  pageIndex: 1,  // 当前页数
  sort: 0,       // 排序方式(0: 默认排序， 1：时间排序)
  // userRole: 1,  // 试卷切割人
  paperState: 0,  // 试卷状态页面 已领取、未领取...
  subjectId: -1,  // 学科 id
  gradeId: -1,  // 年级 id
  previewShowOrHide: false,  // 预览切割弹框显示状态
  alertShowOrHide: false,  // 领取任务弹框显示状态
  //
  currentCutPaperImg: '',  // 当前要切割的图片的 src
  paperList: [],  // 表格数据列表
  questionTypeList: [],  // 题型列表，用于选择题型
  questionPreviewShow: false,  // 题目预览弹框状态
  paperPreviewMsgShow: false,  // 试卷信息预览弹窗状态
  //
  questionSelectedIndex: 0,  // 右边题号选中的第 几 题
  currentPaperItem: -1,  // 要领取的试卷的项
  needCutPaperId: -1,  // 需要被切割的试卷的 id
  questionsList: [],  // 试卷大题数据 [{}, {}, {}] 每一个对象对应一个大题，包含大题序号、大题名称、大题中小题数量
  paperIsBeCutItem: {},  // 正在被切割的题目
  canvasDOM: {},  // canvas DOM，暂时无用
  imgSrc: `${loading}`,  // 要显示在切割板上面的图片
  picUrlList: [],  // 试卷的所有图片
  selectedTquestionType: { id: -1, name: '请选择题型' },  // 选择正在被切割的题目的题型
  // bigQuestion: { serialNumber: '', name: '' },  // 当前大题信息
  smallQuestion: { serialNumber: '', questionTypeId: '', picUrl: '' },  // 当前切割小题的信息
  questionMsgList: [],  // 所有题目的信息
  previewImgSrc: '',  // 预览图片的 src
  //
  isSubmitIng: false,  // 提交时弹框状态
  alertStates: {
    buttonsType: '',
    imgType: '',
    title: '试卷上传中...',
  },  // 用于改变提交弹框的显示内容及功能
  //
  imgCountCritical: 10,  // 展示图片数量的临界值（当前展示几张图片）
  imgStartIndex: 0,  // 当图片数量大于翻页界限值的时候记录当前加载到第多少张图片用
  imgStep: 8,  // 一次翻页翻几张。 imgCountCritical - imgStep 为重复页数
  bigPicIndex: 0, // 当前时第几张大图
  //
  selectedBigQuestion: { name: '请选择大题', id: '-1' },  // 当前切割的图片所要放入的大题
  // selectInsertWayList: [{ name: '在大题最后追加', id: '0' }, { name: '插入到指定位置', id: '1' }],
  // selectedInsertWay: { name: '在大题最后追加', id: '0' },  // 当前图片的小题以何种方式放入大体中
  selectedIndex: { selectedBigIndex: -1, selectedSmallIndex: -1, itemIndex: -1, smallItem: {}},  // 切割时选择的大题与小题的 index
  selectedInsertIndex: { name: '请先选择大题', id: '-1' },  // 选中的插入位置
  setBigQuestionMsgShow: false,  // 大题信息弹框状态
  //
  editorBigQuestion: { name: '请选择大题', id: '-1', value: '' },
  picInputDTOList: [],  // 保存切割时大图相关数据
  needCutPaperMsg: {},  // 要切割的试卷的信息
});

function getAndCutPaperReducer(state = initialState, action) { // eslint-disable-line
  switch (action.type) {
    // case DEFAULT_ACTION:
    //   return state;
    case CHANGE_PAGE_STATE_ACTION:
      return state.set('pageState', action.num);
    case PREVIEW_WRAPPER_SHOW_OR_HIDE_ACTION:
      return state.set('previewShowOrHide', action.bol);
    case CHANGE_SELECTED_QUESTION_INDEX_ACTION:
      return state.set('questionSelectedIndex', action.num);
    case CHANGE_IMGSRC_ACTION:
      return state.set('imgSrc', action.str);
    case CHANGE_CURRENT_CUT_PAPER_IMG_ACTION:
      return state.set('currentCutPaperImg', action.str);
    case CHANGE_PAGE_INDEX_ACTION:
      return state.set('pageIndex', action.num);
    case CHANGE_PAPER_STATE_ACTION:
      return state.set('paperState', action.num);
    case CHANGE_SUBJECT_ID_ACTION:
      return state.set('subjectId', action.num);
    case CHANGE_GRADE_ID_ACTION:
      return state.set('gradeId', action.num);
    case CHANGE_ALERT_SHOW_OR_HIDE_ACTION:
      return state.set('alertShowOrHide', action.bol);
    case CHANGE_CURRENT_PAPER_ITEM_ACTION:
      return state.set('currentPaperItem', action.num);
    case SET_PAPER_LIST_ACTION:
      return state.set('paperList', action.item);
    case CHANGE_PAPER_COUNT_ACTION:
      return state.set('notGetPaperCount', action.num);
    case CHANGE_HAS_GET_PAPER_COUNT_ACTION:
      return state.set('hasGetPaperCount', action.num);
    //
    case CHANGE_NEED_CUT_PAPER_ID_ACTION:
      return state.set('needCutPaperId', action.num);
    case SET_PIC_URL_LIST_ACTION:
      return state.set('picUrlList', action.item);
    case CHANGE_PAPER_IS_BE_CUT_ITEM_ACTION:
      return state.set('paperIsBeCutItem', action.item);
    case SET_CANVAS_DOM_ACTION:
      return state.set('canvasDOM', action.item);
    case SET_ALL_QUESTION_TYPE_LIST_ACTION:
      return state.set('questionTypeList', action.item);
    case CHANGE_SELECTED_QUESTION_TYPE_ACTION:
      return state.set('selectedTquestionType', action.item);
    // case CHANGE_BIG_QUESTION_ACTION:
    //   return state.set('bigQuestion', action.item);
    case SET_SMALL_QUESTION_ACTION:
      return state.set('smallQuestion', action.item);
    case SAVE_QUESTION_MSG_LIST_ACTION:
      return state.set('questionMsgList', action.item);
    case SAVE_QUESTION_LIST_ACTION:
      return state.set('questionsList', action.item);
    case CHANGE_QUESTION_PREVIEW_SHOW_ACTION:
      return state.set('questionPreviewShow', action.bol);
    case CHANGE_PREVIEW_IMG_SRC_ACTION:
      return state.set('previewImgSrc', action.str);
    case CHANGE_PAPER_PREVIEW_SHOW_ACTION:
      return state.set('paperPreviewMsgShow', action.bol);
    case BACK_INIT_DATA_ACTION:
      return state.set('selectedTquestionType', fromJS({ id: -1, name: '请选择题型' }))
        .set('questionMsgList', fromJS([]))
        .set('questionsList', fromJS([]))
        .set('picInputDTOList', fromJS([]))
        .set('bigPicIndex', 0)
        .set('paperIsBeCutItem', fromJS({}))
        .set('picUrlList', fromJS([]))
        .set('bigQuestion', fromJS({ serialNumber: '', name: '' }))
        .set('smallQuestion', fromJS({ serialNumber: '', questionTypeId: '', picUrl: '' }))
        .set('currentPaperItem', -1)
        .set('questionSelectedIndex', 0)
        .set('needCutPaperId', -1)
        .set('previewImgSrc', '')
        .set('imgSrc', loading)
        .set('imgStartIndex', 0)
        .set('setBigQuestionMsgShow', false)
        .set('selectedBigQuestion', fromJS({ name: '请选择大题', id: '-1' }))
        .set('selectedInsertIndex', fromJS({ name: '请先选择大题', id: '-1' }))
        .set('selectedIndex', fromJS({ selectedBigIndex: -1, selectedSmallIndex: -1, itemIndex: -1, smallItem: {}}))
        .set('editorBigQuestion', fromJS({ name: '请选择大题', id: '-1', value: '' }));
    case CHANGE_IS_SUBMIT_ING_ACTION:
      return state.set('isSubmitIng', action.bol);
    case CHANGE_ALERT_STATES_ACTION:
      return state.set('alertStates', action.item);
    case CHANGE_SORT_ACTION:
      return state.set('sort', action.num);
    case CHANGE_IMG_START_INDEX_ACTION:
      return state.set('imgStartIndex', action.num);
    // case SET_SELECT_INSERT_WAY_ACTION:
    //   return state.set('selectedInsertWay', action.item);
    case SET_SELECT_BIG_QUESTION_ACTION:
      return state.set('selectedBigQuestion', action.item);
    case SET_SELECTED_INDEX_ACTION:
      return state.set('selectedIndex', action.item);
    case SET_SELECTED_INSERT_INDEX_ACTION:
      return state.set('selectedInsertIndex', action.item);
    case SET_BIG_QUESTION_MSG_ACTION:
      return state.set('setBigQuestionMsgShow', action.bol);
    case SET_EDITOR_BIG_QUESTION_ACTION:
      return state.set('editorBigQuestion', action.item);
    case IMG_COUNT_CRITICAL_ACTION:
      return state.set('imgCountCritical', action.num);
    case IMG_IMG_STEP_ACTION:
      return state.set('imgStep', action.num);
    case SET_PIC_INPUT_DTO_LIST_ACTION:
      return state.set('picInputDTOList', action.item);
    case CHANGE_BIG_PIC_INDEX_ACTION:
      return state.set('bigPicIndex', action.num);
    case ADD_BIG_IMG_ACTION:
      if (state.get('needCutPaperId') === action.needCutPaperId) {
        let newPicInputDTOList = state.get('picInputDTOList');
        const newItem = action.item;
        const start = action.start;
        const itemIndex = newPicInputDTOList.findIndex((item) => item.get('start') === start);
        if (itemIndex > -1) {
          newPicInputDTOList = newPicInputDTOList.set(itemIndex, newItem.set('index', itemIndex)).map((item, i) => item.set('index', i));
        } else if (newPicInputDTOList.last() && start <= newPicInputDTOList.last().get('start')) {
          const nextIndex = newPicInputDTOList.findIndex((item) => item.get('start') > start);
          newPicInputDTOList = newPicInputDTOList.splice(nextIndex, 1, newItem).map((item, i) => item.set('index', i));
        } else {
          newPicInputDTOList = newPicInputDTOList.push(newItem).map((item, i) => item.set('index', i));
        }
        console.log(newPicInputDTOList.toJS(), 'newPicInputDTOList - reducer');
        return state.set('picInputDTOList', newPicInputDTOList);
      }
      console.log(action, state.get('needCutPaperId'), action.item.toJS(), state.get('picInputDTOList').toJS(), 'action - ADD_BIG_IMG_ACTION');
      return state;
    case SET_NEED_CUT_PAPER_ACTION:
      return state.set('needCutPaperMsg', action.item);
    default:
      return state;
  }
}

export default getAndCutPaperReducer;
