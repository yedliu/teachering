import React from 'react';
import { fromJS } from 'immutable';
import { Spin, message } from 'antd';
import ManagementLayout from 'components/ManagementLayout';
import ContentOfCourses from '../../Component/ContentOfCourses';
import Content from './content';
import { getSubjectGrade, getEdition } from '../commonServer';
import * as server from './server';

export default class FormalCourseSystemManagement extends React.PureComponent {
  state = {
    subjectList: fromJS([]),
    gradeList: fromJS([]),
    editionList: fromJS([]),
    subjectId: '',
    gradeId: '',
    editionId: '',
    firstNodeList: fromJS([]),
    secondNodeList: fromJS([]),
    thirdNodeList: fromJS([]),
    fourthNodeList: fromJS([]),
    showFourth: false,
    selectFirstNode: '',
    selectSeconNode: '',
    selectThirdNode: '',
    selectFourthNode: '',
    loading: false,
    visible: false,
    contentData: {},
  };

  componentDidMount() {
    this.init();
  }

  contants = {
    nodeList: [
      'firstNodeList',
      'secondNodeList',
      'thirdNodeList',
      'fourthNodeList'
    ],
    selectdList: [
      'selectFirstNode',
      'selectSeconNode',
      'selectThirdNode',
      'selectFourthNode'
    ]
  };

  cacheGradeList = {}; // 缓存计算后的 gradeList

  init = async () => {
    await this.handleGetSubject();
    await this.handleSetGrade();
    await this.handleGetEdition();
    this.handleGetCoureSystem();
  };

  // 获取科目成功之后 设置筛选条件的科目数据以及 表单中 subjectId 的初始值
  handleGetSubject = async () => {
    const data = await getSubjectGrade();
    const subjectId = (data[0] && data[0].id) || '';
    return new Promise(resolve => {
      this.setState({ subjectList: fromJS(data), subjectId }, () => {
        resolve();
      });
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

  // 获取版本数据
  handleGetEdition = async () => {
    const { subjectId, gradeId } = this.state;
    const editionList = await getEdition({
      subjectDictCode: subjectId,
      gradeDictCode: gradeId
    });
    const editionId = (editionList[0] && editionList[0].id) || '';
    if (!editionId) {
      message.warning('当前的学科年级未获取到课程体系', 5);
    }
    return new Promise(resolve => {
      this.setState({ editionList: fromJS(editionList), editionId }, () => {
        resolve(!!editionId);
      });
    });
  };

  // 获取正式课课程数据
  handleGetCoureSystem = async (level = 0) => {
    this.setState({ loading: true });
    const { editionId, subjectId, gradeId } = this.state;
    const data = await server.getCourseSystem({
      editionId,
      subjectDictCode: subjectId,
      gradeDictCode: gradeId
    });
    this.setNodeList(fromJS(data), 0, level);
    this.setState({ loading: false });
  };

  // 保存或者更新课程 如果传入 id 则代表是更新数据
  saveOrUpdateCoursSystem = async (name, level, id) => {
    const { subjectId, gradeId, editionId } = this.state;
    const pid = this.getPId(level);
    let success;
    const params = {
      name,
      level: level + 1, // level 后端接口默认从 1 开始，前端为 0
      subjectDictCode: subjectId,
      gradeDictCode: gradeId,
      editionId,
      pid
    };
    this.setState({ loading: true });
    const isUpdate = !!id;
    if (isUpdate) {
      success = await server.updateCourseSystem(id, params);
    } else {
      success = await server.createCourseSystem(params);
    }
    success
      ? this.handleGetCoureSystem(level)
      : this.setState({ loading: false });
    return success;
  };

  // 删除正式课课程
  handleDelete = async (id, level) => {
    this.setState({ loading: true });
    const success = await server.deleteCourseSystem(id);
    success
      ? this.handleGetCoureSystem(level)
      : this.setState({ loading: false });
  };

  // 对正式课课程进行排序
  handleSort = async (data, level) => {
    this.setState({ loading: true });
    const idList = data.map(el => el.get('id')).toJS();
    const success = await server.sortCourseSystem(idList);
    success
      ? this.handleGetCoureSystem(level)
      : this.setState({ loading: false });
    return success;
  };

  /**
   * data 需要设置的数据
   * level 当前需要设置的层级数据
   * startSetSelectd 开始设置 '选中' 的层级
   */
  setNodeList = (data, level = 0, startSetSelectd) => {
    const { nodeList, selectdList } = this.contants;
    if (level >= nodeList.length || !data) return; // 递归终止条件

    const nextNodeListName = nodeList[level + 1];
    const currentListName = nodeList[level];
    const currentSelectName = selectdList[level];
    const currentSelect = data.getIn([0, 'id']);
    // 把下一级的数据初始化
    if (nextNodeListName) this.setState({ [nextNodeListName]: fromJS([]) });
    const state = { [currentListName]: data };
    // 如果没有传 startSetSelectd 或者 层级大于 startSetSelectd 时才会设置selectdNode
    if (startSetSelectd === undefined || level >= startSetSelectd) { // eslint-disable-line
      state[currentSelectName] = currentSelect;
    }
    this.setState(state, async () => {
      const selectd = this.state[currentSelectName];
      const nextData = await this.getChildCoureSystem(selectd, data);
      // 递归设置每个层级的数据
      this.setNodeList(nextData, level + 1, startSetSelectd);
    });
  };

  // 获取当前数据下 children 的字段中的数组
  getChildCoureSystem = async (pId, data) => {
    if (data.count() > 0) {
      for (let i = 0; i < data.count(); i++) {
        if (pId === data.getIn([i, 'id'])) {
          return data.getIn([i, 'children']) || fromJS([]);
        }
      }
    }
    return fromJS([]);
  };

  // 获取父级节点
  getPId = level => {
    const { selectFirstNode, selectSeconNode, selectThirdNode } = this.state;
    // 第一层的父级节点是 0
    return [0, selectFirstNode, selectSeconNode, selectThirdNode][level];
  };

  // 主要是用来设置每个层级的数据
  handleChangeNodeList = async (type, data) => {
    this.setState({ [type]: data });
  };

  // 学科改变
  handleSubjectChange = subjectId => {
    this.setState({ subjectId }, async () => {
      await this.handleSetGrade();
      await this.handleGetEdition();
      this.handleGetCoureSystem();
    });
  };

  // 年级改变
  handleGradeChange = async gradeId => {
    this.setState({ gradeId }, async () => {
      await this.handleGetEdition();
      this.handleGetCoureSystem();
    });
  };

  // 版本改变
  handleEditionChange = async editionId => {
    this.setState({ editionId }, async () => {
      this.handleGetCoureSystem();
    });
  };

  // 控制第四层数据的显示隐藏
  handleShowFourth = () => {
    this.setState({ showFourth: true });
  };

  handleHideFourth = () => {
    this.setState({ showFourth: false });
  };

  // 点击了 ListViewItem 调用的方法
  handleClickItem = (id, level) => {
    const { nodeList, selectdList } = this.contants;
    const currentSelect = selectdList[level];
    const data = this.state[nodeList[level]];
    this.handleHideFourth();
    this.setState({ [currentSelect]: id }, async () => {
      const nextData = await this.getChildCoureSystem(id, data);
      this.setNodeList(nextData, level + 1);
    });
  };
  showModal = ({
    id,
    coverUrl,
    courseHardPoint,
    courseKeyPoint,
    teachGoal
  }) => {
    console.log(id);
    this.currentUpdateId = id;
    this.setState({
      visible: true,
      contentData: {
        coverUrl,
        courseHardPoint,
        courseKeyPoint,
        teachGoal
      }
    });
  }
  hideContentModal = () => {
    this.setState({ visible: false });
    this.currentUpdateId = '';
  }
  handleSubmitContent = async ({
    coverUrl,
    courseHardPoint,
    courseKeyPoint,
    teachGoal
  }) => {
    const success = await server.setZmChildCourseContent({
      coverUrl,
      courseHardPoint,
      courseKeyPoint,
      teachGoal,
      id: this.currentUpdateId,
    });

    if (success) {
      this.hideContentModal();
      this.handleGetCoureSystem();
    }
  }
  render() {
    const {
      loading,
      subjectList,
      gradeList,
      editionList,
      subjectId,
      gradeId,
      editionId,
      firstNodeList,
      secondNodeList,
      thirdNodeList,
      fourthNodeList,
      showFourth,
      selectFirstNode,
      selectSeconNode,
      selectThirdNode,
      selectFourthNode,
      visible,
      contentData,
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
        label: '课程体系',
        value: editionId,
        type: 'select',
        list: editionList.toJS(),
        method: this.handleEditionChange
      }
    ];

    return (
      <div className="formal-course-system-management">
        <ManagementLayout list={list}>
          <Spin spinning={loading} delay={300} size="large">
            <Content
              showFourth={showFourth}
              firstNodeList={firstNodeList}
              secondNodeList={secondNodeList}
              thirdNodeList={thirdNodeList}
              fourthNodeList={fourthNodeList}
              updateNodeList={this.handleChangeNodeList}
              save={this.saveOrUpdateCoursSystem}
              delete={this.handleDelete}
              sort={this.handleSort}
              clickAddNew={this.handleShowFourth}
              onClick={this.handleClickItem}
              onSetClick={this.showModal}
              selectdList={[
                selectFirstNode,
                selectSeconNode,
                selectThirdNode,
                selectFourthNode
              ]}
            />
            {visible &&
            <ContentOfCourses
              onCancel={this.hideContentModal}
              data={contentData}
              onSubmit={this.handleSubmitContent}
            />}
          </Spin>
        </ManagementLayout>
      </div>
    );
  }
}
