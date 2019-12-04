import React from 'react';
import AnalysisCard from '../AnalysisCard';
import { Table } from 'antd';
import echarts from 'echarts';
class TableCharts extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.chartsData && nextProps.showCharts) {
      setTimeout(() => {
        this.drawCharts();
      }, 300);
    }
  }
  drawCharts=() => {
    const { resize, chartsData } = this.props;
    const myChart = echarts.init(document.getElementById('difficultyAnalysisChart'));
    // 绘制图表
    myChart.setOption({
      title: {
        text: '难度变化趋势图',
      },
      xAxis: {
        type: 'category',
        data: chartsData.labels
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: chartsData.counts,
        type: 'line',
        label: {
          normal: {
            show: true,
            position: 'top'
          }
        },
      }]
    });
    myChart.on('click', function (params) {
      console.log(params);
    });
    myChart.resize();
    if (resize) {
      resize(myChart);
    }
  }
  render() {
    const { columns, data, title, showCharts, chartsData, onChange, currentPage, hidePagination } = this.props;
    let pagination = { showQuickJumper: true, showSizeChanger: true };
    if (currentPage) {
      pagination.current = currentPage;
    }
    if (hidePagination) {
      pagination = false;
    }
    return (
      <AnalysisCard
        title={title}
        tip="点击数字可以查看题目详情"
      >
        <Table columns={columns} dataSource={data || []} rowKey={record => record.id} pagination={pagination} onChange={onChange} />
        {showCharts && <div id="difficultyAnalysisChart" style={{ width: '100%', height: 400, display: showCharts && chartsData ? 'block' : 'none'  }}></div>}
      </AnalysisCard>
    );
  }
}
export default TableCharts;
