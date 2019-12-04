import React from 'react';
import styled from 'styled-components';

const TitleWrapper = styled.div`
  font-size: 14px;
  margin-bottom: 5px;
`;

const RedBlock = styled.span`
  color: red;
`;

const MouleTitle = ({ children, required, errorMessage, message, style }) => (
  <TitleWrapper style={{ ...style }}>
    {required && <RedBlock>*</RedBlock>}
    {children}
    {message && <span>{message}</span>}
    {errorMessage && <RedBlock style={{ fontSize: '12px', marginLeft: '5px' }}>{errorMessage}</RedBlock>}
  </TitleWrapper>
);

export default MouleTitle;
