/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React, { PropTypes } from 'react';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { Select } from 'antd';
import moment from 'moment';
import echarts from 'echarts'; // 必须
import { FlexColumn, FlexRowCenter } from '../../components/FlexBox';
import {
  makeSelectTypeList,
  makeSelectType,
  makeSelectList,
  makeSelectParams,
  makeSelectSearchTypeList,
  makeSelectSearchType,
  } from './selectors';
import {
  setTypeListAction,
  setTypeAction,
  setSearchTypeListAction,
  setSearchTypeAction,
  getListAction,
  setParamsAction,
  } from './actions';

// const { RangePicker } = DatePicker;

const Wrapper = styled(FlexColumn) `
  background-color: white;
`;

const HeaderWrapper = styled(FlexRowCenter) `
  padding:20px 0 15px 20px;
  border-bottom: 1px dotted #ddd;
  .ant-select-lg{
    width: 150px !important;
  }
`;

const BodyWrapper = styled.div `
  overflow:auto;
  padding: 20px;
  table{
    width: 100%;
    height: auto;
    border: 1px solid #ddd;
    tr{
      border-bottom: 1px solid #ddd;
      text-align: center;
      font-size: 12px;
     /* &:last-child{
        border-bottom: 0 none;
        background: rgba(0,0,255,0.2);
        td{
          color: #000;
        }
      }*/
      th{
        background: #f7f7f7;
        color: rgba(0, 0, 0, 0.85);
      }
      th, td{
        min-width: 62px;
        width: 62px;
        height: 50px;
        line-height: 50px;
      }
    }
  }
`;

const searchTypeList = [
  { id: 3, name: '按天显示最近90天课程并发数' },
  { id: 1, name: '最近12周的数据' },
  { id: 2, name: '按分钟显示当天并发的课程数' },
];

const typeList = [
  { id: 'hwAllCount', name: '布置作业数' },
  { id: 'hwAllCountRatio', name: '作业使用率' },
  { id: 'hwUseStandardHwCount', name: '使用标准作业数' },
  { id: 'hwUseStandardHwCountRatio', name: '标准作业使用比例' },
  { id: 'hwStuFinishOnTimeCount', name: '作业完成数' },
  { id: 'regularLesCount', name: '正式课（节）' },
  { id: 'regularFormalCsCount', name: '标准课件使用（正式课）' },
  { id: 'regularUserCsCount', name: '其他掌门课件（正式课）' },
  { id: 'regularOtherCsCount', name: '自制课件（正式课）' },
  { id: 'testLesCount', name: '测评课（节）' },
  { id: 'testFormalCsCount', name: '标准课件使用(测评课）' },
  { id: 'testLesStuCount', name: '测评课学生' },
  { id: 'regLesStuCount', name: '正式课学生' },
  { id: 'fullTeacherCount', name: '全职老师' },
  { id: 'partTeacherCount', name: '兼职老师' },
  { id: 'qbTotal', name: '全部题库' },
  { id: 'qbNotReceiveCount', name: '未领取题库' },
  { id: 'qbCutAuditedCount', name: '切割阶段题库' },
  { id: 'qbEntryAuditedCount', name: '录入阶段题库' },
  { id: 'qbTagAuditedCount', name: '标注阶段题库' },
  { id: 'qbStoragedCount', name: '已入库题库' },
];

// const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const dateFormat = 'YYYY-MM-DD';

const dateStartCal = (daysBefore, key, time) => {
  const now = new Date();
  // const defaultEndDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' 23:59:59';
  let defaultEndDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
  if (time) {
    defaultEndDate += ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
  }
  now.setDate(now.getDate() - daysBefore);
  // if (key == 3 && (now.getMonth() + 1) > 10 && now.getDate() > 10) {
  //  now.setDate(now.getDate() - 1);
  // }
  if (key == 3) { // eslint-disable-line
    now.setDate(now.getDate() - 1);
  }
  // const defaultStartDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' 00:00:00';
  let defaultStartDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
  if (time) {
    defaultStartDate += ' 00:00:00';
  }
  return [defaultStartDate, defaultEndDate];
};

let chartResize = null;

export class DataViewCharts extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    const dateInit = dateStartCal(90, 3);
    const params = this.props.params;
    this.props.dispatch(setParamsAction(params.set('startDate', dateInit[0]).set('endDate', dateInit[1]).set('props', this.props)));
    this.props.dispatch(setSearchTypeAction(Immutable.fromJS(searchTypeList[0])));
    this.props.dispatch(setSearchTypeListAction(Immutable.fromJS(searchTypeList)));
    this.props.dispatch(setTypeAction(Immutable.fromJS(typeList[0])));
    this.props.dispatch(setTypeListAction(Immutable.fromJS(typeList)));
    this.props.dispatch(getListAction());
  }

  componentWillUnmount() {
    if (chartResize) {
      clearTimeout(chartResize);
    }
  }

  render() {
    const list = this.props.list.toJS(); // eslint-disable-line
    return (
      <Wrapper>
        <HeaderWrapper>
          <Select style={{ width: 200, height: 'auto', marginRight: 10 }} value={{ key: this.props.searchType.get('id').toString(), label: this.props.searchType.get('name') }} labelInValue onChange={(value) => this.props.handleSearchTypeSelectOnChange(value, this.props)}>
            {
              this.props.searchTypeList.map((type) =>
                <Select.Option value={type.get('id').toString()} key={type.get('id')} title={type.get('name')}>{type.get('name')}</Select.Option>
              )
            }
          </Select>
          { String(this.props.searchType.get('id')) === '1' && <Select style={{ width: 120, height: 'auto' }} size="large" value={{ key: this.props.type.get('id').toString(), label: this.props.type.get('name') }} labelInValue onChange={(value) => this.props.handleTypeSelectOnChange(value, this.props)}>
            {
              this.props.typeList.map((type) =>
                <Select.Option value={type.get('id').toString()} key={type.get('id')} title={type.get('name')}>{type.get('name')}</Select.Option>
              )
            }
          </Select>}
        </HeaderWrapper>
        <BodyWrapper>
          <div id="charts" style={{ width: '100%', minWidth: 1400, height: '500px' }}></div>
        </BodyWrapper>
      </Wrapper>
    );
  }
}

DataView.propTypes = {
  dispatch: PropTypes.func.isRequired,
  list: PropTypes.instanceOf(Immutable.List).isRequired,
  type: PropTypes.instanceOf(Immutable.Map).isRequired,
  typeList: PropTypes.instanceOf(Immutable.List).isRequired,
  handleTypeSelectOnChange: PropTypes.func.isRequired,
  handleSearchTypeSelectOnChange: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  timeOnChange: PropTypes.func.isRequired,
  onStartChange: PropTypes.func.isRequired,
  onEndChange: PropTypes.func.isRequired,
  disabledStartDate: PropTypes.func.isRequired,
  disabledEndDate: PropTypes.func.isRequired,
  drawCharts: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  typeList: makeSelectTypeList(),
  type: makeSelectType(),
  list: makeSelectList(),
  params: makeSelectParams(),
  searchTypeList: makeSelectSearchTypeList(),
  searchType: makeSelectSearchType(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    handleTypeSelectOnChange: (value, props) => {
      dispatch(setTypeAction(props.type.set('id', value.key).set('name', value.label)));
      dispatch(getListAction());
    },
    handleSearchTypeSelectOnChange: (value, props) => {
      dispatch(setSearchTypeAction(props.type.set('id', value.key).set('name', value.label)));
      let dateTimeType = 4;
      let daysBefore = 0;
      let time = false;
      if (value.key == 1) { // eslint-disable-line
        dateTimeType = 3;
        const now = new Date();
        daysBefore = 12 * 7;
        if (now.getDay() > 0) {
          daysBefore += now.getDay();
        } else {
          daysBefore += 7;
        }
      }
      if (value.key == 2) { // eslint-disable-line
        daysBefore = 0;
        time = true;
      }
      if (value.key == 3) { // eslint-disable-line
        daysBefore = 91;
      }
      if (daysBefore > 0) {
        daysBefore = daysBefore - 1;
      }
      let dates = dateStartCal(daysBefore, value.key, time);
      dispatch(setParamsAction(props.params.set('dateTimeType', dateTimeType).set('startDate', dates[0]).set('endDate', dates[1])));
      dispatch(getListAction());
    },
    search: () => {
      dispatch(getListAction());
    },
    timeOnChange: (value, dateString, props) => {
      // props.dispatch(setDateAction(Immutable.fromJS({ startDate: dateString[0], endDate: dateString[1] })));
      props.dispatch(setDateAction(props.params.set('startDate', dateString[0]).set('endDate', dateString[1])));
    },
    onStartChange: (value, dateString, props) => {
      props.dispatch(setDateAction(props.params.set('startDate', dateString[0])));
    },
    onEndChange: (value, dateString, props) => {
      props.dispatch(setDateAction(props.params.set('endDate', dateString[0])));
    },
    disabledStartDate: (startValue, props) => {
      const endValue = moment(props.params.get('endDate'), dateFormat);
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate: (endValue, props) => {
      const startValue = moment(props.params.get('startDate'), dateFormat);
      if (!endValue || !startValue) {
        return false;
      }
      return endValue.valueOf() <= startValue.valueOf();
    },
    drawCharts: (xAxisList, yAxisList, searchType, type) => {
      const legend = searchType.get('name') + (searchType.get('id') == 1 ? ` - ${type.get('name')}` : ''); // eslint-disable-line
      let showXAxis = true; // eslint-disable-line
      if (searchType.get('id') == 2) { // eslint-disable-line
        // showXAxis = false;
        // xAxisList = [];
      }
      const myChart = echarts.init(document.getElementById('charts'));
      let option = {
        title: {
          text: '',
          subtext: ''
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            params = params[0]; // eslint-disable-line
            let name = params.name;
            if (name.indexOf(':') > 0) {
              name = name.replace(':', '时');
              name = name.indexOf(':') > 0 ? (name.replace(':', '分') + '秒') : (name + '分');
            }
            return name + ': ' + params.value;
          },
          axisPointer: {
            // animation: false,
            type: 'cross'
          }
        },
        toolbox: {
          show: false,
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '4%',
          right: '4%',
          bottom: '35%',
          // center: ['50%','50%'],
          // containLabel: true,
        },
        legend: {
          data: [legend],
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxisList,
          axisLabel: {
            interval: 0,
            rotate: 45,
            margin: 10,
            formatter: function(value)
            {
              return value.split('~').join('\n');
            },
          }
        },
        yAxis: {
          type: 'value',
          // axisLabel: {
          //  formatter: '{value}'
          // },
          axisPointer: {
            snap: true
          }
        },
        series: [
          {
            name: legend,
            type: 'line',
            smooth: true,
            // showSymbol: false,
            // hoverAnimation: false,
            data: yAxisList,
            areaStyle: {
              color: '#ddd',
            },
          }
        ]
      };
      if (searchType.get('id') == 2) { // eslint-disable-line
        delete option.xAxis.axisLabel;
      }
      if (myChart.getOption()) {
        myChart.clear();
      }
      myChart.setOption(option);
      if (!chartResize) {
        /* 窗口自适应，关键代码 */
        chartResize = setTimeout(function () {
          window.onresize = function () {
            myChart.resize();
          };
        }, 200);
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DataViewCharts);
