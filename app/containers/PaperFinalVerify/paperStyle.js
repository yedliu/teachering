import styled from 'styled-components';
import {
  FlexRow,
  FlexRowCenter,
  FlexColumn,
  FlexCenter,
  FadeIn,
} from 'components/FlexBox';
import { questionItemCss } from 'components/CommonFn/style';

export const PreViewWrapper = styled(FlexColumn)`
  flex: 1;
`;
export const HeaderBox = styled(FlexRowCenter)`
  min-height: 50px;
  border-bottom: 2px solid #ddd;
  background: #fff;
`;
export const PreViewBody = styled(FlexRow)`
  flex: 1;
`;
export const ContentLeft = styled(FlexColumn)`
  height: 100%;
  flex: 1;
  min-width: 500px;
  padding: 15px;
  overflow-y: auto;
`;
export const ContentRight = styled(FlexColumn)`
  width: 245px;
  margin: 15px 15px 15px 0;
  border: 1px solid #ddd;
  background: #fff;
  overflow-y: auto;
`;
export const CompileWrapper = styled(FlexRowCenter)`
  min-height: 50px;
  border: 1px solid #ddd;
  background: #fff;
`;
export const QuestionContent = styled.div``;
export const QuestionContentWrapper = styled(FlexColumn)`
  flex: 1;
  box-sizing: border-box;
  min-height: 300px;
  padding: 10px;
  border: 1px solid #ddd;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
  overflow-y: auto;
  background: #fff;
`;
export const TagsWrapper = styled.div`
  margin-top: 5px;
  min-height: 200px;
  padding: 5px;
  border: 1px solid #ddd;
  font-size: 14px;
  background: #fff;
`;
export const TagsItemWrapper = styled(FlexRowCenter)`
  min-height: 40px;
`;
export const TagsItemBox = styled(FlexRowCenter)`
  height: 100%;
  width: 220px;
`;
export const ValueRight = styled.div`
  width: 80px;
  text-align: right;
`;
export const ValueLeft = styled.div`
  flex: ${props => (props.flex === 'none' ? '' : 1)};
  text-align: left;
`;
export const ShowButton = styled(FlexRowCenter)`
  min-height: 30px;
  margin-top: 5px;
`;
export const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    transform: 'translate3d(-50%, -50%, 0)',
    // height: 900,
    // minHeight: 800,
    maxHeight: 700,
    height: 700,
    // maxHeight: '900px',
    // width: 1200,
    // maxWidth: 1200,
    // minHeight: 'calc(100vh - 200px)',
    minWidth: 860,
    width: 1000,
    maxWidth: 1200,
    animation: `${FadeIn} .5s linear`,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, .2)',
    borderRadius: '6px',
    display: 'flex',
    padding: 0,
    flexDirection: 'column',
    overflow: 'auto',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
    minWidth: 850,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    overflow: 'auto',
  },
};
export const CloseBox = styled.div`
  box-sizing: border-box;
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  margin-left: 5px;
  line-height: 24px;
  text-align: center;
  font-size: 30px;
  user-select: none;
  cursor: pointer;
`;
export const QuestionMsgContainer = styled(FlexColumn)`
  flex: 1;
  padding: 15px;
  .edui-default .edui-editor {
    border: 1px solid #d4d4d4;
  }
`;
export const BasisMsgBox = styled.div`
  height: 80px;
  border: 1px solid #ddd;
`;
export const AddPoint = styled(FlexCenter)`
  width: 22px;
  height: 22px;
  margin-left: 5px;
  background: #f33;
  border-radius: 6px;
  color: #fff;
  font-weight: 600;
  font-size: 18px;
  cursor: pointer;
`;
export const TreeWrapper = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;
export const MainQuestionTextArea = styled(questionItemCss)`
  min-height: 40px;
  max-height: 450px;
  margin-bottom: 5px;
  padding: 5px 0;
  border: 1px solid #ddd;
  overflow-y: auto;
  .katex-html {
    background: #9ff;
  }
`;
export const QuestionItemWrapper = styled.div`
  min-height: 80px;
  border: 3px solid #e8e2d8;
  padding: 10px;
  margin-bottom: 5px;
`;
export const ContentWrapper = styled(questionItemCss)`
  flex: 1;
  box-sizing: border-box;
  min-height: 350px;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
  background: #fff;
  overflow-y: auto;
`;
export const DivBox = styled.div``;
export const ListItem = styled.div`
  flex: 1;
  min-height: 30px;
  border: 1px solid #ddd;
  padding: 5px;
  margin-bottom: 5px;
`;
export const AnswerListBox = styled(FlexRowCenter)`
  min-height: 30px;
  flex-wrap: wrap;
`;
export const OptionBox = styled(FlexCenter)`
  flex: 1;
  min-width: 50px;
  padding-left: 20px;
`;
export const DeleteItem = styled(FlexCenter)`
  width: 30px;
  height: 30px;
  color: blue;
  text-decoration: underline;
  cursor: pointer;
`;
export const BigQuestionMsgBox = styled.div`
  width: 100%;
`;
const InputItem = styled(FlexRowCenter)`
  font-size: 16px;
  color: #333;
  font-weight: 600;
  font-family: Microsoft Yahei;
  padding: 10px 0;
`;
// export const BigQuestionIndex = styled(InputItem) ``;
export const BigQuestionTitleBox = styled(InputItem)``;
export const TextValue = styled.p`
  font-family: Microsoft Yahei;
  margin: 0;
  min-width: ${props => (props.minWidth ? props.minWidth : 0)}px;
`;
