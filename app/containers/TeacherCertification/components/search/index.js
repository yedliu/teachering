import React from 'react';
import styled from 'styled-components';
import { Select, Button } from 'antd';
const Option = Select.Option;
const Wrapper = styled.div`
display: flex;
flex-wrap: wrap;
width: 100%;
`;
const SearchItem = styled.div`
  width: 23%;
  min-width: 250px;
  display: flex;
  margin-right: 10px;
  margin-bottom: 10px;
`;
const Label = styled.div`
width: 80px;
line-height: 26px;
text-align: right;
`;
const SearchSelect = styled(Select)`
flex: 1;
`;
class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {}
    };
  }
  /**
   * 渲染Select
   * @param dataList
   * @param key
   * @param label
   * @returns {*}
   */
  renderSelect = (dataList, key, label) => {
    return (
      <SearchSelect  allowClear onChange={(value) => { this.onChange(value, key) }} placeholder={`请选择${label}`}>
        {dataList.map((item) => {
          return <Option value={String(item.itemCode)} key={item.itemCode}>{item.itemName}</Option>;
        })}
      </SearchSelect>
    );
  }
  /**
   * Select组件onChange事件
   * @param value
   * @param key
   */
  onChange = (value, key) => {
    let params = this.state.params;
    params[key] = value;
    this.setState({ params });
  }
  render() {
    const { itemsData, onSearch, onAdd } = this.props;
    return (
      <Wrapper>
        {
          itemsData.map((item) => {
            return <SearchItem key={item.key}>
              <Label>{item ? item.label + '：' : ''}</Label>
              {item ? this.renderSelect(item.data, item.key, item.label) : null}
            </SearchItem>;
          })
        }
        <Button onClick={() => { onSearch(this.state.params) }} type="primary">查询</Button>
        <Button onClick={onAdd} style={{ marginLeft: 20 }}>新增试卷</Button>
      </Wrapper>
    );
  }
}

export default Search;
