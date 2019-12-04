import React from 'react';
import {  Modal, Select } from 'antd';
const Option = Select.Option;
export default class PrintCheck extends React.Component {

  handleSelect = (value) => {
    this.setState({ value });
  }
  onOk = () => {
    const { onSelect } = this.props;
    const { value } = this.state;
    onSelect(Number(value));
  }
  onCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  }
  render() {

    return (
      <Modal
        title="选择水印"
        visible
        closable={false}
        onCancel={this.onCancel}
        onOk={this.onOk}
        bodyStyle={{
          height: 100,
          lineHeight: 4.5,
        }}
      >
        <Select
          style={{ width: '100%' }}
          placeholder="请选择水印"
          onChange={this.handleSelect}
        >
          <Option value={'0'}>掌门教育</Option>
          <Option value={'1'}>掌门优课</Option>
        </Select>
      </Modal>
    );
  }
}
