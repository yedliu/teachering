import React, { PropTypes } from 'react';
import { fromJS } from 'immutable';

import OptionTab from './optionTab';
import ChoseOption from './choseOption';
import Answer from './answer';

export default class Listen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      i: -1
    };
  }
  getIndex = (i) => {
    const { target, handleDelItem } = this.props;
    const {
      degree,
      index,
    } = target;
    this.setState({ i });
    handleDelItem(degree, index, i);
  }
  render() {
    const {
      contentType,
      newQuestion,
      setNewQuestionData,
      setContentType,
      target,
      optionElementList,
      getOptionElementContent,
      getJudgeAns,
      answerList,
      getAnswerList,
      changeOptionOrAnswer,
      noAudio
    } = this.props;
    const {
      degree,
      index,
    } = target;

    // console.log('聽力optionElementList', newQuestion.toJS(), optionElementList.toJS());
    const renderTab = () => (
      optionElementList.map((it, i) => {
        return (
          <div key={i} style={{ marginTop: '10px' }}>
            <ChoseOption
              serialMark="A"
              index={i}
              contentType={contentType && contentType[index]}
              option={it}
              getContent={(data) => getOptionElementContent(degree, index, i, data)}
              getIndex={this.getIndex}
              getJudgeAns={(ans) => getJudgeAns(degree, i, ans)}
              optionElementItem={optionElementList.get(i) || fromJS({})}
              type={'optionElement'}
            />
          </div>
        );
      })
    );
    const isImg = contentType && contentType[index] === 'img';
    console.log(isImg, contentType, 'contentType');
    return (
      <div>
        <OptionTab
          contentType={contentType}
          newQuestion={newQuestion}
          setNewQuestionData={setNewQuestionData}
          setContentType={setContentType}
          changeOptionOrAnswer={changeOptionOrAnswer}
          noAudio={noAudio}
          target={{
            ...target,
            type: 'optionElementList',
            i: this.state.i,
          }}
        />
        <option-item style={isImg ? { display: 'flex', flexWrap: 'wrap' } : {}}>{renderTab()}</option-item>
        <Answer
          answerList={answerList}
          optionElementList={optionElementList}
          getAnswerList={getAnswerList}
        />
      </div>
    );
  }
}

Listen.propTypes = {
  judge: PropTypes.bool, // 是否是互动判断题
  contentType: PropTypes.object, // 当前 Tab 的类型
  newQuestion: PropTypes.object,
  setNewQuestionData: PropTypes.func,
  setContentType: PropTypes.func,
  target: PropTypes.object,
  optionElementList: PropTypes.object,
  getOptionElementContent: PropTypes.func,
  handleDelItem: PropTypes.func,
  getJudgeAns: PropTypes.func,
  answerList: PropTypes.object,
  getAnswerList: PropTypes.func,
};
