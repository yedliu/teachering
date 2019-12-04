import styled from 'styled-components';

export const QuestionWrapper = styled.div`
  @keyframes into {
    0%   { bottom: -200px;  opacity: 0 }
    100% { bottom: 0;  opacity: 1 }
  }

  @keyframes out {
    0%   { z-index: 1; bottom: 0;  opacity: 1}
    100% { bottom: -200px;  opacity: 0 }
  }

  @keyframes show {
    0%   { padding-bottom: 0; }
    100% { padding-bottom: 250px; }
  }

  @keyframes hide {
    0%   { padding-bottom: 250px; }
    100% { padding-bottom: 0; }
  }

  height: 560px;
  overflow: hidden;
  position: relative;
  .question-content{
    height: 100%;
    overflow: hidden;
    padding:  0 16px;
  }
  .content-show{
    animation: show .5s;
    padding-bottom: 250px;
  }
  .content-hide {
    animation: hide .5s;
    padding-bottom: 0px;
  }

  .base {
    position: absolute;
    left: 0;
    right: 0;
    background: #eee;
    z-index: -1;
    opacity: 0;
    overflow: hidden;
  }

  .show{
    animation: into .5s;
    bottom: 0;
    z-index: 1;
    opacity: 1
  }
  .hide {
    animation: out .5s;
    bottom: -200px;
  }
  .question{
    padding-top: 16px;
    height: 100%;
    overflow: auto;
    position: relative;
  }
`;

export const ChildWrapper = styled.div`
  visibility: ${props => (props.show ? 'visible' : 'hidden')};
  height: ${props => (props.show ? '100%' : '0px')};
  overflow: hidden;
`;

export const Footer = styled.div`
  padding: 5px;
  border-top: 1px solid #eee;
  text-align: center;
`;