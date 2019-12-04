import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { fromJS } from 'immutable';
import { createStructuredSelector } from 'reselect';
import { makePaperData, makeSelectedId } from '../redux/selectors';
import QuestionCounter from '../../../TeacherCertification/components/questionCounter';
import {
  setSelectedId,
  setEditScoreData,
  deleteBigQuestion,
  showAddQuestion,
} from '../redux/action';
import { countScore } from '../utils';

const EditSlider = ({
  data = fromJS([]),
  setSelectedId,
  selectedId,
  setEditScoreData,
  deleteBigQuestion,
  showAddQuestion,
}) => {
  const { score, num } = countScore(data.toJS());
  return (
    <div style={{ borderRight: '1px solid #eee', height: '100%', padding: 5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>分数：{score}</span>
        <span>题数：{num}</span>
      </div>
      {data.map((el, index) => (
        <QuestionCounter
          currentId={selectedId}
          key={index}
          index={index + 1}
          bigQuestion={el.toJS()}
          onSelect={setSelectedId}
          onDeleteBig={deleteBigQuestion}
          onBatchSetScore={() => {
            const ids = el
              .get('examPaperContentQuestionList')
              .map(question => question.get('questionId'));
            const data = {
              visible: true,
              isBatch: true,
              score: 0,
              ids,
            };
            setEditScoreData(fromJS(data));
          }}
        />
      ))}

      <Button type="primary" onClick={showAddQuestion}>
        新增题目
      </Button>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  data: makePaperData(),
  selectedId: makeSelectedId(),
});

const mapDispatchToProps = dispatch => ({
  setSelectedId: id => {
    dispatch(setSelectedId(id));
  },
  setEditScoreData: data => {
    dispatch(setEditScoreData(data));
  },
  deleteBigQuestion: (id, index) => {
    dispatch(deleteBigQuestion(index));
  },
  showAddQuestion: () => {
    dispatch(showAddQuestion(true));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditSlider);
