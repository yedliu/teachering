/**
 * 评级组件
 * @prop rate 评级是几星
 * @prop count 最多是多少星
 */

import React from 'react';
import styled from 'styled-components';

const RateWrapper = styled.div`
  display: inline-block;
`;

const DifficultyItem = styled.div`
  display: inline-block;
  margin: 0 2px;
  height: 10px;
  width: 2px;
  background: ${props => (props.active ? '#ef4c4f' : '#ffdcdc')};
`;

const Rate = ({ rate, count = 5 }) => (
  <RateWrapper>
    {Array.from({ length: count }).map((el, index) => (
      <DifficultyItem key={index} active={rate > index} />
    ))}
  </RateWrapper>
);

export default Rate;
