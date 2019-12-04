import React from 'react';
import { renderToKatex, backfromZmStandPrev, typeOf } from 'components/CommonFn';
import { fromJS } from 'immutable';
import {
    AnalysisWrapper,
    AnalysisItem,
    AnswerTitle,
    AnswerConten,
    FlexColumn,
} from './style';

const Analysis = ({
    isShow = true,
    showAnswer = true,
    optional = false,
    answerList = fromJS([]),
    analysis = '',
    style,
    ...rest
}) => {
  const rightAnalysis = renderToKatex((backfromZmStandPrev(analysis || '暂无', 'createHw')).replace(/(【解析】<br \/>)|(【解析】)|(【分析】)/g, '')) || '';
  const rightAnswer = (itt) => (renderToKatex((backfromZmStandPrev(itt, 'createHw')).replace(/(【答案】)|(【解答】)/g, '')) || '');
  const answers = typeOf(answerList) === 'Array' ? fromJS(answerList) : answerList;
  console.log('答案', answers.count(), '解析', analysis);
  return (
    <AnalysisWrapper show={isShow} style={style} {...rest}>
      <AnalysisItem>
        <AnswerTitle>解析：</AnswerTitle>
        <AnswerConten dangerouslySetInnerHTML={{ __html: rightAnalysis }} />
      </AnalysisItem>
      { (showAnswer && answers.count() > 0) ? (
        <AnalysisItem>
          <AnswerTitle>答案：</AnswerTitle>
          { optional
        ? <AnswerConten>{answers.join('、')}</AnswerConten>
        : <FlexColumn style={{ flex: 1 }}>
          {answers.map((itt, ii) => (
            <AnswerConten key={ii} className={'rightAnswer'} dangerouslySetInnerHTML={{ __html: rightAnswer(itt) }}></AnswerConten>
            ))}
        </FlexColumn>}
        </AnalysisItem>
     ) : ''}
    </AnalysisWrapper>
  ); };

Analysis.propTypes = {
  isShow: React.PropTypes.bool,
  showAnswer: React.PropTypes.bool,
  optional: React.PropTypes.bool,
  answerList: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),
  analysis: React.PropTypes.string,
};

export default Analysis;
