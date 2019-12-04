import React from 'react';
import { Icon } from 'antd';
import { HeaderWrapper, ModuleName } from './style';

const Header = ({ moduleName, title = '选择题目', onClose = () => {} }) => {
  return (
    <HeaderWrapper>
      <ModuleName>{moduleName}</ModuleName>
      <div>{title}</div>
      <div onClick={onClose} style={{ cursor: 'pointer' }}>
        <Icon type="close" />
      </div>
    </HeaderWrapper>
  );
};

export default Header;
