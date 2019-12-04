import React from 'react';
import { Button, Modal, message, Icon } from 'antd';
import QuestionCounter from '../questionCounter';
import PaperForm from '../paperForm';
import MakeQuestion from '../QuestionModal';
import { Wrapper, Header, BackBtn, Main, Left, Right, Text, ModalFooter, ModalInfo } from './style';
import PaperEditScore from '../paperEidtScore';
import { countScore } from '../../TCPaperManagement/utils';
import { saveQuestion, editQuestion } from '../../TCPaperManagement/server';
import styled from 'styled-components';
const ModalBtn = styled(Button)`
margin-right: 10px;
`;
class PaperDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMakeQuestion: false, // 显示录题
      showEditScore: false, // 显示设定分数
      selectedSmallId: '', // 选中的小题id
      setScoreTarget: null, // 设定的目标分数
      isBatchSetScore: false, // 是否批量设置分数
      currentScore: 0, // 当前题目分数
      showConfirm: false, // 显示返回试卷列表的提示框
      currentIndex: '' // 当前选择的大题index,新增情况下用到
    };
    this.currentQuestion = {};
    this.isEditQuestion = false;
  }

  /**
   * 显示返回列表页的确认Modal
   */
  handleBack = () => {
    this.setState({ showConfirm: true });
  };
  // 显示录题modal
  addQuestion = () => {
    this.setState({
      showMakeQuestion: true,
    });
    this.isEditQuestion = false;
    this.currentQuestion = {};
  };
  /**
   * 显示设定分数弹框，同时记录相关信息
   * @param target
   * @param type
   * @param defaultScore
   * @param i
   */
  showEditScore = (target, type, defaultScore, i) => {
    this.setState({ showEditScore: true, setScoreTarget: target, isBatchSetScore: type, currentScore: defaultScore, currentIndex: i });
  };
  /**
   * 关闭设置分数弹框
   */
  closeEditScore = () => {
    this.setState({ showEditScore: false });
  };
  // 关闭录题
  closeMakeQuestion = () => {
    this.setState({ showMakeQuestion: false });
  };
  // 选中小题获取id
  handleSelectSmall = id => {
    this.setState({ selectedSmallId: id });
  };
  /**
   * 增加题目
   * @param data
   */
  handleAddQuestion=(data) => {
    const { onAddSmall, onEditSmall } = this.props;
    // console.log(JSON.stringify(data));
    // 调接口保存题目获取返回后的题目数据 smallQuestion
    data.hiddenFlag = 1;
    if (this.isEditQuestion) {
      // 编辑
      let id = this.currentQuestion.questionId;
      editQuestion({ ...data, id }).then((res) => {
        this.setState({ showMakeQuestion: false });
        onEditSmall({
          questionOutputDto: res,
          questionId: res.id,
          score: this.currentQuestion.score
        }, this.currentIndexes);
        this.currentQuestion = {};
      });
    } else {
      saveQuestion(data).then(res => {
        onAddSmall({
          questionOutputDto: res,
          questionId: res.id,
          score: 0.5
        });
        this.setState({ showMakeQuestion: false });
      });
    }

  }
  /**
   * 点击确认编辑分数按钮
   * @param target 目标id
   * @param isBatch 是否批量改
   * @param targetScore 目标分数
   * @param i 新增试卷情况下用index
   */
  handleEditScoreConfirm=(target, isBatch, targetScore, i) => {
    const { onSetScore } = this.props;
    if (!Number(targetScore) || targetScore <= 0) {
      message.warning('分数必须大于0');
      return;
    }
    onSetScore(target, isBatch, targetScore, i);
    this.setState({ showEditScore: false });
  }
  // 编辑题目
  handleEditItem = (data, bigIndex, smallIndex) => {
    console.log(data, 'edit');
    this.currentQuestion = data;
    this.isEditQuestion = true;
    this.currentIndexes = { bigIndex, smallIndex };
    this.setState({ showMakeQuestion: true });
  }
  render() {
    const { showMakeQuestion, showEditScore, selectedSmallId, isBatchSetScore, setScoreTarget, currentScore, questionTypes, showConfirm, currentIndex } = this.state;
    const { data, edit, formData, onDel, onOrder, onShowAnalysis, onBatchShowAnalysis, onDeleteBig, onSubmit, onBack, onDirectBack } = this.props;
    let bigList = data ? data.examPaperContentOutpuDtoList : [];
    let scoreAndNum = countScore(bigList);
    return (
      <Wrapper>
        <Header>
          <BackBtn
            style={{ display: 'inline-block' }}
            onClick={this.handleBack}
          >
            返回试卷列表
          </BackBtn>
          <h3>
            <strong>{edit ? '编辑' : '新建'}试卷</strong>
          </h3>
          <div style={{ width: 104 }} />
        </Header>
        <Main>
          <Left>
            <p style={{ marginBottom: 10 }}>
              分数：<Text>{scoreAndNum.score}</Text>
              &nbsp;&nbsp; 题数：<Text>{scoreAndNum.num}</Text>
            </p>
            {data && data.examPaperContentOutpuDtoList
              ? data.examPaperContentOutpuDtoList.map((item, index) => {
                return (
                  <QuestionCounter
                    key={index}
                    bigQuestion={item}
                    index={index + 1}
                    onBatchSetScore={this.showEditScore}
                    onSelect={this.handleSelectSmall}
                    onDeleteBig={onDeleteBig}
                    currentId={selectedSmallId}
                  />
                );
              })
              : null}

            <Button type="primary" onClick={this.addQuestion}>
              添加题目
            </Button>
          </Left>
          <Right>
            <PaperForm
              formData={formData}
              onBatchSetScore={this.showEditScore}
              data={data}
              selectedSmallId={selectedSmallId}
              onDel={onDel}
              onOrder={onOrder}
              onShowAnalysis={onShowAnalysis}
              onBatchShowAnalysis={onBatchShowAnalysis}
              onSubmit={onSubmit}
              onEditItem={this.handleEditItem}
            />
          </Right>
        </Main>

        <MakeQuestion
          visible={showMakeQuestion}
          onCancel={this.closeMakeQuestion}
          onSave={this.handleAddQuestion}
          questionTypeList={questionTypes}
          data={this.currentQuestion.questionOutputDto}
          title={this.isEditQuestion ? '编辑题目' : '新增题目'}
          selectDisabled={this.isEditQuestion ? true : false}
        />

        {showEditScore ? (
          <PaperEditScore
            onCancel={this.closeEditScore}
            onOk={ this.handleEditScoreConfirm }
            isBatch={isBatchSetScore}
            target={setScoreTarget}
            score={currentScore || 0}
            currentIndex={currentIndex}
          />
        ) : null}
        <Modal footer={null} visible={showConfirm} closable={false}>
          <ModalInfo><Icon type="question-circle-o" />是否确认离开并保存数据</ModalInfo>
          <ModalFooter>
            <ModalBtn onClick={() => { this.setState({ showConfirm: false }) }}>取消</ModalBtn>
            <ModalBtn type="danger" onClick={onDirectBack}>直接离开</ModalBtn>
            <ModalBtn type="primary" onClick={onBack}>保存数据</ModalBtn>
          </ModalFooter>
        </Modal>
      </Wrapper>
    );
  }
}

export default PaperDetail;
