import styled from 'styled-components';
import { Icon } from 'antd';
import { FlexRow, FlexColumn, FlexCenter } from 'components/FlexBox';

export const AIHomeworkUIConfig = {
  leftWrapperWidth: '400px',
  AIEditLeftWidth: '270px',
};
export const homeworkColorConfig = {
  mainColorBlue: 'rgb(24, 144, 255)',     // 主题色
  promptColorGray: '#999',
  mainFontColorWhite: '#fff',             // 主题色作为背景色时的字体色
  mainBGColor: '#fff',                    // 主要背景色
  secondaryBGColor: 'rgb(172, 215, 255)', // 次要背景色
  defaultBorderColor: '#ddd',
};

export const AIWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
`;
export const AILeftWrapper = styled(FlexColumn)`
  position: absolute;
  top: 0;
  left: 0;
  width: ${AIHomeworkUIConfig.leftWrapperWidth};
  height: 100%;
  border-right: 1px solid #ddd;
  background: ${homeworkColorConfig.mainBGColor};
  /* overflow: auto; */
`;
export const AIRightWrapper = styled.div`
  position: absolute;
  top: 0;
  left: ${AIHomeworkUIConfig.leftWrapperWidth};
  height: 100%;
  width: calc(100% - ${AIHomeworkUIConfig.leftWrapperWidth});
`;

// tree
export const TreeWrapper = styled.div``;

// form
export const AIHomeworkFormWrapper = styled(FlexColumn)`
  width: 100%;
  height: 100%;
  padding: 20px 10px;
  background: ${homeworkColorConfig.mainBGColor};
`;
export const FormGroupItem = styled(FlexRow)`
  min-height: 50px;
`;
export const FormTextValue = styled.div`
  font-size: 16px;
  padding: 0 10px;
  text-align: left;
  color: ${homeworkColorConfig.promptColorGray};
  font-weight: 600;
  min-width: 120px;
`;
export const FormTextSmallValue = styled(FormTextValue)`
  font-size: 14px;
  min-width: 90px;
  padding: 0;
  text-align: right;
  font-weight: 400;
`;
export const HalfCircleDiv = styled(FlexCenter)`
  height: 30px;
  margin: 0 10px 10px;
  padding: 0 20px;
  border-radius: 15px;
  color: ${homeworkColorConfig.mainFontColorWhite};
  background: ${homeworkColorConfig.mainColorBlue};
`;
export const FormItemTitle = styled.div`
  margin: 30px 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: #000;
`;
export const RowTowBox = styled(FlexRow)`
  justify-content: flex-start;
  min-height: 100px;
  font-size: 14px;
  color: ${homeworkColorConfig.mainFontColorWhite};
  .left {
    min-width: ${(props) => props.leftWidth};
  }
  .right {
    display: flex;
    flex-wrap: wrap;
    margin-left: 20px;
    width: ${(props) => props.rightWidth};
  }
`;
export const QuestionTypeClassItem = styled(FlexCenter)`
  position: relative;
  width: 100px;
  height: 30px;
  margin: 0 10px 10px 0;
  border: ${(props) => props.isActive ? 'none' : `1px solid ${homeworkColorConfig.mainFontColorWhite}`};
  border-radius: 3px;
  text-indent: -10px;
  background: ${(props) => props.isActive ? homeworkColorConfig.mainColorBlue : homeworkColorConfig.secondaryBGColor};
  color: ${(props) => props.isActive ? homeworkColorConfig.mainFontColorWhite : homeworkColorConfig.mainColorBlue};
`;
export const IconClose = styled(Icon)`
  position: absolute;
  top: 8px;
  right: 5px;
  cursor: pointer;
`;
