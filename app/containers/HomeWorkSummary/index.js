/*
 *
 * HomeWorkSummary
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import makeSelectHomeWorkSummary from './selectors';
import styled from 'styled-components';
import moment from 'moment';
import { FlexRowDiv, FlexColumnDiv } from 'components/Div';
import { DatePicker, Table, Select, Button, message } from 'antd';
import fetchReport from 'api/tr-cloud/homework-report-controller';
import util from 'api/util';

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

export class HomeWorkSummary extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  state = {
    reportData: [],
    startDate: moment().subtract(6, 'days'),
    endDate: moment().subtract(0, 'days'),
    isloading: false,
    clazzType: 0,
    isExporting: false,
  }
  componentDidMount() {
    this.search();
  }

  disabledDate = (current) => {
    return current && current > moment().subtract(0, 'days');
  }

  search = () => {
    // 获取作业报表数据
    const { startDate, endDate, clazzType } = this.state;
    this.setState({ isloading: true });
    const reportFetch = {
      fetch: fetchReport.getHomeWorkReportData,
      params: {
        startDate: startDate.format('YYYY-MM-DD 00:00:00'),
        endDate: endDate.format('YYYY-MM-DD 23:59:59'),
        clazzType,
        type: 0,
      },
      cb: (data) => {
        this.setState({ reportData: data.stuHwData, isloading: false });
      }
    };
    util.fetchData(reportFetch);
  }

  export = () => {
    // 获取作业报表数据
    const { startDate, endDate, clazzType } = this.state;
    this.setState({ isExporting: true });
    const params = new FormData();
    params.append('startDate', startDate.format('YYYY-MM-DD 00:00:00'));
    params.append('endDate', endDate.format('YYYY-MM-DD 23:59:59'));
    params.append('clazzType', clazzType);
    params.append('type', 0);
    const filename = `report-${startDate.format('YYYYMMDD')}-${endDate.format('YYYYMMDD')}.xlsx`;

    fetchReport.exportHomeWorkReport(params)
      .then(res => {
        let contentType;
        if (res.headers) {
          contentType = res.headers.get('content-type');
        }
        if (
          typeof contentType === 'string'
          && contentType.indexOf('excel') > -1 // 如果 content-type 中不包含 excel 说明发生了错误
        ) {
          return res.blob();
        }
        return res.json();
      })
      .then(data => {
        if (data.code && +data.code !== 0) { // 能取到 code 表明返回的不是 Blob 对象
          message.error(data.message);
        } else {
          const url = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
        }
      }).finally(() => {
        this.setState({ isExporting: false });
      });
  }

  handleChangeDate = (val) => {
    this.setState({
      startDate: val[0],
      endDate: val[1],
    });
  }

  handleSelectChange = (val) => {
    val === '一对一' ? this.setState({ clazzType: 0 }) : this.setState({ clazzType: 1 });
  }

  cloumns = () => [
    { title: '学段学科', dataIndex: 'phaseSubject', width: 100 },
    { title: '布置作业的课数', dataIndex: 'totalCount', width: 100 },
    { title: '学生按时完成作业数', dataIndex: 'finishOnTimeCount', width: 100 },
    { title: '使用标准作业数', dataIndex: 'standardHwCount', width: 100 },
    { title: '标准作业完成数', dataIndex: 'standardFinishCount', width: 100 },
    { title: '手动布置作业数', dataIndex: 'notStandardHwCount', width: 100 },
    { title: '手动作业完成数', dataIndex: 'notStandardFinishCount', width: 100 },
    { title: 'PC端作业完成数', dataIndex: 'pcFinishCount', width: 100 },
    { title: '移动端作业完成数', dataIndex: 'notPcFinishCount', width: 100 },
  ];

  render() {
    const { reportData, startDate, endDate, isloading, isExporting } = this.state;
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
            <HeaderItem>
              <span>班型：</span>
              <Select
                defaultValue="一对一" style={{ width: 120 }} onChange={this.handleSelectChange}
              >
                <Option key="0" value="一对一">一对一</Option>
                <Option key="1" value="小班课">小班课</Option>
              </Select>
            </HeaderItem>
            <Button
              type="primary" onClick={this.search}
            >搜索</Button>
            <Button
              type="primary"
              loading={isExporting}
              onClick={this.export}
              style={{ marginLeft: 15 }}
            >导出excel</Button>
          </FlexRowDiv>
        </CDiv>
        <CDiv>
          <Table
            columns={this.cloumns()}
            rowKey={(record) => record.phaseSubject}
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

HomeWorkSummary.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  homeWorkSummary: makeSelectHomeWorkSummary(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeWorkSummary);
