import React from 'react';
import MouleTitle from '../../child/MouleTitle';
import RenderContent from '../../child/renderContent';

const ReferenceAnswer = ({
  rules = {},
  errorMessage,
  style = {},
  active,
  value,
  onClick,
}) => (
  <div style={{ ...style }}>
    <MouleTitle required={rules.required} errorMessage={errorMessage}>
      参考答案
    </MouleTitle>
    <RenderContent active={active} content={value} onClick={onClick} />
  </div>
);
export default ReferenceAnswer;
