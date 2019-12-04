/* eslint-disable no-param-reassign */
import React from 'react';
import { makeLog } from '../H5Share/appInfo';
import { fromJS } from 'immutable';
import { QuestionBox } from './elementStyle';
import ZmExamda from '../../components/ZmExamda/index';
import { getQuestionsList } from './server';
import { SliderEditorWarpper, Header } from '../H5Share/elementStyle/slideEditorStyle';
import { Modal, Input, Checkbox } from 'antd';
import questionApi from '../../api/qb-cloud/question-endpoint';
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
const CheckboxGroupOptions = [ // 标签选项
  { label: '来源', value: 'origin' },
  { label: '难度', value: 'difficulty' },
  { label: '已测', value: 'existed' },
  { label: '正确率', value: 'accuracy' },
  { label: '题目使用次数', value: 'quoteCount' },
  { label: '答题次数', value: 'questionAnswerCount' },
  { label: '推荐用时', value: 'suggestTime' },
  { label: '答案解析', value: 'answerList-analysis' },
  { label: '知识点', value: 'knowledgeNameList' },
  { label: '考点', value: 'examPointNameList' },
];
const difficultyArr = { // 题目难度
  1: '简单',
  2: '一般',
  3: '中等',
  4: '较难',
  5: '难',
};
const correctRateArr = { // 正确率范围
  1: '80, 100',
  2: '65, 95',
  3: '50, 80',
  4: '35, 70',
  5: '20, 55',
};

const log = makeLog('questionPrint');

export default class QuestionPrint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questionDataList: [],
      visible: false,
      Ids: []
    };
    this.tagChecked = [
      'difficulty',
      'existed',
      'accuracy',
      'quoteCount',
      'questionAnswerCount',
      'examPointNameList',
      'knowledgeNameList'
    ];
    this._update = () => this.forceUpdate();
  }
  componentDidMount() {
    let ids = this.props.location && this.props.location.query.ids;
    this.state = {
      Ids: ids
    };
    ids && this.getQuestions();
    // eslint-disable-next-line no-return-assign
    return this.state = {
      Ids: []
    };
  }
  // 添加题目
  addQuestion = () => {
    this.setState({ visible: !this.state.visible });
  }
   // 预览
  previewPage = (e) => {
    this.setState({
      visible: false,
      questionDataList: []
    });
    return this.getQuestions();
  }
  // 取消
  cancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  // 已选中标签选项 数组
  onChange = (checkedValues) => {
    this.tagChecked = checkedValues;
    this.setState({});
  }
  // 获取题目
  getQuestions = () => {
    const { Ids } = this.state;
    let arr = [];
    Ids.split(',').forEach((x, i) => { parseInt(x, 10) >= 0 ? arr.push(parseInt(x, 10)) : null });
    log('id数组', arr);
    if (arr.length < 1) {
      return Modal.error({
        title: '输入无效',
        content: '请输入有效的id',
      });
    }
    getQuestionsList(arr).then(res => {
      const { code, message, data } = res;
      if (code === '0') {
        return this.setData(data);
      } else {
        return Modal.error({
          title: '请求出错',
          content: message || '请检查输入的id是否正确',
        });
      }
    });
  }
  // 处理数据
  setData = (data) => {
    data.forEach((item, i) => {
      if (!item) {
        return Modal.error({
          title: 'id无效',
          content: `请检查第${i + 1}的id`,
        });
      }
      item.existed = this.getRadom('examCount');
      item.accuracy = this.getRadom('correctRate', item.difficulty);
      item.answerList = item.answerList ? item.answerList : [];
      item.examPointNameList = item.examPointNameList && item.examPointNameList.length > 1 ? item.examPointNameList.slice(0, 2) : item.examPointNameList;
      item.knowledgeNameList = item.knowledgeNameList && item.knowledgeNameList.length > 1 ? item.knowledgeNameList.slice(0, 2) : item.knowledgeNameList;
    });
    this.setState({ questionDataList: fromJS(data), visible: false });
  }
  // 题目使用次数 +1
  addQuestionQuoteCount = async (ids) => {
    try {
      const res = await questionApi.addQuestionQuoteCount(ids || []);
      if (`${res.code}` === '0') {
        return;
      } else {
        message.error(res.message || '发送题目使用次数失败');
      }
    } catch (err) {
      console.error(err);
    }
  }
  // 打印
  printPage = () => {
    document.getElementsByClassName('App')[0].style.border = 'none';
    window.print();
  }
  getOption = (item) => {
    let options = [];
    options[0] = 'title';
    options[1] = this.tagChecked.includes('examPointNameList') && !(item.get('examPointNameList') && item.get('examPointNameList').size < 1) ? 'examPointNameList' : '';
    options[2] = this.tagChecked.includes('knowledgeNameList') && !(item.get('knowledgeNameList') && item.get('knowledgeNameList').size < 1) ? 'knowledgeNameList' : '';
    options[3] = this.tagChecked.includes('answerList-analysis') ? 'answerList' : '';
    options[4] = this.tagChecked.includes('answerList-analysis') ? 'analysis' : '';
    options[5] = {
      key: 'children',
      indexType: '(__$$__)',
      groupIndexType: '(__$$__)',
    };
    return options;
  }
  // 获取随机规则
  getRadom = (type, value) => {
    if (type === 'examCount') {
      return Math.floor(Math.random() * (5000 - 100)) + 100;
    } else {
      if (!value) return;
      let numArr = correctRateArr[value].split(',');
      return (Math.random() * (parseInt(numArr[1], 10) - parseInt(numArr[0], 10)) + parseInt(numArr[0], 10)).toFixed(1);
    }
  }
  getItem = (item, i) => {
    if (item.get('label') && this.tagChecked.includes('origin')) {
      item = item.set('title', `<span class="index">${i + 1}.</span><span class="index-label">【${item.get('label')}】</span>${item.get('title')}`);
    } else {
      item = item.set('title', `<span class="index">${i + 1}.</span>${item.get('title')}`);
    }
    return item;
  }
  render() {
    const { questionDataList, Ids } = this.state;
    questionDataList && !Array.isArray(questionDataList) && console.log(questionDataList.toJS());
    console.log(Ids);
    return (
      <SliderEditorWarpper id={'SliderEditorWarpper-questionPrint'}>
        <Header className="section-not-to-print">
          <div className="action">
            <CheckboxGroup className="fl" options={CheckboxGroupOptions} defaultValue={this.tagChecked} onChange={this.onChange} />
            <button className="print" onClick={(e) => this.addQuestion()}>添加题目</button>  &nbsp;&nbsp;&nbsp;&nbsp;
            <button className="print" onClick={async (e) => {
              await this.addQuestionQuoteCount(Ids);
              this.printPage(Ids);
            }}>打印</button> &nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </Header>
        <div className={'printPageWrapper'}>
          <div className={'printPage'}>
            {questionDataList ? questionDataList.map((item, index) => (
              item ?
                <QuestionBox className="questionBox" key={index}>
                  <p className="top">
                    {this.tagChecked.includes('difficulty') && difficultyArr[item.get('difficulty')] ? <span>{difficultyArr[item.get('difficulty')]}</span> : null}
                    {this.tagChecked.includes('existed') && item.get('existed') ? <span>已测：{item.get('existed')}次</span> : null}
                    {this.tagChecked.includes('accuracy') && item.get('accuracy') ? <span>正确率：{item.get('accuracy')} %</span> : null}
                    {this.tagChecked.includes('quoteCount') && item.get('quoteCount') ? <span>题目使用次数：{item.get('quoteCount')}</span> : null}
                    {this.tagChecked.includes('questionAnswerCount') && item.get('questionAnswerCount') ? <span>答题次数：{item.get('questionAnswerCount')}</span> : null}
                    {this.tagChecked.includes('suggestTime') && item.get('suggestTime') ? <span>{`推荐用时：${item.get('suggestTime') * 60} s`} </span> : null}
                  </p>
                  <ZmExamda
                    indexType="string"
                    question={this.getItem(item, index)}
                    options={this.getOption(item)}
                  />
                </QuestionBox> : null)) : null}
          </div>
        </div>
        <Modal
          title="添加题目"
          visible={this.state.visible}
          onOk={this.previewPage}
          onCancel={this.cancel}
          okText="预览"
        >
          <TextArea rows={14} placeholder="请输入id号，用英文逗号隔开" value={Ids} onChange={(e) => this.setState({ Ids: e.target.value })} />
        </Modal>
      </SliderEditorWarpper>
    );
  }
}
