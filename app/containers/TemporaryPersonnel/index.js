/* eslint-disable no-empty-function */
/*
 *
 * TemporaryPersonnel
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import moment from 'moment';
import { fromJS } from 'immutable';
import {
  Form,
  Input,
  Select,
  Button,
  Tag,
  Modal,
  Table,
  message,
  Checkbox,
} from 'antd';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
import { FlexColumn, FlexRow } from '../../components/FlexBox';

import makeSelectTemporaryPersonnel, {
  makeSelectModalShow,
  makeSelectInputDTO,
  makeSelectTableData,
  makeSelectPagination,
  makeSelectAuthority,
  makeSelectRoles,
  makeSelectQueryParam,
  makeSelectEditId,
  makeSelectAddingMode,
} from './selectors';
import {
  setModalAction,
  setInputDTO,
  setPainationAction,
  getDataAction,
  getAuthorityList,
  getRoleList,
  submitAction,
  setQueryParams,
  setEditId,
  setAddingMode,
  submitEditAction,
  resetPasswordAction,
  getOneUser,
} from './actions';
const Wrapper = styled(FlexColumn)`
  width: 100%;
  background-color: #fff;
`;
const BodyWrapper = styled(FlexColumn)`
  background-color: #fff;
  margin: 0 20px;
  overflow: auto;
`;
const MargRItem = styled.div`
  margin-right: 15px;
`;
const NewSpan = styled.span`
  margin-left: 5px;
  font-size: 16px;
  color: red;
  font-weight: 700;
  font-style: italic;
`;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 }
};
const formItemLayoutL = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
};

const OperationTdStyle = styled(FlexRow)``;

export class TemporaryPersonnel extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      createTime: '',
      showAllMap: {},
    };
  }
  componentDidMount() {
    this.props.dispatch(getDataAction());
    this.props.dispatch(getAuthorityList());
    this.props.dispatch(getRoleList());
  }
  showAll = id => {
    const { showAllMap, update } = this.state;
    showAllMap[id] = !showAllMap[id];
    this.setState({
      showAllMap,
      update: !update
    });
  };
  render() {
    const { data, pagination, queryParams, allRoles, addingMode } = this.props;
    const roleOptions = allRoles.filter((role) => role.get('type') === 2).toJS().map(e => (
      <Select.Option key={e.id} value={(e.id || '').toString()}>
        {e.name}
      </Select.Option>
    ));
    const { showAllMap } = this.state;
    this.columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        render: (val, record) => {
          if (
            (record.roleList && record.roleList.length === 0) ||
            (record.phaseSubjectList && record.phaseSubjectList.length === 0)
          ) {
            return (
              <FlexRow style={{ alignItems: 'center' }}>
                {val}
                <NewSpan>new</NewSpan>
              </FlexRow>
            );
          } else {
            return val;
          }
        },
        width: '15%',
      },
      {
        title: '电话',
        dataIndex: 'mobile',
        render: val => val || '-',
        width: '15%',
      },
      {
        title: '角色',
        dataIndex: 'roleList',
        render: val => {
          if (val && val[0]) {
            return val[0].name || '';
          } else {
            return '--';
          }
        },
        width: '15%',
      },
      {
        title: '学科',
        dataIndex: 'phaseSubjectList',
        render: (val, record) => {
          let over = false;
          let myShowAll = showAllMap[record.id];
          let showVal = [];
          if (val && val.length > 8) {
            over = true;
          }
          if (over && myShowAll) {
            showVal = val;
          } else {
            showVal = val.slice(0, 8);
          }
          return (
            <span>
              <span>
                {showVal.map(e =>
                  (e ? (
                    <Tag style={{ margin: '4px' }} color="green" key={e.id}>
                      {e.name}
                    </Tag>
                  ) : null)
                )}
              </span>
              {over ? (
                <a onClick={() => this.showAll(record.id)}>
                  {myShowAll ? '^收起' : '查看全部'}
                </a>
              ) : (
                  ''
                )}{' '}
              {/* 超出了而且没显示全部才显示这几个字 */}
            </span>
          );
        },
        width: '40%',
      },
      {
        title: '操作',
        dataIndex: '',
        render: (val, record) => {
          if (
            (record.roleList && record.roleList.length === 0) ||
            (record.phaseSubjectList && record.phaseSubjectList.length === 0)
          ) {
            return (
              <OperationTdStyle>
                <Button
                  type="primary"
                  onClick={() => {
                    this.props.editRecord(this.props, record);
                    this.setState({
                      createTime: moment(record.createdTime).format(
                        'YYYY-MM-DD',
                      ),
                    });
                  }}
                >
                  配置角色权限
                </Button>
                <Button
                  style={{ marginLeft: 5 }}
                  onClick={() => {
                    this.props.resetPassword(this.props, record);
                  }}
                >
                  重置密码
                </Button>
              </OperationTdStyle>
            );
          } else {
            return (
              <OperationTdStyle>
                <Button
                  type="primary"
                  onClick={() => {
                    this.props.editRecord(this.props, record);
                    this.setState({
                      createTime: moment(record.createdTime).format(
                        'YYYY-MM-DD',
                      ),
                    });
                  }}
                >
                  修改
                </Button>
                <Button
                  style={{ marginLeft: 5 }}
                  onClick={() => {
                    this.props.resetPassword(this.props, record);
                  }}
                >
                  重置密码
                </Button>
              </OperationTdStyle>
            );
          }
        },
        width: '20%',
      },
    ];
    return (
      <Wrapper>
        <BodyWrapper>
          <FlexColumn style={{ padding: '20px 0' }}>
            <FlexRow style={{ flex: 0, flexShrink: 0 }}>
              <MargRItem>
                <span>人员角色：</span>
                <Select
                  value={queryParams.get('roleId') || void 0}
                  style={{ minWidth: 150 }}
                  placeholder="请选择人员角色"
                  allowClear
                  onChange={e =>
                    this.props.queryChange(this.props, 'roleId', e)
                  }
                >
                  {roleOptions}
                </Select>
              </MargRItem>
              <MargRItem>
                <span>姓名：</span>
                <Input
                  style={{ width: 120 }}
                  value={queryParams.get('name') || void 0}
                  placeholder="请输入姓名"
                  onChange={e =>
                    this.props.queryChange(this.props, 'name', e.target.value)
                  }
                />
              </MargRItem>
              <MargRItem>
                <span>电话：</span>
                <Input
                  style={{ width: 120 }}
                  value={queryParams.get('mobile') || void 0}
                  placeholder="请输入电话"
                  onChange={e => {
                    this.props.queryChange(
                      this.props,
                      'mobile',
                      e.target.value,
                    );
                  }}
                />
              </MargRItem>
              <MargRItem>
                <Button type="primary" onClick={this.props.queryConfirm}>
                  查询
                </Button>
              </MargRItem>
              <MargRItem>
                <Button
                  type="primary"
                  onClick={() => {
                    this.props.addNew(this.props);
                  }}
                >
                  新增人员
                </Button>
              </MargRItem>
            </FlexRow>
            <FlexRow style={{ fontSize: 15, marginTop: 40 }}>
              共有符合条件的录入人员{pagination.get('total')}位：
            </FlexRow>
            <FlexRow style={{ flex: 2, margin: '15px 0' }}>
              <div
                className="table-box"
                style={{ width: '100%', overflow: 'auto' }}
              >
                <Table
                  columns={this.columns}
                  dataSource={data.toJS()}
                  rowKey={record => record.id}
                  loading={pagination.get('loading')}
                  pagination={{
                    ...pagination.toJS(),
                    showQuickJumper: true
                  }}
                  scroll={{ y: 590 }}
                  onChange={e => this.props.handleTableChange(e, this.props)}
                />
              </div>
            </FlexRow>
          </FlexColumn>
        </BodyWrapper>
        {
          this.props.modal &&
          <Modal
            visible
            title={addingMode ? '新增临时人员' : '修改'}
            ref={form => { this.form = form }}
            bodyStyle={{ maxHeight: 500, overflow: 'auto' }}
            width={800}
            onCancel={() => this.props.setModal(false)}
            onOk={() => this.props.submit(this.props, this.editform)}
          >
            <EditForm
              ref={form => { this.editform = form }}
              {...this.props}
              {...this.props.inputDTO.toJS()}
              formChange={value => this.props.formChange(this.props, value)}
              createTime={this.state.createTime}
            />
          </Modal>
        }
      </Wrapper>
    );
  }
}
const EditForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.formChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      name: {
        ...props.name,
        value: props.name.value
      },
      mobile: {
        ...props.mobile,
        value: props.mobile.value
      },
      roleIdList: {
        ...props.roleIdList,
        value: props.roleIdList.value.toString()
      }
    };
  }
})(props => {
  const {
    form,
    addingMode,
    authorityList,
    allRoles,
    createTime
  } = props;
  const { getFieldDecorator } = form;
  const optionlist = authorityList.toJS();
  let allValue = [];
  let options = optionlist.map(e => {
    e.label = e.name;
    e.value = e.id;
    allValue.push(e.id);
    return e;
  });
  const roleOptions = allRoles.filter((role) => role.get('type') === 2).map(e => (
    <Select.Option key={e.get('id')} value={(e.get('id') || '').toString()}>
      {e.get('name')}
    </Select.Option>
  ));
  return (
    <div
      style={{
        display: 'inline-block',
        width: '100%',
        verticalAlign: 'middle',
      }}
    >
      <Form className="form" style={{ width: '100%', height: 'auto' }}>
        <FlexColumn style={{ width: '100%', height: 'auto' }}>
          <FormItem
            {...formItemLayout}
            label="姓名"
          >
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入正确姓名',
                  validator: (rule, value, cb) => {
                    if (/[\u4e00-\u9fa5a-zA-Z]{2}$/g.test(value)) {
                      cb();
                    } else {
                      cb('请输入正确姓名');
                    }
                  },
                },
              ],
              options: {
                initialValue: '',
              },
            })(<Input placeholder="请输入姓名" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="电话">
            {getFieldDecorator('mobile', {
              rules: [
                {
                  required: true,
                  message: '请输入正确电话',
                  validator: (rule, value, cb) => {
                    if (/^1\d{10}$/g.test(value)) {
                      cb();
                    } else {
                      cb('请输入正确电话');
                    }
                  },
                },
              ],
              options: {
                initialValue: '',
              },
            })(<Input placeholder="请输入电话" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="人员类型">
            <Input value="临时人员" disabled />
          </FormItem>
          {addingMode ? null : (
            <FormItem {...formItemLayout} label="入库时间">
              <Input value={createTime} disabled />
            </FormItem>
          )}

          <FormItem {...formItemLayout} label="用户角色">
            {getFieldDecorator('roleIdList', {
              rules: [
                {
                  required: true,
                  message: '请选择角色',
                  validator: (rule, value, cb) => {
                    const id = parseInt(value, 10);
                    const targetRole = allRoles.find((role) => role.get('id') === id);
                    if (id > 1 && targetRole && (targetRole.get('type') === 2)) {
                      cb();
                    } else {
                      cb(`请选择兼职人员角色`);
                    }
                  },
                },
              ],
              options: {
                initialValue: '-1',
              },
            })(
              <Select>
                <Select.Option key="-1" value="-1">
                  请选择
                </Select.Option>
                {roleOptions}
              </Select>,
            )}
          </FormItem>
          <FormItem {...formItemLayoutL} label="数据权限">
            <div>
              <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                <Checkbox
                  onChange={e => {
                    if (e.target.checked) {
                      props.onChange(props, allValue);
                    } else {
                      props.onChange(props, []);
                    }
                  }}
                >
                  全选
                </Checkbox>
              </div>
              <CheckboxGroup
                options={options}
                value={props.phaseSubjectIdList.value}
                checked={props.phaseSubjectIdList.value}
                onChange={e => {
                  props.onChange(props, e);
                }}
              />
            </div>
          </FormItem>
        </FlexColumn>
      </Form>
    </div>
  );
});
TemporaryPersonnel.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  TemporaryPersonnel: makeSelectTemporaryPersonnel(),
  modal: makeSelectModalShow(),
  inputDTO: makeSelectInputDTO(),
  data: makeSelectTableData(),
  pagination: makeSelectPagination(),
  authorityList: makeSelectAuthority(),
  allRoles: makeSelectRoles(),
  queryParams: makeSelectQueryParam(),
  editId: makeSelectEditId(),
  addingMode: makeSelectAddingMode(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    setModal(bool) {
      dispatch(setModalAction(bool));
    },
    onChange(props, e) {
      let inputDTO = props.inputDTO;
      // props.formChange(props,{phaseSubjectIdList:{value:e}})
      // dto = dto.get('role').set('value',)
      inputDTO = inputDTO.set('phaseSubjectIdList', {
        value: e,
        name: 'phaseSubjectIdList',
      });
      dispatch(setInputDTO(inputDTO));
    },
    queryConfirm() {
      dispatch(getDataAction());
    },
    queryChange(props, name, v) {
      const params = props.queryParams;
      const _params = params.set(name, v && v.trim());
      dispatch(setQueryParams(_params));
    },
    formChange(props, value) {
      let inputDTO = props.inputDTO;
      if (value.name) {
        inputDTO = inputDTO.set('name', value.name);
      }
      if (value.mobile) {
        inputDTO = inputDTO.set('mobile', value.mobile);
      }
      if (value.roleIdList) {
        inputDTO = inputDTO.set('roleIdList', value.roleIdList);
      }
      if (value.phaseSubjectIdList) {
        inputDTO = inputDTO.set('phaseSubjectIdList', value.phaseSubjectIdList);
      }
      dispatch(setInputDTO(inputDTO));
    },
    handleTableChange: (pagination, props) => {
      const { current } = pagination;
      let tableState = props.pagination;
      tableState = tableState.set('current', current);
      dispatch(setPainationAction(tableState));
      dispatch(getDataAction());
    },
    addNew(props) {
      const inputDTO = {
        name: { value: '' },
        mobile: { value: '' },
        roleIdList: { value: '-1' },
        phaseSubjectIdList: { value: [], name: 'phaseSubjectIdList' }
      };
      dispatch(setInputDTO(fromJS(inputDTO)));
      dispatch(setAddingMode(true));
      dispatch(setModalAction(true));
    },
    submit(props, form) {
      form.validateFields((err, values) => {
        if (err) {
          message.warning('请完善内容');
          return;
        }
        if (props.addingMode) {
          dispatch(submitAction());
        } else {
          dispatch(submitEditAction());
        }
      });
    },
    editRecord(props, record) {
      dispatch(setEditId(record.id));
      dispatch(getOneUser());
    },
    resetPassword(props, record) {
      dispatch(setEditId(record.id));
      dispatch(resetPasswordAction());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TemporaryPersonnel);
