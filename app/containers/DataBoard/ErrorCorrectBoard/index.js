import React from 'react';
import {
  // Pagination,
  Button,
  Select,
} from 'antd';
import DataProcess from './dataProcess';
import DataTable from './dataTable';
import DatePickerBox from './datePickerBox';

const { Option } = Select;

import {
  Wrapper,
  SelectBox,
  TableBox,
  // PaginationBox,
} from './style';

class ErrorCorrectBoard extends DataProcess {
  componentDidMount() {
    this.getDataAction();
    this.initTableScrollHeight();
    window.addEventListener('resize', this.addEventListerForResize);
  }

  componentWillUnMount() {
    window.removeEventListener('resize', this.addEventListerForResize);
    clearTimeout(this.resizeTimer);
  }

  addEventListerForResize = () => {
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
    this.resizeTimer = setTimeout(() => {
      this.initTableScrollHeight();
      this.resizeTimer = null;
    }, 100);
  }

  changePage = (page, total) => {
    const { pageIndex } = this.state;
    if (page !== pageIndex) {
      this.changeStateItem({ pageIndex: page }, this.getDataAction);
    }
  }

  changeDate = (value, dateString) => {
    // 如果有时间特殊规则，判断时间，合法则发请求 this.getDataAction();
    this.changeStateItem({
      startTime: value[0],
      endTime: value[1]
    }, this.getDataAction);
  }

  changeErrorType = (value) => {
    this.changeStateItem({ errorType: value }, this.getDataAction);
  }

  render() {
    const {
      // pageIndex, total,
      errorType, dataList, loading,
      tableScrollY, startTime, endTime,
      canDownload,
    } = this.state;
    const {
      // pageSize,
      errorTypeList,
    } = this.staticData;
    return (<Wrapper>
      <SelectBox>
        <label>纠错分类：</label>
        <Select style={{ width: 120, marginRight: 20 }} value={errorType} onChange={this.changeErrorType}>
          {errorTypeList.map((item) => (<Option key={item.id} value={item.id}>{item.name}</Option>))}
        </Select>
        <DatePickerBox
          startTime={startTime}
          endTime={endTime}
          changeDate={this.changeDate}
        />
        <div style={{ flex: 1 }}></div>
        <Button style={{ marginRight: 15 }} onClick={this.getDataAction} disabled={loading} type="primary">查询</Button>
        <Button style={{ marginRight: 15 }} onClick={this.getExcel} disabled={!canDownload} type="primary">导出Excel</Button>
      </SelectBox>
      <TableBox innerRef={x => { this.tableBox = x }}>
        <DataTable
          dataList={dataList}
          loading={loading}
          tableScrollY={tableScrollY}
        />
      </TableBox>
      {/* <PaginationBox>
        <Pagination onChange={this.changePage} total={total} current={pageIndex} pageSize={pageSize} />
      </PaginationBox> */}
    </Wrapper>);
  }
}

export default ErrorCorrectBoard;