import React from 'react';
import QuestionTitle from './QuestionTitle'; // 题干
import Analysis from './Analysis'; // 解析
import Answer from './Answer'; // 答案
import Materials from './Materials'; // 材料
import Options from './Options'; // 选项
import ReferenceAnswer from './ReferenceAnswer'; // 参考答案
import SubQuestion from './SubQuestion'; // 问题

const Modules = ({
  module,
  active,
  index,
  answerList,
  optionStart,
  onChange,
  optionType,
  onOptionTypeChange,
  onImageChange,
  ...props
}) => {
  if (module === 'QuestionTitle') {
    return <QuestionTitle active={active} {...props} />;
  }

  if (module === 'Analysis') return <Analysis active={active} {...props} />;

  if (module === 'Answer')
    { return <Answer answerList={answerList} onChange={onChange} {...props} /> }

  if (module === 'Materials') return <Materials active={active} {...props} />;

  if (module === 'Options') {
    return (
      <Options
        index={index}
        onChange={onOptionTypeChange}
        optionType={optionType}
        optionStart={optionStart}
        active={active}
        onImageChange={onImageChange}
        {...props}
      />
    );
  }

  if (module === 'ReferenceAnswer') {
    return <ReferenceAnswer active={active} {...props} />;
  }

  if (module === 'SubQuestion') {
    return (
      <SubQuestion
        index={index}
        active={active}
        optionStart={optionStart}
        {...props}
      />
    );
  }
};

export default Modules;
