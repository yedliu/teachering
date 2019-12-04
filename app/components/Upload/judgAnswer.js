import React, { Component } from 'react';
import { Radio } from 'antd';

const RadioGroup = Radio.Group;

class JudgAnswer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
    };
  }
  onChange = e => {
    const {
      getAnswer,
      index,
    } = this.props;
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
    getAnswer({ index, value: e.target.value });
  };

  render() {
    const {
      answerList,
    } = this.props;
    // console.log('answerList', answerList.toJS(), index);
    // 这里直接取得answerList的第一项，因为目前判断题不支持子子题
    return (
      <div style={{ marginBottom: '18px' }}>答案：
            <RadioGroup onChange={this.onChange} value={answerList.get(0)} name="radiogroup">
              <Radio value={'right'}>正确</Radio>
              <Radio value={'wrong'}>错误</Radio>
            </RadioGroup>
      </div>
    ); }
}

export default JudgAnswer;
