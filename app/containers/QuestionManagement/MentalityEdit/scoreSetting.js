import React from 'react';
import { Modal, InputNumber } from 'antd';
import { fromJS } from 'immutable';
import { numberToLetter } from 'components/CommonFn';

export class BatchScoreModal extends React.PureComponent {
  constructor(props) {
    super(props);
    const { curBatchData } = this.props;
    let maxOptionCount = 0;
    curBatchData.get('entryExamPaperQuesInputDTOList').forEach(c => {
      if (c.get('optionList').count() > maxOptionCount) {
        maxOptionCount = c.get('optionList').count();
      }
    });
    const scoreList = new Array(maxOptionCount).fill('').map((e, index) => index);
    this.state = {
      scoreList: fromJS(scoreList),
    };
  }

  changeScoreBatch = (val, index) => {
    this.setState({
      scoreList: this.state.scoreList.set(index, val),
    });
  }

  render() {
    const { curBatchData, cancel, ok } = this.props;
    const { scoreList } = this.state;
    return (
      <Modal
        title="批量设置分数"
        visible
        closable={false}
        width={250}
        onCancel={cancel}
        onOk={() => ok(scoreList)}
      >
        <div>题型：{curBatchData.get('name')}</div>
        {scoreList.map((e, index) => (
          <div key={index} style={{ margin: '10px 30px' }}>
            选项{numberToLetter(index)}、
            <InputNumber step={1} precision={0} min={0} value={e} onChange={(val) => this.changeScoreBatch(val, index)} />
          </div>
        ))}
      </Modal>
    );
  }
}

