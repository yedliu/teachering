import styled from 'styled-components';
import {
  Button as AntdButton,
} from 'antd';
import {
  FlexRowCenter,
} from 'components/FlexBox';

import {
  QuestionMsgContainer as ContainerWrapper,
  AddPoint as IAddPoint,
} from 'containers/PaperFinalVerify/paperStyle';
const AddPoint = styled(IAddPoint)`
  min-width: 22px;
`;
const Button = styled(AntdButton)`
  margin-right: 20px;
`;
const CheckGroup = styled.div `
  width: 100%;
`;
const NewQuestionWrapper = styled.div `
  div {
    margin-bottom: 5px;
  }
  .tips {
    color: grey;
    margin: 0 5px;
    opacity: 0.6;
  }
`;
const AddBox = styled.div `
  width: 200px;
  height: 300px;
  border: 1px dotted red;
  background: #FBE7F2;
  position: relative;
  cursor: pointer;
  .vertical {
    position: absolute;
    width: 5px;
    height: 80px;
    top: calc(50% - 40px);
    margin: 0 auto;
    right: 0;
    left: 0;
    background: #897580;
    border-radius: 4px;
  }
  .across {
    position: absolute;
    width: 80px;
    height: 5px;
    margin: 0 auto;
    top: 50%;
    right: 0;
    left: 0;
    background: #897580;
    border-radius: 4px;
  }
  .text {
    position: absolute;
    margin: 0 auto;
    bottom: 70px;
    right: 0;
    left: 0;
    text-align: center;
  }
`;
const BoxWrapper = styled(FlexRowCenter)`
  flex-wrap: wrap;
  div {
    margin: 5px;
  }
`;
const QuestionMsgContainer = styled(ContainerWrapper)`
  zmsubline {
    height: 1.5em;
  }
`;
const Wrapper = styled.div ``;

export {
  AddPoint,
  Button,
  CheckGroup,
  NewQuestionWrapper,
  AddBox,
  BoxWrapper,
  QuestionMsgContainer,
  Wrapper,
};
