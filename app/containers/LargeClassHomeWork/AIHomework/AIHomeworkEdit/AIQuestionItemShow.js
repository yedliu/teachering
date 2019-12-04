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
} from './AIHomeworkEditStyle';

export class AIQuestionItemEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.renderComplex = this.renderComplex.bind(this);
    this.renderBasic = this.renderBasic.bind(this);
    this.renderOptionList = this.renderOptionList.bind(this);
  }
  renderOptionList(optionList) {
    return (<OptionListWrapper>
      {optionList.filter((it) => filterHtmlForm(it)).map((it, i) => {
        return (<div key={i} style={{ minHeight: 28 }}>
          <div style={{ display: 'inline-block', minWidth: '20px', fontFamily: '思源黑体,微软雅黑', fontSize: 14 }}>{numberToLetter(i)}、</div>
          <div style={{ display: 'inline-block', wordBreak: 'break-all', wordWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: renderKatex(it) }}></div>
        </div>);
      })}
    </OptionListWrapper>);
  }
  renderComplex() {
    const { questionData, index } = this.props;
    // console.log(questionData.toJS(), index, 'questionData');
    const children = questionData.get('children') || fromJS([]);
    const questionDataScore = questionData.get('score') || children.map((item) => item.get('score') || 3).reduce((a, b) => a + b);
    const knowledgeNameList = questionData.get('knowledgeNameList') || fromJS([]);
    const questionIndex = index ? `${index}.<span style="color: #666;">（${questionDataScore}分）</span>` : '';
    const title = (questionData.get('title') || '').replace(/<p>/, `<p>${questionIndex}`);
    return (<QuestionItemWrapper notShowBorder bgTransparent>
      <p dangerouslySetInnerHTML={{ __html: renderKatex(title) }}></p>
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
      {questionData.get('showAnalysis') ? <AnalysisWrapper>
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
        <PromptText>
          题型：{questionData.get('questionType') || ''}
          <SplitSpan />
          题类：{ratingList[questionData.get('comprehensiveDegreeId') || 1].name || ''}
          <SplitSpan />
          组卷次数：{questionData.get('quoteCount') || 0}次
          <SplitSpan />
          答题人数： {questionData.get('answerCount') || 0}
          <SplitSpan />
          正确率： {questionData.get('accuracyRate') || '0%'}
        </PromptText>
      </AnalysisWrapper> : ''}
    </QuestionItemWrapper>);
  }
  renderBasic() {
    const { questionData, index } = this.props;
    const questionIndex = index ? `${index}.<span style="color: #666;">（${questionData.get('score') || 3}分）</span>` : '';
    const title = (questionData.get('title') || '').replace(/<p>/, `<p>${questionIndex}`);
    const templateType = questionData.get('templateType');
    const optionList = questionData.get('optionList');
    const knowledgeNameList = questionData.get('knowledgeNameList') || fromJS([]);
    const analysis = questionData.get('analysis') || '';
    const isChoice = questionData.get('templateType') === 2;
    const answer = formatAnswerList((questionData.get('answerList') || fromJS([])).toJS(), isChoice);
    return (<QuestionItemWrapper notShowBorder bgTransparent>
      <p dangerouslySetInnerHTML={{ __html: renderKatex(title) }}></p>
      {templateType === 2 && optionList.count() > 0 ? this.renderOptionList(optionList) : ''}
      {questionData.get('showAnalysis') ? <AnalysisWrapper>
        <LineBox></LineBox>
        <AnalysisBox>
          <KnowledgeTextValue>知识点：</KnowledgeTextValue>
          <KnowledgeContent>{knowledgeNameList.join('、')}</KnowledgeContent>
        </AnalysisBox>
        <AnalysisBox>
          <AnalysisValue>答案：</AnalysisValue>
          <AnalysisContent dangerouslySetInnerHTML={{ __html: renderKatex(isChoice ? answer.split('|').join('、') : answer) }}></AnalysisContent>
        </AnalysisBox>
        <AnalysisBox>
          <AnalysisValue>解析：</AnalysisValue>
          <AnalysisContent dangerouslySetInnerHTML={{ __html: renderKatex(analysis) }}></AnalysisContent>
        </AnalysisBox>
        <PromptText>
          题型：{questionData.get('questionType') || ''}
          <SplitSpan />
          题类：{ratingList[questionData.get('comprehensiveDegreeId') || 1].name || ''}
          <SplitSpan />
          组卷次数：{questionData.get('quoteCount') || 0}次
          <SplitSpan />
          答题人数： {questionData.get('answerCount') || 0}
          <SplitSpan />
          正确率： {questionData.get('accuracyRate') || '0%'}
        </PromptText>
      </AnalysisWrapper> : ''}
    </QuestionItemWrapper>);
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
