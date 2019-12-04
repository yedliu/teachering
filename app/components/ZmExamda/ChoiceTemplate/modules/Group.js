/**
 * 组合显示
 */
import React from 'react';
import { isString, isObject, renderToKatex } from '../common';
import { stringLabelList } from '../questionConfig';
import AnswerList from './AnswerList';
import PointList from './PointList';
import Analysis from './Analysis';
import { fromJS, isArray, reSortOption, changeIndex } from '../common';

const ChoiceShowWay = (props) => {
  const { type, label, content, index } = props;
  let res = '';
  if (type === 'answerList') {
    res = <AnswerList type={index} label={label} answerList={content || fromJS([])} />;
  } else if (type === 'analysis') {
    res = <Analysis type={index} label={label} analysis={content || ''} />;
  } else if (['examPointNameList', 'knowledgeNameList'].includes(type)) {
    res = <PointList type={type} label={label} contentList={content} />;
  } else {
    res = (<div type={index} className={`group-item group-item-${type}`}>
      <div className={`group-item-label group-item-${type}-label`}>{stringLabelList[type]}</div>
      <div className={`group-item-content group-item-${type}-content`} dangerouslySetInnerHTML={{ __html: renderToKatex(content) }}></div>
    </div>);
  }
  return res;
};

const GroupChildren = (props) => {
  const { question, options, group, groupIndexType } = props;
  const newOptions = reSortOption(options, group);
  const children = question.get('children') || fromJS([]);
  return (<div className="group-complex">
    {children.map((it, i) => {
      const groupIndex = !isString(groupIndexType) ? `(${i + 1})` : changeIndex(i + 1, groupIndexType);
      return (<div key={i} className="group-complex-item-wrapper">
        <div className="group-complex-item-index">{groupIndex}</div>
        {newOptions.map((itt, ii) => {
          let childrenItemRes = '';
          if (isArray(itt)) {
            childrenItemRes = itt.map((iitt, iii) => {
              const content = it.get(iitt);
              return (<ChoiceShowWay key={iii} label={stringLabelList[iitt]} type={iitt} content={content} index={iii} />);
            });
          } else if (isString(itt)) {
            const content = question.get(itt) || '';
            childrenItemRes = <ChoiceShowWay type={itt} label={stringLabelList[itt]} content={content} index={ii} />;
          } else if (isObject(itt)) {
            const content = question.get(itt.key) || '';
            childrenItemRes = <ChoiceShowWay type={itt.key} label={itt.label || stringLabelList[itt]} content={content} index={ii} />;
          }
          return (<div key={ii} className="group-complex-item">{childrenItemRes}</div>);
        })}
      </div>);
    })}
  </div>);
};

const GroupItem = (props) => {
  const { options, question, templateType, group, groupIndexType } = props; // eslint-disable-line
  return (<div className="group-wrapper">
    {templateType === 1 ? <GroupChildren question={question} group={group} groupIndexType={groupIndexType} options={options} /> : options.map((item, index) => {
      let res = '';
      if (isString(item)) {
        const content = question.get(item) || '';
        res = <ChoiceShowWay key={index} type={item} content={content} index={index} />;
      } else if (isObject(item)) {
        const content = question.get(item.key) || '';
        res = <ChoiceShowWay key={index} type={item.key} label={item.label} content={content} index={index} />;
      }
      return res;
    })}
  </div>);
};

export default GroupItem;
