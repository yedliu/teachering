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
import { Select, Input, Button, Pagination, Modal, Tree,
  message } from 'antd';
const emptyImg = window._baseUrl.imgCdn + '2cfcc00d-8360-42c7-b371-4253fd4735cb.png';
import { RunLoading } from 'components/LoadingIndicator';
// import { changeAlertShowOrHideAction, setAlertStatesAction } from 'containers/LeftNavC/actions';
// import makeSelectStandHomeWork from './selectors';
// import messages from './messages';
import CreateHomeWork from './createHomeWork';
// import { backDefaultKnowledge } from './common';
import { sceneList } from './common';
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
  getCourseContent,
  changePageState,
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
import Config from 'utils/config';
import request, { getjsonoptions } from 'utils/request';

const Option = Select.Option;
const TreeNode = Tree.TreeNode;

export class StandHomeWork extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.selectChange = this.selectChange.bind(this);
    this.changeSearchParams = this.changeSearchParams.bind(this);
    this.makeChoosePreViewQuestion = this.makeChoosePreViewQuestion.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.regainSystem = this.regainSystem.bind(this);
    this.state = {};
  }
  componentWillMount() {
    // this.props.dispatch(getQuestion4AIHWAction());
  }
  componentDidMount() {
    // 如果有数据了就不要请求了
    if (this.props.prviewSelectObj.get('gradeList').count() > 1) {
      return;
    }
    this.props.dispatch(getGradeListAction());
  }
  // 重新获取课程体系
  regainSystem() {
    // 清空之前的课程
    setTimeout(() => {
      const { dispatch, prviewSelectObj } = this.props;
      const newObj = prviewSelectObj.set('courseSystemMap', fromJS({})).set('courseContentMap', fromJS({}));
      dispatch(setPreviewSelectObjAction(newObj));
    }, 2000);
  }
  pageChange(page) {
    const { serachParams } = this.props;
    this.props.dispatch(setSearchParamsAction(serachParams.set('pageIndex', page)));
    setTimeout(() => {
      this.props.dispatch(getStandhomeworkListAction());
    }, 20);
  }
  selectChange(value, type) {
    const { dispatch, prviewSelectObj, createHomeworkStepParams } = this.props;
    const newSelect = fromJS({ id: toNumber(value.key), name: value.label, level: value.level || -1 });
    if (type === 'selectGrade') {
      dispatch(setPreviewSelectObjAction(prviewSelectObj.set(type, newSelect).set('courseSystemMap', fromJS({})).set('courseContentMap', fromJS({})).set('treeDataIsLoading', true).set('selectTree', null).set('standHomeWorkList', fromJS([]))));
      dispatch(getSubjectListAction());
      dispatch(setAIHWParamsItemAction('grade', value.label));
    } else if (type === 'selectSubject') {
      dispatch(setPreviewSelectObjAction(prviewSelectObj.set(type, newSelect).set('courseSystemMap', fromJS({})).set('courseContentMap', fromJS({})).set('treeDataIsLoading', true).set('selectTree', null).set('standHomeWorkList', fromJS([]))));
      dispatch(getEditionListAction());
      dispatch(setAIHWParamsItemAction('subject', value.label));
    } else if (type === 'selectEdition') {
      dispatch(setPreviewSelectObjAction(prviewSelectObj.set(type, newSelect).set('courseSystemMap', fromJS({})).set('courseContentMap', fromJS({})).set('treeDataIsLoading', true).set('selectTree', null).set('standHomeWorkList', fromJS([]))));
      setTimeout(() => {
        // 重新取数据 防止用旧数据
        const prviewSelectChange = this.props.prviewSelectObj;
        dispatch(setPreviewSelectObjAction(prviewSelectChange.set('selectTree', null).set('treeDataIsLoading', false)));
      }, 500);
      // dispatch(getCourseListAction());
    } else {
      dispatch(setPreviewSelectObjAction(prviewSelectObj.set(type, newSelect)));
    }
    // 清空之前选的
    dispatch(setCreateHomeworkStepParamsAction(createHomeworkStepParams.set('lccId', '').set('lcsId', '').set('homeworkName', '')));
  }
  changeSearchParams(value, type) {
    const { dispatch, serachParams } = this.props;
    dispatch(setSearchParamsAction(serachParams.set(type, value.key)));
    dispatch(getStandhomeworkListAction());
  }

  deleteRecord(item) {
    const { dispatch, previewHomework } = this.props;
    const record = item.toJS();
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
            <QuestionCount>{`适用场景：${String(item.get('applicableScene')) === '1' ? '同步作业' : '阶段测评'}`}</QuestionCount>
            {/* <QuestionCount>{`预计用时：${item.get('useCount') || 0}`}</QuestionCount> */}
            {/* <QuestionCount>{`选择题:${item.get('useCount') || 0}`}</QuestionCount>
            <QuestionCount>{`填空题:${item.get('useCount') || 0}`}</QuestionCount>
            <QuestionCount>{`其他:${item.get('useCount') || 0}`}</QuestionCount> */}
            {/* <QuestionType>{`试卷类型：${item.get('type') === 1 ? '课前测评' : '课后作业'}`}</QuestionType> */}
            <PlaceHolderBox />
            <ControllerWrapper>
              <TextBox onClick={() => this.printHomework(item.get('id'))}>导出作业</TextBox>
              <WidthBox></WidthBox>
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

  printHomework = (id) => {
    const requestURL = `${Config.tklink}/api/bigClazzStandardHomework/${id}`;
    request(requestURL, getjsonoptions()).then(res => {
      const data = (res.data || {}).bigClazzStandardHomeworkQuestionDTOList || [];
      if (data.length === 0) {
        message.error('试卷数据异常');
        return;
      }
      const quesitonIdList = data.map((item) => item.questionId);
      window.open(`/tr/questionPrint?ids=${quesitonIdList.join(',')}`);
    });
  }

  render() { // eslint-disable-line
    const {
      dispatch, prviewSelectObj, serachParams,
      searchQuestionParams, createHomeworkStepParams, btnCanClick,
      previewHomework, isReEditHomeWork, homeworkType,
      AIHomeworkParams, pageState
    } = this.props;
    let sceneListWithAll = sceneList.unshift(fromJS({ id: '-1', name: '全部' }));
    // console.log('createHomeworkStepParams', createHomeworkStepParams.toJS());
    const selectGrade = prviewSelectObj.get('selectGrade') || fromJS({});
    const selectSubject = prviewSelectObj.get('selectSubject') || fromJS({});
    const selectEdition = prviewSelectObj.get('selectEdition') || fromJS({});
    // console.log('prviewSelectObj', prviewSelectObj.toJS());
    const termList = prviewSelectObj.get('termList') || fromJS({}); // 学期
    const courseTypeList = prviewSelectObj.get('courseTypeList') || fromJS({}); // 课程类型
    const courseContentMap = prviewSelectObj.get('courseContentMap') || fromJS({}); // 课程内容
    const courseSystemMap = prviewSelectObj.get('courseSystemMap') || fromJS({});// 课程体系
    const gradeList = prviewSelectObj.get('gradeList') || fromJS([]);
    const sudjectList = prviewSelectObj.get('sudjectList') || fromJS([]);
    const editionList = prviewSelectObj.get('editionList') || fromJS([]);
    // const leftSelectTree = prviewSelectObj.get('selectTree') || fromJS({});
    const standHomeWorkList = prviewSelectObj.get('standHomeWorkList') || fromJS([]);
    const showCreateHomeworkModal = searchQuestionParams.get('showCreateHomeworkModal');
    const paperTotal = prviewSelectObj.get('paperTotal') || 0;
    // console.log('courseSystemMap', courseSystemMap.toJS());
    // console.log('courseContentMap', courseContentMap.toJS());
    // 解析字符串
    const findValue = (str) => {
      let term = '';
      let course = '';
      let content = '';
      const ixCourse = str.indexOf('course');
      if (ixCourse > -1) {
        term = str.substring(4, ixCourse);
        str = str.substr(ixCourse); // eslint-disable-line
        const ixContent = str.indexOf('content');
        if (ixContent > -1) {
          course = str.substring(6, ixContent);
          str = str.substr(ixContent); // eslint-disable-line
          content = str.substring(7);
        } else {
          course = str.substr(6);
        }
      } else {
        term = str.substr(4);
      }
      return {
        term: term,
        course: course,
        content: content
      };
    };
    return (<RootWrapper>
      <FlexRow style={{ width: '100%', height: '100%' }}>
        <LeftListWrapper>
          <SelectColumn>
            <Select labelInValue value={{ key: toString(selectGrade.get('id')) || '' }} style={{ flex: 1, marginRight: 5 }} onChange={(value) => this.selectChange(value, 'selectGrade')}>
              {gradeList.map((item) => <Option key={toString(item.get('id')) || ''} value={toString(item.get('id'))}>{item.get('name')}</Option>)}
            </Select>
            <Select labelInValue value={{ key: toString(selectSubject.get('id')) || '' }} style={{ flex: 1, marginRight: 5 }} onChange={(value) => this.selectChange(value, 'selectSubject')}>
              {sudjectList.map((item) => <Option key={toString(item.get('id')) || ''} value={toString(item.get('id'))}>{item.get('name')}</Option>)}
            </Select>
          </SelectColumn>
          <SelectColumn>
            <Select labelInValue value={{ key: toString(selectEdition.get('id')) || '' }} style={{ flex: 1, marginRight: 5 }} onChange={(value) => this.selectChange(value, 'selectEdition')}>
              {editionList.map((item) => <Option key={toString(item.get('id')) || ''} value={toString(item.get('id'))}>{item.get('name')}</Option>)}
            </Select>
          </SelectColumn>
          {/* <SelectColumn>
            <Input placeholder='请输入课程体系名称' style={{ flex: 1, marginRight: 5 }} />
          </SelectColumn> */}
          <TreeWrapper>
            {prviewSelectObj.get('treeDataIsLoading') ? <FlexCenter>{RunLoading()}</FlexCenter> : <div>
              {termList.count() > 0 ? <Tree
                showLine
                defaultExpandedKeys={[toString(pageState.get('selectTreeKey')) || '-1']}
                selectedKeys={[toString(pageState.get('selectTreeKey')) || '-1']}
                onExpand={(value, selected) => {
                  // console.log('selected',value, selected);
                  if (selected.expanded) {
                    const key = selected.node.props.eventKey;
                    const data = findValue(key);
                    if (data.course) {
                      if (data.content) {
                        // 获取课程体系
                        dispatch(getCourseListAction(data.content));
                      } else {
                        // 获取courseContent
                        dispatch(getCourseContent(data.term, data.course));
                      }
                    }
                  }
                }}
                onSelect={(value, selected) => {
                  // console.log('终于选取拉',value, selected);
                  if (!selected.selected) return;
                  const key = value[0] || '';
                  // this.setState({
                  //   selectTree: key
                  // })
                  dispatch(changePageState('selectTreeKey', key));
                  if (key.indexOf('system') > -1) {
                    // 选取的课程体系
                    const name = selected.node.props.title;
                    const lccId = key.substring(7, key.indexOf('system'));
                    const lcsId = key.substr(key.indexOf('system') + 6);
                    this.selectChange({ level: 4 }, 'selectTree');
                    // dispatch(setSearchQuestionParamsAction(searchQuestionParams.set('selectCourseSystemPath', fromJS(value.path || []))));
                    dispatch(setCreateHomeworkStepParamsAction(createHomeworkStepParams.set('homeworkName', name).set('lcsId', lcsId).set('lccId', lccId)));
                    dispatch(setAIHWParamsAction(AIHomeworkParams
                      .set('homeworkName', name)
                      .set('selectCourseSystem', lcsId)));
                  } else {
                    // 清空课程体系相关数据
                    this.selectChange({}, 'selectTree');
                    dispatch(setAIHWParamsAction(AIHomeworkParams
                      .set('homeworkName', '')
                      .set('selectCourseSystem', '')));
                    if (key.indexOf('content') > -1) {
                      // 选取的课程内容
                      const lccId = key.substr(key.indexOf('content') + 7);
                      dispatch(setCreateHomeworkStepParamsAction(createHomeworkStepParams.set('lccId', lccId).set('lcsId', '').set('homeworkName', '')));
                    } else if (!key) {
                      // 什么都没选
                      dispatch(setCreateHomeworkStepParamsAction(createHomeworkStepParams.set('lccId', '').set('lcsId', '').set('homeworkName', '')));
                    }
                  }
                  dispatch(getStandhomeworkListAction());
                }}
              >
                {/* 第一层 */}
                {termList.map((term, index1) => (
                  <TreeNode selectable={false} title={term.get('value')} key={`term${term.get('code')}`}>
                    {/* 第二层 */}
                    {courseTypeList.map((course, index2) => (
                      <TreeNode selectable={false} title={course.get('value')} key={`term${term.get('code')}course${course.get('code')}`}>
                        {/* 第三层 */}
                        {courseContentMap.get(`term${term.get('code')}course${course.get('code')}`) && courseContentMap.get(`term${term.get('code')}course${course.get('code')}`).count() > 0 ? (
                          courseContentMap.get(`term${term.get('code')}course${course.get('code')}`).map(content => (
                            <TreeNode title={content.get('name')} key={`term${term.get('code')}course${course.get('code')}content${content.get('id')}`}>
                              {/* 第四层 */}
                              {courseSystemMap.get(String(content.get('id'))) && courseSystemMap.get(String(content.get('id'))).count() > 0 ? (
                                courseSystemMap.get(String(content.get('id'))).map(system => { // eslint-disable-line
                                  return (
                                    <TreeNode title={system.get('name')} key={`content${content.get('id')}system${system.get('id')}`}>
                                    </TreeNode>
                                  );
                                })
                              ) : <TreeNode disabled={true} title="暂无课程体系" key={`term${term.get('code')}course${course.get('code')}content${content.get('id')}loading`} />}
                            </TreeNode>
                          ))
                        ) : <TreeNode disabled={true} title="暂无课程内容" key={`term${term.get('code')}course${course.get('code')}loading`} />}
                      </TreeNode>
                    ))}
                  </TreeNode>
                ))}
              </Tree>
                : <FlexCenter style={{ flex: 1, height: '100%', width: '100%' }}>
                  <div style={{ textAlign: 'center' }}><img role="presentation" src={emptyImg} style={{ width: 100 }} /><h5 style={{ color: '#999', textAlign: 'center' }}>没有找到相关课程体系哦</h5></div>
                </FlexCenter>}
            </div>}
          </TreeWrapper>
        </LeftListWrapper>
        <RightContentWrapper>
          <RightContentHeader>
            <SerachWrapper>
              <FlexRowCenter>
                <SerachItem style={{ justifyContent: 'flex-end' }}>适用场景：</SerachItem>
                <SerachItem>
                  <Select labelInValue value={{ key: serachParams.get('scene') }} style={{ flex: 1 }} onChange={(value) => this.changeSearchParams(value, 'scene')}>
                    {sceneListWithAll.map((item) => <Option key={item.get('id')} value={item.get('id')}>{item.get('name')}</Option>)}
                  </Select>
                </SerachItem>
              </FlexRowCenter>
              <SerachItem style={{ justifyContent: 'flex-end' }}>关键字：</SerachItem>
              <SerachItem>
                <Input placeholder="请输入关键字" onChange={(e) => dispatch(setSearchParamsAction(serachParams.set('keyword', e.target.value)))}></Input>
              </SerachItem>
              <SerachItem><Button type="primary" onClick={() => dispatch(getStandhomeworkListAction())}>搜索</Button></SerachItem>
              <SerachItem><Button
                title="请先选择对应的课程体系"
                type="primary" disabled={!(prviewSelectObj.getIn(['selectTree', 'level']) === 4)} onClick={() => {
                  if (!(prviewSelectObj.getIn(['selectTree', 'level']) === 4)) return;
                  // 如果两个都有了 就不要再建了
                  const typeList = [];
                  standHomeWorkList.map(it => { // eslint-disable-line
                    typeList.push(it.get('applicableScene'));
                  });
                  if (typeList.includes(1) && typeList.includes(2)) {
                    message.info('该课程体系下同步和测评作业已达上限');
                    return;
                  } else if (typeList.includes(1)) {
                    dispatch(setCreateHomeworkStepParamsAction(createHomeworkStepParams.set('homeworkScene', fromJS({ id: '2' }))));
                  } else if (typeList.includes(2)) {
                    dispatch(setCreateHomeworkStepParamsAction(createHomeworkStepParams.set('homeworkScene', fromJS({ id: '1' }))));
                  } else {
                    dispatch(setCreateHomeworkStepParamsAction(createHomeworkStepParams.set('homeworkScene', fromJS({}))));
                  }
                  dispatch(changeHomeworkTypeAction(1));
                  dispatch(setSearchQuestionParamsAction(searchQuestionParams.set('showCreateHomeworkModal', true)));
                  dispatch(getPhaseSubjectAction(1));
                  // dispatch(getAllGradeListAction());
                }}
              >新建作业</Button></SerachItem>
              {/* prviewSelectObj.getIn(['selectTree', 'level']) === 4 ? '' : <span style={{color: 'red'}}>请先选择对应的课程体系</span> */}
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
