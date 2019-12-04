/* eslint-disable no-empty-function */
/*
 *
 * OfficialPersonnel
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  Form,
  Input,
  Select,
  Button,
  Tag,
  Modal,
  Table,
  message,
  Checkbox
} from 'antd';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
import { FlexColumn, FlexRow } from '../../components/FlexBox';
import styled from 'styled-components';
import makeSelectOfficialPersonnel, {
  makeSelectModalShow,
  makeSelectInputDTO,
  makeSelectTableData,
  makeSelectPagination,
  makeSelectAuthority,
  makeSelectRoles,
  makeSelectQueryParam,
  makeSelectEditId,
  // makeSelectAddingMode,
} from './selectors';
import {
  setModalAction,
  setInputDTO,
  setPainationAction,
  getDataAction,
  getAuthorityList,
  getRoleList,
  // submitAction,
  setQueryParams,
  setEditId,
  // setAddingMode,
  submitEditAction,
  // resetPasswordAction,
  getOneUser,
} from './actions';
import { toString } from 'components/CommonFn';


const Wrapper = styled(FlexColumn)`
  width: 100%;
  background-color: #fff;
`;
const BodyWrapper = styled(FlexColumn)`
  background-color: #fff;
  margin: 0 20px;
  overflow: auto;
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

export class OfficialPersonnel extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      showAllMap: {},
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getDataAction());
    dispatch(getAuthorityList());
    dispatch(getRoleList());
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
    const { data, pagination, queryParams, officialPersonnel, queryChange } = this.props;
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
        width: '12.5%',
      },
      {
        title: '电话',
        dataIndex: 'mobile',
        render: val => val || '-',
        width: '12.5%',
      },
      {
        title: '角色',
        dataIndex: 'roleList',
        render: val => {
          const res = (val && val.length > 0 ? val : [{ id: 999, name: '未配置' }])[0];
          return res.id === 999 ? <span style={{ color: '#ddd' }}>{res.name}</span> : res.name;
        },
        width: '12.5%',
      },
      {
        title: '数据权限',
        dataIndex: 'phaseSubjectList',
        render: (val, record) => {
          if (val && val.length) {
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
                ) : null}{' '}
                {/* 超出了而且没显示全部才显示这几个字 */}
              </span>
            );
          } else {
            return <p style={{ textAlign: 'center', color: '#ddd' }}>未配置</p>;
          }
        },
        width: '40%',
      },
      {
        title: '操作',
        dataIndex: '',
        render: (val, record) => {
          // console.log(val, record, 'disabled');
          let changeRoleDisable = false;
          if (val.roleList && val.roleList[0]) {
            changeRoleDisable = val.roleList[0].id === 1;
          }
          return (
            <OperationTdStyle>
              <Button
                type="primary"
                disabled={changeRoleDisable}
                onClick={() => this.props.editRecord(this.props, record)}
              >
                {(record.roleList && record.roleList.length === 0) ||
                  (record.phaseSubjectList && record.phaseSubjectList.length === 0) ? '配置权限' : '修改权限'}
              </Button>
            </OperationTdStyle>
          );
        },
        width: '12.5%',
      },
    ];
    const { allRoles } = officialPersonnel;
    // console.log(officialPersonnel, allRoles, 'officialPersonnel -> allRoles');
    return (
      <Wrapper>
        <BodyWrapper>
          <FlexColumn style={{ padding: '20px 0' }}>
            <FlexRow
              style={{ justify: 'center', align: 'center', margin: '10px 0' }}
            >
              <div style={{ marginRight: 15 }}>
                <span>角色：</span>
                <Select value={toString(queryParams.get('roleId') || -1)} style={{ minWidth: 180 }} onChange={(value) => queryChange(this.props, 'roleId', value)}>
                  <Select.Option key="-1" value="-1">
                    所有角色
                  </Select.Option>
                  {allRoles.filter(role => role.type === 1).map((role) => {
                    return <Select.Option key={role.id} value={toString(role.id)}>{role.name}</Select.Option>;
                  })}
                </Select>
              </div>
              <div style={{ marginRight: 15 }}>
                <span>姓名：</span>
                <Input
                  style={{ width: 120 }}
                  value={queryParams.get('name') || ''}
                  onChange={e => {
                    queryChange(this.props, 'name', e.target.value);
                  }}
                />
              </div>
              <div style={{ marginRight: 15 }}>
                <span>电话：</span>
                <Input
                  style={{ width: 120 }}
                  value={queryParams.get('mobile') || ''}
                  onChange={e => {
                    queryChange(
                      this.props,
                      'mobile',
                      e.target.value,
                    );
                  }}
                />
              </div>
              <Button
                style={{ marginRight: 15 }}
                type="primary"
                onClick={this.props.queryConfirm}
              >
                查询
              </Button>
            </FlexRow>
            <FlexRow style={{ flex: 0, flexShrink: 0, fontSize: 15 }}>
              共有符合条件的录入人员{pagination.get('total')}位：
            </FlexRow>
            <FlexRow style={{ flex: 2, margin: '25px 0 15px' }}>
              <div
                className="table-box"
                style={{ width: '100%', overflow: 'auto' }}
              >
                <Table
                  columns={this.columns}
                  rowKey={record => record.id}
                  loading={pagination.get('loading')}
                  pagination={{
                    ...pagination.toJS(),
                    showQuickJumper: true
                  }}
                  dataSource={data.toJS()}
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
            title="配置/修改用户角色权限"
            bodyStyle={{ maxHeight: 500, overflow: 'auto' }}
            width={800}
            ref={form => {
              this.form = form;
            }}
            onCancel={() => {
              this.props.setModal(false);
            }}
            onOk={() => {
              this.props.submit(this.props, this.editform);
            }}
          >
            <EditForm
              ref={form => {
                this.editform = form;
              }}
              {...this.props}
              {...this.props.inputDTO.toJS()}
              formChange={value => {
                this.props.formChange(this.props, value);
              }}
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
        value: props.name.value,
      },
      mobile: {
        ...props.mobile,
        value: props.mobile.value,
      },
      roleIdList: {
        ...props.roleIdList,
        value: props.roleIdList.value.toString(),
      },
    };
  },
})(props => {
  const { form, authorityList, allRoles, mobile, name } = props;
  const { getFieldDecorator } = form;
  const optionlist = authorityList.toJS();
  let allValue = [];
  let options = optionlist.map(e => {
    e.label = e.name;
    e.value = e.id;
    allValue.push(e.id);
    return e;
  });
  const roleOptions = allRoles.filter(role => (role.get('id') > 1) && role.get('type') === 1).map(role => (
    <Select.Option key={role.get('id')} value={(role.get('id') || '').toString()}>
      {role.get('name')}
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
          <FormItem {...formItemLayout} label="姓名">
            <Input value={name.value} disabled />
          </FormItem>
          <FormItem {...formItemLayout} label="电话">
            <Input value={mobile.value} disabled />
          </FormItem>
          <FormItem {...formItemLayout} label="人员类型">
            <Input value="正式人员" disabled />
          </FormItem>
          <FormItem {...formItemLayout} label="用户角色">
            {getFieldDecorator('roleIdList', {
              rules: [
                {
                  required: true,
                  message: '请选择角色',
                  validator: (rule, value, cb) => {
                    const id = parseInt(value, 10);
                    if (id > 1) {
                      cb();
                    } else {
                      cb('请选择角色');
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
                    console.log('checkall', e);
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
OfficialPersonnel.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  officialPersonnel: makeSelectOfficialPersonnel(),
  modal: makeSelectModalShow(),
  inputDTO: makeSelectInputDTO(),
  data: makeSelectTableData(),
  pagination: makeSelectPagination(),
  authorityList: makeSelectAuthority(),
  allRoles: makeSelectRoles(),
  queryParams: makeSelectQueryParam(),
  editId: makeSelectEditId(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    setModal(bool) {
      dispatch(setModalAction(bool));
    },
    onCheckAllChange(props, e) { },
    onChange(props, e) {
      let inputDTO = props.inputDTO;
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
      let _params = params.set(name, v.trim());
      if (name === 'roleId' && v === '-1') { // 删除调选择 “全部” 的部分
        _params = _params.delete(name);
      }
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
    initInputDTO() { },
    submit(props, form) {
      form.validateFields((err, values) => {
        if (err) {
          message.warning('请完善内容');
          return;
        }
        dispatch(submitEditAction());
      });
    },
    editRecord(props, record) {
      dispatch(setEditId(record.id));
      dispatch(getOneUser());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OfficialPersonnel);
