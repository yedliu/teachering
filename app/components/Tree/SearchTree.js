/**
 * author: yinjie.zhang
 * update autor:
 */
import React from 'react';
import { Tree, Input, Button, message } from 'antd';
import { toNumber, isArray, toString } from 'lodash';

import { getParentKeyForIdList, getParentKeyForKeyword, searchCount } from '../CommonFn';

import './searchTree.css';

const TreeNode = Tree.TreeNode;

// const limitCount = 3;
export const backChooseItem = (treeData, idList, backRes = []) => {
  const res = backRes;
  const iIdList = idList;
  if (iIdList.length <= 0) {
    return res;
  }
  treeData.forEach((item) => {
    const signIndex = idList.indexOf(item.get('id'));
    if (signIndex > -1) {
      res.push(item.get('name'));
      idList.splice(signIndex, 1);
    }
    const children = item.get('children');
    if (children && children.count() > 0) {
      res.concat(backChooseItem(children, idList, res));
    }
  });
  return res;
};

class SearchTree extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      keyword: '',
      expandedKeys: [],
      autoExpandParent: true,
      treeData: [],
      checkedKeys: [],
    };
  }
  componentDidMount() {
    const { treeData, checkedKeys } = this.props;
    console.log(treeData, checkedKeys);
    this.setState({ treeData, checkedKeys });
  }
  onOk = () => {
    const { onOk } = this.props;
    if (onOk) {
      const { checkedKeys } = this.state;
      onOk(checkedKeys.map((it) => toNumber(it)));
    }
  }
  onCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  }
  treeCheck = (keys, e) => {
    const { checkedKeys } = this.state;
    const { noLimit, always, onCheck, limitCount, repeatCheckList } = this.props;
    // window.console.log(keys, e);
    const checked = keys.checked;

    // console.log(checked, checkedKeys);
    // 如果用于取消已有的知识点则不需要校验
    if (checked.length < checkedKeys.length) {
      this.setState({ checkedKeys: checked }, () => {
        if (always && onCheck) {
          onCheck(checked);
        }
      });
      return;
    }

    // 校验是否选中了非叶子节点
    let notLeaf = null;
    const notAllLeaf = e.checkedNodes.some((item) => {
      if (!item.props.isLeaf) {
        notLeaf = item.props.dataRef.name;
        return true;
      }
      return false;
    });
    if (notAllLeaf) {
      message.warning(`请勿勾选非叶子节点 ${notLeaf}，请勿选择枝干节点或取消以选中的枝干节点`);
      return;
    } else if (!noLimit && checked.length > (limitCount || 3)) {
      message.warning(`最多只能选择 ${limitCount || 3} 个。`);
      return;
    }
    // 判读主副知识点是否有重复
    if (repeatCheckList) {
      console.log(repeatCheckList, 'repeatCheckList', checked);
      let flag = false;
      for (let i = 0; i < checked.length; i++) {
        if (repeatCheckList.indexOf(checked[i]) > -1) {
          flag = true;
          break;
        }
      }
      if (flag) {
        message.warning('主副知识点不能有重复的。');
        return;
      }
    }
    if (always && onCheck) {
      onCheck(checked);
    } else {
      this.setState({ checkedKeys: checked });
    }
  }
  onExpand = (expandedKeys, e) => {
    // window.console.log('onExpand:', expandedKeys, e);
    this.setState({
      autoExpandParent: false,
      expandedKeys: Array.from(new Set(expandedKeys)),
    });
  }
  keyWordChange = (e) => {
    // window.console.log(e);
    // window.console.dir(e.target);
    this.setState({ keyword: e.target.value });
  }
  keyWordInputEnter = (a, b) => {
    const {
      keyword,
      treeData,
      checkedKeys,
    } = this.state;
    let expandedKeys = [];
    if (!keyword) {
      expandedKeys = getParentKeyForIdList(treeData, checkedKeys.map((it) => toNumber(it)));
    } else {
      expandedKeys = getParentKeyForKeyword(treeData, keyword);
    }
    this.setState({ expandedKeys: expandedKeys.map((it) => toString(it)), autoExpandParent: true });
  }
  renderTreeNodes(dataList) {
    const { keyword } = this.state;
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
    const { style = {}, searchType = '节点', always } = this.props;
    const {
      keyword,
      expandedKeys,
      autoExpandParent,
    } = this.state;
    const {
      treeData,
      checkedKeys,
    } = always ? this.props : this.state;
    const iExpandedKeys = !keyword ? getParentKeyForIdList(treeData, (checkedKeys || []).map((it) => toNumber(it))).map((it) => toString(it)).concat(expandedKeys) : expandedKeys;
    return (
      <div className="search-tree-wrapper" style={style}>
        <div className="search-tree-input">
          <Input
            placeholder="请输入关键字"
            value={keyword}
            onChange={this.keyWordChange}
            onPressEnter={this.keyWordInputEnter}
          />
          <p
            className="search-tree-input-prompt"
            title={`共搜索到 ${searchCount(treeData, keyword)} 个相关${searchType}（按回车键展开）`}
          >
            {`共搜索到 ${searchCount(treeData, keyword)} 个相关${searchType}（按回车键展开）`}
          </p>
        </div>
        <div className="search-tree-treeWrapper">
          {treeData.length > 0 ? (
            <Tree
              checkable
              autoExpandParent={autoExpandParent}
              expandedKeys={iExpandedKeys}
              checkedKeys={checkedKeys}
              checkStrictly
              selectable={false}
              onExpand={this.onExpand}
              onCheck={this.treeCheck}
            >
              {this.renderTreeNodes(treeData, keyword)}
            </Tree>
          )
            : (
              <div className="search-tree-treewrapper-empty">
                <span>请稍后...</span>
              </div>
            )}
        </div>
        {!always ? <div className="search-tree-buttons">
          <Button type="primary" onClick={this.onOk}>确定</Button>
          <div className="search-tree-button-placeholder"></div>
          <Button onClick={this.onCancel}>取消</Button>
        </div> : null}
      </div>
    );
  }
}

export default SearchTree;
