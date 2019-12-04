import styled from 'styled-components';
import { Icon } from 'antd';

// 通用
export const FlexSpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
`;
// index
export const Warpper = styled.div`
  height: 100%;
  overflow: hidden;
  display: flex;
  background: #fff;
  flex-direction: column;
  padding-right: 36px;
  position: relative;
`;
export const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

export const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 5px;
  overflow: hidden;
`;

// Header 组件
export const HeaderWrapper = styled(FlexSpaceBetween)`
  border-bottom: 1px solid #eee;
  height: 40px;
  font-size: 14px;
  font-weight: 600;
  line-height: 40px;
  padding: 0 10px;
`;

export const ModuleName = styled.div`
  color: #108ee9;
  font-weight: 500;
`;

export const SortWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding: 5px;
`;

// 侧边栏
export const SliderWrapper = styled.div`
  flex: 0 0 280px;
  padding: 0 10px;
  border-right: 1px solid #eee;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .slider-tips {
    height: 30px;
    line-height: 30px;
  }
  .tree-wrapper {
    flex: 1;
    overflow: auto;
  }
`;

// Content 组件

export const ContentRoot = styled.div`
  padding: 5px;
`;

export const IconArrow = styled(Icon)`
  color: ${props => (props.selected ? '#108ee9' : '#999')};
  cursor: pointer;
`;

export const QuestionWrapper = styled.div`
  border: 1px solid #eee;
  padding: 10px;
  border-radius: 3px;
  margin-bottom: 20px;
  .btn-wrapper {
    text-align: right;
    .ant-btn {
      margin-right: 5px;
    }
  }
  &:hover {
    border-color: #108ee9;
  }
  p, label, div, span{
    font-family: 'Microsoft YaHei','Helvetica Neue',Helvetica,Arial,sans-serif;
  }
  .datatype-box img{
    margin-bottom: 5px;
  }
`;

export const QuestionInfo = styled.div`
  color: #af6b4d;
  span {
    margin-right: 10px;
  }
`;

export const BusketWrapper = styled.div`
  @keyframes show {
    0%   { right: -160px; }
    100% { right: 0; }
  }

  @keyframes hide {
    0%   { right: 0; }
    100% { right: -160px; }
  }
  .base{
    position: absolute;
    top: 0px;
    right: -160px;
    bottom: 0px;
    display: flex;
  }

  .show{
    animation: show .5s;
    right: 0;
  }
  .hide {
    animation: hide .5s;
    right: -160px;
  }
`;

export const BusketTitle = styled.div`
  height: 100%;
  width: 36px;
  font-size: 20px;
  cursor: pointer;
  background: #108ee9;
  border-radius: 6px 0px 0px 6px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  p{
    writing-mode: vertical-rl;
    margin-bottom: 20px;
  }
  span{
    margin-bottom: 20px;
    display: inline-block;
    height: 30px;
    width: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 50%;
    background: #fff;
    color: #108ee9;
  }
`;
export const BusketContent = styled.div`
  height: 100%;
  width: 160px;
  background: #fff;
  display: flex;
  flex-direction: column;
  .busket-question-count{
    padding: 40px 10px 0;
    flex: 1;
    .question-count-item{
      display: flex;
      padding-bottom: 5px;
      justify-content: space-between;
      & span:first-child{
        flex: 0 0 60px;
      }
    }
  }
  .busket-content-footer{
    text-align: center;
    padding: 5px;
    outline: none;
  }
`;

