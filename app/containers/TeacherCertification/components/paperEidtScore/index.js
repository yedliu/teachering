import React from 'react';
import { Modal, InputNumber } from 'antd';
class PaperEditScore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      targetScore: props.score || 0,
      message: ''
    };
  }
  render() {
    const { isBatch, onCancel, onOk, target, score, currentIndex } = this.props;
    const { targetScore } = this.state;
    return (
      <Modal visible={true} title={isBatch ? '批量修改分数' : '修改分数'} width={300} onCancel={onCancel} onOk={() => { onOk(target, isBatch, targetScore, currentIndex) }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-block' }}>
            <span style={{ color: 'red' }}>*</span>
            设置分数：<InputNumber
              min={0}
              max={100}
              step={0.5}
              defaultValue={score}
              precision={1}
              onChange={v => {
                let message = '';
                if (v <= 0) {
                  // message.warning('请输入大于0的数字');
                  message = '请输入大于0的数字';
                  // return;
                }
                if (v > 100) {
                  // message.warning('请输入小于100的数字');
                  message = '请输入小于等于100的数字';
                  // return;
                }
                this.setState({ targetScore: v, message });
              }}
            />
            <p style={{ color: 'red', fontSize: 12 }}>
              {
                this.state.message
              }
            </p>
          </div>
        </div>
      </Modal>
    );
  }
}

export default PaperEditScore;
