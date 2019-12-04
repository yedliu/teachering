/* eslint-disable no-script-url */
import React from 'react';
import styled from 'styled-components';
const pic_null = window._baseUrl.imgCdn + '18cdee41-78a4-4873-b815-17cbf07aaab2.png';
import { Button, Input, message, Popconfirm } from 'antd';

const CardWrapper = styled.div`
    border: 1px solid rgb(219, 219, 219);
    height: 644px;
    width: 300px;
    background-color: white;
    display: inline-block;
    vertical-align: top;
    margin-left: ${props => { return props.index === 0 ? '0' : '20px' }}
`;
const ListItem = styled.div`
    font-size: 16px;
    height: 60px;
    line-height: 60px;
    padding-left: 20px;
    // cursor: pointer;
    background: ${(props) => { return props.currentIdx === props.inx ? 'rgb(245, 247, 249)' : '#FFF' }};
    border-bottom: 1px solid rgb(240, 240, 240);
    display: flex;
    .optBtn{
        flex: ${props => (props.cinx === props.inx ? '1' : '0')};
        display: ${props => (props.cinx === props.inx ? 'block' : 'none')};
    }
`;
const CardHeader = styled(ListItem)`
    background-color: #E0EDFC;
    justify-content: center;
    padding: 0;
    position: relative;
    & > a {
        position: absolute;
        right: 10px;
    }
`;

const CardList = styled.div`
    width: 100%;
    height: 80%;
    overflow: auto;
`;

const CardFooter = styled.footer`
    width: 100%;
    height: 68px;
    line-height: 68px;
    text-align: center;
`;

export default class KnowledgeCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cinx: -1,
      flag: true,
      editing: false,
      knowledgeName: '',
      activeIndex: -1, // 当前点击下标
      deleteing: false,
    };

    this.optItem = this.optItem.bind(this);
  }

  optItem(e, opt, index, subIndex, item) {
    e.stopPropagation();
    const { update, deleteItem, editing } = this.props;
    const { knowledgeName } = this.state;
    if (opt === 'update') {
      this.setState({
        activeIndex: subIndex,
        knowledgeName: item ? item.get('name') : '',
      });
      update(
        index,
        subIndex,
        item ? item.get('id') : '',
        editing ? knowledgeName : item ? item.get('name') : '',
        item ? item.get('knowledgeIds') : '',
      );
    } else {
      console.log(item && item.toJS(), 'item');
      deleteItem(index, subIndex, item ? item.get('id') : '');
    }
    this.setState({
      flag: false,
    });
  }

  changeName(e) {
    this.setState({
      knowledgeName: e.target.value,
    });
  }

  addNewKnowledge(index) {
    const { addItem, editing } = this.props;
    if (editing) {
      message.warning('请先完成之前的操作');
      return;
    }
    addItem(index);
    this.setState({
      activeIndex: -1,
      knowledgeName: '',
    });
    // console.log(this.props)
  }

  mouseOver(subIndex) {
    const { editing } = this.props;
    if (!editing) {
      this.setState({
        cinx: subIndex,
        flag: true,
        deleteing: false,
      });
    }
    console.log('over');
  }

  mouseOut() {
    const { flag, deleteing } = this.state;
    if (flag && !deleteing) {
      this.setState({
        cinx: -1,
      });
    }
    console.log('leave');
  }

  /*eslint-disable*/
  render() {
    const { knowledgeName, activeIndex, cinx, deleteing } = this.state;
    const { index, currentIdx, bodyList, onChange, editing, adding, activeLevel, onDragStart, onDrop, onDragEnd, batchDelete, beforeDelete, tab, status } = this.props;
    const word = ['一', '二', '三', '四', '五'];
    return (
      <CardWrapper index={index}>
        <CardHeader>{word[index]}级知识点{index > 1 && tab === 'course' && <Popconfirm title="确认删除么？" onConfirm={() => { batchDelete(index, bodyList) }}><a href="#">删除</a></Popconfirm>}</CardHeader>
        <CardList>
          {
            bodyList.toJS().length > 0 ?
              bodyList.map((item, subIndex) => {
                return item.get('id') !== -1 ?
                  <ListItem key={'li-' + subIndex} inx={subIndex} cinx={this.state.cinx} currentIdx={currentIdx}
                    onMouseOver={this.mouseOver.bind(this, subIndex)}
                    onMouseLeave={this.mouseOut.bind(this)}
                    draggable onDragStart={(e) => { onDragStart(e, index, subIndex) }} onDrop={(e) => { onDrop(e, index, subIndex, bodyList) }} onDragEnd={(e) => { onDragEnd(e, index, subIndex) }} onDragOver={(event) => { event.preventDefault() }}
                    onClick={() => { onChange(index, subIndex, item.get('id')) }}>
                    <div style={{ flex: 2, overflow: 'hidden' }}>{
                      (index === activeLevel && editing && activeIndex === subIndex) ? <Input style={{ width: '80%' }} onClick={(e) => { e.stopPropagation() }} autoFocus={true} value={knowledgeName} onChange={this.changeName.bind(this)} /> : item.get('name')
                    }</div>
                    <div className={(index === activeLevel && editing && activeIndex === subIndex) ? '' : 'optBtn'} onClick={() => { this.setState({ currentIndex: subIndex }) }} onMouseOver={(e) => { e.stopPropagation() }}>
                      <a href="javascript:;" onClick={(e) => { this.optItem(e, 'update', index, subIndex, item) }}>{(index === activeLevel && editing && activeIndex === subIndex) ? '保存' : '修改'}</a>
                      <span className="ant-divider" />
                      {
                        (index === activeLevel && editing && activeIndex === subIndex) ?
                          <a href="javascript:;" onClick={(e) => { this.optItem(e, 'cancel', index, subIndex, item) }}>取消</a> :
                          <Popconfirm title="确认删除么？" visible={index === activeLevel && cinx === subIndex && deleteing} onCancel={() => { this.setState({ deleteing: false }) }} onConfirm={(e) => { this.setState({ deleteing: false }); this.optItem(e, 'delete', index, subIndex, item) }}>
                            <a href="javascript:;" onClick={(e) => { e.stopPropagation(); this.setState({ deleteing: true }); beforeDelete(index) }}>删除</a>
                          </Popconfirm>
                      }
                    </div>
                  </ListItem> :
                  adding ? '' :
                    <div key={'li-' + index} style={{ textAlign: 'center' }}>
                      <img src={pic_null} alt="暂无数据" /><p style={{ color: '#999', marginTop: '20px' }}>暂无数据</p>
                    </div>;
              }
              ) :
              (adding && index === activeLevel) ?
                '' : <div style={{ textAlign: 'center' }}>
                  <img src={pic_null} alt="暂无数据" /><p style={{ color: '#999', marginTop: '20px' }}>暂无数据</p>
                </div>
          }
          {
            index === activeLevel && editing && adding &&
            <ListItem inx={-1} cinx={this.state.cinx} currentIdx={currentIdx} >
              <div style={{ flex: 2 }}><Input style={{ width: '80%' }} onClick={(e) => { e.stopPropagation() }} autoFocus={true} value={knowledgeName} onChange={this.changeName.bind(this)} /></div>
              <div onClick={() => { this.setState({ currentIndex: bodyList.toJS().length }) }}>
                <a href="javascript:;" onClick={(e) => { this.optItem(e, 'update', index, bodyList.toJS().length, null) }}>保存</a>
                <span className="ant-divider" />
                <a href="javascript:;" onClick={(e) => { this.optItem(e, 'delete', index, bodyList.toJS().length, null) }}>取消</a>
              </div>
            </ListItem>
          }
        </CardList>
        <CardFooter>
          {status === 1 && <Button type="primary" onClick={this.addNewKnowledge.bind(this, index)} style={{ width: 200, height: 40 }}>添加{word[index]}级知识点</Button>}
        </CardFooter>
      </CardWrapper>
    );
  }
}
