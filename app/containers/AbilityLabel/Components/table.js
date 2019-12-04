import React from 'react';
import { Table } from 'antd';
class AbilityTable extends React.Component {
  makeColumns=() => {
    const { handleEdit, handleAttr } = this.props;
    let columns = [
      {
        title: '能力ID',
        dataIndex: 'id',
        width: 100,
        key: 'id',
      },
      {
        title: '能力名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '所属学科',
        dataIndex: 'subjectName',
        key: 'subjectName'
      },
      {
        title: '操作',
        key: 'action',
        width: 150,
        render: (text, record, index) => <div><a href="JavaScript:;" onClick={()=>handleEdit(record)}>编辑</a> <a href="JavaScript:;" onClick={()=>{handleAttr('edit',text, record, index)}}>属性</a></div>, // eslint-disable-line
      }
    ];
    return columns;
  }
  render() {
    const { listData, handlePage, loading, pagination } = this.props;
    const columns = this.makeColumns();
    return (
      <Table dataSource={listData} columns={columns} onChange={handlePage} loading={loading} pagination={pagination} rowKey="id" />
    );
  }
}
export default AbilityTable;
