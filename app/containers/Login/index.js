/*
 *
 * Login
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
// import { isOpenCapsLock } from 'components/CommonFn';
// import Alert from 'components/Alert';

import styled, { css } from 'styled-components';
import Button from 'components/Button';
import { AppLocalStorage } from 'utils/localStorage';

import messages from './messages';
const iconLogo = window._baseUrl.imgCdn + 'c2d88bb5-bb9b-4026-8573-0edc6bba6fd2.jpg';
const iconShowEye = window._baseUrl.imgCdn + '8079371a-2c2c-4d48-aabc-68169a8038f4.png';
const iconHideEye = window._baseUrl.imgCdn + 'cbf5d6e8-38f6-4973-866d-d45a735d4235.png';
import makeSelectLogin, {
  makeMobile,
  makePassword,
  makeIsLoading,
  makeShowPassword,
  makeLoginSuccess,
  makeLoginMissText,
} from './selectors';
import {
  defaultAction,
  changeMobileAction,
  changePassWordAction,
  changeShowPasswordAction,
} from './actions';

const LoginWrapper = styled.div`
  transform: translate(-50%, -50%);
  position: absolute;
  left: 50%;
  top: 50%;
  opacity: 1;
  display: block;
  -webkit-animation-name: dialog-anim-open;
  animation-name: dialog-anim-open;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  width: 340px;
  height: 400px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px -5px rgba(0, 0, 0, .8);
  z-index: 2;
  .logo{
      margin: 50px auto 0 auto;
      width: 196px;
      height: 53px;
      background-image: url('${iconLogo}');
      background-repeat:no-repeat;
      background-position: center;
      background-size: contain;
  }
  .formwrapper{
      width: 210px;
      margin: 0 auto;
  }
  .messagetip {
      height: 20px;
      line-height: 20px;
      padding-bottom: 5px;
      font-size: 13px;
      text-align: right;
      color: #f63f3a;

  }
  .row {
      margin-bottom: 10px;
      text-align:center;
      position: relative;
      input{
          width: 100%;
          height: 38px;
          line-height: 36px;
          border: 1px solid #dbdbdb;
          border-radius: 2px;
          outline: none;
          box-sizing: border-box;
          padding: 0 10px;
          font-size: 13px;
          transition: all ease .2s;
          line-height: 16px;
          &:hover, &:focus, &:active {
              border-color:#aaa;
          }
      }
  }
`;
export const loadingShow = css`
  pointer-events: none;
  cursor: default;
  background: #eee;
`;
const LoginButtonWrapper = styled.div``;
const LoginButton = styled(Button) `
  ${(props) => (props.isLoading ? loadingShow : '')};
  width: 210px;
`;
const IconEye = styled.span`
  position: absolute;
  width: 42px;
  height: 36px;
  padding-left: 6px;
  top: 0;
  right: 0;
  background: url('${(props) => (props.changeShow ? iconShowEye : iconHideEye)}') no-repeat center center;
`;
export class Login extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.isShowPassword = this.isShowPassword.bind(this);
    this.nextInput = this.nextInput.bind(this);
    this.state = {
      canLogin: true,
    };
  }
  componentDidMount() {
    const mobile = AppLocalStorage.getMobile();
    const password = AppLocalStorage.getPassWord();
    const remberMobileAndPasswork = mobile && password;
    const isLogin = AppLocalStorage.getIsLogin();
    !mobile || this.props.dispatch(changeMobileAction(mobile));
    !password || this.props.dispatch(changePassWordAction(password));
    if (remberMobileAndPasswork && isLogin) {
      this.props.onLoginClick();
    } else if (mobile && !password) {
      document.querySelector('.passwordInput').focus();
    } else {
      document.querySelector('.mobileInput').focus();
    }
  }
  componentWillUnmount() {
    clearTimeout(this.canLoginTimer);
  }
  nextInput(e) {
    if (e.key === 'Enter') {
      document.querySelectorAll('input')[1].focus();
    }
  }
  isShowPassword() {
    const flag = !this.props.showPassword;
    const passwordBox = document.querySelectorAll('input')[1];
    if (flag) {
      passwordBox.type = 'text';
    } else {
      passwordBox.type = 'password';
    }
    this.props.dispatch(changeShowPasswordAction(flag));
    passwordBox.focus();
  }
  onLogin = () => {
    const { canLogin } = this.state;
    if (!canLogin) return;
    clearTimeout(this.canLoginTimer);
    this.setState({ canLogin: false }, () => {
      this.canLoginTimer = setTimeout(() => {
        this.setState({ canLogin: true });
      }, 2000);
    });
  };
  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <LoginWrapper>
          <div className={'logo'} />
          <div style={{ marginTop: '10px' }} className={'formwrapper'}>
            <div className={'messagetip'}>
              {this.props.loginSuccess ? (
                <FormattedMessage {...messages.loginSuccess} />
              ) : (
                this.props.loginMissText
              )}
            </div>
            <div className={'row'}>
              <input
                className={'mobileInput'}
                type="text"
                placeholder="手机"
                name="mobile"
                maxLength="11"
                onKeyPress={this.nextInput}
                onInput={this.props.mobileChange}
                value={this.props.mobile}
              />
            </div>
            <div className={'row'}>
              <input
                className={'passwordInput'}
                style={{ paddingRight: '40px' }}
                type="password"
                placeholder="密码"
                name="password"
                min="8"
                maxLength="20"
                onKeyPress={e => {
                  if (e.key === 'Enter') this.props.onLoginClick();
                }}
                onInput={this.props.passwordChange}
                value={this.props.password}
              />
              <IconEye
                changeShow={this.props.showPassword}
                className={'eye_icon'}
                onClick={this.isShowPassword}
              />
            </div>
            <LoginButtonWrapper className={'buttonrow'}>
              <LoginButton
                showtype={1}
                isLoading={this.props.isLoading}
                onClick={this.props.onLoginClick}
              >
                登录
              </LoginButton>
              {/* <FindPassWordDiv><A href="#" target="_blank">忘记密码</A></FindPassWordDiv> */}
            </LoginButtonWrapper>
          </div>
        </LoginWrapper>
      </div>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  mobile: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  showPassword: PropTypes.bool.isRequired,
  loginSuccess: PropTypes.bool.isRequired,
  mobileChange: PropTypes.func.isRequired,
  onLoginClick: PropTypes.func.isRequired,
  passwordChange: PropTypes.func.isRequired,
  //
  // openOrCloseAlert: PropTypes.bool.isRequired,
  loginMissText: PropTypes.string.isRequired,
};

const mapStateToProps = createStructuredSelector({
  Login: makeSelectLogin(),
  mobile: makeMobile(),
  password: makePassword(),
  isLoading: makeIsLoading(),
  showPassword: makeShowPassword(),
  loginSuccess: makeLoginSuccess(),
  //
  // openOrCloseAlert: makeOpenOrCloseAlert(),
  loginMissText: makeLoginMissText(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onLoginClick: () => dispatch(defaultAction()),
    mobileChange: e => {
      // 判断......
      // console.log(e.target.value, 'login mibile -- 260+');
      let mobile = e.target.value;
      if (mobile < 0) mobile = 0;
      if (String(mobile).length > 11) {
        mobile = mobile.substr(0, 11);
      }
      dispatch(changeMobileAction(mobile));
    },
    passwordChange: e => {
      // console.log(e.target.value, 'login password -- 270+');
      let password = e.target.value;
      if (e.target.type === 'text' && password.length > 20) {
        password = password.substr(0, 20);
      }
      dispatch(changePassWordAction(password));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);
