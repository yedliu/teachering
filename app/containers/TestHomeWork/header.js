/*
 *
 * TestHomeWork Head
 *
 */

import React, { PropTypes } from 'react';
// import { connect } from 'react-redux';
// import Helmet from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
// import { createStructuredSelector } from 'reselect';
import { ContainerHeader, WidthBox } from 'components/CommonFn/style';
import { toString } from 'components/CommonFn';
import { FlexCenter } from 'components/FlexBox';
import styled from 'styled-components';
import { Select } from 'antd';

// import {} from './selectors';
// import messages from './messages';
const NewTestHomeworkBtn = styled(FlexCenter) `
  height: 30px;
  min-width: 80px;
  padding: 0 16px;
  border-radius: 15px;
  background: #ef414f;
  color: #fff;
  cursor: pointer;
  user-select: none;
  &:hover {
    color: #fff;
    background: #ff6c78;
  }
  &:active {
    color: #fff;
    background: #e43b39;
  }
`;
const TextValue = styled.div`
  min-width: 36px;
  letter-spacing: 1.3px;
`;

export class HomeWorkHeader extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.selectOne = this.selectOne.bind(this);
  }
  selectOne() {
  }

  render() {
    const selectedTwo = this.props.data.selectedTwo;
    const selectedThree = this.props.data.selectedThree;
    const selectedFour = this.props.data.selectedFour;
    return (
      <ContainerHeader>
        <Select labelInValue value={{ key: toString(selectedTwo.id), label: selectedTwo.name }} style={{ width: 120 }} onChange={(value) => this.props.callback.select(value, 2)}>
          {this.props.data.optionsList2.map((item, index) => {
            return <Select.Option key={index} value={toString(item.id)}>{item.name}</Select.Option>;
          })}
        </Select>
        <WidthBox></WidthBox>
        <Select labelInValue value={{ key: toString(selectedThree.id), label: selectedThree.name }} style={{ width: 120 }} onChange={(value) => this.props.callback.select(value, 3)}>
          {this.props.data.optionsList3.map((item, index) => {
            return <Select.Option key={index} value={toString(item.id)}>{item.name}</Select.Option>;
          })}
        </Select>
        <WidthBox></WidthBox>
        <Select labelInValue value={{ key: toString(selectedFour.id), label: selectedFour.name }} style={{ width: 120 }} onChange={(value) => this.props.callback.select(value, 4)}>
          {this.props.data.optionsList4.map((item, index) => {
            return <Select.Option key={index} value={toString(item.id)}>{item.name}</Select.Option>;
          })}
        </Select>
        <WidthBox></WidthBox>
        <NewTestHomeworkBtn
          onClick={() => {
            this.props.callback.addPaper(0);
          }}
        ><TextValue>新建测评课前测评</TextValue></NewTestHomeworkBtn>
        <WidthBox></WidthBox>
        <NewTestHomeworkBtn
          onClick={() => {
            this.props.callback.addPaper(1);
          }}
        ><TextValue>新建测评课后作业</TextValue></NewTestHomeworkBtn>
      </ContainerHeader>
    );
  }
}

HomeWorkHeader.propTypes = {
  data: PropTypes.object.isRequired,  // 传入的数据
  callback: PropTypes.object.isRequired,  // 回调
};

export default HomeWorkHeader;
