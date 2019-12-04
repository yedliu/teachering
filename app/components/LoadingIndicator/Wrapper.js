import styled, { keyframes } from 'styled-components';

const Wrapper = styled.span`
  display: block;
  margin: 2em auto;
  width: 40px;
  height: 40px;
  position: relative;
`;

const runningLoaidngAnimIn = keyframes`
  0% {
    -webkit-transform: translateX(-80px);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    -webkit-transform: translateX(80px);
    opacity: 0;
  }
`;

export const RunWrapper = styled.span`
  display: block;
  padding: 20px 0;
    .bullets {
      position: relative;
      margin: 0 auto;
      width: 0;
      i {
        position: absolute;
        padding: 4px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.3);
        opacity: 0;
        -webkit-animation: ${runningLoaidngAnimIn} 1s ease-in-out 0s infinite;
        animation: ${runningLoaidngAnimIn} 1s ease-in-out 0s infinite;
        &:nth-child(1) {
          -webkit-animation-delay: 0s;
          animation-delay: 0s;
        }
        &:nth-child(2) {
          -webkit-animation-delay: 0.15s;
          animation-delay: 0.15s;
        }
        &:nth-child(3) {
          -webkit-animation-delay: 0.3s;
          animation-delay: 0.3s;
        }
        &:nth-child(4) {
          -webkit-animation-delay: 0.45s;
          animation-delay: 0.45s;
        }
      }
    }
`;

const stretchdelay = keyframes`
  0%, 40%, 100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }  20% {
    transform: scaleY(1.0);
    -webkit-transform: scaleY(1.0);
  }
`;

export const Spinner = styled.span`
  display: block;
  margin: 20px auto;
  width: ${(props) => `${props.wrapper.width || 50}px`};
  height: ${(props) => `${props.wrapper.height || 80}px`};
  text-align: center;
  font-size: 10px;
  i {
    background-color: ${(props) => props.item.color || '#cccccc'};
    height: 100%;
    width: ${(props) => `${props.item.width || 6}px`};
    margin: 0 ${(props) => `${props.item.halfSpacing || 6}px`};
    display: inline-block;
    -webkit-animation: ${stretchdelay} 1.2s infinite ease-in-out;
    animation: ${stretchdelay} 1.2s infinite ease-in-out;
    &:nth-child(2) {
      -webkit-animation-delay: -1.1s;
      animation-delay: -1.1s;
    }
    &:nth-child(3) {
      -webkit-animation-delay: -1.0s;
      animation-delay: -1.0s;
    }
    &:nth-child(4) {
      -webkit-animation-delay: -0.9s;
      animation-delay: -0.9s;
    }
    &:nth-child(5) {
      -webkit-animation-delay: -0.8s;
      animation-delay: -0.8s;
    }
  }
`;

export default Wrapper;
