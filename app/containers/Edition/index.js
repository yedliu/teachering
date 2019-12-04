/*
 *
 * Edition
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import Immutable, { fromJS } from 'immutable';
import { Form, Input, Select, Table, Modal, Button, Popconfirm } from 'antd';
import {
  deleteAction,
  saveAction,
  setCrudIdAction,
  setInputDtoAction,
  setModalAttrAction,
  getEditionListAction,
  setEditionListAction,
  sortAction,
  setPhaseSubjectAction,
  getEditionSearchAction,
  setClassTypeCodeAction,
  setAddedState,
  setEditionTypeAction
} from './actions';
import {
  makeSelectInputDto,
  makeSelectModalAttr,
  makeSelectPhaseSubject,
  makeSelectPhaseSubjectList,
  makeSelectEdition,
  makeSelectCrudId,
  makeSelectEditionList,
  makeSelectBuList,
  // makeSelectClassTypeCode,
  makeSelectAddedState,
  makeSelectEdtionType
} from './selectors';
import { FlexColumn, FlexRow, FlexRowCenter } from '../../components/FlexBox/index';

const Wrapper = styled(FlexColumn)`
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: white;
`;

const HeaderWrapper = styled(FlexRowCenter)`
  width: 100%;
  height: 60px;
  border-bottom: 2px solid #efefef;
  background-color: white;
`;

const BodyWrapper = styled(FlexRow)`
  flex: 1;
  width: 100%;
  height: 80%;
  margin-top: 15px;
  border: 1px solid #ddd;
  background-color: white;
  .ant-table-wrapper {
    flex: 1!important;
  }
`;

let yHeight = 0;

const FormItem = Form.Item;

const stateList = [
  { label: '全部', value: '' },
  { label: '上架', value: '1' },
  { label: '隐藏', value: '0' }
];
const editionTypeList = [
  {
    label: '全部', value: ''
  },
  {
    label: '公校版本', value: '1'
  },
  {
    label: '掌门自研版本', value: '2'
  }
];
const editionTypeDict = ['--', '公校版本', '掌门自研版本'];
export class Edition extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.dispatch(getEditionSearchAction());
    yHeight = this.bodyWrapper.offsetHeight - 50;
  }
  render() {
    const classType = {};
    this.props.buList.forEach((item) => {
      classType[item.get('code')] = item.get('value');
    });
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 250
      },
      /* {
        title: '适用班型',
        dataIndex: 'classTypeCode',
        key: 'classTypeCode',
        width: 250,
        render: (code) => <span>{classType[code]}</span>
      }, */
      {
        title: '版本分类',
        dataIndex: 'editionType',
        key: 'editionType',
        width: 250,
        render: (state) => <span>{editionTypeDict[state] || '--'}</span>
      },
      {
        title: '上架状态',
        dataIndex: 'state',
        key: 'state',
        width: 250,
        render: (state) => <span>{String(state) === '1' ? '上架' : '隐藏'}</span>
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => (
          <span>
            <a href="#" onClick={() => this.props.goToUpdate(index, this.form, this.props)}>
                修改
            </a>
            <span className="ant-divider" />
            <Popconfirm title="确定删除吗?" onConfirm={() => this.props.goToDelete(index, this.props)}>
              <a href="#">删除</a>
            </Popconfirm>
          </span>
)
      }
    ];
    return (
      <Wrapper>
        <HeaderWrapper>
          <Select
            style={{ width: 120, marginRight: 20 }}
            value={{
              key: this.props.phaseSubject.get('id').toString(),
              label: this.props.phaseSubject.get('name')
            }}
            labelInValue={true}
            onChange={(value) => this.props.handlePhaseSubjectSelectOnChange(value, this.props)}
          >
            {this.props.phaseSubjectList.map((phaseSubject) => {
              return (
                <Select.Option
                  value={phaseSubject.get('id').toString()}
                  key={phaseSubject.get('id')}
                  title={phaseSubject.get('name')}
                >
                  {phaseSubject.get('name')}
                </Select.Option>
              );
            })}
          </Select>
          {/* 所属班型： */}
          {/* <Select */}
          {/*  style={{ width: 120, marginRight: 20 }} */}
          {/*  value={this.props.classTypeCode.toString()} */}
          {/*  onChange={(value) => this.props.handleClassTypeCodeSelectOnChange(value, this.props)} */}
          {/* > */}
          {/*  {this.props.buList.map((item) => { */}
          {/*    return ( */}
          {/*      <Select.Option */}
          {/*        key={item.get('code')} */}
          {/*        value={item.get('code').toString()} */}
          {/*        title={item.get('value')} */}
          {/*      > */}
          {/*        {item.get('value')} */}
          {/*      </Select.Option> */}
          {/*    ); */}
          {/*  })} */}
          {/* </Select> */}
          版本分类：
          <Select
            style={{ width: 120, marginRight: 20 }}
            value={this.props.editionType}
            onChange={(value) => this.props.handleEditionTypeChange(value, this.props)}
          >
            {editionTypeList.map((item) => {
              return (
                <Select.Option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </Select.Option>
              );
            })}
          </Select>
          上架状态：
          <Select
            style={{ width: 120, marginRight: 20 }}
            value={this.props.state}
            onChange={(value) => this.props.handleAddedStateOnChange(value, this.props)}
          >
            {stateList.map((item) => {
              return (
                <Select.Option
                  key={item.value}
                  value={item.value}
                  title={item.value}
                >
                  {item.label}
                </Select.Option>
              );
            })}
          </Select>
          <Button type={'primary'} onClick={() => this.props.handleSaveBtnOnClick(this.props)}>
            新增版本
          </Button>
        </HeaderWrapper>
        <BodyWrapper innerRef={(w) => { this.bodyWrapper = w }}>
          <Table
            dataSource={this.props.editionList.toJS()}
            columns={columns}
            scroll={{ y: yHeight }}
            rowKey={(record) => record.id}
            loading={false}
            pagination={false}
          />
        </BodyWrapper>
        <CollectionCreateForm
          {...this.props.inputDto.toJS()}
          ref={(form) => { this.form = form }}
          visible={this.props.modalAttr.get('visible')}
          onChange={(values) => this.props.onChange(this.props, values)}
          onCancel={() => this.props.handleModalOnCancel(this.props)}
          onCreate={() => {  this.props.handleModalOnOk(this.form, this.props) }}
          phaseSubjectList={this.props.phaseSubjectList}
          buList={this.props.buList}
          phaseSubjectId={this.props.inputDto.get('phaseSubjectId')}
          // classTypeCode={this.props.inputDto.get('classTypeCode')}
          stateList={stateList}
          state={this.props.inputDto.get('state')}
          editionType={this.props.inputDto.get('editionType')}
        />
      </Wrapper>
    );
  }
}

const CollectionCreateForm = Form.create({
  onFieldsChange(props, changedFields) {
    // props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    console.log('props', props);
    return {
      name: {
        ...props.name,
        value: props.name
      },
      phaseSubjectId: {
        ...props.phaseSubjectId,
        value: props.phaseSubjectId.toString()
      },
      // classTypeCode: {
      //   ...props.classTypeCode,
      //   value: props.classTypeCode.toString()
      // },
      phaseSubjectList: {
        ...props.phaseSubjectList,
        value: props.phaseSubjectList
      },
      state: {
        ...props.state,
        value: String(props.state)
      },
      editionType: {
        value: props.editionType ? String(props.editionType) : void 0
      }
    };
  }
})((props) => {
  const { visible, onCancel, onCreate, form } = props;
  const { getFieldDecorator } = form;
  const classTypeList = props.buList.toJS();
  classTypeList.shift();
  const options = props.phaseSubjectList.map((item) => {
    return (
      <Select.Option key={item.get('id')} value={item.get('id').toString()} title={item.get('name')}>
        {item.get('name')}
      </Select.Option>
    );
  });
  // const buSelections = classTypeList.map((item) => {
  //   return (
  //     <Select.Option key={item.code} value={item.code.toString()} title={item.value}>
  //       {item.value}
  //     </Select.Option>
  //   );
  // });
  const addedState = stateList.map((item, index) => { // eslint-disable-line
    if (index > 0) {
      return (
        <Select.Option key={item.value} value={item.value} title={item.value}>
          {item.label}
        </Select.Option>
      );
    }
  });
  const editionCategories = editionTypeList.slice(1, 3).map(item => {
    return (
      <Select.Option key={item.value} value={item.value.toString()}>
        {item.label}
      </Select.Option>
    );
  });
  return (
    <Modal visible={visible} onOk={onCreate} onCancel={onCancel}>
      <Form layout="vertical">
        <FormItem label="名称">
          {getFieldDecorator('name', {
            rules: [
              { required: true, message: '请输入名称' },
              { whitespace: true, message: '请输入名称' } /* , { max: 20, message: '不能超过20个字符' } */
            ]
          })(<Input placeholder="请输入名称" />)}
        </FormItem>
        <FormItem label="学科学段">{getFieldDecorator('phaseSubjectId')(<Select>{options}</Select>)}</FormItem>
        {/* <FormItem label="所属班型">{getFieldDecorator('classTypeCode')(<Select>{buSelections}</Select>)}</FormItem> */}
        <FormItem label="版本分类">{getFieldDecorator('editionType', {
          rules: [
            { required: true, message: '请选择版本分类' },
          ]
        })(<Select placeholder="选择版本分类">{editionCategories}</Select>)}</FormItem>
        <FormItem label="上架状态">{getFieldDecorator('state', {
          rules: [
            { required: true, message: '请填写上架状态!' }
          ]
        })(<Select>{addedState}</Select>)}</FormItem>
      </Form>
    </Modal>
  );
});

Edition.propTypes = {
  dispatch: PropTypes.func.isRequired,
  handlePhaseSubjectSelectOnChange: PropTypes.func.isRequired,
  handleClassTypeCodeSelectOnChange: PropTypes.func.isRequired,
  phaseSubjectList: PropTypes.instanceOf(Immutable.List).isRequired,
  phaseSubject: PropTypes.instanceOf(Immutable.Map).isRequired,
  buList: PropTypes.instanceOf(Immutable.List).isRequired,
  editionList: PropTypes.instanceOf(Immutable.List).isRequired,
  edition: PropTypes.instanceOf(Immutable.Map).isRequired,
  onChange: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  inputDto: PropTypes.instanceOf(Immutable.Map).isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  goToUpdate: PropTypes.func.isRequired,
  goToDelete: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
  handleSaveBtnOnClick: PropTypes.func.isRequired,
  modalAttr: PropTypes.instanceOf(Immutable.Map).isRequired,
  handleModalOnOk: PropTypes.func.isRequired,
  handleModalOnCancel: PropTypes.func.isRequired,
  form: PropTypes.object,
  // classTypeCode: PropTypes.string.isRequired
};

const mapStateToProps = createStructuredSelector({
  // Edition: makeSelectEdition(),
  phaseSubjectList: makeSelectPhaseSubjectList(),
  phaseSubject: makeSelectPhaseSubject(),
  buList: makeSelectBuList(),
  editionList: makeSelectEditionList(),
  edition: makeSelectEdition(),
  inputDto: makeSelectInputDto(),
  modalAttr: makeSelectModalAttr(),
  crudId: makeSelectCrudId(),
  // classTypeCode: makeSelectClassTypeCode(),
  state: makeSelectAddedState(),
  editionType: makeSelectEdtionType()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    handlePhaseSubjectSelectOnChange: (value, props) => {
      console.log('触发了change', value);
      dispatch(setPhaseSubjectAction(props.phaseSubject.set('id', value.key).set('name', value.label)));
      dispatch(setInputDtoAction(props.inputDto.set('phaseSubjectId', value.key)));
      dispatch(getEditionListAction());
    },
    handleClassTypeCodeSelectOnChange: (value) => {
      dispatch(setClassTypeCodeAction(value));
      dispatch(getEditionListAction());
    },
    handleEditionTypeChange: (value) => {
      dispatch(setEditionTypeAction(value));
      dispatch(getEditionListAction());
    },
    handleAddedStateOnChange: (value) => {
      dispatch(setAddedState(value));
      dispatch(getEditionListAction());
    },
    handleSaveBtnOnClick: (props) => {
      dispatch(setCrudIdAction(0));
      dispatch(setModalAttrAction(props.modalAttr.set('visible', true)));
      dispatch(
        setInputDtoAction(
          props.inputDto
            .set('name', '')
            .set('phaseSubjectId', props.phaseSubject.get('id'))
           // .set('classTypeCode', '1')
            .set('state', '0')
            .set('editionType', '1')
        )
      );
      console.log('handleSaveBtnOnClick');
    },
    handleModalOnOk: (form, props) => {
      console.log('点击了保存按钮');
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        dispatch(setInputDtoAction(fromJS(values)));
        console.log('props.inputDto:', props.inputDto.toJS());
        dispatch(saveAction());
      });
    },
    handleModalOnCancel: (props) => {
      dispatch(setModalAttrAction(props.modalAttr.set('visible', false)));
      console.log('handleModalOnCancel');
    },
    onChange: (props, values) => {
      console.log('form表单变动：', values);
      let dto = props.inputDto;
      if (values.name) {
        dto = dto.set('name', values.name.value);
      }
      if (values.phaseSubjectId) {
        dto = dto.set('phaseSubjectId', values.phaseSubjectId.value);
      }
      // if (values.classTypeCode) {
      //   dto = dto.set('classTypeCode', values.classTypeCode.value);
      // }
      if (values.state) {
        dto = dto.set('state', values.state.value);
      }
      if (values.editionType) {
        dto = dto.set('editionType', values.editionType.value);
      }
      dispatch(setInputDtoAction(dto));
    },
    save: () => {
      console.log('save');
      dispatch(saveAction());
    },
    cancel: () => {
      console.log('cancel');
      dispatch(getEditionListAction());
    },
    goToUpdate: (index, form, props) => {
      const edition = props.editionList.get(index);
      console.log(edition.toJS());
      dispatch(setCrudIdAction(edition.get('id')));
      dispatch(setModalAttrAction(props.modalAttr.set('visible', true)));
      dispatch(
        setInputDtoAction(
          props.inputDto
            .set('name', edition.get('name'))
            // .set('classTypeCode', edition.get('classTypeCode') || '')
            .set('state', edition.get('state'))
            .set('editionType', edition.get('editionType'))
        )
      );
      console.log('获取需要修改的值：', props.inputDto.toJS());
    },
    goToDelete: (index, props) => {
      const deleteId = props.editionList.get(index).get('id');
      dispatch(setCrudIdAction(deleteId));
      dispatch(deleteAction());
      console.log('deleteId:', deleteId);
    },
    onMouseOver: (index, props) => {
      const editor = props.editionList.find((value) => value.get('editable') === true);
      if (editor) {
        return;
      }
      const list = props.editionList.map((value, index2) => value.set('toolBarVisible', index === index2));
      dispatch(setEditionListAction(list));
      console.log('我来了');
    },
    onMouseLeave: (props) => {
      const list = props.editionList.map((value) => value.set('toolBarVisible', false));
      dispatch(setEditionListAction(list));
      console.log('我又走了');
    },
    handleSwitchOnChange: (checked) => {
      console.log('课程体系显示？', checked);
    },
    onDragStart: (e, index) => {
      e.stopPropagation();
      console.log('拖动开始', index);
      e.dataTransfer.setData('text', index);
    },
    onDrop: (e, index, props) => {
      e.preventDefault();
      const data = JSON.parse(e.dataTransfer.getData('text'));
      const list = props.editionList;
      const oldData = list.get(data);
      const newData = list.get(index);
      const arr = list.set(data, newData).set(index, oldData);
      dispatch(setEditionListAction(arr));
      dispatch(sortAction());
      console.log('拖动结束', index, arr.toJS());
    },
    onDragOver: (e) => {
      e.preventDefault();
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Edition);
