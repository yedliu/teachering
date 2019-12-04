/*
 *
 * QuestionManagement
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { toNumber, toString } from 'lodash';
import styled from 'styled-components';
import {
  Select,
  Button,
  Popconfirm,
  Modal,
  Icon,
  message as antdMessage,
  Switch,
  Popover,
  Input,
  Pagination,
  BackTop,
} from 'antd';
import Immutable, { fromJS } from 'immutable';
import { PlaceHolderBox } from 'components/CommonFn/style';
import QuestionTag from 'components/QuestionTag';
import { browserHistory } from 'react-router';
import QuestionSearchData from 'components/QuestionSearchData';
import ErrorCorrect from 'components/ErrorCorrect';
import sourceModule from 'components/ErrorCorrect/sourceModule';
import { AppLocalStorage } from 'utils/localStorage';
import { flatQuestionData, calculateSum, combineComplexQuestion, } from './utils';
import {
  makeSelectphaseSubjectList,
  makeSelectphaseSubject,
  makeSelectType,
  makeSelectSelectedTreeitem,
  makeSelectKnownLedgeList,
  makeSelectFilterFields,
  makeSelectMoreFilterFields,
  makeSelectProvinceData,
  makeSelectCityData,
  makeSelectDistrictData,
  makeSelectCurFilterFields,
  makeSelectOrderParams,
  makeSelectQuestionData,
  makeSelectChooosedQuestions,
  makeSelectPageState,
  makeSelectTotalQuestion,
  makeSelectQuestionPageIndex,
  makeSelectUserMap,
  makeSelectPaperProperty,
  makeSearchData,
  makeSelectQuestionPageSize
} from './selectors';
import { FlexRowDiv, FlexColumnDiv } from 'components/Div';
import {
  FlexRow,
  FlexRowCenter,
  // FlexColumn,
  FlexCenter,
} from 'components/FlexBox';
import {
  getPhaseSubjectListAction,
  setPhaseSubjectAction,
  setSelectedTypeAction,
  getExamPointList,
  getKnownLedgeList,
  setSelectedTreeItem,
  searchQuestions,
  getQuestionType,
  setCurFilterFields,
  setOrderParams,
  getProvince,
  addHomeWorkQuestionAction,
  removeHomeWorkQuestionAction,
  setPageState,
  setQuestionData,
  setTotalQuestion,
  setPaperProperty,
  setReducerInital,
  setPageIndex,
  setPaperPropertiesAction,
  deleteQuestionAction,
  setHwQuestionAndPaperAction,
  setPageSize,
  updateHomeWorkQuestionAction,
  setKnowledgeIds,
  setGradeSubjectAction
} from './actions';
import HomeworkTree from '../StandHomeWork/TreeRender';
import {
  QuestionInfoWrapper,
  // AnalysisWrapper,
  // AnalysisItem,
  // AnswerTitle,
  // AnswerConten,
} from '../StandHomeWork/createHomeWorkStyle';
import PaperEdit from './paperEdit';
import EditItemQuestion from 'components/EditItemQuestion';
import {
  // renderToKatex,
  // filterHtmlForm,
  // backfromZmStandPrev,
  timestampToDate,
} from 'components/CommonFn';
// import { ListChildQuestion } from './listChildQuestion';
import {
  validateClassifyAndMatch,
  validateSavedQuestion,
  validateChooseForCollegeExam,
} from 'components/EditItemQuestion/common';
import { ZmExamda } from 'zm-tk-ace';
import { publishModal } from './modal';
import questionApi from 'api/qb-cloud/question-endpoint';
import { isMentality } from './MentalityEdit/utils';
import { MaskLoading } from 'components/Loading';
import { shuffle } from 'utils/helpfunc';
import { filterCartoonForGroupPaper } from 'utils/templateMapper';
import TextEditionSlider from 'components/TextEditionSlider';
import * as server from './server';

const emptyImg = window._baseUrl.imgCdn + '2cfcc00d-8360-42c7-b371-4253fd4735cb.png';
const loadingImg = window._baseUrl.imgCdn + '02f36e7d-35d2-4a79-a407-847ed60a6923.gif';
const isParttime = process.env.ENV_TARGET === 'parttime';

export const QuestionsCount = styled.div`
  float: left;
  line-height: 2em;
`;

const RootDiv = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  .question-wrapper::-webkit-scrollbar {
    width: 12px;
  }
  .question-wrapper::-webkit-scrollbar-track {
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
  }
  .question-wrapper::-webkit-scrollbar-thumb {
    background-color: #108ee9;
  }
`;

const ContentWrapper = styled(FlexRowDiv)`
  height: 100%;
  overflow: auto;
  .choice-template-wrapper p {
    word-break: keep-all;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
`;

const ContentLeft = styled(FlexColumnDiv)`
  width: 266px;
  min-width: 250px;
  height: 100%;
  border-radius: 4px;
  margin-right: 10px;
  padding: 10px;
  overflow-x: hidden;
  border-right: 1px solid #ddd;
`;

const ContentRight = styled.div`
  flex: 1;
  margin-right: 20px;
  padding: 10px;
  overflow: auto;
`;

// const CenterFlexRow = styled(FlexRowDiv)`
//   justify-content: space-between;
// `;

const AlignCenterDiv = styled(FlexRowDiv)`
  align-items: center;
`;

const SearchButton = styled(Button)`
  margin: 0 10px 0 10px;
  width: 80px;
`;

const FlexRowSide = styled(FlexRowCenter)`
  justify-content: space-between;
  min-height: ${props => props.h}px;
`;

const QuestionResultTitle = styled.p`
  font-size: 14px;
  i {
    color: red;
    font-size: 20px;
    margin: 0 4px;
  }
`;

const QuestionWrapper = styled.div`
  margin: 5px 0;
  ${props =>
    (props.hasQuestion ?
  `border-top: 2px solid rgba(0,0,0,0.2);
  border-bottom: 2px solid rgba(0,0,0,0.2);`
  : '')};
  overflow: auto;
`;

const QuestionItem = styled.div`
  position: relative;
  section {
    padding: 5px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.7);
    display: flex;
  }
  &:hover {
    .showHideButton {
      display: flex;
    }
  }
  .group-wrapper, .listenMaterial-wrapper {
    white-space: pre-wrap;
    font-family: MicrosoftYaHei;
    line-height: 19px;
    font-size: 14px;
    margin: 12px 0px 10px;
    padding: 12px;
    border-radius: 2px;
    border: 1px solid rgb(232, 226, 216);
    background: rgb(255, 251, 242);
    .sort_for_hearing-label  {
      font-family: PingFangSC-Medium;
      color: rgb(122, 89, 60);
      white-space: nowrap;
    }
  }
  .sort_option_list-wrapper {
    padding: 10px;
  }
  .sort_option_item-wrapper, .sort_answerList_item-wrapper {
    border: 1px solid #ddd;
    margin: 5px 0;
  }
`;

const HideButton = styled.div`
  display: none;
  padding: 5px;
  height: 40px;
  align-items: center;
  justify-content: flex-end;
  button {
    margin: 0 5px;
  }
`;

const StatisticsWrapper = styled(FlexRowCenter)`
  width: 100%;
  // display: inle-block;
  // float: right;
  button {
    margin: 0 5px;
  }
`;

const StatisticsDiv = styled.div`
  width: 110px;
  height: 30px;
  background: ${props => (props.selected ? '#ef4c4f' : '#fff')};
  display: inline-block;
  border-radius: 29px;
  text-align: center;
  line-height: 28px;
  font-size: 14px;
  border: 1px solid #ef4c4f;
  color: ${props => (props.selected ? '#fff' : '#ef4c4f')};
  &:hover {
    opacity: 0.8;
  }
  cursor: pointer;
  margin-right: 10px;
`;

const StatisticsPopover = styled.div`
  span {
    display: inline-block;
    width: 60px;
  }
  i {
    display: inline-block;
    width: 20px;
  }
`;
const QuestionInfo = styled(FlexRow)`
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding: 5px;
  span {
    margin-right: 20px;
    color: #b34d10;
  }
`;
const TextValue = styled.div`
  min-width: 50px;
  text-align: right;
  font-size: 14px;
  color: #333;
`;

const selectTreeType = ['知识点选题', '考点选题', '教材章节选题'];
const defaultSearchSelectKyes = [
  'paperType',
  'questionType',
  'difficulty',
  'grade',
  'term',
  'year',
  'source',
  'examType',
  'input',
];

const defaultSearchSelectKyes2 = [
  'paperType',
  'questionType',
  'difficulty',
  'term',
  'year',
  'source',
  'examType',
  'input',
];
const IconArrow = styled(Icon)`
  color: ${props => (props.selected ? 'red' : '#999')};
  cursor: pointer;
`;
const FilterQuestionNumber = styled.div`
  font-size: 13px;
  color: #999999;
`;
const FilterQuestionOrder = styled(FilterQuestionNumber)`
  span {
    display: inline-block;
    margin-right: 5px;
    padding: 3px 5px;
  }
`;
export class QuestionManagement extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showAllAnalysis: false,
      showAnalysisMap: fromJS({}),
      mode: 'tagged',
      newQuestion: fromJS({}),
      visible: true,
      oldPaperType: 0,
      deleteQuestionId: -1,
      showDelteQuestionModal: false,
      showFilter: true,
      myPhaseSubjectList: fromJS([]), // 我的学科权限
      permissionList: [],
      basketSelected: true, // 试题篮选中状态
      basketPageIndex: 1,
      basketPageSize: 20,
    };
    this.pureState = {};
    this.selectChange = this.selectChange.bind(this);
    this.showHideEditModel = this.showHideEditModel.bind(this);
    this.submitSingleQuestion = this.submitSingleQuestion.bind(this);
    this.closeOrOpenItemQuestion = this.closeOrOpenItemQuestion.bind(this);
    this.makeEditOrAddQuestion = this.makeEditOrAddQuestion.bind(this);
    this.setClickTargetAction = this.setClickTargetAction.bind(this);
    this.setNewQuestionData = this.setNewQuestionData.bind(this);
    this.changeQuestionEditState = this.changeQuestionEditState.bind(this);
    this.changeSelectType = this.changeSelectType.bind(this);
    this.editQuestionSubmit = this.editQuestionSubmit.bind(this);
    this.openOrCloseTagWindow = this.openOrCloseTagWindow.bind(this);
  }
  componentDidMount() {
    this.closeOrOpenItemQuestion(false);
    const { dispatch, getKnowledgeOrExamPoint } = this.props;
    // 获得所有学科
    dispatch(getPhaseSubjectListAction());
    // 获得题型
    dispatch(getQuestionType());
    // 获得科目列表
    getKnowledgeOrExamPoint(this.props);
    // 获取省份
    dispatch(getProvince());
    const paperData = this.getPaperData();
    // 新建试卷的试卷试题篮不选中
    if (paperData.data && !paperData.paperContent) {
      this.setState({ basketSelected: false });
    }
    if (this.judgeIsGroup()) {
      dispatch(setPageState('isGroup', true));
      // 从试卷管理那边过来的
      this.handlePaperFromPaperManagement();
    }
    // 判断老师角色和学科权限 兼职人员要做特殊处理
    this.judgePartTimeRole();
  }

  componentWillUnmount() {
    this.props.dispatch(setReducerInital());
  }

  // 同步输入内容
  setClickTargetAction(str) {
    this.setState({
      clickTarget: str,
    });
  }
  setNewQuestionData(data) {
    this.setState({
      newQuestion: data,
    });
  }
  changeQuestionEditState() {
    this.closeOrOpenItemQuestion(false);
    this.setState({
      newQuestion: fromJS({}),
      curTagQ: fromJS({}),
    });
  }

  openOrCloseTagWindow = bool => {
    this.setState({
      showQuestionTag: bool,
    });
  };
// 保存题目录入信息
  editQuestionSubmit(type) {
    const { newQuestion } = this.state;
    if ([5, 6].includes(newQuestion.get('templateType'))) {
      const response = validateClassifyAndMatch(newQuestion);
      if (response.errorMsg) {
        antdMessage.warning(response.errorMsg || '录入有误，请检查');
        return false;
      } else {
        this.setState({
          curTagQ: response.data,
        });
      }
    } else if ([48, 49].includes(newQuestion.get('typeId'))) {
      // 临时添加，为高考估分添加的双选题和不定项选择题
      const errorMsg = validateChooseForCollegeExam(newQuestion);
      if (errorMsg) {
        antdMessage.info(errorMsg);
        return false;
      }
      this.setState({
        curTagQ: newQuestion,
      });
    } else {
      const errorMsg = validateSavedQuestion(newQuestion);
      if (errorMsg === '题目未设置音频') {  // 如果一个音频都没有设置的话
        const ref = Modal.confirm({
          title: '提示',
          content: errorMsg,
          okText: '确定',
          cancelText: '取消',
          zIndex: 1001,
          onCancel: () => {
            ref.destroy();
            this.setState({
              curTagQ: newQuestion,
              showQuestionTag: true,
              visible: true,
            });
          },
          onOk: () => {
            ref.destroy();
            this.setState({
              curTagQ: newQuestion,
              showQuestionTag: true,
              visible: true,
            });
          },
        });
        return;
      } else if (errorMsg) {
        antdMessage.error(errorMsg);
        return false;
      }
      this.setState({
        curTagQ: newQuestion,
      });
    }
    if (!(type === 'view')) {
      this.openOrCloseTagWindow(true);
      this.setState({
        visible: true,
      });
    }
    return true;
  }

  // 单题录入弹框
  makeEditOrAddQuestion() {
    const { clickTarget, newQuestion, questionEditState } = this.state;
    // console.log('makeEditOrAddQuestion - newQuestion', newQuestion.toJS());
    return (
      <EditItemQuestion
        isOpen
        curTagQ={this.state.curTagQ}
        questionEditState={questionEditState || 0}
        newQuestion={newQuestion}
        clickTarget={clickTarget}
        setNewQuestionData={this.setNewQuestionData}
        changeQuestionEditState={this.changeQuestionEditState}
        setClickTarget={this.setClickTargetAction}
        soucre="questionPicker"
        source2="questionManagement"
        submitQuestionItem={this.editQuestionSubmit}
        isEditChildBUQuestion={newQuestion.get('questionContent')}
      />
    );
  }

  selectChange(value, selectedKnowledge) {
    const { dispatch, selectedtreeitem } = this.props;
    console.log(value, 11111);
    value.id = value.key;
    // const newSelect = fromJS({ id: Number(value.key), name: value.label, level: value.level || -1 });
    // set选中节点
    // dispatch(setSelectedTreeItem(fromJS(value)));
    if (value.key === selectedtreeitem.get('key')) {
      dispatch(setSelectedTreeItem(fromJS({})));
      // return;
    } else {
      dispatch(setSelectedTreeItem(fromJS(value)));
    }
    // dispatch(setPageState('loading', true));
    dispatch(setPageIndex(1));
    setTimeout(() => {
      dispatch(searchQuestions());
    }, 10);
    // this.props.dispatch(getQuestionType());
  }
  orderChange = (key, val, state) => {
    const { dispatch } = this.props;
    console.log(key, val, state);
    dispatch(setOrderParams(key, state === val ? void 0 : val));
    setTimeout(() => {
      dispatch(searchQuestions());
    }, 10);
  }

  handleModeChange(val) {
    localStorage.setItem('Qmode', val.target.value);
    this.setState({
      mode: val.target.value,
    });
  }

  showHideEditModel(bool) {
    this.setState({
      showEditModel: bool,
    });
  }

  async submitSingleQuestion(tags) {
    const { curTagQ } = this.state;
    const tagData = curTagQ.toJS();
    // 排序题的选项需要重新乱序
    if (tagData.templateType === 10) {
      tagData.optionElementList = shuffle(tagData.optionElementList);
    }

    // 修改子题的副知识点、考点
    const children = tagData.children;
    if (children && Array.isArray(children) && children.length > 0) {
      const childrenSelect = tags.childrenSelect;
      children.forEach((item, i) => {
        if (childrenSelect && childrenSelect[i]) {
          item.knowledgeIdList = childrenSelect[i].selectedKnowledge;
          item.examPointIdList = childrenSelect[i].selectedExamPoint;
        }
      });
    }

    const data = await questionApi.saveQuestion(Object.assign(tagData, tags));
    if (data && Number(data.code) === 0) {
      antdMessage.success(data.message || '保存成功');
      this.setState({
        showQuestionTag: false,
        showItemQuestion: false,
        newQuestion: fromJS({}),
      });
      this.updateQuestion(combineComplexQuestion(this.state.curTagQ.toJS(), data.data));
      setTimeout(() => {
        this.props.dispatch(searchQuestions());
      }, 1000);
    } else {
      antdMessage.error((data && data.message) || '保存出错');
    }
    this.setState({ clickTarget: '' });
  }
  // 展示标签
  makeEditQuestionTag() {
    const { curTagQ, isCacheWhenClose, visible } = this.state;
    return (
      <QuestionTag
        question={curTagQ.toJS()}
        visible={visible}
        cancelText={isCacheWhenClose ? '上一步' : '取消'}
        close={() => {
          if (isCacheWhenClose) {
            this.setState({
              visible: false,
            });
            this.closeOrOpenItemQuestion(true);
          } else {
            this.setState({
              showQuestionTag: false,
            });
          }
        }}
        submitTags={tags => {
          this.submitSingleQuestion(tags);
        }}
      />
    );
  }

  judgeIsGroup = () => (this.props.location.state || {}).groupPaper;
  isParallel = () => (this.props.location.state || {}).isParallel;
  // 从试卷过来进行处理
  handlePaperFromPaperManagement = () => {
    const { dispatch, selectPaperProperty } = this.props;
    const paperData = this.getPaperData();
    // 新建试卷
    if (paperData.data && !paperData.paperContent) {
      let newPaperProperty = selectPaperProperty;
      paperData.data.forEach(item => {
        if (item.type === 'paperTypeId') {
          this.setState({ oldPaperType: toNumber(item.value) });
          newPaperProperty = newPaperProperty.set(
            'typeId',
            toString(item.value),
          );
        } else if (
          ['showSystemList', 'systemValue', 'versionValue'].includes(
            item.type,
          ) &&
          item.value
        ) {
          newPaperProperty = newPaperProperty.set(
            item.type,
            fromJS(item.value),
          );
        } else if (item.value === 0 || item.value) {
          newPaperProperty = newPaperProperty.set(
            item.type,
            toString(item.value),
          );
        }
        // console.log(newPaperProperty.toJS(), 'newPaperProperty');
      });
      // console.log('newPaperProperty', newPaperProperty.toJS())
      dispatch(setPaperPropertiesAction(newPaperProperty));
    }
    // 如果是从试卷管理过来的
    if (paperData.paperContent) {
      this.setState({
        isDataExternal: true,
        editMode: paperData.editMode,
        isPublish: paperData.isPublish,
        oldPaperType: toNumber(paperData.paperContent.typeId || -1),
      });
      const paperContent = paperData.paperContent;
      // console.log('paperContent', paperContent);
      // 设置试卷属性
      dispatch(setPaperProperty('epId', paperContent.id));
      dispatch(setPaperProperty('epName', paperContent.name));
      dispatch(setPaperProperty('subjectId', paperContent.subjectId));
      dispatch(setPaperProperty('gradeId', paperContent.gradeId));
      dispatch(setPaperProperty('typeId', paperContent.typeId));
      dispatch(setPaperProperty('difficulty', paperContent.difficulty));
      dispatch(setPaperProperty('year', paperContent.year));
      // dispatch(setPaperProperty('typeId', paperContent.typeId));
      dispatch(setPaperProperty('termId', paperContent.termId));
      dispatch(setPaperProperty('provinceId', paperContent.provinceId));
      dispatch(setPaperProperty('cityId', paperContent.cityId));
      dispatch(setPaperProperty('countyId', paperContent.countyId));
      dispatch(setPaperProperty('examTypeId', paperContent.examTypeId));
      dispatch(setPaperProperty('businessCardId', paperContent.businessCardId));
      dispatch(setPaperProperty('purpose', paperContent.purpose));
      dispatch(
        setPaperProperty('evaluationTarget', paperContent.evaluationTarget),
      );
      dispatch(
        setPaperProperty('evaluationPurpose', paperContent.evaluationPurpose),
      );
      dispatch(setPaperProperty('epBu', paperContent.epBu));
      dispatch(setPaperProperty('onlineFlag', paperContent.onlineFlag));
      // 心理测评
      if (isMentality(paperContent.typeId)) {
        dispatch(setPaperProperty('rateList', fromJS(paperContent.rateList)));
        dispatch(setPaperProperty('totalScore', paperContent.totalScore));
        dispatch(setPaperProperty('minScore', paperContent.minScore));
      }
      dispatch(setPaperProperty('source', paperContent.source));
      /** 课程内容和教材版本 */
      if (paperContent.examPaperCourseContent) {
        // 课程
        const {
          courseContentId,
          courseContentName,
          editionId,
          editionName,
        } = paperContent.examPaperCourseContent;
        if (courseContentId) {
          const systemValue = {};
          systemValue.label = courseContentName;
          systemValue.value = String(courseContentId);
          paperContent.systemValue = systemValue;
          dispatch(
            setPaperProperty(
              'showSystemList',
              fromJS([{ name: courseContentName }]),
            ),
          );
          dispatch(
            setPaperProperty('systemValue', fromJS(paperContent.systemValue)),
          );
        } else {
          paperContent.systemValue = null;
        }
        dispatch(setPaperProperty('editionName', editionName || ''));
        dispatch(
          setPaperProperty('editionId', editionId ? String(editionId) : ''),
        );
      }
      if (paperContent.examPaperTextbook) {
        // 教材
        const {
          textbookName,
          textbookId,
          teachingEditionId,
          teachingEditionName,
        } = paperContent.examPaperTextbook;
        if (textbookId) {
          const versionValue = {};
          versionValue.label = textbookName;
          versionValue.value = String(textbookId);
          paperContent.versionValue = versionValue;
          dispatch(
            setPaperProperty('versionValue', fromJS(paperContent.versionValue)),
          );
        } else {
          paperContent.versionValue = null;
        }
        dispatch(
          setPaperProperty('teachingEditionName', teachingEditionName || ''),
        );
        dispatch(
          setPaperProperty(
            'teachingEditionId',
            teachingEditionId ? String(teachingEditionId) : '',
          ),
        );
      }
      /** 课程内容和教材版本 */
      const paperContentList = paperContent.examPaperContentOutputDTOList;
      // 把试题拆成单题list
      // const questionList = [];
      let questionIndex = 1;
      paperContentList.forEach(item => {
        item.examPaperContentQuestionOutputDTOList &&
          item.examPaperContentQuestionOutputDTOList.forEach((it, index) => {
            const questionItemData = it.questionOutputDTO || {};
            questionItemData.score = it.score || 3;
            questionItemData.answerRule = it.answerRule;
            questionItemData.chooseGroup = it.chooseGroup;
            questionItemData.scoreList = it.scoreList;
            questionItemData.questionIndex = questionIndex;
            // questionList.push(questionItemData);
            item.examPaperContentQuestionOutputDTOList[index] = questionItemData;
            questionIndex += 1;
          });
      });
      // 设置题目数据
      // dispatch(setQuestionData(fromJS(questionList)));
      // 加入作业篮
      // 从“试卷管理”过来的题目数据如果用途是“线上测评”，数据库中仍然有不符合加入条件的脏数据
      // questionList.forEach(item => {
      //   dispatch(addHomeWorkQuestionAction(fromJS(item)));
      // });
      dispatch(setHwQuestionAndPaperAction(fromJS(paperContentList), !this.judgeIsGroup()));
      // 弹出完成选题框
      this.showHideEditModel(true);
      // dispatch(setTotalQuestion(fromJS(questionList.length)));
    }
  };

  getPaperData = () => AppLocalStorage.getPaperData();

  judgePartTimeRole = () => {
    const { dispatch } = this.props;
    const userInfo = AppLocalStorage.getUserInfo();
    const isPartTimePersion = userInfo.typeList.indexOf(2) > -1;
    if (isPartTimePersion) {
      // 科学学科的兼职人员在组卷时可以选择物理、化学、生物三科所有学段的题目；
      const json = JSON.stringify(userInfo.phaseSubjectList);
      let allPermission = fromJS(userInfo.phaseSubjectList);
      if (json.indexOf('初中科学') > -1) {
        setTimeout(() => {
          this.props.phaseSubjectList.toJS().forEach(e => {
            if (
              e.name.indexOf('初中物理') > -1 ||
              e.name.indexOf('初中化学') > -1 ||
              e.name.indexOf('初中生物') > -1 ||
              e.name.indexOf('初中地理') > -1
            ) {
              const hasItem = allPermission.find(
                t => Number(t.get('id')) === Number(e.id),
              ); // 没有这个权限再加进去
              if (!hasItem) {
                allPermission = allPermission.push(fromJS(e));
              }
            }
          });
          this.setState({
            myPhaseSubjectList: allPermission,
          });
        }, 1000);
      }
      this.setState({
        myPhaseSubjectList: allPermission,
        isPartTimePersion,
      });
      dispatch(
        setPhaseSubjectAction(
          fromJS({ id: String(userInfo.phaseSubjectList[0].id) }),
        ),
      );
      this.loadingKnowledge();
    }
    this.setState({
      permissionList: userInfo.permissionList,
    });
  };

  // 开关新增题目面板
  closeOrOpenItemQuestion(isOpen) {
    this.setState({
      showItemQuestion: isOpen,
    });
    // 关闭的时候把弹窗恢复默认状态
    if (!isOpen) {
      this.setState({
        visible: true,
        showQuestionTag: false,
      });
    }
  }

  changeSelectType(value, type) {
    const { dispatch } = this.props;
    // console.log(value, type, 'changeSelect');
    // dispatch(setCurFilterFields(type === 'questionType' ? 'typeId' : type, toString(value.id)));
    if (type === 'input') {
      dispatch(setCurFilterFields('keyword', value));
      return;
    }
    let iType = type;
    if (type === 'questionType') {
      iType = 'typeId';
    } else if (
      [
        'grade',
        'subject',
        'term',
        'edition',
        'examType',
        'province',
        'city',
        'county',
        'paperCard',
        'comprehensiveDegree',
        'source',
        'businessCard',
      ].includes(type)
    ) {
      iType = `${type}Id`;
    } else if (type === 'scene') {
      iType = 'sceneIds';
    } else if (type === 'paperType') {
      iType = 'examPaperTypeId';
    }
    dispatch(setCurFilterFields(iType, toString(value.id)));
    if (type === 'province') {
      dispatch(setCurFilterFields('cityId', -1));
      dispatch(setCurFilterFields('countyId', -1));
    } else if (type === 'city') {
      dispatch(setCurFilterFields('countyId', -1));
    }
  }

  PaginationChange = (page, pageSize) => {
    const { dispatch } = this.props;
    dispatch(setPageIndex(page));
    dispatch(setPageSize(pageSize));
    dispatch(searchQuestions());
  };

  PaginationSizeChange = (current, size) => {
    const { dispatch } = this.props;
    dispatch(setPageIndex(1));
    dispatch(setPageSize(size));
    dispatch(searchQuestions());
  };

  loadingKnowledge = () => {
    const { dispatch } = this.props;
    setTimeout(() => {
      dispatch(getQuestionType());
      this.props.getKnowledgeOrExamPoint(this.props);
      dispatch(setSelectedTreeItem(fromJS({})));
    }, 500);
  };

  // 切换试题篮的状态
  toggleBasketSelected = () => {
    const { basketSelected } = this.state;
    const { choosedquestions } = this.props;
    if (!basketSelected && flatQuestionData(choosedquestions).count() <= 0) {
      antdMessage.warning('试题篮为空，请先选择题目！');
      return;
    }
    this.setState({ basketSelected: !basketSelected });
  }
  // 试题篮中的题目分页
  handleBusketPageChange = (basketPageIndex, basketPageSize) => {
    this.setState({ basketPageIndex, basketPageSize });
  }

  // 获取题目数据, 返回搜索的数据或者试题篮中的数据
  getQuestionList = () => {
    const { basketSelected, basketPageIndex, basketPageSize, } = this.state;
    const { choosedquestions, questionData } = this.props;
    const isGroup = this.judgeIsGroup();
    // 如果是非选题的状态 直接返回题目列表
    if (!isGroup) {
      return questionData;
    }
    if (basketSelected) {
      const startIndex = (basketPageIndex - 1) * basketPageSize;
      const endIndex = startIndex + basketPageSize;
      return flatQuestionData(choosedquestions).slice(startIndex, endIndex);
    } else {
      return questionData;
    }
  }
  // 更新试题篮中的数据和 localStorage 中的试卷数据
  updateQuestion = (data) => {
    const { dispatch } = this.props;
    const isGroup = this.judgeIsGroup();
    if (!data || !isGroup) return;
    dispatch(updateHomeWorkQuestionAction(fromJS(data)));

    const paperData = this.getPaperData();
    const paperQuestion = paperData.paperContent && paperData.paperContent.examPaperContentOutputDTOList || [];
    for (let i = 0; i < paperQuestion.length; i++) {
      const questionList = paperQuestion[i].examPaperContentQuestionOutputDTOList;
      for (let j = 0; j < questionList.length; j++) {
        if (String(data.id) === String(questionList[j].questionOutputDTO.id)) {
          questionList[j].questionOutputDTO = data;
          AppLocalStorage.setPaperData(paperData);
          return;
        }
      }
    }
  }

  handleValueChange = (data) => {
    const { dispatch } = this.props;
    const { gradeId, subjectId, knowledge } = data;
    dispatch(setQuestionData(fromJS([])));
    dispatch(setTotalQuestion(0));
    dispatch(setKnowledgeIds([]));
    if (gradeId) {
      this.pureState.gradeId = gradeId;
    }
    if (subjectId) {
      this.pureState.subjectId = subjectId;
    }
    const { gradeId: _gradeId, subjectId: _subjectId } = this.pureState;
    dispatch(setGradeSubjectAction(fromJS({ gradeId: _gradeId, subjectId: _subjectId })));
    if (knowledge) {
      if (knowledge.length === 0) antdMessage.warning('未选择知识点或选择的教材目录无知识点');
      dispatch(setKnowledgeIds(knowledge));
      dispatch(searchQuestions());
    }
  }

  handleTypeChange = async sliderState => {
    const { dispatch, selectTreeTypeChange, getKnowledgeOrExamPoint, phaseSubjectChange, phaseSubject } = this.props;
    if (sliderState === '2') {
      dispatch(setQuestionData(fromJS([])));
      dispatch(setTotalQuestion(0));
      this.prevSliderState = '2';
      const phaseSubjectId = phaseSubject.get('id');
      const { gradeId, subjectId } = await server.getFirstGradeSubject(phaseSubjectId);
      dispatch(setGradeSubjectAction(fromJS({ gradeId, subjectId })));
      this.pureState.gradeId = gradeId;
      this.pureState.subjectId = subjectId;
    } else if (this.prevSliderState === '2') {
      this.prevSliderState = 0;
      dispatch(setQuestionData(fromJS([])));
      dispatch(setTotalQuestion(0));
      const { gradeId, subjectId } = this.pureState;
      const value = await server.getParseSubject(gradeId, subjectId);
      if (value) {
        phaseSubjectChange(value, this.props);
        this.loadingKnowledge();
        dispatch(setPageIndex(1));
        setTimeout(() => {
          dispatch(searchQuestions());
        }, 1000);
      }
    }
    selectTreeTypeChange(sliderState, this.props);
    if (sliderState === 2) return; // 教材章节选题
    setTimeout(() => {
      getKnowledgeOrExamPoint(this.props);
    }, 500);
  }
  // eslint-disable-next-line complexity
  render() {
    const {
      dispatch,
      selectedtreeitem,
      phaseSubject,
      knownLedgeList,
      filterFields,
      curFilterFields,
      orderParams,
      questionData,
      choosedquestions,
      pageState,
      totalQuestion,
      pageIndex,
      userMap,
      selectPaperProperty,
      questionpagesize,
    } = this.props;
    const {
      editMode,
      isDataExternal,
      isPublish,
      showItemQuestion,
      showQuestionTag,
      showEditModel,
      mode,
      isPartTimePersion,
      myPhaseSubjectList,
      permissionList,
      basketSelected,
      basketPageIndex,
      basketPageSize,
    } = this.state;
    const showQuestionList = this.getQuestionList();
    // 自组试卷
    const isGroup = this.judgeIsGroup();
    // 试题精选
    const isTagged = isGroup === true ? false : mode === 'tagged';
    const id = curFilterFields.get('id');
    const updatedTimeSort = orderParams.get('updatedTime');
    const quoteCountSort = orderParams.get('quoteCount');
    const questionCount = calculateSum(choosedquestions, 'examPaperContentQuestionOutputDTOList', []).count;
    const { gradeId, subjectId } = this.pureState;
    // 试题篮悬浮框内容
    const content = questions => {
      // const choosedMap = {};
      // questions.forEach(it => {
      //   const type = it.get('name');
      //   choosedMap[type] = it.get('examPaperContentQuestionOutputDTOList');
      // });
      return (
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {questions.map((it, index) => (
            <StatisticsPopover key={index}>
              <span>{it.get('name')}</span>
              <i>{it.get('examPaperContentQuestionOutputDTOList').count()}</i>
              <Button
                onClick={() => {
                  this.setState({ basketPageIndex: 1 });
                  if (it.get('examPaperContentQuestionOutputDTOList').count() > 0) {
                    it.get('examPaperContentQuestionOutputDTOList').forEach(it => {
                      dispatch(removeHomeWorkQuestionAction(it, true));
                    });
                  } else {
                    dispatch(removeHomeWorkQuestionAction(fromJS({}), true));
                  }
                }}
              >
                删除
              </Button>
            </StatisticsPopover>
          ))}
        </div>
      );
    };
    filterFields
      .getIn(['typeId', 'values'])
      .filter(item => [1, 2, 6].includes(toNumber(item.get('id'))));
    const successCb = () => {
      dispatch(setPageState('state', ''));
      if (isDataExternal || this.getPaperData().data) {
        dispatch(setReducerInital());
        browserHistory.push({
          pathname: isParttime ? '/parttime/papermanagement' : '/tr/papermanagement',
        });
      }
      this.props.clearChoosedQuestion(this.props);
    };
    const editCb = () => {
      dispatch(setPageState('state', ''));
      this.setState({
        showEditModel: true,
      });
    };
    const backCb = () => {
      dispatch(setPageState('state', ''));
      if (isDataExternal) {
        dispatch(setReducerInital());
        browserHistory.push({
          pathname: isParttime ? '/parttime/papermanagement' : '/tr/papermanagement',
        });
      }
    };
    const renderOperationBtn = item => [
      permissionList.indexOf('edit_question') > -1 ? (
        <Button
          key="editTag"
          type="primary"
          onClick={() => {
            console.log(item.toJS(), 'itemitem');
            this.setState({
              showQuestionTag: true,
              curTagQ: item,
              isCacheWhenClose: false,
            });
          }}
        >
          编辑题目标签
        </Button>
      ) : null,
      permissionList.indexOf('edit_question') > -1 ? (
        <Button
          key="edit"
          type="primary"
          onClick={() => {
            this.setState({
              showItemQuestion: true,
              newQuestion: fromJS({}).merge(item),
              curTagQ: fromJS({}).merge(item),
            });
            this.setNewQuestionData(item);
          }}
        >
          编辑本题
        </Button>
      ) : null,
      permissionList.indexOf('edit_question') > -1 ? (
        <Button
          key="gaibian"
          type="primary"
          title="改编后，此题将作为新题保存"
          onClick={() => {
            const copyItem = item
              .set('id', null)
              .set('sourceId', '4')
              .set('quoteCount', 0);
            this.setState({
              showItemQuestion: true,
              newQuestion: fromJS({}).merge(copyItem),
              curTagQ: fromJS({}).merge(copyItem),
            });
            this.setNewQuestionData(copyItem);
          }}
        >
          改编本题
        </Button>
      ) : null,
      permissionList.indexOf('delete_question') > -1 ? (
        <Button
          key="delete"
          type="primary"
          onClick={() => {
            this.setState({
              showDelteQuestionModal: true,
              deleteQuestionId: item.get('id') || -1,
            });
          }}
        >
          删除本题
        </Button>
      ) : null,
    ];

    /**
     * @description 过滤得到应该显示的题型, 高考真题：typeId=11，在线测评：typeId!=11 purpose=1
     * typeId: 试卷类型，purpose: 试卷用途
     * @example const questionTypeList = filterQuestionTypes();
     * @return {id: number, name: string}[]
     * @history1 2019-06-03 高考真题添加 48、49 题型，其他不加
     */
    const filterQuestionTypes = () => {
      if (isGroup) {
        let res = filterFields.getIn(['typeId', 'values']).filter(item => ![48, 49].includes(toNumber(item.get('id')))).toJS();
        // console.log(filterFields.toJS(), 'filterFields --');
        const isCollege = toNumber(selectPaperProperty.get('typeId')) === 11; // 是否是高考真题
        // 组卷
        if (isMentality(selectPaperProperty.get('typeId'))) {
          // 心理测评
          res = res.filter(item => [1, 47].includes(toNumber(item.id)));
        } else if (isCollege) {
            // 高考真题 需要返回 48、49 的题型
          res = filterFields.getIn(['typeId', 'values']).toJS();
        }
        // console.log(res, 'res');
        return filterCartoonForGroupPaper(res);
      } else {
        return filterFields.getIn(['typeId', 'values']).toJS();
      }
    };
    /**
    * @description 对于用途是“ 线上测评” 的试卷进行组卷， 添加的题目只能是客观题
    * @see The <a href=”http://jira.zmops.cc/browse/TK-458”>JIRA</a >.
    * @example canAdd(Immutable.Map)
    * @param {Immutable.Map} question 题目
    * @return {Bool} true 满足添加到试题篮的条件
    */
    const canAdd = (question) => {
      // console.log('isObjective', question.get('isObjective'), '试卷用途', selectPaperProperty.get('purpose'));
      if (Number(selectPaperProperty.get('purpose')) === 1) return question.get('isObjective');
      return true;
    };
    /**
    * @description 将题目信息添加到redux中
    * @example addHomeWorkQuestion(Immutable.Map)
    * @param {Immutable.Map} question 题目
    * @return {void}
    */
    const addHomeWorkQuestion = (question) => {
      const canAddTo = canAdd(question);
      canAddTo ?
        dispatch(
          addHomeWorkQuestionAction(question),
        ) : antdMessage.warning('在线测评只允许添加客观题型！');
    };
    const renderQuestion = (questionData) => (
      <QuestionWrapper
        hasQuestion={questionData.count() > 0 && !pageState.get('loading')}
        className="question-wrapper"
      >
        {
          questionData.count() > 0 || pageState.get('loading') ? null : (
            <FlexCenter style={{ height: '70%', flex: 1 }}>
              <div>
                <img role="presentation" src={emptyImg} />
                <h2 style={{ color: '#999', textAlign: 'center' }}>
                      这里空空如也！
                    </h2>
              </div>
            </FlexCenter>
              )
        }
        {
          pageState.get('loading') ? (
            <FlexCenter style={{ flex: 1, marginTop: 100 }}>
              <div>
                <img role="presentation" src={loadingImg} />
              </div>
            </FlexCenter>
              ) : (
                questionData.map((item, index) => {
                  const { showAnalysisMap } = this.state;
                  const showAnalysis = showAnalysisMap.get(
                    String(item.get('id')),
                  );
                  const isInChooseQuestions =
                    flatQuestionData(choosedquestions)
                      .filter(it => it.get('id') === item.get('id'))
                      .count() > 0;
                  const user =
                    item.get('updatedUser') || item.get('createdUser') || 0;
                  /*
                  const isComplex = item.get('templateType') === 1;
                  const isNewType = [5, 6, 7].includes(
                    item.get('templateType'),
                  ); // 新题型
                  */
                  return (
                    <QuestionItem key={index}>
                      <section>
                        <QuestionInfoWrapper style={{ borderWidth: '2px' }}>
                          <ZmExamda
                            index={`${index + 1}、`}
                            question={item}
                            showRightAnswer={showAnalysisMap.get(String(item.get('id')))}
                            options={showAnalysis ?
                            [
                              'title', 'listenFile', 'references', 'problem', {
                                key: 'children',
                                indexType: '(__$$__)',
                                groupIndexType: '(__$$__)',
                                answerFollowChild: true,
                              },
                              'answerList', 'analysis', 'listenMaterial',
                            ]
                              :
                            ['title', 'reference', 'problem', 'listenFile', {
                              key: 'children',
                              indexType: '(__$$__)',
                            }]}
                          />
                          <QuestionInfo>
                            <span>题目id：{item.get('id')}</span>
                            <span>
                              最后修改：
                              {userMap.toJS()[user]
                                ? `${userMap.toJS()[user]}/`
                                : ''}
                              {timestampToDate(
                                item.get('updatedTime') ||
                                  item.get('createdTime'),
                              )}
                            </span>
                            <span>使用次数：{item.get('quoteCount')}</span>
                            <span>答题次数：{item.get('questionAnswerCount')}</span>
                          </QuestionInfo>
                          <HideButton className="showHideButton">
                            <Button
                              type="primary"
                              size="large"
                              onClick={() => {
                                this.setState({
                                  showAnalysisMap: showAnalysisMap.set(
                                      String(item.get('id')),
                                      !showAnalysis,
                                    ),
                                });
                              }}
                              >
                              {showAnalysis ? '隐藏答案' : '查看答案'}
                            </Button>
                            {isGroup ? (
                              isInChooseQuestions ? (
                                <Button
                                  onClick={() => {
                                    dispatch(
                                      removeHomeWorkQuestionAction(item),
                                    );
                                  }}
                                >
                                  移出试题篮
                                </Button>
                              ) : (
                                <Button
                                  type="primary"
                                  onClick={() => {
                                    addHomeWorkQuestion(item);
                                  }}
                                >
                                  加入试题篮
                                </Button>
                              )
                            ) : null}
                            {renderOperationBtn(item)}
                            <ErrorCorrect
                              questionId={item.get('id')}
                              sourceModule={sourceModule.tk.questionManagement.id}
                            />
                          </HideButton>
                          {/* {isComplex ? (
                            <ListChildQuestion
                              children={item.get('children')} // eslint-disable-line
                            />
                          ) : (
                            <AnalysisWrapper
                              show={showAnalysis && !isNewType}
                            >
                              <AnalysisItem>
                                <AnswerTitle>解析：</AnswerTitle>
                                <AnswerConten
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      renderToKatex(
                                        backfromZmStandPrev(
                                          item.get('analysis') || '暂无',
                                          'createHw',
                                        ).replace(
                                          /(【解析】<br \/>)|(【解析】)|(【分析】)/g,
                                          '',
                                        ),
                                      ) || '',
                                  }}
                                />
                              </AnalysisItem>
                              {item.get('answerList') &&
                              item.get('answerList').count() > 0 ? (
                                <AnalysisItem>
                                  <AnswerTitle>答案：</AnswerTitle>
                                  {item.get('optionList') &&
                                  item
                                    .get('optionList')
                                    .filter(iit => filterHtmlForm(iit))
                                    .count() > 0 ? (
                                      <AnswerConten>
                                        {(
                                        item.get('answerList') || fromJS([])
                                      ).join('、')}
                                      </AnswerConten>
                                  ) : (
                                    <FlexColumn style={{ flex: 1 }}>
                                      {(
                                        item.get('answerList') || fromJS([])
                                      ).map((itt, ii) => {
                                        return (
                                          <AnswerConten
                                            key={ii}
                                            className={'rightAnswer'}
                                            dangerouslySetInnerHTML={{
                                              __html:
                                                renderToKatex(
                                                  backfromZmStandPrev(
                                                    itt,
                                                    'createHw',
                                                  ).replace(
                                                    /(【答案】)|(【解答】)/g,
                                                    '',
                                                  ),
                                                ) || '',
                                            }}
                                          />
                                        );
                                      })}
                                    </FlexColumn>
                                  )}
                                </AnalysisItem>
                              ) : null}
                            </AnalysisWrapper>
                          )} */}
                        </QuestionInfoWrapper>
                      </section>
                    </QuestionItem>
                  );
                })
              )}
      </QuestionWrapper>
    );
    const searchSelectKyes = this.props.selectedType !== '2' ? defaultSearchSelectKyes : defaultSearchSelectKyes2;
    return (
      <RootDiv>
        <ContentWrapper>
          {showItemQuestion ? this.makeEditOrAddQuestion() : ''}
          {showQuestionTag ? this.makeEditQuestionTag() : ''}
          {pageState.get('isSubmit') ? <MaskLoading text="上传中" /> : ''}
          {showEditModel ? (
            <PaperEdit
              isPublish={isPublish}
              editMode={editMode}
              oldPaperType={this.state.oldPaperType}
              isDataExternal={isDataExternal}
              back={this.showHideEditModel}
              paperContent={
                isDataExternal ? this.getPaperData().paperContent : ''
              }
              isParallel={this.isParallel()}
              backPath={this.getPaperData().backRoutePath}
            />
          ) : null}
          {pageState.get('state')
            ? publishModal(
                pageState.get('state'),
                isDataExternal,
                successCb,
                editCb,
                backCb,
              )
            : ''}
          <ContentLeft>
            <div style={{ width: '100%', padding: '0 5px' }}>
              <Select
                style={{ width: '100%', marginBottom: 5 }}
                labelInValue={false}
                value={this.props.selectedType}
                onChange={this.handleTypeChange}
              >
                {selectTreeType.map((item, index) => {
                  return (
                    <Select.Option
                      value={String(index)}
                      key={index}
                      title={item}
                    >
                      {item}
                    </Select.Option>
                  );
                })}
              </Select>
              {this.props.selectedType !== '2' && <Select
                style={{ width: '100%' }}
                labelInValue={false}
                value={`${phaseSubject.get('id')}`}
                onChange={value => {
                  this.props.phaseSubjectChange(value, this.props);
                  this.loadingKnowledge();
                  dispatch(setPageIndex(1));
                  setTimeout(() => {
                    this.props.dispatch(searchQuestions());
                  }, 1000);
                }}
              >
                {(isPartTimePersion
                  ? myPhaseSubjectList
                  : this.props.phaseSubjectList
                ).map((item, index) => {
                  return (
                    <Select.Option
                      value={item.get('id').toString()}
                      key={item.get('id').toString()}
                      title={item.get('name')}
                    >
                      {item.get('name')}
                    </Select.Option>
                  );
                })}
              </Select>}
            </div>
            {this.props.selectedType === '2'
            ? <TextEditionSlider autoSelect={false} gradeId={gradeId} subjectId={subjectId} onValueChange={this.handleValueChange} />
            : knownLedgeList.count() > 0 ? (
              <HomeworkTree
                selectTree={selectedtreeitem}
                treeList={knownLedgeList}
                onSelect={this.selectChange}
              />
            ) : (
              <FlexCenter
                style={{ flex: 1, height: '100%', width: '100%' }}
              >
                <div style={{ textAlign: 'center' }}>
                  <img
                    role="presentation"
                    src={emptyImg}
                    style={{ width: 100 }}
                  />
                  <h5 style={{ color: '#999', textAlign: 'center' }}>
                    没有找到相关课程体系哦
                  </h5>
                </div>
              </FlexCenter>
            )}
          </ContentLeft>
          <ContentRight id="ContentRight">
            <BackTop
              target={() =>
                document.getElementById('ContentRight') || window
              }
            />
            <FlexRowCenter style={{ position: 'relative' }}>
              {isGroup ? (
                <StatisticsWrapper>
                  <Button
                    type="primary"
                    onClick={() => {
                      browserHistory.push({
                        pathname: isParttime ? '/parttime/papermanagement' : '/tr/papermanagement',
                      });
                    }}
                  >
                    <Icon type="left" />
                    返回试卷列表
                  </Button>
                  <PlaceHolderBox />
                  <Popover
                    placement="bottom"
                    content={content(choosedquestions)}
                    title="已选试题 数量 操作"
                  >
                    <StatisticsDiv selected={basketSelected} onClick={this.toggleBasketSelected}>
                      试题篮({questionCount})
                    </StatisticsDiv>
                  </Popover>
                  {flatQuestionData(choosedquestions).count() > 0 ? (
                    <Popconfirm
                      placement="topLeft"
                      title={'是否确认删除'}
                      onConfirm={() => {
                        this.setState({ basketPageIndex: 1 });
                        this.props.clearChoosedQuestion(this.props);
                      }}
                      okText="是"
                      cancelText="否"
                    >
                      <Button size="large">清空试题篮</Button>
                    </Popconfirm>
                  ) : null}
                  {flatQuestionData(choosedquestions).count() > 0 ? (
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => {
                        // 判断选题是否符合条件(线上测评只能添加客观题)
                        let canAdds = [];
                        console.log(choosedquestions.toJS());
                        choosedquestions.forEach((item) => {
                          item.get('examPaperContentQuestionOutputDTOList').forEach(small => {
                            canAdds.push(Number(canAdd(small)));
                          });
                        });
                        // 如果有不符合条件的题目则不弹出试卷预览编辑页面
                        if (canAdds.includes(0)) {
                          antdMessage.warning('在线测评只允许添加客观题型！');
                          return;
                        }
                        // 弹出框编辑框
                        let paperData = AppLocalStorage.getPaperData();
                        paperData.firstEnterEdit = 1;
                        AppLocalStorage.setPaperData(paperData);
                        this.setState({ editMode: 'edit' });
                        this.showHideEditModel(true);
                      }}
                    >
                      完成选题
                    </Button>
                  ) : (
                    <Button
                      size="large"
                      onClick={() => {
                        antdMessage.info('请先完成选题');
                      }}
                    >
                      完成选题
                    </Button>
                  )}
                </StatisticsWrapper>
              ) : null}
            </FlexRowCenter>
            {/* 将其原本筛选条件注释，改为下拉框形式并增加 题目来源 以及 卷型 */}
            <QuestionSearchData
              searchStyle={{
                wrapper: { width: '100%' },
                item: { height: 35 },
              }}
              // 题型，难度，年级，学期，年份，题目来源，如果来源中选中了高考真题则加上 卷型
              whoseShow={searchSelectKyes.concat([
                'area',
                'distinction',
                'comprehensiveDegree',
                'rating',
                'scene',
                'knowledgeType',
                'businessCard'
              ])}
              dataList={{
                // 用途为测评的要限制2018927
                questionType: filterQuestionTypes(),
              }}
              searchDate={{
                placeholder: '请输入关键字',
                inputName: '关键字',
              }}
              selectType={{
                paperType: {
                  id: toNumber(curFilterFields.get('examPaperTypeId')) || -1,
                },
                questionType: {
                  id: toNumber(curFilterFields.get('typeId')) || -1,
                },
                difficulty: {
                  id: toNumber(curFilterFields.get('difficulty')) || -1,
                },
                grade: {
                  id: toNumber(curFilterFields.get('gradeId')) || -1,
                },
                term: { id: toNumber(curFilterFields.get('termId')) || -1 },
                year: { id: toNumber(curFilterFields.get('year')) || -1 },
                source: {
                  id: toNumber(curFilterFields.get('sourceId')) || -1,
                },
                examType: {
                  id: toNumber(curFilterFields.get('examTypeId')) || -1,
                },
                // province: { id: toNumber(curFilterFields.get('provinceId')) || -1 },
                province: {
                  id:
                    toNumber(curFilterFields.get('provinceId')) === 0
                      ? 0
                      : toNumber(curFilterFields.get('provinceId')) || -1,
                },
                city: { id: toNumber(curFilterFields.get('cityId')) || -1 },
                county: {
                  id: toNumber(curFilterFields.get('countyId')) || -1,
                },
                distinction: {
                  id: toNumber(curFilterFields.get('distinction')) || -1,
                },
                comprehensiveDegree: {
                  id:
                    toNumber(
                      curFilterFields.get('comprehensiveDegreeId'),
                    ) || -1,
                },
                rating: {
                  id: toNumber(curFilterFields.get('rating')) || -1,
                },
                scene: {
                  id: toNumber(curFilterFields.get('sceneIds')) || -1,
                },
                knowledgeType: {
                  id: toNumber(curFilterFields.get('knowledgeType')) || -1,
                },
                businessCard: {
                  id: toNumber(curFilterFields.get('businessCardId')) || -1,
                }
              }}
              noFetch={{ questionType: true }}
              changeSelect={this.changeSelectType}
            >
              <FlexRowCenter>
                <TextValue style={{ minWidth: 68 || '' }}>
                  <span>题目id：</span>
                </TextValue>
                <Input
                  style={{ width: 120 }}
                  value={id}
                  suffix={
                    id ? (
                      <Icon
                        type="close-circle"
                        onClick={() =>
                          dispatch(setCurFilterFields('id', ''))
                        }
                      />
                    ) : null
                  }
                  type="number"
                  onKeyDown={e => {
                    if (e.keyCode === 13) {
                      this.changeSelect('click', 'search');
                    }
                  }}
                  onChange={e => {
                    dispatch(setCurFilterFields('id', e.target.value));
                  }}
                  placeholder="请输入题目id"
                />
                <SearchButton
                  type="primary"
                  onClick={() => {
                    // 重置显示全部解析
                    this.setState({
                      basketSelected: false,
                      showAnalysisChecked: false,
                      showAllAnalysis: false,
                      showAnalysisMap: fromJS({}),
                    });
                    dispatch(setPageIndex(1));
                    dispatch(searchQuestions());
                  }}
                >
                  查询
                </SearchButton>
                <FlexRowCenter>
                  {isTagged ? (
                    <Button
                      type="primary"
                      onClick={() => {
                        this.setState({
                          isCacheWhenClose: true,
                          questionEditState: 0,
                        });
                        this.closeOrOpenItemQuestion(true);
                      }}
                    >
                      新增题目
                    </Button>
                  ) : null}
                </FlexRowCenter>
              </FlexRowCenter>
            </QuestionSearchData>
            <FlexRowCenter style={{ padding: '0 8px', display: (isGroup && basketSelected) ? 'none' : 'flex' }}>
              <FilterQuestionOrder>
                排序：
                <span>
                  题目使用量
                  <IconArrow
                    onClick={() => this.orderChange('quoteCount', 'ASC', quoteCountSort)}
                    type="arrow-up"
                    selected={quoteCountSort === 'ASC'}
                  />
                  <IconArrow
                    onClick={() => this.orderChange('quoteCount', 'DESC', quoteCountSort)}
                    type="arrow-down"
                    selected={quoteCountSort === 'DESC'}
                  />
                </span>
                <span>
                  时间
                  <IconArrow
                    onClick={() => this.orderChange('updatedTime', 'ASC', updatedTimeSort)}
                    type="arrow-up"
                    selected={updatedTimeSort === 'ASC'}
                  />
                  <IconArrow
                    onClick={() => this.orderChange('updatedTime', 'DESC', updatedTimeSort)}
                    type="arrow-down"
                    selected={updatedTimeSort === 'DESC'}
                  />
                </span>
              </FilterQuestionOrder>
            </FlexRowCenter>
            <FlexRowSide h="30">
              <QuestionResultTitle>
                { isGroup && basketSelected
                  ? <span>试题篮中共有题目<i>{questionCount}</i>道</span>
                  : <span>共有符合条件的题目<i>{totalQuestion}</i>道</span>
                }
              </QuestionResultTitle>
              {questionData.count() > 0 ? (
                <AlignCenterDiv>
                  <Switch
                    checked={this.state.showAnalysisChecked || false}
                    onChange={() => {
                      this.setState({
                        showAnalysisChecked: !this.state
                          .showAnalysisChecked,
                      });
                      const showAllAnalysis = this.state.showAllAnalysis;
                      const _map = {};
                      questionData.forEach(item => {
                        _map[item.get('id')] = !showAllAnalysis;
                      });
                      this.setState({
                        showAnalysisMap: fromJS(_map),
                        showAllAnalysis: !showAllAnalysis,
                      });
                    }}
                    checkedChildren="显示"
                    unCheckedChildren="隐藏"
                    style={{ marginRight: 5 }}
                  />
                  显示答案与解析
                  {isGroup ? (
                    <Button
                      style={{ width: 130, marginLeft: 5 }}
                      size="large"
                      onClick={() => {
                        questionData.forEach(item => {
                          addHomeWorkQuestion(item);
                        });
                      }}
                    >
                      将本页全部加入
                    </Button>
                  ) : null}
                </AlignCenterDiv>
              ) : null}
            </FlexRowSide>
            {
              renderQuestion(showQuestionList)
            }
            {!(isGroup && basketSelected) && questionData.count() > 0 && !pageState.get('loading') ? (
              <div style={{ margin: '20px 0 0 5px' }}>
                <Pagination
                  onShowSizeChange={this.PaginationSizeChange}
                  showQuickJumper
                  showSizeChanger
                  onChange={this.PaginationChange}
                  pageSize={questionpagesize}
                  pageSizeOptions={['5', '10', '20', '30']}
                  total={totalQuestion}
                  current={pageIndex}
                />
              </div>
            ) : null}
            {basketSelected && isGroup && flatQuestionData(choosedquestions).count() > 0 &&
              <Pagination
                onShowSizeChange={this.handleBusketPageChange}
                showQuickJumper
                showSizeChanger
                onChange={this.handleBusketPageChange}
                pageSize={basketPageSize}
                pageSizeOptions={['5', '10', '20', '30']}
                total={flatQuestionData(choosedquestions).count()}
                current={basketPageIndex}
              />
            }
          </ContentRight>
          <Modal
            title="删除题目"
            visible={this.state.showDelteQuestionModal}
            bodyStyle={{ height: 100 }}
            closable={false}
            maskClosable={false}
            okText="取消删除"
            onOk={() => {
              this.setState({ showDelteQuestionModal: false });
            }}
            cancelText="确定删除"
            onCancel={() => {
              this.setState({ showDelteQuestionModal: false });
              dispatch(deleteQuestionAction(this.state.deleteQuestionId));
            }}
          >
            <FlexCenter style={{ width: '100%', height: '100%' }}>
              <h2>确认删除本题？</h2>
            </FlexCenter>
          </Modal>
        </ContentWrapper>
      </RootDiv>
    );
  }
}

QuestionManagement.propTypes = {
  dispatch: PropTypes.func.isRequired,
  phaseSubjectList: PropTypes.instanceOf(Immutable.List).isRequired,
  phaseSubject: PropTypes.instanceOf(Immutable.Map).isRequired,
  selectedType: PropTypes.string,
  selectedtreeitem: PropTypes.instanceOf(Immutable.Map),
  knownLedgeList: PropTypes.instanceOf(Immutable.List),
  filterFields: PropTypes.instanceOf(Immutable.Map).isRequired,
  moreFilterFields: PropTypes.instanceOf(Immutable.Map).isRequired,
  provinceData: PropTypes.instanceOf(Immutable.List).isRequired,
  cityData: PropTypes.instanceOf(Immutable.List).isRequired,
  districtData: PropTypes.instanceOf(Immutable.List).isRequired,
  questionData: PropTypes.instanceOf(Immutable.List).isRequired,
  choosedquestions: PropTypes.instanceOf(Immutable.List).isRequired,
  selectPaperProperty: PropTypes.instanceOf(Immutable.Map).isRequired,
  searchData: PropTypes.instanceOf(Immutable.Map).isRequired,
};

const mapStateToProps = createStructuredSelector({
  phaseSubjectList: makeSelectphaseSubjectList(),
  phaseSubject: makeSelectphaseSubject(),
  selectedType: makeSelectType(),
  selectedtreeitem: makeSelectSelectedTreeitem(),
  knownLedgeList: makeSelectKnownLedgeList(),
  filterFields: makeSelectFilterFields(),
  moreFilterFields: makeSelectMoreFilterFields(),
  provinceData: makeSelectProvinceData(),
  cityData: makeSelectCityData(),
  districtData: makeSelectDistrictData(),
  curFilterFields: makeSelectCurFilterFields(),
  orderParams: makeSelectOrderParams(),
  questionData: makeSelectQuestionData(),
  choosedquestions: makeSelectChooosedQuestions(),
  pageState: makeSelectPageState(),
  totalQuestion: makeSelectTotalQuestion(),
  pageIndex: makeSelectQuestionPageIndex(),
  userMap: makeSelectUserMap(),
  selectPaperProperty: makeSelectPaperProperty(),
  searchData: makeSearchData(),
  questionpagesize: makeSelectQuestionPageSize(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    phaseSubjectChange: (value, props) => {
      const curid = props.phaseSubject.get('id');
      if (Number(curid) === Number(value)) {
        return false;
      }
      dispatch(setPhaseSubjectAction(props.phaseSubject.set('id', value)));
      // 查询该科目目录
    },
    selectTreeTypeChange: (value, props) => {
      const curid = props.selectedType;
      if (Number(curid) === Number(value)) {
        return false;
      }
      dispatch(setSelectedTypeAction(value));
      // 查询该科目目录
    },
    getKnowledgeOrExamPoint: props => {
      switch (props.selectedType) {
        case '0':
          dispatch(getKnownLedgeList());
          break;
        case '1':
          dispatch(getExamPointList());
          break;
        default:
      }
    },
    clearChoosedQuestion: props => {
      // const { choosedquestions } = props;
      dispatch(setHwQuestionAndPaperAction(fromJS([])));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(QuestionManagement);
