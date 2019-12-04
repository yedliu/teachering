import React from 'react';
import styled from 'styled-components';
import { FlexColumn, FlexRow, FlexRowCenter } from '../FlexBox';
import Header from './header';

const Wrapper = styled(FlexColumn)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 20px;
  background-color: white;
`;

const HeaderWrapper = styled(FlexRowCenter)`
  width: 100%;
  height: 60px;
  border-bottom: 2px solid #efefef;
`;

const BodyWrapper = styled(FlexRow)`
  flex: 1;
  width: 100%;
  margin-top: 15px;
  border: 1px solid #ddd;
  overflow: auto;
  .ant-table-wrapper {
    flex: 1!important;
  }
`;

const Layout = ({ list, children }) => (
  <Wrapper>
    <HeaderWrapper>
      <Header
        list={list}
      />
    </HeaderWrapper>
    <BodyWrapper>
      {children}
    </BodyWrapper>
  </Wrapper>
);

export default Layout;