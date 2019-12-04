import React from 'react';
import { Button } from 'antd';
import Option from '../../child/Option';
import MouleTitle from '../../child/MouleTitle';

const SubQuestion = ({
  value: options,
  rules = {},
  errorMessage,
  addNewOption,
  deleteOption,
  style = {},
  active,
  index: currentIndex,
  onClick,
}) => {
  const deleteDisabled = options.length <= (rules.min || 1);
  const addDisabled = rules.max && options.length >= rules.max;
  return (
    <div style={{ ...style }}>
      <div style={{ display: 'flex' }}>
        <MouleTitle
          style={{ flex: 1 }}
          required={rules.required}
          errorMessage={errorMessage}
        >
          问题
        </MouleTitle>
        <Button
          onClick={() => addNewOption('SubQuestion')}
          size="small"
          type="primary"
          disabled={addDisabled}
        >
          新增问题
        </Button>
      </div>

      {options.map((el, index) => (
        <Option
          active={active && index === currentIndex}
          onClick={e => {
            onClick(index, e);
          }}
          onDelete={() => {
            deleteOption(index, 'SubQuestion');
          }}
          index={1 + index}
          key={index}
          content={el}
          disabled={deleteDisabled}
        />
      ))}
    </div>
  );
};
export default SubQuestion;
