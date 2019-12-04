import React, { PropTypes } from 'react';
import { Radio, Button } from 'antd';
import {
    JudgAnswer,
} from 'components/Upload';
const RadioGroup = Radio.Group;
const  withAnswer = Component => props => {
  // console.log('withAnswer', props);
  const { getAnswer, index, ...rest } = props;
  return (
    <div>
      <Component {...rest} index={index} />
      <JudgAnswer getAnswer={getAnswer} index={index} />
    </div>
  );
};
const DelBtn = class extends React.Component {
  render() {
    const {
      // eslint-disable-next-line no-unused-vars
      index,
       ...rest
      } = this.props;
    return (
      <Button type="primary" {...rest}>删除</Button>
    );

  }
};
const withDelet = Component => class extends React.Component {
  render() {

    // console.log('withDelet', this.props);

    const { index, getIndex, ...rest } = this.props;

    return (
      <div>
        <Component {...rest} index={index} />
        <DelBtn ref={x => { this.DelBtn = x }} index={index} onClick={(e) => {
          getIndex(this.DelBtn.props.index, e);
        } }
        />
      </div>
    );
  }
};

const WithOption = Component => props => {
  const {
    radios = {},
    onChange = () => {},
    label = 'listen',
    value = 'text',
  } = props;
  const choseLabel = {
    listen: '选项：',
    judge: '子题格式',
  };
  return (
    <div>
      <choice-label style={{ margin: '0 10px' }}>{choseLabel[label]}</choice-label>
      <RadioGroup onChange={onChange} value={value} name="radiogroup">
        {Object.keys(radios).map((radio, i) => (
          <Radio key={JSON.stringify(radio)} value={radio}>{radios[radio]}</Radio>
        ))}
      </RadioGroup>
    </div>);
};
export {
    withAnswer,
    withDelet,
    WithOption,
};
