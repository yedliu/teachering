import React from 'react';
import { fromJS } from 'immutable';
import PaperMsg from './paperMsg';
import QuestionListComponent from './questionList';
import {
  RootWrapper,
} from './previewPaperOrHwStyle';

const emptyMap = fromJS({});
const emptyList = fromJS([]);

class Preview extends React.Component {
  render() {
    const {
      data = emptyMap,
      goBack,
      usePaper,
      changeQuestionState,
      selectQuestion,
      toolConfig,
    } = this.props;
    const questionsList = data.get('questionList') || emptyList;
    const questionCount = questionsList.count();
    const showAllAnalysis = questionCount > 0 && questionsList.every((question) => question.get('showAnalysis'));
    return (
      <RootWrapper>
        <PaperMsg
          title={data.get('name')} // 试卷或作业标题
          goBack={goBack} // 返回按钮回调
          usePaper={usePaper} // 确认使用的回调
          count={questionCount} // 题目总数
          showAllAnalysis={showAllAnalysis} // 显示全部解析
          changeQuestionState={changeQuestionState} // 控制用来设置题目属性的，这里用来控制调节 “显示全部解析” 功能
        />
        <QuestionListComponent
          questionsList={questionsList}
          changeQuestionState={changeQuestionState}
          selectQuestion={selectQuestion}
          toolConfig={toolConfig}
        />
      </RootWrapper>
    );
  }
}

export default Preview;