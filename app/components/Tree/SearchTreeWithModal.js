import React from 'react';

import { Modal } from 'antd';
import SearchTree from './SearchTree';
import { knowledgeList, examPointList } from './mock';

class ModalWithSearch extends React.PureComponent {
  render() {
    const { modalProps, searchTreeProps, onOk, onCancel } = this.props;
    return (
      <Modal
        {...modalProps}
        footer={null}
      >
        <SearchTree
          {...searchTreeProps}
          onOk={onOk}
          onCancel={onCancel}
        />
      </Modal>
    );
  }
}

export default ModalWithSearch;