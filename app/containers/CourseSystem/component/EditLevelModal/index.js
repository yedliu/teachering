import React, { PropTypes, PureComponent } from 'react';
import EditLevelAttr from './LevelAttr';
import {
  Modal,
  Table,
} from 'antd';
import {
  getLevelList
} from 'api/tr-cloud/course-system-level-endpoint';

export default class EditLevelModal extends PureComponent {
  state = {
    showLevelAttr: false
  }

  componentDidMount() {
    const { queryParams } = this.props;
    this.getLevelList(queryParams);
  }

  columns = [
    {
      title: '等级',
      dataIndex: 'levelName',
      width: '5%',
      key: 'levelName'
    }, {
      title: '分值',
      dataIndex: 'score',
      width: '5%',
      key: 'score'
    }, {
      title: '描述(学生)',
      dataIndex: 'studentDesc',
      key: 'studentDesc'
    }, {
      title: '描述(老师)',
      dataIndex: 'teacherDesc',
      key: 'teacherDesc'
    }, {
      title: '评语',
      dataIndex: 'comment',
      key: 'comment',
      width: '25%',
    }, {
      title: '总评',
      dataIndex: 'conclusion',
      key: 'conclusion',
      width: '25%',
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: '5%',
      render: (txt, rd) => {
        // console.log('render', rd);
        return (
          <span>
            <a
              onClick={() => {
                this.setState({
                  showLevelAttr: true,
                  itemId: rd.id,
                  otherItemData: {
                    level: rd.level,
                    levelName: rd.levelName,
                  }});
              }}>修改</a>
          </span>
        ); }
    }
  ];
  getLevelList = (queryParams) => {
    getLevelList(queryParams).then((levelList) => {
      // console.log('queryParams:', queryParams);
      // console.log('levelList:', levelList);
      this.setState({ levelList, dataOk: true });
    });
  }
  // componentWillReceiveProps(nextProps) {
  //   const { showEditLevelModal: visible, queryParams } = nextProps;
  //   const { showLevelAttr } = this.state;
  //   if (visible || !showLevelAttr) {
  //     this.getLevelList(queryParams);
  //   }
  // }

  hideModal = () => {
    this.setState({ showLevelAttr: false });
  }
  handleModal=() => {
    this.hideModal();
    // 数据重置

  }
  handleEdit=(attrs) => {
    const { queryParams } = this.props;
    this.hideModal();
    console.log(attrs);
    this.getLevelList(queryParams);
  }
  render() {
    const { onCancel, queryParams, onOk } = this.props;

    const { showLevelAttr, levelList, itemId, otherItemData, dataOk } = this.state;
    // console.log('levelId:', itemId);

    return (
      <div>
        <Modal
          visible={true}
          title="编辑课程体系等级"
          onCancel={onCancel}
          onOk={onOk}
          width={1000}
        >
          <Table
            dataSource={levelList}
            columns={this.columns}
            rowKey={rd => rd.id}
            loading={!dataOk}
          />
        </Modal>
        {showLevelAttr ?
          <EditLevelAttr
            showLevelAttr={showLevelAttr}
            onCancel={this.handleModal}
            onOk={this.handleEdit}
            levelId={itemId}
            queryParams={{ ...queryParams, ...otherItemData }}
        ></EditLevelAttr> : ''}
      </div>
    );
  }
}

EditLevelModal.propTypes = {
  queryParams: PropTypes.object.isRequired, // 传入的年级ID及学科ID
  showEditLevelModal: PropTypes.bool.isRequired, // 控制模态框的显隐
  onCancel: PropTypes.func.isRequired, // 单击取消时的回调
  onOk: PropTypes.func.isRequired, // 单击确定时的回调
};
