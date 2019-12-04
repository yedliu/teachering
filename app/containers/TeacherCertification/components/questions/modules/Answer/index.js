import React from 'react';
import { Radio } from 'antd';
import MouleTitle from '../../child/MouleTitle';

const RadioGroup = Radio.Group;

const Answer = ({
  onChange,
  value,
  answerList = [],
  rules = {},
  errorMessage,
  style,
}) => (
  <div style={{ ...style }}>
    <MouleTitle required={rules.required} errorMessage={errorMessage}>
      答案
    </MouleTitle>
    <RadioGroup onChange={onChange} value={value}>
      {answerList.map(answer => (
        <Radio key={answer} value={answer}>
          {answer}
        </Radio>
      ))}
    </RadioGroup>
  </div>
);

export default Answer;
