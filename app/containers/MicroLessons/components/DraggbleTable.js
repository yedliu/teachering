import React from 'react';
import styled from 'styled-components';
import { Button, Icon, Popconfirm } from 'antd';
const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
`;
const Th = styled.th`
border: 1px solid #ddd;
padding: 8px;
`;
class DraggbleTable extends React.Component {
  handleDrop=(e, item, targetIndex) => {
    let dragEleIndex = e.dataTransfer.getData('text');
    if (Number(dragEleIndex) === Number(targetIndex)) {
      return;
    }
    this.props.onDragSort(dragEleIndex, targetIndex, item.id);
  }
  handleDragStart=(e, item, index) => {
    e.dataTransfer.setData('text', index);
  }
  handleDragEnd=(e) => {
    e.dataTransfer.clearData('text');
  }
  render() {
    const { data, onEdit, onDel } = this.props;
    return (
      <div>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <Th>名称</Th>
              <Th>是否试听内容</Th>
              <Th>视频是否添加</Th>
              <Th>操作</Th>
            </tr>
            {
            data && data.length > 0 ? data.map((item, index) => {
              return (<tr
                key={index}
                draggable
                onDragEnter={(e) => { e.preventDefault() }}
                onDragOver={(e) => { e.preventDefault() }}
                onDrop={(e) => { this.handleDrop(e, item, index) }}
                onDragStart={(e) => { this.handleDragStart(e, item, index) }}
                onDragEnd={this.handleDragEnd}
              >
                <Td>{item.name}</Td>
                <Td>{item.audition ? '是' : '否'}</Td>
                <Td>{item.videoId > 0 ? '是' : '否'}</Td>
                <Td>
                  <Button type="primary" size="small" style={{ marginRight: 10 }} onClick={() => { onEdit(item) }}>编辑</Button>
                  <Popconfirm title="是否删除？" onConfirm={() => { onDel(item) }}>
                    <Button type="warning" size="small" style={{ marginRight: 10 }}>删除</Button>
                  </Popconfirm>
                  <Icon type="swap" style={{ cursor: 'move' }} />
                </Td>
              </tr>);
            }) : null
            }
          </tbody>
        </table>
        {
          !data || data.length === 0 ?
            <div style={{ textAlign: 'center', width: '100%', padding: 50 }}>暂无数据</div> : null
        }
      </div>
    );
  }
}

export default DraggbleTable;
