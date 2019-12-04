import styled from 'styled-components';
import { FlexRow, FlexRowCenter, FlexColumn, FlexCenter, FadeIn, FadeOut, DivShadow } from 'components/FlexBox';
import { RootWrapper, PlaceHolderBox, ClearFix, wangStyle, questionStyle, listStyle, breakword } from 'components/CommonFn/style';

export const LeftListWrapper = styled(FlexColumn)`
  width: 260px;
  min-width: 260px;
  height: 100%;
  background: #fff;
  padding: 10px;
`;
export const RightContentWrapper = styled(FlexColumn)`
  flex: 1;
  min-height: 600px;
  height: 100%;
  background: #fff;
`;
export const SelectColumn = styled(FlexRow)`
  width: 100%;
  margin-bottom: 10px;
`;
export const TreeWrapper = styled.div`
  flex: 1;
  width: 100%;
  padding: 10px;
  background: #FAFAFA;
  border: 1px solid #DDDDDD;
  border-radius: 4px;
  overflow-y: auto;
`;
export const SerachWrapper = styled(FlexRowCenter)`
  width: 100%;
  height: 50px;
`;
export const SerachItem = styled(FlexCenter)`
  height: 100%;
  min-width: 100px;
`;
export const RightContentHeader = styled.div`
  height: 80px;
  width: 100%;
  border-bottom: 2px solid #ddd;
`;
export const HomeworkListWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;
export const HomeworkListItem = styled.div`
  height: 66px;
  padding: 0 20px;
  border-bottom: 1px solid #ddd;
`;
export const HomeworkTitle = styled.div`
  line-height: 21px;
  font-size: 16px;
  margin-right: 10px;
  color: #333;
`;
export const Author = styled.div`
  color: #999;
  font-size: 12px;
`;
export const QuestionCount = styled.span`
  font-size: 14px;
  color: #888;
  padding-right: 20px;
  line-height: 30px;
`;
export const QuestionType = styled(QuestionCount) ``;
export const ControllerWrapper = styled(FlexRowCenter) `
  color: #2385ee;
  text-decoration: underline;
  cursor: pointer;
  div {
    user-select: none;
  }
  &>div:hover {
    color: #69e;
  }
  &>div:active {
    color: #2385ee;
  }
`;
export const TextBox = styled.div`
  cursor: pointer;
  white-space: nowrap;
`;
export const PaginationWrapper = styled(FlexCenter) `
  height: 40px;
  /* padding-top: 10px; */
`;
