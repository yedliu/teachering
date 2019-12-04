/* eslint-disable no-param-reassign */
/* eslint-disable no-undefined */
/**
 * question 题目 原生object
 * visible 窗口是否显示（display：none数据不会被清空）
 * cancelText 取消按钮文字
 * close 关闭
 * submitTags 提交数据（按确认按钮触发）
 */

import React from 'react';
import styled from 'styled-components';
import {
  Form, Button, Select, Modal, message, Checkbox, Input,
  // Tree,
  Row, Col, Tag, Tabs, Icon,
} from 'antd';
import Tree from '../Tree';
import { FlexRowDiv } from 'components/Div';
import Analysis from 'components/Analysis';
import { fromJS } from 'immutable';
import {
  ValueLeft,
} from 'containers/PaperFinalVerify/paperStyle';
import gradeApi from 'api/tr-cloud/grade-endpoint';
import region from 'api/qb-cloud/region-end-point';
import phaseSubject from 'api/tr-cloud/phase-subject-endpoint';
import examPoint from 'api/tr-cloud/exam-point-endpoint';
import knowledgeApi from 'api/tr-cloud/knowledge-endpoint';
// import questionSourceApi from 'api/qb-cloud/question-source-endpoint';
import { getGradeAndSubjectMapper } from 'utils/helpfunc';
import util from 'api/util';
import { contentTypeMap } from 'utils/immutableEnum';
import { backFlatMap, backChooseItem, filterHtmlForm } from 'components/CommonFn';
import { ZmExamda } from 'zm-tk-ace';
import ChildrenItem from 'zm-tk-ace/es/ZmExamda/ChoiceTemplate/modules/ChildrenItem';
import queryNodes from '../../api/qb-cloud/sys-dict-end-point';
import abilityEndPoint from '../../api/qb-cloud/base-ability-endpoint';
import thinkTagApi from 'api/tr-cloud/think-tag-endpoint';

const FormItemOrg = Form.Item;
const CheckboxGroup = Checkbox.Group;
const TabPane = Tabs.TabPane;

const Div1 = styled.div`
  width: 50px;
  margin-left: 10px;
`;
const FlexCenter = styled(FlexRowDiv)`
  justify-content: center;
`;
const FormItem = styled(FormItemOrg)`
  margin-bottom: 15px;
`;
export const ImitationInput = styled.div`
  flex: 1;
  min-height: 30px;
  line-height: 24px;
  border: 1px solid #eee;
  padding: 2px 5px;
  border-radius: 3px;
  cursor: text;
  &:hover {
    border: 1px solid #108ee9;
  }
`;
const TabPaneWrapper = styled.div`
  .ant-tabs-card >.ant-tabs-content {
  }

  .ant-tabs-card >.ant-tabs-content >.ant-tabs-tabpane {
  }

  .ant-tabs-card >.ant-tabs-bar {
  }

  .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
  }

  .ant-tabs-card >.ant-tabs-bar .ant-tabs-tab-active {
  }
`;
const QuestionContent = styled.div`
  margin-left: 50px;
  &::after {
    content: '';
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
  }
  .sort_option_item-wrapper {
    border: 1px solid rgba(225,225,225);
    margin: 5px 10px;
    padding: 2px 5px;
  }
  .group-wrapper {
    white-space: pre-wrap;
    font-family: MicrosoftYaHei;
    line-height: 19px;
    font-size: 14px;
    margin: 12px 0px 10px;
    padding: 12px;
    border-radius: 2px;
    border: 1px solid rgb(232, 226, 216);
    background: rgb(255, 251, 242);
    .sort_for_hearing-label  {
      font-family: PingFangSC-Medium;
      color: rgb(122, 89, 60);
      white-space: nowrap;
    }
  }
`;

/* const useScene = [
  {
    value: '10',
    label: '测评考试',
  },
  {
    value: '1',
    label: '经典例题',
  },
  {
    value: '2',
    label: '练习题',
  },
  {
    value: '3',
    label: '作业题',
  }
]; */
// const TreeNode = Tree.TreeNode;
class QuestionTag extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getKonwledgeOrExamePoint = this.getKonwledgeOrExamePoint.bind(this);
    // this.makeTreeNode = this.makeTreeNode.bind(this);
    this.sourceChange = this.sourceChange.bind(this);
    this.isZSPX = this.isZSPX.bind(this);
    this.provinceChange = this.provinceChange.bind(this);
    this.cityChange = this.cityChange.bind(this);
    this.state = {
      showTree: {
        show: false,
        type: '',
        degree: 'parent',
        index: -1,
        oldValue: '',
      },
      selectPoints: {
        selectedKnowledge: [],
        selectedExamPoint: [],
        childrenSelect: [
          {
            selectedKnowledge: [],
            selectedExamPoint: [],
          }
        ], // 子题选择知识点 考点
      },
      paperTypeList: fromJS([]),
      sourceDto: [],
      provinceList: [],
      yearList: [],
      cityList: [],
      countyList: [],
      gradeData: [],
      phaseSubjectList: [],
      pointList: fromJS({
        knowledgeIdList: [],
        examPointIdList: [],
      }),
      isPartTimePersion: false, // 是否为兼职人员
      phaseSet: new Set(), // 当有兼职人员 存放允许的学段

      showChildrenPoints: false,
      questionTreeType: 'parent', // 树类型 父类 子题
      childIndex: null, // 记录当前操作的子题序号
      useScene: [],
      limitCount: 3,
      repeatCheckList: [],
      abilities: null,
      thinkTags: [],
      businessCardData: [],
    };
    this.abilities = null;
    this.cacheAbilityIdList = {}; // 缓存每个学科选中的能力维度
  }

  componentDidMount() {
    this.showSubmitLoading(false);
    const { question } = this.props;
    const { setFieldsValue, getFieldValue } = this.props.form;
    const { selectPoints } = this.state;
    if (question) {
      // 年级
      this._setFieldValue('gradeId');
      // 有年级了设置学科
      if (question.gradeId) {
        this.getSubjectList(question.gradeId);
        // 学科
        this._setFieldValue('subjectId');
        // 有学科了设置知识点
        if (question.subjectId) {
          this.getKonwledgeOrExamePoint(question.subjectId); // 获取知识点和考点
          // 考点知识点
          let initData = {
            selectedKnowledge: question.knowledgeIdList,
            selectedExamPoint: question.examPointIdList,
            selectedMainKnowledge: question.mainKnowledgeId ? [question.mainKnowledgeId] : [],
          };
          // 复合题设置子题知识点考点
          if (Number(question.templateType) === 1) {
            question.children && question.children.forEach((e, index) => {
              if (!initData.childrenSelect) {
                initData.childrenSelect = [];
              }
              if (!initData.childrenSelect[index]) {
                initData.childrenSelect[index] = {};
              }
              initData.childrenSelect[index].selectedKnowledge = e.knowledgeIdList || [];
              initData.childrenSelect[index].selectedExamPoint = e.examPointIdList || [];
              initData.childrenSelect[index].selectedMainKnowledge = e.mainKnowledgeId ? [e.mainKnowledgeId] : [];
            });
          }
          this.setState({
            selectPoints: Object.assign({}, selectPoints, initData),
          });
          // 根据学科年级获取思维体系
          this.getThinkTags(question.gradeId, question.subjectId);
        }
      }
      const thinkTagIdList = question.thinkTagIdList || [];
      setFieldsValue({ thinkTagIdList }); // 设置思维体系
      // 综合度
      this._setFieldValue('comprehensiveDegreeId');
      // 难度
      this._setFieldValue('difficulty');
      // 区分度
      this._setFieldValue('distinction');
      // 题目评级
      this._setFieldValue('rating');
      // 建议用时
      this._setFieldValue('suggestTime', question.suggestTime || null);
      // 试用场景
      setFieldsValue({ sceneIdList: (question.sceneIdList && question.sceneIdList.length > 0 && question.sceneIdList[0] !== null && String(question.sceneIdList[0])) || undefined });
      // 设置试卷名片
      const { businessCardId } = question.questionLabel || {};
      if (businessCardId) setFieldsValue({ businessCardId: String(businessCardId) });
      // 能力维度
      // 设置能力维度选中的值 直到获取能力维度 List 之后再设置 abilityIdList
      let subjectId = getFieldValue('subjectId');
      if (subjectId) {
        // 如果学科存在，获取对应的能力
        this.getAbilityBySubject(subjectId).then(() => {
          const setAbility = () => {
            if (!this.state.abilities) {
              setTimeout(() => {
                setAbility();
              }, 200);
            } else {
              const subjectId = getFieldValue('subjectId');
              // 为当前选中的学科设置能力维度缓存的值
              const abilityIdList = (question.abilityIdList && question.abilityIdList.map(it => String(it))) || [];
              this.cacheAbilityIdList[`${subjectId}`] = abilityIdList;
              // console.log(abilityIdList, '____');
              setFieldsValue({ abilityIdList });
            }
          };
          setAbility();
        });
      }
      // 卷型
      setTimeout(() => {
        this._setFieldValue('examTypeId');
      }, 100);
      // 年份
      this._setFieldValue('year');
      // 试卷名称
      this._setFieldValue('originPaperName');
      // 试卷类型
      this._setFieldValue('examPaperTypeId');
      // 省份
      const provinceId = question.provinceId;
      const cityId = question.cityId;
      const countyId = question.countyId;
      this._setFieldValue('provinceId');
      if (provinceId) {
        // 获取城市
        this.provinceChange(provinceId, cityId);
      }
      if (countyId) {
        this.cityChange(cityId, countyId);
      }
    }
    this.getQueryNodes();
    // 主观选择题学科默认学习力训练
    if (question && Number(question.typeId) === 47) {
      this.subjectOnChange(1);
      setFieldsValue({ gradeId: '1' });
      setFieldsValue({ subjectId: '17' });
      // this._setFieldValue('gradeId', 1);
      this.getKonwledgeOrExamePoint(17);
    }
    this.getInitData();

    // 判断老师角色和学科权限 兼职人员要做特殊处理
    const mapper = getGradeAndSubjectMapper();
    if (mapper) {
      this.setState(mapper);
    }

    // 实现可拖动modal
    let posX;
    let posY;
    const fwuss = document.getElementsByClassName('ant-modal-wrap')[document.getElementsByClassName('ant-modal-wrap').length - 1];
    const fwussHeader = document.getElementsByClassName('ant-modal-header')[0];
    fwussHeader.onmousedown = (e) => {
      posX = event.x - fwuss.offsetLeft; // 获得横坐标x
      posY = event.y - fwuss.offsetTop; // 获得纵坐标y
      document.onmousemove = mousemove; // 调用函数，只要一直按着按钮就能一直调用
    };
    document.onmouseup = () => {
      document.onmousemove = null; // 鼠标举起，停止
    };
    function mousemove(ev) {
      if (ev == null) {
        ev = window.event; // IE
      }
      fwuss.style.left = `${ev.clientX - posX}px`;
      fwuss.style.top = `${ev.clientY - posY}px`;
    }
  }

  // componentWillUnMount() {
  //   clearTimeout(this.timer);
  // }

  getQueryNodes = () => {
    queryNodes.queryYear().then((res) => {
      const { data = [] } = res;
      this.setState({
        yearList: data.map((item) => Number(item.itemCode))
      });
    });
  }

  provinceChange(e, cityId) {
    // 清空城市和地区
    this.setState({
      cityList: [],
      countyList: [],
    });
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ cityId: undefined });
    setFieldsValue({ countyId: undefined });
    // 获取城市
    const cityFetch = {
      fetch: region.getCityByProvinceId,
      params: e,
      cb: (data) => {
        this.setState({ cityList: data || [] }, () => {
          if (cityId) {
            // 如果有城市id那么就设置一下
            setFieldsValue({ cityId: String(cityId) || undefined });
          }
        });
      },
      name: '城市',
    };
    util.fetchData(cityFetch);
  }

  cityChange(e, countyId) {
    // 清空地区
    this.setState({
      countyList: [],
    });
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ countyId: undefined });
    // 获取地区
    const countyFetch = {
      fetch: region.getCountyByCityId,
      params: e,
      cb: (data) => {
        this.setState({ countyList: data || [] }, () => {
          if (countyId) {
            // 如果有地区id那么就设置一下
            setFieldsValue({ countyId: String(countyId) || undefined });
          }
        });
      },
      name: '地区',
    };
    util.fetchData(countyFetch);
  }

  showSubmitLoading = (loading) => {
    this.setState({
      loading
    });
  }
  // 点击完成，提交表单信息
  handleSubmit(e) {
    this.showSubmitLoading(true);
    e.preventDefault();
    const { selectPoints } = this.state;
    const knowledgeIdList = selectPoints.selectedKnowledge;
    const examPointIdList = selectPoints.selectedExamPoint;
    const childrenSelect = selectPoints.childrenSelect;
    const mainKnowledgeIdList = selectPoints.selectedMainKnowledge;
    const questionLabels = ['businessCardId']; // 需要放到 questionLabel 的字段
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { question } = this.props;
        const isZhuGuanChoose = question && Number(question.typeId) === 47;
        const isXueXiLiXunLian = Number(values.subjectId) === 17;
        const saveParams = { ...values };
        // 过滤不在思维标签列表中的数据
        const thinkTagIds = this.state.thinkTags.map(el => el.value);
        saveParams.thinkTagIdList = saveParams.thinkTagIdList.filter(thinkTagId => thinkTagIds.includes(thinkTagId));
        // 设置需要存到 questionLabel 中的属性
        questionLabels.forEach(key => {
          const value = saveParams[key];
          if (value) {
            if (!saveParams.questionLabel) saveParams.questionLabel = {};
            saveParams.questionLabel[key] = value;
            delete saveParams[key]; // 删除 saveParams 中多余的属性
          }
        });

        if (this.isZSPX(saveParams.sourceId) && !isZhuGuanChoose) {
          // source保存为子级的id
          saveParams.sourceDetailId = saveParams.sourceDetailId;
          // console.log('编辑题目标签ZSPX1');
          this.props.submitTags(saveParams);
          // console.log('编辑题目标签ZSPX1');
          return;
        }
        if (isZhuGuanChoose && !isXueXiLiXunLian) {
          message.error('主观选择题仅支持学习力训练学科使用！');
          this.showSubmitLoading(false);
          return;
        }
        if (!saveParams.suggestTime) {
          saveParams.suggestTime = null;
        } else {
          const isInteger = saveParams.suggestTime % 1 === 0;
          if (!isInteger) {
            message.error('建议用时必须是整数');
            this.showSubmitLoading(false);
            return;
          }
        }
        let mainKnowledgeId = mainKnowledgeIdList && mainKnowledgeIdList[0] ? mainKnowledgeIdList[0] : null;
        let obj = { knowledgeIdList, examPointIdList, childrenSelect };
        let params = Object.assign({}, saveParams, obj);
        if (mainKnowledgeId) {
          params.mainKnowledgeId = mainKnowledgeId;
        } else {
          params.mainKnowledgeId = null;
        }
        if (!(params.sceneIdList instanceof Array)) {
          params.sceneIdList = [params.sceneIdList].filter(it => it); // 原先没有的话会变成 [null] 的存在，所以需要过滤下
        }
        // 主知识点必填校验（应产品要求暂时去掉该校验，代码暂时保留）
        /* if (this.mainKnowledgeDom) {
          if (!params.mainKnowledgeId) {
            message.warning('主知识点必填');
            this.showSubmitLoading(false);
            return;
          }
          if (params.childrenSelect) {
            let childrenMain = true;
            params.childrenSelect.forEach(item => {
              if (item.selectedMainKnowledge && item.selectedMainKnowledge.length === 0) {
                childrenMain = false;
              }
            });
            if (!childrenMain) {
              message.warning(`子题的主知识点必填`);
              this.showSubmitLoading(false);
              return;
            }
          }
        } */
        this.props.submitTags(params);
        // 移除自动取消 loading，改由生命周期来控制 loading状态
        // this.timer = setTimeout(() => {
        //   this.showSubmitLoading(false);
        // }, 3000);
      } else {
        this.showSubmitLoading(false);
      }
    });
  }

  getKonwledgeOrExamePoint(val) {
    let gradeId = this.props.form.getFieldValue('gradeId');
    // 当都选了学科和年级 去获取知识点或者考点
    if (gradeId && val) {
      this.getKonwledgeAndExamePoint(gradeId, val);
    }
  }

  getKonwledgeAndExamePoint = (gradeId, subjectId) => {
    const knowledgeFetch = {
      fetch: knowledgeApi.getAllKnowledge,
      params: { gradeId, subjectId },
      cb: (data) => {
        const ponints = this.state.pointList;
        this.setState({ pointList: ponints.set('knowledgeIdList', fromJS(data || [])) });
      },
      failCb: () => {
        const ponints = this.state.pointList;
        this.setState({ pointList: ponints.set('knowledgeIdList', fromJS([])) });
      },
      name: '知识点',
    };
    util.fetchData(knowledgeFetch);
    const examPointFetch = {
      fetch: examPoint.getExamPoint,
      params: { gradeId, subjectId },
      cb: (data) => {
        const ponints = this.state.pointList;
        this.setState({ pointList: ponints.set('examPointIdList', fromJS(data || [])) });
      },
      failCb: () => {
        const ponints = this.state.pointList;
        this.setState({ pointList: ponints.set('examPointIdList', fromJS([])) });
      },
      name: '考点',
    };
    util.fetchData(examPointFetch);
  };
  sourceChange(val) {
    // console.log('sourceChange', val);
    const sourceFetch = {
      fetch: queryNodes.getChildren,
      params: {
        groupCode: 'QB_QUESTION_SOURCE',
        pid: val
      },
      cb: (data) => {
        this.setState({
          sourceDtoChild: data
        });
      },
      name: '题目来源',
    };
    util.fetchData(sourceFetch);
    if (this.props.form.getFieldValue('sourceDetailId')) {
      this.props.form.setFieldsValue({ sourceDetailId: undefined });
    }
  }

  isZSPX(value) {
    const { sourceDto } = this.state;
    let name = '';
    sourceDto && sourceDto.some(item => {
      if (Number(item.itemCode) === Number(value)) {
        name = item.itemName;
        return true;
      }
      return false;
    });
    return name ? name.indexOf('招师') > -1 : false;
  }

  _setFieldValue = (key, defaultVal) => {
    const { question } = this.props;
    const { setFieldsValue } = this.props.form;
    if (question[key]) {
      setFieldsValue({ [key]: String(question[key] || defaultVal || undefined) });
    }
  }

  // 移除改编枚举方法
  removeCopy = (data) => {
    data && data.some((item, index) => {
      if (Number(item.id) === 4) {
        // 如果是不是改编的 那么去掉改编这个选项
        data.splice(index, 1);
        return true;
      }
      return false;
    });
  }

  getInitData = () => {
    const { question } = this.props;
    // api获取来源
    const handleAfterFetch = () => {
      let isCopy = false;
      if (question) {
        this._setFieldValue('sourceId');
        isCopy = Number(question.sourceId) === 4;
      }
      // 改编的题目禁止修改
      if (isCopy) {
        this.setState({
          sourceDisabled: true
        });
      }
      return isCopy;
    };
    const sourceFetch = {
      fetch: queryNodes.queryNodesByGroupList,
      params: ['QB_QUESTION_SOURCE', 'QB_QUESTION_SCENE'],
      cb: (data) => {
        // 如果不是改编 那么要去掉改编这一选项
        if (!handleAfterFetch()) {
          this.removeCopy(data.QB_QUESTION_SOURCE);
        }
        this.setState({ sourceDto: data.QB_QUESTION_SOURCE, useScene: data.QB_QUESTION_SCENE });
      },
      name: '题目来源',
    };
    util.fetchData(sourceFetch);

    const sourceDetailFetch = {
      fetch: queryNodes.getChildren,
      params: {
        groupCode: 'QB_QUESTION_SOURCE',
        pid: question && question['sourceId']
      },
      cb: (data) => {
        this.setState(
          {
            sourceDtoChild: data || []
          },
          () => this._setFieldValue('sourceDetailId')
        );
      },
      name: '题目来源'
    };
    // 只有当题目来源存在时，才去请求来源明细
    question && question['sourceId'] && util.fetchData(sourceDetailFetch);
    // 获取卷型
    const examFetch = {
      fetch: queryNodes.queryExamType,
      cb: (data) => {
        this.setState({ examTypeList: data || [] });
      },
      name: '卷型',
    };
    util.fetchData(examFetch);
    const paperCardFetch = {
      fetch: queryNodes.queryPaperCard,
      cb: (data) => {
        this.setState({ businessCardData: data || [] });
      },
      name: '试卷名片',
    };
    util.fetchData(paperCardFetch);
    // 获取省份
    const provinceFetch = {
      fetch: region.getProvince,
      cb: (data) => {
        this.setState({ provinceList: data || [] });
      },
      name: '省份',
    };
    util.fetchData(provinceFetch);
    // 获取年级
    const gradeFetch = {
      fetch: gradeApi.getGrade,
      cb: (data) => {
        this.setState({ gradeData: data });
      },
      name: '年级',
    };
    util.fetchData(gradeFetch);
    const paperTypeFetch = {
      fetch: queryNodes.queryExamPaperType,
      cb: (data) => {
        this.setState({ paperTypeList: fromJS(data || []) });
      },
      failCb: () => {
        this.setState({ paperTypeList: fromJS([]) });
      },
      name: '试卷类型',
    };
    util.fetchData(paperTypeFetch);
  }

  getSubjectList = (gradeId) => {
    const subjectFetch = {
      fetch: phaseSubject.findAllSubject,
      params: { gradeId },
      cb: (data) => {
        this.setState({ phaseSubjectList: data || [] });
      },
      name: '学科',
    };
    util.fetchData(subjectFetch);
  }

  subjectOnChange = (val) => {
    // 选择年级时清空学科
    this.props.form.setFieldsValue({ subjectId: undefined });
    // 选择年级时清空知识点考点
    this.setState({
      selectPoints: {
        selectedKnowledge: [],
        selectedExamPoint: [],
        childrenSelect: [
          {
            selectedKnowledge: [],
            selectedExamPoint: [],
            selectedMainKnowledge: []
          }
        ], // 子题选择知识点 考点
        selectedMainKnowledge: []
      }
    });
    // 获取学科列表
    this.getSubjectList(val);
  }
  // 根据学科获取能力
  getAbilityBySubject = async (subjectId) => {
    let data = await abilityEndPoint.queryBaseAbilityBySubject({ subjectId }).then(res => {
      if (res.code === '0') {
        let abilities = res.data.map(item => {
          return { value: String(item.id), label: item.name };
        });
        this.setState({ abilities });
      }
      return res;
    }).catch(() => {
      message.warning('服务不可用');
      return {};
    });
    return data;
  }

  getThinkTags = (gradeId, subjectId) => {
    thinkTagApi.findAll({ gradeId, subjectId, pageIndex: 1, pageSize: 999 })
      .then(res => {
        if (String(res.code) === '0') {
          let thinkTags = res.data && res.data.list.map(item => {
            return { value: item.id, label: item.tagName };
          });
          this.setState({ thinkTags });
        } else {
          message.warning(res.message || '获取思维标签失败');
        }
      }).catch(() => {
        message.warning('系统异常，获取思维标签失败');
      });
  }
  render() {
    const {
      visible, close, cancelText, question, showAnalysis,
      // isNewType,
    } = this.props;
    // console.log('题目数据', question);
    const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form;
    const selectGradeId = getFieldValue('gradeId');
    const isGradeAndSubjectSelected = selectGradeId && getFieldValue('subjectId');
    // this.abilities = getAbility(getFieldValue('subjectId'), true);
    const { selectPoints, showTree, sourceDto, sourceDtoChild,
      provinceList, cityList, countyList, gradeData,
      phaseSubjectList, pointList, phaseSet, allowSubjectMap,
      isPartTimePersion, paperTypeList, questionTreeType,
      selectedKeys, childIndex, limitCount, useScene, repeatCheckList,
      abilities, thinkTags, businessCardData } = this.state;
    let seleectGradeItem = []; // 兼职人员用得到
    let curAllowSubject = []; // 兼职人员用得到
    if (isPartTimePersion) {
      seleectGradeItem = gradeData.find(e => Number(e.id) === Number(selectGradeId)) || {}; // 因为只存了年级id 要根据id找phaseId
      curAllowSubject = allowSubjectMap[seleectGradeItem.phaseId] || []; // 当前年级下允许的学科
    }
    // 招师培训
    const isZSPX = this.isZSPX(getFieldValue('sourceId'));
    let treeDataList = pointList.get(showTree.type) || fromJS([]);
    if (showTree.type === 'mainKnowledgeIdList') treeDataList = pointList.get('knowledgeIdList') || fromJS([]);
    // 题干知识点 考点
    const selectedKnowledge = selectPoints.selectedKnowledge;
    const selectedExamPoint = selectPoints.selectedExamPoint;
    const selectedMainKnowledge = selectPoints.selectedMainKnowledge;
    // 子题知识点 考点
    const childrenSelect = selectPoints.childrenSelect || [];

    const formItemCol = {
      labelCol: {
        span: 7
      },
      wrapperCol: {
        span: 17
      }
    };
    const selectStyle = { width: 150 };
    // 渲染知识点考点
    const konwledgeAndExamPoint = (type, key, title, index) => {
      const getIds = (c, isInt, isMain) => {
        let data = [];
        if (type === 'parent') {
          let knowledge = isMain ? selectedMainKnowledge : selectedKnowledge;
          data = c === 'know' ? knowledge : selectedExamPoint;
        }
        if (type === 'children') {
          let knowledge = isMain ? (childrenSelect[index] || {}).selectedMainKnowledge : (childrenSelect[index] || {}).selectedKnowledge;
          data = c === 'know' ? knowledge : (childrenSelect[index] || {}).selectedExamPoint;
        }
        return data ? (isInt ? data.slice() : data.map(e => String(e)).slice()) : [];
      };
      const questionKnowledgeIdList = getIds('know', true);
      const questionExamPointIdList = getIds('exam', true);
      // 根据id找知识点考点对象
      const knowledgeObjs = backChooseItem(pointList.get('knowledgeIdList'), questionKnowledgeIdList, [], '', true);
      const examObjs = backChooseItem(pointList.get('examPointIdList'), questionExamPointIdList, [], '', true);
      const mainKnowledgeObjs = backChooseItem(pointList.get('knowledgeIdList'), getIds('know', true, true), [], '', true);
      // 找到没有找到的id 标记
      const rightKnowIds = knowledgeObjs.map(e => e.id);
      const rightExamIds = examObjs.map(e => e.id);
      const rightMainKnowIds = mainKnowledgeObjs.map(e => e.id);
      const wrongKnowIds = []; // 错误的知识点id
      const wrongExamIds = []; // 错误的考点id
      const wrongMainKnowIds = [];
      questionKnowledgeIdList.forEach(id => {
        if (rightKnowIds.indexOf(id) === -1) {
          wrongKnowIds.push(id);
        }
      });
      questionExamPointIdList.forEach(id => {
        if (rightExamIds.indexOf(id) === -1) {
          wrongExamIds.push(id);
        }
      });
      getIds('know', true, true).forEach(id => {
        if (rightMainKnowIds.indexOf(id) === -1) {
          wrongMainKnowIds.push(id);
        }
      });
      const wrongKnowledgeObjs = backFlatMap(pointList.get('knowledgeIdList'), wrongKnowIds, [], '', true); // 错误知识点
      const wrongExamPointObjs = backFlatMap(pointList.get('examPointIdList'), wrongExamIds, [], '', true); // 错误考点
      const wrongMainKnowledgeObjs = backFlatMap(pointList.get('knowledgeIdList'), wrongMainKnowIds, [], '', true); // 错误主知识点
      // console.log(isGradeAndSubjectSelected, pointList.get('knowledgeIdList').toJS(), 'ISSHOW');
      return (
        <div key={key}>
          {/* <QuestionContent
            dangerouslySetInnerHTML={{ __html: renderToKatex((backfromZmStandPrev(title, 'createHw'))) }}
          /> */}
          {isGradeAndSubjectSelected && pointList.get('knowledgeIdList') && pointList.get('knowledgeIdList').count() > 0 ? (
            <div>
              <FlexRowDiv style={{ alignItems: 'center', margin: '10px 50px' }} ref={(instance) => { this.mainKnowledgeDom = instance }}>
                <span style={{ minWidth: 50 }}>主知识点：</span>
                <ValueLeft flex="none">
                  {mainKnowledgeObjs.map((e, i) => {
                    return <Tag style={{ marginBottom: 2 }} color="#87d068" key={i}>{e.name}</Tag>;
                  })}
                  {wrongMainKnowledgeObjs.map((e, i) => {
                    return <Tag title="错误知识点" style={{ marginBottom: 2 }} color="red" key={i}>{e.name}</Tag>;
                  })}
                </ValueLeft>
                <Icon
                  title="添加主知识点"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    this.setState({
                      showTree: Object.assign({}, showTree, { show: true, type: 'mainKnowledgeIdList' }),
                      selectedKeys: getIds('know', false, true).filter(id => wrongMainKnowIds.indexOf(Number(id)) === -1), // 过滤错误id
                      questionTreeType: type,
                      limitCount: 1,
                      repeatCheckList: getIds('know')
                    });
                    if (type === 'children') {
                      this.setState({
                        childIndex: index,
                      });
                    }
                  }}
                  type="edit"
                />
              </FlexRowDiv>
              <FlexRowDiv style={{ alignItems: 'center', margin: '10px 50px' }}>
                <span style={{ minWidth: 50 }}>副知识点：</span>
                <ValueLeft flex="none">
                  {knowledgeObjs.map((e, i) => {
                    return <Tag style={{ marginBottom: 2 }} color="#87d068" key={i}>{e.name}</Tag>;
                  })}
                  {wrongKnowledgeObjs.map((e, i) => {
                    return <Tag title="错误知识点" style={{ marginBottom: 2 }} color="red" key={i}>{e.name}</Tag>;
                  })}
                </ValueLeft>
                <Icon
                  title="添加副知识点"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    this.setState({
                      showTree: Object.assign({}, showTree, { show: true, type: 'knowledgeIdList' }),
                      selectedKeys: getIds('know').filter(id => wrongKnowIds.indexOf(Number(id)) === -1), // 过滤错误id
                      questionTreeType: type,
                      limitCount: 3,
                      repeatCheckList: getIds('know', false, true)
                    });
                    if (type === 'children') {
                      this.setState({
                        childIndex: index,
                      });
                    }
                  }}
                  type="edit"
                />
              </FlexRowDiv>
            </div>)
            : ''}
          {isGradeAndSubjectSelected && pointList.get('examPointIdList') && pointList.get('examPointIdList').count() > 0 ? (
            <div>
              <FlexRowDiv style={{ alignItems: 'center', margin: '10px 50px' }}>
                <span style={{ minWidth: 50 }}>考点：</span>
                <ValueLeft flex="none">
                  {examObjs.map((e, i) => {
                    return <Tag style={{ marginBottom: 2 }} color="#87d068" key={i}>{e.name}</Tag>;
                  })}
                  {wrongExamPointObjs.map((e, i) => {
                    return <Tag title="错误的考点" style={{ marginBottom: 2 }} color="red" key={i}>{e.name}</Tag>;
                  })}
                </ValueLeft>
                <Icon
                  type="edit"
                  style={{ cursor: 'pointer' }}
                  title="添加考点"
                  onClick={() => {
                    this.setState({
                      showTree: Object.assign({}, showTree, { show: true, type: 'examPointIdList' }),
                      selectedKeys: getIds('exam').filter(id => wrongExamIds.indexOf(Number(id)) === -1), // 过滤错误id
                      questionTreeType: type,
                    });
                    if (type === 'children') {
                      this.setState({
                        childIndex: index,
                      });
                    }
                  }}
                />
              </FlexRowDiv>
            </div>)
            : ''}
        </div>
      );
    };
    const renderInput = () => (
      <div>
        {/* 第一行 */}
        <Row>
          <Col span={8}>
            <FormItem label="题目来源" {...formItemCol} required>
              {getFieldDecorator('sourceId', {
                rules: [{ required: true, message: '请选择来源!' }],
              })(
                <Select
                  disabled={this.state.sourceDisabled}
                  placeholder="请选择题目来源"
                  style={selectStyle}
                  onChange={(val) => {
                    this.sourceChange(val);
                  }}
                >
                  {sourceDto.map(it =>
                    <Select.Option
                      key={it.itemCode}
                      value={String(it.itemCode)}
                    >
                      {it.itemName}
                    </Select.Option>
                  )}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            {sourceDtoChild && sourceDtoChild.length > 0 ? (
              <FormItem label="来源明细" {...formItemCol} required>
                <FlexRowDiv>
                  {getFieldDecorator('sourceDetailId', {
                    rules: [{ required: true, message: '选择来源明细!' }],
                  })(
                    <Select style={selectStyle}>
                      {sourceDtoChild.map(it =>
                        <Select.Option
                          key={it.itemCode}
                          value={String(it.itemCode)}>
                          {it.itemName}
                        </Select.Option>
                      )}
                    </Select>
                  )}
                </FlexRowDiv>
              </FormItem>
            ) : ''}
          </Col>
        </Row>
        {isZSPX ? '' : (
          <div>
            {/* 第二行 */}
            <Row>
              <Col span={8}>
                <FormItem label="年级" {...formItemCol} required>
                  {getFieldDecorator('gradeId', {
                    rules: [{ required: true, message: '请选择年级!' }],
                  })(
                    <Select
                      style={{ width: 150 }}
                      placeholder="请选择年级"
                      onChange={this.subjectOnChange}
                    >
                      {gradeData.map((type, index) =>
                        (isPartTimePersion && !phaseSet.has(type.phaseId)
                          ? null
                          : <Select.Option value={String(type.id)} key={index}>{type.name}</Select.Option>)
                      )}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="学科" {...formItemCol} required>
                  {getFieldDecorator('subjectId', {
                    rules: [{ required: true, message: '请选择学科!' }],
                  })(
                    <Select
                      placeholder="请选择学科"
                      style={{ width: 150 }}
                      onChange={async (val) => {
                        // 选择年级时清空知识点考点
                        this.setState({
                          selectPoints: {
                            selectedKnowledge: [],
                            selectedExamPoint: [],
                          }
                        });
                        this.getKonwledgeOrExamePoint(val);
                        this.getThinkTags(selectGradeId, val);
                        // 获取能力
                        await this.getAbilityBySubject(val);
                        // 定时器是为了获取 this.abilities 的值
                        // 有能力维度才设置 abilityIdList
                        if (this.state.abilities) {
                          const abilityIdList = this.cacheAbilityIdList[`${val}`] || [];
                          // console.log(abilityIdList, 222222);
                          setFieldsValue({ abilityIdList });
                        }
                      }}
                    >
                      {phaseSubjectList.map((type) => (isPartTimePersion && curAllowSubject.indexOf(type.id) === -1 ? null : <Select.Option value={String(type.id)} key={type.id}>{type.name}</Select.Option>))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="题目评级" {...formItemCol} required>
                  {getFieldDecorator('rating', {
                    rules: [{ required: true, message: '请选择题目评级!' }],
                  })(
                    <Select style={selectStyle} placeholder="请选择题目评级">
                      <Select.Option value={'1'}>基础题</Select.Option>
                      <Select.Option value={'2'}>常规题</Select.Option>
                      <Select.Option value={'3'}>压轴题</Select.Option>
                      <Select.Option value={'4'}>易错题</Select.Option>
                      <Select.Option value={'5'}>经典题</Select.Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            {/* 第三行 */}
            <Row>
              <Col span={8}>
                <FormItem label="区分度" {...formItemCol} required>
                  {getFieldDecorator('distinction', {
                    rules: [{ required: true, message: '请选择区分度!' }],
                  })(
                    <Select style={selectStyle} placeholder="请选择区分度">
                      <Select.Option value={'1'}>差</Select.Option>
                      <Select.Option value={'2'}>一般</Select.Option>
                      <Select.Option value={'3'}>好</Select.Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="难度" {...formItemCol} required>
                  {getFieldDecorator('difficulty', {
                    rules: [{ required: true, message: '请选择难度!' }],
                  })(
                    <Select style={selectStyle} placeholder="请选择难度">
                      <Select.Option value={'1'}>一级</Select.Option>
                      <Select.Option value={'2'}>二级</Select.Option>
                      <Select.Option value={'3'}>三级</Select.Option>
                      <Select.Option value={'4'}>四级</Select.Option>
                      <Select.Option value={'5'}>五级</Select.Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="综合度" {...formItemCol} required>
                  {getFieldDecorator('comprehensiveDegreeId', {
                    rules: [{ required: true, message: '请选择综合度!' }],
                  })(
                    <Select style={selectStyle} placeholder="请选择综合度">
                      <Select.Option value={'1'}>1</Select.Option>
                      <Select.Option value={'2'}>2</Select.Option>
                      <Select.Option value={'3'}>3</Select.Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            {/* 第四行 */}
            <Row>
              <Col span={8}>
                <FormItem label="年份" {...formItemCol} required>
                  {getFieldDecorator('year', {
                    rules: [{ required: true, message: '请选择年份!' }],
                  })(
                    <Select style={selectStyle} placeholder="请选择年份">
                      {this.state.yearList ? this.state.yearList.map(it => <Select.Option key={it} value={String(it)}>{it}</Select.Option>) : ''}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="卷型" {...formItemCol}>
                  {getFieldDecorator('examTypeId')(
                    <Select style={selectStyle} placeholder="请选择卷型">
                      {this.state.examTypeList ? this.state.examTypeList.map(it => <Select.Option key={it.id} value={String(it.id)}>{it.name}</Select.Option>) : ''}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="试卷类型" {...formItemCol} required>
                  {getFieldDecorator('examPaperTypeId', {
                    rules: [{ required: true, message: '请选择试卷类型!' }],
                  })(
                    <Select style={selectStyle} placeholder="请选择试卷类型">
                      {paperTypeList.toJS().map(it => <Select.Option key={it.id} value={String(it.id)}>{it.name}</Select.Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            {/* 第五行 */}
            <Row>
              <Col span={8}>
                <FormItem label="省" {...formItemCol}>
                  {getFieldDecorator('provinceId')(
                    <Select style={selectStyle} onChange={this.provinceChange} placeholder="请选择省份">
                      <Select.Option key="0" value="0">全国</Select.Option>
                      {provinceList.map(it =>
                        <Select.Option key={it.id} value={String(it.id)}>{it.name}</Select.Option>
                      )}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="市" {...formItemCol}>
                  {getFieldDecorator('cityId')(
                    <Select style={selectStyle} onChange={this.cityChange} placeholder="请选择城市">
                      {cityList.map(it => <Select.Option key={it.id} value={String(it.id)}>{it.name}</Select.Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="区" {...formItemCol}>
                  {getFieldDecorator('countyId')(
                    <Select style={selectStyle} placeholder="请选择地区">
                      {countyList.map(it => <Select.Option key={it.id} value={String(it.id)}>{it.name}</Select.Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            {/* 第六行 */}
            <Row>
              <Col span={8}>
                <FormItem label="建议用时" {...formItemCol}>
                  <FlexRowDiv>
                    {getFieldDecorator('suggestTime')(<Input type="number" style={{ width: 80 }} />)}
                    <Div1>分钟</Div1></FlexRowDiv>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="试卷名称" {...formItemCol}>
                  {getFieldDecorator('originPaperName')(<Input placeholder="请输入试卷名称" style={{ width: 150 }} />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="适用场景" {...formItemCol}>
                  {getFieldDecorator('sceneIdList')(<Select style={selectStyle} placeholder="请选择适用场景" allowClear>
                    {useScene.map(it => <Select.Option key={it.itemCode} value={String(it.itemCode)}>{it.itemName}</Select.Option>)}
                  </Select>)}
                </FormItem>
              </Col>
            </Row>
            {/* 第七行 */}
            <Row>
              <Col span={8}>
                <FormItem label="试卷名片" {...formItemCol}>
                  {getFieldDecorator('businessCardId')(<Select style={selectStyle} placeholder="请选择试卷名片" allowClear>
                    {businessCardData.map(it => <Select.Option key={it.itemCode} value={String(it.itemCode)}>{it.itemName}</Select.Option>)}
                  </Select>)}
                </FormItem>
              </Col>
            </Row>
            {abilities && abilities.length > 0 ? (
              <FormItem
                label="能力维度"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 21 }}
              >
                {getFieldDecorator('abilityIdList')(<CheckboxGroup onChange={() => {
                  // onChange 事件在 form 存入选中值之前执行, 设置 timeout 是为了从 form 中获取 abilityIdList 的值
                  setTimeout(() => {
                    const abilityIdList = getFieldValue('abilityIdList') || [];
                    const subjectId = getFieldValue('subjectId');
                    // 为当前选中的学科设置能力维度缓存的值
                    this.cacheAbilityIdList[`${subjectId}`] = abilityIdList;
                  }, 0);
                }} options={abilities}
                />)}
              </FormItem>
            ) : ''}
            <FormItem
              label="思维体系"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              style={{ display: thinkTags && thinkTags.length > 0 ? 'block' : 'none' }}
            >
              {getFieldDecorator('thinkTagIdList')(<CheckboxGroup options={thinkTags} />)}
            </FormItem>
          </div>
        )}
      </div>
    );
    const renderTree = () => (
      <Modal
        visible
        style={{ overflow: 'hidden' }}
        bodyStyle={{ maxHeight: 600, height: 600, overflow: 'hidden' }}
        footer={null}
        onCancel={() => {
          this.setState({
            showTree: Object.assign({}, showTree, { show: false }),
          });
        }}
      >
        <Tree.SearchTree
          style={{
            height: '100%',
            padding: 20,
          }}
          searchType={showTree.type === 'knowledgeIdList' ? '副知识点' : showTree.type === 'mainKnowledgeIdList' ? '主知识点' : '考点'}
          noLimit={Number(question.templateType) === 1 && (questionTreeType === 'parent' && showTree.type !== 'mainKnowledgeIdList')} // 复合题主题干不限制
          treeData={treeDataList.toJS()}
          checkedKeys={selectedKeys}
          onOk={(checked = []) => {
            // console.log('selectPoints', selectPoints);
            let newSelectPoints = fromJS(selectPoints);
            if (questionTreeType === 'parent') {
              if (showTree.type === 'knowledgeIdList') {
                newSelectPoints = newSelectPoints.set('selectedKnowledge', checked);
              } else if (showTree.type === 'examPointIdList') {
                newSelectPoints = newSelectPoints.set('selectedExamPoint', checked);
              } else if (showTree.type === 'mainKnowledgeIdList') {
                newSelectPoints = newSelectPoints.set('selectedMainKnowledge', checked);
              }
            } else if (questionTreeType === 'children') {
              if (!newSelectPoints.get('childrenSelect')) {
                // 初始化 childrenSelect
                newSelectPoints = newSelectPoints.set('childrenSelect', fromJS(new Array(childIndex + 1).fill({})));
              }
              // console.log('哈哈哈', newSelectPoints.toJS());
              if (showTree.type === 'knowledgeIdList') {
                newSelectPoints = newSelectPoints.setIn(['childrenSelect', childIndex, 'selectedKnowledge'], checked);
              } else if (showTree.type === 'examPointIdList') {
                newSelectPoints = newSelectPoints.setIn(['childrenSelect', childIndex, 'selectedExamPoint'], checked);
              } else if (showTree.type === 'mainKnowledgeIdList') {
                newSelectPoints = newSelectPoints.setIn(['childrenSelect', childIndex, 'selectedMainKnowledge'], checked);
              }
            }
            // console.log('newSelectPoints', newSelectPoints.toJS());
            this.setState({
              selectPoints: newSelectPoints.toJS(),
              showTree: Object.assign({}, showTree, { show: false }),
            });
          }}
          onCancel={() => {
            this.setState({
              showTree: Object.assign({}, showTree, { show: false })
            });
          }}
          limitCount={limitCount}
          repeatCheckList={repeatCheckList}
        />
      </Modal>
    );
    // console.log(question, '----------question----------');
    return (
      <div>
        <Modal
          visible={visible}
          onCancel={() => close(false)}
          footer={null} title="编辑题目标签"
          width="900px"
          style={{
            top: 100,
          }}
          bodyStyle={{
            maxHeight: 600,
            overflow: 'auto',
          }}
          maskClosable={false}
        >
          <Form onSubmit={this.handleSubmit}>
            {renderInput()}
            <TabPaneWrapper>
              <Tabs type="card" tabBarStyle={{ marginLeft: 50 }}>
                <TabPane tab="主题干" key={question.id || 'main'}>
                  <QuestionContent>
                    <ZmExamda
                      question={fromJS(question)}
                      noFragment={[5, 6, 7].includes(question.templateType)}
                      options={['title', 'answerList', 'analysis']}
                    />
                  </QuestionContent>
                  {/* <QuestionContent
                    dangerouslySetInnerHTML={{ __html: renderToKatex((backfromZmStandPrev(question.title, 'createHw'))) }}
                  />
                  {  !isNewType && question.optionList && question.optionList.map((option, i) => (
                    <QuestionContent
                      key={option}
                      dangerouslySetInnerHTML={{ __html: `${numberToLetter(i)}、<span style="display:inline-block">${renderToKatex((backfromZmStandPrev(option, 'createHw')))}</span>` }}
                    />
                  ))} */}
                  {/* <QuestionContent>
                    {
                      (question.templateType === 1 && question.children)
                      ? ''
                      : <Analysis
                        isShow={showAnalysis && !isNewType}
                        showAnswer={question.answerList && question.answerList.length > 0}
                        optional={question.optionList && question.optionList.filter((iit) => filterHtmlForm(iit)).length > 0}
                        answerList={question.answerList}
                        analysis={question.analysis}
                      />
                    }
                  </QuestionContent> */}
                  {konwledgeAndExamPoint('parent', '', question.title)}
                </TabPane>
                {question.templateType === 1 && question.children && question.children.map((e, index) => {
                  let optionsList = fromJS(e.optionList || []);
                  if (question.typeId === 50) { // 听力题 的复合题子题
                    optionsList = fromJS(e.optionElementList || []).map((it) => it.set('type', contentTypeMap.get(String(it.get('optionElementType')))).set('value', it.get('optionElementContent')));
                  }
                  // console.log(e, 'optionsList --- optionsList');
                  return <TabPane tab={`子题${index + 1}`} key={index}>
                    <QuestionContent className="zm-question-item-wrapper">
                      <ChildrenItem
                        i={index}
                        title={e.title}
                        typeId={e.typeId}
                        childOptionList={optionsList}
                        childrenItem={e}
                        indexType="(__$$__)"
                      />
                    </QuestionContent>
                    <QuestionContent>
                      <Analysis
                        isShow={showAnalysis}
                        showAnswer={e.answerList && e.answerList.length > 0}
                        optional={e.optionList && e.optionList.filter((iit) => filterHtmlForm(iit)).length > 0}
                        answerList={e.answerList}
                        analysis={e.analysis}
                      />
                      {konwledgeAndExamPoint('children', e.id, e.title, index)}
                    </QuestionContent>
                  </TabPane>;
                })}
              </Tabs>
            </TabPaneWrapper>
            <FlexCenter>
              <Button style={{ textAlign: 'center', marginRight: 10 }} onClick={close}>{cancelText || '取消'}</Button>
              <Button type="primary" style={{ textAlign: 'center' }} htmlType="submit" loading={this.state.loading}>完成</Button>
            </FlexCenter>
          </Form>
        </Modal>
        {showTree.show ? renderTree() : ''}
      </div>
    );
  }
}

QuestionTag.propTypes = {
};

// QuestionTag = Form.create()(QuestionTag);
export default Form.create()(QuestionTag);
