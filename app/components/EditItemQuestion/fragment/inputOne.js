import React from 'react';
import { FlexRow, FlexRowCenter, FlexColumn } from 'components/FlexBox';
import { ifLessThan, renderToKatex } from 'components/CommonFn';
import { Input } from 'antd';
import {
  ValueLeft,
  ValueRight,
  ListItem,
} from './style';
import {
  doNothing,
} from './common';

/**
 * 只有一个输入项
 * @param {*} props 
 * index：子题序号
 * i：选项的序号
 */
const InputOne = (props) => {
  const { index, i, degree, type, title, newQuestion, clickEditItem, getUeditor } = props;
  const content = degree === 'parent' ? newQuestion.get(type) : newQuestion.getIn(['children', index, i, type]);
  return (<div>
    <FlexRowCenter style={{ minHeight: 30, fontSize: 16, fontWeight: 600, color: '#333' }}>{title}：</FlexRowCenter>
    <ListItem dangerouslySetInnerHTML={{ __html: renderToKatex(content || '') }} onClick={(e) => clickEditItem(degree, type, index, i, e)} ></ListItem>
    {getUeditor(`${degree}${type}${ifLessThan(index)}${ifLessThan(i)}`)}
  </div>);
};

export default InputOne;
