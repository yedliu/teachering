/* eslint-disable no-undefined */
/*
 *
 * ExamPoint
 *
 */

import React, { PropTypes } from 'react';
import Immutable, { fromJS } from 'immutable';
import moment from 'moment';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Tag,
  Icon,
  Modal,
  Switch,
  Table,
  message,
} from 'antd';
import { Config } from 'utils/config';
import AppLocalStorage from 'utils/localStorage';
import { PlaceHolderBox } from 'components/CommonFn/style';
import {
  filterHtmlForm,
  downloadFile,
  numberToChinese,
  toNumber,
} from 'components/CommonFn';
import ShowQuestionItem from 'components/ShowQuestionItem';
import {
  setBackAlertStatesAction,
  changeBackPromptAlertShowAction,
} from 'containers/LeftNavC/actions';
import LoadingIndicator from 'components/LoadingIndicator';
import PaperQuestionList from 'components/PaperQuestionList';
import PaperComponent from 'components/PaperComponent';
import {
  makeSelectphaseSubjectList,
  makeSelectphaseSubject,
  makeSelectGradeList,
  makeSelectTermList,
  makeSelectAreaList,
  makeSelectYearList,
  makeSelectStatusList,
  makeSelectSelected,
  makeSelectInputDto,
  makeSelectUIStatus,
  makeSelectFormTerm,
  makeSelectFormGrade,
  makeSelectProvice,
  makeSelectAreaAddList,
  makeSelectTableState,
  makeSelectTableData,
  makeSelectEditModal,
  makeSelectEditionList,
  makeNotIssue,
  makeShowPaperMsg,
  makeSelectOperatorModalVisible,
  makeSelectOperators,
  makeSelectForcedReleaseModalVisible,
  makePaperNameForSearch,
  makeShowSamePaper,
  makeSamePaperList,
  makeExamTypeList,
  makeForceSaving,
  makeBusinessCardList,
  makeSelectPaperType,
  makePaperPurpose,
  makePaperTarget,
  makeExamPaperSourceList,
} from './selectors';
import {
  setSelected,
  setUIStatus,
  getPhaseSubjectListAction,
  setPhaseSubjectAction,
  getTermListAction,
  getDataAction,
  setInputDtoAction,
  getFormGradeList,
  getGradeListAction,
  addNewPaperAction,
  getCityListAction,
  getCountyListAction,
  getProvinceIdAction,
  getCountyListAddAction,
  getCityListAddAction,
  setTableState,
  setToggleEditModal,
  setEditPaperId,
  submitModifyPaper,
  deletePaperAction,
  getEditionAction,
  setAreaListAction,
  setAreaListAddAction,
  changeNotIssueAction,
  changeWashStatAction,
  setShowPaperMsgAction,
  setOperatorModalVisibleAction,
  getOperatorsAction,
  setForcedReleaseModalAction,
  forcedReleaseAction,
  changePaperForSearch,
  showSamePaperAction,
  forceSaveFlagAction,
  convertToPicAction,
  queryNodesAction,
  getPaperType,
} from './actions';
import { FlexColumn, FlexRowCenter, FlexRow } from 'components/FlexBox';
import 'moment/locale/zh-cn';
import { examType, examTypeList } from 'utils/zmConfig';
import ParallelMakePaper from '../Common/ParallelMakePaper';
import { getPaperFields, getRequired } from 'utils/paperUtils';

const FormItem = Form.Item;
const Mtag = Tag.CheckableTag;

const getPaperFieldsFn = getPaperFields();
const getRequiredFn = getRequired();

moment.locale('zh-cn');
// #region 定义一些变量
const Wrapper = styled(FlexColumn)`
  flex-grow: 1;
  height: auto;
  background-color: white;
  font-size: 14px;
  overflow-x: auto;
`;
const BodyWrapper = styled(FlexColumn)`
  flex: 1;
  height: auto;
  min-width: 950px;
  padding: 20px;
  background-color: white;
`;
const FormRow = styled(FlexRow)`
  justify-content: space-between;
`;
export const ViewModal = styled.div`
  position: fixed;
  z-index: 5;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  border: 1px solid #ddd;
  background: #fefefe;
`;
export const ContentBox = styled(FlexRow)`
  width: 100%;
  height: calc(100vh - 70px);
  border: 1px solid #ddd;
  padding: 10px;
  justify-content: space-between;
`;
export const ButtonWrapper = styled(FlexRowCenter)`
  height: 50px;
`;
const OneFild = styled.div`
  margin-bottom: 8px;
  margin-right: 10px;
  display: inline-block;
  filedLabel {
    margin: 0 5px;
    min-width: 70px;
    display: inline-block;
    text-align: right;
  }
`;
const FieldsDiv = styled.div`
  border-bottom: 1px solid #ddd;
  width: 95%;
  padding: 25px 0 10px 0;
`;
const ContentCol = styled(Col)`
  text-indent: 2em;
`;
const stateName = [
  '待领取',
  '已领取',
  '待审核',
  '审核未通过',
  '切割已审核',
  '录入已领取',
  '录入待审核',
  '录入审核未通过',
  '录入已审核',
  '标注已领取',
  '标注待审核',
  '标注已审核',
  '切割审核中',
  '录入审核中',
  '贴标签审核中',
  '试卷待转化为图片',
  '试卷转化失败',
  '终审中',
  '已入库',
];
const showList = [
  [
    {
      name: '试卷名片',
      type: 'businessCardId',
      dataListType: 'businessCardList',
    },
    { name: '题目数量', type: 'questionAmount' },
    { name: '年份', type: 'year' },
  ],
  [
    { name: '学科', type: 'subjectId', dataListType: 'phaseSubjectList' },
    { name: '年级', type: 'gradeId', dataListType: 'formGrade' },
    { name: '学期', type: 'termId', dataListType: 'termList' },
  ],
  [
    { name: '版本', type: 'editionId', dataListType: 'editionList' },
    { name: '类型', type: 'typeId', dataListType: 'paperType' },
    { name: '卷型', type: 'examTypeId', dataListType: 'examTypeList' },
  ],
  [
    { name: '省份', type: 'provinceName' },
    { name: '城市', type: 'cityName' },
    { name: '县(区)', type: 'countyName' },
  ],
];
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

// 返回需要显示的字段
const isFieldInclude = (typeId, key, needFields = []) => {
  if (typeId > 0) {
    return needFields.includes(key);
  } else {
    return true;
  }
};

export class AddPaper extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.loadingPaper = this.loadingPaper.bind(this);
    this.state = {
      questionIndex: 0,
      seeMobile: false,
      teachingVersion: fromJS({
        selectedId: '',
        versionValue: null, // 最终选择的节点
        showTeachingList: [], // 显示的所有包括父节点
      }),
      courseSystem: fromJS({
        selectedId: '',
        systemValue: null, // 最终选择的节点
        showSystemList: [], // 显示的所有包括父节点
      }),
      isShowParallel: false,
      selectPaperData: {},
    };
    this.modalConfirm = this.modalConfirm.bind(this);
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getPhaseSubjectListAction());
    dispatch(getProvinceIdAction());
    dispatch(getTermListAction());
    dispatch(getGradeListAction());
    // dispatch(getFormGradeList());
    dispatch(getDataAction());
    dispatch(queryNodesAction());
    dispatch(getPaperType());
  }
  modalConfirm(teachingVersion, courseSystem) {
    this.setState({
      teachingVersion: teachingVersion
        .set('selectedId', teachingVersion.get('selectedId'))
        .set('versionValue', teachingVersion.get('versionValue'))
        .set('showTeachingList', teachingVersion.get('showTeachingList')),
      courseSystem: courseSystem
        .set('selectedId', courseSystem.get('selectedId'))
        .set('systemValue', courseSystem.get('systemValue'))
        .set('showSystemList', courseSystem.get('showSystemList')),
    });
    this.props.formChangeHandle(this.props, {
      teachingEditionName: teachingVersion.get('teachingEditionName'),
      teachingEditionId: teachingVersion.get('selectedId'),
      versionValue: teachingVersion.get('versionValue'),
      editionName: courseSystem.get('editionName'),
      editionId: courseSystem.get('selectedId'),
      systemValue: courseSystem.get('systemValue'),
    });
  }
  loadingPaper() {
    this.props.dispatch(
      setBackAlertStatesAction(
        fromJS({
          buttonsType: '0',
          title: '试卷数据获取中...',
          titleStyle: {
            fontSize: '20px',
            fontWeight: 600,
            color: '#333',
            textAlign: 'center',
          },
          setChildren: () => <LoadingIndicator style={{ marginTop: 15 }} />,
        }),
      ),
    );
    this.props.dispatch(changeBackPromptAlertShowAction(true));
  }
  // 渲染下拉筛选框
  // eslint-disable-next-line max-params
  renderFilterSelect(needRender, key, name, data, style, msg, idKey, nameKey) {
    const { selected } = this.props;
    return (
      <OneFild
        style={style ? style : needRender(key) ? {} : { display: 'none' }}
      >
        <filedLabel>{name}：</filedLabel>
        <Select
          style={{ width: 150 }}
          placeholder={`请选择${name}`}
          allowClear
          // eslint-disable-next-line no-undefined
          value={selected.get(key) || undefined}
          onChange={value => this.props.handleSelected(key, value, this.props)}
        >
          {data.map(item => (
            <Select.Option
              key={item[idKey ? idKey : 'id']}
              value={String(item[idKey ? idKey : 'id'])}
            >
              {item[nameKey ? nameKey : 'name']}
            </Select.Option>
          ))}
        </Select>
        {msg}
      </OneFild>
    );
  }
  // 显示平行组卷弹框
  showParallelModal = () => {
    const paperData = this.props.showPaperMsg.get('paperData') || fromJS({});
    if (!paperData.get('typeId')) {
      return message.warning('试卷类型缺失，请补充完后再进行组卷');
    }
    this.setState({ isShowParallel: true });
  };
  handleClose = () => {
    this.setState({ isShowParallel: false });
  };
  handleNext = data => {
    console.log(data, 'data');
    this.closePreview();
  };
  // 关闭预览
  closePreview = () => {
    let { showPaperMsg } = this.props;
    const newShowPaperMsg = showPaperMsg.set('showView', false);
    this.props.dispatch(setShowPaperMsgAction(newShowPaperMsg));
    this.setState({ questionIndex: 1 });
  };
  // 渲染输入框
  // renderFilterInput(needRender, key, name) {
  //   const { dispatch, paperProperty } = this.props;
  //   let realKey = key;
  //   if (key == 'editionId') {
  //     realKey = 'courseContentName';
  //   }
  //   return (
  //     <OneFild style={needRender ? needRender('gradeId') ? {} : { display: 'none' } : {}}>
  //       <filedLabel>{name}：</filedLabel>
  //       <Input style={{ width: 150 }}
  //         placeholder={`请输入${name}`}
  //         suffix={paperProperty.get(realKey) ? <Icon type="close-circle" onClick={(e) => dispatch(setPaperProperty(realKey, ''))} /> : null}
  //         value={paperProperty.get(realKey)}
  //         onChange={(val) => {
  //           dispatch(setPaperProperty(realKey, val.target.value))
  //         }}></Input>
  //     </OneFild>
  //   )
  // }
  // eslint-disable-next-line complexity
  render() {
    const {
      dispatch,
      showSamePaper,
      samePaperList,
      UIstatus,
      forceSaving,
      paperNameForSearch,
      paperType,
      paperPurpose,
      paperTarget,
      yearList,
      examPaperSourceList,
    } = this.props;
    /* 课程内容和教材 */
    const {
      teachingVersion,
      courseSystem,
      isShowParallel,
      selectPaperData,
    } = this.state;
    const versionValue = teachingVersion.get('versionValue');
    const showTeachingList = teachingVersion.get('showTeachingList');
    const teachingEditionId = teachingVersion.get('selectedId');

    const editionId = courseSystem.get('selectedId');
    const systemValue = courseSystem.get('systemValue');
    const showSystemList = courseSystem.get('showSystemList');
    /* 课程内容和教材 */
    let content;
    const columns = [
      {
        title: '试卷名称',
        dataIndex: 'name',
        render: val => val || '-',
        width: '17.8%',
      },
      {
        title: '试卷类型',
        dataIndex: 'typeId',
        render: val =>
        {
          return val
            ? (
                paperType
                  .toJS()
                  .find(item => `${item.itemCode}` === `${val}`) || {}
              ).name || '-'
            : '-';
        },
        width: '10%',
      },
      {
        title: '题目数量',
        dataIndex: 'questionAmount',
        render: val => val || '-',
        width: '14.8%',
      },
      {
        title: '经办人',
        dataIndex: '',
        render: (val, record, index) => {
          return (
            <a // eslint-disable-line
              onClick={() => {
                this.props.showOperatorModal(record.id);
              }}
            >
              点击查看
            </a>
          );
        },
        width: '12.3%',
      },
      {
        title: '更新时间',
        dataIndex: 'updatedTime',
        render: val => (val ? moment(val).format('YYYY/MM/DD') : '--'),
        width: '14.8%',
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: val => {
          return stateName[val] || '--';
        },
        width: '14.8%',
      },
      {
        title: '操作',
        dataIndex: '',
        render: (val, record, index) => {
          const state = record.state;
          if (state === 15 || state === 16) {
            return (
              <div>
                <Button
                  size="small"
                  type="primary"
                  style={{ marginLeft: 2 }}
                  onClick={() => this.props.convertToPic(record)}
                >
                  转化
                </Button>
                <Button
                  size="small"
                  type="danger"
                  style={{ marginLeft: 2 }}
                  onClick={() => this.props.deletePaper(record)}
                >
                  删除
                </Button>
              </div>
            );
          } else {
            return (
              <div>
                <Button
                  type="primary"
                  size="small"
                  style={{ marginLeft: 2 }}
                  onClick={() => {
                    dispatch(
                      changeWashStatAction(
                        fromJS({ state: 'before', id: record.id }),
                      ),
                    );
                    this.loadingPaper();
                    this.setState({ selectPaperData: record });
                  }}
                >
                  预览
                </Button>
                <Button
                  type="primary"
                  size="small"
                  style={{ marginLeft: 2 }}
                  onClick={() => {
                    downloadFile(
                      { fileUrl: record.fileUrl, fileName: record.name },
                      this.props.dispatch,
                    );
                  }}
                >
                  下载
                </Button>
                <Button
                  type="primary"
                  size="small"
                  style={{ marginLeft: 2 }}
                  onClick={() =>
                    this.props.editPaperInfo(
                      this.props,
                      val,
                      record,
                      this.modalConfirm,
                    )
                  }
                >
                  编辑
                </Button>
                {AppLocalStorage.getPermissions().indexOf(
                  'forced_release_exam_paper',
                ) > -1 ? (
                  <Button
                    size="small"
                    type="danger"
                    style={{ marginLeft: 2 }}
                    onClick={() => {
                      dispatch(setForcedReleaseModalAction(true));
                      dispatch(setEditPaperId(record.id));
                    }}
                  >
                    释放
                  </Button>
                ) : (
                  ''
                )}
                <Button
                  size="small"
                  type="danger"
                  style={{ marginLeft: 2 }}
                  onClick={() => this.props.deletePaper(record)}
                >
                  删除
                </Button>
              </div>
            );
          }
        },
      },
    ];
    const selected = this.props.selected.toJS();
    const tableState = this.props.tableState
      ? this.props.tableState.toJS()
      : {};

    // 根据不同的试卷类型动态加载筛选字段
    const typeId = selected.typeId;
    const needFields = getPaperFieldsFn(typeId, paperType.toJS(), 'extra');
    const needRender = key => isFieldInclude(typeId, key, needFields);

    if (!UIstatus.get('adding')) {
      content = (
        <BodyWrapper>
          <div className="query" style={{ width: '100%' }}>
            <FieldsDiv>
              {this.renderFilterSelect(
                needRender,
                'typeId',
                '试卷类型',
                paperType.toJS(),
                { display: 'block' },
                <span style={{ color: '#ccc', margin: '0 15px' }}>
                  (筛选字段将根据不同的试卷类型有所变动)
                </span>,
              )}
              {this.renderFilterSelect(
                needRender,
                'gradeId',
                '年级',
                this.props.gradeList.toJS(),
              )}
              {this.renderFilterSelect(
                needRender,
                'termId',
                '学期',
                this.props.termList.toJS(),
              )}
              {this.renderFilterSelect(
                needRender,
                'examTypeId',
                '卷型',
                examTypeList.slice(1),
              )}
              {this.renderFilterSelect(
                needRender,
                'businessCardId',
                '试卷名片',
                this.props.businessCardList.toJS(),
              )}
              {this.renderFilterSelect(
                needRender,
                'evaluationTarget',
                '测评对象',
                paperTarget.toJS(),
                null,
                null,
                'itemCode',
                'itemName',
              )}
              {this.renderFilterSelect(
                needRender,
                'evaluationPurpose',
                '测评用途',
                paperPurpose.toJS(),
                null,
                null,
                'itemCode',
                'itemName',
              )}
              <OneFild style={needRender('year') ? {} : { display: 'none' }}>
                <filedLabel>年份：</filedLabel>
                <Select
                  onChange={value => {
                    this.props.handleSelected('year', value, this.props);
                  }}
                  style={{ width: 150 }}
                  placeholder="请选择年份"
                  value={selected.year || undefined}
                  allowClear
                >
                  {yearList.map(item => (
                    <Select.Option
                      key={`year${item.get('id')}`}
                      value={item.get('id') || ''}
                    >
                      {item.get('name') || ''}
                    </Select.Option>
                  ))}
                </Select>
              </OneFild>
              {this.renderFilterSelect(
                needRender,
                'stateStr',
                '状态',
                this.props.statusList.toJS(),
              )}
              <OneFild
                style={needRender('subjectId') ? {} : { display: 'none' }}
              >
                <filedLabel>学科：</filedLabel>
                <Select
                  allowClear
                  style={{ width: 150, height: 40 }}
                  size="large"
                  value={
                    this.props.phaseSubject.get('id').toString() || undefined
                  }
                  labelInValue={false}
                  placeholder="请选择学科"
                  onChange={value =>
                    this.props.phaseSubjectChange(value, this.props)
                  }
                >
                  {this.props.phaseSubjectList.map((item, index) => {
                    return (
                      <Select.Option
                        value={item.get('id').toString()}
                        key={item.get('id').toString()}
                        title={item.get('name')}
                      >
                        {item.get('name')}
                      </Select.Option>
                    );
                  })}
                </Select>
              </OneFild>
              <OneFild>
                <filedLabel>时间：</filedLabel>
                <DatePicker
                  size="default"
                  format="YYYY-MM-DD"
                  onChange={(date, str) =>
                    this.props.handleSelected('exStartDate', str, this.props)
                  }
                />
                <span style={{ margin: '0 5px' }}>-</span>
                <DatePicker
                  format="YYYY-MM-DD"
                  size="default"
                  onChange={(date, str) =>
                    this.props.handleSelected('exEndDate', str, this.props)
                  }
                />
              </OneFild>
              <OneFild>
                <filedLabel>试卷名：</filedLabel>
                <Input
                  style={{ width: 200, marginRight: 20 }}
                  value={paperNameForSearch}
                  placeholder="请输入试卷名"
                  onChange={e =>
                    dispatch(changePaperForSearch(e.target.value || ''))
                  }
                  suffix={
                    paperNameForSearch ? (
                      <Icon
                        type="close-circle"
                        onClick={e => dispatch(changePaperForSearch(''))}
                      />
                    ) : null
                  }
                />
              </OneFild>
              <FlexRow>
                <OneFild
                  style={
                    needRender('provinceId')
                      ? { display: 'inline-block' }
                      : { display: 'none' }
                  }
                >
                  <filedLabel>地区：</filedLabel>
                  {selected.provinceId ? (
                    <Mtag
                      checked={false}
                      onChange={() => {
                        this.props.handleSelected('provinceId', '', this.props);
                      }}
                    >
                      全部
                    </Mtag>
                  ) : (
                    <Mtag checked>全部</Mtag>
                  )}
                  <AreaForm
                    provice={this.props.provice}
                    {...this.props.selected.toJS()}
                    areaFormChange={value =>
                      this.props.quryFormChange(this.props, value)
                    }
                    {...this.props}
                    ref={form => {
                      this.areaform = form;
                    }}
                  />
                </OneFild>
                <OneFild>
                  <OneFild style={{ margin: 'auto 25px' }}>
                    <Button
                      type="primary"
                      icon="search"
                      size="default"
                      onClick={() => this.props.getData(this.props)}
                    >
                      查询
                    </Button>
                  </OneFild>
                  <OneFild>
                    <Button
                      type="primary"
                      size="default"
                      onClick={() =>
                        this.props.toggleAddPaper(this.props, true)
                      }
                    >
                      <Icon type="file-add" />
                      新增试卷
                    </Button>
                  </OneFild>
                </OneFild>
              </FlexRow>
            </FieldsDiv>
          </div>
          <FlexRow
            style={{
              justifyContent: 'space-between',
              height: '40px',
              paddingTop: '10px',
              flexShrink: 0,
            }}
          >
            <p>共有符合条件的试卷{tableState.pagination.total || 0}套</p>
            <FlexRow>
              排序方式：
              {tableState.sort ? (
                <div>
                  <Mtag
                    onChange={() =>
                      this.props.handleTableState(this.props, 'sort', '')
                    }
                  >
                    默认
                  </Mtag>
                  <Mtag checked>修改时间</Mtag>
                </div>
              ) : (
                <div>
                  <Mtag checked>默认</Mtag>
                  <Mtag
                    onChange={() =>
                      this.props.handleTableState(this.props, 'sort', '1')
                    }
                  >
                    修改时间
                  </Mtag>
                </div>
              )}
            </FlexRow>
          </FlexRow>
          <div
            className="table"
            style={{
              width: '100%',
              height: 'auto',
              backgroundColor: '#fff',
              paddingTop: 10,
              paddingBottom: 30,
            }}
          >
            <Table
              columns={columns}
              rowKey={record => record.id}
              dataSource={this.props.tableData.toJS()}
              pagination={tableState.pagination}
              onChange={(a, b, c) =>
                this.props.handleTableChange(a, b, c, this.props)
              }
              scroll={{ y: 430 }}
              loading={tableState.loading}
            />
          </div>
          <Modal
            title="试卷基本信息编辑"
            visible={this.props.editModal}
            footer={null}
            width="800px"
            onCancel={() => this.props.dispatch(setToggleEditModal())}
          >
            <PaperForm
              {...this.props.inputDto.toJS()}
              {...this.props}
              versionValue={versionValue}
              teachingEditionId={teachingEditionId}
              showTeachingList={showTeachingList}
              systemValue={systemValue}
              editionId={editionId}
              showSystemList={showSystemList}
              modalConfirm={this.modalConfirm}
              paperType={this.props.paperType.filter(
                val => Number(val.id) !== 20,
              )}
              formGrade={this.props.formGrade}
              ref={form => {
                this.newform = form;
              }}
              formTerm={this.props.formTerm}
              phaseSubjectList={this.props.phaseSubjectList}
              formChange={value =>
                this.props.formChangeHandle(
                  this.props,
                  value,
                  this.modalConfirm,
                )
              }
              onCreate={() =>
                this.props.saveModify(this.props, this.newform, this.state)
              }
              btnText="保存"
              yearList={yearList}
            />
          </Modal>
        </BodyWrapper>
      );
    } else {
      const addingsStp = UIstatus.get('addStp');
      let styleProgress = {
        lineOne: '#ddd',
        dotTwo: '',
        lineTwo: '#ddd',
        dotThree: '',
      };
      if (addingsStp === 2) {
        styleProgress = {
          lineOne: '#108ee9',
          dotTwo: 'primary',
          lineTwo: '#ddd',
          dotThree: '',
        };
      }
      if (addingsStp === 3) {
        styleProgress = {
          lineOne: '#108ee9',
          dotTwo: 'primary',
          lineTwo: '#108ee9',
          dotThree: 'primary',
        };
      }

      content = (
        <BodyWrapper className="adding">
          <FlexColumn style={{ width: '100%' }}>
            <FlexRow>
              <span
                onClick={() => this.props.toggleAddPaper(this.props, false)}
              >
                <Icon type="left" />
                返回
              </span>
            </FlexRow>
            <FlexRow style={{ justifyContent: 'center', textAlign: 'center' }}>
              <div
                className="progress"
                style={{
                  position: 'relative',
                  width: 600,
                  height: 8,
                  background: '#ddd',
                  display: 'inline-block',
                  margin: '50px 0',
                  fontSize: 12,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 300,
                    height: 8,
                    background: styleProgress.lineOne,
                    display: 'inline-block',
                  }}
                >
                  <div
                    className="stp1"
                    style={{
                      position: 'absolute',
                      left: '-14px',
                      top: '-7px',
                      color: '#108ee9',
                    }}
                  >
                    <Button shape="circle" type="primary" size="small">
                      1
                    </Button>
                    <br />
                    上传试卷
                  </div>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 300,
                    height: 8,
                    background: styleProgress.lineTwo,
                    display: 'inline-block',
                  }}
                >
                  <div
                    className="stp1"
                    style={{
                      position: 'absolute',
                      left: '-14px',
                      top: '-7px',
                      color: styleProgress.lineOne,
                    }}
                  >
                    <Button
                      shape="circle"
                      type={styleProgress.dotTwo}
                      size="small"
                    >
                      2
                    </Button>
                    <br />
                    完善信息
                  </div>
                  <div
                    className="stp1"
                    style={{
                      position: 'absolute',
                      right: '-14px',
                      top: '-7px',
                      color: styleProgress.lineTwo,
                    }}
                  >
                    <Button
                      shape="circle"
                      type={styleProgress.dotThree}
                      size="small"
                    >
                      3
                    </Button>
                    <br />
                    发布完成
                  </div>
                </div>
              </div>
            </FlexRow>
            {/* 上传  */}
            {addingsStp === 1 ? (
              <FlexRow
                style={{ justifyContent: 'center', alignItems: 'center' }}
              >
                <FlexColumn
                  style={{
                    width: 300,
                    height: 200,
                    border: '1px dashed #333',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <input
                    style={{ width: 76 }}
                    type="file"
                    name="file"
                    onChange={e => this.props.uploagChange(e, this.props)}
                  />
                  <span>从我的电脑选择要上传的试卷</span>
                </FlexColumn>
              </FlexRow>
            ) : (
              ''
            )}
            {/* 表单  */}
            {addingsStp === 2 ? (
              <div style={{ textAlign: 'center' }}>
                <FlexRow style={{ border: '1px dashed #ddd', padding: 10 }}>
                  <PaperForm
                    {...this.props.inputDto.toJS()}
                    formGrade={this.props.formGrade}
                    ref={form => {
                      this.newform = form;
                    }}
                    formTerm={this.props.formTerm}
                    phaseSubjectList={this.props.phaseSubjectList}
                    versionValue={versionValue}
                    teachingEditionId={teachingEditionId}
                    showTeachingList={showTeachingList}
                    systemValue={systemValue}
                    editionId={editionId}
                    showSystemList={showSystemList}
                    modalConfirm={this.modalConfirm}
                    formChange={value =>
                      this.props.formChangeHandle(
                        this.props,
                        value,
                        this.modalConfirm,
                      )
                    }
                    onCreate={() => {
                      this.props.dispatch(changeNotIssueAction(true));
                      this.props.addNewPaper(
                        this.props,
                        this.newform,
                        this.state,
                      );
                      setTimeout(() => {
                        this.props.dispatch(changeNotIssueAction(false));
                      }, 2000);
                    }}
                    provice={this.props.provice}
                    btnText={this.props.btnText}
                    editionList={this.props.editionList}
                    areaListAdd={this.props.areaListAdd}
                    notIssue={this.props.notIssue}
                    yearList={yearList}
                    // paperType={this.props.paperType.toJS()}
                    paperType={this.props.paperType.filter(
                      val => Number(val.id) !== 20,
                    )}
                    examPaperSourceList={examPaperSourceList}
                    businessCardList={this.props.businessCardList}
                  />
                </FlexRow>
              </div>
            ) : (
              ''
            )}
            {addingsStp === 3 ? (
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ padding: 30 }}>发布完成</h3>
                <Button
                  type="primary"
                  onClick={() => this.props.initUpload(this.props)}
                >
                  继续上传
                </Button>
                <Button onClick={() => this.props.pageInit(this.props)}>
                  返回题库
                </Button>
              </div>
            ) : (
              ''
            )}
          </FlexColumn>
        </BodyWrapper>
      );
    }
    const showPaperMsg = this.props.showPaperMsg;
    const showView = showPaperMsg.get('showView') || false;
    const paperData = showPaperMsg.get('paperData') || fromJS({});
    const questionList = showPaperMsg.get('questionList') || fromJS([]);
    const bigMsg = showPaperMsg.get('bigMsg') || fromJS([]);
    const questionOutputDTO =
      questionList.getIn([this.state.questionIndex, 'questionOutputDTO']) ||
      fromJS({});
    return (
      <Wrapper className="wrapper">
        {content}
        {showView ? (
          <ViewModal>
            <ButtonWrapper>
              <PlaceHolderBox />
              <Button
                onClick={() => {
                  this.closePreview();
                }}
              >
                返回
              </Button>
            </ButtonWrapper>
            <ContentBox>
              <FlexColumn style={{ flex: 999 }}>
                <FlexRowCenter style={{ height: 40 }}>
                  <PlaceHolderBox />
                  <Switch
                    onChange={ckicked => this.setState({ seeMobile: ckicked })}
                    checked={this.state.seeMobile}
                    checkedChildren="移动端预览"
                    unCheckedChildren="PC预览"
                  />
                </FlexRowCenter>
                <ShowQuestionItem
                  subjectId={paperData.get('subjectId')}
                  style={{ overflowY: 'auto' }}
                  questionOutputDTO={questionOutputDTO}
                  seeMobile={this.state.seeMobile}
                  soucre="addpaper"
                />
              </FlexColumn>
              <div style={{ width: 0 }} />
              <FlexColumn
                style={{ border: '1px solid #ddd', marginLeft: '10px' }}
              >
                <PaperQuestionList
                  source={'paperinputverify'}
                  questionsList={bigMsg}
                  questionSelectedIndex={this.state.questionIndex + 1}
                  questionItemIndexClick={(a, b, c, d, e) => {
                    if (
                      !filterHtmlForm(
                        questionList.getIn([
                          this.state.questionIndex,
                          'questionOutputDTO',
                          'title',
                        ]),
                      )
                    ) {
                      message.warn('本题尚未录入。');
                    }
                    this.setState({ questionIndex: e - 1 });
                  }}
                  toSeePaperMsg={() => {
                    return {
                      name: paperData.get('name'),
                      questionCount: paperData.get('questionAmount'),
                      realQuestionsCount: questionList.count(),
                      entryUserName: paperData.get('entryUserName'),
                    };
                  }}
                  othersData={{
                    questionResult: questionList.map(item =>
                      item.get('questionOutputDTO'),
                    ),
                  }}
                  parallelMakePaper={this.showParallelModal}
                  showParallelBtn
                />
              </FlexColumn>
            </ContentBox>
          </ViewModal>
        ) : (
          ''
        )}
        <Modal
          title={'经办人列表'}
          visible={this.props.operatorModalVisible}
          footer={null}
          onCancel={() => dispatch(setOperatorModalVisibleAction(false))}
        >
          <Row gutter={10}>
            <Col>上传人：{this.props.operators.get('createUserName')}</Col>
            <Col>更新人：{this.props.operators.get('updatedUserName')}</Col>
            <Col>切割人：{this.props.operators.get('cutUserName')}</Col>
            <Col>
              切割审核人：{this.props.operators.get('auditCutUserName')}
            </Col>
            <Col>录入人：{this.props.operators.get('entryUserName')}</Col>
            <Col>
              录入审核人：{this.props.operators.get('auditEntryUserName')}
            </Col>
            <Col>1号贴标签人：{this.props.operators.get('tagUserName1')}</Col>
            <Col>2号贴标签人：{this.props.operators.get('tagUserName2')}</Col>
            <Col>
              贴标签审核人：{this.props.operators.get('auditTagUserName')}
            </Col>
            <Col>终审人：{this.props.operators.get('finalAuditUserName')}</Col>
          </Row>
        </Modal>
        <Modal
          title={'释放试卷'}
          visible={this.props.forcedReleaseModalVisible}
          onCancel={() => dispatch(setForcedReleaseModalAction(false))}
          onOk={() => dispatch(forcedReleaseAction())}
        >
          警告：请谨慎使用此功能
        </Modal>
        <Modal
          title="类似试卷列表"
          visible={showSamePaper}
          bodyStyle={{ maxHeight: 500, overflowY: 'auto' }}
          closable={false}
          maskClosable={false}
          confirmLoading={forceSaving}
          okText="仍然上传"
          cancelText="取消上传"
          onCancel={() => {
            if (forceSaving) return;
            dispatch(showSamePaperAction(false));
            dispatch(
              setUIStatus(UIstatus.set('adding', true).set('addStp', 1)),
            ); // 按产品要求跳转到选择文件上传页面
          }}
          onOk={() => {
            if (forceSaving) return;
            dispatch(forceSaveFlagAction());
          }}
        >
          {samePaperList.map((item, index) => {
            return (
              <div key={index} style={{ marginBottom: 10 }}>
                <p
                  style={{
                    color: '#333',
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: 'Microsoft YaHei',
                    marginBottom: 5,
                  }}
                >
                  相似试卷{numberToChinese(index + 1)}：{item.get('name') || ''}
                </p>
                {showList.map((it, i) => (
                  <Row key={i}>
                    {it.map((iit, ii) => {
                      return (
                        <ContentCol key={ii} span={8}>
                          {iit.name}：
                          {iit.dataListType
                            ? (
                                (
                                  this.props[iit.dataListType].find(
                                    // eslint-disable-next-line max-nested-callbacks
                                    itt =>
                                      itt.get('id') ===
                                      toNumber(item.get(iit.type)),
                                  ) || fromJS({ name: '' })
                                ).get('name') || ''
                              ).replace(/^请选择$/, '')
                            : item.get(iit.type) ||
                              (iit.type === 'provinceName' ? '全国' : '')}
                        </ContentCol>
                      );
                    })}
                  </Row>
                ))}
              </div>
            );
          })}
        </Modal>
        {isShowParallel ? (
          <Modal
            title="创建试卷"
            visible={true}
            width={900}
            footer={null}
            onCancel={this.handleClose}
          >
            <ParallelMakePaper
              handleClose={this.handleClose}
              selectPaper={selectPaperData}
              pageType={2}
              handleNext={this.handleNext}
            />
          </Modal>
        ) : null}
      </Wrapper>
    );
  }
}

const PaperForm = Form.create({
  onValuesChange(props, changedFields) {
    props.formChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      name: {
        ...props.name,
        value: props.name,
      },
      businessCardId: {
        ...props.businessCardId,
        value: props.businessCardId.toString(),
      },
      subjectId: {
        ...props.subjectId,
        value: props.subjectId.toString(),
      },
      gradeId: {
        ...props.gradeId,
        value: props.gradeId.toString(),
      },
      termId: {
        ...props.termId,
        value: props.termId.toString(),
      },
      provinceId: {
        ...props.provinceId,
        value: (props.provinceId && props.provinceId.toString()) || undefined,
      },
      cityId: {
        ...props.cityId,
        value: props.cityId.toString(),
      },
      countyId: {
        ...props.countyId,
        value: props.countyId.toString(),
      },
      year: {
        ...props.year,
        value: props.year.toString(),
      },
      source: {
        ...props.source,
        value: props.source.toString(),
      },
      examTypeId: {
        ...props.examTypeId,
        value: props.examTypeId.toString(),
      },
      typeId: {
        ...props.typeId,
        value: props.typeId.toString(),
      },
      editionId: {
        ...props.editionId,
        value: props.editionId.toString(),
      },
      questionAmount: {
        ...props.questionAmount,
        value: props.questionAmount,
      },
    };
  },
})(props => {
  const {
    form,
    formGrade,
    formTerm,
    phaseSubjectList,
    provice,
    onCreate,
    btnText,
    areaListAdd,
    notIssue,
    yearList,
    paperType,
    examPaperSourceList,
  } = props;
  const { getFieldDecorator, getFieldValue } = form;
  const areaList = areaListAdd.toJS();
  const proviceList = provice.toJS();
  const phaseOption = phaseSubjectList.toJS().map((item, index) => {
    return (
      <Select.Option key={index} value={item.id.toString()} title={item.name}>
        {item.name}
      </Select.Option>
    );
  });
  const gradeOption = formGrade.toJS().map((item, index) => {
    return (
      <Select.Option key={index} value={item.id.toString()} title={item.name}>
        {item.name}
      </Select.Option>
    );
  });
  const termOption = formTerm.toJS().map((item, index) => {
    return (
      <Select.Option key={index} value={item.id.toString()} title={item.name}>
        {item.name}
      </Select.Option>
    );
  });
  const yearOption = yearList.map((item, index) => {
    return (
      <Select.Option
        key={index}
        value={item.get('id')}
        title={item.get('name')}
      >
        {item.get('name')}
      </Select.Option>
    );
  });
  const examPaperSourceOption = examPaperSourceList.map((item, index) => {
    return (
      <Select.Option
        key={index}
        value={item.get('id')}
        title={item.get('name')}
      >
        {item.get('name')}
      </Select.Option>
    );
  });
  const proviceForm = proviceList.map((item, index) => {
    return (
      <Select.Option key={index} value={item.id.toString()} title={item.name}>
        {item.name}
      </Select.Option>
    );
  });
  const cityForm = areaList.city.map((item, index) => {
    return (
      <Select.Option key={index} value={item.id.toString()} title={item.name}>
        {item.name}
      </Select.Option>
    );
  });
  const countyForm = areaList.county.map((item, index) => {
    return (
      <Select.Option key={index} value={item.id.toString()} title={item.name}>
        {item.name}
      </Select.Option>
    );
  });
  // 判断试卷类型动态加载
  const typeId = getFieldValue('typeId');
  const needFields = getPaperFieldsFn(typeId, paperType.toJS(), 'extra');
  const needRender = key => isFieldInclude(typeId, key, needFields);
  const rules = getRequiredFn(typeId, paperType.toJS(), 'extra');
  /* 课程内容和教材内容 */
  const hasTeachingVersion = needRender('teachingEditionId');
  const hasCourseSystem = needRender('editionId');
  const gradeId = getFieldValue('gradeId');
  const subjectId = getFieldValue('subjectId');
  const gradeList = formGrade;
  const {
    teachingEditionId,
    editionId,
    versionValue,
    systemValue,
    showTeachingList,
    showSystemList,
    modalConfirm,
    businessCardList
  } = props;
  /* 课程内容和教材内容 */
  return (
    <Form layout="horizontal" style={{ width: '100%' }}>
      <Col span={8}>
        <FormItem label="试卷名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            rules: [
              { required: rules.name, message: '请输入名称' },
              { whitespace: true, message: '请输入名称' },
            ],
          })(<Input placeholder="请输入名称" />)}
        </FormItem>
      </Col>
      <Col span={8}>
        <FormItem label="试卷类型" {...formItemLayout}>
          {getFieldDecorator('typeId', {
            rules: [{ required: true, message: '请选择试卷类型' }],
          })(
            <Select>
              {paperType.toJS().map(i => {
                return (
                  <Select.Option key={i.id} value={String(i.id)}>
                    {i.name}
                  </Select.Option>
                );
              })}
            </Select>,
          )}
        </FormItem>
      </Col>
      {needRender('year') ? (
        <Col span={8}>
          <FormItem label="年份" {...formItemLayout}>
            {getFieldDecorator('year', {
              rules: [
                { required: rules.year, message: '请输入年份' },
                { whitespace: true, message: '请输入年份' },
              ],
            })(<Select>{yearOption}</Select>)}
          </FormItem>
        </Col>
      ) : (
        ''
      )}
      {needRender('subjectId') ? (
        <Col span={8}>
          <FormItem label="学科" {...formItemLayout}>
            {getFieldDecorator('subjectId', {
              rules: [
                { required: rules.subjectId, message: '请输入学科' },
                { whitespace: true, message: '请输入学科' },
              ],
              options: {
                initialValue: '',
              },
            })(
              <Select defaultActiveFirstOption>
                <Select.Option value={''}>请选择学科</Select.Option>
                {phaseOption}
              </Select>,
            )}
          </FormItem>
        </Col>
      ) : (
        ''
      )}
      {needRender('gradeId') ? (
        <Col span={8}>
          <FormItem label="年级" {...formItemLayout}>
            {getFieldDecorator('gradeId', {
              rules: [
                { required: rules.gradeId, message: '请输入年级' },
                { whitespace: true, message: '请输入年级' },
              ],
              options: {
                initialValue: '',
              },
            })(
              <Select defaultActiveFirstOption>
                <Select.Option value={''}>请选择年级</Select.Option>
                {gradeOption}
              </Select>,
            )}
          </FormItem>
        </Col>
      ) : (
        ''
      )}
      {needRender('termId') ? (
        <Col span={8}>
          <FormItem label="学期" {...formItemLayout}>
            {getFieldDecorator('termId', {
              rules: [
                { required: rules.termId, message: '请选择学期' },
                { whitespace: true, message: '请选择学期' },
              ],
              options: {
                initialValue: '',
              },
            })(<Select>{termOption}</Select>)}
          </FormItem>
        </Col>
      ) : (
        ''
      )}
      <Col span={8}>
        <FormItem label="试卷来源" {...formItemLayout}>
          {getFieldDecorator('source', {
            rules: [
              { required: rules.source, message: '选择试卷来源' },
              { whitespace: true, message: '选择试卷来源' },
            ],
            options: {
              initialValue: '2',
            },
          })(<Select disabled>{examPaperSourceOption}</Select>)}
        </FormItem>
      </Col>
      {needRender('examTypeId') ? (
        <Col span={8}>
          <FormItem label="卷型" {...formItemLayout}>
            {getFieldDecorator('examTypeId', {
              rules: [
                { required: rules.examTypeId, message: '请选择卷型' },
                { whitespace: true, message: '请选择卷型' },
              ],
              options: {
                initialValue: '',
              },
            })(
              <Select>
                <Select.Option value={''}>请选择</Select.Option>
                {Object.keys(examType).map(i => {
                  return (
                    <Select.Option key={i} value={i}>
                      {examType[i]}
                    </Select.Option>
                  );
                })}
              </Select>,
            )}
          </FormItem>
        </Col>
      ) : (
        ''
      )}
      {needRender('provinceId') ? (
        <div>
          <Col span={8}>
            <FormItem label="省份" {...formItemLayout}>
              {getFieldDecorator('provinceId', {
                rules: [
                  { required: rules.provinceId, message: '请输入省份' },
                  { whitespace: true, message: '请输入省份' },
                ],
              })(<Select allowClear>{proviceForm}</Select>)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="市" {...formItemLayout}>
              {getFieldDecorator('cityId')(
                <Select>
                  <Select.Option value={''}>请选择市</Select.Option>
                  {cityForm}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="区/县" {...formItemLayout}>
              {getFieldDecorator('countyId')(
                <Select>
                  <Select.Option value={''}>请选择区县</Select.Option>
                  {countyForm}
                </Select>,
              )}
            </FormItem>
          </Col>
        </div>
      ) : (
        ''
      )}
      {needRender('businessCardId') ? (
        <Col span={8}>
          <FormItem label="试卷名片" {...formItemLayout}>
            {getFieldDecorator('businessCardId', {
              rules: [
                { required: rules.businessCardId, message: '请选择试卷名片' },
                { whitespace: true, message: '请选择试卷名片' },
              ],
            })(
              <Select>
                {businessCardList.map(el => (
                  <Select.Option
                    value={el.get('id')}
                    key={el.get('id')}
                  >
                    {el.get('name')}
                  </Select.Option>))}
              </Select>
            )}
          </FormItem>
        </Col>
      ) : (
        ''
      )}
      {typeId && typeId > 0 && (hasTeachingVersion || hasCourseSystem) ? (
        <div
          style={{
            display: 'block',
            width: '33.33333333%',
            textAlign: 'left',
            marginLeft: 90,
          }}
        >
          <PaperComponent
            hasTeachingVersion={hasTeachingVersion}
            hasCourseSystem={hasCourseSystem}
            gradeId={gradeId}
            subjectId={subjectId}
            teachingEditionId={teachingEditionId}
            editionId={editionId}
            gradeList={gradeList.toJS()}
            versionValue={versionValue}
            systemValue={systemValue}
            teachingEditionName={versionValue && versionValue.get('label')}
            onOk={modalConfirm}
            showTeachingList={showTeachingList}
            showSystemList={showSystemList}
          />
        </div>
      ) : (
        ''
      )}
      <div
        style={{
          display: 'block',
          width: '33.33333333%',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <Button
          type="primary"
          disabled={notIssue}
          style={{ marginTop: 20 }}
          onClick={() => {
            form.validateFields(err => {
              if (err) return;
              onCreate();
            });
          }}
        >
          {btnText || '发布任务'}
        </Button>
      </div>
    </Form>
  );
});

const AreaForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.areaFormChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      provinceId: {
        ...props.provinceId,
        value: props.provinceId.toString(),
      },
      cityId: {
        ...props.cityId,
        value: props.cityId.toString(),
      },
      countyId: {
        ...props.countyId,
        value: props.countyId.toString(),
      },
    };
  },
})(props => {
  const { form, provice } = props;
  const { getFieldDecorator } = form;
  const areaList = props.areaList.toJS();
  const proviceForm = provice.toJS().map((item, index) => {
    return (
      <Select.Option key={index} value={item.id.toString()} title={item.name}>
        {item.name}
      </Select.Option>
    );
  });
  const cityForm = areaList.city.map((item, index) => {
    return (
      <Select.Option key={index} value={item.id.toString()} title={item.name}>
        {item.name}
      </Select.Option>
    );
  });
  const countyForm = areaList.county.map((item, index) => {
    return (
      <Select.Option key={index} value={item.id.toString()} title={item.name}>
        {item.name}
      </Select.Option>
    );
  });
  return (
    <div
      style={{
        display: 'inline-block',
        width: 350,
        height: 32,
        verticalAlign: 'middle',
      }}
    >
      <Form layout="horizontal" style={{ width: '100%' }}>
        <FormRow>
          <Col span={8}>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('provinceId', {
                rules: [],
              })(
                <Select size="default" style={{ width: 100 }}>
                  <Select.Option value={''}>省</Select.Option>
                  {proviceForm}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('cityId', {
                rules: [],
              })(
                <Select size="default" style={{ width: 100 }}>
                  <Select.Option value={''}>市</Select.Option>
                  {cityForm}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('countyId', {
                rules: [],
              })(
                <Select size="default" style={{ width: 100 }}>
                  <Select.Option value={''}>区县</Select.Option>
                  {countyForm}
                </Select>,
              )}
            </FormItem>
          </Col>
        </FormRow>
      </Form>
    </div>
  );
});

AddPaper.propTypes = {
  dispatch: PropTypes.func.isRequired,
  phaseSubjectList: PropTypes.instanceOf(Immutable.List).isRequired,
  phaseSubject: PropTypes.instanceOf(Immutable.Map).isRequired,
  UIstatus: PropTypes.instanceOf(Immutable.Map).isRequired,
  gradeList: PropTypes.instanceOf(Immutable.List).isRequired,
  termList: PropTypes.instanceOf(Immutable.List).isRequired,
  areaList: PropTypes.instanceOf(Immutable.Map),
  areaListAdd: PropTypes.instanceOf(Immutable.Map),
  yearList: PropTypes.instanceOf(Immutable.List).isRequired,
  statusList: PropTypes.instanceOf(Immutable.List).isRequired,
  inputDto: PropTypes.instanceOf(Immutable.Map).isRequired,
  tableState: PropTypes.instanceOf(Immutable.Map),
  tableData: PropTypes.instanceOf(Immutable.List),
  notIssue: PropTypes.bool.isRequired,
  showPaperMsg: PropTypes.instanceOf(Immutable.Map),
  operatorModalVisible: PropTypes.bool,
  operators: PropTypes.instanceOf(Immutable.Map),
  paperNameForSearch: PropTypes.string.isRequired,
  showSamePaper: PropTypes.bool.isRequired,
  samePaperList: PropTypes.instanceOf(Immutable.List).isRequired,
  // paperTypeList: PropTypes.instanceOf(Immutable.List).isRequired,
  forceSaving: PropTypes.bool.isRequired,
  businessCardList: PropTypes.instanceOf(Immutable.List).isRequired,
  examPaperSourceList: PropTypes.instanceOf(Immutable.List).isRequired,
};

const mapStateToProps = createStructuredSelector({
  // ExamPoint: makeSelectKnowledge(),
  phaseSubjectList: makeSelectphaseSubjectList(),
  phaseSubject: makeSelectphaseSubject(),
  UIstatus: makeSelectUIStatus(),
  gradeList: makeSelectGradeList(),
  termList: makeSelectTermList(),
  areaList: makeSelectAreaList(),
  areaListAdd: makeSelectAreaAddList(),
  yearList: makeSelectYearList(),
  statusList: makeSelectStatusList(),
  selected: makeSelectSelected(),
  inputDto: makeSelectInputDto(),
  formTerm: makeSelectFormTerm(),
  formGrade: makeSelectFormGrade(),
  provice: makeSelectProvice(),
  tableState: makeSelectTableState(),
  tableData: makeSelectTableData(),
  editModal: makeSelectEditModal(),
  editionList: makeSelectEditionList(),
  notIssue: makeNotIssue(),
  showPaperMsg: makeShowPaperMsg(),
  operatorModalVisible: makeSelectOperatorModalVisible(),
  operators: makeSelectOperators(),
  forcedReleaseModalVisible: makeSelectForcedReleaseModalVisible(),
  paperNameForSearch: makePaperNameForSearch(),
  showSamePaper: makeShowSamePaper(),
  samePaperList: makeSamePaperList(),
  // paperTypeList: makePaperTypeList(),
  examTypeList: makeExamTypeList(),
  forceSaving: makeForceSaving(),
  businessCardList: makeBusinessCardList(),
  paperType: makeSelectPaperType(),
  paperTarget: makePaperTarget(),
  paperPurpose: makePaperPurpose(),
  examPaperSourceList: makeExamPaperSourceList(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    showOperatorModal: id => {
      dispatch(setEditPaperId(id));
      dispatch(setOperatorModalVisibleAction(true));
      dispatch(getOperatorsAction());
    },
    handleSelected: (name, value, props) => {
      // alert(name)
      let selected = props.selected;
      if (name === 'provinceId') {
        selected = selected.set('cityId', '').set('countyId', '');
      }
      if (name === 'cityId') {
        selected = selected.set('countyId', '');
      }
      if (name === 'typeId') {
        selected = selected
          .set('gradeId', '')
          .set('termId', '')
          .set('difficulty', '')
          .set('examTypeId', '')
          .set('businessCardId', '')
          .set('year', '')
          .set('subjectId', '')
          .set('provinceId', '')
          .set('cityId', '')
          .set('countyId', '');
      }
      dispatch(setSelected(selected.set(name, value)));
    },
    loadDataArea: (props, selectedOptions) => {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;
    },
    getData: props => {
      let tableState = props.tableState.toJS();
      tableState.pagination.current = 1;
      dispatch(setTableState(fromJS(tableState)));
      dispatch(getDataAction());
    },
    toggleAddPaper: (props, bool) => {
      dispatch(
        setUIStatus(props.UIstatus.set('adding', bool).set('addStp', 1)),
      );
    },
    phaseSubjectChange: (value, props) => {
      const curid = props.phaseSubject.get('id');
      if (curid === value) {
        return false;
      }
      dispatch(
        setPhaseSubjectAction(props.phaseSubject.set('id', value || '')),
      );
    },
    handleTableState: (props, name, index) => {
      let state = props.tableState;
      state = state.set(name, index);
      dispatch(setTableState(state));
      // let selected = props.selected.set(name,index)
      // dispatch(setSelected(selected))
      setTimeout(() => {
        dispatch(getDataAction());
      }, 0);
    },
    uploagChange: (event, props) => {
      const e = event || window.event;
      const files = e.target.files;
      if (!files.length) {
        return;
      }
      const name = files[0].name;
      message.info('上传中，请等待……', 3600);
      const form = new FormData();
      form.append('file', files[0]);
      fetch(`${Config.trlink_qb}/api/examPaper/fileUpload`, {
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/x-www-form-urlencoded',
          mobile: AppLocalStorage.getMobile(),
          password: AppLocalStorage.getPassWord(),
        },
        body: form,
      })
        .then(response => {
          return response.json();
        })
        .then(res => {
          if (res && Number(res.code) === 0) {
            const dto = props.inputDto.toJS();
            dto.fileUrl = res.data;
            dto.name = name.replace(/\.[a-zA-Z]{2,5}$/, '');
            dto.source = '2';
            dispatch(setUIStatus(props.UIstatus.set('addStp', 2)));
            setTimeout(() => {
              props.updatePaperAutoSelectForm(props, fromJS(dto));
            }, 20);
          } else {
            message.error(res.message || '试卷上传出错');
          }
          message.destroy();
        })
        .catch(err => {
          message.destroy();
          console.log('失败', err);
          message.error('试卷上传失败');
        });
    },
    quryFormChange: (props, values) => {
      let dto = props.selected;
      let areaList = props.areaList;
      if (values.provinceId) {
        dto = dto
          .set('provinceId', values.provinceId.value)
          .set('countyId', '')
          .set('cityId', '');
        areaList = areaList.set('city', []).set('county', []);
        setTimeout(() => {
          dispatch(setAreaListAction(areaList));
          dispatch(getCityListAction());
        }, 10);
      }
      if (values.cityId) {
        dto = dto.set('cityId', values.cityId.value).set('countyId', '');
        areaList = areaList.set('county', []);
        setTimeout(() => {
          dispatch(setAreaListAction(areaList));
          dispatch(getCountyListAction());
        }, 10);
      }
      if (values.countyId) {
        dto = dto.set('countyId', values.countyId.value);
      }
      dispatch(setSelected(dto));
    },
    handleTableChange: (pagination, filters, sorter, props) => {
      let tableState = props.tableState.toJS();
      tableState.pagination.current = pagination.current;
      dispatch(setTableState(fromJS(tableState)));
      dispatch(getDataAction());
    },
    formChangeHandle: (props, values, modalConfirm) => {
      let dto = props.inputDto;
      if (values.provinceId) {
        dto = dto
          .set('provinceId', values.provinceId || '-1')
          .set('cityId', '')
          .set('countyId', '');
        if (!values.provinceId) {
          dispatch(
            setAreaListAddAction(
              props.areaListAdd.set('city', []).set('county', []),
            ),
          );
        } else {
          setTimeout(() => {
            dispatch(getCityListAddAction());
          }, 0);
        }
      }
      if (values.cityId) {
        dto = dto.set('cityId', values.cityId).set('countyId', '');
        if (!values.cityId) {
          dispatch(setAreaListAddAction(props.areaListAdd.set('county', [])));
        } else {
          setTimeout(() => {
            dispatch(getCountyListAddAction());
          }, 30);
        }
      }
      Object.keys(values).forEach(key => {
        dto = dto.set(key, values[key]);
        if (key === 'subjectId' || key === 'gradeId') {
          // dto.set('editionId', '');
          // 清空课程和教材
          const emptyTeaching = fromJS({
            selectedId: '',
            versionValue: null,
            showTeachingList: [],
          });
          const emptySystem = fromJS({
            selectedId: '',
            systemValue: null,
            showSystemList: [],
          });
          modalConfirm(emptyTeaching, emptySystem);
          // 获取版本教材
          setTimeout(() => {
            dispatch(getEditionAction());
          }, 30);
        }
      });
      dispatch(setInputDtoAction(dto));
    },
    addNewPaper: (props, form, state) => {
      const { teachingVersion, courseSystem } = state;
      dispatch(addNewPaperAction(teachingVersion, courseSystem));
    },
    initUpload: props => {
      // const inputDto = {name:'',businessCardId:'1',subjectId:'',phaseId:'',gradeId:'',termId:'',provinceId:'',cityId:'',countyId:'',year:moment().format('YYYY'),examTypeId:'',typeId:'',questionAmount:'',picUrlList:[]}
      // dispatch(setInputDtoAction(fromJS(inputDto)))
      dispatch(setUIStatus(props.UIstatus.set('addStp', 1)));
    },
    pageInit: props => {
      props.initUpload(props);
      dispatch(setUIStatus(props.UIstatus.set('adding', false)));
    },
    goContinue: record => {
      alert('继续录入，待开发……');
      console.log('goContinue', record);
    },
    goPreview: record => {
      alert('预览，待开发……');
      console.log('goPreview', record);
    },
    editPaperInfo(props, val, record, modalConfirm) {
      const dto = props.inputDto.toJS();
      dispatch(
        setAreaListAddAction(
          props.areaListAdd.set('city', []).set('county', []),
        ),
      );
      // eslint-disable-next-line guard-for-in
      for (let e in dto) {
        dto[e] = record[e] || '';
        if (e === 'provinceId') {
          const id = parseInt(record[e], 10);
          dto[e] = !isNaN(id) ? record[e].toString() : '';
        }
      }
      let emptySystem = fromJS({
        selectedId: '',
        systemValue: null,
        showSystemList: [],
      });
      let emptyTeaching = fromJS({
        selectedId: '',
        versionValue: null,
        showTeachingList: [],
      });
      /* 课程和教材 */
      Object.keys(record).forEach(key => {
        if (key === 'examPaperCourseContent' && record[key]) {
          const { courseContentName, courseContentId } = record[key];
          if (courseContentId) {
            const systemValue = {};
            systemValue.label = courseContentName;
            systemValue.value = `${courseContentId}`;
            emptySystem = fromJS({
              systemValue,
              showSystemList: [{ name: courseContentName }],
            });
          }
          emptySystem = emptySystem.set(
            'selectedId',
            record[key].editionId ? `${record[key].editionId}` : '',
          );
        } else if (key === 'examPaperTextbook' && record[key]) {
          const { textbookName, textbookId } = record[key];
          if (textbookId) {
            const versionValue = {};
            versionValue.label = textbookName;
            versionValue.value = `${textbookId}`;
            emptyTeaching = fromJS({
              versionValue,
              showTeachingList: [{ name: textbookName }],
            });
          }
          emptyTeaching = emptyTeaching.set(
            'selectedId',
            record[key].teachingEditionId
              ? `${record[key].teachingEditionId}`
              : '',
          );
        }
      });
      modalConfirm(emptyTeaching, emptySystem);
      /* 课程和教材 */
      dispatch(setInputDtoAction(fromJS(dto)));
      dispatch(setEditPaperId(record.id));
      dispatch(setToggleEditModal());
      dispatch(getCityListAddAction());
      dispatch(getFormGradeList());
    },
    saveModify(props, form, state) {
      const { teachingVersion, courseSystem } = state;
      dispatch(submitModifyPaper(teachingVersion, courseSystem));
    },
    deletePaper(record) {
      dispatch(setEditPaperId(record.id));

      Modal.confirm({
        title: '删除',
        content: `确定删除${record.name}？`,
        okText: '删除',
        cancelText: '取消',
        onOk: () => {
          return new Promise((resolve, reject) => {
            dispatch(deletePaperAction());
            setTimeout(resolve, 800);
          });
        },
      });
    },
    convertToPic(record) {
      dispatch(setEditPaperId(record.id));

      Modal.confirm({
        title: '转化',
        content: `确定转化${record.name}？`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          return new Promise((resolve, reject) => {
            dispatch(convertToPicAction());
            setTimeout(resolve, 800);
          });
        },
      });
    },
    updatePaperAutoSelectForm(props, inputDto) {
      let newInputDto = inputDto;
      const formGrade = props.formGrade;
      const subjectList = props.phaseSubjectList;
      const proviceList = props.provice;
      const paperName = inputDto.get('name') || '';
      // 用于根据试卷名称自动匹配年级
      const otherGrade = fromJS([
        { id: 1, name: '小一' },
        { id: 2, name: '小二' },
        { id: 3, name: '小三' },
        { id: 4, name: '小四' },
        { id: 5, name: '小五' },
        { id: 6, name: '小六' },
        { id: 7, name: '七年级' },
        { id: 8, name: '八年级' },
        { id: 9, name: '九年级' },
        { id: 7, name: '初一年级' },
        { id: 8, name: '初二年级' },
        { id: 9, name: '初三年级' },
        { id: 7, name: '初中一年级' },
        { id: 8, name: '初中二年级' },
        { id: 9, name: '初中三年级' },
        { id: 10, name: '高中一年级' },
        { id: 11, name: '高中二年级' },
        { id: 12, name: '高中三年级' },
        { id: 10, name: '高一年级' },
        { id: 11, name: '高二年级' },
        { id: 12, name: '高三年级' },
      ]);
      const newGrade = otherGrade.concat(formGrade);
      const targetGrade = newGrade.find(item =>
        paperName.includes(item.get('name')),
      );
      if (targetGrade) {
        newInputDto = newInputDto.set('gradeId', targetGrade.get('id'));
      }
      const targetSubject = subjectList.find(item =>
        paperName.includes(item.get('name')),
      );
      if (targetSubject) {
        newInputDto = newInputDto.set('subjectId', targetSubject.get('id'));
      }
      const targetProvice = proviceList.find(item =>
        paperName.includes(item.get('name')),
      );
      if (targetProvice) {
        newInputDto = newInputDto.set('provinceId', targetProvice.get('id'));
      } else {
        newInputDto = newInputDto.set('provinceId', '');
      }
      dispatch(setInputDtoAction(newInputDto.set('editionId', '')));
      if (targetProvice) {
        setTimeout(() => {
          dispatch(getCityListAddAction());
        }, 20);
      }
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddPaper);
