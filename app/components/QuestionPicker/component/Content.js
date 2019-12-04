import React from 'react';
import { Button, Spin } from 'antd';
import { ZmExamda } from 'zm-tk-ace';
import moment from 'moment';
import { QuestionWrapper, QuestionInfo } from './style';
import ErrorCorrect from '../../ErrorCorrect';
import sourceModule from 'components/ErrorCorrect/sourceModule';
const emptyImg = window._baseUrl.imgCdn + '2cfcc00d-8360-42c7-b371-4253fd4735cb.png';

const Content = ({ data, style, showAnswer, pushOneQuestion, basketIds, loading }) => {
  return (
    <div style={{ ...style }}>
      <Spin spinning={loading}>
        {data.length <= 0 ? (
          <div style={{ textAlign: 'center', marginTop: 100 }}>
            <img role="presentation" src={emptyImg} />
            <h2 style={{ color: '#999', textAlign: 'center' }}>
              这里空空如也！
            </h2>
          </div>
        ) : (
          <div style={{ padding: 2 }}>
            {data.map((el, index) => (
              <RenderQuestion
                data={el}
                key={el.id}
                onBasket={basketIds.includes(el.id)}
                pushOneQuestion={pushOneQuestion}
                showAnswer={showAnswer}
                index={`${index + 1}. `}
              />
            ))}
          </div>
        )}
      </Spin>
    </div>
  );
};

export default Content;

const RenderQuestion = ({
  data,
  index,
  pushOneQuestion,
  onDelete,
  showAnswer,
  onEditTag,
  onBasket,
  loading,
}) => (
  <QuestionWrapper>
    <ZmExamda
      index={index}
      question={data}
      showRightAnswer={data.showAnalysis}
      options={
        data.showAnalysis
          ? ['title', 'references', 'problem', 'answerList', 'analysis', 'referenceAnswer']
          : ['title', 'references', 'problem']
      }
    />
    <QuestionInfo>
      <span>题目ID: {data.id}</span>
      <span>题型: {data.questionType || '-'}</span>
      <span>
        修改时间: {data.updatedTime ? moment(data.updatedTime).format('YYYY-MM-DD') : '-'}
      </span>
      <span>使用次数: {data.quoteCount || 0}</span>
      <span>答题次数: {data.questionAnswerCount || 0}</span>
    </QuestionInfo>
    <div className="btn-wrapper">
      <Button
        onClick={() => {
          showAnswer(data.id);
        }}
        size="small"
      >
        {data.showAnalysis ? '隐藏解析' : '查看解析'}
      </Button>
      <div style={{ display: 'inline-block' }}>
        <ErrorCorrect
          size={'small'}
          questionId={data.id}
          extraParams={{ source: 2, sourceModule: 6 }}
          sourceModule={sourceModule.tk.universalTopicSelection.id}
        />
      </div>
      <Button
        onClick={() => {
          pushOneQuestion(data, onBasket);
        }}
        type={onBasket ? '' : 'primary'}
        size="small"
      >
        {onBasket ? '移除试题篮' : '加入试题篮'}
      </Button>
    </div>
  </QuestionWrapper>
);
