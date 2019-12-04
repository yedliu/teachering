import React from 'react';
import { fromJS } from 'immutable';
import Header from './header';
import HomeworkList from './homeworkList';

import {
  RightWrapper,
} from './contentStyle';

const emptyList = fromJS([]);

class Content extends React.Component {
  render() {
    const {
      homework, homeworkIsGetting, pageIndex,
      paramsChange, pageCount,
    } = this.props;
    const { homeworkList = emptyList } = homework;
    // const homeworkCount = homeworkList.count();
    return (
      <RightWrapper>
        <Header
          total={pageCount}
          homeworkIsGetting={homeworkIsGetting}
          paramsChange={paramsChange}
        />
        <HomeworkList
          total={pageCount}
          pageIndex={pageIndex}
          paramsChange={paramsChange}
          homeworkList={homeworkList}
        />
      </RightWrapper>
    );
  }
}

export default Content;