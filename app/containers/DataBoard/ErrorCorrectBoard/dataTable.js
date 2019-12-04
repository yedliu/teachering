import React from 'react';
import { Table } from 'antd';
const { Column, ColumnGroup } = Table;

const DataTable = (props) => {
  const { dataList, loading, tableScrollY } = props;
  return (
    <Table
      dataSource={dataList}
      rowKey={record => record.id || record.phaseSubjectId}
      bordered
      pagination={false}
      loading={loading}
      scroll={{ y: tableScrollY }}
    >
      <Column
        title="学段学科"
        dataIndex="phaseSubjectName"
        key="phaseSubjectName"
        width="10%"
      />
      <Column
        title="纠错题目数"
        dataIndex="allQuestionNum"
        key="allQuestionNum"
        width="10%"
      />
      <ColumnGroup title="错误类型">
        <Column
          title="纠错信息数"
          dataIndex="allCorrectionNum"
          key="allCorrectionNum"
          width="8%"
        />
        <Column
          title="题干错误"
          dataIndex="stemErrNum"
          key="stemErrNum"
          width="8%"
        />
        <Column
          title="答案错误"
          dataIndex="answerErrNum"
          key="answerErrNum"
          width="8%"
        />
        <Column
          title="解析错误"
          dataIndex="analysisErrNum"
          key="analysisErrNum"
          width="8%"
        />
        <Column
          title="知识体系不符合"
          dataIndex="knowledgeErrNum"
          key="knowledgeErrNum"
          width="12%"
        />
        <Column
          title="图片和格式问题"
          dataIndex="fmtErrNum"
          key="fmtErrNum"
          width="12%"
        />
        <Column
          title="其他"
          dataIndex="otherErrNum"
          key="otherErrNum"
          width="8%"
        />
      </ColumnGroup>
      <ColumnGroup title="处理情况">
        <Column
          title="已采纳"
          dataIndex="adoptNum"
          key="adoptNum"
          width="5%"
        />
        <Column
          title="未采纳"
          dataIndex="unadoptNum"
          key="unadoptNum"
          width="5%"
        />
        <Column
          title="未处理"
          dataIndex="undealNum"
          key="undealNum"
          width="5%"
        />
      </ColumnGroup>
    </Table>
  );
};

export default DataTable;