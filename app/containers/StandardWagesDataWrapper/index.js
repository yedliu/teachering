/*
 *
 * StandardWagesDataWrapper
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import moment from 'moment';
import Immutable, { fromJS } from 'immutable';
import { Config } from 'utils/config';
import { Button, DatePicker, Input, Pagination, Spin } from 'antd';
import makeSelectStandardWagesDataWrapper, {
  makeCurrentPageNumberValue,
  makeLoadingState,
  makeSalaryDataData,
  makeSearchMobileValue,
  makeSearchNameValue,
  makeSelectDate,
  makeTotalCountValue,
  makePersonalTableMsg,
  makeSelectedDate
} from './selectors';
import {
  getSalaryDetailAction,
  getSalaryDtaAction,
  handleSelected,
  setCurrentPageNumberAction,
  setSearchMobileValueAction,
  setSearchNameValueAction,
  setSelectSalaryItemAction,
  showDataModalOpenAction,
  setPersonalMsgAction
} from './actions';
import {
  Header,
  RootDiv,
  SelectBox,
} from 'containers/StandardWagesManagement';
import { PAGE_SIZE } from './constants';
import DataModal from './DataModal';

const HeaderItem = styled(SelectBox)`
  width: 200px;
  margin-right: 20px;
`;
const Tips = styled.b`
  font-size: 15px;
  display: inline-block;
  margin: 15px 40px 5px 0;
`;
const TableBox = styled.table`
  width: 100%;
  margin-bottom: 10px;
  tr {
    height: 40px;
    text-align: center;
  }
  tbody tr:hover {
    background-color: rgb(236, 246, 253);
  }
  thead tr {
    background-color: rgb(247, 247, 247);
  }
  td,
  th {
    border: 1px solid #ddd;
  }
`;

export class StandardWagesDataWrapper extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.onSendOutDataAction = this.onSendOutDataAction.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.showIdCardAction = this.showIdCardAction.bind(this);
    this.showBackInfoAction = this.showBackInfoAction.bind(this);
    this.setSelectSalaryItem = this.setSelectSalaryItem.bind(this);
  }
  componentDidMount() {
    this.props.dispatch(setCurrentPageNumberAction(1));
    // this.props.dispatch(getSalaryDtaAction());
    this.props.dispatch(
      handleSelected(
        'startDate',
        moment(new Date(moment().year(), moment().month(), 1))
      )
    );
    this.props.dispatch(
      handleSelected('endDate', moment({ hour: 23, minute: 59, seconds: 59 }))
    );
    this.props.dispatch(getSalaryDtaAction());
  }

  setSelectSalaryItem(item, tag) {
    const { dispatch, personalTableMsg } = this.props;
    this.props.dispatch(setSelectSalaryItemAction(item || fromJS({})));
    if (tag === 3) {
      dispatch(
        setPersonalMsgAction(
          personalTableMsg.set('workerUserId', item.get('createdUser'))
        )
      );
      setTimeout(() => {
        this.props.dispatch(getSalaryDetailAction());
        this.props.dispatch(
          showDataModalOpenAction(
            fromJS({ isOpen: true, title: '薪资明细', tag })
          )
        );
      }, 30);
    } else {
      this.props.dispatch(
        showDataModalOpenAction(
          fromJS({ isOpen: true, title: '银行卡信息', tag })
        )
      );
    }
  }

  onSendOutDataAction() {
    console.log('导数据');
    const year = this.props.selectDate.format('YYYY');
    const month = this.props.selectDate.format('M');
    const userName = this.props.searchName;
    const mobile = this.props.searchMobile;
    const pageIndex = this.props.currentPageIndex;
    // const url = `${Config.trlink_qb}/api/salaryRecord/downloadExcel`;
    window.open(
      `${
        Config.trlink_qb
      }/api/salaryRecord/downloadExcel?year=${year}&month=${month}&pageSize=10&pageIndex=${pageIndex}&userName=${userName}&mobile=${mobile}`
    );
    // try{
    //   const repos = request(url,Object.assign({},getjsonoptions()),{year,month,pageSize:10,pageIndex,userName,mobile});
    //   repos.then((respnse)=>{
    //     console.log('导数据-success')
    //   }).catch((e) =>{
    //     console.log('导数据-error1');
    //   })
    // }catch (e){
    //   console.log('导数据-error');
    // }
  }

  handlePaginationChange(pagination) {
    console.log('>>>', pagination);
    this.props.dispatch(setCurrentPageNumberAction(pagination));
    this.props.dispatch(getSalaryDtaAction());
  }

  showIdCardAction() {
    this.props.dispatch(
      showDataModalOpenAction(
        fromJS({ isOpen: true, title: '身份证信息', tag: 1 })
      )
    );
  }

  showBackInfoAction() {
    this.props.dispatch(
      showDataModalOpenAction(
        fromJS({ isOpen: true, title: '银行卡信息', tag: 2 })
      )
    );
  }

  showWorkloadDetailAction() {
    this.props.dispatch(
      showDataModalOpenAction(
        fromJS({ isOpen: true, title: '查看明细', tag: 3 })
      )
    );
  }

  render() {
    const { salaryData, selecteddata } = this.props;
    // console.log('selecteddata', selecteddata);
    const salaryDataList = salaryData.getIn(['page', 'list']) || fromJS([]);
    return (
      <RootDiv>
        <Header>
          <HeaderItem style={{ width: 500 }}>
            <span style={{ minWidth: 60 }}>开始时间：</span>
            <DatePicker
              style={{ marginRight: 10 }}
              allowClear={false}
              value={moment(selecteddata.get('startDate'), 'YYYY/MM/DD')}
              size="default"
              format="YYYY/MM/DD"
              onChange={date => {
                this.props.dispatch(handleSelected('startDate', date));
              }}
            />
            <span style={{ minWidth: 60 }}>结束时间：</span>
            <DatePicker
              size="default"
              format="YYYY/MM/DD"
              allowClear={false}
              value={moment(selecteddata.get('endDate'), 'YYYY/MM/DD')}
              onChange={date => {
                this.props.dispatch(handleSelected('endDate', date));
              }}
            />
          </HeaderItem>
          <HeaderItem>
            <Input
              placeholder="请输入手机"
              value={this.props.searchMobile}
              onChange={e => {
                this.props.dispatch(setSearchMobileValueAction(e.target.value));
              }}
            />
          </HeaderItem>
          <HeaderItem>
            <Input
              placeholder="请输入姓名"
              value={this.props.searchName}
              onChange={e => {
                this.props.dispatch(setSearchNameValueAction(e.target.value));
              }}
            />
          </HeaderItem>
          <HeaderItem>
            <Button
              type={'primary'}
              style={{ marginRight: '30px' }}
              onClick={() => {
                this.props.dispatch(getSalaryDtaAction());
              }}
            >
              查询
            </Button>
          </HeaderItem>
        </Header>
        <Spin spinning={this.props.loadingState}>
          <Tips>试卷套数:{salaryData.get('epCount')}</Tips>
          <Tips>题目总量:{salaryData.get('questionCount')}</Tips>
          <Tips>复合题总量:{salaryData.get('complexCount')}</Tips>
          <TableBox>
            <thead>
              <tr>
                <th>姓名</th>
                <th>角色</th>
                <th>手机号</th>
                <th>身份证号</th>
                <th>银行卡信息</th>
                <th>工资总额</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {salaryDataList.count() > 0 ? (
                salaryDataList.map((item, index) => (
                  <tr key={index}>
                    <td>{item.get('username') || '-'}</td>
                    <td>{item.get('roleName') || '-'}</td>
                    <td>{item.get('mobile') || '-'}</td>
                    <td>
                      <a
                        href="#"
                        onClick={() =>
                            this.setSelectSalaryItem(
                              item.get('userSalaryAccountOutputDTO'),
                              1
                            )
                          }
                      >
                          点击查看
                        </a>
                    </td>
                    <td>
                      <a
                        href="#"
                        onClick={() =>
                            this.setSelectSalaryItem(
                              item.get('userSalaryAccountOutputDTO'),
                              2
                            )
                          }
                      >
                          点击查看
                        </a>
                    </td>
                    <td>{item.get('salary') || '-'}</td>
                    <td>
                      <a
                        href="#"
                        onClick={() => this.setSelectSalaryItem(item, 3)}
                      >
                          查看明细
                        </a>
                    </td>
                  </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="8">暂无数据</td>
                </tr>
              )}
            </tbody>
          </TableBox>
        </Spin>
        {salaryDataList.count() > 0 ? (
          <Pagination
            pageSize={PAGE_SIZE}
            style={{ margin: '0 auto' }}
            current={this.props.currentPageIndex}
            total={this.props.salaryTotalNumber}
            onChange={this.handlePaginationChange}
          />
        ) : (
          ''
        )}
        <DataModal />
      </RootDiv>
    );
  }
}

StandardWagesDataWrapper.propTypes = {
  dispatch: PropTypes.func.isRequired,
  // selectDate:PropTypes.instanceOf(Immutable.Map).isRequired,
  selectDate: PropTypes.object.isRequired,
  salaryData: PropTypes.instanceOf(Immutable.Map).isRequired,
  salaryTotalNumber: PropTypes.number.isRequired,
  currentPageIndex: PropTypes.number.isRequired,
  loadingState: PropTypes.bool.isRequired,
  searchMobile: PropTypes.string.isRequired,
  searchName: PropTypes.string.isRequired,
  personalTableMsg: PropTypes.instanceOf(Immutable.Map).isRequired
};

const mapStateToProps = createStructuredSelector({
  StandardWagesDataWrapper: makeSelectStandardWagesDataWrapper(),
  selectDate: makeSelectDate(),
  salaryData: makeSalaryDataData(),
  salaryTotalNumber: makeTotalCountValue(),
  currentPageIndex: makeCurrentPageNumberValue(),
  loadingState: makeLoadingState(),
  searchMobile: makeSearchMobileValue(),
  searchName: makeSearchNameValue(),
  personalTableMsg: makePersonalTableMsg(),
  selecteddata: makeSelectedDate()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StandardWagesDataWrapper);
