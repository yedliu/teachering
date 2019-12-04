/*
 *
 * PaperShowPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import immutable, { fromJS } from 'immutable';
import { Button } from 'antd';
import { numberToChinese, getQuestionType, numberToLetter, strToArr, backChooseItem, toNumber, backfromZmStandPrev, renderToKatex } from 'components/CommonFn';
import { PlaceHolderBox } from 'components/CommonFn/style';
import { FlexRow, FlexRowCenter } from 'components/FlexBox';
import { getDefaultTemplate } from 'utils/templateMapper';
import PaperQuestionList from 'components/PaperQuestionList';

import makeSelectPaperShowPage, {
  makeIndex,
} from './selectors';
import {
  changeIndexAction,
  initIndexAction,
} from './actions';
import ChildrenShow from './childrenShow';
import {
  PaperWrapper,
  Header,
  ContentWrapper,
  LeftWrapper,
  QuestionMsgWrapper,
  WeightText,
  QuestionContentBox,
  QuestionOptions,
  OptionsWrapper,
  OptionsOrder,
  Options,
  AnalysisWrapper,
  QuestionAnalysis,
  QUestionAnswer,
  AnswerTitle,
  AnswerConten,
  QuestionItemWrapper,
  QuestionTitleContent,
  ChildrenItem,
  AnswerBox,
  QuestionContentWrapper,
  RightWrapper,
  TagsShowWrapper,
  TagsItemWrapper,
  LineItem,
  ItemTitle,
  TextValue,
  PointItemSpan,
  VerifyResultWrapper,
  ChildrenShowButtonWrapper,
  ChangeButtonWrapper,
  ShowButton,
} from './paperStyle';
import {
  tagsName,
  lineHeight,
  flexObj,
} from './common';


export class PaperShowPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.questionItemforType = this.questionItemforType.bind(this);
    this.makeQuestionItem = this.makeQuestionItem.bind(this);
    this.changeShowChildren = this.changeShowChildren.bind(this);
    this.changeQuestion = this.changeQuestion.bind(this);
    this.state = {
      showChildren: false,
      limtShow: 5,
      showAllChildren: false,
    };
  }
  questionItemforType(currentQuestion, type, index) {
    let res = '';
    switch (type) {
      case 1:
        res = (<QuestionItemWrapper>
          <QuestionTitleContent><div>{`${index + 1}、`}</div><QuestionContentBox dangerouslySetInnerHTML={{ __html: renderToKatex(backfromZmStandPrev(currentQuestion.get('title') || '')) }} /></QuestionTitleContent>
          <QuestionOptions>
            {fromJS(currentQuestion.get('optionList') || []).map((value, i) => (
              <OptionsWrapper key={i}>
                <OptionsOrder>{`${numberToLetter(i)}、`}</OptionsOrder>
                <Options dangerouslySetInnerHTML={{ __html: renderToKatex(backfromZmStandPrev(value.replace(/\u5b8b\u4f53/g, '思源黑体 CN Normal').replace(/<br>/g, ''))) }} />
              </OptionsWrapper>
            ))}
          </QuestionOptions>
          <AnalysisWrapper>
            <QuestionAnalysis>
              <AnswerTitle><span>解析：</span></AnswerTitle>
              <AnswerConten dangerouslySetInnerHTML={{ __html: renderToKatex(backfromZmStandPrev(currentQuestion.get('analysis') || '').replace(/(【解析】<br \/>)|(【解析】)|(【分析】)/g, '') || '') }} />
            </QuestionAnalysis>
            <QUestionAnswer>
              <AnswerTitle><span>答案：</span></AnswerTitle>
              {currentQuestion.get('answerList').map((value, i) => {
                return (<AnswerConten key={i} style={{ maxWidth: 30 }} className={'rightAnswer'} dangerouslySetInnerHTML={{ __html: renderToKatex(backfromZmStandPrev(value || '').replace(/(【答案】)|(【解答】)/g, '') || '') }} />);
              })}
            </QUestionAnswer>
          </AnalysisWrapper>
        </QuestionItemWrapper>);
        break;
      case 2:
        res = (<QuestionItemWrapper>
          <QuestionTitleContent><div>{`${index + 1}、`}</div><QuestionContentBox dangerouslySetInnerHTML={{ __html: renderToKatex(backfromZmStandPrev(currentQuestion.get('title') || '')) }} /></QuestionTitleContent>
          <AnalysisWrapper>
            <QuestionAnalysis>
              <AnswerTitle><span>解析：</span></AnswerTitle>
              <AnswerConten dangerouslySetInnerHTML={{ __html: renderToKatex(backfromZmStandPrev(currentQuestion.get('analysis') || '').replace(/(【解析】<br \/>)|(【解析】)|(【分析】)/g, '') || '') }} />
            </QuestionAnalysis>
            <QUestionAnswer>
              <AnswerTitle><span style={{ marginTop: '6px' }}>答案：</span></AnswerTitle>
              <AnswerBox>
                {currentQuestion.get('answerList').map((value, i) => {
                  return (<FlexRow key={i} style={{ flexDirection: 'flex-start' }}>
                    {currentQuestion.get('answerList').count() > 1 ? <div style={{ lineHeight: 2, fontSize: '10.5pt' }}>{i + 1}、</div> : ''}
                    <AnswerConten style={{ display: 'block' }} className={'rightAnswer'} dangerouslySetInnerHTML={{ __html: renderToKatex(backfromZmStandPrev(value || '').replace(/(【答案】)|(【解答】)/g, '') || '') }} />
                  </FlexRow>);
                })}
              </AnswerBox>
            </QUestionAnswer>
          </AnalysisWrapper>
        </QuestionItemWrapper>);
        break;
      case 3:
        res = (<QuestionItemWrapper>
          <QuestionTitleContent><div>{`${index + 1}、`}</div><QuestionContentBox dangerouslySetInnerHTML={{ __html: renderToKatex(backfromZmStandPrev(currentQuestion.get('title') || '')) }} /></QuestionTitleContent>
          <AnalysisWrapper>
            <QuestionAnalysis>
              <AnswerTitle><span>解析：</span></AnswerTitle>
              <AnswerConten dangerouslySetInnerHTML={{ __html: renderToKatex(backfromZmStandPrev(currentQuestion.get('analysis') || '').replace(/(【解析】<br \/>)|(【解析】)|(【分析】)/g, '') || '') }} />
            </QuestionAnalysis>
            <QUestionAnswer>
              <AnswerTitle><span style={{ marginTop: '6px' }}>答案：</span></AnswerTitle>
              <AnswerBox>
                {currentQuestion.get('answerList').map((value, i) => {
                  return (<AnswerConten key={i} className={'rightAnswer'} dangerouslySetInnerHTML={{ __html: renderToKatex(backfromZmStandPrev(value || '').replace(/(【答案】)|(【解答】)/g, '') || '') }} />);
                })}
              </AnswerBox>
            </QUestionAnswer>
          </AnalysisWrapper>
        </QuestionItemWrapper>);
        break;
      case 4:
        const children = currentQuestion.get('children') || fromJS([]);
        // log(children.toJS(), 'children');
        res = (<QuestionItemWrapper>
          <QuestionTitleContent><div style={{ fontSize: 14, fontWeight: 600 }}>{`${index + 1}、`}</div><QuestionContentBox style={{ fontSize: 14 }} dangerouslySetInnerHTML={{ __html: renderToKatex(backfromZmStandPrev(currentQuestion.get('title') || '')) }} /></QuestionTitleContent>
          {children.count() > 0 ? children.map((item, i) => {
            let result = '';
            const limit = this.state.showAllChildren ? children.count() : this.state.limtShow;
            if (i < limit) {
              result = (<ChildrenItem key={i}>{this.questionItemforType(item, item.get('typeId') - 1, i)}</ChildrenItem>);
            }
            return result;
          }) : ''}
        </QuestionItemWrapper>);
        break;
      default:
        break;
    }
    return res;
  }
  makeQuestionItem(currentQuestion, questionIndex) {
    // console.log(, 'currentQuestion - currentQuestion -- 485');
    let res = '';
    const { typeId, templateType } = currentQuestion.toJS();
    const templateTypeId = templateType > 0 ? templateType : Number(getDefaultTemplate(typeId));
    // log(currentQuestion.toJS(), templateTypeId, 'templateTypeId - templateTypeId');
    if (templateTypeId === 2) {
      res = this.questionItemforType(currentQuestion, 1, questionIndex);
    } else if (templateTypeId === 3) {
      res = this.questionItemforType(currentQuestion, 2, questionIndex);
    } else if (templateTypeId === 4) {
      res = this.questionItemforType(currentQuestion, 3, questionIndex);
    } else if (templateTypeId === 1) {
      res = this.questionItemforType(currentQuestion, 4, questionIndex);
    }
    return res;
  }
  changeQuestion(type, classType) {
    const index = this.props.index;
    const questionIndex = index.get(classType);
    let nextIndex = questionIndex;
    if (type === 'prev' && questionIndex > 0) {
      nextIndex = questionIndex - 1;
    } else if (type === 'next' && questionIndex < this.props.dataList.count() - 1) {
      nextIndex = questionIndex + 1;
    } else if (typeof type === 'number') {
      nextIndex = type;
    }
    this.props.dispatch(changeIndexAction(index.set(classType, nextIndex)));
  }
  changeShowChildren(bol) {
    this.setState({ showChildren: bol });
  }
  render() {
    const { changePaperState, dataList, typeList, knowledgeList, examPointList, index } = this.props;
    const questionIndex = index.get('questionIndex');
    const questionItem = dataList.get(questionIndex);
    const questionTags = questionItem.getIn(['questionOutputDTO', 'questionTag']);
    const children = questionItem.getIn(['questionOutputDTO', 'children']);
    const knowledgeIdList = strToArr(questionTags.get('knowledgeIds'), ',').map((it) => toNumber(it));
    const examPointIdList = strToArr(questionTags.get('examPointIds'), ',').map((it) => toNumber(it));
    const errState = questionItem.getIn(['questionOutputDTO', 'errState']) || -1;
    const errReason = questionItem.getIn(['questionOutputDTO', 'tagReason']) || '';
    let adoptNumber = 0;
    dataList.forEach((item) => {
      if (item.getIn(['questionOutputDTO', 'errState']) === 1) adoptNumber += 1;
    });
    return (<PaperWrapper>
      <Header>
        <Button
          onClick={() => {
            changePaperState(0);
            this.props.dispatch(initIndexAction());
          }}
        >返回</Button>
      </Header>
      <ContentWrapper>
        <LeftWrapper bgTransparent notShowBorder>
          <QuestionMsgWrapper>
            <FlexRowCenter style={lineHeight}><WeightText>大题编号与名称：</WeightText>{`${numberToChinese(questionItem.get('bigNumber')) || ''}、${questionItem.get('bigName') || ''}`}</FlexRowCenter>
            <FlexRowCenter style={lineHeight}>
              <WeightText>当前题号：{questionItem.get('serialNumber') || ''}</WeightText>
              <WeightText style={{ marginLeft: 30 }}>题型：{getQuestionType(typeList, questionItem.getIn(['questionOutputDTO', 'typeId'])) || ''}</WeightText>
            </FlexRowCenter>
            <QuestionContentWrapper>
              {this.makeQuestionItem(questionItem.get('questionOutputDTO'), questionIndex)}
              {children && children.count() >= this.state.limtShow ? <ShowButton><PlaceHolderBox /><Button
                type={this.state.showAllChildren ? '' : 'primary'}
                onClick={() => {
                  const showFlag = this.state.showAllChildren;
                  this.setState({ showAllChildren: !showFlag });
                }}
              >{this.state.showAllChildren ? '显示部分子题' : '显示全部子题'}</Button></ShowButton> : ''}
            </QuestionContentWrapper>
            <TagsShowWrapper>
              <h2 style={{ marginBottom: 10 }}>题目标签</h2>
              <TagsItemWrapper>
                <LineItem><ItemTitle>难度：</ItemTitle><TextValue>{tagsName.difficulty[questionTags.get('difficulty')]}</TextValue></LineItem>
                <LineItem><ItemTitle>区分度：</ItemTitle><TextValue>{tagsName.distinction[questionTags.get('distinction')]}</TextValue></LineItem>
              </TagsItemWrapper>
              <TagsItemWrapper>
                <LineItem><ItemTitle>题目评级：</ItemTitle><TextValue>{tagsName.comprehensiveDegreeId[questionTags.get('comprehensiveDegreeId')]}</TextValue></LineItem>
                <LineItem><ItemTitle>综合度：</ItemTitle><TextValue>{tagsName.rating[questionTags.get('rating')]}</TextValue></LineItem>
              </TagsItemWrapper>
              {knowledgeIdList.length > 0 ? <TagsItemWrapper>
                <ItemTitle>知识点：</ItemTitle><TextValue style={flexObj}>{backChooseItem(knowledgeList, knowledgeIdList.slice(), [], 'knowledgeIdList').map((it, i) => <PointItemSpan key={i}>{it}</PointItemSpan>)}</TextValue>
              </TagsItemWrapper> : ''}
              {examPointIdList.length > 0 ? <TagsItemWrapper>
                <ItemTitle>考点：</ItemTitle><TextValue style={flexObj}>{backChooseItem(examPointList, examPointIdList.slice(), [], 'examPointIdList').map((it, i) => <PointItemSpan key={i}>{it}</PointItemSpan>)}</TextValue>
              </TagsItemWrapper> : ''}
            </TagsShowWrapper>
            <VerifyResultWrapper>
              <FlexRowCenter style={{ fontSize: 16 }}><ItemTitle style={{ color: '#333', textAlign: 'left' }}>审核结果：</ItemTitle>{errState === 1 ? <TextValue style={{ color: '#48A534' }}>通过</TextValue> : <TextValue style={{ color: '#EB000D' }}>不通过</TextValue>}</FlexRowCenter>
              {errState === 1 ? '' : <FlexRow sltyle={{ minHeight: '30px' }}><ItemTitle>理由：</ItemTitle><p>{errReason}</p></FlexRow>}
            </VerifyResultWrapper>
            {questionItem.getIn(['questionOutputDTO', 'complateType']) === 1 || (children && children.count() > 0) ? <ChildrenShowButtonWrapper>
              <FlexRowCenter style={{ color: '#333' }}>
                <ItemTitle style={{ fontSize: 16, textAlign: 'left' }}>子题标签</ItemTitle>
                {/* <TextValue style={{ minWidth: 160 }}>审核通过题目数量：{`${adoptNumber}/${dataList.count()}`}</TextValue> */}
                <PlaceHolderBox />
                <Button type="primary" size="large" onClick={() => this.setState({ showChildren: true })}>查看详情</Button>
              </FlexRowCenter>
            </ChildrenShowButtonWrapper> : ''}
          </QuestionMsgWrapper>
          <ChangeButtonWrapper>
            {questionIndex > 0 ? <Button type="primary" onClick={() => this.changeQuestion('prev', 'questionIndex')}>上一题</Button> : <Button type="primary" disabled>上一题</Button>}
            <div style={{ width: 50 }}></div>
            {questionIndex < dataList.count() - 1 ? <Button type="primary" onClick={() => this.changeQuestion('next', 'questionIndex')}>下一题</Button> : <Button type="primary" disabled>下一题</Button>}
          </ChangeButtonWrapper>
        </LeftWrapper>
        <RightWrapper>
          <PaperQuestionList
            questionsList={this.props.bigMsg}
            source={'paperShowPage'}
            questionSelectedIndex={questionIndex + 1}
            questionItemIndexClick={(a, b, c, d, e) => {
              this.props.dispatch(changeIndexAction(index.set('questionIndex', e - 1)));
            }}
            toSeePaperMsg={() => {
              return this.props.commonInfo.set('adoptNumber', adoptNumber).toJS();
            }}
            othersData={{ questionResult: dataList.map((item) => item.get('questionOutputDTO')), paperTitle: this.props.commonInfo.get('name') }}
          ></PaperQuestionList>
        </RightWrapper>
      </ContentWrapper>
      <ChildrenShow
        openShow={this.state.showChildren}
        bigTitle={this.props.commonInfo.get('name') || ''}
        changeShowChildren={this.changeShowChildren}
        currentQuestion={questionItem}
        knowledgeList={knowledgeList}
        examPointList={examPointList}
        changeQuestion={this.changeQuestion}
      ></ChildrenShow>
    </PaperWrapper>);
  }
}

PaperShowPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  dataList: PropTypes.instanceOf(immutable.List).isRequired,
  changePaperState: PropTypes.func.isRequired,
  paperMsg: PropTypes.instanceOf(immutable.Map),
  typeList: PropTypes.instanceOf(immutable.List).isRequired,
  commonInfo: PropTypes.instanceOf(immutable.Map),
  bigMsg: PropTypes.instanceOf(immutable.List),
  knowledgeList: PropTypes.instanceOf(immutable.List),
  examPointList: PropTypes.instanceOf(immutable.List),
  index: PropTypes.instanceOf(immutable.Map),
};

const mapStateToProps = createStructuredSelector({
  PaperShowPage: makeSelectPaperShowPage(),
  index: makeIndex(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaperShowPage);
