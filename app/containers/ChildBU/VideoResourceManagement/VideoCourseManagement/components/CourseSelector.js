import React from 'react';
import { Tree, Input, Modal, message } from 'antd';
import { find } from '../utils';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;

const getParentKey = (key, tree, keyName) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => String(item[keyName]) === String(key))) {
        parentKey = node;
      } else if (getParentKey(key, node.children, keyName)) {
        parentKey = getParentKey(key, node.children, keyName);
      }
    }
  }
  return parentKey;
};
let dataList = [];

class CourseSelector extends React.Component {
  state = {
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    dataList: [],
    names: [],
    selectedId: '',
    canOk: true
  }
  componentDidMount() {
    this.generateList(this.props.treeData);
    console.log(dataList);
  }
  generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      dataList.push(node);
      if (node.children) {
        this.generateList(node.children);
      }
    }
  };

  treeOnChange = (selectedKeys, e) => {
    // 生成最新的名称数组
    let selected = find(this.props.treeData, Number(selectedKeys[0]));
    console.log(selected);
    if (selected.length !== 4) {
      message.warning('必须选择到第4级');
      this.setState({ canOk: false });
      return;
    } else {
      this.setState({ canOk: true });
    }
    let names = selected.map(item => item.name);
    this.setState({
      names,
      selectedId: selectedKeys[0]
    });
  }
  onChange = (e) => {
    const { treeData } = this.props;
    const value = e.target.value;
    let expandedKeys = dataList.map((item) => {
      if (item.name.indexOf(value) > -1) {
        return getParentKey(item.name, treeData, 'name');
      }
      return null;
    });
    expandedKeys = expandedKeys.filter((item) => item && item.id);
    expandedKeys = expandedKeys.map(item => String(item.id));
    console.log(expandedKeys);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  handleOk=() => {
    const { onOk } = this.props;
    const { names, selectedId } = this.state;
    if (this.state.canOk) {
      onOk(names, selectedId);
    } else {
      message.warning('必须选择到第4级');
    }
  }
  render() {
    const { treeData, onCancel } = this.props;
    const { searchValue, expandedKeys, autoExpandParent } = this.state;
    const loop = data => data.map((item) => {
      const index = item.name.indexOf(searchValue);
      const beforeStr = item.name.substr(0, index);
      const afterStr = item.name.substr(index + searchValue.length);
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.name}</span>;
      if (item.children && item.children.length > 0) {
        return <TreeNode key={item.id} title={title} disabled={item.level !== 4}>{loop(item.children)}</TreeNode>;
      }
      return <TreeNode key={item.id} title={title} disabled={item.level !== 4} />;
    });
    return (
      <Modal
        visible={true}
        onCancel={onCancel}
        title="选择课程"
        maskClosable={false}
        onOk={this.handleOk}
      >
        <Search style={{ marginBottom: 8 }} placeholder="Search"  onChange={this.onChange} />
        <div style={{ width: '100%', overflowX: 'auto', minHeight: 400 }}>
          <Tree
            showLine
            onSelect={this.treeOnChange}
            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
          >
            {loop(treeData)}
          </Tree>
        </div>
      </Modal>
    );
  }
}
export default CourseSelector;
