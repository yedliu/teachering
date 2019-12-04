import React from 'react';
import { fromJS } from 'immutable';
import { Pagination } from 'antd';
import { FlexCenter, FlexRowCenter } from 'components/FlexBox';
import { PlaceHolderBox, WidthBox } from 'components/CommonFn/style';
import { formatDate } from 'components/CommonFn';
import {
  RootWrapper,
  PaginationWrapper,
  HomeworkListWrapper,
  HomeworkListItem,
  HomeworkTitle,
  // Author,
  QuestionType,
  QuestionCount,
  ControllerWrapper,
  TextBox,
} from './homeworkListStyle';
import { hwAndPaperPageSize as pageSize } from '../../common';
const loadingImg = window._baseUrl.imgCdn + '02f36e7d-35d2-4a79-a407-847ed60a6923.gif';
const emptyImg = window._baseUrl.imgCdn + '2cfcc00d-8360-42c7-b371-4253fd4735cb.png';

const emptyList = fromJS([]);


class HomeworkList extends React.Component {
  pageChange = (pageIndex) => {
    const { paramsChange } = this.props;
    if (paramsChange) {
      paramsChange('pageIndex', pageIndex);
    }
  }
  previewHw = (hwItem) => {
    const { paramsChange } = this.props;
    if (paramsChange) {
      paramsChange('openPreviewHw', hwItem);
    }
  }
  makeChoosePreViewQuestion = () => {
    const { homeworkList = emptyList } = this.props;
    return (
      <HomeworkListWrapper>
        {homeworkList.map((item, index) => {
          // const hasOffShelf = item.get('state') === 1;
          return (<HomeworkListItem key={index}>
            <FlexRowCenter style={{ minHeight: 33 }}>
              <HomeworkTitle>{`${item.get('name')}${item.get('nameSuffix') || '0'}`}</HomeworkTitle>
              {/* <Author>{`${item.get('author')}/${formatDate('yyyy-MM-dd', new Date(item.get('dateTime')))}`}</Author> */}
            </FlexRowCenter>
            <FlexRowCenter style={{ minHeight: 33 }}>
              <QuestionType>{`作者：${item.get('author') || 0}`}</QuestionType>
              <QuestionType>{`更新时间：${formatDate('yyyy-MM-dd', new Date(item.get('dateTime')))}`}</QuestionType>
              <QuestionType>{`题目数量：${item.get('questionAmount') || 0}`}</QuestionType>
              <QuestionCount>{`使用次数：${item.get('useCount') || 0}`}</QuestionCount>
              <QuestionCount>{`答题次数：${item.get('questionAnswerCount') || 0}`}</QuestionCount>
              {/* <QuestionCount>{`状态：${hasOffShelf ? '已下架' : '已上架'}`}</QuestionCount> */}
              <PlaceHolderBox />
              <ControllerWrapper>
                <TextBox onClick={() => this.previewHw(item)}>查看详情</TextBox>
                <WidthBox></WidthBox>
              </ControllerWrapper>
            </FlexRowCenter>
          </HomeworkListItem>);
        })}
      </HomeworkListWrapper>
    );
  }

  render() {
    const { homeworkList = emptyList, homeworkIsGetting, total = 0, pageIndex = 1 } = this.props;
    return (
      <RootWrapper>
        {homeworkIsGetting ?
          (<FlexCenter style={{ height: '100%' }}><div><img role="presentation" src={loadingImg} /></div></FlexCenter>)
          :
          (homeworkList.count() > 0 ? this.makeChoosePreViewQuestion() : <FlexCenter style={{ height: '100%' }}>
            <div><img role="presentation" src={emptyImg} /><h2 style={{ color: '#999', textAlign: 'center' }}>这里空空如也！</h2></div>
          </FlexCenter>)}
        {total > pageSize ? <PaginationWrapper><Pagination defaultCurrent={1} total={total} current={pageIndex} defaultPageSize={pageSize} onChange={this.pageChange} /></PaginationWrapper> : ''}
      </RootWrapper>
    );
  }
}

export default HomeworkList;
