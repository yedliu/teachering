/*
 *
 * ChangePassWord
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import Helmet from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import makeSelectChangePassWord, { makeGetPassWordIsSameFlage, makeCanSubmit } from './selectors';
import { inputOne, inputTwo, inputThree, setCanSubmit, submitChangePassWord, changepasswordissame } from './actions';

// import messages from './messages';
import { AppLocalStorage } from 'utils/localStorage';

import styled, { css } from 'styled-components';
import { FlexColumnDiv } from 'components/Div';

const iconeye = window._baseUrl.imgCdn + '09d6828f-83c2-471f-b9f8-d80383ada8cc.png';
const iconeyeshow = window._baseUrl.imgCdn + '0b5e3f4d-ebe3-483a-81e9-1b5df7794e75.png';
const iconwarn = window._baseUrl.imgCdn + 'ddd6eed6-f7db-4399-879f-8c4681b403af.png';

const RootDiv = styled(FlexColumnDiv) `
  width: 100%;
  height: 100%;
  border: 1px solid #dddddd;
  background-color: #f4f5f7;
  flex: 1;
  input {
    outline: none;
  }
`;

const ChangePassWordWrapper = styled(FlexColumnDiv) `
  flex: 1;
  width: 100%;
  height: 100%;
  padding: 30px 88px;
  border: 1px solid #eee;
  border-shdow: 0 2px 4px rgba(233, 236, 244, .5);
  background-color: #fff;
  font-family: "微软雅黑", "Microsoft YaHei";
`;

const FontSet = css`
  font-size: 14px;
  line-height: 21px;
`;

const Title = styled.div`
  font-size: 20px;
  line-height: 30px;
  color: #333;
`;

const ChangeItem = styled.div`
  width: 343px;
  position: relative;
`;

const OldPassWordItem = styled(ChangeItem) `
  margin-top: 25px;
`;

const NewPassWordItem = styled(ChangeItem) `
  margin-top: 38px;
`;

const NewPassWordAgainItem = styled(ChangeItem) `
  margin-top: 44px;
`;

const IconStar = styled.span`
  position: absolute;
  left: 0;
  top: 7px;
  ${FontSet};
  vertical-align: middle;
  text-align: center;
  color: #ef4c4f;
`;

const ItemText = styled.span`
  width: 48px;
  ${FontSet};
  padding-left: 7px;
  color: #333;
`;

const Input = styled.input`
  width: 280px;
  height: 30px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px #f0f0f0 inset;
  background-color: #fff;
  letter-spacing: 1px;
  ${FontSet};
  text-indent: 6px;
  color: #666;
`;

const IconEye = styled.div`
  width: 26px;
  height: 13px;
  position: absolute;
  top: 11px;
  right: 5px;
  background-image: url(${iconeye});
`;

const SubmitButton = styled.button`
  width: 130px;
  height: 40px;
  margin-top: 30px;
  margin-left: 61px;
  outline: none;
  border-radius: 6px;
  font-size: 16px;
  line-height: 21px;
  letter-spacing: -0.24px;
  font-family: "Microsoft YaHei", sans-serif;
  background-color: #ccc;
  cursor: pointer;
`;

const Inform = styled.span`
  position: absolute;
  top: 32px;
  left: 61px;
  ${FontSet};
  color: #ef4c4f;
  vertical-align: middle;
  display: none;
`;

const IconWarn = styled.span`
  margin-top: -3px;
  padding-bottom: 2px;
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  ${FontSet};
  background-image: url(${iconwarn});
  color: #fff;
  text-align: center;
  vertical-align: middle;
`;

// const keySet = [];

export class PersonPassWord extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.testChangePassWord = this.testChangePassWord.bind(this);
    this.isCanSubmit = this.isCanSubmit.bind(this);
    this.removeWarning = this.removeWarning.bind(this);
    this.enterSubmit = this.enterSubmit.bind(this);
    this.isShowNewPassWord = this.isShowNewPassWord.bind(this);
    this.isShowNewPassWordAgain = this.isShowNewPassWordAgain.bind(this);
  }
  componentDidMount() {
    this.inputPassWord.oncopy = () => false;
    this.inputPassWord.onpaste = () => false;
    this.inputPassWord.oncut = () => false;
    this.inputPassWord.oncontextmenu = () => false;
    this.newPassWord.oncopy = () => false;
    this.newPassWord.onpaste = () => false;
    this.newPassWord.oncut = () => false;
    this.newPassWord.oncontextmenu = () => false;
    this.newPassWordAgain.oncopy = () => false;
    this.newPassWordAgain.onpaste = () => false;
    this.newPassWordAgain.oncut = () => false;
    this.newPassWordAgain.oncontextmenu = () => false;
  }
  testChangePassWord() {
    // Failed to complete input, prohibit to submit. 未完成输入，禁止提交。
    if (!this.props.ChangePassWord.cansubmit) return;

    const inputArr = [this.InfoOne, this.InfoTwo, this.InfoThree];
    const hidePrompt = () => {
      inputArr.forEach((e) => {
        e.style.display = 'none';
      });
    };
    // user's inputPassWord, newPassWord and newPassWordAgain. 输入的旧密码、新密码、重复密码。
    const [inputPassWord, newPassWord, newPassWordAgain] = [this.inputPassWord.value, this.newPassWord.value, this.newPassWordAgain.value];
    // old password and rule of new password.
    const oldPassWord = AppLocalStorage.getPassWord();
    const testPassWord = /^.{8,20}$/;
    // rule of password. 验证密码
    hidePrompt();
    const [infoShow, warningBorder, warningShadow] = ['block', '#ff6c78', '#f0f0f0 0 0 4px inset'];

    const warningShow = (info, inputbox) => {
      // console.log(info, inputbox);
      info.style.display = infoShow;
      inputbox.style.borderColor = warningBorder;
      inputbox.style.boxShadow = warningShadow;
    };
    if (oldPassWord !== inputPassWord) {
      warningShow(inputArr[0], this.inputPassWord);
      return;
    }
    if (!testPassWord.test(newPassWord)) {
      this.props.passwordisnotsame();
      warningShow(inputArr[1], this.newPassWord);
      return;
    }
    if (newPassWord === oldPassWord) {
      this.props.passwordissame();
      warningShow(inputArr[1], this.newPassWord);
      return;
    }
    if (newPassWord !== newPassWordAgain) {
      warningShow(inputArr[2], this.newPassWordAgain);
      return;
    }
    // alert('全部正确');
    this.props.dispatch(submitChangePassWord(true));
  }
  // judge the button can click for submit.  判断当前用户输入是否允许点击提交
  isCanSubmit() {
    // user's inputPassWord, newPassWord and newPassWordAgain. 输入的旧密码、新密码、重复密码。
    const [inputPassWord, newPassWord, newPassWordAgain] = [this.inputPassWord, this.newPassWord, this.newPassWordAgain];
    // all input has value, set cansubmit. 当三个输入框都有输入时允许按钮进行提交。
    const shouldcansubmit = inputPassWord.value && newPassWord.value && newPassWordAgain.value;
    !shouldcansubmit || this.props.dispatch(setCanSubmit(true));
    const cansubmit = shouldcansubmit ? '#ef4c4f' : '#ccc';
    this.button.style.backgroundColor = cansubmit;
  }
  removeWarning(el) {
    const inputArr = [this.InfoOne, this.InfoTwo, this.InfoThree];
    const hidePrompt = () => {
      inputArr.forEach((e) => {
        e.style.display = 'none';
      });
    };
    hidePrompt();
    el.style.border = '1px solid #ddd';
    el.style.boxShadow = '0 2px 4px #f0f0f0 inset';
  }
  enterSubmit(e) {
    e.keyCode === 13 ? this.testChangePassWord() : '';
  }
  isShowNewPassWord() {
    const showPWFlag = !(this.newPassWord.type === 'text');
    this.newPassWord.type = showPWFlag ? 'text' : 'password';
    this.newPassWordEye.style.backgroundImage = showPWFlag ? 'url(' + iconeyeshow + ')' : 'url(' + iconeye + ')';
  }
  isShowNewPassWordAgain() {
    const showPWFlag = !(this.newPassWordAgain.type === 'text');
    this.newPassWordAgain.type = showPWFlag ? 'text' : 'password';
    this.newPassWordAgainEye.style.backgroundImage = showPWFlag ? 'url(' + iconeyeshow + ')' : 'url(' + iconeye + ')';
  }
  render() {
    return (
      <RootDiv>
        <ChangePassWordWrapper>
          <Title>修改密码</Title>
          <OldPassWordItem>
            <IconStar>*</IconStar><ItemText>原密码：</ItemText><Input innerRef={x => { this.inputPassWord = x }} onKeyDown={this.enterSubmit} onInput={() => { this.removeWarning(this.inputPassWord); this.isCanSubmit(); this.props.dispatch(inputOne(this.inputPassWord.value)) }} type="password" autoComplete="off"></Input>
            <Inform innerRef={x => { this.InfoOne = x }}><IconWarn></IconWarn>&nbsp;原密码错误</Inform>
          </OldPassWordItem>
          <NewPassWordItem>
            <IconStar>*</IconStar><ItemText>新密码：</ItemText><Input innerRef={x => { this.newPassWord = x }} onKeyDown={this.enterSubmit} onInput={() => { this.removeWarning(this.newPassWord); this.isCanSubmit(); this.props.dispatch(inputTwo(this.newPassWord.value)) }} type="password" placeholder="密码必须为8-20位"></Input><IconEye innerRef={x => { this.newPassWordEye = x }} onClick={this.isShowNewPassWord}></IconEye>
            {/* <PromptMsg>密码必须为8-20位</PromptMsg> */}
            <Inform innerRef={x => { this.InfoTwo = x }}><IconWarn></IconWarn>&nbsp;{this.props.passPWIsSameFlag ? '新密码不能与旧密码相同' : '密码长度不符合规范'}</Inform>
          </NewPassWordItem>
          <NewPassWordAgainItem>
            <IconStar>*</IconStar><ItemText>新密码：</ItemText><Input innerRef={x => { this.newPassWordAgain = x  }} onKeyDown={this.enterSubmit} onInput={() => { this.removeWarning(this.newPassWordAgain); this.isCanSubmit(); this.props.dispatch(inputThree(this.newPassWordAgain.value)) }} type="password" placeholder="请再次输入新密码"></Input><IconEye innerRef={x => { this.newPassWordAgainEye = x }} onClick={this.isShowNewPassWordAgain}></IconEye>
            <Inform innerRef={x => { this.InfoThree = x }}><IconWarn></IconWarn>&nbsp;密码不一致</Inform>
          </NewPassWordAgainItem>
          {this.props.canSubmit ? <SubmitButton innerRef={x => { this.button = x }} onClick={this.testChangePassWord}>确定</SubmitButton> : <SubmitButton innerRef={x => { this.button = x }} onClick={() => ''}>确定</SubmitButton>}
        </ChangePassWordWrapper>
        {/* {this.props.getRepos} */}
      </RootDiv>
    );
  }
}

PersonPassWord.propTypes = {
  dispatch: PropTypes.func.isRequired,
  // getRepos: PropTypes.object.isRequired,
  passwordissame: PropTypes.func.isRequired,
  passwordisnotsame: PropTypes.func.isRequired,
  passPWIsSameFlag: PropTypes.bool.isRequired,
  canSubmit: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  ChangePassWord: makeSelectChangePassWord(),
  // getRepos: makeChangeResponse(),
  passPWIsSameFlag: makeGetPassWordIsSameFlage(),
  canSubmit: makeCanSubmit(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    // getRepos: () => dispatch()
    passwordissame: () => dispatch(changepasswordissame(true)),
    passwordisnotsame: () => dispatch(changepasswordissame(false)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonPassWord);
