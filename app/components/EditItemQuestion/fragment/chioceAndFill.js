import React from 'react';
import { PlaceHolderBox } from 'components/CommonFn/style';
import { fromJS } from 'immutable';
import FillContent from './fillContent';
import FillAnswerList from './fillAnswerList';
import Score from './score';
import {
  FillQuestionWrapper,
} from './style';


class FillQuestion extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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
      let $zmfillList = $('.w-e-text zmfill');  // 找到所有的 zmfill
      // console.dir($zmfillList);
      $zmfillList.filter((index, item) => item.attributes.answerstring.value === value).replaceWith(value); // 过滤并替换掉
      $zmfillList = null;
    }
    const newOptionList = optionList.filter((it) => it !== value);
    const newAnswerList = answerList.filter((it) => it !== value);
    setNewQuestionData(newQuestion.set('optionList', newOptionList).set('answerList', newAnswerList).set('score', newAnswerList.count() * newQuestion.get('itemScore')));
    setTimeout(() => {
      window.wangeditor.change();
    }, 30);
  }
  render() {
    const props = this.props;
    return (<div>
      <Score {...props}></Score>
      <FillQuestionWrapper>
        <FillContent {...props} degree="parent" index={-1} i={-1} mustSel removeAnswer={this.removeAnswer}></FillContent>
        <PlaceHolderBox flex={1}></PlaceHolderBox>
        <FillAnswerList {...props} mustSel showInput={this.state.showAddErrorOptionInput} removeAnswer={this.removeAnswer}></FillAnswerList>
      </FillQuestionWrapper>
    </div>);
  }
}

export default FillQuestion;
