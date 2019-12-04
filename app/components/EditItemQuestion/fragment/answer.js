import React from 'react';
import InputOne from './inputOne';

const Answer = (props) => {
  return (<InputOne {...props} title="答案" type="answerList"></InputOne>);
};

export default Answer;
