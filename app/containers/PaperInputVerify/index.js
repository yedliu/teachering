/* eslint-disable no-case-declarations */
/* eslint-disable max-nested-callbacks */
/* eslint-disable array-callback-return */
/*
 *
 * PaperInputVerify
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import immutable, { fromJS } from 'immutable';
import styled from 'styled-components';
import {
  FlexRow,
  FlexRowCenter,
  FlexColumn,
  FlexCenter,
} from 'components/FlexBox';
import Table from 'components/Table';
import {
  formatDate,
  numberToChinese,
  paperStates,
  paperStatesControl,
  letterOptions,
  downloadFile,
  filterquestion,
  backfromZmStand,
} from 'components/CommonFn';
import {
  RootWrapper,
  PlaceHolderBox,
  ClearFix,
  questionItemCss,
} from 'components/CommonFn/style';
import PaperQuestionList from 'components/PaperQuestionList';
import Button from 'components/Button';
import Alert from 'components/Alert';
import { Modal, message, Switch } from 'antd';
import 'katex/dist/katex.min.css';
import {
  makeDataIsGetting,
  makeBtnCanClick,
} from 'containers/LeftNavC/selectors';
import {
  changeBtnCanClickAction,
  setBackAlertStatesAction,
} from 'containers/LeftNavC/actions';
import { getDefaultTemplate } from 'utils/templateMapper';
import ShowQuestionItem from 'components/ShowQuestionItem';
import EditItemQuestion from 'components/EditItemQuestion';
import LoadingIndicator from 'components/LoadingIndicator';
import {
  changePageIndexAction,
  changePaperStateAction,
  getPaperMsgAction,
  changeNeedVerifyPaperIdAction,
  changeAlertShowOrHideAction,
  getAllQuestionTypeListAction,
  changeSelectedQuestionIndexAction,
  changeErrTextareaShowAction,
  changeQuestionResultStateAction,
  changePreviewImgSrcAction,
  changePageStateAction,
  changeQuestionResultAction,
  submitQuestionCutVerifyAction,
  changeSortAction,
  initVerifyDataAction,
  changeShowSubmitBtnAction,
  changeQuestionEditStateAction,
  setClickTargetAction,
  submitQuestionItemAction,
  setNewQuestionMsgAction,
  setQuestionsListAction,
  setPaperDownloadMsgAction,
  changeQuestionListAction,
  changeQuestionMsgListAction,
  changePaperNeedVerifyAction,
  changeRealQuestionsCountAction,
  changeNeedVerifyPaperItemAction,
} from './actions';
import makeSelectPaperInputVerify, {
  makePageState,
  makePaperState,
  makePaperList,
  makeNotGetPaperCount,
  makeHasGetPaperCount,
  makeQuestionMsgList,
  makeQuestionSelectedIndex,
  makePreviewImgSrc,
  makeQuestionResult,
  makeErrTextareaShow,
  makeQuestionsList,
  makeQuestionTypeList,
  makeGetAlertShowOrHide,
  makeRealQuestionsCount,
  makeQuestionResultState,
  makePaperDownloadMsg,
  makePaperNeedVerify,
  makePageIndex,
  makeShowSubmitBtn,
  makeQuestionEditState,
  makeClickTarget,
  makeNewQuestion,
} from './selectors';
import { preAuditEntryByGeetest } from './server';
import { gtInit } from 'utils/gtInit';

const VerifyBoxWrapper = styled(FlexColumn)`
  width: 100%;
  height: 100%;
`;
const TopButtonsBox = styled(FlexRowCenter)`
  height: 50px;
  background: #fff;
  padding: 0 10px;
`;
const PaperWrapper = styled(FlexRow)`
  flex: 1;
  padding: 15px 0;
  background: #eee;
`;
// 左边
const PaperWrapperBox = styled(FlexColumn)`
  height: 100%;
  flex: 1;
  margin: 0 10px;
  background: white;
  overflow-y: auto;
`;
const ImageCutWrapper = styled(FlexColumn)`
  flex: 1;
  min-height: 200px;
  padding: 5px;
  border-bottom: 1px solid #ddd;
`;
const QuestionPreviewScroll = styled.p`
  flex: 1;
  margin: 0;
  text-align: center;
  overflow-y: auto;
`;
const QuestionPreview = styled.img`
  max-width: 100%;
  height: auto;
`;
const QuestionMsg = styled.div`
  // overflow-y: auto;
`;
const ChildWrapper = styled.div`
  font-size: 14px;
  & > p {
    line-height: 2em !important;
  }
`;
const QuestionMsgWrapper = styled(FlexRowCenter)`
  height: 30px;
  border: 1px solid #eee;
`;
const BigQuestionWrapper = styled(FlexRowCenter)`
  font-size: 16px;
  font-weight: 600;
`;
const BigName = styled.span`
  text-indent: 20px;
`;
const SmallQuestionWrapper = styled(FlexRowCenter)`
  margin-left: 40px;
  font-size: 14px;
`;
const SmallNum = styled.span`
  margin-right: 20px;
`;
const SmallType = styled.span``;
const ButtonsWrapper = styled(FlexRowCenter)`
  height: 30px;
  font-size: 16px;
  padding-right: 20px;
`;
const ErrDescriptWrapper = styled(FlexColumn)`
  flex: 1;
  min-height: 105px;
  max-height: 105px;
  padding: 0 20px;
`;
const ErrMsgWrapper = styled(FlexColumn)`
  flex: 1;
`;
const ErrMsgTitleValue = styled.p`
  font-size: 14px;
`;
const Textarea = styled.div`
  flex: 1;
  padding-top: 5px;
`;
const ErrTextDescription = styled.textarea`
  width: 460px;
  min-height: 80px;
  border: 1px solid #ccc;
  resize: none;
  padding: 10px;
  outline: none;
`;
const QuestionChangeButtons = styled(FlexCenter)`
  min-height: 50px;
`;
const QuestionRightWrapper = styled(FlexRowCenter)`
  cursor: pointer;
  user-select: none;
`;
const QuestionRadiusBox = styled.div`
  width: 16px;
  height: 16px;
  margin: 0 5px 0 20px;
  border: ${props => {
    let res = '';
    if (props.me === 'err') {
      res = props.right === 0 ? '4px solid #EF4C4F' : '1px solid #ccc';
    } else if (props.me === 'right') {
      res = props.right === 1 ? '4px solid #2EAC43' : '1px solid #ccc';
    }
    return res;
  }};
  border-radius: 50%;
`;
const QuestionContentWrapper = styled(questionItemCss)`
  flex: 1;
  box-sizing: border-box;
  min-height: 200px;
  margin-top: 10px;
  padding: 0 10px;
  border: 1px solid #ddd;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
  overflow-y: auto;
  .katex-html {
    background: #9ff;
  }
  img {
    border: 2px solid rgb(52, 153, 255);
  }
`;

const QuestionContentBox = styled(ClearFix)`
  display: block;
`;
const QuestionOptions = styled(FlexColumn)`
  padding-left: 20px;
`;
const OptionsWrapper = styled(FlexRowCenter)`
  flex: 1;
  min-height: 2em;
`;
const OptionsOrder = styled.div`
  font-family: 'Arial Unicode MS', 'sans-serif' !important;
  font-size: 10.5pt;
  float: left;
`;
const Options = styled.div``;
const AnalysisWrapper = styled(FlexColumn)`
  margin: 10px;
  min-height: 52px;
  border: 1px solid #ddd;
  padding: 5px;
`;
const QuestionAnalysis = styled(FlexRow)``;
const QUestionAnswer = styled(FlexRow)``;
const AnswerTitle = styled.div`
  min-width: 42px;
  font-family: PingFangSC-Medium;
  line-height: 2;
  color: #7a593c;
`;
const AnswerConten = styled(ClearFix)`
  flex: 1;
  &.rightAnswer {
    margin-top: 4px;
  }
  display: block;
`;
const QuestionItemWrapper = styled.div`
  border: 1px solid #ddd;
  padding: 5px;
  flex: 1;
`;
const QuestionTitleContent = styled(FlexRow)`
  font-family: 'Arial Unicode MS', 'sans-serif' !important;
  font-size: 10.5pt;
  min-height: 20px;
`;
const ChildrenItem = styled(FlexColumn)`
  padding: 10px 10px 0;
`;
const AnswerBox = styled(FlexColumn)`
  // padding: 5px;
`;

const trItemList = [
  'paperName',
  'questionCount',
  'insertPerson',
  'refleshTime',
  'paperState',
  'control',
];
const rowList = [
  {
    name: '试卷名称',
    scale: 4,
  },
  {
    name: '题目数量',
    scale: 1,
  },
  {
    name: '上传者',
    scale: 1.5,
  },
  {
    name: '更新时间',
    scale: 1.5,
  },
  {
    name: '状态',
    scale: 1.5,
  },
  {
    name: '操作',
    scale: 2,
  },
];

export class PaperInputVerify extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.headerItem = this.headerItem.bind(this);
    this.makeVerifyPaper = this.makeVerifyPaper.bind(this);
    this.questionItemIndexClick = this.questionItemIndexClick.bind(this);
    this.alertSureClick = this.alertSureClick.bind(this);
    this.preQuestionClick = this.preQuestionClick.bind(this);
    this.nextQuestionClick = this.nextQuestionClick.bind(this);
    this.makeQuestionItem = this.makeQuestionItem.bind(this);
    this.questionItemforType = this.questionItemforType.bind(this);
    this.textareaInput = this.textareaInput.bind(this);
    this.submitClick = this.submitClick.bind(this);
    this.changePage = this.changePage.bind(this);
    this.keyDownEvent = this.keyDownEvent.bind(this);
    this.verifyMe = this.verifyMe.bind(this);
    this.verifySuccess = this.verifySuccess.bind(this);
    this.captchaObj = null;
    this.state = {
      seeMobile: false,
      isOpen: true,
      paper: null,
    };
  }

  componentDidMount() {
    this.props.dispatch(getAllQuestionTypeListAction());
    this.props.dispatch(changeShowSubmitBtnAction(false));
    // 极验验证码配置
    this.verifyInit();
    // document.addEventListener('keydown', this.keyDownEvent);
  }

  verifyInit() {
    // 请求配置接口
    gtInit().then(captchaObj => {
      this.captchaObj = captchaObj;
      // 绑定验证成功失败事件
      this.captchaObj.onSuccess(this.verifySuccess);
      this.captchaObj.onError(e => {
        message.error(e.message || '系统错误');
      });
    });
  }

  verifySuccess() {
    let result = this.captchaObj.getValidate();
    if (!result) {
      return message.error('请完成验证');
    }
    preAuditEntryByGeetest({
      id: this.state.paper.get('id'),
      challenge: result.geetest_challenge,
      validate: result.geetest_validate,
      seccode: result.geetest_seccode,
    }).then(res => {
      const { dispatch } = this.props;
      const { data } = res;
      const questionsList = [];
      const questionMsgList = [];
      const questionResult = [];
      let realQuestionsCount = 0;
      if (res.code !== '0') {
        return message.error(res.message || '系统异常');
      }
      dispatch(changeNeedVerifyPaperItemAction(this.state.paper));
      dispatch(
        setPaperDownloadMsgAction(
          fromJS({
            fileUrl: data.fileUrl,
            fileName: `${data.name}(${data.year})`,
          }),
        ),
      );
      data.examPaperContentOutputDTOList.map(item => {
        questionsList.push({
          name: item.name,
          count: item.examPaperContentQuestionOutputDTOList.length,
          serialNumber: item.serialNumber,
        });
        item.examPaperContentQuestionOutputDTOList.map(it => {
          // console.log(it, it.questionId, 'iii')
          const question = {
            id: it.id,
            questionId: it.questionId,
            epcId: item.id,
            epId: data.id,
            bigNum: item.serialNumber,
            bigName: item.name,
            picUrl: it.questionOutputDTO.picUrl,
            questionTypeId: it.questionOutputDTO.typeId,
            serialNumber: it.serialNumber,
            title: backfromZmStand(it.questionOutputDTO.title || ''),
            analysis: backfromZmStand(it.questionOutputDTO.analysis || ''),
            answerList: (it.questionOutputDTO.answerList || []).map(iit =>
              backfromZmStand(iit),
            ),
            typeId: it.questionOutputDTO.typeId,
            optionList: (it.questionOutputDTO.optionList || []).map(iit =>
              backfromZmStand(iit),
            ),
            templateTypeId: it.questionOutputDTO.templateType || -1,
            templateType: it.questionOutputDTO.templateType || -1,
            gradeId: it.questionOutputDTO.gradeId,
            subjectId: it.questionOutputDTO.subjectId,
            score: it.questionOutputDTO.score,
          };
          if (
            it.questionOutputDTO.children &&
            it.questionOutputDTO.children.length > 0
          ) {
            question.children = it.questionOutputDTO.children.map(itt => {
              return {
                score: itt.score,
                title: backfromZmStand(itt.title || ''),
                optionList: (itt.optionList || []).map(iit =>
                  backfromZmStand(iit),
                ),
                answerList: (itt.answerList || []).map(iit =>
                  backfromZmStand(iit),
                ),
                analysis: backfromZmStand(itt.analysis || ''),
                typeId: itt.typeId,
                subQuestionId: itt.questionId,
                id: itt.id,
              };
            });
          }
          questionMsgList.push(question);
          questionResult.push({
            auditResult: true,
            questionId: it.questionId,
            errType: 0,
            errReason: '',
            errState: -1,
          });
          realQuestionsCount += 1;
        });
      });
      dispatch(changeQuestionListAction(fromJS(questionsList)));
      dispatch(changeQuestionMsgListAction(fromJS(questionMsgList)));
      dispatch(changePaperNeedVerifyAction(fromJS(data)));
      dispatch(changeRealQuestionsCountAction(realQuestionsCount));
      dispatch(changeQuestionResultAction(fromJS(questionResult)));
      dispatch(changePageStateAction(1));
      // 调用该接口进行重置验证码
      this.captchaObj.reset();
    });
  }

  keyDownEvent(e) {
    if (this.props.pageState !== 1) return;
    // console.log(e);
    let judgementList = ['PageUp', 'PageDown', 'Home', 'End', 'Space'];
    let judgement = e.code;
    if (!e.code) {
      judgementList = [33, 34, 32, 36, 35];
      judgement = e.keyCode;
    }
    switch (judgement) {
      case judgementList[0]:
        this.preQuestionClick();
        break;
      case judgementList[1]:
        this.nextQuestionClick();
        break;
      case judgementList[2]:
        this.verifyMe('right');
        break;
      case judgementList[3]:
        this.verifyMe('err');
        setTimeout(() => {
          this.errInputArea.focus();
        }, 35);
        break;
      // case judgementList[4]:
      //   this.errInputArea.focus();
      //   break;
      default:
        break;
    }
  }

  verifyMe(type) {
    const questionIndex = this.props.questionSelectedIndex - 1;
    const questionResult = this.props.questionResult;
    const errItem = questionResult.get(questionIndex);
    if (type === 'err') {
      const newErrItem = errItem.set('auditResult', false).set('errState', 0);
      const newQuestionResult = questionResult.set(questionIndex, newErrItem);
      this.props.changeQuestionResult(newQuestionResult);
      this.props.changeErrTextareaShow(true);
      this.props.changeQuestionResultState(0);
    } else if (type === 'right') {
      const newErrItem = errItem
        .set('auditResult', true)
        .set('errState', 1)
        .set('errReason', '');
      const newQuestionResult = questionResult.set(questionIndex, newErrItem);
      this.props.changeQuestionResult(newQuestionResult);
      this.props.changeErrTextareaShow(false);
      this.props.changeQuestionResultState(1);
      setTimeout(() => {
        this.nextQuestionClick();
      }, 30);
    }
  }

  headerItem() {
    return [
      {
        name: '待审核',
        num: this.props.notGetPaperCount,
      },
      {
        name: '已审核',
        num: this.props.hasGetPaperCount,
      },
    ];
  }

  stateItem() {
    let res = [];
    const state = this.props.paperState || 0;
    if (state === 6) {
      res = [{ name: 'paperState', state: { "6": '待审核', "13": '审核中' } }, { // eslint-disable-line
        name: 'control',
        state: { "6": '审核', "13": '重新审核' }, // eslint-disable-line
        clickBack: (paperState, val, index, i) => {
          // console.log(paperState, val, index, i, 'paperState');
          if (paperState === 6) {
            this.captchaObj.verify();
            const paper = this.props.paperList.get(index);
            this.setState({
              paper
            });
          } else if (paperState === 13) {
            const paperItem = this.props.paperList.get(index);  // 获取该试卷数据
            this.props.dispatch(changeNeedVerifyPaperIdAction(paperItem));  // 设置为当前试卷
          } else {
            message.warning('敬请期待功能开放');
          }
        },
      }];
    } else if (state === 7) {
      res = [
        {
          name: 'paperState',
          state: Object.assign({}, paperStates, {
            '7': '审核未通过',
            '8': '审核通过',
          }),
        },
        {
          // eslint-disable-line
          name: 'control',
          state: Object.assign({}, paperStatesControl, {
            '7': '— —',
            '8': '— —',
          }), // eslint-disable-line
          clickBack: (paperState, val, index, i) => {
            if (paperState === 7 || paperState === 8) {
              alert('敬请期待功能开放');
            }
          },
        },
      ];
    }
    return res;
  }

  questionItemIndexClick(index, i, countNum, item) {
    const questionIndex = this.props.questionSelectedIndex;
    let itemIndex = 1;
    const questionCountList = this.props.questionsList.toJS();
    for (let num = 0; num < questionCountList.length; num += 1) {
      if (num < index) {
        itemIndex += questionCountList[num].count;
      } else {
        break;
      }
    }
    itemIndex += i;
    const questionResult = this.props.questionResult;
    const beforeItem = questionResult.get(questionIndex - 1);
    if (questionResult.get(i - 1).get('errState') === 0) {
      if (questionResult.get(i - 1).get('errReason') === '') {
        message.warning('错误内容不可以为空');
        return;
      }
    } else if (
      itemIndex !== 1 &&
      questionResult.get(itemIndex - 2).get('errState') === -1
    ) {
      message.warning('请选择审核通过/不通过');
      return;
    } else if (
      beforeItem.get('errState') === 0 &&
      (beforeItem.get('errReason') || '').replace(/\s+/g, '') === ''
    ) {
      message.warning('错误内容不可以为空');
      return;
    }
    this.verifyTextarea(itemIndex, itemIndex);
    this.props.changeSelectedQuestionIndex(itemIndex);
    this.changePreviewImg(itemIndex - 1);
  }

  changePage(pageIndex, pageSize) {
    this.props.dispatch(changePageIndexAction(pageIndex));
    setTimeout(() => {
      this.props.dispatch(getPaperMsgAction());
    }, 10);
  }

  /**
   * 点击 上一题
   */
  preQuestionClick() {
    const questionIndex = this.props.questionSelectedIndex;
    if (questionIndex > 1) {
      this.verifyTextarea(questionIndex, questionIndex - 1);
    } else {
      // else
    }
  }

  /**
   * 点击 下一题
   */
  nextQuestionClick() {
    const questionIndex = this.props.questionSelectedIndex;
    if (questionIndex < this.props.realQuestionsCount) {
      this.verifyTextarea(questionIndex, questionIndex + 1);
    } else {
      const modal = Modal.success({
        title: '审核完毕',
        content: '您可以点击右上角提交按钮提交该试卷！',
      });
      this.props.dispatch(changeShowSubmitBtnAction(true));
      setTimeout(() => modal.destroy(), 2000);
    }
  }

  verifyTextarea(questionIndex, index) {
    const questionResult = this.props.questionResult;
    if (
      questionResult.get(questionIndex - 1).get('errState') === -1 &&
      index > questionIndex
    ) {
      message.warning('请选择审核通过/不通过');
      return;
    } else if (questionResult.get(questionIndex - 1).get('errState') === 0) {
      if (questionResult.get(questionIndex - 1).get('errReason') === '') {
        message.error('错误内容不可以为空');
        return;
      }
    }
    this.props.changeSelectedQuestionIndex(index);
    if (questionResult.get(index - 1).get('auditResult')) {
      this.props.changeErrTextareaShow(false);
    } else {
      this.props.changeErrTextareaShow(true);
    }
    this.props.changeQuestionResultState(
      questionResult.get(index - 1).get('errState'),
    );
    if (questionIndex !== index) this.changePreviewImg(index - 1);
  }

  changePreviewImg(index) {
    const previewImg =
      this.props.questionMsgList.get(index).get('picUrl') || '';
    this.props.changePreviewImgSrc(previewImg); // 设置预览图片
  }

  alertSureClick() {
    this.props.changeAlertShowOrHide(false);
    this.props.dispatch(changeBtnCanClickAction(true));
    this.props.changePageState(0);
    this.setState({ seeMobile: true });
    this.props.dispatch(initVerifyDataAction());
    this.props.dispatch(changeShowSubmitBtnAction(false));
    document.removeEventListener('keydown', this.keyDownEvent);
  }

  questionItemforType(currentQuestion, type, index) {
    let res = '';
    switch (type) {
      case 1:
        res = (
          <QuestionItemWrapper>
            <QuestionTitleContent>
              <div style={{ color: '#999' }}>{`${index + 1}、`}</div>
              <QuestionContentBox
                dangerouslySetInnerHTML={{
                  __html: filterquestion(currentQuestion.get('title')),
                }}
              />
            </QuestionTitleContent>
            <QuestionOptions>
              {fromJS(currentQuestion.get('optionList') || []).map(
                (value, i) => (
                  <OptionsWrapper key={i}>
                    <OptionsOrder>{`${letterOptions[i]}、`}</OptionsOrder>
                    <Options
                      dangerouslySetInnerHTML={{
                        __html: filterquestion(value),
                      }}
                    />
                  </OptionsWrapper>
                ),
              )}
            </QuestionOptions>
            <AnalysisWrapper>
              <QuestionAnalysis>
                <AnswerTitle>
                  <span>解析：</span>
                </AnswerTitle>
                <AnswerConten
                  dangerouslySetInnerHTML={{
                    __html: filterquestion(currentQuestion.get('analysis')),
                  }}
                />
              </QuestionAnalysis>
              <QUestionAnswer>
                <AnswerTitle>
                  <span>答案：</span>
                </AnswerTitle>
                {currentQuestion.get('answerList').map((value, i) => (
                  <AnswerConten
                    key={i}
                    style={{ maxWidth: 30 }}
                    className={'rightAnswer'}
                    dangerouslySetInnerHTML={{ __html: filterquestion(value) }}
                  />
                ))}
              </QUestionAnswer>
            </AnalysisWrapper>
          </QuestionItemWrapper>
        );
        break;
      case 2:
        res = (
          <QuestionItemWrapper>
            <QuestionTitleContent>
              <div
                style={{
                  lineHeight: 2,
                  fontSize: '10.5pt',
                  marginTop: 3,
                  color: '#999',
                }}
              >{`${index + 1}、`}</div>
              <QuestionContentBox
                dangerouslySetInnerHTML={{
                  __html: filterquestion(currentQuestion.get('title')),
                }}
              />
            </QuestionTitleContent>
            <AnalysisWrapper>
              <QuestionAnalysis>
                <AnswerTitle>
                  <span>解析：</span>
                </AnswerTitle>
                <AnswerConten
                  dangerouslySetInnerHTML={{
                    __html: filterquestion(currentQuestion.get('analysis')),
                  }}
                />
              </QuestionAnalysis>
              <QUestionAnswer>
                <AnswerTitle>
                  <span style={{ marginTop: '6px' }}>答案：</span>
                </AnswerTitle>
                <AnswerBox>
                  {currentQuestion.get('answerList').map((value, i) => (
                    <FlexRow key={i} style={{ flexDirection: 'flex-start' }}>
                      {currentQuestion.get('answerList').count() > 1 ? (
                        <div style={{ lineHeight: 2, fontSize: '10.5pt' }}>
                          {i + 1}、
                        </div>
                      ) : (
                        ''
                      )}
                      <AnswerConten
                        style={{ display: 'block' }}
                        className={'rightAnswer'}
                        dangerouslySetInnerHTML={{
                          __html:
                            filterquestion(value).replace(
                              /(【答案】)|(【解答】)/g,
                              '',
                            ) || '',
                        }}
                      />
                    </FlexRow>
                  ))}
                </AnswerBox>
              </QUestionAnswer>
            </AnalysisWrapper>
          </QuestionItemWrapper>
        );
        break;
      case 3:
        res = (
          <QuestionItemWrapper>
            <QuestionTitleContent>
              <div>{`${index + 1}、`}</div>
              <QuestionContentBox
                dangerouslySetInnerHTML={{
                  __html: filterquestion(currentQuestion.get('title')),
                }}
              />
            </QuestionTitleContent>
            <AnalysisWrapper>
              <QuestionAnalysis>
                <AnswerTitle>
                  <span>解析：</span>
                </AnswerTitle>
                <AnswerConten
                  dangerouslySetInnerHTML={{
                    __html: filterquestion(currentQuestion.get('analysis')),
                  }}
                />
              </QuestionAnalysis>
              <QUestionAnswer>
                <AnswerTitle>
                  <span style={{ marginTop: '6px' }}>答案：</span>
                </AnswerTitle>
                <AnswerBox>
                  {currentQuestion.get('answerList').map((value, i) => (
                    <AnswerConten
                      key={i}
                      className={'rightAnswer'}
                      dangerouslySetInnerHTML={{
                        __html: filterquestion(value),
                      }}
                    />
                  ))}
                </AnswerBox>
              </QUestionAnswer>
            </AnalysisWrapper>
          </QuestionItemWrapper>
        );
        break;
      // eslint-disable-next-line no-case-declarations
      case 4:
        const children = currentQuestion.get('children');
        res = (
          <QuestionItemWrapper>
            <QuestionTitleContent>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{`${index +
                1}、`}</div>
              <QuestionContentBox
                style={{ fontSize: 14 }}
                dangerouslySetInnerHTML={{
                  __html: filterquestion(currentQuestion.get('title')),
                }}
              />
            </QuestionTitleContent>
            {children
              ? children.map((item, i) => (
                <ChildrenItem key={i}>
                  {this.questionItemforType(item, item.get('typeId') - 1, i)}
                </ChildrenItem>
                ))
              : ''}
          </QuestionItemWrapper>
        );
        break;
      default:
        break;
    }
    return res;
  }

  makeQuestionItem(currentQuestion, questionIndex) {
    let res = '';
    const { typeId, templateTypeId } = currentQuestion.toJS();
    const templateType =
      templateTypeId > 0 ? templateTypeId : Number(getDefaultTemplate(typeId));
    // log(templateType, 'templateType - templateType');
    if (templateType === 2) {
      res = this.questionItemforType(currentQuestion, 1, questionIndex);
    } else if (templateType === 3) {
      res = this.questionItemforType(currentQuestion, 2, questionIndex);
    } else if (templateType === 4) {
      res = this.questionItemforType(currentQuestion, 3, questionIndex);
    } else if (templateType === 1) {
      res = this.questionItemforType(currentQuestion, 4, questionIndex);
    }
    // console.log(res, 'res -- 621');
    return res;
  }

  textareaInput(e) {
    const value = e.target.value;
    const questionResult = this.props.questionResult.toJS();
    const errItem = questionResult[this.props.questionSelectedIndex - 1];
    if (value) {
      errItem.auditResult = false;
    } else {
      errItem.auditResult = true;
    }
    errItem.errReason = value;
    questionResult[this.props.questionSelectedIndex - 1] = errItem;
    this.props.changeQuestionResult(questionResult);
  }

  submitClick() {
    const questionResult = this.props.questionResult.toJS();
    const hasNotVerify = questionResult.filter(item => item.errState === -1);
    if (hasNotVerify.length > 0) {
      message.error('请将试卷审核完再提交');
      return;
    }
    const lastQuestion = questionResult[questionResult.length - 1];
    if (lastQuestion.errState === 0 && lastQuestion.errReason === '') {
      message.error('错误内容不可以为空');
      return;
    }
    const hasEmptyErrMsg = questionResult.some(
      it =>
        it.errState === 0 && (it.errReason || '').replace(/\s+/g, '') === '',
    );
    if (hasEmptyErrMsg) {
      message.warning('错误内容不可以为空');
      return;
    }
    this.props.dispatch(submitQuestionCutVerifyAction());
    this.props.dispatch(changeBtnCanClickAction(false));
  }

  makeVerifyPaper() {
    let content = '';
    let tablebodydata = fromJS([]);
    const questionMsgList = this.props.questionMsgList || fromJS([]);
    const questionIndex = this.props.questionSelectedIndex - 1;
    const currentQuestion = questionMsgList.get(questionIndex) || fromJS({});
    switch (this.props.pageState) {
      case 0:
        tablebodydata = (this.props.paperList || fromJS([]))
          .toJS()
          .map(item => {
            return {
              paperName: item.name || '该试卷未输入名称',
              questionCount: item.questionAmount || 0,
              insertPerson: item.createUserName || ' ',
              refleshTime: formatDate(
                'yyyy-MM-dd',
                new Date(item.updatedTime || new Date()),
              ),
              paperState: item.state || 6,
              control: item.state || 6,
            };
          });
        content = (
          <Table
            source={'getandinputpaper'}
            trItemList={trItemList} // 必填，每列中取的属性名，数组形式
            rowList={rowList} // 必填，
            headerItem={fromJS(this.headerItem())} // 必填，头部切换页 item
            tablebodydata={fromJS(tablebodydata)} // 必填
            stateItem={this.stateItem()} // stateItem：具有不同状态的某一项数据，可以添加 click 事件
            paperState={this.props.paperState - 6}
            changeReceiveState={index => {
              console.log(index + 6, this.props.paperState, 'index');
              if (index + 6 !== this.props.paperState) {
                this.props.dispatch(changePageIndexAction(1));
              }
              this.props.dispatch(changePaperStateAction(index + 6));
              setTimeout(() => {
                this.props.dispatch(getPaperMsgAction());
                document.addEventListener('keydown', this.keyDownEvent);
              }, 30);
            }}
            paperCount={
              this.props.paperState === 6
                ? this.props.notGetPaperCount
                : this.props.hasGetPaperCount
            } // 总试卷数量
            whoCanBeClick={this.props.paperState === 6 ? [6, 13] : []} // 哪个状态的可以点击
            changePageNum={this.changePage}
            orderItemsClick={orderIndex => {
              this.props.dispatch(changeSortAction(orderIndex));
            }}
            idLoading={this.props.dataIsGetting}
            pageIndex={this.props.pageIndex}
          />
        );
        break;
      case 1:
        content = (
          <VerifyBoxWrapper>
            <TopButtonsBox>
              <Button
                showtype={6}
                onClick={() => this.props.changeAlertShowOrHide(true)}
              >
                {'<'} 返回
              </Button>
              <PlaceHolderBox />
              <Button
                showtype={5}
                onClick={() => {
                  downloadFile(
                    {
                      fileUrl: this.props.paperDownloadMsg.get('fileUrl'),
                      fileName: this.props.paperDownloadMsg.get('fileName'),
                    },
                    this.props.dispatch,
                  );
                }}
              >
                下载本试卷
              </Button>
              {this.props.showSubmitBtn ? (
                this.props.btnCanClick ? (
                  <Button
                    showtype={4}
                    style={{ marginLeft: 20 }}
                    onClick={this.submitClick}
                  >
                    提交
                  </Button>
                ) : (
                  <Button style={{ marginLeft: 20 }} showtype={8}>
                    提交
                  </Button>
                )
              ) : (
                ''
              )}
            </TopButtonsBox>
            <PaperWrapper>
              <PaperWrapperBox>
                <ImageCutWrapper>
                  <QuestionPreviewScroll>
                    <QuestionPreview src={this.props.previewImgSrc} />
                  </QuestionPreviewScroll>
                </ImageCutWrapper>
                <FlexRowCenter style={{ height: 30, marginTop: 5 }}>
                  <PlaceHolderBox />
                  <Button
                    style={{ marginRight: 10 }}
                    showtype={6}
                    onClick={() => {
                      const questionOutputDTO =
                        this.props.questionMsgList.get(questionIndex) ||
                        fromJS({});
                      if (!questionOutputDTO.get('id')) {
                        message.error('执行错误，请刷新后重试');
                      } else {
                        this.props.setNewQuestionData(questionOutputDTO);
                        setTimeout(() => {
                          this.props.dispatch(changeQuestionEditStateAction(1));
                        }, 30);
                      }
                    }}
                  >
                    编辑本题
                  </Button>
                  <Switch
                    onChange={ckicked => this.setState({ seeMobile: ckicked })}
                    checked={this.state.seeMobile}
                    checkedChildren="移动端预览"
                    unCheckedChildren="PC预览"
                  />
                </FlexRowCenter>
                <QuestionContentWrapper>
                  <ShowQuestionItem
                    soucre="paperinputverify"
                    subjectId={this.props.paperNeedVerify.get('subjectId')}
                    questionOutputDTO={currentQuestion}
                    seeMobile={this.state.seeMobile}
                  />
                </QuestionContentWrapper>
                <QuestionMsg>
                  <QuestionMsgWrapper>
                    <BigQuestionWrapper>
                      <BigName>{`大题编号与名称：${numberToChinese(
                        currentQuestion.get('bigNum'),
                      )}、${currentQuestion.get('bigName')}`}</BigName>
                    </BigQuestionWrapper>
                    <SmallQuestionWrapper>
                      <SmallNum>
                        题号：{currentQuestion.get('serialNumber')}
                      </SmallNum>
                      <SmallType>
                        题型：{currentQuestion.get('questionType') || ''}
                      </SmallType>
                    </SmallQuestionWrapper>
                  </QuestionMsgWrapper>
                  <ButtonsWrapper>
                    <PlaceHolderBox />
                    {
                      <QuestionRightWrapper
                        onClick={() => this.verifyMe('err')}
                      >
                        <QuestionRadiusBox
                          me={'err'}
                          right={this.props.questionResultState}
                        />
                        <span>审核不通过</span>
                      </QuestionRightWrapper>
                    }
                    <QuestionRightWrapper
                      onClick={() => this.verifyMe('right')}
                    >
                      <QuestionRadiusBox
                        me={'right'}
                        right={this.props.questionResultState}
                      />
                      <span>审核通过</span>
                    </QuestionRightWrapper>
                  </ButtonsWrapper>
                </QuestionMsg>
                {this.props.errTextareaShow ? (
                  <ErrDescriptWrapper>
                    <ErrMsgWrapper>
                      <ErrMsgTitleValue>填写错误描述：</ErrMsgTitleValue>
                      <Textarea>
                        <ErrTextDescription
                          value={this.props.questionResult
                            .get(questionIndex)
                            .get('errReason')}
                          innerRef={x => {
                            this.errInputArea = x;
                          }}
                          onKeyDown={e => {
                            if (e.ctrlKey && e.key === 'Enter') {
                              this.nextQuestionClick();
                            }
                          }}
                          onChange={this.textareaInput}
                        />
                      </Textarea>
                    </ErrMsgWrapper>
                  </ErrDescriptWrapper>
                ) : (
                  ''
                )}
                <QuestionChangeButtons>
                  {this.props.errTextareaShow ? (
                    <Button showtype={4} onClick={this.nextQuestionClick}>
                      保存
                    </Button>
                  ) : (
                    ''
                  )}
                </QuestionChangeButtons>
              </PaperWrapperBox>
              <PaperQuestionList
                source={'paperinputverify'}
                questionsList={this.props.questionsList}
                questionSelectedIndex={this.props.questionSelectedIndex}
                questionItemIndexClick={this.questionItemIndexClick}
                toSeePaperMsg={() => {
                  // console.log(this.props.paperNeedVerify, 'currentPaperItem - currentPaperItem');
                  const paperNeedVerify = this.props.paperNeedVerify;
                  return {
                    name: paperNeedVerify.get('name'),
                    questionCount: paperNeedVerify.get('questionAmount'),
                    realQuestionsCount: this.props.realQuestionsCount,
                    entryUserName: paperNeedVerify.get('entryUserName'),
                  };
                }}
                othersData={{
                  questionResult: this.props.questionResult,
                }}
              />
            </PaperWrapper>
          </VerifyBoxWrapper>
        );
        break;
      default:
        break;
    }
    return content;
  }

  makeEditOrAddQuestion() {
    const {
      dispatch,
      clickTarget,
      newQuestion,
      setNewQuestionData,
      questionTypeList,
      questionEditState,
    } = this.props;
    return (
      <EditItemQuestion
        clickTarget={clickTarget}
        newQuestion={newQuestion}
        setNewQuestionData={setNewQuestionData}
        questionTypeList={questionTypeList}
        questionEditState={questionEditState}
        isOpen={this.state.isOpen}
        changeQuestionEditState={() =>
          dispatch(changeQuestionEditStateAction(0))
        }
        setClickTarget={str => dispatch(setClickTargetAction(str))}
        soucre="apperInputVerify"
        submitQuestionItem={() => {
          dispatch(
            setBackAlertStatesAction(
              fromJS({
                buttonsType: '0',
                title: '数据保存中...',
                titleStyle: {
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#333',
                  textAlign: 'center',
                },
                setChildren: () => (
                  <LoadingIndicator style={{ marginTop: 15 }} />
                ),
              }),
            ),
          );
          dispatch(submitQuestionItemAction());
        }}
      />
    );
  }

  render() {
    return (
      <RootWrapper>
        {this.makeVerifyPaper()}
        {this.props.questionEditState !== 0 ? this.makeEditOrAddQuestion() : ''}
        <Alert
          properties={{
            buttonsType: '2-21',
            isOpen: this.props.getAlertShowOrHide,
            title: '系统提示',
            titleStyle: { fontSize: '20px', fontWeight: 600, color: '#333' },
            leftClick: () => this.props.changeAlertShowOrHide(false),
            rightClick: this.alertSureClick,
            child: ['取消', '确认'],
            buttonsIndent: 30,
          }}
        >
          <ChildWrapper>
            <p>是否确定退出？</p>
            <p>退出后将无法保存当前审核记录！</p>
          </ChildWrapper>
        </Alert>
      </RootWrapper>
    );
  }
}

PaperInputVerify.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pageState: PropTypes.number.isRequired, // 当前页是待审核还是已审核页面
  paperState: PropTypes.number.isRequired, // 页面状态
  notGetPaperCount: PropTypes.number.isRequired, // 未领取试卷数量
  hasGetPaperCount: PropTypes.number.isRequired, // 已领取试卷数量
  paperList: PropTypes.instanceOf(immutable.List).isRequired, // 表格数据列表
  changeAlertShowOrHide: PropTypes.func.isRequired, // 控制领取任务显示状态
  questionMsgList: PropTypes.instanceOf(immutable.List).isRequired, // 所有题目数据
  questionSelectedIndex: PropTypes.number.isRequired, // 当前选中的题号,
  previewImgSrc: PropTypes.string.isRequired, // 要预览的图片
  questionResult: PropTypes.instanceOf(immutable.List).isRequired, // 题目错误信息列表
  errTextareaShow: PropTypes.bool.isRequired, // 报错填写框显示状态
  questionsList: PropTypes.instanceOf(immutable.List).isRequired, // 题目信息列表
  questionTypeList: PropTypes.instanceOf(immutable.List).isRequired, // 所有题型列表
  changeSelectedQuestionIndex: PropTypes.func.isRequired, // 切换被点击的题目的题号
  changeErrTextareaShow: PropTypes.func.isRequired, // 切换报错填写框的显示
  changeQuestionResultState: PropTypes.func.isRequired, // 更换当前题目通过与否状态
  changeQuestionResult: PropTypes.func.isRequired, // 更新 questionResult
  changePreviewImgSrc: PropTypes.func.isRequired, // 切换预览图片
  getAlertShowOrHide: PropTypes.bool.isRequired, // 控制弹框出现
  changePageState: PropTypes.func.isRequired, // 切换当前页是待审核还是已审核页面
  realQuestionsCount: PropTypes.number.isRequired, // 实际上题目的数量
  questionResultState: PropTypes.number.isRequired, // 当前题目通过与否状态
  paperDownloadMsg: PropTypes.instanceOf(immutable.Map).isRequired, // 下载所需的参数
  dataIsGetting: PropTypes.bool.isRequired, // 加载数据中...
  paperNeedVerify: PropTypes.instanceOf(immutable.Map).isRequired, // 当前正在审核的试卷
  pageIndex: PropTypes.number.isRequired,
  showSubmitBtn: PropTypes.bool.isRequired,
  btnCanClick: PropTypes.bool.isRequired,
  questionEditState: PropTypes.number.isRequired,
  setNewQuestionData: PropTypes.func.isRequired,
  setQuestionsList: PropTypes.func.isRequired,
  clickTarget: PropTypes.string.isRequired,
  newQuestion: PropTypes.instanceOf(immutable.Map).isRequired,
};

const mapStateToProps = createStructuredSelector({
  PaperInputVerify: makeSelectPaperInputVerify(),
  pageState: makePageState(),
  paperState: makePaperState(),
  paperList: makePaperList(),
  notGetPaperCount: makeNotGetPaperCount(),
  hasGetPaperCount: makeHasGetPaperCount(),
  questionMsgList: makeQuestionMsgList(),
  questionSelectedIndex: makeQuestionSelectedIndex(),
  previewImgSrc: makePreviewImgSrc(),
  questionResult: makeQuestionResult(),
  errTextareaShow: makeErrTextareaShow(),
  questionsList: makeQuestionsList(),
  questionTypeList: makeQuestionTypeList(),
  getAlertShowOrHide: makeGetAlertShowOrHide(),
  realQuestionsCount: makeRealQuestionsCount(),
  questionResultState: makeQuestionResultState(),
  paperDownloadMsg: makePaperDownloadMsg(),
  dataIsGetting: makeDataIsGetting(),
  paperNeedVerify: makePaperNeedVerify(),
  pageIndex: makePageIndex(),
  showSubmitBtn: makeShowSubmitBtn(),
  btnCanClick: makeBtnCanClick(),
  questionEditState: makeQuestionEditState(),
  clickTarget: makeClickTarget(),
  newQuestion: makeNewQuestion(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    changeAlertShowOrHide: bol => dispatch(changeAlertShowOrHideAction(bol)),
    changeSelectedQuestionIndex: num =>
      dispatch(changeSelectedQuestionIndexAction(num)),
    changeErrTextareaShow: bol => dispatch(changeErrTextareaShowAction(bol)),
    changeQuestionResultState: num =>
      dispatch(changeQuestionResultStateAction(num)),
    changePreviewImgSrc: str => dispatch(changePreviewImgSrcAction(str)),
    changePageState: num => dispatch(changePageStateAction(num)),
    changeQuestionResult: item =>
      dispatch(changeQuestionResultAction(fromJS(item))),
    setNewQuestionData: item => dispatch(setNewQuestionMsgAction(item)),
    setQuestionsList: item => dispatch(setQuestionsListAction(item)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaperInputVerify);
