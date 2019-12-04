import styled from 'styled-components';
import { FlexCenter, FlexRowCenter } from 'components/FlexBox';
import { toolsConfig } from './previewConfig';

export const QuestionListWrapper = styled.div`
  width: 100%;
  height: calc(100% - 30px);
  display: flex;
  flex-direction: column;
  position: relative;
`;
export const ShowAllAnalysis = styled.div`
  position: absolute;
  z-index: 9;
  top: 12px;
  right: 30px;
  height: 30px;
  padding: 5px 20px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666666;
  letter-spacing: -0.21px;
  text-align: center;
  cursor: pointer;
`;

export const QuestionBox = styled.div``;
export const QuestionItem = styled.div``;
export const QuestionTypeName = styled.p`
  line-height: 30px;
  font-size: 16px;
  font-weight: 600;
  color: #000;
`;
export const QuestionControlBox = styled.div`
  position: relative;
  margin-bottom: 16px;
  padding: 20px;
  box-sizing: border-box;
  background: ${(props) => (props.showHighlight ? '#fff' : '#FCFCFD')};
  border: 1px solid #eee;
  border-radius: 4px;
  box-shadow: ${(props) => (props.showAnalysis ? '0 1px 2px 0 rgba(0,10,47,0.28)' : 'none')};
  transition: all 0.2s ease;
  .toolsWtapper {
    display: none;
  }
  &:hover {
    border-color: #B5BAC6;
    .toolsWtapper {
      display: flex;
    }
  }
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    display: ${(props) => (props.isSelected ? 'block' : 'none')};
    width: 6px;
    height: 100%;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    background: rgba(239,76,79,0.80);
  }
`;
export const QuestionItemMask = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;
export const ToolsWtapper = styled(FlexRowCenter)`
  position: absolute;
  z-index: 2;
  margin-right: -1px;
  padding: 0 10px;
  border-top-left-radius: ${(props) => ([1, 3].includes(props.positionType) ? 4 : 0)}px;
  border-top-right-radius: ${(props) => ([1].includes(props.positionType) ? 4 : 0)}px;
  border-bottom-left-radius: ${(props) => ([2, 4].includes(props.positionType) ? 4 : 0)}px;
  border-bottom-right-radius: ${(props) => ([4].includes(props.positionType) ? 4 : 0)}px;
  height: ${toolsConfig.toolsOffsetHeight}px;
  font-size: 12px;
  color: rgba(255,255,255,0.88);
  user-select: none;
  background: #3C4A6D;
  transition: all 0.1s ease;
  cursor: pointer;
`;
export const ToolItemBox = styled(FlexCenter)`
  height: 100%;
  padding: 0 10px;
  transition: all 0.1s linear;
  &:hover {
    color: #fff;
    background: #212E4E;
  }
  button {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.88)!important;
    &:hover {
      color: #fff!important;
      opacity: 1!important;
    }
  }
`;