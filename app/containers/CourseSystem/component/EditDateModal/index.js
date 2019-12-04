import React from 'react';
import { Form, Modal, Button, Select } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const monthList = [
  {
    id: 1,
    name: '1月'
  },
  {
    id: 2,
    name: '2月'
  },
  {
    id: 3,
    name: '3月'
  },
  {
    id: 4,
    name: '4月'
  },
  {
    id: 5,
    name: '5月'
  },
  {
    id: 6,
    name: '6月'
  },
  {
    id: 7,
    name: '7月'
  },
  {
    id: 8,
    name: '8月'
  },
  {
    id: 9,
    name: '9月'
  },
  {
    id: 10,
    name: '10月'
  },
  {
    id: 11,
    name: '11月'
  },
  {
    id: 12,
    name: '12月'
  },
];
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
    const { data } = this.props;
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
        title="选择教学日期"
        footer={null}
        visible
        onCancel={this.props.onCancel}
        maskClosable={false}
      >
        <Form onSubmit={this.submit}>
          <FormItem
            {...formItemLayout}
            label="日期"
            hasFeedback
          >
            {getFieldDecorator('month', {
              rules: [{ required: true, message: '请选择月份' }],
              initialValue: data.month ? String(data.month) : void 0
            })(
              <Select placeholder="选择月份" allowClear>
                {
                  monthList.map(item => {
                    return <Option value={String(item.id)} key={item.id} style={{ textAlign: 'center' }}>{item.name}</Option>;
                  })
                }
              </Select>
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

export default Form.create()(EditDateModal);
