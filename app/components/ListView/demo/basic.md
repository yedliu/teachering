---
order:0

title: 基础样例
---
````jsx harmony
import React from 'react'
import ListView, { ListViewItem } from 'components/ListView/index';

class Knowledge extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        itemList: [],
        hiddenFooter: false,
        index: 0,
        isLastNode:true,
        onlyLastNodes:[], 
        name:'test'
      }
    }
    handleOnFooterBtnClick = (index, props) => {
      // 点击添加按钮
    }
    lookMap = (item, itemList) => {
      // 点击显示知识点图谱
    }
    onChange = (value, props) => {
      // 输入框onChange事件
    }
    save = () => {
      // 保存
    }
    cancel = () => {
      // 取消
    }
    onMouseOver = (index, index2, props) =>{
      // 鼠标上移事件
    }
    onMouseLeave = (level, props) => {
      // 鼠标离开事件
    }
    onDragStart = (e, level, index) => {
      // 拖动开始
    }
    onDrop = (e, index, index2, props) => {
      // 拖放
    }
    onDragOver = (e) => {
      // 拖动结束
    }
    handleItemOnClick = (item, index2, props) => {
      // 点击行
    }
    goToUpdate = (e, item, index2, props) => {
      // 更新
    }
    goToDelete = (e, index, index2, props) => {
      // 点击删除按钮
    }
    handleDelete = (e, item, index, props) => {
      // 确认删除
    }
    handlePopCancel = (e) => {
      // 取消删除
    }
    render(){
        const { itemList, hiddenFooter, index, isLastNode, onlyLastNodes, name} = this.state
        return (
            <ListView
                key={index}
                title={`${index + 1}级知识点`}
                onFooterBtnClick={() => this.handleOnFooterBtnClick(index + 1, this.props)}
                hiddenFooter={hiddenFooter}
            >
                  {
                    itemList.map((item, index2) => {
                                const style = { borderBottom: '1px solid #F0F0F0' };
                                let selected = false;
                                if (item.editable) {
                                  return (
                                    <ListViewItem
                                      key={index2}
                                      name={name}
                                      editable={true}
                                      isLastNode={true} //
                                      lookMap={() => this.lookMap(item, onlyLastNodes)}
                                      onChange={(e) => this.onChange(e, this.props.inputDto)}
                                      save={this.save}
                                      cancel={this.cancel}
                                    />
                                  );
                                } else {
                                  selected = true
                                  return (
                                    <ListViewItem
                                      selected={selected}
                                      style={style}
                                      key={index2}
                                      name={item.name}
                                      toolBarVisible={item.toolBarVisible}
                                      lookMap={() => this.lookMap(item, onlyLastNodes)}
                                      isLastNode={isLastNode} 
                                      editable={item.editable}
                                      onMouseOver={() => this.onMouseOver(index, index2, this.props)}
                                      onMouseLeave={() => this.onMouseLeave(index, this.props)}
                                      draggable={true}
                                      onDragStart={(e) => this.onDragStart(e, index, index2)}
                                      onDrop={(e) => this.onDrop(e, index, index2, this.props)}
                                      onDragOver={(e) => this.onDragOver(e)}
                                      onClick={() => this.handleItemOnClick(item, index2, this.props)}
                                      goToUpdate={(e) => {
                                        this.goToUpdate(e, item, index2, this.props);
                                      }}
                                      goToDelete={(e) => this.goToDelete(e, index, index2, this.props)}
                                      handleDelete={(e) => this.handleDelete(e, item, index2, this.props)}
                                      handlePopCancel={(e) => this.handlePopCancel(e)}
                                    />
                                  );
                                }
                              })
                  }
            </ListView>
        )
    }
}
export default Knowledge
````
