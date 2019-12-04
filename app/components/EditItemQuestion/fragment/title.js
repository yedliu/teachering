import React from 'react';
import { FlexRowCenter, FlexColumn } from 'components/FlexBox';
import { ifLessThan, renderToKatex } from 'components/CommonFn';
import { Input } from 'antd';
import {
  ValueLeft,
  ListItem,
  PromptText,
} from './style';
import {
  doNothing,
} from './common';

const Title = (props) => {
  const { index, i, degree, type, mustSel, width, newQuestion, clickEditItem, getUeditor } = props;
  return (<div>
    <ValueLeft width={width}>{mustSel ? <span style={{ color: 'red' }}>*</span> : ''}{newQuestion.get('templateType') === 1 && mustSel ? '主' : ''}标题： <PromptText>最多100字</PromptText></ValueLeft>
    <ListItem dangerouslySetInnerHTML={{ __html: renderToKatex(newQuestion.get(type) || '') }} onClick={(e) => clickEditItem(degree, type, -1, -1, e)} ></ListItem>
    {getUeditor(`${degree}${type}-1-1`)}
  </div>);
};

export default Title;
