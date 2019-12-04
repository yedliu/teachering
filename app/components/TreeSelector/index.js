import React from 'react';
import { LeftListWrapper, SelectColumn, TreeWrapper } from './styles/indexStyle';
import { Select, Tree, Spin } from 'antd';
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
class  TreeSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  selectOnChange = (e, i) => {
    const { selectOnChange } = this.props;
    selectOnChange(e, i);
  }
  treeOnChange = (selectedKeys, e) => {
    const { treeOnChange } = this.props;
    treeOnChange(selectedKeys, e);
  }
  render() {
    const { selectOne, selectTwo, selectThree, treeData, loading } = this.props;
    const loop = data => data.map((item) => {
      if (item.children && item.children.length > 0) {
        return <TreeNode key={item.id} title={item.name}>{loop(item.children)}</TreeNode>;
      }
      return <TreeNode key={item.id} title={item.name} />;
    });
    return (
      <LeftListWrapper>
        <div style={{ height: 72 }}>
          <SelectColumn>
            <Select
              labelInValue
              style={{ flex: 1, marginRight: 5 }}
              placeholder={selectOne.placeholder}
              onChange={ (e) => { this.selectOnChange(e, 1) } }
              value={selectOne.defaultValue ? { key: String(selectOne.defaultValue) } : void 0 }
            >
              {
                selectOne.data.map(item => {
                  return <Option
                    value={String(item.id || item.value)}
                    key={item.id || item.value}
                  >{item.name || item.label}</Option>;
                })
              }
            </Select>
            <Select
              labelInValue
              style={{ flex: 1 }}
              placeholder={selectTwo.placeholder}
              value={selectTwo.defaultValue ? { key: String(selectTwo.defaultValue) } : void 0 }
              onChange={ (e) => { this.selectOnChange(e, 2) } }
            >
              {
                selectTwo.data.map(item => {
                  return <Option value={String(item.id || item.value)} key={item.id || item.value}>{item.name || item.label}</Option>;
                })
              }
            </Select>
          </SelectColumn>
          <SelectColumn>
            <Select
              labelInValue
              style={{ flex: 1 }}
              placeholder={selectThree.placeholder}
              value={selectThree.defaultValue ? { key: String(selectThree.defaultValue) } : void 0 }
              onChange={ (e) => { this.selectOnChange(e, 3) } }
            >
              {
                selectThree.data.map(item => {
                  return <Option value={String(item.id || item.value)} key={item.id || item.value}>{item.name || item.label}</Option>;
                })
              }
            </Select>
          </SelectColumn>
        </div>

        <TreeWrapper>
          <Spin spinning={loading}>
            {
                treeData && treeData.data && treeData.data.length > 0 ?
                  <Tree
                    showLine
                    defaultSelectedKeys={[String(treeData.defaultNode)]}
                    defaultExpandedKeys={[String(treeData.defaultExpand)]}
                    onSelect={this.treeOnChange}
                  >
                    {loop(treeData.data)}
                  </Tree>
                  :
                  <div>暂无数据</div>
            }
          </Spin>
        </TreeWrapper>

      </LeftListWrapper>
    );
  }
}
TreeSelector.propTypes = {
  selectOne: React.PropTypes.object.isRequired,
  selectTwo: React.PropTypes.object.isRequired,
  selectThree: React.PropTypes.object.isRequired,
  treeData: React.PropTypes.object.isRequired,
  loading: React.PropTypes.bool.isRequired,
  selectOnChange: React.PropTypes.func.isRequired,
  treeOnChange: React.PropTypes.func.isRequired,
};
export default TreeSelector;
