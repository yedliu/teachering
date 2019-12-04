/* eslint-disable max-nested-callbacks */
/* eslint-disable no-case-declarations */
/*
 *
 * PaperFinalVerify reducer
 *
 */

import { fromJS } from 'immutable';
import { backfromZmStand, filterTreeNode, toNumber } from 'components/CommonFn';
import moment from 'moment';
import {
  DEFAULT_ACTION,
  SET_PAPER_NUMBER_ACTION,
  SET_PAPER_LIST_ACTION,
  SET_PAPER_PARAMS_ACTION,
  CHANGE_PAPER_INDEX_ACTION,
  CHANGE_NEED_VERIFY_PAPER_ID_ACTION,
  SET_PAPER_MSG_DATA_ACTION,
  SET_COMMFN_INFO_ACTION,
  SET_PAPER_DOWNLOAD_MSG_ACTION,
  SET_QUESTION_PARAMS_ACTION,
  SET_QUESTIONS_ACTION,
  SET_QUESTION_MSG_LIST_ACTION,
  SET_REMOVE_INDEX_ACTION,
  SET_ALL_QUESTION_TYPE_LIST_ACTION,
  SET_NEW_QUESTION_MSG_ACTION,
  SET_POINT_LIST_ACTION,
  CHANGE_QUESTION_EDIT_STATE,
  SET_CLICK_TARGET_ACTION,
  INIT_QUESTION_LIST_DATA,
  SET_INPUT_DTO_ACTION,
  SET_PAPER_MSG_LIST_ACTION,
  SET_IS_ADD_OR_EDIT_ACTION,
  SET_POINT_ID_LIST_ACTION,
  FILTER_POINT_ACTION,
} from './constants';

const initialState = fromJS({
  paperList: [],
  paperIndex: 0,
  paperParams: {
    pageIndex: 1,
    pageSize: 20,
    sort: 0,
    paperState: 11,
    pageState: 0,
  },
  paperNumber: {
    notGetPaperCount: 0,
    hasGetPaperCount: 0,
  },
  //
  dataIsGetting: true,
  paperNeedVerifyId: {},
  paperMsgData: {},
  questionsList: [],
  commoninfo: {},
  paperDownloadMsg: {},
  questionParams: {
    questionIndex: 0,
  },
  bigQuestionMsg: [],
  removeIndex: {  // 存储要删除的题目的 id
    bigIndex: -1,
    smallIndex: -1,
  },
  editorAlertMsg: {
    title: '新增大题',
    buttonsType: '1',
  },
  //
  questionEditState: 0,
  //
  questionTypeList: [],
  newQuestion: {},  // 新增加题目的数据
  clickTarget: '',
  pointList: {
    knowledgeIdList: [],
    examPointIdList: [],
  },
  isAddOrEdit: {
    type: '',
    todo: '',
    oldMsg: {},
    openAlert: false,
  },
  //
  inputDto: {
    seeModel: false,
    name: '',
    businessCardId: 0,
    subjectId: 0,
    gradeId: 0,
    termId: 0,
    provinceId: 0,
    cityId: 0,
    countyId: 0,
    editionId: 0,
    year: moment().format('YYYY'),
    examTypeId: 0,
    typeId: 0,
    questionAmount: '',
    // fileUrl: '',
  },
  paperMsgList: {
    yearList: new Array(10).fill(moment().format('YYYY')).map((it, i) => {
      const year = it - i;
      return { id: year, name: `${year}` };
    }),
    subjectList: [{ id: 0, name: '请选择学科' }],
    gradeList: [{ id: 0, name: '请选择年级' }],
    termList: [{ id: 0, name: '请选择学期' }],
    provinceList: [{ id: 0, name: '请选择省' }],
    editionList: [{ id: 0, name: '请选择版本' }],
    cityList: [{ id: 0, name: '请选择市' }],
    countyList: [{ id: 0, name: '请选择县' }],
  },
  pointIdList: {
    knowledgeIdList: [],
    examPointIdList: [],
  },
});

// eslint-disable-next-line complexity
function paperFinalVerifyReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_PAPER_LIST_ACTION:
      return state.set('paperList', action.item);
    case SET_PAPER_MSG_DATA_ACTION:
      return state.set('paperMsgData', action.item);
    case SET_PAPER_NUMBER_ACTION:
      return state.set('paperNumber', action.item);
    case SET_PAPER_PARAMS_ACTION:
      return state.set('paperParams', action.item);
    case CHANGE_PAPER_INDEX_ACTION:
      return state.set('paperIndex', action.num);
    case CHANGE_NEED_VERIFY_PAPER_ID_ACTION:
      return state.set('paperNeedVerifyId', action.num);
    case SET_COMMFN_INFO_ACTION:
      return state.set('commoninfo', action.item);
    case SET_PAPER_DOWNLOAD_MSG_ACTION:
      return state.set('paperDownloadMsg', action.item);
    case SET_QUESTION_PARAMS_ACTION:
      return state.set('questionParams', action.item);
    case SET_QUESTIONS_ACTION:
      return state.set('questionsList', action.item);
    case SET_QUESTION_MSG_LIST_ACTION:
      return state.set('bigQuestionMsg', action.item);
    case SET_REMOVE_INDEX_ACTION:
      return state.set('removeIndex', action.item);
    case SET_ALL_QUESTION_TYPE_LIST_ACTION:
      return state.set('questionTypeList', action.item);
    case SET_NEW_QUESTION_MSG_ACTION:
      return state.set('newQuestion', action.item);
    case SET_POINT_LIST_ACTION:
      return state.set('pointList', action.item);
    case CHANGE_QUESTION_EDIT_STATE:
      return state.set('questionEditState', action.num);
    case SET_CLICK_TARGET_ACTION:
      return state.set('clickTarget', action.str);
    case SET_INPUT_DTO_ACTION:
      return state.set('inputDto', action.item);
    case SET_PAPER_MSG_LIST_ACTION:
      return state.set('paperMsgList', action.item);
    case SET_IS_ADD_OR_EDIT_ACTION:
      return state.set('isAddOrEdit', action.item);
    case SET_POINT_ID_LIST_ACTION:
      return state.set('pointIdList', state.get('pointIdList').set(action.idType, action.item));
    case INIT_QUESTION_LIST_DATA:
      const paperMsgData = state.get('paperMsgData').toJS();
      const questionParams = state.get('questionParams');
      const questionIndex = questionParams.get('questionIndex');
      let newQuestionPaperParams = questionParams;
      // console.log(paperMsgData, 'paperMsgData');
      const questionsList = [];
      const bigMsg = [];
      let realQuestionsCount = 0;
      paperMsgData.examPaperContentOutputDTOList.forEach((item, index) => {
        bigMsg.push({
          count: item.examPaperContentQuestionOutputDTOList.length,
          name: item.name,
          serialNumber: index + 1,
          id: item.id,
        });
        item.examPaperContentQuestionOutputDTOList.forEach((it) => {
          realQuestionsCount += 1;
          const newIt = it;
          newIt.questionOutputDTO.errState = -1;
          newIt.bigId = item.id;
          newIt.epId = paperMsgData.id;
          newIt.bigName = item.name;
          const newQuestionOutputDTO = {
            title: backfromZmStand(it.questionOutputDTO.title || ''),
            analysis: backfromZmStand(it.questionOutputDTO.analysis || ''),
            answerList: (it.questionOutputDTO.answerList || []).map((iit) => backfromZmStand(iit || '')),
            optionList: (it.questionOutputDTO.optionList || []).map((iit) => backfromZmStand(iit || '')),
          };
          if (it.questionOutputDTO.children && it.questionOutputDTO.children.length > 0) {
            // console.log(it.questionOutputDTO.children, 'children');
            newQuestionOutputDTO.children = it.questionOutputDTO.children.map((itt) => {
              return Object.assign({}, itt, {
                // score: itt.score,
                title: backfromZmStand(itt.title || ''),
                optionList: (itt.optionList || []).map((iit) => backfromZmStand(iit || '')),
                answerList: (itt.answerList || []).map((iit) => backfromZmStand(iit || '')),
                analysis: backfromZmStand(itt.analysis || ''),
                // examPointIdList: itt.examPointIdList,
                // knowledgeIdList: itt.knowledgeIdList,
                // typeId: itt.typeId,
                // id: itt.id,
                subQuestionId: itt.id,
              });
            });
          }
          newIt.questionOutputDTO = Object.assign({}, newIt.questionOutputDTO, newQuestionOutputDTO);
          questionsList.push(newIt);
        });
      });
      const commoninfo = {
        epId: paperMsgData.id,
        gradeId: paperMsgData.gradeId,
        subjectId: paperMsgData.subjectId,
        name: paperMsgData.name,
        questionCount: paperMsgData.questionAmount,
        realQuestionsCount,
      };
      if (questionIndex >= questionsList.length) {
        newQuestionPaperParams = questionParams.set('questionIndex', questionIndex - 1);
      }
      const newInputDto = state.set('inputDto').set('provinceId', paperMsgData.provinceId);
      return state.set('commoninfo', fromJS(commoninfo))
        .set('questionsList', fromJS(questionsList))
        .set('bigQuestionMsg', fromJS(bigMsg))
        .set('inputDto', fromJS(newInputDto))
        .set('questionParams', newQuestionPaperParams);
    case FILTER_POINT_ACTION:
      const idType = action.idType;
      const pointItemList = state.getIn(['pointIdList', idType]).toJS();
      const IquestionsList = state.get('questionsList');
      const newQuesitonsList = IquestionsList.map((item, index) => {
        const itemIdList = (item.getIn(['questionOutputDTO', idType]) || fromJS([])).toJS();
        const newpointIdList = filterTreeNode(pointItemList, itemIdList.map((it) => toNumber(it)));
        let newItem = item.setIn(['questionOutputDTO', idType], fromJS(newpointIdList));
        const children = item.getIn(['questionOutputDTO', 'children']);
        if (children && children.count() > 0) {
          const newChildren = children.map((it, i) => {
            const childPointList = (it.get(idType) || fromJS([])).toJS();
            const newChildPointList = filterTreeNode(pointItemList, childPointList.map((iit) => toNumber(iit)));
            return it.set(idType, fromJS(newChildPointList));
          });
          newItem = newItem.setIn(['questionOutputDTO', 'children'], newChildren);
        }
        return newItem;
      });
      return state.set('questionsList', newQuesitonsList);
    default:
      return state;
  }
}

export default paperFinalVerifyReducer;
