import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import immutable, { fromJS } from 'immutable';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { Tree } from 'antd';

const TreeNode = Tree.TreeNode;

export class MakeTree extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.renderTreeNodes = this.renderTreeNodes.bind(this);
  }
  componentWillMount() {
    // console.log(this.props.defaultList, this.props.ChildrenList);
  }
  renderTreeNodes(data) {
    // console.log(data, 'data');
    return data.map((item, index) => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id.toString()} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id.toString()} />;
    });
  }
  render() {
    return (<Tree
      checkable
      showLine
      autoExpandParent
      defaultExpandedKeys={this.props.defaultList}
      selectable={false}
      checkStrictly={false}
      onCheck={this.props.treeCheck}
      checkedKeys={this.props.defaultList}
    >{this.renderTreeNodes(this.props.ChildrenList)}</Tree>);
  }
}

MakeTree.propTypes = {
  dispatch: PropTypes.func.isRequired,
  // defaultList: PropTypes.array.isRequired,
  // ChildrenList: PropTypes.array.isRequired,
  treeCheck: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  dispatch: PropTypes.func,
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MakeTree);
