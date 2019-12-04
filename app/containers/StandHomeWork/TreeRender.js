import React, { PropTypes } from 'react';
import { toString, toNumber } from 'components/CommonFn';
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
    this.state = {
      expandedKeys: [], // 控制展开收起的节点
    };
    this.makeTreeNode = this.makeTreeNode.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
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
    // console.log(itemProps, 'props');
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

  // 延迟执行点击事件，如果后面进行了双击 取消当前点击事件
  onDelaySelect = (selectedKeys, info) => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (!this.prevent) {
        this.onSelect(selectedKeys, info);
      }
    }, 200);
    this.prevent = false;
  }

  // 双击展开收起
  handleTreeNodeDoubleClick = (item) => {
    clearTimeout(this.timer);
    this.prevent = true;
    const { expandedKeys } = this.state;
    const id = `${item.id}`;
    const index = expandedKeys.indexOf(id);
    if (index > -1) {
      expandedKeys.splice(index, 1);
    } else {
      expandedKeys.push(id);
    }
    this.setState({ expandedKeys: [...expandedKeys] });
  }

  // 处理展开收起
  handleClickExpand = (expandedKeys, event) => {
    this.setState({ expandedKeys: [...expandedKeys] });
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
      const title = <span onDoubleClick={() => { this.handleTreeNodeDoubleClick(item) }}>{item.name || ''}</span>;
      if (children && children.length > 0) {
        res = (<TreeNode title={title} key={toString(item.id)} isLeaf={false} level={item.level || -1}>{this.makeTreeNode(children)}</TreeNode>);
      } else {
        res = <TreeNode title={item.name || ''} key={toString(item.id)} isLeaf level={item.level || -1}></TreeNode>;
      }
      return res;
    });
  }

  render() {
    const { selectTree, treeList } = this.props;
    const { expandedKeys } = this.state;
    // console.log(selectTree.toJS(), treeList.toJS(), 'selectTree');
    // console.log(toString(selectTree.get('id')), 'string');
    return (
      <div style={{ userSelect: 'none' }}>
        <Tree
          showLine
          autoExpandParent={false}
          checkStrictly
          expandedKeys={expandedKeys}
          onExpand={this.handleClickExpand}
          selectedKeys={[toString(selectTree.get('id')) || '-1']}
          defaultExpandedKeys={[toString(selectTree.get('id')) || '']}
          onSelect={this.onDelaySelect}
        >
          {this.makeTreeNode(treeList.toJS())}
        </Tree>
      </div>
    );
  }
}

HomeworkTree.propTypes = {
  selectTree: PropTypes.instanceOf(immutable.Map).isRequired,
  treeList: PropTypes.instanceOf(immutable.List).isRequired,
  onSelect: PropTypes.func.isRequired,
  soucre: PropTypes.string,
};

export default HomeworkTree;
