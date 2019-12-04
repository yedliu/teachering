import React from 'react';
import { Button, Modal, message, Spin } from 'antd';
import { browserHistory } from 'react-router';
import DraggbleTable from 'containers/MicroLessons/components/DraggbleTable';
import { getAllVideo, addVideo, updateVideo, delVideo, sortVideo } from '../server';
import VideoDetail from '../components/VideoDetail';
import VideoList from '../../MicroCourseVideo/index';
class MicroCourseContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contentName: '',
      contentId: '',
      allVideos: [],
      showDetail: false,
      status: 'edit',
      showVideos: false,
      selectedVideo: null,
      loading: false
    };
    this.selectedVideo = null;
  }
  componentDidMount() {
    let routerState = this.props.location.state;
    if (routerState) {
      this.setState({
        contentName: routerState.name,
        contentId: routerState.id
      }, () => {
        this.getList();
      });
    }
  }
  getList=() => {
    this.setState({ loading: true });
    getAllVideo({ pageIndex: 1, pageSize: 999, contentId: this.state.contentId }).then(res => {
      this.setState({ allVideos: res.list, loading: false });
    });
  }
  showAdd=() => {
    if (!this.state.contentId) {
      message.warning('请返回课程列表重新选择');
      return;
    }
    this.setState({ showDetail: true, status: 'add', currentVideo: {}, selectedVideo: null });
    this.selectedVideo = null;
  }
  closeDetail=() => {
    this.setState({ showDetail: false });
  }
  showVideoList=() => {
    this.setState({ showVideos: true });
  }
  handleSelectVideo=(item) => {
    this.selectedVideo = item;
  }
  handleConfirmVideo=() => {
    this.setState({ selectedVideo: this.selectedVideo, showVideos: false });
  }
  handleClearVideo=() => {
    this.setState({ selectedVideo: null });
    this.selectedVideo = null;
  }
  submitVideo=(params) => {
    params.contentId = this.state.contentId;
    if (this.state.status === 'add') {
      addVideo(params).then(code => {
        console.log(code);
        if (code === '0') {
          message.success('添加成功');
          this.setState({ showDetail: false });
          this.getList();
        }
      });
    } else if (this.state.status === 'edit') {
      params.id = this.state.currentVideo.id;
      updateVideo(params).then(code => {
        if (code === '0') {
          message.success('修改成功');
          this.setState({ showDetail: false, currentVideo: null });
          this.getList();
        }
      });
    }
  }
  showEdit=(item) => {
    this.setState({ showDetail: true, status: 'edit', currentVideo: item });
    this.selectedVideo = { id: item.videoId, name: item.videoName };
    this.setState({ selectedVideo: this.selectedVideo });
  }
  delItem=(item) => {
    delVideo({ id: item.id }).then(code => {
      if (code === '0') {
        message.success('删除成功');
        this.getList();
      }
    });
  }
  handleDragSort=(dragIndex, originTargetIndex, targetId) => {
    let list = this.state.allVideos;
    let dragEle = list[dragIndex];
    list.splice(dragIndex, 1);
    let targetIndex = list.findIndex(item => item.id === targetId);
    if (dragIndex < originTargetIndex) {
      list.splice(targetIndex + 1, 0, dragEle);
    } else {
      list.splice(targetIndex, 0, dragEle);
    }
    this.setState({ allVideos: list });
    let idList = list.map(item => item.id);
    this.setState({ loading: true });
    sortVideo({ idList }).then(code => {
      if (code === '0') {
        message.success('排序成功');
        this.setState({ loading: false });
      }
    });
  }
  closeSelectVideo=() => {
    this.setState({ showVideos: false });
  }
  render() {
    const { contentName, allVideos, showDetail, status, showVideos, selectedVideo, currentVideo, loading } = this.state;
    return (
      <Spin spinning={loading}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', background: '#fff', padding: 20, marginBottom: 20 }}>
            <Button icon="arrow-left" onClick={() => { browserHistory.push('/tr/micro-lessons') }}>返回课程列表</Button>
            <span style={{ fontSize: 20, fontWeight: 'bold' }}>
              {contentName || ''}
            </span>
            <Button type="primary" icon="plus" onClick={this.showAdd}>新增课程内容</Button>
          </div>
          <div style={{ background: '#fff', padding: 20 }}>
            <DraggbleTable
              data={allVideos}
              onEdit={this.showEdit}
              onDel={this.delItem}
              onDragSort={this.handleDragSort}
            />
          </div>
          {
            showDetail ?
              <VideoDetail
                status={status}
                onClose={this.closeDetail}
                onSelectVideo={this.showVideoList}
                selectedVideo={selectedVideo}
                onClearVideo={this.handleClearVideo}
                onSave={this.submitVideo}
                data={currentVideo}
              /> : null
          }
          {
            showVideos ?
              <Modal
                visible
                title="选择视频"
                maskClosable={false}
                footer={null}
                width={900}
                onCancel={this.closeSelectVideo}
              >
                <VideoList isSelector onSelected={this.handleSelectVideo}  />
                <div style={{ textAlign: 'right' }}>
                  <Button style={{ marginRight: 20 }} onClick={this.closeSelectVideo}>取消</Button>
                  <Button onClick={this.handleConfirmVideo} type="primary">确定</Button>
                </div>
              </Modal>
              : null
          }
        </div>
      </Spin>
    );
  }
}

export default MicroCourseContent;
