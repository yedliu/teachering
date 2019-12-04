import React from 'react';
import styled from 'styled-components';
import { NumberToChinese } from 'utils/helpfunc';
import { Modal, message } from 'antd';
import _ from 'lodash';

const Btns = styled.div`
position: absolute;
right: 0;
top:0;
visibility: hidden;
display: flex;
`;
const Btn = styled.div`
border-left: 1px solid #108ee9;
border-bottom: 1px solid #108ee9;
padding: 5px;
color: #108ee9;
cursor: pointer;
`;
const Wrapper = styled.div`
width: 100%;
border: 1px solid #eee;
min-height: 80px;
margin-top: 10px;
padding: 30px 10px 10px 10px;
margin-bottom: 10px;
&:hover{
border: 1px solid #108ee9;
}
&:hover ${Btns}{
 visibility: visible;
}
position: relative;
`;
const SmallBox = styled.div`
width: 38px;
height: 38px;
line-height: 38px;
text-align: center;
border: 1px solid #eee;
margin-right: 5px;
margin-bottom: 5px;
cursor: pointer;
&:active{
border-color: #108ee9;
background: #108ee9;
color: #fff;
}
`;
const activeBtn = {
  borderColor: '#108ee9',
  background: '#108ee9',
  color: '#fff',
};
const SmallBoxWrapper = styled.div`
display: flex;
flex-wrap: wrap;
padding: 5px;
min-height: 35px;
`;
class QuestionCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOver: false
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ isOver: false });
  }
  /**
   * 选择题目
   * @param id
   */
  selectQuestion=(id) => {
    const { onSelect } = this.props;
    let tId = '';
    if (id === this.props.currentId) {
      tId = '';
    } else {
      tId = id;
    }
    onSelect(tId);
    // 锚点
    let smallTop = document.querySelector(`#small-question-${id}`).offsetTop;
    let toTop = smallTop - 100;
    let targetDom = document.querySelector('.paper-question-list-wrapper');
    if (targetDom) {
      targetDom.scrollTo(0, toTop);
    }
  }
  /**
   * 批量删除
   * @param id
   */
  handleBatchDelete=(id, index) => {
    const { onDeleteBig, bigQuestion, smallListName = 'examPaperContentQuestionList' } = this.props;
    const smallList = bigQuestion[smallListName];
    if (smallList.length > 0) {
      message.warning('大题下有小题不允许删除');
      return;
    }
    Modal.confirm({
      title: '',
      content: '是否确认删除该大题',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        onDeleteBig(id, index);
      }
    });

  }
  render() {
    const { index = 1, bigQuestion, onEdit, currentId, idName = 'questionId',
      smallListName = 'examPaperContentQuestionList', onDropItem, onDrop,
      onDragLeave, onDragStart, onUp, onDown, onDrag } = this.props;
    const { isOver } = this.state;
    const smallList = bigQuestion[smallListName] || [];
    const renderSmallQuestion = (list = []) => {
      return (
        <SmallBoxWrapper
          style={{ border: isOver ? '1px dashed #108ee9' : 'none' }}
          onDragOver={(e) => {
            e.preventDefault();
            this.setState({ isOver: true });
          }}
          onDrop={(e) => {
            e.preventDefault();
            let drop = _.debounce(onDropItem, 100, { 'maxWait': 500 });
            drop(bigQuestion.name);
            this.setState({ isOver: false });
          }}
          onDragLeave={() => {
            this.setState({ isOver: false });
          }}
        >
          {list.map((item, index) => {
            return <SmallBox
              key={index}
              onClick={() => { this.selectQuestion(item[idName]) }}
              style={currentId && currentId === item[idName] ? activeBtn : {}}
              draggable
              onDragOver={(e) => { e.preventDefault() }}
              onDrop={(e) => { onDrop(item, bigQuestion.name, e) }}
              onDragLeave={(e) => { onDragLeave(item, bigQuestion.name, e) }}
              onDragStart={(e) => { onDragStart(item, bigQuestion.name, e) }}
              onDrag={(e) => { onDrag(`small-box-${item.questionIndex}`) }}
              className={`small-box-${item.questionIndex}`}
            >
              {item.questionIndex}
            </SmallBox>;
          })}
        </SmallBoxWrapper>
      );
    };
    return (
      <Wrapper>
        <Btns>
          <Btn onClick={() => {  onEdit(bigQuestion, index - 1) }}>编辑</Btn>
          <Btn onClick={() => {  onUp(bigQuestion, index - 1, 'up') }}>上移</Btn>
          <Btn onClick={() => {  onDown(bigQuestion, index - 1, 'down') }}>下移</Btn>
          <Btn onClick={() => { this.handleBatchDelete(bigQuestion.id, index - 1) }}>删除</Btn>
        </Btns>
        <h2> <strong>{`${NumberToChinese(index)}、${bigQuestion.name}`}</strong></h2>
        {renderSmallQuestion(smallList)}
      </Wrapper>
    );
  }
}

export default QuestionCounter;
