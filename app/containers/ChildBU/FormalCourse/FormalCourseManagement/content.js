import React from 'react';
import { message } from 'antd';
import { fromJS } from 'immutable';
import styled from 'styled-components';
import ListView, { ListViewItem } from 'components/ListView';
const pic_null = window._baseUrl.imgCdn + '18cdee41-78a4-4873-b815-17cbf07aaab2.png';

const ListName = ['一级节点', '二级节点', '三级节点', '四级节点'];

const AddBox = styled.div`
  height: 644px;
  width: 300px;
  margin-top: 25px;
  margin-left: 20px;
  display: inline-block;
  vertical-align: top;
  text-align: center;
  line-height: 644px;
`;

const AddNewBox = styled.div`
  width: 93px;
  height: 47px;
  display: inline-block;
  border: 1px solid #797979;
  color: #333;
  background: #fff;
  text-align: center;
  line-height: 47px;
  cursor: pointer;
`;

export default class Content extends React.Component {
  state = {
    name: ''
  };

  /**
   * oldNodeList:
   *   缓存层级数据的字段
   *   新增或者修改是点击了取消 则把当前层级的数据还原为 oldNodeList
   *   排序 出错了 则把当前层级的数据还原为 oldNodeList
   */

  oldNodeList = fromJS([]);
  editing = false;

  // 获取不同层级的数据
  getNodeList = level => {
    const {
      firstNodeList,
      secondNodeList,
      thirdNodeList,
      fourthNodeList
    } = this.props;
    const data = [firstNodeList, secondNodeList, thirdNodeList, fourthNodeList][
      level
    ];
    return data;
  };

  // 设置不同层级的数据
  setNodeList = (level, data) => {
    const currentLevelName = [
      'firstNodeList',
      'secondNodeList',
      'thirdNodeList',
      'fourthNodeList'
    ][level];
    this.props.updateNodeList(currentLevelName, data);
  };

  handleMouse = (index, level, flag) => {
    const data = this.getNodeList(level);
    const newData = data.setIn([index, 'toolBarVisible'], flag);
    this.setNodeList(level, newData);
  }

  // 拖动开始
  handleDragStart = (index, level) => {
    if (!isNaN(index)) {
      this.startIndex = index;
      this.currentLevel = level;
    }
  };

  handleDragEnter = index => {
    if (!isNaN(index)) {
      this.dragEndIndex = index;
    }
  };

  // 拖动结束
  handleDrop = async (index, level) => {
    if (level !== this.currentLevel) {
      message.error('不同层级不能置换');
      return;
    }
    const data = this.getNodeList(level);
    if (!isNaN(index) && this.startIndex >= 0) {
      const item = data.get(this.startIndex);
      const newData = data.delete(this.startIndex).insert(index, item);
      // 修改当前层级的数据
      this.setNodeList(level, newData);
      // 这里调的是排序的方法，如果失败了 则重置为老数据
      const success = await this.props.sort(newData, level);
      if (!success) this.setNodeList(level, data);
    }
  };

  // 点击修改按钮调用的方法
  handleGoUpdate = (index, level, id) => {
    const data = this.getNodeList(level);
    const name = data.getIn([index, 'name']);
    if (this.editing) {
      message.warning('请先完成之前的操作');
      return;
    }
    this.editing = true;
    // 点击取消会把数据重置为当前的数据
    this.oldNodeList = data;
    const newData = data.setIn([index, 'editable'], true);
    this.setNodeList(level, newData);
    this.setState({ name, id });
  };

  // 点击了取消
  handleCancel = level => {
    this.editing = false;
    this.setNodeList(level, this.oldNodeList);
  };

  // 新增或者修改 保存的方法
  handleSave = async level => {
    const { name, id } = this.state; // 输入的名字和当前修改的 id
    const success = await this.props.save(name, level, id);
    if (success) {
      this.editing = false;
    }
  };

  handleItemChange = e => {
    const name = e.target.value;
    this.setState({
      name
    });
  };

  // 底部新增数据的按钮
  handleClickFooter = level => {
    const data = this.getNodeList(level);
    if (this.editing) {
      message.warning('请先完成之前的操作');
      return;
    }
    this.oldNodeList = data;
    this.editing = true;
    const item = fromJS({ id: 'is-new-item', editable: true });
    const newData = data.push(item);
    this.setNodeList(level, newData);
    // 重置名字和修改的 id
    this.setState({
      name: '',
      id: ''
    });
  };

  handleClick = (id, level) => {
    if (this.editing) {
      message.warning('请先完成之前的操作');
      return;
    }
    this.props.onClick(id, level);
  };

  handleDelete = (id, level) => {
    if (this.editing) {
      message.warning('请先完成之前的操作');
      return;
    }
    this.props.delete(id, level);
  }

  renderItem = (nodeList, level) => {
    const { name } = this.state;
    const { selectdList } = this.props;
    if (nodeList.count() <= 0) {
      return ([
        <div
          key={1}
          style={{ textAlign: 'center', marginTop: '80px', fontSize: '14px' }}
        >
          <img src={pic_null} alt="暂无数据" />
          <p style={{ color: '#999', marginTop: '20px' }}>暂无数据</p>
        </div>
      ]);
    }

    return nodeList.map((el, index) => (
      <ListViewItem
        key={el.get('id')}
        selected={el.get('id') === selectdList[level]}
        name={el.get('editable') ? name : el.get('name')}
        editable={el.get('editable')}
        toolBarVisible={!el.get('editable')}
        onChange={this.handleItemChange}
        draggable={!this.editing}
        style={{ borderBottom: '1px solid #F0F0F0' }}
        commonBtn={!el.get('children') || el.get('children').count() === 0}
        commonBtnText="设置"
        onCommonBtnClick={() => { this.props.onSetClick(el.toJS()) }}
        onDragStart={() => {
          this.handleDragStart(index, level);
        }}
        onDragOver={e => {
          e.preventDefault();
        }}
        onDrop={e => {
          e.preventDefault();
          this.handleDrop(index, level);
        }}
        goToUpdate={e => {
          e.stopPropagation();
          this.handleGoUpdate(index, level, el.get('id'));
        }}
        handleDelete={e => {
          e.stopPropagation();
          this.handleDelete(el.get('id'), level);
        }}
        goToDelete={e => {
          e.stopPropagation();
        }}
        onClick={() => {
          if (el.get('editable')) return;
          this.handleClick(el.get('id'), level);
        }}
        cancel={() => {
          this.handleCancel(level);
        }}
        save={() => {
          this.handleSave(level);
        }}
      />
    ));
  };

  render() {
    const {
      firstNodeList,
      secondNodeList,
      thirdNodeList,
      fourthNodeList
    } = this.props;
    return (
      <div style={{ overflowX: 'auto', display: 'flex', width: '100%' }}>
        {[firstNodeList, secondNodeList, thirdNodeList, fourthNodeList].map(
          (nodeList, level, array) => {
            const { showFourth, clickAddNew } = this.props;
            if (level === 3 && nodeList.count() === 0 && !showFourth) {
              return (
                <AddBox key="addbox">
                  <AddNewBox onClick={clickAddNew}>+新增层级</AddNewBox>
                </AddBox>
              );
            }
            const ListViewList = this.renderItem(nodeList, level);
            return (
              <ListView
                key={level}
                title={ListName[level]}
                onFooterBtnClick={() => {
                  this.handleClickFooter(level);
                }}
                hiddenFooter={
                  level === 0
                    ? false
                    : array[level - 1]
                      .filter(el => el.get('id') !== 'is-new-item') // 过滤新增的节点
                      .count() === 0
                }
              >
                {ListViewList}
              </ListView>
            );
          }
        )}
      </div>
    );
  }
}
