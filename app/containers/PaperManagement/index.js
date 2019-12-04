/* eslint-disable no-undefined */
/*
 *
 * PaperManagement
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { createStructuredSelector } from 'reselect';
import {
  Form, Select, Input, Button, Table,
  Popconfirm, Radio, message, DatePicker,
  Icon, Modal, BackTop, Checkbox
} from 'antd';
import Immutable, { fromJS } from 'immutable';
import styled from 'styled-components';
import { browserHistory } from 'react-router';
// import request, { postjsontokenoptions } from 'utils/request';
import {
  setGrade, setSubject,
  setPaperProperty, searchPaper,
  removeOnePaper, setTableState,
  getSelectMsgAction, setAreaList,
  initProperty,
  queryNodesAction,
  updateOnlineFlag,
  getPaperType,
  getPaperPurpose,
  getPaperTarget,
  getEpBu,
  setPaperMsgAction,
  setSelectedRowKeys,
} from './actions';
import makeSelectPaperManagement, {
  makeSelectGrade, makeSelectSubject,
  makeSelectPaperProperty, makeSelectTableState,
  makeSelectPaperList, makeSelectTotalPapers,
  makeAssemblePaperMsgList,
  makeTeachingVersion,
  makeCourseSystem,
  makeAreaList,
  makeSelectPaperType,
  makePaperPurpose,
  makePaperTarget,
  makeCreatePaperMsgList,
  makeSelectedRowKeys
} from './selectors';
import { timestampToDate } from 'components/CommonFn';
import { AppLocalStorage } from 'utils/localStorage';
import { PaperMsgModal } from './paperMsgModal';
// import Config from '../../utils/config';
// import { getPaperFields, isFieldInclude } from 'components/PaperComponent/common';
import region from 'api/qb-cloud/region-end-point';
import util from 'api/util';
import PaperAnalysis from '../PaperAnalysis';
import gradeApi from 'api/tr-cloud/grade-endpoint';
import subjectApi from 'api/tr-cloud/subject-endpoint';
import { MaskLoading } from 'components/Loading';
import textbookEditionApi from 'api/tr-cloud/textbook-edition-endpoint';
import editionApi from 'api/tr-cloud/edition-endpoint';
import { getPaperFields } from 'utils/paperUtils';
import examPaperApi from 'api/qb-cloud/exam-paper-end-point';

const isParttime = process.env.ENV_TARGET === 'parttime';
const getPaperFieldsFn = getPaperFields(2);

const RootDiv = styled.div`
  width:100%;
  height:100%;
  background:#fff;
  overflow: auto;
  display: flex;
  flex-direction: column;
  padding: 0 25px 20px 25px;
`;
const FieldsDiv = styled.div`
  border-bottom: 1px solid #ddd;
  width: 95%;
  padding: 25px 0 10px 0;
  oneFild {
    margin-bottom: 8px;
    margin-right: 10px;
    display: inline-block;
    filedLabel {
      margin:0 5px;
      min-width: 60px;
      display: inline-block;
      text-align: right;
    }
  }
`;
const SpceButtonDiv = styled.div`
  button {
    margin: 2px 5px;
  }
`;
const QuestionResultTitle = styled.p`
  font-size: 14px;
  i {
    color: red;
    font-size: 20px;
    margin: 0 4px;
  }
`;
const SortDiv = styled.div`
  display: flex;
  align-items: center;
  .selected {
    color: #2385EE;
  }
  dd {
    margin: 0 5px;
    cursor: pointer;
  }
  b {
    color: #333333;
  }
`;
const InBlock = styled.div`
  display: inline-block;
`;
const TextButton = styled.div`
  display: inline-block;
  color: #108ee9;
  min-width: 30px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  margin-left: 20px;
  cursor: pointer;
`;
const SelectAllCheckBox = styled(Checkbox)`
    color: #108ee9;
    margin-left: 24px;
`;
const sortTypes = ['默认', '修改时间', '使用次数'];

// 返回需要显示的字段
const isFieldInclude = (typeId, key, needFields = []) => {
  if (typeId > 0) {
    return needFields.includes(key);
  } else {
    return true;
  }
};

export class PaperManagementForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      isSubmit: true,
      selectedSort: {
        name: '默认',
        sortUp: true, // 倒叙(从大到小)
      },
      showPaperMsgModal: false,
      showPaperAnalysis: false,
      paperData: {},
      phaseSubjectList: fromJS([]),
      permissionList: [],
      toPaperLoading: false, // 去往试卷详情
    };
    this.toQuestionManagement = this.toQuestionManagement.bind(this);
    this.countQuestionAmount = this.countQuestionAmount.bind(this);
    this.toMakeNewPaper = this.toMakeNewPaper.bind(this);
    this.closeMakeNewPaperModal = this.closeMakeNewPaperModal.bind(this);
    this.tableChange = this.tableChange.bind(this);
    this.renderFilterSelect = this.renderFilterSelect.bind(this);
    this.renderFilterInput = this.renderFilterInput.bind(this);
  }

  async componentDidMount() {
    const { dispatch, tableState } = this.props;
    dispatch(setTableState(tableState.set('loading', true)));
    dispatch(getPaperType());
    dispatch(getSelectMsgAction());
    dispatch(getPaperPurpose()); // 获取测评用途
    dispatch(getPaperTarget()); // 获取测评目标
    dispatch(getEpBu()); // 获取适用BU
    dispatch(searchPaper());
    dispatch(queryNodesAction());
    // document.addEventListener('keyup', this.searchDataWithKeyboard);
    this.getProvince();
    const grade = await gradeApi.getGrade();
    const subject = await subjectApi.getAllSubject();
    if (grade.code === '0') {
      dispatch(setGrade(fromJS(grade.data)));
    }
    if (subject.code === '0') {
      dispatch(setSubject(fromJS(subject.data)));
    }
    // 判断老师角色和学科权限 兼职人员要做特殊处理
    const userInfo = AppLocalStorage.getUserInfo();
    const isPartTimePersion = userInfo.typeList.indexOf(2) > -1;
    if (isPartTimePersion) {
      this.setState({
        phaseSubjectList: fromJS(userInfo.phaseSubjectList),
        isPartTimePersion,
      });
    }
    this.setState({
      permissionList: userInfo.permissionList,
    });
  }

  backPaperType = (paperType, typeId) => {
    const res = paperType.toJS().find((item) => _.toString(item.id) === _.toString(typeId)) || { name: '' };
    return res.name;
  };

  getProvince = () => {
    const { dispatch } = this.props;
    const provinceFetch = {
      fetch: region.getProvince,
      cb: (data) => {
        data.unshift({ id: 0, name: '全国' });
        dispatch(setAreaList('province', fromJS(data)));
      },
      name: '省份',
    };
    util.fetchData(provinceFetch);
  }

  handleTypeChange() {
    const { dispatch, paperProperty, tableState } = this.props;
    const changeStatus = !paperProperty.get('submitFlag');
    dispatch(setPaperProperty('submitFlag', changeStatus));
    dispatch(setTableState(tableState.set('loading', true)));
    dispatch(searchPaper());
  }

  showToPaperLoading = (toPaperLoading) => {
    this.setState({
      toPaperLoading,
    });
  }

  toQuestionManagement(bool, item) {
    const { paperProperty } = this.props;
    this.showToPaperLoading(true);
    // const reqUrl = `http://192.168.8.88:8080/api/examPaper/action/findExamPaperContentOutputDTOList`;
    // const reqUrl = `${Config.zmcqLink}/api/examPaper/action/findExamPaperContentOutputDTOList`;
    // 删除之前的paperData
    localStorage.removeItem('paperData');
    // request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: String(item.id) }))
    examPaperApi.getEditPaper(String(item.id))
      .then(res => {
        if (_.toNumber(res.code) === 0) {
          item.examPaperContentOutputDTOList = res.data;
          AppLocalStorage.setPaperData({
            editMode: bool ? 'edit' : 'preview',
            paperContent: item,
            isPublish: paperProperty.get('submitFlag'),
          });
          browserHistory.push({
            pathname: isParttime ? '/parttime/questionmanagement' : '/tr/questionfor1v1',
            state: {
              groupPaper: true,
            }
          });
        } else {
          this.showToPaperLoading(false);
          message.error('查询失败');
        }
      })
      .catch(error => {
        this.showToPaperLoading(false);
        message.error(`接口异常${error}，请稍后再试`);
      });
  }

  toMakeNewPaper() {
    const { createPaperMsgList, teachingVersion, courseSystem } = this.props;
    // console.log('下一步', AssemblePaperMsgList.toJS(), teachingVersion.toJS(), courseSystem.toJS());
    this.closeMakeNewPaperModal();
    localStorage.removeItem('paperData');
    AppLocalStorage.setPaperData({
      data: createPaperMsgList.map((it) => {
        return it.delete('data').delete('flag');
      }).push({ type: 'versionValue', value: teachingVersion.get('versionValue') })
        .push({ type: 'systemValue', value: courseSystem.get('systemValue') })
        .push({ type: 'editionId', value: courseSystem.get('selectedId') })
        .push({ type: 'editionName', value: courseSystem.get('editionName') })
        .push({ type: 'teachingEditionId', value: teachingVersion.get('selectedId') })
        .push({ type: 'showSystemList', value: courseSystem.get('showSystemList') })
        .push({ type: 'teachingEditionName', value: teachingVersion.get('teachingEditionName') }).toJS(),
    });
    browserHistory.push({
      pathname: isParttime ? '/parttime/questionmanagement' : '/tr/questionfor1v1',
      state: {
        groupPaper: true,
      }
    });
  }

  closeMakeNewPaperModal() {
    this.setState({ showPaperMsgModal: false });
  }

  countQuestionAmount(item) {
    return item.examPaperContentOutputDTOList.reduce((total, item) => {
      return total + item.entryExamPaperQuesInputDTOList ? item.entryExamPaperQuesInputDTOList.length : 0;
    }, 0);
  }

  tableChange(pagination) {
    const { current, pageSize } = pagination;
    const { dispatch, tableState } = this.props;
    const { selectedSort } = this.state;
    dispatch(setTableState(tableState.set('pageSize', pageSize).set('pageIndex', current).set('loading', true)));
    dispatch(searchPaper(selectedSort));
  }

  handleClickPaperAnalysis(data) {
    this.setState({
      showPaperAnalysis: true,
      paperData: data
    });
  }

  // 获取教材版本和课程内容
  getCourseAndTeaching = ({ subjectId = '', gradeId = '', phaseId = '' }) => {
    const { dispatch } = this.props;
    textbookEditionApi.getTextbookEdition({ subjectId, gradeId, phaseId }).then(res => {
      if (Number(res.code) === 0) {
        dispatch(setPaperMsgAction('teachingEditionId', fromJS(res.data || [])));
      } else {
        message.error(res.message || '获取教材版本失败');
      }
    });
    editionApi.getEdition({ subjectId, gradeId, phaseId }).then(res => {
      if (Number(res.code) === 0) {
        dispatch(setPaperMsgAction('editionId', fromJS(res.data || [])));
      } else {
        message.error(res.message || '获取课程内容失败');
      }
    });
  }

  // 清空教材版本和课程内容
  clearCourseAndTeaching = () => {
    const { dispatch } = this.props;
    dispatch(setPaperMsgAction('teachingEditionId', fromJS([])));
    dispatch(setPaperMsgAction('editionId', fromJS([])));
  }

  resetProperty = () => {
    const { dispatch } = this.props;
    dispatch(initProperty());
    // 清空教材版本 课程内容
    dispatch(setPaperMsgAction('teachingEditionId', fromJS([])));
    dispatch(setPaperMsgAction('editionId', fromJS([])));
  }

  selectChange(key, val) {
    const { dispatch, paperProperty } = this.props;
    if (key === 'provinceId') {
      // 清空市区
      dispatch(setPaperProperty('cityId', undefined));
      dispatch(setPaperProperty('countyId', undefined));
      // 获取市 清空区data
      dispatch(setAreaList('city', fromJS([])));
      dispatch(setAreaList('county', fromJS([])));
      if (val) {
        const cityFetch = {
          fetch: region.getCityByProvinceId,
          params: val,
          cb: (data) => {
            dispatch(setAreaList('city', fromJS(data)));
          },
          name: '城市',
        };
        util.fetchData(cityFetch);
      }
    }
    if (key === 'cityId') {
      // 清空区
      dispatch(setPaperProperty('countyId', undefined));
      // 获取区
      dispatch(setAreaList('county', fromJS([])));
      if (val) {
        const countyFetch = {
          fetch: region.getCountyByCityId,
          params: val,
          cb: (data) => {
            dispatch(setAreaList('county', fromJS(data)));
          },
          name: '地区',
        };
        util.fetchData(countyFetch);
      }
    }
    if (key === 'typeId') {
      this.resetProperty();
    }
    if (key === 'kemu') {
      const { phaseSubjectList } = this.state;
      const item = phaseSubjectList.find(e => _.toString(e.get('id')) === _.toString(val));
      if (item) {
        const subjectId = item.get('subjectId');
        const phaseId = item.get('phaseId');
        dispatch(setPaperProperty('subjectId', subjectId));
        dispatch(setPaperProperty('phaseId', phaseId));
        /**
         * 只有年级学科改变并且都有值才获取教材版本 课程内容
         */
        this.getCourseAndTeaching({ subjectId, gradeId: '', phaseId });
      } else {
        dispatch(setPaperProperty('subjectId', ''));
        dispatch(setPaperProperty('phaseId', ''));
        // 清空教材版本 课程内容
        this.clearCourseAndTeaching();
      }
    }
    /**
     * 只有年级学科改变并且都有值才获取教材版本 课程内容
     */
    const subjectId = paperProperty.get('subjectId');
    const gradeId = paperProperty.get('gradeId');
    if (key === 'gradeId' && subjectId) {
      if (val) {
        this.getCourseAndTeaching({ subjectId, gradeId: val });
      } else {
        // 清空
        this.clearCourseAndTeaching();
      }
    } else if (key === 'subjectId' && gradeId) {
      if (val) {
        this.getCourseAndTeaching({ subjectId: val, gradeId });
      } else {
        // 清空
        this.clearCourseAndTeaching();
      }
    }

    // 重选年级学科重置所选的教材版本 课程内容
    if (key === 'gradeId' || key === 'subjectId') {
      dispatch(setPaperProperty('teachingEditionId', undefined));
      dispatch(setPaperProperty('editionId', undefined));
    }

    dispatch(setPaperProperty(key, val));
  }

  renderFilterSelect({ needRender, key, name, data, style, msg, idKey, nameKey, placeholder }) {
    const { paperProperty } = this.props;
    return (
      <oneFild style={style ? style : needRender(key) ? {} : { display: 'none' }}>
        <filedLabel>{name}：</filedLabel>
        <Select
          style={{ width: 150 }}
          placeholder={placeholder || `请选择${name}`}
          allowClear
          value={paperProperty.get(key)}
          onChange={(val) => this.selectChange(key, val)}
        >
          {data.map(item => <Select.Option key={item[idKey ? idKey : 'id']} value={String(item[idKey ? idKey : 'id'])}>{item[nameKey ? nameKey : 'name']}</Select.Option>)}
        </Select>
        {msg}
      </oneFild>
    );
  }

  renderFilterInput(needRender, key, name, placeholder) {
    const { dispatch, paperProperty } = this.props;
    return (
      <oneFild style={needRender ? needRender(key) ? {} : { display: 'none' } : {}}>
        <filedLabel>{name}：</filedLabel>
        <Input
          style={{ width: 150 }}
          placeholder={placeholder || `请输入${name}`}
          suffix={paperProperty.get(key) ? <Icon type="close-circle" onClick={(e) => dispatch(setPaperProperty(key, ''))} /> : null}
          value={paperProperty.get(key)}
          onChange={(val) => {
            dispatch(setPaperProperty(key, val.target.value));
          }}
        />
      </oneFild>
    );
  }

  hasOperatePermission = (item) => {
    const { phaseSubjectList, isPartTimePersion } = this.state;
    if (!isPartTimePersion) { // 不是兼职人员都有权限
      return true;
    }
    const { phaseId, subjectId } = item;
    return phaseSubjectList.toJS().some(e => e.phaseId === phaseId && e.subjectId === subjectId);
  }

  updateOnlineFlag = (flag, examPaperId) => {
    const { dispatch } = this.props;
    dispatch(updateOnlineFlag({ flag, examPaperId }));
  }
  // 表格行选中事件
  onSelectRowChange = (selectedRowKeys) => {
    const { dispatch } = this.props;
    dispatch(setSelectedRowKeys(selectedRowKeys));
  }
  // 自定义全选事件(checkbox)
  selectAllRows = (e) => {
    const { paperList, dispatch } = this.props;
    let checked = e.target.checked;
    if (checked) {
      let selectedRowKeys = paperList.toJS().map((item, index) => index);
      dispatch(setSelectedRowKeys(selectedRowKeys));
    } else {
      dispatch(setSelectedRowKeys([]));
    }
  }
  // 批量上下架事件
  batchShelves=(status) => {
    const { paperList, selectedRowKeys, dispatch } = this.props;
    if (selectedRowKeys.length === 0) {
      message.warning('未选择任何试卷');
      return;
    }
    let idList = selectedRowKeys.map(i => {
      return paperList.toJS()[i].id;
    });
    if (status === 1) {
      // 上架
      batchOnOffLine('paperBatchOnline', idList);
    } else {
      // 下架
      batchOnOffLine('paperBatchOffline', idList);
    }
    function batchOnOffLine(api, idList) {
      examPaperApi[api](idList).then(res => {
        if (res.code === '0') {
          message.success(`批量${api === 'paperBatchOnline' ? '上架' : '下架'}成功`);
          dispatch(searchPaper());
        } else {
          message.warning(`${res.message}`);
        }
      }).catch(err => {
        message.warning('操作失败');
        console.error(err);
      });
    }
  }
  handlePaperErr = (examPaperId) => {
    console.log('examPaperId', examPaperId);
    browserHistory.push({
      pathname: '/tr/1v1/errorcorrectmanagement',
      state: {
        examPaperId
      }
    });
  }
  render() {
    const {
      dispatch, grade, subject, paperProperty,
      tableState, paperList, totalPapers,
      AssemblePaperMsgList, teachingVersion,
      courseSystem, areaList, paperType, createPaperMsgList, selectedRowKeys
    } = this.props;
    const { showPaperMsgModal, showPaperAnalysis, paperData, isPartTimePersion,
      phaseSubjectList, permissionList, toPaperLoading } = this.state;
    const paperDataList = paperList.toJS().map((item, index) => {
      return {
        key: index,
        epName: item.name,
        // type: item.typeId == 0 ? '预习作业' : '课后作业',
        courseContentName: item.courseContentName,
        teachingEditionName: item.examPaperTextbook ? item.examPaperTextbook.teachingEditionName : '',
        type: this.backPaperType(paperType, item.typeId),
        number: item.questionAmount || 0,
        useNum: item.quoteCount || 0,
        creteBy: item.createUserName,
        // createTime: timestampToDate(item.createdTime),
        updateTime: timestampToDate(item.updatedTime),
        operate: item,
        onlineFlag: item.onlineFlag,
      };
    });
    const getItem = (name, key) => {
      return {
        title: name,
        dataIndex: key,
        render: val => val || '-',
        width: 150
      };
    };
    const onlineFlagColumns = {
      title: '上架状态',
      dataIndex: 'onlineFlag',
      render: (val) => (Number(val) === 1 ? '编辑中' : Number(val) === 2 ? '已上架' : '-'),
      width: 150,
    };
    const columns = [
      getItem('试卷名称', 'epName'),
      getItem('课程内容', 'courseContentName'),
      getItem('教材版本', 'teachingEditionName'),
      getItem('试卷类型', 'type'),
      getItem('题目数量', 'number'),
      getItem('使用数量', 'useNum'),
      getItem('创建人', 'creteBy'),
      getItem('最后修改日期', 'updateTime'),
      {
        title: '操作',
        dataIndex: 'operate',
        render: (item) => {
          return this.hasOperatePermission(item) ? (
            <SpceButtonDiv>
              {paperProperty.get('submitFlag') ? <Button type="primary" onClick={() => this.toQuestionManagement(false, item)}>预览</Button> : ''}
              <Button type="primary" onClick={this.handleClickPaperAnalysis.bind(this, item)}>试卷分析</Button>
              <Button type="primary" onClick={() => this.toQuestionManagement(true, item)}>编辑</Button>
              {paperProperty.get('submitFlag')
                ? <Button type="primary" onClick={() => this.updateOnlineFlag(Number(item.onlineFlag) === 2, item.id, item)}>
                  {Number(item.onlineFlag) === 2 ? '下架' : '上架'}
                </Button>
                : ''}
              <Button type="primary" onClick={() => this.handlePaperErr(item.id)}>纠错信息</Button>
              {permissionList.indexOf('delete_exam_paper') > -1 ? <Popconfirm placement="topLeft" title={'是否确认删除'} onConfirm={() => dispatch(removeOnePaper(item))} okText="是" cancelText="否">
                <Button type="danger">删除</Button>
              </Popconfirm> : null}
            </SpceButtonDiv>
          ) : <strong>当前权限不可操作</strong>;
        },
        width: '25%',
      }
    ];
    // 已发布试卷 添加上下架状态
    if (paperProperty.get('submitFlag')) {
      columns.splice(5, 0, onlineFlagColumns);
    }
    // 根据不同的试卷类型动态加载筛选字段
    const typeId = paperProperty.get('typeId');
    const needFields = getPaperFieldsFn(typeId, paperType.toJS(), 'extra');
    const needRender = (key) => isFieldInclude(typeId, key, needFields);

    // 拿到数据字典 start
    const termData = AssemblePaperMsgList.find(item => item.get('type') === 'termId').get('data').toJS();
    const examTypeData = AssemblePaperMsgList.find(item => item.get('type') === 'examTypeId').get('data').toJS();
    const businessCardData = AssemblePaperMsgList.find(item => item.get('type') === 'businessCardId').get('data').toJS();
    const yearList = AssemblePaperMsgList.find(item => item.get('type') === 'year').get('data').toJS();
    const paperPurpose = AssemblePaperMsgList.find(item => item.get('type') === 'evaluationPurpose').get('data').toJS();
    const paperTarget = AssemblePaperMsgList.find(item => item.get('type') === 'evaluationTarget').get('data').toJS();
    const epBu = AssemblePaperMsgList.find(item => item.get('type') === 'epBu').get('data').toJS();
    const sourceList = AssemblePaperMsgList.find((item) => item.get('type') === 'source').get('data').toJS();
    const edition = AssemblePaperMsgList.find((item) => item.get('type') === 'editionId').get('data').toJS();
    const teachingEdition = AssemblePaperMsgList.find((item) => item.get('type') === 'teachingEditionId').get('data').toJS();
    const difficultyList = AssemblePaperMsgList.find((item) => item.get('type') === 'difficulty').get('data').toJS();
    const purposeList = AssemblePaperMsgList.find((item) => item.get('type') === 'purpose').get('data').toJS();
    const onlineFlagTypes = AssemblePaperMsgList.find((item) => item.get('type') === 'onlineFlag').get('data').toJS();
    // 拿到数据字典 end

    const gradeId = paperProperty.get('gradeId');
    const subjectId = paperProperty.get('subjectId');
    // 年级学科是否都选
    const isGradeAndSubjectSelected = gradeId > 0 && subjectId > 0;
    // 兼职人员展示的不同
    const renderGradeAndSubject = () => (
      isPartTimePersion ? (
        <oneFild>
          <filedLabel>科目：</filedLabel>
          <Select
            style={{ width: 150 }}
            placeholder="请选择科目"
            allowClear
            value={paperProperty.get('kemu')}
            onChange={(val) => this.selectChange('kemu', val)}
          >
            {phaseSubjectList.toJS().map(item => <Select.Option key={item.id} value={String(item.id)}>{item.name}</Select.Option>)}
          </Select>
        </oneFild>
      ) : ([<InBlock key="gradeId">{this.renderFilterSelect({ needRender, key: 'gradeId', name: '年级', data: grade.toJS() })}</InBlock>,
        <InBlock key="subjectId">{this.renderFilterSelect({ needRender, key: 'subjectId', name: '学科', data: subject.toJS() })}</InBlock>])
    );
    // 列表勾选配置
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectRowChange,
      hideDefaultSelections: true
    };
    return (
      <div style={{ overflow: 'auto' }}>
        <BackTop target={() => document.getElementById('paperManagement') || window} />
        {toPaperLoading ? <MaskLoading text="加载试卷中..." /> : null}
        <RootDiv id="paperManagement">
          <FieldsDiv>
            {this.renderFilterSelect({ needRender, key: 'source', name: '试卷来源', data: sourceList })}
            {this.renderFilterSelect({ needRender, key: 'typeId', name: '试卷类型', data: paperType.toJS(), style: { display: 'block' }, msg: <span style={{ color: '#ccc', margin: '0 15px' }}>(筛选字段将根据不同的试卷类型有所变动)</span> })}
            {renderGradeAndSubject()}
            {this.renderFilterSelect({ needRender, key: 'difficulty', name: '试卷难度', data: difficultyList })}
            {this.renderFilterSelect({ needRender, key: 'year', name: '年份', data: yearList })}
            {this.renderFilterSelect({ needRender, key: 'purpose', name: '用途', data: purposeList })}
            {this.renderFilterSelect({ needRender, key: 'termId', name: '学期', data: termData })}
            {this.renderFilterSelect({ needRender, key: 'examTypeId', name: '卷型', data: examTypeData })}
            {this.renderFilterSelect({ needRender, key: 'businessCardId', name: '试卷名片', data: businessCardData })}
            {paperProperty.get('submitFlag') &&
              <oneFild>
                <filedLabel>上架状态：</filedLabel>
                <Select
                  style={{ width: 150 }}
                  placeholder="请选择上架状态"
                  allowClear
                  value={paperProperty.get('onlineFlag')}
                  onChange={(val) => this.selectChange('onlineFlag', val)}
                >
                  {onlineFlagTypes.map(item => <Select.Option key={item.id} value={String(item.id)}>{item.name}</Select.Option>)}
                </Select>
              </oneFild>
            }
            {this.renderFilterSelect({ needRender, key: 'provinceId', name: '省份', data: areaList.get('province').toJS() })}
            {this.renderFilterSelect({ needRender, key: 'cityId', name: '城市', data: areaList.get('city').toJS() })}
            {this.renderFilterSelect({ needRender, key: 'countyId', name: '地区', data: areaList.get('county').toJS() })}
            {this.renderFilterSelect({ needRender, key: 'evaluationTarget', name: '测评对象', data: paperTarget })}
            {this.renderFilterSelect({ needRender, key: 'evaluationPurpose', name: '测评用途', data: paperPurpose })}
            {this.renderFilterSelect({ needRender, key: 'epBu', name: '适用BU', data: epBu })}
            {this.renderFilterInput('', 'name', '试卷名称')}
            {this.renderFilterSelect({ needRender, key: 'teachingEditionId', name: '教材版本', data: teachingEdition, placeholder: isGradeAndSubjectSelected ? '' : '需先选择年级学科' })}
            {this.renderFilterSelect({ needRender, key: 'editionId', name: '课程内容版本', data: edition, placeholder: isGradeAndSubjectSelected ? '' : '需先选择年级学科' })}
            <div style={{ display: 'inline-block' }}>
              <oneFild style={{ marginRight: 0 }}>
                <filedLabel>入库时间：</filedLabel>
                <DatePicker placeholder="请选择开始时间" style={{ width: 183 }} size="default" format="YYYY/MM/DD" onChange={(date) => { dispatch(setPaperProperty('startDate', date)) }} />
              </oneFild>
              <oneFild>
                <span style={{ margin: '0 5px' }}>-</span>
                <DatePicker placeholder="请选择结束时间" style={{ width: 183 }} size="default" format="YYYY/MM/DD" onChange={(date) => { dispatch(setPaperProperty('endDate', date)) }} />
              </oneFild>
            </div>
            <oneFild>
              <Button style={{ margin: '0 10px' }} type="dashed" onClick={this.resetProperty}>重置</Button>
              <Button
                style={{ margin: '0 10px' }}
                type="primary"
                icon="search"
                onClick={() => {
                  dispatch(setTableState(tableState.set('loading', true)));
                  dispatch(searchPaper());
                }}
              >
                查询
              </Button>
              <Button type="primary" ghost onClick={() => this.setState({ showPaperMsgModal: true })}>新增试卷</Button>
            </oneFild>
          </FieldsDiv>
          <div style={{ margin: ' 10px 0 0 0', display: 'flex', minHeight: 30 }}>
            <div style={{ flex: 1 }}>
              <Radio.Group onChange={this.handleTypeChange.bind(this)} value={paperProperty.get('submitFlag')} style={{ marginBottom: 8 }}>
                <Radio value style={{ marginRight: 10 }}>已发布试卷</Radio>
                <Radio value={false} style={{ marginRight: 10 }}>草稿箱</Radio>
              </Radio.Group>
            </div>
            <SortDiv><b>排序方式：</b>
              {sortTypes.map(it => <dd
                className={this.state.selectedSort.name === it ? 'selected' : ''}
                key={it}
                onClick={() => {
                  let sort = {
                    name: it,
                    sortUp: !this.state.selectedSort.sortUp,
                  };
                  if (it === '默认') {
                    sort.sortUp = true;
                  }
                  this.setState({
                    selectedSort: sort
                  });
                  dispatch(setTableState(tableState.set('loading', true)));
                  dispatch(searchPaper(sort));
                }}
              >
                {it + (this.state.selectedSort.name !== '默认' && this.state.selectedSort.name === it ? (this.state.selectedSort.sortUp ? '↓' : '↑') : '')}
              </dd>)}
            </SortDiv>
          </div>
          <div className="table" style={{ flex: 1, backgroundColor: '#fff', padding: 10 }}>
            <QuestionResultTitle>共有符合条件的试卷<i>{totalPapers}</i>套</QuestionResultTitle>
            <div>
              <SelectAllCheckBox onChange={this.selectAllRows}  checked={paperDataList.length === selectedRowKeys.length}>全选</SelectAllCheckBox>
              <TextButton onClick={() => { this.batchShelves(1) }}>上架</TextButton><TextButton onClick={() => { this.batchShelves(0) }}>下架</TextButton>
            </div>
            <Table
              columns={columns}
              dataSource={paperDataList}
              loading={tableState.get('loading')}
              // scroll={{ y: 410 }}
              pagination={{
                style: { float: 'left' },
                current: tableState.get('pageIndex'),
                pageSize: tableState.get('pageSize'),
                total: totalPapers,
                showQuickJumper: true,
                showSizeChanger: true
              }}
              onChange={this.tableChange}
              rowSelection={rowSelection}
            />
          </div>
          {showPaperMsgModal ? <PaperMsgModal
            visible={showPaperMsgModal}
            onCancel={this.closeMakeNewPaperModal}
            onOk={this.toMakeNewPaper}
            data={createPaperMsgList}
            dispatch={dispatch}
            teachingVersion={teachingVersion}
            courseSystem={courseSystem}
          ></PaperMsgModal> : ''}
          {showPaperAnalysis ?
            <Modal
              onCancel={() => this.setState({ showPaperAnalysis: false })}
              footer={null}
              closable={false}
              style={{ minWidth: 900 }}
              bodyStyle={{ maxHeight: '750px', overflowY: 'auto', position: 'relative' }}
              visible={showPaperAnalysis}
            >
              <PaperAnalysis
                onClose={() => this.setState({ showPaperAnalysis: false })}
                paperId={paperData.id}
                paperName={paperData.name}
              />
            </Modal> : ''}
        </RootDiv>
      </div>
    );
  }
}

const PaperManagement = Form.create()(PaperManagementForm);

PaperManagement.propTypes = {
  dispatch: PropTypes.func.isRequired,
  AssemblePaperMsgList: PropTypes.instanceOf(Immutable.List).isRequired,
};

const mapStateToProps = createStructuredSelector({
  PaperManagement: makeSelectPaperManagement(),
  paperType: makeSelectPaperType(),
  grade: makeSelectGrade(),
  subject: makeSelectSubject(),
  paperProperty: makeSelectPaperProperty(),
  tableState: makeSelectTableState(),
  paperList: makeSelectPaperList(),
  totalPapers: makeSelectTotalPapers(),
  AssemblePaperMsgList: makeAssemblePaperMsgList(),
  teachingVersion: makeTeachingVersion(),
  courseSystem: makeCourseSystem(),
  areaList: makeAreaList(),
  paperTarget: makePaperTarget(),
  paperPurpose: makePaperPurpose(),
  createPaperMsgList: makeCreatePaperMsgList(),
  selectedRowKeys: makeSelectedRowKeys()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaperManagement);
