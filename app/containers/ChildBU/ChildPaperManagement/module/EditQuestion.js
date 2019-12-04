import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { fromJS } from 'immutable';
import PaperListItem from 'containers/TeacherCertification/components/paperListItem';
import {
  toggleShowAnswer,
  setEditScoreData,
  deleteSmallQuestion,
  orderQuestion,
} from '../redux/action';
import { makePaperData, makeSelectedId } from '../redux/selectors';

const EditQuestion = ({
  data = fromJS([]),
  selectedId,
  onShowAnalysis,
  setEditScoreData,
  deleteSmallQuestion,
  orderQuestion,
}) => {
  return (
    <div style={{ borderRight: '1px solid #eee', padding: 5, flex: 1 }}>
      {data.map((el, index) => (
        <PaperListItem
          species="tr"
          key={el.get('serialNumber')}
          index={index + 1}
          bigQuestionList={el.toJS()}
          selectedSmallId={selectedId}
          onShowAnalysis={onShowAnalysis}
          onDel={deleteSmallQuestion}
          onOrder={orderQuestion}
          onBatchSetScore={(questionId, isBatch, score) => {
            let data = {
              visible: true,
              isBatch,
            };
            if (isBatch) {
              const ids = el
                .get('examPaperContentQuestionList')
                .map(question => question.get('questionId'));
              data.ids = ids;
              data.score = 0;
            } else {
              data.ids = [questionId];
              data.score = score;
            }
            setEditScoreData(fromJS(data));
          }}
        />
      ))}
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  data: makePaperData(),
  selectedId: makeSelectedId(),
});

const mapDispatchToProps = dispatch => {
  return {
    onShowAnalysis: id => {
      dispatch(toggleShowAnswer([id]));
    },
    setEditScoreData: data => {
      dispatch(setEditScoreData(data));
    },
    deleteSmallQuestion: id => {
      dispatch(deleteSmallQuestion(id));
    },
    orderQuestion: (id, type, bigId, index) => {
      dispatch(orderQuestion(id, type, index));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditQuestion);
