import styled, { injectGlobal } from 'styled-components';
import { FlexColumnDiv, FlexRowDiv } from 'components/Div';

export const RootWrapper = styled(FlexColumnDiv)`
  width: 100%;
  height: 100%;
  font-size: 14px;
  background: #ffffff;
`;

export const Wrapper = styled(FlexColumnDiv)`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const ContentWrap = styled(FlexRowDiv)`
  height:100%;
`;

export const NavBox = styled(FlexColumnDiv)`
  width: 250px;
  height: 100%;
  z-index: 1;
`;

export const ContentBox = styled(FlexColumnDiv)`
  width: calc(100% - 250px);
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
`;

export const FilterContents = styled(FlexColumnDiv)`
  position: absolute;
  left: 0;
  top: 0;
  width: 250px;
  height: 100%;
  overflow: auto;
  padding-top: 45px;
  z-index: 0;
`;

export const ContentFilterItem = styled(FlexColumnDiv)`
  display: inline-block;
  position: relative;
  padding: 0 10px;
  width: ${props => props.width ? props.width : '100%'};
  height: 40px;
  line-height: 40px;
  input {
    position: absolute;
    left: 3%;
    top: 10%;
    width: 70%;
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    height: 32px;
    line-height: 32px;
    outline: none;
    padding: 0 5px; 
    &:hover {
      border-color: #108ee9;
    }
  }
  >.button {
    display: inline-flex;
    position: absolute;
    right: 3%;
    top: 10%;
    width: 20%;
    height: 32px;
    line-height: 32px;
    margin-left: 5%;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    overflow: hidden;
    color: #ffffff;
    background-color: #108ee9;
    border-color: #108ee9;
    word-break: keep-all;
  }
  .fullfill {
    width: 100%;
  }
`;

export const SlideItem = styled.div`
  width: 100%;
  margin: 0 0 10px 0;
  padding: 10px;
  border: 1px solid #cacaca;
  position: relative;
  .cZRliM .katex-html {
    background-color: transparent;
  }
  .optionItem {
    display: inline-block;
    margin-right: 30px;
    span>p {
      display: inline-block;
    }
  }
  .actionBar {
    display: none;
  }
  &.active {
    background: #108ee9;
    border-color: #108ee9;
    color: #ffffff;
  }
  &:hover {
    .actionBar {
      display: block;
    }
  }
`;

export const EmptyMessager = styled(FlexColumnDiv)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  ${props => props.hide ? 'display: none' : ''};
`;