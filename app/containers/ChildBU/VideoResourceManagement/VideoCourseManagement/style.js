import styled from 'styled-components';
import { Spin } from 'antd';
export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 20px;
  display: flex;
  justify-content: space-between;
`;
export const RightWrapper = styled.div`
  flex:1;
  background: #eee;
  padding: 16px;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
`;
export const Info = styled.div`
  width: 100%;
  border-bottom: 1px solid #999;
`;

export const LoadingWrapper = styled.div`
position: fixed;
width: 100%;
height: 100%;
z-index: 999;
top:0;
left:0;
`;
export const CuSpin = styled(Spin)`
  position: absolute !important;
  top:0;
  bottom: 0;
  margin: auto;
  right: 0;
  left: 0;
  width: 32px;
  height: 36px;
`;
