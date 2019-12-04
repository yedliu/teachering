import React, { PropTypes } from 'react';
import { toString } from 'lodash';
import immutable, { fromJS } from 'immutable';
import { Tree } from 'antd';
import { TreeWrapper } from './AIHomeworkStyle';

const TreeNode = Tree.TreeNode;

const getIdList = (list) => {
  if (list.length <= 0) return [];
  const res = [];
  list.forEach((item) => {
    res.push(item.key);
    res.concat(getIdList(item.props.children || []));
  });
  return res;
};

export class AIHomeworkTree extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.onCheck = this.onCheck.bind(this);
    this.onExpand = this.onExpand.bind(this);
    this.state = {
      expandedKeys: [],
    };
  }
  onCheck(checked, event) {
    const { onCheck } = this.props;
    onCheck(checked, event);
    // console.log(checked, event);
  }
  onExpand(expandedKeys) {
    this.setState({
      expandedKeys,
    });
  }

  // 点击展开收起
  handleClickTreeNode = (item) => {
    const { expandedKeys } = this.state;
    const id = `${item.id}`;
    const index = expandedKeys.indexOf(id);
    if (index > -1) {
      expandedKeys.splice(index, 1);
    } else {
      expandedKeys.push(id);
    }
    this.setState({
      expandedKeys: [...expandedKeys],
    });
  }
  makeTreeNode(treeList) {
    // console.log(treeList, 'makeTreeNode treeList');
    if (!treeList || treeList.length <= 0) {
      return <TreeNode title="请选择版本获取课程体系" isLeaf level={-1}></TreeNode>;
    }
    return treeList.map((item) => {
      const children = item.children;
      // return <TreeNode title={item.name || ''} key={toString(item.id)}>{children && children.length > 0 ? this.makeTreeNode(children) : ''}</TreeNode>;
      let res = '';
      if (children && children.length > 0) {
        const title = <span onClick={() => { this.handleClickTreeNode(item); }}>{item.name || ''}</span>;
        res = (
          <TreeNode
            title={title}
            key={toString(item.id)}
            selectable={false}
            disableCheckbox
            isLeaf={false}
            level={item.level || -1}
            phaseSubjectId={item.phaseSubjectId}
          >
            {this.makeTreeNode(children)}
          </TreeNode>
        );
      } else {
        res = (
          <TreeNode
            title={item.name || ''}
            key={toString(item.id)}
            selectable={false}
            isLeaf
            level={item.level || -1}
            phaseSubjectId={item.phaseSubjectId}
          />);
      }
      return res;
    });
  }
  render() {
    const { checkedTree, treeList } = this.props;
    const { expandedKeys } = this.state;
    const userChecked = (checkedTree || fromJS([])).map((item) => toString(item.get('id'))).toJS();
    // console.log(userChecked, 'userChecked');
    return (<TreeWrapper>
      <Tree
        showLine
        autoExpandParent={false}
        checkable
        // checkStrictly
        showIcon={false}
        onExpand={this.onExpand}
        checkedKeys={userChecked}
        expandedKeys={expandedKeys.concat(userChecked)}
        onCheck={this.onCheck}
      >
        {this.makeTreeNode(treeList.toJS())}
      </Tree>
    </TreeWrapper>);
  }
}

AIHomeworkTree.propTypes = {
  checkedTree: PropTypes.instanceOf(immutable.List).isRequired,
  treeList: PropTypes.instanceOf(immutable.List).isRequired,
  onCheck: PropTypes.func.isRequired,
};

export default AIHomeworkTree;
