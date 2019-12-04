import React from 'react';

import Circle from './Circle';
import Wrapper, { RunWrapper, Spinner } from './Wrapper';

const LoadingIndicator = () => (
  <Wrapper>
    <Circle />
    <Circle rotate={30} delay={-1.1} />
    <Circle rotate={60} delay={-1} />
    <Circle rotate={90} delay={-0.9} />
    <Circle rotate={120} delay={-0.8} />
    <Circle rotate={150} delay={-0.7} />
    <Circle rotate={180} delay={-0.6} />
    <Circle rotate={210} delay={-0.5} />
    <Circle rotate={240} delay={-0.4} />
    <Circle rotate={270} delay={-0.3} />
    <Circle rotate={300} delay={-0.2} />
    <Circle rotate={330} delay={-0.1} />
  </Wrapper>
);

export default LoadingIndicator;

export const RunLoading = () => (
  <RunWrapper>
    <div className={'bullets'}>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
    </div>
  </RunWrapper>
);

export const SpinnerLoding = (wrapper = {}, icons = {}) => (
  <Spinner wrapper={wrapper} item={icons}>
    <i></i>
    <i></i>
    <i></i>
    <i></i>
    <i></i>
  </Spinner>
);
