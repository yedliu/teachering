import styled from 'styled-components';
import { FlexRowCenter, FlexCenter } from 'components/FlexBox';

export const Header = styled.div`
  height: 80px;
  width: 100%;
  border-bottom: 2px solid #ddd;
`;
export const SerachWrapper = styled(FlexRowCenter)`
  width: 100%;
  height: 50px;
`;
export const SerachItem = styled(FlexCenter)`
  height: 100%;
  min-width: 100px;
`;