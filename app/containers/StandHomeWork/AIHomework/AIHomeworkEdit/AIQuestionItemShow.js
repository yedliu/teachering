import React, { PropTypes } from 'react';
import immutable, { fromJS } from 'immutable';

import { renderKatex, numberToLetter, filterHtmlForm } from 'components/CommonFn';
import { ratingList } from 'utils/zmConfig';
import { formatAnswerList } from '../../common';
import {
  QuestionItemWrapper,
  OptionListWrapper,
  ChildItemWrapper,
  ChildItemNum,
  ChildItemContent,
  AnalysisWrapper,
  AnalysisBox,
  AnalysisValue,
  AnalysisContent,
  LineBox,
  AnalysisItemWrapper,
  PromptText,
  SplitSpan,
  KnowledgeTextValue,
  KnowledgeContent,
  GoldLabel
} from './AIHomeworkEditStyle';
import { ZmExamda } from 'zm-tk-ace';
// 正式课作业管理/修改作业/查看解析
export class AIQuestionItemEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  renderOptionList = (optionList) => {
    return (<OptionListWrapper>
      {optionList.filter((it) => filterHtmlForm(it)).map((it, i) => {
        return (<div key={i} style={{ minHeight: 28 }}>
          <div style={{ display: 'inline-block', minWidth: '20px', fontFamily: '思源黑体,微软雅黑', fontSize: 14 }}>{numberToLetter(i)}、</div>
          <div style={{ display: 'inline-block', width: 'calc(100% - 2em - 1px)', wordBreak: 'break-all', wordWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: renderKatex(it) }}></div>
        </div>);
      })}
    </OptionListWrapper>);
  }
  /**
   * 题目的一些相关信息
   * @param {boolean} showAlone
   * @return {React} ReactDOM
   */
  renderQuestionMsg = (showAlone) => {
    const { questionData } = this.props;
    // questionMsgShowAlone 即独立显示是需要更改其样式
    return (<PromptText style={showAlone ? { borderTop: '1px solid #ddd', paddingTop: 4 } : {}}>
      题型：{questionData.get('questionType') || ''}
      <SplitSpan />
      题类：{ratingList[questionData.get('comprehensiveDegreeId') || 1].name || ''}
      <SplitSpan />
      组卷次数：{questionData.get('quoteCount') || 0}次
      <SplitSpan />
      来源：{questionData.get('label') || '未知'}
      <SplitSpan />
      题目id：{questionData.get('id')}
      <SplitSpan />
      答题人数： {questionData.get('answerCount') || 0}
      <SplitSpan />
      正确率： {questionData.get('accuracyRate') || '0%'}
    </PromptText>);
  }
  renderComplex = () => {
    const { questionData, index, questionMsgShowAlone, isShowAnswerAnalysis } = this.props;
    const children = questionData.get('children') || fromJS([]);
    const questionDataScore = questionData.get('score') || children.map((item) => item.get('score') || 3).reduce((a, b) => a + b);
    const knowledgeNameList = questionData.get('knowledgeNameList') || fromJS([]);
    const questionIndex = index ? `${index}.<span style="color: #666;">（${questionDataScore}分）</span>` : '';
    const title = questionData.get('title') || '';
    const showAnalysis = questionData.get('showAnalysis');
    return (<QuestionItemWrapper notShowBorder bgTransparent>
      <div>
        <div className="question-index" dangerouslySetInnerHTML={{ __html: questionIndex }}></div>
        <div className="title-content" dangerouslySetInnerHTML={{ __html: renderKatex(title) }}></div>
      </div>
      <div>
        {children.map((it, i) => {
          const childTitle = it.get('title');
          const typeId = it.get('typeId');
          const childOptionList = it.get('optionList');
          return (<ChildItemWrapper key={i}>
            <ChildItemNum>({i + 1})</ChildItemNum>
            <ChildItemContent>
              {childTitle ? <div dangerouslySetInnerHTML={{ __html: renderKatex(childTitle) }}></div> : ''}
              {typeId === 2 && childOptionList.count() > 0 ? this.renderOptionList(childOptionList) : ''}
            </ChildItemContent>
          </ChildItemWrapper>);
        })}
      </div>
      {showAnalysis ? <AnalysisWrapper>
        <LineBox></LineBox>
        <AnalysisBox style={{ lineHeight: '2em' }}>
          <KnowledgeTextValue>知识点：</KnowledgeTextValue>
          <KnowledgeContent>{knowledgeNameList.join('、')}</KnowledgeContent>
        </AnalysisBox>
        {children.map((it, i) => {
          const analysis = it.get('analysis') || '';
          const isChoice = it.get('typeId') === 2;
          const answer = formatAnswerList(it.get('answerList').toJS() || [], isChoice);
          return (<AnalysisItemWrapper key={i}>
            <ChildItemNum>({i + 1})</ChildItemNum>
            <ChildItemContent>
              <AnalysisBox>
                <AnalysisValue>答案：</AnalysisValue>
                <AnalysisContent dangerouslySetInnerHTML={{ __html: renderKatex(isChoice ? answer.split('|').join('、') : answer) }}></AnalysisContent>
              </AnalysisBox>
              <AnalysisBox>
                <AnalysisValue>解析：</AnalysisValue>
                <AnalysisContent dangerouslySetInnerHTML={{ __html: renderKatex(analysis) }}></AnalysisContent>
              </AnalysisBox>
            </ChildItemContent>
          </AnalysisItemWrapper>);
        })}
        {questionMsgShowAlone ? null : this.renderQuestionMsg()} {/* 这里需要注意的是：questionMsgShowAlone 时在外面独立显示信息，这里则不需要了 */}
      </AnalysisWrapper> : ''}
      {questionMsgShowAlone ? this.renderQuestionMsg(questionMsgShowAlone) : null}
      {isShowAnswerAnalysis ? this.renderSimpleInfo(true) : null}
    </QuestionItemWrapper>);
  }
  renderBasic = () => {
    const { questionData, index, questionMsgShowAlone, isShowAnswerAnalysis } = this.props;
    const isChildrenQuestion = [5, 6, 7].includes(questionData.get('templateType'));
    const questionIndex = index ? <span>{index}.<span style={{ color: '#666' }}>{`（${questionData.get('score') || 3}分）`}</span></span> : '';
    const knowledgeNameList = questionData.get('knowledgeNameList') || fromJS([]);
    const analysis = questionData.get('analysis') || '';
    const isChoice = questionData.get('templateType') === 2;
    const answer = formatAnswerList((questionData.get('answerList') || fromJS([])).toJS(), isChoice);
    const isNewType = [5, 6, 7].includes(questionData.get('templateType')); // 新题型
    // const isComplex = questionData.get('templateType') === 1;
    const showAnalysis = questionData.get('showAnalysis');
    return (<QuestionItemWrapper notShowBorder bgTransparent>
      <ZmExamda
        index={questionIndex}
        question={questionData}
        showRightAnswer={showAnalysis}
        options={showAnalysis ? ['title', 'listenFile', 'problem', 'listenMaterial'] : ['title', 'listenFile', 'problem']}
      />
      {showAnalysis ? <AnalysisWrapper>
        <LineBox></LineBox>
        <AnalysisBox>
          <KnowledgeTextValue>知识点：</KnowledgeTextValue>
          <KnowledgeContent>{knowledgeNameList.join('、')}</KnowledgeContent>
        </AnalysisBox>
        {isChildrenQuestion || isNewType ? '' : <AnalysisBox>
          <AnalysisValue>答案：</AnalysisValue>
          <AnalysisContent dangerouslySetInnerHTML={{ __html: renderKatex(isChoice ? answer.split('|').join('、') : answer) }}></AnalysisContent>
        </AnalysisBox>}
        {isChildrenQuestion && !analysis || isNewType ? '' : <AnalysisBox>
          <AnalysisValue>解析：</AnalysisValue>
          <AnalysisContent dangerouslySetInnerHTML={{ __html: renderKatex(analysis) }}></AnalysisContent>
        </AnalysisBox>}
        {questionMsgShowAlone ? null : this.renderQuestionMsg()} {/* 这里需要注意的是：questionMsgShowAlone 时在外面独立显示信息，这里则不需要了 */}
      </AnalysisWrapper> : ''}
      {questionMsgShowAlone ? this.renderQuestionMsg(questionMsgShowAlone) : null}
      {isShowAnswerAnalysis ? this.renderSimpleInfo() : null}
    </QuestionItemWrapper>);
  }
  renderSimpleInfo = (isComplex) => {
    const { questionData } = this.props;
    const children = questionData.get('children') || fromJS([]);
    const analysis = questionData.get('analysis') || '';
    const isChoice = questionData.get('templateType') === 2;
    const answer = formatAnswerList((questionData.get('answerList') || fromJS([])).toJS(), isChoice);
    return (
      <div style={{ background: 'rgba(255, 251, 242, 1)', width: '100%', padding: '5px' }}>
        <div style={{ marginBottom: '10px' }}>
          来源试卷：{questionData.get('sourceExamPaperName') || '--'}
        </div>
        <div>
          {isComplex ?
            children.map((it, i) => {
              const analysis = it.get('analysis') || '';
              const isChoice = it.get('typeId') === 2;
              const answer = formatAnswerList(it.get('answerList').toJS() || [], isChoice);
              return (<AnalysisItemWrapper key={i}>
                <ChildItemNum>({i + 1})</ChildItemNum>
                <ChildItemContent>
                  <AnalysisBox>
                    <GoldLabel>答案：</GoldLabel>
                    <AnalysisContent dangerouslySetInnerHTML={{ __html: renderKatex(isChoice ? answer.split('|').join('、') : answer) }}></AnalysisContent>
                  </AnalysisBox>
                  <AnalysisBox>
                    <GoldLabel>解析：</GoldLabel>
                    <AnalysisContent dangerouslySetInnerHTML={{ __html: renderKatex(analysis) }}></AnalysisContent>
                  </AnalysisBox>
                </ChildItemContent>
              </AnalysisItemWrapper>);
            })
            :
              <div>
                <GoldLabel>解析：</GoldLabel>
                <AnalysisContent dangerouslySetInnerHTML={{ __html: renderKatex(analysis) }}></AnalysisContent>
                <GoldLabel>答案：</GoldLabel>
                <AnalysisContent dangerouslySetInnerHTML={{ __html: renderKatex(isChoice ? answer.split('|').join('、') : answer) }}></AnalysisContent>
              </div>
          }
        </div>
      </div>
    );
  }
  render() {
    const { questionData } = this.props;
    const isComplex = questionData.get('templateType') === 1;
    const res = isComplex ? this.renderComplex() : this.renderBasic();
    return res;
  }
}

AIQuestionItemEdit.propTypes = {
  questionData: PropTypes.instanceOf(immutable.Map).isRequired,
  index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default AIQuestionItemEdit;
