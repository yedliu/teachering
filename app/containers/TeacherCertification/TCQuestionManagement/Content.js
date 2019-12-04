import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, Popconfirm, Switch } from 'antd';
import { ZmExamda } from 'zm-tk-ace';
import moment from 'moment';
const emptyImg =
  window._baseUrl.imgCdn + '2cfcc00d-8360-42c7-b371-4253fd4735cb.png';

const QuestionWrapper = styled.div`
  border: 1px solid #eee;
  padding: 10px;
  border-radius: 3px;
  margin-bottom: 20px;
  .btn-wrapper {
    text-align: right;
    .ant-btn {
      margin-right: 5px;
    }
  }
  &:hover {
    border-color: #108ee9;
  }
  p, label, div, span{
    font-family: 'Microsoft YaHei','Helvetica Neue',Helvetica,Arial,sans-serif;
  }
  .datatype-box img{
    margin-bottom: 5px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  line-height: 22px;
  font-size: 14px;
  margin-bottom: 10px;
  padding-right: 15px;
  .question-count{
    font-size: 18px;
    color: red;
    padding: 0 4px;
  }
`;

const QuestionInfo = styled.div`
  color: #af6b4d;
  span {
    margin-right: 10px;
  }
`;

export default class Content extends Component {
  render() {
    const {
      data,
      total,
      onEditQuestion,
      onDelete,
      showAnswer,
      onEditTag,
      showAllAnswer,
      onShowAllAnswer,
      userPermissions,
    } = this.props;
    return (
      <div>
        <Header>
          <span>
            共有符合条件的试题目<em className="question-count">{total}</em>道
          </span>
          <span>
            <Switch defaultChecked={false} onChange={onShowAllAnswer} />
            <span>显示参考答案或解析</span>
          </span>
        </Header>
        <div>
          {data.length <= 0 ? (
            <div style={{ textAlign: 'center', marginTop: 100 }}>
              <img role="presentation" src={emptyImg} />
              <h2 style={{ color: '#999', textAlign: 'center' }}>
                这里空空如也！
              </h2>
            </div>
          ) : (
            data.map((el, index) => (
              <RenderQuestion
                data={el}
                key={el.id}
                onEditQuestion={onEditQuestion}
                onDelete={onDelete}
                showAnswer={showAnswer}
                onEditTag={onEditTag}
                showAllAnswer={showAllAnswer}
                userPermissions={userPermissions}
                index={`${index + 1}. `}
              />
            ))
          )}
        </div>
      </div>
    );
  }
}

const RenderQuestion = ({
  data,
  index,
  onEditQuestion,
  onDelete,
  showAnswer,
  onEditTag,
  showAllAnswer,
  userPermissions = {},
}) => (
  <QuestionWrapper>
    <ZmExamda
      index={index}
      question={data}
      species="er"
      options={
        data.showAnalysis || showAllAnswer
          ? ['title', 'references', 'problem', 'answerList', 'analysis', 'referenceAnswer']
          : ['title', 'references', 'problem']
      }
    />
    <QuestionInfo>
      <span>题目ID: {data.id}</span>
      <span>
        最后修改:{' '}
        {`${data.updatedUserName || '-'} / ${
          data.updatedTime ? moment(data.updatedTime).format('YYYY-MM-DD') : '-'
        }`}
      </span>
      <span>使用次数: {data.quoteCount || 0}</span>
      <span>答题次数: {data.questionAnswerCount || 0}</span>
    </QuestionInfo>
    <div className="btn-wrapper">
      <Button
        onClick={() => {
          showAnswer(data.id);
        }}
        type="primary"
        size="small"
      >
        {data.showAnalysis ? '隐藏答案' : '显示答案'}
      </Button>
      {userPermissions.canEditTag && (
        <Button
          size="small"
          onClick={() => {
            onEditTag(data);
          }}
          type="primary"
        >
          编辑题目标签
        </Button>
      )}
      <Button
        onClick={() => {
          onEditQuestion(data);
        }}
        type="primary"
        size="small"
      >
        编辑题目
      </Button>
      {userPermissions.canDeleteQuestion && (
        <Popconfirm
          onConfirm={() => {
            onDelete(data.id);
          }}
          title="确认删除此题目？"
        >
          <Button type="danger" size="small">
            删除题目
          </Button>
        </Popconfirm>
      )}
    </div>
  </QuestionWrapper>
);
