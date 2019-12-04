import React from 'react';
import moment from 'moment';
import { Table, Row, Col } from 'antd';
import { Content as ContentWarp, ReportOverview } from './style';
import Sorter from 'components/Sorter';

export default class Content extends React.Component {
  state = {
    sortedInfo: {}
  };
  setAgeSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'age'
      }
    });
  }
  handleChange = (pagination, filters, sorter) => {
    console.log(sorter);
    // this.setState({ sortedInfo: sorter });
  };
  handleOrder = (sorter) => {
    console.log('handleOrder', sorter);
    this.setState({ sortedInfo: sorter });
    const { onOrderChange } = this.props;
    const { sortedInfo } = this.state;
    const { order, columnKey } = sortedInfo;
    // if (!order) return;
    const ORDERENUM = {
      'descend': 'DESC',
      'ascend': 'ASC',
    };
    const COLUMNENUM = {
      'overNum': 'overOrder',
      'matchNum': 'matchOrder'
    };
    onOrderChange(!order ? {} : { [COLUMNENUM[columnKey]]: ORDERENUM[order] });
  }
  render() {
    const {
      data,
      profileData,
      loading,
      pageIndex,
      pageSize = 10,
      onPageChange,
      total,
    } = this.props;
    console.log('sortedInfo', this.state.sortedInfo);
    const columns = [
      {
        title: '名称',
        dataIndex: 'examInfoName',
        key: 'examInfoName',
        width: 280,
      },
      {
        title: '学生ID/学生姓名',
        key: 'stuUserId',
        render: record => {
          return `${record.stuUserId || '- '}/${record.stuUserName || ' -'}`;
        },
      },
      {
        title: '老师ID/老师姓名',
        key: 'teaUserId',
        render: record => {
          return `${record.teaUserId || '- '}/${record.teaUserName || ' -'}`;
        },
      },
      {
        title: '测评日期',
        key: 'realExamEndDate',
        render: record =>
        (record.realExamEndDate
          ? moment(record.realExamEndDate).format('YYYY-MM-DD')
          : '-'),
      },
      {
        title: <div>超纲题数<Sorter columnKey="overNum" sortOn={this.state.sortedInfo.columnKey === 'overNum'} onChange={this.handleOrder} /></div>,
        dataIndex: 'overNum',
        key: 'overNum',
        // sorter: (a, b) =>  a - b,
        // sortOrder: this.state.sortedInfo.columnKey === 'overNum' && this.state.sortedInfo.order,
      },
      {
        title: <div>知识点题目不匹配数<Sorter columnKey="matchNum" sortOn={this.state.sortedInfo.columnKey === 'matchNum'} onChange={this.handleOrder} /></div>,
        dataIndex: 'matchNum',
        key: 'matchNum',
        // sorter: (a, b) =>  a - b,
        // sortOrder: this.state.sortedInfo.columnKey === 'matchNum' && this.state.sortedInfo.order,
      },
      {
        title: '整体评价',
        key: 'teaEval',
        render: record => {
        // 根据当前的筛选条件的评价人返回不同的评价
          const role = `${this.props.role}`;
          const teaEval = `${record.teaEval}` || '-';
          const proEval = `${record.proEval}` || '-';
          const evaluate = role === '3' ? proEval : teaEval;
          return evaluate === '1' ? '准' : evaluate === '2' ? '不准' : '-';
        },
      },
      {
        title: '试卷难易度',
        key: 'stuEval',
        render: record => {
          const stuEval = `${record.stuEval}`;
          if (stuEval === '1') return '易';
          if (stuEval === '2') return '适中';
          if (stuEval === '3') return '难';
          return '-';
        },
      },
      {
        title: '评价人',
        key: 'proUserName',
        render: record => {
        // 根据当前的筛选条件的评价人返回不同的评价人
          const role = `${this.props.role}`;
          const proUserName = record.proUserName || '-';
          const teaUserName = record.teaUserName || '-';
          return role === '3' ? proUserName : teaUserName;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            {record.questionNum && record.questionNum > 0 ? (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  this.props.openReport(record.examInfoId);
                }}
            >
              查看报告
            </a>
          ) : (
            <span style={{ color: '#999' }}>暂无报告</span>
          )}
            <span className="ant-divider" />
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                this.props.openDetail(record.examInfoId);
              }}
          >
            查看
          </a>
          </span>
      ),
      },
    ];
    return (
      <ContentWarp>
        <ReportOverview>
          <Row>
            <Col span={6}>
              <span>
                超纲题目总数（题）：
                {profileData.cacExamInfoQuestionOverNum || 0}
              </span>
            </Col>
            <Col span={6}>
              <span>
                知识点题目不匹配总数（题）：
                {profileData.cacExamInfoQuestionMatchNum || 0}
              </span>
            </Col>
            <Col span={6}>
              <span>
                报告准确数（份）：{profileData.cacExamInfoCorrentNum || 0}
              </span>
            </Col>
            <Col span={6}>
              <span>
                报告不准确数（份）：{profileData.cacExamInfoUncorrentNum || 0}
              </span>
            </Col>
            <Col span={6}>
              <span>
                已评价报告总题数（题）：{profileData.questionTotalNum || 0}
              </span>
            </Col>
            <Col span={6}>
              <span>总报告数（份）：{total || 0}</span>
            </Col>
            <Col span={6}>
              <span>
                试卷容易数（份）：{profileData.cacExamInfoDiffcult1Num || 0}
              </span>
            </Col>
            <Col span={6}>
              <span>
                试卷适中数（份）：{profileData.cacExamInfoDiffcult2Num || 0}
              </span>
            </Col>
            <Col span={6}>
              <span>
                试卷较难数（份）：{profileData.cacExamInfoDiffcult3Num || 0}
              </span>
            </Col>
          </Row>
        </ReportOverview>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          rowKey="examInfoId"
          bordered
          pagination={{
            total,
            pageSize,
            current: pageIndex,
            onChange: onPageChange,
          }}
          onChange={this.handleChange}
        />
      </ContentWarp>
    );
  }
}
