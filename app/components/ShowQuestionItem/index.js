/**
 *
 * ShowQuestionItem
 *
 */

import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { FlexRow, FlexRowCenter } from 'components/FlexBox';
import Immutable, { fromJS } from 'immutable';
import {
  backChooseItem,
} from 'components/CommonFn';
import { renderToKatex, numberToLetter } from 'zm-tk-ace/utils';
import { questionItemCss } from 'components/CommonFn/style';
import { childTemplateType } from 'containers/GetAndInputPaper/config';
require('katex/dist/katex.min.css');

const PreViewMsgBox = styled(questionItemCss)`
  flex: 1;
  transition: all 0.4s linear;
  min-width: 375px;
  width: ${props => (props.seeMobile ? '435px' : '100%')};
  overflow-y: auto;
  font-size: 10.5pt;
  line-height: 2em;
  color: #000;
  img {
    max-width: 350px;
    max-height: 400px;
  }
  border: 1px solid #ddd;
`;
const ChildrenItem = styled.div`
  padding: 0 10px;
`;
const QuestionItemBox = styled(FlexRow)`
  align-items: flex-start;
  min-height: 1em;
  margin: 5px 0;
  padding: 5px;
  background: #fff;
`;
const QuestionTitle = styled(QuestionItemBox)``;
const QuestionOptions = styled(QuestionItemBox)``;
const QuestionAnswers = styled(QuestionItemBox)``;
const QuestionAnalysis = styled(QuestionItemBox)``;
const QuestionValue = styled.div`
  min-width: 40px;
  padding: 5px 0;
  line-height: 21pt;
`;
const ContentValue = styled.div`
  flex: 1;
  min-height: 38px;
  padding: 5px;
  border: 1px solid #ddd;
  min-height: 38px;
`;
const ItemValue = styled.div``;
const TagsItemWrapper = styled(FlexRowCenter)`
  height: 40px;
`;
const TagsItemBox = styled(FlexRowCenter)`
  height: 100%;
  width: 220px;
`;
const ValueLeft = styled.div`
  flex: ${props => (props.flex === 'none' ? '' : 1)};
  text-align: left;
`;
const ValueRight = styled.div`
  width: 80px;
  text-align: right;
`;

class ShowQuestionItem extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.showChildren = this.showChildren.bind(this);
  }
  componentWillUpdate(nextProps) {
    let res = true;
    if (nextProps === this.props) {
      res = false;
    }
    return res;
  }
  showChildren(children) {
    const { pointList, soucre } = this.props;
    // eslint-disable-next-line complexity
    return children.map((item, index) => {
      const type = item.get('typeId');
      let result = '';
      const limit = this.props.showAllChildren
        ? children.count()
        : this.props.limtShow || 99;
      const childrenKnowledgeIdList = item.get('knowledgeIdList') || fromJS([]);
      const childrenExamPointIdList = item.get('examPointIdList') || fromJS([]);
      if (index < limit) {
        result = (
          <ChildrenItem
            key={index}
            style={{
              border: soucre === 'paperfinalverify' ? '1px solid #ddd' : '',
            }}
          >
            <h3>
              子题 {index + 1}{' '}
              {soucre === 'paperfinalverify' ? (
                <span style={{ color: '#666', fontSize: 14, fontWeight: 400 }}>
                  （
                  {
                    (
                      childTemplateType.find(
                        it => item.get('typeId') === it.id,
                      ) || { name: '' }
                    ).name
                  }
                  ）
                </span>
              ) : (
                ''
              )}
            </h3>
            <QuestionTitle>
              <QuestionValue>题干：</QuestionValue>
              <ContentValue
                dangerouslySetInnerHTML={{
                  __html: renderToKatex(item.get('title') || ''),
                }}
              />
            </QuestionTitle>
            {type === 2 ? (
              <QuestionOptions>
                <QuestionValue>选项：</QuestionValue>
                <ContentValue>
                  {(item.get('optionList') || fromJS([])).map((it, i) => (
                    <FlexRow key={i}>
                      <p>{`${numberToLetter(i)}、`}</p>
                      <ItemValue
                        dangerouslySetInnerHTML={{
                          __html: renderToKatex(it || ''),
                        }}
                      />
                    </FlexRow>
                  ))}
                </ContentValue>
              </QuestionOptions>
            ) : (
              ''
            )}
            {type === 2 ? (
              <QuestionAnswers>
                <QuestionValue>答案：</QuestionValue>
                <ContentValue>
                  {(item.get('answerList') || fromJS([])).join('、')}
                </ContentValue>
              </QuestionAnswers>
            ) : (
              ''
            )}
            {type === 3 ? (
              <QuestionAnswers>
                <QuestionValue>答案：</QuestionValue>
                <ContentValue>
                  {(item.get('answerList') || fromJS([])).map((it, i) => (
                    <FlexRow key={i}>
                      <p>{`${i + 1}、`}</p>
                      <ItemValue
                        dangerouslySetInnerHTML={{
                          __html: renderToKatex(it || ''),
                        }}
                      />
                    </FlexRow>
                  ))}
                </ContentValue>
              </QuestionAnswers>
            ) : (
              ''
            )}
            {type === 4 ? (
              <QuestionAnswers>
                <QuestionValue>答案：</QuestionValue>
                <ContentValue
                  dangerouslySetInnerHTML={{
                    __html: renderToKatex(
                      (item.get('answerList') || fromJS([''])).get(0),
                    ),
                  }}
                />
              </QuestionAnswers>
            ) : (
              ''
            )}
            <QuestionAnalysis>
              <QuestionValue>解析：</QuestionValue>
              <ContentValue
                dangerouslySetInnerHTML={{
                  __html: renderToKatex(item.get('analysis') || ''),
                }}
              />
            </QuestionAnalysis>
            {soucre === 'paperfinalverify' ? (
              <TagsItemWrapper>
                {pointList.get('knowledgeIdList').count() > 0 ? (
                  <TagsItemBox style={{ width: 'auto', minWidth: 300 }}>
                    <ValueRight
                      style={{ fontWeight: 600, fontSize: 14, color: '#e33' }}
                    >
                      知识点：
                    </ValueRight>
                    <ValueLeft flex="none">
                      {backChooseItem(
                        pointList.get('knowledgeIdList'),
                        childrenKnowledgeIdList.toJS(),
                        [],
                        'knowledgeIdList',
                      ).join('、')}
                    </ValueLeft>
                  </TagsItemBox>
                ) : (
                  ''
                )}
                {pointList.get('examPointIdList').count() > 0 ? (
                  <TagsItemBox style={{ width: 'auto', minWidth: 300 }}>
                    <ValueRight
                      style={{ fontWeight: 600, fontSize: 14, color: '#e33' }}
                    >
                      考点：
                    </ValueRight>
                    <ValueLeft flex="none">
                      {backChooseItem(
                        pointList.get('examPointIdList'),
                        childrenExamPointIdList.toJS(),
                        [],
                        'examPointIdList',
                      ).join('、')}
                    </ValueLeft>
                  </TagsItemBox>
                ) : (
                  ''
                )}
              </TagsItemWrapper>
            ) : (
              ''
            )}
          </ChildrenItem>
        );
      }
      return result;
    });
  }
  render() {
    const { questionOutputDTO, seeMobile, soucre } = this.props;
    let templateType = questionOutputDTO.get('templateType') || 0;
    if (soucre === 'paperinputverify') {
      templateType = questionOutputDTO.get('templateTypeId') || 0;
    }
    return (
      <PreViewMsgBox
        subjectId={this.props.subjectId || ''}
        seeMobile={seeMobile}
        notShowBorder={soucre === 'addpaper'}
      >
        <QuestionTitle>
          <QuestionValue>题干：</QuestionValue>
          <ContentValue
            dangerouslySetInnerHTML={{
              __html: renderToKatex(
                questionOutputDTO.get('title') || '',
                questionOutputDTO.get('subjectId'),
                questionOutputDTO.get('typeId'),
              ),
            }}
          />
        </QuestionTitle>
        {templateType === 2 ? (
          <QuestionOptions>
            <QuestionValue>选项：</QuestionValue>
            <ContentValue>
              {(questionOutputDTO.get('optionList') || fromJS([])).map(
                (it, i) => (
                  <FlexRow key={i}>
                    <p>{`${numberToLetter(i)}、`}</p>
                    <ItemValue
                      dangerouslySetInnerHTML={{
                        __html: renderToKatex(it || ''),
                      }}
                    />
                  </FlexRow>
                ),
              )}
            </ContentValue>
          </QuestionOptions>
        ) : (
          ''
        )}
        {templateType === 2 ? (
          <QuestionAnswers>
            <QuestionValue>答案：</QuestionValue>
            <ContentValue>
              {(questionOutputDTO.get('answerList') || fromJS([])).join('、')}
            </ContentValue>
          </QuestionAnswers>
        ) : (
          ''
        )}
        {templateType === 3 ? (
          <QuestionAnswers>
            <QuestionValue>答案：</QuestionValue>
            <ContentValue>
              {(questionOutputDTO.get('answerList') || fromJS([])).map(
                (it, i) => (
                  <FlexRow key={i}>
                    <p>{`${i + 1}、`}</p>
                    <ItemValue
                      dangerouslySetInnerHTML={{
                        __html: renderToKatex(it || ''),
                      }}
                    />
                  </FlexRow>
                ),
              )}
            </ContentValue>
          </QuestionAnswers>
        ) : (
          ''
        )}
        {templateType === 4 ? (
          <QuestionAnswers>
            <QuestionValue>答案：</QuestionValue>
            <ContentValue
              dangerouslySetInnerHTML={{
                __html: renderToKatex(
                  (questionOutputDTO.get('answerList') || fromJS([''])).get(0),
                ),
              }}
            />
          </QuestionAnswers>
        ) : (
          ''
        )}
        {templateType !== 1 ? (
          <QuestionAnalysis>
            <QuestionValue>解析：</QuestionValue>
            <ContentValue
              dangerouslySetInnerHTML={{
                __html: renderToKatex(questionOutputDTO.get('analysis') || ''),
              }}
            />
          </QuestionAnalysis>
        ) : (
          ''
        )}
        {templateType === 1
          ? this.showChildren(questionOutputDTO.get('children') || fromJS([]))
          : ''}
      </PreViewMsgBox>
    );
  }
}

ShowQuestionItem.propTypes = {
  questionOutputDTO: PropTypes.instanceOf(Immutable.Map), // 题目数据
  seeMobile: PropTypes.bool, // mobile可见
  subjectId: PropTypes.number, // 学科 Id
  soucre: PropTypes.string, // 来源
  showAllChildren: PropTypes.bool, // 子题可见状态
  limtShow: PropTypes.number, // 最多显示多少子题
  pointList: PropTypes.instanceOf(Immutable.Map), // 知识点列表
};

export default ShowQuestionItem;
