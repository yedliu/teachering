import { css } from 'styled-components';

export const ButtonBig = css`
  display: inline-block;
  box-sizing: border-box;
  padding: 0.50em 0;
  height: 40px;
  width: 130px;
  text-decoration: none;
  border-radius: 4px;
  -webkit-font-smoothing: antialiased;  
  -webkit-touch-callout: none;
  user-select: none;
  cursor: pointer;
  outline: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: bold;
  font-size: 16px;
`;
export const ButtonStylesOne = css`
  color:#fff;
  background-color:#ef414f;
  &:hover{
     background-color:#ff6c78;
     color: #fff;
  }
  &:active{
    background-color:#e43b49;
  }
`;
export const ButtonStyleDiable = css `
  color:#999;
  border: 1px solid #ddd;
  background: #f0f0f0;
`;
export const ButtonSmall = css`
  width:80px;
  height:30px;
  font-size:14px;
  padding:4px 0 0 0;
`;

export const ButtonStylesTwo = css`
  display: inline-block;
  box-sizing: border-box;
  padding: 0.50em 0;
  height: 40px;
  width: 130px;
  text-decoration: none;
  border-radius: 4px;
  -webkit-font-smoothing: antialiased;
  -webkit-touch-callout: none;
  user-select: none;
  cursor: pointer;
  outline: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: bold;
  font-size: 16px;
  border: 1px solid #ef414f;
  color: #ef414f;
  &:hover{
    background: #ffd8d6;
  }
  &:active {
    background: #ffeae9;
  }
`;

export const ButtonStylesThree = css`
  border: 1px solid #ddd;
  color: #666;
  &:active {
    border: 1px solid #ef414f;
    color: #ef414f;
  }
  &:hover{
    border: 1px solid #ef414f;
    color: #ef414f;
    background: #ffeae9;
  }
`;

export const hoverWhite = css`
  &:hover {
    color: #fff;
  }
`;

export const hoverRed = css`
  &:hover {
    color: #ef414f;
  }
`;

export const hoverGrey = css`
  &:hover {
    color: #999;
  }
`;
