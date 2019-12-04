import React from 'react';
import { Radio, Button } from 'antd';
import ImgUpload from './img';
import AudioUpload from './audio';
import JudgAnswer from './judgAnswer';
import { numberToLetter } from './utils/convert';


const RadioGroup = Radio.Group;
const ImgItem = ({ answerOption, type, children }) => (
  <span>
    <ImgUpload answerOption={answerOption} />{children}
    {(answerOption || type === 'judge') ? <JudgAnswer /> : ''}
  </span>
);
const AudioItem = ({ answerOption,  type, children }) => (
  <span>
    <AudioUpload answerOption={answerOption} />{children}
    {(answerOption || type === 'judge') ? <JudgAnswer /> : ''}
  </span>
);

class ChoseTab extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
    };
  }
  onChange = e => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  };
  render() {
    const { value } = this.state;
    const {
      serialMark,
      optionList,
      editorText,
      answerOption,
      type,
    } = this.props;

    const renderChoseTab = () => ({
      1: editorText,
      2: <ImgItem answerOption={answerOption[2]} type={type}><DelBtn /></ImgItem>,
      3: <AudioItem answerOption={answerOption[3]} type={type}><DelBtn /></AudioItem>,
    });
    const DelBtn = () => (
      <Button type="primary">删除</Button>
    );
    const choseLabel = {
      listen: '选项：',
      judge: '子题格式',
    };
    return (
      <div>{choseLabel[type]}
        <RadioGroup onChange={this.onChange} value={this.state.value} name="radiogroup">
          <Radio value={1}>文本</Radio>
          <Radio value={2}>图片</Radio>
          <Radio value={3}>音频</Radio>
        </RadioGroup>
        <div style={{ margin: '10px' }}>
          {optionList.map((it, i) => {
            return (
              <div key={i}>
                <div>
                  <span
                    style={{ maxWidth: 30, width: 30, fontSize: '10.5pt', lineHeight: '2em', padding: '5px 0' }}
                  >{serialMark === 'A' ? `${numberToLetter(i)}、` : ` ${i + 1}、`}</span>
                  {renderChoseTab()[value]}
                </div>
              </div>);
          })}
        </div>
      </div>
    );
  }
}

export default ChoseTab;
