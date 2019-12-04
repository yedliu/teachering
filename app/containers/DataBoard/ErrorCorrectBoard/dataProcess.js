import { Component } from 'react';
import { message } from 'antd';
import moment from 'moment';
import reportApi from 'api/qb-cloud/report-end-point';

class DataProcess extends Component {
  state = {
    dataList: [],
    // pageIndex: 1,
    total: 0,
    loading: false,
    tableScrollY: 600,
    errorType: '2',
    startTime: moment().subtract(31, 'days'),
    endTime: moment().subtract(1, 'days'),
    canDownload: false,
  };

  staticData = {
    // pageSize: 20,
    errorTypeList: [{
      name: '课件纠错',
      id: '1',
    }, {
      name: '题目纠错',
      id: '2',
    }]
  };

  initTableScrollHeight = () => {
    if (this.tableBox) {
      this.setState({
        tableScrollY: this.tableBox.offsetHeight - document.querySelector('.ant-table-header').offsetHeight,
      });
    }
  }

  getData = () => {
    const { startTime, endTime, errorType } = this.state;
    reportApi.getCorrectionResport({
      startDate: `${startTime.format('YYYY-MM-DD')} 00:00:00`,
      endDate: `${endTime.format('YYYY-MM-DD')} 23:59:59`,
      countType: Number(errorType),
    }).then((res) => {
      this.setState({
        dataList: res.data,
        total: res.data.length,
        loading: false,
        canDownload: true,
      });
    }).catch((err) => {
      console.warn(err);
      this.setState({
        loading: false,
        canDownload: true,
      });
    });
  }

  getDataAction = () => {
    this.setState({
      loading: true,
      canDownload: false,
    }, this.getData);
  }

  changeStateItem = (newState, cb) => {
    this.setState(newState, cb);
  }

  getExcel = () => {
    const { startTime, endTime, errorType } = this.state;
    const { errorTypeList } = this.staticData;
    this.changeStateItem({ canDownload: false }, () => {
      reportApi.downCorrectionResportFile({
        startDate: `${startTime.format('YYYY-MM-DD')} 00:00:00`,
        endDate: `${endTime.format('YYYY-MM-DD')} 23:59:59`,
        countType: Number(errorType),
      }).then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const htmlAElement = document.createElement('a');
        htmlAElement.href = url;
        htmlAElement.download = `${errorTypeList.find((item) => item.id.toString() === errorType).name || '题目纠错'}数据明细${startTime.format('YYYY/MM/DD')}-${endTime.format('YYYY/MM/DD')}.xlsx`;
        htmlAElement.click();
      }).catch((err) => {
        console.log('fetch error: ', err);
        message.error('下载失败');
      }).finally(() => {
        this.changeStateItem({ canDownload: true });
      });
    });
  }

  render() {
    return null;
  }
}

export default DataProcess;