import React from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { message } from 'antd';
import QuestionPicker from 'components/QuestionPicker';
import { changePage, setPaperData } from './redux/action';
import { getQuestionDataByList } from './utils';

const beforeAddToCart = data => {
  const typeIdList = [1, 2, 6, 35, 36, 37];
  const templateTypes = [2, 5, 6, 7];
  const typeId = Number(data.typeId);
  const templateType = Number(data.templateType);
  const questionType = data.questionType ? data.questionType : '';
  const template = templateType === 1 ? '复合' : templateType === 3 ? '填空' : '';
  if (!typeIdList.includes(typeId) || !templateTypes.includes(templateType)) {
    message.warning(`少儿测评卷不支持此题型：${template}${template ? '/' : ''}${questionType}`);
    return false;
  }
  return true;
};

const Picker = ({ goPaperPage, questionList, dispatch }) => {
  const handleClose = () => {
    dispatch(changePage('home'));
  };
  return (
    <QuestionPicker
      goPaperPage={goPaperPage}
      basketList={questionList}
      onClose={handleClose}
      beforeAddToCart={beforeAddToCart}
      includeTypeIdList={[1, 2, 6, 35, 36, 37]}
      templateTypes="2,5,6,7"
      moduleName="少儿测评组卷"
    />
  );
};

const mapStateToProps = state => {
  const subState = state.get('childPaperManagement');
  const paperData = subState.get('paperData');
  let questionList = [];
  paperData.forEach(el => {
    // 取出大题下的小题
    const questions = el
      .get('examPaperContentQuestionList')
      .map(question => question.get('questionOutputDto'))
      .filter(el => !!el)
      .toJS(); // 测服存在脏数据，处理已经删除的题目
    questionList.push(...(questions || []));
  });
  return {
    questionList,
  };
};
const mapDispatchToProps = dispatch => ({
  goPaperPage: data => {
    const paperData = getQuestionDataByList(data);
    dispatch(setPaperData(fromJS(paperData)));
    dispatch(changePage('edit'));
  },
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Picker);
