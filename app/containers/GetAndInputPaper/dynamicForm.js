import React, { PropTypes } from 'react';
import { Form, Input, Icon, Button } from 'antd';
import styled from 'styled-components';

const FormItem = Form.Item;

const InputBox = styled.div`
  display:inline-block;
  border:1px solid #ccc;
  min-height:32px;
  // line-height:32px;
  line-height: 2;
  padding: 0 5px;
  margin-right: 5px;
  border-radius: 3px;
  width: 90%;
  vertical-align:middle;
  // overflow: auto;
  color: #000000;
  p {
    line-height: 2;
    font-family: "思源黑体 CN Normal", "sans-serif"!important;
    font-size: 10.5pt;
    span {
      font-family: "思源黑体 CN Normal"!important;
    }
    span[lang="EN-US"] {
      font-family: "Arial Unicode MS","sans-serif"!important;
    }
  }
  .katex {
    font: 400 1.21em KaTeX_Main,Times New Roman,serif!important;
    font-size: 1.1em;
  }
  p:first-of-type {
    margin-top: 0;
  }
  p:last-of-type {
    margin-bottom: 0;
  }
`;
let uuid = 68;
let uuindex = 1;
class dynamicForm extends React.PureComponent {
  constructor(props) {
    super(props)
    this.remove = this.remove.bind(this)
    this.add = this.add.bind(this)
  }
  componentDidMount() {
    console.log('dynamicForm componentDidMount')
  }
  remove = (k, index) => {
    this.props.removeItem(this.props.name, index)

    // const { form } = this.props;
    // // can use data-binding to get
    // const keys = form.getFieldValue('keys');
    // // We need at least one passenger
    // if (keys.length === 1) {
    //   return;
    // }

    // // can use data-binding to set
    // form.setFieldsValue({
    //   keys: keys.filter(key => key !== k),
    // });
    // uuid--
    // uuindex--
    // this.props.removeOption(this.props.name,index)
    // this.props.removeAnswer()

  }

  add = () => {
    // uuid++;
    // uuindex++
    const { form, listType, name } = this.props;
    this.props.addItem(name);
    // // can use data-binding to get
    // const keys = form.getFieldValue('keys');

    // const character =  listType == 'number'? uuindex : String.fromCharCode(uuid)
    // const nextKeys = keys.concat(character);
    // console.log(nextKeys)
    // // can use data-binding to set
    // // important! notify form to detect changes
    // form.setFieldsValue({
    //   keys: nextKeys,
    // });
    // this.props.addOption(character)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { type, itemCount, data, change, name, listType, optionListLen, answerListLen } = this.props;
    const list = data[name];
    const len = this.props[name + 'Len'];
    console.log(this.props[name + 'Len'], len, answerListLen);
    let numList = [], charList = [];
    for (let i = 0; i < len; i++) {
      numList.push(i + 1);
      charList.push(String.fromCharCode(65 + i));
    }
    const initialValue = listType == 'number' ? numList : charList;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    getFieldDecorator('keys', { initialValue: initialValue });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      if (type && type == 'number') {
        return (
          <FormItem
            {...formItemLayout}
            label={index + 1}
            required={false}
            key={k}
          >
            {getFieldDecorator(`names-${k}`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: true,
                whitespace: true,
                message: "请完善选项",
              }],
            })(

              <InputBox dangerouslySetInnerHTML={{ __html: list[index] }} onClick={() => { change(name, index)}}></InputBox>
              )}
            {index && index == keys.length - 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                disabled={keys.length === 1}
                onClick={() => this.remove(k, index)}
              />
            ) : null}
          </FormItem>
        );
      } else {
        return (
          <FormItem
            {...formItemLayout}
            label={index === 0 ? k : k}
            required={false}
            key={k}
          >
            {getFieldDecorator(`names-${k}`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: false,
                whitespace: true,
                message: "请完善选项",
              }],
            })(
              <InputBox dangerouslySetInnerHTML={{ __html: list[index] }} onClick={() => { change(name, index) }}></InputBox>
              )}
            {index && index == keys.length - 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                disabled={keys.length === 1}
                onClick={() => this.remove(k, index)}
              />
            ) : null}
          </FormItem>
        );
      }
    });
    // const checkBox = key.map((k,index)=>{
    //     return
    // })
    return (
      <Form onSubmit={this.handleSubmit} style={{ width: '100%' }}>
        {formItems}
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="primary" onClick={this.add} style={{ width: '70%' }}>
            <Icon type="plus" /> {listType == 'number' ? '增加填空项' : '添加选项'}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const DynamicForm = Form.create({
  onFieldsChange(props, changedFields) {
    console.log('changedFields', changedFields);
    // props.formChange(changedFields);
  },
})(dynamicForm);
export default DynamicForm;
