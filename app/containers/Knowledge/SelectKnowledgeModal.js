
import React from 'react';
import { Modal, message, Tree } from 'antd';
import { fromJS } from 'immutable';
import { toNumber } from 'components/CommonFn';

import {
  HeaderBox,
  TreeWrapper,
} from 'containers/PaperFinalVerify/paperStyle';

const TreeNode = Tree.TreeNode;

export default class SelectKnowledgeModal extends React.PureComponent {
  constructor(props) {
    super(props);
    const { selectedKnowledge } = this.props;
    this.state = {
      selectedKnowledge
    };
  }

  /**
   * @description 渲染知识点 Tree
   * @param {number[]} data 知识点集合
   * @param {*} curKnowledgeId 当前正在修改的知识点
   * @param {*} ancestor 上级以及更上级的知识点集合
   */
  makeTreeNode(data, curKnowledgeId, ancestor = []) {
    return data.map((item, i) => {
      const newAncestor = ancestor.concat([item.id]);
      const isSubset = newAncestor.includes(curKnowledgeId);   // isSubset: 是否为当前知识点的子级以下知识点
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode title={item.name} key={item.id.toString()} dataRef={item} isSubset={isSubset}>
            {this.makeTreeNode(item.children, curKnowledgeId, newAncestor)}
          </TreeNode>
        );
      }
      return <TreeNode isLeaf title={item.name} key={item.id.toString()} isSubset={isSubset} />;
    });
  }

  render() {
    const { originKnowledgeList, onOk, onCancel, curKnowledge = fromJS({}) } = this.props;
    const { selectedKnowledge } = this.state;
    return (
      <Modal
        visible
        bodyStyle={{ maxHeight: 600, overflowY: 'auto' }}
        onCancel={onCancel}
        onOk={() => {
          onOk(selectedKnowledge);
        }}
        okText="确认选择"
      >
        <HeaderBox style={{ padding: '0 20px', fontSize: '16px', fontWeight: 600 }}>请选择知识点/考点</HeaderBox>
        <TreeWrapper>
          <Tree
            checkable
            autoExpandParent
            selectable={false}
            defaultExpandedKeys={selectedKnowledge.toJS()}
            checkStrictly
            checkedKeys={selectedKnowledge.toJS()}
            onCheck={(keys, e) => {
              let checked = keys.checked;
              // console.log(originKnowledgeList.toJS(), selectedKnowledge.toJS(), keys, e, checked);

              const eventKey = e.node.props.eventKey;
              const isSubset = e.node.props.isSubset;
              // console.log(eventKey, selectedKnowledge.toJS(), !selectedKnowledge.includes(eventKey), 'eventKey');
              if (toNumber(eventKey) === toNumber(curKnowledge.get('id'))) {
                message.info('不能选自己作为前置知识点');
                return;
              } else if (isSubset && !selectedKnowledge.includes(eventKey)) {
                message.info('前置知识点不能为其子知识点');
                return;
              }
              this.setState({
                selectedKnowledge: fromJS(checked),
              });
            }}
          >
            {this.makeTreeNode(originKnowledgeList.toJS(), curKnowledge.get('id'))}
          </Tree>
        </TreeWrapper>
      </Modal>
    );
  }
}
