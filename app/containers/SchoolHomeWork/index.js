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
import { toString, toNumber, formatDate } from 'components/CommonFn';
import { RootWrapper, PlaceHolderBox, WidthBox } from 'components/CommonFn/style';
import PreviewHomeWork from 'containers/TestHomeWork/previewHomework';
// import { changeBtnCanClickAction } from 'containers/LeftNavC/actions';
import { makeBtnCanClick } from 'containers/LeftNavC/selectors';
import { FlexRow, FlexRowCenter, FlexColumn, FlexCenter } from 'components/FlexBox';
import { Select, Input, Button, Pagination, Modal } from 'antd';
const emptyImg = window._baseUrl.imgCdn + '2cfcc00d-8360-42c7-b371-4253fd4735cb.png';
// import { changeAlertShowOrHideAction, setAlertStatesAction } from 'containers/LeftNavC/actions';
// import makeSelectStandHomeWork from './selectors';
// import messages from './messages';
import CreateHomeWork from './createHomeWork';
import { zmSchoolType } from 'utils/zmConfig';
// import { backDefaultKnowledge } from './common';
const loadingImg = window._baseUrl.imgCdn + '02f36e7d-35d2-4a79-a407-847ed60a6923.gif';
import {
  RightContentWrapper,
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
  // initPreviewDataAction,
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
} from './selectors';

const Option = Select.Option;

export class StandHomeWork extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.selectChange = this.selectChange.bind(this);
    this.changeSearchParams = this.changeSearchParams.bind(this);
    this.makeChoosePreViewQuestion = this.makeChoosePreViewQuestion.bind(this);
    this.pageChange = this.pageChange.bind(this);
  }
  componentWillMount() {
    // this.props.dispatch(getQuestion4AIHWAction());
  }
  componentDidMount() {
    this.props.dispatch(getGradeListAction());
    console.log('componentDidMount--school');
    // this.props.dispatch(getPhaseSubjectAction());
  }
  pageChange(page) {
    const { serachParams } = this.props;
    this.props.dispatch(setSearchParamsAction(serachParams.set('pageIndex', page)));
    setTimeout(() => {
      this.props.dispatch(getStandhomeworkListAction());
    }, 20);
  }
  selectChange(value, type) {
    const { dispatch, prviewSelectObj } = this.props;
    const newSelect = fromJS({ id: toNumber(value.key), name: value.label, level: value.level || -1 });
    dispatch(setPreviewSelectObjAction(prviewSelectObj.set(type, newSelect)));
    if (type === 'selectGrade') {
      dispatch(getSubjectListAction());
      dispatch(setAIHWParamsItemAction('grade', value.label));
    } else if (type === 'selectSubject') {
      dispatch(getEditionListAction());
      dispatch(setAIHWParamsItemAction('subject', value.label));
    } else if (type === 'selectEdition') {
      dispatch(getCourseListAction());
    }
  }
  changeSearchParams(value, type) {
    const { dispatch, serachParams } = this.props;
    if (type === 'diff' || type === 'schoolType') {
      dispatch(setSearchParamsAction(serachParams.set(type, toNumber(value.key))));
    } else {
      dispatch(setSearchParamsAction(serachParams.set(type, value)));
    }
  }

  deleteRecord(item) {
    const { dispatch, previewHomework } = this.props;
    const record = item.toJS();
    // const isSchoolType = location.search.indexOf('type=school') > -1;
    Modal.confirm({
      title: '删除',
      content: `确定删除作业：”${record.name}“？`,
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
    const { dispatch, previewHomework } = this.props;
    // const isSchoolType = location.search.indexOf('type=school') > -1;
    return (<HomeworkListWrapper>
      {standHomeWorkList.map((item, index) => (
        <HomeworkListItem key={index}>
          <FlexRowCenter style={{ height: 33 }}>
            <HomeworkTitle>{`${item.get('name')}`}</HomeworkTitle>
            <Author>{`${item.get('author')}/${formatDate('yyyy-MM-dd', new Date(item.get('dateTime')))}`}</Author>
          </FlexRowCenter>
          <FlexRowCenter style={{ height: 33 }}>
            <QuestionType>{`题目数量：${item.get('questionAmount') || 0}`}</QuestionType>
            <QuestionCount>{`使用次数：${item.get('useCount') || 0}`}</QuestionCount>
            <QuestionCount>{`答题次数：${item.get('questionAnswerCount') || 0}`}</QuestionCount>
            {/* <QuestionCount>{`预计用时：${item.get('useCount') || 0}`}</QuestionCount> */}
            {/* <QuestionCount>{`选择题:${item.get('useCount') || 0}`}</QuestionCount>
            <QuestionCount>{`填空题:${item.get('useCount') || 0}`}</QuestionCount>
            <QuestionCount>{`其他:${item.get('useCount') || 0}`}</QuestionCount> */}
            {/* <QuestionType>{`试卷类型：${item.get('type') === 1 ? '课前测评' : '课后作业'}`}</QuestionType> */}
            <PlaceHolderBox />
            <ControllerWrapper>
              <TextBox
                onClick={() => {
                  dispatch(setPreviewHomeworkDataListAction(previewHomework.set('homeworkId', item.get('id') || -1)));
                  setTimeout(() => dispatch(getPreviewHomeworkDataListAction()), 20);
                }}
              >查看详情</TextBox>
              <WidthBox></WidthBox>
              <TextBox
                onClick={() => {
                  // 请求试卷
                  dispatch(setPreviewHomeworkDataListAction(previewHomework.set('homeworkId', item.get('id') || -1)));
                  dispatch(changeIsReEditHomeworkAction(true));
                  setTimeout(() => dispatch(editorHomeworkAction()), 20);
                }}
              >修改作业</TextBox>
              <WidthBox></WidthBox>
              <TextBox
                onClick={() => {
                  this.deleteRecord(item);
                }}
              > 删除作业</TextBox>
            </ControllerWrapper>
          </FlexRowCenter>
        </HomeworkListItem>)
      )}
    </HomeworkListWrapper>);
  }
  render() {
    const {
      dispatch, prviewSelectObj, serachParams,
      searchQuestionParams, createHomeworkStepParams, btnCanClick,
      previewHomework, isReEditHomeWork, homeworkType,
      AIHomeworkParams, pageState
    } = this.props;
    console.log('pageState', pageState.toJS());
    const pageType = this.props.location.query.type; // 区分学堂作业
    const isSchoolType = pageType === 'school';
    const selectGrade = prviewSelectObj.get('selectGrade') || fromJS({});
    const selectSubject = prviewSelectObj.get('selectSubject') || fromJS({});
    // const selectEdition = prviewSelectObj.get('selectEdition') || fromJS({});
    const gradeList = prviewSelectObj.get('gradeList') || fromJS([]);
    const sudjectList = prviewSelectObj.get('sudjectList') || fromJS([]);
    // const editionList = prviewSelectObj.get('editionList') || fromJS([]);
    // const leftSelectTree = prviewSelectObj.get('selectTree') || fromJS({});
    // const leftTreeList = prviewSelectObj.get('treeList') || fromJS([]);
    const standHomeWorkList = prviewSelectObj.get('standHomeWorkList') || fromJS([]);
    // const searchDiff = serachParams.get('diff') || 4;
    const schoolType = serachParams.get('schoolType') || 4;
    const showCreateHomeworkModal = searchQuestionParams.get('showCreateHomeworkModal');
    const paperTotal = prviewSelectObj.get('paperTotal') || 0;
    return (<RootWrapper>
      <FlexRow style={{ width: '100%', height: '100%' }}>
        <RightContentWrapper>
          <RightContentHeader>
            <SerachWrapper>
              {/* 学堂作业 */}
              <FlexRowCenter>
                <SerachItem style={{ justifyContent: 'flex-end' }}>年级：</SerachItem>
                <SerachItem>
                  <Select labelInValue value={{ key: toString(selectGrade.get('id')) || '' }} style={{ flex: 1, marginRight: 5 }} onChange={(value) => this.selectChange(value, 'selectGrade')}>
                    {gradeList.map((item) => <Option key={toString(item.get('id')) || ''} value={toString(item.get('id'))}>{item.get('name')}</Option>)}
                  </Select>
                </SerachItem>
                <SerachItem style={{ justifyContent: 'flex-end' }}>学科：</SerachItem>
                <SerachItem>
                  <Select labelInValue value={{ key: toString(selectSubject.get('id')) || '' }} style={{ flex: 1, marginRight: 5 }} onChange={(value) => this.selectChange(value, 'selectSubject')}>
                    {sudjectList.map((item) => <Option key={toString(item.get('id')) || ''} value={toString(item.get('id'))}>{item.get('name')}</Option>)}
                  </Select>
                </SerachItem>
                <SerachItem style={{ justifyContent: 'flex-end' }}>类型：</SerachItem>
                <SerachItem>
                  <Select labelInValue value={{ key: toString(schoolType) }} style={{ flex: 1 }} onChange={(value) => this.changeSearchParams(value, 'schoolType')}>
                    {zmSchoolType.map(item => <Option key={item.value} value={String(item.value)}>{item.label}</Option>)}
                  </Select>
                </SerachItem>
              </FlexRowCenter>
              <SerachItem style={{ justifyContent: 'flex-end' }}>关键字：</SerachItem>
              <SerachItem>
                <Input placeholder="请输入关键字" onChange={(e) => this.changeSearchParams(e.target.value, 'keyword')}></Input>
              </SerachItem>
              <SerachItem><Button type="primary" onClick={() => dispatch(getStandhomeworkListAction())}>搜索</Button></SerachItem>
              <SerachItem><Button
                type="primary" disabled={!(prviewSelectObj.getIn(['selectTree', 'level']) === 4) && !isSchoolType} onClick={() => {
                  if (!(prviewSelectObj.getIn(['selectTree', 'level']) === 4) && !isSchoolType) return;
                  dispatch(changeHomeworkTypeAction(1));
                  dispatch(setSearchQuestionParamsAction(searchQuestionParams.set('showCreateHomeworkModal', true)));
                  dispatch(getPhaseSubjectAction(1));
                  // dispatch(getAllGradeListAction());
                }}
              >新建作业</Button></SerachItem>
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
      ></PreviewHomeWork> : ''}
      {showCreateHomeworkModal ? <CreateHomeWork
        isOpen={showCreateHomeworkModal}
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
        saveStandHomework={() => dispatch(saveStandHomeworkAction())}
        initDataWhenClose={() => dispatch(initDataWhenCloseAction())}
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
        isSchoolType={isSchoolType}
      ></CreateHomeWork> : ''}
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
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StandHomeWork);
