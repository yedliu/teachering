import React, { PropTypes } from 'react';
import { toString, toNumber, getParentKeyForIdList } from 'components/CommonFn';
import immutable, { fromJS } from 'immutable';
import { Tree } from 'antd';
import { getTreePath, pathFinish, backPathArr, backDefaultKnowledge } from './common';

const TreeNode = Tree.TreeNode;
export const backChildren = (data, from) => {
  // console.log(data, 'data');
  let res = [];
  if (!data || data.length <= 0) return res;
  data.forEach((item) => {
    if (from === 'saga') {
      res.push(toString(item.id));
      if (item.children && item.children.length > 0) res = res.concat(backChildren(item.children, from));
    } else {
      res.push(toNumber(item.key));
      if (!item.props.isLeaf && item.props.children && item.props.children.length > 0) res = res.concat(backChildren(item.props.children));
    }
  });
  return res;
};

export class HomeworkTree extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.makeTreeNode = this.makeTreeNode.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }
  onSelect(selectedKeys, info) {
    const { soucre, onSelect, treeList } = this.props;
    const itemProps = info.node.props;
    const pos = (itemProps.pos.split('-').slice(1) || []);
    const path = getTreePath(treeList, pos.map((it) => toNumber(it)), []);
    const newPos = pos.join('#children#').split('#').map((it, i) => {
      if ((i + 2) % 2 === 0) return toNumber(it);
      return it;
    });
    const nowItem = (treeList.getIn(newPos) || fromJS([{ id: -1, name: 'null' }])).toJS();
    const newPath = pathFinish([].concat(path).concat(backPathArr(nowItem.children)));
    const res = {
      key: itemProps.eventKey,
      label: itemProps.title,
      level: itemProps.level,
      idList: [toNumber(itemProps.eventKey)],
      children: nowItem.children,
      path: newPath,
    };
    if ((soucre === 'standHomework' || soucre === 'testhomework') && !itemProps.isLeaf) {
      res.idList = [toNumber(itemProps.eventKey)].concat(backChildren(itemProps.children));
      onSelect(res);
    } else {
      const selectedKnowledge = nowItem.level === 4 ? nowItem : backDefaultKnowledge((nowItem.children && nowItem.children.length > 0) ? nowItem.children : [{ id: -1, name: 'null' }]);
      onSelect(res, selectedKnowledge);
    }
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
        res = (<TreeNode title={item.name || ''} key={toString(item.id)} isLeaf={false} level={item.level || -1}>{this.makeTreeNode(children)}</TreeNode>);
      } else {
        res = <TreeNode title={item.name || ''} key={toString(item.id)} isLeaf level={item.level || -1}></TreeNode>;
      }
      return res;
    });
  }
  render() {
    const { selectTree, treeList } = this.props;
    // console.log(selectTree.toJS(), treeList.toJS(), 'selectTree');
    // console.log(toString(selectTree.get('id')), 'string');
    return (<Tree
      showLine
      autoExpandParent
      checkStrictly
      selectedKeys={[toString(selectTree.get('id')) || '-1']}
      defaultExpandedKeys={[toString(selectTree.get('id')) || '']}
      onSelect={this.onSelect}
    >
      {this.makeTreeNode(treeList.toJS())}
    </Tree>);
  }
}

HomeworkTree.propTypes = {
  selectTree: PropTypes.instanceOf(immutable.Map).isRequired,
  treeList: PropTypes.instanceOf(immutable.List).isRequired,
  onSelect: PropTypes.func.isRequired,
  soucre: PropTypes.string,
};

export default HomeworkTree;
