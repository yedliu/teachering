import React from 'react';
import styled from 'styled-components';
import SearchBar from './Components/searchBar';
import Table from './Components/table';
import BaseInfoModal from './Components/baseInfoModal';
import CopyWritingModal from './Components/copyWritingModal';
import { getList, addAbility, editAbility, getSubjectTxt, editSubjectTxt, queryAllSubjects } from './server';
const Wrapper = styled.div`
  background: #fff;
  width: 100%;
  height: calc(100% - 103px);
  padding: 20px;
  overflow-y: auto;
`;
class AbilityLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjects: [],
      showBaseInfo: false,
      infoType: 'add',
      showCopyWriting: false,
      list: {},
      searchParams: { pageIndex: 1, pageSize: 10 },
      isShowLoading: false,
      baseInfoLoading: false,
      currentAbility: {},
      currentCopyWriting: [],
      copyWritingLoading: false,
      selectedSubjectId: ''
    };
  }
  componentDidMount() {
    // 获取学科
    queryAllSubjects().then(res => {
      this.setState({ subjects: res });
    });
    // 获取全部列表
    this.queryList();
  }
  /**
   * 查列表
   * @param params pageIndex：页码，pageSize: 每页显示数量
   */
  queryList = (params = { pageIndex: 1, pageSize: 10 }) => {
    this.setState({ isShowLoading: true });
    getList(params).then(res => {
      this.setState({ list: res, isShowLoading: false });
    });
  }
  // 搜索
  toSearch= () => {
    let params =  this.state.searchParams;
    params.pageIndex = 1;
    this.setState({ searchParams: params });
    this.queryList(params);
  }
  /**
   *选择学科
   * @param subjectId:学科id
   */
  selectSubject=(subjectId) => {
    let params = this.state.searchParams;
    params.subjectId = subjectId;
    this.setState({ searchParams: params });
    // this.queryList(params);
  }
  closeModal = (key) => {
    this.setState({ [key]: false });
  }
  showBaseInfoModal=(type, text, record) => {
    if (type === 'edit') {
      this.setState({ currentAbility: record });
    }
    this.setState({ showBaseInfo: true, infoType: type });
  }
  showCopyWritingModal=(record) => {
    getSubjectTxt({ abilityId: record.id }).then(res => {
      // 获取学段
      this.setState({ showCopyWriting: true, currentAbility: record, currentCopyWriting: res });
    });
  }
  // 分页
  handlePage=(pagination) => {
    let params = this.state.searchParams;
    params.pageIndex = pagination.current;
    this.setState({ searchParams: params });
    this.queryList(params);
  }
  // 新增或编辑能力
  saveAbility=(params, status) => {
    if (status === 'add' && params) {
      this.setState({ baseInfoLoading: true });
      addAbility(params).then(res => {
        this.setState({ baseInfoLoading: false });
        if (res.code === '0') {
          this.closeAndRefresh();
        }
      });
    } else {
      params.id = this.state.currentAbility.id;
      editAbility(params).then(res => {
        if (res.code === '0') {
          this.closeAndRefresh();
          this.setState({ currentAbility: {}});
        }
      });
    }

  }
  // 关闭弹框刷新列表
  closeAndRefresh=() => {
    this.closeModal('showBaseInfo');
    this.queryList(this.state.searchParams);
  }
  saveCopyWriting=(values) => {
    let params = values;
    this.setState({ copyWritingLoading: true });
    editSubjectTxt(params).then(res => {
      this.setState({ copyWritingLoading: false });
      if (res.code === '0') {
        // this.closeModal('showCopyWriting');
        // this.setState({ currentAbility: {}, currentCopyWriting: [] });
      }
    });
  }
  onPhaseChange=(phaseId) => {
    // 调接口获取文案内容
    const { selectedSubjectId } = this.state;
    let params = {
      phaseId,
      subjectId: selectedSubjectId
    };
    queryAbilityByPhaseSubject(params).then(res => {
      console.log(res);
      // 设置当前能力
    });
  }
  onSubjectChange=(subjectId) => {
    // 调接口获取学段列表
    this.setState({
      selectedSubjectId: subjectId
    });
  }
  render() {
    const { subjects, showBaseInfo, infoType, showCopyWriting, list, isShowLoading, baseInfoLoading, currentAbility, currentCopyWriting, searchParams, copyWritingLoading  } = this.state;
    const pagination = {
      pageSize: 10,
      current: searchParams.pageIndex,
      total: list.total,
    };
    return (
      <Wrapper>
        <SearchBar
          data={{ subjects }}
          toSearch={this.toSearch}
          toAdd={() => { this.showBaseInfoModal('add') }}
          handleChange={this.selectSubject}
        />
        <Table
          handleAttr={(type, text, record, index) => { this.showBaseInfoModal(type, text, record, index) }}
          handleEdit={(record) => { this.showCopyWritingModal(record) }}
          listData={list.list}
          handlePage={this.handlePage}
          loading={isShowLoading}
          pagination={pagination}
        ></Table>
        { showBaseInfo ?
          <BaseInfoModal
            handleCancel={() => { this.closeModal('showBaseInfo') }}
            type={infoType}
            subjects={subjects}
            handleSubmit={this.saveAbility}
            loading={baseInfoLoading}
            initialForm={currentAbility}
          />
        : null }
        { showCopyWriting ? <CopyWritingModal
          handleCancel={() => { this.closeModal('showCopyWriting'); this.setState({ currentAbility: {}, currentCopyWriting: [] }) }}
          subjects={currentCopyWriting}
          handleSubmit={this.saveCopyWriting}
          loading={copyWritingLoading}
        /> : null }
      </Wrapper>
    );
  }
}

export default AbilityLabel;
