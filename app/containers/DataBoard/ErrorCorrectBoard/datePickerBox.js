import React from 'react';
import { DatePicker  } from 'antd';
import {
  DatePickerBoxWrapper,
} from './style';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

const DatePickerBox = (props) => {
  const { startTime, endTime, changeDate } = props;
  return (
    <DatePickerBoxWrapper>
      时间区间：
      <RangePicker
        defaultValue={[startTime, endTime]}
        format={dateFormat}
        onChange={changeDate}
        allowClear={false}
      />
    </DatePickerBoxWrapper>
  );
};

export default DatePickerBox;