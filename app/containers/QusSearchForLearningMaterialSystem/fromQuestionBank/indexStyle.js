import styled from 'styled-components';
import { Icon } from 'antd';
import { FlexCenter, FlexRowCenter } from 'components/FlexBox';

const iConfig = {
  leftWrapperWidth: 23,
};

export const RootWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;
export const LeftWrapper = styled.div`
  display: inline-block;
  vertical-align: top;
  width: ${iConfig.leftWrapperWidth}%;
  height: 100%;
  border-right: 1px solid #ddd;
`;
export const TreeWrapper = styled.div`
  flex: 1;
  overflow: auto;
`;

export const RightWrapper = styled.div`
  display: inline-block;
  vertical-align: top;
  width: calc(100% - ${iConfig.leftWrapperWidth}%);
  height: 100%;
`;
export const QuestionsWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
`;
export const LoadWrapper = styled(FlexCenter)`
  height: 100%;
`;
export const QuestionItem = styled.div`
  margin: 5px;
  padding: 5px 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  &:hover {
    border-color: rgb(24, 144, 255);
  }
  position: relative;
  .isSelected {
    position: absolute;
    top: -1px;
    left: -1px;
    width: ${(props) => (props.isSelected ? 6 : 0)}px;
    height: calc(100% + 2px);
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    background: rgb(24, 144, 255);
    display: ${(props) => (props.isSelected ? 'block' : 'none')};
    transition: all 0.15s ease;
  }
`;
export const LineBox = styled.div`
  margin: 2px 0;
  height: 1px;
  background: #ddd;
`;
export const PaginationWrapper = styled(FlexCenter) `
  min-height: 40px;
`;
export const FilterQuestionNumber = styled.div`
  font-size: 13px;
  color: #999999;
`;
export const FilterQuestionOrder = styled(FilterQuestionNumber)`
  span {
    display: inline-block;
    margin-right: 5px;
    padding: 3px 5px;
  }
`;
export const IconArrow = styled(Icon)`
  color: ${(props) => (props.selected ? '#108ee9' : '#999')};
  cursor: pointer;
`;
export const SeeAnalysisWrapper = styled(FlexRowCenter) `
  width: 140px;
  font-size: 12px;
  cursor: pointer;
  user-select: none;
`;
export const ClickBox = styled.div`
  width: 12px;
  height: 12px;
  margin-right: 3px;
  border-radius: 50%;
  border: ${(props) => (props.selected ? '2px solid #EF4C4F' : '1px solid #ddd')};
`;
export const SeeAnalysisValue = styled.div``;
