import styled from 'styled-components';
import { iConfig } from '../indexStyle';

export const RightWrapper = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  left: ${iConfig.leftWrapperWidth}%;
  vertical-align: top;
  width: calc(100% - ${iConfig.leftWrapperWidth}%);
  height: 100%;
  display: flex;
  flex-direction: column;
`;