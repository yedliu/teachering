import React, { Component } from 'react';
import styled from 'styled-components';
import { Select, Button, Checkbox, Input } from 'antd';

const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;

const HeaderWrapper = styled.div`
  display: flex;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;

const CheckboxGroupWrapper = styled.div`
  .ant-checkbox-group{
    display: inline-block;
    padding: 7px 0;
    margin-right: 20px;
  }
`;

export default class Header extends Component {
  handleChange = value => {
    console.log(value);
  };
  render() {
    const {
      sourceList,
      questionTypeList,
      sourceId,
      questionType,
      sceneList,
      sceneIds = [],
      disabled,
      keyword,
      onSourceChange: handleSourceChange,
      onQuestionTypeChange: handleQuestionTypeChange,
      onSceneChange: handleSceneChange,
      onKeywordChange: handleKeywordChange,
      onSearch: handleSearch,
      onAdd: handleAdd
    } = this.props;
    return (
      <div>
        <HeaderWrapper>
          <div>
            <span>题目来源：</span>
            <Select
              value={ sourceId ? `${sourceId}` : void 0}
              style={{ width: 120, marginRight: 5 }}
              onChange={handleSourceChange}
              disabled={disabled}
            >
              {sourceList.map(el => (
                <Option key={el.id} value={`${el.id}`}>
                  {el.name}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <span>题型：</span>
            <Select
              placeholder="选择题型"
              allowClear
              value={questionType ? `${questionType}` : void 0}
              onChange={handleQuestionTypeChange}
              style={{ width: 120, marginRight: 5 }}
            >
              {questionTypeList.map(el => (
                <Option key={el.id} value={`${el.id}`}>
                  {el.name}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <span>关键字：</span>
            <Input
              placeholder="输入关键字"
              value={keyword}
              onChange={handleKeywordChange}
              style={{ width: 120, marginRight: 5 }}
            />
          </div>
          <CheckboxGroupWrapper>
            <span>使用场景：</span>
            <CheckboxGroup disabled={disabled} options={sceneList} onChange={handleSceneChange} value={sceneIds} />
          </CheckboxGroupWrapper>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <Button type="primary" onClick={handleSearch} style={{ marginRight: 10 }}>
              查询
            </Button>
            <Button type="primary" onClick={handleAdd}>添加题目</Button>
          </div>
        </HeaderWrapper>
        {/* <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <span>筛选未贴学段题目：</span>
          <Switch size="small" disabled={disabled} defaultChecked={false} onChange={handleSwitchChange} />
        </div> */}
      </div>
    );
  }
}
