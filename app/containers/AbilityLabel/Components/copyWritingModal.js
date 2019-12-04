import React from 'react';
import { Modal, Tabs } from 'antd';
import CopyWritingForm from '../../../components/CopyWritingForm';
const TabPane = Tabs.TabPane;
class CopyWritingModal extends React.Component {
  renderPane = () => {
    const { subjects, handleSubmit, handleCancel, loading } = this.props;
    console.log(subjects, 'subjects');
    let panes = subjects.map(item => {
      return <TabPane tab={item.subjectInfo.name} key={item.subjectInfo.id}>
        <Tabs size="small">
          {item.phaseInfoList.map(it => {
            return (
              <TabPane tab={it.phaseInfo.phaseName} key={it.phaseInfo.phaseId}>
                <CopyWritingForm
                  showIntro
                  initialForm={it.abilityDetail || {}}
                  handleSubmit={handleSubmit}
                  handleCancel={handleCancel}
                  type={'ability'}
                  loading={loading}
                  maxLength={300}
                />
              </TabPane>
            );
          })}
        </Tabs>
      </TabPane>;
    });
    return panes;
  }
  render() {
    const { handleCancel } = this.props;
    const children = this.renderPane();
    return (
      <Modal
        title="能力文案编辑"
        visible={true}
        maskClosable={false}
        footer={null}
        onCancel={handleCancel}
      >
        <Tabs  size="small">
          {children}
        </Tabs>
      </Modal>
    );
  }
}
export default CopyWritingModal;
