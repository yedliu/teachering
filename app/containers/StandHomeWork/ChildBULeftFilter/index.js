import React from 'react';
import { LeftListWrapper, SelectColumn, TreeWrapper } from '../indexStyle';
import { Select, Tree, Spin } from 'antd';
import HomeworkTree from '../TreeRender';
import { fromJS } from 'immutable';
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
class ChildBULeftFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentGrade: [],
      currentCourse: [],
      treeData: [],
      subjectId: '',
      gradeId: '',
      editionId: ''
    };
  }
  selectChange(type, item) {
    const { parentSelectChange, childSelectChange, subjectGradeData, selectedParams, currentCourse } = this.props;
    let value = item.key;
    let target = {};
    switch (type) {
      case 'subject':
        this.initState().then(() => {
          target = subjectGradeData.filter(v => v.id === value)[0];
          if (target) {
            parentSelectChange(item, 'selectSubject', target.children);
            this.setState({ currentGrade: target.children, subjectId: value });
            childSelectChange(target, 'selectSubject');
          }
        });
        break;
      case 'grade':
        this.setState({
          currentCourse: [],
          treeData: [],
          gradeId: '',
          editionId: ''
        }, () => {
          this.setState({ gradeId: value }, () => {
            parentSelectChange(item, 'selectGrade');
            parentSelectChange(selectedParams.get('selectSubject').toJS(), 'selectSubject');
            let target = selectedParams.getIn(['selectSubject', 'children']).toJS().filter(v => v.id === value)[0];
            childSelectChange(target, 'selectGrade', { subjectId: selectedParams.getIn(['selectSubject', 'id']), gradeId: this.state.gradeId });
          });
        });
        break;
      case  'courseSystem':
        this.setState({
          treeData: [],
          editionId: ''
        }, () => {
          this.setState({ editionId: value }, () => {
            parentSelectChange(item, 'selectEdition');
            console.log(currentCourse, value);
            let target = currentCourse.filter(v => String(v.id) === value)[0];
            childSelectChange(target, 'selectEdition', this.state);
          });
        });
        break;
    }
  }
  selectNode(value, e) {
    const label = value.label;
    let newValue = value;
    if (typeof label !== 'string') {
      newValue.label = label.props.children || '';
    }
    this.props.handlerSelectCourse(newValue, e);
  }
  initState= async () => {
    await this.setState({
      currentGrade: [],
      currentCourse: [],
      treeData: [],
      subjectId: '',
      gradeId: '',
      editionId: ''
    });
  }
  render() {
    const { subjectGradeData, treeData, currentCourse, selectTree, selectedParams, loading } = this.props;
    const loop = data => data.map((item) => {
      if (item.children && item.children.length > 0) {
        return <TreeNode key={item.id} title={item.name}>{loop(item.children)}</TreeNode>;
      }
      return <TreeNode key={item.id} title={item.name} />;
    });
    let editionId = selectedParams.getIn(['selectEdition', 'id']).toString();
    let subjectId = selectedParams.getIn(['selectSubject', 'id']).toString();
    let gradeId = selectedParams.getIn(['selectGrade', 'id']).toString();
    return (
      <LeftListWrapper>
        <div style={{ height: 72 }}>
          <SelectColumn>
            <Select labelInValue value={ subjectId ? { key: subjectId } : void 0  } style={{ flex: 1, marginRight: 5 }} placeholder="学科" onChange={ this.selectChange.bind(this, 'subject')}>
              {
                subjectGradeData.map(item => {
                  return <Option
                    value={item.id.toString()}
                    key={item.id}
                  >{item.name}</Option>;
                })
              }
            </Select>
            <Select labelInValue value={ gradeId ? { key: gradeId } : void 0 } style={{ flex: 1 }} placeholder="年级" onChange={ this.selectChange.bind(this, 'grade')}>
              {
                selectedParams.getIn(['selectSubject', 'children']).toJS().map(item => {
                  return <Option value={item.id.toString()} key={item.id}>{item.name}</Option>;
                })
              }
            </Select>
          </SelectColumn>
          <SelectColumn>
            <Select labelInValue value={editionId ? { key: editionId } : void 0 } style={{ flex: 1 }} placeholder="课程体系" onChange={ this.selectChange.bind(this, 'courseSystem')}>
              {
                currentCourse.map(item => {
                  return <Option value={item.id.toString()} key={item.id}>{item.name}</Option>;
                })
              }
            </Select>
          </SelectColumn>
        </div>

        <TreeWrapper>
          <Spin spinning={loading}>
            {
                treeData && treeData.length > 0 ?
                  <HomeworkTree
                    selectTree={selectTree}
                    treeList={fromJS(treeData)}
                    onSelect={(value, selectedKnowledge) => {
                      this.selectNode(value, selectedKnowledge);
                    }}
                  /> :
                      <div>暂无数据</div>
            }
          </Spin>
        </TreeWrapper>

      </LeftListWrapper>
    );
  }
}

export default ChildBULeftFilter;
