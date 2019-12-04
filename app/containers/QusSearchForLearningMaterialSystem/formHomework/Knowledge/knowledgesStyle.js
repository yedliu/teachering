import styled from 'styled-components';
import { iConfig } from '../indexStyle';
import { FlexRow } from 'components/FlexBox';

export const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  vertical-align: top;
  width: ${iConfig.leftWrapperWidth}%;
  height: 100%;
  border-right: 1px solid #ddd;
  position: absolute;
  left: 0;
  top: 0;
`;
export const TreeWrapper = styled.div`
  flex: 1;
  overflow: auto;
`;
export const SelectColumn = styled(FlexRow)`
  width: 100%;
  padding: 5px;
`;