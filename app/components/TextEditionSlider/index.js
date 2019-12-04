import React from 'react';
import styled from 'styled-components';
import { Select, Tree } from 'antd';
import { RunLoading } from 'components/LoadingIndicator';
import {
  getGradeList,
  getSubjectList,
  getEdition,
  getTextbook,
  findKnowledges,
  findCurrentTextBookKnowledge,
} from './server';

const TreeNode = Tree.TreeNode;
const Option = Select.Option;

const Wrapper = styled.div`
  padding: 0 5px;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .ant-tree {
    width: 100%;
    overflow-y: auto;
    flex: 1;
  }
`;

export default class TextEditionSlider extends React.Component {
  static defaultProps = {
    autoSelect: true,
  };

  state = {
    gradeList: [],
    subjectList: [],
    editionList: [],
    textbookList: [],
    gradeId: this.props.gradeId || void 0,
    subjectId: this.props.subjectId || void 0,
    editionId: void 0,
    textbookId: void 0,
    checkedKeys: [],
    knowledgeIdList: [],
    loading: false,
  };

  componentDidMount() {
    this.init();
  }

  init = async () => {
    let { gradeId, subjectId } = this.state;
    const _gradeId = await this.handleGetGrade();
    // 如果没有传入默认的年级Id 使用获取到的第一个年级 Id
    if (!gradeId) {
      if (!_gradeId) return;
      gradeId = _gradeId;
      this.setState({ gradeId });
      this.handleValueChange({ gradeId });
    }
    const _subjectId = await this.handleGetSubject(gradeId);
    // 如果没有传入默认的学科Id 使用获取到的第一个年级 Id
    if (!subjectId) {
      if (!_subjectId) return;
      subjectId = _subjectId;
      this.setState({ subjectId });
      this.handleValueChange({ subjectId });
    }
    const editionId = await this.handleGetEdition(gradeId, subjectId);
    // 如果没有获取到版本 Id，获取到的知识点为空
    if (!editionId) {
      this.handleValueChange({ knowledge: [] });
      return;
    }
    const textbookId = await this.handleGetTextbook(
      gradeId,
      subjectId,
      editionId,
    );
    if (!this.props.autoSelect) return; // 不自动选中教材目录
    console.log(this.props.autoSelect, 1111111);
    // 如果没有获取到教材目录 Id，获取到的知识点为空
    if (!textbookId) {
      this.handleValueChange({ knowledge: [] });
      return;
    }
    this.handleGetKnowledge(textbookId);
  };

  // 选中的教材目录发生变化
  onSelect = selectedKeys => {
    console.log(selectedKeys);
    const textbookId = selectedKeys && selectedKeys[0];
    console.log(textbookId);
    this.setState({ textbookId });
    if (textbookId) {
      this.handleGetKnowledge(textbookId);
    } else {
      // 取消选中则清空知识点
      this.setState({ knowledgeIdList: [] }, () => {
        this.handleKnowledgeChange();
      });
    }
  };

  // 多选框
  onCheck = (keys, info) => {
    const currentId = Number(info.node.props.dataRef.id);
    const { checkedKeys } = this.state;
    if (info.checked) {
      checkedKeys.push(currentId);
    } else {
      // 知识点中存在当前选中的知识点则删除
      const { knowledgeIdList } = this.state;
      const index = knowledgeIdList.indexOf(currentId);
      if (index > -1) {
        knowledgeIdList.splice(index, 1);
        this.setState(knowledgeIdList);
      }

      const i = checkedKeys.indexOf(currentId);
      if (i > -1) {
        checkedKeys.splice(i, 1);
      }
    }
    this.setState({ checkedKeys }, () => {
      this.handleKnowledgeChange();
    });
  };

  // 年级发生变化
  handleGradeChange = async gradeId => {
    this.setState({ gradeId });
    const subjectId = await this.handleGetSubject(gradeId);
    this.handleValueChange({ gradeId, subjectId });
    this.setState({ subjectId });
    if (!subjectId) {
      this.handleValueChange({ knowledge: [] });
      this.setState({ textbookList: [], editionList: [], editionId: void 0 });
      return;
    }
    const editionId = await this.handleGetEdition(gradeId, subjectId);
    if (!editionId) {
      this.handleValueChange({ knowledge: [] });
      this.setState({ textbookList: [] });
      return;
    }
    const textbookId = await this.handleGetTextbook(
      gradeId,
      subjectId,
      editionId,
    );

    if (!this.props.autoSelect) return; // 不自动选中 textbookId
    if (!textbookId) {
      this.handleValueChange({ knowledge: [] });
      return;
    }
    this.handleGetKnowledge(textbookId);
  };
  // 学科发生变化
  handleSubjectChange = async subjectId => {
    const { gradeId } = this.state;
    this.setState({ subjectId });
    this.handleValueChange({ subjectId });
    const editionId = await this.handleGetEdition(gradeId, subjectId);
    if (!editionId) {
      this.setState({ textbookList: [], knowledgeIdList: [] }, () => {
        this.handleKnowledgeChange();
      });
      return;
    }
    const textbookId = await this.handleGetTextbook(
      gradeId,
      subjectId,
      editionId,
    );
    if (!this.props.autoSelect) return; // 不自动选中 textbookId
    if (!textbookId) {
      this.setState({ knowledgeIdList: [] }, () => {
        this.handleKnowledgeChange();
      });
      return;
    }
    this.handleGetKnowledge(textbookId);
  };

  handleEditionChange = async editionId => {
    const { gradeId, subjectId } = this.state;
    // 版本变化清空选中的知识点
    this.setState({ editionId, knowledgeIdList: [], checkedKeys: [] });
    this.handleValueChange({ editionId });
    const textbookId = await this.handleGetTextbook(
      gradeId,
      subjectId,
      editionId,
    );
    if (!this.props.autoSelect) return; // 不自动选中 textbookId
    if (!textbookId) {
      this.handleValueChange({ knowledge: [] });
      return;
    }
    this.handleGetKnowledge(textbookId);
  };
  // 获取年级
  handleGetGrade = async () => {
    const gradeList = await getGradeList();
    const gradeId = gradeList[0] && gradeList[0].id;
    this.setState({ gradeList });
    return gradeId;
  };
  // 获取学科
  handleGetSubject = async gradeId => {
    const subjectList = await getSubjectList(gradeId);
    const subjectId = subjectList[0] && subjectList[0].id;
    this.setState({ subjectList });
    // this.handleValueChange({ subjectId });
    return subjectId;
  };

  handleGetEdition = async (gradeId, subjectId) => {
    const editionList = await getEdition(gradeId, subjectId);
    const editionId = editionList[0] && editionList[0].id;
    this.setState({ editionList, editionId });
    this.handleValueChange({ editionId });
    return editionId;
  };
  // 获取教材目录
  handleGetTextbook = async (gradeId, subjectId, editionId) => {
    this.setState({ loading: true, textbookId: void 0 });
    const textbookList = await getTextbook(gradeId, subjectId, editionId);
    this.setState({ loading: false, textbookList });

    if (!this.props.autoSelect) return; // 不自动选中 textbookId
    const textbookId = textbookList[0] && textbookList[0].id;
    this.setState({ textbookId });
    this.handleValueChange({ textbookId });
    return textbookId;
  };
  // 获取知识点
  handleGetKnowledge = async textbookId => {
    const knowledgeIdList = await findKnowledges(textbookId);
    this.setState({ knowledgeIdList }, () => {
      this.handleKnowledgeChange();
    });
  };

  handleKnowledgeChange = () => {
    const { knowledgeIdList, checkedKeys } = this.state;
    const knowledge = Array.from(new Set([...knowledgeIdList, ...checkedKeys]));
    this.handleValueChange({ knowledge });
  };

  handleValueChange = data => {
    const { onValueChange } = this.props;
    if (typeof onValueChange === 'function') {
      onValueChange(data);
    }
  };

  // 异步加载数据，加载最后一级教材目录的知识点
  onLoadData = treeNode => {
    return new Promise(resolve => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      const textBookId = treeNode.props.dataRef.id;
      findCurrentTextBookKnowledge(textBookId).then(data => {
        if (data && data.length > 0) {
          treeNode.props.dataRef.children = data.map(child => ({
            isLeaf: true,
            id: child.id,
            name: child.name,
            enableCheckbox: true,
          }));
        } else {
          treeNode.props.dataRef.isLeaf = true;
        }
        this.setState({ textbookList: this.state.textbookList });
        resolve();
      });
    });
  };

  renderTreeNodes = data => {
    // 知识点只允许勾选，教材目录不允许勾选
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            title={item.name}
            key={item.id}
            dataRef={item}
            disableCheckbox={!item.enableCheckbox}
            selectable={!item.enableCheckbox}
            isLeaf={item.isLeaf}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={item.name}
          disableCheckbox={!item.enableCheckbox}
          selectable={!item.enableCheckbox}
          isLeaf={item.isLeaf}
          key={item.id}
          dataRef={item}
        />
      );
    });
  };

  getGradeList = () => {
    const { includeGrades } = this.props;
    const { gradeList } = this.state;
    if (Array.isArray(includeGrades) && includeGrades.length > 0) {
      return gradeList.filter(el => includeGrades.includes(el.id));
    }
    return gradeList;
  };

  render() {
    const {
      subjectList,
      editionList,
      textbookList,
      gradeId,
      subjectId,
      editionId,
      textbookId,
      loading,
      checkedKeys,
      knowledgeIdList,
    } = this.state;
    const gradeList = this.getGradeList();
    // 当前选中的知识点由 已选择的知识点（checkKeys）以及教材目录获取的知识点（knowledgeIdList）组成
    const checked = Array.from(new Set([...knowledgeIdList, ...checkedKeys])).map(el => String(el));
    const knowledgeKeys = {
      checked,
      halfChecked: [],
    };

    return (
      <Wrapper>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '10px 0',
          }}
        >
          <Select
            onChange={this.handleGradeChange}
            style={{ flex: 1, marginRight: 5 }}
            value={gradeId && `${gradeId}`}
            placeholder="请选择年级"
          >
            {gradeList.map(grade => (
              <Option key={grade.id} value={`${grade.id}`}>
                {grade.name}
              </Option>
            ))}
          </Select>
          <Select
            onChange={this.handleSubjectChange}
            style={{ flex: 1 }}
            value={subjectId && `${subjectId}`}
            placeholder="请选择学科"
          >
            {subjectList.map(subject => (
              <Option key={subject.id} value={`${subject.id}`}>
                {subject.name}
              </Option>
            ))}
          </Select>
        </div>
        <Select
          onChange={this.handleEditionChange}
          style={{ width: '100%' }}
          value={editionId && `${editionId}`}
          placeholder="请选择教材版本"
        >
          {editionList.map(edition => (
            <Option key={edition.id} value={`${edition.id}`}>
              {edition.name}
            </Option>
          ))}
        </Select>
        {loading && RunLoading()}
        {textbookList.length > 0 ? (
          <Tree
            showLine
            checkable
            checkStrictly
            checkedKeys={knowledgeKeys}
            onSelect={this.onSelect}
            onCheck={this.onCheck}
            selectedKeys={textbookId ? [`${textbookId}`] : []}
            loadData={this.onLoadData}
          >
            {this.renderTreeNodes(textbookList)}
          </Tree>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <img
              role="presentation"
              src={`${
                window._baseUrl.imgCdn
              }2cfcc00d-8360-42c7-b371-4253fd4735cb.png`}
              style={{ width: 100 }}
            />
            <h5 style={{ color: 'rgb(153, 153, 153)', textAlign: 'center' }}>
              没有找到相关教材章节
            </h5>
          </div>
        )}
      </Wrapper>
    );
  }
}
