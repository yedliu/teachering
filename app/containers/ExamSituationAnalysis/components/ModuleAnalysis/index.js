import React from 'react';
import AnalysisCard from '../AnalysisCard';
import echarts from 'echarts';
import { Icon } from 'antd';
class ModuleAnalysis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 500
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data) {
      setTimeout(() => {
        this.setState({ height: 50 * nextProps.data.labels.length });
        this.drawCharts(nextProps.data);
      }, 600);
    }
  }
  drawCharts = (data) => {
    const { resize, handleClick, sourceData } = this.props;
    const myChart = echarts.init(document.getElementById('moduleAnalysisChart'));
    let renderData = data || { labels: [], counts: [] };
    // 绘制图表
    myChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        show: false
      },
      yAxis: {
        type: 'category',
        data: renderData.labels,
        triggerEvent: true,
      },
      series: [
        {
          type: 'bar',
          data: renderData.counts,
          label: {
            normal: {
              show: true,
              position: 'right'
            }
          },
          itemStyle: {
            normal: {
              color: '#108ee9'
            }
          },
        }
      ],
      grid: {
        left: 300
      },
    });
    myChart.off('click');
    myChart.on('click', function (params) {
      if (params.componentType === 'series') {
        // 点击柱状图
        let quModuleId = sourceData[params.dataIndex].quModuleId;
        cal(quModuleId);
      } else if (params.componentType === 'yAxis') {
        // 点击y坐标
        let quModuleId = sourceData[renderData.labels.indexOf(params.value)].quModuleId;
        cal(quModuleId);
      }
      function cal(quModuleId) {
        let targetParams = {
          quModuleId,
          type: 'quModuleId',
        };
        handleClick(targetParams);
      }
    });
    myChart.resize();
    if (resize) {
      resize(myChart);
    }
  }
  render() {
    const { data } = this.props;
    const { height } = this.state;
    return (
      <AnalysisCard
        title="模块分析"
        tip="点击柱状图或知识点名称可以查看题目详情"
      >

        <div id="moduleAnalysisChart" style={{ width: '100%', height, minHeight: 300, display: data ? 'block' : 'none' }}></div>
        {
          !data && <div style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 0.43)' }}><Icon type="frown-o" />&nbsp;暂无数据</div>
        }
      </AnalysisCard>
    );
  }
}
export default ModuleAnalysis;
