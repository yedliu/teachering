/*
 * SubHomePage
 * 这是每次点击首页上 BU 进入的页面
 * 根据不同的路由展示不同的文字
 */

import React from 'react';
import styled from 'styled-components';
import { FlexCenter } from 'components/FlexBox';
import { trModules } from 'lib/menu/contants';

const Wrapper = styled(FlexCenter)`
  width: 100%;
  height: 100%;
  background-color: white;
  font-size: 14px;
  border: 1px solid #dddddd;
`;

const SubHomePage = () => {
  const pathname = location.pathname;
  const route = trModules.find(el => el.to === pathname);
  const title = route ? route.title : '教研管理后台';

  return (
    <Wrapper>
      <h1>{title}</h1>
    </Wrapper>
  );
};

export default SubHomePage;
