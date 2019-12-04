/*
 *
 * StandHomeWork
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import immutable, { fromJS } from 'immutable';
// import Helmet from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { toString, toNumber, diffList, formatDate } from 'components/CommonFn';
import { RootWrapper, PlaceHolderBox, WidthBox } from 'components/CommonFn/style';
import PreviewHomeWork from 'containers/TestHomeWork/previewHomework';
// import { changeBtnCanClickAction } from 'containers/LeftNavC/actions';
import { makeBtnCanClick } from 'containers/LeftNavC/selectors';
import { FlexRow, FlexRowCenter, FlexColumn, FlexCenter } from 'components/FlexBox';
import { Select, Input, Button, Pagination, Modal } from 'antd';
const emptyImg = window._baseUrl.imgCdn + '2cfcc00d-8360-42c7-b371-4253fd4735cb.png';
import { RunLoading } from 'components/LoadingIndicator';
import ChildBULeftFilter from './ChildBULeftFilter'; // 少儿BU路由下左侧的筛选
// import { changeAlertShowOrHideAction, setAlertStatesAction } from 'containers/LeftNavC/actions';
// import makeSelectStandHomeWork from './selectors';
// import messages from './messages';
import HomeworkTree from './TreeRender';
import CreateHomeWork from './createHomeWork';
// import { backDefaultKnowledge } from './common';
import { difficultyList } from './common';
const loadingImg = window._baseUrl.imgCdn + '02f36e7d-35d2-4a79-a407-847ed60a6923.gif';
import {
  LeftListWrapper,
  RightContentWrapper,
  SelectColumn,
  TreeWrapper,
  SerachWrapper,
  SerachItem,
  RightContentHeader,
  HomeworkListWrapper,
  HomeworkListItem,
  HomeworkTitle,
  Author,
  QuestionCount,
  QuestionType,
  ControllerWrapper,
  TextBox,
  PaginationWrapper,
} from './indexStyle';
import {
  getGradeListAction,
  getSubjectListAction,
  getEditionListAction,
  getCourseListAction,
  setPreviewSelectObjAction,
  setSearchParamsAction,
  // getPhaseSubjectAction,
  setSearchQuestionParamsAction,
  getKnowledgeListAction,
  setCreateHomeworkStepParamsAction,
  getQuestionListAction,
  saveStandHomeworkAction,
  initDataWhenCloseAction,
  getStandhomeworkListAction,
  getPreviewHomeworkDataListAction,
  setPreviewHomeworkDataListAction,
  // getQuestionTypeListActioin,
  editorHomeworkAction,
  getPhaseSubjectAction,
  deleteHomeworkAction,
  changeIsReEditHomeworkAction,
  changeHomeworkTypeAction,
  setAIHWParamsAction,
  getQuestionType4AiHwAction,
  setAIHWParamsItemAction,
  getQuestion4AIHWAction,
  saveAIHomeworkAction,
  setSearchQuestionParamsItemAction,
  setCreateHomeworkStepParamsItemAction,
  getChangeItemDataListAction,
  setClassTypeCode,
  shelfOrObtainedAction,
  resetState,
} from './actions';
import {
  makePrviewSelectObj,
  makeSerachParams,
  makeSearchQuestionParams,
  makeCreateHomeworkStepParams,
  makePreviewHomework,
  makeGradeList,
  makeIsReEditHomeWork,
  makeHomeworkType,
  makeAIHomeworkParams,
  makePageState,
  makeClassTypeCode,
  makeSliderState,
} from './selectors';
import TestHomeworkSlider from './ChildBULeftFilter/TestHomeworkSlider';
import { getGradeAndSubjectMapper, findLastLevel } from 'utils/helpfunc';
// 学科年级接口
import { getSubjectGrade } from '../ChildBU/FormalCourse/commonServer';
import { getEdition } from '../ChildBU/FormalCourse/FormalCourseSystemManagement/server';
const Option = Select.Option;
import { fetchChildBUCourses, getTestCourseSystem } from './server';

export class StandHomeWork extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.selectChange = this.selectChange.bind(this);
    this.changeSearchParams = this.changeSearchParams.bind(this);
    this.makeChoosePreViewQuestion = this.makeChoosePreViewQuestion.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.shelfOrObtained = this.shelfOrObtained.bind(this);
    this.getChildBUCourseSystem = this.getChildBUCourseSystem.bind(this);
    this.getChildBUCourses = this.getChildBUCourses.bind(this);
    this.handleTreeSelect = this.handleTreeSelect.bind(this);
    this.childSelectChange = this.childSelectChange.bind(this);
    this.state = {
      isPartTimePersion: false, // 是否为兼职人员
      phaseSet: new Set(), // 当有兼职人员 存放允许的学段
      allowSubjectMap: {},
      subjectGradeData: [],
      childGrade: [],
      subjectDictCode: void 0,
      gradeDictCode: void 0,
      courseSystemList: [],
      childCourses: [],
      childBUSelectedParams: fromJS({
        selectGrade: { id: '' },
        selectSubject: { id: '',  children: [] },
        selectEdition: { id: '' },
        selectTree: { id: '' },
        gradeList: [{ id: -1, name: '年级' }],
        sudjectList: [{ id: -1, name: '学科' }],
        editionList: [{ id: -1, name: '版本' }],
        treeList: [],
        standHomeWorkList: [],
        treeDataIsLoading: true,
        paperTotal: 0,
      }),
      isChildBU: false,
      childLoading: false
    };
  }
  componentWillMount() {
    const { lessonType, serachParams, prviewSelectObj, dispatch } = this.props;
    // 设置 lessonType
    dispatch(setSearchParamsAction(serachParams.set('lessonType', lessonType)));
    dispatch(setPreviewSelectObjAction(prviewSelectObj.set('selectTree', fromJS({}))));
  }
  componentDidMount() {
    const lessonType = this.props.lessonType;
    // 判断是否在少儿BU路由下
    const isChildBU = location.pathname.indexOf('childBU') > -1 ? true : false;
    if (isChildBU) {
      // 这里调少儿BU情况下的接口
      this.setState({ childLoading: true });
      getSubjectGrade().then(res => {
        console.log(res);
        if (res.length > 0) {
          this.setState({ subjectGradeData: res, childLoading: false }, () => {
            // 如果 lessonType 是 2，是少儿测评课作业
            if (lessonType === 2) {
              this.testChildSelectChange(res[0] && res[0].id, 'subjectDictCode');
            } else {
              this.childSelectChange(res[0], 'selectSubject');
            }
          });
        }
      });
    } else {
      // 判断老师角色和学科权限 兼职人员要做特殊处理
      const mapper = getGradeAndSubjectMapper();
      if (mapper) {
        this.setState(mapper);
        const phaseId = Array.from(mapper.phaseSet)[0];
        // 找第一个年段是权限范围内的年级
        this.props.dispatch(getGradeListAction(phaseId, mapper.allowSubjectMap[phaseId]));
        return;
      }
      this.props.dispatch(getGradeListAction());
    }
    this.setState({ isChildBU: isChildBU });
  }
  componentWillReceiveProps(nextProps) {
    const classTypeCode = nextProps.prviewSelectObj.toJS().selectEdition.classTypeCode;
    if (classTypeCode) {
      this.props.dispatch(setClassTypeCode(classTypeCode));
    }
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(resetState());
    // dispatch(setPreviewSelectObjAction(
    //   prviewSelectObj
    //     .set('standHomeWorkList', fromJS([]))
    //     .set('paperTotal', 0),
    // ));
  }
  pageChange(page) {
    const { serachParams } = this.props;
    this.props.dispatch(setSearchParamsAction(serachParams.set('pageIndex', page)));
    setTimeout(() => {
      this.props.dispatch(getStandhomeworkListAction());
    }, 20);
  }
  selectChange(value, type, grades) {
    const { dispatch, prviewSelectObj } = this.props;
    const { isChildBU } = this.state;
    let newSelect = fromJS({ id: toNumber(value.key), name: value.label, level: value.level || -1 });
    dispatch(setPreviewSelectObjAction(prviewSelectObj.set(type, newSelect)));
    if (type === 'selectGrade') {
      // 判断老师角色和学科权限 兼职人员要做特殊处理
      const mapper = getGradeAndSubjectMapper();
      if (mapper) {
        const gradeList = prviewSelectObj.get('gradeList') || fromJS([]);
        const item = gradeList.toJS().find(e => String(e.id) === String(value.key)) || {}; // 因为只存了年级id 要根据id找phaseId
        // 找第一个年段是权限范围内的年级
        if (!isChildBU) {
          dispatch(getSubjectListAction(mapper.allowSubjectMap[item.phaseId]));
        }
        return;
      } else {
        if (!isChildBU) {
          dispatch(getSubjectListAction());
        }
      }
      dispatch(setAIHWParamsItemAction('grade', value.label));
    } else if (type === 'selectSubject') {
      if (!isChildBU) {
        dispatch(getEditionListAction());
      }
      dispatch(setAIHWParamsItemAction('subject', value.label));
    } else if (type === 'selectEdition') {
      if (!isChildBU) {
        dispatch(getCourseListAction());
      }
    }
    // 获取classTypeCode，保存起来用来判断是不是少儿和小班课
    const editionList = prviewSelectObj.toJS().editionList;
    editionList.forEach((item) => {
      if (String(value.key) === String(item.id)) {
        dispatch(setClassTypeCode(item.classTypeCode));
      }
    });
  }

  testChildSelectChange(value, type) {
    const { subjectGradeData, subjectDictCode } = this.state;
    if (type === 'subjectDictCode') {
      let gradeList = fromJS([]);
      let gradeDictCode;
      for (let i = 0; i < subjectGradeData.length; i++) {
        if (value === subjectGradeData[i].id) {
          gradeList = subjectGradeData[i].children;
          gradeDictCode = gradeList[0] && gradeList[0].id;
          this.getChildTestCourseSystem(value, gradeDictCode);
          this.setState({ subjectDictCode: value, gradeDictCode, childGrade: gradeList });
          break;
        }
      }
    } else if (type === 'gradeDictCode') {
      this.getChildTestCourseSystem(subjectDictCode, value);
      this.setState({ gradeDictCode: value });
    }
  }

  childSelectChange(value, type, params) {
    let { childBUSelectedParams } = this.state;
    if (type === 'selectSubject') {
      let selectGrade = {};
      if (value.children.length > 0) {
        selectGrade = value.children[0];
        let obj = childBUSelectedParams.set('selectSubject', fromJS(value)).set('selectGrade', fromJS(selectGrade));
        this.getChildBUCourseSystem(value.id, selectGrade.id).then(res => {
          if (res.length > 0) {
            let obj1 = obj.set('selectEdition', fromJS(res[0]));
            this.getChildBUCourses(value.id, selectGrade.id, res[0].id).then(course => {
              if (course.length > 0) {
                let defaultTree = findLastLevel(course);
                let obj2 = obj1.set('selectTree', fromJS(defaultTree));
                console.log(defaultTree, 'defaultTree');
                this.handleTreeSelect(defaultTree);
                this.setState({ childBUSelectedParams: obj2 });
              } else {
                let obj2 = obj1.set('selectTree', fromJS({ id: '' }));
                this.setState({ childBUSelectedParams: obj2, childCourses: [] });
                this.handleTreeSelect({});
              }
            });
          } else {
            let obj1 = obj.set('selectEdition', fromJS({ id: '' })).set('selectTree', fromJS({ id: '' }));
            this.setState({ childBUSelectedParams: obj1, childCourses: [] });
            this.handleTreeSelect({});
          }
        });
      } else {
        let obj = childBUSelectedParams.set('selectSubject', fromJS(value)).set('selectGrade', fromJS({ id: '',  children: [] }));
        this.setState({ childBUSelectedParams: obj, childCourses: [] });
        this.handleTreeSelect({});
      }
    } else if (type === 'selectGrade') {
      let obj = childBUSelectedParams.set('selectGrade', fromJS(value));
      console.log(value, 'grade');
      this.getChildBUCourseSystem(params.subjectId, params.gradeId).then(res => {
        if (res.length > 0) {
          let obj1 = obj.set('selectEdition', fromJS(res[0]));
          this.getChildBUCourses(params.subjectId, params.gradeId, res[0].id).then(course => {
            if (course.length > 0) {
              let defaultTree = findLastLevel(course);
              let obj2 = obj1.set('selectTree', fromJS(defaultTree));
              this.setState({ childBUSelectedParams: obj2 });
              this.handleTreeSelect(defaultTree);
            } else {
              let obj2 = obj1.set('selectTree', fromJS({ id: '' }));
              this.setState({ childBUSelectedParams: obj2, childCourses: [] });
              this.handleTreeSelect({});
            }
          });
        } else {
          let obj1 = obj.set('selectEdition', fromJS({ id: '' })).set('selectTree', fromJS({ id: '' }));
          this.setState({ childBUSelectedParams: obj1, childCourses: [] });
          this.handleTreeSelect({});
        }
      });
    } else if (type === 'selectEdition') {
      let obj = childBUSelectedParams.set('selectEdition', fromJS(value));
      this.getChildBUCourses(params.subjectId, params.gradeId, value.id).then(course => {
        if (course.length > 0) {
          let defaultTree = findLastLevel(course);
          let obj2 = obj.set('selectTree', fromJS(defaultTree));
          this.setState({ childBUSelectedParams: obj2 });
          this.handleTreeSelect(defaultTree);
        } else {
          let obj2 = obj.set('selectTree', fromJS({ id: '' }));
          this.setState({ childBUSelectedParams: obj2, childCourses: [] });
          this.handleTreeSelect({});
        }
      });
    }
  }
  changeSearchParams(value, type) {
    const { dispatch, serachParams } = this.props;
    if (type === 'diff') {
      dispatch(setSearchParamsAction(serachParams.set(type, toNumber(value.key))));
    } else {
      dispatch(setSearchParamsAction(serachParams.set(type, value)));
    }
  }
  /**
   * 上架下架作业
   * @param {*} param0 { ...【弹框提示】, homeworkId: 作业 id， homeworkNowState: 当前作业上下架状态【0 已上架， 1 已下架】 }
   */
  shelfOrObtained({ homeworkId = 0, homeworkNowState }) {
    const { dispatch } = this.props;
    const typeStr = homeworkNowState === 0 ? '下架' : '上架';
    const clientCanSee = homeworkNowState === 0 ? '不可见' : '可见';
    Modal.confirm({
      title: `作业${typeStr}`,
      content: `${typeStr}后的作业将在客户端${clientCanSee}，你确定${typeStr}么？`,
      okText: typeStr,
      cancelText: '取消',
      onOk: () => {
        dispatch(shelfOrObtainedAction(homeworkId, homeworkNowState));
      }
    });
  }
  deleteRecord(item) {
    const { isChildBU } = this.state;
    const { dispatch, previewHomework } = this.props;
    const record = item.toJS();
    Modal.confirm({
      title: '删除',
      content: `确定删除作业：”${record.name}${isChildBU ? '' : (item.get('nameSuffix') || '')}“？`,
      okText: '删除',
      cancelText: '取消',
      onOk: () => new Promise((resolve) => {
        dispatch(setPreviewHomeworkDataListAction(previewHomework.set('homeworkId', item.get('id') || -1)));
        dispatch(deleteHomeworkAction());
        setTimeout(resolve, 800);
      }),
    });
  }

  makeChoosePreViewQuestion(standHomeWorkList) {
    const { isChildBU } = this.state;
    const { dispatch, previewHomework, lessonType } = this.props;
    return (<HomeworkListWrapper>
      {standHomeWorkList.map((item, index) => {
        const hasOffShelf = item.get('state') === 1;
        return (<HomeworkListItem key={index}>
          <FlexRowCenter style={{ height: 33 }}>
            <HomeworkTitle>{`${item.get('name')}${isChildBU ? '' : (item.get('nameSuffix') || '')}`}</HomeworkTitle>
            <Author>{`${item.get('author')}/${formatDate('yyyy-MM-dd', new Date(item.get('dateTime')))}`}</Author>
          </FlexRowCenter>
          <FlexRowCenter style={{ height: 33 }}>
            <QuestionType>{`题目数量：${item.get('questionAmount') || 0}`}</QuestionType>
            <QuestionCount>{`使用次数：${item.get('useCount') || 0}`}</QuestionCount>
            <QuestionCount>{`答题次数：${item.get('questionAnswerCount') || 0}`}</QuestionCount>
            <QuestionCount>{`状态：${hasOffShelf ? '已下架' : '已上架'}`}</QuestionCount>
            {/* <QuestionCount>{`预计用时：${item.get('useCount') || 0}`}</QuestionCount> */}
            {/* <QuestionCount>{`选择题:${item.get('useCount') || 0}`}</QuestionCount>
              <QuestionCount>{`填空题:${item.get('useCount') || 0}`}</QuestionCount>
              <QuestionCount>{`其他:${item.get('useCount') || 0}`}</QuestionCount> */}
            {/* <QuestionType>{`试卷类型：${item.get('type') === 1 ? '课前测评' : '课后作业'}`}</QuestionType> */}
            <PlaceHolderBox />
            <ControllerWrapper>
              <TextBox
                onClick={() => {
                  // dispatch(setPreviewHomeworkDataListAction(previewHomework.set('homeworkId', item.get('id') || -1)));
                  // setTimeout(() => dispatch(getPreviewHomeworkDataListAction()), 20);
                  // 打印
                  dispatch(getPreviewHomeworkDataListAction({ type: 'print', homeworkId: item.get('id'), lessonType }));
                }}
              >导出作业</TextBox>
              <WidthBox />
              <TextBox
                onClick={() => {
                  this.shelfOrObtained({
                    homeworkId: item.get('id'),
                    homeworkNowState: item.get('state'),
                  });
                  // dispatch(setPreviewHomeworkDataListAction(previewHomework.set('homeworkId', item.get('id') || -1)));
                  // setTimeout(() => dispatch(getPreviewHomeworkDataListAction()), 20);
                }}
              >{item.get('state') === 1 ? '上架' : '下架'}</TextBox>
              <WidthBox />
              <TextBox
                onClick={() => {
                  dispatch(setPreviewHomeworkDataListAction(previewHomework.set('homeworkId', item.get('id') || -1)));
                  setTimeout(() => dispatch(getPreviewHomeworkDataListAction()), 20);
                }}
              >查看详情</TextBox>
              <WidthBox />
              <TextBox
                onClick={() => {
                  // 请求试卷
                  dispatch(setPreviewHomeworkDataListAction(previewHomework.set('homeworkId', item.get('id') || -1)));
                  dispatch(changeIsReEditHomeworkAction(true));
                  dispatch(getPhaseSubjectAction(3));
                  setTimeout(() => dispatch(editorHomeworkAction()), 20);
                }}
              >修改作业</TextBox>
              <WidthBox />
              <TextBox
                onClick={() => {
                  this.deleteRecord(item);
                }}
              > 删除作业</TextBox>
            </ControllerWrapper>
          </FlexRowCenter>
        </HomeworkListItem>);
      })}
    </HomeworkListWrapper>);
  }

  // 获取少儿BU课程体系
  async getChildBUCourseSystem(subjectId, gradeId) {
    this.setState({ childLoading: true });
    const courseSystemList = await getEdition({
      subjectDictCode: subjectId,
      gradeDictCode: gradeId,
      state: ''
    });
    this.setState({ courseSystemList, childLoading: false });
    return courseSystemList;
  }
  // 获取少儿体系课程
  async getChildBUCourses(subjectId, gradeId, editionId) {
    this.setState({ childLoading: true });
    const childCourses = await fetchChildBUCourses({
      subject: 'string',
      subjectDictCode: subjectId,
      grade: 'string',
      gradeDictCode: gradeId,
      level: 0,
      editionId
    });
    this.setState({ childCourses, childLoading: false });
    return childCourses;
  }

  // 获取少儿测评课课程
  async getChildTestCourseSystem(subjectId, gradeId) {
    const { dispatch, prviewSelectObj } = this.props;
    this.setState({ childLoading: true });
    const childCourses = await getTestCourseSystem({
      subjectDictCode: subjectId,
      gradeDictCode: gradeId,
    });
    this.setState({ childCourses, childLoading: false });
    const id = childCourses[0] && childCourses[0].id;
    const name = childCourses[0] && childCourses[0].name;
    dispatch(setPreviewSelectObjAction(
      prviewSelectObj.set('selectTree', fromJS({ id, name }))));
    dispatch(getStandhomeworkListAction());
  }

  handleClickTestCourseSystem = (id, name) => {
    const { dispatch, prviewSelectObj } = this.props;
    dispatch(setPreviewSelectObjAction(
      prviewSelectObj.set('selectTree', fromJS({ id, name }))));
    this.props.dispatch(getStandhomeworkListAction());
  }

  // 处理点击树节点
  handleTreeSelect(value, selectedKnowledge) {
    const { dispatch, searchQuestionParams, createHomeworkStepParams, AIHomeworkParams, prviewSelectObj } = this.props;
    if (!this.state.isChildBU) {
      this.selectChange(value, 'selectTree');
      dispatch(setSearchQuestionParamsAction(searchQuestionParams.set('selectCourseSystemPath', fromJS(value.path || []))));
      dispatch(setCreateHomeworkStepParamsAction(createHomeworkStepParams.set('homeworkName', `${selectedKnowledge.name}--${createHomeworkStepParams.getIn(['homeworkDiff', 'name'])}`)));
      dispatch(setAIHWParamsAction(AIHomeworkParams
        .set('homeworkName', `${selectedKnowledge.name}--${difficultyList[AIHomeworkParams.get('difficulty') - 1]}`)
        .set('selectCourseSystem', fromJS({ id: selectedKnowledge.id, name: selectedKnowledge.name, level: selectedKnowledge.level }))));
      setTimeout(() => {
        dispatch(getStandhomeworkListAction());
      }, 20);
    } else {
      let obj = this.state.childBUSelectedParams.toJS();
      obj.selectTree = value;
      this.setState({
        childBUSelectedParams: fromJS(obj)
      }, () => {
        let newSelect = fromJS({ id: toNumber(value.key || value.id), name: value.label || value.name, level: value.level || -1 });
        dispatch(setPreviewSelectObjAction(prviewSelectObj.set('selectTree', newSelect)));
        dispatch(setSearchQuestionParamsAction(searchQuestionParams.set('selectCourseSystemPath', fromJS(value.path || []))));
        dispatch(setCreateHomeworkStepParamsAction(createHomeworkStepParams.set('homeworkName', `${value.label || value.name}--${createHomeworkStepParams.getIn(['homeworkDiff', 'name'])}`)));
        dispatch(setAIHWParamsAction(AIHomeworkParams
          .set('homeworkName', `${value.label}--${difficultyList[AIHomeworkParams.get('difficulty') - 1]}`)
          .set('selectCourseSystem', fromJS({ id: value.key, name: value.label, level: value.level }))));
        setTimeout(() => {
          dispatch(getStandhomeworkListAction());
        }, 20);
      });
    }
  }

  saveStandHomework = () => {
    const { dispatch, lessonType } = this.props;
    const { childBUSelectedParams, isChildBU, subjectGradeData } = this.state;
    const params = {};
    if (isChildBU && lessonType !== 2) {
      const gradeId = childBUSelectedParams.getIn(['selectGrade', 'id']);
      const subjectId = childBUSelectedParams.getIn(['selectSubject', 'id']);
      for (let i = 0; i < subjectGradeData.length; i++) {
        if (subjectId === subjectGradeData[i].id) {
          params.subject = subjectGradeData[i].name;
          let gradeList = subjectGradeData[i].children;
          for (let j = 0; j < gradeList.length; j++) {
            if (gradeId === gradeList[j].id) {
              params.grade = gradeList[j].name;
              break;
            }
          }
          break;
        }
      }
    } else if (isChildBU && lessonType === 2) {
      const { subjectGradeData, childGrade, subjectDictCode, gradeDictCode } = this.state;
      for (let i = 0; i < subjectGradeData.length; i++) {
        if (subjectDictCode === subjectGradeData[i].id) {
          params.subject = subjectGradeData[i].name;
          break;
        }
      }
      for (let i = 0; i < childGrade.length; i++) {
        if (gradeDictCode === childGrade[i].id) {
          params.grade = childGrade[i].name;
          break;
        }
      }
    }
    dispatch(saveStandHomeworkAction(params));
  }

  render() { // eslint-disable-line
    const {
      dispatch, prviewSelectObj, serachParams,
      searchQuestionParams, createHomeworkStepParams, btnCanClick,
      previewHomework, isReEditHomeWork, homeworkType,
      AIHomeworkParams, pageState, lessonType
    } = this.props;
    const { phaseSet, allowSubjectMap, isPartTimePersion, subjectGradeData, courseSystemList, childCourses, isChildBU, childBUSelectedParams, childLoading, childGrade, subjectDictCode, gradeDictCode, } = this.state;
    const selectGrade = prviewSelectObj.get('selectGrade') || fromJS({});
    const selectSubject = prviewSelectObj.get('selectSubject') || fromJS({});
    const selectEdition = prviewSelectObj.get('selectEdition') || fromJS({});
    const gradeList = prviewSelectObj.get('gradeList') || fromJS([]);
    const sudjectList = prviewSelectObj.get('sudjectList') || fromJS([]);
    const editionList = prviewSelectObj.get('editionList') || fromJS([]);
    const leftSelectTree = prviewSelectObj.get('selectTree') || fromJS({});
    const leftTreeList = prviewSelectObj.get('treeList') || fromJS([]);
    const standHomeWorkList = prviewSelectObj.get('standHomeWorkList') || fromJS([]);
    const searchDiff = serachParams.get('diff') || 4;
    const showCreateHomeworkModal = searchQuestionParams.get('showCreateHomeworkModal');
    const paperTotal = prviewSelectObj.get('paperTotal') || 0;
    const originEdition = editionList.find(item => String(item.get('id')) === String(selectEdition.get('id'))) || fromJS({});
    let isSmallClass = Number(originEdition.get('classTypeCode')) === 2; // 小班课
    if (isChildBU) {
      isSmallClass = true;
    }
    let curAllowSubject = []; // 兼职人员用得到
    if (isPartTimePersion) {
      const item = gradeList.toJS().find(e => String(e.id) === String(selectGrade.get('id'))) || {}; // 因为只存了年级id 要根据id找phaseId
      curAllowSubject = allowSubjectMap[item.phaseId] || []; // 当前年级下允许的学科
    }
    return (<RootWrapper>
      <FlexRow style={{ width: '100%', height: '100%' }}>
        {
          isChildBU ?
            (
              lessonType === 2
              ? <TestHomeworkSlider
                subjectList={subjectGradeData}
                gradeList={childGrade}
                courseSystemList={childCourses}
                subjectDictCode={subjectDictCode}
                gradeDictCode={gradeDictCode}
                courseSystemId={leftSelectTree.get('id')}
                handleSubjectChange={val => this.testChildSelectChange(val, 'subjectDictCode')}
                handleGradeChange={val => this.testChildSelectChange(val, 'gradeDictCode')}
                handleCourseClick={this.handleClickTestCourseSystem}
                loading={childLoading}
              />
              : <ChildBULeftFilter
                subjectGradeData={subjectGradeData}
                treeData={childCourses}
                currentCourse={courseSystemList}
                getChildBUCourseSystem={this.getChildBUCourseSystem}
                getChildBUCourses={this.getChildBUCourses}
                handlerSelectCourse={this.handleTreeSelect}
                selectTree={leftSelectTree}
                parentSelectChange={this.selectChange}
                selectedParams={ childBUSelectedParams }
                childSelectChange={this.childSelectChange}
                loading={childLoading}
              />
            )
            :
                <LeftListWrapper>
                  <SelectColumn>
                    <Select labelInValue value={{ key: toString(selectGrade.get('id')) || '' }} style={{ flex: 1, marginRight: 5 }} onChange={(value) => this.selectChange(value, 'selectGrade')}>
                      {gradeList.map((item) => { return isPartTimePersion && !phaseSet.has(item.get('phaseId')) ? null : <Option key={toString(item.get('id')) || ''} value={toString(item.get('id'))}>{item.get('name')}</Option> })}
                    </Select>
                    <Select labelInValue value={{ key: toString(selectSubject.get('id')) || '' }} style={{ flex: 1, marginRight: 5 }} onChange={(value) => this.selectChange(value, 'selectSubject')}>
                      {sudjectList.map((item) => { return isPartTimePersion && curAllowSubject.indexOf(item.get('id')) === -1 ? null : <Option key={toString(item.get('id')) || ''} value={toString(item.get('id'))}>{item.get('name')}</Option> })}
                    </Select>
                  </SelectColumn>
                  <SelectColumn>
                    <Select labelInValue value={{ key: toString(selectEdition.get('id') > 0 ? selectEdition.get('id') : '') || '' }} style={{ flex: 1 }} onChange={(value) => {
                      this.selectChange(value, 'selectEdition');
                    }}>
                      {editionList.map((item) => <Option key={toString(item.get('id')) || ''} value={toString(item.get('id'))}>{item.get('name')}</Option>)}
                    </Select>
                  </SelectColumn>
                  <TreeWrapper>
                    {prviewSelectObj.get('treeDataIsLoading') ? <FlexCenter>{RunLoading()}</FlexCenter> : <div>
                      {leftTreeList.count() > 0 ? <HomeworkTree
                        selectTree={leftSelectTree}
                        treeList={leftTreeList}
                        onSelect={(value, selectedKnowledge) => {
                          this.handleTreeSelect(value, selectedKnowledge);
                        }}
                      />
                        : <FlexCenter style={{ flex: 1, height: '100%', width: '100%' }}>
                          <div style={{ textAlign: 'center' }}><img role="presentation" src={emptyImg} style={{ width: 100 }} /><h5 style={{ color: '#999', textAlign: 'center' }}>没有找到相关课程体系哦</h5></div>
                        </FlexCenter>}
                    </div>}
                  </TreeWrapper>
                </LeftListWrapper>
            }
        <RightContentWrapper>
          <RightContentHeader>
            <SerachWrapper>
              <FlexRowCenter>
                <SerachItem style={{ justifyContent: 'flex-end' }}>作业难度：</SerachItem>
                <SerachItem>
                  <Select labelInValue value={{ key: toString(searchDiff) }} style={{ flex: 1 }} onChange={(value) => this.changeSearchParams(value, 'diff')}>
                    {diffList.map((item) => <Option key={toString(item.id) || ''} value={toString(item.id)}>{item.name}</Option>)}
                  </Select>
                </SerachItem>
              </FlexRowCenter>
              <SerachItem style={{ justifyContent: 'flex-end' }}>关键字：</SerachItem>
              <SerachItem>
                <Input placeholder="请输入关键字" onChange={(e) => this.changeSearchParams(e.target.value, 'keyword')}></Input>
              </SerachItem>
              <SerachItem><Button type="primary" onClick={() => dispatch(getStandhomeworkListAction())}>搜索</Button></SerachItem>
              <SerachItem>
                {
                    isChildBU ?
                      lessonType === 2 ? // 如果 lessonType 是 2，是少儿测评课作业
                        <Button
                          type="primary"
                          disabled={!prviewSelectObj.getIn(['selectTree', 'id'])}
                          onClick={() => {
                            const csName = prviewSelectObj.getIn(['selectTree', 'name']);
                            const homeworkName = `${csName}--${createHomeworkStepParams.getIn(['homeworkDiff', 'name'])}`;
                            dispatch(setCreateHomeworkStepParamsAction(createHomeworkStepParams.set('homeworkName', homeworkName)));
                            dispatch(changeHomeworkTypeAction(1));
                            dispatch(setSearchQuestionParamsAction(searchQuestionParams.set('showCreateHomeworkModal', true)));
                            dispatch(getPhaseSubjectAction(1));
                          }}
                        >
                          手动作业
                        </Button>
                        : <Button
                          type="primary" disabled={ childBUSelectedParams.getIn(['selectTree', 'level']) === 1 } onClick={() => {
                            if (childBUSelectedParams.getIn(['selectTree', 'level']) === 1) return;
                            console.log(222222, childBUSelectedParams.toJS());
                            dispatch(setCreateHomeworkStepParamsAction(createHomeworkStepParams.set('homeworkName', `${childBUSelectedParams.getIn(['selectTree', 'name']) || childBUSelectedParams.getIn(['selectTree', 'label'])}--${createHomeworkStepParams.getIn(['homeworkDiff', 'name'])}`)));
                            // dispatch(setPreviewSelectObjAction(prviewSelectObj.set(type, newSelect)));
                            dispatch(changeHomeworkTypeAction(1));
                            dispatch(setSearchQuestionParamsAction(searchQuestionParams.set('showCreateHomeworkModal', true)));
                            dispatch(getPhaseSubjectAction(1));
                          }}
                        >
                          手动作业
                        </Button> : <Button
                          type="primary" disabled={!(prviewSelectObj.getIn(['selectTree', 'level']) === 4)} onClick={() => {
                            if (!(prviewSelectObj.getIn(['selectTree', 'level']) === 4)) return;
                            dispatch(changeHomeworkTypeAction(1));
                            dispatch(setSearchQuestionParamsAction(searchQuestionParams.set('showCreateHomeworkModal', true)));
                            dispatch(getPhaseSubjectAction(1));
                          // dispatch(getAllGradeListAction());
                          }}
                        >
                          手动作业
                        </Button>
                    }
              </SerachItem>
              <SerachItem>{isSmallClass ? '' : (
                <Button
                  type="primary" disabled={!(prviewSelectObj.getIn(['selectTree', 'level']) === 4)} onClick={() => {
                    if (!(prviewSelectObj.getIn(['selectTree', 'level']) === 4)) return;
                    dispatch(changeHomeworkTypeAction(2));
                    dispatch(setSearchQuestionParamsAction(searchQuestionParams.set('showCreateHomeworkModal', true)));
                    dispatch(getPhaseSubjectAction(2));
                  }}
                    >智能作业</Button>
                  )}</SerachItem>
            </SerachWrapper>
            <p style={{ color: '#999999', textIndent: '3em', fontFamily: 'Microsoft YaHei' }}>共有符合条件作业{paperTotal}套</p>
          </RightContentHeader>
          <FlexColumn style={{ flex: 1 }}>
            {pageState.get('isLoading') ? (
              <FlexCenter style={{ flex: 1 }}><div><img role="presentation" src={loadingImg} /></div></FlexCenter>
                ) : (
                  standHomeWorkList.count() > 0 ? this.makeChoosePreViewQuestion(standHomeWorkList) : <FlexCenter style={{ flex: 1 }}>
                    <div><img role="presentation" src={emptyImg} /><h2 style={{ color: '#999', textAlign: 'center' }}>这里空空如也！</h2></div>
                  </FlexCenter>
                )}
            {paperTotal > serachParams.get('pageSize') ? <PaginationWrapper><Pagination defaultCurrent={1} total={paperTotal} current={serachParams.get('pageIndex')} defaultPageSize={serachParams.get('pageSize')} onChange={this.pageChange} /></PaginationWrapper> : ''}
          </FlexColumn>
        </RightContentWrapper>
      </FlexRow>


      {previewHomework.get('isOpen') ? <PreviewHomeWork
        properties={{
          soucre: 'standhomework',
          isOpen: previewHomework.get('isOpen'),
          homeworkMsg: previewHomework.get('homeworkDataList'),
          showAnalysis: previewHomework.get('showAnalysis'),
        }}
        methods={{
          backClick: () => {
            dispatch(setPreviewHomeworkDataListAction(fromJS({
              showAnalysis: false,
              isOpen: false,
              homeworkDataList: {},
              homeworkId: -1,
            })));
          },
          goEdit: () => {
            dispatch(changeIsReEditHomeworkAction(true));
            dispatch(editorHomeworkAction());
          },
          showAllAnalysis: (newShowAnalysis) => {
            const children = previewHomework.getIn(['homeworkDataList', 'children']);
            const newChildren = children.map((it) => it.setIn(['questionOutputDTO', 'showAnalysis'], newShowAnalysis));
            dispatch(setPreviewHomeworkDataListAction(previewHomework
              .set('showAnalysis', newShowAnalysis)
              .setIn(['homeworkDataList', 'children'], newChildren)
            ));
          },
          showItemAnalysis: (index, type) => {
            const homeworkDataList = previewHomework.get('homeworkDataList');
            const children = homeworkDataList.get('children');
            const showCount = children.filter((it) => it.getIn(['questionOutputDTO', 'showAnalysis'])).count();
            const newHomeworkDataList = homeworkDataList.setIn(['children', index, 'questionOutputDTO', 'showAnalysis'], type);
            if (type && (children.count() - showCount === 1)) {
              dispatch(setPreviewHomeworkDataListAction(previewHomework
                .set('showAnalysis', true)
                .set('homeworkDataList', newHomeworkDataList)
              ));
            } else {
              dispatch(setPreviewHomeworkDataListAction(previewHomework
                .set('showAnalysis', false)
                .set('homeworkDataList', newHomeworkDataList)
              ));
            }
          },
        }}
      /> : ''}
      {showCreateHomeworkModal ? <CreateHomeWork
        isOpen={showCreateHomeworkModal}
        classTypeCode={isChildBU ? 2 : this.props.classTypeCode}
        isChildBU={isChildBU}
        searchQuestionParams={searchQuestionParams}
        setSearchQuestionParams={(item, type) => {
          if (['selectKnowledge', 'selectPhaseSubject'].includes(type)) {
            dispatch(setSearchQuestionParamsAction(item.set('pageIndex', 1)));
          } else {
            dispatch(setSearchQuestionParamsAction(item));
          }
          if (type === 'selectPhaseSubject') {
            setTimeout(() => dispatch(getKnowledgeListAction()), 20);
          } else if (['selectKnowledge', 'pageIndex'].includes(type)) {
            setTimeout(() => dispatch(getQuestionListAction()), 20);
          }
        }}
        prviewSelectObj={prviewSelectObj}
        createHomeworkStepParams={createHomeworkStepParams}
        setCreateHomeworkStepParamsItem={(AItype, item) => dispatch(setCreateHomeworkStepParamsItemAction(AItype, item))}
        setCreateHomeworkStepParams={(item) => dispatch(setCreateHomeworkStepParamsAction(item))}
        getQuestionList={() => {
          dispatch(setSearchQuestionParamsAction(searchQuestionParams.set('pageIndex', 1)));
          setTimeout(() => dispatch(getQuestionListAction()), 30);
        }}
        saveStandHomework={this.saveStandHomework}
        initDataWhenClose={() => {
          dispatch(initDataWhenCloseAction());
        }}
        btnCanClick={btnCanClick}
        getStandhomeworkList={() => dispatch(getStandhomeworkListAction())}
        getPhaseSubject={() => dispatch(getPhaseSubjectAction())}
        getKnowledgeList={() => dispatch(getKnowledgeListAction())}
        // changeBtnCanClick={(bol) => dispatch(changeBtnCanClickAction(bol))}
        allGradeList={this.props.allGradeList}
        isReEditHomeWork={isReEditHomeWork}
        homeworkType={homeworkType}
        changeHomeworkType={(num) => dispatch(changeHomeworkTypeAction(num))}
        AIHomeworkParams={AIHomeworkParams}
        setAIHWParamsItem={(type, item) => {
          if (type === 'homeworkDiff') {
            dispatch(setAIHWParamsAction(AIHomeworkParams.set(type, item).set('homeworkName', `${AIHomeworkParams.getIn(['selectCourseSystem', 'name'])}--${item.get('name')}`)));
          } else {
            dispatch(setAIHWParamsItemAction(type, item));
          }
        }}
        setAIHWParams={(item) => dispatch(setAIHWParamsAction(item))}
        getQuestion4AIHW={() => dispatch(getQuestion4AIHWAction())}
        getQuestionType4AiHw={() => {
          setTimeout(() => {
            dispatch(getQuestionType4AiHwAction());
          }, 30);
        }}
        saveAIHomework={() => dispatch(saveAIHomeworkAction())}
        changeSortWay={(type, value) => {
          dispatch(setSearchQuestionParamsItemAction(type, value));
          setTimeout(() => {
            dispatch(getQuestionListAction());
          }, 30);
        }}
        getChangeItemDataList={(AItype) => {
          dispatch(getChangeItemDataListAction(AItype));
        }}
      /> : ''}
    </RootWrapper>);
  }
}

StandHomeWork.propTypes = {
  dispatch: PropTypes.func.isRequired,
  prviewSelectObj: PropTypes.instanceOf(immutable.Map).isRequired,
  serachParams: PropTypes.instanceOf(immutable.Map).isRequired,
  searchQuestionParams: PropTypes.instanceOf(immutable.Map).isRequired,
  createHomeworkStepParams: PropTypes.instanceOf(immutable.Map).isRequired,
  previewHomework: PropTypes.instanceOf(immutable.Map).isRequired,
  btnCanClick: PropTypes.bool.isRequired,
  allGradeList: PropTypes.instanceOf(immutable.List).isRequired,
  isReEditHomeWork: PropTypes.bool.isRequired,
  homeworkType: PropTypes.number.isRequired,
  AIHomeworkParams: PropTypes.instanceOf(immutable.Map).isRequired,
};

const mapStateToProps = createStructuredSelector({
  // StandHomeWork: makeSelectStandHomeWork(),
  prviewSelectObj: makePrviewSelectObj(),
  serachParams: makeSerachParams(),
  searchQuestionParams: makeSearchQuestionParams(),
  createHomeworkStepParams: makeCreateHomeworkStepParams(),
  btnCanClick: makeBtnCanClick(),
  previewHomework: makePreviewHomework(),
  allGradeList: makeGradeList(),
  isReEditHomeWork: makeIsReEditHomeWork(),
  homeworkType: makeHomeworkType(),
  AIHomeworkParams: makeAIHomeworkParams(),
  pageState: makePageState(),
  classTypeCode: makeClassTypeCode(),
  sliderState: makeSliderState(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StandHomeWork);
