import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import immutable, { fromJS } from 'immutable';
import { createStructuredSelector } from 'reselect';
import { toString } from 'components/CommonFn';
import { Tree as AntdTree, Popconfirm } from 'antd';
import { CanClickItem } from 'components/Table';
import Tree from '../../components/Tree';
import {
  getExamPointList,
  getKnowledgeList,
  makeQuestionsList,
  makeQuestionsIndex,
  maekChildrenIndex,
} from './selectors';
import {
  setQuestionsListAction,
} from './actions';
const TreeNode = AntdTree.TreeNode;

export class TreeComponent extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  shouldComponentUpdate(nextProps) {
    let res = false;
    const type = this.props.type;
    const questionsIndex = this.props.questionsIndex;
    const nextIndex = nextProps.questionsIndex;
    const tagsType = this.props.questionsList.getIn([questionsIndex, 'questionOutputDTO', 'questionTag', this.props.type]);
    const nextTagsType = nextProps.questionsList.getIn([nextIndex, 'questionOutputDTO', 'questionTag', nextProps.type]);
    if ((nextProps.index === 3 && tagsType !== nextTagsType)) res = true;
    if (this.props[type] !== nextProps[type]) res = true;
    if (nextProps[type].count() === 0) res = false;
    if (questionsIndex !== nextIndex) res = true;
    if (this.props.source === 'children' && nextProps.index === 3) {
      res = true;
      // log(this.props.questionsList.getIn([questionsIndex, 'questionOutputDTO', 'questionTag', 'children', this.props.childrenIndex, type]).toJS(), nextProps.questionsList.getIn([nextIndex, 'questionOutputDTO', 'questionTag', 'children', nextProps.childrenIndex, type]).toJS(), res, type, this.props.source);
    } else if (this.props.index === 3) {
      // console.log(tagsType.toJS(), nextTagsType.toJS(), res, 'TreeComponent', this.props.source);
    } else {
      console.log(res, this.props.source);
    }
    return res;
  }
  treeCheck = (keys) => {
    const { type } = this.props;
    const questionsIndex = this.props.questionsIndex;
    let newQuestionsList = this.props.questionsList;
    const childrenIndex = this.props.childrenIndex;
    if (this.props.source === 'children') {
      newQuestionsList = this.props.questionsList.setIn([questionsIndex, 'questionOutputDTO', 'questionTag', 'children', childrenIndex, type], fromJS(keys));
    } else {
      newQuestionsList = this.props.questionsList.setIn([questionsIndex, 'questionOutputDTO', 'questionTag', type], fromJS(keys));
    }
    this.props.dispatch(setQuestionsListAction(newQuestionsList));
  }
  makeTreeNode = (data) => {
    return data.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode title={item.name} key={item.id.toString()} dataRef={item}>
            {this.makeTreeNode(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode isLeaf title={item.name} key={item.id.toString()} />;
    });
  }
  render() {
    const { type, index, noLimit } = this.props;
    const treeDataList = this.props[type] || fromJS([]);
    const defaultData = treeDataList.count() > 0 ? (this.props.defaultData || fromJS([])) : fromJS([]);
    const searchType = { knowledgeIdList: '知识点', examPointIdList: '考点' }[type];
    const res = index === 3 ? (<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Tree.SearchTree
        style={{ flex: 1 }}
        always
        noLimit={noLimit}
        searchType={searchType}
        treeData={treeDataList.toJS()}
        checkedKeys={defaultData.toJS().map((it) => toString(it))}
        onCheck={this.treeCheck}
      />
      {defaultData.count() > 6 ? (
        <Popconfirm placement="left" title={`确定要清除已选中${searchType}吗？`} onConfirm={() => this.treeCheck([])} okText="确定" cancelText="取消">
          <CanClickItem style={{ marginLeft: 10 }} canClick>{`清除已选中${searchType}`}</CanClickItem>
        </Popconfirm>
      ) : null}
      {/* {defaultData.count() > 6 ? <Popconfirm placement="top" title={`确定要清除本题${searchType}吗？`} onConfirm={() => this.treeCheck(type, [])} okText="确定" cancelText="取消">
        <CanClickItem style={{ marginLeft: 30 }} canClick>{`清除本题${{ knowledgeIdList: '知识点', examPointIdList: '考点' }[type]}`}</CanClickItem>
      </Popconfirm> : ''}
      <AntdTree
        checkable
        autoExpandParent
        defaultExpandedKeys={defaultData.toJS().map((it) => toString(it))}
        checkedKeys={defaultData.toJS().map((it) => toString(it))}
        selectable={false}
        checkStrictly
        onCheck={(keys, e) => {
          const notAllLeaf = e.checkedNodes.some((it) => {
            return !it.props.isLeaf;
          });
          // console.log(notAllLeaf, keys, defaultData.toJS());
          if (notAllLeaf && ((keys.checked || []).length >= defaultData.count())) {
            message.error('只能选择最后一级的节点，请检查选择。');
            return;
          }
          this.treeCheck(keys.checked);
        }}
      >
        {this.makeTreeNode(treeDataList.toJS())}
      </AntdTree> */}
    </div>) : (<AntdTree
      checkable
      autoExpandParent
      expandedKeys={defaultData.toJS().map((it) => toString(it))}
      checkedKeys={defaultData.toJS().map((it) => toString(it))}
      selectable={false}
      checkStrictly
      onCheck={(keys, e) => ''}
    >
      {this.makeTreeNode(treeDataList.toJS())}
    </AntdTree>);
    return (res);
  }
}

TreeComponent.propTypes = {
  dispatch: PropTypes.func.isRequired,
  defaultData: PropTypes.instanceOf(immutable.List).isRequired,
  knowledgeIdList: PropTypes.instanceOf(immutable.List).isRequired,
  examPointIdList: PropTypes.instanceOf(immutable.List).isRequired,
  type: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  questionsList: PropTypes.instanceOf(immutable.List).isRequired,
  questionsIndex: PropTypes.number.isRequired,
  source: PropTypes.string,
  childrenIndex: PropTypes.number.isRequired,
};
const mapStateToProps = createStructuredSelector({
  knowledgeIdList: getKnowledgeList(),
  examPointIdList: getExamPointList(),
  questionsList: makeQuestionsList(),
  questionsIndex: makeQuestionsIndex(),
  childrenIndex: maekChildrenIndex(),
});
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(TreeComponent);

