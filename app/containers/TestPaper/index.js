/*
 *
 * TestPaper
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import makeSelectTestPaper from './selectors';
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

export class TestPaper extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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

  handleChangeDate = (val) => {
    this.setState({
      startDate: val[0],
      endDate: val[1],
    });
  }

  search = () => {
    // 获取测评报表数据
    const { startDate, endDate } = this.state;
    this.setState({ isloading: true });
    const reportFetch = {
      fetch: fetchReport.getTestReportData,
      params: { startDate: startDate.format('YYYY-MM-DD 00:00:00'), endDate: endDate.format('YYYY-MM-DD 23:59:59') },
      cb: (data) => {
        this.setState({ reportData: data, isloading: false });
      }
    };
    util.fetchData(reportFetch);
  }

  cloumns = () => [
    { title: '年级', dataIndex: 'grade', width: 200 },
    { title: '测评试卷布置总数', dataIndex: 'examInfoTotal', width: 200 },
    { title: '测评试卷完成总数', dataIndex: 'examInfoFinished', width: 200 },
    { title: '智能测评数', dataIndex: 'examInfoRandom', width: 200 },
    { title: '智能测评完成总数', dataIndex: 'examInfoRandomFinished', width: 200 },
    { title: 'AI阶段测评数', dataIndex: 'examInfoAITotal', width: 200 },
    { title: 'AI阶段测评完成数', dataIndex: 'examInfoAIFinished', width: 200 },
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
            rowKey={(record) => record.grade}
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

TestPaper.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  TestPaper: makeSelectTestPaper(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TestPaper);
