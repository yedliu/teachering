/**
 *
 * Table
 *
 */

import React from 'react';
import styled from 'styled-components';
import { FlexRow, FlexRowCenter, FlexColumn, FlexCenter } from 'components/FlexBox';
import { PlaceHolderBox, WidthBox, textEllipsis } from 'components/CommonFn/style';
import immutable, { fromJS } from 'immutable';
import { Pagination } from 'antd';

const emptyImg = window._baseUrl.imgCdn + '2cfcc00d-8360-42c7-b371-4253fd4735cb.png';
const loadingImg = window._baseUrl.imgCdn + '02f36e7d-35d2-4a79-a407-847ed60a6923.gif';

const TableRoot = styled(FlexColumn)`
  flex: 1;
  min-width: 900px;
  font-family: Microsoft YaHei;
  font-size: 1.2em;
  * {
    box-sizing: content-box;
    // user-select: none;
  }
`;
const TableMargin = styled(FlexColumn)`
  flex: 1;
  border: 1px solid #ddd;
  padding: 10px 13px 10px;
`;
const TableBox = styled(FlexColumn)`
  flex: 1;
  position: relative;
  border: 1px solid #999;
`;
const TableScrollBox = styled(FlexColumn)`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;
const TableHeader = styled.div`
  height: 50px;
  border-bottom: 1px solid #999;
  background-color: #e1e1e1;
  position: relative;
`;
const TableBody = styled(FlexColumn)`
  flex: 1;
`;
const TableBodyBox = styled(FlexColumn) ``;
const TableTr = styled(FlexRowCenter) `
  min-height: 50px;
  overflow: hidden;
  border-bottom: 1px solid #999;
  border-right: 1px solid #999;
`;
const TableTh = styled(FlexCenter)`
  min-width: 142px;
  flex: ${(props) => (typeof props.flexweight === 'number' ? props.flexweight : '')};
  width: ${(props) => (typeof props.flexweight === 'string' ? props.flexweight : '')};
  min-height: 50px;
  border-right: 1px solid #999;
  font-weight: 600;
  &:last-child {
    border-right: none;
  }
`;
const TableTd = styled(FlexCenter)`
  min-width: 142px;
  flex: ${(props) => (typeof props.flexweight === 'number' ? props.flexweight : '')};
  width: ${(props) => (typeof props.flexweight === 'string' ? props.flexweight : '')};
  // min-height: 100%;
  min-height: 50px;
  border-right: 1px solid #999;
  &:first-child {
    justify-content: left;
    // text-indent: 2em;
  }
  &:last-child {
    border-right: none;
  }
  & > p {
    font-family: Microsoft YaHei;
    line-height: 21px;
    padding: 0 20px;
    max-height: 42px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
const TableListHeader = styled(FlexRow)`
  margin-top: 10px;
`;
const GetItem = styled(FlexCenter)`
  width: 120px;
  height: 45px;
  border-radius: 10px 10px 0 0;
  background-color: ${(props) => (props.selected === props.index ? '#333' : '#D7D7D7')};
  color: ${(props) => (props.selected === props.index ? '#fff' : '#333')};
  cursor: pointer;
`;
const ModeAndTime = styled(FlexRowCenter)`
  // padding: 0 20px;
`;
// const ModeAndTimeItem = styled.div`
//   padding: 0 10px;
// `;
const PaginationWrapper = styled(FlexCenter)`
  height: 40px;
  padding-top: 10px;
`;

const EmptyBox = styled(FlexCenter)`
  flex: 1;
`;
const EmptyImgBox = styled.div`
  width: 176px;
  height: 131px;
  background: url(${emptyImg}) no-repeat center center;
`;
const EmptyText = styled.p`
  font-size: 16px;
  text-align: center;
  color: #999;
`;
export const CanClickItem = styled.p`
  color: ${(props) => (props.canClick ? '#2385ee' : '')};
  text-decoration: ${(props) => (props.canClick ? 'underline' : 'none')};
  cursor: ${(props) => (props.canClick ? 'pointer' : 'normal')};
  &:active {
    color: ${(props) => (props.canClick ? '#56beff' : '')};
  }
  ${textEllipsis};
  user-select: ${(props) => (props.canClick ? 'none' : '')};
`;
const NotClickItem = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
`;
const OrderItem = styled.span`
  cursor: pointer;
  color: ${(props) => (props.index === props.selected ? '#444' : '#999')};
  font-weight: ${(props) => (props.index === props.selected ? '600' : '200')};
`;
const LoadIngWraooer = styled(FlexCenter)`
  flex: 1;
`;

/**
 * 默认数据
 */
const defaultData = {
  headerItem1: fromJS([
    { name: '待领取', num: 220 },
    { name: '已领取', num: 10 },
  ]),
  // rowList: fromJS([{ name: '试卷名称', scale: 4 }, { name: '题目数量', scale: 1 }, { name: '录入人', scale: 1.5 }, { name: '更新时间', scale: 1.5 }, { name: '状态', scale: 1.5 }, { name: '操作', scale: 2 }]),
};

/**
 * this.props.changeReceiveState 切换表格上面的选项时的回调 -- index：当前选项下标； item：当前选项的 name 与 num
 * this.props.changePageNum 换页时的回调 -- page：当前页； pageSize总页数
 */

class Table extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.clickGetItem = this.clickGetItem.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.orderItemsClick = this.orderItemsClick.bind(this);
    this.state = {
      getItemSelectedIndex: 0,
      currentPage: 1,
      orderItemIndex: 0,
    };
  }
  componentDidMount() {
    this.clickGetItem(this.props.paperState || 0);
  }
  clickGetItem(index, item, selected) {
    // console.log(index, 'components -- Table -- clickGetItem -- 70+');
    if (index === selected) return;
    const changeSelected = this.props.changeSelectedPaperStateIndex;
    if (changeSelected) {
      changeSelected(index + 1);
    } else {
      this.setState({ getItemSelectedIndex: index });
    }
    this.setState({ currentPage: this.props.pageIndex || 1 });
    if (this.props.changeReceiveState) {
      const clickItem = item || fromJS({});
      this.props.changeReceiveState(index, clickItem, this.state.currentPage); // clickItem: 选中项; index: 选中的第几项; this.state.currentPage: 当前在第几页
    }
  }
  pageChange(page, pageSize) {
    // console.log(page, pageSize);
    this.setState({ currentPage: page });
    if (this.props.changePageNum) {
      this.props.changePageNum(page, pageSize);
    }
  }
  /**
   * 绑定 click 事件
   * @param {*} it ：当前项的属性名
   * @param {*} index : 当前项是第几行（即第几项数据）
   * @param {*} i : 挡墙项是第几列（在一行中第几个）
   */
  controlClick(tdContent, it, index, i, canClickIndex) {
    this.props.stateItem[canClickIndex].clickBack(tdContent, it, index, i);
  }
  orderItemsClick(itemIndex) {
    this.setState({ orderItemIndex: itemIndex });
    if (this.props.orderItemsClick) {
      // console.log(itemIndex, 'sort click, from Table component');
      this.props.orderItemsClick(itemIndex);
    }
  }
  render() {
    const rowList = fromJS(this.props.rowList.map(item => item.name) || []);
    const flexweight = this.props.rowList.map(item => item.scale || 1); // 表格中列元素占据的宽度的比例： array
    const headerItem =
      this.props.headerItem.count() > 0
        ? this.props.headerItem
        : defaultData.headerItem1;
    const source = this.props.source || '';
    const pageSize = this.props.pageSize || 20;
    const selected = this.props.selectedIndex
      ? this.props.selectedIndex - 1
      : this.state.getItemSelectedIndex;
    return (
      <TableRoot>
        <TableListHeader>
          {headerItem.map((item, index) => (
            <GetItem
              index={index}
              selected={selected}
              onClick={() => this.clickGetItem(index, item, selected)}
              key={index}
            >
              <span>{`${item.get('name')}（${item.get('num')}）`}</span>
            </GetItem>
          ))}
          <PlaceHolderBox />
          <ModeAndTime>
            <span>排序方式：</span>
            <OrderItem
              index={0}
              selected={this.state.orderItemIndex}
              onClick={() => this.orderItemsClick(0)}
            >
              默认
            </OrderItem>
            <WidthBox width={10} />
            <OrderItem
              index={1}
              selected={this.state.orderItemIndex}
              onClick={() => this.orderItemsClick(1)}
            >
              修改时间
            </OrderItem>
            <WidthBox width={20} />
          </ModeAndTime>
        </TableListHeader>
        <TableMargin className="abc">
          <TableBox>
            <TableScrollBox className="scroll">
              <TableHeader>
                <TableTr>
                  {rowList.count() > 0 ? (
                    rowList.map((item, index) => {
                      return (
                        <TableTh flexweight={flexweight[index]} key={index}>
                          <span>{item}</span>
                        </TableTh>
                      );
                    })
                  ) : (
                    <TableTd>这里什么都没有</TableTd>
                  )}
                </TableTr>
              </TableHeader>
              {this.props.idLoading ? (
                <LoadIngWraooer>
                  <div>
                    <img role="presentation" src={loadingImg} />
                  </div>
                </LoadIngWraooer>
              ) : (
                <TableBody>
                  {this.props.tablebodydata.count() > 0 ? (
                    <TableBodyBox>
                      {this.props.tablebodydata.map((item, index) => {
                        const hasState = this.props.stateItem.map(
                          it => it.name,
                        ); // 拥有不同状态的项是哪些 array
                        const itemshoudClickName = this.props.stateItem
                          .filter(it => it.clickBack)
                          .map(it => it.name); // 哪些具有点击事件
                        const itemText = this.props.stateItem.map(
                          it => it.state,
                        ); // 拥有状态的哪些状态 array => obj
                        // const changePaper = (this.props.stateItem.find((it) => it.changePaper) || {}).changePaper;
                        return (
                          <TableTr key={index}>
                            {fromJS(this.props.trItemList || []).map(
                              (it, i) => {
                                const hasStateItemIndex = hasState.indexOf(it);
                                const tdContent =
                                  (item || fromJS({})).get(it) || 0;
                                let canClick = false;
                                // console.log(itemshoudClickName, it, this.props.whoCanBeClick, item.get('control'));
                                switch (source) {
                                  case 'getandcutpaper':
                                  case 'papercutverify':
                                  case 'getandinputpaper':
                                  case 'paperinputverify':
                                  case 'paperSetTags':
                                  case 'paperTagsverify':
                                    // console.log(this.props.whoCanBeClick, 'this.props.whoCanBeClick -- 216');
                                    // console.log(itemshoudClickName, this.props.whoCanBeClick, 'click -- click');
                                    canClick =
                                      itemshoudClickName.indexOf(it) > -1 &&
                                      this.props.whoCanBeClick.indexOf(
                                        item.get('control'),
                                      ) > -1;
                                    break;
                                  default:
                                    canClick =
                                      itemshoudClickName.indexOf(it) > -1;
                                    break;
                                }
                                const canClickIndex = hasState.indexOf(it);
                                return (
                                  <TableTd flexweight={flexweight[i]} key={i}>
                                    {hasStateItemIndex > -1 ? (
                                      <CanClickItem
                                        canClick={canClick}
                                        onClick={() => {
                                          if (canClick) {
                                            // console.log(tdContent, it, index, i, canClickIndex);
                                            this.controlClick(
                                              tdContent,
                                              it,
                                              index,
                                              i,
                                              canClickIndex,
                                            );
                                          }
                                        }}
                                      >
                                        {
                                          itemText[hasStateItemIndex][
                                            String(tdContent)
                                          ]
                                        }
                                      </CanClickItem>
                                    ) : (
                                      <NotClickItem
                                        title={i === 0 ? tdContent : ''}
                                      >
                                        {tdContent}
                                      </NotClickItem>
                                    )}
                                    {/* {changePaper && canClick ? <CanClickItem canClick={canClick} onClick={changePaper}>换套试卷</CanClickItem> : ''} */}
                                  </TableTd>
                                );
                              },
                            )}
                          </TableTr>
                        );
                      })}
                    </TableBodyBox>
                  ) : (
                    <EmptyBox>
                      <div>
                        <EmptyImgBox />
                        <EmptyText>什么都没获取到哦~_~</EmptyText>
                      </div>
                    </EmptyBox>
                  )}
                </TableBody>
              )}
            </TableScrollBox>
          </TableBox>
          {this.props.paperCount > pageSize && !this.props.noPageTurning ? (
            <PaginationWrapper>
              <Pagination
                defaultCurrent={1}
                total={this.props.paperCount}
                current={this.state.currentPage}
                defaultPageSize={pageSize}
                onChange={this.pageChange}
              />
            </PaginationWrapper>
          ) : (
            ''
          )}
        </TableMargin>
      </TableRoot>
    );
  }
}

Table.propTypes = {
  source: React.PropTypes.string,
  stateItem: React.PropTypes.array, // table td click itmes：array
  trItemList: React.PropTypes.array, // table tr 中各项的属性名：array
  rowList: React.PropTypes.array, // table header data：List => string
  headerItem: React.PropTypes.instanceOf(immutable.List), // table top select list：List(Map) => obj
  tablebodydata: React.PropTypes.instanceOf(immutable.List), // table body data：List(Map) => obj
  changeReceiveState: React.PropTypes.func, // table top click event：func =>
  changePageNum: React.PropTypes.func, // table page change event：func =>
  paperCount: React.PropTypes.number, // table paper count: number
  pageSize: React.PropTypes.number, // table table page size: number
  whoCanBeClick: React.PropTypes.array, // table which state can be click: array
  paperState: React.PropTypes.number, // paper state: number
  orderItemsClick: React.PropTypes.func, // order items click event: func =>
  idLoading: React.PropTypes.bool, // show tabledate is loading: bool
  pageIndex: React.PropTypes.number,
  noPageTurning: React.PropTypes.bool,
  selectedIndex: React.PropTypes.number,
  changeSelectedPaperStateIndex: React.PropTypes.func,
};

export default Table;
