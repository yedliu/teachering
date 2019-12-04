import React from 'react';
import { FlexRow, FlexRowCenter } from 'components/FlexBox';
import { ifLessThan } from 'components/CommonFn';
import { renderToKatex } from 'zm-tk-ace/utils';
import { PlaceHolderBox } from 'components/CommonFn/style';
import { Button } from 'antd';
import { fromJS } from 'immutable';
import {
  ValueLeft,
  ValueRight,
  ListItem,
  listBoxStyle,
  DeleteItem,
} from './style';


const AnswerList = (props) => {
  const { index,  degree, type, newQuestion, clickEditItem, changeOptionOrAnswer, getUeditor } = props;
  const answerList = newQuestion.get('answerList') || fromJS([]);
  return (<div style={listBoxStyle}>
    {answerList.map((it, i) => {
      return (<div key={i}>
        <FlexRowCenter style={{ minHeight: 30, fontSize: 16, fontWeight: 600, color: '#333' }}><ValueLeft style={{ fontSize: 16, fontWeight: 600, color: '#333', minWidth: 65 }}>答案：</ValueLeft><PlaceHolderBox />
          <Button style={{ margin: 0 }} onClick={() => changeOptionOrAnswer(degree, type, 'add', index, -1)}>添加答案</Button>
        </FlexRowCenter>
        <FlexRow>
          <ValueRight style={{ maxWidth: 30, width: 30, fontSize: '10.5pt', lineHeight: '2em', padding: '5px 0' }}>{`${i + 1}、`}</ValueRight>
          <ListItem dangerouslySetInnerHTML={{ __html: renderToKatex(it || '') }} onClick={(e) => clickEditItem(degree, type, index, i, e)} ></ListItem>
          {i > 0 && answerList.count() > 1 ? <DeleteItem onClick={() => changeOptionOrAnswer(degree, type, 'remove', index, i)}>删除</DeleteItem> : ''}
        </FlexRow>
        {getUeditor(`${degree}${type}${ifLessThan(index)}${ifLessThan(i)}`)}
      </div>);
    })}
  </div>);
};

export default AnswerList;
