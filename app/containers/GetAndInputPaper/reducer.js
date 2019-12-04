/*
 *
 * GetAndInputPaper reducer
 *
 */

import { fromJS } from 'immutable';

import {
  DEFAULT_ACTION,
  CHANGE_PAGE_SATE_ACTION,
  SET_PROVINCE_LIST_ACTION,
  SET_CITY_LIST_ACTION,
  SET_COUNTY_LIST_ACTION,
  SET_SELECTED_PROVINCE_ACTION,
  SET_SELECTED_CITY_ACTION,
  SET_SELECTED_COUNTY_ACTION,
  SET_GRADE_LIST_ACTION,
  SET_SELECTED_GRADE_ACTION,
  SET_SUBJECT_LIST_ACTION,
  SET_SELECTED_SUBJECT_ACTION,
  SET_CUR_ITEM,
  SET_CUR_QUES,
  SET_CUR_PAPER,
  SET_EP_ID,
  CHANGE_NOT_GET_PAPER_COUNT_ACTION,
  CHANGE_HAS_GET_PAPER_COUNT_ACTION,
  SET_PAPER_LIST_ACTION,
  CHANGE_PAPER_STATE_ACTION,
  CHANGE_ALERT_MODAL_SHOW_ACTION,
  CHANG_ALERT_MODAL_STATES_ACTION,
  CHANGE_PAPER_NEED_GET_ACTION,
  CHANGE_NEED_INPUT_PAPER_ACTION,
  SET_RESULT_LIST,
  SET_CUR_INDEX,
  SET_COMPLEX_QUESTION_MSG_ACTION,
  SET_COMPLEX_QUESTION_ACTION,
  TOGGLE_FINISH_MODAL,
  SET_COMPLEX_QUESTION_ITEM_AND_MSG_ACTION,
  SET_ALL_QUESTION_TYPE_LIST_ACTION,
  SET_ALL_DONE,
  CHANGE_SORT_ACTION,
  SET_PAPER_DOWNLOAD_MSG_ACTION,
  CHANGE_PAGE_INDEX_ACTION,
  SET_SELECTED_TEMPLATE_ACTION,
  SET_ERROR_LIST_ACTION,
  SAVE_OTHERS_MSG_ACTION,
  SET_QUESTIONS_LIST_ACTION,
  CHANGE_QUESTIONS_INDEX_ACTION,
  CHANGE_TEMPLATE_LIST,
} from './constants';


const initialState = fromJS({
  allDone: false,
  pageState: 0,  // 领取页面还是填写、录入页面
  provinceList: [],
  selectedProvince: { id: -1, name: '请选择省份' },
  cityList: [],
  selectedCity: { id: -1, name: '请选择城市' },
  countyList: [],
  selectedCounty: { id: -1, name: '请选择区县' },
  subjectList: [],
  selectedSubject: { id: -1, name: '请选择学科' },
  gradeList: [],
  selectedGrade: { id: -1, name: '请选择年级' },
  notGetPaperCount: 0,  // 未领取试卷总数
  hasGetPaperCount: 0,  // 已领取试卷总数
  pageSize: 20,  // 每页条数
  pageIndex: 1,  // 当前页数
  paperState: 4,  // 试卷状态页面 已领取、未领取...
  subjectId: -1,  // 学科 id
  gradeId: -1,  // 年级 id
  sort: 0,       // 排序方式(0: 默认排序， 1：时间排序)
  previewShowOrHide: false,  // 预览切割弹框显示状态
  alertShowOrHide: false,  // 领取任务弹框显示状态
  paperList: [],  // 表格中试卷列表
  alertModalShow: false,  // 显示弹框状态
  alertModalStates: {}, // 弹框可以覆盖的属性对象
  paperWhichNeedGetId: -1, // 要领取的输入任务的试卷 id
  paperWhichNeedInputId: -1,  // 要切割的试卷的 id
  paperWhichNeedInputItem: {},  // 要切割的试卷
  epid: -1,
  finishModal: false,
  curIndex: { index: 0, subIndex: 0, totalIndex: 0 },
  curPaper: {},
  resultList: [],
  curQues: {},
  curItem: {},
  complexQuestionItemMsg: {
    bigNum: 1,
    bigName: '',
    serialNumber: 1,
    questionId: 0,
    score: 3,
    title: '',
    typeId: -1,
  },  // 复合题信息
  complexQuestionItem: [],  // 复合题当前题目的数据
  allQuestionTypeList: [],
  paperDownloadMsg: {},
  templateList: [{ name: '复合题', id: 1 }, { name: '选择题', id: 2 }, { name: '填空题', id: 3 }, { name: '简答题', id: 4 }],
  slectedTemplate: { name: '请选择模板', id: -1 },
  errList: [],
  othersData: {},
  questionsList: [],
  questionsIndex: 0,
});

function getAndInputPaperReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case CHANGE_PAGE_INDEX_ACTION:
      return state.set('pageIndex', action.num);
    case CHANGE_PAGE_SATE_ACTION:
      if (action.num === 0) {
        return state.set('pageState', action.num).set('errList', fromJS([])).set('questionsIndex', 0);
      }
      return state.set('pageState', action.num);
    case SET_PROVINCE_LIST_ACTION:
      return state.set('provinceList', action.item);
    case SET_CITY_LIST_ACTION:
      return state.set('cityList', action.item);
    case SET_COUNTY_LIST_ACTION:
      return state.set('countyList', action.item);
    case SET_SELECTED_PROVINCE_ACTION:
      return state.set('selectedProvince', action.item);
    case SET_SELECTED_CITY_ACTION:
      return state.set('selectedCity', action.item);
    case SET_SELECTED_COUNTY_ACTION:
      return state.set('selectedCounty', action.item);
    case SET_SUBJECT_LIST_ACTION:
      return state.set('subjectList', action.item);
    case SET_SELECTED_SUBJECT_ACTION:
      return state.set('selectedSubject', action.item);
    case SET_GRADE_LIST_ACTION:
      return state.set('gradeList', action.item);
    case SET_SELECTED_GRADE_ACTION:
      return state.set('selectedGrade', action.item);
    case SET_CUR_INDEX:
      return state.set('curIndex', action.curIndex);
    case SET_CUR_ITEM:
      return state.set('curItem', action.curItem);
    case SET_CUR_QUES:
      return state.set('curQues', action.curQues);
    case SET_CUR_PAPER:
      return state.set('curPaper', action.paper);
    case SET_EP_ID:
      return state.set('epid', action.epid);
    case CHANGE_NOT_GET_PAPER_COUNT_ACTION:
      return state.set('notGetPaperCount', action.num);
    case CHANGE_HAS_GET_PAPER_COUNT_ACTION:
      return state.set('hasGetPaperCount', action.num);
    case SET_PAPER_LIST_ACTION:
      return state.set('paperList', action.item);
    case CHANGE_PAPER_STATE_ACTION:
      // console.log(action.num, 'action.number');
      return state.set('paperState', action.num);
    case CHANGE_ALERT_MODAL_SHOW_ACTION:
      return state.set('alertModalShow', action.bol);
    case CHANG_ALERT_MODAL_STATES_ACTION:
      return state.set('alertModalStates', action.item);
    case CHANGE_PAPER_NEED_GET_ACTION:
      return state.set('paperWhichNeedGetId', action.num);
    case CHANGE_NEED_INPUT_PAPER_ACTION:
      return state.set('paperWhichNeedInputId', action.num).set('paperWhichNeedInputItem', action.item);
    case SET_RESULT_LIST:
      const o_val = state.get('resultList');
      o_val.set(action.playLoad.index, action.playLoad.value);
      return state.set('resultList', o_val);
    case SET_COMPLEX_QUESTION_MSG_ACTION:
      return state.set('complexQuestionItemMsg', action.item);
    case SET_COMPLEX_QUESTION_ACTION:
      return state.set('complexQuestionItem', action.item);
    case TOGGLE_FINISH_MODAL:
      return state.set('finishModal', !state.get('finishModal'));
    case SET_ALL_QUESTION_TYPE_LIST_ACTION:
      return state.set('allQuestionTypeList', action.item);
    case SET_COMPLEX_QUESTION_ITEM_AND_MSG_ACTION:
      const allQuestionList = state.get('curPaper');
      // console.log(allQuestionList.toJS(), 'allQuestionList ----------------------------');
      const currentIndex = state.get('curIndex');
      // log(currentIndex.toJS(), 'currentIndex =----------------------');
      const bigQuestion = allQuestionList.get(currentIndex.get('index'));
      const questionItem = bigQuestion.get('examPaperContentQuestionOutputDTOList').get(currentIndex.get('subIndex'));
      // console.log(bigQuestion.toJS(), 'bigQuestion -- 267');
      // console.log(questionItem.toJS(), 'questionItem -- 268 ');
      let shouldQuestionList = null;
      let shouldQuestionMsg = null;
      if (questionItem.get('questionOutputDTO').get('children')) {
        shouldQuestionList = questionItem.toJS().questionOutputDTO.children.map((item) => {
          return {
            score: item.score || 3,
            title: item.title || '',
            optionList: item.optionList && item.optionList.length > 0 ? item.optionList : ['', '', '', ''],
            answerList: item.answerList && item.answerList.length > 0 ? item.answerList : [''],
            analysis: item.analysis || '',
            typeId: item.typeId || -1,
          };
        });
        const children = questionItem.get('questionOutputDTO').get('children');
        let allCount = 0;
        children.forEach((item) => {
          // console.log(item, 'item -- 285');
          allCount += item.get('score');
        });
        // console.log(children.toJS(), 'children');
        // console.log(bigQuestion.toJS(), questionItem.toJS(), currentIndex.toJS(), '289 -- 289');
        shouldQuestionMsg = {
          bigNum: bigQuestion.get('serialNumber'),
          bigName: bigQuestion.get('name'),
          serialNumber: questionItem.get('serialNumber'),
          questionId: questionItem.get('questionId'),
          score: allCount || children.count() * 3,
          title: questionItem.get('questionOutputDTO').get('title') || '',
          typeId: questionItem.get('questionOutputDTO').get('typeId') || -1,
        };
        // console.log(shouldQuestionMsg, 'shouldQuestionMsg - 298');
      } else {
        const questionOutputDTO = questionItem.get('questionOutputDTO');
        shouldQuestionList = [{
          score: questionOutputDTO.get('score') || 3,
          title: questionOutputDTO.get('title') || '',
          optionList: questionOutputDTO.get('optionList') && questionOutputDTO.get('optionList').count() > 0 ? questionOutputDTO.get('optionList').toJS() : ['', '', '', ''],
          answerList: questionOutputDTO.get('answerList') && questionOutputDTO.get('answerList').count() > 0 ? questionOutputDTO.get('answerList').toJS() : [''],
          analysis: questionOutputDTO.get('analysis') || '',
          typeId: questionOutputDTO.get('typeId') || -1,
        }];
        shouldQuestionMsg = {
          bigNum: bigQuestion.get('serialNumber'),
          bigName: bigQuestion.get('name'),
          serialNumber: questionItem.get('serialNumber'),
          questionId: questionItem.get('questionId'),
          score: questionOutputDTO.get('score') || 3,
          title: '',
          typeId: questionOutputDTO.get('typeId') || -1,
        };
      }
      // console.log(shouldQuestionList, shouldQuestionMsg, 'shouldQuestionList - shouldQuestionMsg');
      return state.set('complexQuestionItem', fromJS(shouldQuestionList)).set('complexQuestionItemMsg', fromJS(shouldQuestionMsg));
    case SET_ALL_DONE:
      return state.set('allDone', action.bool);
    case CHANGE_SORT_ACTION:
      return state.set('sort', action.num);
    case SET_PAPER_DOWNLOAD_MSG_ACTION:
      return state.set('paperDownloadMsg', action.item);
    case SET_SELECTED_TEMPLATE_ACTION:
      return state.set('slectedTemplate', action.item);
    case SET_ERROR_LIST_ACTION:
      // console.log(action.item.toJS(), 'action.item');
      return state.set('errList', action.item);
    case SAVE_OTHERS_MSG_ACTION:
      return state.set('othersData', action.item);
    case SET_QUESTIONS_LIST_ACTION:
      return state.set('questionsList', action.item);
    case CHANGE_QUESTIONS_INDEX_ACTION:
      // console.log(action.num, 'changeQuestionsIndexAction');
      return state.set('questionsIndex', action.num);
    case CHANGE_TEMPLATE_LIST:
      return state.set('templateList', action.list);
    default:
      return state;
  }
}

export default getAndInputPaperReducer;
