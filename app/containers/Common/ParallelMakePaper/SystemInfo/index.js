import React from 'react';
import { Modal, Button } from 'antd/lib/index';

function Title() {
  return <p style={{ textAlign: 'center' }}>系统提示</p>;
}
class SystemInfo extends React.Component {
  render() {
    let { onOk, onCancel, result } = this.props;
    return (
      <Modal
        visible={true}
        title={<Title />}
        footer={null}
        closable={false}
        style={{ top: '50%', transform: 'translate(0, -50%)' }}
      >
        <div style={{ marginBottom: 20, textAlign: 'center' }}>
          当前试卷中有{' '}
          <span style={{ color: 'red', fontSize: 16 }}>
            {result[1]}/{result[0]}
          </span>{' '}
          道题目无法选取关联题目，请问还要继续组卷吗？
        </div>
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={onOk}>
            继续组卷
          </Button>
          <Button style={{ marginLeft: 20 }} onClick={onCancel}>
            放弃组卷
          </Button>
        </div>
      </Modal>
    );
  }
}

export default SystemInfo;
