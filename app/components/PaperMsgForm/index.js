/**
*
* PaperMsgForm
*
*/

import React, { PropTypes } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Row, Col, Input, Select } from 'antd';
import { toString } from 'components/CommonFn';
import { FlexRow, FlexRowCenter, FlexColumn, FlexCenter, FadeIn, FadeOut, DivShadow } from 'components/FlexBox';
import { spawn } from 'redux-saga/effects';

const Wrapper = styled(FlexColumn) `
  height: 300px;
`;
const ValueAlginRight = styled.div`
  min-width: 60px;
  text-align: right;
`;

class PaperMsgForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.getFields = this.getFields.bind(this);
  }
  getFields(item) {
    const valueChange = this.props.valueChange;
    return item.type === 'input' ? <Input style={{ width: 170 }} value={item.value} onChange={(value) => valueChange(item.dataType, { key: value.target.value, label: value.target.value })} />
      : <Select labelInValue value={{ key: toString(item.value) }} style={{ width: 170 }} onChange={(value) => valueChange(item.dataType, value)}>
        {item.options.map((it, i) => (<Select.Option key={i} value={toString(it.id)}>{toString(it.name)}</Select.Option>))}
      </Select>;
  }
  render() {
    return (<Wrapper>
      {this.props.formPropertys.map((item, index) => {
        return (<FlexRowCenter style={{ height: 50 }} key={index} gutter={24}>
          {item.map((it, i) => {
            return (<FlexRowCenter style={{ flex: 1, margin: '0 10px' }} span={8} key={i}><ValueAlginRight>{it.isDevi ? <span style={{ color: 'red' }}>*</span> : ''}{`${it.title}：`}</ValueAlginRight>{this.getFields(it)}</FlexRowCenter>);
          })}
        </FlexRowCenter>);
      })}
    </Wrapper>);
  }
}

PaperMsgForm.propTypes = {
  formPropertys: PropTypes.array.isRequired,
  valueChange: PropTypes.func.isRequired,
};

export default PaperMsgForm;
