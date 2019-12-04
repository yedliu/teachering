import React from 'react';
import { FlexRow, FlexRowCenter, FlexColumn } from 'components/FlexBox';
import { ifLessThan, renderToKatex, numberToLetter } from 'components/CommonFn';
import { Input } from 'antd';
import { fromJS } from 'immutable';
import {
  ValueLeft,
  ValueRight,
} from './style';
import {
  doNothing,
} from './common';

const InputOne = (props) => {
  const { index, i, degree, type, title, content, clickEditItem, getUeditor } = props;
  return (<Radio.Group
    style={{ width: '100%' }} value={content.get(0) || ''} onChange={(list) => {
      // const _answerList = [list.target.value];
      // let newQuestionData = newQuestion;
      // if (degree === 'parent') {
      //   newQuestionData = newQuestion.set('answerList', fromJS(_answerList));
      // } else {
      //   newQuestionData = newQuestion.setIn(['children', index, 'answerList'], fromJS(_answerList));
      // }
      // setNewQuestionData(newQuestionData);
    }}
  >
    <AnswerListBox>
      {new Array(count).fill('').map((it, i) => {
        return (<Radio key={i} value={numberToLetter(i)}>{numberToLetter(i)}</Radio>);
      })}
    </AnswerListBox>
  </Radio.Group>);
}

export default inputOne;
