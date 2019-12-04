import React from 'react';
import styled from 'styled-components';

const Warpper = styled.li`
  width:278px;
  height:96px;
  background:rgba(255,255,255,0.73);
  box-shadow:0px 0px 12px 4px rgba(227,227,227,0.28);
  border-radius:5px;
  padding-left: 30px;
  line-height: 96px;
  margin: 0 30px 20px 0;
  cursor: pointer;
  &:hover{
    box-shadow:0px 0px 12px 6px rgba(227,227,227,0.8);
  }
  img{
    height: 55px;
    width: 55px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 12px;
  }
  span{
    font-size:18px;
    font-weight:500;
    color:rgba(51,51,51,1);
  }
`;
/**
 * @description 渲染每个子模块
 * @param {string} title 标题
 * @param {string} icon 图标
 * @param {fn} onClick 点击事件
 */
const Item = ({ title, icon, onClick }) => (
  <Warpper onClick={onClick}>
    <img src={icon} alt={title} />
    <span>{title}</span>
  </Warpper>
);

export default Item;