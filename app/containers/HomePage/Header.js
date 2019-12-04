/*
 * 首页的头部
 */

import React from 'react';
import styled from 'styled-components';
import { Avatar, Dropdown, Menu, Icon, } from 'antd';
import { FlexRowCenter } from 'components/FlexBox';
import AppLocalStorage from 'utils/localStorage';
import { browserHistory } from 'react-router';

const HeaderWrapper = styled.header`
  height: 64px;
  font-size: 14px;
  line-height:64px;
  background-color: #33425F;
  padding: 0 120px;
  color: #fff;
  display: flex;
  justify-content: space-between;
`;
const RightUserMsg = styled(FlexRowCenter)`
  padding-right:10px;
  .name {
    margin: 0 10px;
  }
`;

const LeftBox = styled.div`
  img{
    height: 27px;
  }
  span{
    &::before{
      display: inline-block;
      content: '';
      height: 10px;
      margin: 0 20px;
      border-left: 1px solid  #fff;
    }
  }
`;


export default class Header extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      userinfo: {},
    };
  }

  componentDidMount() {
    this.getUserInfo();
  }

  /**
   * @description 退出登录
   * @param {event} e 合成对象 event
   * @return {void}
   */
  signOut = (e) => {
    e.stopPropagation();
    sessionStorage.removeItem('menuKeys');
    AppLocalStorage.setIsLogin(false);
    browserHistory.push('/');
    window.location.reload();
  }

  /**
   * @description 从 localStorage 中获取用户信息
   * @return {void}
   */
  getUserInfo = () => {
    const userinfo = AppLocalStorage.getUserInfo() || {};
    this.setState({ userinfo });
  }

  render() {
    const menu = (
      <Menu style={{ padding: '5px 10px' }}>
        <Menu.Item>
          <div onClick={this.signOut}>
            <Icon type="logout" />
            <span style={{ marginLeft: 5 }}>退出</span>
          </div>
        </Menu.Item>
      </Menu>
    );
    return (
      <HeaderWrapper>
        <LeftBox>
          <img src="https://web-data.zmlearn.com/image/30580021-405f-47ba-83e3-b41f1678c73a.png" alt="掌门教育" />
          <span>掌门教研后台</span>
        </LeftBox>
        <RightUserMsg>
          <Dropdown overlay={menu} placement="bottomCenter">
            <Avatar src="https://web-data.zmlearn.com/image/48c32bf9-2cad-4f6b-a38c-4c831168a52a.png" style={{ cursor: 'pointer' }} />
          </Dropdown>
          <div className="name">{this.state.userinfo.name || ''}</div>
        </RightUserMsg>
      </HeaderWrapper>
    );
  }
}
