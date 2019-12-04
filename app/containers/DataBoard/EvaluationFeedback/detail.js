import React from 'react';
import { Table, Popover, Checkbox, Radio, Icon, Modal, message } from 'antd';
import { fromJS } from 'immutable';
import { ZmExamda } from 'zm-tk-ace';
import { getDetailData, submitFeedbackByTr } from './server';
import { DetailWrapper } from './style';

const RadioGroup = Radio.Group;

export default class Detail extends React.Component {
  state = {
    data: [], // 详情的数据
    total: 0, // 总数
    proEval: void 0, // 教研评价 准或不准
    teaEval: void 0, // 老师整体评价
    loading: false, // 加载中
    current: 1, // 当前页码
    showTips: false, // 是否显示提示信息 教研评价未选 提交数据时会显示
    confirmLoading: false, // Modal 确定按钮 loading
  };

  componentDidMount() {
    this.getData();
  }

  // 缓存的数据，切换分页以及提交数据是使用
  cacheData = {};

  columns = [
    {
      title: '题号',
      dataIndex: 'questionId',
      key: 'questionId',
    },
    {
      title: '知识点题目',
      key: 'title',
      width: 350,
      render: (text, record) => (
        <Popover content={this.renderContent(record.questionId)}>
          <div className="question-wrapper">
            {/* 传入 templateType 防止 ZmExamda 找不到模板解析题干 */}
            {
              <ZmExamda
                question={fromJS({ title: record.title, templateType: 2 })}
                options={['title']}
              />
            }
          </div>
        </Popover>
      ),
    },
    {
      title: '量子知识点',
      dataIndex: 'knowledgeName',
      key: 'knowledgeName',
    },
    {
      title: '超纲',
      key: 'action',
      render: (text, record) => (
        <Checkbox
          checked={record.proEvalOver === 2}  // 2代表超纲 1代表未超纲
          onChange={e => {
            const value = e.target.checked;
            this.handleChangeCheckBox(record.questionId, 'proEvalOver', value);
          }}
        />
      ),
    },
    {
      title: '题目不匹配知识点',
      key: 'action1',
      render: (text, record) => (
        <Checkbox
          checked={record.proEvalMacth === 2}  // 2代表不匹配 1代表匹配
          onChange={e => {
            const value = e.target.checked;
            this.handleChangeCheckBox(record.questionId, 'proEvalMacth', value);
          }}
        />
      ),
    },
    {
      title: '超纲（老师评价）',
      key: 'action2',
      // eslint-disable-next-line
      render: (text, record) =>  // 2代表超纲 1代表未超纲
        record.teaEvalOver === 2 ? (
          <Icon type="check" />
        ) : record.teaEvalOver === 1 ? (
          <Icon type="close" />
        ) : (
          '-'
        ),
    },
    {
      title: '题目不匹配知识点（老师评价）',
      key: 'action3',
      // eslint-disable-next-line
      render: (text, record) =>  // 2代表不匹配 1代表匹配
        record.teaEvalMacth === 2 ? (
          <Icon type="check" />
        ) : record.teaEvalMacth === 1 ? (
          <Icon type="close" />
        ) : (
          '-'
        ),
    },
  ];

  /**
   * @description 悬浮在题目上显示的内容，点击则弹出题目详情
   * @param {number} id 题目 id
   * @return {void}
   */
  renderContent = id => (
    <a
      onClick={() => {
        this.props.clickQuestion(id);
      }}
      href="#"
    >
      点击查看题目详情
    </a>
  );

  /**
   * @description 点击每个题目中的多选框
   * @param {number} questionId 题目 id
   * @param {type} type 点击是‘是否超纲’或’题目是否匹配知识点‘
   * @param {bool} value 是否是选中, 2代表选中 1代表未选中
   * @return {void}
   */
  handleChangeCheckBox = (questionId, type, value) => {
    const data = [...this.state.data];
    for (let i = 0; i < data.length; i++) {
      if (data[i].questionId === questionId) {
        data[i][type] = value ? 2 : 1;
        break;
      }
    }
    this.setState({ data });
  };

  /**
   * @description 改变教研评价
   * @param {event} e RadioGroup 复合对象
   * @return {void}
   */
  handleChange = e => {
    this.setState({ proEval: e.target.value });
  };

  /**
   * @description 缓存数据，页码为 key
   * @return {void}
   */
  handleCacheData = () => {
    const { current, data } = this.state;
    this.cacheData[current] = data;
  };

  /**
   * @description 改变页码
   * @param {number} current 当前选中的页码
   * @return {void}
   */
  handleChangePage = current => {
    this.handleCacheData();
    this.setState({ current }, () => {
      this.getData();
    });
  };

  /**
   * @description 点击提交按钮
   * @return {void}
   */
  handleSubmit = () => {
    const { proEval } = this.state;
    if (proEval && proEval < 0) {
      this.setState({ showTips: true });
      return;
    } else {
      this.setState({ showTips: false });
      this.handleCacheData();
      this.submitFeedback();
    }
  };

  /**
   * @description 提交反馈数据到后端
   * @return {void}
   */
  submitFeedback = async () => {
    this.setState({ confirmLoading: true });
    const params = {};
    params.eval = this.state.proEval;
    params.examInfoId = this.props.examInfoId;
    let dataList = [];
    Object.keys(this.cacheData).forEach(key => {
      dataList = dataList.concat(this.cacheData[key]);
    });
    params.questionEvalList = dataList.map(el => ({
      match: el.proEvalMacth <= 0 ? 1 : el.proEvalMacth, // 小于等于0就算 匹配
      over: el.proEvalOver <= 0 ? 1 : el.proEvalOver, // 小于等于0就算 不超纲
      questionId: el.questionId,
    }));
    const success = await submitFeedbackByTr(params);
    this.setState({ confirmLoading: true });
    if (success) {
      message.success('提交评价成功');
      this.props.onCancel();
      this.props.getData();
    }
  };

  /**
   * @description 获取数据
   * @return {void}
   */
  getData = async () => {
    const pageIndex = this.state.current;
    const examInfoId = this.props.examInfoId;
    const params = { pageSize: 20, pageIndex, examInfoId };
    // 先检测是否有缓存的数据，如果有缓存的数据则不发送请求
    if (this.cacheData[pageIndex]) {
      this.setState({ data: this.cacheData[pageIndex] });
      return;
    }
    this.setState({ loading: true });
    const data = await getDetailData(params);
    const pageInfo = data.pageInfo;
    this.setState({
      data: pageInfo.list || [],
      total: pageInfo.total,
      loading: false,
      proEval: data.proEval,
      teaEval: data.teaEval,
    });
  };

  render() {
    const {
      data,
      proEval,
      teaEval,
      current,
      total,
      loading,
      showTips,
      confirmLoading,
    } = this.state;
    return (
      <Modal
        visible
        title="报告详情"
        width={1200}
        confirmLoading={confirmLoading}
        onCancel={this.props.onCancel}
        okText="提交"
        onOk={this.handleSubmit}
      >
        <DetailWrapper>
          <div>测评整体掌握情况（老师）：{teaEval === 1 ? '准' : teaEval === 2 ? '不准' : '无'}</div>
          <Table
            columns={this.columns}
            dataSource={data}
            loading={loading}
            bordered
            pagination={{
              total,
              pageSize: 20,
              current,
              onChange: this.handleChangePage,
            }}
          />
          <div>
            <em style={{ color: 'red' }}>*</em>
            <span>测评整体掌握情况：</span>
            <RadioGroup value={proEval} onChange={this.handleChange}>
              <Radio value={1}>准</Radio>
              <Radio value={2}>不准</Radio>
            </RadioGroup>
            {showTips && (
              <span style={{ color: 'red' }}>请选择测评整体掌握情况</span>
            )}
          </div>
        </DetailWrapper>
      </Modal>
    );
  }
}
