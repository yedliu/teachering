import React from 'react';
import { Table, Popconfirm, Button } from 'antd';

const Content = ({ editionList, loading, stateList, goDelete, goUpdate }) => {
  const columns = [
    {
      title: '名称',
      width: 400,
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '上下架状态',
      key: 'state',
      render: record => {
        const state = record.state;
        const item = stateList.find(el => el.get('id') === state);
        return item ? item.get('name') : '-';
      }
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
                name,
                gradeDictCode: gradeId,
                subjectDictCode: subjectId,
                state
              } = record;
              goUpdate({ id, name, subjectId, gradeId, state });
            }}
            size="small"
            type="primary"
            style={{ marginRight: 5 }}
          >
            修改
          </Button>
          <Popconfirm
            title="确定删除吗?"
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
      dataSource={editionList.toJS()}
      columns={columns}
      pagination={false}
    />
  );
};

export default Content;
