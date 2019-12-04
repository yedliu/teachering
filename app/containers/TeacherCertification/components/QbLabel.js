import React from 'react';
import { Icon } from 'antd';
function QbLabel({ data = [], onDel }) {
  return (
    <div style={{ padding: '0 10px', background: '#999', display: 'inline-block', margin: 5, position: 'relative' }}>
      {data.length > 0 ? data.map((item, index) => {
        if (index === data.length - 1) {
          return <span key={index}>{item}</span>;
        }
        return  <span key={index}>{`${item}>`}</span>;
      }) : null}
      <Icon type="close-circle" style={{ cursor: 'pointer', position: 'absolute', top: -5, right: -5 }} onClick={onDel} />
    </div>
  );
}

export default QbLabel;
