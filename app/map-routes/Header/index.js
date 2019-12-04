/*
 *
 * Header
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { FlexRow, FlexRowCenter, FlexCenter, FlexColumn } from 'components/FlexBox';
import AppLocalStorage from 'utils/localStorage';
import { browserHistory } from 'react-router';
import { Modal, Input, Button, Avatar, Dropdown, Menu, Icon, Tag, message } from 'antd';
import immutable from 'immutable';
import { setHeader, changeVerifyCodeAction, getVerifyCodeAction } from './actions';
import makeSelectHeader, { makeVerificationCode } from './selectors';
const avatar = window._baseUrl.imgCdn + 'f976d41e-c26b-43b1-ad3c-25234051b106.png';
import { isFunction } from 'lodash';
import { detectZoom } from 'utils/helpfunc';
import PasteBoard from './pasteBoard';


const HeaderWrapper = styled(FlexRow)`
  height: 54px;
  width: 100%;
  line-height:60px;
  background-color: white;
  padding-right: 25px;
  min-width: 250px;
`;
const RightUserMsg = styled(FlexRowCenter)`
  padding-right:10px;
  .name {
    margin: 0 10px;
  }
`;
const Img = styled.img`
  margin-right: 10px;
  max-height: 70px;
`;
const TagMg = styled(Tag)`
  margin: 0 10px;
`;
const Border = styled.div`
  position: relative;
  display: flex;
  flex: 1;
`;

export class Header extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.getVerifyCode = this.getVerifyCode.bind(this);
    this.state = {
      codeTimeInterval: 0,
      submitLoading: false,
      zoom: detectZoom(),
      showInfo: false,
      showPaste: AppLocalStorage.getBoardShowPaste() === 'true' ? true : false,
      pasteContent: AppLocalStorage.getBoardPasteContent() || '',
    };
    this.resizeFunc = () => {
      this.setState({
        zoom: detectZoom()
      });
    };
  }
  componentDidMount() {
    if (!this.props.Header.name) {
      this.props.getUserInfo();
    }
    window.addEventListener('resize', this.resizeFunc);
  }
  componentWillUnmount() {
    clearInterval(this.codeTimer);
    window.removeEventListener('resize', this.resizeFunc);
  }
  showInfo = () => {
    this.setState({
      showInfo: !this.state.showInfo
    });
  }
  showPaste = (showPaste) => {
    this.setState({
      showPaste
    });
    AppLocalStorage.setBoardShowPaste(showPaste);
  }
  getVerifyCode() {
    const { dispatch } = this.props;
    if (this.state.codeTimeInterval > 0) return;
    clearInterval(this.codeTimer);
    this.setState({ codeTimeInterval: 5 });
    this.codeTimer = setInterval(() => {
      const codeTimeInterval = this.state.codeTimeInterval;
      if (codeTimeInterval <= 0) {
        clearInterval(this.codeTimer);
        return;
      }
      const newCodeTimeInterval = codeTimeInterval - 1;
      this.setState({ codeTimeInterval: newCodeTimeInterval });
    }, 1000);
    dispatch(getVerifyCodeAction());
  }
  onChange = (pasteContent = '') => {
    if (pasteContent.length > 500) {
      message.info('请输入的内容太多了');
      return;
    }
    this.setState({
      pasteContent
    });
    AppLocalStorage.setBoardPasteContent(pasteContent);
  }
  render() {
    const { dispatch, verificationCode } = this.props;
    const { codeTimeInterval, submitLoading, showInfo, zoom,
      showPaste, pasteContent } = this.state;
    const menu = (
      <Menu style={{ padding: '5px 10px' }}>
        <Menu.Item>
          <div onClick={this.props.signOut}>
            <Icon type="logout" />
            <span style={{ marginLeft: 5 }}>退出</span>
          </div>
        </Menu.Item>
        <Menu.Item>
          <div onClick={this.showInfo}>
            <Icon type="info-circle" />
            <span style={{ marginLeft: 5 }}>设备信息</span>
          </div>
        </Menu.Item>
        <Menu.Item>
          <div onClick={() => this.showPaste(true)}>
            <Icon type="copy" />
            <span style={{ marginLeft: 5 }}>我的粘贴板</span>
          </div>
        </Menu.Item>
      </Menu>
    );
    return (
      <div style={{ width: '100%' }}>
        <HeaderWrapper>
          <Border>
            {showPaste ? (
              <PasteBoard
                pasteContent={pasteContent}
                onChange={this.onChange}
                close={() => this.showPaste(false)}
              />
            ) : null}
          </Border>
          <RightUserMsg>
            <Dropdown overlay={menu} placement="bottomCenter">
              <Avatar src={avatar} style={{ cursor: 'pointer' }} />
            </Dropdown>
            <div className="name">{this.props.Header.name || ''}</div>
          </RightUserMsg>
        </HeaderWrapper>
        {showInfo ? (
          <Modal
            visible
            title={'设备信息'}
            footer={null}
            width={'400px'}
            style={{ top: 'calc(50% - 150px)' }}
            onCancel={this.showInfo}
          >
            <FlexColumn style={{ justifyContent: 'center', padding: '0 10px' }}>
              <FlexCenter>浏览器缩放比例：{zoom}%{zoom === 100 ? <TagMg color="#87d068">正常</TagMg> : <TagMg color="#2db7f5">请按住ctrl+鼠标滚轮调整</TagMg>}</FlexCenter>
            </FlexColumn>
          </Modal>
        ) : ''}
        <Modal
          visible={verificationCode.get('show')}
          title={verificationCode.get('title') || '请输入验证信息'}
          bodyStyle={{ lineHeight: '2em' }}
          style={{ top: 'calc(50% - 150px)' }}
          closable={false}
          onCancel={() => {
            dispatch(changeVerifyCodeAction('default'));
          }}
          footer={[
            <Button
              key="back" onClick={() => {
                dispatch(changeVerifyCodeAction('default'));
              }}
            >取消</Button>,
            <Button
              key="submit" type="primary" loading={submitLoading}
              onClick={() => {
                if (isFunction(verificationCode.get('onOk'))) verificationCode.get('onOk')();
              }}
            >确定</Button>,
          ]}
        >
          <p style={{ fontSize: 14, lineHeight: '2em' }}>{verificationCode.get('children') || '请输入下面验证码来领取任务'}</p>
          <Img draggable={false} title="点击更换验证" onClick={this.getVerifyCode} src={verificationCode.get('src') ? `data:image/png;base64,${verificationCode.get('src')}` : ''} />
          {codeTimeInterval > 0 ? <span style={{ display: 'inline-block' }}>{`${codeTimeInterval}秒后可再次更换验证码`}</span> : ''}
          {/* <Button type="primary" disabled={codeTimeInterval > 0} onClick={this.getVerifyCode}>{codeTimeInterval > 0 ? `（${codeTimeInterval}）` : '更换验证码'}</Button> */}
          <br />
          <Input
            style={{ marginTop: 10 }}
            value={verificationCode.get('code') || ''}
            placeholder="请输入验证码"
            onChange={(e) => {
              const value = (e.target.value || '').replace(/\s/g, '');
              if (value.length > 0 && !/^([a-zA-Z0-9]+)$/.test(value)) return;
              dispatch(changeVerifyCodeAction('code', value));
            }}
          ></Input>
        </Modal>
      </div>
    );
  }
}

Header.propTypes = {
  dispatch: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
  Header: PropTypes.object,
  getUserInfo: PropTypes.func.isRequired,
  verificationCode: PropTypes.instanceOf(immutable.Map),
};

const mapStateToProps = createStructuredSelector({
  Header: makeSelectHeader(),
  verificationCode: makeVerificationCode(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    signOut: (e) => {
      console.log('sign out start');
      e.stopPropagation();
      sessionStorage.removeItem('menuKeys');
      AppLocalStorage.setIsLogin(false);
      browserHistory.replace('/parttime');
      // browserHistory.clear();
      // window.location.reload();
      console.log('sign out success');
    },
    getUserInfo: () => {
      const info = AppLocalStorage.getUserInfo() || {};
      dispatch(setHeader(info));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
