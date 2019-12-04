/* eslint-disable */
import React, { Component } from 'react';
import AppLocalStorage from 'utils/localStorage';
import { message } from 'antd';
import { fromJS } from 'immutable';
import moment from 'moment';

// import FontAwesome from 'react-fontawesome';
import QuestionSearch from '../../QuestionSearch';
import { RootWrapper, Wrapper } from '../elementStyle/shareStyle';
import {
  getKonwLeadgeList,
  getQuestionsList,
  getGradeData,
  getProvince,
  getCity,
  getDistrict,
  getPhaseSubjectList,
  getExamPoint,
} from '../server';
import EditItemQuestion from 'components/EditItemQuestion/index';
import QuestionTag from 'components/QuestionTag';
// import { FlexColumnDiv, FlexRowDiv } from 'components/Div';
import { ingadoToArr, pointToUnity } from 'components/CommonFn/index';

import {
  typeList as typeListOri,
  examType as examTypeOri,
} from 'utils/zmConfig';
import appInfo, { zmTagToHtml } from '../appInfo';
import {
  TitleBar,
  ActionBar,
  SubmitBtn,
  CancelBtn,
} from './elementStyle/questionPickerStyle';
import {
  validateClassifyAndMatch,
  validateSavedQuestion,
} from 'components/EditItemQuestion/common';
import questionApi from 'api/qb-cloud/question-endpoint';
import reqBurial from 'api/other/burial-point';
// import burialPoint from '../../../utils/burialPoint';

const examType = Object.keys(examTypeOri).map(key => {
  return { id: key, name: examTypeOri[key] };
});
examType.unshift({ id: '', name: '全部' });

const typeList = Object.keys(typeListOri).map(key => {
  return { id: key, name: typeListOri[key] };
});
typeList.unshift({ id: '', name: '全部' });

// const optionLables = 'ABCDEFGHIJK'.split('');
// const hasRealValue = (list) => {
//   const optionList = list.filter(it => it);
//   let hasRealVal = false;
//   optionList.map(it => {
//     if (it) {
//       hasRealVal = true;
//     }
//   });
//   return hasRealVal;
// };

const yearOption = () => {
  const curyear = moment().format('YYYY');
  let options = [{ id: '', name: '全部' }];
  for (let i = 0; i < 10; i++) {
    let val = curyear - i;
    options.push({
      id: val,
      name: String(val),
    });
  }
  return options;
};

export default class QuestionPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 左侧年级学科筛选
      filterSubject: null,
      filterSubjectOptions: [],
      activeFilterOptions: null,

      // 左侧知识元目录列表及加载状态
      loadingLeftNav: false,
      featureInfoContents: [],

      // 右侧筛选
      filterDifficult: null,
      filterDifficultsOptions: [],
      filterTypes: null,
      filterGrade: null,
      filterYear: null,
      filterTerm: null,
      filterProvince: null,
      filterCity: null,
      filterDistrict: null,
      filterTypeList: null,
      filterExamType: null,
      // 常量
      yearOptions: yearOption(),
      formTermList: [
        { id: '', name: '全部' },
        { id: 1, name: '上学期' },
        { id: 2, name: '下学期' },
        { id: 3, name: '暑假' },
        { id: 4, name: '寒假' },
      ],

      // 右侧查询结果
      loadingContent: false,
      questionsList: [],

      // 选中的问题
      pickedQuestion: null,
      newQuestion: fromJS({}),
      visible: true,
      subjectListWithGrade: [],
      pointList: fromJS({
        knowledgeIdList: [],
        examPointIdList: [],
      }),
      isSendDataReady: false,
      defaultMessageGradeIdSubjectId: null,
    };

    this.filterNavLeft = this.filterNavLeft.bind(this);
    this.takeFilterOptions = this.takeFilterOptions.bind(this);
    this.toggleCascade = this.toggleCascade.bind(this);
    this.pickCascadeItem = this.pickCascadeItem.bind(this);
    this.filterFeatureSlides = this.filterFeatureSlides.bind(this);
    this.changeQuestionEditState = this.changeQuestionEditState.bind(this);
    this.closeOrOpenItemQuestion = this.closeOrOpenItemQuestion.bind(this);
    this.makeEditOrAddQuestion = this.makeEditOrAddQuestion.bind(this);
    this.setClickTargetAction = this.setClickTargetAction.bind(this);
    this.setNewQuestionData = this.setNewQuestionData.bind(this);
    this.submitSingleQuestion = this.submitSingleQuestion.bind(this);
    this.selectQuestion = this.selectQuestion.bind(this);
    this.openOrCloseTagWindow = this.openOrCloseTagWindow.bind(this);
    this.iframeListener = this.iframeListener.bind(this);
    this.cancelPick = this.cancelPick.bind(this);
    this.sendData = this.sendData.bind(this);
    this.getQuestionsMsg = this.getQuestionsMsg.bind(this);
    this.getSearchParams = this.getSearchParams.bind(this);
  }

  componentDidMount() {
    this.setState({ loadingSubject: true });
    // 获取科目信息
    getPhaseSubjectList().then(res => {
      const { code, data } = res;
      code != '0' // eslint-disable-line
        ? window.zmAlert(res.message || '获取年级科目信息出错')
        : this.setState({
            filterSubjectOptions: data,
            loadingSubject: false,
          });
    });
    // 难度信息
    this.setState({
      filterDifficultsOptions: [
        { code: ' ', value: '全部' },
        { code: '1', value: '一级' },
        { code: '2', value: '二级' },
        { code: '3', value: '三级' },
        { code: '4', value: '四级' },
        { code: '5', value: '五级' },
      ],
    });
    // 获取年级
    getGradeData().then(res => {
      const { code, data } = res;
      data && data.unshift({ id: '', value: '全部' });
      code != '0' // eslint-disable-line
        ? window.zmAlert(res.message || '获取年级出错')
        : this.setState({ gradeData: data });
    });
    // 获取省份
    getProvince().then(res => {
      const { code, data } = res;
      data && data.unshift({ id: '', value: '全部' });
      code != '0' // eslint-disable-line
        ? window.zmAlert(res.message || '获取省份出错')
        : this.setState({ provinceData: data });
    });
    // 测试postmessage
    if (location.pathname.indexOf('iframe') > -1) {
      this.sendData({
        action: 'ready',
        data: {
          origin: 'tr',
        },
      });
      window.removeEventListener('message', this.iframeListener);
      window.addEventListener('message', this.iframeListener);
    }
  }
  componentWillUnmount() {
    window.removeEventListener('message', this.iframeListener);
  }

  // 根据当前正在显示的过滤项切换过滤项的展示隐藏
  takeFilterOptions(options, event) {
    event.stopPropagation();
    const _activeOptions =
      options != this.state.activeFilterOptions ? options : null;
    this.setState({
      activeFilterOptions: _activeOptions,
    });
  }

  // 点击年级科目，获取知识点
  pickSubject(item) {
    this.state.activeSubject = item; // eslint-disable-line react/no-direct-mutation-state
    this.setState({ loadingFeatures: true });
    getKonwLeadgeList(item.id).then(res => {
      const { code, data } = res;
      code != '0' // eslint-disable-line
        ? window.zmAlert(res.message || '根据年级科目获取知识点失败')
        : this.setState({
            featureInfoContents: data || [],
            loadingFeatures: false,
          });
    });
  }

  // 左侧目录折叠展开
  toggleCascade(item, level) {
    item.open = !item.open;
    item.children.forEach(it => (it.checkChildren = true)); // eslint-disable-line
    this.setState({});
  }

  // 点击具体知识点，获取相应的题目
  pickCascadeItem(item) {
    const newFilter = item != this.state.activeFilterResult; // eslint-disable-line
    this.state.activeFilterResult = item; // eslint-disable-line react/no-direct-mutation-state
    this.setState({ loadingContent: newFilter, activeFilterOptions: null });
    newFilter && this.fetchQuestions();
  }

  // select过滤选项
  filterNavLeft(type, item, event) {
    event.stopPropagation();
    const newFilter = item != this.state[type]; // eslint-disable-line
    this.state[type] = item; // eslint-disable-line react/no-direct-mutation-state
    this.setState({ loadingLeftNav: newFilter, activeFilterOptions: null });
    newFilter && this.filterFeatureInfo();
  }

  // 根据过滤条件获取知识元目录
  filterFeatureInfo() {
    const { filterSubject } = this.state;
    if (pointToUnity(filterSubject.subjectId)) {
      getExamPoint(filterSubject.id).then(res => {
        const { code, data } = res;
        code != '0' // eslint-disable-line
          ? window.zmAlert(res.message || '目获取考点失败')
          : this.setState({
              featureInfoContents: data || [],
              loadingLeftNav: false,
            });
      });
    } else {
      getKonwLeadgeList(filterSubject.id).then(res => {
        const { code, data } = res;
        code != '0' // eslint-disable-line
          ? window.zmAlert(res.message || '目获取知识点失败')
          : this.setState({
              featureInfoContents: data || [],
              loadingLeftNav: false,
            });
      });
    }
  }

  // 右侧过滤项筛选
  filterFeatureSlides(type, item, event) {
    if (type == 'filterProvince') {
      if (!item.id) {
        this.setState({
          cityData: null,
          districtData: null,
          filterCity: null,
          filterDistrict: null,
        });
      }
      getCity(item.id).then(res => {
        const { code, data } = res;
        data && data.unshift({ id: '', value: '全部' });
        code != '0' // eslint-disable-line
          ? window.zmAlert(res.message || '获取城市出错')
          : this.setState({
              cityData: data,
              filterCity: null,
              filterDistrict: null,
            });
      });
    }
    if (type == 'filterCity') {
      if (!item.id) {
        this.setState({ districtData: null, filterDistrict: null });
      }
      getDistrict(item.id).then(res => {
        const { code, data } = res;
        data && data.unshift({ id: '', value: '全部' });
        code != '0'
          ? window.zmAlert(res.message || '获取城市出错')
          : this.setState({ districtData: data, filterDistrict: null });
      });
    }
    event.stopPropagation();
    const newFilter = item != this.state[type];
    this.setState({ [type]: item, activeFilterOptions: null });
    // newFilter && this.fetchQuestions();
  }

  // 获取题目
  fetchQuestions(scrollAction) {
    if (this.fetchQuestions.onRequest) return;
    if (!scrollAction) this.fetchQuestions.lastPageIndex = 0;
    const {
      filterDifficult,
      filterTypes,
      queryKey = '',
      activeFilterResult,
      filterGrade,
      filterYear,
      filterTerm,
      filterProvince,
      filterCity,
      filterDistrict,
      filterTypeList,
      filterExamType,
    } = this.state;
    const lastPageIndex = (this.fetchQuestions.lastPageIndex =
      (this.fetchQuestions.lastPageIndex || 0) + 1);
    const childrenKnowledgeIdList = ingadoToArr(activeFilterResult.children);
    childrenKnowledgeIdList.unshift(activeFilterResult.id);
    // console.log('activeFilterResult', childrenKnowledgeIdList)
    const knowledgeIds = childrenKnowledgeIdList || [];

    const queryOption = {
      // knowledgeIds,
      keyword: queryKey,
      pageIndex: scrollAction == true ? lastPageIndex : 1,
      pageSize: 20,
      typeId: (filterTypes && (filterTypes.id || filterTypes.code)) || '',
      difficulty:
        (filterDifficult && (filterDifficult.id || filterDifficult.code)) || '',
    };
    if (pointToUnity(this.state.filterSubject.subjectId)) {
      queryOption.examPointIds = knowledgeIds;
    } else {
      queryOption.knowledgeIds = knowledgeIds;
    }
    filterGrade ? (queryOption.gradeId = filterGrade.id) : '';
    filterTerm ? (queryOption.termId = filterTerm.id) : '';
    filterYear ? (queryOption.year = filterYear.id) : '';
    filterProvince ? (queryOption.provinceId = filterProvince.id) : '';
    filterCity ? (queryOption.cityId = filterCity.id) : '';
    filterDistrict ? (queryOption.countyId = filterDistrict.id) : '';
    filterTypeList ? (queryOption.examPaperTypeId = filterTypeList.id) : '';
    filterExamType ? (queryOption.examTypeId = filterExamType.id) : '';
    this.setState({ loadingContent: true });
    this.fetchQuestions.onRequest = true;
    getQuestionsList(queryOption).then(res => {
      this.fetchQuestions.onRequest = false;
      const { code, data } = res;
      data &&
        data.data &&
        data.data.forEach(item => {
          item.pureHtml = zmTagToHtml(item.title);
          item.optionList &&
            item.optionList.length &&
            (item.pureOptionList = item.optionList.map(opt =>
              zmTagToHtml(opt),
            ));
        });
      if (code != '0') {
        window.zmAlert(res.message || '获取题目失败');
        return;
      }
      const resData = ((data && data.data) || [])
        .map(item => {
          let repeated = false;
          this.state.questionsList.forEach((question, index) => {
            question.id == item.id && scrollAction == true && (repeated = true);
          });
          return repeated ? null : item;
        })
        .filter(item => item != null);
      const questionsList =
        scrollAction == true
          ? this.state.questionsList.concat(resData)
          : resData;
      this.setState({
        questionsList,
        loadingContent: false,
      });
    });
  }

  // 选中题目
  selectQuestion(item) {
    this.setState({ pickedQuestion: item });
  }

  // 滑动到底部,获取更多内容
  checkScrollEnd(event) {
    const target = event.target;
    if (!target) return;
    const { scrollTop, offsetHeight, scrollHeight } = target;
    if (scrollHeight - offsetHeight - scrollTop < 10) {
      this.fetchQuestions(true);
    }
  }

  submitPickedItem() {
    const { pickedQuestion } = this.state;
    // 如果点击"确认“后，选择了题目，则埋点
    if (pickedQuestion) {
      // 埋点
      const startTime = Date.now();
      this.burialPoint({
        startTime,
        ...pickedQuestion,
        ...this.questionsMsg,
        ...this.searchParams,
      });
    }
    if (location.pathname.indexOf('iframe') > -1) {
      if (pickedQuestion) {
        let postData = {
          action: 'setQuestionItem',
          data: pickedQuestion,
        };
        if (this.state.isSendDataReady) {
          this.sendData(postData);
        } else {
          zmAlert({ content: '握手失败' });
        }
      } else {
        zmAlert({ content: '请选择题目' });
      }
    } else {
      if (pickedQuestion) {
        appInfo.pickQuestion(pickedQuestion);
      } else {
        zmAlert({
          content: '请选择题目',
        });
      }
    }
  }
  // 埋点获取题目列表信息，如页数等
  getQuestionsMsg(questionsMsg) {
    //   console.log('questionsMsg', questionsMsg);
    this.questionsMsg = questionsMsg;
  }
  // 埋点获取查询参数
  getSearchParams(searchParams) {
    // console.log('searchParams', searchParams);
    // debugger;
    searchParams && (this.searchParams = searchParams);
  }
  // 埋点方法
  burialPoint({ pageNum, pages, size, id, starttime, keyword }) {
    const UserId = AppLocalStorage.getUserId();
    const UserName = AppLocalStorage.getUserName();
    const data = {
      starttime: starttime || '',
      user_id: UserId || '',
      user_name: UserName || '',
      pageNum: pageNum || '',
      pages: pages || '',
      size: size || '',
      pickedQuestionId: id || '',
      keyword: keyword || '',
    };
    console.log('burial-data', data);
    reqBurial(data);
  }
  // 取消按钮
  cancelPick() {
    if (location.pathname.indexOf('iframe') > -1) {
      if (this.state.isSendDataReady) {
        this.sendData({ action: 'cancel' });
      } else {
        zmAlert({ content: '握手失败' });
      }
    } else {
      appInfo.pickQuestion();
    }
  }
  // iframe握手
  iframeListener(e) {
    // console.log(e.data);
    let isMessageSource = e.data.action && e.data.data.origin === 'courseWare';
    if (isMessageSource && e.data.action === 'ready') {
      this.sendData({
        action: 'allReady',
        data: {
          origin: 'tr',
        },
      });
      this.setState({ isSendDataReady: true });
    }
    if (isMessageSource && e.data.action === 'setGradeIdSubjectId') {
      this.setState({ defaultMessageGradeIdSubjectId: e.data.data });
    }
  }
  // postMessage
  sendData(data) {
    if (data) {
      window.parent.postMessage(data, '*');
    }
  }

  changeQuestionEditState(val) {
    this.closeOrOpenItemQuestion(false);
    this.setState({
      newQuestion: fromJS({}),
    });
  }

  // 开关新增题目面板
  closeOrOpenItemQuestion(isOpen) {
    this.setState({
      showItemQuestion: isOpen,
    });
  }

  // 同步输入内容
  setClickTargetAction(str) {
    this.setState({
      clickTarget: str,
    });
  }
  setNewQuestionData(data) {
    this.setState({
      newQuestion: data,
    });
  }

  // 单题录入弹框
  makeEditOrAddQuestion() {
    const { clickTarget, newQuestion, questionEditState } = this.state;
    const isComplexQ = [5, 6].includes(newQuestion.get('templateType'));
    return (
      <EditItemQuestion
        isOpen
        questionEditState={questionEditState || 0}
        newQuestion={newQuestion}
        curTagQ={isComplexQ ? this.state.complexQ : newQuestion}
        clickTarget={clickTarget}
        setNewQuestionData={data => this.setNewQuestionData(data)}
        changeQuestionEditState={val => this.changeQuestionEditState(0)}
        setClickTarget={str => this.setClickTargetAction(fromJS(str))}
        soucre="questionPicker"
        source2="zmlPicker"
        submitQuestionItem={type => {
          const typeId = newQuestion.get('typeId');
          if ([5, 6].includes(newQuestion.get('templateType'))) {
            const response =  validateClassifyAndMatch(newQuestion);
            if (response.errorMsg) {
              message.warning(response.errorMsg || '录入有误，请检查');
              return false;
            } else {
              this.setState({
                complexQ: response.data,
              });
            }
          } else {
            const errorMsg = validateSavedQuestion(newQuestion);
            if (errorMsg) {
              message.info(errorMsg);
              return false;
            }
          }
          // 如果是 预览 就不打开贴标签弹窗
          if (!(type == 'view')) {
            this.openOrCloseTagWindow(true);
            this.setState({
              visible: true,
            })
          }
          return true;
        }}
      />
    );
  }

  async submitSingleQuestion(tags, newQuestion) {
    const res = await questionApi.saveQuestion(
      Object.assign(newQuestion, tags),
    );
    const { code, data } = res;
    console.log('保存题目返回数据', res);
    code != '0'
      ? window.zmAlert(res.message || '保存单题出错')
      : this.setState({ saveSingleQuestionResp: data });
    if (data) {
      this.setState({
        visible: false,
        showQuestionTag: false,
        showItemQuestion: false,
        newQuestion: fromJS({}),
      });
      if (location.pathname.indexOf('iframe') > -1) {
        if (this.state.isSendDataReady) {
          let postData = {
            action: 'setQuestionItem',
            data: data,
          };
          this.sendData(postData);
        } else {
          zmAlert({ content: '握手失败' });
        }
      } else {
        appInfo.pickQuestion(data);
      }
    } else {
      zmAlert({ content: res.message || '保存单题出错' });
    }
  }

  // 展示标签
  makeEditQuestionTag() {
    const { visible } = this.state;
    return (
      <QuestionTag
        question={this.state.newQuestion.toJS()}
        visible={visible}
        close={bool => {
          this.setState({
            visible: false,
          });
          this.closeOrOpenItemQuestion(true);
        }}
        submitTags={tags => {
          const templateType = this.state.newQuestion.get('templateType');
          const isComplex = ['5', '6'].includes(String(templateType));
          this.submitSingleQuestion(
            tags,
            isComplex
              ? this.state.complexQ.toJS()
              : this.state.newQuestion.toJS(),
          );
        }}
      />
    );
  }

  openOrCloseTagWindow(bool) {
    this.setState({
      showQuestionTag: bool,
    });
  }

  render() {
    const {
      // filterSubject, filterSubjectOptions, activeFilterOptions,
      // loadingLeftNav, featureInfoContents = [], activeFilterResult,
      // filterDifficult, filterDifficultsOptions, filterTypes, queryKey,
      loadingContent,
      questionsList,
      pickedQuestion,
      showItemQuestion,
      showQuestionTag,
      gradeData,
      filterGrade,
      // filterYear, yearOptions, formTermList, filterTerm, provinceData,
      // filterProvince, cityData, filterCity, districtData, filterDistrict,
      // filterTypeList, filterExamType
    } = this.state;
    let { gradeId, subjectId, phaseSubjectId } = this.props;
    // 如果是iframe 且传入了年级学科 则使用传入的年级学科做为默认
    if (
      location.pathname.indexOf('iframe') > -1 &&
      this.state.defaultMessageGradeIdSubjectId
    ) {
      gradeId = this.state.defaultMessageGradeIdSubjectId.gradeId;
      subjectId = this.state.defaultMessageGradeIdSubjectId.subjectId;
    }
    console.log(gradeId, subjectId, this.state.defaultMessageGradeIdSubjectId);

    const hideFilterBox = () => this.setState({ activeFilterOptions: null });

    return (
      <RootWrapper style={{ padding: '50px 5px' }}>
        {showItemQuestion ? this.makeEditOrAddQuestion() : ''}
        {showQuestionTag ? this.makeEditQuestionTag() : ''}
        <TitleBar>选择题目</TitleBar>
        <Wrapper onClick={hideFilterBox}>
          {/* 传入 gradeId 以及 subjectId 则不需要 phaseSubjectId，反之亦然.（数据三个数据有谁传谁，使用时权重: phaseSubjectId > gradeId > subjectId） */}
          <QuestionSearch
            gradeId={gradeId || null}
            subjectId={subjectId || null}
            phaseSubjectId={phaseSubjectId || null}
            source="zml"
            selectQuestion={this.selectQuestion}
            closeOrOpenItemQuestion={this.closeOrOpenItemQuestion}
            getQuestionsMsg={this.getQuestionsMsg}
            getSearchParams={this.getSearchParams}
          />
        </Wrapper>
        <ActionBar>
          <SubmitBtn
            active={pickedQuestion}
            onClick={this.submitPickedItem.bind(this)}
          >
            确认
          </SubmitBtn>
          <CancelBtn onClick={this.cancelPick.bind(this)}>取消</CancelBtn>
        </ActionBar>
      </RootWrapper>
    );
  }
}
