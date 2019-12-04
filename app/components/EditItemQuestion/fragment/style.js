import styled from 'styled-components';
import _ from 'lodash';
import { FlexRow, FlexCenter, FlexRowCenter, FlexColumn } from '../../FlexBox';

export const ValueLeft = styled.div`
  width: ${_.toString((props) => (props.width ? props.width : 44)).replace('px', '')}px;
`;
export const ValueRight = styled.div`
  width: ${_.toString((props) => (props.width ? props.width : 80)).replace('px', '')}px;
  text-align: right;
`;
export const ListItem = styled.div`
  ${(props) => (props.style ? props.style : `
    flex: 1;
    min-height: 2em;
    border: 1px solid #ddd;
    padding: 5px;
    margin-bottom: 5px;
  `)}
`;
export const listBoxStyle = {
  minHeight: '30px',
  width: '100%',
  border: '1px solid #ddd',
  padding: '5px',
};
export const DeleteItem = styled(FlexCenter)`
  width: 30px;
  height: 30px;
  color: blue;
  text-decoration: underline;
  cursor: pointer;
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
export const ItemTitle = styled.div`
  min-height: 30px;
  width: 100%;
`;
export const PromptText = styled.span`
  font-size: 12px;
  color: #999;
`;
export const MustSel = styled.span`
  color: red;
`;
export const FillQuestionWrapper = styled(FlexRow)`
  height: 300px;
  width: 100%;
`;
export const FillLeftWrapper = styled.div`
  width: 60%;
  height: 100%;
  position: relative;
`;
export const FillRightWrapper = styled(FillLeftWrapper)`
  width: 35%;
`;

export const OptionListBox = styled(FlexColumn)`
  border: 1px solid #ddd;
  border-radius: 2px;
  height: calc(100% - 30px);
`;
export const ContentBox = styled(OptionListBox)`
  cursor: text;
  word-wrap: wrap;
  word-break: break-all;
  zmfill {
    box-sizing: border-box;
    display: inline-block;
    width: 4em;
    height: 1.3em;
    margin: 0 2px;
    background: #99e6ff;
    border: 1px dashed #34adff;
    vertical-align: top;
    -webkit-user-modify: read-only;
  }
`;
export const TextArea = styled.div`
  width: 100%;
  height: 100%;
  .w-e-text {
    padding: 10px;
    overflow-y: auto;
    p {
      text-indent: 2em;
      margin: 5px 0;
      line-height: 1.5em;
    }
  }
`;
export const AllOptionListWrapper = styled.div`
  flex: 1;
  width: 100%;
`;
export const AllOptionList = styled(FlexRow)`
  width: 100%;
  padding: 3px;
  flex-wrap: wrap;
  overflow-y: auto;
`;
export const OptionItem = styled.div`
  padding: 0 5px;
  margin: 3px;
  line-height: 2em;
  border-radius: 2px;
  font-size: 12px;
  color: ${(props) => (props.isRightAnswer ? '#000' : '#fff')};
  background: ${(props) => (props.isRightAnswer ? '#dfdfdf' : '#F7A2A4')};
  border: ${(props) => (props.isRightAnswer ? '#e0e1e3' : '#F7A2A4')};
`;
export const AddErrorAnswerWrapper = styled.div`
  width: 100%;
  height: auto;
`;
export const InputWrapper = styled(FlexRowCenter)`
  min-height: 40px;
  padding: 2px 5px;
  width: 100%;
  font-size: 12px;
`;
export const InputDiv = styled.input`
  box-sizing: border-box;
  flex: 1;
  height: 20px;
  border: 1px solid #aaa;
  border-right: none;
  padding: 0 3px;
  outline: none;
  border-radius: 2px 0 0 2px;
`;
export const MyBtn = styled(FlexCenter)`
  min-width: 40px;
  max-width: 40px;
  height: 20px;
  border-radius: 0 2px 2px 0;
  cursor: pointer;
  background: #33ccff;
  color: #fff;
  font-weight: 600；;
`;
export const AddBtnWrapper = styled(InputWrapper)`
  min-height: 40px;
  border-top: 1px solid #ddd;
`;
export const AddBtn = styled(FlexCenter)`
  width: 80px;
  height: 26px;
  border: 1px solid #aaa;
  border-radius: 5px;
  font-size: 12px;
  color: #222;
  cursor: pointer;
  &:hover {
    background: #efefef;
  }
`;
