import styled from 'styled-components';
import { Button } from 'antd';

export const Wrapper = styled.div`
width: 100%;
height: 100%;
position: absolute;
background: #fff;
top:0;
left:0;
z-index: 100;
padding: 10px;
`;
export const Header = styled.div`
width: 100%;
height: 50px;
line-height: 50px;
display: flex;
justify-content: space-between;
border-bottom: 1px solid #eee;
`;
export const BackBtn = styled(Button)`
  margin-top: 10px;
`;
export const Main = styled.div`
width: 100%;
display: flex;
border-bottom: 1px solid #eee;
height: calc(100% - 50px);
`;
export const Left = styled.div`
width: 301px;
padding: 10px;
border-right: 1px solid #eee;
height: 100%;
overflow-y: auto;
`;
export const Right = styled.div`
padding: 10px;
width: 100%;
height: 100%;
overflow: hidden;
`;
export const Text = styled.span`
color:#108ee9;
`;
export const ActionBar = styled.p`
display: flex;
justify-content: space-between;
border-bottom: 1px solid #eee;
line-height: 40px;
`;
export const ModalFooter = styled.div`
width: 100%;
text-align: right;
`;
export  const ModalInfo = styled.div`
width: 100%;
text-align: center;
line-height: 100px;
height: 100px;
font-size: 16px;
`;

