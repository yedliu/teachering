/*
 *
 * AddVideoWrapper
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { FadeInDiv, fadeIn, FlexRowDiv, FlexColumnDiv, DivShadow } from 'components/Div';
import { Button, Row, Col,Input, Select, DatePicker,Table,Popconfirm, AutoComplete, message  } from 'antd';
import moment from 'moment';
import Immutable, { fromJS } from 'immutable';
import ChooseWatcher from './ChooseWatcher';
import UploadFile from './UploadFile';
import makeSelectAddVideoWrapper from './selectors';
import { setCurrentMenuAction, setChooseWatcherOpenAction, getVideoRecordListAction,setUploadModalOpenAction,setSearchFieldValueAction,
  setCurrentPageIndexAction, removeSelectVideosAction, setRemoveVideoAction, setSelectAddLessonVideoAction , getGradeAction, getSubjectAction,
getLessonTypeAction, setBatchAddVideoItemsAction, setIsBatchAddVideoAction, getUserIdAction, setChangeFullNameValueAction, setStudentIdsItemAction, setUserIdItemAction} from './actions';
import { makeCurrentMenuValue, makeSearchItemValue, makeVideoRecordList, makeVideoRecordTotalCount, makeCurrentPageIndex, makeLoadingState, makeGradeListData,makeSubjectListData,
  makeLessonTypeData, makeBatchAddVideoItems, makeUserIdsValue, makeStudentIdsValue,makeFullNameValue } from './selectors';
export const MenuButton = styled.div`
  width:130px;
  height:30px;
  line-height:30px;
  text-align:center;
  cursor:pointer;
  border-radius:15px;
  margin-right:35px;
  color:${(props) => props.isActive ? '#fff' : '#666' };
  border:${(props) => props.isActive ? '1px solid #108ee9' : '1px solid #ddd'};
  background:${(props) => props.isActive ? '#108ee9' : '#fff'};
  &:hover{
   border-color:#108ee9;
  }
`;
const Option = Select.Option;
export const RootDiv = styled(FlexColumnDiv)`
  width:100%;
  height:100%;
  padding:10px 20px;
  overflow-y:auto;
  background:#fff;
   tbody{
   text-align: center;
 }
 thead{
  th{text-align:center;}
 }
`;
const SearchPanel = styled(FlexColumnDiv)`
  min-height:90px;
  width:100%;
  margin-top:10px;
  justify-content:space-between;
  border:1px dotted #ddd;
  padding:10px;
`;
const SpanEle = styled.span`
  margin:0 10px;
`;
export const ToolBar = styled.div`
  width:100%;
  height:30px;
  margin:10px 0;
`;
export class AddVideoWrapper extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
constructor(props){
  super(props);
  this.handlePaginationChange = this.handlePaginationChange.bind(this);
  this.setDisabledStartDate = this.setDisabledStartDate.bind(this);
  this.setDisabledEndDate = this.setDisabledEndDate.bind(this);
  this.setStartTimeAction = this.setStartTimeAction.bind(this);
  this.setEndTimeAction = this.setEndTimeAction.bind(this);
}
componentDidMount(){
  this.props.dispatch(getGradeAction());
  this.props.dispatch(getSubjectAction());
  this.props.dispatch(getLessonTypeAction());
  this.props.dispatch(setSearchFieldValueAction('lesEndTime',moment()));
  this.props.dispatch(setSearchFieldValueAction('lesStartTime',moment().add(-7,'day')));
  // this.props.dispatch(getVideoRecordListAction())
}

  setDisabledStartDate(startDate) {
    let endDate = this.props.searchItem.get('lesEndTime','');
    if(!startDate || !endDate){
      return false;
    }
    return startDate.valueOf() < moment(endDate.valueOf()).add(-3,'months').valueOf() || startDate.valueOf() > moment(endDate.valueOf()).add(3,'months').valueOf();

  }
  setDisabledEndDate(endDate) {
    let startValue = this.props.searchItem.get('lesStartTime','');
    if(!endDate || !startValue){
      return false;
    }
    return endDate.valueOf() < moment(startValue.valueOf()).add(-3,'month').valueOf() || endDate.valueOf() > moment(startValue.valueOf()).add(3,'months').valueOf();
  }
  handlePaginationChange(pagination, filters, sorter) {
    // console.log('pppp',pagination)
    this.props.dispatch(setCurrentPageIndexAction(pagination.current));
    this.props.dispatch(getVideoRecordListAction());
  }
  setStartTimeAction(value) {
    if(!value){
      this.props.dispatch(setSearchFieldValueAction('lesStartTime',null));
      return;
    }
    this.props.dispatch(setSearchFieldValueAction('lesStartTime',value));
  }
  setEndTimeAction(value) {
    if(!value){
      this.props.dispatch(setSearchFieldValueAction('lesEndTime',null));
      return;
    }
    this.props.dispatch(setSearchFieldValueAction('lesEndTime',value));
  }
  render() {

    const columns = [
      {title:'学科',dataIndex:'lesSubject',render:(text) => text ? text : '-'},
      {title:'年级',dataIndex:'stuGrade',render:(text) => text ? text : '-'},
      {title:'老师',dataIndex:'teacherName',render:(text) => text ? text : '-'},
      {title:'学生',dataIndex:'studentName',render:(text) => text ? text : '-'},
      {title:'上课时间',dataIndex:'lesStartedAt',render:(text) => text ? text : '-'},
      {title:'老师手机',dataIndex:'teaMobile',render:(text) => text ? text : '-'},
      {title:'工作性质',dataIndex:'timeTypeStr',render:(text) => text ? text : '-'},
      {title:'课程类型',dataIndex:'lesType',render:(text) => text ? text : '-'},
      {title:'转化结果',dataIndex:'transformedStr',render:(text) => text ? text : '-'},
      {title:'操作',dataIndex:'storaged ',render:(state, record, index) => record.storaged ? (
        <a href="javascript:;" style={{color:'#ddd'}}>已添加</a>
      ):(<a href="javascript:;" onClick={()=>{
        this.props.dispatch(setChooseWatcherOpenAction(true))
        this.props.dispatch(setIsBatchAddVideoAction(false))
        this.props.dispatch(setSelectAddLessonVideoAction(fromJS(record)));
      }}>添加</a>)}
    ];
    const rowSelection={
      selectedRowKeys: this.props.batchVideoItems.map((item) => item.get('lessonId')).toJS(),
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.props.dispatch(setBatchAddVideoItemsAction(fromJS(selectedRows)))
      }
    };
    const { searchItem } = this.props;
    console.log('searchItem',this.props.searchItem.toJS())
    // console.log('gradeeeee',this.props.grade.toJS())
    const MenuItem = [{label:'从视频录像添加',value:'add'},{label:'上传视频',value:'upload'}];
    return (
      <RootDiv>
          <Row type={'flex'} justify={'start'} style={{width:'100%',minHeight:'30px'}}>
            {MenuItem.map((item,index)=>{
              return <MenuButton isActive={this.props.currentMenu === item.value} key={index} onClick={() =>{
                this.props.dispatch(setCurrentMenuAction(item.value));
                if(item.value === 'upload'){
                  this.props.dispatch(setUploadModalOpenAction(true))
                }else{
                  this.props.dispatch(getVideoRecordListAction());
                }
              }}>{item.label}</MenuButton>
            })}
          </Row>
        <SearchPanel className="SearchPanel">
        <Row type={'flex'} justify={'space-between'} style={{width:'100%'}}>
          {/* <Col span={3}>
            <Select
              style={{width:'130px'}}
              placeholder="学科"
              value={this.props.searchItem.get('lesSubject','')}
              onSelect={(value)=>{
                this.props.dispatch(setSearchFieldValueAction('lesSubject',value))
              }}
            >
              {this.props.subjects.map((item,index)=>{
                return <Option key={index} value={item.get('itemValue')}>{item.get('itemCode')}</Option>
              })}
            </Select>
          </Col> */}
          {/* <Col span={3}>
            <Select
              style={{width:'130px'}}
              placeholder="年级"
              value={this.props.searchItem.get('stuGrade','')}
              onSelect={(value)=>{
                this.props.dispatch(setSearchFieldValueAction('stuGrade',value))
              }}
            >
              {this.props.grade.map((item,index)=>{
                return <Option key={index} value={item.get('itemValue')}>{item.get('itemCode')}</Option>
              })}
            </Select>
          </Col> */}
          <Col span={2}>
            <AutoComplete
              style={{width:'120px'}}
              placeholder="老师姓名"
              onChange={this.props.teacherGetUserIdsAction}
              onSelect={(value,option) => {
                this.props.dispatch(setSearchFieldValueAction('teaUserId',value))
              }}
            >
              {this.props.userIds.map((item,index)=>{
                return <AutoComplete.Option style={{width:'150px'}} key={index} value={`${item.get('userId')}`}>{`${item.get('firstName')}-${item.get('mobile')}`}</AutoComplete.Option>
              })}
            </AutoComplete>
          </Col>
          <Col span={2}>
            <Input placeholder="老师手机" value={this.props.searchItem.get('teaMobile','')} onChange={(e)=>{
              this.props.dispatch(setSearchFieldValueAction('teaMobile',e.target.value))
            }} />
          </Col>
          <Col span={2}>
            <AutoComplete
              style={{width:'120px'}}
              placeholder="学生姓名"
              onChange={this.props.studentGetUserIdsAction}
              onSelect={(value,option) => {
                this.props.dispatch(setSearchFieldValueAction('stuUserId',value))
              }}
            >
              {this.props.studentIds.map((item,index)=>{
                return <AutoComplete.Option style={{width:'150px'}} key={index} value={`${item.get('userId')}`}>{`${item.get('firstName')}-${item.get('mobile')}`}</AutoComplete.Option>
              })}
            </AutoComplete>
          </Col>
          <Col span={2}>
            <Input placeholder="学生手机" value={this.props.searchItem.get('stuMobile','')} onChange={(e)=>{
              this.props.dispatch(setSearchFieldValueAction('stuMobile',e.target.value))
            }} />
          </Col>
          <Col span={3}>
            <Select style={{width:'130px'}}
                    placeholder="课程类型"
                    value={this.props.searchItem.get('lesType','')}
                    onSelect={(value)=>{
                    this.props.dispatch(setSearchFieldValueAction('lesType',value))
                  }}>
              {this.props.lessontypes.map((item,index)=>{
                return <Option key={index} value={index === 0 ? item.get('itemValue') : item.get('itemCode')}>{index === 0 ? item.get('itemCode') :item.get('itemValue')}</Option>
              })}
            </Select>
          </Col>
          <Col span={3}>
            <Select style={{width:'130px'}}
                    placeholder="转化结果"
                    value={this.props.searchItem.get('transFormed','')}
                    onChange={(value)=>{
                    this.props.dispatch(setSearchFieldValueAction('transFormed',value))
                  }}>
                  <Option value="">转化结果</Option>
                  <Option value="1">转化成功</Option>
                  <Option value="0">未转化</Option>
            </Select>
          </Col>
        </Row>
        <Row type={'flex'} style={{width:'100%'}}>
          <Col span={2}>
            <span>上课时间：</span>
          </Col>
          <Col span={10}>
            <DatePicker
              placeholder="开始时间"
              disabledDate={this.setDisabledStartDate}
              value={this.props.searchItem.get('lesStartTime',null)}
              onChange={this.setStartTimeAction}
            ></DatePicker>
            <SpanEle>至</SpanEle>
            <DatePicker
              placeholder="结束时间"
              disabledDate={this.setDisabledEndDate}
              value={this.props.searchItem.get('lesEndTime',null)}
              onChange={this.setEndTimeAction}
            ></DatePicker>
          </Col>
          <Col span={12}>
          <Row justify={'end'} type={'flex'} style={{width:'100%'}}>
            <Button type="primary" onClick={()=>{
              if(this.props.fullName.get('value') ==='' && !searchItem.get('teaMobile') && !searchItem.get('stuUserId') && !searchItem.get('stuMobile')) {
                message.warning('请输入师或者学生的姓名或者手机号');
                return;
              }
              this.props.dispatch(getVideoRecordListAction());
            }}>搜索</Button>
          </Row>
          </Col>
        </Row>
        </SearchPanel>
        <ToolBar>
          <Button type="primary" onClick={()=>{
            if(this.props.batchVideoItems.toJS().length === 0) { message.error('请选择要添加的视频！',3); return }
            this.props.dispatch(setChooseWatcherOpenAction(true))
            this.props.dispatch(setIsBatchAddVideoAction(true))
          }}>批量添加</Button>
        </ToolBar>
        <Table
          columns={columns}
          style={{textAlign:'center'}}
          rowKey={record => record.lessonId}
          dataSource={this.props.videoList.toJS()}
          rowSelection={rowSelection}
          pagination={{pageSize:25,total:this.props.totalCount,current:this.props.currentPageIndex}}
          onChange={this.handlePaginationChange}
          loading={this.props.loading}
        >
        </Table>
        <ChooseWatcher></ChooseWatcher>
        <UploadFile></UploadFile>
      </RootDiv>
    );
  }
}

AddVideoWrapper.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentMenu:PropTypes.string.isRequired,
  searchItem:PropTypes.instanceOf(Immutable.Map).isRequired,
  videoList:PropTypes.instanceOf(Immutable.List).isRequired,
  totalCount:PropTypes.number.isRequired,
  currentPageIndex:PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  grade:PropTypes.instanceOf(Immutable.List).isRequired,
  subjects:PropTypes.instanceOf(Immutable.List).isRequired,
  lessontypes:PropTypes.instanceOf(Immutable.List).isRequired,
  batchVideoItems:PropTypes.instanceOf(Immutable.List).isRequired,
  userIds:PropTypes.instanceOf(Immutable.List).isRequired,
  studentIds:PropTypes.instanceOf(Immutable.List).isRequired,
  studentGetUserIdsAction: PropTypes.func.isRequired,
  teacherGetUserIdsAction: PropTypes.func.isRequired,
  fullName: PropTypes.instanceOf(Immutable.Map).isRequired,
};

const mapStateToProps = createStructuredSelector({
  AddVideoWrapper: makeSelectAddVideoWrapper(),
  currentMenu:makeCurrentMenuValue(),
  searchItem: makeSearchItemValue(),
  videoList: makeVideoRecordList(),
  totalCount: makeVideoRecordTotalCount(),
  currentPageIndex: makeCurrentPageIndex(),
  loading: makeLoadingState(),
  grade: makeGradeListData(),
  subjects: makeSubjectListData(),
  lessontypes: makeLessonTypeData(),
  batchVideoItems: makeBatchAddVideoItems(),
  userIds: makeUserIdsValue(),
  studentIds: makeStudentIdsValue(),
  fullName: makeFullNameValue(),

});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    studentGetUserIdsAction: (value) => {
      console.log('value',value)
      if(value.length > 1){
        dispatch(setChangeFullNameValueAction(fromJS({label:'student',value})))
        dispatch(getUserIdAction());
      }else{
        dispatch(setStudentIdsItemAction(fromJS([])));
        dispatch(setChangeFullNameValueAction(fromJS({label:'student',value:''})))
        dispatch(setSearchFieldValueAction('stuUserId',''));
      }
    },
    teacherGetUserIdsAction: (value) => {
      if(value.length > 1){
        dispatch(setChangeFullNameValueAction(fromJS({label:'teacher',value})));
        dispatch(getUserIdAction());
      }else{
        dispatch(setUserIdItemAction(fromJS([])));
        dispatch(setChangeFullNameValueAction(fromJS({label:'teacher',value: ''})));
        dispatch(setSearchFieldValueAction('teaUserId',''));
      }
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(AddVideoWrapper);
