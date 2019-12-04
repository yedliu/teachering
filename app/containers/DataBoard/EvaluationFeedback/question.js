import React from 'react';
import { fromJS } from 'immutable';
import { Modal } from 'antd';
import { ZmExamda } from 'zm-tk-ace';
import { getQuestionById } from './server';
import { QuestionWrapper } from './style';
import Rate from './components/rate';

export default class Question extends React.Component {
  state = {
    questionData: null, // 题目数据
  };

  async componentDidMount() {
    const { questionId, examInfoId } = this.props;
    // 获取题目数据
    const data = await getQuestionById(examInfoId, questionId);
    this.setState({ questionData: fromJS(data) });
  }

  render() {
    const { questionData } = this.state;
    return (
      <Modal
        width={1000}
        title="题目详情"
        visible
        onCancel={this.props.onCancel}
        footer={null}
      >
        <QuestionWrapper>
          {questionData && (
            <ZmExamda
              question={questionData}
              options={[
                { key: 'title' },
                { key: 'analysis', label: '【分析】' },
                { key: 'answerList', label: '【解答】' },
              ]}
            />
          )}
          <div className="student-answer">
            <span>【学生答案】</span>
            {questionData && questionData.get('stuAnswer').length > 0 && (
              <span className="answer">{questionData.get('stuAnswer')}</span>
            )}
          </div>
          <div className="bottom-block">
            <span>
              答题时间：{questionData && questionData.get('answerTime')}秒钟
            </span>
            <span>
              平均答题正确率：{questionData && `${questionData.get('accuracy') * 100}%`}
            </span>
            <span>
              本题难度：{questionData && <Rate rate={questionData.get('difficulty')} />}
            </span>
          </div>
        </QuestionWrapper>
      </Modal>
    );
  }
}
