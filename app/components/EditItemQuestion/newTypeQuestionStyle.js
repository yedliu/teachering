import styled from 'styled-components';
import { FlexRow, FlexRowCenter, FlexColumn, FlexCenter, FadeIn, FadeOut, DivShadow } from 'components/FlexBox';

export default {
  QuestionWrapper: styled(FlexColumn)`
    min-height: 200px;
    min-width: 500px;
  `,
  TitleWrapper: styled(FlexRowCenter)`
    width: 100%;
    min-height: 40px;
  `,
};
