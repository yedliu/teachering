/* eslint-disable eqeqeq */
import React from 'react';
import styled from 'styled-components';
import { Button,  message as antdMessage, } from 'antd';
import { FlexRow, } from 'components/FlexBox';
import { QuestionInfoWrapper, } from '../StandHomeWork/createHomeWorkStyle';
import { fromJS } from 'immutable';
import { ListChildQuestion } from 'containers/QuestionManagement/listChildQuestion';
import {
  filterHtmlForm,
} from 'components/CommonFn';
import QuestionTag from 'components/QuestionTag';
import EditItemQuestion from 'components/EditItemQuestion/index';
import Analysis from 'components/Analysis';
import { validateClassifyAndMatch, validateSavedQuestion } from 'components/EditItemQuestion/common';
import questionApi from '../../api/qb-cloud/question-endpoint';
import { ZmExamda } from 'zm-tk-ace';

const QuestionInfo = styled(FlexRow)`
  border-top: 1px solid rgba(0,0,0,0.08);
  padding: 5px;
  span {
    margin-right: 20px;
    color: #b34d10;
  }
`;
const HideButton = styled.div`
  display: flex;
  padding: 5px;
  height: 40px;
  align-items: center;
  justify-content: flex-end;
  button {
    margin: 0 5px;
  }
`;

const QuestionItem = styled.div`
  position: relative;
  section {
    padding: 5px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.7);
    display: flex;
  }
  &:hover {
    .showHideButton {
      display: flex;
    }
  }
`;
export class QuestionComponent extends React.Component {
  constructor(props) {
    super(props);
    this.makeEditQuestionTag = this.makeEditQuestionTag.bind(this);
    this.submitSingleQuestion = this.submitSingleQuestion.bind(this);
    this.makeEditOrAddQuestion = this.makeEditOrAddQuestion.bind(this);
    this.setNewQuestionData = this.setNewQuestionData.bind(this);
    this.changeQuestionEditState = this.changeQuestionEditState.bind(this);
    this.closeOrOpenItemQuestion = this.closeOrOpenItemQuestion.bind(this);
    this.setClickTargetAction = this.setClickTargetAction.bind(this);
    this.editQuestionSubmit = this.editQuestionSubmit.bind(this);
    this.openOrCloseTagWindow = this.openOrCloseTagWindow.bind(this);
    this.state = {
      showAnalysis: false,
      visible: true,
    };
  }

  // componentDidMount() {
    // 获取年级
    // getGradeData().then(res => {
    //   const { code, message, data } = res;
    //   code != '0' ? antdMessage.error(message || '获取年级出错') : this.setState({ gradeData: data });
    // });
  // }

  openOrCloseTagWindow = (bool) => {
    this.setState({
      showQuestionTag: bool,
    });
  }

  // 提交
  editQuestionSubmit(type) {
    const { newQuestion } = this.state;
    if ([5, 6].includes(newQuestion.get('templateType'))) {
      const response = validateClassifyAndMatch(newQuestion);
      if (response.errorMsg) {
        antdMessage.warning(response.errorMsg || '录入有误，请检查');
        return false;
      } else {
        this.setState({
          curTagQ: response.data
        });
      }
    } else {
      const errorMsg = validateSavedQuestion(newQuestion);
      if (errorMsg) {
        antdMessage.info(errorMsg);
        return false;
      }
      this.setState({
        curTagQ: newQuestion,
      });
    }
    if (!(type == 'view')) {
      this.openOrCloseTagWindow(true);
      this.setState({
        visible: true
      });
    }
    return true;
  }

  // 同步输入内容
  setClickTargetAction(str) {
    this.setState({
      clickTarget: str,
    });
  }

  // 开关新增题目面板
  closeOrOpenItemQuestion(isOpen) {
    this.setState({
      showItemQuestion: isOpen,
    });
    // 关闭的时候把弹窗恢复默认状态
    if (!isOpen) {
      this.setState({
        visible: true,
        showQuestionTag: false
      });
    }
  }

  setNewQuestionData(data) {
    this.setState({
      newQuestion: data
    });
  }

  changeQuestionEditState() {
    this.closeOrOpenItemQuestion(false);
    this.setState({
      newQuestion: fromJS({}),
      curTagQ: fromJS({}),
    });
  }

  async submitSingleQuestion(tags) {
    const { curTagQ } = this.state;
    const data = await questionApi.saveQuestion(Object.assign(curTagQ.toJS(), tags));
    if (data && data.code == 0) {
      antdMessage.success(data.message || '保存成功');
      this.setState({
        showQuestionTag: false,
        showItemQuestion: false,
        newQuestion: fromJS({}),
      });
      this.props.go();
    } else {
      antdMessage.error(data && data.message || '保存出错');
    }
    this.setState({ clickTarget: '' });
  }


  // 展示标签
  makeEditQuestionTag(showAnalysis, isNewType) {
    const { curTagQ, isCacheWhenClose, visible } = this.state;
    return (
      <QuestionTag
        question={curTagQ.toJS()}
        visible={visible}
        cancelText={isCacheWhenClose ? '上一步' : '取消'}
        close={() => {
          if (isCacheWhenClose) {
            this.setState({
              visible: false,
            });
          } else {
            this.setState({
              showQuestionTag: false,
            });
          }
        }}
        submitTags={(tags) => {
          this.submitSingleQuestion(tags);
        }}
        showAnalysis={showAnalysis}
        isNewType={isNewType}
      />
    );
  }

  // 单题录入弹框
  makeEditOrAddQuestion() {
    const { clickTarget, newQuestion, questionEditState } = this.state;
    return (
      <EditItemQuestion
        isJiucuo
        isOpen
        curTagQ={this.state.curTagQ}
        questionEditState={questionEditState || 0}
        newQuestion={newQuestion}
        clickTarget={clickTarget}
        setNewQuestionData={this.setNewQuestionData}
        changeQuestionEditState={this.changeQuestionEditState}
        setClickTarget={this.setClickTargetAction}
        soucre="questionPicker"
        submitQuestionItem={this.editQuestionSubmit}
      />
    );
  }

  render() {
    const { question } = this.props;
    const { showAnalysis, showQuestionTag, showItemQuestion } = this.state;
    const isComplex = question.get('templateType') == 1;
    const isNewType = [5, 6, 7].includes(question.get('templateType')); // 新题型
    return (
      <QuestionItem>
        {showQuestionTag ? this.makeEditQuestionTag({ showAnalysis, isNewType }) : ''}
        {showItemQuestion ? this.makeEditOrAddQuestion() : ''}
        <section>
          <QuestionInfoWrapper style={{ borderWidth: '2px' }}>
            <ZmExamda
              index={''}
              question={question}
              showRightAnswer={showAnalysis}
              options={[
                {
                  key: 'title',
                },
              ]}
            />
            <QuestionInfo>
            </QuestionInfo>
            <HideButton className="showHideButton">
              {isComplex ? '' : (
                <Button
                  onClick={() => {
                    this.setState({
                      showAnalysis: !showAnalysis
                    });
                  }}
                >{showAnalysis ? '隐藏解析' : '查看解析'}</Button>
              )}
              {question.get('deleted') ? '' : (
                <Button
                  onClick={() => {
                    this.setState({
                      showQuestionTag: true,
                      curTagQ: question,
                      isCacheWhenClose: false
                    });
                  }}
                >编辑题目标签</Button>
              )}
              {question.get('deleted') ? '' : (
                <Button
                  onClick={() => {
                    console.log(question.toJS(), 'question');
                    this.setState({
                      showItemQuestion: true,
                      newQuestion: fromJS({}).merge(question),
                      curTagQ: fromJS({}).merge(question),
                    });
                    this.setNewQuestionData(question);
                  }}
                >编辑本题</Button>
              )}
              {/* {question.get('deleted') ? '' : (
                <Popconfirm
                  placement="topRight" title={'确认删除本题吗？'} onConfirm={() => {
                    dispatch(deleteQuestionAction(question.get('id') || -1));
                  }} okText="确认" cancelText="取消"
                >
                  <Button type="danger">删除本题</Button>
                </Popconfirm>
              )} */}
            </HideButton>
            {isComplex ? (
              <ListChildQuestion>{question.get('children')}</ListChildQuestion>
            ) : (
              <Analysis
                isShow={showAnalysis && !isNewType}
                showAnswer={question.get('answerList') && question.get('answerList').count() > 0}
                optional={question.get('optionList') && question.get('optionList').filter((iit) => filterHtmlForm(iit)).count() > 0}
                answerList={question.get('answerList') || fromJS([])}
                analysis={question.get('analysis')}
              />
              // <AnalysisWrapper show={showAnalysis && !isNewType}>
              //   <AnalysisItem>
              //     <AnswerTitle>解析：</AnswerTitle>
              //     <AnswerConten dangerouslySetInnerHTML={{ __html: renderToKatex((backfromZmStandPrev(question.get('analysis') || '暂无', 'createHw')).replace(/(【解析】<br \/>)|(【解析】)|(【分析】)/g, '')) || '' }} />
              //   </AnalysisItem>
              //   {question.get('answerList') && question.get('answerList').count() > 0 ? (
              //     <AnalysisItem>
              //       <AnswerTitle>答案：</AnswerTitle>
              //       {question.get('optionList') && question.get('optionList').filter((iit) => filterHtmlForm(iit)).count() > 0 ?
              //         <AnswerConten>{(question.get('answerList') || fromJS([])).join('、')}</AnswerConten>
              //         : <FlexColumn style={{ flex: 1 }}>
              //           {(question.get('answerList') || fromJS([])).map((itt, ii) => (<AnswerConten key={ii} className={'rightAnswer'} dangerouslySetInnerHTML={{ __html: renderToKatex((backfromZmStandPrev(itt, 'createHw')).replace(/(【答案】)|(【解答】)/g, '')) || '' }}></AnswerConten>))}
              //         </FlexColumn>}
              //     </AnalysisItem>
              //   ) : ''}
              // </AnalysisWrapper>
            )}
          </QuestionInfoWrapper>
        </section>
      </QuestionItem>
    );
  }
}

export default QuestionComponent;
