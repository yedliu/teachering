import React from 'react';
import { toString } from 'lodash';
// import { fromJS } from 'immutable';
import {
  Select,
  Input,
  Button,
} from 'antd';
import {
  FlexRowCenter,
} from 'components/FlexBox';

import {
  Header,
  SerachWrapper,
  SerachItem,
} from './headerStyle';
import { diffList } from 'components/CommonFn';

// const emptyList = fromJS([]);
const Option = Select.Option;

class ContentHeader extends React.Component {
  changeSearch = (value, type) => {
    const { paramsChange } = this.props;
    if (paramsChange) {
      paramsChange(type, value);
    }
  }
  clickForSearchHw = () => {
    this.changeSearch(null, 'searchPaper');
  }
  changeKeyWord = (e) => {
    this.changeSearch(e.target.value, 'keyword');
  }
  changeDiff = (value) => {
    this.changeSearch(value.key, 'diff');
  }
  render() {
    const {
      searchDiff = 4,
      total = 0,
    } = this.props;
    return (
      <Header>
        <SerachWrapper>
          <FlexRowCenter>
            <SerachItem style={{ justifyContent: 'flex-end' }}>作业难度：</SerachItem>
            <SerachItem>
              <Select labelInValue defaultValue={{ key: toString(searchDiff) }} style={{ flex: 1 }} onChange={this.changeDiff}>
                {diffList.map((item) => <Option key={toString(item.id) || ''} value={toString(item.id)}>{item.name}</Option>)}
              </Select>
            </SerachItem>
          </FlexRowCenter>
          <SerachItem style={{ justifyContent: 'flex-end' }}>关键字：</SerachItem>
          <SerachItem>
            <Input placeholder="请输入关键字" onChange={this.changeKeyWord}></Input>
          </SerachItem>
          <SerachItem><Button type="primary" onClick={this.clickForSearchHw}>查询</Button></SerachItem>
        </SerachWrapper>
        <p style={{ color: '#999', textIndent: '3em', fontFamily: 'Microsoft YaHei' }}>共有符合条件作业{total}套</p>
      </Header>
    );
  }
}

export default ContentHeader;