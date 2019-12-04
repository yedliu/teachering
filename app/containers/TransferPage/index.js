import React from 'react';
import { browserHistory } from 'react-router';
import { Spin } from 'antd';
class TransferPage extends React.Component {
  componentWillMount() {
    let query = this.props.location.query.from;
    const pathDict = {
      parallel: {
        pathname: '/tr/questionmanagement',
        state: {
          groupPaper: true,
          isParallel: true,
        },
      },
      parallelFor1v1: {
        pathname: '/tr/questionfor1v1',
        state: {
          groupPaper: true,
          isParallel: true,
        },
      },
      parallelForLocal: {
        pathname: '/tr/questionforlocal',
        state: {
          groupPaper: true,
          isParallel: true,
        },
      },
      parttime: {
        pathname: '/parttime/questionmanagement',
        state: {
          groupPaper: true,
          isParallel: true,
        },
      },
    };
    if (query && pathDict[query]) {
      browserHistory.push(pathDict[query]);
    } else {
      browserHistory.push({ pathname: 'not-a-page' });
    }
  }
  render() {
    return (
      <Spin spinning={true}>
        <div style={{ width: '100%', height: '100%' }} />
      </Spin>
    );
  }
}

export default TransferPage;
