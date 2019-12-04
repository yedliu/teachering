/**
 *
 * ListView
 *
 */

import React, { PropTypes } from 'react';
import { Button, Input, InputNumber, Popconfirm } from 'antd';
import styled from 'styled-components';
import { FlexColumn, FlexRow, FlexRowCenter } from '../FlexBox/index';
import Immutable from 'immutable';

const ListHeader = styled(FlexRowCenter)`
  width: 100%;
  height: 10%;
  font-size: 16px;
  color: #333;
  background-color: #e0edfc;
`;

const ListBody = styled(FlexColumn)`
  width: 100%;
  height: 80%;
  overflow: auto;
`;

const ListFooter = styled(FlexRowCenter)`
  width: 100%;
  height: 10%;
`;

const ListItem = styled(FlexRowCenter)`
  font-size: 14px;
  color: #666;
  width: 100%;
  min-height: 60px;
  justify-content: space-between;
  line-height: 60px;
`;
const ListItemTxt = styled(FlexRow)`
  width: 100%;
  justify-content: space-between;
`;
const Tag = styled.span`
  margin-right: 5px;;
  font-size: 12px;
  background: #87d068;
  padding: 0 5px;
  color: #fff;
`;
const editinput = {
  paddingLeft: '10px',
  borderBottom: '1px solid #F0F0F0',
};
const editbtn = {
  height: '28px',
  lineHeight: '28px',
  color: '#3499FF',
  marginRight: 10,
  marginLeft: 10,
  marginBottom: 5,
};
const classCost = {
  paddingRight: 15,
};
const ListView = props => {
  let style = {
    border: '1px solid #dbdbdb',
    height: 644,
    width: props.moreWidth ? props.moreWidth : '300px',
    backgroundColor: 'white',
    marginTop: 25,
    marginLeft: 20,
    display: 'inline-block',
    verticalAlign: 'top',
  };
  if (props.style) {
    style = props.style;
  }
  return (
    <div style={style} className={props.className}>
      <ListHeader
        style={{
          justifyContent: 'center',
          fontSize: 16,
          width: props.moreWidth ? props.moreWidth - 2 : '298px',
          height: '60px',
          position: 'relative',
        }}
      >
        <span>{props.title}</span>
        {props.topDelete ? (
          <Popconfirm
            title="确定删除吗?"
            onConfirm={props.handleDeleteLevel}
            onCancel={props.handlePopCancel}
            _onMouseLeave={e => e.stopPropagation()}
          >
            <a
              style={{ color: '#3499FF', right: 15, position: 'absolute' }}
              onClick={props.handleDeleteTop}
            >
              删除
            </a>
          </Popconfirm>
        ) : (
          ''
        )}
      </ListHeader>
      <ListBody>{React.Children.toArray(props.children)}</ListBody>
      {props.hiddenFooter ? (
        ''
      ) : (
        <ListFooter style={{ justifyContent: 'center', fontSize: 16 }}>
          <Button
            type={'primary'}
            style={{ width: '200px', height: '40px' }}
            onClick={props.onFooterBtnClick}
          >
            添加{props.title}
          </Button>
        </ListFooter>
      )}
    </div>
  );
};

ListView.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.instanceOf(Immutable.List),
  ]),
  onFooterBtnClick: PropTypes.func,
  hiddenFooter: PropTypes.bool,
  showDelete: PropTypes.bool,
};

export class ListViewItem extends React.Component {
  state = {
    submited: false,
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleClick() {
    // 防止连续点击
    if (this.props.name) {
      this.setState({ submited: true });
    }
    if (!this.state.submited) {
      this.props.save();
    }
    this.timer = setTimeout(() => {
      this.setState({ submited: false });
    }, 500);
  }
  renderILATag=() => {
    const props = this.props;
    return props.ila && props.ila.isILA ? <Tag>ILA</Tag> : null;
  }
  render() {
    let style;
    const props = this.props;
    if (props.style) {
      style = props.style;
      style.paddingLeft = 10;
      style.textAlign = 'left';
    } else {
      style = { paddingLeft: 10 };
    }
    if (props.selected) {
      style.backgroundColor = '#F5F7F9';
    }
    let content;
    const textStyle = {
      overflow: 'hidden',
      padding: '0 10px',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      flex: 1,
    };
    if (props.editable) {
      content = (
        <ListItem style={editinput}>
          <div style={{ width: 170 }}>
            <Input
              type={'text'}
              autoFocus={true}
              onChange={props.onChange}
              value={props.name}
            />
            {props.inputNum === true ? (
              <div>
                <InputNumber
                  style={{ marginTop: 5 }}
                  min={0}
                  step={0.5}
                  defaultValue={props.num}
                  onChange={props.inputNumChange}
                />
                课时
              </div>
            ) : (
              ''
            )}
          </div>
          <div style={{ fontSize: 10, textAlign: 'right' }}>
            <a style={editbtn} onClick={this.handleClick.bind(this)}>
              保存
            </a>
            <a style={editbtn} onClick={props.cancel}>
              取消
            </a>
          </div>
        </ListItem>
      );
    } else {
      content = (
        <div style={textStyle}>
          {this.renderILATag()}
          {props.name}
          {props.inputNum === true ? (
            <span style={classCost}>{props.num}课时</span>
          ) : (
            ''
          )}
        </div>
      );
    }
    if (props.toolBarVisible) {
      content = (
        <ListItemTxt title={props.title || props.name}>
          <div style={textStyle}>
            {this.renderILATag()}
            {props.name}
            {props.inputNum === true ? <span>{props.num}课时</span> : null}
          </div>
          {/* <PlaceholderBox /> */}
          {/* { props.inputNum === true ? <span style={classCost}>{props.num}课时</span> : '' } */}
          <div className="list-view-item-operation" style={{ paddingRight: 20, fontSize: 10 }}>
            {
              props.ila ? (
                <Popconfirm
                  title={`确定${props.ila.isILA ? '取消ILA' : '设置ILA'}吗`}
                  onConfirm={props.ila.setILA}
                  onCancel={props.handlePopCancel}
                  _onMouseLeave={props.handlePopCancel}
                >
                  <a
                    style={{ color: '#3499FF', marginRight: 10 }}
                    onClick={props.goToUpDown}
                  >
                    {props.ila.isILA ? '取消ILA' : '设置ILA'}
                  </a>
                </Popconfirm>
              ) : null
            }
            {
              props.dateBtn ? (
                <a
                  style={{ color: '#3499FF', marginRight: 10 }}
                  onClick={props.showEditDate}
                >
                  {props.dateBtn.month ? `${props.dateBtn.month}月` : '日期'}
                </a>
              ) : null
            }
            {
              props.commonBtn ? (
                <a
                  style={{ color: '#3499FF', marginRight: 10 }}
                  onClick={props.onCommonBtnClick}
                >
                  {props.commonBtnText || '设置'}
                </a>
              ) : null
            }
            {props.isShowUpDown ? (
              <Popconfirm
                title={`确定${props.upDownStatus ? '下架' : '上架'}吗`}
                onConfirm={props.changeUpDownStatus}
                onCancel={props.handlePopCancel}
                _onMouseLeave={props.handlePopCancel}
              >
                <a
                  style={{ color: '#3499FF', marginRight: 10 }}
                  onClick={props.goToUpDown}
                >
                  {props.upDownStatus ? '下架' : '上架'}
                </a>
              </Popconfirm>
            ) : null}
            {props.isLastNode ? (
              <a
                style={{ color: '#3499FF', marginRight: 10 }}
                onClick={props.lookMap}
              >
                图谱
              </a>
            ) : null}
            <a
              style={{ color: '#3499FF', marginRight: 10 }}
              onClick={props.goToUpdate}
            >
              修改
            </a>
            {
              props.noPopconfirm ? <a style={{ color: '#3499FF' }} onClick={(e) => {
                e.stopPropagation();
                props.goToDelete();
              }}>
                删除
              </a> :
              <Popconfirm
                title="确定删除吗?"
                onConfirm={props.handleDelete}
                onCancel={props.handlePopCancel}
                _onMouseLeave={props.handlePopCancel}
                >
                <a style={{ color: '#3499FF' }} onClick={props.goToDelete}>
                    删除
                  </a>
              </Popconfirm>
            }
          </div>
        </ListItemTxt>
      );
    }
    return (
      <ListItem
        style={props.style}
        className={props.className}
        draggable={props.draggable}
        onClick={props.onClick}
        onMouseOver={props.onMouseOver}
        onMouseLeave={props.onMouseLeave}
        onDragStart={props.onDragStart}
        onDrop={props.onDrop}
        onDragOver={props.onDragOver}
      >
        {content}
      </ListItem>
    );
  }
}

ListViewItem.propTypes = {
  inputNum: PropTypes.bool,
  num: PropTypes.number,
  style: PropTypes.object,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  editable: PropTypes.bool,
  draggable: PropTypes.bool,
  onClick: PropTypes.func,
  onDragStart: PropTypes.func,
  onDrop: PropTypes.func,
  onDragOver: PropTypes.func,
  save: PropTypes.func,
  cancel: PropTypes.func,
  onChange: PropTypes.func,
  onMouseOver: PropTypes.func,
  onMouseLeave: PropTypes.func,
  toolBarVisible: PropTypes.bool,
  goToUpdate: PropTypes.func,
  goToDelete: PropTypes.func,
  handleDelete: PropTypes.func,
  handlePopCancel: PropTypes.func,
  inputNumChange: PropTypes.func,
  selected: PropTypes.bool,
  isShowUpDown: PropTypes.bool, // 上下架
};

export default ListView;
