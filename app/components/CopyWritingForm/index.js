import React from 'react';
import { Button, Form, Input, Popconfirm } from 'antd';
import styled from 'styled-components';
const FormItem = Form.Item;
const { TextArea } = Input;
const Footer = styled(FormItem)`
  text-align: right;
`;
const abilityKeys = {
  easy: {
    key: 'abilitySuggestEasy',
    label: '能力建议(好)'
  },
  general: {
    key: 'abilitySuggestGeneral',
    label: '能力建议(中)'
  },
  hard: {
    key: 'abilitySuggestHard',
    label: '能力建议(差)'
  }
};
const studyKeys = {
  easy: {
    key: 'studySuggestionEasy',
    label: '学习建议(好)'
  },
  general: {
    key: 'studySuggestionMiddle',
    label: '学习建议(中)'
  },
  hard: {
    key: 'studySuggestionDifficulty',
    label: '学习建议(差)'
  }
};
class CopyWritingForm extends React.Component {
  submit=(e) => {
    const { handleSubmit, initialForm } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.id = initialForm.id;
        handleSubmit(values);
      }
    });
  }
  render() {
    const { showIntro, initialForm, loading, handleCancel, type, maxLength } = this.props;
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
    const formKeys = type === 'ability' ? abilityKeys : studyKeys;
    return (
      <Form onSubmit={this.submit}>
        {
          showIntro ? <FormItem
            {...formItemLayout}
            label="能力说明"
          >
            {getFieldDecorator('abilityRemarks', {
              initialValue: initialForm.abilityRemarks,
              rules: [{ max: maxLength, message: `最多${maxLength}个字` }],
            })(
              <TextArea />
            )}
          </FormItem> : null
        }
        <FormItem
          {...formItemLayout}
          label={formKeys.easy.label}
        >
          {getFieldDecorator(`${formKeys.easy.key}`, {
            initialValue: initialForm[formKeys.easy.key],
            rules: [{ max: maxLength, message: `最多${maxLength}个字` }],
          })(
            <TextArea  />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={formKeys.general.label}
        >
          {getFieldDecorator(`${formKeys.general.key}`, {
            initialValue: initialForm[formKeys.general.key],
            rules: [{ max: maxLength, message: `最多${maxLength}个字` }],
          })(
            <TextArea  />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={formKeys.hard.label}
        >
          {getFieldDecorator(`${formKeys.hard.key}`, {
            initialValue: initialForm[formKeys.hard.key],
            rules: [{ max: maxLength, message: `最多${maxLength}个字` }],
          })(
            <TextArea />
          )}
        </FormItem>
        <Footer>
          <Button  size="large" onClick={handleCancel}>取消</Button>
          {
            type === 'ability' ?
              <Popconfirm title="只会保存当前学科的文案！！是否确定保存？"  okText="确定" cancelText="取消"  onConfirm={this.submit} >
                <Button  type="primary" size="large"  loading={loading} style={{ marginLeft: 20 }}>
                  保存
                </Button>
              </Popconfirm>
            : <Button  type="primary" size="large" htmlType="submit" loading={loading} style={{ marginLeft: 20 }}>
              保存
            </Button>
          }
        </Footer>
      </Form>
    );
  }
}

const WrappedCopyWritingForm = Form.create()(CopyWritingForm);
export default WrappedCopyWritingForm;
