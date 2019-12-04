import React from 'react';
import styled from 'styled-components';
import { Select, Button } from 'antd';
const Option = Select.Option;
const SearchBarWrapper = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 20px;
`;
const Btn = styled(Button)`
 margin-left: 20px;
`;
class SearchBar extends React.Component {
  render() {
    const { data, handleChange, toAdd, toSearch } = this.props;
    let options = data.subjects.map(item => {
      return <Option value={String(item.id)} key={item.id}>{item.name}</Option>;
    });
    return (
      <div>
        <SearchBarWrapper>
          <Select style={{ width: 200 }} onChange={handleChange} placeholder="选择学科" allowClear>
            {options}
          </Select>
          <Btn icon="search" type="primary" onClick={toSearch}>搜索</Btn>
          <Btn icon="plus" type="primary" onClick={toAdd}>新增</Btn>
        </SearchBarWrapper>
      </div>
    );
  }
}

export default SearchBar;
