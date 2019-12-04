/*
 *
 * RolesManage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { createStructuredSelector } from 'reselect';
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Tag,
  Modal,
  Table,
  message,
  Checkbox
} from 'antd';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
import {
  FlexColumn,
  FlexRow,
} from '../../components/FlexBox';
import styled from 'styled-components';
import makeSelectRolesManage, {
  makeSelectModalShow,
  makeSelectInputDTO,
  makeSelectTableData,
  makeSelectPagination,
  makeSelectAuthority,
  makeSelectQueryParam,
  makeSelectEditId,
  makeSelectAddingMode
} from './selectors';
import {
  setModalAction,
  setInputDTO,
  setPainationAction,
  getDataAction,
  getAuthorityList,
  submitAction,
  setQueryParams,
  setEditId,
  setAddingMode,
  submitEditAction,
  deleteRole
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
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 }
};
const formItemLayoutL = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
};

export class RolesManage extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      showAllMap: {},
      searchVlue: '',
    };
  }
  componentDidMount() {
    this.props.dispatch(getDataAction());
    this.props.dispatch(getAuthorityList());
  }

  showAll = (id) => {
    const { showAllMap, update } = this.state;
    showAllMap[id] = !showAllMap[id];
    this.setState({
      showAllMap,
      update: !update,
    });
  }

  handleChange = e => {
    this.setState({ searchVlue: e.target.value });
  }

  handlePressEnter = () => {
    const searchVlue = this.state.searchVlue;
    this.props.dispatch(getDataAction(searchVlue));
  }

  render() {
    const { data, addingMode } = this.props;
    const { showAllMap, searchVlue } = this.state;
    this.columns = [
      {
        title: '编号',
        dataIndex: 'id',
        render: val => val || '---',
        width: '6.5%'
      },
      {
        title: '角色名称',
        dataIndex: 'name',
        render: val => val || '---',
        width: '12.5%'
      },
      {
        title: '角色分类',
        dataIndex: 'type',
        render: val => (Number(val) === 1 ? '正式人员' : '临时人员'),
        width: '8.5%'
      },
      {
        title: '权限',
        dataIndex: 'permissionOutputDTOList',
        render: (val, record) => {
          if (!val || !val.length) return '---';
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
        width: '40%'
      },
      {
        title: '操作',
        dataIndex: '',
        render: (val, record) => (
          <FlexRow>
            <Button
              style={{ marginRight: 10 }}
              type="primary"
              onClick={() => {
                this.props.editRecord(this.props, record);
              }}
            >
                修改
              </Button>
            <Button
              type="danger"
              onClick={() => {
                this.props.deleteRecord(this.props, record);
              }}
            >
                删除
              </Button>
          </FlexRow>
          ),
        width: '12.5%'
      }
    ];

    return (
      <Wrapper>
        <BodyWrapper>
          <FlexColumn style={{ padding: '20px 0 40px 0' }}>
            <div style={{ flex: 0, flexShrink: 0 }}>
              <Row
                style={{ justify: 'center', align: 'center', margin: '10px 0' }}
              >
                <Col span="3">
                  <Input
                    placeholder="请输入角色名称"
                    value={searchVlue}
                    onChange={this.handleChange}
                    onPressEnter={this.handlePressEnter}
                  />
                </Col>
                <Col span="4">
                  <Button
                    style={{ margin: '0 10px 0 5px' }}
                    onClick={() => { this.props.dispatch(getDataAction(searchVlue)) }}
                  >
                    查询
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => this.props.addNew(this.props)}
                  >
                    新增角色
                  </Button>
                </Col>
              </Row>
            </div>
            <FlexRow style={{ flex: 2, margin: '15px 0' }}>
              <div
                className="table-box"
                style={{ width: '100%', overflow: 'auto' }}
              >
                <Table
                  columns={this.columns}
                  rowKey={record => record.id}
                  scroll={{ y: 590 }}
                  // onChange ={(a,b,c) => {this.props.handleTableChange(a,b,c,this.props)}}
                  dataSource={data.toJS()}
                />
              </div>
            </FlexRow>
            {/* <Pagination pageSize={10} total={data.count()} current={pagination.get('current')} onChange={(a) => this.props.handleTableChange(a, this.props)} /> */}
          </FlexColumn>
        </BodyWrapper>
        {
          this.props.modal &&
          <Modal
            visible
            title={addingMode ? '新增用户角色权限' : '修改用户角色权限'}
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
        value: props.name.value.toString()
      },
      remarks: {
        ...props.remarks,
        value: props.remarks.value
      },
      type: {
        ...props.type,
        value: props.type.value.toString()
      }
    };
  }
})(props => {
  const {
    form,
    authorityList,
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
  return (
    <div
      style={{
        display: 'inline-block',
        width: '100%',
        verticalAlign: 'middle'
      }}
    >
      <Form className="form" style={{ width: '100%', height: 'auto' }}>
        <FlexColumn style={{ width: '100%', height: 'auto' }}>
          <FormItem {...formItemLayout} label="名称">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入正确名称',
                  validator: (rule, value, cb) => {
                    if (/[\u4e00-\u9fa5a-zA-Z]{2}$/g.test(value)) {
                      cb();
                    } else {
                      cb('请输入正确名称');
                    }
                  }
                }
              ],
              options: {
                initialValue: ''
              }
            })(<Input placeholder="请输入名称" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="角色分类">
            {getFieldDecorator('type', {
              rules: [
                {
                  required: true,
                  message: '请选择角色',
                  validator: (rule, value, cb) => {
                    if (parseInt(value, 10) > -1) {
                      cb();
                    } else {
                      cb('请选择角色');
                    }
                  }
                }
              ],
              options: {
                initialValue: '-1'
              }
            })(
              <Select>
                <Select.Option key="-1" value="-1">
                  请选择
                </Select.Option>
                <Select.Option key="1" value="1">
                  正式人员
                </Select.Option>
                <Select.Option key="2" value="2">
                  临时人员
                </Select.Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {getFieldDecorator('remarks', {
              rules: [
                {
                  required: false,
                  message: ''
                }
              ],
              options: {
                initialValue: ''
              }
            })(<Input placeholder="请输入备注" />)}
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
                value={props.permissionIdList.value}
                checked={props.permissionIdList.value}
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
RolesManage.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  RolesManage: makeSelectRolesManage(),
  modal: makeSelectModalShow(),
  inputDTO: makeSelectInputDTO(),
  data: makeSelectTableData(),
  pagination: makeSelectPagination(),
  authorityList: makeSelectAuthority(),
  queryParams: makeSelectQueryParam(),
  editId: makeSelectEditId(),
  addingMode: makeSelectAddingMode()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    setModal(bool) {
      dispatch(setModalAction(bool));
    },
    onChange(props, e) {
      let inputDTO = props.inputDTO;
      // props.formChange(props,{permissionIdList:{value:e}})
      // dto = dto.get('role').set('value',)
      inputDTO = inputDTO.set('permissionIdList', {
        value: e,
        name: 'permissionIdList'
      });
      dispatch(setInputDTO(inputDTO));
    },
    queryConfirm() {
      dispatch(getDataAction());
    },
    queryChange(props, name, v) {
      const params = props.queryParams;
      const _params = params.set(name, v);
      dispatch(setQueryParams(_params));
    },
    formChange(props, value) {
      let inputDTO = props.inputDTO;
      if (value.name) {
        inputDTO = inputDTO.set('name', value.name);
      }
      if (value.remarks) {
        inputDTO = inputDTO.set('remarks', value.remarks);
      }
      if (value.type) {
        inputDTO = inputDTO.set('type', value.type);
      }
      if (value.permissionIdList) {
        inputDTO = inputDTO.set('permissionIdList', value.permissionIdList);
      }
      dispatch(setInputDTO(inputDTO));
    },
    handleTableChange: (pagination, props) => {
      let tableState = props.pagination;
      tableState = tableState.set('current', pagination);
      dispatch(setPainationAction(tableState));
      dispatch(getDataAction());
    },
    addNew(props) {
      const inputDTO = fromJS({
        name: { value: '' },
        remarks: { value: '' },
        type: { value: '-1' },
        roleIdList: { value: '-1' },
        permissionIdList: { value: [], name: 'permissionIdList' }
      });
      dispatch(setInputDTO(inputDTO));
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
      const inputDTO = props.inputDTO;
      let permissionIdList = [];
      if (
        record.permissionOutputDTOList &&
        record.permissionOutputDTOList.length
      ) {
        record.permissionOutputDTOList.forEach(e => {
          permissionIdList.push(e.id);
        });
      }
      const _DTO = inputDTO
        .set('name', { value: record.name, name: 'name' })
        .set('remarks', { value: record.remarks, name: 'remarks' })
        .set('type', { value: record.type, name: 'type' })
        .set('permissionIdList', {
          value: permissionIdList,
          name: 'permissionIdList'
        });

      dispatch(setAddingMode(false));
      dispatch(setInputDTO(_DTO));
      dispatch(setEditId(record.id));
      dispatch(setModalAction(true));
    },
    deleteRecord(props, record) {
      dispatch(setEditId(record.id));
      Modal.confirm({
        title: '删除',
        content: `确定删除角色：”${record.name}“？`,
        okText: '删除',
        cancelText: '取消',
        onOk: () => new Promise((resolve, reject) => {
          dispatch(deleteRole());
          setTimeout(resolve, 800);
        })
      });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RolesManage);
