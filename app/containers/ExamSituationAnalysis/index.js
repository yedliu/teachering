import React from 'react';
import { Spin, message, BackTop  } from 'antd';
import { OuterWrapper } from './styles';
import FilterBar from './components/FilterBar';
import ModuleAnalysis from './components/ModuleAnalysis';
import TableCharts from './components/tableCharts';
import _ from 'lodash';
import { getFieldsData, getCity, getProvince, getModuleReport,
  getKnowledgeReport, getDifficultReport, getDifficultTrend, getQuestionTypeReport, getOneQuestion,
  getQuestionDetail } from './server';
import QuestionDetail from './components/QuestionDetail';
import { NumberToChinese } from 'utils/helpfunc';
let chartsResize = null;
let charts = [];
class ExamSituationAnalysis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterData: {
        subject: [],
        grade: [],
        year: [],
        term: [],
        examType: [],
        provinceList: [],
        cityList: []
      },
      loading: false,
      questionDetailLoading: false,
      ...this.initData,
      knowledgePage: 1,
      questionTypePage: 1
    };
    this.moduleData = [];
    this.searchParams = {};
    this.questionIds = [];
    this.initData = {
      columns: [],
      analysisData: {},
      knowledgeColumns: [],
      difficultyColumns: [],
      questionTypeColumns: [],
      showQuestionDetail: false,
      currentQuestion: {},
      moduleReport: null,
      knowledgeReport: null,
      difficultReport: null,
      difficultTrend: null,
      questionTypeReport: null,
    };
  }
  componentDidMount() {
    getFieldsData().then(res => {
      Object.keys(res).forEach(item => {
        this.setFilterData(item, res[item]);
      });
    });
    getProvince().then(res => {
      if (res) {
        this.setFilterData('provinceList', res);
      }
    });
  }
  componentWillUnmount() {
    if (chartsResize) {
      clearTimeout(chartsResize);
    }
  }

  /**
   * 选择省份
   * @param id:省份id
   */
  selectProvince=(id) => {
    if (id) {
      getCity(id).then(res => {
        if (res) {
          this.setFilterData('cityList', res);
        }
      });
    }
  }
  /**
   * 设置筛选数据
   * @param key：要设置的字段
   * @param value：对应的数据
   */
  setFilterData=(key, value) => {
    let filterData = this.state.filterData;
    filterData[key] = value;
    this.setState({ filterData });
  }
  /**
   * 根据筛选条件生成表头和获取表格数据
   * @param params
   */
  selectAllParams=(params) => {
    this.searchParams = params;
    this.handleColumns(params);
    this.setState({ loading: true, knowledgePage: 1, questionTypePage: 1 });
    let count = 0;
    // 获取模块分析
    getModuleReport(params).then(res => {
      this.moduleData = res.analysisReportList;
      let  moduleReport =  this.handleChartData(res, 'quModuleName');
      this.setState({ moduleReport });
      count += 1;
      this.closeLoading(count);
    }).catch(() => {
      count += 1;
      this.closeLoading(count);
    });
    // 获取知识点分析
    getKnowledgeReport(params).then(res => {
      let list = this.handleReportData(res, 'quKnowledgeName');
      this.setState({ knowledgeReport: list });
      count += 1;
      this.closeLoading(count);
    }).catch(() => {
      console.log('error');
      count += 1;
      this.closeLoading(count);
    });
    // 获取难度
    getDifficultReport(params).then(res => {
      let list =  this.handleReportData(res, 'quDifficulty', true);
      this.setState({ difficultReport: list });
      count += 1;
      this.closeLoading(count);
    }).catch(() => {
      count += 1;
      this.closeLoading(count);
    });
    // 获取难度趋势
    getDifficultTrend(params).then(res => {
      let difficultTrend = this.handleChartData(res, 'year');
      this.setState({ difficultTrend });
      count += 1;
      this.closeLoading(count);
    }).catch(() => {
      count += 1;
      this.closeLoading(count);
    });
    // 获取题型报告
    getQuestionTypeReport(params).then(res => {
      let list = this.handleReportData(res, 'quTypeName', true);
      this.setState({ questionTypeReport: list });
      count += 1;
      this.closeLoading(count);
    }).catch(() => {
      count += 1;
      this.closeLoading(count);
    });
  }
  /**
   * 根据筛选条件生成表头
   * @param params
   */
  handleColumns = (params) => {
    let columns = [];
    let startYear = params.startYear;
    let endYear = params.endYear;
    for (let i = Number(startYear); i <= endYear; i++) {
      columns.push({
        title: `${i}年`,
        dataIndex: i,
        key: i,
        render: (text, record) => {
          return record.name !== '总计'
            ? (<span onClick={() => { this.showQuestionDetail(record, i) }} style={{ cursor: 'pointer', color: '#108ee9' }}>{record[`${i}`]}</span>) :
            <span>{record[`${i}`]}</span>;
        }
      });
    }
    columns.push({
      title: '总计题数',
      dataIndex: 'total',
      key: 'total'
    });
    let knowledgeColumns = this.handleFirstColumn({
      title: '知识点',
      dataIndex: 'name',
      key: 'name'
    }, columns);
    let difficultyColumns = this.handleFirstColumn({
      title: '难度等级',
      dataIndex: 'name',
      key: 'name'
    }, columns);
    let questionTypeColumns = this.handleFirstColumn({
      title: '题型',
      dataIndex: 'name',
      key: 'name'
    }, columns);
    this.setState({ knowledgeColumns, difficultyColumns, questionTypeColumns });
  }
  /**
   * 生成表格第一列
   * @param obj
   * @param columns
   * @returns {*}
   */
  handleFirstColumn=(obj, columns) => {
    let targetColumns = _.cloneDeep(columns);
    targetColumns.unshift(obj);
    return targetColumns;
  }
  /**
   * 处理echarts根据屏幕宽度自适应
   * @param myChart
   */
  handleChartsResize = (myChart) => {
    if (!myChart) return;
    charts.push(myChart);
    if (!chartsResize) {
      chartsResize = setTimeout(function () {
        window.onresize = function () {
          charts.forEach(item => {
            item.resize();
          });
        };
      }, 300);
    }
  }
  /**
   * 获取题目详情
   * @param record
   */
  showQuestionDetail = (record, year) => {
    console.log(record);
    let queryParams = {
      resportParam: this.searchParams
    };
    switch (record.type) {
      case 'quModuleId':
        queryParams.quModuleId = record.quModuleId;
        queryParams.queryType = 'module';
        break;
      case 'quKnowledgeName':
        queryParams.quKnowledgeId = record.quKnowledgeId;
        queryParams.queryType = 'knowledge';
        queryParams.year = year;
        break;
      case 'quDifficulty':
        queryParams.quDifficulty = record.difficulty;
        queryParams.queryType = 'difficulty';
        queryParams.year = year;
        break;
      default:
        queryParams.quTypeId = record.quTypeId;
        queryParams.queryType = 'quType';
        queryParams.year = year;
    }
    this.setState({ loading: true });
    getQuestionDetail(queryParams).then(res => {
      if (res.length > 0) {
        this.questionIds = res;
        getOneQuestion({ id: res[0] }).then(res => {
          console.log(res, 'res');
          if (res.id) {
            this.setState({ showQuestionDetail: true, currentQuestion: res, loading: false });
          } else {
            throw new Error('没有题目数据');
          }
        }).catch(() => {
          message.warning('没有题目数据');
          this.setState({ loading: false });
        });
      } else {
        throw new Error('没数据');
      }
    }).catch(() => {
      this.setState({ loading: false });
      message.warning('没有题目数据');
    });
  }
  // 求和
  sum = (arr) => {
    let res = arr.reduce(function(accumulator, currentValue) {
      return accumulator + currentValue;
    });
    return res;
  }
  // 处理乱七八糟的返参
  handleReportData = (res, key, showSumRow) => {
    if (res.analysisReportList.length === 0) return;
    let list = [];
    let sumRow = { name: '总计', total: 0, id: 'sum' };
    let sumRowResults = Array(res.analysisReportList[0].statisticData.years.length).fill(0);
    res.analysisReportList.forEach((item, index) => {
      let obj = {
        id: index,
        name: item[key],
        total: this.sum(item.statisticData.statisticDatas),
        type: key
      };
      sumRow.total += obj.total;
      switch (key) {
        case 'quDifficulty':
          obj.name = NumberToChinese(obj.name);
          obj.difficulty = item[key];
          break;
        case 'quTypeName':
          obj.quTypeId = item.quTypeId;
          break;
        case 'quKnowledgeName':
          obj.quKnowledgeId = item.quKnowledgeId;
          break;
      }
      sumRowResults.forEach((item1, index1) => {
        sumRowResults[index1] += item.statisticData.statisticDatas[index1];
      });
      item.statisticData.years.forEach((it, i) => {
        obj[it] = item.statisticData.statisticDatas[i];
        sumRow[it] = sumRowResults[i];
      });
      list.push(obj);
    });
    showSumRow && list.push(sumRow);
    return list;
  }
  handleChartData = (res, key) => {
    if (res.analysisReportList.length === 0) return;
    let labels = [];
    let counts = [];
    res.analysisReportList.forEach((item, index) => {
      labels.push(item[key]);
      counts.push(item.statisticData.statisticDatas[0] || 0);
    });
    let report = {
      labels,
      counts
    };
    return report;
  }
  // 关loading
  closeLoading=(count) => {
    if (count === 5) {
      this.setState({ loading: false });
    }
  }
  // 题目翻页
  onPageChange=(value) => {
    console.log(value);
    let id = this.questionIds[value - 1];
    this.setState({ questionDetailLoading: true });
    getOneQuestion({ id }).then(res => {
      this.setState({ currentQuestion: res, questionDetailLoading: false });
    });
  }
  // 清空数据
  initReportData=() => {
    this.setState({ ...this.initData });
  }
  render() {
    const { filterData, knowledgeColumns, difficultyColumns, questionTypeColumns,
      showQuestionDetail, currentQuestion, moduleReport, knowledgeReport, difficultReport,
      difficultTrend, questionTypeReport, questionDetailLoading, knowledgePage, questionTypePage } = this.state;
    return (
      <OuterWrapper>
        <Spin spinning={this.state.loading}>
          <FilterBar
            filterData={filterData}
            selectProvince={this.selectProvince}
            selectAllParams={this.selectAllParams}
            clearArea={() => { this.setFilterData('cityList', null) }}
            onSelectPaperType={this.initReportData}
          />
          <ModuleAnalysis
            resize={this.handleChartsResize}
            handleClick={(record) => { this.showQuestionDetail(record) }}
            data={moduleReport}
            sourceData={this.moduleData}
          />
          <TableCharts
            columns={knowledgeColumns}
            data={knowledgeReport}
            title="知识点分析"
            currentPage={knowledgePage}
            onChange={(e) => { this.setState({ knowledgePage: e.current }) }}
          />
          <TableCharts
            title="难度分析"
            columns={difficultyColumns}
            data={difficultReport}
            showCharts
            chartsData={difficultTrend}
            resize={this.handleChartsResize}
            hidePagination
          />
          <TableCharts
            title="题型分析"
            columns={questionTypeColumns}
            data={questionTypeReport}
            currentPage={questionTypePage}
            onChange={(e) => { this.setState({ questionTypePage: e.current }) }}
          />
        </Spin>
        {showQuestionDetail ?
          <QuestionDetail
            close={() => {
              this.setState({ showQuestionDetail: false, currentQuestion: {}});
              this.questionIds = [];
            }}
            questionData={currentQuestion}
            onPageChange={this.onPageChange}
            questionIds={this.questionIds}
            loading={questionDetailLoading}
          /> :
          null
        }
        <BackTop target={() => document.querySelector('.app-body')} style={{ bottom: '30px', right: '50px' }} />
      </OuterWrapper>
    );
  }
}
export default ExamSituationAnalysis;
