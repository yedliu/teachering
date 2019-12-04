import React from 'react';
import styled from 'styled-components';

const ContentWrapper = styled.div`
  flex: 1;
  border: 1px solid #666;
  border-color: ${props => (props.active ? '#108ee9' : '#666')};
  border-radius: 3px;
  padding: 4px 8px;
  min-height: ${props => props.minHeight || '60px'};
  box-shadow: ${props => (props.active ? '#108ee9 0px 0px 3px' : '')};
  white-space: pre-wrap;
  line-height: 1.5;
  overflow: auto;
`;

// 渲染题目内容
const RenderContent = ({
  content,
  onClick = () => {},
  minHeight,
  style,
  active,
  type,
}) => (
  <ContentWrapper
    active={active}
    style={{ ...style }}
    minHeight={minHeight}
    onClick={onClick}
  >
    {type === 'text' ? (
      <span>{content}</span>
    ) : (
      <span dangerouslySetInnerHTML={{ __html: content }} />
    )}
  </ContentWrapper>
);

export default RenderContent;
