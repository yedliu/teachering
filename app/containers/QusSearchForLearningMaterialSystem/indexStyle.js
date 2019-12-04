
import styled from 'styled-components';
import { FlexCenter, FlexRowCenter } from 'components/FlexBox';

const theme = {
  headHeight: 40,
  buttonsHeight: 40,
};
export const RootWrapper = styled.div`
  height: 100%;
  width: 100%;
  background-color: #fff;
  position: relative;
`;
export const SelectConentWrapper = styled(RootWrapper)`
  padding: 5px;
`;
export const headRadioStyle = {
  height: `${theme.headHeight}px`,
};
export const Header = styled(FlexRowCenter)`
  height: ${theme.headHeight}px;
  min-height: ${theme.headHeight}px;
`;
export const HeadItem = styled(FlexCenter)`
  margin: 0 10px;
  width: 100px;
  height: 40px;
  border: 1px solid #ddd;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
`;
export const QueryContent = styled.div`
  height: calc(100% - ${theme.headHeight}px);
  width: 100%;
  border: 1px solid #ddd;
`;
export const PreviewPaperOrHwWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 10px;
  z-index: ${(props) => (props.show ? 998 : -999)};
  background-color: #fff;
`;