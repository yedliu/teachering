import React, { Component } from 'react';
import { Pagination } from 'antd';
import Slider from './component/Slider';
import Header from './component/Header';
import Content from './component/Content';
import Search from './component/Search';
import QuestionBasket from './component/QuestionBasket';
import { Warpper, ContentWrapper, Main } from './component/style';
import * as server from './server';

export default class QuestionPicker extends Component {
  state = {
    provinceList: [], // 省
    cityList: [], // 市
    countyList: [], // 区
    gradeList: [], // 年级
    yearList: [], // 年份
    termList: [], // 学期
    paperTypeList: [], // 试卷类型
    examTypeList: [], // 卷型
    questionTypeList: [], // 题型
    difficultyList: [], // 题目难度
    phaseSubjectList: [], // 学段学科
    knowledgeList: [], // 知识点
    phaseSubjectId: void 0,
    treeSelectedKeys: [],
    questionList: [],
    knowledgeTypeList: [],
    basket: this.props.basketList || [],
    total: 0,
    loading: false,
    sliderLoading: false,
    searchParams: {
      provinceId: void 0,
      cityId: void 0,
      countyId: void 0,
      gradeId: void 0,
      year: void 0,
      termId: void 0,
      examPaperTypeId: void 0,
      examTypeId: void 0,
      typeId: void 0,
      difficulty: void 0,
      keyword: void 0,
      id: void 0,
      knowledgeIds: [],
      pageIndex: 1,
      pageSize: 20,
      orderByFieldStr: ['quoteCount', 'updatedTime'],
      orderByDirectionStr: ['', ''],
      phaseId: void 0,
      subjectId: void 0,
      knowledgeType: void 0,
    }
  };

  componentDidMount() {
    this.init();
  }

  init = async () => {
    this.getPhaseSubject();
    const provinceList = await server.getProvince();
    const gradeList = await server.getGrade();
    const termList = await server.getTerm();
    const questionTypeList = await server.getQuestionType();
    const knowledgeTypeList = await server.getKnowledgeType();
    const {
      yearList,
      paperTypeList,
      examTypeList,
      difficultyList,
    } = await server.getDictData();
    this.setState({
      provinceList,
      gradeList,
      termList,
      yearList,
      paperTypeList,
      examTypeList,
      questionTypeList,
      difficultyList,
      knowledgeTypeList,
    });
  };

  showAnswer = questionId => {
    let questionList = this.state.questionList;
    questionList = questionList.map(el => {
      if (el.id === questionId) {
        el.showAnalysis = !el.showAnalysis;
      }
      return el;
    });
    this.setState({ questionList });
  };

  getSortData = () => {
    const { orderByFieldStr, orderByDirectionStr } = this.state.searchParams;
    const sortData = {};
    orderByFieldStr.forEach((el, index) => {
      sortData[el] = orderByDirectionStr[index] || '';
    });
    return sortData;
  };

  getKnowledge = async () => {
    const { phaseSubjectId, searchParams } = this.state;
    this.setState({ sliderLoading: true });
    const knowledgeList = await server.getKnowledge(phaseSubjectId);
    this.setState({ sliderLoading: false });
    if (knowledgeList.length > 0) {
      const lastChilren = this.getLastChildren(knowledgeList);
      const firstChildId = lastChilren.id;
      const knowledgeId = firstChildId ? firstChildId : knowledgeList[0].id;
      searchParams.knowledgeIds = [knowledgeId];
      this.setState(
        {
          knowledgeList,
          searchParams,
          treeSelectedKeys: [`${knowledgeId}`],
        },
        () => {
          this.getQuestion();
        },
      );
    }
  };

  pushOneQuestion = (data, onBasket) => {
    const { beforeAddToCart } = this.props;
    let { basket } = this.state;
    if (onBasket) {
      const id = data.id;
      basket = basket.filter(el => el.id !== id);
    } else {
      const result = typeof beforeAddToCart === 'function'
          ? beforeAddToCart(data)
          : true;
      const canInto = result === void 0 ? true : result;
      if (!canInto) return;
      basket.push(data);
    }
    this.setState({ basket });
  };

  pushAllQuestion = () => {
    const { basket, questionList } = this.state;
    const { beforeAddToCart } = this.props;
    const basketIds = basket.map(el => el.id);
    const notInBasketQuestions = questionList.filter(
      el => {
        const result = typeof beforeAddToCart === 'function'
          ? beforeAddToCart(el)
          : true;
        const canInto = result === void 0 ? true : result;

        return !basketIds.includes(el.id) && canInto;
      }
    );
    const newBasket = basket.concat(notInBasketQuestions);
    this.setState({ basket: newBasket });
  };

  clearQuestionByTypeId = typeId => {
    const { basket } = this.state;
    const newBasket = basket.filter(el => el.typeId !== typeId);
    this.setState({ basket: newBasket });
  };

  toggleAllQuestionAnswerStatus = flag => {
    let { questionList } = this.state;
    this.showAllAnswer = flag;
    questionList = questionList.map(el => {
      el.showAnalysis = this.showAllAnswer;
      return el;
    });
    this.setState({ questionList });
  };

  goPaperPage = () => {
    const { basket } = this.state;
    const { goPaperPage } = this.props;
    const data = basket.map(el => {
      el.showAnalysis = void 0;
      return el;
    });
    if (typeof goPaperPage === 'function') goPaperPage(data);
  };

  getLastChildren = data => {
    const defaultSelect = data[0];
    const children = defaultSelect.children;
    if (!children || children.length <= 0) {
      return defaultSelect;
    }
    return this.getLastChildren(children);
  };

  getPhaseSubject = async () => {
    const { searchParams } = this.state;
    const phaseSubjectList = await server.getPhaseSubject();
    if (phaseSubjectList.length > 0) {
      const phaseSubjectId = phaseSubjectList[0].id;
      searchParams.phaseId = phaseSubjectList[0].phaseId;
      searchParams.subjectId = phaseSubjectList[0].subjectId;

      this.setState({ phaseSubjectList, phaseSubjectId, searchParams }, () => {
        this.getKnowledge();
      });
    }
  };

  handlePhaseSubjectChange = phaseSubjectId => {
    const { phaseSubjectList, searchParams } = this.state;
    searchParams.phaseId = void 0;
    searchParams.subjectId = void 0;

    phaseSubjectList.some(item => {
      const flag = item.id === Number(phaseSubjectId);
      if (flag) {
        searchParams.phaseId = item.phaseId;
        searchParams.subjectId = item.subjectId;
      }
      return flag;
    });
    console.log(searchParams, 111111);
    this.setState({ phaseSubjectId, searchParams }, () => {
      this.getKnowledge();
    });
  };

  handleTreeChange = (treeSelectedKeys, selectData) => {
    const { searchParams } = this.state;
    if (treeSelectedKeys && treeSelectedKeys.length > 0) {
      const knowledgeIds = this.getKnowledgeIds(selectData);
      searchParams.knowledgeIds = knowledgeIds || [];
      this.setState({ treeSelectedKeys, searchParams }, () => {
        this.getQuestion();
      });
    }
  };

  handlePageChange = pageIndex => {
    const { searchParams } = this.state;
    searchParams.pageIndex = pageIndex;
    this.setState({ searchParams }, () => {
      this.getQuestion();
    });
  };

  changeSortType = (type, value) => {
    const { searchParams } = this.state;
    const { orderByFieldStr, orderByDirectionStr } = searchParams;
    const index = orderByFieldStr.indexOf(type);
    if (index !== -1) {
      const currentType = orderByDirectionStr[index] === value ? '' : value;
      orderByDirectionStr[index] = currentType;
    }
    searchParams.orderByDirectionStr = orderByDirectionStr;
    this.setState({ searchParams }, () => {
      this.getQuestion();
    });
  };

  getKnowledgeIds = data => {
    const ids = [];
    ids.push(data.id);
    _getKnowledgeIds(data.children);
    function _getKnowledgeIds(data) {
      if (!Array.isArray(data)) return;
      data.forEach(el => {
        ids.push(el.id);
        _getKnowledgeIds(el.children);
      });
    }
    return ids;
  };

  getCity = async () => {
    const provinceId = this.state.searchParams.provinceId;
    if (provinceId) {
      const cityList = await server.getCity(provinceId);
      this.setState({ cityList });
    }
  };

  getCountry = async () => {
    const cityId = this.state.searchParams.cityId;
    if (cityId) {
      const countyList = await server.getCounty(cityId);
      this.setState({ countyList });
    }
  };

  getQuestion = async () => {
    const { searchParams: params } = this.state;
    const searchParams = { ...params };
    const { includeTypeIdList, templateTypes } = this.props;
    if (Array.isArray(includeTypeIdList) && includeTypeIdList.length > 0) {
      searchParams.includeInfo = { includeTypeIdList };
    }
    if (templateTypes && templateTypes.length > 0) {
      searchParams.templateTypes = Array.isArray(templateTypes) ? templateTypes.join(',') : templateTypes;
    }
    searchParams.orderByFieldStr = (searchParams.orderByFieldStr || []).join(',');
    searchParams.orderByDirectionStr = (searchParams.orderByDirectionStr || []).join(',');
    searchParams.knowledgeIds = (searchParams.knowledgeIds || []).join(',');
    this.setState({ loading: true });
    const questionData = await server.getQuestion(searchParams);
    this.setState({ loading: false });
    const questionList = (questionData.data || []).map(el => {
      el.showAnalysis = this.showAllAnswer;
      return el;
    });
    this.setState({
      questionList: questionList || [],
      total: questionData.total || 0,
    });
  };

  handleChange = (key, value) => {
    const { searchParams } = this.state;
    searchParams[key] = value;
    this.setState({ searchParams }, () => {
      if (key === 'provinceId') {
        searchParams.cityId = void 0;
        searchParams.countyId = void 0;
        this.setState({ searchParams });
        this.getCity();
      }
      if (key === 'cityId') {
        searchParams.countyId = void 0;
        this.setState({ searchParams });
        this.getCountry();
      }
    });
  };
  render() {
    const {
      provinceList,
      cityList,
      countyList,
      gradeList,
      yearList,
      termList,
      paperTypeList,
      examTypeList,
      questionTypeList,
      difficultyList,
      searchParams,
      phaseSubjectList,
      phaseSubjectId,
      knowledgeList,
      treeSelectedKeys,
      questionList,
      knowledgeTypeList,
      total,
      basket,
      loading,
      sliderLoading,
    } = this.state;
    const {
      provinceId,
      cityId,
      countyId,
      gradeId,
      year,
      termId,
      examPaperTypeId,
      examTypeId,
      typeId,
      difficulty,
      keyword,
      knowledgeType,
      id,
      pageSize,
      pageIndex,
    } = searchParams;
    const sortData = this.getSortData();
    const { onClose, sliderTips, moduleName, title } = this.props;
    const basketIds = basket.map(el => el.id);
    const searchConfig = [
      {
        name: '省',
        type: 'select',
        key: 'provinceId',
        data: provinceList,
        value: provinceId,
      },
      {
        name: '市',
        type: 'select',
        key: 'cityId',
        data: cityList,
        value: cityId,
      },
      {
        name: '区',
        type: 'select',
        key: 'countyId',
        data: countyList,
        value: countyId,
      },
      {
        name: '年级',
        type: 'select',
        key: 'gradeId',
        data: gradeList,
        value: gradeId,
      },
      {
        name: '年份',
        type: 'select',
        key: 'year',
        data: yearList,
        value: year,
      },
      {
        name: '学期',
        type: 'select',
        key: 'termId',
        data: termList,
        value: termId,
      },
      {
        name: '试卷类型',
        type: 'select',
        key: 'examPaperTypeId',
        data: paperTypeList,
        value: examPaperTypeId,
      },
      {
        name: '卷型',
        type: 'select',
        key: 'examTypeId',
        data: examTypeList,
        value: examTypeId,
      },
      {
        name: '题型',
        type: 'select',
        key: 'typeId',
        data: questionTypeList,
        value: typeId,
      },
      {
        name: '难度',
        type: 'select',
        key: 'difficulty',
        data: difficultyList,
        value: difficulty,
      },
      {
        name: '知识点类型',
        type: 'select',
        key: 'knowledgeType',
        data: knowledgeTypeList,
        value: knowledgeType,
      },
      { name: '关键字', type: 'input', key: 'keyword', value: keyword },
      { name: '题目ID', type: 'input', key: 'id', value: id },
    ];

    return (
      <Warpper>
        <Header moduleName={moduleName} title={title} onClose={onClose} />
        <ContentWrapper>
          <Slider
            tips={sliderTips}
            loading={sliderLoading}
            treeData={knowledgeList}
            selectValue={phaseSubjectId}
            selectData={phaseSubjectList}
            selectedKeys={treeSelectedKeys}
            treeChange={this.handleTreeChange}
            selectChange={this.handlePhaseSubjectChange}
          />
          <Main>
            <Search
              total={total}
              data={searchConfig}
              sortData={sortData}
              onSearch={this.getQuestion}
              onChange={this.handleChange}
              changeSortType={this.changeSortType}
              pushAllQuestion={this.pushAllQuestion}
              onClickSwitch={this.toggleAllQuestionAnswerStatus}
            />
            <Content
              loading={loading}
              data={questionList}
              basketIds={basketIds}
              showAnswer={this.showAnswer}
              style={{ flex: 1, overflow: 'auto' }}
              pushOneQuestion={this.pushOneQuestion}
            />
            <Pagination
              total={total}
              current={pageIndex}
              pageSize={pageSize}
              style={{ textAlign: 'right' }}
              onChange={this.handlePageChange}
            />
          </Main>
          <QuestionBasket
            data={basket}
            handleClickFooter={this.goPaperPage}
            clearQuestionByTypeId={this.clearQuestionByTypeId}
          />
        </ContentWrapper>
      </Warpper>
    );
  }
}
