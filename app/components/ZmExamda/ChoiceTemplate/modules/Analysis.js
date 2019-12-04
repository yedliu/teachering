/**
 * 解析
 */
import React from 'react';
import { renderToKatex } from '../common';

const Analysis = (props) => {
  const { label = '解析：', analysis = '' } = props;
  return (<div className="analysis-wrapper">
    <div className="analysis-item-label">{label}</div>
    <div className="analysis-item-content" dangerouslySetInnerHTML={{ __html: renderToKatex(analysis) }}></div>
  </div>);
};

export default Analysis;
