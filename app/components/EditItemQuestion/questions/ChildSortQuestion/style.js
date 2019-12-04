import styled from 'styled-components';
import { Input } from 'antd';

export const Item = styled.li`
  display: flex;
  margin: 5px 0;
  align-items: center;
  .ant-btn {
    margin-left: 5px;
  }
`;

export const TextOptionWrapper = styled.div`
  height: 34px;
  margin-bottom: 5px;
  flex: 1;
  position: relative;
  .count {
    position: absolute;
    width: 35px;
    right: 5px;
    top: 0;
    bottom: 0;
    display: inline-block;
    line-height: 35px;
    text-align: right;
  }
`;

export const TextOption = styled(Input)`
  height: 34px;
  padding: 5px 40px 5px 5px;
  width: 100%;
`;

export const EditorLi = styled.li`
  position: relative;
  ${props => (
    props.show
      ? { height: 'auto', overflow: 'inherit' }
      : { height: '0px', overflow: 'hidden' }
  )};
  .katex-html {
    background-color: inherit;
  }
`;
