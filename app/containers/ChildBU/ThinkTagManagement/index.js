import React from 'react';
import { fromJS } from 'immutable';
import ManagementLayout from 'components/ManagementLayout';
import Content from './content';
import ModalForm from './form';
import {
  getChildSubjectPhase,
  getThinkTag,
  createThinkTag,
  updateThinkTag,
  deleteThinkTag
} from './server';

export default class ThinkTagManagement extends React.PureComponent {
  state = {
    thinkTagList: fromJS([]),
    subjectList: fromJS([]),
    phaseList: fromJS([]),
    subjectDictCode: '',
    phaseDictCode: '',
    tagName: '',
    pageSize: 10,
    pageIndex: 1,
    total: 0,
    visible: false,
    loading: false,
    modalLoading: false,
    fromData: fromJS({
      subjectDictCode: '',
      phaseDictCode: '',
      badAdvise: '', // 默认值隐藏
      middleAdvise: '',
      goodAdvise: '',
      tagName: '',
      phaseList: fromJS([]),
      tagDesc: ''
    })
  };

  componentDidMount() {
    this.init();
  }

  currentUpdateId = ''; // 记录当前正在修改的数据的 id
  cachePhaseList = {}; // 缓存计算后的 phaseList

  init = async () => {
    await this.handleGetSubject();
    const { subjectDictCode } = this.state;
    this.handleSetFromData({ subjectDictCode }); // 设置表单中年级的初始值
    await this.handleSetPhase();
    this.handleGetAll();
  };

  // 获取科目成功之后 设置筛选条件的科目数据以及 表单中 subjectDictCode 的初始值
  handleGetSubject = async () => {
    const { fromData } = this.state;
    const data = await getChildSubjectPhase();
    const subjectDictCode = (data[0] && data[0].id) || '';
    const newFromData = fromData.set('subjectDictCode', subjectDictCode);
    return new Promise(resolve => {
      this.setState(
        { subjectList: fromJS(data), subjectDictCode, fromData: newFromData },
        () => {
          resolve();
        }
      );
    });
  };

  // 通过 subjectDictCode 获取学段
  handleGetPhase = subjectDictCode => {
    // 学科和学段的数据是同一个接口返回的
    // 每次学科变化之后获取 children 就是学段的数据
    if (this.cachePhaseList[subjectDictCode]) {
      return this.cachePhaseList[subjectDictCode];
    }
    const { subjectList } = this.state;
    for (let i = 0; i < subjectList.count(); i++) {
      if (subjectList.getIn([i, 'id']) === subjectDictCode) {
        const phaseList = fromJS(subjectList.getIn([i, 'children']) || []);
        this.cachePhaseList[subjectDictCode] = phaseList;
        return phaseList;
      }
    }
    return [];
  };

  // 设置筛选条件的 学段数据
  handleSetPhase = () => {
    const { subjectDictCode, fromData } = this.state;
    const phaseList = this.handleGetPhase(subjectDictCode);
    const phaseDictCode = phaseList.getIn([0, 'id']) || '';
    return new Promise(resolve => {
      this.setState({ phaseList, phaseDictCode, fromData: fromData.set('phaseDictCode', phaseDictCode) }, () => {
        resolve();
      });
    });
  };

  // 获取测评课数据
  handleGetAll = async () => {
    const { subjectDictCode, phaseDictCode, tagName, pageIndex, pageSize } = this.state;
    this.setState({ loading: true });
    const data = await getThinkTag({
      subjectDictCode,
      phaseDictCode,
      tagName,
      pageIndex,
      pageSize,
    });
    if (data.list.length === 0 && pageIndex > 1) { // 如果当前页不是第一页，且数据为空，请求前一页数据
      this.onPageChange(pageIndex - 1);
    } else {
      this.setState({ loading: false, total: data.total, thinkTagList: fromJS(data.list || []) });
    }
  };

  handleCreate = async () => {
    let success;
    const fromData = this.state.fromData;
    const tagName = fromData.get('tagName');
    const subjectDictCode = fromData.get('subjectDictCode');
    const phaseDictCode = fromData.get('phaseDictCode');
    const badAdvise = fromData.get('badAdvise');
    const middleAdvise = fromData.get('middleAdvise');
    const goodAdvise = fromData.get('goodAdvise');
    const tagDesc = fromData.get('tagDesc');
    this.setState({ modalLoading: true });

    const params = {
      subjectDictCode,
      phaseDictCode,
      badAdvise,
      middleAdvise,
      goodAdvise,
      tagName,
      tagDesc,
    };
    if (this.currentUpdateId) {
      success = await updateThinkTag(this.currentUpdateId, params);
    } else {
      success = await createThinkTag(params);
    }

    this.setState({ modalLoading: false });
    if (success) {
      this.currentUpdateId = '';
      this.handleHideModal();
      this.handleGetAll();
    }
  };

  handleGoUpdate = ({
    id,
    subjectDictCode,
    phaseDictCode,
    badAdvise,
    middleAdvise,
    goodAdvise,
    tagName,
    tagDesc
  }) => {
    this.handleSetFromData({
      subjectDictCode,
      phaseDictCode,
      badAdvise,
      middleAdvise,
      goodAdvise,
      name: tagName,
      tagDesc
    });
    this.setState({ visible: true });
    this.currentUpdateId = id;
  };

  handleDelete = async id => {
    this.setState({ loading: true });
    const success = await deleteThinkTag(id);
    if (success) {
      this.handleGetAll();
    } else {
      this.setState({ loading: false });
    }
  };

  // 表单数据发生变化
  handleSetFromData = (values = {}) => {
    const {
      subjectDictCode,
      phaseDictCode,
      badAdvise,
      middleAdvise,
      goodAdvise,
      name,
      tagDesc,
    } = values;
    let fromData = this.state.fromData;
    if (subjectDictCode && phaseDictCode) {  // 切换学科查询时
      if (subjectDictCode !== this.prevSubjectCode) {
        this.prevSubjectCode = subjectDictCode;
        const phaseList = this.handleGetPhase(subjectDictCode);
        fromData = fromData
          .set('subjectDictCode', subjectDictCode)
          .set('phaseDictCode', phaseDictCode)
          .set('phaseList', phaseList);
      }
    } else if (subjectDictCode && !phaseDictCode) {
      if (subjectDictCode !== this.prevSubjectCode) {
        this.prevSubjectCode = subjectDictCode;
        const phaseList = this.handleGetPhase(subjectDictCode);
        const newGradeId = phaseList.getIn([0, 'id']) || '';
        fromData = fromData
          .set('subjectDictCode', subjectDictCode)
          .set('phaseDictCode', newGradeId)
          .set('phaseList', phaseList);
      }
    }
    if (phaseDictCode) {
      fromData = fromData.set('phaseDictCode', phaseDictCode);
    }
    if (badAdvise || badAdvise === '') {
      fromData = fromData.set('badAdvise', badAdvise);
    }
    if (middleAdvise || middleAdvise === '') {
      fromData = fromData.set('middleAdvise', middleAdvise);
    }
    if (goodAdvise || goodAdvise === '') {
      fromData = fromData.set('goodAdvise', goodAdvise);
    }
    if (name || name === '') {
      fromData = fromData.set('tagName', name);
    }
    if (tagDesc || tagDesc === '') {
      fromData = fromData.set('tagDesc', tagDesc);
    }
    this.setState({ fromData });
  };

  // === 顶部筛选条件发生变化 Start ===
  handleSubjectChange = value => {
    this.setState({ subjectDictCode: value }, async () => {
      await this.handleSetPhase();
      this.handleGetAll();
    });
  };

  handlePhaseChange = value => {
    this.setState({ phaseDictCode: value }, () => {
      this.handleGetAll();
    });
  };

  handleTagNameChange = value => {
    this.setState({ tagName: value });
  };
  // === 顶部筛选条件发生变化 End ===

  handlePageChange = (pageIndex) => {
    this.setState({ pageIndex }, () => {
      this.handleGetAll();
    });
  }

  // 新建时重置表单数据
  handleResetFromData = () => {
    const { subjectList, phaseDictCode, subjectDictCode } = this.state;
    const newSubjectDictCode = subjectDictCode || subjectList.getIn([0, 'id']);
    const phaseList = this.handleGetPhase(newSubjectDictCode);
    const newPhaseDictCode = phaseDictCode || phaseList.getIn([0, 'id']) || '';
    // fromData.phaseList = phaseList;
    // this.setState({ fromData: fromData.set('phaseList', phaseList) });
    this.handleSetFromData({
      subjectDictCode: newSubjectDictCode,
      phaseDictCode: newPhaseDictCode,
      badAdvise: '',
      middleAdvise: '',
      goodAdvise: '',
      name: '',
      tagDesc: '',
    });
  };

  // 点击新增课程按钮
  handleClickNew = () => {
    this.currentUpdateId = void 0;
    this.handleResetFromData();
    this.setState({ visible: true });
  };

  // 隐藏 Modal
  handleHideModal = () => {
    this.setState({ visible: false });
  };

  render() {
    const {
      thinkTagList,
      subjectList,
      phaseList,
      subjectDictCode,
      phaseDictCode,
      tagName,
      pageSize,
      pageIndex,
      total,
      visible,
      loading,
      modalLoading,
      fromData
    } = this.state;

    const list = [
      {
        label: '学科',
        value: subjectDictCode,
        type: 'select',
        placeholder: '请选择学科',
        list: subjectList.toJS(),
        method: this.handleSubjectChange
      },
      {
        label: '学段',
        value: phaseDictCode,
        type: 'select',
        placeholder: '请选择学段',
        list: phaseList.toJS(),
        method: this.handlePhaseChange
      },
      {
        label: '名称',
        value: tagName,
        type: 'input',
        placeholder: '请输入思维标签名称',
        list: phaseList.toJS(),
        method: this.handleTagNameChange
      },
      {
        label: '查询',
        type: 'button',
        buttonType: 'primary',
        method: this.handleGetAll
      },
      {
        label: '新增思维标签',
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
            thinkTagList={thinkTagList}
            loading={loading}
            pageSize={pageSize}
            pageIndex={pageIndex}
            total={total}
            onPageChange={this.handlePageChange}
          />
        </ManagementLayout>
        {visible && <ModalForm
          onCancel={this.handleHideModal}
          onSave={this.handleCreate}
          onValuesChange={this.handleSetFromData}
          visible={visible}
          loading={modalLoading}
          subjectList={subjectList}
          handleGetPhase={this.handleGetPhase}
          phaseList={fromData.get('phaseList')}
          subjectDictCode={fromData.get('subjectDictCode')}
          phaseDictCode={fromData.get('phaseDictCode')}
          badAdvise={fromData.get('badAdvise')}
          middleAdvise={fromData.get('middleAdvise')}
          goodAdvise={fromData.get('goodAdvise')}
          name={fromData.get('tagName')}
          tagDesc={fromData.get('tagDesc')}
        />}
      </div>
    );
  }
}
