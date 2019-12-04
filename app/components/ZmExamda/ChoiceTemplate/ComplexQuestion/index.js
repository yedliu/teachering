/**
 * ComplexQuestion
 */

import React from 'react';
// import RichEditor from '../modules/RichEditor';
import Title from '../modules/Title';
import Children from '../modules/Children';
import Group from '../modules/Group';
import PointList from '../modules/PointList';
import AnswerList from '../modules/AnswerList';
import Analysis from '../modules/Analysis';
import Labels from '../modules/Labels';
import {
  isString,
  isObject,
  isArray,
  reSortOption,
  fromJS,
} from '../common';
import { stringLabelList } from '../questionConfig';

class ComplexQuestion extends React.PureComponent { // eslint-disable-line
  constructor(props) {
    super(props);
    this.changeSelected = this.changeSelected.bind(this);
  }
  changeSelected(index, value, childrenItem) {
    const { question, interactive, handleChange } = this.props; // eslint-disable-line
    const children = question.get('children') || fromJS([]);
    if (interactive && handleChange) {
      const isChoice = childrenItem.get('typeId') === 2;
      let stuItemAnswer = childrenItem.get('stuAnswer') || '';
      if (isChoice) {
        if (stuItemAnswer.includes(value)) {
          stuItemAnswer = stuItemAnswer.replace(new RegExp(value, 'g'), '').replace(/^\||\|$/, '');
        } else {
          stuItemAnswer = stuItemAnswer.replace(/[^A-Z|]/, '').split('|');
          stuItemAnswer.push(value);
          stuItemAnswer = Array.from(new Set(stuItemAnswer)).join('|').replace(/^\||\|$/, '');
        }
      } else {
        stuItemAnswer = value;
      }
      const stuAnswer = children.toJS().map((it, i) => {
        const res = { id: it.id, stuAnswer: it.stuAnswer || '' };
        if (i === index) {
          res.stuAnswer = stuItemAnswer;
        }
        return res;
      });
      handleChange({ id: question.get('id'), stuAnswer });
    }
  }
  render() {
    const { index, question, options, interactive, showCorrection, group } = this.props; // eslint-disable-line
    const children = question.get('children') || fromJS([]);
    const childrenShow = options.find((item) => (item === 'children') || (item.key === 'children'));
    // const textArea = options.find((item) => item === 'answerArea' || item.key === 'answerArea');
    const newOptionList = reSortOption(options, group);
    return (<div className="complex-wrapper">
      <Title
        index={index}
        content={question.get('title')}
        interactive={interactive}
      />
      {childrenShow ? <Children
        indexType={childrenShow.indexType || 'number'}
        dataList={children}
        interactive={interactive}
        changeSelected={(i, value, childrenItem) => this.changeSelected(i, value, childrenItem)}
        showCorrection={showCorrection}
      ></Children> : ''}
      {newOptionList.map((item, i) => {
        let res = '';
        if (isString(item)) {
          if (['examPointNameList', 'knowledgeNameList'].includes(item)) {
            res = (<PointList
              key={i}
              label={stringLabelList[item]}
              contentList={question.get(item) || fromJS([])}
              split="、"
              type={item}
            />);
          } else if (item === 'answerList') {
            res = <AnswerList key={i} label={stringLabelList[item]} answerList={question.get(item)} />;
          } else if (item === 'analysis') {
            res = <Analysis key={i} label={stringLabelList[item]} analysis={question.get(item)} />;
          }
        } else if (isArray(item)) {
          res = (<Group
            key={i}
            question={question}
            options={item}
            templateType={1}
            group={group}
            groupIndexType={childrenShow.groupIndexType || 'number'}
          />);
        } else if (isObject(item)) {
          const type = item.key;
          if (item.inlineList) {
            res = <Labels key={i} question={question} inlineList={item.inlineList} split={item.split} />;
          } else if (['examPointNameList', 'knowledgeNameList'].includes(type)) {
            res = <PointList key={i} label={item.label || stringLabelList[type]} contentList={question.get(type)} split={item.split} />;
          } else if (type === 'answerList') {
            res = <AnswerList key={i} label={item.label || stringLabelList[type]} answerList={question.get(type)} />;
          } else if (type === 'analysis') {
            res = <Analysis key={i} label={item.label || stringLabelList[type]} analysis={question.get(type)} />;
          }
        } else {
          res = '';
        }
        return res;
      })}
    </div>);
  }
}

export default ComplexQuestion;
