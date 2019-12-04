import React from 'react';
import { Form, Select, Modal, Input, Button } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;

class FormApp extends React.PureComponent {
  handleSelectChange = (value) => {
    // const { handleGetPhase, phaseList, phaseDictCode } = this.props;
    // const nextPhaseList = handleGetPhase(value);
    // const newPhaseDictCode = (nextPhaseList.find((it) => it.get('id') === phaseDictCode) || phaseList.get(0)).get('id');
    this.props.form.setFieldsValue({
      phaseDictCode: '',
    });
  }
  render() {
    const {
      visible,
      loading,
      onCancel,
      onSave,
      form,
      subjectList,
      phaseList,
      subjectDictCode,
      phaseDictCode,
      badAdvise = '',
      middleAdvise = '',
      goodAdvise = '',
      name = '',
      tagDesc = '',
    } = this.props;
    const {
      getFieldDecorator,
      validateFields, // 校验必填字段
    } = form;

    const SubjectOption = subjectList.map(item => (
      <Select.Option
        key={item.get('id')}
        value={`${item.get('id')}`}
        title={item.get('name')}
      >
        {item.get('name')}
      </Select.Option>
    ));

    const PhaseOption = phaseList.map(item => (
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
        title="思维体系管理"
        visible={visible}
        onCancel={onCancel}
        width={700}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => {
              validateFields(err => {
                if (err) return;
                onSave();
              });
            }}
          >
            保存
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <FormItem label="思维标签名称" hasFeedback>
            {getFieldDecorator('name', {
              rules: [
                { whitespace: true, message: '名称不能为空格' },
                { max: 10, message: '长度不能超过10个字符' },
                { required: true, message: '请输入名称' },
              ],
              initialValue: name,
            })(<Input placeholder="请输入名称" />)}
          </FormItem>
          <FormItem label="所属学科">
            {getFieldDecorator('subjectDictCode', {
              rules: [{ required: true, message: '请选择学科' }],
              initialValue: subjectDictCode,
            })(<Select onChange={this.handleSelectChange}>{SubjectOption}</Select>)}
          </FormItem>
          <FormItem label="所属学段">
            {getFieldDecorator('phaseDictCode', {
              rules: [{ required: true, message: '请选择学段' }],
              initialValue: phaseDictCode,
            })(<Select>{PhaseOption}</Select>)}
          </FormItem>
          <FormItem label="思维标签说明" hasFeedback>
            {getFieldDecorator('tagDesc', {
              rules: [
                { whitespace: true, message: '思维标签说明不能为空格' },
                { required: true, message: '请输入思维标签说明' },
                { max: 100, message: '长度不能超过100个字符' },
              ],
              initialValue: tagDesc,
            })(
              <TextArea
                placeholder="最多输入100个字符"
                autosize={{ minRows: 2, maxRows: 6 }}
              />,
            )}
          </FormItem>
          <FormItem label="思维标签建议（好）" hasFeedback>
            {getFieldDecorator('goodAdvise', {
              rules: [
                { whitespace: true, message: '思维标签建议不能为空格' },
                { required: true, message: '请输入思维标签建议' },
                { max: 100, message: '长度不能超过100个字符' },
              ],
              initialValue: goodAdvise,
            })(
              <TextArea
                placeholder="最多输入100个字符"
                autosize={{ minRows: 2, maxRows: 6 }}
              />,
            )}
          </FormItem>
          <FormItem label="思维标签建议（中）" hasFeedback>
            {getFieldDecorator('middleAdvise', {
              rules: [
                { whitespace: true, message: '思维标签建议不能为空格' },
                { required: true, message: '请输入思维标签建议' },
                { max: 100, message: '长度不能超过100个字符' },
              ],
              initialValue: middleAdvise,
            })(
              <TextArea
                placeholder="最多输入100个字符"
                autosize={{ minRows: 2, maxRows: 6 }}
              />,
            )}
          </FormItem>
          <FormItem label="思维标签建议（差）" hasFeedback>
            {getFieldDecorator('badAdvise', {
              rules: [
                { whitespace: true, message: '思维标签建议不能为空格' },
                { required: true, message: '请输入思维标签建议' },
                { max: 100, message: '长度不能超过100个字符' },
              ],
              initialValue: badAdvise,
            })(
              <TextArea
                placeholder="最多输入100个字符"
                autosize={{ minRows: 2, maxRows: 6 }}
              />,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const ModalForm = Form.create({
  onValuesChange(props, values) {
    const { onValuesChange } = props;
    onValuesChange && onValuesChange(values);
  },
})(FormApp);

export default ModalForm;
