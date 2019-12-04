import React from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import styled from 'styled-components';
import { message } from 'antd';
import EditHeader from './module/EditHeader';
import EditSlider from './module/EditSlider';
import EditForm from './module/EditForm';
import AddQuestion from './module/AddQuestion';
import PaperEditScore from 'containers/TeacherCertification/components/paperEidtScore';
import {
  setEditScoreData,
  setQuestionScore,
  showAddQuestion,
  setPaperData,
} from './redux/action';

const Content = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;
const Slider = styled.div`
  flex: 0 0 250px;
  height: 100%;
  overflow: auto;
`;

const Main = styled.div`
  height: 100%;
  overflow: hidden;
  flex: 1;
`;

const EditPage = ({
  editScoreData,
  hideEditScore,
  setQuestionScore,
  showAddQuestion,
  questionTypeList,
  hideAddQuesiton,
  setPaperData,
  paperData,
}) => {
  const addNewQuestion = question => {
    let newPaperData;
    const hasSameQuestionType = paperData.some((el, index) => {
      if (el.get('typeId') === question.typeId) { // 要添加的题目 题型已存在
        newPaperData = paperData.setIn(
          [index, 'examPaperContentQuestionList'],
          el.get('examPaperContentQuestionList').push(fromJS({
            id: question.id,
            questionId: question.id,
            score: question.score,
            questionOutputDto: question,
          })),
        );
        return true;
      }
      return false;
    });
    if (!hasSameQuestionType) { // 要添加的题目 题型不存在
      newPaperData = paperData.push(fromJS({
        name: question.questionType,
        typeId: question.typeId,
        examPaperContentQuestionList: [{
          id: question.id,
          questionId: question.id,
          score: question.score,
          questionOutputDto: question,
        }],
      })).sort((pre, next) => (next.typeId - pre.typeId)).map((el, index) => {
        return el.set('serialNumber', index + 1);
      });
    }
    setPaperData(newPaperData);
  };
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <EditHeader />
      <Content>
        <Slider>
          <EditSlider />
        </Slider>
        <Main>
          <EditForm />
        </Main>
      </Content>
      {editScoreData.get('visible') && (
        <PaperEditScore
          onCancel={hideEditScore}
          isBatch={editScoreData.get('isBatch')}
          target={editScoreData.get('ids')}
          score={editScoreData.get('score') || 0}
          onOk={setQuestionScore}
        />
      )}
      {showAddQuestion && (
        <AddQuestion
          isOpen
          questionTypeList={questionTypeList}
          onClose={hideAddQuesiton}
          addNew={addNewQuestion}
        />
      )}
    </div>
  );
};

const mapStateToProps = state => {
  const subState = state.get('childPaperManagement');
  return {
    editScoreData: subState.get('editScoreData'),
    showAddQuestion: subState.get('showAddQuestion'),
    questionTypeList: subState.getIn(['dataList', 'questionTypeList']),
    paperData: subState.get('paperData'),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onShowAnalysis: id => {
      dispatch(toggleShowAnswer([id]));
    },
    hideEditScore: () => {
      dispatch(setEditScoreData(fromJS({ visible: false })));
    },
    setQuestionScore: (target, isBatch, score) => {
      if (Number(score) <= 0) {
        message.warning('分数不能小于 0');
        return;
      }
      dispatch(setEditScoreData(fromJS({ visible: false })));
      dispatch(setQuestionScore(target, score));
    },
    hideAddQuesiton: () => {
      dispatch(showAddQuestion(false));
    },
    setPaperData: paperData => {
      dispatch(setPaperData(fromJS(paperData)));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditPage);
