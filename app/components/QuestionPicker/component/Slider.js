import React from 'react';
import { Tree, Select, Spin } from 'antd';
import { SliderWrapper } from './style';

const TreeNode = Tree.TreeNode;
const Option = Select.Option;

export default class Slider extends React.Component {
  state = {
    expandedKeys: [],
    autoExpandParent: true,
  };
  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onSelect = (selectedKeys, info) => {
    const { treeChange } = this.props;
    const selectData = info.selectedNodes[0] && info.selectedNodes[0].props.dataRef;
    treeChange(selectedKeys, selectData);
  };

  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={item.name} dataRef={item} />;
    });
  };
  render() {
    const { tips, selectValue, selectData = [], treeData = [], selectedKeys, selectChange, loading } = this.props;
    const { expandedKeys, autoExpandParent } = this.state;
    return (
      <SliderWrapper>
        <div className="slider-tips">{tips}</div>
        <Select
          onChange={selectChange}
          value={selectValue && `${selectValue}`}
          style={{ width: 260 }}
          placeholder="请选择学段学科"
        >
          {selectData.map(el => (
            <Option key={el.id} value={`${el.id}`}>{el.name}</Option>
          ))}
        </Select>
        <div className="tree-wrapper">
          <Spin style={{ height: '100%', overflow: 'auto', minHeight: 100 }} spinning={loading}>
            {
              treeData.length > 0 ?
                <Tree
                  showLine
                  onExpand={this.onExpand}
                  expandedKeys={autoExpandParent ? selectedKeys : expandedKeys}
                  autoExpandParent={autoExpandParent}
                  onCheck={this.onCheck}
                  onSelect={this.onSelect}
                  selectedKeys={selectedKeys}
                  style={{ height: '100%', overflow: 'auto' }}
                >
                  {this.renderTreeNodes(treeData)}
                </Tree>
              : <div style={{ textAlign: 'center' }}>暂无数据</div>
            }
          </Spin>
        </div>
      </SliderWrapper>
    );
  }
}
