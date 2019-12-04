/*
 *
 * ErrorCorrectManagement
 *
 */
/* eslint-disable */
import React, {
  PropTypes
} from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { createStructuredSelector } from 'reselect';

import styled from 'styled-components';
import {
  Form,
  Select,
  Row,
  Col,
  Input,
  Button,
  Popconfirm,
  DatePicker,
  Pagination,
  Tooltip,
  Icon
} from 'antd';
import {
  FlexRowCenter,
} from 'components/FlexBox';
const Option = Select.Option;
import { OriginA } from 'components/Button/A';
import PreviewImg from './PreviewImg';
const loading = window._baseUrl.imgCdn + '5e7e43aa-c368-48d4-b0f5-156f913014d9.svg';
const partloading = window._baseUrl.imgCdn + '4e6f3741-6c1f-404a-9073-a31b6a975053.svg';
const emptyImg = window._baseUrl.imgCdn + '2cfcc00d-8360-42c7-b371-4253fd4735cb.png';

import {
  initAction,
  setSelectFilter,
  initSelectFilter,
  goSearch,
  changePageState,
  adoptMessage,
  finish,
  setPermissionSubjects,
  getSourceList,
  getRoleList,
} from './actions';
import makeSelectErrorCorrectManagement, {
  makeSelectFilterList,
  makeSelectSelectFilter,
  makeSelectQuestionStatistics,
  makeSelectPageState,
  makeSelectQuestionList
} from './selectors';
import QuestionComponent from './questionComponent';
import { timestampToDate } from 'components/CommonFn';
import { AppLocalStorage } from 'utils/localStorage';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { browserHistory } from 'react-router';
moment.locale('zh-cn');

// const { MonthPicker, RangePicker } = DatePicker;

const Loading = styled.div`
  background: url(${loading});
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  width: 100px;
  height: 100px;
  background-size: 100% 100%;
  top: 0;
  bottom: 0;
`;
const PartLoading = styled.div`
  background: url(${partloading});
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  width: 25px;
  height: 25px;
  background-size: 100% 100%;
  top: 0;
  bottom: 0;
`;

const EmptyImg = styled.div`
  background: url(${emptyImg});
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  width: 100px;
  height: 100px;
  background-size: 100% 100%;
  top: 0;
  bottom: 0;
  .text {
    position: absolute;
    bottom: -25px;
    left: 0;
    right: 0;
    text-align: center;
  }
`;

const PrimaryOriginA = styled(OriginA)``;
const RootWrapper = styled.div`
  padding: 10px;
  background: white;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
const HeaderFilter = styled.div`
  padding: 10px;
`;
const FilterItem = styled(FlexRowCenter)`
  margin: 10px 0;
  label {
    margin-right: 5px;
    white-space: nowrap;
  }
`;
const BodyWrapper = styled.div`
  font-size: 15px;
  flex: 1;
  overflow: hidden;
  padding: 10px;
  .header {
    border-bottom: 1px solid grey;
    font-size: 17px;
    font-weight: 700;
    b {
      color: red;
    }
    span{
      font-size: 14px;
    }
  }
  .body {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
`;
const BodyMenu = styled(FlexRowCenter)`
  margin: 10px 5px;
  border-radius: 5px;
  border-right: none;
`;
const MenuItem = styled.div`
  color: white;
  flex-grow: 1;
  text-align: center;
  padding: 5px;
  font-size: ${props => props.fontSize || 16}px;
  width: ${props => (props.minWidth ? `${props.minWidth}px` : '10vw')};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const QuestionItem = styled.div`
  border: 2px solid #ccc;
  margin-bottom: 30px;
`;
const QuestionHeader = styled(FlexRowCenter)`
  justify-content: space-between;
  padding: 5px;
  border-bottom: 1px solid #eee;
  border-right: 1px solid #eee;
  background: white;
`;
const QuestionContent = styled.div`
  position: relative;
  padding: 5px;
  border-bottom: 1px solid #eee;
  border-right: 1px solid #eee;
  background: white;
  min-height: 50px;
`;
const ErrorList = styled.div``;
const ErrorItem = styled(FlexRowCenter)`
  background: white;
  flex: 1;
`;
const MenuListItem = styled(MenuItem)`
  border: 1px solid #eee;
  color: #666666;
  font-size: 14px;
  ${props => (props.status == '3' ? 'background: #f04134; color: white;' : '')};
  ${props => (props.status == '2' ? 'background: #00a854; color: white;' : '')};
`;
const BodyList = styled.div`
  position: relative;
  flex: 1;
  overflow: auto;
  padding: 5px;
`;
const DotDiv = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: red;
  margin: 0 5px;
  ${props => (props.show ? 'display: block' : 'display: none')}
`;
const QuestionResource = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 30%;
  color: rgb(179, 77, 16);
  &:hover {
    cursor: pointer;
  }
`;

const menuList = [
  { key: 'presentUser', value: '纠错人' },
  { key: 'presentTime', value: '提交时间' },
  { key: 'correctionType', value: '错误类型' },
  { key: 'correctionDesc', value: '错误描述' },
  { key: 'images', value: '错误截图' },
  { key: 'stats', value: '处理操作' }
];
const finishMenuList = [
  { key: 'presentUser', value: '纠错人' },
  { key: 'presentTime', value: '提交时间' },
  { key: 'correctionType', value: '错误类型' },
  { key: 'correctionDesc', value: '错误描述' },
  { key: 'images', value: '错误截图' },
  { key: 'handleUser', value: '处理人' },
  { key: 'handleTime', value: '处理时间' },
  { key: 'stats', value: '处理结果' }
];
const adoptEnum = {
  1: '未处理',
  2: '采纳',
  3: '不采纳'
};

export class ErrorCorrectManagement extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.getFields = this.getFields.bind(this);
    this.filterChange = this.filterChange.bind(this);
    this.go = this.go.bind(this);
    this.finish = this.finish.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.state = {
      endOpen: false,
    };
  }
  componentDidMount() {
    const {
      dispatch,
      location,
    } = this.props;
    const { state = {},  query = {}} = location;
    const { correctionId } = query;
    const { examPaperId } = state;
    if (correctionId) {
      dispatch(setSelectFilter('correctionId', correctionId));
    }
    if (!examPaperId) {
      // dispatch(getSubjectList()); // 获取学科
      // dispatch(getPhaseList()); // 获取学段
      dispatch(getSourceList());
      // 根据权限设置能选学科学段
      const permissionSubjects = AppLocalStorage.getUserInfo().phaseSubjectList;
      permissionSubjects.unshift({
        id: -1,
        name: '全部'
      });
      console.log('学科权限', permissionSubjects);
      dispatch(setPermissionSubjects(fromJS(permissionSubjects)));
    }
    console.log('selectFilter', examPaperId);
    dispatch(setSelectFilter('examPaperId', examPaperId));
    dispatch(getRoleList());
    dispatch(goSearch());
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(initAction());
  }
  go() {
    const { dispatch } = this.props;
    // 重置correctionId，只有第一次进入页面查询才传correctionId
    dispatch(setSelectFilter('correctionId', '-1'));
    dispatch(changePageState('isLoading', true));
    dispatch(goSearch());
  }

  filterChange(key, e) {
    this.props.dispatch(setSelectFilter(key, e));
    if (key == 'status') {
      // 状态改变时 把名字和时间清空
      this.props.dispatch(setSelectFilter('startTime', null));
      this.props.dispatch(setSelectFilter('endTime', null));
      this.props.dispatch(setSelectFilter('name', ''));
      this.props.dispatch(setSelectFilter('adoptStats', '2'));
    }
    if (!['name', 'startTime', 'endTime'].includes(key)) {
      this.props.dispatch(changePageState('pageIndex', 1));
      this.go();
    }
  }

  handleReset = () => {
    const { dispatch } = this.props;
    dispatch(initSelectFilter());
    dispatch(setSelectFilter('phase', '-1'));
    dispatch(setSelectFilter('subjects', '-1'));
    dispatch(setSelectFilter('source', '-1'));
    dispatch(setSelectFilter('examPaperId', null));
    this.go();
  };

  disabledStartDate = startTime => {
    const endTime = this.props.selectFilter.get('endTime');
    if (!startTime || !endTime) {
      return false;
    }
    return startTime.valueOf() > endTime.valueOf();
  };

  disabledEndDate = endTime => {
    const startTime = this.props.selectFilter.get('startTime');
    if (!endTime || !startTime) {
      return false;
    }
    return endTime.valueOf() <= startTime.valueOf();
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };

  // 渲染筛选组件
  getFields() {
    const { filterList, selectFilter } = this.props;
    const finished = selectFilter.get('status') == 2;
    const children = [];
    filterList.map((filter, i) => {
      const key = filter.get('key');
      const name = filter.get('name');
      const values = filter.get('values');
      const isP = key == 'permissionSubjects';
      children.push(
        <Col lg={4} key={key}>
          <FilterItem>
            <label>{name}:</label>
            <Select
              style={{ width: 150 }}
              value={selectFilter.get(key)}
              onChange={e => {
                if (isP) {
                  // 如果是科目的话要把phase和subjects设置好
                  let selectSbject = {};
                  values &&
                    values.toJS().some(v => {
                      if (v.id == e) {
                        selectSbject = v;
                        return true;
                      }
                      return false;
                    });
                  this.filterChange('phase', selectSbject.phaseId || '-1');
                  this.filterChange('subjects', selectSbject.subjectId || '-1');
                }
                this.filterChange(key, e);
              }}
            >
              {values.map(v => (
                <Option
                  value={isP ? String(v.get('id')) : v.get('value')}
                  key={isP ? v.get('id') : v.get('value')}
                >
                  {isP ? v.get('name') : v.get('label')}
                </Option>
              ))}
            </Select>
          </FilterItem>
        </Col>
      );
    });
    if (finished) {
      const { adoptStats, name, startTime, endTime } = selectFilter.toJS();
      const { endOpen } = this.state;
      // 按是否采纳搜索
      children.push(
        <Col lg={4} key="adoptStats">
          <FilterItem>
            <label>处理结果:</label>
            <Select
              value={adoptStats}
              onChange={e => {
                this.filterChange('adoptStats', e);
              }}
            >
              <Option value="">全部</Option>
              <Option value="2">采纳</Option>
              <Option value="3">不采纳</Option>
            </Select>
          </FilterItem>
        </Col>
      );
      // 按姓名搜索
      children.push(
        <Col lg={4} key="name">
          <FilterItem>
            <label>姓名:</label>
            <Input
              placeholder="请输入处理人姓名"
              value={name}
              onChange={e => {
                this.filterChange('name', e.target.value);
              }}
            />
          </FilterItem>
        </Col>
      );
      // 按时间搜索
      children.push(
        <Col lg={8} key="datePicker">
          <FilterItem>
            <label>处理时间:</label>
            <DatePicker
              style={{ marginRight: 10 }}
              disabledDate={this.disabledStartDate}
              format="YYYY-MM-DD"
              value={startTime}
              placeholder="起始时间"
              onChange={e => {
                this.filterChange('startTime', e);
              }}
              onOpenChange={this.handleStartOpenChange}
            />
            <DatePicker
              disabledDate={this.disabledEndDate}
              format="YYYY-MM-DD"
              value={endTime}
              placeholder="结束时间"
              onChange={e => {
                this.filterChange('endTime', e);
              }}
              open={endOpen}
              onOpenChange={this.handleEndOpenChange}
            />
          </FilterItem>
        </Col>
      );
    }
    return children;
  }

  showImg = images => {
    this.setState({
      showImg: !this.state.showImg,
      images: images || []
    });
  };

  finish(e) {
    this.props.dispatch(finish(e));
  }

  pageChange(e) {
    const { dispatch } = this.props;
    dispatch(changePageState('pageIndex', e));
    this.go();
  }
  handleClose = () => {
    browserHistory.push({
      pathname: '/tr/papermanagement'
    });
  }

  render() {
    const {
      dispatch,
      selectFilter,
      questionStatistics,
      pageState,
      filterList,
      questionList,
    //   permissionSubjects
    location
    } = this.props;
    const { state = {}} = location;
    const { examPaperId } = state;
    const {
      showImg,
      images,
    } = this.state;
    // console.log('questionList', questionList.toJS());
    // status 1 未处理 2 已处理
    const status = Number(selectFilter.get('status'));
    const unFinished = status === 1;
    // const finished = status === 2;
    const isQueryDataByCorrectionId = selectFilter.get('correctionId') > 0;
    const renderQuestionResource = (queList) => (
      <span>关联作业：
        {queList.map((homeWork, i) => {
          return (
            <span key={`${homeWork}${i}`}>
              {
                    `${homeWork}; `
                }
            </span>
          );
        })}
      </span>
    );
    // const renderQuestionResource = (queList) => {
    //     console.log(queList)
    // }
    return (
      <RootWrapper>
        {showImg ? <PreviewImg images={images} close={this.showImg} /> : ''}
        {
          examPaperId ? <div onClick={this.handleClose}><Icon style={{ float: 'right', cursor: 'pointer', fontSize: '20px' }} type="close" /></div> : <HeaderFilter >
            <Form
              className="ant-advanced-search-form"
              onSubmit={this.handleSearch}
          >
              <Row gutter={40} align="middle" type="flex">
                {this.getFields()}
                <Col lg={4} style={{ display: 'flex' }}>
                  <Button type="primary" onClick={this.go}>
                  查询
                </Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                  重置筛选
                </Button>
                </Col>
              </Row>
            </Form>
          </HeaderFilter>}
        <BodyWrapper>
          <div className="header">
            共有符合条件的题目{' '}
            <b>{questionStatistics.getIn(['page', 'total']) || 0}</b> 道，纠错信息{' '}
            <b>{questionStatistics.get('num') || 0}</b> 条,
            {examPaperId ? (<span style={{ fontSize: '17px' }}>已处理 <b>{questionStatistics.get('handleNum') || 0}</b> 条, 未处理 <b>{questionStatistics.get('unHandleNum') || 0}</b> 条。</span>) : ''}
            <span>如需删除题目，请到题目管理页面通过题目ID查找并删除</span>
          </div>
          <div className="body">
            <BodyMenu
              style={{
                marginRight: questionList.count() > 3 ? 18 : 5,
                background: '#bfbfbf'
              }}
            >
              {(unFinished ? menuList : finishMenuList).map(it => (
                <MenuItem
                  key={it.key}
                  minWidth={it.key == 'correctionDesc' ? '' : ''}
                >
                  {it.value}
                </MenuItem>
              ))}
            </BodyMenu>
            <BodyList>
              {pageState.get('isLoading') ? (
                <Loading />
              ) : questionList.count() > 0 ? (
                questionList.map((qq, qIndex) => {
                  const correntions = qq.get('questionCorrentions');
                  const question = qq.get('questionOutputDTO');
                  const homeWorkList = qq.get('homeWorkNameList') || fromJS([]);
                  // 是否处理完
                  const isHandleAll = qq
                    .get('questionCorrentions')
                    .every(it => it.get('adoptStats') != '1');
                  // 是否已处理
                  const isFinished = qq.get('handleStats') == '2';
                  return (
                    <QuestionItem key={question.get('id') + String(qIndex)}>
                      <QuestionHeader className="QuestionHeader">
                        <div style={{ fontWeight: 700 }}>
                          题目ID: {question.get('id')}
                          {question.get('deleted') ? (
                            <span style={{ color: 'red' }}>
                              {' '}
                              ( 此题已被删除 ){' '}
                            </span>
                          ) : (
                            ''
                          )}
                        </div>
                        {
                            (homeWorkList.count() > 0)
                            ? <QuestionResource
                              title={homeWorkList.join('; ')}
                                >
                              {
                                    renderQuestionResource(homeWorkList)
                                }
                            </QuestionResource>
                            : ''
                        }
                        <div style={{ display: isFinished ? 'flex' : 'none' }} />
                        <FlexRowCenter
                          style={{ display: isFinished ? 'none' : 'flex' }}
                        >
                          <DotDiv show={isHandleAll} />
                          <Popconfirm
                            placement="topLeft"
                            title={'确认处理完成吗？'}
                            onConfirm={() => {
                              this.finish(qq.toJS());
                            }}
                            okText="确认"
                            cancelText="取消"
                          >
                            <Button
                              type="primary"
                              disabled={isHandleAll ? false : true}
                              title="当所有纠错信息都处理后方可点击"
                            >
                              处理完成
                            </Button>
                          </Popconfirm>
                        </FlexRowCenter>
                        {/* {isFinished ? <div style={{ fontWeight: 700 }}>处理人：{qq.get('handleUserName')} | 处理时间：{timestampToDate(qq.get('handleTime'), true)}</div> : ''} */}
                      </QuestionHeader>
                      <QuestionContent>
                        {pageState.get('curQuestionLiading') ==
                        question.get('id') ? (
                          <PartLoading />
                        ) : (
                          <QuestionComponent
                            dispatch={dispatch}
                            question={question}
                            go={() => {
                              dispatch(goSearch());
                            }}
                          />
                        )}
                      </QuestionContent>
                      <ErrorList>
                        {correntions.toJS().map((it, index) => {
                          // 图片list
                          const picList = [];
                          for (let i = 1; i < 6; i++) {
                            if (it[`picUrl${i}`]) {
                              picList.push(it[`picUrl${i}`]);
                            }
                          }
                          return (
                            <div key={it.id}>
                              {pageState.get('curCorrentionLoading') ==
                              it.id ? (
                                <PartLoading />
                              ) : (
                                <ErrorItem>
                                  <MenuListItem>
                                    {it.presentUserName}
                                  </MenuListItem>
                                  <MenuListItem>
                                    {timestampToDate(it.presentTime, true, true)}
                                  </MenuListItem>
                                  <MenuListItem>
                                    {filterList.getIn([
                                      2,
                                      'values',
                                      Number(it.correctionType),
                                      'label'
                                    ])}
                                  </MenuListItem>
                                  <Tooltip
                                    mouseLeaveDelay={0.05}
                                    overlayStyle={{ wordBreak: 'break-word' }}
                                    placement="top"
                                    title={it.correctionDesc}
                                  >
                                    <MenuListItem type="detail">
                                      {it.correctionDesc && it.correctionDesc.replace(
                                        /^\s+|\s+$/gm,
                                        ''
                                      )
                                        ? it.correctionDesc
                                        : '-'}
                                    </MenuListItem>
                                  </Tooltip>
                                  <MenuListItem>
                                    {picList.length > 0 ? (
                                      <OriginA
                                        onClick={() => {
                                          this.showImg(picList);
                                        }}
                                      >
                                        查看截图
                                      </OriginA>
                                    ) : (
                                      '无截图'
                                    )}
                                  </MenuListItem>
                                  {isFinished ? (
                                    <MenuListItem>
                                      {it.adoptUserName || '-'}
                                    </MenuListItem>
                                  ) : (
                                    ''
                                  )}
                                  {isFinished ? (
                                    <MenuListItem>
                                      {timestampToDate(it.adoptTime, true)}
                                    </MenuListItem>
                                  ) : (
                                    ''
                                  )}
                                  <MenuListItem status={it.adoptStats}>
                                    {it.adoptStats != 1 ? (
                                      adoptEnum[it.adoptStats]
                                    ) : (
                                      <FlexRowCenter
                                        style={{
                                          justifyContent: 'space-around'
                                        }}
                                      >
                                        <Popconfirm
                                          placement="topRight"
                                          title={'确认采纳吗？'}
                                          onConfirm={() => {
                                            dispatch(
                                              changePageState(
                                                'curCorrentionLoading',
                                                it.id
                                              )
                                            );
                                            // [qIndex, 'questionCorrentions', index]是纠错信息所在位置，便于后面更新
                                            dispatch(
                                              adoptMessage(
                                                2,
                                                qq.get('id'),
                                                it.id,
                                                [
                                                  qIndex,
                                                  'questionCorrentions',
                                                  index
                                                ]
                                              )
                                            );
                                          }}
                                          okText="确认"
                                          cancelText="取消"
                                        >
                                          <PrimaryOriginA>采纳</PrimaryOriginA>
                                        </Popconfirm>
                                        <Popconfirm
                                          placement="topRight"
                                          title={'确认不采纳吗？'}
                                          onConfirm={() => {
                                            dispatch(
                                              changePageState(
                                                'curCorrentionLoading',
                                                it.id
                                              )
                                            );
                                            dispatch(
                                              adoptMessage(
                                                3,
                                                qq.get('id'),
                                                it.id,
                                                [
                                                  qIndex,
                                                  'questionCorrentions',
                                                  index
                                                ]
                                              )
                                            );
                                          }}
                                          okText="确认"
                                          cancelText="取消"
                                        >
                                          <PrimaryOriginA>
                                            不采纳
                                          </PrimaryOriginA>
                                        </Popconfirm>
                                      </FlexRowCenter>
                                    )}
                                  </MenuListItem>
                                </ErrorItem>
                              )}
                            </div>
                          );
                        })}
                      </ErrorList>
                    </QuestionItem>
                  );
                })
              ) : (
                <EmptyImg>
                  <div className="text">
                    {isQueryDataByCorrectionId ? '数据已处理' : '没有数据啦!'}
                  </div>
                </EmptyImg>
              )}
            </BodyList>
            <Pagination
              style={{ margin: '15px 0 5px 0' }}
              showQuickJumper
              defaultCurrent={1}
              current={pageState.get('pageIndex')}
              defaultPageSize={pageState.get('pageSize')}
              total={questionStatistics.getIn(['page', 'total'])}
              onChange={this.pageChange}
            />
            ,
          </div>
        </BodyWrapper>
      </RootWrapper>
    );
  }
}

ErrorCorrectManagement.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  ErrorCorrectManagement: makeSelectErrorCorrectManagement(),
  filterList: makeSelectFilterList(),
  selectFilter: makeSelectSelectFilter(),
  questionStatistics: makeSelectQuestionStatistics(),
  pageState: makeSelectPageState(),
  questionList: makeSelectQuestionList()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorCorrectManagement);
