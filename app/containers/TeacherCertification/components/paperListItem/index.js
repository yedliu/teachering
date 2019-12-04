import React from 'react';
import styled from 'styled-components';
import { ZmExamda } from 'zm-tk-ace';
import { NumberToChinese } from 'utils/helpfunc';
import { Button, Icon, Modal } from 'antd';
const PreviewAction = styled.div`
width: 100%;
text-align: right;
`;
const Btn = styled.div`
border-left: 1px solid #108ee9;
border-top: 1px solid #108ee9;
height: 29px;
line-height: 18px;
padding: 5px;
color: #108ee9;
cursor: pointer;
box-sizing: border-box;
`;
const Btns = styled.div`
position: absolute;
right: -1px;
top:-29px;
visibility: hidden;
display: flex;
& ${Btn}:last-child{
 border-right: 1px solid #108ee9;
}
`;
const SmallQuestionWrapper = styled.div`
width: 100%;
border: 1px solid #eee;
min-height: 60px;
position: relative;
padding: 10px;
margin-bottom: 30px;
&:hover{
  border-color: #108ee9;
  background: #eee;
}
&:hover ${Btns}{
visibility: visible;
}
`;
const BigTitle = styled.div`
margin-bottom: 10px;
display: flex;
line-height: 30px;
width: 100%;
`;
const Wrapper = styled.div`
border: 1px solid #000;
padding: 10px 10px 10px 10px;
margin-bottom: 10px;
& ${SmallQuestionWrapper}:last-child{
margin-bottom: 0;
}
p, label, div, span{
    font-family: 'Microsoft YaHei','Helvetica Neue',Helvetica,Arial,sans-serif;
  }
  .datatype-box img{
    margin-bottom: 5px;
  }
`;
const ActiveSmall = {
  borderLeft: '5px solid #108ee9'
};
const IconStyle = { fontSize: 16, cursor: 'pointer', verticalAlign: 'middle', marginRight: '20px' };
class PaperListItem extends React.Component {
  /**
   * 设置分数
   * @param target 目标题目id
   * @param type 是否批量
   * @param defaultScore 默认分数
   * @param i 无id的时候用index
   */
  handleSetScore=(target, type, defaultScore, i) => {
    const { onBatchSetScore } = this.props;
    // console.log(target, type);
    onBatchSetScore(target, type, defaultScore, i);
  }
  /**
   * 上移下移
   * @param id 小题id
   * @param type 上移还是下移
   * @param bigId 大题id
   */
  handleOrder=(id, type, bigId, index) => {
    const { onOrder } = this.props;
    onOrder(id, type, bigId, index);
  }
  /**
   * 删除小题
   * @param id
   */
  handleDelete=(id) => {
    const { onDel } = this.props;
    Modal.confirm({
      title: '',
      content: '是否确认删除该题',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        onDel(id);
      }
    });
  }
  /**
   * 是否显示小题分析和答案
   * @param id
   * @param status
   */
  handleShowAnalysis=(id, status) => {
    const { onShowAnalysis } = this.props;
    onShowAnalysis(id, status);
  }
  /**
   *计算大题总分数
   * @param list
   * @returns {string}
   */
  handleTotalScore=(list) => {
    let total = 0;
    list.forEach(item => {
      if (item.score) {
        total += Number(item.score);
      }
    });
    return total.toFixed(1);
  }
  handleEdit=(item, bigIndex, smallIndex) => {
    this.props.onEdit(item, bigIndex, smallIndex);
  }
  render() {
    const { index, bigQuestionList, selectedSmallId, preview, species = 'er', idName = 'questionId', smallListName = 'examPaperContentQuestionList', showEdit } = this.props;
    const smallQuestionList = bigQuestionList[smallListName] || [];
    const total = this.handleTotalScore(smallQuestionList);
    return (
      <Wrapper>
        <BigTitle>
          <h2><strong>{`${NumberToChinese(index)}、${bigQuestionList.name}`}(共{smallQuestionList.length}题，共{total}分)</strong></h2>&nbsp;&nbsp;
          {preview ? null : <Button onClick={() => { this.handleSetScore(bigQuestionList.id, true, void 0, index - 1) }}>批量设置分数</Button>}
        </BigTitle>
        {
          smallQuestionList && smallQuestionList.map((item, i) => {
            return <SmallQuestionWrapper key={item[idName]} style={selectedSmallId === item[idName] ? ActiveSmall : {}} id={`small-question-${item[idName]}`}>
              {preview ? null : <Btns>
                <Btn onClick={() => { this.handleShowAnalysis(item[idName], !item.showAnalysis) }}>{item.showAnalysis ? '隐藏解析' : '查看解析'}</Btn>
                <Btn onClick={() => { this.handleSetScore(item[idName], false, item.score) }}>设定分数</Btn>
                <Btn onClick={() => { this.handleOrder(item[idName], 'up', bigQuestionList.id, index - 1) }}>上移一位</Btn>
                <Btn onClick={() => { this.handleOrder(item[idName], 'down', bigQuestionList.id, index - 1) }}>下移一位</Btn>
                <Btn onClick={() => { this.handleDelete(item[idName]) }}>删除</Btn>
              </Btns>}
              <ZmExamda
                question={item.questionOutputDto || item}
                species={species}
                index={`${i + 1}、`}
                showRightAnswer={item.showAnalysis} // 互动题型显示答案
                options={item.showAnalysis ? ['title', 'references', 'problem', 'answerList', 'analysis', 'referenceAnswer'] : ['title', 'references', 'problem']}
              />
              <PreviewAction>
                {
                  showEdit ?
                    <Icon type="edit" title="编辑" style={IconStyle} onClick={() => { this.handleEdit(item, index - 1, i) }} /> : null
                }
                <Icon type="eye" style={IconStyle}  onClick={() => { this.handleShowAnalysis(item.questionId, !item.showAnalysis) }}></Icon>&nbsp;&nbsp;
                本题分数：{item.score}
              </PreviewAction>
            </SmallQuestionWrapper>;
          })
        }
      </Wrapper>
    );
  }
}

export default PaperListItem;
