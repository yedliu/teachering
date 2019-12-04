import React from 'react';
import { fromJS } from 'immutable';
import ManagementLayout from 'components/ManagementLayout';
import ContentOfCourses from '../../Component/ContentOfCourses';
import Content from './content';
import Form from './form';
import { getSubjectGrade, getState, getDifficulty, setDefault } from '../commonServer';
import {
  getTestCourseSystem,
  createTestCourseSystem,
  updateTestCourseSystem,
  deleteTestCourseSystem,
  setZmChildTestCourseContent,
} from './server';

export default class FormalCourseSystemManagement extends React.PureComponent {
  state = {
    editionList: fromJS([]),
    subjectList: fromJS([]),
    gradeList: fromJS([]),
    stateList: fromJS([]),
    difficultyList: fromJS([]),
    subjectId: '',
    gradeId: '',
    state: '',
    visible: false,
    contentModalVisible: false,
    loading: false,
    modalLoading: false,
    contentData: {},
    fromData: fromJS({
      subjectId: '',
      gradeId: '',
      state: '0', // 默认值隐藏
      name: '',
      remarks: '',
      gradeList: fromJS([]),
      difficulty: '2'
    })
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
    await Promise.all([
      this.handleGetState(),
      this.handleGetDifficulty(),
      this.handleSetGrade()
    ]);
    this.handleGetAll();
  };

  // 获取科目成功之后 设置筛选条件的科目数据以及 表单中 subjectId 的初始值
  handleGetSubject = async () => {
    const { fromData } = this.state;
    const data = await getSubjectGrade();
    const subjectId = (data[0] && data[0].id) || '';
    const newFromData = fromData.set('subjectId', subjectId);
    return new Promise(resolve => {
      this.setState(
        { subjectList: fromJS(data), subjectId, fromData: newFromData },
        () => {
          resolve();
        }
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

  handleGetDifficulty = async () => {
    const data = await getDifficulty();
    return new Promise(resolve => {
      this.setState({ difficultyList: fromJS(data) }, () => {
        resolve();
      });
    });
  };
  // 获取测评课数据
  handleGetAll = async () => {
    const { subjectId, gradeId, state } = this.state;
    this.setState({ loading: true });
    const editionList = await getTestCourseSystem({
      subjectDictCode: subjectId,
      gradeDictCode: gradeId,
      state
    });
    this.setState({ loading: false, editionList: fromJS(editionList) });
  };

  handleCreate = async () => {
    let success;
    const fromData = this.state.fromData;
    const name = fromData.get('name').trim();
    const subjectDictCode = fromData.get('subjectId');
    const gradeDictCode = fromData.get('gradeId');
    const state = fromData.get('state');
    const remarks = fromData.get('remarks');
    const difficulty = fromData.get('difficulty');
    this.setState({ modalLoading: true });
    const params = {
      name,
      subjectDictCode,
      gradeDictCode,
      state,
      remarks,
      difficulty
    };
    if (this.crrrentUpdateId) {
      success = await updateTestCourseSystem(this.crrrentUpdateId, params);
    } else {
      success = await createTestCourseSystem(params);
    }

    this.crrrentUpdateId = '';
    this.setState({ modalLoading: false });
    if (success) {
      this.handleHideModal();
      this.handleGetAll();
    }
  };

  handleGoUpdate = ({
    id,
    subjectId,
    gradeId,
    name,
    state,
    remarks,
    difficulty,
    coverUrl,
    courseHardPoint,
    courseKeyPoint,
    teachGoal,
  }, flag) => {
    if (flag) {
      const contentData = {
        coverUrl,
        courseHardPoint,
        courseKeyPoint,
        teachGoal
      };
      this.setState({ contentModalVisible: true, contentData });
    } else {
      this.handleSetFromData({
        subjectId,
        gradeId,
        name: name.trim(),
        state,
        remarks,
        difficulty
      });
      this.setState({ visible: true, isEdit: true });
    }

    this.crrrentUpdateId = id;
  };

  handleDelete = async id => {
    this.setState({ loading: true });
    const success = await deleteTestCourseSystem(id);
    if (success) {
      this.handleGetAll();
    } else {
      this.setState({ loading: false });
    }
  };

  // 表单数据发生变化
  handleSetFromData = (values = {}) => {
    const { subjectId, name, gradeId, state, remarks, difficulty } = values;
    let fromData = this.state.fromData;
    if (subjectId && !gradeId) {
      if (subjectId !== this.prevSubjectId) {
        this.prevSubjectId = subjectId;
        const gradeList = this.handleGetGradeFromSubject(subjectId);
        const newGradeId = gradeList.getIn([0, 'id']) || '';
        fromData = fromData
          .set('subjectId', subjectId)
          .set('gradeId', newGradeId)
          .set('gradeList', gradeList);
      }
    }
    if (subjectId && gradeId) {
      if (subjectId !== this.prevSubjectId) {
        this.prevSubjectId = subjectId;
        const gradeList = this.handleGetGradeFromSubject(subjectId);
        // const newGradeId = gradeList.getIn([0, 'id']) || '';
        fromData = fromData
          .set('subjectId', subjectId)
          .set('gradeId', gradeId)
          .set('gradeList', gradeList);
      }
    }
    if (difficulty >= 0) {
      fromData = fromData.set('difficulty', difficulty);
    }
    if (name || name === '') {
      fromData = fromData.set('name', name);
    }
    if (remarks || remarks === '') {
      fromData = fromData.set('remarks', remarks);
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
      this.handleGetAll();
    });
  };

  handleGradeChange = value => {
    this.setState({ gradeId: value }, () => {
      this.handleGetAll();
    });
  };

  handleStateChange = value => {
    this.setState({ state: value }, () => {
      this.handleGetAll();
    });
  };
  // === 顶部筛选条件发生变化 End ===

  handleResetFromData = () => {
    // 表单数据重置为当前筛选条件的年级学科
    const { subjectId, gradeId, subjectList } = this.state;
    const _subjectId = subjectId ? subjectId : subjectList.getIn([0, 'id']);
    this.handleSetFromData({
      subjectId: _subjectId,
      gradeId,
      name: '',
      state: '0',
      remarks: '',
      difficulty: '2'
    });
  };

  // 点击新增课程按钮
  handleClickNew = () => {
    this.handleResetFromData();
    this.crrrentUpdateId = void 0;
    this.setState({ visible: true, isEdit: false });
  };

  // 隐藏 Modal
  handleHideModal = () => {
    this.setState({ visible: false });
  };
  // 设置默认
  handleSetDefault=(params) => {
    setDefault(params).then(res => {
      if (res) {
        this.handleGetAll();
      }
    });
  }
  hideContentModal = () => {
    this.setState({ contentModalVisible: false });
    this.crrrentUpdateId = '';
  }
  handleSubmitContent = async ({
    coverUrl,
    courseHardPoint,
    courseKeyPoint,
    teachGoal
  }) => {
    const success = await setZmChildTestCourseContent({
      id: this.crrrentUpdateId,
      coverUrl,
      courseHardPoint,
      courseKeyPoint,
      teachGoal
    });

    if (success) {
      this.hideContentModal();
      this.handleGetAll();
    }
  }
  render() {
    const {
      editionList,
      subjectList,
      gradeList,
      stateList,
      difficultyList,
      subjectId,
      gradeId,
      state,
      visible,
      loading,
      modalLoading,
      fromData,
      isEdit,
      contentModalVisible,
      contentData
    } = this.state;

    const list = [
      {
        label: '学科',
        value: subjectId,
        type: 'select',
        list: subjectList.toJS(),
        method: this.handleSubjectChange
      },
      {
        label: '年级',
        value: gradeId,
        type: 'select',
        list: gradeList.toJS(),
        method: this.handleGradeChange
      },
      {
        label: '上架状态',
        value: state,
        type: 'select',
        list: stateList.toJS(),
        method: this.handleStateChange
      },
      {
        label: '新增课程',
        type: 'button',
        buttonType: 'primary',
        method: this.handleClickNew
      }
    ];

    return (
      <div style={{ background: '#fff' }}>
        <ManagementLayout list={list}>
          <Content
            goDelete={this.handleDelete}
            goUpdate={this.handleGoUpdate}
            editionList={editionList}
            stateList={stateList}
            difficultyList={difficultyList}
            loading={loading}
            onSetDefault={this.handleSetDefault}
          />
        </ManagementLayout>
        {visible && <Form
          onCancel={this.handleHideModal}
          onSave={this.handleCreate}
          onValuesChange={this.handleSetFromData}
          visible={visible}
          loading={modalLoading}
          subjectList={subjectList}
          stateList={stateList}
          difficultyList={difficultyList}
          gradeList={fromData.get('gradeList')}
          subjectId={fromData.get('subjectId')}
          gradeId={fromData.get('gradeId')}
          state={fromData.get('state')}
          name={fromData.get('name')}
          difficulty={fromData.get('difficulty')}
          remarks={fromData.get('remarks')}
          isEdit={isEdit}
        />}
        {contentModalVisible &&
          <ContentOfCourses
            onCancel={this.hideContentModal}
            data={contentData}
            onSubmit={this.handleSubmitContent}
          />}
      </div>
    );
  }
}
