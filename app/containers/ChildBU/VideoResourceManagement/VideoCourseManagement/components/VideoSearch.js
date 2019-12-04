import React from 'react';
import styled from 'styled-components';
import { Select, Input, Button } from 'antd';
const Option = Select.Option;
const Wrapper = styled.div`
  width: 100%;
  padding-bottom: 20px;
  display: flex;
`;
class VideoSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: '',
      name: ''
    };
  }
  selectStatus=(e) => {
    const { onChange } = this.props;
    this.setState({ status: e }, () => {
      onChange(this.state);
    });

  }
  handleName=(e) => {
    const { onChange } = this.props;
    this.setState({
      name: e.target.value
    }, () => {
      onChange(this.state);
    });
  }
  handleSearch=(status, name) => {
    this.props.onSearch(status, name);
  }
  render() {
    const { status, name } = this.state;
    return (
      <Wrapper>
        <Select  style={{ width: 120, marginRight: '20px' }} placeholder="请选择状态" onChange={this.selectStatus} allowClear>
          {
            this.props.videoStatus.map((item) => {
              return <Option value={String(item.id)} key={item.id}>{item.name}</Option>;
            })
          }
        </Select>
        <Input  style={{ marginRight: '20px', width: 200 }}  onChange={this.handleName} placeholder="输入名称" />
        <Button type="primary" onClick={() => { this.handleSearch(status, name) }}>查询</Button>
      </Wrapper>
    );
  }
}

export default VideoSearch;
