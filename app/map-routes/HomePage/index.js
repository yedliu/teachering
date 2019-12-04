import React from 'react';
import { RootWrapper } from './style';
import AppLocalStorage from 'utils/localStorage';

const HomePage = () => {
  const userInfo = AppLocalStorage.getUserInfo();
  return (<RootWrapper>
    <h2 style={{ fontSize: 24 }}>欢迎您: {userInfo.name}</h2>
    <p>请在左侧菜单栏选择您要操作的功能。</p>
  </RootWrapper>);
};


export default HomePage;