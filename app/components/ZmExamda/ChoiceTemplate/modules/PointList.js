import React from 'react';

const PointList = (props) => {
  const { contentList, label = '知识点：', split = '、', type } = props;
  return (<div className={`${type}-wrapper`}>
    <div className={`${type}-label`}>{label}</div>
    <div className={`${type}-content`}>{(contentList || ['']).join(split)}</div>
  </div>);
};

export default PointList;
