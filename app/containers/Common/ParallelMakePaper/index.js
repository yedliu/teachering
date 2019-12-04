import React from 'react';
import api from '../../../api/qb-cloud/sys-dict-end-point/queryNodesByGroup';
import PaperInfo from './PaperInfo';
import allFormListData from './allFormData';
import _ from 'lodash';
import { getPaperFields, getRequired } from '../../../utils/paperUtils';
import {
  getFieldsData,
  getCityData,
  getCountryData,
  getRecommendQuestionIds
} from './server';
import {
  handleDefaultPaperInfo,
  findType,
  toQuestionManage,
  isSuccessPickQuestions,
} from './utils';
import subjectEndPoint from '../../../api/qb-cloud/subject-end-point';
import { message, Spin } from 'antd';
import SystemInfo from './SystemInfo';
// formType 1：input,2: select
class ParallelMakePaper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teachingVersion: {
        data: [],
        selectedId: '',
        versionTreeData: [],
        versionValue: null, // 最终选择的节点
        showTeachingList: [], // 显示的所有包括父节点
      },
      courseSystem: {
        data: [],
        selectedId: '',
        systemTreeData: [],
        systemValue: null, // 最终选择的节点
        showSystemList: [], // 显示的所有包括父节点
      },
      currentFormData: [],
      queryNodes: [],
      allFormListData: [],
      needsFiles: [],
      showLoading: false,
      prePaperName: '',
      isShowInfo: false,
      result: [],
      submitArgs: [],
    };
  }
  async componentDidMount() {
    let allFormList = _.cloneDeep(allFormListData);
    const { selectPaper, paperType } = this.props;
    this.setState({ showLoading: true, prePaperName: selectPaper.name });
    let res = await api.queryExamPaperTypeV1();
    if (res.code === '0') {
      if (paperType === 1) {
        // 试卷上传页面，去掉心理测评
        let i = -1;
        res.data.forEach((item, index) => {
          if (item.itemCode === '20') {
            i = index;
          }
        });
        res.data.splice(i, 1);
      }
      this.setState({ queryNodes: res.data });
      let cb = await getFieldsData(allFormList, this, selectPaper);
      this.setState({ showLoading: false });
      if (selectPaper) {
        // 有默认值的情况
        let target = handleDefaultPaperInfo(selectPaper, cb);
        this.setState({ allFormListData: target }, () => {
          let typeId = selectPaper.typeId ? String(selectPaper.typeId) : null;
          this.handleSelect(typeId, 'paperTypeId', true);
          this.initCourseSystem(selectPaper);
          this.initTeachingVersion(selectPaper);
        });
      } else {
        this.setState({
          allFormListData: cb,
          currentFormData: [this.createFormData(cb, 'paperTypeId', res.data)],
        });
      }
    }
  }
  handleSelect = async (value, type, isFirst) => {
    let { queryNodes, allFormListData, currentFormData } = this.state;
    if (type === 'paperTypeId' && Boolean(value)) {
      // 根据试卷类型获取学科
      let subjects = await subjectEndPoint
        .getSubjectByExamPaperType({ examPaperType: value })
        .then(res => {
          if (res.code === '0') {
            return res.data;
          } else {
            message.warning(`${res.message}`);
            return [];
          }
        });
      // 修改试卷类型，更新表单内容
      let paperFields = getPaperFields(this.props.pageType)(value, queryNodes); // 需要的展示的字段
      let requiredFields = getRequired()(value, queryNodes); // 是否必填
      this.setState({ needsFiles: paperFields });
      // 如果手动改试卷类型，需要清空默认值
      if (!isFirst) {
        let cloneAllFormListData = _.cloneDeep(allFormListData);
        cloneAllFormListData.forEach((item, index) => {
          if (item.type !== 'paperTypeId' && item.type !== 'source') {
            cloneAllFormListData[index].value = undefined; // eslint-disable-line
          }
        });
        await this.setState({
          allFormListData: cloneAllFormListData,
          teachingVersion: {
            data: [],
            selectedId: '',
            versionTreeData: [],
            versionValue: null, // 最终选择的节点
            showTeachingList: [], // 显示的所有包括父节点
          },
          courseSystem: {
            data: [],
            selectedId: '',
            systemTreeData: [],
            systemValue: null, // 最终选择的节点
            showSystemList: [], // 显示的所有包括父节点
          },
        });
        allFormListData = this.state.allFormListData;
      }
      let targetFieldsList = [
        this.createFormData(allFormListData, 'paperTypeId', queryNodes),
      ]; // 目标表单
      allFormListData.forEach(item => {
        // 处理是否必填
        let key = item.type;
        if (item.type === 'name') {
          key = 'epName';
        }
        if (requiredFields[key]) {
          item.require = requiredFields[key];
        }
      });
      paperFields.forEach(item => {
        let key = item;
        if (item === 'name') {
          key = 'epName';
        }
        let obj = this.createFormData(allFormListData, key);
        if (obj.type === 'subjectId') {
          obj.data = subjects;
        }
        if (obj.type) {
          targetFieldsList.push(obj);
        }
      });
      this.setState({ currentFormData: targetFieldsList });
    } else {
      let cities = [];
      let countries = [];
      if (type === 'provinceId' && value) {
        cities = await getCityData(value);
        currentFormData.forEach((item, index) => {
          if (item.type === 'cityId') {
            currentFormData[index] = this.createFormData(
              allFormListData,
              'cityId',
              cities,
              -2,
            ); // eslint-disable-line
          }
          if (item.type === 'countyId') {
            currentFormData[index] = this.createFormData(
              allFormListData,
              'countyId',
              [],
              -2,
            ); // eslint-disable-line
          }
        });
      }
      if (type === 'cityId' && value) {
        countries = await getCountryData(value);
        currentFormData.forEach((item, index) => {
          if (item.type === 'countyId') {
            currentFormData[index] = this.createFormData(
              allFormListData,
              'countyId',
              countries,
              -2,
            ); // eslint-disable-line
          }
        });
      }
      currentFormData.forEach((item, index) => {
        if (item.type === type) {
          currentFormData[index] = this.createFormData(
            allFormListData,
            type,
            null,
            value,
          );
        }
      });
      this.setState({ currentFormData });
    }
  };
  createFormData = (allList, type, data, value) => {
    let target = findType(type, allList);
    let dataExist = [];
    if (!dataExist.includes(type) && data) {
      target.data = data;
    }
    value && (target.value = value);
    if (value === -2) {
      target.value = undefined; // eslint-disable-line
    }
    return target;
  };
  modalConfirm = (teachingVersion, courseSystem) => {
    this.setState({
      teachingVersion: teachingVersion.toJS(),
      courseSystem: courseSystem.toJS(),
    });
  };
  initCourseSystem = selectPaper => {
    if (selectPaper.examPaperCourseContent) {
      const {
        courseContentId,
        courseContentName,
        editionId,
        editionName,
      } = selectPaper.examPaperCourseContent;
      if (courseContentId) {
        const systemValue = {};
        systemValue.label = courseContentName;
        systemValue.value = String(courseContentId);
        let courseSystem = this.state.courseSystem;
        courseSystem.showSystemList = [{ name: courseContentName }];
        courseSystem.systemValue = systemValue;
        courseSystem.selectedId = String(editionId);
        courseSystem.editionName = editionName;
        this.setState({ courseSystem });
      }
    }
  };
  initTeachingVersion = selectPaper => {
    if (selectPaper.examPaperTextbook) {
      // 教材
      const {
        textbookName,
        textbookId,
        teachingEditionId,
        teachingEditionName,
      } = selectPaper.examPaperTextbook;
      if (textbookId) {
        const versionValue = {};
        versionValue.label = textbookName;
        versionValue.value = String(textbookId);
        selectPaper.versionValue = versionValue;
        let teachingVersion = {};
        teachingVersion.versionValue = versionValue;
        teachingVersion.teachingEditionName = teachingEditionName;
        teachingVersion.selectedId = String(teachingEditionId);
        this.setState({ teachingVersion });
      } else {
        selectPaper.versionValue = null;
      }
    }
  };
  handleSubmit = async (values, teachingVersion, courseSystem) => {
    let { currentFormData } = this.state;
    const { selectPaper, handleNext } = this.props;
    // 调接口拿组到的试卷
    let selectPaperId = selectPaper.id;
    // let res = await getParallelPaper(selectPaperId);
    this.setState({ showLoading: true });
    let res = await getRecommendQuestionIds({ examPaperId: selectPaperId });
    let result = isSuccessPickQuestions(res);
    this.setState({
      submitArgs: [values, teachingVersion, courseSystem, currentFormData, res, selectPaperId],
      showLoading: false
    });
    if (result[2] === 'fail') {
      message.warning('没有推荐的题目，组卷失败');
    } else if (result[2] === 'success') {
      // 若能顺利完成选题，则直接跳转至编辑页面；
      handleNext('success');
      toQuestionManage(
        values,
        teachingVersion,
        courseSystem,
        currentFormData,
        res,
        selectPaperId
      );
    } else if (result[2] === 'part') {
      this.setState({ isShowInfo: true, result });
    }
  };
  handleInfoOk = () => {
    let { handleNext } = this.props;
    handleNext('success');
    this.setState({ isShowInfo: false });
    toQuestionManage(...this.state.submitArgs);
  };
  handleInfoCancel = () => {
    this.setState({ isShowInfo: false });
    this.props.handleClose();
  };
  render() {
    const {
      teachingVersion,
      courseSystem,
      currentFormData,
      needsFiles,
      showLoading,
      prePaperName,
      isShowInfo,
      result,
    } = this.state;
    const { handleClose } = this.props;
    return (
      <div>
        <Spin spinning={showLoading}>
          <PaperInfo
            formList={currentFormData}
            handleSelect={this.handleSelect}
            needsFiles={needsFiles}
            teachingVersion={teachingVersion}
            courseSystem={courseSystem}
            modalConfirm={this.modalConfirm}
            handleClose={handleClose}
            handleNext={this.handleSubmit}
            prePaperName={prePaperName}
          />
        </Spin>
        {isShowInfo ? (
          <SystemInfo
            result={result}
            onOk={this.handleInfoOk}
            onCancel={this.handleInfoCancel}
          />
        ) : null}
      </div>
    );
  }
}
export default ParallelMakePaper;
