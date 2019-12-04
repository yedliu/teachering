import React from 'react';
import { Modal, Select, Button, message, Rate } from 'antd';
import 'echarts/lib/chart/graph';
import 'echarts/lib/component/legendScroll';
import 'echarts/lib/component/tooltip'; // 图表提示
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import echarts from 'echarts/lib/echarts'; // 必须

import knowledgeEndPoint from '../../api/tr-cloud/knowledge-endpoint';

const Option = Select.Option;

let rate = {
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
};

const categories = [
  {
    name: '当前知识点',
  },
  {
    name: '后置知识点',
  },
  {
    name: '前置知识点'
  },
];

const option = (graph, subtext) => ({
  title: {
    text: '知识图谱',
    // subtext,
    top: 'top',
    left: 'left'
  },
  legend: {
    left: 0,
    top: '80px',
    orient: 'vertical',
    data: categories.map(a => a.name),
  },
  tooltip: {},
  animationDuration: 1500,
  animationEasingUpdate: 'quinticInOut',
  series: [
    {
      type: 'graph',
      layout: 'circular',
      // nodeScaleRatio: 1,
      nodes: graph.nodes,
      links: graph.links,
      categories,
      roam: true,
      tooltip: {
        trigger: 'item',
        backgroundColor: 'white',
        padding: 10,
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
        formatter: (params) => {
          const { name, difficulty, examFrequency } = params.data;
          if (!name) {
            return null;
          }
          const examFrequencyStr = (rate[examFrequency] || document.getElementById(`rate${examFrequency}`)).innerHTML;
          const difficultyDomStr = (rate[difficulty] || document.getElementById(`rate${difficulty}`)).innerHTML;
          return `<span style='color: red;'>${name}</span>
            <div style='color:black;display:flex;align-items:center;'>考试频率：${examFrequencyStr}</div>
            <div style='color:black;display:flex;align-items:center;'>知识点难度：${difficultyDomStr}</div>`;
        }
      },
      focusNodeAdjacency: true, // 高亮
      edgeSymbol: 'arrow',
      edgeSymbolSize: [0, 10],
      itemStyle: {
        normal: {
          borderColor: '#fff',
          borderWidth: 1,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
      },
      label: {
        normal: {
          show: true,
          formatter: params => params.data.name,
          position: 'top',
          distance: 6,
        }
      },
      lineStyle: {
        color: 'source',
        curveness: 0.3
      },
      emphasis: {
        lineStyle: {
          width: 8,
        },
      }
    }
  ]
});

const sizeMap = {
  1: 45,
  2: 35,
  3: 25,
  4: 15,
  5: 8,
};

export default class KonwledgeModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      curId: props.curKnowledgeId,
      curKnowledgeItemList: props.curKnowledgeItemList,
    };
    this.allObjs = [];
  }

  componentDidMount() {
    if (!this.graph) return;
    this.chartSkill = echarts.init(this.graph);
    this.loading();
    const { curId } = this.state;
    if (curId > 0) {
      this.changeCurId(curId);
      this.willRenderGraph();
    }
    // 初始化星星
    rate[1] = document.getElementById('rate1');
    rate[2] = document.getElementById('rate2');
    rate[3] = document.getElementById('rate3');
    rate[4] = document.getElementById('rate4');
    rate[5] = document.getElementById('rate5');
  }

  willRenderGraph = () => {
    this.allObjs = []; // 置空
    const { close } = this.props;
    const { curId, curKnowledgeItemList } = this.state;
    knowledgeEndPoint.getFrontAndBackById(curId).then(res => {
      if (res.code === '0') {
        const { data } = res;
        if (!(data.backKnowledge && data.backKnowledge.length > 0 || data.frontKnowledge && data.frontKnowledge.length > 0)) {
          message.warning('该知识点没有绑定前后置知识点');
          // 将列表中的该知识点置一个状态
          curKnowledgeItemList.some(e => {
            if (e.id === +curId) {
              e.noBF = true;
              return true;
            } else {
              return false;
            }
          });
        }
        if (!data) {
          message.error('数据为空，请稍后再试');
          close();
          return;
        }
        const { difficulty, examFrequency } = data;
        const nodes = [{
          name: data.name,
          id: String(data.id),
          difficulty,
          examFrequency,
          symbolSize: sizeMap[data.level],
          category: 0,
        }];
        const links = [];
        this.combineWithMe(data, 'backKnowledge', nodes, links);
        this.combineWithMe(data, 'frontKnowledge', nodes, links);
        this.drawGraph(nodes, links);
      } else {
        message.error('获取只是点图谱失败');
      }
    });
  }

  combineWithMe = (data, type, nodes, links) => {
    const { id } = data;
    data[type].forEach(e => {
      let existObj = null;
      // 去重 检查是否有相同id的
      this.allObjs.forEach(a => {
        if (a.id === e.id) {
          existObj = e;
        }
      });
      if (existObj) {
        // message.warning(<span>当前知识点与 {<b style={{ color: 'red' }}>{existObj.name}</b>} 互为前后置知识点，请纠正！</span>, 5);
        message.warning(<span>当前知识点的前置知识点有重复数据</span>, 5);
        return;
      } else {
        this.allObjs.push(e);
      }
      const lineStyle = {
        normal: {},
      };
      const emphasis = {
        label: {
          show: false,
        }
      };
      const point = {};
      nodes.push({
        name: e.name,
        id: String(e.id),
        symbolSize: sizeMap[e.level],
        difficulty: e.difficulty,
        examFrequency: e.examFrequency,
        category: type === 'backKnowledge' ? 1 : 2,
      });
      // 前置指向后置
      if (type === 'backKnowledge') {
        point.source = String(id);
        point.target = String(e.id);
      } else if (type === 'frontKnowledge') {
        point.source = String(e.id);
        point.target = String(id);
      }
      links.push({
        ...point,
        lineStyle,
        emphasis,
      });
    });
  }

  drawGraph = (nodes, links, name) => {
    console.log('nodes', nodes);
    console.log('links', links);
    const graph = {
      nodes,
      links,
    };
    this.chartSkill.setOption(option(graph, name));
    this.chartSkill.hideLoading();
  }

  changeCurId = (curId) => {
    this.setState({
      curId
    });
  }

  loading = () => {
    this.chartSkill.showLoading('default', {
      text: '图谱努力加载中...',
      color: '#c23531',
      textColor: '#000',
      maskColor: 'rgba(255, 255, 255, 0.8)',
      zlevel: 0
    });
  }

  onChange = (id) => {
    message.destroy();
    this.changeCurId(id);
    // 初始化图
    this.loading();
    // 重新画图
    setTimeout(() => {
      this.willRenderGraph();
    }, 20);
  }

  nextOrPre = (type) => {
    const { curKnowledgeItemList, curId } = this.state;
    let index = 0;
    curKnowledgeItemList.some((e, i) => {
      if (e.id === +curId) {
        index = i;
        return true;
      } else {
        return false;
      }
    });
    if (index === 0 && type === 'pre') {
      message.info('已经是第一个了');
    } else if (index === (curKnowledgeItemList.length - 1) && type === 'next') {
      message.info('已经是最后一个了');
    } else {
      this.onChange(curKnowledgeItemList[type === 'pre' ? index - 1 : index + 1].id);
    }
  }

  render() {
    const { close } = this.props;
    const { curId, curKnowledgeItemList } = this.state;
    const graphH = 400;
    const customH = 50;
    return (
      <Modal
        visible
        width={800}
        footer={null}
        onCancel={close}
        bodyStyle={{
          background: '#f3f3f3',
          height: graphH + customH + 50,
        }}
      >
        <div style={{ display: 'none' }}>
          <div id="rate1"><Rate disabled defaultValue={1} count={3} /></div>
          <div id="rate2"><Rate disabled defaultValue={2} count={3} /></div>
          <div id="rate3"><Rate disabled defaultValue={3} count={3} /></div>
          <div id="rate4"><Rate disabled defaultValue={4} /></div>
          <div id="rate5"><Rate disabled defaultValue={5} /></div>
        </div>
        <div style={{ height: customH, marginBottom: 10, background: '#e2e2e2', paddingLeft: 15, display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 10 }}>选择知识点(当前知识点所在级别):</span>
          <Select dropdownMatchSelectWidth={false} value={String(curId)} onChange={this.onChange} style={{ width: 180 }} placeholder="选择你要查看知识点" showSearch optionFilterProp="children">
            {curKnowledgeItemList.map(e => <Option key={e.id} value={String(e.id)}>{e.name}{e.noBF ? <span style={{ marginLeft: 5, color: '#f46e65', fontSize: 12 }}>(无前后置知识点)</span> : ''}</Option>)}
          </Select>
          <Button size="small" icon="arrow-up" style={{ margin: '0 15px' }} onClick={this.nextOrPre.bind(this, 'pre')}>上一个</Button>
          <Button size="small" icon="arrow-down" onClick={this.nextOrPre.bind(this, 'next')}>下一个</Button>
          <span style={{ color: '#00a854', marginLeft: 10, fontStyle: 'italic' }}>圆圈越大，知识点级别越大</span>
        </div>
        <div ref={graph => this.graph = graph} style={{ width: '100%', height: graphH }} />
      </Modal>
    );
  }
}
