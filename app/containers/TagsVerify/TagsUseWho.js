import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import immutable, { fromJS } from 'immutable';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { Input, Radio } from 'antd';

import { makeQuestionsList, makeQuestionsIndex } from './selectors';
import { setQuestionsListAction } from './actions';

const RadioGroup = Radio.Group;
const RadioBox = styled(Radio) `
  margin: 10px;
`;
const SelectTagsFromWho = styled.div`
  min-height: 200px;
  padding: 10px;
  background: #fff;
`;
const Textarea = Input.TextArea;
const TagsItemContent = styled.div`
  display: inline-block;
  background: ${(props) => ['#9cf', '#9fc', '#f66', '#ddd'][props.index - 1]};
  min-width: 70px;
  height: 20px;
  border-radius: 6px;
  text-indent: 10px;
  line-height: 20px;
  color: black;
`;

export class TagsUseWho extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.tagsChange = this.tagsChange.bind(this);
  }
  tagsChange(questionsIndex, e, type) {
    const newQuestionList = this.props.questionsList.setIn([questionsIndex, 'questionOutputDTO', 'questionTag', type], e.target.value);
    this.props.dispatch(setQuestionsListAction(newQuestionList));
  }
  render() {
    const questionsIndex = this.props.questionsIndex;
    const currentQuestion = this.props.questionsList.getIn([questionsIndex, 'questionOutputDTO', 'questionTag']) || fromJS({});
    return (<SelectTagsFromWho>
      <p>哪位老师的标注满足需求：</p>
      <RadioGroup value={currentQuestion.get('tagAdopt') || 0} onChange={(e) => this.tagsChange(questionsIndex, e, 'tagAdopt')}>
        <RadioBox value={1}><span style={{ color: '#999' }}></span><TagsItemContent index={1}>标注者一</TagsItemContent></RadioBox>
        <RadioBox value={2}><span style={{ color: '#999' }}></span><TagsItemContent index={2}>标注者二</TagsItemContent></RadioBox>
        <RadioBox value={3}><span style={{ color: '#999' }}></span><TagsItemContent index={3}>都满足</TagsItemContent></RadioBox>
        <RadioBox value={4}><span style={{ color: '#999' }}></span><TagsItemContent index={4}>都不满足</TagsItemContent></RadioBox>
      </RadioGroup>
      <p style={{ fontSize: '12pt', color: '#666', fontWeight: 600, lineHeight: 2 }}>不满足需求的原因：</p>
      <Textarea style={{ height: 100, resize: 'none', border: '1px solid #ddd' }} value={currentQuestion.get('tagReason') || 0} onChange={(e) => this.tagsChange(questionsIndex, e, 'tagReason')}></Textarea>
    </SelectTagsFromWho>);
  }
}

TagsUseWho.propTypes = {
  dispatch: PropTypes.func.isRequired,
  questionsList: PropTypes.instanceOf(immutable.List).isRequired,
  questionsIndex: PropTypes.number.isRequired,
};
const mapStateToProps = createStructuredSelector({
  questionsList: makeQuestionsList(),
  questionsIndex: makeQuestionsIndex(),
});
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(TagsUseWho);
