import React from 'react';
import { Modal, Form, Input, Checkbox, Button } from 'antd';
import styled from 'styled-components';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const Footer = styled(FormItem)`
  text-align: right;
`;
class BaseInfoModal extends React.Component {
  submit=(e) => {
    const { handleSubmit, type } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        handleSubmit(values, type);
      }
    });
  }
  render() {
    const { handleCancel, type, subjects, initialForm, loading } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const options = subjects.map(item => {
      return { value: item.id, label: item.name };
    });
    return (
      <Modal
        title={type === 'add' ? '新增能力' : '编辑能力'}
        visible={true}
        onCancel={handleCancel}
        maskClosable={false}
        footer={null}
        closable={false}
      >
        <Form onSubmit={this.submit}>
          <FormItem
            {...formItemLayout}
            label="能力名称"
            hasFeedback
          >
            {getFieldDecorator('name', {
              rules: [{
                required: true, message: '名称必填且不能为空格', whitespace: true
              }, { max: 10, message: '最多10个字' }],
              initialValue: type === 'add' ? '' : initialForm.name
            })(
              <Input placeholder="请输入名称" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="所属学科"
            hasFeedback
          >
            {getFieldDecorator('subjectIdList', {
              rules: [{
                required: true, message: '请选择学科',
              }],
              initialValue: type === 'add' ? null : initialForm.subjectIdList
            })(
              <CheckboxGroup options={options} />
            )}
          </FormItem>
          <Footer>
            <Button  size="large" onClick={handleCancel}>取消</Button>
            <Button  type="primary" size="large" htmlType="submit" loading={loading} style={{ marginLeft: 20 }}>
              保存
            </Button>
          </Footer>
        </Form>
      </Modal>
    );
  }
}
const WrappedBaseInfoModal = Form.create()(BaseInfoModal);
export default WrappedBaseInfoModal;
