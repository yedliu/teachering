import styled from 'styled-components';
import { FlexRow, FlexColumn, FlexCenter } from 'components/FlexBox';


export const LeftListWrapper = styled(FlexColumn)`
  width: 260px;
  min-width: 260px;
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
export const TextBox = styled.div`
  cursor: pointer;
  white-space: nowrap;
`;
export const PaginationWrapper = styled(FlexCenter) `
  height: 40px;
`;
