import styled from 'styled-components';
import { Row } from 'antd';

export const Wrapper = styled.div`
  margin: 0 5px;
`;

export const Title = styled.div`
  margin: 8px 0 15px 0;
  font-size: 16px;
  i {
    margin: 0 5px;
  }
`;

export const Section = styled.div`
  position: relative;
  box-shadow: 0px 0px 2px 0.5px black;
  transition: all 1s;
  padding: 10px;
  margin-bottom: 20px;
  .ant-col-2 {
    text-align: right;
  }
  >.ant-row {
    margin: 5px 0;
  }
  textarea {
    -webkit-appearance: none;
    outline: none;
    border-radius: 5px;
    width: 100%;
    height: 100px;
    font-size: $normal-font-size;
    border: 1px solid #DDDDDD;
    padding: 10px 10px 30px 10px;
    &::placeholder {
      color: #DDDDDD;
    }
  }
  >.anticon {
    position: absolute;
    right: -10px;
    top: -10px;
    font-size: 20px;
    cursor: pointer;
  }
`;

export const Label = styled.span`
  ${props => props.required ? (
    `&:before {
      content: '*';
      display: inline;
      color: red;
    }`
  ) : null}
`;

export const ShortLine = styled.div`
  width: 10px;
  height: 1px;
  margin: 0 8px;
  background: #ccc;
`;

export const MidRow = styled(Row)`
  display: flex;
  align-items: center;
`;