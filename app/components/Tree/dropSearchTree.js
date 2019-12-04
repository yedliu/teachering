import React from 'react';
import { Tree } from 'antd';
import { toString, isArray } from 'lodash';

import { knowledgeList } from './mock';

const TreeNode = Tree.TreeNode;

class DropSearchTree extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      keyword: '',
    };
  }
  filterTreeNode = (inputValue, treeNode) => {
    console.log('inputValue: ', inputValue);
    console.log('treeNode: ', treeNode);
  }
  renderTreeNode(dataList) {
    const { keyword } = this.props;
    return dataList.map((item, index) => {
      const startIndex = item.name.indexOf(keyword);
      const beforeStr = item.name.substr(0, startIndex);
      const afterStr = item.name.substr(startIndex + keyword.length);
      const title = startIndex > -1 && keyword.length > 0 ? (<span style={{ backgroundColor: 'rgba(102,255,204,0.5)' }}>
        {beforeStr}
        <span style={{ color: 'red' }}>{keyword}</span>
        {afterStr}
      </span>) : <span>{item.name}</span>;
      if (isArray(item.children) && item.children.length > 0) {
        return (
          <TreeNode title={title} key={toString(item.id)} dataRef={item}>
            {this.renderTreeNodes(item.children, keyword)}
          </TreeNode>
        );
      }
      return <TreeNode isLeaf title={title} key={toString(item.id)} />;
    });
  }
  render() {
    const {
      container,
    } = this.props;
    return (
      <div className="drop-search-tree">
        <Tree
          allowClear
          dropdownMatchSelectWidth
          dropdownStyle={{ position: 'absolute', left: 20 }}
          filterTreeNode={this.filterTreeNode}
          getPopupContainer={container}
          multiple
          searchPlaceholder="请选择知识点或考点"
        >
          {this.renderTreeNode(knowledgeList)}
        </Tree>
      </div>
    );
  }
}

export default DropSearchTree;