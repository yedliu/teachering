/**
 * 选择题
 */
import React from 'react';
import Labels from '../modules/Labels';
import Title from '../modules/Title';
import Group from '../modules/Group';
import AnswerList from '../modules/AnswerList';
import Analysis from '../modules/Analysis';
import RichEditor from '../modules/RichEditor';
import PointList from '../modules/PointList';
import {
  isString,
  isObject,
  isArray,
  reSortOption,
  fromJS,
} from '../common';
import { stringLabelList, chooseTemplates } from '../questionConfig';

class MultipleChoice extends React.PureComponent {
  constructor() {
    super();
    this.changeSelected = this.changeSelected.bind(this);
  }
  changeSelected(value) {
    const { question, interactive, handleChange } = this.props; // eslint-disable-line
    if (interactive && handleChange) {
      const isSingle = question.get('typeId') === 1;
      let stuAnswer = question.get('stuAnswer') || '';
      if (isSingle) {
        stuAnswer = value;
      } else if (stuAnswer.includes(value)) {
        stuAnswer = stuAnswer.replace(new RegExp(value, 'g'), '').replace(/^\||\|$/, '');
      } else {
        stuAnswer = stuAnswer.replace(/[^A-Z|]/, '').split('|');
        stuAnswer.push(value);
        stuAnswer = Array.from(new Set(stuAnswer)).join('|').replace(/^\||\|$/, '');
      }
      handleChange({ id: question.get('id'), stuAnswer });
    }
  }
  render() {
    const { index, question, options, interactive, showCorrection, group } = this.props; // eslint-disable-line
    const newOptionList = reSortOption(options, group);
    const answerList = question.get('answerList') || fromJS([]);
    const templateType = question.get('templateType');
    return (<div className="multiple-choice-wrapper active active-primary">
      {newOptionList.map((item, i) => {
        let res = '';
        if (isString(item)) {
          if (item === 'title') {
            res = (<Title
              key={i}
              index={index}
              content={question.get(item)}
              stuAnswer={question.get('stuAnswer') || ''}
              interactive={interactive}
              changeSelected={this.changeSelected}
              optionList={chooseTemplates.includes(templateType) ? question.get('optionList') : fromJS([])}
              answerList={answerList}
              showCorrection={showCorrection}
            />);
          } else if (item === 'answerList') {
            res = <AnswerList key={i} label={stringLabelList[item]} answerList={question.get(item)} />;
          } else if (item === 'analysis') {
            res = <Analysis key={i} label={stringLabelList[item]} analysis={question.get(item)} />;
          } else if (item === 'answerArea') {
            res = interactive ? <RichEditor></RichEditor> : '';
          } else if (['examPointNameList', 'knowledgeNameList'].includes(item)) {
            res = (<PointList
              key={i}
              label={stringLabelList[item]}
              contentList={question.get(item) || fromJS([])}
              split="、"
              type={item}
            />);
          }
        } else if (isArray(item)) {
          res = (<Group
            key={i}
            question={question}
            options={item}
            group={group}
          />);
        } else if (isObject(item)) {
          const type = item.key;
          if (type === 'title') {
            res = (<Title
              key={i}
              index={index}
              content={question.get('title')}
              stuAnswer={question.get('stuAnswer') || ''}
              interactive={interactive}
              changeSelected={this.changeSelected}
              optionList={chooseTemplates.includes(templateType) ? question.get('optionList') : fromJS([])}
              answerList={answerList}
              showCorrection={showCorrection}
            />);
          } else if (type === 'answerArea') {
            res = interactive ? <RichEditor></RichEditor> : '';
          } else if (item.inlineList) {
            res = <Labels key={i} question={question} inlineList={item.inlineList} split={item.split} />;
          } else if (type === 'answerList') {
            res = <AnswerList key={i} label={item.label || stringLabelList[type]} answerList={question.get(type)} />;
          } else if (type === 'analysis') {
            res = <Analysis key={i} label={item.label || stringLabelList[type]} analysis={question.get(type)} />;
          } else if (['examPointNameList', 'knowledgeNameList'].includes(type)) {
            res = (<PointList
              key={i}
              label={item.label || stringLabelList[type]}
              contentList={question.get(type)}
              split={item.split}
              type={type}
            />);
          } else {
            res = '';
          }
        }
        return res;
      })}
    </div>);
  }
}

export default MultipleChoice;
