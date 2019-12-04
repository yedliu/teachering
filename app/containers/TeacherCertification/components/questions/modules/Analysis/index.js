import React from 'react';
import RenderContent from '../../child/renderContent';
import MouleTitle from '../../child/MouleTitle';

const Analysis = ({
  rules = {},
  errorMessage,
  active,
  value,
  onClick,
  style = {},
}) => (
  <div style={{ ...style }}>
    <MouleTitle required={rules.required} errorMessage={errorMessage}>
      解析
    </MouleTitle>
    <RenderContent active={active} content={value} onClick={onClick} />
  </div>
);
export default Analysis;
