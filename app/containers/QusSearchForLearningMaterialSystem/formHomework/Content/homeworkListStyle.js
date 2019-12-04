import styled from 'styled-components';
import { FlexCenter, FlexRowCenter } from 'components/FlexBox';

export const RootWrapper = styled.div`
  flex: 1;
  width: 100%;
  overflow-y: auto;
`;
export const PaginationWrapper = styled(FlexCenter) `
  height: 40px;
`;
export const HomeworkListWrapper = styled.div`
  width: 100%;
  /* height: 100%; */
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
// export const Author = styled.div`
//   color: #999;
//   font-size: 12px;
// `;
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