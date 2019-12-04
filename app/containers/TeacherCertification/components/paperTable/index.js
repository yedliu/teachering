import React from 'react';
import { Table, Button, Popconfirm } from 'antd';
import styled from 'styled-components';
import Moment from 'moment';
import LocalStorage from 'utils/localStorage';
const TableBtn = styled(Button)`
margin-left: 5px;
`;
class PaperTable extends React.Component {
  componentDidMount() {
    this.permissions = LocalStorage.getPermissions();
  }

  /**
   * 编辑按钮点击事件
   * @param id
   */
  edit=(id) => {
    if (id) {
      const { onEdit } = this.props;
      onEdit(id);
    }
  }
  /**
   * 生成试卷类型名称
   * @param dict
   * @param record
   * @returns {string}
   */
  makeTypeName =(dict, record) => {
    let name = '';
    if (dict && dict.length > 0) {
      let typeList = dict.find(item => item.key === 'typeCode').data;
      if (typeList && typeList.length > 0) {
        name = typeList.find(item => item.itemCode === record.typeCode).itemName;
      }
    }
    return name;
  }
  /**
   * 上下架按钮点击
   * @param item
   */
  handleOnOff=(item) => {
    const { onHandleOnOff } = this.props;
    onHandleOnOff(item);
  }
  /**
   * 删除确认
   * @param id
   */
  confirmDelete = (id) => {
    const { onDelete } = this.props;
    onDelete(id);
  }
  /**
   * 点击预览
   * @param id
   */
  preview = (id) => {
    const { onPreview } = this.props;
    if (id) {
      onPreview(id);
    }
  }
  render() {
    const { data = [], pagination = {}, dict = [], onPage } = this.props;
    const columns = [
      {
        title: '试卷名称',
        dataIndex: 'name',
        key: 'name',
        width: 200
      }, {
        title: '试卷类型',
        dataIndex: 'typeCode',
        key: 'typeCode',
        render: (text, record) => {
          return <span>
            {
              this.makeTypeName(dict, record)
            }
          </span>;
        }
      }, {
        title: '上架状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          return <span>
            {record.onlineFlag === 1 ? '编辑中' : '上架'}
          </span>;
        }
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
        dataIndex: 'time',
        key: 'time',
        render: (text, record) => {
          return <span>
            {Moment(record.updatedTime).format('YYYY-MM-DD HH:mm:ss')}
          </span>;
        }
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <TableBtn type="primary" size="small" onClick={() => { this.preview(record.id) }}>预览</TableBtn>
            <TableBtn type="primary" size="small" onClick={() => { this.edit(record.id) }}>编辑</TableBtn>
            <TableBtn type="primary" size="small" onClick={() => { this.handleOnOff(record) }}>
              {
                record.onlineFlag === 1 ? '上架' : '下架'
              }
            </TableBtn>
            {
              this.permissions.includes('teacher-certification-delete-exam_paper') && <Popconfirm title="是否确定删除" onConfirm={() => { this.confirmDelete(record.id) }} okText="是" cancelText="否">
                <TableBtn size="small">删除</TableBtn>
              </Popconfirm>
            }
          </span>
        ),
      }
    ];
    return (
      <Table columns={columns} dataSource={data} pagination={pagination} rowKey="id" onChange={onPage}  />
    );
  }
}

export default PaperTable;
