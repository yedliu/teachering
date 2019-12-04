import styled from 'styled-components';
import { FlexRow, FlexRowCenter, FlexColumn, FlexCenter, FadeIn, FadeOut, DivShadow } from 'components/FlexBox';

export const inputStyle = {
  width: 368,
};

export const selectStyle = {
  width: 150,
};

export const FlexRowCenter40 = styled(FlexRowCenter)`
  height: 40px;
`;
export const FlexCenter40 = styled(FlexCenter)`
  height: 40px;
`;
export const InputTitle = styled(FlexRowCenter)`
  min-width: 70px;
  justify-content: flex-end;
`;
export const MustBox = styled(FlexCenter)`
  min-width: 8px;
  color: red;
  font-weight: 600;
`;
export const SearchItem = styled(FlexRowCenter)`
  width: 235px;
  height: 50px;
`;
export const SearchWrapper = styled(FlexRow)`
  width: 100%;
  flex-wrap: wrap;
`;
