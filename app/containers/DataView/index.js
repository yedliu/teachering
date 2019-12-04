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
import Immutable, { fromJS } from 'immutable';
import { connect } from 'react-redux';
import styled, { injectGlobal } from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { Select, Button, DatePicker } from 'antd';
import moment from 'moment';
import { FlexColumn, FlexRowCenter, FlexRow } from '../../components/FlexBox';
const picNull = window._baseUrl.imgCdn + '18cdee41-78a4-4873-b815-17cbf07aaab2.png';
import Config from 'utils/config';
import {
  makeSelectTypeList,
  makeSelectType,
  makeSelectList,
  makeSelectParams,
  makeSelectShowOrHide,
  makeSelectLessonType,
  makeSelectLessonList,
} from './selectors';
import {
  setTypeListAction,
  setTypeAction,
  getListAction,
  setParamsAction,
  setLessonListAction,
  setShowOrHideAction,
  setSelectLessonType,
  getOneToOneClassAction,
  getSmallClassAction,
} from './actions';
// import echarts from 'echarts'; //必须

// const { RangePicker } = DatePicker;
injectGlobal`
  .num{
    padding: 0 8px;
    color: #ff0000;
  }
`;
const Wrapper = styled(FlexColumn)`
  background-color: white;
`;

const HeaderWrapper = styled(FlexRowCenter)`
  padding:20px 0 15px 20px;
  border-bottom: 1px dotted #ddd;
  .ant-select-lg{
    width: 150px !important;
  }
  .show{
    display:block;
  }
  .hide{
    display:none;
  }
`;

const BodyWrapper = styled.div`
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

const typeList = [
  { id: 1, name: '作业情况汇总' },
  { id: 2, name: '课程情况汇总' },
  { id: 3, name: '用户情况汇总' },
  { id: 4, name: '题库情况汇总' },
];

const lessonList = [
  { id: 1, name: '1对1' },
  { id: 2, name: '小班课' },
];
const headList = {
  1: ['日期', '布置作业数', '作业使用率', '使用标准作业数', '标准作业使用比例', '作业完成数'],
  2: ['日期', '正式课（节）', '标准课件使用（正式课）', '其他掌门课件（正式课）', '自制课件（正式课）', '测评课（节）', '标准课件使用(测评课）'],
  3: ['日期', '测评课学生', '正式课学生', '全职老师', '兼职老师'],
  4: ['日期', '全部', '未领取', '切割阶段', '录入阶段', '标注阶段', '已入库'],
  5: ['科目名字', '正式课数量', '测评课数量'],
  6: ['科目名字', '正式课数量', '测评课数量', '调试课数量'],
};

const headApiList = {
  1: ['dataDateStr', 'hwAllCount', 'hwAllCountRatio', 'hwUseStandardHwCount', 'hwUseStandardHwCountRatio', 'hwStuFinishOnTimeCount'],
  2: ['dataDateStr', 'regularLesCount', 'regularFormalCsCount', 'regularUserCsCount', 'regularOtherCsCount', 'testLesCount', 'testFormalCsCount'],
  3: ['dataDateStr', 'testLesStuCount', 'regLesStuCount', 'fullTeacherCount', 'partTeacherCount'],
  4: ['dataDateStr', 'qbTotal', 'qbNotReceiveCount', 'qbCutAuditedCount', 'qbEntryAuditedCount', 'qbTagAuditedCount', 'qbStoragedCount'],
  5: ['phaseSubject', 'regularClasses', 'testClasses'],
  6: ['phaseSubject', 'regularClasses', 'testClasses', 'debugClasses'],
};

// const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const dateFormat = 'YYYY-MM-DD';
const now = new Date();
// const defaultEndDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' 23:59:59';
const defaultEndDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
now.setDate(now.getDate() - 7);
// const defaultStartDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' 00:00:00';
const defaultStartDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
export class DataView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) { // eslint-disable-line
    super(props);
  }
  componentDidMount() {
    const params = this.props.params;
    // this.props.dispatch(setDateAction(Immutable.fromJS({ startDate: defaultStartDate, endDate: defaultEndDate })));
    this.props.dispatch(setParamsAction(params.set('startDate', defaultStartDate).set('endDate', defaultEndDate)));
    this.props.dispatch(setTypeAction(Immutable.fromJS(typeList[0])));
    this.props.dispatch(setTypeListAction(Immutable.fromJS(typeList)));
    this.props.dispatch(setSelectLessonType(Immutable.fromJS(lessonList[0])));
    this.props.dispatch(setLessonListAction(Immutable.fromJS(lessonList)));
    this.props.dispatch(getListAction());
    // let myChart = echarts.init(document.getElementById('charts'));
    // let option = {
    //  xAxis: {
    //    type: 'category',
    //    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    //  },
    //  yAxis: {
    //    type: 'value'
    //  },
    //  series: [{
    //    data: [820, 932, 901, 934, 1290, 1330, 1320],
    //    type: 'line'
    //  }]
    // };
    // myChart.setOption(option);
  }
  componentWillReceiveProps(nextProps) {
    console.log('lhj componentwillreceive props dataview', nextProps, this.props);
  }
  render() {
    const list = this.props.list.toJS();
    return (
      <Wrapper>
        <HeaderWrapper>
          <Select style={{ width: 120, height: 'auto' }} size="large" value={{ key: this.props.type.get('id').toString(), label: this.props.type.get('name') }} labelInValue onChange={(value) => this.props.handleTypeSelectOnChange(value, this.props)}>
            {
              this.props.typeList.map((type) =>
                <Select.Option value={type.get('id').toString()} key={type.get('id')} title={type.get('name')}>{type.get('name')}</Select.Option>
              )
            }
          </Select>

          <Select className={this.props.showorhide ? 'show' : 'hide'} style={{ width: 120, height: 'auto', marginLeft: '10px' }} size="large" value={{ key: this.props.selectedLessonType.get('id').toString(), label: this.props.selectedLessonType.get('name') }} labelInValue onChange={(value) => this.props.handleSelectLesson(value, this.props)}>
            {
              this.props.lessonlist.map((type) =>
                <Select.Option value={type.get('id').toString()} key={type.get('id')} title={type.get('name')}>{type.get('name')}</Select.Option>
              )
            }
          </Select>
          <div>
            <span style={{ marginLeft: 10 }}>开始时间：</span>
            <DatePicker
              disabledDate={(startValue) => this.props.disabledStartDate(startValue, this.props)}
              format="YYYY-MM-DD"
              defaultValue={moment(defaultStartDate, dateFormat)}
              placeholder="开始时间"
              onChange={(value, dateString) => this.props.onStartChange(value, dateString, this.props)}
              allowClear={false}
            />
            <span style={{ marginLeft: 10 }}>结束时间：</span>
            <DatePicker
              disabledDate={(endValue) => this.props.disabledEndDate(endValue, this.props)}
              format="YYYY-MM-DD"
              defaultValue={moment(defaultEndDate, dateFormat)}
              placeholder="结束时间"
              onChange={(value, dateString) => this.props.onEndChange(value, dateString, this.props)}
              allowClear={false}
            />
          </div>
          <Button type="primary" onClick={() => this.props.search(this.props)} style={{ marginLeft: '20px' }}>搜索</Button>
          <Button className={this.props.showorhide ? 'show' : 'hide'} type="primary" onClick={() => this.props.exportExcel(this.props)} style={{ marginLeft: '20px' }}>导出</Button>
        </HeaderWrapper>
        <BodyWrapper>
          <FlexRow>共<span className="num">{list.length}</span>条数据</FlexRow>
          <table>
            <thead>
              <tr>
                {

                  headList[this.props.type.get('id')].map((head, idx) =>
                    <th key={idx}>{head}</th>
                  )
                }
              </tr>
            </thead>
            <tbody>
              {
                list.map((item, idx) =>
                  (
                    <tr key={idx}>
                      {
                        headApiList[this.props.type.get('id')].map((key2, idx2) =>
                          <td key={idx2}>{String(key2) === 'dataDateStr' ? item[key2] : (key2 === 'qbTotal' ? (item['qbNotReceiveCount'] + item['qbCutAuditedCount'] +
                            item['qbEntryAuditedCount'] + item['qbTagAuditedCount'] + item['qbStoragedCount']) : item[key2])}</td>
                        )
                      }
                    </tr>
                  )
                )
              }
            </tbody>
          </table>
          {Object.keys(list).length === 0 && <div style={{ display: 'table', margin: 'auto', marginTop: '20px' }}><img src={picNull} role="presentation" /><p style={{ textAlign: 'center', fontSize: '14px', marginTop: '10px' }}>没有数据</p></div>}
          <div id="charts" style={{ width: '100%', height: '300px' }}></div>
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
  search: PropTypes.func.isRequired,
  timeOnChange: PropTypes.func.isRequired,
  onStartChange: PropTypes.func.isRequired,
  onEndChange: PropTypes.func.isRequired,
  disabledStartDate: PropTypes.func.isRequired,
  disabledEndDate: PropTypes.func.isRequired,
  handleSelectLesson: PropTypes.func.isRequired,
  showorhide: PropTypes.bool.isRequired,
  selectedLessonType: PropTypes.instanceOf(Immutable.Map).isRequired,
  lessonlist: PropTypes.instanceOf(Immutable.List).isRequired,
};

const mapStateToProps = createStructuredSelector({
  typeList: makeSelectTypeList(),
  type: makeSelectType(),
  list: makeSelectList(),
  params: makeSelectParams(),
  showorhide: makeSelectShowOrHide(),
  selectedLessonType: makeSelectLessonType(),
  lessonlist: makeSelectLessonList(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    handleTypeSelectOnChange: (value, props) => {
      if (String(value.key) === '5') {
        dispatch(setSelectLessonType(fromJS(lessonList[0])));
        dispatch(setShowOrHideAction(true));
        dispatch(getOneToOneClassAction());
      } else {
        dispatch(setShowOrHideAction(false));
        dispatch(getListAction());
      }
      dispatch(setTypeAction(props.type.set('id', value.key).set('name', value.label)));
    },
    exportExcel(props) {
      const id = Number(props.selectedLessonType.get('id'));
      const params = {
        startDate: moment(props.params.get('startDate')).format('YYYY-MM-DD'),
        endDate: moment(props.params.get('endDate')).format('YYYY-MM-DD'),
      };
      if (id === 1) {
        // 1对1
        const elemIF = document.createElement('iframe');

        elemIF.src = `${Config.trlink}/api/numberOfClassesStatistic/exportOneToOneClassNumberToExcel?startDate=${params.startDate}&endDate=${params.endDate}`;
        elemIF.style.display = 'none';
        document.body.appendChild(elemIF);
      } else if (id === 2) {
        // 小班课
        const elemIF = document.createElement('iframe');
        elemIF.src = `${Config.trlink}/api/numberOfClassesStatistic/exportLittleClassNumberToExcel?startDate=${params.startDate}&endDate=${params.endDate}`;
        elemIF.style.display = 'none';
        document.body.appendChild(elemIF);
      }
    },
    handleSelectLesson: (value, props) => {
    },
    search: (props) => {
      const startDate = moment(props.params.get('startDate'));
      const endDate = moment(props.params.get('endDate'));
      const id = Number(props.selectedLessonType.get('id'));
      if (props.showorhide) {

        if (id === 1) {
          dispatch(getOneToOneClassAction());
        } else if (id === 2) {
          dispatch(getSmallClassAction());
        }
        return;
      }
      const diff = endDate.diff(startDate, 'days', true);
      let diffAdd = 1;
      const dateStringArr = props.params.get('startDate').split('-');
      if (dateStringArr[1].length === 2 && dateStringArr[2].length === 2) {
        diffAdd = 0;
      }
      dispatch(setParamsAction(props.params.set('pageSize', diff + diffAdd)));
      dispatch(getListAction());
    },
    timeOnChange: (value, dateString, props) => {
      // props.dispatch(setDateAction(Immutable.fromJS({ startDate: dateString[0], endDate: dateString[1] })));
      dispatch(setParamsAction(props.params.set('startDate', dateString[0]).set('endDate', dateString[1])));
    },
    onStartChange: (value, dateString, props) => {
      // const dateStringArr = dateString.split('-');
      // if (dateStringArr[1].indexOf('0') !== 0 && dateStringArr[2].indexOf('0') !== 0) {
      //   dateString = dateStringArr[0] + '-' + dateStringArr[1] + '-' + (parseInt(dateStringArr[2]) - 1);
      // } else {
      //   dateString = dateStringArr[0] + '-' + dateStringArr[1].replace(/0(\d)/, '$1') + '-' + dateStringArr[2].replace(/0(\d)/, '$1');
      // }
      // console.log('dateString',dateString);
      dispatch(setParamsAction(props.params.set('startDate', dateString)));
    },
    onEndChange: (value, dateString, props) => {
      const dateStringArr = dateString.split('-');
      dateString = dateStringArr[0] + '-' + dateStringArr[1].replace(/0(\d)/, '$1') + '-' + dateStringArr[2].replace(/0(\d)/, '$1'); // eslint-disable-line
      // console.log('dateString',dateString);
      dispatch(setParamsAction(props.params.set('endDate', dateString)));
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DataView);
