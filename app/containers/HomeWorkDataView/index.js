/*
 *
 * HomeWorkDataView
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { DatePicker, Table, Select, Button } from 'antd';
import Immutable, { fromJS } from 'immutable';
import { FlexRowDiv, FlexColumnDiv } from 'components/Div';
import styled, { css } from 'styled-components';
import moment from 'moment';

import makeSelectHomeWorkDataView,
{
  makeListData, makeLoadingState, makeSelectedRangeDateValue, makeSubjectListData,
} from './selectors';

import { getSubjectListAction, setSelectedDateRangeAction, getReportListAction, setSearchFieldValueAction } from './actions';

const { RangePicker } = DatePicker;
const Option = Select.Option;

const RootDiv = styled(FlexColumnDiv) `
  width:100%;
  height:100;
  background:#fff;
  padding:20px;
  overflow-y:auto;
`;
const HeaderItem = styled.section`
  display:flex;
  flex-direction: row;
  line-height: 28px;
  margin-right: 6px;
`;
const CDiv = styled.div`
  margin: 10px;
`;

const startDate = moment().subtract(7, 'days');
const endDate = moment().subtract(1, 'days');
function disabledDate(current) {
  // Can not select days before today and today
  return current && current > endDate;
}

export class HomeWorkDataView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.dispatch(setSelectedDateRangeAction([startDate, endDate]));
    this.props.dispatch(setSearchFieldValueAction('subject', ''));
    this.props.dispatch(setSearchFieldValueAction('homeType', 1));
    this.props.dispatch(getSubjectListAction());
    this.props.dispatch(getReportListAction());
  }
  render() {
    const columns = [
      { title: '年级', dataIndex: 'stuGrade', render: (text) => text || '' },
      { title: '正式课', dataIndex: 'reLesCount', render: (text) => text || 0 },
      { title: '测评课', dataIndex: 'testLesCount', render: (text) => text || 0 },
      { title: '布置作业数', dataIndex: 'homeworkCount', render: (text) => text || 0 },
      { title: '布置率', dataIndex: 'homeworkRate', render: (text) => `${text || 0}%` },
      { title: '标准作业数', dataIndex: 'standHomeworkCount', render: (text) => text || 0 },
      { title: '标准作业占比', dataIndex: 'standHomeworkRate', render: (text) => `${text || 0}%` },
      { title: '手动布置数', dataIndex: 'cusHomeworkCount', render: (text) => text || 0 },
      { title: '手动布置占比', dataIndex: 'cusHomeworkRate', render: (text) => `${text || 0}%` },
      { title: '未提交', dataIndex: 'unSubmit', render: (text) => text || 0 },
      { title: '待批改', dataIndex: 'preCorrect', render: (text) => text || 0 },
      { title: '已批改', dataIndex: 'correct', render: (text) => text || 0 },
      { title: '逾期数', dataIndex: 'overdue', render: (text) => text || 0 },
      { title: '当前完成率', dataIndex: 'completeRate', render: (text) => `${text || 0}%` },
    ];
    const { list, subjectList } = this.props;

    return (
      <RootDiv>
        <CDiv>
          <FlexRowDiv>
            <HeaderItem>
              <span>时间：</span>
              <RangePicker
                defaultValue={[startDate, endDate]}
                allowClear={false}
                disabledDate={disabledDate}
                onChange={(val) => {
                  if (!val) return;
                  this.props.dispatch(setSelectedDateRangeAction(val));
                }}
              />
            </HeaderItem>
            <HeaderItem>
              <span>学科：</span>
              <Select
                defaultValue="" style={{ width: 120 }} onChange={(val) => {
                  this.props.dispatch(setSearchFieldValueAction('subject', val || ''));
                }}
              >
                <Option key="全部" value="">全部</Option>
                {subjectList.map((item, index) => {
                  return <Option key={`${item.get('id')}`} value={`${item.get('name')}`}>{item.get('name')}</Option>;
                })}
              </Select>
            </HeaderItem>
            <HeaderItem>
              <span>作业类型：</span>
              <Select
                defaultValue="1" style={{ width: 120 }} onChange={(val) => {
                  if (!val) return;
                  this.props.dispatch(setSearchFieldValueAction('homeType', val));
                }}
              >
                <Option value="1">正式课课后</Option>
                <Option value="2">测评课课前</Option>
              </Select>
            </HeaderItem>
            <Button
              type="primary" onClick={() => {
                this.props.dispatch(getReportListAction());
              }}
            >搜索</Button>
          </FlexRowDiv>
        </CDiv>
        <CDiv >
          <Table
            columns={columns}
            rowKey={(record) => record.stuGrade}
            dataSource={list.toJS()}
            pagination={false}
            loading={this.props.loading}
          ></Table>
        </CDiv>
        <CDiv>
          <ol>
            <li>1、作业布置率=布置作业数/（对应课程类型的）课程数</li>
            <li>2、标准作业使用占比=标准作业使用数/布置作业数</li>
            <li>3、手动布置作业占比=手动布置作业数/布置作业数</li>
            <li>4、作业完成率=（布置作业数-未提交-逾期数）/布置作业数</li>
          </ol>
        </CDiv>
      </RootDiv>
    );
  }
}

HomeWorkDataView.propTypes = {
  dispatch: PropTypes.func.isRequired,
  list: PropTypes.instanceOf(Immutable.List).isRequired,
  subjectList: PropTypes.instanceOf(Immutable.List).isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  HomeWorkDataView: makeSelectHomeWorkDataView(),
  list: makeListData(),
  subjectList: makeSubjectListData(),
  selectedDateRange: makeSelectedRangeDateValue(),
  loading: makeLoadingState(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeWorkDataView);
