import React from 'react';
import { Select, Tree } from 'antd';
const Option = Select.Option;
const TreeNode = Tree.TreeNode;

export default class Slider extends React.Component {
  onExpand = expandedKeys => {
    this.props.onTreeChange('expandedKeys', expandedKeys);
  };

  // 选中试卷
  onSelect = selectedKeys => {
    const selectedKey = selectedKeys.length > 0 ? selectedKeys[0] : void 0;
    this.props.onTreeChange('chapterDirectoryId', selectedKey);
  };
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item} isLeaf={!item.hasChild}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} dataRef={item} isLeaf={!item.hasChild} />;
    });
  }
  render() {
    const { data, selectedKey, phaseList, handlePhaseChange, modules, onModuleChange, moduleId, phaseCode, onLoadData } = this.props;
    return (
      <div style={{  height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ textAlign: 'center', padding: '10px' }}>
          <Select
            placeholder="选择模块"
            onChange={onModuleChange}
            style={{ width: '100%' }}
            value={moduleId || void 0}
            disabled
          >
            {modules.map(el => (
              <Option key={el.id} value={`${el.id}`}>
                {el.name}
              </Option>
            ))}
          </Select>
        </div>
        <div style={{ textAlign: 'center', padding: '10px' }}>
          <Select
            placeholder="选择学段"
            onChange={handlePhaseChange}
            style={{ width: '100%' }}
            value={phaseCode || void 0}
          >
            {phaseList.map(el => (
              <Option key={el.id} value={`${el.id}`}>
                {el.name}
              </Option>
            ))}
          </Select>
        </div>
        <div style={{ overflow: 'auto', flex: 1 }}>
          {
            <Tree
              showLine
              onExpand={this.onExpand}
              onSelect={this.onSelect}
              selectedKeys={[`${selectedKey}`]}
              loadData={onLoadData}
            >
              {this.renderTreeNodes(data)}
              <TreeNode title="未贴标签题目" key={'unTagFlag'} isLeaf />
            </Tree>
         }
        </div>
      </div>
    );
  }
}
