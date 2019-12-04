import React, { Component } from 'react';

import { Input, message } from 'antd';
const { TextArea } = Input;


class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      src: ''
    };
  }
  handleChange = (e) => {
    const { getItemContent } = this.props;
    console.log('handleChange', e.target.value, getItemContent)
    const value = e.target.value;
    if ((value || '').length > 5000) {
      message.info('最多只能输入5000个字符哦！');
      return;
    }
    getItemContent({
      'optionElementContent': value,
      'optionElementDesc': '纯文本',
      'optionElementType': 2, // 纯文本
    });
  }
  render() {
    const {
      optionElementItem,
    } = this.props;
    return (
      <span style={{ flex: 1 }}>
        <TextArea
          value={optionElementItem[`optionElementContent`] || ''}
          rows={1}
          onChange={this.handleChange}
        />
      </span>
    );
  }
}

export default TextEditor;
