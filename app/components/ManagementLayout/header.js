import React from 'react';
import { Button, Select, Input } from 'antd';
import { FlexRow } from '../FlexBox';

const Header = ({ list = [] }) => {
  const selectList = list.filter(el => (el.type === 'select' || el.type === 'input'));
  const buttonList = list.filter(el => el.type === 'button');
  return (
    <FlexRow>
      {selectList.map((item, index) => (
        <div key={index}>
          {item.label}:
          {
            item.type === 'select' &&
            <Select
              style={{ ...{ width: 120, marginRight: 20 }, ...(item.style || {}) }}
              value={item.value}
              onChange={value => item.method(value)}
              placeholder={item.placeholder || '请选择'}
              allowClear={item.allowClear}
            >
              {item.list.map(el => (
                <Select.Option value={`${el.id}`} key={el.id} title={el.name}>
                  {el.name}
                </Select.Option>
              ))}
            </Select>
          }
          {
            item.type === 'input' &&
            <Input
              onChange={e => item.method(e.target.value) }
              style={{ ...{ width: 140, marginRight: 20 }, ...(item.style || {}) }}
              value={item.value}
              placeholder={item.placeholder || '请输入'}
            />
          }
        </div>
      ))}
      {buttonList.map((item, index) => (
        <Button
          key={index}
          style={{ ...{ marginRight: 20 }, ...(item.style || {}) }}
          type={item.buttonType || 'default'}
          onClick={item.method}
        >
          {item.label}
        </Button>
      ))}
    </FlexRow>
  );
};

export default Header;
