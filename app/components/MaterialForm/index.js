/**
*
* MaterialForm
*
*/

import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import { Form, Input, Select, Modal, message, Progress, Spin } from 'antd';
import styled from 'styled-components';

const FormItem = Form.Item;
const Itemwrapper = styled.div `
  display: flex;
  list-style-type: none;
  .li{
    flex: 1;
    margin-right: 10px;
  }
`;

const Fileup = styled.div `
  position: relative;
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px solid #ddd;
  overflow: hidden;
  cursor: pointer;
  input{
    position: absolute;
    top: 0;
    left: -100px;
    opacity: 0;
    cursor: pointer;
  }
`;

let itemList = [];

let fields = {};

const valueMapping = (props) => {
  const res = {};
  Object.keys(fields).forEach((item) => {
    res[item] = {
      value: props[item],
    };
  });
  return res;
};

const bytesToSize = (bytes) => {
  if (bytes === 0) return '0 B';

  const k = 1024;

  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (bytes / Math.pow(k, i)) + ' ' + sizes[i];
};

let self = null;
class MaterialForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.changeUploadFileAction = this.changeUploadFileAction.bind(this);
    this.checkFormValidate = this.checkFormValidate.bind(this);
    self = this;
  }

  changeUploadFileAction(e, maxSize, key) {
    const LimitSize = maxSize;
    if (e.target.files.length > 0) {
      if (e.target.files[0].size > LimitSize) {
        message.error(`文件大于${bytesToSize(maxSize)}!`);
      } else {
        const value = {};
        value[key] = { value: e.target.files[0], dirty: true };
        this.props.onChange(value, 'file');
      }
    } else {
      document.getElementById(`${key}name`).innerHTML = '';
    }
  }

  checkFormValidate(form) {
    form.validateFields((err) => {
      if (err) {
        return;
      }
      // this.props.onCancel();
      this.props.handleModalOnOk(form);
    });
  }

  render() {
    itemList = this.props.itemList;
    fields = this.props.fieldsList;
    return (
      <CollectionCreateForm
        {...this.props.fieldsList}
        visible={this.props.visible}
        ref={(form) => { this.form = form; }}
        onChange={(values, type) => this.props.onChange(values, type)}
        onCancel={() => { this.props.onCancel(); }}
        onCreate={() => this.checkFormValidate(this.form)}
      />
    );
  }
}

const getItem = (item, idx, getFieldDecorator) => {
  return (<Itemwrapper key={idx}>
    {
      item.cols.map((item2, idx2) => {
        switch (item2.type) {
          case 'text':
            return (<FormItem key={idx2} label={item.label}><div className="li" key={idx2}>{
              getFieldDecorator(item2.key, {
                rules: [{ required: item2.required, message: item2.placeholder }, { whitespace: item2.required, message: item2.placeholder }],
              })(
                <Input placeholder={item2.placeholder} />
                )
              }
              {
                item2.note && <span>
                  {item2.note}</span>
              }
            </div></FormItem>);
          case 'select':
            return (<FormItem key={idx2} label={item.label}><div className="li" key={idx2}>{
            getFieldDecorator(item2.key, {
              rules: [{ required: item2.required, message: item2.placeholder }, { whitespace: item2.required, message: item2.placeholder }],
            })(
              <Select style={{ width: 160, height: 40 }} size="large">
                {
                item2.options.map((item3) => {
                  return <Select.Option value={item3.id.toString()} key={item3.id} title={item3.name}>{item3.name}</Select.Option>;
                })
              }
              </Select>

              )
            }
            </div></FormItem>);
          case 'file':
            return (<FormItem key={idx2} label={item.label}><div className="li" key={idx2}> <div> {
              getFieldDecorator(item2.key, {
                rules: [{ required: item2.required, message: item2.placeholder }, { whitespace: item2.required, message: item2.placeholder }],
              })(
                <Fileup><input type="file" accept={item2.accept} onChange={(e) => { if (self.changeUploadFileAction) { self.changeUploadFileAction(e, item2.maxSize, item2.key); } }} />
                  {
                  item2.placeholder && <span className="file-tip">
                    {item2.placeholder}</span>
                }
                </Fileup>
              )
            }
              <span id={`${item2.key}name`} className="tips"></span>
              {
              item2.note && <span style={{ display: 'block', width: '100%' }}>
                {item2.note}</span>
              }
            </div>
            </div></FormItem>);
          case 'progress':
            return (<div key={idx2} label={item.label} className="li" key={idx2}>{
              item2.percent > 0 && (<div><Progress percent={item2.percent} />{item2.note && <div>{item2.note}<Spin /></div>}</div>)
            }
            </div>);
          default:
            return '';
        }
      })
    }</Itemwrapper>);
};

const CollectionCreateForm = Form.create({
  onFieldsChange(props, changedFields) {
    const key = Object.getOwnPropertyNames(changedFields);
    if (key.length > 0) {
      const value = changedFields[key[0]];
      if (value.dirty) {
        const domObj = document.getElementById(key[0]);
        if (domObj) {
          const inputDom = domObj.getElementsByTagName('input');
          if (inputDom.length > 0 && inputDom[0].getAttribute('type') === 'file') {
            if (value.value) {
              document.getElementById(`${key[0]}name`).innerHTML = value.value;
            }
          } else {
            props.onChange(changedFields);
          }
        } else {
          props.onChange(changedFields);
        }
      }
    }
  },
  mapPropsToFields(props) {
    return valueMapping(props);
  },
})(
  (props) => {
    const { visible, onCancel, onCreate, form } = props;

    const { getFieldDecorator } = form;
    return (
      <Modal visible={visible} onOk={onCreate} onCancel={onCancel}>
        <Form layout="vertical">
          {
            itemList.map((item, idx) =>
              getItem(item, idx, getFieldDecorator, props)
            )
          }

        </Form>
      </Modal>
    );
  }
);

MaterialForm.propTypes = {

};

export default MaterialForm;
