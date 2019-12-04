import React from 'react';
import { TablePage } from 'zm-tr-ace';
import { makeFilterConfig } from './makeFilterConfig';
import ExtendSearchItems from './components/ExtendSearchItems';
import { getMicroLessonList, delContent, addContent, editContent } from './server';
import { Button, message, Popconfirm, Spin } from 'antd';
import moment from 'moment';
import { browserHistory } from 'react-router';
import ContentDetail from '../MicroCourseVideo/components/VideoDetail';
const BtnStyle = { marginRight: '10px' };
class MicroLessons extends React.Component {
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
          label: '课程名称',
          value: '',
          type: 'input',
          width: 200,
          key: 'name',
          labelWidth: 80,
        },
        {
          label: '课程ID',
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
            title: '课程ID',
            dataIndex: 'id',
            render: val => val || '-',
            width: 150
          },
          {
            title: '课程名称',
            dataIndex: 'name',
            render: val => val || '-',
            width: 150
          },
          {
            title: '创建者',
            dataIndex: 'createUserName',
            render: val => val || '-',
            width: 150
          },
          {
            title: '更新时间',
            dataIndex: 'updateTime',
            render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
            width: 150
          },
          {
            title: '阶段',
            dataIndex: 'phase',
            render: val => val || '-',
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
            render: (val, item) => (
              <div>
                <Button type="primary" size="small" style={BtnStyle} onClick={() => { this.handleEdit(item) }}>编辑</Button>
                <Button type="primary" size="small" style={BtnStyle} onClick={() => { this.toContent(item) }}>课程内容</Button>
                <Popconfirm title="确定删除吗？" onConfirm={() => { this.handleDel(item) }} okText="确定" cancelText="取消">
                  <Button type="error" size="small">删除</Button>
                </Popconfirm>
              </div>
            ),
            width: 200
          }
        ],
        dataSource: [],
        loading: false,
        pagination: {  pageSize: 10, total: 0 },
      },
      gradeIds: [],
      editionIds: [],
      total: 0,
      showDetail: false,
      currentContent: null,
      status: '',
      loading: false
    };
    this.searchParams = {};
  }
  componentDidMount() {
    let params = sessionStorage.zm_tr_micro_content_search;
    if (params) {
      let params1 = JSON.parse(params);
      let SearchConfigData = this.state.SearchConfigData;
      let keys = Object.keys(params1);
      keys.forEach(item => {
        SearchConfigData.forEach(it => {
          if (it.key === item) {
            it.value = params1[item];
          }
        });
      });
      this.setState({ SearchConfigData, gradeIds: params1.gradeIdList || [], editionIds: params1.editionIdList || [] }, () => {
        this.setSearchConfig(params1.phaseId, params1.subjectId).then(() => {
          this.onSearch(params1);
          sessionStorage.removeItem('zm_tr_micro_content_search');
        });
      });
    } else {
      this.setSearchConfig(2, 2).then(() => {
        let pageSize = this.state.tableConfig.pagination.pageSize;
        this.onSearch({ phaseId: 2, subjectId: 2, pageSize });
      });
    }
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
      this.setState({  editionIds: [] });
    }
  }
  onReset=(config) => {
    this.setState({ SearchConfigData: config, gradeIds: [], editionIds: []  });
  }
  extendChange=(key, value) => {
    this.setState({ [key]: value });
  }
  onSearch=(params) => {
    params.pageIndex = params.pageNum || params.pageIndex || 1;
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
    this.setState({ loading: true });
    getMicroLessonList(params).then(res => {
      console.log(res);
      let tableConfig = this.state.tableConfig;
      tableConfig.dataSource = res.list;
      tableConfig.pagination.total = res.total;
      tableConfig.pagination.current = res.pageNum;
      tableConfig.pagination.pageSize = params.pageSize;
      this.setState({ tableConfig, total: res.total, loading: false });
    });
  }
  handleDel=(item) => {
    delContent({ id: item.id }).then(code => {
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
  handleClose=() => {
    this.setState({ showDetail: false, currentContent: null });
  }
  handleSubmit=(params) => {
    if (this.state.status === 'add') {
      addContent(params).then(code => {
        if (code === '0') {
          message.success('新增成功');
          this.getList(this.searchParams);
          this.setState({ showDetail: false });
        }
      });
    } else if (this.state.status === 'edit') {
      editContent(Object.assign({}, params, { id: this.state.currentContent.id })).then(code => {
        if (code === '0') {
          message.success('编辑成功');
          this.getList(this.searchParams);
          this.setState({ showDetail: false, currentContent: null });
        }
      });
    }

  }
  handleEdit=(item) => {
    this.setState({ currentContent: item, showDetail: true, status: 'edit' });
  }
  handleAdd= () => {
    this.setState({ showDetail: true, status: 'add', currentContent: null });
  }
  toContent=(item) => {
    browserHistory.push({ pathname: '/tr/micro-lessons/content', state: item });
    sessionStorage.zm_tr_micro_content_search = JSON.stringify(this.searchParams);
  }
  render() {
    const { SearchConfigData, tableConfig, grades, editions, gradeIds, editionIds, total, showDetail, currentContent, loading } = this.state;
    return (
      <Spin spinning={loading}>
        <div style={{ background: '#fff', padding: 20 }}>
          <TablePage
            SearchConfigData={SearchConfigData}
            tableConfig={tableConfig}
            onSearch={this.onSearch}
            extendSearchItems={<ExtendSearchItems grades={grades} editions={editions} onChange={this.extendChange} gradeIds={gradeIds} editionIds={editionIds} />}
            onChange={this.onChange}
            onReset={this.onReset}
            extraButtons={<Button type="primary" onClick={this.handleAdd}>新增课程</Button>}
          >
            <div>
              共{total}个课程内容
            </div>
          </TablePage>
          {
            showDetail ?
              <ContentDetail data={currentContent} status={this.state.status} onClose={this.handleClose} onSave={this.handleSubmit} type={'microCourseContent'} /> : null
          }
        </div>
      </Spin>
    );
  }
}

export default MicroLessons;
