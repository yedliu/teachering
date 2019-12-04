import React from 'react';
import { Form, Modal, Button, Input } from 'antd';
const FormItem = Form.Item;

class EditDateModal extends React.Component {
  submit=(e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.onSubmit(values);
      }
    });
  }
  render() {
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
    return (
      <Modal
        title="设置模块名称"
        footer={null}
        visible
        onCancel={this.props.onCancel}
        maskClosable={false}
      >
        <Form onSubmit={this.submit}>
          <FormItem
            {...formItemLayout}
            label="模块名称"
            hasFeedback
          >
            {getFieldDecorator('name', {
              rules: [
                { required: true, message: '请填写模块名称' },
                { whitespace: true, message: '请填写模块名称' },
                { max: 20, message: '长度不能超过20' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="别名"
            hasFeedback
          >
            {getFieldDecorator('alias', {
              rules: [
                { max: 20, message: '长度不能超过20' },
                { whitespace: true, message: '不能输入空格' }
              ],
            })(
              <Input />
            )}
          </FormItem>
          <div style={{ textAlign: 'right' }}>
            <Button style={{ marginRight: 10 }} onClick={this.props.onCancel}>取消</Button>
            <Button type="primary" htmlType="submit">确定</Button>
          </div>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({
  mapPropsToFields(props) {
    const {
      name,
      alias
    } = props;
    return {
      name: {
        value: name
      },
      alias: {
        value: alias
      },
    };
  }
})(EditDateModal);
