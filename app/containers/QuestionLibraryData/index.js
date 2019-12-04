/*
 *
 * QuestionLibraryData
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import makeSelectQuestionLibraryData from './selectors';
import styled from 'styled-components';
import moment from 'moment';
import { FlexRowDiv, FlexColumnDiv } from 'components/Div';
import { DatePicker, Table, Button } from 'antd';
import fetchReport from 'api/qb-cloud/report-end-point';
import util from 'api/util';

const { RangePicker } = DatePicker;

const RootDiv = styled(FlexColumnDiv)`
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const HeaderItem = styled.section`
  display: flex;
  flex-direction: row;
  line-height: 28px;
  margin-right: 6px;
`;

const CDiv = styled.div`
  margin: 10px;
  flex: 1;
  overflow-y: auto;
`;

const PAGE_SIZE = 10;

export class QuestionLibraryData extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  state = {
    reportData: [],
    startDate: moment().subtract(6, 'days'),
    endDate: moment().subtract(0, 'days'),
    isloading: false,
    pageIndex: 1,
    total: 0
  };

  componentDidMount() {
    this.hangeGetFirstPage();
  }

  disabledDate = current => {
    return current && current > moment().subtract(0, 'days');
  };

  handleChangeDate = val => {
    this.setState({
      startDate: val[0],
      endDate: val[1]
    });
  };

  handlePageSize = pageIndex => {
    this.search(pageIndex);
  };

  hangeGetFirstPage = () => {
    this.search();
  }

  search = (pageIndex = 1) => {
    // 获取测评报表数据
    const { startDate, endDate } = this.state;
    this.setState({ isloading: true });
    const reportFetch = {
      fetch: fetchReport.getQuestionResportList,
      params: {
        startDate: startDate.format('YYYY-MM-DD 00:00:00'),
        endDate: endDate.format('YYYY-MM-DD 23:59:59'),
        pageIndex,
        pageSize: PAGE_SIZE
      },
      cb: data => {
        this.setState({
          reportData: data.list,
          isloading: false,
          total: data.total
        });
      }
    };
    util.fetchData(reportFetch);
  };

  cloumns = () => [
    {
      title: '统计时间',
      key: 'timeDimension',
      render: record => moment(record.timeDimension).format('YYYY-MM-DD'),
      width: 200
    },
    { title: '录入中', dataIndex: 'entryStat', width: 200 },
    { title: '标注中', dataIndex: 'taggingStat', width: 200 },
    { title: '终审中', dataIndex: 'judgStat', width: 200 },
    { title: '已入库', dataIndex: 'saveStat', width: 200 }
  ];

  render() {
    const { reportData, startDate, endDate, isloading, total } = this.state;
    return (
      <RootDiv>
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
          <Button type="primary" onClick={this.hangeGetFirstPage}>
            搜索
          </Button>
        </FlexRowDiv>
        <CDiv>
          <Table
            columns={this.cloumns()}
            rowKey="id"
            dataSource={reportData}
            scroll={{ y: 540 }}
            loading={isloading}
            pagination={{
              pageSize: PAGE_SIZE,
              total: total,
              onChange: this.handlePageSize
            }}
          />
        </CDiv>
      </RootDiv>
    );
  }
}

QuestionLibraryData.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  QuestionLibraryData: makeSelectQuestionLibraryData()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionLibraryData);
