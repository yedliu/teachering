import styled from 'styled-components';
import {  Select, Input, Radio, Tree, } from 'antd';
import { FlexRow, FlexRowCenter, FlexColumn, FlexCenter } from 'components/FlexBox';
import { wangStyle, ClearFix, questionStyle, listStyle, } from 'components/CommonFn/style';

export const VerifyWrapper = styled(FlexColumn) `
  flex: 1;
`;
export const TopButtonsBox = styled(FlexRow) `
  height: 50px;
  justify-content:space-between;
  padding: 10px;
  background: #eee;
`;
export const QuestionContentBox = styled(ClearFix) `
  display: block;
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
  float: left;
  line-height: 2;
`;
export const Options = styled.div`
  line-height: 1;
`;
export const AnalysisWrapper = styled(FlexColumn) `
  margin: 10px;
  min-height: 52px;
  border: 1px solid #ddd;
  padding: 5px;
  background: #fff;
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
    color: #000000;
    p {
      line-height: 2;
    }
    .katex {
      font-size: 1.1em;
    }
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
export const QuestionItemWrapper = styled.div`
  border: 1px solid #ddd;
  padding: 5px;
  flex: 1;
  background: #f0f0f0;
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
export const ShowButton = styled(FlexRowCenter) `
  height: 40px;
  margin: 0 20px;
`;

export const ContentWrapper = styled(FlexRow) `
  margin-top: 10px;
  flex: 1;
  margin-right: 10px;
  border: 1px solid #ddd;
`;
export const LeftWrapper = styled(FlexColumn) `
  flex: 1;
  height: 100%;
  padding: 10px;
  background: #D2D2D2;
  overflow-y: auto;
`;
export const RightWrapper = styled(FlexColumn) `
  width: 260px;
  padding: 0 10px;
  border: 1px solid #ddd;
`;
export const QuestionWrapper = styled.div`
  background: #f0f0f0;
  ${questionStyle}
  ${listStyle}
  ${wangStyle}
`;
export const TagsShowWrapper = styled.div`
  margin-top: 10px;
  border-top: 1px solid #ddd;
  padding: 10px;
  background: #fff;
`;
export const TagsShowRow = styled(FlexCenter) `
  border: 1px solid #ddd;
  min-height: 100px;
  justify-content: space-between;
  flex-wrap: wrap;
`;
export const TagsItemBox = styled.div`
  width: 200px;
  height: 120px;
  margin: 10px 10px;
`;
export const Option = Select.Option;
export const RadioBox = styled(Radio) `
  display: block;
  margin: 10px;
`;
export const TagsItemContent = styled.div`
  display: inline-block;
  background: ${(props) => (props.index === 1 ? '#9cf' : '#9fc')};
  min-width: 60px;
  height: 20px;
  border-radius: 6px;
  text-indent: 10px;
  line-height: 20px;
  color: black;
`;
export const TreeShowWrapper = styled.div`
  margin-top: 10px;
  padding: 1px;
  border: 1px solid #ddd;
`;
export const TreeGroupWrapper = styled.div`
  margin: 10px;
`;
export const TreeGroupBox = styled(FlexRow) `
  min-height: 350px;
  justify-content: space-around;
`;
export const TreeItemBox = styled.div`
  flex: ${(props) => props.flex};
  height: 340px;
  margin: 5px 10px;
  background: #f0f0f0;
  overflow: auto;
`;
export const ButtonsWrapper = styled(FlexCenter) `
  min-height: 50px;
  background: #fff;
`;
export const VerifyChildrenButton = styled.div`
  min-height: 50px;
  padding: 0 10px;
  background: #fff;
`;
export const TextValue = styled.p`
  font-size: 14px;
  font-weight: 600;
`;
export const Textarea = Input.TextArea;

export const RadioGroup = Radio.Group;
export const TreeNode = Tree.TreeNode;