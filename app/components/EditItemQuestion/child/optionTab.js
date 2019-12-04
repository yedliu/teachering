import React, { PropTypes } from 'react';
import { fromJS } from 'immutable';
import { FlexRowCenter, } from 'components/FlexBox';
import {
  ValueLeft,
} from 'containers/PaperFinalVerify/paperStyle';
import {
  numberToLetter,
  letterOptions,
} from 'components/CommonFn';
import {
  Button,
  Radio,
  message
} from 'antd';

const RadioGroup = Radio.Group;

const radios = {
  text: '文本',
  img: '图片',
  audio: '音频',
};
const radios2 = {
  text: '文本',
  img: '图片',
};
export default class OptionTab extends React.Component {
  isJudge = this.props.judge || [9].includes(this.props.newQuestion.get('templateId'))
  isListen = [50].includes(this.props.newQuestion.get('typeId'))
  // 边界校验
  // debugger;
  minMaxWarn = (min, max, list, way = 'add') => {
    if (list.count() <= min && way === 'remove') {
      message.warn(`至少得有 ${min} 个${this.isJudge ? '选项' : '子题'}哦！`);
      return true;
    } else if (list.count() >= max && way === 'add') {
      message.warn(`${this.isJudge ? '子题' : '选项'}不可以超过 ${max} 个哦！`);
      return true;
    }
    return false;
  }
  isCheck = (list) => {
    if (this.isListen && this.minMaxWarn(2, 10, list)) return false;
    if (this.isJudge && this.minMaxWarn(1, 5, list)) return false;
    if (this.minMaxWarn(1, 26, list)) return false;
    return true;
  }
  handleAnswer = (answerList, newList, i) => {
    const newAnswerList = answerList
      .filter((it) => it !== numberToLetter(i))
      .filter((it) => letterOptions.indexOf(it) < newList.count() && letterOptions.indexOf(it) > -1);
    return newAnswerList;
  }
  handleList = (oldList, way, i) => {

    if (!this.isCheck(oldList)) return oldList;
    console.log('handleList', this.isCheck(oldList));
    const cList = {
      add: oldList.push(''),
      del: oldList.splice(i, 1)
    };
    const newList = cList[way];
    return newList;
  }
  changeOptionAndAnswer = (target, type, way) => {
    const {
      degree,
      i, // 第几项
      index // 第几题
    } = target;
    const {
      newQuestion,
      setNewQuestionData
    } = this.props;

    let newQuestionData = newQuestion;

    if (degree === 'parent') {
      const oldList = newQuestion.get(type);
      const answerList = newQuestion.get('answerList') || fromJS([]);
      const newList = this.handleList(oldList, way, i);
      const newAnswerList = this.handleAnswer(answerList, newList, i);

      newQuestionData = newQuestion.set(type, newList).set('answerList', newAnswerList);
      setNewQuestionData(newQuestionData);

    } else if (degree === 'children') {

      const oldList = newQuestion.getIn([degree, index, type]) || fromJS([]);
      const answerList = newQuestion.getIn([degree, index, 'answerList']) || fromJS([]);
      const newList = this.handleList(oldList, way, i);
      const newAnswerList = this.handleAnswer(answerList, newList, i);

      newQuestionData = newQuestion.setIn([degree, index, type], newList).setIn([degree, index, 'answerList'], newAnswerList);
    } else {
      newQuestionData = newQuestion.setIn([degree, index, type], newList);
    }
    setNewQuestionData(newQuestionData);

  }
  handleChange = (target, type, e) => {
    const {
      degree,
      index,
    } = target;
    const {
      newQuestion,
      setContentType,
      setNewQuestionData,
      judge,
    } = this.props;
    // debugger
    const value = e.target.value;
    setContentType(index, value);
    const defaultCount = judge ? 1 : 3;
    if (!degree) return;
    let newQ = newQuestion;
    if (degree === 'parent') {
      setNewQuestionData(newQuestion.set(type, fromJS(Array(defaultCount).fill(''))));
    } else {
      const children = newQuestion.get(degree);
      if (judge) {
        for (let i = 0; i < children.count(); i++) {
          newQ = newQ.setIn([degree, i, type], fromJS(Array(defaultCount).fill({})));
        }
        setNewQuestionData(newQ);
      } else {
        newQ = newQ.setIn([degree, index, type], fromJS(Array(defaultCount).fill({})));
        setNewQuestionData(newQ);
      }

      console.log('optionTabnewQuestion', newQuestion.toJS());
    }
  }
  render() {
    const {
      contentType,
      target,
      noAudio,
      judge
    } = this.props;
    const {
      degree,
      i,
      index,
      type,
    } = target;
    const rIndex = judge ? 0 : index;
    console.log('OptionTab', target, noAudio, 'contentType', contentType, index, rIndex);
    return (
      <FlexRowCenter style={{ minHeight: 30, fontSize: 16, fontWeight: 600, color: '#333' }}>
        <ValueLeft style={{ fontSize: 16, fontWeight: 600, color: '#333', minWidth: 65 }}>
          <choice-label>{this.isJudge ? '子题格式:' : '选项：'}</choice-label>
          <RadioGroup
            style={{ margin: '0 10px' }}
            onChange={(e) => this.handleChange({ degree, index: rIndex }, type, e)}
            value={contentType && contentType[rIndex] || 'text'}
            name="radiogroup"
          >
            {Object.keys(noAudio ? radios2 : radios).map((radio, i) => (
              <Radio key={i} value={radio}>{noAudio ? radios2[radio] : radios[radio]}</Radio>
            ))}
          </RadioGroup>
        </ValueLeft>
        {judge ? '' :
        <Button style={{ margin: 0 }} onClick={() => {
          this.changeOptionAndAnswer({ degree, i, index: rIndex }, type, 'add');
        }}>{this.isJudge ? '添加子题' : '添加选项'}</Button>}
      </FlexRowCenter>
    );
  }
}
OptionTab.propTypes = {
  judge: PropTypes.bool, // 是否是互动判断题
  contentType: PropTypes.object, // 当前 Tab 的类型
  newQuestion: PropTypes.object,
  setNewQuestionData: PropTypes.func,
  setContentType: PropTypes.func,
  target: PropTypes.object, // 選項對應的字段，如 optionElementList | stemElementList
};
