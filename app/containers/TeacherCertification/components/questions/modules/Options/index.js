import React from 'react';
import Option from '../../child/Option';
import { Radio, Button } from 'antd';
import MouleTitle from '../../child/MouleTitle';

const RadioGroup = Radio.Group;

const Options = ({
  value: options,
  optionStart = 'A',
  rules = {},
  addNewOption,
  deleteOption,
  optionType,
  onChange,
  errorMessage,
  style = {},
  active,
  index: currentIndex,
  onClick,
  onImageChange = () => {}
}) => {
  const deleteDisabled = options.length <= (rules.min || 2);
  const addDisabled = rules.max && options.length >= rules.max;

  return (
    <div style={{ ...style }}>
      <div style={{ display: 'flex' }}>
        <MouleTitle
          style={{ flex: 1 }}
          required={rules.required}
          errorMessage={errorMessage}
        >
          <span>选项：</span>
          <RadioGroup
            onChange={e => {
              onChange(e.target.value);
            }}
            value={optionType}
          >
            <Radio value="text">文本</Radio>
            <Radio value="image">图片</Radio>
          </RadioGroup>
        </MouleTitle>
        <Button
          onClick={() => addNewOption('Options')}
          size="small"
          type="primary"
          disabled={addDisabled}
        >
          新增选项
        </Button>
      </div>

      {options.map((el, index) => (
        <Option
          active={active && currentIndex === index}
          contentType="text"
          onClick={e => {
            onClick(index, e);
          }}
          onDelete={() => {
            deleteOption(index, 'Options');
          }}
          index={String.fromCharCode(optionStart.charCodeAt() + index)}
          key={index}
          content={el}
          disabled={deleteDisabled}
          type={optionType}
          onImageChange={(url) => { onImageChange(index, url) }}
        />
      ))}
    </div>
  );
};
export default Options;
