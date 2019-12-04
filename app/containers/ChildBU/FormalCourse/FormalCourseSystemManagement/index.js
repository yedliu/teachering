import React from 'react';
import { fromJS } from 'immutable';
import ManagementLayout from 'components/ManagementLayout';
import Content from './content';
import Form from './form';
import { getSubjectGrade, getState } from '../commonServer';
import {
  getEdition,
  createEdition,
  updateEdition,
  deleteEdition,
} from './server';

export default class FormalCourseSystemManagement extends React.PureComponent {
  state = {
    editionList: fromJS([]),
    subjectList: fromJS([]),
    gradeList: fromJS([]),
    stateList: fromJS([]),
    subjectId: '',
    gradeId: '',
    state: '',
    visible: false,
    loading: false,
    modalLoading: false,
    fromData: fromJS({
      subjectId: '',
      gradeId: '',
      state: '0', // 默认值隐藏
      name: '',
      gradeList: fromJS([]),
    }),
  };

  componentDidMount() {
    this.init();
  }

  crrrentUpdateId = ''; // 记录当前正在修改的数据的 id
  cacheGradeList = {}; // 缓存计算后的 gradeList

  init = async () => {
    await this.handleGetSubject();
    const { subjectId } = this.state;
    this.handleSetFromData({ subjectId }); // 设置表单中年级的初始值
    await Promise.all([this.handleSetGrade(), this.handleGetState()]);
    this.handleGetEdition();
  };

  // 获取科目成功之后 设置筛选条件的科目数据以及 表单中 subjectId 的初始值
  handleGetSubject = async (callback = () => {}) => {
    const { fromData } = this.state;
    const data = await getSubjectGrade();
    const subjectId = (data[0] && data[0].id) || '';
    const newFromData = fromData.set('subjectId', subjectId);
    return new Promise(resolve => {
      this.setState(
        { subjectList: fromJS(data), subjectId, fromData: newFromData },
        () => {
          resolve();
        },
      );
    });
  };

  // 通过 subjectId 获取年级
  handleGetGradeFromSubject = subjectId => {
    // 学科和年级的数据是同一个接口返回的
    // 每次学科变化之后获取 children 就是年级的数据
    if (this.cacheGradeList[subjectId]) {
      return this.cacheGradeList[subjectId];
    }
    const { subjectList } = this.state;
    for (let i = 0; i < subjectList.count(); i++) {
      if (subjectList.getIn([i, 'id']) === subjectId) {
        const gradeList = subjectList.getIn([i, 'children']) || fromJS([]);
        this.cacheGradeList[subjectId] = gradeList;
        return gradeList;
      }
    }
    return [];
  };

  // 设置筛选条件的 年级数据
  handleSetGrade = () => {
    const { subjectId } = this.state;
    const gradeList = this.handleGetGradeFromSubject(subjectId);
    const gradeId = gradeList.getIn([0, 'id']) || '';
    return new Promise(resolve => {
      this.setState({ gradeList, gradeId }, () => {
        resolve();
      });
    });
  };

  // 获取上下架状态
  handleGetState = async () => {
    const data = await getState();
    return new Promise(resolve => {
      this.setState({ stateList: fromJS(data) }, () => {
        resolve();
      });
    });
  };

  // 获取版本数据
  handleGetEdition = async () => {
    const { subjectId, gradeId, state } = this.state;
    this.setState({ loading: true });
    const editionList = await getEdition({
      subjectDictCode: subjectId,
      gradeDictCode: gradeId,
      state,
    });
    this.setState({ loading: false, editionList: fromJS(editionList) });
  };

  handleCreateEdition = async () => {
    let success;
    const { fromData, subjectList } = this.state;
    const gradeList = fromData.get('gradeList');
    const name = fromData.get('name');
    const subjectDictCode = fromData.get('subjectId');
    const gradeDictCode = fromData.get('gradeId');
    const state = fromData.get('state');
    this.setState({ modalLoading: true });


    // 需要在更新和创建少儿课程体系时加上 学科中文名称 和 年级中文名称
    let subject;
    let grade;
    for (let i = 0; i < subjectList.count(); i++) {
      if (subjectList.getIn([i, 'id']) === subjectDictCode) {
        subject = subjectList.getIn([i, 'name']);
        break;
      }
    }

    for (let i = 0; i < gradeList.count(); i++) {
      if (gradeList.getIn([i, 'id']) === gradeDictCode) {
        grade = gradeList.getIn([i, 'name']);
        break;
      }
    }

    if (this.crrrentUpdateId) {
      success = await updateEdition(this.crrrentUpdateId, {
        name,
        subjectDictCode,
        gradeDictCode,
        state,
        subject,
        grade,
      });
    } else {
      success = await createEdition({
        name,
        subjectDictCode,
        gradeDictCode,
        state,
        subject,
        grade,
      });
    }

    this.crrrentUpdateId = '';
    this.setState({ modalLoading: false });
    if (success) {
      this.handleHideModal();
      this.handleGetEdition();
    }
  };

  handleGoUpdate = ({ id, subjectId, gradeId, name, state }) => {
    this.handleSetFromData({ subjectId, gradeId, name, state });
    this.setState({ visible: true });
    this.crrrentUpdateId = id;
  };

  handleDeleteEdition = async id => {
    this.setState({ loading: true });
    const success = await deleteEdition(id);
    if (success) {
      this.handleGetEdition();
    } else {
      this.setState({ loading: false });
    }
  };

  // 表单数据发生变化
  handleSetFromData = (values = {}) => {
    const { subjectId, name, gradeId, state } = values;
    let fromData = this.state.fromData;
    // 如果传入的了 subjectId 则年级也需要变化
    if (subjectId) {
      if (subjectId !== this.prevSubjectId) {
        this.prevSubjectId = subjectId;
        const gradeList = this.handleGetGradeFromSubject(subjectId);
        const newGradeId = gradeId ? gradeId : gradeList.getIn([0, 'id']) || '';
        fromData = fromData
          .set('subjectId', subjectId)
          .set('gradeId', newGradeId)
          .set('gradeList', gradeList);
      }
    }
    if (name || name === '') {
      fromData = fromData.set('name', name);
    }
    if (gradeId) {
      fromData = fromData.set('gradeId', gradeId);
    }
    if (state >= 0) {
      fromData = fromData.set('state', state);
    }
    this.setState({ fromData });
  };

  // === 顶部筛选条件发生变化 Start ===
  handleSubjectChange = value => {
    this.setState({ subjectId: value }, async () => {
      await this.handleSetGrade();
      this.handleGetEdition();
    });
  };

  handleGradeChange = value => {
    this.setState({ gradeId: value }, () => {
      this.handleGetEdition();
    });
  };

  handleStateChange = value => {
    this.setState({ state: value }, () => {
      this.handleGetEdition();
    });
  };
  // === 顶部筛选条件发生变化 End ===

  handleResetFromData = () => {
    // 表单数据重置为当前筛选条件的年级学科
    const { subjectId, gradeId, subjectList } = this.state;
    const _subjectId = subjectId ? subjectId : subjectList.getIn([0, 'id']);
    this.handleSetFromData({ subjectId: _subjectId, gradeId, name: '', state: '0' });
  };
  // 显示 Modal
  handleShowModal = () => {
    this.handleResetFromData();
    this.crrrentUpdateId = '';
    this.setState({ visible: true });
  };

  // 隐藏 Modal
  handleHideModal = () => {
    this.setState({ visible: false });
  };

  render() {
    const {
      editionList,
      subjectList,
      gradeList,
      stateList,
      subjectId,
      gradeId,
      state,
      visible,
      loading,
      modalLoading,
      fromData,
    } = this.state;

    const list = [
      {
        label: '学科',
        value: subjectId,
        type: 'select',
        list: subjectList.toJS(),
        method: this.handleSubjectChange,
      },
      {
        label: '年级',
        value: gradeId,
        type: 'select',
        list: gradeList.toJS(),
        method: this.handleGradeChange,
      },
      {
        label: '上架状态',
        value: state,
        type: 'select',
        list: stateList.toJS(),
        method: this.handleStateChange,
      },
      {
        label: '新建课程体系',
        type: 'button',
        buttonType: 'primary',
        method: this.handleShowModal,
      },
    ];
    return (
      <div style={{ background: '#fff' }}>
        <ManagementLayout list={list}>
          <Content
            goDelete={this.handleDeleteEdition}
            goUpdate={this.handleGoUpdate}
            editionList={editionList}
            stateList={stateList}
            loading={loading}
          />
        </ManagementLayout>
        {visible && <Form
          onCancel={this.handleHideModal}
          onSave={this.handleCreateEdition}
          onValuesChange={this.handleSetFromData}
          visible={visible}
          loading={modalLoading}
          subjectList={subjectList}
          stateList={stateList}
          gradeList={fromData.get('gradeList')}
          subjectId={fromData.get('subjectId')}
          gradeId={fromData.get('gradeId')}
          state={fromData.get('state')}
          name={fromData.get('name')}
          remarks={fromData.get('remarks')}
        />
        }
      </div>
    );
  }
}
