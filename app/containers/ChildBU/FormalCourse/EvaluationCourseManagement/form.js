import React from 'react';
import { Form, Select, Modal, Input, Button } from 'antd';

const FormItem = Form.Item;

const ModalForm = Form.create({
  onValuesChange(props, values) {
    const { onValuesChange } = props;
    onValuesChange && onValuesChange(values);
  },
  mapPropsToFields(props) {
    const {
      name,
      subjectId,
      gradeId,
      state,
      difficulty,
      remarks,
      subjectList = [],
      gradeList = [],
      stateList = []
    } = props;
    return {
      name: {
        value: name
      },
      subjectId: {
        value: `${subjectId}`
      },
      gradeId: {
        value: `${gradeId}`
      },
      state: {
        value: `${state}`
      },
      difficulty: {
        value: `${difficulty}`
      },
      remarks: {
        value: `${remarks}`
      },
      subjectList: {
        value: subjectList
      },
      gradeList: {
        value: gradeList
      },
      stateList: {
        value: stateList
      },
    };
  }
})(props => {
  const {
    visible,
    loading,
    onCancel,
    onSave,
    form,
    subjectList,
    gradeList,
    stateList,
    difficultyList,
    isEdit
  } = props;
  const {
    getFieldDecorator,
    validateFields // 校验必填字段
  } = form;

  const difficultyOption = difficultyList.map(item => (
    <Select.Option
      key={item.get('id')}
      value={`${item.get('id')}`}
      title={item.get('name')}
    >
      {item.get('name')}
    </Select.Option>
  ));

  const SubjectOption = subjectList.map(item => (
    <Select.Option
      key={item.get('id')}
      value={`${item.get('id')}`}
      title={item.get('name')}
    >
      {item.get('name')}
    </Select.Option>
  ));

  const GradeOption = gradeList.map(item => (
    <Select.Option
      key={item.get('id')}
      value={`${item.get('id')}`}
      title={item.get('name')}
    >
      {item.get('name')}
    </Select.Option>
  ));
  const StateOption = stateList
    .filterNot(el => el.get('name') === '全部') // 删除 '全部'
    .map(item => (
      <Select.Option
        key={item.get('id')}
        value={`${item.get('id')}`}
        title={item.get('name')}
      >
        {item.get('name')}
      </Select.Option>
    ));

  return (
    <Modal
      title="测评课课程管理"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" size="large" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          size="large"
          loading={loading}
          onClick={() => {
            validateFields((err) => {
              if (err) return;
              onSave();
            });
          }}
        >
          保存
        </Button>
      ]}
      maskClosable={false}
    >
      <Form layout="vertical">
        <FormItem label="名称">
          {getFieldDecorator('name', {
            rules: [
              { required: true, message: '请输入名称',  whitespace: true, },
              {
                message: '最多50字',
                max: 50
              }
            ]
          })(<Input placeholder="请输入名称" />)}
        </FormItem>
        <FormItem label="难度">
          {getFieldDecorator('difficulty', {
            rules: [{ required: true, message: '请选择难度' }]
          })(<Select>{difficultyOption}</Select>)}
        </FormItem>
        <FormItem label="学科">
          {getFieldDecorator('subjectId', {
            rules: [{ required: true, message: '请选择学科' }]
          })(<Select disabled={isEdit}>{SubjectOption}</Select>)}
        </FormItem>
        <FormItem label="年级">
          {getFieldDecorator('gradeId', {
            rules: [{ required: true, message: '请选择年级' }]
          })(<Select disabled={isEdit}>{GradeOption}</Select>)}
        </FormItem>
        <FormItem label="上架状态">
          {getFieldDecorator('state', {
            rules: [{ required: true, message: '请选择上架状态' }]
          })(<Select>{StateOption}</Select>)}
        </FormItem>
        <FormItem label="备注">
          {getFieldDecorator('remarks', {
            rules: [
              {
                max: 20,
                message: '长度不能超过20个汉字'
              }
            ]
          })(<Input placeholder="最多输入20个汉字" maxLength="20" />)}
        </FormItem>
      </Form>
    </Modal>
  );
});

export default ModalForm;
