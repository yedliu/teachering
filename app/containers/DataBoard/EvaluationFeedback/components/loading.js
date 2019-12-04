/**
 * Loading 组件
 */

import React from 'react';
import styled from 'styled-components';

const LoadingWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: url("https://web-data.zmlearn.com/image/4ee7f729-b046-4e73-983e-885563b03cdf.gif") center no-repeat;
  background-size: 70px 70px;
  background-color: #FFFFFF;
  p {
      font-size: 14px;
      color: #666666;
      text-align: center;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, 94px);
  }
`;

const Loading = () => (
  <LoadingWrapper>
    <p>正在努力为您加载数据~</p>
  </LoadingWrapper>
);

export default Loading;
