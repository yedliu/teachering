import styled from 'styled-components';
import { Button } from 'antd';
import { ContentFilterItem } from '../../elementStyle/shareStyle';
import { FlexColumnDiv, FlexRowDiv } from 'components/Div';
import { questionItemCss } from 'components/CommonFn/style';
export const KatexItem = styled(questionItemCss)`
  p {
    font-size: inherit;
    color: inherit;
    line-height: 2em;
    .mord.text {
      font-size: 0.857em;
    }
  }
`;

export const FilterItemBox = styled.div`
  position: absolute;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  text-align: center;
  left: 0;
  top: 0;
`;

export const ButtonMg = styled(Button)`
  margin: 0 5px;
`;

export const SlidesContents = styled(FlexColumnDiv)`
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 0 10px 0;
  z-index: 0;
`;

export const FilterBox = styled.div`
  position: relative;
  width: 100%;
  line-height: 40px;
  z-index: 1;
  background: #ffffff;
`;

export const ContentFilterBox = styled(FlexRowDiv)`
  height: 40px;
  line-height: 40px;
  position: relative;
`;

export const FlexFilterItem = styled(ContentFilterItem)`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-end;
  width: 50%;
  position: absolute;
  right: 0;
  >input {
    width: 50%;
    position: relative;
    left: 0;
    top: 0;
  }
  > button {
    width: 24%;
    height: 32px;
    line-height: 32px;
  }
`;


export const TitleBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  font-size: 110%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #dedede;
`;

export const ActionBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  text-align: center;
  padding-top: 10px;
  border-top: 1px solid #dedede;
`;

export const SubmitBtn = styled.div`
  display: inline-block;
  width: 25%;
  height: 30px;
  line-height: 30px;
  border: 1px solid #acacac;
  margin-right: 20%;
  ${props => props.active ? 'background: #108ee9; border-color: #108ee9; color: #ffffff' : ''};
`;

export const CancelBtn = styled.div`
  display: inline-block;
  width: 25%;
  height: 30px;
  line-height: 30px;
  border: 1px solid #acacac;
`;

export const QuestionsContainer = styled.div`
  display: inline-block;
  width: 100%;
  height: 100%;
  overflow: auto;
`;
