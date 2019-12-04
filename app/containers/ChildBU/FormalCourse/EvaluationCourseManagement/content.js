import React from 'react';
import { Table, Popconfirm, Button } from 'antd';
import Moment from 'moment';
import styled from 'styled-components';
const Flag = styled.div`
  width: 60px;
  height: 26px;
  background: red;
  position: relative;
  text-align: center;
  line-height: 26px;
  color: #fff;
  display: inline-block;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  margin-left: 12px;
  &:before {
    content:"";
    position: absolute;
    right: 100%;
    top: 0;
    width: 0;
    height: 0;
    border-top: 13px solid transparent;
    border-right: 10px solid red;
    border-bottom: 13px solid transparent;
 }
`;
const Content = ({
  editionList,
  loading,
  stateList,
  difficultyList,
  goDelete,
  goUpdate,
  onSetDefault
}) => {
  const columns = [
    {
      title: '名称',
      width: 300,
      key: 'name',
      render: record => {
        return (
          <div>
            <span>{record.name}</span>
            {
              record.isDefault === 0 && <Flag>默认</Flag>
            }
          </div>
        );
      }
    },
    {
      title: '难度',
      width: 100,
      key: 'childNodeName',
      render: record => {
        const difficulty = record.difficulty;
        const item = difficultyList.find(el => el.get('id') === difficulty);
        return item ? item.get('name') : '-';
      }
    },
    {
      title: '备注',
      width: 300,
      render: record => record.remarks || '-'
    },
    {
      title: '更新时间',
      width: 200,
      render: record => Moment(record.updatedTime).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '上下架状态',
      width: 100,
      key: 'state',
      render: record => {
        const state = record.state;
        const item = stateList.find(el => el.get('id') === state);
        return item ? item.get('name') : '-';
      }
    },
    {
      title: '操作',
      width: 300,
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
                state,
                remarks,
                difficulty
              } = record;
              goUpdate({ id, name, subjectId, gradeId, state, remarks, difficulty });
            }}
            size="small"
            type="primary"
            style={{ marginRight: 5 }}
          >
            修改
          </Button>
          <Button
            onClick={() => {
              const {
                id,
                coverUrl,
                courseHardPoint,
                courseKeyPoint,
                teachGoal,
              } = record;
              goUpdate({
                id,
                coverUrl,
                courseHardPoint,
                courseKeyPoint,
                teachGoal, },
                true);
            }}
            size="small"
            style={{ marginRight: 5 }}
          >
            设置
          </Button>
          <Button
            onClick={() => {
              onSetDefault(record);
            }}
            size="small"
            type={record.isDefault === 0 || record.state === 0 ? 'default' : 'primary'}
            disabled={record.isDefault === 0 || record.state === 0}
            style={{ marginRight: 5 }}
          >
            设为默认
          </Button>
          <Popconfirm
            title="若删除该课程，对应的课件也会删除"
            okText="确定删除"
            okType="danger"
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
