import styled from 'styled-components';

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;
export const ClearFix = styled.div`
  &::after {
    content: '';
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
  }
`;
const AnalysisWrapper = styled.div`
    white-space: pre-wrap;
    margin: 12px 0 10px 0;
    padding: 12px;
    border-radius: 2px;
    border: 1px solid #E8E2D8;
    background: #FFFBF2;
    font-family: MicrosoftYaHei;
    line-height: 19px;
    font-size: 14px;
    &::after {
    content: '';
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
    }
    display: ${(props) => (props.show ? 'block' : 'none')};
`;
const AnalysisItem = styled(FlexRow) `
  font-size: 14px;
  line-height: 20px;
  color: #7A593C;
  letter-spacing: -0.21px;
  line-height: 20px;
  &::after {
    content: '';
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
  }
`;
const AnswerTitle = styled.div`
  width: 42px;
  line-height: 2em;
  font-family: PingFangSC-Medium;
  color: #7A593C;
  white-space: nowrap;
`;

const AnswerConten = styled(ClearFix) `
  flex: 1;
  font-family: SourceHanSansCN-Normal;
  color: #000000;
  line-height: 2;
  font-size: 10.5pt;
  p:first-of-type {
    margin-top: 0;
  }
  p:last-of-type {
    margin-bottom: 0;
  }
  &.rightAnswer {
    padding-top: 2px;
  }
  display: block;
`;
const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export {
  AnalysisWrapper,
  AnalysisItem,
  AnswerTitle,
  AnswerConten,
  FlexColumn,
};