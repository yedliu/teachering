---
order:0

title: 基础样例
---
````jsx harmony
import React from 'react'
import KnowledgeCard from 'components/KnowledgeCard';

class ChildCourseManage extends React.Component{
  constructor(props) {
   super(props);
   this.state = {
    firstIdx: 1,
    classTypeList: [],
    editing: false,
    adding: false,
    cardIndex: 1,
   }
  }
  getNum = (num) => {
    // 获取当前有几级知识点
  }
  listItemCheck = (index, currentIndex, id) => {
    // 点击某个卡片
  }
  updateKnowledge = (index, currentIndex, id, name, knowledgeIds) => {
    // 修改知识点单元
  }
  deleteKnowledge = (index, currentIndex, id) => {
    // 删除知识点
  }
  addItem = () => {
    // 添加知识点
  }
  beforeDelete = (index) => {
    // 删除之前设置 当前卡片index
     this.setState({
          cardIndex: index
        })
  }
  dragStart = (event, level, itemIndex) => {
    // 拖动排序--start
  }
  droping = (event, level, itemIndex, list) => {
    // 拖动排序--droping
  }
  dragEnd = (event, level, itemIndex) => {
    // 拖动排序--end
  }
  render(){
    return (
      <KnowledgeCard 
        index={0} 
        currentIdx={firstIdx} 
        bodyList={classTypeList} 
        editing={editing} 
        adding={adding} 
        activeLevel={cardIndex}
        getNum={this.getNum(0)}
        onChange={this.listItemCheck}
        update={this.updateKnowledge} 
        tab='course' 
        status={1}
        deleteItem={this.deleteKnowledge}
        addItem={this.addItem} 
        beforeDelete={this.beforeDelete}
        onDragStart={this.dragStart} 
        onDrop={this.droping} 
        onDragEnd={this.dragEnd}  
      />
    )
  }
}
export default ChildCourseManage

````
