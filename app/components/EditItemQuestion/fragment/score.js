import React from 'react';
import { FlexRowCenter } from 'components/FlexBox';
import { fromJS } from 'immutable';
import InputNumber from '../../InputNumber';
import {
  ValueRight,
} from './style';


class Score extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.removeAnswer = this.removeAnswer.bind(this);
    this.state = {
      showAddErrorOptionInput: false,
    };
  }
  removeAnswer(value, index) {
    const { newQuestion, setNewQuestionData } = this.props;

    const optionList = newQuestion.get('optionList') || fromJS([]);
    const answerList = newQuestion.get('answerList') || fromJS([]);
    if (answerList.includes(value)) {
      // 使用 jQuery 来恢复被设为答案的内容
      const $zmfillList = $('.w-e-text zmfill');  // 找到所有的 zmfill
      console.dir($zmfillList);
      $zmfillList.filter((index, item) => item.attributes.answerstring.value === value).replaceWith(value); // 过滤并替换掉
    }
    const newOptionList = optionList.filter((it) => it !== value);
    const newAnswerList = answerList.filter((it) => it !== value);
    setNewQuestionData(newQuestion.set('optionList', newOptionList).set('answerList', newAnswerList));
    setTimeout(() => {
      window.wangeditor.change();
    }, 30);
  }
  render() {
    const { newQuestion, setNewQuestionData } = this.props;
    const itemScore = newQuestion.get('itemScore');
    return (<FlexRowCenter height={30} style={{ fontSize: 14 }}>
      <ValueRight width={100} style={{ color: '#333' }}>设置每一空分数：</ValueRight>
      <InputNumber
        value={itemScore || 1} min={0.5} max={100} step={0.5} precision={1} onChange={(value) => {
          const score = newQuestion.get('answerList') ? value * newQuestion.get('answerList').count() : 0;
          setNewQuestionData(newQuestion.set('itemScore', value).set('score', score));
        }}
      />
    </FlexRowCenter>);
  }
}

export default Score;
