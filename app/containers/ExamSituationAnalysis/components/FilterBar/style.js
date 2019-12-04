import styled from 'styled-components';
import { Icon } from 'antd';

export const YearWrapper = styled.div`
  display: flex;
`;
export const Minus = styled(Icon)`
    font-size: 20px;
    line-height: 28px;
`;
export const FormWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
export const FormItem = styled.div`
  display: flex;
  margin-right: 10px;
  margin-bottom: 20px;
`;
export const Label = styled.span`
  width: 60px;
  line-height: 28px;
  text-align: right;
`;
export const BoxLabel = styled.span`
  width: 60px;
  text-align: right;
  background: #eee;
  padding-top: 13px;
`;
export const RequiredSymbol = styled.span`
  color: red;
`;
