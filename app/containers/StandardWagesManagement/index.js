/*
 *
 * StandardWagesManagement
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import Immutable, { fromJS } from 'immutable';
import {
  FlexRowDiv,
  FlexColumnDiv,
} from 'components/Div';
import { Select, Button, Modal, Table, InputNumber, Form } from 'antd';
import makeSelectStandardWagesManagement, {
  makeSelectLevelValue,
  makeOperateModalOpen,
  makeSelectOperateItem,
  makeSubjectList,
  makeSelectSubjectValue,
  makeSalaryConfigList
} from './selectors';
import {
  setSelectLevelValueAction,
  setOperateModalOpenAction,
  setSelectOperateItemAction,
  setOperateWagesItemFieldAction,
  getSubjectsAction,
  setSelectSubjectAction,
  getSalaryConfigListAction,
  operateSalaryConfigItemAction
} from './actions';
const Option = Select.Option;
const createForm = Form.create;
const FormItem = Form.Item;
export const RootDiv = styled(FlexColumnDiv)`
  width: 100%;
  height: 100;
  background: #fff;
  padding: 20px;
  overflow-y: auto;
`;
export const Header = styled(FlexRowDiv)`
  min-height: 30px;
`;
export const SelectBox = styled(FlexRowDiv)`
  width: 150px;
  align-items: center;
`;
export const TableDiv = styled(FlexColumnDiv)`
  margin-top: 30px;
`;
const FormContent = styled(FlexRowDiv)`
  width: 500px;
  margin-top: 20px;
  flex-wrap: wrap;
`;
const ItemDiv = styled(FlexRowDiv)`
  width: 250px;
`;
const FormItemName = styled.span`
  display: inline-block;
  width: 90px;
  text-align: right;
`;
const LevelData = [
  { label: '小学', value: 1 },
  { label: '初一/初二', value: 2 },
  { label: '中考', value: 3 },
  { label: '高一/高二', value: 4 },
  { label: '高考', value: 5 }
];

export class StandardWagesManagement extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.makeOperateModal = this.makeOperateModal.bind(this);
    this.onSaveOperateAction = this.onSaveOperateAction.bind(this);
  }
  componentDidMount() {
    this.props.dispatch(getSubjectsAction());
    // this.props.dispatch(getSalaryConfigListAction());
  }
  onSaveOperateAction() {
    this.props.form.validateFields((error, value) => {
      if (!error) {
        console.log('sss', this.props.selectOperateItem.toJS());
        this.props.dispatch(operateSalaryConfigItemAction());
      } else {
        console.log('error');
      }
    });
  }
  makeOperateModal() {
    const levelName = LevelData.map(item => item.label);
    const { getFieldDecorator } = this.props.form;
    const rules = {
      required: true,
      message: '此项为必填,且值大于等于0',
      pattern: /^(?:[1-9]\d*|0)(?:\.\d+)?$/
    };
    return (
      <Modal
        title="价格配置"
        maskClosable={false}
        visible={this.props.operateModalOpen}
        onCancel={() => this.props.dispatch(setOperateModalOpenAction(false))}
        onOk={this.onSaveOperateAction}
        okText="保存"
      >
        <Header>
          <SelectBox>
            <span>阶段：</span>
            <span>
              {levelName[this.props.selectOperateItem.get('stage') - 1]}
            </span>
          </SelectBox>
          <SelectBox>
            <span>学科：</span>
            <span>{this.props.selectOperateItem.get('subject')}</span>
          </SelectBox>
          <SelectBox>
            <span>题型：</span>
            <span>{this.props.selectOperateItem.get('questionTypeName')}</span>
          </SelectBox>
        </Header>
        <FormContent>
          <ItemDiv>
            <FormItem>
              <FormItemName>切题：</FormItemName>
              {getFieldDecorator('cutUnitPrice', {
                rules: [rules],
                onChange: val => {
                  this.props.dispatch(
                    setOperateWagesItemFieldAction('cutUnitPrice', val)
                  );
                }
              })(<InputNumber step="0.1" />)}
              <span>元/道</span>{' '}
            </FormItem>
          </ItemDiv>
          <ItemDiv>
            <FormItem>
              <FormItemName>切题审核：</FormItemName>
              {getFieldDecorator('cutAuditUnitPrice', {
                rules: [rules],
                onChange: val => {
                  this.props.dispatch(
                    setOperateWagesItemFieldAction('cutAuditUnitPrice', val)
                  );
                }
              })(<InputNumber step="0.1" />)}
              <span>元/道</span>{' '}
            </FormItem>
          </ItemDiv>
          <ItemDiv>
            <FormItem>
              <FormItemName>录入：</FormItemName>
              {getFieldDecorator('entryUnitPrice', {
                rules: [rules],
                onChange: val => {
                  this.props.dispatch(
                    setOperateWagesItemFieldAction('entryUnitPrice', val)
                  );
                }
              })(<InputNumber step="0.1" />)}
              <span>元/道</span>{' '}
            </FormItem>
          </ItemDiv>
          <ItemDiv>
            <FormItem>
              <FormItemName>录入审核：</FormItemName>
              {getFieldDecorator('entryAuditUnitPrice', {
                rules: [rules],
                onChange: val => {
                  this.props.dispatch(
                    setOperateWagesItemFieldAction('entryAuditUnitPrice', val)
                  );
                }
              })(<InputNumber step="0.1" />)}
              <span>元/道</span>{' '}
            </FormItem>
          </ItemDiv>
          <ItemDiv>
            <FormItem>
              <FormItemName>贴标签：</FormItemName>
              {getFieldDecorator('tagUnitPrice', {
                rules: [rules],
                onChange: val => {
                  this.props.dispatch(
                    setOperateWagesItemFieldAction('tagUnitPrice', val)
                  );
                }
              })(<InputNumber step="0.1" />)}
              <span>元/道</span>{' '}
            </FormItem>
          </ItemDiv>
          <ItemDiv>
            <FormItem>
              <FormItemName>贴标签入审核：</FormItemName>
              {getFieldDecorator('tagAuditUnitPrice', {
                rules: [rules],
                onChange: val => {
                  this.props.dispatch(
                    setOperateWagesItemFieldAction('tagAuditUnitPrice', val)
                  );
                }
              })(<InputNumber step="0.1" />)}
              <span>元/道</span>{' '}
            </FormItem>
          </ItemDiv>
          <ItemDiv>
            <FormItem>
              <FormItemName>终审：</FormItemName>
              {getFieldDecorator('finalAuditUnitPrice', {
                rules: [rules],
                onChange: val => {
                  this.props.dispatch(
                    setOperateWagesItemFieldAction('finalAuditUnitPrice', val)
                  );
                }
              })(<InputNumber step="0.1" />)}
              <span>元/道</span>{' '}
            </FormItem>
          </ItemDiv>
        </FormContent>
      </Modal>
    );
  }
  render() {
    const columns = [
      {
        title: '题型/操作',
        dataIndex: 'questionTypeName',
        render: text => (text ? text : '-')
      },
      {
        title: '切题',
        dataIndex: 'cutUnitPrice',
        render: text => `${text}元/道`
      },
      {
        title: '切割审核',
        dataIndex: 'cutAuditUnitPrice',
        render: text => `${text}元/道`
      },
      {
        title: '录入',
        dataIndex: 'entryUnitPrice',
        render: text => `${text}元/道`
      },
      {
        title: '录入审核',
        dataIndex: 'entryAuditUnitPrice',
        render: text => `${text}元/道`
      },
      {
        title: '贴标签',
        dataIndex: 'tagUnitPrice',
        render: text => `${text}元/道`
      },
      {
        title: '贴标签审核',
        dataIndex: 'tagAuditUnitPrice',
        render: text => `${text}元/道`
      },
      {
        title: '终审',
        dataIndex: 'finalAuditUnitPrice',
        render: text => `${text}元/道`
      },
      {
        title: '操作',
        dataIndex: '',
        render: (state, record, index) => (
          <a
            href="#"
            onClick={() => {
              this.props.dispatch(setSelectOperateItemAction(fromJS(record)));
              this.props.dispatch(setOperateModalOpenAction(true));
            }}
          >
            编辑
          </a>
        )
      }
    ];
    return (
      <RootDiv>
        <Header>
          <SelectBox>
            <span>阶段：</span>
            <Select
              style={{ width: '100px' }}
              value={`${this.props.selectLevelValue}`}
              onChange={val =>
                this.props.dispatch(setSelectLevelValueAction(parseInt(val, 10)))
              }
            >
              {LevelData.map((item, index) => (
                <Option key={index} value={`${item.value}`}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </SelectBox>
          <SelectBox>
            <span>学科：</span>
            <Select
              style={{ width: '100px' }}
              value={this.props.selectSubjectValue}
              onChange={val => this.props.dispatch(setSelectSubjectAction(val))}
            >
              {this.props.subjectList.map((item, index) => (
                <Option key={index} value={item.get('name')}>
                  {item.get('name')}
                </Option>
              ))}
            </Select>
          </SelectBox>
          <Button
            type={'primary'}
            onClick={() => {
              this.props.dispatch(getSalaryConfigListAction());
            }}
          >
            查询
          </Button>
        </Header>
        <TableDiv>
          <Table
            columns={columns}
            rowKey={record => record.id}
            dataSource={this.props.salaryConfigList.toJS()}
            pagination={false}
          />
        </TableDiv>
        {this.makeOperateModal()}
      </RootDiv>
    );
  }
}

StandardWagesManagement.propTypes = {
  dispatch: PropTypes.func.isRequired,
  selectLevelValue: PropTypes.number.isRequired,
  operateModalOpen: PropTypes.bool.isRequired,
  selectOperateItem: PropTypes.instanceOf(Immutable.Map).isRequired,
  subjectList: PropTypes.instanceOf(Immutable.List).isRequired,
  selectSubjectValue: PropTypes.string.isRequired,
  salaryConfigList: PropTypes.instanceOf(Immutable.List).isRequired
};

const mapStateToProps = createStructuredSelector({
  StandardWagesManagement: makeSelectStandardWagesManagement(),
  selectLevelValue: makeSelectLevelValue(),
  operateModalOpen: makeOperateModalOpen(),
  selectOperateItem: makeSelectOperateItem(),
  subjectList: makeSubjectList(),
  selectSubjectValue: makeSelectSubjectValue(),
  salaryConfigList: makeSalaryConfigList()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}
const StandardWagesManagementWrapper = createForm({
  onFieldsChange: (props, validField) => {},
  mapPropsToFields: props => {
    return {
      cutUnitPrice: { value: props.selectOperateItem.get('cutUnitPrice') || 0 },
      cutAuditUnitPrice: {
        value: props.selectOperateItem.get('cutAuditUnitPrice') || 0
      },
      entryUnitPrice: { value: props.selectOperateItem.get('entryUnitPrice') },
      entryAuditUnitPrice: {
        value: props.selectOperateItem.get('entryAuditUnitPrice')
      },
      tagUnitPrice: { value: props.selectOperateItem.get('tagUnitPrice') },
      tagAuditUnitPrice: {
        value: props.selectOperateItem.get('tagAuditUnitPrice')
      },
      finalAuditUnitPrice: {
        value: props.selectOperateItem.get('finalAuditUnitPrice')
      }
    };
  }
})(StandardWagesManagement);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StandardWagesManagementWrapper);
