/* eslint-disable complexity */
/**
 *
 * ShowPreviewQuestion
 *
 */

import React, { PropTypes } from 'react';
import styled from 'styled-components';
import immutable, { fromJS } from 'immutable';
import {
  toNumber,
  filterHtmlForm,
} from 'components/CommonFn';
import { numberToLetter, renderToKatex, } from 'zm-tk-ace/utils';
import { PlaceHolderBox } from 'components/CommonFn/style';
import { FlexRow, FlexColumn, FlexRowCenter } from 'components/FlexBox';
import Button from 'components/Button';
import { Icon } from 'antd';

import {
  QuestionInfoWrapper,
  QuestionsCount,
  QuestionContent,
  QuestionOptions,
  OptionsWrapper,
  OptionsOrder,
  Options,
  AnalysisWrapper,
  AnalysisItem,
  AnswerTitle,
  AnswerConten,
  ControlButtons,
  ChildreWrapper,
  CutLine,
} from 'containers/StandHomeWork/createHomeWorkStyle';
import { ZmExamda } from 'zm-tk-ace';

const EditorWrapper = styled(FlexColumn)`
  margin: 5px 16px 0;
  padding: 10px;
  border: 1px solid #ddd;
  background: ${props => (props.step === 2 ? '#fff' : '#FFFBF2')};
`;
const QuestionKnowledgeItem = styled(FlexRow)``;
const QuestionKnowledgeStar = styled(FlexRowCenter)`
  margin-top: 10px;
`;
const QuestionKnowledgeTextArea = styled(FlexRow)`
  margin-top: 10px;
  align-items: flex-start;
`;
const TextValue = styled.div`
  min-width: 36px;
`;

class ShowPreviewQuestion extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      showChild: false,
      showAnalysis: false,
    };
  }
  render() {
    const {
      item,
      index,
      showAllAnalysis,
      changeShowAnalysis,
      homeworkMsg,
      soucre,
    } = this.props;
    const { showChild } = this.state;
    const showAnalysis = showAllAnalysis || item.get('showAnalysis') || false;
    const hasChild = item.get('children') && item.get('children').count() > 0;
    const starArr = new Array(5).fill('');
    const homeworkType =
      toNumber(homeworkMsg.get('type')) < 0
        ? 2
        : toNumber(homeworkMsg.get('type'));
    const iitem = homeworkMsg.getIn(['children', index]) || fromJS({});
    const isNewType = [5, 6, 7].includes(item.get('templateType')); // 新题型
    return (
      <QuestionInfoWrapper
        bgTransparent={['standHomework', 'testhomework'].includes(soucre)}
      >
        <ZmExamda
          index={`${index + 1}.`}
          indexType="number"
          question={item}
          showRightAnswer={showAnalysis}
          options={[
            {
              key: 'title',
            },
            'children',
          ]}
        />
        {/* )} */}
        {!hasChild && !isNewType ? (
          <AnalysisWrapper show={showAnalysis}>
            <AnalysisItem>
              <AnswerTitle>解析：</AnswerTitle>
              <AnswerConten
                dangerouslySetInnerHTML={{
                  __html:
                    renderToKatex(
                      (item.get('analysis') || '').replace(
                        /(【解析】<br \/>)|(【解析】)|(【分析】)/g,
                        '',
                      ),
                    ) || '',
                }}
              />
            </AnalysisItem>
            <CutLine />
            <AnalysisItem>
              <AnswerTitle>答案：</AnswerTitle>
              {item.get('optionList').some(iit => filterHtmlForm(iit)) ? (
                <AnswerConten>
                  {(item.get('answerList') || fromJS([])).join('、')}
                </AnswerConten>
              ) : (
                <FlexColumn style={{ flex: 1 }}>
                  {(item.get('answerList') || fromJS([])).map((itt, ii) => {
                    return (
                      <AnswerConten
                        key={ii}
                        className={'rightAnswer'}
                        dangerouslySetInnerHTML={{
                          __html:
                            renderToKatex(
                              itt.replace(/(【答案】)|(【解答】)/g, ''),
                            ) || '',
                        }}
                      />
                    );
                  })}
                </FlexColumn>
              )}
              {/* {optionList.count() > 0 ?
              <AnswerConten>{(item.get('answerList') || fromJS([])).join('、')}</AnswerConten>
              : <FlexColumn style={{ flex: 1 }}>
                {(item.get('answerList') || fromJS([])).map((it, i) => {
                  return (<AnswerConten key={i} className={'rightAnswer'} dangerouslySetInnerHTML={{ __html: renderToKatex((it).replace(/(【答案】)|(【解答】)/g, '')) || '' }}></AnswerConten>);
                })}
              </FlexColumn>} */}
            </AnalysisItem>
          </AnalysisWrapper>
        ) : (
          ''
        )}
        {hasChild && showChild && !isNewType ? (
          <ChildreWrapper>
            {item.get('children').map((it, i) => {
              return (
                <QuestionInfoWrapper key={i}>
                  <QuestionsCount>{`(${i + 1})、`}</QuestionsCount>
                  <QuestionContent
                    dangerouslySetInnerHTML={{
                      __html: renderToKatex(
                        it.get('title') || '',
                        item.get('subjectId'),
                        item.get('typeId'),
                      ),
                    }}
                  />
                  <QuestionOptions>
                    {it.get('typeId') === 2
                      ? fromJS(it.get('optionList') || []).map((value, ii) => (
                        <OptionsWrapper key={ii}>
                          <OptionsOrder>{`${numberToLetter(
                              ii,
                            )}、`}</OptionsOrder>
                          <Options
                            dangerouslySetInnerHTML={{
                              __html: renderToKatex(value),
                            }}
                          />
                        </OptionsWrapper>
                        ))
                      : ''}
                  </QuestionOptions>
                  <AnalysisWrapper show={showAnalysis}>
                    <AnalysisItem>
                      <AnswerTitle>解析：</AnswerTitle>
                      <AnswerConten
                        dangerouslySetInnerHTML={{
                          __html:
                            renderToKatex(
                              (it.get('analysis') || '').replace(
                                /(【解析】<br \/>)|(【解析】)|(【分析】)/g,
                                '',
                              ),
                            ) || '',
                        }}
                      />
                    </AnalysisItem>
                    <CutLine />
                    <AnalysisItem>
                      <AnswerTitle>答案：</AnswerTitle>
                      {it.get('optionList').some(iit => filterHtmlForm(iit)) ? (
                        <AnswerConten>
                          {(it.get('answerList') || fromJS([])).join('、')}
                        </AnswerConten>
                      ) : (
                        <FlexColumn style={{ flex: 1 }}>
                          {(it.get('answerList') || fromJS([])).map(
                            (itt, ii) => {
                              return (
                                <AnswerConten
                                  key={ii}
                                  className={'rightAnswer'}
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      renderToKatex(
                                        itt.replace(
                                          /(【答案】)|(【解答】)/g,
                                          '',
                                        ),
                                      ) || '',
                                  }}
                                />
                              );
                            },
                          )}
                        </FlexColumn>
                      )}
                    </AnalysisItem>
                  </AnalysisWrapper>
                </QuestionInfoWrapper>
              );
            })}
          </ChildreWrapper>
        ) : (
          ''
        )}
        {homeworkType === 0 && soucre === 'testhomework' ? (
          <EditorWrapper>
            <QuestionKnowledgeItem>
              <TextValue style={{ minWidth: 60, color: '#B8A490' }}>
                知识点：
              </TextValue>
              <TextValue
                dangerouslySetInnerHTML={{ __html: iitem.get('name') }}
              />
            </QuestionKnowledgeItem>
            <QuestionKnowledgeStar>
              <TextValue style={{ width: 80, color: '#B8A490' }}>
                考试频率：
              </TextValue>
              {starArr.map((val, iix) => {
                return (
                  <Icon
                    key={iix}
                    type="star"
                    style={{
                      color: iix < iitem.get('starLevel') ? '#ff6c78' : '#ddd',
                      marginRight: 5,
                      cursor: 'pointer',
                    }}
                  />
                );
              })}
            </QuestionKnowledgeStar>
            <QuestionKnowledgeTextArea>
              <TextValue style={{ minWidth: 184, color: '#B8A490' }}>
                建议与评价（做对的评价）：
              </TextValue>
              <TextValue
                dangerouslySetInnerHTML={{ __html: iitem.get('rightEstimate') }}
              />
            </QuestionKnowledgeTextArea>
            <QuestionKnowledgeTextArea>
              <TextValue style={{ minWidth: 184, color: '#B8A490' }}>
                建议与评价（做错的评价）：
              </TextValue>
              <TextValue
                dangerouslySetInnerHTML={{ __html: iitem.get('wrongEstimate') }}
              />
            </QuestionKnowledgeTextArea>
          </EditorWrapper>
        ) : (
          ''
        )}
        <ControlButtons
          analysisShow={showAnalysis}
          hasChild={hasChild}
          isPreview
          showChild={showChild}
          className="buttons"
        >
          <span style={{ color: '#b34d10' }}>
            题目id: {iitem.get('questionId')}
          </span>
          {hasChild && !isNewType ? (
            <Button
              showtype={showChild ? 5 : 4}
              onClick={() => {
                const newShowChild = !showChild;
                this.setState({ showChild: newShowChild });
                // console.log(this.state, showChild, newShowChild, 'newShowChild');
              }}
            >
              {showChild ? '隐藏子题' : '查看子题'}
            </Button>
          ) : (
            ''
          )}
          <PlaceHolderBox />
          {!hasChild || showChild || isNewType ? (
            <Button
              showtype={showAnalysis ? 5 : 4}
              onClick={() => {
                const newShowAnalysis = !item.get('showAnalysis');
                changeShowAnalysis(item.get('id'), newShowAnalysis);
              }}
            >
              {showAnalysis ? '隐藏解析' : '查看解析'}
            </Button>
          ) : (
            <Button showtype={8} onClick={() => ''}>
              {showAnalysis ? '隐藏解析' : '查看解析'}
            </Button>
          )}
        </ControlButtons>
      </QuestionInfoWrapper>
    );
  }
}

ShowPreviewQuestion.propTypes = {
  item: PropTypes.instanceOf(immutable.Map).isRequired,
  // index: PropTypes.number.isRequire,
  showAllAnalysis: PropTypes.bool,
  changeShowAnalysis: PropTypes.func,
  homeworkMsg: PropTypes.instanceOf(immutable.Map),
  soucre: PropTypes.string,
  // showChild: PropTypes.bool,
};

export default ShowPreviewQuestion;
