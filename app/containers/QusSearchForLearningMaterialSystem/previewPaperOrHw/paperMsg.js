import React from 'react';
import { Button, Checkbox } from 'antd';
import {
  PaperMsgWrapper,
  TiTle,
  buttonLeftPosition,
  buttonRightPosition,
  ShowAllAnalysis,
} from './paperMsgStyle';

class PaperMsg extends React.Component {
  goBack = () => {
    const { goBack } = this.props;
    if (goBack) goBack();
  }
  usePaper = () => {
    const { usePaper } = this.props;
    if (usePaper) usePaper();
  }
  changeQuestionState = (e) => {
    console.log(e.target.checked, 'checked');
    const { changeQuestionState } = this.props;
    if (changeQuestionState) {
      changeQuestionState('all', null, 'showAnalysis', e.target.checked);
    }
  }
  render() {
    const { title = '', count = 0, showAllAnalysis } = this.props;
    return (
      <PaperMsgWrapper>
        <Button onClick={this.goBack} style={buttonLeftPosition}>返回</Button>
        <TiTle>{title}（共 {count} 题）</TiTle>
        <ShowAllAnalysis>
          <Checkbox checked={showAllAnalysis} onChange={this.changeQuestionState} />
          <span style={{ padding: 0, verticalAlign: 'text-top' }}>显示全部解析</span>
        </ShowAllAnalysis>
        <Button onClick={this.usePaper} style={buttonRightPosition} type="primary">确认选择</Button>
      </PaperMsgWrapper>
    );
  }
}

export default PaperMsg;