import React from 'react';
import RenderContent from './renderContent';
import { Button, Popconfirm } from 'antd';
import UploadImage from './UploadImage';

const Option = ({
  content,
  onClick,
  active,
  index,
  disabled,
  onDelete,
  type = 'text',
  contentType,
  onImageChange
}) => (
  <div style={{ display: 'flex', margin: '10px 0', lineHeight: '30px' }}>
    <span>{index}</span>
    {type === 'text' && (
      <RenderContent
        type={contentType}
        active={active}
        content={content}
        onClick={onClick}
        minHeight="30px"
        style={{ margin: '0 5px' }}
      />
    )}
    {type === 'image' && <UploadImage imageUrl={content} onChange={onImageChange} />}
    <Popconfirm
      title="删除当前选项?"
      onConfirm={onDelete}
      okText="删除"
      cancelText="取消"
    >
      <Button
        style={{ marginTop: '5px' }}
        disabled={disabled}
        size="small"
        type="danger"
      >
        删除
      </Button>
    </Popconfirm>
  </div>
);

export default Option;
