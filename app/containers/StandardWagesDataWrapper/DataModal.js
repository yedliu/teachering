/**
 * Created by DELL02 on 2018/2/28.
 */
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
import {
  FlexRowDiv,
} from 'components/Div';
import { FlexCenter } from 'components/FlexBox';
import { Modal, Table, Pagination } from 'antd';
import {
  makeDataModalOpenValue,
  makeSelectSalaryDetail,
  makeSelectSalaryItem,
  makePersonalTableMsg
} from './selectors';
import {
  showDataModalOpenAction,
  setPersonalMsgAction,
  getSalaryDetailAction
} from './actions';

const TagTitle = {
  1: '身份证信息',
  2: '银行卡信息',
  3: '工资明细'
};

const TableDiv = styled(FlexRowDiv)`
  tbody {
    text-align: center;
  }
  .ant-table-thead {
    th {
      text-align: center;
    }
  }
`;

const operationTypeEnum = {
  1: '切割',
  2: '切割审核',
  3: '录入',
  4: '录入审核',
  5: '贴标签',
  6: '贴标签审核',
  7: '系统判定切割逾期',
  8: '系统判定录入逾期',
  9: '系统判定贴标签逾期',
  10: '终审',
  11: '强制释放'
};
const stateEnum = {
  1: '通过',
  2: '未通过'
};
export class DataModal extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.makeContent = this.makeContent.bind(this);
    this.pageChange = this.pageChange.bind(this);
  }

  pageChange(current, size) {
    const { dispatch, personalTableMsg } = this.props;
    dispatch(
      setPersonalMsgAction(personalTableMsg.set('currentPageNumber', current))
    );
    setTimeout(() => {
      this.props.dispatch(getSalaryDetailAction());
    }, 30);
  }

  makeContent() {
    const { selectSalaryItem, personalTableMsg } = this.props;
    // 展示身份证
    const makeIdCardInfo = () => {
      const columns = [
        {
          title: '姓名',
          dataIndex: 'name',
          render: text => (text ? text : '-')
        },
        {
          title: '身份证号码',
          dataIndex: 'idCard',
          render: text => (text ? text : '-')
        }
      ];
      return (
        <TableDiv>
          <Table
            columns={columns}
            style={{ width: '100%' }}
            rowKey={record => record.idCardNumber}
            dataSource={[
              {
                id: selectSalaryItem.get('id'),
                name: selectSalaryItem.get('bankAccountUsername'),
                idCard: selectSalaryItem.get('idCardNumber'),
                key: toString(selectSalaryItem.get('id'))
              }
            ]}
            pagination={false}
          />
        </TableDiv>
      );
    };
    // 展示银行信息
    const makeBankInfo = () => {
      const columns = [
        {
          title: '姓名',
          dataIndex: 'name',
          render: text => (text ? text : '-')
        },
        {
          title: '银行卡号码',
          dataIndex: 'bankId',
          render: text => (text ? text : '-')
        },
        {
          title: '开户行',
          dataIndex: 'bankName',
          render: text => (text ? text : '-')
        },
        {
          title: '开户地点',
          dataIndex: 'address',
          render: text => (text ? text : '-')
        },
        {
          title: '预留电话',
          dataIndex: 'mobile',
          render: text => (text ? text : '-')
        }
      ];
      const result = {
        id: selectSalaryItem.get('id'),
        name: selectSalaryItem.get('bankAccountUsername'),
        bankId: selectSalaryItem.get('bankAccount'),
        bankName: selectSalaryItem.get('bankName'),
        address: `${selectSalaryItem.get('bankProvince') ||
          ''}-${selectSalaryItem.get('bankBranch') || ''}`,
        mobile: selectSalaryItem.get('bankAccountMobile'),
        key: toString(selectSalaryItem.get('id'))
      };
      return (
        <TableDiv>
          <Table
            columns={columns}
            style={{ width: '100%' }}
            // rowKey={record => record.idCardNumber}
            dataSource={[result]}
            pagination={false}
          />
        </TableDiv>
      );
    };
    // 查看薪资明细
    const makeSalaryListDetail = () => {
      // 查看大致薪资
      const { selectSalaryDetail } = this.props;
      const list = selectSalaryDetail.get('list') || fromJS([]);
      const countChildPassNum = child => {
        let all = 0;
        child.forEach(it => {
          if (`${it.state}` === '1') {
            all++;
          }
        });
        return all;
      };
      const columns = [
        {
          title: '试卷名称',
          dataIndex: 'epName',
          width: 140,
          render: text => (text ? text : '-')
        },
        {
          title: '审核通过题目数量',
          dataIndex: 'questionAmount',
          width: 140,
          render: child => countChildPassNum(child)
        },
        {
          title: '操作',
          dataIndex: 'operationType',
          width: 140,
          render: text => (text ? operationTypeEnum[String(text)] : '-')
        },
        {
          title: '通过/完成时间',
          dataIndex: 'takeEffectTime',
          width: 140,
          render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm') : '-')
        },
        {
          title: '薪资总额',
          dataIndex: 'salary',
          width: 140,
          render: text => (text ? text : '-')
        }
      ];
      const tableData = list.toJS().map(item => {
        return {
          epName: item.epName,
          questionAmount: item.children,
          operationType: item.operationType,
          takeEffectTime: item.takeEffectTime,
          salary: item.salary,
          id: item.id
        };
      });
      // 具体审核明细
      const expandedRowRender = (record, index) => {
        const children = list.getIn([index, 'children']);
        console.log('curItem', record, children.toJS());
        const columns = [
          { title: '题目编号', dataIndex: 'questionId' },
          {
            title: '通过/未通过',
            dataIndex: 'state',
            render: state => stateEnum[String(state)]
          },
          {
            title: '完成时间',
            dataIndex: 'updatedTime',
            render: time =>
              (time ? moment(time).format('YYYY-MM-DD HH:mm') : '-')
          },
          { title: '薪资明细', dataIndex: 'salary' },
          { title: '备注', dataIndex: 'remarks' }
        ];
        const data = [];
        children &&
          children.forEach(it => {
            data.push({
              questionId: it.get('questionId'),
              state: it.get('state'),
              updatedTime: it.get('updatedTime'),
              salary: it.get('salary'),
              remarks: it.get('remarks') || '-'
            });
          });
        return (
          <Table
            columns={columns}
            dataSource={data}
            rowKey={record => record.id}
            pagination={false}
          />
        );
      };
      return (
        <div>
          {list.count() > 0 ? (
            <Table
              columns={columns}
              style={{ width: '100%' }}
              scroll={{ y: 300 }}
              rowKey={record => record.id}
              expandedRowRender={expandedRowRender}
              dataSource={tableData}
              pagination={false}
            />
          ) : (
            ''
          )}
          <FlexCenter style={{ minHeight: 36 }}>
            <Pagination
              total={personalTableMsg.get('total')}
              current={personalTableMsg.get('currentPageNumber')}
              pageSize={personalTableMsg.get('size')}
              onChange={this.pageChange}
            />
          </FlexCenter>
        </div>
      );
    };
    if (this.props.modalOpen.get('tag') === 1) {
      return makeIdCardInfo();
    } else if (this.props.modalOpen.get('tag') === 2) {
      return makeBankInfo();
    } else if (this.props.modalOpen.get('tag') === 3) {
      return makeSalaryListDetail();
    }
    return <div>...</div>;
  }

  render() {
    const { dispatch, personalTableMsg } = this.props;
    return (
      <Modal
        visible={this.props.modalOpen.get('isOpen')}
        title={TagTitle[this.props.modalOpen.get('tag')]}
        footer={null}
        width={900}
        maskClosable={false}
        onCancel={() => {
          dispatch(
            setPersonalMsgAction(personalTableMsg.set('currentPageNumber', 1))
          );
          dispatch(
            showDataModalOpenAction(
              fromJS({ isOpen: false, title: '', tag: 1 })
            )
          );
        }}
      >
        {this.makeContent()}
      </Modal>
    );
  }
}

// selectDate:PropTypes.instanceOf(Immutable.Map).isRequired,
DataModal.propTypes = {
  dispatch: PropTypes.func.isRequired,
  modalOpen: PropTypes.instanceOf(Immutable.Map).isRequired,
  selectSalaryItem: PropTypes.instanceOf(Immutable.Map).isRequired,
  personalTableMsg: PropTypes.instanceOf(Immutable.Map).isRequired
};

const mapStateToProps = createStructuredSelector({
  modalOpen: makeDataModalOpenValue(),
  selectSalaryItem: makeSelectSalaryItem(),
  selectSalaryDetail: makeSelectSalaryDetail(),
  personalTableMsg: makePersonalTableMsg()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataModal);
