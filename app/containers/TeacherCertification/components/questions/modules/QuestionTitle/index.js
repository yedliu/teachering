import React from 'react';
import MouleTitle from '../../child/MouleTitle';
import RenderContent from '../../child/renderContent';

const QuestionTitle = ({
  rules = {},
  errorMessage,
  style = {},
  active,
  value,
  onClick,
}) => (
  <div style={{ ...style }}>
    <MouleTitle required={rules.required} errorMessage={errorMessage}>
      主题干
    </MouleTitle>
    <RenderContent active={active} content={value} onClick={onClick} />
  </div>
);
export default QuestionTitle;
