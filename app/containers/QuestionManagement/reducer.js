/* eslint-disable no-case-declarations */
/*
 *
 * QuestionManagement reducer
 *
 */

import { fromJS } from 'immutable';
import {
  // setScoreIfMentality,
  getPaperContentListByQuestions,
  addQuestion,
  flatQuestionData,
  addQuestionIndex
} from './utils';
import {
  DEFAULT_ACTION,
  SET_PHASE_SUBJECT_LIST_ACTION,
  SET_PHASE_SUBJECT_ACTION,
  SET_SELECTED_TYPE_ACTION,
  SET_SELECTED_TREE_ITEM,
  SET_SELECTED_TREE,
  SET_KNOWLEDGE_LIST_ACTION,
  SET_FILTER_FIELDS,
  SET_MORE_FILTER_FIELDS,
  SET_QUESTION_PAGE_INDEX,
  SET_QUESTION_PAGE_SIZE,
  SET_CUR_FILTER_FIELDS_ACTION,
  SET_ORDER_PARAMS_ACTION,
  SET_PROVINCE_ACTION,
  SET_CITY_ACTION,
  SET_DISTRICT_ACTION,
  SET_QUESTION_DATA_ACTION,
  ADD_HOMEWORK_QUESTION_ACTION,
  REMOVE_HOMEWORK_QUESTION_ACTION,
  SET_PAPER_CONTENT_LIST_ACTION,
  SET_PAPER_PROPERTY_ACTION,
  SET_GRADE_ACTION,
  SET_SUBJECT_ACTION,
  SET_PAGE_STATE_ACTION,
  SET_TOTAL_QUESTION_ACTION,
  SET_REDUCER_INITAL,
  SET_USER_MAP,
  SET_PAPER_PROPERTIES_ACTION,
  CHANGE_COLLEGE_EXAMPAPER_ACTION,
  SET_SEARCH_DATA_ACTION,
  SET_PAPER_TYPE_ACTION,
  UPDATE_HOMEWORK_QUESTION_ACTION,
  SET_HW_QUESTION_ACTION,
  SET_ALL_CHOOSEQUESTION_RULE,
  SET_KNOWLEDGEIDS,
  SET_GRADE_SUBJECT
} from './constants';
import { tagsName } from 'utils/zmConfig';

const formTermList = [{ value: '', label: '全部' }, { value: 1, label: '上学期' }, { value: 2, label: '下学期' }, { value: 3, label: '暑假' }, { value: 4, label: '寒假' }];
const initialState = fromJS({
  paperType: [],
  phaseSubjectList: [],
  phaseSubject: { id: '1', phaseId: '' },
  gradeSubject: { id: '1', phaseId: '' },
  selectedType: '0', // 0代表知识点选题 1代表考点选题
  selectedtreeitem: {}, // 选中的节点
  knownLedgeList: [], // 选中的科目列表
  filterFields: {
    // 删选条件
    typeId: {
      name: '题型',
      values: [],
    },
    difficulty: {
      name: '难度',
      values: [
        {
          label: '全部',
          value: '',
        },
        {
          label: '五级',
          value: 5,
        },
        {
          label: '四级',
          value: 4,
        },
        {
          label: '三级',
          value: 3,
        },
        {
          label: '二级',
          value: 2,
        },
        {
          label: '一级',
          value: 1,
        },
      ],
    },
    termId: {
      name: '学期',
      values: formTermList,
    },
    region: {
      name: '地区',
      values: [],
    },
    year: {
      name: '年份',
      values: [
        {
          label: '全部',
          value: '',
        },
        {
          label: '2018',
          value: 2018,
        },
        {
          label: '2017',
          value: 2017,
        },
        {
          label: '2016',
          value: 2016,
        },
        {
          label: '2015',
          value: 2015,
        },
        {
          label: '2014',
          value: 2014,
        },
        {
          label: '2013',
          value: 2013,
        },
        {
          label: '2012',
          value: 2012,
        },
        {
          label: '2011',
          value: 2011,
        },
        {
          label: '2010',
          value: 2010,
        },
        {
          label: '2009',
          value: 2009,
        },
        {
          label: '2008',
          value: 2008,
        },
      ],
    },
  },
  moreFilterFields: {
    // 更多删选条件
    distinction: {
      name: '区分度',
      values: tagsName.distinction.map((it, index) => ({
        label: index === 0 ? '全部' : it,
        value: index === 0 ? '' : index,
      })),
    },
    comprehensiveDegreeId: {
      name: '综合度',
      values: tagsName.comprehensiveDegreeId.map((it, index) => ({
        label: index === 0 ? '全部' : it,
        value: index === 0 ? '' : index,
      })),
    },
    rating: {
      name: '题目评级',
      values: tagsName.rating.map((it, index) => ({
        label: index === 0 ? '全部' : it,
        value: index === 0 ? '' : index,
      })),
    },
    // 'scene': {
    //   name: '场景',
    //   values: [],
    // },
  },
  questionpageindex: 1,
  questionpagesize: 20,
  curFilterFields: {},
  orderParams: {
    // updatedTime: 'DESC', // 时间排序，DESC：倒叙；ASC：正序。
    // quoteCount: 'DESC', // 使用次数排序
  },
  provinceData: [],
  cityData: [],
  districtData: [],
  // 题目列表
  questionData: [],
  choosedquestions: [],
  paperContentList: [],
  paperProperty: {
    epName: '',
    subjectId: '',
    gradeId: '',
    typeId: '',
    difficulty: '',
    year: '',
    paperTypeId: '',
    termId: '',
    provinceId: '',
    cityId: '',
    countyId: '',
    examTypeId: '',
    businessCardId: '',
    source: '',
    purpose: '',
    editionId: '', // 课程体系的版本id
    teachingEditionId: '', // 教材版本id
    versionValue: null, // 教学版本
    systemValue: null, // 课程体系
    showTeachingList: [], // 显示教材的目录
    showSystemList: [], // 显示课程体系目录
    onlineFlag: '',
    evaluationTarget: '',
    evaluationPurpose: '',
    epBu: '',
  },
  grade: [],
  subject: [],
  pageState: {
    state: '',
    loading: false,
    isSubmit: false,
  },
  totalQuestion: 0,
  userMap: {},
  //
  searchData: {
    examPaperTypeId: -1,
    questionType: -1,
    difficulty: -1,
    grade: -1,
    term: -1,
    year: -1,
    questionSource: -1,
    examType: -1,
    province: -1,
    city: -1,
    county: -1,
    distinction: -1,
    comprehensiveDegree: -1,
    rating: -1,
    useStage: -1,
  },
  isCollegeEnteranceExamPaper: false,
  ruleList: [],
  knowledgeIds: [],
});

// eslint-disable-next-line complexity
function questionManagementReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_PHASE_SUBJECT_LIST_ACTION:
      return state.set('phaseSubjectList', action.phaseSubjectList);
    case SET_PHASE_SUBJECT_ACTION:
      return state.set('phaseSubject', action.phaseSubject);
    case SET_GRADE_SUBJECT:
      return state.set('gradeSubject', action.gradeSubject);
    case SET_SELECTED_TYPE_ACTION:
      return state.set('selectedType', action.selectedType);
    case SET_SELECTED_TREE_ITEM:
      return state.set('selectedtreeitem', action.item);
    case SET_SELECTED_TREE:
      return state.set('selectedTree', action.item);
    case SET_KNOWLEDGE_LIST_ACTION:
      return state.set('knownLedgeList', action.list);
    case SET_FILTER_FIELDS:
      return state.setIn(['filterFields', action.key, 'values'], action.list);
    case SET_MORE_FILTER_FIELDS:
      return state.setIn(['moreFilterFields', action.key, 'values'], action.list);
    case SET_QUESTION_PAGE_INDEX:
      return state.set('questionpageindex', action.val);
    case SET_QUESTION_PAGE_SIZE:
      return state.set('questionpagesize', action.item);
    case SET_CUR_FILTER_FIELDS_ACTION:
      return state.setIn(['curFilterFields', action.key], action.val);
    case SET_ORDER_PARAMS_ACTION:
      return state.setIn(['orderParams', action.key], action.val);
    case SET_PROVINCE_ACTION:
      return state.set('provinceData', action.list);
    case SET_CITY_ACTION:
      return state.set('cityData', action.list);
    case SET_DISTRICT_ACTION:
      return state.set('districtData', action.list);
    case SET_QUESTION_DATA_ACTION:
      return state.set('questionData', action.list);
    case SET_ALL_CHOOSEQUESTION_RULE:
      return state.set('ruleList', action.data);
    case SET_HW_QUESTION_ACTION:
      // const newQuestions = setScoreIfMentality((action.data || state.get('choosedquestions')), action.sort, isCollegeExamPaper(state.getIn(['paperProperty', 'typeId'])));
      const newQuestions = action.data || state.get('choosedquestions');
      // return state.set('choosedquestions', newQuestions).set('paperContentList', getPaperContentListByQuestions(newQuestions, isCollegeExamPaper(state.getIn(['paperProperty', 'typeId']))));
      let newQuestionsData = addQuestionIndex(newQuestions);
      return  state.set('choosedquestions', newQuestionsData.originList).set('paperContentList', newQuestionsData.renderList);
    case ADD_HOMEWORK_QUESTION_ACTION:
      let flat = flatQuestionData(state.get('choosedquestions'));
      if (flat.some((item) => item.get('id') === action.item.get('id'))) {
        return state;
      } else {
        const newQues = addQuestion(state.get('choosedquestions'), action.item);
        let newQuesData = addQuestionIndex(newQues);
        return state.set('choosedquestions', newQuesData.originList).set('paperContentList', newQuesData.renderList);
      }
    case REMOVE_HOMEWORK_QUESTION_ACTION:
      // const newQues = state.get('choosedquestions').filter((item) => action.item.get('id') !== item.get('id'));
      const smallKey = 'examPaperContentQuestionOutputDTOList';
      let newQues = state.get('choosedquestions').map(big => {
        let smallList = big.get(smallKey).filter(small => action.item.get('id') !== small.get('id'));
        return big.set(smallKey, smallList);
      });
      if (action.isRemoveBig) {
        newQues = newQues.filter(item => item.get(smallKey).count() > 0);
      }
      let newQuesData = addQuestionIndex(newQues);
      return state.set('choosedquestions', newQuesData.originList).set('paperContentList', newQuesData.renderList);
    case UPDATE_HOMEWORK_QUESTION_ACTION:
      // const index = state.get('choosedquestions').findKey(e => e.get('id') === action.item.get('id'));
      let newQ = state.get('choosedquestions').map(big => {
        let smallList = big.get('examPaperContentQuestionOutputDTOList').map(small => {
          if (small.get('id') === action.item.get('id')) {
            return action.item;
          }
          return small;
        });
        return big.set('examPaperContentQuestionOutputDTOList', smallList);
      });
      // return state.set('choosedquestions', state.get('choosedquestions').set(index, action.item));
      let newQdata = addQuestionIndex(newQ);
      return state.set('choosedquestions', newQdata.originList).set('paperContentList', newQdata.renderList);
    case SET_PAPER_CONTENT_LIST_ACTION:
      return state.set('paperContentList', getPaperContentListByQuestions(action.list));
    // 设置试卷属性
    case SET_PAPER_PROPERTY_ACTION:
      return state.setIn(['paperProperty', action.field], action.val);
    case SET_GRADE_ACTION:
      return state.set('grade', action.list);
    case SET_SUBJECT_ACTION:
      return state.set('subject', action.list);
    case SET_PAGE_STATE_ACTION:
      return state.setIn(['pageState', action.key], action.val);
    case SET_TOTAL_QUESTION_ACTION:
      return state.set('totalQuestion', action.val);
    case SET_REDUCER_INITAL:
      return initialState;
    case SET_USER_MAP:
      return state.setIn(['userMap', action.id], action.name);
    case SET_PAPER_PROPERTIES_ACTION:
      // console.log(action.item.toJS(), 'item');
      return state.set('paperProperty', action.item);
    case CHANGE_COLLEGE_EXAMPAPER_ACTION:
      return state.set('isCollegeEnteranceExamPaper', action.bool);
    case SET_SEARCH_DATA_ACTION:
      return state.set('searchData', action.item);
    case SET_PAPER_TYPE_ACTION:
      return state.set('paperType', action.list);
    case SET_KNOWLEDGEIDS:
      return state.set('knowledgeIds', action.knowledgeIds);
    default:
      return state;
  }
}

export default questionManagementReducer;
