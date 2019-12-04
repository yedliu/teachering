import styled from 'styled-components';
import { FlexColSpaceBetween, FlexCenter, FlexRowCenter } from 'components/FlexBox';

export const Wrapper = styled(FlexColSpaceBetween)`
  padding: 10px;
  background-color: #fff;
`;
export const SelectBox = styled(FlexRowCenter)`
  height: 40px;
`;
export const TableBox = styled.div`
  flex: 1;
  overflow-y: hidden;
`;
export const PaginationBox = styled(FlexCenter)`
  height: 40px;
  margin-bottom: -5px;
`;

export const DatePickerBoxWrapper = styled.div``;