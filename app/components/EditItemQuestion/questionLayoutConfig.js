import React from 'react';
import Title from './fragment/title';
import Answer from './fragment/answer';
import Analysis from './fragment/analysis';
import AnswerList from './fragment/answerList';
import OptionList from './fragment/optionList';
import CheckBoxs from './fragment/checkboxs';
import FillQuestion from './fragment/chioceAndFill';

const layoutConfig = {
  title: (props) => (<Title {...props}></Title>),
  answer: (props) => (<Answer {...props}></Answer>),
  analysis: (props) => (<Analysis {...props}></Analysis>),
  answerList: (props) => (<AnswerList {...props}></AnswerList>),
  optionList: (props) => (<OptionList {...props}></OptionList>),
  checkBoxs: (props) => (<CheckBoxs {...props}></CheckBoxs>),
  fillQuestion: (props) => (<FillQuestion {...props}></FillQuestion>),
};

export default layoutConfig;
