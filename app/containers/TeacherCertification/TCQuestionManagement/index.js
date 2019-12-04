import React, { Component } from 'react';
import { Pagination, Spin, message } from 'antd';
import styled from 'styled-components';
import QuestionModal from '../components/QuestionModal';
import QuestionTag from '../components/questionTag';
import Slider from './Slider';
import Header from './Header';
import Content from './Content';
import * as server from './server';
import localStorage from 'utils/localStorage';
import { getKnowledgeList, findModuleList } from '../TCCourseManagement/server';
const PAGE_SIZE = 10;

const ContentWrapper = styled.div`
  flex: 1;
  height: 100%;
  padding: 10px;
  overflow: auto;
`;

const SliderWrapper = styled.div`
  width: 250px;
  height: 100%;
  margin-right: 10px;
  border-right: 1px solid #eee;
`;

export default class TCQuestionManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false, // 题目 loading
      questionLoading: false, // 保存题目 loading
      tagLoading: false, // 保存标签 loading
      visible: false, // 编辑题目弹框
      tagVisible: false, // 编辑标签弹框
      practicalList: [], // 笔试模块章节
      courseSystemId: '', // 选中的章节
      expandedKeys: [], // 侧边树展开的节点
      sourceList: [], // 题目来源
      questionTypeList: [], // 题型
      sceneList: [], // 使用场景
      phaseList: [], // 学段列表
      sceneIds: [], // 选中的使用场景
      sourceId: void 0, // 选中的题目来源
      questionType: void 0, // 题型
      phaseCode: void 0, // 选中的学段
      emptyPhase: void 0, // 筛选未贴学段的题目
      questionList: [], // 题目列表
      pageIndex: 1, // 页码
      total: 0, // 总数
      editData: {}, // 题目数据
      showAllAnswer: false, // 是否显示所有答案
      treeData: [],
      modules: [],
      moduleId: void 0,
      knowledgeNames: [],
      modalTreeData: [],
      chapterDirectoryId: '',
      keyword: ''
    };
    this.userPermissions = {};
    this.modalTreeDatas = {};
  }

  async componentDidMount() {
    await findModuleList().then(modules => {
      if (modules.length > 0) {
        this.setState(
          {
            modules,
            moduleId: 1 // 暂时只有笔试课程，id为1
          }
        );
      }
    });
    Promise.all([this.findPracticalList(), this.handleGetFilter()]).then(async () => {
      let res = await this.handleGetKnowledgeList();
      this.setState({ chapterDirectoryId: res[0] ? res[0].id : '' });
      this.handleSearch();
    });
    const permissions = localStorage.getPermissions();
    // 有编辑题目的权限
    this.userPermissions.canEditTag = permissions.includes(
      'teacher-certification-edit-question-tag',
    );
    // 有删除题目的权限
    this.userPermissions.canDeleteQuestion = permissions.includes(
      'teacher-certification-delete-question',
    );
  }
  // 获取知识点
  handleGetKnowledgeList=async (parentId) => {
    const { phaseCode, moduleId } = this.state;
    const params = {
      phaseCode, moduleId, parentId: parentId || 0
    };
    let res = await getKnowledgeList(params);
    this.setState({ treeData: res });
    return res;
  }
  // 来源发生变化
  handleSourceChange = sourceId => {
    this.setState({ sourceId });
  };

  // 题型变化
  handleQuestionTypeChange = questionType => {
    this.setState({ questionType });
  };

  // 使用场景发生变化
  handleSceneChange = sceneIds => {
    this.setState({ sceneIds });
  };

  // 筛选未贴学段标签的题目
  handleSwitchChange = emptyPhase => {
    this.setState({ emptyPhase: emptyPhase ? 1 : void 0 }, () => {
      this.handleSearch();
    });
  };

  // 新增题目
  handleAdd = () => {
    this.isEditQuestion = false;
    this.setState({ visible: true, editData: {}, knowledgeNames: [], modalTreeData: [] });
  };

  // 编辑题目
  onEditQuestion = editData => {
    this.isEditQuestion = true;
    this.setState({ editData: { ...editData }, visible: true });
  };

  // 删除题目
  onDelete = async id => {
    const success = await server.deleteQuestion(id);
    if (success) this.handleDelaySearch();
  };

  // 点击了显示答案按钮
  showAnswer = id => {
    let questionList = this.state.questionList;
    questionList.map(el => {
      if (el.id === id) {
        el.showAnalysis = !el.showAnalysis;
      }
      return el;
    });
    this.setState({ questionList });
  };

  // 点击了编辑题目标签按钮
  onEditTag = async editData => {
    this.isEditQuestion = true;
    if (!editData.sourceId) editData.sourceId = this.state.sourceId;
    this.setState({ loading: true, editData: {}, knowledgeNames: [], modalTreeData: [] });
    let trees = [];
    if (editData.phaseCode) {
      trees = await getKnowledgeList({ moduleId: this.state.moduleId, phaseCode: editData.phaseCode, parentId: 0 });
      this.modalTreeDatas[editData.phaseCode] = trees;
    }
    let names = [];
    if (editData.chapterDirectoryIdList && editData.chapterDirectoryIdList.length > 0) {
      names = await server.getKnowledgeNames({ idList: editData.chapterDirectoryIdList });
    }
    this.setState({ editData: { ...editData }, tagVisible: true, knowledgeNames: names, modalTreeData: trees, loading: false  });
  };

  // 表单数据发生变化
  handleSetFromData = (values = {}) => {
    const { sourceId, chapterDirectoryIdList, sceneIdList, phaseCode } = values;
    let editData = this.state.editData;
    if (sourceId) editData.sourceId = sourceId;
    if (phaseCode) editData.phaseCode = phaseCode;
    if (chapterDirectoryIdList) editData.chapterDirectoryIdList = chapterDirectoryIdList;
    if (sceneIdList) editData.sceneIdList = sceneIdList;
    this.setState({ editData });
  };

  // 显示所有答案
  handleShowAllAnswer = showAllAnswer => {
    this.setState({ showAllAnswer });
  };

  // 侧边的树的数据发生变化
  handleTreeChange = (type = 'chapterDirectoryId', value) => {
    this.setState({ [type]: value }, () => {
      // 选中了二级节点是重新请求数据
      if (type === 'chapterDirectoryId') {
        this.handleSearch();
      }
    });
  };

  // 页码发生变化
  handlePageChange = pageIndex => {
    this.setState({ pageIndex }, () => {
      this.handleSearch();
    });
  };

  // 隐藏编辑题目弹框
  hideModal = () => {
    this.setState({ visible: false });
  };

  // 隐藏编辑标签弹框
  handleHideQuestionTag = () => {
    // 如果是新增的题目，隐藏编辑标签时重新获取题目
    if (!this.isEditQuestion) {
      this.handleDelaySearch();
    }
    this.setState({ tagVisible: false });
  };

  // 获取笔试模块下所有的章节
  findPracticalList = async () => {
    const practicalList = await server.findPracticalList();
    // let courseSystemId = '';
    let expandedKeys = [];
    practicalList.some(el => {
      if (el.chapterList.length > 0) {
        // courseSystemId = el.chapterList[0].id;
        expandedKeys = ['first' + el.id];
        return true;
      }
      return false;
    });
    this.setState({ practicalList, expandedKeys });
  };

  // 获取顶部的筛选条件数据
  handleGetFilter = async () => {
    const {
      sourceList,
      questionTypeList,
      sceneList,
      phaseList,
    } = await server.getHeaderFilter();
    let sourceId = void 0;
    if (sourceList.length > 0) sourceId = sourceList[0].id;
    this.setState({ sourceId, sourceList, questionTypeList, sceneList, phaseList, phaseCode: phaseList[0] ? phaseList[0].id : void 0 });
  };

  // 后端更新数据有1s的延迟
  handleDelaySearch = () => {
    this.setState({ loading: true });
    const timeout = 1200;
    setTimeout(() => {
      this.handleSearch();
    }, timeout);
  }

  // 获取题目列表
  handleSearch = async () => {
    const {
      sceneIds: sceneIdList,
      sourceId,
      questionType: typeId,
      chapterDirectoryId,
      phaseCode,
      emptyPhase,
      pageIndex,
      keyword,
    } = this.state;
    let params;
    this.setState({ loading: true });
    if (chapterDirectoryId === 'unTagFlag') {
      // 选中了未贴标签的章节
      params = { typeId, unTagFlag: 1, pageIndex, keyword };
    } else {
      params = {
        pageIndex,
        sceneIdList,
        sourceId,
        typeId,
        phaseCode,
        emptyPhase,
        chapterDirectoryId,
        keyword,
      };
    }
    params.pageSize = PAGE_SIZE;
    const data = await server.queryQuestion(params);
    if (data.list.length <= 0 && pageIndex > 1) {
      this.handlePageChange(pageIndex - 1);
    }
    this.setState({
      questionList: data.list,
      total: data.total,
      loading: false,
    });
  };

  // 保存题目
  handleSaveQuestion = async data => {
    let editData;
    this.setState({ questionLoading: true });
    if (this.isEditQuestion) {
      // 更新题目
      const id = this.state.editData.id;
      editData = await server.updateQuestion({ ...data, id });
      if (editData) {
        this.setState({ visible: false });
        this.handleDelaySearch();
      }
    } else {
      // 新增题目
      editData = await server.saveQuestion(data);
      if (!editData.sourceId) editData.sourceId = this.state.sourceId;
      if (editData) {
        this.setState({ visible: false, editData });
      }
      // 兼职人员不允许编辑题目标签
      if (editData && this.userPermissions.canEditTag) {
        this.setState({ tagVisible: true });
      } else {
        this.handleDelaySearch();
      }
    }
    this.setState({ questionLoading: false });
  };

  // 保存题目标签
  handleSaveQuestionTag = async () => {
    let idList = this.state.knowledgeNames.map(item => item.id);
    let result = await server.verifyChapterMenu({ idList: idList.join(',') });
    if (result !== true) {
      message.warning('不允许选择不同学段的知识点');
      return;
    } else {
      let phaseName = this.state.knowledgeNames[0].pathNameList[0];
      let phaseCode = this.state.editData.phaseCode;
      let phaseList = this.state.phaseList;
      let target = phaseList.find(item => item.id === phaseCode);
      if (!target) return;
      if (target.name !== phaseName) {
        message.warning('学段与关联题目目录学段不一致，请检查');
        return;
      }
    }
    const {
      id,
      sourceId,
      sceneIdList,
      phaseCode,
    } = this.state.editData;
    this.setState({ tagLoading: true });
    let success = await server.saveQuestionTag({
      id,
      sourceId,
      chapterDirectoryIdList: idList,
      sceneIdList,
      phaseCode
    });
    this.setState({ tagLoading: false });
    if (success) {
      this.setState({ tagVisible: false });
      this.handleDelaySearch();
    }
  };
  // 异步加载树
  handleTreeLoad = (treeNode) => {
    if (treeNode.props.children) {
      return new Promise((resolve) => { resolve(); return });
    }
    const { phaseCode, moduleId } = this.state;
    return getKnowledgeList({ parentId: treeNode.props.dataRef.id, phaseCode, moduleId }).then(res => {
      if (res.length > 0) {
        treeNode.props.dataRef.children = res;
        this.setState({
          treeData: [...this.state.treeData],
        });
      }
    });
  }
  // 异步加载树（标签弹框）
  handleModalTreeLoad=(treeNode) => {
    if (treeNode.props.children) {
      return new Promise((resolve) => { resolve(); return });
    }
    const { moduleId } = this.state;
    let phaseCode = treeNode.props.dataRef.phaseCode;
    return getKnowledgeList({ parentId: treeNode.props.dataRef.id, phaseCode, moduleId }).then(res => {
      if (res.length > 0) {
        treeNode.props.dataRef.children = res;
        this.modalTreeDatas[phaseCode] = [...this.state.modalTreeData];
        this.setState({
          modalTreeData: [...this.state.modalTreeData],
        });
      }
    });
  }
  // 选择学段
  handlePhaseChange=(phaseCode) => {
    this.setState({ phaseCode }, () => {
      this.handleGetKnowledgeList().then((res) => {
        this.setState({ chapterDirectoryId: res[0] ? res[0].id : '' }, () => {
          this.handleSearch();
        });
      });

    });
  }
  // 选择模块
  handleModuleChange=(moduleId) => {
    this.setState({ moduleId });
  }
  // 编辑标签弹框内选择学段
  handleSelectPhase=(e) => {
    let phaseCode = e.target.value;
    if (this.modalTreeDatas[phaseCode]) {
      this.setState({ modalTreeData: this.modalTreeDatas[phaseCode] });
    } else {
      getKnowledgeList({ moduleId: this.state.moduleId, phaseCode, parentId: 0 }).then(res => {
        if (res) {

          this.setState({ modalTreeData: res });
        }
      });
    }
  }
  // 勾选知识点
  handleCheckTree=(checkedKeys) => {
    let checked = checkedKeys.checked;
    if (checked.length > 3) {
      message.warning('最多选3个');
      return;
    }
    if (checked.length === 0) {
      this.setState({ knowledgeNames: [] });
      return;
    }
    server.getKnowledgeNames({ idList: checked }).then(res => {
      if (res) {
        this.setState({ knowledgeNames: res });
      }
    });
  }

  handleKeywordChange = (e) => {
    this.setState({ keyword: e.target.value });
  }

  // 删除目录
  handleDelMenu=(data) => {
    let knowledgeNames = this.state.knowledgeNames;
    knowledgeNames = knowledgeNames.filter(item => String(item.id) !== String(data.id));
    this.setState({ knowledgeNames });
  }
  render() {
    const {
      visible,
      tagVisible,
      chapterDirectoryId,
      expandedKeys,
      sourceList,
      questionTypeList,
      sourceId,
      questionType,
      sceneList,
      phaseList,
      sceneIds,
      questionList,
      pageIndex,
      total,
      editData,
      showAllAnswer,
      loading,
      questionLoading,
      tagLoading,
      phaseCode,
      treeData,
      modules,
      moduleId,
      knowledgeNames,
      modalTreeData,
      keyword
    } = this.state;
    return (
      <div
        style={{
          background: '#fff',
          display: 'flex',
          height: '100%',
        }}
      >
        <SliderWrapper>
          <Slider
            data={treeData}
            selectedKey={chapterDirectoryId ? [String(chapterDirectoryId)] : []}
            expandedKeys={expandedKeys}
            onTreeChange={this.handleTreeChange}
            phaseList={phaseList}
            handlePhaseChange={this.handlePhaseChange}
            modules={modules}
            onModuleChange={this.handleModuleChange}
            phaseCode={String(phaseCode)}
            moduleId={String(moduleId)}
            onLoadData={this.handleTreeLoad}
          />
        </SliderWrapper>
        <ContentWrapper>
          <Header
            sourceList={sourceList}
            questionTypeList={questionTypeList}
            sceneList={sceneList}
            sourceId={sourceId}
            phaseCode={phaseCode}
            questionType={questionType}
            sceneIds={sceneIds}
            keyword={keyword}
            onSourceChange={this.handleSourceChange}
            onQuestionTypeChange={this.handleQuestionTypeChange}
            onSceneChange={this.handleSceneChange}
            onPhaseChange={this.handlePhaseChange}
            onKeywordChange={this.handleKeywordChange}
            onSearch={this.handleSearch}
            onSwitchChange={this.handleSwitchChange}
            onAdd={this.handleAdd}
            disabled={chapterDirectoryId === 'unTagFlag'}
          />
          <Spin spinning={loading}>
            <Content
              data={questionList}
              total={total}
              onEditQuestion={this.onEditQuestion}
              onDelete={this.onDelete}
              showAnswer={this.showAnswer}
              onEditTag={this.onEditTag}
              showAllAnswer={showAllAnswer}
              onShowAllAnswer={this.handleShowAllAnswer}
              userPermissions={this.userPermissions}
            />
          </Spin>
          {total > 0 && (
            <div style={{ textAlign: 'right' }}>
              <Pagination
                pageSize={PAGE_SIZE}
                current={pageIndex}
                onChange={this.handlePageChange}
                total={total}
              />
            </div>
          )}
        </ContentWrapper>
        <QuestionModal
          visible={visible}
          onCancel={this.hideModal}
          onSave={this.handleSaveQuestion}
          data={editData}
          loading={questionLoading}
          selectDisabled={this.isEditQuestion}
          title={this.isEditQuestion ? '编辑题目' : '新增题目'}
          okText={
            this.userPermissions.canEditTag && !this.isEditQuestion
              ? '下一步'
              : '完成'
          }
        />
        {tagVisible && (
          <QuestionTag
            sourceList={sourceList}
            sceneList={sceneList}
            phaseList={phaseList}
            onValuesChange={this.handleSetFromData}
            sourceId={editData.sourceId}
            phaseCode={editData.phaseCode}
            onSave={this.handleSaveQuestionTag}
            chapterDirectoryIdList={editData.chapterDirectoryIdList}
            sceneIdList={editData.sceneIdList}
            onCancel={this.handleHideQuestionTag}
            loading={tagLoading}
            treeData={modalTreeData}
            onLoadData={this.handleModalTreeLoad}
            knowledgeNames={knowledgeNames}
            onSelectPhase={this.handleSelectPhase}
            onCheckTree={this.handleCheckTree}
            checkedKeys={knowledgeNames.map(item => String(item.id))}
            onDelMenu={this.handleDelMenu}
          />
        )}
      </div>
    );
  }
}
