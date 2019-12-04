import React from 'react';
import { FlexRow, FlexRowCenter } from 'components/FlexBox';
import { ifLessThan,  } from 'components/CommonFn';
import { renderToKatex, numberToLetter } from 'zm-tk-ace/utils';
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

const OptionList = (props) => {
  const { index, i, degree, type, newQuestion, clickEditItem, changeOptionOrAnswer, getUeditor } = props;
  const optionList = newQuestion.get('optionList') || fromJS([]);
  return (<div>
    <div style={listBoxStyle}>
      {optionList.map((it, iit) => {
        return (<div key={iit}>
          <FlexRowCenter style={{ minHeight: 30, fontSize: 16, fontWeight: 600, color: '#333' }}>
            <ValueLeft style={{ fontSize: 16, fontWeight: 600, color: '#333', minWidth: 65 }}>选项：</ValueLeft>
            <PlaceHolderBox />
            <Button style={{ margin: 0 }} onClick={() => changeOptionOrAnswer(degree, type, 'add', index, -1)}>添加选项</Button>
          </FlexRowCenter>
          <FlexRow>
            <ValueRight style={{ maxWidth: 30, width: 30, fontSize: '10.5pt', lineHeight: '2em', padding: '5px 0' }}>{`${numberToLetter(i)}、`}</ValueRight>
            <ListItem dangerouslySetInnerHTML={{ __html: renderToKatex(it || '') }} onClick={(e) => clickEditItem(degree, type, index, i, e)} ></ListItem>
            {i > 0 && optionList.count() > 1 ? <DeleteItem onClick={() => changeOptionOrAnswer(degree, type, 'remove', index, i)}>删除</DeleteItem> : ''}
          </FlexRow>
          {getUeditor(`${degree}${type}${ifLessThan(index)}${ifLessThan(i)}`)}
        </div>);
      })}
    </div>
  </div>);
};

export default OptionList;
