import React from 'react';
import { Wrapper, RightWrapper, Info, LoadingWrapper, CuSpin } from './style';
import SubjectGradeCourseSelector from '../../../Common/SubjectGradeCourseSelector';
import NoHeaderTable from './components/NoHeaderTable';
import VideoEditModal from './components/VideoEditModal';
import VideoSearch from './components/VideoSearch';
import { getCourseSystemVideos, pullOffShelves, pullOnShelves, deleteItem, updateItem, updateItemState } from './server';
import { Pagination, Modal, message  } from 'antd';
import Moment from 'moment';
import _ from 'lodash';
import { find } from './utils';
const videoStatus = [
  {
    id: 1,
    name: '未完成'
  },
  {
    id: 2,
    name: '已完成'
  },
  {
    id: 3,
    name: '已审核'
  },
  {
    id: 4,
    name: '已上架'
  }
];
class VideoCourseManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showEdit: false,
      selectedCourse: '',
      videoData: { list: [] },
      defaultParams: {
        pageSize: 10,
        pageIndex: 1,
      },
      currentItem: {},
      currentCourseList: [],
      loading: false
    };
  }
  /**
   * 选择课程体系，获取列表
   * @param selectedKeys
   * @param e
   * @param level
   * @param courseList
   */
  courseOnSelect=(selectedKeys, e, level, courseList) => {
    /* if (level !== 4) {
      message.warning('必须选择第四级,才能进行搜索');
      return;
    } */
    if (!selectedKeys[0]) {
      this.setState({
        videoData: {
          list: []
        },
        defaultParams: {
          ...this.state.defaultParams,
          csId: ''
        }
      });
      return;
    }
    this.setDefaultParams('csId', selectedKeys[0]);
    this.setDefaultParams('level', level);
    this.setDefaultParams('pageIndex', 1);
    this.setState({
      currentCourseList: courseList
    });
    let params = Object.assign({},  this.state.defaultParams, {
      level,
      csId: selectedKeys[0],
      pageIndex: 1
    });
    this.setState({ selectedCourse: selectedKeys[0] }, () => {
      this.getList(params);
    });
  }
  /**
   * 获取列表数据
   * @param params
   */
  getList = (params) => {
    this.handleLoading();
    params.state ? params.state = Number(params.state) : delete params.state;
    getCourseSystemVideos(params).then(res => {

      let list = res.list;
      list = list.map(item => {
        let duration = this.handleDuration(item.duration);
        let statusName = '--';
        let status = videoStatus.find(it => String(it.id) === String(item.state));
        status && (statusName = status.name);
        let baseAction = ['编辑', '删除'];
        let actionDict = {
          1: baseAction, // 未完成
          2: [...baseAction, '审核'], // 已完成
          3: ['删除', '已完成', '上架'], // 已审核
          4: ['删除', '审核'] }; // 已上架
        return {
          id: item.id,
          title: item.audioName,
          subTitles: [`${item.createUserName}/`, Moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')],
          columns: [`讲师：${item.lecturer}`, `时长：${duration}`, `状态：${statusName}`, `观看次数：${item.watchCount}`],
          actions: actionDict[item.state] || [],
          oldData: item,
        };
      });
      res.list  = list;
      this.setState({ videoData: res, loading: false });
    }).catch(() => { this.setState({ loading: false }) });
  }
  /**
   * 搜索按钮
   * @param status
   * @param name
   */
  search =(status, name) => {
    let state = status;
    this.setDefaultParams('state', state);
    this.setDefaultParams('audioName', name);
    this.setDefaultParams('pageIndex', 1);
    let params = Object.assign({}, this.state.defaultParams, {
      state: state,
      audioName: name,
      pageIndex: 1
    });
    if (!params.csId) {
      return;
    }
    this.getList(params);
  }
  /**
   * 设置搜索条件
   * @param key
   * @param value
   */
  setDefaultParams=(key, value) => {
    let obj = this.state.defaultParams;
    obj[key] = value;
    if (!value && value !== 0) {
      delete obj[key];
    }
    this.setState({ defaultParams: obj });
  }
  /**
   * 编辑按钮
   * @param item
   */
  edit=(item) => {
    if (!item.oldData.courseSystemId) {
      item.oldData.courseSystemId = this.state.selectedCourse;
    }
    let courseId = Number(item.oldData.courseSystemId);
    let arr = this.state.currentCourseList;
    let namesArr = find(arr, courseId) || [];
    let names = namesArr.map(item => item.name);
    item.oldData.courseNames = names;
    this.setState({
      showEdit: true,
      currentItem: item.oldData,
    });
  }
  /**
   * 上架按钮
   * @param item
   */
  up=(item) => {
    pullOnShelves({ id: item.id }).then(() => {
      this.getList(this.state.defaultParams);
    });
  }
  /**
   * 下架按钮
   * @param item
   */
  down=(item) => {
    pullOffShelves({ id: item.id }).then(() => {
      this.getList(this.state.defaultParams);
    });
  }
  /**
   * 删除按钮
   * @param item
   */
  delete=(item) => {
    Modal.confirm({
      title: 'Confirm',
      content: '是否确认删除该视频',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        deleteItem({ id: item.id }).then(() => {
          let params = this.state.defaultParams;
          if (this.state.videoData.list.length === 1 && params.pageIndex > 1) {
            params.pageIndex = params.pageIndex - 1;
          }
          this.getList(params);
        });
      }
    });
  }
  /**
   * 处理各种操作
   * @param label
   * @param item
   */
  onAction=(label, item) => {
    console.log(label);
    switch (label) {
      case '编辑':
        this.edit(item);
        break;
      case '删除':
        this.delete(item);
        break;
      case '审核':
        this.updateState(3, item.oldData);
        break;
      case '已完成':
        this.updateState(2, item.oldData);
        break;
      case '上架':
        this.updateState(4, item.oldData);
        break;
    }
  }
  updateState=(state, item) => {
    console.log(item);
    let params = {
      id: item.id,
      state,
      courseSystemId: item.courseSystemId
    };
    updateItemState(params).then(res => {
      if (res === '0') {
        message.success('操作成功');
        this.getList(this.state.defaultParams);
      }
    });
  }
  /**
   * 翻页
   * @param page
   * @param pageSize
   */
  handlePage=(page, pageSize) => {
    console.log(page);
    this.setDefaultParams('pageIndex', page);
    let params = Object.assign({}, this.state.defaultParams, { pageIndex: page });
    this.getList(params);
  }
  /**
   * 关闭编辑
   */
  closeEdit=() => {
    this.setState({ showEdit: false });
  }
  /**
   * 提交
   * @param values
   */
  submit=(values) => {
    let params = _.cloneDeep(values);
    params.state = values.state;
    params.courseSystemId = this.state.currentItem.courseSystemId;
    params.id = this.state.currentItem.id;
    this.handleLoading();
    updateItem(params).then(() => {
      this.getList(this.state.defaultParams);
      this.setState({
        showEdit: false,
        loading: false
      });
    }).catch(() => { this.setState({ loading: false }) });
  }
  /**
   * 编辑课程体系
   * @param names
   * @param selected
   */
  editCsId=(names, selected) => {
    let obj = this.state.currentItem;
    obj.courseSystemId = Number(selected);
    obj.courseNames = names;
    this.setState({
      currentItem: obj
    });
  }
  /**
   * 处理搜索条件变化
   * @param status
   * @param name
   */
  handleSearchChange=({ status, name }) => {
    let state = status === '1' ? 1 : status === '2' ? 0 : void 0;
    let params = Object.assign({}, this.state.defaultParams, {
      state: state,
      audioName: name,
    });
    console.log(params, 'params', state);
    this.setState({ defaultParams: params });
  }
  /**
   * 处理loading
   */
  handleLoading=() => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
    }, 3000);
  }
  handleDuration=(mss) => {
    // let days = parseInt(mss / (1000 * 60 * 60 * 24));
    let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60), 10);
    let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60), 10);
    let seconds = (mss % (1000 * 60)) / 1000;
    return `${this.handleFixZero(hours)}:${this.handleFixZero(minutes)}:${this.handleFixZero(seconds)}`;
  }
  handleFixZero=(num) => {
    return num < 10 ? '0' + num : num;
  }
  render() {
    const { showEdit, videoData, defaultParams, currentItem, currentCourseList, loading } = this.state;
    return (
      <Wrapper>
        <SubjectGradeCourseSelector courseOnSelect={this.courseOnSelect} />
        <RightWrapper>
          <VideoSearch onSearch={this.search} onChange={this.handleSearchChange} videoStatus={videoStatus} />
          <Info>
            共符合条件的视频 <strong>{videoData.total || 0}</strong> 个
          </Info>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <NoHeaderTable
              listData={videoData.list}
              onAction={this.onAction}
            />
          </div>
          <div style={{ width: '100%', textAlign: 'right' }}>
            <Pagination  total={videoData.total || 0}  pageSize={defaultParams.pageSize} onChange={this.handlePage} current={defaultParams.pageIndex} />
          </div>
        </RightWrapper>
        {showEdit ?
          <VideoEditModal
            data={currentItem}
            onCancel={this.closeEdit}
            onOk={this.submit}
            courseList={currentCourseList}
            editCsId={this.editCsId}
            videoStatus={videoStatus}
          /> :
          null}
        {loading ? <LoadingWrapper>
          <CuSpin size="large" />
        </LoadingWrapper> :  null}
      </Wrapper>
    );
  }
}

export default VideoCourseManagement;
