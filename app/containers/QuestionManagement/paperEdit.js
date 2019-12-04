/* eslint-disable complexity */
/* eslint-disable no-undefined */
import React from 'react';
import {
  Modal,
  Button,
  Icon,
  Form,
  Input,
  Switch,
  message,
  Select,
  BackTop,
  Affix,
  Popconfirm,
} from 'antd';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { fromJS } from 'immutable';
import { browserHistory } from 'react-router';
import QuestionSearchData from 'components/QuestionSearchData';
import InputNumber from 'components/InputNumber';
import ReplaceQuestionModal from '../StandHomeWork/AIHomework/AIHomeworkEdit/AIQuestionChangeItem';
import { toString, toNumber } from 'lodash';
import {
  makeSelectFilterFields,
  makeSelectChooosedQuestions,
  makeSelectPaperContentList,
  makeSelectPaperProperty,
  makeSelectGrade,
  makeSelectSubject,
  makePaperType,
  makeChooseQuestionRule,
} from './selectors';
import {
  setPaperContentList,
  assembleExamPaper,
  setPaperProperty,
  getGrade,
  getSubject,
  // removeHomeWorkQuestionAction,
  setReducerInital,
  setPaperPropertiesAction,
  getPaperType,
  updateHomeWorkQuestionAction,
  setHwQuestionAndPaperAction,
  getAllChooseQuestionRuleAction,
} from './actions';
import {
  filterHtmlForm,
  timestampToDate,
  renderKatex as renderToKatex,
} from 'components/CommonFn';
import { numberToChinese, numberToLetter } from 'zm-tk-ace/utils';
import {
  QuestionInfoWrapper,
  AnalysisWrapper,
  AnalysisItem,
  AnswerTitle,
  AnswerConten,
} from '../StandHomeWork/createHomeWorkStyle';
import { FlexRow, FlexColumn, FlexRowCenter } from 'components/FlexBox';
import { ListChildQuestion } from './listChildQuestion';
import ErrorCorrect from 'components/ErrorCorrect';
import sourceModule from 'components/ErrorCorrect/sourceModule';
import { purposeList } from 'utils/immutableEnum';
import PaperComponent from 'components/PaperComponent';
import ChooseQuestionInPaper from 'components/PaperComponent/chooseQuestionInPaper';
import { getGradeAndSubjectMapper } from 'utils/helpfunc';
import queryNodesByGroupList from 'api/qb-cloud/sys-dict-end-point/queryNodesByGroupList';
import userApi from 'api/tr-cloud/user-endpoint';

import PaperAnalysis from '../PaperAnalysis';
import EditScoreModal from './EditScoreModal';
import Loading from './Loading';
const shuiyin = [
  `${window._baseUrl.imgCdn}qh4HWXp5hSVMPxUBDzs5so/zmjiaoyu.png`,
  `${window._baseUrl.imgCdn}pzhDKsnYhS1yCaB46VSLca/zmyouke.png`
];
import MentalityEdit from './MentalityEdit';
import {
  isMentality,
  validateMentality,
  isMentalityQuestion,
} from './MentalityEdit/utils';
import { BatchScoreModal } from './MentalityEdit/scoreSetting';
import { getPaperFields, getRequired } from 'utils/paperUtils';
import ParallelMakePaper from '../Common/ParallelMakePaper';
import { getAiReplaceQuestions } from './server';
import { getRecommendQuestionIds } from '../Common/ParallelMakePaper/server';
import { AppLocalStorage } from 'utils/localStorage';
import { ZmExamda } from 'zm-tk-ace';
import {
  getGroupList, verifyGroupScore,
  verifyOverlapping, verifyChooseGroup, isCollegeExamPaper, flatQuestionData, calculateSum, emptyBig, verifyChildQuestionScore
} from './utils';
import BigQuestionEditor from './BigQuestionEditor';
import PrintCheck from './PrintCheck';

const isParttime = process.env.ENV_TARGET === 'parttime';

const emptyMap = fromJS({});

const getPaperFieldsFn = getPaperFields(2);
const getRequiredFn = getRequired();

const FormItem = Form.Item;
const QuestionInfo = styled(FlexRow)`
  flex: 1;
  span {
    margin-right: 20px;
    color: #b34d10;
  }
  flex-wrap: wrap;
`;
const FlexRowHead = styled(FlexRow)`
  button {
    margin: 0 5px;
  }
  margin-bottom: 10px;
`;
const PaperTitle = styled.div`
  border: 1px solid black;
  min-height: 80px;
  padding: 8px;
`;
const FormSelf = styled(Form)`
  .ant-form-item {
    margin-bottom: 12px;
  }
`;
const PrintBG = styled.div`
  ${(props) => (props.showPrint ? `
    background: url(${shuiyin[props.printIndex]}) repeat;
    width: 100%;
    height: 100%;
    position: fixed;
    opacity: 0.8;
    z-index: 100;
  ` : '')}
`;
const ActionButton = styled.div`
  @media print {
    display : none;
  }
`;
const FlexRowHeader = styled(FlexRow)`
  margin: 10px 5px;
  .title {
    font-size: 18px;
    font-weight: 700;
    text-align: center;
  }
  i {
    margin: 8px 0 0 10px;
    flex: 1;
  }
`;
const PaperBigTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  .info {
    display: flex;
    font-size: 14px;
    font-weight: normal;
    span {
      margin: 0 15px;
    }
  }
`;
const BigQuestion = styled.div`
  border: 1px solid black;
  margin-bottom: 10px;
  padding: 5px;
`;
const QuestionTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  i {
    float: right;
    margin: 5px 10px;
    cursor: pointer;
  }
  button {
    float: right;
  }
`;
const OneQuestion = styled.div`
  border: 2px solid black;
  margin: 5px 0;
  padding: 5px;
  &:hover {
    .showHideButton {
      visibility: initial;
    }
  }
`;
const FlexWrapper = styled.div`
  @media print {
    display: none;
  }
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: flex-end;
  i {
    margin: 0 10px;
    cursor: pointer;
  }
`;
const HideButton = styled.div`
  visibility: hidden;
  padding: 8px;
  height: 40px;
  align-items: center;
  justify-content: flex-end;
  i {
    margin: 0 10px;
    cursor: pointer;
  }
`;
const FlexEndRow = styled(FlexRow)`
  justify-content: flex-end;
  .ant-input-number {
    width: 50px;
    margin: 0 10px;
  }
`;
const SelectWrapper = styled(FlexRowCenter)`
  width: 230px;
  height: 35px;
`;
const TextValue = styled.div`
  min-width: 50px;
  text-align: right;
  font-size: 14px;
  color: #333;
  margin-right: 10px;
`;
const BackToTopDiv = styled.div`
  border-radius: 10px;
  background-color: #f1f1f1;
  color: #333;
  text-align: center;
  font-size: 15px;
  padding: 5px;
`;
const ModalBtn = styled(Button)`
margin-right: 10px;
`;
const ModalInfos = styled.div`
width: 100%;
text-align: center;
line-height: 100px;
height: 100px;
font-size: 16px;
`;
const ModalFooter = styled.div`
width: 100%;
text-align: right;
`;
const FILTER_FIELDS = ['epName', 'typeId', 'teachingEditionId', 'editionId']; // 不需要 QuestionSearchData 组件渲染的字段
const REQUIRED_LIST_MAP = {
  subjectId: 'subject',
  gradeId: 'grade',
  termId: 'term',
  provinceId: 'area',
  source: 'examPaperSource',
  businessCardId: 'businessCard',
  examTypeId: 'examType',
}; // QuestionSearchData 与需要渲染的字段的映射关系
export class PaperEditForm extends React.PureComponent {
  constructor(props) {
    super(props);
    const item = fromJS({
      minScore: 0,
      maxScore: 0,
      grade: '',
      comment: '',
    });
    this.user = {};
    this.state = {
      showAnalysisMap: fromJS({}),
      showAllAnalysis: false,
      pageStatus: '',
      showPaperAnalysis: false,
      // 心理测评用start
      showMentality: false,
      totalScore: 0,
      minScore: 0,
      item,
      rateList:
        this.props.paperProperty.get('rateList') || fromJS([item, item]),
      epBu: fromJS([]), // 适用BU
      paperPurpose: fromJS([]), // 用途
      paperTarget: fromJS([]), // 测评对象
      // 心理测评用end
      showReplaceQuestionItem: false,
      isShowParallel: false,
      aiReplaceQuestionParams: fromJS({}),
      showConfirmLeave: false,
      selectedSmallId: null,
      isShowBatchEditChildScore: false,
      loading: false
    };
    this.checkForm = this.checkForm.bind(this);
    this.save = this.save.bind(this);
    this.changePageStatus = this.changePageStatus.bind(this);
    this.sortByType = this.sortByType.bind(this);
    this.changeSelectType = this.changeSelectType.bind(this);
    this.modalConfirm = this.modalConfirm.bind(this);
    this.handleClickPaperAnalysis = this.handleClickPaperAnalysis.bind(this);
    this.printPaper = this.printPaper.bind(this);
    // 平行组卷的权限
    this.parallelPermission = AppLocalStorage.getPermissions().includes('parallel_group_exam_paper');
    this.batchChildScore = {};
    this.scrollTimer = null;
    this.affixScrollTimer = null;
    //  还原试卷 用途和难度非必填
    this.REQUIRED_FILTER_LIST = (props.paperContent && props.paperContent.isRestoredPaper === 1)
                              ? ['purpose', 'difficulty']
                              : [];
  }

  componentDidMount() {
    const { dispatch, editMode } = this.props;
    // 获取试卷类型
    dispatch(getPaperType());
    dispatch(getGrade());
    dispatch(getSubject());
    // this.sortByType();   // 在index中已经设置好了，所以这里注掉，如有需要再放开
    dispatch(getAllChooseQuestionRuleAction());
    if (editMode) {
      this.changePageStatus(editMode);
    }
    // 判断老师角色和学科权限 兼职人员要做特殊处理
    const mapper = getGradeAndSubjectMapper();
    if (mapper) {
      this.setState(mapper);
    }
    if (this.myIsMentality()) {
      queryNodesByGroupList([
        'QB_EXAM_PAPER_PURPOSE',
        'QB_EXAM_PAPER_TARGET',
        'QB_EXAM_PAPER_BU',
        'QB_EXAM_PAPER_TYPE_v1',
      ]).then(res => {
        if (Number(res.code) === 0) {
          this.setState({
            epBu: fromJS(res.data.QB_EXAM_PAPER_BU) || fromJS([]), // 适用BU
            paperPurpose: fromJS(res.data.QB_EXAM_PAPER_PURPOSE) || fromJS([]), // 用途
            paperTarget: fromJS(res.data.QB_EXAM_PAPER_TARGET) || fromJS([]), // 测评对象
          });
        }
      });
    }
    // 增加点击事件监听
    window.addEventListener('click', this.recordClick);
    // 处理affix  backtop不出现的问题
    if (this.props.isParallel) {
      let paperQuestionListWrapper = document.querySelector('.paper-question-list-wrapper');
      let timeout = 1000;
      if (paperQuestionListWrapper && this.backTopNode) {
        this.scrollTimer = setTimeout(() => {
          document.querySelector('.paper-question-list-wrapper').addEventListener('scroll', this.backTopNode.handleScroll);
        }, timeout);
      }
      this.affixScrollTimer = setTimeout(() => { this.forceUpdate() }, timeout);
    }
  }
  componentWillUnmount() {
    localStorage.removeItem('eventRecords');
    window.removeEventListener('click', this.recordClick);
    clearTimeout(this.scrollTimer);
    clearTimeout(this.affixScrollTimer);
  }
  printPaper(withAnswer) {
    this.recordEvents('printPaper', { withAnswer });
    if (withAnswer) {
      const { paperContentList } = this.props;
      const _map = {};
      paperContentList.forEach(item => {
        item.get('entryExamPaperQuesInputDTOList').forEach(it => {
          _map[it.get('id')] = true;
        });
      });
      this.setState({
        showAnalysisMap: fromJS(_map),
        showAllAnalysis: true,
      });
    }
    this.setState(
      {
        showPrint: true,
      },
      () => {
        setTimeout(() => {
    //       const headHtml = "<head><style type='text/css'> @page{ size:  auto;   /* auto is the" +
    // ' initial value */margin: 0mm;  /* this affects the margin in the printer setting' +
    // 's */}html{/*background-color: #FFFFFF; */margin: 0px;  /* this affects the margi' +
    // 'n on the html before sending to printer */}</style></head><body>';
          const paper = document.getElementById('muPaperForm').innerHTML;
          window.document.body.innerHTML = paper;
          window.document.body.style.overflowY = 'auto';
          const refresh = document.getElementById('refresh-button');
          refresh.style.display = 'none';
          const list = document.getElementsByClassName('showHideButton');
          const antSwitch = document.getElementsByClassName('ant-switch');
           // 隐藏预览纠错按钮
          for (let i = 0; i < list.length; i++) {
            list[i].style.display = 'none';
          }
           // 隐藏预览纠错按钮
          for (let i = 0; i < antSwitch.length; i++) {
            antSwitch[i].style.display = 'none';
          }
          setTimeout(() => {
            refresh.style.display = 'block';
            // eslint-disable-next-line max-nested-callbacks
            refresh.addEventListener('click', () => {
              window.location.reload();
            });
          }, 1000);
          window.print();
        }, 600);
      },
    );
  }
  // 是否是高考真题
  isCollegeExamPaper = () => {
    const { paperProperty } = this.props;
    return isCollegeExamPaper(paperProperty.get('typeId'));
  }

  modalConfirm(teachingVersion, courseSystem) {
    // console.log('teachingVersion, courseSystem', teachingVersion.toJS(), courseSystem.toJS())
    this.recordEvents('modalConfirm');
    const { dispatch, paperProperty } = this.props;
    dispatch(
      setPaperPropertiesAction(
        paperProperty
          .set('editionId', courseSystem.get('selectedId'))
          .set('editionName', courseSystem.get('editionName'))
          .set('teachingEditionId', teachingVersion.get('selectedId'))
          .set(
            'teachingEditionName',
            teachingVersion.get('teachingEditionName'),
          )
          .set('versionValue', teachingVersion.get('versionValue'))
          .set('systemValue', courseSystem.get('systemValue'))
          .set('showSystemList', courseSystem.get('showSystemList')),
      ),
    );
  }
  /**
  * @description 保存试卷
  * @example save(true)
  * @param {Bool} submitFlag 是否存草稿箱，是则为true
  * @return {void}
  */
  save(submitFlag) {
    this.recordEvents('save');
    const {
      paperProperty,
      paperContentList,
      paperType = fromJS([]),
      isParallel, choosedquestions, ruleList
    } = this.props;
    if (paperContentList.count() === 0) {
      message.info('请选择题目');
      return;
    }
    if (!paperProperty.get('epName').trim()) {
      message.info('请填写试卷名称');
      return;
    }
    if (emptyBig(paperContentList.toJS())) {
      message.info('大题下必须至少有一条小题');
      return;
    }
    // 校验是否有子题分数没设置
    let verifyChildScores = verifyChildQuestionScore(choosedquestions);
    if (verifyChildScores.length > 0) {
      message.warning(`第${verifyChildScores.join('、')}题的子题分数未设置`);
      return;
    }
    // 校验同组选做题分数是否相同
    let groupList = getGroupList(choosedquestions, ruleList);
    console.log(groupList.toJS(), 'error');
    let verifyGroupScores = verifyGroupScore(groupList);
    if (verifyGroupScores.length > 0) {
      message.warning(`第${verifyGroupScores.join('、')}组选做题分数不相等，请重新设置`);
      return;
    }
    // 需要的字段
    let needFields = [];
    let requiredRules = {};
    if (paperProperty.get('typeId') && paperProperty.get('typeId') > 0) {
      needFields = getPaperFieldsFn(paperProperty.get('typeId'), (paperType || fromJS([])).toJS());
      requiredRules = getRequiredFn(paperProperty.get('typeId'), (paperType || fromJS([])).toJS());
    }
    // 还原试卷过滤 用途和难度
    const requiredList = needFields.filter(el => requiredRules[el])
      .filter(el => !this.REQUIRED_FILTER_LIST.includes(el));
    let passVerify = true;
    passVerify = needFields.every(it => {
      const value = paperProperty.get(it);
      if (requiredList.includes(it)) {
        if (it === 'epName') return !!value;
        return (value != null && value >= 0) ? true : false;
      } else {
        return true;
      }
    });

    let MentalityData = {};
    if (this.myIsMentality()) {
      const { rateList, totalScore, minScore } = this.state;
      const errorMsg = validateMentality(rateList, totalScore, minScore);
      if (errorMsg) {
        message.error(errorMsg);
        return;
      }
      MentalityData.rateList = rateList;
      MentalityData.totalScore = totalScore;
      MentalityData.minScore = minScore;
    }
    if (passVerify) {
      if (isParallel) {
        MentalityData.isParallel = true;
      }
      this.props.dispatch(assembleExamPaper(submitFlag, MentalityData, this.props.paperType, this.props.back));
    } else {
      message.info('请将试卷带星号信息填写完整');
    }
  }

  checkForm() {
    this.recordEvents('checkForm');
    let success = false;
    this.props.form.validateFields(err => {
      if (!err) {
        success = true;
      }
    });
    return success;
  }

  changePageStatus(status) {
    this.recordEvents('changePageStatus');
    this.setState({
      pageStatus: status,
    });
  }

  myIsMentality() {
    const { paperProperty } = this.props;
    return isMentality(paperProperty.get('typeId'));
  }

  // 初始化试卷
  sortByType() {
    this.recordEvents('sortByType');
    const { dispatch, choosedquestions = fromJS([]) } = this.props;
    dispatch(setHwQuestionAndPaperAction(choosedquestions, true));
  }

  handleClickPaperAnalysis() {
    this.setState({ showPaperAnalysis: true });
    this.recordEvents('handleClickPaperAnalysis');
  }
  // 检测是否有其他题型
  checkIsAllObjective() {
    this.recordEvents('checkIsAllObjective');
    const { paperContentList } = this.props;
    return paperContentList
      .toJS()
      .some(
        item =>
          item.entryExamPaperQuesInputDTOList &&
          item.entryExamPaperQuesInputDTOList.some(
            e => Number(e.templateType) !== 2,
          ),
      );
  }
  changeSelectType(value, type) {
    this.recordEvents('changeSelectType');
    const { dispatch, oldPaperType, paperProperty, isPublish, paperContent } = this.props;
    const { pageStatus } = this.state;
    // console.log(value, type, 'changeSelect');
    if (type === 'paperType' && oldPaperType === 11) {
      message.info('高考真题暂不支持修改为其它试卷类型');
      return;
    }
    // 试卷类型一旦选成高考真题不允许改变
    if (
      type === 'paperType' &&
      Number(paperProperty.get('typeId')) === 11 &&
      Number(value.id) !== 11
    ) {
      message.info('高考真题暂不支持修改为其它试卷类型');
      return;
    }
    // 用途为测评的一旦选成高考真题要重置用途
    if (
      type === 'paperType' &&
      Number(value.id) === 11 &&
      Number(paperProperty.get('purpose')) === 1
    ) {
      dispatch(setPaperProperty('purpose', toString(-1)));
    }
    // 高考真题不允许用途改成线上测评
    if (
      type === 'purpose' &&
      Number(paperProperty.get('typeId')) === 11 &&
      Number(value.id) === 1
    ) {
      message.info('高考真题不允许用于线上测评');
      return;
    }
    // 还原试卷
    const isRestoredPaper = paperContent && paperContent.isRestoredPaper === 1;
    // 用途必选
    if (type === 'purpose' && Number(value.id) === -1 && !isRestoredPaper) {
      message.info('用途必选');
      return;
    }
    // 不允许其他用途改成线上测评
    if (
      type === 'purpose' &&
      Number(paperProperty.get('purpose')) !== -1 &&
      Number(value.id) === 1 &&
      this.checkIsAllObjective()
    ) {
      message.info('当前试卷有非客观题，不允许改变成在线测评');
      return;
    }
    let iType = type;
    // console.log(type, value, 'type, value');
    if (type === 'examPaperSource') {
      iType = 'source';
      // console.log(pageStatus, isPublish, 'pageStatus, isPublish');
      if (pageStatus === 'edit' && !isPublish) {
        message.warning('试卷类型不可以在组卷时修改.');
        return;
      }
    } else if (type === 'paperType') {
      iType = 'typeId';
    } else if (['grade', 'subject', 'term', 'examType', 'province', 'city', 'county', 'businessCard'].includes(type)) {
      iType = `${type}Id`;
    }
    if (type === 'province') {
      // dispatch(setPaperProperty('cityId', -1));
      // dispatch(setPaperProperty('countyId', -1));
      dispatch(setPaperPropertiesAction(paperProperty.set(iType, toString(value.id)).set('cityId', -1).set('countyId', -1)));
    } else if (type === 'city') {
      // dispatch(setPaperProperty('countyId', '-1'));
      dispatch(setPaperPropertiesAction(paperProperty.set(iType, toString(value.id)).set('countyId', -1)));
    } else if (['subject', 'grade', 'paperType'].includes(type)) {
      let params = paperProperty
        .set(iType, toString(value.id))
        .set('editionId', '')
        .set('editionName', '')
        .set('teachingEditionId', '')
        .set('teachingEditionName', '')
        .set('versionValue', null)
        .set('systemValue', null)
        .set('showSystemList', fromJS([]));
      if (type === 'grade') {
        params = params.set('subjectId', -1);
      }
      dispatch(setPaperPropertiesAction(params));
    } else {
      dispatch(setPaperProperty(iType, toString(value.id)));
    }
  }

  showMentality(bool) {
    this.recordEvents('showMentality');
    if (bool) {
      const { paperContentList } = this.props;
      let rateList = this.state.rateList;
      // 计算最高分最低分
      let totalScore = 0;
      let minScore = 0;
      paperContentList.forEach(e => {
        e.get('entryExamPaperQuesInputDTOList').forEach(q => {
          if (isMentalityQuestion(q.get('typeId'))) {
            totalScore += Math.max(...q.get('scoreList').toJS());
            minScore += Math.min(...q.get('scoreList').toJS());
          } else {
            totalScore += q.get('score');
          }
        });
      });
      rateList = rateList.setIn([0, 'minScore'], minScore);
      const changeState = {
        showMentality: true,
        totalScore,
        minScore,
        rateList,
      };
      this.setState(changeState);
    } else {
      this.setState({
        showMentality: false,
      });
    }
    // 判断老师角色和学科权限 兼职人员要做特殊处理
    const mapper = getGradeAndSubjectMapper();
    if (mapper) {
      this.setState(mapper);
    }
  }

  backToList = () => {
    this.recordEvents('backToList');
    const { dispatch, isParallel, backPath } = this.props;
    dispatch(setReducerInital());
    let route = { pathname: '/tr/papermanagement' };
    if (isParttime) {
      route.pathname = '/parttime/papermanagement';
    } else if (isParallel && backPath && !/^\/tr\/questionfor1v1/.test(backPath)) {
      route = {
        pathname: backPath,
      };
    }
    browserHistory.push(route);
  };

  changeRateList = list => {
    this.recordEvents('changeRateList');
    this.setState({
      rateList: list,
    });
  };

  showMentalityBatchFunc = (bool, e) => {
    this.recordEvents('showMentalityBatchFunc');
    if (bool) {
      this.setState({
        showMentalityScoreBatch: true,
        curBatchData: e,
      });
    } else {
      setTimeout(() => {
        this.setState({
          showMentalityScoreBatch: false,
          curBatchData: null,
        });
      }, 100);
    }
    // 判断老师角色和学科权限 兼职人员要做特殊处理
    const mapper = getGradeAndSubjectMapper();
    if (mapper) {
      this.setState(mapper);
    }
  };

  mentalityBatchOk = scoreList => {
    this.recordEvents('mentalityBatchOk');
    const { curBatchData } = this.state;
    const { dispatch, paperContentList } = this.props;
    const inputDTOList = curBatchData.get('entryExamPaperQuesInputDTOList');
    let changeList = paperContentList;
    inputDTOList.forEach(e => {
      const len = e.get('optionList').count();
      const list = scoreList.take(len);
      const maxScore = Math.max(...list.toJS());
      // 更新chooseQuestion
      this.changePaperContentList(
        e.set('scoreList', list).set('score', maxScore),
      );
      // 更新PaperContentList
      changeList = this.setChangePaperContentList(
        changeList,
        e.set('scoreList', list).set('score', maxScore),
      );
    });
    dispatch(setPaperContentList(changeList));
    this.showMentalityBatchFunc(false);
  };

  // 如果type是batch 就是批量修改 因为action是异步，所以需要批量修改paperContentList
  // 需要同步改变试题篮中的choosedquestions
  changePaperContentList = item => {
    this.recordEvents('changePaperContentList');
    const { dispatch } = this.props;
    dispatch(updateHomeWorkQuestionAction(item));
  };

  setChangePaperContentList = (paperContentList, item, currentQuestionId) => {
    this.recordEvents('setChangePaperContentList');
    return paperContentList.map(it => {
      if (it.get('name') === item.get('questionType')) {
        return it.set(
          'entryExamPaperQuesInputDTOList',
          it.get('entryExamPaperQuesInputDTOList').map(ix => {
            if (currentQuestionId) {
              if (Number(ix.get('id')) === currentQuestionId) {
                return item;
              }
            } else {
              if (Number(ix.get('id')) === Number(item.get('id'))) {
                return item;
              }
            }
            return ix;
          }),
        );
      }
      return it;
    });
  }
  // 智能换题
  aiReplaceQuestion = (item, replaceTargetId) => {
    this.recordEvents('aiReplaceQuestion');
    this.setState(
      {
        showReplaceQuestionItem: true,
        aiReplaceQuestionParams: fromJS({
          AIChangeQuestionTarget: item,
          AIChangeQuestionList: [],
          isLoadingChangeItem: true,
          replaceTargetId
        })
      }
    );
  };
  // 智能换题之换一批
  batchSwitch = async () => {
    this.recordEvents('batchSwitch');
    let { paperContentList } = this.props;
    let exceptIdList = [];
    paperContentList.toJS().forEach(item1 => {
      item1.entryExamPaperQuesInputDTOList.forEach(item2 => {
        exceptIdList.push(item2.id);
      });
    });
    let initParams = this.state.aiReplaceQuestionParams;
    initParams = initParams.set('isLoadingChangeItem', true);
    this.setState({ aiReplaceQuestionParams: initParams });
    let item = this.state.aiReplaceQuestionParams.get('AIChangeQuestionTarget');
    let obj = item.toJS();
    let params = {
      questionId: obj.id,
      num: 6,
      exceptIdList
    };
    let data = await getAiReplaceQuestions(params);
    let aiReplaceQuestionParams = this.state.aiReplaceQuestionParams.set('AIChangeQuestionTarget', item).set('AIChangeQuestionList', fromJS(data)).set('isLoadingChangeItem', false);
    this.setState({ aiReplaceQuestionParams });
  };
  // 显示平行组卷弹框
  showParallelModal = () => {
    this.recordEvents('showParallelModal');
    const paperData = this.props.paperContent;
    if (!paperData['typeId']) {
      return message.warning('试卷类型缺失，请补充完后再进行组卷');
    }
    this.setState({ isShowParallel: true });
  };
  handleClose = () => {
    this.recordEvents('handleClose');
    this.setState({ isShowParallel: false });
  };
  handleNext = data => {
    console.log(data);
  };
  // 替换当前题目
  replaceCurrentQuestion = (newQuestion) => {
    this.recordEvents('replaceCurrentQuestion');
    const { aiReplaceQuestionParams } = this.state;
    const { isParallel } = this.props;
    let currentQuestionId = aiReplaceQuestionParams.get('replaceTargetId');
    let isRepeat = this.isRepeatQuestion(newQuestion.get('id'));
    if (isRepeat) {
      message.warning('该题目已存在,换一道吧');
      return;
    }
    let newQuestionData = newQuestion;
    if (isParallel) {
      // 平行组卷的情况下换题时，需设置原始题目数据
      newQuestionData = newQuestion.set('originQuestionData', aiReplaceQuestionParams.get('AIChangeQuestionTarget'));
    }
    this.editHwQuestionData({ actionType: 'replaceQuestion', data: { newQuestion: newQuestionData, currentQuestionId }});
    this.setState({ showReplaceQuestionItem: false });
  }
  // 重新选题
  resetAllQuestion = async () => {
    this.recordEvents('resetAllQuestion');
    let { dispatch } = this.props;
    let selectPaperId = AppLocalStorage.getPaperData().selectPaperId;
    this.setState({ loading: true });
    let res = await getRecommendQuestionIds({ examPaperId: selectPaperId });
    this.setState({ loading: false });
    let list = res.examPaperContentOutputDTOList;
    if (list) {
      list.forEach(item => {
        let arr = [];
        item.examPaperContentQuestionOutputDTOList.forEach(item1 => {
          if (item1.recommendNewQuestionOutputDTO && !arr.some(it => it.id === item1.recommendNewQuestionOutputDTO.id)) {
            let target = item1.recommendNewQuestionOutputDTO;
            target.originQuestionData = item1.questionOutputDTO; // 加入原始题目
            arr.push(target);
          }
        });
        item.examPaperContentQuestionOutputDTOList = arr;
      });
      dispatch(setHwQuestionAndPaperAction(fromJS(list)));
    }
  }
  // 判断智能换题是否已经存在
  isRepeatQuestion = (newId) => {
    const { choosedquestions } = this.props;
    return flatQuestionData(choosedquestions).some((quesiton) => quesiton.get('id') === newId);
  }
  deleteRuleGroup = (data) => {
    const { choosedquestions, dispatch } = this.props;
    const { groupIndex } = data;
    console.log(groupIndex, 'groupIndex -- groupIndex');
    const smallKey = 'examPaperContentQuestionOutputDTOList';
    const newChoosedquestions = choosedquestions.map((big) => {
      // console.log(question.get('chooseGroup'), groupIndex, 'groupIndex - groupIndex');
      let smallList = big.get(smallKey).map(small => {
        const chooseGroup = small.get('chooseGroup');
        if (chooseGroup === groupIndex) {
          return small.set('answerRule', 1).set('chooseGroup', null);
        } else if (chooseGroup > groupIndex) {
          return small.set('chooseGroup', chooseGroup - 1);
        }
        return small;
      });
      return big.set(smallKey, smallList);
    });
    dispatch(setHwQuestionAndPaperAction(newChoosedquestions));
  }
  editRuleGroup = () => {

  }
  // 添加选作题的校验与设置
  changeRuleGroup = (data, closeCallback) => {
    const { choosedquestions, dispatch, ruleList } = this.props;
    const { questionIndexList, selectedType, groupIndex, type } = data;
    let flatChoosedquestions = flatQuestionData(choosedquestions);
    console.log(data, 'edit chooseQuestionGroup data.');
    if (type === 'delete') {
      // 如果是要删除的话，直接调用删除方法，这里不需要继续做啥操作了
      this.deleteRuleGroup(data);
      return;
    }
    console.log(flatChoosedquestions.count(), questionIndexList);
    const QIndexNotBigThenQuestionsCount = questionIndexList.every((QIndex) => QIndex <= flatChoosedquestions.count());
    if (!QIndexNotBigThenQuestionsCount) {
      message.warn('题号不可以大于题目数量');
      return;
    }
    let newChoosedquestions = choosedquestions;

    // 校验是否有重复分组
    const overlapping = verifyOverlapping(flatChoosedquestions, data);
    if (!overlapping.pass) {
      message.warn(overlapping.errorMsg || '请检查您的选做题设置');
      return;
    }
    const smallKey = 'examPaperContentQuestionOutputDTOList';
    // 如果是修改的话则先清掉原先该分组的设置再去重新设置一遍
    if (type === 'edit') {
      newChoosedquestions = choosedquestions.map((big) => {
        // console.log(question.get('chooseGroup'), groupIndex, 'editGroupIndex - editGroupIndex');
        let smallList = big.get(smallKey).map(small => {
          if (small.get('chooseGroup') === groupIndex) {
            return small.set('answerRule', 1).set('chooseGroup', null);
          }
          return small;
        });
        return big.set(smallKey, smallList);
      });
    }
    // 设置选做题分组信息
    newChoosedquestions = newChoosedquestions.map((big, index) => {
      let smallList = big.get(smallKey).map(small => {
        let res = small;
        if (questionIndexList.includes(small.get('questionIndex'))) {
          res = small.set('answerRule', selectedType).set('chooseGroup', groupIndex);
        }
        return res;
      });
      return big.set(smallKey, smallList);
    });
    // console.log(newChoosedquestions.map((question) => question.get('chooseGroup')).toJS(), 'chooseGroup - list');
    const verify = verifyChooseGroup(flatQuestionData(newChoosedquestions), ruleList);
    if (verify.pass) {
      console.log(newChoosedquestions.toJS(), '--000--');
      dispatch(setHwQuestionAndPaperAction(newChoosedquestions));
      if (closeCallback) closeCallback();
    } else {
      message.warn(verify.errorMsg || '请检查您的选做题设置');
    }
  }
  // 编辑试卷题目数据（包含删除、排序、换题、设置分数）
  editHwQuestionData = ({ actionType, data }) => {
    // 高考真题的校验（高考估分），2019-06-06
    // const isCollegeExamPaper = this.isCollegeExamPaper();
    this.recordEvents('editHwQuestionData');
    const { choosedquestions, dispatch } = this.props;
    const smallKey = 'examPaperContentQuestionOutputDTOList';
    let newChoosedquestions = choosedquestions;
    if (actionType === 'score') {
      // 分数设置，使用数组 idList 兼容与批量和单个
      const { questionIdList, score } = data;
      newChoosedquestions = choosedquestions.map((question) => {
        let smallList = question.get(smallKey).map(small => {
          if (questionIdList.includes(small.get('id'))) {
            return small.set('score', score);
          }
          return small;
        });
        return question.set(smallKey, smallList);
      });
    } else if (actionType === 'childScore') {
      // 设置子题分数
      let { epScore, bigIndex, smallIndex, childIndex } = data;
      let big = choosedquestions.get(bigIndex);
      let small = big.get(smallKey).get(smallIndex);
      let child = small.get('children').get(childIndex);
      child = child.set('epScore', epScore);// 设置子题分数
      small = small.set('children', small.get('children').set(childIndex, child));
      let smallScore = 0;
      small.get('children').forEach(it => {
        let score = it.get('epScore');
        smallScore += score;
      });
      small = small.set('score', Number(smallScore.toFixed(1))); // 设置小题分数
      big = big.set(smallKey, big.get(smallKey).set(smallIndex, small));
      newChoosedquestions = choosedquestions.set(bigIndex, big);
    } else if (actionType === 'batchSmallScore') {
      // 批量设置子题分数
      let { epScore, bigIndex, smallIndex } = data;
      let big = choosedquestions.get(bigIndex);
      let small = big.get(smallKey).get(smallIndex);
      let children = small.get('children');
      let smallScore = 0;
      children = children.map(it => {
        smallScore += epScore;
        return it.set('epScore', epScore);
      });
      small = small.set('score', Number(smallScore.toFixed(1))).set('children', children);
      big = big.set(smallKey, big.get(smallKey).set(smallIndex, small));
      newChoosedquestions = choosedquestions.set(bigIndex, big);
    } else if (actionType === 'replaceQuestion') {
      const { newQuestion, currentQuestionId } = data;
      newChoosedquestions = choosedquestions.map((question) => {
        let smallList = question.get(smallKey).map(small => {
          if (small.get('id') === currentQuestionId) {
            return newQuestion.merge(fromJS({
              chooseGroup: small.get('chooseGroup'),
              answerRule: small.get('answerRule')
            }));
          }
          return small;
        });
        return question.set(smallKey, smallList);
      });
    } else if (actionType === 'deleteQuestion') {
      const { questionIdList } = data;
      // newChoosedquestions = choosedquestions.filter((question) => !questionIdList.includes(question.get('id')));
      newChoosedquestions = choosedquestions.map(big => {
        let smallList = big.get(smallKey).filter(small => !questionIdList.includes(small.get('id')));
        return big.set(smallKey, smallList);
      });
    } else if (actionType === 'deleteBigQuestion') {
      const { index } = data;
      newChoosedquestions = choosedquestions.filter((big, i) => i !== index);
    } else if (actionType === 'arrowUp') {
      const { index, bigIndex } = data;
      let list = choosedquestions.toJS();
      let big = list[bigIndex];
      if (index === 0) {
        message.warning('已经是第一个了');
        return;
      }
      let temp = big[smallKey][index];
      big[smallKey][index] =  big[smallKey][index - 1];
      big[smallKey][index - 1] = temp;
      list[bigIndex] = big;
      newChoosedquestions = fromJS(list);
    } else if (actionType === 'arrowUpGroup') {
      const { bigIndex } = data;
      let list = choosedquestions.toJS();
      if (bigIndex === 0) {
        message.warning('已经是第一个了');
        return;
      }
      let temp = list[bigIndex];
      list[bigIndex] = list[bigIndex - 1];
      list[bigIndex - 1] = temp;
      newChoosedquestions = fromJS(list);
    } else if (actionType === 'arrowDown') {
      const { index, bigIndex } = data;
      let list = choosedquestions.toJS();
      let big = list[bigIndex];
      console.log(index, bigIndex, list, 'what');
      if (index === big[smallKey].length - 1) {
        message.warning('已经是最后一个了');
        return;
      }
      let temp = big[smallKey][index];
      big[smallKey][index] =  big[smallKey][index + 1];
      big[smallKey][index + 1] = temp;
      list[bigIndex] = big;
      newChoosedquestions = fromJS(list);
    } else if (actionType === 'arrowDownGroup') {
      const { bigIndex } = data;
      let list = choosedquestions.toJS();
      if (bigIndex === list.length - 1) {
        message.warning('已经是最后一个了');
        return;
      }
      let temp = list[bigIndex];
      list[bigIndex] = list[bigIndex + 1];
      list[bigIndex + 1] = temp;
      newChoosedquestions = fromJS(list);
    }
    // console.log(choosedquestions.toJS(), newChoosedquestions.toJS(), 'newChoosedquestions');
    dispatch(setHwQuestionAndPaperAction(newChoosedquestions));
  }
  // 记录触发过的函数名
  recordEvents = (funcName) => {
    try {
      if (this.isToRecord()) {
        this.setRecord('func', funcName);
      }
    } catch (e) {
      console.log(e);
    }
  }
  // 记录点击事件
  recordClick = (e) => {
    if (e && this.isToRecord()) {
      try {
        if (e.target.children.length === 0 || /ant-btn/.test(e.target.className)) {
          this.setRecord('clicks', e.target.innerText || e.target.className);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
  // 是否记录
  isToRecord = () => {
    let idList = [1003690377];// 需要排查的用户id
    let id = JSON.parse(localStorage['zm-teaching-research-userInfo']).id;
    return idList.includes(id);
  }
  // 设置记录
  setRecord = (key, params) => {
    let records = { func: [], clicks: [] };
    if (localStorage.eventRecords) {
      records = JSON.parse(localStorage.eventRecords);
    }
    let now = new Date();
    if (records[key] && records[key] instanceof Array) {
      if (records[key].length > 30) {
        records[key].splice(0, 1);
      }
      records[key].push({ name: params, time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}` });
    }
    localStorage.eventRecords = JSON.stringify(records);
  }
  getUser = async (question, cb) => {
    if (!question) return;
    const userId = question.get('updatedUser');
    console.log('getUser1', userId);
    if (!userId) return;
    const repos = await userApi.getOne(userId);
    console.log('getUser2', userId, repos.data && repos.data.name);
    this.user[String(userId)] = repos.data && repos.data.name || '';
  }
  // 处理拖拽题目
  handleEditBig = (data) => {
    console.log(data, '拖了拖了');
    this.props.dispatch(setHwQuestionAndPaperAction(fromJS(data)));
  }
  handleAddOrEditBig = (values, mode, index) => {
    const { choosedquestions, dispatch } = this.props;
    let newQ = null;
    if (mode === 'add') {
      newQ = choosedquestions.push(fromJS({
        name: values.name,
        examPaperContentQuestionOutputDTOList: []
      }));
    } else {
      let newBig = choosedquestions.get(index).set('name', values.name);
      newQ = choosedquestions.set(index, newBig);
    }
    dispatch(setHwQuestionAndPaperAction(newQ));
  }
  handleChosePrint = (value) => {
    this.setState({
      printIndex: value,
      showPrintCheck: false,
    }, () => {
      setTimeout(() => {
        this.printPaper(this.state.withAnswer || false);
      }, 1000);
    });
  }
  handleCancelChosePrint=() => {
    this.setState({ showPrintCheck: false });
  }
  // eslint-disable-next-line complexity
  render() {
    const {
      dispatch,
      visible,
      back,
      filterFields,
      paperContentList,
      choosedquestions,
      paperProperty,
      grade,
      subject,
      isDataExternal,
      editMode,
      isPublish,
      paperContent,
      paperType,
      isParallel,
      ruleList,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
      pageStatus,
      showScoreBatch,
      curBatchData,
      batchScore,
      showPaperAnalysis,
      showPrint,
      phaseSet = new Set(),
      allowSubjectMap = {},
      isPartTimePersion,
      showMentality,
      showAnalysisMap,
      showReplaceQuestionItem,
      isShowParallel,
      aiReplaceQuestionParams,
      showConfirmLeave,
      isShowBatchEditChildScore
    } = this.state;
    const {
      item,
      minScore,
      totalScore,
      rateList,
      showMentalityScore,
      curEditQuestion,
      epBu,
      paperPurpose,
      paperTarget,
      showMentalityScoreBatch,
    } = this.state; // 心理测评用
    const formItemMiddle = {
      labelCol: { span: 9 },
      wrapperCol: { span: 8 },
    };
    let needFields = [];
    let requiredRules = {};
    if (paperProperty.get('typeId') && paperType.count() > 0) {
      needFields = getPaperFieldsFn(
        paperProperty.get('typeId'),
        (paperType || fromJS([])).toJS(),
      );
      requiredRules = getRequiredFn(
        paperProperty.get('typeId'),
        (paperType || fromJS([])).toJS(),
      );
    }
    /* 课程内容和教材 */
    const hasTeachingVersion = needFields.includes('teachingEditionId');
    const hasCourseSystem = needFields.includes('editionId');
    const editionName = paperProperty.get('editionName');
    const teachingEditionName = paperProperty.get('teachingEditionName');
    const showSystemList = paperProperty.get('showSystemList');
    // console.log('paperProperty', paperProperty.toJS());
    /* 课程内容和教材 */
    const dataList = {
      questionType: (toNumber(paperProperty.get('typeId')) !== 11
        ? filterFields
          .getIn(['typeId', 'values'])
          .filter(item => [1, 2, 6].includes(toNumber(item.get('id'))))
        : filterFields.getIn(['typeId', 'values'])
      ).toJS(),
      purpose: (purposeList || fromJS([])).toJS(),
    };
    if (isPartTimePersion) {
      const gradeId = paperProperty.get('gradeId');
      dataList.grade = grade.toJS().filter(e => phaseSet.has(e.phaseId));
      const selectGrade =
        grade.toJS().find(item => Number(item.id) === Number(gradeId)) || {};
      dataList.subject = subject
        .toJS()
        .filter(
          e => (allowSubjectMap[selectGrade.phaseId] || []).indexOf(e.id) > -1,
        );
    } else {
      dataList.grade = (grade || fromJS([])).toJS();
      dataList.subject = (subject || fromJS([])).toJS();
    }
    // console.log('paperContentList', paperContentList.toJS());
    const isMentalityPaper = this.myIsMentality(); // 是否为心理测评
    // 保存按钮
    // eslint-disable-next-line no-confusing-arrow
    const renderSaveBtn = () =>
      isMentalityPaper && !showMentality ? ( // 心理测评还要下一步设置
        <Button onClick={() => this.showMentality(true)}>下一步</Button>
      ) : editMode === 'preview' ? (
        ''
      ) : (
        <Button onClick={() => this.save(true)}>保存</Button>
          );
    const whoseShow = needFields
      .map(el => REQUIRED_LIST_MAP[el] || el)
      .filter(el => !FILTER_FIELDS.includes(el));

    const requiredList = needFields
      .filter(el => requiredRules[el])
      .map(el => REQUIRED_LIST_MAP[el] || el)
      .filter(el => !FILTER_FIELDS.includes(el))
      .filter(el => !this.REQUIRED_FILTER_LIST.includes(el));

    // 获取选做题分组数据

    const groupList = getGroupList(choosedquestions, ruleList);
    // 头部编辑区域
    const renderEditHeader = () => (
      <PaperTitle>
        <FormItem label="试卷名称" {...formItemMiddle}>
          {getFieldDecorator('epName', {
            rules: [{ required: true, message: '请输入试卷名称!', whitespace: true }],
            initialValue: paperProperty.get('epName'),
          })(
            <Input
              onChange={val =>
                dispatch(setPaperProperty('epName', val.target.value))
              }
              // prefix={<Icon type="user" style={{ fontSize: 13 }} />}
              placeholder="请输入试卷名称"
            />,
          )}
        </FormItem>
        <SelectWrapper>
          <TextValue>
            <span style={{ color: 'red' }}>*</span>试卷类型
          </TextValue>
          <Select
            disabled={this.myIsMentality()}
            style={{ width: 120 }}
            value={String(paperProperty.get('typeId'))}
            onChange={e => {
              if (isMentality(e)) {
                message.info('其他类型试卷不允许改变成心理测评');
                return;
              }
              dispatch(setPaperProperty('typeId', e));
            }}
          >
            {paperType.map(e => (
              <Select.Option key={e.get('id')} value={String(e.get('id'))}>
                {e.get('name')}
              </Select.Option>
            ))}
          </Select>
        </SelectWrapper>
        <QuestionSearchData
          searchStyle={{ wrapper: { width: '100%' }, item: { height: 35 }}}
          // 题型，难度，年级，学期，年份，题目来源，如果来源中选中了高考真题则加上 卷型
          // whoseShow={['questionType', 'difficulty', 'grade', 'term', 'year', 'questionSource', 'examType']}
          whoseShow={whoseShow}
          dataList={dataList}
          searchDate={{
            // edition: { gradeId: toNumber(paperProperty.get('gradeId')), subjectId: toNumber(paperProperty.get('subjectId')) },
            city: { provinceId: toNumber(paperProperty.get('provinceId')) },
            county: { cityId: toNumber(paperProperty.get('cityId')) },
          }}
          deviSelect={requiredList}
          selectType={{
            subject: { id: toNumber(paperProperty.get('subjectId')) || -1 },
            year: { id: toNumber(paperProperty.get('year')) || -1 },
            difficulty: {
              id: toNumber(paperProperty.get('difficulty')) || -1,
            },
            paperType: {
              id: toNumber(paperProperty.get('typeId')) || -1,
              withoutAll: true,
            },
            grade: { id: toNumber(paperProperty.get('gradeId')) || -1 },
            term: { id: toNumber(paperProperty.get('termId')) || -1 },
            // edition: { id: toNumber(paperProperty.get('editionId')) || -1 },
            examType: { id: toNumber(paperProperty.get('examTypeId')) || -1 },
            province: { id: paperProperty.get('provinceId') == null ? -1 : toNumber(paperProperty.get('provinceId')) },
            city: { id: toNumber(paperProperty.get('cityId')) || -1 },
            county: { id: toNumber(paperProperty.get('countyId')) || -1 },
            businessCard: {
              id: toNumber(paperProperty.get('businessCardId')) || -1,
            },
            purpose: { id: toNumber(paperProperty.get('purpose')) || -1 },
            examPaperSource: {
              id: toNumber(paperProperty.get('source')) || -1,
              withoutAll: true,
              disabled: (pageStatus === 'edit' && !isPublish) || paperContent.isRestoredPaper === 1,
              disabledOptions: paperContent.isRestoredPaper !== 1 ? ['2'] : null
            },
            onlineFlag: {
              id: toNumber(paperProperty.get('onlineFlag')) || -1,
              // withoutAll: true,
              placeholder: '选择上架状态'
            },
            evaluationTarget: {
              id: toNumber(paperProperty.get('evaluationTarget')) || -1,
            },
            evaluationPurpose: {
              id: toNumber(paperProperty.get('evaluationPurpose')) || -1,
            },
            epBu: { id: toNumber(paperProperty.get('epBu')) || -1 },
          }}
          noFetch={{
            questionType: true,
            // purpose: true,
            paperType: true,
            grade: true,
            subject: true,
          }}
          changeSelect={this.changeSelectType}
        />
        {isMentalityPaper ? (
          <FlexRow>
            <SelectWrapper>
              <TextValue>
                <span style={{ color: 'red' }}>*</span>测评对象
              </TextValue>
              <Select
                style={{ width: 120 }}
                placeholder="请选择测评对象"
                value={
                  paperProperty.get('evaluationTarget')
                    ? String(paperProperty.get('evaluationTarget'))
                    : undefined
                }
                onChange={e =>
                  dispatch(setPaperProperty('evaluationTarget', e))
                }
              >
                {paperTarget.map(e => (
                  <Select.Option key={e.get('id')} value={String(e.get('id'))}>
                    {e.get('name')}
                  </Select.Option>
                ))}
              </Select>
            </SelectWrapper>
            <SelectWrapper>
              <TextValue>
                <span style={{ color: 'red' }}>*</span>测评用途
              </TextValue>
              <Select
                style={{ width: 120 }}
                placeholder="请选择测评用途"
                value={
                  paperProperty.get('evaluationPurpose')
                    ? String(paperProperty.get('evaluationPurpose'))
                    : undefined
                }
                onChange={e =>
                  dispatch(setPaperProperty('evaluationPurpose', e))
                }
              >
                {paperPurpose.map(e => (
                  <Select.Option key={e.get('id')} value={String(e.get('id'))}>
                    {e.get('name')}
                  </Select.Option>
                ))}
              </Select>
            </SelectWrapper>
            <SelectWrapper>
              <TextValue>
                <span style={{ color: 'red' }}>*</span>适用BU
              </TextValue>
              <Select
                style={{ width: 120 }}
                placeholder="请选择适用BU"
                value={
                  paperProperty.get('epBu')
                    ? String(paperProperty.get('epBu'))
                    : undefined
                }
                onChange={e => dispatch(setPaperProperty('epBu', e))}
              >
                {epBu.map(e => (
                  <Select.Option key={e.get('id')} value={String(e.get('id'))}>
                    {e.get('name')}
                  </Select.Option>
                ))}
              </Select>
            </SelectWrapper>
          </FlexRow>
        ) : (
            ''
          )}
        {/* 教材版本和课程体系 */}
        {hasTeachingVersion || hasCourseSystem ? (
          <div>
            <PaperComponent
              hasTeachingVersion={hasTeachingVersion}
              hasCourseSystem={hasCourseSystem}
              gradeId={paperProperty.get('gradeId')}
              subjectId={paperProperty.get('subjectId')}
              teachingEditionId={paperProperty.get('teachingEditionId')}
              editionId={paperProperty.get('editionId')}
              gradeList={this.props.grade.toJS()}
              versionValue={paperProperty.get('versionValue')}
              systemValue={paperProperty.get('systemValue')}
              onOk={this.modalConfirm}
              editionName={editionName}
              teachingEditionName={teachingEditionName}
              showSystemList={showSystemList}
              /* 选做题专属参数 start */
              changeRuleGroup={this.changeRuleGroup}  // 回调
              groupList={groupList}   // 选做题分组状况
              ruleList={ruleList}     // ruleList
              maxQuestionNum={sum.count} // 题目最大题号
              hidden={paperContent.isRestoredPaper === 1}
            /* 选做题专属参数 end */
            />
          </div>
        ) : null}
      </PaperTitle>
    );
    // 总分的统计，考虑
    // const scoreSum = getScoreSumByQuestionListWithChooseGroup(choosedquestions, groupList.toJS());
    // const questionCount = choosedquestions.get(-1).get('examPaperContentQuestionOutputDTOList').get(-1).getIn('serialNumber')
    let sum = calculateSum(choosedquestions, 'entryExamPaperQuesInputDTOList', groupList.toJS());
    // 预览头部详情操作按钮
    const renderHead = () => (
      <FlexRowHeader style={{ alignItems: 'center' }}>
        <div className="title">{pageStatus === 'edit' ? '题目详情 ' : ' '}</div>
        <i title="同组选做题只会计算一道题的分数">本试卷共{sum.count}小题，共计{sum.score}分。</i>
        {pageStatus === 'preview' && editMode === 'preview' && !showPrint ? (
          <Affix
            target={() =>
              // document.querySelector('.paperEdit .ant-modal-body') || window
              document.querySelector('.paper-question-list-wrapper') || window
            }
          >
            {
              this.parallelPermission ? <Button
                size="small"
                type="primary"
                onClick={this.showParallelModal}
                style={{ marginRight: '5px' }}
              >
                平行组卷
              </Button> : null
            }

            <Button
              size="small"
              type="primary"
              onClick={() => {
                this.setState({
                  showPrintCheck: true,
                  withAnswer: false
                });
              }}
              style={{ marginRight: '5px' }}
            >
              打印
            </Button>
            <Button
              size="small"
              type="primary"
              onClick={() => {
                this.setState({
                  showPrintCheck: true,
                  withAnswer: true
                });
              }}
              style={{ marginRight: '5px' }}
            >
              带答案打印
            </Button>
          </Affix>
        ) : (
            ''
          )}
        {showPrint ? (
          ''
        ) : (
          <Affix
            target={() =>
                // document.querySelector('.paperEdit .ant-modal-body') || window
                document.querySelector('.paper-question-list-wrapper') || window
              }
            ref={(e) => { this.affixNode = e }}
            >
            {isParallel ? (
              <Popconfirm title="是否确认重新选题" onConfirm={this.resetAllQuestion} okText="确定" cancelText="取消">
                <Button
                  size="small"
                  type="primary"
                  style={{ marginRight: 5 }}
                  >
                    重新选题
                </Button>
              </Popconfirm>
              ) : null}
            <Button
              size="small"
              type="primary"
              onClick={this.handleClickPaperAnalysis}
              style={{ marginRight: 5 }}
              >
                试卷分析
            </Button>
          </Affix>
          )}
        {showPrint ? (
          ''
        ) : (
          <Switch
            defaultChecked={false}
            onChange={() => {
              const showAllAnalysis = this.state.showAllAnalysis;
              const _map = {};
              paperContentList.forEach(item => {
                item.get('entryExamPaperQuesInputDTOList').forEach(it => {
                  _map[it.get('id')] = !showAllAnalysis;
                });
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
          )}
        {showPrint ? '' : '显示答案与解析'}
      </FlexRowHeader>
    );
    // 试卷内容
    const renderPaper = () =>
      paperContentList.map((e, i) => {
        const renderOne = () => (
          <QuestionTitle>
            <span style={{ color: '#f46e65' }}>
              {`${numberToChinese(i + 1)}、${e.get('name')} (共${e.get('entryExamPaperQuesInputDTOList').count()}小题)`}
            </span>
            {pageStatus === 'edit' ? (<span>
              <Icon
                type="arrow-down"
                onClick={() => {
                  if (i === paperContentList.count() - 1) {
                    message.info('已经是最后一个啦');
                    return;
                  }
                  this.editHwQuestionData({
                    actionType: 'arrowDownGroup',
                    data: {
                      quesitonItemList: e.get('entryExamPaperQuesInputDTOList'),
                      nextQuestionItemList: paperContentList.getIn([i + 1, 'entryExamPaperQuesInputDTOList']),
                      bigIndex: i
                    }
                  });
                }}
              />
              <Icon
                type="arrow-up"
                onClick={() => {
                  if (i === 0) {
                    message.info('已经是第一个啦');
                    return;
                  }
                  this.editHwQuestionData({
                    actionType: 'arrowUpGroup',
                    data: {
                      quesitonItemList: e.get('entryExamPaperQuesInputDTOList'),
                      preQuestionItemList: paperContentList.getIn([i - 1, 'entryExamPaperQuesInputDTOList']),
                      bigIndex: i
                    }
                  });
                }}
              />
              <Popconfirm title="是否确认删除？" onConfirm={() => {
                if (e.get('entryExamPaperQuesInputDTOList').count() > 0) {
                  message.warning('该大题下还有小题，不能删除');
                  return;
                }
                this.editHwQuestionData({
                  actionType: 'deleteBigQuestion',
                  data: {
                    index: i,
                  }
                });
              }}  okText="确定" cancelText="取消">
                <Icon
                  type="delete"
                />
              </Popconfirm>
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  // 如果有复合题不让批量设置
                  let isExistComplex = e.get('entryExamPaperQuesInputDTOList').some(it => it.get('templateType') === 1);
                  if (isExistComplex) {
                    message.warning('该大题下有复合题，不支持批量设置');
                    return;
                  }
                  if (e.get('name') === '主观选择题') {
                    this.showMentalityBatchFunc(true, e);
                  } else {
                    this.setState({
                      showScoreBatch: true,
                      curBatchData: e,
                      batchScore: 3,
                    });
                  }
                }}
              >
                批量设置分数
                </Button>
            </span>) : null}
          </QuestionTitle>
        );
        const renderQueInfo = (question) => {
          // this.getUser(question);
          // const userId = question.get('updatedUser');
          // const userName = userId ? this.user[String(userId)] : '';
          return (<QuestionInfo>
            <span>题目id：{question.get('id')}</span>
            <span>
            最后修改时间：
          {/*  { userName
              ? `${userName}/`
              : ''} */}
              {timestampToDate(
              question.get('updatedTime') ||
              question.get('createdTime'),
            )}
            </span>
            <span>使用次数：{question.get('quoteCount')}</span>
            <span>答题次数：{question.get('questionAnswerCount')}</span>
            <span>来源试卷：{question.get('sourceExamPaperName') || '--'}</span>
          </QuestionInfo>);
        };
        const renderOneQuestion = (showAnalysis, isComplex, index, item, e, bigIndex) => (
          <OneQuestion key={index} id={`small-question-${item.get('id')}`}>
            <QuestionInfoWrapper style={{ background: item.get('id') === this.state.selectedSmallId ? '#eee' : '#fff' }}>
              <ZmExamda
                index={`${index + 1}${isComplex ? '(复合题)' : ''}、`}
                question={item}
                showRightAnswer={showAnalysisMap.get(String(item.get('id')))}
                options={['title']}
              />
              {pageStatus === 'edit' ? (
                isMentalityQuestion(item.get('typeId')) ? (
                  <FlexEndRow>
                    {/* 主管选择题，分数特别处理，弹框单独设置，因为每个选项分数不同 */}
                    <span style={{ marginRight: 10 }}>
                      当前分数：
                      {(item.get('scoreList') || fromJS([])).map(
                        (val, ii) => `${numberToLetter(ii)}:${val}  `,
                      )}
                    </span>
                    <Button
                      type="primary"
                      onClick={() => {
                        this.setState({
                          curEditQuestion: item,
                          showMentalityScore: true,
                        });
                      }}
                    >
                      设置分数
                    </Button>
                  </FlexEndRow>)
                  :
                  (
                    <FlexEndRow>
                      {
                        isComplex ?
                          <div>
                            <span style={{ marginRight: '10px' }}>
                              本题总分：{item.get('score')}
                            </span>
                            <Button size="small"
                              type="primary"
                              onClick={() => {
                                this.setState({ isShowBatchEditChildScore: true });
                                this.batchChildScore = {
                                  bigIndex,
                                  smallIndex: index
                                };
                              }}
                            >批量设置子题分数</Button>
                          </div> :
                          <div title={item.get('answerRule') > 1 ? '选做题设置分数时会更改整组所有题目分数' : ''}>
                            设置分数
                            <InputNumber
                              min={0.5}
                              max={100}
                              step={0.5}
                              precision={1}
                              type="number"
                              value={item.get('score')}
                              onChange={score => {
                                if (score <= 0) {
                                  return;
                                }
                                this.editHwQuestionData({
                                  actionType: 'score',
                                  data: {
                                    questionIdList: [item.get('id')],
                                    score,
                                  }
                                });
                              }}
                            />
                          </div>
                      }

                    </FlexEndRow>
                  )
              ) : (
                <FlexEndRow>
                  {isMentalityQuestion(item.get('typeId')) ? (
                    <span style={{ marginRight: 10 }}>
                        当前分数：
                      {(item.get('scoreList') || fromJS([])).map(
                          (val, ii) => `${numberToLetter(ii)}:${val}  `,
                        )}
                    </span>
                    ) : (
                      <span>本题分数：{item.get('score')}</span>
                      )}
                </FlexEndRow>
                )}
              <FlexWrapper>
                {renderQueInfo(item)}
                <HideButton className="showHideButton">
                  {pageStatus === 'edit' ? (
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => {
                        this.aiReplaceQuestion(item.get('originQuestionData') || item, item.get('id'));
                      }}
                      style={{ marginRight: 5 }}
                  >
                    智能换题
                  </Button>
                ) : null}
                  {isComplex ? (
                  ''
                ) : (
                  <Icon
                    type="eye"
                    onClick={() => {
                      this.setState({
                        showAnalysisMap: showAnalysisMap.set(
                            String(item.get('id')),
                            !showAnalysis,
                          ),
                      });
                    }}
                  />
                  )}
                  {pageStatus === 'edit' ? (
                    <div style={{ display: 'inline' }}>
                      <Icon
                        type="delete"
                        onClick={() => {
                          Modal.confirm({
                            title: '删除确认',
                            content: '是否确认删除该小题',
                            okText: '确认',
                            cancelText: '取消',
                            onOk: () => {
                              this.editHwQuestionData({
                                actionType: 'deleteQuestion',
                                data: { questionIdList: [item.get('id')] }
                              });
                            }
                          });
                        }}
                      />
                      <Icon
                        type="arrow-up"
                        onClick={() => {
                          this.editHwQuestionData({
                            actionType: 'arrowUp',
                            data: { questionItem: item, index, bigIndex }
                          });
                        }}
                      />
                      <Icon
                        type="arrow-down"
                        onClick={() => {
                          this.editHwQuestionData({
                            actionType: 'arrowDown',
                            data: { questionItem: item, index, bigIndex }
                          });
                        }}
                      />
                    </div>
                ) : (
                    ''
                  )}
                  <ErrorCorrect
                    questionId={item.get('id')}
                    sourceModule={sourceModule.tk.questionManagement.id}
                  />
                </HideButton>
              </FlexWrapper>
              {isComplex ? (
                <ListChildQuestion
                  children={item.get('children')} // eslint-disable-line
                  onEditScore={(epScore, childIndex) => {
                    if (epScore <= 0 || !epScore) {
                      return;
                    }
                    this.editHwQuestionData({
                      actionType: 'childScore',
                      data: {
                        questionIdList: [item.get('id')],
                        epScore,
                        bigIndex,
                        smallIndex: index,
                        childIndex
                      }
                    });
                  }}
                  pageStatus={pageStatus}
                  showScore
                />
              ) : (
                <AnalysisWrapper show={showAnalysis}>
                  <AnalysisItem>
                    <AnswerTitle>解析：</AnswerTitle>
                    <AnswerConten
                      dangerouslySetInnerHTML={{
                        __html: renderToKatex((item.get('analysis') || '暂无').replace(/(【解析】<br \/>)|(【解析】)|(【分析】)/g, '')) || ''
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
                                  {(item.get('answerList') || fromJS([])).join('、')}
                                </AnswerConten>
                            ) : (
                              <FlexColumn style={{ flex: 1 }}>
                                {(item.get('answerList') || fromJS([])).map(
                                  (itt, ii) => {
                                    return (
                                      <AnswerConten
                                        key={ii}
                                        className={'rightAnswer'}
                                        dangerouslySetInnerHTML={{
                                          __html:
                                            renderToKatex(
                                              itt.replace(
                                                /(【答案】)|(【解答】)/g,
                                                '',
                                              ),
                                            ) || '',
                                        }}
                                      />
                                    );
                                  },
                                )}
                              </FlexColumn>
                            )}
                        </AnalysisItem>
                      ) : (
                        ''
                      )}
                </AnalysisWrapper>
                )}
            </QuestionInfoWrapper>
          </OneQuestion>
        );
        return (
          <BigQuestion key={i}>
            {renderOne()}
            {e.get('entryExamPaperQuesInputDTOList').map((item, index) => {
              const showAnalysis = showAnalysisMap.get(String(item.get('id')));
              const isComplex = item.get('templateType') === 1;
              return renderOneQuestion(showAnalysis, isComplex, index, item, e, i);
            })}
          </BigQuestion>
        );
      });
    // 编辑分数弹框
    const renderScoreModal = () => (
      <Modal title="批量设置分数" visible closable={false} footer={null}>
        题型：{curBatchData.get('name')}
        <InputNumber
          style={{ margin: '0 10px' }}
          min={0.5}
          max={100}
          step={0.5}
          precision={1}
          defaultValue={3}
          value={this.state.batchScore}
          onChange={val => {
            if (val <= 0) {
              return;
            }
            this.setState({
              batchScore: val,
            });
          }}
        />
        <Button
          style={{ marginRight: 10 }}
          onClick={() => {
            this.setState({
              showScoreBatch: false,
              curBatchData: {},
            });
          }}
        >取消</Button>
        <Button
          type="primary"
          onClick={() => {
            const questionIdList = curBatchData.get('entryExamPaperQuesInputDTOList').map((question) => question.get('id'));
            this.editHwQuestionData({
              actionType: 'score',
              data: {
                score: batchScore,
                questionIdList,
              }
            });
            this.setState({
              showScoreBatch: false,
              curBatchData: {},
            });
          }}
        >确定</Button>
      </Modal>
    );
    // 头部详情操作按钮
    const renderHeaderDiv = () => {
      const renderPreview = () => {
        const gradeName = (grade.find((gradeItem) => String(paperProperty.get('gradeId')) === String(gradeItem.get('id'))) || emptyMap).get('name') || '';
        const subjectName = (subject.find((subjectItem) => String(paperProperty.get('subjectId')) === String(subjectItem.get('id'))) || emptyMap).get('name') || '';
        return (<PaperBigTitle className="title" style={{ textAlign: 'center' }}>
          {paperProperty.get('epName')}
          <div className="info">
            {gradeName}/{subjectName}
            {isDataExternal ? (
              <div>
                <span>题目：{sum.count}</span>
                <span>使用：{paperContent.quoteCount || 0}</span>
              </div>
            ) : (
                ''
              )}
          </div>
        </PaperBigTitle>);
      };
      // eslint-disable-next-line no-confusing-arrow
      const renderEdit = () => {
        return isMentalityPaper && showMentality ? null : (
          <div>
            {isDataExternal ? (
              <Button onClick={() => { this.setState({ showConfirmLeave: true }) }}>返回试卷列表</Button>
            ) : (
                ''
              )}
            {pageStatus === 'preview' || paperContent.isRestoredPaper === 1 ? ( // 还原试卷不能选题
              ''
            ) : (
              <Button
                onClick={() => {
                  back(false);
                }}
                >
                <Icon type="left" />
                  返回选题
              </Button>
              )}
          </div>
        );
      };
      return (
        <FlexRowHead>
          <div style={{ flex: 1 }}>
            {isMentalityPaper && showMentality ? (
              <Button onClick={() => this.showMentality(false)}>上一步</Button>
            ) : null}
            {pageStatus === 'preview' ? renderPreview() : renderEdit()}
          </div>
          {pageStatus === 'edit' ? (
            (this.myIsMentality() && showMentality) || !this.myIsMentality() ? (
              <div>
                {!isPublish ? (
                  <Button onClick={() => this.save(false)}>存草稿</Button>
                ) : (
                    ''
                  )}
                <Button
                  onClick={() => {
                    this.checkForm() && this.changePageStatus('preview');
                  }}
                >
                  预览
                </Button>
              </div>
            ) : null
          ) : (
              ''
            )}
          {pageStatus === 'preview' ? (
            <ActionButton>
              {isDataExternal && editMode === 'preview' ? (
                <Button
                  style={{ zIndex: 101 }}
                  id="refresh-button"
                  onClick={() => {
                    this.backToList();
                  }}
                >
                  {showPrint ? '返回' : '返回试卷列表'}
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    this.changePageStatus('edit');
                  }}
                  >
                    返回编辑
                </Button>
                )}
            </ActionButton>
          ) : (
              ''
            )}
          {renderSaveBtn()}
        </FlexRowHead>
      );
    };
    // 心理测评分数弹框
    const renderMentalityModal = () => {
      const changeScore = (val, index) => {
        if (val % 1 !== 0) {
          return;
        }
        this.setState({
          curEditQuestion: curEditQuestion.setIn(
            ['scoreList', index],
            val || 0,
          ),
        });
      };
      return (
        <Modal
          title="设置分数"
          visible
          closable={false}
          width={250}
          onCancel={() => {
            this.setState({
              showMentalityScore: false,
              curEditQuestion: null,
            });
          }}
          onOk={() => {
            this.changePaperContentList(
              curEditQuestion.set(
                'score',
                Math.max(...curEditQuestion.get('scoreList').toJS()),
              ),
            );
            const changeList = this.setChangePaperContentList(
              paperContentList,
              curEditQuestion,
            );
            dispatch(setPaperContentList(changeList));
            setTimeout(() => {
              this.setState({
                showMentalityScore: false,
                curEditQuestion: null,
              });
            }, 100);
          }}
        >
          {curEditQuestion &&
            curEditQuestion.toJS().scoreList.map((e, index) => (
              <div key={index} style={{ margin: '10px 30px' }}>
                选项{numberToLetter(index)}、
                <InputNumber
                  step={1}
                  precision={0}
                  min={0}
                  value={e}
                  onChange={val => changeScore(val, index)}
                />
              </div>
            ))}
        </Modal>
      );
    };
    return (
      <Modal
        title={pageStatus === 'edit' ? '编辑试卷信息' : ''}
        visible={visible || true}
        bodyStyle={{
          height: 'calc(100vh - 150px)',
          overflow: 'hidden',
        }}
        closable={false}
        footer={null}
        style={{ minWidth: pageStatus === 'edit' ? '100%' : 1200, top: 50 }}
        wrapClassName="paperEdit"
      >
        <BackTop
          target={() =>
              // document.getElementsByClassName('ant-modal-body')[0] || window
              document.querySelector('.paper-question-list-wrapper') || window
            }
          style={{ right: '47px' }}
          ref={(e) => { this.backTopNode = e }}
          >
          <BackToTopDiv>回到顶部 </BackToTopDiv>
        </BackTop>
        {showMentalityScore ? renderMentalityModal() : null}
        {showMentalityScoreBatch ? (
          <BatchScoreModal
            cancel={() => this.showMentalityBatchFunc(false)}
            ok={this.mentalityBatchOk}
            curBatchData={curBatchData}
          />
          ) : null}
        {showScoreBatch ? renderScoreModal() : null}
        <FormSelf id="muPaperForm" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <PrintBG showPrint={showPrint} printIndex={this.state.printIndex}>
          </PrintBG>
          {renderHeaderDiv()}
          {showMentality ? (
            <MentalityEdit
              minScore={minScore}
              totalScore={totalScore}
              item={item}
              rateList={rateList}
              visible
              onChange={this.changeRateList}
              isPreview={pageStatus === 'preview'}
            />
            ) : null}
          {showMentality ? null : (
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {
                  pageStatus !== 'preview' ?
                    <div style={{ height: '100%', overflowY: 'auto' }} className="paper-question-editor-wrapper">
                      <BigQuestionEditor
                        questionData={choosedquestions.toJS()}
                        info={sum}
                        onChange={this.handleEditBig}
                        onConfirmBig={this.handleAddOrEditBig}
                        onSelectSmall={(id) => { this.setState({ selectedSmallId: id }) }}
                      />
                    </div>
                    : null
                }
              <div style={{ flex: 1, height: '100%', overflowY: 'auto' }} className="paper-question-list-wrapper" >
                {pageStatus === 'edit' ? renderEditHeader() : (<ChooseQuestionInPaper
                  changeRuleGroup={this.changeRuleGroup}
                  groupList={groupList}
                  ruleList={ruleList}
                  max={sum.count}
                  onlyView={pageStatus === 'preview'}
                />)}
                {renderHead()}
                {renderPaper()}
                {this.state.showPrintCheck
                  ? <PrintCheck
                    onSelect={this.handleChosePrint}
                    onCancel={this.handleCancelChosePrint}
                    ></PrintCheck> : ''}
              </div>
            </div>
            )}
        </FormSelf>
        {showPaperAnalysis ? (
          <Modal
            onCancel={() => {
              this.setState({ showPaperAnalysis: false });
            }}
            footer={null}
            closable={false}
            style={{ minWidth: 900 }}
            bodyStyle={{
              maxHeight: '750px',
              overflowY: 'auto',
              position: 'relative',
            }}
            visible={showPaperAnalysis}
            >
            <PaperAnalysis
              onClose={() => {
                this.setState({ showPaperAnalysis: false });
              }}
              paperName={paperContent.name || paperProperty.get('epName')}
              edit
              data={(paperContentList || fromJS([])).toJS()}
            />
          </Modal>
          ) : (
            ''
          )}
        {showReplaceQuestionItem ? (
          <ReplaceQuestionModal
            close={() => this.setState({ showReplaceQuestionItem: false })}
            choose={newQuestion => {
              this.replaceCurrentQuestion(newQuestion);
            }}
            switchBatch={() => { this.batchSwitch() }}
            AIHomeworkParams={aiReplaceQuestionParams}
            homeworkType={1}
            isShowAnswerAnalysis={true}
          />
          ) : (
            ''
          )}
        {isShowParallel ? (
          <Modal
            title="创建试卷"
            visible={true}
            width={900}
            footer={null}
            onCancel={this.handleClose}
            >
            <ParallelMakePaper
              handleClose={this.handleClose}
              selectPaper={paperContent}
              pageType={2}
              handleNext={this.handleNext}
            />
          </Modal>
          ) : null}
        <Modal footer={null} visible={showConfirmLeave} closable={false}>
          <ModalInfos><Icon type="question-circle-o" />是否确认离开并保存数据</ModalInfos>
          <ModalFooter>
            <ModalBtn onClick={() => { this.setState({ showConfirmLeave: false }) }}>取消</ModalBtn>
            <ModalBtn type="danger" onClick={this.backToList}>直接离开</ModalBtn>
            <ModalBtn type="primary" onClick={() => { this.save(true) }}>保存数据</ModalBtn>
          </ModalFooter>
        </Modal>
        {
            isShowBatchEditChildScore ?
              <EditScoreModal
                onEditScore={(epScore) => {
                  if (epScore <= 0) {
                    return;
                  }
                  this.editHwQuestionData({
                    actionType: 'batchSmallScore',
                    data: {
                      epScore,
                      ...this.batchChildScore
                    }
                  });
                  this.setState({ isShowBatchEditChildScore: false });
                  this.batchChildScore = {};
                }}
                onCancel={() => {
                  this.setState({ isShowBatchEditChildScore: false });
                  this.batchChildScore = {};
                }
                }
              />
              : null
          }
        {
          this.state.loading && <Loading />
        }

      </Modal>
    );
  }
}

const PaperEdit = Form.create()(PaperEditForm);

const mapStateToProps = createStructuredSelector({
  filterFields: makeSelectFilterFields(),
  choosedquestions: makeSelectChooosedQuestions(),
  paperContentList: makeSelectPaperContentList(),
  paperProperty: makeSelectPaperProperty(),
  grade: makeSelectGrade(),
  subject: makeSelectSubject(),
  paperType: makePaperType(),
  ruleList: makeChooseQuestionRule(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaperEdit);
