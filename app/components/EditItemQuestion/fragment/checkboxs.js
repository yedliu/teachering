import React from 'react';
import { LettersInOptionsIndex } from 'components/CommonFn';
import { numberToLetter } from 'zm-tk-ace/utils';
import { Checkbox } from 'antd';
import { fromJS } from 'immutable';
import {
  // ValueLeft,
  // ValueRight,
  AnswerListBox,
  OptionBox,
} from './style';

const Checkboxs = (props) => {
  const { index, degree, newQuestion, setNewQuestionData } = props;
  const count = (newQuestion.get('optionList') || fromJS([])).count();
  return (<Checkbox.Group
    style={{ width: '100%' }} value={(newQuestion.get('answerList') || fromJS([])).toJS()} onChange={(list) => {
      let newQuestionData = newQuestion;
      if (degree === 'parent') {
        newQuestionData = newQuestion.set('answerList', fromJS(list.filter((it) => /^[A-Z]$/.exec(it) && (LettersInOptionsIndex(it) < count)).sort()));
      } else {
        newQuestionData = newQuestion.setIn(['children', index, 'answerList'], fromJS(list.filter((it) => /^[A-Z]$/.exec(it) && (LettersInOptionsIndex(it) < count)).sort()));
      }
      setNewQuestionData(newQuestionData);
    }}
  >
    <AnswerListBox>
      {new Array(count).fill('').map((it, i) => {
        return (<OptionBox style={{ minWidth: 80, flex: 0 }} key={i}><Checkbox style={{ marginLeft: 4 }} value={numberToLetter(i)}>{numberToLetter(i)}</Checkbox></OptionBox>);
      })}
    </AnswerListBox>
  </Checkbox.Group>);
};

export default Checkboxs;
