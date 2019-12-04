/*
 *
 * VideoManageWrapper
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import Immutable, { fromJS } from 'immutable';
import moment from 'moment';
import { Button, Menu, Row, Col,Table,Popconfirm, Modal } from 'antd';
import { FadeInDiv, fadeIn, FlexRowDiv, FlexColumnDiv, DivShadow } from 'components/Div';
import makeSelectVideoManageWrapper from './selectors';
import { RootDiv, ToolBar } from 'containers/AddVideoWrapper';
import SearchPanel from './SearchPanel';
import TreeDirection from './TreeDirection';
import SetWrapper from './SetWrapper';
import { setSearchPanelOpenAction, setTreeDirectionModalOpen, getVideoRecordListAction,setCurrentPageNumberAction, setSelectUpVideoItemsAction,
setBatchUpVideoAction, setBatchDownVideoAction, setBatchDeleteVideoAction, setChangeSelectDirectionIdAction, setSetWrapperOpenAction, setVideoBelongTypeAction,setVideoCoverOpenAction, setVideoCoverUrlAction, setSelectOperateVideoItemAction,
  setSearchItemsInitAction, setSearchBySetItemInit, getTreeDirectionAction, setSecondDirectionInit, setThirdDirectionInit, getFirstDirectionItemAction} from './actions';
import { makeVideoListValue,makeVideoTotalCountValue, makeCurrentPageIndex, makeLoadingStateValue, makeSelectUpVideoIdsValue, makeVideoBelongTypeValue, makeVideoCoverOpenAction,
makeVideoCoverUrlValue} from './selectors';
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
const ToolBars = styled(ToolBar)`
  .ant-btn{width:80px;margin-right:15px;}
`;
export class VideoManageWrapper extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props){
    super(props);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
  }
  componentDidMount() {
    this.props.dispatch(getVideoRecordListAction());
    // this.props.dispatch(setCreateDirectionAction());
  }
  handlePaginationChange(pagination) {
    this.props.dispatch(setCurrentPageNumberAction(pagination.current));
    this.props.dispatch(getVideoRecordListAction());
  }
  render() {
    const columns=[
      {title:'学科',dataIndex:'subject',render:(text) => text ? text : '-'},
      {title:'年级',dataIndex:'grade',render:(text) => text ? text : '-'},
      {title:'老师',dataIndex:'teacherName',render:(text) => text ? text : '-'},
      {title:'上课时间',dataIndex:'lesStartTime',render:(text) => text ? text : '-'},
      {title:'课程类型',dataIndex:'lessonType',render:(text) => text ? text : '-'},
      {title:'入库时间',dataIndex:'createdTime',render:(time) => moment(time).format('YYYY-MM-DD HH:mm')},
      {title:'观看次数',dataIndex:'watchCount',render:(text) => text ? text : '-'},
      {title:'一级目录',dataIndex:'firstLevelDirectoryName',render:(text) => text ? text : '-'},
      {title:'二级目录',dataIndex:'secondLevelDirectoryName',render:(text) => text ? text : '-'},
      {title:'三级目录',dataIndex:'thirdLevelDirectoryName',render:(text) => text ? text : '-'},
      {title:'封面',dataIndex:'cover',render:(state) => state ? <a href="javascript:;" onClick={() =>{
        this.props.dispatch(setVideoCoverUrlAction(state));
        this.props.dispatch(setVideoCoverOpenAction(true));
      }}>预览</a> : '-'},
      {title:'标题',dataIndex:'title',render:(text) => text ? text : '-'},
      {title:'主讲人',dataIndex:'speaker',render:(text) => text ? text : '-'},
      {title:'操作',dataIndex:'setted',render:(setted, record, index)=>{
       return <div>
         {setted ? (<a href="javascript:;" onClick={()=>{
           this.props.dispatch(setSelectOperateVideoItemAction(fromJS(record)));
           this.props.dispatch(setSetWrapperOpenAction(true));
           this.props.dispatch(setChangeSelectDirectionIdAction(fromJS({label:'一级目录',id:0})));
           this.props.dispatch(getFirstDirectionItemAction());
           this.props.onInitDirectionAction();
         }}>编辑</a>):(<a href="javascript:;" onClick={() =>{
           this.props.dispatch(setSelectOperateVideoItemAction(fromJS(record)));
           this.props.dispatch(setSetWrapperOpenAction(true));
           this.props.dispatch(setChangeSelectDirectionIdAction(fromJS({label:'一级目录',id:0})));
           this.props.dispatch(getFirstDirectionItemAction());
           this.props.onInitDirectionAction();
         }}>设置</a>)}
         {record.state ? (<Popconfirm
           title="是否确定下架该视频"
           okText="确定"
           cancelText="取消"
           onConfirm={() => this.props.onDownVideoAction(record)}
         ><a href="javascript:;" style={{margin:'0 3px'}}>下架</a></Popconfirm>):setted ? (<Popconfirm
           title="是否确定上架该视频"
           okText="确定"
           cancelText="取消"
           onConfirm={() => this.props.onUpVideoAction(record)}
         ><a href="javascript:;" style={{margin:'0 3px'}}>上架</a></Popconfirm>):(<a href="javascript:;" style={{color:'#ddd'}}>上架</a>)}
         <Popconfirm
           title="是否确定删除该视频"
           okText="确定"
           cancelText="取消"
           onConfirm={() => this.props.onDeleteVideoAction(record)}
         >
           <a href="javascript:;">删除</a>
         </Popconfirm>
         </div>
      }},
    ];
    const rowSelection={
      selectedRowKeys:this.props.selectUpVideoIds.toJS(),
      onChange: (selectedRowKeys, selectedRows) => {
        //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.props.dispatch(setSelectUpVideoItemsAction(fromJS(selectedRowKeys)))
      },
      getCheckboxProps:(record) => ({
        disabled:!record.setted
      }),
    };
    const Rolers = [{label:'全职老师',value:1},{label:'兼职老师',value:2},{label:'CC/CR',value:3}];

    return (
      <RootDiv>
        <Row type={'flex'} style={{minHeight:'30px'}}>
            {Rolers.map((item,index)=>{
              return <MenuButton isActive={this.props.belongType === item.value} key={index} onClick={()=>{
                this.props.dispatch(setVideoBelongTypeAction(item.value));
                this.props.dispatch(setCurrentPageNumberAction(1))
                this.props.dispatch(setSearchItemsInitAction(fromJS({})));
                this.props.dispatch(setSearchBySetItemInit(fromJS({})));
                this.props.dispatch(getVideoRecordListAction());
              }}>{item.label}</MenuButton>
            })}
        </Row>
        <ToolBars>
          <Row type={'flex'} justify={'flex-start'}>
              <Popconfirm
                title="是否确定上架视频？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => this.props.dispatch(setBatchUpVideoAction())}
              >
                <Button>批量上架</Button>
              </Popconfirm>
              <Popconfirm
                title="是否确定下架视频？"
                okText="确定"
                cancelText="取消"
                onConfirm={this.props.onBatchDownVideoAction}
              >
                <Button>批量下架</Button>
              </Popconfirm>
              <Popconfirm
                title="是否确定删除视频？"
                okText="确定"
                cancelText="取消"
                onConfirm={this.props.onBatchDeleteVideoAction}
              >
                <Button>批量删除</Button>
              </Popconfirm>
              <Button className="btn" style={{width:'80px'}} onClick={()=>{
                this.props.dispatch(setSearchPanelOpenAction(true));
                this.props.dispatch(setChangeSelectDirectionIdAction(fromJS({label:'一级目录',id:0})));
                this.props.dispatch(getFirstDirectionItemAction());
                this.props.onInitDirectionAction();
              }}>筛选</Button>
              <Button onClick={()=>{
                this.props.dispatch(getTreeDirectionAction());
                this.props.dispatch(setTreeDirectionModalOpen(true));
              }}>目录设置</Button>
          </Row>
        </ToolBars>
        <Table
          columns={columns}
          style={{textAlign:'center'}}
          rowSelection={rowSelection}
          rowKey={record => record.id}
          dataSource={this.props.videoList.toJS()}
          pagination={{pageSize:25,total:this.props.totalCount,current:this.props.currentPageIndex}}
          onChange={this.handlePaginationChange}
          loading={this.props.loading}
        >
        </Table>
        <SearchPanel />
        <TreeDirection />
        <SetWrapper />
        <Modal
          visible={this.props.videoCoverOpen}
          footer=""
          maskClosable={false}
          onCancel={this.props.onCloseCoverModalAction}
        >
          <img style={{width:'100%'}} src={this.props.videoCoverUrl} alt="example" />
        </Modal>
      </RootDiv>
    );
  }
}

VideoManageWrapper.propTypes = {
  dispatch:PropTypes.func.isRequired,
  videoList:PropTypes.instanceOf(Immutable.List).isRequired,
  totalCount:PropTypes.number.isRequired,
  currentPageIndex:PropTypes.number.isRequired,
  loading:PropTypes.bool.isRequired,
  selectUpVideoIds:PropTypes.instanceOf(Immutable.List).isRequired,
  onBatchDownVideoAction:PropTypes.func.isRequired,
  onBatchDeleteVideoAction:PropTypes.func.isRequired,
  onDownVideoAction:PropTypes.func.isRequired,
  onDeleteVideoAction:PropTypes.func.isRequired,
  onUpVideoAction:PropTypes.func.isRequired,
  belongType:PropTypes.number.isRequired,
  videoCoverOpen:PropTypes.bool.isRequired,
  videoCoverUrl:PropTypes.string.isRequired,
  onCloseCoverModalAction:PropTypes.func.isRequired,
  onInitDirectionAction:PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  VideoManageWrapper: makeSelectVideoManageWrapper(),
  videoList: makeVideoListValue(),
  totalCount: makeVideoTotalCountValue(),
  currentPageIndex: makeCurrentPageIndex(),
  loading: makeLoadingStateValue(),
  selectUpVideoIds: makeSelectUpVideoIdsValue(),
  belongType: makeVideoBelongTypeValue(),
  videoCoverOpen: makeVideoCoverOpenAction(),
  videoCoverUrl: makeVideoCoverUrlValue(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onBatchDownVideoAction: () => dispatch(setBatchDownVideoAction()),
    onBatchDeleteVideoAction: () => dispatch(setBatchDeleteVideoAction()),
    onDownVideoAction: (record) => {
      dispatch(setSelectUpVideoItemsAction(fromJS([record.id])));
      dispatch(setBatchDownVideoAction());
    },
    onDeleteVideoAction: (record) => {
      dispatch(setSelectUpVideoItemsAction(fromJS([record.id])));
      dispatch(setBatchDeleteVideoAction());
    },
    onCloseCoverModalAction: () => {
      dispatch(setVideoCoverOpenAction(false));
      dispatch(setVideoCoverUrlAction(''));
    },
    onUpVideoAction:(record) => {
      dispatch(setSelectUpVideoItemsAction(fromJS([record.id])));
      dispatch(setBatchUpVideoAction());
    },
    onInitDirectionAction:() =>{
      dispatch(setSecondDirectionInit(fromJS([])));
      dispatch(setThirdDirectionInit(fromJS([])));
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(VideoManageWrapper);
