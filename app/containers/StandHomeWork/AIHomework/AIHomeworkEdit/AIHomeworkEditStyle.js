import styled from 'styled-components';
import { toString } from 'lodash';
import { Icon } from 'antd';

import { FlexColumn, FlexCenter, FlexRowCenter } from 'components/FlexBox';
import { questionItemCss } from 'components/CommonFn/style';

import {
  AIHomeworkUIConfig,
  homeworkColorConfig,
  AIHomeworkFormWrapper,
} from '../AIHomeworkStyle';

// 编辑题目分数等
export const AIHomeworkEditWrapper = styled(AIHomeworkFormWrapper)`
  img {
    max-height: 300px;
  }
`;
export const AIEditLeft = styled(FlexColumn)`
  position: absolute;
  left: 0;
  top: 0;
  width: ${AIHomeworkUIConfig.AIEditLeftWidth};
  height: 100%;
  border-right: 1px solid #ddd;
  padding: 20px 0;
`;
export const AIEditRight = styled.div`
  position: absolute;
  left: ${AIHomeworkUIConfig.AIEditLeftWidth};
  top: 0;
  height: 100%;
  width: calc(100% - ${AIHomeworkUIConfig.AIEditLeftWidth});
`;
export const WidthBox = styled.div`
  width: ${(props) => toString(props.width ? props.width : 20).replace(/px$/, '')}px;
`;
export const IconFontDefault = styled(Icon)``;

// itemPoint 左侧的题目目录
export const PointWrapper = styled.div`
  /* position: absolute; */
  /* z-index: 2; */
  /* height: 100%; */
  width: 100%;
  /* padding-top: 40px; */
  overflow-y: auto;
`;
export const QuestionTypeName = styled.p`
  line-height: 30px;
  font-size: 16px;
  font-weight: 600;
  color: #000;
`;
export const PointBox = styled.div`
  position: relative;
  margin: 5px;
  padding: 8px;
  border: 1px solid transparent;
  .toolsWrapper-mune {
    display: none;
  }
  &:hover {
    border-color: rgb(24, 144, 255);
    .toolsWrapper-mune {
      display: flex;
    }
  }
`;
export const PointItem = styled(FlexCenter)`
  width: 38px;
  height: 38px;
  margin: 10px 5px;
  border: 1px solid ${homeworkColorConfig.defaultBorderColor};
  user-select: none;
  cursor: pointer;
  color: ${(props) => (props.selected ? homeworkColorConfig.mainFontColorWhite : '#333')};
  background: ${(props) => (props.selected ? homeworkColorConfig.mainColorBlue : homeworkColorConfig.mainBGColor)};
  &:hover {
    border-color: ${(props) => (props.selected ? homeworkColorConfig.defaultBorderColor : homeworkColorConfig.secondaryBGColor)};
  }
`;
export const ScoreBox = styled(FlexRowCenter)`
  height: 50px;
`;
export const ScoreItemBtn = styled(FlexCenter)`
  width: 130px;
  height: 30px;
  margin: 5px 20px;
  border: 1px solid ${(props) => (props.active ? homeworkColorConfig.mainColorBlue : '#666')};
  color: ${(props) => (props.active ? homeworkColorConfig.mainColorBlue : '#666')};
  cursor: pointer;
`;
export const AnalysisWrapper = styled.div`
  margin: 10px 20px;
  padding: 10px 0;
`;
export const AnalysisBox = styled.div`
  position: relative;
`;
const analysisValueWidth = '46px';
export const AnalysisValue = styled.div`
  display: inline-block;
  vertical-align: top;
  min-width: ${analysisValueWidth};
  font-family: 思源黑体,Microsoft YaHei;
  font-size: 14px;
`;
const knowledgeTextValueWidth = '60px';
export const KnowledgeTextValue = styled(AnalysisValue)`
  min-width: ${knowledgeTextValueWidth};
`;
export const AnalysisContent = styled.div`
  display: inline-block;
  font-size: 14px;
  width: calc(100% - ${analysisValueWidth});
`;
export const KnowledgeContent = styled(AnalysisValue)`
  width: calc(100% - ${knowledgeTextValueWidth});
`;
export const LineBox = styled.div`
  height: 10px;
  margin: 0 -20px;
  border-top: 1px solid #efefef;
`;
export const AnalysisItemWrapper = styled.div`
  position: relative;
`;
export const FlexRowCenterBox = styled(FlexRowCenter)`
  top: 0;
  width: 100%;
  height: 40px;
  padding-left: 15px;
`;
export const MainColorSpan = styled.span`
  color: ${homeworkColorConfig.mainColorBlue};
`;

// 题目编辑区
export const QuestionListWrapper = styled(FlexColumn)`
  position: relative;
  width: 100%;
  height: 100%;
  font-family: 思源黑体,Microsoft YaHei;
  font-size: 14px;
  color: #000;
`;
export const QuestionBox = styled.div``;
export const QuestionItem = styled.div``;
export const QuestionControlBox = styled.div`
  position: relative;
  margin-bottom: 30px;
  padding: 5px 20px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-left: ${(props) => (props.selected ? `10px solid ${homeworkColorConfig.mainColorBlue}` : '')};
  .toolsWtapper {
    display: none;
  }
  &:hover {
    border-color: ${homeworkColorConfig.mainColorBlue};
    .toolsWtapper {
      display: flex;
    }
  }
  transition: border 0.1s ease;
`;
export const ChangeQuestion = styled(FlexRowCenter)`
  position: absolute;
  z-index: 9;
  top: 10px;
  right: 20px;
  width: 85px;
  height: 30px;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  &:hover {
    color: #333;
  }
  &:active {
    color: #000;
  }
  user-select: none;
`;
export const IconReload = styled(Icon)`
  font-size: 20px;
  margin-right: 5px;
`;
const toolsOffsetHeight = '30px';
export const ToolsWtapper = styled(FlexRowCenter)`
  position: absolute;
  z-index: 2;
  margin-right: -1px;
  border-top: 1px solid ${homeworkColorConfig.mainColorBlue};
  border-bottom: 1px solid ${homeworkColorConfig.mainColorBlue};
  height: ${toolsOffsetHeight};
  color: ${homeworkColorConfig.mainColorBlue};
  user-select: none;
  cursor: pointer;
  background: #fff;
`;
export const QuestionItemMask = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;
export const ToolItemBox = styled(FlexCenter)`
  height: 100%;
  /* width: 100px; */
  padding: 0 10px;
  border-left: 1px solid ${homeworkColorConfig.mainColorBlue};
  border-right: 1px solid ${homeworkColorConfig.mainColorBlue};
  border-right: ${(props) => (!props.hasRightBorder ? 'none' : '')};
`;

// 单体显示
export const QuestionItemWrapper = styled(questionItemCss)`
  zmblank {
    visibility: hidden;
  }
  .question-index {
    float: left;
    font-family: "思源黑体 CN Normal", "Microsoft YaHei";
    font-size: 10.5pt;
    line-height: 2em;
  }
  .title-content {
    font-family: "思源黑体 CN Normal", "Microsoft YaHei";
    font-size: 10.5pt;
    line-height: 2em;
    padding-top: 2px;
  }
  .title-content::after {
    content: '';
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
  }
`;
export const OptionListWrapper = styled.div`
  padding-left: 1em;;
`;
export const ChildItemWrapper = styled.div`
  position: relative;
`;
const childItemNumWidth = '30px';
export const ChildItemNum = styled.div`
  display: inline-block;
  min-width: ${childItemNumWidth};
  font-family: 思源黑体,Microsoft YaHei;
  font-size: 14px;
  vertical-align: top;
`;
export const ChildItemContent = styled.div`
  display: inline-block;
  width: calc(100% - ${childItemNumWidth} - 40px);
`;
export const PromptText = styled.p`
  font-size: 12px!important;
  color: #666!important;
  font-family: microsoft YaHei!important;
`;
export const SplitSpan = styled.span`
  display: inline-block;
  width: 2px;
  height: 12px;
  background: #ddd;
  margin: -1px 5px;
`;

// 设置分数弹框
export const ButtonWrapper = styled(FlexCenter)`
  height: 50px;
`;

export const GoldLabel = styled.span`
 color: #7A593C;
 font-weight: bold;
`;
