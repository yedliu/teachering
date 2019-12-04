import React from 'react';
import { fromJS } from 'immutable';
import { Table, Button } from 'antd';
import { timestampToDate } from 'components/CommonFn';
import {
  PaperListWrapper,
  SortDiv,
  SpceButtonDiv,
} from './paperListStyle';
import { sortTypes } from '../common';

const emptyMap = fromJS({});
const emptyList = fromJS([]);

const getItem = (name, key) => {
  return {
    title: name,
    dataIndex: key,
    render: val => val || '-',
    width: 150
  };
};

class PaperList extends React.Component {
  changeSort = (sort) => {
    this.selectChange('selectedSort', sort);
  }
  selectChange = (type, value) => {
    const { selectChange } = this.props;
    if (selectChange) {
      selectChange(type, value);
    }
  }
  toQuestionManagement = (item) => {
    this.selectChange('previewPaperItem', item);
  }
  tableChange = (pagination) => {
    const { current } = pagination;
    this.selectChange('pageIndex', current);
  }
  backExampPaperType = (paperType, typeId) => {
    const res = paperType.toJS().find((item) => item.id === typeId) || { name: '' };
    return res.name;
  };
  render() {
    const { paramsData = emptyMap, listData = emptyMap } = this.props;
    const examPaperTypeList = listData.get('examPaperTypeList') || emptyList;
    const selectedSort = (paramsData.get('selectedSort') || emptyMap).toJS();
    const pageIndex = paramsData.get('pageIndex') || 1;
    const pageSize = paramsData.get('pageSize') || 10;
    const totalPapers = paramsData.get('pages') || 0;
    const isLoading = paramsData.get('paperIsGetting') || false;
    const paperList = listData.get('paperList') || emptyList;
    const paperDataList = paperList.map((item, index) => {
      return {
        key: index,
        epName: item.get('name'),
        courseContentName: item.get('courseContentName'),
        teachingEditionName: item.getIn(['examPaperTextbook', 'teachingEditionName']) || '',
        type: this.backExampPaperType(examPaperTypeList, item.get('typeId')),
        number: item.get('questionAmount') || 0,
        useNum: item.get('quoteCount') || 0,
        creteBy: item.get('createUserName'),
        updateTime: timestampToDate(item.get('updatedTime')),
        operate: item,
        onlineFlag: item.get('onlineFlag'),
      };
    }).toJS();
    const columns = [
      getItem('试卷名称', 'epName'),
      getItem('课程内容', 'courseContentName'),
      getItem('教材版本', 'teachingEditionName'),
      getItem('试卷类型', 'type'),
      getItem('题目数量', 'number'),
      getItem('使用数量', 'useNum'),
      getItem('创建人', 'creteBy'),
      getItem('最后修改日期', 'updateTime'),
      {
        title: '操作',
        dataIndex: 'operate',
        render: (item) => {
          return (<SpceButtonDiv>
            <Button type="primary" onClick={() => this.toQuestionManagement(item)}>预览</Button>
          </SpceButtonDiv>);
        },
        width: '10%',
      }
    ];
    return (
      <PaperListWrapper>
        <SortDiv>
          <b>排序方式：</b>
          {sortTypes.map(it => (<dd
            className={selectedSort.name === it ? 'selected' : ''}
            key={it}
            onClick={() => {
              let sort = {
                name: it,
                sortUp: !selectedSort.sortUp,
              };
              if (it === '默认') {
                sort.sortUp = true;
              }
              this.changeSort(fromJS(sort));
            }}>
            {it + (selectedSort.name !== '默认' && selectedSort.name === it ? (selectedSort.sortUp ? '↓' : '↑') : '')}
          </dd>))}
        </SortDiv>
        <div className="table" style={{ backgroundColor: '#fff', padding: 10, overflowY: 'auto', height: 'calc(100% - 30px)' }}>
          <Table
            columns={columns}
            dataSource={paperDataList}
            loading={isLoading}
            pagination={{
              current: pageIndex,
              pageSize,
              total: totalPapers,
              showQuickJumper: true,
              showSizeChanger: true
            }}
            onChange={this.tableChange}
          />
        </div>
      </PaperListWrapper>
    );
  }
}

export default PaperList;