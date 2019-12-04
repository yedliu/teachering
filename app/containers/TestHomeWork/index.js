/*
 *
 * TestHomeWork
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import Helmet from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import immutable, { fromJS } from 'immutable';
import { createStructuredSelector } from 'reselect';
import { FlexRow, FlexRowCenter, FlexColumn, FlexCenter } from 'components/FlexBox';
import { RootWrapper, PlaceHolderBox, WidthBox } from 'components/CommonFn/style';
import { toNumber, formatDate, backPhaseId } from 'components/CommonFn';
import styled, { css } from 'styled-components';
import { Icon, Modal, Pagination } from 'antd';
import HomeWorkHeader from './header';
import PreviewHomeWork from './previewHomework';
import CreateHomeWork from './createHomework';

import {
  getGradeListAction,
  changeSelectedPhaseAction,
  changeSelectedGradeAction,
  changeSelectedSubjectAction,
  changeSelectKnowledgeItemAction,
  changePreviewModalShowStateAction,
  changecreateHomeworkShowStateAction,
  changeCreateHomeworkStepAction,
  getHomeWorkSubjectDataAction,
  changeHomeworkPaperItemAcction,
  previewHomeworkAction,
  editorHomeworkAction,
  getKnowledgeTreeDataAction,
  changeIsEditorOrReviseStateAction,
  changeHomeworkTypeAction,
  changeTestTypeAction,
  setPaperIndexAction,
  getTestHomeWorkAction,
  changeSelectedTreeNodeAction,
  changekeywordAction,
  changeQuestionFistage,
  changeQuestionKind,
  changeQuestionLevel,
  changeQuestionSuggest,
  changeQuestionType,
  setHomeworkSkepAction,
  setTestPaperOneAction,
  setAlertStatesAction,
  changeSelectedTypeAction,
  changeShowAnalysisAction,
  setTestHomeworkItemAction,
  changeSelectedHomeworkSubjectItemAction,
  deleteHomeworkAction,
} from './actions';
import {
  makePhaseList,
  makeGradeList,
  makeSubjectList,
  makeSelectedPhase,
  makeSelectedGrade,
  makeSelectedSubject,
  makeTestkonwleadgeList,
  makeSelectedknowledgeItem,
  makeHomeworkMsgList,
  makePreviewModalShow,
  makeCreateModalShow,
  makeTestHomeworkItem,
  // makeHomeworkType,
  makeSelectedTestType,
  makeTestTypeList,
  // makeHomeworkStep,
  makePaperTotal,
  makePaperIndex,
  makePageSize,
  makeLoadingOver,
  makeShowAnalysis,
  //
  makeHomeworksubjectlist,
  makeSelectedSubjectItem,
  makeHomeworkStep,
  makeKnowledgeTreeDataList,
  makeSelectedType,
  makeSelectQuestionTypeList,
  makeQuestionlevellist,
  makeQuestionkindlist,
  makeFitstage,
  makeSuggeststart,
  makeSelectQuestionType,
  makeSelectedQuestionLevel,
  makeSelectedQuestionKind,
  makeSelectfitstage,
  makeSelectsuggeststart,
  makeSearchBackQuestions,
  makeHomeworkSkep,
  makePageIndex,
  makeVersionList,
  makeSelectedVersion,
  makeGradeListData,
  makeSelectedGradeData,
  makeAlertStates,
  makeIsSubmit,
  makeTestHomeworkOnepaperMsg,
  makeHomeworkType,
  makeQuestionListLoadingOver,
  makeSelectedTreeNode,
  makeTreeNodePath,
  makeKnowledgeListIsLoading,
  makeSearchParams,
} from './selectors';
// import messages from './messages';
const emptyImg = window._baseUrl.imgCdn + '2cfcc00d-8360-42c7-b371-4253fd4735cb.png';
const loadImg = window._baseUrl.imgCdn + '02f36e7d-35d2-4a79-a407-847ed60a6923.gif';

const HomeWorkWrapper = styled(FlexRow) `
  flex: 1;
  margin-top: 10px;
`;
const borderRadius = css`
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
`;
const LeftContent = styled.div`
  flex: 1;
  height: 100%;
  ${borderRadius};
  overflow: auto;
  padding: 20px 10px;
  background: #fafafa;
`;
const KonwdgeItem = styled(FlexRowCenter) `
  min-height: 30px;
  font-size: 14px;
  color: ${(props) =>  (props.index === props.selIndex ? '#2385EE' : '#999')};
  &:hover {
    color: #666;
  }
`;
const TextBox = styled.div`
  cursor: pointer;
  white-space: nowrap;
`;
const RightContent = styled.div`
  flex: 3;
  height: 100%;
  padding: 20px;
  margin-left: 20px;
  overflow-y: auto;
  ${borderRadius}
`;
const PaperMsgItem = styled(FlexColumn) `
  height: 60px;
  border-bottom: 1px solid #eee;
`;
const PaperTitleWrapper = styled(FlexRowCenter) ``;
const TitleValue = styled.span`
  font-size: 16px;
  color: #666;
  line-height: 30px;
`;
const AuthorAndCreatTime = styled.span`
  font-size: 12px;
  padding-left: 10px;
  color: #999;
`;
const PaperMsgWrapper = styled(FlexRowCenter) ``;
const QuestionCount = styled.span`
  font-size: 14px;
  color: #888;
  padding-right: 20px;
  line-height: 30px;
`;
const QuestionType = styled(QuestionCount) ``;
const ControllerWrapper = styled(FlexRowCenter) `
  color: #2385ee;
  text-decoration: underline;
  cursor: pointer;
  div {
    user-select: none;
  }
  &>div:hover {
    color: #69e;
  }
  &>div:active {
    color: #2385ee;
  }
`;
const PaginationWrapper = styled(FlexCenter) `
  height: 40px;
  padding-top: 10px;
`;

export class TestHomeWork extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.changeKnowledgeItem = this.changeKnowledgeItem.bind(this);
    this.pageChange = this.pageChange.bind(this);
  }
  componentDidMount() {
    this.props.dispatch(getGradeListAction());
    this.props.dispatch(getHomeWorkSubjectDataAction());
  }
  /**
   * 点击知识点
   */
  changeKnowledgeItem(item) {
    // console.log(item, item.toJS(), 'item -- 136');
    this.props.dispatch(changeSelectKnowledgeItemAction(fromJS({ id: item.get('id'), name: item.get('name') })));
  }
  pageChange(page) {
    this.props.dispatch(setPaperIndexAction(page));
    setTimeout(() => {
      this.props.dispatch(getTestHomeWorkAction());
    }, 30);
  }
  render() {
    // const selectedTestType = this.props.selectedTestType;
    const { dispatch, previewModalShow, selectedPhase, phaseList, selectedGrade, gradeList, selectedSubject, subjectList, selectedTestType, testTypeList, homeworksubjectlist } = this.props;
    const callback = {
      select: (value, type) => {
        const newItem = fromJS({ id: toNumber(value.key), name: value.label });
        let newSelectPhaseSubject = null;
        switch (type) {
          case 1:
            dispatch(changeSelectedPhaseAction(newItem));
            break;
          case 2:
            dispatch(changeSelectedGradeAction(newItem));
            // eslint-disable-next-line
            newSelectPhaseSubject = homeworksubjectlist.find((item) => {
              if (item.get('phaseId') === backPhaseId(newItem.get('id')) && item.get('subjectId') === selectedSubject.get('id')) {
                return item;
              }
            });
            if (newSelectPhaseSubject) dispatch(changeSelectedHomeworkSubjectItemAction(newSelectPhaseSubject));
            break;
          case 3:
            dispatch(changeSelectedSubjectAction(newItem));
            // eslint-disable-next-line
            newSelectPhaseSubject = homeworksubjectlist.find((item) => {
              if (item.get('phaseId') === backPhaseId(selectedGrade.get('id')) && item.get('subjectId') === newItem.get('id')) {
                return item;
              }
            });
            if (newSelectPhaseSubject) dispatch(changeSelectedHomeworkSubjectItemAction(newSelectPhaseSubject));
            break;
          case 4:
            dispatch(changeTestTypeAction(newItem));
            break;
          default:
            break;
        }
      },
      addPaper: (homeworkType) => {
        dispatch(changeHomeworkTypeAction(homeworkType));
        dispatch(changeQuestionType(fromJS({ id: '1', name: '选择题' })));
        // if (homeworkType === 1) {
        //   dispatch(changeQuestionType(fromJS({ id: '1', name: '选择题' })));
        // } else {
        //   dispatch(changeQuestionType(fromJS({ id: '-1', name: '全部' })));
        // }
        setTimeout(() => {
          dispatch(getKnowledgeTreeDataAction());
          dispatch(changecreateHomeworkShowStateAction(true));
        }, 30);
      },
    };

    return (
      <RootWrapper>
        <HomeWorkHeader
          data={{
            selectedOne: selectedPhase.toJS(),
            optionsList1: phaseList.toJS(),
            selectedTwo: selectedGrade.toJS(),
            optionsList2: gradeList.toJS(),
            selectedThree: selectedSubject.toJS(),
            optionsList3: subjectList.toJS(),
            selectedFour: selectedTestType.toJS(),
            optionsList4: testTypeList.toJS(),
          }}
          callback={callback}
        ></HomeWorkHeader>
        <HomeWorkWrapper>
          <LeftContent>
            {this.props.testkonwleadgeList.map((item, index) => (
              <KonwdgeItem index={item.get('id')} selIndex={this.props.selectedknowledgeItem.get('id')} key={index}>
                <Icon type="file-text" style={{ marginRight: 10 }} />
                <TextBox onClick={() => this.changeKnowledgeItem(item)}>{item.get('name')}</TextBox>
              </KonwdgeItem>
            ))}
          </LeftContent>
          <RightContent>
            {this.props.loadingOver ? <div style={{ width: '100%', height: '100%' }}>
              {this.props.homeworkMsgList.count() > 0 ? this.props.homeworkMsgList.map((item, index) => {
                return (<PaperMsgItem key={index}>
                  <PaperTitleWrapper>
                    <TitleValue>{item.get('name')}</TitleValue>
                    <AuthorAndCreatTime>{`${item.get('author')}/${formatDate('yyyy-MM-dd', new Date(item.get('createdTime')))}`}</AuthorAndCreatTime>
                  </PaperTitleWrapper>
                  <PaperMsgWrapper>
                    <QuestionCount>{`使用数量：${item.get('useCount')}`}</QuestionCount>
                    <QuestionType>{`试卷类型：${item.get('type') === 0 ? '课前测评' : '课后作业'}`}</QuestionType>
                    <PlaceHolderBox />
                    <ControllerWrapper>
                      <TextBox
                        onClick={() => {
                          dispatch(changeHomeworkPaperItemAcction(item));
                          setTimeout(() => {
                            dispatch(previewHomeworkAction());
                          }, 30);
                        }}
                      >查看详情</TextBox>
                      <WidthBox></WidthBox>
                      <TextBox
                        onClick={() => {
                          // 请求试卷
                          console.log(item.toJS(), index, 'item -- 198');
                          dispatch(changeHomeworkTypeAction(selectedTestType.get('id')));
                          dispatch(changeHomeworkPaperItemAcction(item));
                          dispatch(changeIsEditorOrReviseStateAction(1));
                          setTimeout(() => {
                            dispatch(editorHomeworkAction());
                          }, 30);
                        }}
                      >修改作业</TextBox>
                      <WidthBox></WidthBox>
                      <TextBox
                        onClick={() => {
                          console.log(item.toJS(), 'ss');
                          this.props.deleteRecord(this.props, item);
                        }}
                      > 删除作业
                      </TextBox>
                    </ControllerWrapper>
                  </PaperMsgWrapper>
                </PaperMsgItem>);
              })
                : <FlexCenter style={{ width: '100%', height: '100%' }}>
                  <div><img role="presentation" src={emptyImg} /><h2 style={{ color: '#999', textAlign: 'center' }}>这里空空如也！</h2></div>
                </FlexCenter>}
              {this.props.paperTotal > this.props.pageSize ? <PaginationWrapper><Pagination defaultCurrent={1} total={this.props.paperTotal} current={this.props.paperIndex} defaultPageSize={this.props.pageSize} onChange={this.pageChange} /></PaginationWrapper> : ''}
            </div>
              : <FlexCenter style={{ width: '100%', height: '100%' }}>
                <div><img role="presentation" src={loadImg} /></div>
              </FlexCenter>}
          </RightContent>
        </HomeWorkWrapper>
        {previewModalShow ? <PreviewHomeWork
          properties={{
            soucre: 'testhomework',
            isOpen: previewModalShow,
            homeworkMsg: this.props.testHomeworkItem,
            showAnalysis: this.props.showAnalysis,
          }}
          methods={{
            backClick: () => {
              dispatch(changePreviewModalShowStateAction(false));
              dispatch(changeIsEditorOrReviseStateAction(0));
              this.props.initMsg();
            },
            goEdit: (homeworkType) => {
              dispatch(changeHomeworkTypeAction(homeworkType));
              dispatch(changeIsEditorOrReviseStateAction(1));
              dispatch(editorHomeworkAction());
              dispatch(changeShowAnalysisAction(false));
            },
            showAllAnalysis: (type) => {
              dispatch(changeShowAnalysisAction(type));
              const testHomeworkItem = this.props.testHomeworkItem;
              const children = testHomeworkItem.get('children');
              const newChildren = children.map((it) => it.setIn(['questionOutputDTO', 'showAnalysis'], type));
              dispatch(setTestHomeworkItemAction(testHomeworkItem.set('children', newChildren)));
            },
            showItemAnalysis: (index, type) => {
              const testHomeworkItem = this.props.testHomeworkItem;
              const children = testHomeworkItem.get('children');
              const showCount = children.filter((it) => it.getIn(['questionOutputDTO', 'showAnalysis'])).count();
              if (type && (children.count() - showCount === 1)) dispatch(changeShowAnalysisAction(true));
              else dispatch(changeShowAnalysisAction(false));
              dispatch(setTestHomeworkItemAction(testHomeworkItem.setIn(['children', index, 'questionOutputDTO', 'showAnalysis'], type)));
            },
          }}
        ></PreviewHomeWork> : ''}
        <CreateHomeWork
          properties={{
            isOpen: this.props.createModalShow,
          }}
          {...this.props}
          methods={{
            changeSelectedTreeNode: this.props.changeSelectedTreeNode,
            changeCreateHomeworkStep: this.props.changeCreateHomeworkStep,
            initData: this.props.initData,
            setTestPaperOne: this.props.setTestPaperOne,
          }}
        ></CreateHomeWork>
      </RootWrapper>
    );
  }
}

TestHomeWork.propTypes = {
  dispatch: PropTypes.func.isRequired,
  phaseList: PropTypes.instanceOf(immutable.List).isRequired,  // 学段列表
  gradeList: PropTypes.instanceOf(immutable.List).isRequired,  // 年级列表
  subjectList: PropTypes.instanceOf(immutable.List).isRequired,  // 学科列表
  selectedPhase: PropTypes.instanceOf(immutable.Map).isRequired,  // 选择的学段
  selectedGrade: PropTypes.instanceOf(immutable.Map).isRequired,  // 选择的年级
  selectedSubject: PropTypes.instanceOf(immutable.Map).isRequired,  // 选择的学科
  testkonwleadgeList: PropTypes.instanceOf(immutable.List).isRequired,  // 测评课知识点
  selectedknowledgeItem: PropTypes.instanceOf(immutable.Map).isRequired,  // 选中的知识点的 index
  homeworkMsgList: PropTypes.instanceOf(immutable.List).isRequired,  // 作业列表数据
  previewModalShow: PropTypes.bool.isRequired,  // 预览作业弹框状态
  createModalShow: PropTypes.bool.isRequired,  // 布置作业弹框状态
  // homeworkStep: PropTypes.number.isRequired,  // 布置作业的进度
  // changeCreateHomeworkStep: PropTypes.func.isRequired,  // 布置作业的进度
  testHomeworkItem: PropTypes.instanceOf(immutable.Map).isRequired,  // 获取回来的试卷数据
  // homeworkType: PropTypes.number.isRequired,  // 作业类型(1: 测评课课前作业，0：测评课课中作业，2：标准作业)
  selectedTestType: PropTypes.instanceOf(immutable.Map).isRequired,  // 选中的测评课类型
  testTypeList: PropTypes.instanceOf(immutable.List).isRequired,  // 测评课类型
  paperTotal: PropTypes.number.isRequired,  // 查询到的试卷总数
  paperIndex: PropTypes.number.isRequired,  // 当前页数
  pageSize: PropTypes.number.isRequired,  // 每页数量
  loadingOver: PropTypes.bool.isRequired,  // 是否加载完成
  showAnalysis: PropTypes.bool.isRequired,  // 显示解析与答案
  homeworksubjectlist: PropTypes.instanceOf(immutable.List).isRequired,  // 学科列表
  selectedSubjectItem: PropTypes.instanceOf(immutable.Map).isRequired,  // 选中的学科
  homeworkStep: PropTypes.number.isRequired,  // 布置作业的进度
  knowledgeTreeDataList: PropTypes.instanceOf(immutable.List).isRequired,  // 树状知识点列表
  selectedType: PropTypes.instanceOf(immutable.Map).isRequired,  // 树状知识点列表
  selectQuestionTypeList: PropTypes.instanceOf(immutable.List).isRequired,  // 跟新获取题目的参数
  questionlevellist: PropTypes.instanceOf(immutable.List).isRequired,  // 跟新获取题目的参数
  questionkindlist: PropTypes.instanceOf(immutable.List).isRequired,  // 跟新获取题目的参数
  fitstage: PropTypes.instanceOf(immutable.List).isRequired,  // 跟新获取题目的参数
  suggeststart: PropTypes.instanceOf(immutable.List).isRequired,  // 跟新获取题目的参数
  selectQuestionType: PropTypes.instanceOf(immutable.Map).isRequired,  // 选择的题型
  selectedQuestionLevel: PropTypes.instanceOf(immutable.Map).isRequired,  // 选择的难度等级
  selectedQuestionKind: PropTypes.instanceOf(immutable.Map).isRequired,  // 选择的题类
  selectfitstage: PropTypes.instanceOf(immutable.Map).isRequired,  // 选择的阶段
  selectsuggeststart: PropTypes.instanceOf(immutable.Map).isRequired,  // 选择的星级
  searchBackQuestions: PropTypes.instanceOf(immutable.Map).isRequired,  // 题目数据与列表
  homeworkSkep: PropTypes.instanceOf(immutable.List).isRequired,  // 试题篮
  currentPage: PropTypes.number.isRequired,  // 当前第几页
  versionList: PropTypes.instanceOf(immutable.List).isRequired,       // 版本列表  （章节查询用）
  selectedVersion: PropTypes.instanceOf(immutable.Map).isRequired,    // 选中的版本（章节查询用）
  gradeListData: PropTypes.instanceOf(immutable.List).isRequired,     // 年级列表  （章节查询用）
  selectedGradeData: PropTypes.instanceOf(immutable.Map).isRequired,  // 选中的年级（章节查询用）
  alertStates: PropTypes.instanceOf(immutable.Map).isRequired,  // 提交弹框信息
  isSubmit: PropTypes.bool.isRequired,  // 提交弹框显示状态
  testPaperOnepaperMsg: PropTypes.instanceOf(immutable.Map).isRequired,  // 测评课试卷类型1 的信息
  homeworkType: PropTypes.number.isRequired,  // 作业类型(0: 测评课课前作业，1：测评课课中作业，2：标准作业)
  changeSelectedTreeNode: PropTypes.func.isRequired,
  changeCreateHomeworkStep: PropTypes.func.isRequired,
  initData: PropTypes.func.isRequired,
  setTestPaperOne: PropTypes.func.isRequired,
  initMsg: PropTypes.func.isRequired,
  questionListLoadingOver: PropTypes.bool.isRequired,  // 加载完成？
  selectedTreeNode: PropTypes.instanceOf(immutable.Map).isRequired,
  treeNodePath: PropTypes.instanceOf(immutable.List).isRequired,
  knowledgeListIsLoading: PropTypes.bool.isRequired,
  searchParams: PropTypes.instanceOf(immutable.Map).isRequired,
  deleteRecord: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  // TestHomeWork: makeSelectTestHomeWork(),
  phaseList: makePhaseList(),
  gradeList: makeGradeList(),
  subjectList: makeSubjectList(),
  selectedPhase: makeSelectedPhase(),
  selectedGrade: makeSelectedGrade(),
  selectedSubject: makeSelectedSubject(),
  testkonwleadgeList: makeTestkonwleadgeList(),
  selectedknowledgeItem: makeSelectedknowledgeItem(),
  homeworkMsgList: makeHomeworkMsgList(),
  previewModalShow: makePreviewModalShow(),
  createModalShow: makeCreateModalShow(),
  testHomeworkItem: makeTestHomeworkItem(),
  selectedTestType: makeSelectedTestType(),
  testTypeList: makeTestTypeList(),
  paperTotal: makePaperTotal(),
  paperIndex: makePaperIndex(),
  pageSize: makePageSize(),
  loadingOver: makeLoadingOver(),
  showAnalysis: makeShowAnalysis(),
  homeworksubjectlist: makeHomeworksubjectlist(),
  selectedSubjectItem: makeSelectedSubjectItem(),
  homeworkStep: makeHomeworkStep(),
  knowledgeTreeDataList: makeKnowledgeTreeDataList(),
  selectedType: makeSelectedType(),
  selectQuestionTypeList: makeSelectQuestionTypeList(),
  questionlevellist: makeQuestionlevellist(),
  questionkindlist: makeQuestionkindlist(),
  fitstage: makeFitstage(),
  suggeststart: makeSuggeststart(),
  selectQuestionType: makeSelectQuestionType(),
  selectedQuestionLevel: makeSelectedQuestionLevel(),
  selectedQuestionKind: makeSelectedQuestionKind(),
  selectfitstage: makeSelectfitstage(),
  selectsuggeststart: makeSelectsuggeststart(),
  searchBackQuestions: makeSearchBackQuestions(),
  homeworkSkep: makeHomeworkSkep(),
  currentPage: makePageIndex(),
  versionList: makeVersionList(),
  selectedVersion: makeSelectedVersion(),
  gradeListData: makeGradeListData(),
  selectedGradeData: makeSelectedGradeData(),
  alertStates: makeAlertStates(),
  isSubmit: makeIsSubmit(),
  testPaperOnepaperMsg: makeTestHomeworkOnepaperMsg(),
  homeworkType: makeHomeworkType(),
  questionListLoadingOver: makeQuestionListLoadingOver(),
  selectedTreeNode: makeSelectedTreeNode(),
  treeNodePath: makeTreeNodePath(),
  knowledgeListIsLoading: makeKnowledgeListIsLoading(),
  searchParams: makeSearchParams(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    changeSelectedTreeNode: (item) => dispatch(changeSelectedTreeNodeAction(item)),
    changeCreateHomeworkStep: (num) => dispatch(changeCreateHomeworkStepAction(num)),
    initData: () => {
      dispatch(changecreateHomeworkShowStateAction(false));
      dispatch(changeCreateHomeworkStepAction(1));
      dispatch(changekeywordAction(''));
      dispatch(changeQuestionFistage(fromJS({ id: '-1', name: '全部' })));
      dispatch(changeQuestionKind(fromJS({ id: '-1', name: '全部' })));
      dispatch(changeQuestionLevel(fromJS({ id: '-1', name: '全部' })));
      dispatch(changeQuestionSuggest(fromJS({ id: '-1', name: '全部' })));
      dispatch(changeQuestionType(fromJS({ id: '1', name: '单选题' })));
      dispatch(setHomeworkSkepAction(fromJS([])));
      dispatch(setTestPaperOneAction(fromJS({})));
      dispatch(setAlertStatesAction(fromJS({})));
      dispatch(changeHomeworkPaperItemAcction(fromJS({})));
      dispatch(changeSelectedTypeAction(fromJS({ id: 0, name: '按知识点选题' })));
      dispatch(changeIsEditorOrReviseStateAction(0));
      dispatch(changeShowAnalysisAction(false));
    },
    setTestPaperOne: (item) => dispatch(setTestPaperOneAction(item)),
    initMsg: () => {
      dispatch(setTestHomeworkItemAction(fromJS({})));
      dispatch(changeShowAnalysisAction(false));
      dispatch(changeHomeworkPaperItemAcction(fromJS({})));
    },
    deleteRecord(props, item) {
      const record = item.toJS();
      Modal.confirm({
        title: '删除',
        content: `确定删除作业：”${record.name}“？`,
        okText: '删除',
        cancelText: '取消',
        onOk: () => new Promise((resolve) => {
          dispatch(changeHomeworkPaperItemAcction(item));
          dispatch(deleteHomeworkAction());
          setTimeout(resolve, 800);
        }),
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TestHomeWork);
