import React, { PropTypes } from 'react';
import {
  Radio,
} from 'antd';
import { FlexRowCenter, } from 'components/FlexBox';
import {
  AnswerListBox,
} from 'containers/PaperFinalVerify/paperStyle';

import {
  numberToLetter,
} from 'components/CommonFn';

const RadioGroup = Radio.Group;
class Answer extends React.Component {
  handleChange = (e) => {
    const {
      // target,
      getAnswerList
    } = this.props;
    // const {
    //   degree,
    //   i,
    //   index
    // } = target;
    const value = e.target.value;
    getAnswerList([value]);
  }

  render() {
    const {
      answerList,
      optionElementList,
      // target,
    } = this.props;
    // const {
    //   degree,
    //   i,
    //   index
    // } = target;
    const count = optionElementList.count();
    // console.log('answerList', answerList.get(0))
    const renderItem = () => (
      <RadioGroup
        style={{ width: '100%' }}
        value={answerList.get(0) || ''}
        onChange={this.handleChange}
      >
        <AnswerListBox>
          {new Array(count).fill('').map((it, i) => {
            return (<Radio key={i} value={numberToLetter(i)}>{numberToLetter(i)}</Radio>);
          })}
        </AnswerListBox>
      </RadioGroup>
    );


    return (
      <div>
        <FlexRowCenter style={{ minHeight: 30, fontSize: 16, fontWeight: 600, color: '#333' }}>
          答案：
        </FlexRowCenter>
        {renderItem()}
      </div>
    );
  }
}
Answer.propTypes = {
  answerList: PropTypes.object,
  optionElementList: PropTypes.object,
  // target: PropTypes.object,
  getAnswerList: PropTypes.func,
};

export default Answer;
