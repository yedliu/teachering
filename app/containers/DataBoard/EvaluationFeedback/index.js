import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Root } from './style';
import Header from './header';
import Content from './content';
import Report from './report';
import Detail from './detail';
import Question from './question';
import { getReportData, getReportProfile } from './server';


export default class EvaluationFeedback extends React.Component {
  state = {
    showReport: false, // 报告弹框
    showDetail: false, // 详情弹框
    showQuestion: false, // 题目弹框
    reportProfile: [], // 报道顶部统计数据
    reportData: [], // 报告列表数据
    reportLoading: false, // 报告 loading 状态
    reportTotal: 0, // 报告总数
    currentExamInfoId: void 0, // 当前查看报告或者详情的报告 Id
    params: {
      startTime: moment().subtract(6, 'days'), // 开始时间
      overTime: moment().subtract(0, 'days'), // 结束时间
      gradeId: void 0, // 年级
      subjectId: void 0, // 学科
      biRule: void 0, // 算法筛选
      role: '3', // 评价人， 默认是 3 教研人员
      stuUserId: void 0, // 学生 ID
      stuUserName: void 0, // 学生姓名
      teaUserId: void 0, // 老师 ID
      teaUserName: void 0, // 老师姓名
      proUserName: void 0, // 教研姓名
      diffEval: void 0, // 试卷难易
      accurateEval: void 0, // 整体评价
      assignType: void 0, // 试卷来源
      overOrder: null, // 超纲题数排序：(DESC:降序 ASC：升序)
      matchOrder: null, // 知识点题目不匹配数排序：((DESC:降序 ASC：升序))
      pageIndex: 1,
      pageSize: 10,
    },
  };

  componentDidMount() {
    this.getAIReportData();
    this.getAIReportProfile();
  }

  /**
   * @description 点击查询获取数据
   * @return {void}
   */
  handleSubmit = () => {
    this.handleChangePageIndex(1);
    this.getAIReportProfile();
  }

  /**
   * @description 改变页码，获取列表数据
   * @param {number} pageIndex 页码
   * @return {void}
   */
  handleChangePageIndex = pageIndex => {
    const { params } = this.state;
    params.pageIndex = pageIndex;
    this.setState({ params }, () => {
      this.getAIReportData();
    });
  };

  /**
   * @description 获取报告列表的数据
   * @return {void}
   */
  getAIReportData = async () => {
    const params = { ...this.state.params };
    params.startTime = `${params.startTime.format('YYYY-MM-DD')} 00:00:00`;
    params.overTime = `${params.overTime.format('YYYY-MM-DD')} 23:59:59`;
    this.setState({ reportLoading: true });
    const data = await getReportData(params);
    this.setState({ reportData: data.list, reportTotal: data.total, reportLoading: false });
  };

  /**
   * @description 获取报告顶部统计的数据
   * @return {void}
   */
  getAIReportProfile = async () => {
    const params = { ...this.state.params };
    params.startTime = `${params.startTime.format('YYYY-MM-DD')} 00:00:00`;
    params.overTime = `${params.overTime.format('YYYY-MM-DD')} 23:59:59`;
    delete params.pageIndex;
    delete params.pageSize;
    const data = await getReportProfile(params);
    this.setState({ reportProfile: data });
  };

  /**
   * @description 控制三个 Modal 弹框的显示隐藏
   * @param {string} type 需要改变状态的 Modal
   * @param {bool} status 显示/隐藏
   * @return {void}
   */
  toggleModalStatus = (type, status) => {
    const types = ['showReport', 'showDetail', 'showQuestion'];
    if (types.includes(type)) {
      this.setState({ [type]: status });
    }
  };

  /**
   * @description 改变 state params 中的值
   * @param {object} param 需要改变的字段的键值对
   * @param {boolean} isSelect 对于select类型的查询直接调接口，无须单击“查询”按钮
   * @return {void}
   */
  handleParamsChange = (param, isSelect) => {
    if (!_.isObject(param)) return;
    // 如果值为假值则置为 void 0
    for (let key in param) {
      if (!param[key]) param[key] = void 0;
    }
    const params = { ...this.state.params, ...param };
    // 如果 gradeId 改变，subjectId需要置成 void 0
    if (Object.keys(param).includes('gradeId')) {
      params.subjectId = void 0;
    }
    console.log('params', params);
    this.setState({ params }, () => {
      if (Object.keys(param).includes('role') || isSelect) {
        this.handleSubmit();
      }
    });
  };
  handleOrder = (order) => {
    const { params } = this.state;
    delete params.matchOrder;
    delete params.overOrder;
    this.setState({
      params: { ...this.state.params, ...order }
    }, () => {
      console.log('params', order, this.state.params);
      this.handleChangePageIndex(1); // 回到第一页
      // this.getAIReportData(); // 留在当前排序页
    });

  }
  render() {
    const {
      showDetail,
      showReport,
      showQuestion,
      params,
      reportData,
      reportProfile,
      reportLoading,
      reportTotal,
      currentExamInfoId
    } = this.state;
    return (
      <Root>
        <Header
          onChange={this.handleParamsChange}
          onSubmit={this.handleSubmit}
          params={params}
        />
        <Content
          data={reportData}
          profileData={reportProfile}
          loading={reportLoading}
          pageIndex={params.pageIndex}
          pageSize={params.pageSize}
          total={reportTotal}
          onPageChange={this.handleChangePageIndex}
          onOrderChange={this.handleOrder}
          role={params.role}
          openReport={(id) => {
            this.setState({ currentExamInfoId: id });
            this.toggleModalStatus('showReport', true);
          }}
          openDetail={(id) => {
            this.setState({ currentExamInfoId: id });
            this.toggleModalStatus('showDetail', true);
          }}
        />
        {showReport && (
          <Report
            examInfoId={currentExamInfoId}
            onCancel={() => {
              this.toggleModalStatus('showReport', false);
            }}
          />
        )}
        {showDetail && (
          <Detail
            examInfoId={currentExamInfoId}
            clickQuestion={(id) => {
              this.questionId = id;
              this.toggleModalStatus('showQuestion', true);
            }}
            onCancel={() => {
              this.toggleModalStatus('showDetail', false);
            }}
            getData={this.getAIReportData}
          />
        )}
        {showQuestion && (
          <Question
            examInfoId={currentExamInfoId}
            questionId={this.questionId}
            onCancel={() => {
              this.toggleModalStatus('showQuestion', false);
            }}
          />
        )}
      </Root>
    );
  }
}
