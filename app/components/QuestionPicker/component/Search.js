import React from 'react';
import styled from 'styled-components';
import { Select, Input, Button, Row, Col, Switch } from 'antd';
import { SortWrapper, IconArrow } from './style';

const Option = Select.Option;

const ItemWrapper = styled.div`
  margin-bottom: 5px;
`;

const Lable = styled.span`
  display: inline-block;
  width: 80px;
  text-align: right;
  margin-bottom: 5px;
`;

const Search = ({
  data = [],
  onChange,
  total = 0,
  sortData,
  onSearch = () => {},
  pushAllQuestion,
  onClickSwitch,
  changeSortType = () => {},
}) => {
  return (
    <div>
      <Row>
        {data.map(el => (
          <Col key={el.key} span={6}>
            <ItemWrapper>
              <Lable>{el.name}：</Lable>
              <RenderChild
                type={el.type}
                data={el.data}
                value={el.value}
                onChange={value => onChange(el.key, value)}
                placeholder={
                  el.placeholder ||
                  `${el.type === 'select' ? '请选择' : '请输入'}${el.name}`
                }
              />
            </ItemWrapper>
          </Col>
        ))}
      </Row>
      <Row>
        <Col style={{ textAlign: 'right', paddingRight: 18 }} span={24}>
          <Button onClick={onSearch} style={{ marginRight: 5 }} type="primary">
            搜索
          </Button>
        </Col>
      </Row>
      <SortWrapper>
        <div>
          <span>排序：</span>
          <span>
            题目使用量
            <IconArrow
              onClick={() => changeSortType('quoteCount', 'ASC')}
              selected={sortData.quoteCount === 'ASC'}
              type="arrow-up"
            />
            <IconArrow
              onClick={() => changeSortType('quoteCount', 'DESC')}
              selected={sortData.quoteCount === 'DESC'}
              type="arrow-down"
            />
          </span>
          <span style={{ marginLeft: 10 }}>
            时间
            <IconArrow
              onClick={() => changeSortType('updatedTime', 'ASC')}
              selected={sortData.updatedTime === 'ASC'}
              type="arrow-up"
            />
            <IconArrow
              onClick={() => changeSortType('updatedTime', 'DESC')}
              selected={sortData.updatedTime === 'DESC'}
              type="arrow-down"
            />
          </span>
          <span style={{ marginLeft: 15 }}>共有符合条件的题目 {total} 个</span>
        </div>
        <div>
          <div>
            <Switch size="small" onChange={onClickSwitch} />
            <span>显示全部答案与解析</span>
            <Button
              size="small"
              style={{ marginLeft: 5 }}
              onClick={pushAllQuestion}
            >
              选择本页全部试题
            </Button>
          </div>
        </div>
      </SortWrapper>
    </div>
  );
};

const RenderChild = ({
  type,
  data = [],
  value,
  style = {},
  placeholder,
  onChange,
}) => {
  if (type === 'select') {
    return (
      <Select
        style={{ width: 160, ...style }}
        value={value && `${value}`}
        placeholder={placeholder || `请选择`}
        onChange={onChange}
        allowClear
      >
        {data.map(item => (
          <Option key={item.id} value={`${item.id}`}>
            {item.name}
          </Option>
        ))}
      </Select>
    );
  }

  if (type === 'input') {
    return (
      <Input
        style={{ width: 160, ...style }}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || `请输入`}
      />
    );
  }

  return null;
};

export default Search;
