import React from 'react';
import { Button } from 'antd';
import { Item, TextOption, TextOptionWrapper } from './style';
import UploadImage from './UploadImage';

const OPTION_MAX_LENGTH = 40;

const Option = ({
  option,
  disableUp,
  disableDown,
  disableDelete,
  onClickUp,
  onClickDown,
  index,
  onChange,
  onDelete,
  type,
}) => (
  <Item>
    <span>{index}.</span>
    {type === 'text' && (
      <TextOptionWrapper>
        <TextOption onChange={e => onChange(e.target.value)} value={option} maxLength={OPTION_MAX_LENGTH} />
        <span className="count"
          style={{ color: option.length === OPTION_MAX_LENGTH ? '#e0503f' : '#666' }}>
          {option.length}/{OPTION_MAX_LENGTH}
        </span>
      </TextOptionWrapper>
    )}
    {type === 'image' && (
      <UploadImage
        onChange={onChange}
        imageUrl={option}
      />
    )}
    <Button
      disabled={disableUp}
      size="small"
      type="primary"
      onClick={onClickUp}
    >
      上移一位
    </Button>
    <Button
      disabled={disableDown}
      size="small"
      type="primary"
      onClick={onClickDown}
    >
      下移一位
    </Button>
    <Button
      disabled={disableDelete}
      size="small"
      type="danger"
      onClick={onDelete}
    >
      删除
    </Button>
  </Item>
);

export default Option;
