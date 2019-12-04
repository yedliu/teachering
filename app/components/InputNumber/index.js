import React from 'react';
import { InputNumber } from 'antd';

const InputNumberWrap = ({
  value,
  min = 0.5,
  max = 100,
  step = 0.5,
  onChange,
  size,
  defaultValue,
  precision = 1,
  disabled
}) => (
  <InputNumber
    value={value}
    min={min}
    max={max}
    step={step}
    size={size}
    disabled={disabled}
    defaultValue={defaultValue}
    type="number"
    onBlur={e => {
      // 在用户输入完成之后 在对数据的精度进行处理
      // onChange 中处理会出现小数点无法输入的情况
      let score = Number(e.target.value) || 0;
      if (score % 1 !== 0) {
        score = score.toFixed(precision);
      }
      if (typeof onChange === 'function') {
        onChange(Number(score));
      }
    }}
    onChange={value => {
      let score = value || 0;
      if (typeof onChange === 'function') {
        onChange(score);
      }
    }}
  />
);

export default InputNumberWrap;
