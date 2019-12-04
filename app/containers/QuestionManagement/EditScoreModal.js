import React from 'react';
import { Button, Form, InputNumber, Modal } from 'antd';

const FormItem = Form.Item;
class EditScoreModal extends React.Component {
  handleSubmit=(e) => {
    const { onEditScore } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // console.log(values);
        onEditScore(values.score);
      }
    });
  }
  render() {
    const { onCancel } = this.props;
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
        title="批量设置子题分数"
        visible={true} closable={false}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="设置分数"
          >
            {getFieldDecorator('score', {
              rules: [{ required: true, message: '请输入大于0小于100的数字，最多一位小数', type: 'number', max: 100, min: 0.5 }],
              initialValue: 0
            })(
              <InputNumber
                style={{ margin: '0 10px' }}
                min={0}
                max={100}
                step={0.5}
                precision={1}
              />
            )}
          </FormItem>
          <div style={{ width: '100%', textAlign: 'right' }}>
            <Button style={{ marginRight: 20 }} onClick={() => {
              onCancel();
            }}>取消</Button>
            <Button type="primary" htmlType="submit">确定</Button>
          </div>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(EditScoreModal);
