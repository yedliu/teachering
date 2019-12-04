import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Moment from 'moment';
import { Table, Button, Popconfirm, Icon } from 'antd';
import {
  changeOnlineFlag,
  deletePaper,
  getPaperDetail,
  setSearchParams,
  getPaperList,
} from '../redux/action';

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin: 10px;
  .count {
    font-size: 18px;
    color: red;
    margin: 0 5px;
  }
`;
const SortWrapper = styled.div`
  font-size: 12px;
  .sort-title {
    font-weight: 700;
  }
`;

const SortItem = styled.span`
  margin-right: 5px;
  color: ${props => (props.active ? '#108ee9' : '#999')};
`;

export const IconArrow = styled(Icon)`
  color: ${props => (props.selected ? '#108ee9' : '#999')};
  cursor: pointer;
`;

const Header = ({ total, changeSortType, sort = '1' }) => (
  <HeaderWrapper>
    <span>
      共有符合条件的试卷<em className="count">{total}</em>套
    </span>
    <SortWrapper>
      <span className="sort-title">排序方式：</span>
      <SortItem onClick={() => changeSortType('1')} active={`${sort}` === '1'}>
        默认
      </SortItem>
      <SortItem onClick={() => changeSortType('2')} active={`${sort}` === '2'}>
        修改时间
      </SortItem>
      <SortItem onClick={() => changeSortType('3')} active={`${sort}` === '3'}>
        使用次数
      </SortItem>
    </SortWrapper>
  </HeaderWrapper>
);

const HomeContent = ({
  data = [],
  changeOnlineFlag,
  deletePaper,
  previewPaper,
  editPaper,
  params,
  total,
  pageChange,
  loading,
  changeSortType,
}) => {
  const columns = [
    {
      title: '试卷名称',
      dataIndex: 'name',
      key: 'name',
      width: 400,
    },
    {
      title: '试卷类型',
      dataIndex: 'typeName',
      key: 'typeName',
    },
    {
      title: '关联课程',
      dataIndex: 'courseSystemName',
      key: 'courseSystemName',
    },
    {
      title: '题目数量',
      dataIndex: 'questionAmount',
      key: 'questionAmount',
    },
    {
      title: '状态',
      dataIndex: 'onlineFlagName',
      key: 'onlineFlagName',
    },
    {
      title: '使用数量',
      dataIndex: 'quoteCount',
      key: 'quoteCount',
    },
    {
      title: '创建人',
      dataIndex: 'createdUserName',
      key: 'createdUserName',
    },
    {
      title: '更新时间',
      key: 'updatedTime',
      render: (text, record) => {
        return (
          <span>
            {Moment(record.updatedTime).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: record => (
        <span>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              previewPaper(record.id);
            }}
            style={{ marginRight: 5 }}
          >
            预览
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              editPaper(record.id);
            }}
            style={{ marginRight: 5 }}
          >
            编辑
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              changeOnlineFlag(record.onlineFlag === 1, record.id);
            }}
            style={{ marginRight: 5 }}
          >
            {record.onlineFlag === 1 ? '上架' : '下架'}
          </Button>
          <Popconfirm
            title="确定删除此试卷？"
            onConfirm={() => {
              deletePaper(record.id);
            }}
          >
            <Button type="danger" size="small">
              删除
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        flexDirection: 'column',
      }}
    >
      <Header
        changeSortType={changeSortType}
        sort={params.get('sort')}
        total={total}
      />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            current: params.get('pageIndex'),
            total,
            pageSize: params.get('pageSize'),
            onChange: pageChange,
          }}
        />
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  const subState = state.get('childPaperManagement');
  const paperList = subState.get('paperListData');
  return {
    data: paperList.toJS(),
    params: subState.get('searchParams'),
    loading: subState.get('paperListLoading'),
    total: subState.get('paperListTotal'),
  };
};

const mapDispatchToProps = dispatch => ({
  changeOnlineFlag: (isOffline, id) => {
    dispatch(changeOnlineFlag(isOffline, id));
  },
  deletePaper: id => {
    dispatch(deletePaper(id));
  },
  editPaper: id => {
    dispatch(getPaperDetail(id, 'edit'));
  },
  previewPaper: id => {
    dispatch(getPaperDetail(id, 'preview'));
  },
  pageChange: page => {
    dispatch(setSearchParams('pageIndex', page));
    dispatch(getPaperList());
  },
  changeSortType: sort => {
    dispatch(setSearchParams('sort', sort));
    dispatch(getPaperList());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeContent);
