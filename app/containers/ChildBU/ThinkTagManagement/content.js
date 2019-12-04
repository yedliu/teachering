import React from 'react';
import { Table, Popconfirm, Button } from 'antd';

const Content = ({
  thinkTagList,
  pageIndex,
  pageSize,
  total,
  onPageChange,
  loading,
  goDelete,
  goUpdate
}) => {
  const columns = [
    {
      title: '思维标签ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '思维标签名称',
      width: 200,
      dataIndex: 'tagName',
      key: 'tagName'
    },
    {
      title: '所属学段',
      key: 'phaseName',
      dataIndex: 'phaseName',
    },
    {
      title: '所属学科',
      key: 'subjectName',
      dataIndex: 'subjectName',
    },
    {
      title: '思维标签说明',
      width: 300,
      dataIndex: 'tagDesc',
      key: 'tagDesc',
    },
    {
      title: '操作',
      key: 'action',
      render: record => (
        <span>
          <Button
            onClick={() => {
              const {
                id,
                subjectDictCode,
                phaseDictCode,
                badAdvise,
                middleAdvise,
                goodAdvise,
                tagName,
                tagDesc
              } = record;
              goUpdate({  id, subjectDictCode,  phaseDictCode,  badAdvise, middleAdvise, goodAdvise, tagName, tagDesc });
            }}
            size="small"
            type="primary"
            style={{ marginRight: 5 }}
          >
            修改
          </Button>
          <Popconfirm
            title="确认删除思维体系标签？"
            onConfirm={() => {
              goDelete(record.id);
            }}
          >
            <Button size="small" type="danger">
              删除
            </Button>
          </Popconfirm>
        </span>
      )
    }
  ];
  return (
    <Table
      rowKey="id"
      loading={loading}
      dataSource={thinkTagList.toJS()}
      columns={columns}
      pagination={{
        current: pageIndex,
        pageSize,
        total,
        onChange: onPageChange
      }}
    />
  );
};

export default Content;
