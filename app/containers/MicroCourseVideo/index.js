import React from 'react';
import { TablePage } from 'zm-tr-ace';
import { makeFilterConfig } from '../MicroLessons/makeFilterConfig';
import ExtendSearchItems from '../MicroLessons/components/ExtendSearchItems';
import { getMicroVideoList, addVideo, editVideo, delVideo, getPlayUrl } from './server';
import { Button, message, Popconfirm, Modal, Checkbox } from 'antd';
import moment from 'moment';
import VideoDetail from './components/VideoDetail';
const BtnStyle = { marginRight: '10px' };
class MicroVideos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      SearchConfigData: [
        {
          label: '学段',
          options: [],
          value: void 0,
          type: 'select',
          width: 150,
          key: 'phaseId',
          labelWidth: 50,
        },
        {
          label: '学科',
          options: [],
          value: void 0,
          type: 'select',
          width: 150,
          key: 'subjectId',
          labelWidth: 50,
        },
        {
          label: '视频名称',
          value: '',
          type: 'input',
          width: 200,
          key: 'name',
          labelWidth: 80,
        },
        {
          label: '视频ID',
          value: '',
          type: 'input',
          width: 200,
          key: 'id',
          labelWidth: 80,
        }
      ],
      grades: [],
      editions: [],
      tableConfig: {
        columns: [
          {
            title: 'ID',
            dataIndex: 'id',
            render: val => val || '-',
            width: 80
          },
          {
            title: '视频名称',
            dataIndex: 'name',
            render: val => val || '-',
            width: 150
          },
          {
            title: '视频大小',
            dataIndex: 'fileSize',
            render: val => this.formatFileSize(val) || '-',
            width: 150
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
            width: 150
          },
          {
            title: '操作',
            dataIndex: 'action',
            render: (val, item, index) => {
              if (props.isSelector) {
                return <Checkbox onChange={(e) => { this.handleSelectVideo(e, item, index) }} checked={item.isSelected}></Checkbox>;
              } else {
                return <div>
                  <Button type="primary" size="small" style={BtnStyle} onClick={() => {
                    this.handleEdit(item);
                  }}>编辑</Button>
                  <Button type="primary" size="small" style={BtnStyle} onClick={() => {
                    this.handlePlay(item);
                  }}>播放</Button>
                  <Popconfirm title="确定删除吗？" onConfirm={() => {
                    this.handleDel(item);
                  }} okText="确定" cancelText="取消">
                    <Button type="error" size="small">删除</Button>
                  </Popconfirm>
                </div>;
              }

            },
            width: 200
          }
        ],
        dataSource: [],
        loading: false,
        pagination: {  pageSize: 10 }
      },
      gradeIds: [],
      editionIds: [],
      total: 0,
      showDetail: false,
      status: 'add',
      currentVideo: null,
      showPlay: false,
      currentPlayUrl: ''
    };
    this.searchParams = {};
  }
  componentDidMount() {
    this.setSearchConfig(2, 2).then(() => {
      let pageSize = this.state.tableConfig.pagination.pageSize;
      this.onSearch({ phaseId: 2, subjectId: 2, pageSize });
    });
  }
  setSearchConfig= async (phaseId, subjectId) => {
    let { SearchConfigData, grades, editions } = this.state;
    let config = await makeFilterConfig({ config: SearchConfigData, grades, editions }, phaseId, subjectId);
    this.setState({ SearchConfigData: config.config, grades: config.grades, editions: config.editions });
  }
  onChange=(config, key, value) => {
    this.setState({ SearchConfigData: config });
    if (key === 'phaseId') {
      this.setSearchConfig(value, void 0);
      this.setState({ gradeIds: [], editionIds: [] });
    }
    if (key === 'subjectId') {
      let phaseId = config.find(item => item.key === 'phaseId').value;
      this.setSearchConfig(phaseId, value);
      this.setState({ editionIds: [] });
    }

  }
  onReset=(config) => {
    this.setState({ SearchConfigData: config, gradeIds: [], editionIds: []  });
  }
  extendChange=(key, value) => {
    this.setState({ [key]: value });
  }
  onSearch=(params) => {
    params.pageIndex = params.pageNum || 1;
    let pageSize = params.size || this.state.tableConfig.pagination.pageSize;
    let targetParams = Object.assign({}, params, {
      editionIdList: this.state.editionIds,
      gradeIdList: this.state.gradeIds,
      pageSize
    });
    delete targetParams.pageNum;
    delete targetParams.size;
    for (let key in targetParams) {
      if ((Array.isArray(targetParams[key]) && targetParams[key].length === 0) || targetParams[key] === '') {
        delete targetParams[key];
      }
    }
    this.searchParams = targetParams;
    this.getList(targetParams);
  }
  getList = (params) => {
    this.handleLoading(true);
    getMicroVideoList(params).then(res => {
      console.log(res);
      let tableConfig = this.state.tableConfig;
      tableConfig.dataSource = res.list;
      tableConfig.loading = false;
      tableConfig.pagination.total = res.total;
      tableConfig.pagination.current = res.pageNum;
      tableConfig.pagination.pageSize = params.pageSize;
      this.setState({ tableConfig, total: res.total });
    });
  }
  handleAdd= () => {
    this.setState({ showDetail: true, status: 'add', currentVideo: null });
  }
  handleClose=() => {
    this.setState({ showDetail: false });
  }
  handleSubmit=(params) => {
    if (this.state.status === 'add') {
      addVideo(params).then(code => {
        if (code === '0') {
          message.success('新增成功');
          this.getList(this.searchParams);
          this.setState({ showDetail: false });
        }
      });
    } else if (this.state.status === 'edit') {
      editVideo(Object.assign({}, params, { id: this.state.currentVideo.id })).then(code => {
        if (code === '0') {
          message.success('编辑成功');
          this.getList(this.searchParams);
          this.setState({ showDetail: false, currentVideo: null });
        }
      });
    }

  }
  handleEdit=(item) => {
    console.log(item);
    this.setState({ currentVideo: item, showDetail: true, status: 'edit' });
  }
  handleDel=(item) => {
    delVideo({ id: item.id }).then(code => {
      if (code === '0') {
        message.success('删除成功');
        let pageIndex = this.searchParams.pageIndex;
        if (this.state.tableConfig.dataSource.length === 1 && pageIndex > 1) {
          this.searchParams.pageIndex = pageIndex - 1;
        }
        this.getList(this.searchParams);
      }
    });
  }
  handlePlay=(item) => {
    getPlayUrl({ id: item.id }).then(res => {
      this.setState({ showPlay: true, currentPlayUrl: res });
    });
  }
  handleLoading=(isShow) => {
    this.setState({ tableConfig: Object.assign(this.state.tableConfig, { loading: isShow }) });
  }
  handleSelectVideo=(e, item, index) => {
    let isSelected = e.target.checked;
    let list = this.state.tableConfig.dataSource;
    if (isSelected) {
      list = list.map((it, i) => {
        if (it.id === item.id) {
          it.isSelected = true;
        } else {
          it.isSelected = false;
        }
        return it;
      });
      this.props.onSelected(item);
    } else {
      list[index].isSelected = false;
      this.props.onSelected(null);
    }
    let tableConfig = this.state.tableConfig;
    tableConfig.dataSource = list;
    this.setState({ tableConfig });
  }
  formatFileSize=(size) => {
    let fileSize = size * 1024;
    if (fileSize < 1024) {
      return fileSize + 'B';
    } else if (fileSize < (1024 * 1024)) {
      let temp = fileSize / 1024;
      temp = temp.toFixed(2);
      return temp + 'KB';
    } else if (fileSize < (1024 * 1024 * 1024)) {
      let temp = fileSize / (1024 * 1024);
      temp = temp.toFixed(2);
      return temp + 'MB';
    } else {
      let temp = fileSize / (1024 * 1024 * 1024);
      temp = temp.toFixed(2);
      return temp + 'GB';
    }
  }
  render() {
    const { SearchConfigData, tableConfig, grades, editions, gradeIds, editionIds, total, showDetail, currentVideo, showPlay } = this.state;

    return (
      <div style={{ background: '#fff', padding: 20 }}>
        <TablePage
          SearchConfigData={SearchConfigData}
          tableConfig={tableConfig}
          onSearch={this.onSearch}
          extendSearchItems={<ExtendSearchItems grades={grades} editions={editions} onChange={this.extendChange} gradeIds={gradeIds} editionIds={editionIds} />}
          onChange={this.onChange}
          onReset={this.onReset}
          extraButtons={<Button type="primary" onClick={this.handleAdd}>新增视频</Button>}
        >
          <div>
            共{total}个视频
          </div>
        </TablePage>
        {
          showDetail ?
            <VideoDetail  data={currentVideo} status={this.state.status} onClose={this.handleClose} onSave={this.handleSubmit} type={'microCourseVideo'} />
           : null
        }
        {
          showPlay ?
            <Modal maskClosable={false} visible title="视频预览" footer={null} onCancel={() => { this.setState({ showPlay: false, currentPlayUrl: '' }) }}>
              <div style={{ textAlign: 'center' }}>
                <video src={this.state.currentPlayUrl} width="488" height="274" controls ></video>
              </div>
            </Modal> : null
        }
      </div>
    );
  }
}

export default MicroVideos;
