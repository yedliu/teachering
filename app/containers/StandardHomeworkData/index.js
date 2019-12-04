/*
 *
 * StandardHomeworkData
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import makeSelectStandardHomeworkData from './selectors';
import styled from 'styled-components';
import moment from 'moment';
import { FlexRowDiv, FlexColumnDiv } from 'components/Div';
import { DatePicker, Table, Select, Button } from 'antd';
import fetchReport from 'api/tr-cloud/homework-report-controller';
import util from 'api/util';

const { RangePicker } = DatePicker;

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

export class StandardHomeworkData extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  state = {
    reportData: [],
    startDate: moment().subtract(6, 'days'),
    endDate: moment().subtract(0, 'days'),
    isloading: false,
  }
  componentDidMount() {
    this.search();
  }

  disabledDate = (current) => {
    return current && current > moment().subtract(0, 'days');
  }

  search = () => {
    // 获取作业报表数据
    const { startDate, endDate } = this.state;
    this.setState({ isloading: true });
    const reportFetch = {
      fetch: fetchReport.getHomeWorkReportData,
      params: {
        startDate: startDate.format('YYYY-MM-DD 00:00:00'),
        endDate: endDate.format('YYYY-MM-DD 23:59:59'),
        clazzType: 0,
        type: 1,
      },
      cb: (data) => {
        this.setState({ reportData: data.standHwData, isloading: false });
      }
    };
    util.fetchData(reportFetch);
  }

  handleChangeDate = (val) => {
    this.setState({
      startDate: val[0],
      endDate: val[1],
    });
  }

  cloumns = () => [
    { title: '时间', dataIndex: 'dayOfMonth', width: 250 },
    { title: '新建作业总数', dataIndex: 'totalCount', width: 250 },
    { title: '智能作业总数', dataIndex: 'aiCount', width: 250 },
  ];
  render() {
    const { reportData, startDate, endDate, isloading } = this.state;
    return (
      <RootDiv>
        <CDiv>
          <FlexRowDiv>
            <HeaderItem>
              <span>时间：</span>
              <RangePicker
                defaultValue={[startDate, endDate]}
                allowClear={false}
                disabledDate={this.disabledDate}
                onChange={this.handleChangeDate}
              />
            </HeaderItem>
            <Button
              type="primary" onClick={this.search}
            >搜索</Button>
          </FlexRowDiv>
        </CDiv>
        <CDiv>
          <Table
            columns={this.cloumns()}
            rowKey={(record) => record.dayOfMonth}
            dataSource={reportData}
            pagination={false}
            scroll={{ y: 650 }}
            loading={isloading}
          />
        </CDiv>
      </RootDiv>
    );
  }
}

StandardHomeworkData.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  StandardHomeworkData: makeSelectStandardHomeworkData(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StandardHomeworkData);
