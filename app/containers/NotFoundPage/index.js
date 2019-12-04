/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import styled from 'styled-components';
const notFoundPic = window._baseUrl.imgCdn + '18cdee41-78a4-4873-b815-17cbf07aaab2.png';

const Container = styled.div`
  position: relative;
  width: 500px;
  height: 200px;
  margin: auto;
  text-align: center;
  margin-top: 250px;
`;

const Pic = styled.div`
  width: 127px;
  height: 134px;
  margin: auto;
  background: url(${notFoundPic}) no-repeat;
  background-size: 100% 100%;
`;

const Text = styled.div`
  text-align: center;
  font-size: 19px;
  font-weight: 700;
`;

const Back = styled.a`
  text-decoration: underline;
  margin: 15px 0;
  display: inline-block;
`;

export default class NotFound extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Container>
        <Text>没找到对应页面，请检查输入地址是否正确!</Text>
        <Back href="/home">回首页</Back>
        <Pic />
      </Container>
    );
  }
}
