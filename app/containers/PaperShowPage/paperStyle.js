import styled from 'styled-components';
import { FlexRow, FlexRowCenter, FlexColumn, FlexCenter, FadeIn, FadeOut, DivShadow } from 'components/FlexBox';
import { PlaceHolderBox, WidthBox, wangStyle, ClearFix, listStyle, questionStyle, breakword, questionItemCss } from 'components/CommonFn/style';

export const PaperWrapper = styled(FlexColumn) `
  flex: 1;
`;
export const Header = styled(FlexRowCenter) `
  padding: 0 20px;
  height: 50px;
  border-bottom: 3px solid #ddd;
`;
export const ContentWrapper = styled(FlexRow) `
  flex: 1;
  padding: 10px 20px;
`;
export const LeftWrapper = styled(questionItemCss) `
  min-width: 560px
  height: 100%;
  flex: 1;
  border: 1px solid #ddd;
  padding: 10px;
  overflow-y: auto;
`;
export const QuestionMsgWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
`;
export const WeightText = styled.span`
  font-weight: 600;
`;
export const QuestionContentBox = styled(ClearFix) `
  width: calc(100vw - 560px);
  display: block;
  ${breakword}
`;
export const QuestionOptions = styled(FlexColumn) `
  padding-left: 20px;
`;
export const OptionsWrapper = styled(FlexRowCenter) `
  flex: 1;
  min-height: 2em;
  p {
    line-height: 2;
  }
  align-items: flex-start;
`;
export const OptionsOrder = styled.div`
  // display: inline-block;
  float: left;
  line-height: 2;
`;
export const Options = styled.div`
  // display: ionline-block;
  // float: left;
  // line-height: 1;
`;
export const AnalysisWrapper = styled(FlexColumn) `
  margin: 10px;
  min-height: 52px;
  border: 1px solid #ddd;
  padding: 5px;
`;
export const QuestionAnalysis = styled(FlexRow) ``;
export const QUestionAnswer = styled(FlexRow) ``;
export const AnswerTitle = styled.div`
  min-width: 42px;
  font-family: PingFangSC-Medium;
  color: #7A593C;
  line-height: 2;
`;
export const AnswerConten = styled(ClearFix) `
    flex: 1;
    font-family: SourceHanSansCN-Normal;
    &.rightAnswer {
      padding-top: 2px;
    }
    display: block;
`;
export const QuestionItemWrapper = styled.div`
  border: 1px solid #ddd;
  padding: 5px;
  flex: 1;
`;
export const QuestionTitleContent = styled(FlexRow) `
  min-height: 20px;
`;
export const ChildrenItem = styled(FlexColumn) `
  padding: 10px 10px 0;
`;
export const AnswerBox = styled(FlexColumn) `
  padding: 0 5px 5px 0;
`;
export const QuestionContentWrapper = styled(FlexColumn) `
  flex: 1;
  box-sizing: border-box;
  margin-top: 10px;
  padding: 5px;
  border: 1px solid #ddd;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.08);
  overflow-y: auto;
`;
export const ShowButton = styled(FlexRowCenter) `
  margin-top: 5px;
  height: 40px;
`;
export const RightWrapper = styled(FlexColumn) `
  min-width: min-width: 240px;
  margin-left: 10px;
  border: 1px solid #ddd;
  overflow-y: auto;
`;
export const TagsShowWrapper = styled(FlexColumn) `
  min-height: 200px;
  padding: 10px;
  border: 1px solid #ddd;
  margin-top: 10px;
  p {
    font-family: Microsoft YaHei;
  }
`;
export const TagsItemWrapper = styled(FlexRowCenter) `
  min-height: 40px;
  align-items: flex-start;
  margin-left: 20px;
  font-size: 14px;
`;
export const LineItem = styled(FlexRowCenter) `
  width: 200px;
`;
export const ItemTitle = styled.div`
  min-width: 80px;
  max-width: 80px;
  text-align: right;
  color: #333;
`;
export const TextValue = styled.div`
  flex: 1;
`;
export const PointItemSpan = styled(FlexCenter) `
  height: 25px;
  // border: 1px solid #9ff;
  border-radius: 4px;
  padding: 0 8px;
  margin: 0 5px 5px;
  font-size: 12px;
  background: #6cf;
  box-shadow: 2px 2px 3px rgba(102, 204, 255, .3);
  white-space: nowrap;
`;
export const VerifyResultWrapper = styled.div`
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ddd;
`;
export const ChildrenShowButtonWrapper = styled(VerifyResultWrapper) ``;
export const ChangeButtonWrapper = styled(FlexCenter) `
  height: 50px;
  border-top: 1px solid #ddd;
  margin: 10px -10px 0;
`;
export const ChildrenQuestionWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  ${questionStyle}
  ${listStyle}
  ${wangStyle}
`;
