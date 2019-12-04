import React from 'react';
import { Spin } from 'antd';
const wrapper = {
  width: '100%',
  height: '100%',
  background: 'rgba(255, 255, 255, 0.5)',
  position: 'absolute',
  zIndex: 999,
  top: 0,
  left: 0
};
const spin = {
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  margin: 'auto',
  height: 50,
  width: 50,
  position: 'absolute'
};
function Loading() {
  return <div style={wrapper}>
    <Spin style={spin} size="large" />
  </div>;
}
export default Loading;
