import React, { PropTypes } from 'react';
import { fromJS } from 'immutable';

import ChoseOption from './choseOption';

export default class Judge extends React.Component {
  constructor(props) {
    super();
    this.state = {
      i: -1
    };
  }
  getIndex = (i) => {
    const { target, handleDelItem } = this.props;
    const {
      index,
    } = target;
    this.setState({ i });
    handleDelItem(index);
  }
  render() {
    const {
      contentType,
      target,
      optionElementList,
      getOptionElementContent,
      getJudgeAns,
      answerList,
    } = this.props;
    const {
      degree,
      index,
    } = target;

    console.log('判断optionElementList', optionElementList.toJS());
    const renderTab = () => (
      optionElementList.map((it, i) => {
        return (
          <div key={i} style={{ marginTop: '10px' }}>
            <ChoseOption
              judge
              index={index}
              contentType={contentType && contentType[index]}
              option={it}
              getContent={(data) => getOptionElementContent(degree, index, i, data)}
              getIndex={this.getIndex}
              getJudgeAns={(ans) => getJudgeAns(degree, index, i, ans)}
              optionElementItem={optionElementList.get(i) || fromJS({})}
              answerList={answerList}
              type={'stemElement'}
            />
          </div>
        );
      })
    );
    const isImg = contentType && contentType[index] === 'img';
    // console.log(isImg, contentType, 'contentType');
    return (
      <div>
        <div style={{ display: isImg ? 'flex' : 'block' }}>{renderTab()}</div>
      </div>
    );
  }
}

Judge.propTypes = {
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