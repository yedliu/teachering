import React from 'react';
import styled from 'styled-components';
import { NumberToChinese } from 'utils/helpfunc';
import { Modal } from 'antd';
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
padding-top: 10px;
`;
class QuestionCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentId: ''
    };
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
    this.setState({ currentId: tId });
    onSelect(tId);
    // 锚点
    let smallTop = document.querySelector(`#small-question-${id}`).offsetTop;
    let toTop = smallTop - 50;
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
    const { onDeleteBig } = this.props;
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
    const { index = 1, bigQuestion, onBatchSetScore, currentId, idName = 'questionId', smallListName = 'examPaperContentQuestionList' } = this.props;
    const smallList = bigQuestion[smallListName] || [];
    console.log('smallList', smallList);
    const renderSmallQuestion = (list = []) => {
      return (
        <SmallBoxWrapper>
          {list.map((item, index) => {
            return <SmallBox key={index} onClick={() => { this.selectQuestion(item[idName]) }} style={currentId === item[idName] ? activeBtn : {}}>
              {/* <a href={`#small-question-${item.questionId}`} style={currentId === item.questionId ? { color: '#fff' } : {}}>{index + 1}</a> */}
              {index + 1}
            </SmallBox>;
          })}
        </SmallBoxWrapper>
      );
    };
    return (
      <Wrapper>
        <Btns>
          <Btn onClick={() => {  onBatchSetScore(bigQuestion.id, true, void 0, index - 1) }}>批量设置分数</Btn>
          <Btn onClick={() => { this.handleBatchDelete(bigQuestion.id, index - 1) }}>删除</Btn>
        </Btns>
        <h2> <strong>{`${NumberToChinese(index)}、${bigQuestion.name}`}</strong></h2>
        {renderSmallQuestion(smallList)}
      </Wrapper>
    );
  }
}

export default QuestionCounter;
