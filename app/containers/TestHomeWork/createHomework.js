/* eslint-disable no-case-declarations */
/*
 *
 * PreviewHomeWork
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import Helmet from 'react-helmet';
import immutable, { fromJS } from 'immutable';
import { createStructuredSelector } from 'reselect';
import {
  FlexRow,
  FlexRowCenter,
  FlexColumn,
  FlexCenter,
  FadeIn,
} from 'components/FlexBox';
import {
  PlaceHolderBox,
  WidthBox,
  questionItemCss,
  listStyle,
} from 'components/CommonFn/style';
import {
  toNumber,
  toString,
  numberToChinese,
  numberToLetter,
  renderToKatex,
  filterHtmlForm,
} from 'components/CommonFn';
// import Button from 'components/Button';
import Alert from 'components/Alert';
import LoadingIndicator, { RunLoading } from 'components/LoadingIndicator';
import HomeworkTree from 'containers/StandHomeWork/TreeRender';
import styled from 'styled-components';
import {
  Select,
  Pagination,
  Input,
  InputNumber,
  Icon,
  message,
  Steps,
  Button,
} from 'antd';
import Modal from 'react-modal';
import QuestionSearchData from 'components/QuestionSearchData';
import {
  changeSelectedTypeAction,
  changeSelectedHomeworkSubjectItemAction,
  changeShowAnalysisAction,
  setSearchBackQuestionsAction,
  setHomeworkSkepAction,
  // changeCreateHomeworkStepAction,
  getVersionListAction,
  getKnowledgeTreeDataAction,
  // changeSelectedGradeDataAction,
  searchQuestionListAction,
  changeIsSubmitAction,
  submitHomeworkAction,
  // setTestPaperOneAction,
  changeSelectedPhaseAction,
  changeSelectedGradeAction,
  changeSelectedSubjectAction,
  changeSelectKnowledgeItemAction,
  setAlertStatesAction,
  // changeHomeworkPaperItemAcction,
  // changeSelectedVersionAction,
  changePageIndexAction,
  getQuestionTypeList,
  // changeIsEditorOrReviseStateAction,
  getTestHomeWorkAction,
  setSearchParamsAction,
} from './actions';
import TextEditionSlider from 'components/TextEditionSlider';
import { ClearFix } from './common';
import * as server from './server';

const Option = Select.Option;

const closeIcon = window._baseUrl.imgCdn + '8a491dc2-f189-4171-a0c1-95e375a953c1.png';
const viewresolutionimg = window._baseUrl.imgCdn + 'a0709621-feda-4cc8-a94c-57f84427408a.png';
const viewresolutionimghover = window._baseUrl.imgCdn + '2c73257b-12c9-4776-bffe-235d6c99b380.png';
const deleteimg = window._baseUrl.imgCdn + 'dbd0d230-3372-40e2-991b-d00379bbbfd7.png';
const deleteimghover = window._baseUrl.imgCdn + 'b878b0a1-b767-414b-a0a1-f5731791e729.png';
const moveimg = window._baseUrl.imgCdn + '814b67ab-96e8-4307-9508-0ea558bec776.png';
const moveimghover = window._baseUrl.imgCdn + 'a77e0f68-95f5-4981-87ba-c78334682184.png';
const downimg = window._baseUrl.imgCdn + '3cd833e5-18c7-41eb-84f5-b2b780d92e1d.png';
const downimghover = window._baseUrl.imgCdn + 'bd44292e-8147-4888-9274-d02c1be8b76b.png';
const finishImg = window._baseUrl.imgCdn + 'd4dccd7e-94ab-4b38-9b51-b4303a991306.png';
const emptyImg = window._baseUrl.imgCdn + '2cfcc00d-8360-42c7-b371-4253fd4735cb.png';
const loadImg = window._baseUrl.imgCdn + '02f36e7d-35d2-4a79-a407-847ed60a6923.gif';

// import paperPreservationimg from './paperPreservation.png';
// const TreeNode = Tree.TreeNode;
const TextArea = styled(Input.TextArea)`
  resize: none;
`;
const Step = Steps.Step;
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    padding: 0,
    marginRight: '-50%',
    height: '83.3%',
    width: '83.3%',
    minHeight: '400px',
    minWidth: '900px',
    animation: `${FadeIn} .5s linear`,
    transform: 'translate(-50%, -50%)',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
};

const HomeWorkWrapper = styled(FlexColumn)`
  height: 100%;
  width: 100%;
  background: #f3f4f6;
  p {
    work-wrap: break-work;
    word-break: break-all;
  }
`;
const CloseWrapper = styled.div`
  width: 15px;
  height: 15px;
  background: url(${closeIcon}) no-repeat center;
  cursor: pointer;
`;
const HeaderWrapper = styled(FlexRowCenter)`
  height: 50px;
  min-height: 50px;
  padding: 0 20px;
  background: #fff;
`;
const Title = styled.span`
  font-weight: 600;
  font-size: 16px;
  color: #666;
`;
const StepWrapper = styled(FlexCenter)`
  height: 55px;
  min-height: 55px;
`;
const ContentWrapper = styled(FlexRow)`
  flex: 1;
  overflow: hidden;
`;
const LeftWrapper = styled(FlexColumn)`
  width: 300px;
  height: calc(100% - 20px);
  margin: 0 20px 20px;
  padding: 0 20px 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  overflow: hidden;
`;
const RightWrapper = styled(FlexColumn)`
  height: calc(100% - 20px);
  flex: 1;
  margin: 0 20px 20px 0;
  padding-top: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  overflow-y: auto;
`;
const TreeWrapper = styled(FlexColumn)`
  flex: 1;
  margin-top: 10px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: #f9f9f9;
  overflow: auto;
`;
const SearchWrapper = styled(FlexRowCenter)`
  position: relative;
  z-index: 9;
  height: 50px;
  padding: 10px 20px;
`;
const QuestionFilterWrapper = styled(FlexRowCenter)`
  padding: 0 20px;
  flex-wrap: wrap;
`;
const QuestionListWrapper = styled(FlexColumn)`
  flex: 1;
  padding: 10px 20px 0;
`;
const HomeworkSkep = styled(FlexCenter)`
  margin-left: 10px;
  padding: 0 15px;
  min-width: 80px;
  height: 30px;
  border-radius: 15px;
  background: #ef4c4f;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  user-select: none;
  &:hover {
    background: #ff6c78;
  }
  &:hover .homeworkSkepMsg {
    display: block;
  }
  &:active {
    background: #ef4c4f;
  }
  position: relative;
`;
// const QuestionFilterItem = styled(FlexRowCenter)`
//   width: 180px;
//   height: 35px;
//   min-height: 35px;
// `;
const TextValue = styled.div`
  min-width: 36px;
`;
const ControlWrapper = styled(FlexRowCenter)`
  height: 40px;
  padding: 0 20px;
  border-bottom: 1px solid #ddd;
`;
const FilterQuestionNumber = styled.div`
  font-size: 13px;
  color: #999999;
`;
const SeeAnalysisWrapper = styled(FlexRowCenter)`
  width: 120px;
  cursor: pointer;
  user-select: none;
`;
const ClickBox = styled.div`
  width: 12px;
  height: 12px;
  margin-right: 3px;
  border-radius: 50%;
  border: ${props => (props.selected ? '2px solid #EF4C4F' : '1px solid #ddd')};
`;
const SeeAnalysisValue = styled.div``;
const AddAllQuestionWrappper = styled(FlexCenter)`
  width: 120px;
`;
const HomeworkInforContent = styled.div`
  img {
    max-width: 100%;
  }
`;
const QuestionInfoWrapper = styled(questionItemCss)`
  flex: 1;
  position: relative;
  width: 100%;
  margin: 10px 0;
  padding: 12px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
  font-size: 10.5pt;
  line-height: 2em;
  color: #000;
  img {
    max-width: 350px;
    max-height: 400px;
  }
  border: 1px solid #ddd;
  zmblank {
    box-sizing: border-box;
    display: inline-block;
    width: 4em;
    height: 1em;
    text-align: center;
    border: none;
    user-select: none;
  }
  .katex-html {
    background: transparent;
  }
  &:hover {
    background: #eee;
  }
  &:hover .buttons {
    display: flex;
  }
  img {
    vertical-align: middle;
  }
  ${listStyle}
`;
export const QuestionsCount = styled.div`
  float: left;
  line-height: 1.5em;
`;
export const QuestionContent = styled(ClearFix)``;
export const QuestionOptions = styled(FlexColumn)`
  padding-left: 20px;
`;
export const OptionsWrapper = styled.div`
  flex: 1;
`;
export const OptionsOrder = styled.div`
  float: left;
`;
export const Options = styled.div`
  float: left;
`;
const AnalysisWrapper = styled.div`
  margin: 12px 16px 10px;
  padding: 12px;
  border-radius: 2px;
  border: 1px solid #e8e2d8;
  background: #fffbf2;
  font-family: MicrosoftYaHei;
  line-height: 19px;
  font-size: 14px;
  &::after {
    content: '';
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
  }
  display: ${props => (props.show ? 'block' : 'none')};
`;
const AnalysisItem = styled(FlexRow)`
  font-size: 14px;
  line-height: 20px;
  color: #7a593c;
  letter-spacing: -0.21px;
  line-height: 20px;
  &::after {
    content: '';
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
  }
`;
const AnswerTitle = styled.div`
  width: 42px;
  font-family: PingFangSC-Medium;
  color: #7a593c;
`;
const AnswerConten = styled(ClearFix)`
  flex: 1;
  // word-break
  font-family: SourceHanSansCN-Normal;
  color: #000000;
  p:first-of-type {
    margin-top: 0;
  }
  p:last-of-type {
    margin-bottom: 0;
  }
  &.rightAnswer {
    padding-top: 2px;
  }
  display: block;
`;
const PaginationWrapper = styled(FlexCenter)`
  min-height: 40px;
  padding: 10px;
  margin-bottom: 10px;
`;
const ControlButtons = styled(FlexRowCenter)`
  position: absolute;
  padding: 0 20px;
  width: ${props => (props.hasChild && props.showChild ? 300 : 220)}px;
  height: 30px;
  bottom: ${props => (props.analysisShow ? 30 : 10)}px;
  right: 0;
  display: none;
`;
const HomeworkSkepMsg = styled.div`
  position: absolute;
  top: 30px;
  right: ${props => (props.relocate ? '-120px' : '4px')};
  width: 200px;
  height: auto;
  padding-top: 5px;
  background: transparent;
  display: none;
`;
const HomeworkSkepMsgBox = styled(FlexColumn)`
  width: 100%;
  min-height: 30px;
  padding: 0 15px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
`;
const TitleBox = styled(FlexRowCenter)`
  color: #666;
  height: 30px;
`;
const SkepTitleItem = styled.div`
  font-size: 14px;
  font-weight: 600;
  flex: 1;
`;
const SkepTitleItemTwo = styled(SkepTitleItem)`
  flex: 2;
`;
const SkepContent = styled(FlexColumn)`
  cursor: pointer;
`;
const HeadColumn = styled.div`
  font-size: 13px;
  color: #666666;
  flex: 1;
  //text-align:center;
`;
const HeadColumnTwo = styled(HeadColumn)`
  flex: 2;
`;
const HeadColumnTwoLight = styled(HeadColumnTwo)`
  color: #999999;
`;
const HeadColumnLight = styled(HeadColumn)`
  color: #999999;
`;
const BascketContentItem = styled(FlexRow)`
  min-height: 37px;
  // padding:0px 10px 0px 10px;
  align-items: center;
`;
const ContentWrapperTwo = styled(FlexColumn)`
  flex: 1;
  margin: 0 20px 20px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  box-shadow: rgba(233, 236, 244, 0.5) 0px 2px 4px 0px;
  overflow-y: auto;
  .ant-input-number-handler-wrap {
    display: none !important;
  }
`;
const EditorHomeworkHeader = styled(FlexColumn)`
  padding: 0 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
`;
const TopButtons = styled(FlexRowCenter)`
  padding: 0 20px;
  width: 100%;
  height: 30px;
`;
const EditorHomeworkValue = styled.div`
  font-size: 14px;
`;
const EditorHomeworkContent = styled(FlexColumn)`
  flex: 1;
  padding-top: 10px;
`;
const ImgWrap = styled(FlexColumn)`
  min-width: 15px;
  max-width: 15px;
  min-height: 15px;
  max-height: 15px;
  margin-left: 30px;
  cursor: pointer;
  align-self: center;
`;
const Img = styled.img`
  height: 100%;
  width: 100%;
  &:hover {
    content: ${props => `url(${props.imgsrc})`};
  }
`;
const OperDiv = styled(FlexRow)`
  justify-content: flex-end;
  align-items: center;
  min-height: 40px;
  max-height: 40px;
  position: absolute;
  right: 50px;
  bottom: 5px;
  z-index: 10;
`;
const BasicOneQuestionWrap = styled(questionItemCss)`
  flex: 1;
  width: 100%;
  margin: 10px 0;
  margin-bottom: 16px;
  padding: 12px;
  height: auto;
  font-size: 10.5pt;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
  &:hover {
    background-color: #f6f6f6;
    .operdiv {
      display: flex;
    }
  }
  line-height: 2em;
  color: #000;
  img {
    max-width: 350px;
    max-height: 400px;
  }
  border: 1px solid #ddd;
  .katex-html {
    background: transparent;
  }
  &:hover {
    background: #eee;
  }
  &:hover .buttons {
    display: flex;
  }
  zmblank {
    border: none;
  }
  img {
    vertical-align: middle;
  }
  ${listStyle}
`;
const OneQuestionWrap = styled(BasicOneQuestionWrap)`
  position: relative;
  padding: 16px 10px 50px;
  &:hover {
    .operdiv {
      visibility: visible;
    }
  }
`;
const NoDiv = styled.div`
  display: inline-block;
  vertical-align: top;
  line-height: 1.5;
  font-size: 14px;
`;
const ChooseGroup = styled.div`
  border: 1px solid #dddddd;
  position: relative;
  margintop: 10px;
  width: 100%;
  height: auto;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
  ${listStyle}
`;
const ChooseGroupHeader = styled(FlexRow)`
  font-size: 14px;
  min-height: 40px;
  margin: 0px 12px 0px 12px;
  align-items: center;
  &:hover {
    background: #fafafa;
    .headtool {
      display: flex;
    }
  }
  color: #333333;
  letter-spacing: -0.21px;
`;
const ChooseGroupHeaderNumTip = styled.span`
  font-size: 14px;
  color: #999999;
  letter-spacing: -0.21px;
  line-height: 19px;
`;
const ChooseGroupHeaderToolWrap = styled(FlexRow)`
  flex: auto;
  display: none;
  justify-content: flex-end;
  height: 40px;
  align-items: center;
`;
const BasicContentDiv = styled.div`
  display: inline-block;
  width: calc(100% - 22px);
  vertical-align: top;
  p {
    margin: 0;
  }
`;
const ContentDiv = styled(BasicContentDiv)`
  margin: 0px 0px 0px 0px;
  width: calc(100% - 32px);
`;
const ContentWrapperThree = styled(ContentWrapperTwo)``;
const ContentWrapperFour = styled(FlexCenter)`
  flex: 1;
  margin: 0 20px 20px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  box-shadow: rgba(233, 236, 244, 0.5) 0px 2px 4px 0px;
`;
const FinishHwBox = styled(FlexColumn)`
  text-align: center;
  font-size: 16px;
  color: #999;
`;
// const QuestionSearchMsg = styled(FlexRowCenter)`
//   margin-top: 10px;
//   height: 28px;
// `;
const EditorWrapper = styled(FlexColumn)`
  margin: 5px 16px 0;
  padding: 10px;
  border: 1px solid #ddd;
  background: ${props => (props.step === 2 ? '#fff' : '#FFFBF2')};
`;
const QuestionKnowledgeItem = styled(FlexRowCenter)``;
const QuestionKnowledgeStar = styled(FlexRowCenter)`
  margin-top: 10px;
`;
const QuestionKnowledgeTextArea = styled(FlexRow)`
  margin-top: 10px;
  align-items: flex-start;
`;
const PaperNameWrapper = styled(FlexRowCenter)`
  height: 50px;
`;
const MustInput = styled(FlexCenter)`
  width: 12px;
  height: 12px;
  font-size: 12px;
  color: red;
`;
const PaperMsgWrapper = styled(PaperNameWrapper)``;
const CountBox = styled(FlexRowCenter)`
  height: 30px;
  font-weight: 600;
  color: #666;
`;
const CutLine = styled.div`
  height: 1px;
  width: 100%;
  background: #ddd;
`;
const ChildreWrapper = styled.div`
  border: 1px solid #ddd;
  padding: 10px;
`;

export const backStepMsg = homeworkStep => {
  let res = '预览或保存';
  if (homeworkStep === 3) {
    res = '预览';
  } else if (homeworkStep === 4) {
    res = '保存';
  }
  // console.log(homeworkStep, res, 'res');
  return res;
};

export class CreateHomeWork extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.makeContent = this.makeContent.bind(this);
    this.onSelectTreeNode = this.onSelectTreeNode.bind(this);
    // this.makeTreeNode = this.makeTreeNode.bind(this);
    this.makeChoosePreViewQuestion = this.makeChoosePreViewQuestion.bind(this);
    this.setHomeworkSkep = this.setHomeworkSkep.bind(this);
    this.makeEditorChooseQuestion = this.makeEditorChooseQuestion.bind(this);
    this.setEditorPage = this.setEditorPage.bind(this);
    this.changeSelectedTypeAction = this.changeSelectedTypeAction.bind(this);
    this.changeSelectedHomeworkSubjectItem = this.changeSelectedHomeworkSubjectItem.bind(
      this,
    );
    this.setQuestionItemEditor = this.setQuestionItemEditor.bind(this);
    this.selectPaperOneMsg = this.selectPaperOneMsg.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.setHomeworkSkepForChild = this.setHomeworkSkepForChild.bind(this);
    this.pureState = {};
  }
  componentDidMount() {
    // this.props.dispatch(getKnowledgeTreeDataAction());
  }
  /**
   * 选中树状节点时
   * @param {array} selectedKeys 选中的项等级数组
   * @param {event} e antd-tree 的事件对象
   */
  onSelectTreeNode(value) {
    this.pageChange(1);
    setTimeout(() => {
      this.props.methods.changeSelectedTreeNode(
        fromJS({
          id: toNumber(value.key),
          name: value.label,
          idList: value.idList,
          path: value.path,
        }),
      );
    }, 30);
  }
  setHomeworkSkep(item) {
    this.props.dispatch(setHomeworkSkepAction(item));
    if (this.props.homeworkStep !== 1) {
      const allShowAnalysis = item.every(it => {
        return Boolean(it.get('showAnalysis'));
      });
      this.props.dispatch(changeShowAnalysisAction(allShowAnalysis));
    }
  }
  setQuestionItemEditor(item, type, val) {
    const homeworkSkep = this.props.homeworkSkep;
    if (type === 'paperName') {
      const newHomeworkSkep = homeworkSkep.set('name', item);
      this.setHomeworkSkep(newHomeworkSkep);
      return;
    }
    const newItem = item.set(type, val);
    const itemIndex = homeworkSkep.indexOf(item);
    const newHomeworkSkep = homeworkSkep.set(itemIndex, newItem);
    this.setHomeworkSkep(newHomeworkSkep);
  }
  makeChoosePreViewQuestion() {
    const { homeworkStep, searchBackQuestions, homeworkSkep } = this.props;
    const questionsList =
      homeworkStep === 1 ? searchBackQuestions.get('content') : homeworkSkep;
    // const homeworkSkep = homeworkSkep;
    // console.log(questionsList.toJS(), 'questionsList -- 666');
    if (!questionsList || questionsList.count() === 0) return '';
    return (
      <HomeworkInforContent>
        {(questionsList || fromJS([])).map((item, index) => {
          const hasChild =
            item.get('children') && item.get('children').count() > 0;
          const showAnalysis = item.get('showAnalysis');
          const showChild = item.get('showChild');
          const hasThisQuestion = homeworkSkep.some(
            it => it.get('id') === item.get('id'),
          );
          return (
            <QuestionInfoWrapper key={index} bgTransparent>
              <QuestionsCount>{`${index + 1}、`}</QuestionsCount>
              {/* <QuestionContent dangerouslySetInnerHTML={{ __html: item.toJS().questionEsDto.Content }} /> */}
              <QuestionContent
                dangerouslySetInnerHTML={{
                  __html: renderToKatex(item.get('title')),
                }}
              />
              <QuestionOptions>
                {item.get('optionList').count() > 0
                  ? (item.get('optionList') || fromJS([])).map((value, i) => (
                    <OptionsWrapper key={i}>
                      <OptionsOrder>{`${numberToLetter(i)}、`}</OptionsOrder>
                      <Options
                        dangerouslySetInnerHTML={{
                          __html: renderToKatex(value),
                        }}
                      />
                    </OptionsWrapper>
                    ))
                  : ''}
              </QuestionOptions>
              {!hasChild ? (
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
                    {item.get('optionList').count() > 0 ? (
                      <AnswerConten>
                        {(item.get('answerList') || fromJS([])).join('、')}
                      </AnswerConten>
                    ) : (
                      <FlexColumn style={{ flex: 1 }}>
                        {(item.get('answerList') || fromJS([])).map((it, i) => {
                          return (
                            <AnswerConten
                              key={i}
                              className={'rightAnswer'}
                              dangerouslySetInnerHTML={{
                                __html:
                                  renderToKatex(
                                    it.replace(/(【答案】)|(【解答】)/g, ''),
                                  ) || '',
                              }}
                            />
                          );
                        })}
                      </FlexColumn>
                    )}
                  </AnalysisItem>
                </AnalysisWrapper>
              ) : (
                ''
              )}
              {item.get('showChild') ? (
                <ChildreWrapper>
                  {item.get('children').map((it, i) => {
                    return (
                      <QuestionInfoWrapper bgTransparent key={i}>
                        <QuestionsCount>{`(${i + 1})、`}</QuestionsCount>
                        <QuestionContent
                          dangerouslySetInnerHTML={{
                            __html: renderToKatex(it.get('title') || ''),
                          }}
                        />
                        <QuestionOptions>
                          {it.get('typeId') === 2
                            ? fromJS(it.get('optionList') || []).map(
                                (value, ii) => (
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
                                ),
                              )
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
                            {it
                              .get('optionList')
                              .filter(iit => filterHtmlForm(iit))
                              .count() > 0 ? (
                                <AnswerConten>
                                  {(it.get('answerList') || fromJS([])).join(
                                  '、',
                                )}
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
              <p
                style={{
                  color: '#666',
                  fontFamily: 'Microsoft YaHei',
                  marginTop: 5,
                }}
              >
                题目id: {item.get('id')}
              </p>
              <ControlButtons
                analysisShow={showAnalysis}
                hasChild={hasChild}
                showChild={showChild}
                className="buttons"
              >
                {hasChild ? (
                  <Button
                    type={showChild ? 'default' : 'primary'}
                    onClick={() => {
                      // console.log('查看子题');
                      switch (homeworkStep) {
                        case 1:
                          const newQuestionsList = questionsList.setIn(
                            [index, 'showChild'],
                            !showChild,
                          );
                          const newSearchBackQuestions = searchBackQuestions.set(
                            'content',
                            newQuestionsList,
                          );
                          this.props.dispatch(
                            setSearchBackQuestionsAction(
                              newSearchBackQuestions,
                            ),
                          );
                          break;
                        case 3:
                          const newHomeworkSkep = homeworkSkep.setIn(
                            [index, 'showChild'],
                            !showChild,
                          );
                          this.props.dispatch(
                            setHomeworkSkepAction(newHomeworkSkep),
                          );
                          // this.changeCreateHomeworkStepParams(newHomeworkSkep, 'homeworkSkep');
                          break;
                        default:
                          break;
                      }
                    }}
                  >
                    {showChild ? '隐藏子题' : '查看子题'}
                  </Button>
                ) : (
                  ''
                )}
                <PlaceHolderBox />
                {!hasChild || showChild ? (
                  <Button
                    type={showChild ? 'default' : 'primary'}
                    onClick={() => {
                      // console.log(homeworkStep, 'homeworkStep');
                      const newShowAnalysis = !showAnalysis;
                      const newItem = item.set('showAnalysis', newShowAnalysis);
                      const newQuestionsList = questionsList.set(
                        index,
                        newItem,
                      );
                      const newSearchBackQuestions = this.props.searchBackQuestions.set(
                        'content',
                        newQuestionsList,
                      );
                      this.props.dispatch(
                        setSearchBackQuestionsAction(newSearchBackQuestions),
                      );
                      setTimeout(() => {
                        const allShowAnlysis = this.props.searchBackQuestions
                          .get('content')
                          .every(it => it.get('showAnalysis'));
                        if (allShowAnlysis) {
                          this.props.dispatch(changeShowAnalysisAction(true));
                        } else {
                          this.props.dispatch(changeShowAnalysisAction(false));
                        }
                      }, 30);
                    }}
                  >
                    {showAnalysis ? '隐藏解析' : '查看解析'}
                  </Button>
                ) : (
                  ''
                )}
                <PlaceHolderBox />
                <Button
                  type={hasThisQuestion ? 'default' : 'primary'}
                  onClick={() => {
                    if (hasThisQuestion) {
                      const questionFilter = homeworkSkep.filter(
                        it => it.get('id') === item.get('id'),
                      );
                      const itemIndex = homeworkSkep.indexOf(
                        questionFilter.get(0),
                      );
                      const newHomeworkSkep = homeworkSkep.delete(itemIndex);
                      this.setHomeworkSkep(newHomeworkSkep);
                    } else {
                      let newHomeworkSkep = homeworkSkep;
                      if (
                        !newHomeworkSkep.some(
                          it => it.get('id') === item.get('id'),
                        )
                      ) {
                        const itemChildren = item.get('children');
                        if (itemChildren && itemChildren.count() > 0) {
                          const newIitemChildren = itemChildren.map(itt =>
                            itt.set('score', 3),
                          );
                          const newItem = item
                            .set('showAnalysis', false)
                            .set('showChild', true)
                            .set('score', newIitemChildren.count() * 3)
                            .set('children', newIitemChildren);
                          newHomeworkSkep = newHomeworkSkep.push(newItem);
                        } else {
                          newHomeworkSkep = homeworkSkep
                            .push(
                              item
                                .set('showAnalysis', false)
                                .set('score', 3)
                                .set('showChild', false),
                            )
                            .sortBy(value => value.get('typeId'));
                        }
                        this.props.dispatch(
                          setHomeworkSkepAction(newHomeworkSkep),
                        );
                      }
                    }
                  }}
                >{`${hasThisQuestion ? '移出' : '加入'}作业篮`}</Button>
              </ControlButtons>
            </QuestionInfoWrapper>
          );
        })}
      </HomeworkInforContent>
    );
  }
  setEditorPage(items, type, value, flag) {
    // console.log(items, type, value, flag, 'items, type, value, flag - setEditorPage');
    let newHomeworkSkep = this.props.homeworkSkep;
    if (type === 'delete') {
      // eslint-disable-next-line array-callback-return
      items.map(item => {
        const itemIndex = newHomeworkSkep.indexOf(item);
        newHomeworkSkep = newHomeworkSkep.delete(itemIndex);
      });
      if (newHomeworkSkep.count() <= 0) {
        message.warn('作业中至少得有一道题目，若要清空，请至选题阶段删除。');
        return;
      }
    } else if (type === 'up') {
      items.forEach(item => {
        const itemIndex = newHomeworkSkep.indexOf(item);
        const preIndex = newHomeworkSkep.indexOf(value);
        newHomeworkSkep = newHomeworkSkep
          .splice(itemIndex, 1)
          .splice(preIndex, 0, item);
      });
    } else if (type === 'down') {
      // console.log(items.toJS(), 'items');
      items.forEach(item => {
        const itemIndex = newHomeworkSkep.indexOf(item);
        const preIndex = newHomeworkSkep.indexOf(value);
        newHomeworkSkep = newHomeworkSkep
          .splice(preIndex + 1, 0, item)
          .splice(itemIndex, 1);
      });
    } else {
      items.forEach(item => {
        let newItem = item;
        if (['showAnalysis', 'showChild'].indexOf(type) > -1) {
          newItem = item.set(type, !item.get(type));
        } else if (type === 'score') {
          if (flag === 'lotSet') {
            const itemChild = item.get('children');
            if (!itemChild || itemChild.count() <= 0) {
              newItem = item.set(type, value);
            }
          } else {
            newItem = item.set(type, value);
          }
        }
        const itemIndex = newHomeworkSkep.indexOf(item);
        newHomeworkSkep = newHomeworkSkep.set(itemIndex, newItem);
      });
    }
    this.setHomeworkSkep(newHomeworkSkep);
  }
  setHomeworkSkepForChild(items, i, type, value) {
    const { homeworkSkep } = this.props;
    // const homeworkSkep = createHomeworkStepParams.get('homeworkSkep') || fromJS([]);
    let newHomeworkSkep = homeworkSkep;
    if (type === 'score') {
      const itemIndex = newHomeworkSkep.indexOf(items);
      let newItem = items.setIn(['children', i, type], value);
      const itemChildren = newItem.get('children');
      newItem = newItem.set(
        type,
        itemChildren.map(it => it.get(type)).reduce((a, b) => a + b),
      );
      newHomeworkSkep = newHomeworkSkep.set(itemIndex, newItem);
    }
    this.props.dispatch(setHomeworkSkepAction(newHomeworkSkep));
  }
  verifyEditor(wantedStep) {
    const homeworkSkep = this.props.homeworkSkep;
    const errMsg = [];
    const testPaperOnepaperMsg = this.props.testPaperOnepaperMsg;
    if (!testPaperOnepaperMsg.get('name')) {
      errMsg.push({ type: '试卷名称', index: -1 });
    }
    if (this.props.homeworkType === 0) {
      // console.log(homeworkSkep.toJS(), 'homeworkSkep');
      homeworkSkep.forEach((item, index) => {
        if (!item.get('name')) {
          errMsg.push({ type: '知识点', index });
        } else if (!item.get('starLevel') || item.get('starLevel') <= 0) {
          errMsg.push({ type: '考试频率', index });
        } else if (
          !(item.get('rightEstimate') || '').replace(/\s|\t/g, '') ||
          !(item.get('wrongEstimate') || '').replace(/\s|\t/g, '')
        ) {
          errMsg.push({ type: '建议与评价', index });
        }
      });
    }
    if (errMsg.length > 0) {
      const msg = errMsg[0];
      if (msg.index === -1) {
        message.warning(`${msg.type} 未填写，请确认填写后再操作！`);
      } else {
        message.warning(
          `第 ${msg.index + 1} 题 ${msg.type} 未完成填写，请确认填写后再操作！`,
        );
      }
    } else if (wantedStep === 3) {
      this.props.methods.changeCreateHomeworkStep(3);
    } else if (wantedStep === 4) {
      this.props.dispatch(changeIsSubmitAction(true));
      this.props.dispatch(submitHomeworkAction());
    }
  }
  makeEditorChooseQuestion() {
    const { homeworkSkep, homeworkType } = this.props;
    const starArr = new Array(5).fill('');
    const skepGroup = homeworkSkep
      .groupBy(value => value.get('questionType'))
      .entrySeq();
    return skepGroup.map(([key, value], index) => {
      const defaultAllScore = value.get('score');
      const notLotSet = homeworkSkep
        .filter(it => it.get('questionType') === key)
        .every(it => it.get('children') && it.get('children').count() > 0);
      // console.log(defaultAllScore, 'defaultAllScore -- defaultAllScore -- 938');
      return (
        <ChooseGroup key={index}>
          <ChooseGroupHeader>
            {`${numberToChinese(index + 1)}、${key}`}
            <ChooseGroupHeaderNumTip>
              （共{value.count()}小题）
            </ChooseGroupHeaderNumTip>
            {this.props.homeworkStep === 2 && skepGroup.count() > 1 ? (
              <ChooseGroupHeaderToolWrap className={'headtool'}>
                {homeworkType !== 0 ? (
                  <FlexRowCenter>
                    <div style={{ minWidth: 70 }}>批量设置分数：</div>
                    <InputNumber
                      disabled={notLotSet}
                      min={0.5}
                      max={100}
                      step={0.5}
                      type="number"
                      defaultValue={defaultAllScore || 3}
                      onChange={val => {
                        this.setEditorPage(value, 'score', val, 'lotSet');
                      }}
                    />
                  </FlexRowCenter>
                ) : (
                  ''
                )}
                <ImgWrap>
                  <Img
                    src={viewresolutionimg}
                    imgsrc={viewresolutionimghover}
                    onClick={() => {
                      // this.showEditorPageAnalysis(value);
                      this.setEditorPage(value, 'showAnalysis');
                    }}
                    alt="查看解析"
                    title="查看解析"
                  />
                </ImgWrap>
                <ImgWrap>
                  <Img
                    src={deleteimg}
                    onClick={() => {
                      this.setEditorPage(value, 'delete');
                    }}
                    imgsrc={deleteimghover}
                    alt="删除"
                    title="删除"
                  />
                </ImgWrap>
                <ImgWrap>
                  <Img
                    src={moveimg}
                    imgsrc={moveimghover}
                    onClick={() => {
                      if (index > 0) {
                        const preValue = skepGroup.get(index - 1)[1];
                        this.setEditorPage(value, 'up', preValue.get(0));
                      }
                    }}
                    alt="上移"
                    title="上移"
                  />
                </ImgWrap>
                <ImgWrap>
                  <Img
                    src={downimg}
                    imgsrc={downimghover}
                    onClick={() => {
                      if (index < skepGroup.size - 1) {
                        const nextValue = skepGroup.get(index + 1)[1];
                        this.setEditorPage(
                          value,
                          'down',
                          nextValue.get(nextValue.count() - 1),
                        );
                      }
                    }}
                    alt="下移"
                    title="下移"
                  />
                </ImgWrap>
              </ChooseGroupHeaderToolWrap>
            ) : (
              ''
            )}
          </ChooseGroupHeader>
          {value.map((item, ix) => {
            const hasChild =
              item.get('children') && item.get('children').count() > 0;
            const showAnalysis = item.get('showAnalysis');
            const showChild = item.get('showChild');
            return (
              <OneQuestionWrap key={ix}>
                <NoDiv>{`${ix + 1}.`}</NoDiv>
                <ContentDiv
                  dangerouslySetInnerHTML={{
                    __html: renderToKatex(item.get('title') || ''),
                  }}
                />
                <QuestionOptions>
                  {item
                    .get('optionList')
                    .filter(it => filterHtmlForm(it))
                    .count() > 0
                    ? (item.get('optionList') || fromJS([])).map((iit, ii) => (
                      <OptionsWrapper key={ii}>
                        <OptionsOrder>{`${numberToLetter(
                            ii,
                          )}、`}</OptionsOrder>
                        <Options
                          dangerouslySetInnerHTML={{
                            __html: renderToKatex(iit),
                          }}
                        />
                      </OptionsWrapper>
                      ))
                    : ''}
                </QuestionOptions>
                {!hasChild ? (
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
                      {item
                        .get('optionList')
                        .filter(iit => filterHtmlForm(iit))
                        .count() > 0 ? (
                          <AnswerConten>
                            {(item.get('answerList') || fromJS([])).join('、')}
                          </AnswerConten>
                      ) : (
                        <FlexColumn style={{ flex: 1 }}>
                          {(item.get('answerList') || fromJS([])).map(
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
                ) : (
                  ''
                )}
                {hasChild && item.get('showChild') ? (
                  <ChildreWrapper>
                    {item.get('children').map((it, i) => {
                      return (
                        <QuestionInfoWrapper
                          bgTransparent
                          style={{ paddingBottom: 50 }}
                          key={i}
                        >
                          <QuestionsCount>{`(${i + 1})、`}</QuestionsCount>
                          <QuestionContent
                            dangerouslySetInnerHTML={{
                              __html: renderToKatex(it.get('title') || ''),
                            }}
                          />
                          <QuestionOptions>
                            {it.get('typeId') === 2
                              ? fromJS(it.get('optionList') || []).map(
                                  (iit, ii) => (
                                    <OptionsWrapper key={ii}>
                                      <OptionsOrder>{`${numberToLetter(
                                        ii,
                                      )}、`}</OptionsOrder>
                                      <Options
                                        dangerouslySetInnerHTML={{
                                          __html: renderToKatex(iit),
                                        }}
                                      />
                                    </OptionsWrapper>
                                  ),
                                )
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
                              {it
                                .get('optionList')
                                .filter(iit => filterHtmlForm(iit))
                                .count() > 0 ? (
                                  <AnswerConten>
                                    {(it.get('answerList') || fromJS([])).join(
                                    '、',
                                  )}
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
                          <OperDiv className={'operdiv'}>
                            <FlexRowCenter>
                              <div style={{ minWidth: 70 }}>设置分数：</div>
                              <InputNumber
                                min={0.5}
                                max={100}
                                step={0.5}
                                type="number"
                                value={it.get('score')}
                                onChange={val => {
                                  this.setHomeworkSkepForChild(
                                    item,
                                    i,
                                    'score',
                                    val,
                                  );
                                }}
                              />
                            </FlexRowCenter>
                          </OperDiv>
                        </QuestionInfoWrapper>
                      );
                    })}
                  </ChildreWrapper>
                ) : (
                  ''
                )}
                {/* 只有在制作测评课前练习时才显示 */}
                {this.props.homeworkStep === 2 && homeworkType === 0 ? (
                  <EditorWrapper step={this.props.homeworkStep}>
                    <QuestionKnowledgeItem>
                      <TextValue style={{ minWidth: 60 }}>知识点：</TextValue>
                      <Input
                        value={item.get('name')}
                        onChange={e => {
                          let val = e.target.value;
                          // console.log(toString(e.target.value).length);
                          if (toString(val).length > 100) {
                            message.error('知识点内容最多为 100 个字！');
                            val = val.slice(0, 100);
                          }
                          this.setQuestionItemEditor(item, 'name', val);
                        }}
                      />
                    </QuestionKnowledgeItem>
                    <QuestionKnowledgeStar>
                      <TextValue style={{ width: 80 }}>考试频率：</TextValue>
                      {starArr.map((val, iix) => {
                        return (
                          <Icon
                            key={iix}
                            type="star"
                            style={{
                              color:
                                iix < item.get('starLevel')
                                  ? '#ff6c78'
                                  : '#ddd',
                              marginRight: 5,
                              cursor: 'pointer',
                            }}
                            onClick={() =>
                              this.setQuestionItemEditor(
                                item,
                                'starLevel',
                                iix + 1,
                              )
                            }
                          />
                        );
                      })}
                    </QuestionKnowledgeStar>
                    <QuestionKnowledgeTextArea>
                      <TextValue style={{ minWidth: 184 }}>
                        建议与评价（做对的评价）：
                      </TextValue>
                      <TextArea
                        rows={4}
                        value={item.get('rightEstimate')}
                        onChange={e => {
                          let val = e.target.value;
                          if (toString(val).length > 200) {
                            message.error('评价内容最多为 200 个字！');
                            val = val.slice(0, 200);
                          }
                          this.setQuestionItemEditor(
                            item,
                            'rightEstimate',
                            val,
                          );
                        }}
                      />
                    </QuestionKnowledgeTextArea>
                    <QuestionKnowledgeTextArea>
                      <TextValue style={{ minWidth: 184 }}>
                        建议与评价（做错的评价）：
                      </TextValue>
                      <TextArea
                        rows={4}
                        value={item.get('wrongEstimate')}
                        onChange={e => {
                          let val = e.target.value;
                          if (toString(val).length > 200) {
                            message.error('评价内容最多为 200 个字！');
                            val = val.slice(0, 200);
                          }
                          this.setQuestionItemEditor(
                            item,
                            'wrongEstimate',
                            val,
                          );
                        }}
                      />
                    </QuestionKnowledgeTextArea>
                  </EditorWrapper>
                ) : (
                  ''
                )}
                {this.props.homeworkStep === 3 && homeworkType === 0 ? (
                  <EditorWrapper>
                    <QuestionKnowledgeItem>
                      <TextValue style={{ minWidth: 60, color: '#B8A490' }}>
                        知识点：
                      </TextValue>
                      <TextValue
                        dangerouslySetInnerHTML={{ __html: item.get('name') }}
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
                              color:
                                iix < item.get('starLevel')
                                  ? '#ff6c78'
                                  : '#ddd',
                              marginRight: 5,
                              cursor: 'pointer',
                            }}
                          />
                        );
                      })}
                    </QuestionKnowledgeStar>
                    <QuestionKnowledgeTextArea>
                      <TextValue style={{ minWidth: 180, color: '#B8A490' }}>
                        建议与评价（做对的评价）：
                      </TextValue>
                      <TextValue
                        dangerouslySetInnerHTML={{
                          __html: item.get('rightEstimate'),
                        }}
                      />
                    </QuestionKnowledgeTextArea>
                    <QuestionKnowledgeTextArea>
                      <TextValue style={{ minWidth: 180, color: '#B8A490' }}>
                        建议与评价（做错的评价）
                      </TextValue>
                      <TextValue
                        dangerouslySetInnerHTML={{
                          __html: item.get('wrongEstimate'),
                        }}
                      />
                    </QuestionKnowledgeTextArea>
                  </EditorWrapper>
                ) : (
                  ''
                )}
                {/* <p style={{ color: '#666', fontFamily: 'Microsoft YaHei', marginTop: 5,  }}>题目id: {item.get('id')}</p> */}
                <span
                  style={{
                    color: '#666',
                    fontFamily: 'Microsoft YaHei',
                    marginTop: 5,
                  }}
                >
                  题目id: {item.get('id')}
                </span>
                {this.props.homeworkStep === 2 ? (
                  <OperDiv className={'operdiv'}>
                    {homeworkType !== 0 ? (
                      <FlexRowCenter>
                        <div style={{ minWidth: 70 }}>
                          {hasChild ? '本题' : '设置'}分数：
                        </div>
                        <InputNumber
                          disabled={hasChild}
                          min={0.5}
                          max={100}
                          step={0.5}
                          type="number"
                          value={item.get('score')}
                          onChange={val => {
                            this.setEditorPage([item], 'score', val);
                          }}
                        />
                      </FlexRowCenter>
                    ) : (
                      ''
                    )}
                    {hasChild ? (
                      <ImgWrap
                        style={{
                          maxWidth: 60,
                          color: 'blue',
                          textDecoration: 'underLine',
                        }}
                        onClick={() => {
                          this.setEditorPage([item], 'showChild');
                        }}
                      >
                        {showChild ? '收起子题' : '查看子题'}
                      </ImgWrap>
                    ) : (
                      ''
                    )}
                    <ImgWrap>
                      <Img
                        src={viewresolutionimg}
                        onClick={() => {
                          this.setEditorPage([item], 'showAnalysis');
                        }}
                        imgsrc={viewresolutionimghover}
                        alt="查看解析"
                        title="查看解析"
                      />
                    </ImgWrap>
                    <ImgWrap>
                      <Img
                        src={deleteimg}
                        onClick={() => {
                          this.setEditorPage([item], 'delete');
                        }}
                        imgsrc={deleteimghover}
                        alt="删除"
                        title="删除"
                      />
                    </ImgWrap>
                    <ImgWrap>
                      <Img
                        src={moveimg}
                        onClick={() => {
                          const count = value.count();
                          if (count > 1 && ix > 0) {
                            this.setEditorPage([item], 'up', value.get(ix - 1));
                          }
                        }}
                        imgsrc={moveimghover}
                        alt="上移"
                        title="上移"
                      />
                    </ImgWrap>
                    <ImgWrap>
                      <Img
                        src={downimg}
                        onClick={() => {
                          const count = value.count();
                          if (count > 1 && ix < count - 1) {
                            this.setEditorPage([item], 'up', value.get(ix + 1));
                          }
                        }}
                        imgsrc={downimghover}
                        alt="下移"
                        title="下移"
                      />
                    </ImgWrap>
                  </OperDiv>
                ) : (
                  ''
                )}
              </OneQuestionWrap>
            );
          })}
        </ChooseGroup>
      );
    });
  }
  changeSelectedTypeAction(value) {
    this.props.dispatch(
      changeSelectedTypeAction(
        fromJS({ id: toNumber(value) }),
      ),
    );
    setTimeout(() => {
      // console.log(this.props.selectedType.toJS(), 'value -- 866');
      if (this.props.selectedType.get('id') === 0) {
        this.props.dispatch(getKnowledgeTreeDataAction());
      } else {
        // console.log('to get versionList start');
        // this.props.dispatch(getVersionListAction());
      }
    }, 30);
  }
  changeSelectedHomeworkSubjectItem(value) {
    // console.log(this.props.selectedType.toJS(), 'value -- 877');
    this.props.dispatch(
      changeSelectedHomeworkSubjectItemAction(
        fromJS({ id: toNumber(value.key), name: value.label }),
      ),
    );
    setTimeout(() => {
      if (this.props.selectedType.get('id') === 0) {
        //
      } else {
        this.props.dispatch(getVersionListAction());
      }
    }, 30);
  }
  selectPaperOneMsg(value, type) {
    // console.log(value, 'value -- 1002');
    const newItem = fromJS({ id: toNumber(value.key), name: value.label });
    switch (type) {
      case 1:
        this.props.dispatch(changeSelectedPhaseAction(newItem));
        break;
      case 2:
        this.props.dispatch(changeSelectedGradeAction(newItem));
        break;
      case 3:
        this.props.dispatch(changeSelectedSubjectAction(newItem));
        break;
      case 4:
        this.props.dispatch(changeSelectKnowledgeItemAction(newItem));
        break;
      default:
        break;
    }
  }
  pageChange(page, pageSize) {
    // console.log(page, pageSize);
    this.props.dispatch(changePageIndexAction(page));
  }

  handleValueChange = (data) => {
    const { searchParams } = this.props;
    const { gradeId, subjectId, knowledge } = data;
    this.clearQuestions();
    if (gradeId) {
      this.pureState.gradeId = gradeId;
      this.props.dispatch(
        setSearchParamsAction(searchParams.set(
          'grade',
          fromJS({ id: gradeId }),
        )),
      );
    }
    if (subjectId) {
      this.pureState.subjectId = subjectId;
    }
    if (knowledge) {
      if (knowledge.length === 0) message.warning('未选择知识点或选择的教材目录无知识点');
      this.props.methods.changeSelectedTreeNode(
        fromJS({
          idList: knowledge,
        }),
      );
    }
  }

  handleTypeChange = async sliderState => {
    const {
      homeworksubjectlist,
      searchParams,
      dispatch
    } = this.props;

    if (sliderState === '0') {
      const { gradeId, subjectId } = this.pureState;
      const value = await server.getParseSubject(gradeId, subjectId);
      if (value) {
        const newPhaseSubject = homeworksubjectlist.find(
          item => item.get('id') === toNumber(value),
        );
        dispatch(
          changeSelectedHomeworkSubjectItemAction(newPhaseSubject),
        );
        this.pageChange(1);
        setTimeout(() => {
          dispatch(getQuestionTypeList());
          dispatch(getKnowledgeTreeDataAction());
        }, 30);
      }
    } else {
      const parseSubjectId = this.props.selectedSubjectItem.get('id');
      const { gradeId, subjectId } = await server.getFirstGradeSubject(parseSubjectId);
      this.pureState.gradeId = gradeId;
      this.pureState.subjectId = subjectId;
      this.props.dispatch(
        setSearchParamsAction(searchParams.set(
          'grade',
          fromJS({ id: gradeId }),
        )),
      );
    }
    this.clearQuestions();
    dispatch(
      changeSelectedTypeAction(
        fromJS({ id: toNumber(sliderState) }),
      ),
    );
  }

  clearQuestions = () => {
    const { searchBackQuestions, dispatch } = this.props;

    dispatch(
      setSearchBackQuestionsAction(
        searchBackQuestions
          .set('content', fromJS([]))
          .set('totalElements', 0)
      ),
    );
    this.props.methods.changeSelectedTreeNode(
      fromJS({
        idList: [],
      }),
    );
  }

  // eslint-disable-next-line complexity
  makeContent() {
    const {
      knowledgeListIsLoading,
      knowledgeTreeDataList,
      homeworksubjectlist,
      searchParams,
    } = this.props;
    const { gradeId, subjectId } = this.pureState;
    let res = '';
    const questionCount =
      this.props.searchBackQuestions.get('totalElements') || 0;
    const questionsList = this.props.searchBackQuestions.get('content');
    const homeworkSkep = this.props.homeworkSkep;
    const skepCountGreaterThan0 = homeworkSkep.count() > 0;
    const selectedTypeId = this.props.selectedType.get('id');
    const homeworkType = this.props.homeworkType;
    const methods = this.props.methods || {};
    // console.log(this.props.selectedTreeNode.toJS(), 'this.props.selectedTreeNode');
    switch (this.props.homeworkStep) {
      case 1:
        res = (
          <ContentWrapper>
            <LeftWrapper>
              <Select value={`${selectedTypeId}`} style={{ width: '100%', marginTop: 10 }} onChange={this.handleTypeChange}>
                <Option value="0">根据知识点选题</Option>
                <Option value="1">根据教材章节选题</Option>
              </Select>
              {selectedTypeId <= 0 &&
                <Select
                  labelInValue
                  value={{
                    key: toString(this.props.selectedSubjectItem.get('id')),
                    label: this.props.selectedSubjectItem.get('name'),
                  }}
                  style={{ width: '100%', marginTop: 10 }}
                  onChange={value => {
                    const newPhaseSubject = homeworksubjectlist.find(
                      item => item.get('id') === toNumber(value.key),
                    );
                    this.props.dispatch(
                      changeSelectedHomeworkSubjectItemAction(newPhaseSubject),
                    );
                    this.pageChange(1);
                    setTimeout(() => {
                      this.props.dispatch(getQuestionTypeList());
                      this.props.dispatch(getKnowledgeTreeDataAction());
                    }, 30);
                  }}
                >
                  {this.props.homeworksubjectlist.map((item, index) => {
                    return (
                      <Select.Option
                        key={index}
                        value={toString(item.get('id'))}
                      >
                        {item.get('name')}
                      </Select.Option>
                    );
                  })}
                </Select>
              }
              {selectedTypeId <= 0 && <TreeWrapper>
                {knowledgeListIsLoading ? (
                  <FlexCenter>{RunLoading()}</FlexCenter>
                ) : (
                  <div>
                    {knowledgeTreeDataList.count() > 0 ? (
                      <HomeworkTree
                        selectTree={this.props.selectedTreeNode}
                        treeList={knowledgeTreeDataList}
                        onSelect={this.onSelectTreeNode}
                        soucre="testhomework"
                      />
                    ) : (
                      <FlexCenter
                        style={{ flex: 1, height: '100%', width: '100%' }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <img
                            role="presentation"
                            src={emptyImg}
                            style={{ width: 100 }}
                          />
                          <h5 style={{ color: '#999', textAlign: 'center' }}>
                            没有找到相关知识点哦
                          </h5>
                        </div>
                      </FlexCenter>
                    )}
                  </div>
                )}
              </TreeWrapper>}
              {selectedTypeId === 1 && <TextEditionSlider
                gradeId={gradeId}
                subjectId={subjectId}
                autoSelect={false}
                onValueChange={this.handleValueChange}
              />}
            </LeftWrapper>
            <RightWrapper>
              <SearchWrapper>
                {/* <SearchBox>
                <InputBox placeholder="请输入..." onInput={(e) => this.props.dispatch(changekeywordAction(e.target.value))}></InputBox>
                <SearchImg></SearchImg>
              </SearchBox> */}
                <PlaceHolderBox />
                <HomeworkSkep>
                  <span>作业篮</span>
                  <HomeworkSkepMsg
                    className="homeworkSkepMsg"
                    relocate={skepCountGreaterThan0}
                  >
                    <HomeworkSkepMsgBox>
                      <TitleBox>
                        <SkepTitleItemTwo>已选题目</SkepTitleItemTwo>
                        <SkepTitleItem>数量</SkepTitleItem>
                        <SkepTitleItem>操作</SkepTitleItem>
                      </TitleBox>
                      <SkepContent>
                        {homeworkSkep
                          .groupBy(value => value.get('questionType'))
                          .entrySeq()
                          .map(([key, value], index) => (
                            <BascketContentItem key={index}>
                              <HeadColumnTwoLight>{key}</HeadColumnTwoLight>
                              <HeadColumn style={{ textAlign: 'center' }}>
                                {value.count()}
                              </HeadColumn>
                              <HeadColumnLight
                                onClick={() => {
                                  const newHomeworkSkep = homeworkSkep.filter(
                                    item => value.indexOf(item) === -1,
                                  );
                                  this.setHomeworkSkep(
                                    newHomeworkSkep.sortBy(val =>
                                      val.get('questionType'),
                                    ),
                                  );
                                }}
                              >
                                清除
                              </HeadColumnLight>
                            </BascketContentItem>
                          ))}
                        {homeworkSkep.count() > 0 ? (
                          <CountBox>
                            <HeadColumnTwoLight>合计</HeadColumnTwoLight>
                            <HeadColumn style={{ textAlign: 'center' }}>
                              {homeworkSkep.count()}
                            </HeadColumn>
                            <HeadColumnLight />
                          </CountBox>
                        ) : (
                          ''
                        )}
                      </SkepContent>
                    </HomeworkSkepMsgBox>
                  </HomeworkSkepMsg>
                </HomeworkSkep>
                <HomeworkSkep
                  style={{ display: skepCountGreaterThan0 ? 'flex' : 'none' }}
                  onClick={() => {
                    const newHomeworkSkep = homeworkSkep.map(it =>
                      it.set('score', 3).set('showAnalysis', false),
                    );
                    this.setHomeworkSkep(newHomeworkSkep);
                    setTimeout(() => {
                      methods.changeCreateHomeworkStep(2);
                      this.props.dispatch(changeShowAnalysisAction(false));
                    }, 30);
                  }}
                >
                  <span>编辑作业信息</span>
                </HomeworkSkep>
              </SearchWrapper>
              <QuestionFilterWrapper>
                <QuestionSearchData
                  source="TestHomeWork"
                  whoseShow={[
                    'area',
                    selectedTypeId === 1 ? '' : 'grade',
                    'year',
                    'term',
                    'paperType',
                    'examType',
                    'questionType',
                    'difficulty',
                    'knowledgeType',
                    'input',
                    'id',
                    'search',
                  ]}
                  searchStyle={{
                    wrapper: { width: '100%' },
                    item: { height: 35 },
                  }}
                  selectType={searchParams.toJS()}
                  searchDate={{
                    placeholder: '请输入关键字',
                    inputName: '关键字',
                    id: '题目id',
                  }}
                  changeSelect={(value, type) => {
                    if (type === 'search') {
                      this.pageChange(1);
                      setTimeout(() => {
                        this.props.dispatch(searchQuestionListAction());
                      }, 30);
                    } else {
                      let newSearchParams = searchParams.set(
                        type,
                        fromJS(value),
                      );
                      if (type === 'province') {
                        newSearchParams = newSearchParams
                          .set('city', fromJS({ id: -1, name: '市' }))
                          .set('county', fromJS({ id: -1, name: '县' }));
                      } else if (type === 'city') {
                        newSearchParams = newSearchParams.set(
                          'county',
                          fromJS({ id: -1, name: '县' }),
                        );
                      }
                      this.props.dispatch(
                        setSearchParamsAction(newSearchParams),
                      );
                    }
                  }}
                />
              </QuestionFilterWrapper>
              <ControlWrapper>
                <FilterQuestionNumber>{`共有符合条件的题目${questionCount}个`}</FilterQuestionNumber>
                <PlaceHolderBox />
                <SeeAnalysisWrapper
                  onClick={() => {
                    const newShowAnalysis = !this.props.showAnalysis;
                    const newQuestionsList = questionsList.map(item => {
                      return item.set('showAnalysis', newShowAnalysis);
                    });
                    const newSearchBackQuestions = this.props.searchBackQuestions.set(
                      'content',
                      newQuestionsList,
                    );
                    this.props.dispatch(
                      setSearchBackQuestionsAction(newSearchBackQuestions),
                    );
                    this.props.dispatch(
                      changeShowAnalysisAction(newShowAnalysis),
                    );
                  }}
                >
                  <ClickBox selected={this.props.showAnalysis} />
                  <SeeAnalysisValue>显示答案与解析</SeeAnalysisValue>
                </SeeAnalysisWrapper>
                <AddAllQuestionWrappper>
                  <Button
                    size="large"
                    onClick={() => {
                      let newHomeworkSkep = fromJS([]);
                      questionsList.forEach(item => {
                        if (
                          !homeworkSkep.some(
                            it => it.get('id') === item.get('id'),
                          )
                        ) {
                          const itemChildren = item.get('children');
                          if (itemChildren && itemChildren.count() > 0) {
                            const newIitemChildren = itemChildren.map(itt =>
                              itt.set('score', 3),
                            );
                            const newItem = item
                              .set('showAnalysis', false)
                              .set('showChild', true)
                              .set('score', newIitemChildren.count() * 3)
                              .set('children', newIitemChildren);
                            newHomeworkSkep = newHomeworkSkep.push(newItem);
                          } else {
                            newHomeworkSkep = newHomeworkSkep.push(
                              item
                                .set('showAnalysis', false)
                                .set('score', 3)
                                .set('showChild', false),
                            );
                          }
                        }
                      });
                      this.props.dispatch(
                        setHomeworkSkepAction(
                          homeworkSkep
                            .concat(newHomeworkSkep)
                            .sortBy(it => it.get('typeId')),
                        ),
                      );
                    }}
                  >
                    本页全部加入
                  </Button>
                </AddAllQuestionWrappper>
              </ControlWrapper>
              {this.props.questionListLoadingOver ? (
                <QuestionListWrapper>
                  {questionCount > 0 ? (
                    this.makeChoosePreViewQuestion()
                  ) : (
                    <FlexCenter style={{ flex: 1 }}>
                      <div>
                        <img role="presentation" src={emptyImg} />
                        <h2 style={{ color: '#999', textAlign: 'center' }}>
                          这里空空如也！
                        </h2>
                      </div>
                    </FlexCenter>
                  )}
                  {questionCount > this.props.pageSize ? (
                    <PaginationWrapper>
                      <Pagination
                        defaultCurrent={1}
                        total={questionCount}
                        current={this.props.currentPage}
                        defaultPageSize={this.props.pageSize}
                        onChange={(page, pageSize) => {
                          this.pageChange(page, pageSize);
                          setTimeout(() => {
                            this.props.dispatch(searchQuestionListAction());
                          }, 30);
                        }}
                      />
                    </PaginationWrapper>
                  ) : (
                    ''
                  )}
                </QuestionListWrapper>
              ) : (
                <FlexCenter style={{ flex: 1 }}>
                  <div>
                    <img role="presentation" src={loadImg} />
                  </div>
                </FlexCenter>
              )}
            </RightWrapper>
          </ContentWrapper>
        );
        break;
      case 2:
        res = (
          <ContentWrapperTwo>
            <EditorHomeworkHeader>
              <TopButtons style={{ padding: '0', height: 50 }}>
                <Button
                  size="large"
                  onClick={() => {
                    methods.changeCreateHomeworkStep(1);
                    this.props.dispatch(changeShowAnalysisAction(false));
                    this.props.dispatch(getKnowledgeTreeDataAction());
                  }}
                >{`< 返回选题`}</Button>
                <PlaceHolderBox />
                <EditorHomeworkValue style={{ fontWeight: 600 }}>
                  {homeworkType === 2
                    ? '编辑试卷信息'
                    : `编辑${homeworkType === 0 ? '测评练习' : '课后作业'}信息`}
                </EditorHomeworkValue>
                <PlaceHolderBox />
                <Button
                  type="primary"
                  onClick={() => {
                    this.verifyEditor(3);
                  }}
                >
                  预览
                </Button>
                <Button
                  style={{ marginLeft: 20 }}
                  type="primary"
                  onClick={() => this.verifyEditor(4)}
                >
                  保存
                </Button>
              </TopButtons>
              <PaperNameWrapper>
                <MustInput>
                  <span>*</span>
                </MustInput>
                <TextValue style={{ minWidth: 65 }}>试卷名称：</TextValue>
                <Input
                  type="text"
                  style={{ width: 300 }}
                  value={this.props.testPaperOnepaperMsg.get('name')}
                  onChange={e => {
                    // console.log(e.target.value, 'value -- 1233');
                    let val = e.target.value;
                    if (toString(val).length > 50) {
                      message.warning('试卷名称请不要超过 50 个字');
                      val = val.slice(0, 50);
                    }
                    const testPaperOnepaperMsg = this.props
                      .testPaperOnepaperMsg;
                    const newPaperMsg = testPaperOnepaperMsg.set(
                      'name',
                      e.target.value,
                    );
                    methods.setTestPaperOne(newPaperMsg);
                    // this.setQuestionItemEditor(e.target.value, 'paperName');
                  }}
                />
              </PaperNameWrapper>
              <PaperMsgWrapper>
                <MustInput>
                  <span>*</span>
                </MustInput>
                <TextValue style={{ minWidth: 36 }}>年级：</TextValue>
                <Select
                  labelInValue
                  value={{
                    key: toString(this.props.selectedGrade.get('id') || ''),
                    label: this.props.selectedGrade.get('name'),
                  }}
                  style={{ width: 120 }}
                  onChange={value => this.selectPaperOneMsg(value, 2)}
                >
                  {this.props.gradeList.map((item, index) => {
                    return (
                      <Select.Option
                        key={index}
                        value={toString(item.get('id'))}
                      >
                        {item.get('name')}
                      </Select.Option>
                    );
                  })}
                </Select>
                <WidthBox />
                <MustInput>
                  <span>*</span>
                </MustInput>
                <TextValue style={{ minWidth: 36 }}>学科：</TextValue>
                <Select
                  labelInValue
                  value={{
                    key: toString(this.props.selectedSubject.get('id') || ''),
                    label: this.props.selectedSubject.get('name'),
                  }}
                  style={{ width: 120 }}
                  onChange={value => this.selectPaperOneMsg(value, 3)}
                >
                  {this.props.subjectList.map((item, index) => {
                    return (
                      <Select.Option
                        key={index}
                        value={toString(item.get('id'))}
                      >
                        {item.get('name')}
                      </Select.Option>
                    );
                  })}
                </Select>
                <WidthBox />
                <MustInput>
                  <span>*</span>
                </MustInput>
                <TextValue style={{ minWidth: 48 }}>知识点：</TextValue>
                <Select
                  labelInValue
                  value={{
                    key: toString(
                      this.props.selectedknowledgeItem.get('id') || '',
                    ),
                    label: this.props.selectedknowledgeItem.get('name'),
                  }}
                  style={{ minWidth: 120 }}
                  onChange={value => this.selectPaperOneMsg(value, 4)}
                >
                  {this.props.testkonwleadgeList.map((item, index) => {
                    return (
                      <Select.Option
                        key={index}
                        value={toString(item.get('id'))}
                      >
                        {item.get('name')}
                      </Select.Option>
                    );
                  })}
                </Select>
                <WidthBox />
              </PaperMsgWrapper>
              <ControlWrapper style={{ padding: 0 }}>
                <FilterQuestionNumber>
                  {`本作业共 ${homeworkSkep.count()} 道题目`}
                  {homeworkType !== 0
                    ? `，共计 ${homeworkSkep
                        .map(item => item.get('score'))
                        .reduce((a, b) => a + b)} 分`
                    : ''}
                </FilterQuestionNumber>
                <PlaceHolderBox />
                <SeeAnalysisWrapper
                  onClick={() => {
                    const showAnalysis = this.props.showAnalysis;
                    const newHomeworkSkep = homeworkSkep.map(item => {
                      return item.set('showAnalysis', !showAnalysis);
                    });
                    this.setHomeworkSkep(newHomeworkSkep);
                    this.props.dispatch(
                      changeShowAnalysisAction(!showAnalysis),
                    );
                  }}
                >
                  <ClickBox selected={this.props.showAnalysis} />
                  <SeeAnalysisValue>显示答案与解析</SeeAnalysisValue>
                </SeeAnalysisWrapper>
              </ControlWrapper>
            </EditorHomeworkHeader>
            <EditorHomeworkContent>
              {this.makeEditorChooseQuestion()}
            </EditorHomeworkContent>
          </ContentWrapperTwo>
        );
        break;
      case 3:
        res = (
          <ContentWrapperThree>
            <EditorHomeworkHeader>
              <TopButtons style={{ padding: '0', height: 50 }}>
                <Button
                  size="large"
                  onClick={() => methods.changeCreateHomeworkStep(2)}
                >{`< 返回编辑`}</Button>
                <PlaceHolderBox />
              </TopButtons>
              <ControlWrapper style={{ padding: 0 }}>
                <FilterQuestionNumber>{`本作业共 ${homeworkSkep.count()} 道题目，共计 ${homeworkSkep
                  .map(item => item.get('score'))
                  .reduce((a, b) => a + b)} 分`}</FilterQuestionNumber>
                <PlaceHolderBox />
                <SeeAnalysisWrapper
                  onClick={() => {
                    const showAnalysis = this.props.showAnalysis;
                    const newHomeworkSkep = homeworkSkep.map(item => {
                      return item.set('showAnalysis', !showAnalysis);
                    });
                    this.setHomeworkSkep(newHomeworkSkep);
                    this.props.dispatch(
                      changeShowAnalysisAction(!showAnalysis),
                    );
                  }}
                >
                  <ClickBox selected={this.props.showAnalysis} />
                  <SeeAnalysisValue>显示答案与解析</SeeAnalysisValue>
                </SeeAnalysisWrapper>
              </ControlWrapper>
            </EditorHomeworkHeader>
            <EditorHomeworkContent>
              {this.makeEditorChooseQuestion()}
            </EditorHomeworkContent>
          </ContentWrapperThree>
        );
        break;
      case 4:
        res = (
          <ContentWrapperFour>
            <FinishHwBox>
              <img src={finishImg} role="presentation" />
              <p>
                {homeworkType === 0 ? '课前测评' : '课后作业'}
                {`《${this.props.testPaperOnepaperMsg.get('name')}》发布成功`}
              </p>
              <div>
                <Button
                  style={{ marginTop: 15 }}
                  type="primary"
                  onClick={() => {
                    methods.initData();
                    this.props.dispatch(getTestHomeWorkAction());
                  }}
                >
                  完成
                </Button>
              </div>
            </FinishHwBox>
          </ContentWrapperFour>
        );
        break;
      default:
        break;
    }
    return res;
  }
  render() {
    const homeworkType = this.props.homeworkType;
    const methods = this.props.methods || {};
    return (
      <Modal
        isOpen={this.props.properties.isOpen || false}
        style={customStyles}
        contentLabel="Alert Modal"
      >
        <HomeWorkWrapper>
          <HeaderWrapper>
            <Title>
              {homeworkType === 2
                ? '制作标准作业'
                : `制作标准${homeworkType === 0 ? '课前测评' : '课后作业'}`}
            </Title>
            <PlaceHolderBox />
            <CloseWrapper
              onClick={() => {
                methods.initData();
              }}
            />
          </HeaderWrapper>
          <StepWrapper>
            <Steps
              progressDot
              current={
                this.props.homeworkStep > 3 ? 2 : this.props.homeworkStep - 1
              }
              style={{ width: '60%' }}
            >
              <Step title="1：选题" />
              <Step title="2：编辑" />
              <Step title={`3：${backStepMsg(this.props.homeworkStep)}`} />
              {/* <Step title="step 4：保存" /> */}
            </Steps>
          </StepWrapper>
          {this.makeContent()}
        </HomeWorkWrapper>
        {this.props.isSubmit ? (
          <Alert
            properties={Object.assign(
              {
                // buttonsType: '1',
                // imgType: 'success',
                title: '试卷保存中...',
                isOpen: this.props.isSubmit,
                titleStyle: {
                  textAlign: 'center',
                  fontSize: '16px',
                  color: '#333',
                  fontWeight: 600,
                },
                child: ['知道了'],
                oneClick: () => {
                  this.props.dispatch(changeIsSubmitAction(false));
                  this.props.dispatch(setAlertStatesAction(fromJS({})));
                },
              },
              this.props.alertStates.toJS() || {},
            )}
          >
            {this.props.alertStates.get('warningMsg') ? (
              <FlexCenter>
                <div>{this.props.alertStates.get('warningMsg')}</div>
              </FlexCenter>
            ) : (
              LoadingIndicator()
            )}
          </Alert>
        ) : (
          ''
        )}
      </Modal>
    );
  }
}

CreateHomeWork.propTypes = {
  dispatch: PropTypes.func.isRequired,
  properties: PropTypes.object.isRequired, // 传入的参数
  methods: PropTypes.object, // 传入的方法
  homeworksubjectlist: PropTypes.instanceOf(immutable.List).isRequired, // 学科列表
  selectedSubjectItem: PropTypes.instanceOf(immutable.Map).isRequired, // 选中的学科
  homeworkStep: PropTypes.number.isRequired, // 布置作业的进度
  knowledgeTreeDataList: PropTypes.instanceOf(immutable.List).isRequired, // 树状知识点列表
  selectedType: PropTypes.instanceOf(immutable.Map).isRequired, // 树状知识点列表
  // changeSelectedTreeNode: PropTypes.func.isRequired,  // 跟新获取题目的参数
  selectQuestionTypeList: PropTypes.instanceOf(immutable.List).isRequired, // 跟新获取题目的参数
  questionlevellist: PropTypes.instanceOf(immutable.List).isRequired, // 跟新获取题目的参数
  questionkindlist: PropTypes.instanceOf(immutable.List).isRequired, // 跟新获取题目的参数
  fitstage: PropTypes.instanceOf(immutable.List).isRequired, // 跟新获取题目的参数
  suggeststart: PropTypes.instanceOf(immutable.List).isRequired, // 跟新获取题目的参数
  selectQuestionType: PropTypes.instanceOf(immutable.Map).isRequired, // 选择的题型
  selectedQuestionLevel: PropTypes.instanceOf(immutable.Map).isRequired, // 选择的难度等级
  selectedQuestionKind: PropTypes.instanceOf(immutable.Map).isRequired, // 选择的题类
  selectfitstage: PropTypes.instanceOf(immutable.Map).isRequired, // 选择的阶段
  selectsuggeststart: PropTypes.instanceOf(immutable.Map).isRequired, // 选择的星级
  showAnalysis: PropTypes.bool.isRequired, // 显示解析与答案
  searchBackQuestions: PropTypes.instanceOf(immutable.Map).isRequired, // 题目数据与列表
  homeworkSkep: PropTypes.instanceOf(immutable.List).isRequired, // 作业篮
  pageSize: PropTypes.number.isRequired, // 每页多少条数据
  currentPage: PropTypes.number.isRequired, // 当前第几页
  // changeCreateHomeworkStep: PropTypes.func.isRequired,  // 切换当前页数
  // initData: PropTypes.func.isRequired,  // 初始化数据
  versionList: PropTypes.instanceOf(immutable.List).isRequired, // 版本列表  （章节查询用）
  selectedVersion: PropTypes.instanceOf(immutable.Map).isRequired, // 选中的版本（章节查询用）
  gradeListData: PropTypes.instanceOf(immutable.List).isRequired, // 年级列表  （章节查询用）
  selectedGradeData: PropTypes.instanceOf(immutable.Map).isRequired, // 选中的年级（章节查询用）
  alertStates: PropTypes.instanceOf(immutable.Map).isRequired, // 提交弹框信息
  isSubmit: PropTypes.bool.isRequired, // 提交弹框显示状态
  // setTestPaperOne: PropTypes.func.isRequired,  // 提交弹框显示状态
  testPaperOnepaperMsg: PropTypes.instanceOf(immutable.Map).isRequired, // 测评课试卷类型1 的信息
  // phaseList: PropTypes.instanceOf(immutable.List).isRequired,    // 学段列表
  gradeList: PropTypes.instanceOf(immutable.List).isRequired, // 学段列表
  subjectList: PropTypes.instanceOf(immutable.List).isRequired, // 学段列表
  testkonwleadgeList: PropTypes.instanceOf(immutable.List).isRequired, // 测评课知识点
  selectedknowledgeItem: PropTypes.instanceOf(immutable.Map).isRequired, // 选中的知识点的 index
  // selectedPhase: PropTypes.instanceOf(immutable.Map).isRequired,    // 选择的学段
  selectedGrade: PropTypes.instanceOf(immutable.Map).isRequired, // 选择的年级
  selectedSubject: PropTypes.instanceOf(immutable.Map).isRequired, // 选择的学科
  homeworkType: PropTypes.number.isRequired, // 作业类型(0: 测评课课前作业，1：测评课课中作业，2：标准作业)
  questionListLoadingOver: PropTypes.bool.isRequired, // 加载完成？
  selectedTreeNode: PropTypes.instanceOf(immutable.Map).isRequired,
  knowledgeListIsLoading: PropTypes.bool.isRequired,
  searchParams: PropTypes.instanceOf(immutable.Map).isRequired,
};

const mapStateToProps = createStructuredSelector({
  // homeworksubjectlist: makeHomeworksubjectlist(),
  // selectedSubjectItem: makeSelectedSubjectItem(),
  // homeworkStep: makeHomeworkStep(),
  // knowledgeTreeDataList: makeKnowledgeTreeDataList(),
  // selectedType: makeSelectedType(),
  // selectQuestionTypeList: makeSelectQuestionTypeList(),
  // questionlevellist: makeQuestionlevellist(),
  // questionkindlist: makeQuestionkindlist(),
  // fitstage: makeFitstage(),
  // suggeststart: makeSuggeststart(),
  // selectQuestionType: makeSelectQuestionType(),
  // selectedQuestionLevel: makeSelectedQuestionLevel(),
  // selectedQuestionKind: makeSelectedQuestionKind(),
  // selectfitstage: makeSelectfitstage(),
  // selectsuggeststart: makeSelectsuggeststart(),
  // showAnalysis: makeShowAnalysis(),
  // searchBackQuestions: makeSearchBackQuestions(),
  // homeworkSkep: makeHomeworkSkep(),
  // pageSize: makePageSize(),
  // currentPage: makePageIndex(),
  // versionList: makeVersionList(),
  // selectedVersion: makeSelectedVersion(),
  // gradeListData: makeGradeListData(),
  // selectedGradeData: makeSelectedGradeData(),
  // alertStates: makeAlertStates(),
  // isSubmit: makeIsSubmit(),
  // testPaperOnepaperMsg: makeTestHomeworkOnepaperMsg(),
  // phaseList: makePhaseList(),
  // gradeList: makeGradeList(),
  // subjectList: makeSubjectList(),
  // testkonwleadgeList: makeTestkonwleadgeList(),
  // selectedknowledgeItem: makeSelectedknowledgeItem(),
  // selectedPhase: makeSelectedPhase(),
  // selectedGrade: makeSelectedGrade(),
  // selectedSubject: makeSelectedSubject(),
  // homeworkType: makeHomeworkType(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    // changeSelectedTreeNode: (item) => dispatch(changeSelectedTreeNodeAction(item)),
    // changeCreateHomeworkStep: (num) => dispatch(changeCreateHomeworkStepAction(num)),
    // initData: () => {
    //   dispatch(changecreateHomeworkShowStateAction(false));
    //   dispatch(changeCreateHomeworkStepAction(1));
    //   dispatch(changekeywordAction(''));
    //   dispatch(changeQuestionFistage(fromJS({ id: '-1', name: '全部' })));
    //   dispatch(changeQuestionKind(fromJS({ id: '-1', name: '全部' })));
    //   dispatch(changeQuestionLevel(fromJS({ id: '-1', name: '全部' })));
    //   dispatch(changeQuestionSuggest(fromJS({ id: '-1', name: '全部' })));
    //   dispatch(changeQuestionType(fromJS({ id: '-1', name: '全部' })));
    //   dispatch(setHomeworkSkepAction(fromJS([])));
    //   dispatch(setTestPaperOneAction(fromJS({})));
    //   dispatch(setAlertStatesAction(fromJS({})));
    //   dispatch(changeHomeworkPaperItemAcction(fromJS({})));
    //   dispatch(changeSelectedTypeAction(fromJS({ id: 0, name: '按知识点选题' })));
    //   dispatch(changeIsEditorOrReviseStateAction(0));
    //   dispatch(changeIsEditorOrReviseStateAction(0));
    //   dispatch(changeShowAnalysisAction(false));
    // },
    // setTestPaperOne: (item) => dispatch(setTestPaperOneAction(item)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateHomeWork);
