/* eslint-disable array-callback-return */
/*
 *
 * PaperCutVerify
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import Helmet from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import immutable, { fromJS } from 'immutable';
import styled from 'styled-components';
// import Cropper from 'react-cropper';
// import 'cropperjs/dist/cropper.css';
// import Scroll from 'react-scroll';
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
  downloadFile,
  paperStatesControl,
} from 'components/CommonFn';
import { RootWrapper, PlaceHolderBox } from 'components/CommonFn/style';
import PaperQuestionList from 'components/PaperQuestionList';
import Button from 'components/Button';
import Alert from 'components/Alert';
// import { AppLocalStorage } from 'utils/localStorage';
// import { AjaxUpload } from 'components/CommonFn';
// import messages from './messages';
// import { makeDataIsGetting } from 'containers/LeftNavC/selectors';
import {
  makeDataIsGetting,
  makeBtnCanClick,
} from 'containers/LeftNavC/selectors';
import { changeBtnCanClickAction } from 'containers/LeftNavC/actions';
import { message, Modal } from 'antd';
import {
  changePageStateAction,
  changeImgSrcAction,
  getPaperMsgAction,
  changePaperStateAction,
  changeAlertShowOrHideAction,
  changeNeedVerifyPaperAction,
  changeSelectedQuestionIndexAction,
  changeQuestionListAction,
  changeQuestionMsgListAction,
  changePreviewImgSrcAction,
  getAllQuestionTypeListAction,
  changeErrTextareaShowAction,
  changeQuestionResultAction,
  changeQuestionResultStateAction,
  submitQuestionCutVerifyAction,
  changePageIndexAction,
  changeSortAction,
  initVerifyDataAction,
  changeShowSubmitBtnAction,
  changeRealQuestionsCountAction,
  changeCurrentPaperItemAction,
  setPaperDownloadMsgAction,
  changeNeedVerifyPaperItemAction,
} from './actions';
import {
  makePageState,
  makeImgSrc,
  makeGetAlertShowOrHide,
  makePaperState,
  makePaperList,
  makeNotGetPaperCount,
  makeHasGetPaperCount,
  makeQuestionSelectedIndex,
  makeQuestionsList,
  makeCurrentPaperItem,
  makeQuestionMsgList,
  makePreviewImgSrc,
  makeErrTextareaShow,
  makeQuestionTypeList,
  makeQuestionResult,
  makeRealQuestionsCount,
  makeQuestionResultState,
  makePaperDownloadMsg,
  makePageIndex,
  makeShowSubmitBtn,
  makePageSize,
} from './selectors';
import { preAuditCut } from './server';
import { gtInit } from 'utils/gtInit';

const CutPaperWrapper = styled(FlexColumn)`
  height: 100%;
  width: 100%;
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
  height: 620px;
  min-height: 200px;
  padding: 5px;
  border-bottom: 1px solid #ddd;
`;
const QuestionPreviewScroll = styled.div`
  flex: 1;
  text-align: center;
  overflow-y: auto;
`;
const QuestionPreview = styled.img`
  max-width: 100%;
  height: auto;
`;
const QuestionMsg = styled.div`
  // height: 200px;
  min-height: 70px;
  // overflow-y: auto;
`;
const ChildWrapper = styled.div`
  font-size: 14px;
  & > p {
    line-height: 2em !important;
  }
`;
const QuestionMsgWrapper = styled(FlexRowCenter)`
  height: 40px;
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
  height: 50px;
  font-size: 16px;
  padding-right: 20px;
`;
const ErrDescriptWrapper = styled(FlexColumn)`
  flex: 1;
  min-height: 120px;
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
  padding-top: 10px;
`;
const ErrTextDescription = styled.textarea`
  width: 460px;
  height: 90%;
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

const trItemList = [
  'paperName',
  'questionCount',
  'insertPerson',
  'refleshTime',
  'paperState',
  'control',
];

export class PaperCutVerify extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.submitClick = this.submitClick.bind(this);
    this.alertSureClick = this.alertSureClick.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.stateItem = this.stateItem.bind(this);
    this.questionItemIndexClick = this.questionItemIndexClick.bind(this);
    this.textareaInput = this.textareaInput.bind(this);
    this.preQuestionClick = this.preQuestionClick.bind(this);
    this.nextQuestionClick = this.nextQuestionClick.bind(this);
    this.verifyTextarea = this.verifyTextarea.bind(this);
    this.changePreviewImg = this.changePreviewImg.bind(this);
    this.changePage = this.changePage.bind(this);
    this.keyDownEvent = this.keyDownEvent.bind(this);
    this.verifyMe = this.verifyMe.bind(this);
    this.getTypeId = this.getTypeId.bind(this);
    this.verifySuccess = this.verifySuccess.bind(this);
    this.state = {
      paper: null,
    };
    // this.state = {
    //   showSubmitBtn: false,
    // };
    this.captchaObj = null;
  }

  componentWillMount() {
    // this.props.dispatch(getPaperMsgAction());
    this.props.dispatch(getAllQuestionTypeListAction());
    // 极验验证码配置
    this.verifyInit();
  }

  // componentDidMount() {

  // }
  // componentWillUnmount() {

  // }
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
    preAuditCut({
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
      // this.props.dispatch(changeNeedVerifyPaperAction(paperItem))
      this.props.dispatch(changeNeedVerifyPaperItemAction(this.state.paper)); // 设置为当前试卷
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
          questionMsgList.push({
            bigNum: item.serialNumber,
            bigName: item.name,
            picUrl: it.questionOutputDTO.picUrl,
            questionTypeId: it.questionOutputDTO.typeId,
            serialNumber: it.serialNumber,
          });
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
      dispatch(changeCurrentPaperItemAction(fromJS(data)));
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
    if (state === 2) {
      res = [
        { name: 'paperState', state: { 2: '待审核', 12: '审核未完成' }},
        {
          name: 'control',
          state: { 2: '审核', 12: '重新审核' },
          clickBack: (paperState, val, index, i) => {
            // console.log(paperState, val, index, i, 'stateItem - paperState');
            if (paperState === 2) {
              this.captchaObj.verify();
              const paperItem = this.props.paperList.get(index);
              this.setState({
                paper: paperItem,
              });
              /* const verifyCode = fromJS({
              source: 'cutPaperVerify',
              onOk: () => {
                const paperItem = this.props.paperList.get(index);  // 获取该试卷数据
                this.props.dispatch(changeNeedVerifyPaperAction(paperItem));  // 设置为当前试卷
              },
              title: '领取切割审核任务',
            });
            dispatch(changeVerifyCodeAction('all', verifyCode));
            setTimeout(() => {
              dispatch(getVerifyCodeAction());
            }, 20); */
            } else if (paperState === 12) {
              const paperItem = this.props.paperList.get(index); // 获取该试卷数据
              this.props.dispatch(changeNeedVerifyPaperAction(paperItem)); // 设置为当前试卷
            }
          },
        },
      ];
    } else if (state === 3) {
      res = [
        {
          name: 'paperState',
          state: Object.assign({}, paperStates, {
            3: '审核未通过',
            4: '审核通过',
          }),
        },
        {
          name: 'control',
          state: Object.assign({}, paperStatesControl, { 3: '— —', 4: '— —' }),
          clickBack: (paperState, val, index, i) => {
            // console.log(paperState, val, index, i, 'stateItem - paperState');
            if (paperState === 3 || paperState === 4) {
              // const paperItem = this.props.paperList.get(index).toJS();  // 获取该试卷数据
              message.warning('敬请期待功能开放');
            }
          },
        },
      ];
    }
    return res;
  }

  submitClick() {
    const questionResult = this.props.questionResult.toJS();
    const hasNotVerify = questionResult.filter(item => item.errState === -1);
    if (hasNotVerify.length > 0) {
      message.warning('请将试卷审核完再提交');
      return;
    }
    const lastQuestion = questionResult[questionResult.length - 1];
    if (lastQuestion.errState === 0 && lastQuestion.errReason === '') {
      message.warning('错误内容不可以为空');
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

  /**
   * 弹框确定按钮
   */
  alertSureClick() {
    this.props.changeAlertShowOrHide(false);
    this.props.changePageState(0);
    this.props.dispatch(initVerifyDataAction());
    this.props.dispatch(changeShowSubmitBtnAction(false));
    this.props.dispatch(changePageIndexAction(1));
    // this.setState({ showSubmitBtn: false });
    setTimeout(() => {
      this.props.dispatch(getPaperMsgAction());
    }, 30);
    document.removeEventListener('keydown', this.keyDownEvent);
  }

  /**
   * 弹框取消按钮
   */
  closeAlert() {
    this.props.changeAlertShowOrHide(false);
  }

  questionItemIndexClick(index, i, countNum, item) {
    // console.time('questionItemIndexClick');
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
    if (questionIndex === itemIndex) return;
    // console.log(index, i, itemIndex, countNum, questionIndex, item);
    const questionResult = this.props.questionResult;
    // if (itemIndex != 1 && questionResult.get(itemIndex - 2).get('errState') === -1) {
    //   if (questionResult.get(itemIndex - 1).get('errState') === 0 && questionResult.get(itemIndex - 1).get('errReason') === '') {
    //     alert('错误内容不可以为空');
    //   }
    //   alert('请选择审核通过/不通过');
    //   return;
    // } else
    const itemResult = questionResult.get(i);
    const beforeItem = questionResult.get(questionIndex - 1);
    // console.log(questionResult.toJS(), itemResult.toJS(), i, i - 1, '哈哈哈');
    if (
      itemResult.get('errState') === 0 &&
      itemResult.get('errReason') === ''
    ) {
      message.warning('错误内容不可以为空');
      return;
    } else if (
      itemIndex !== 1 &&
      questionResult.get(itemIndex - 2).get('errState') === -1
    ) {
      // if (questionResult.get(itemIndex - 1).get('errState') === 0 && questionResult.get(itemIndex - 1).get('errReason') === '') {
      //   alert('错误内容不可以为空');
      // }
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

  textareaInput(e) {
    // console.log(e.target.value, 'value -- 240');
    // console.log(this.props.questionResult.get(this.props.questionSelectedIndex - 1).get('errReason'), ' ------------------------- 503');
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
    // console.log(this.props.questionResult.get(this.props.questionSelectedIndex - 1).toJS(), 'this.props.questionResultItem');
  }

  changePreviewImg(index) {
    const previewImg =
      this.props.questionMsgList.get(index).get('picUrl') || '';
    this.props.changePreviewImgSrc(previewImg); // 设置预览图片
  }

  changePage(pageIndex, pageSize) {
    // console.log(pageIndex, pageSize);
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
    // const questionResult = this.props.questionResult;
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
    // console.log(questionIndex, this.props.realQuestionsCount, 'number -- 357');
    if (questionIndex < this.props.realQuestionsCount) {
      this.verifyTextarea(questionIndex, questionIndex + 1);
    } else {
      const modal = Modal.success({
        title: '审核完毕',
        content: '您可以点击右上角提交按钮提交改试卷！',
      });
      this.props.dispatch(changeShowSubmitBtnAction(true));
      // this.setState({ showSubmitBtn: true });
      setTimeout(() => modal.destroy(), 2000);
    }
  }

  verifyTextarea(questionIndex, index) {
    const questionResult = this.props.questionResult;
    if (
      questionResult.get(questionIndex - 1).get('errState') === -1 &&
      index > questionIndex
    ) {
      // if (questionIndex === index) {
      //   alert('只能查看已经审核过的题目');
      // }
      message.warning('请选择审核通过/不通过');
      return;
    } else if (questionResult.get(questionIndex - 1).get('errState') === 0) {
      if (questionResult.get(questionIndex - 1).get('errReason') === '') {
        message.warning('错误内容不可以为空');
        return;
      }
    }
    this.props.changeSelectedQuestionIndex(index);
    if (questionResult.get(index - 1).get('auditResult')) {
      this.props.changeErrTextareaShow(false);
      this.scrollDom.style.height = '620px';
    } else {
      this.props.changeErrTextareaShow(true);
      this.scrollDom.style.height = '435px';
    }
    // console.log(questionResult.toJS(), questionIndex, index);
    this.props.changeQuestionResultState(
      questionResult.get(index - 1).get('errState'),
    );
    if (questionIndex !== index) this.changePreviewImg(index - 1);
  }

  verifyMe(type) {
    const questionIndex = this.props.questionSelectedIndex - 1;
    const questionResult = this.props.questionResult.toJS();
    const errItem = questionResult[questionIndex];
    if (type === 'err') {
      errItem.auditResult = false;
      errItem.errState = 0;
      questionResult[questionIndex] = errItem;
      this.props.changeQuestionResult(questionResult);
      this.props.changeErrTextareaShow(true);
      this.scrollDom.style.height = '435px';
      this.props.changeQuestionResultState(0);
    } else if (type === 'right') {
      errItem.auditResult = true;
      errItem.errReason = '';
      errItem.errState = 1;
      questionResult[questionIndex] = errItem;
      this.props.changeQuestionResult(questionResult);
      this.props.changeErrTextareaShow(false);
      this.scrollDom.style.height = '620px';
      this.props.changeQuestionResultState(1);
      setTimeout(() => {
        this.nextQuestionClick();
      }, 30);
    }
  }

  getTypeId(currentQuestion) {
    const idItemList = this.props.questionTypeList.filter(
      item => item.get('id') === Number(currentQuestion.get('questionTypeId')),
    );
    // log(idItemList.toJS(), 'idItemList -- idItemList');
    let res = '';
    if (idItemList.count() > 0) {
      res = idItemList.get(0).get('name');
    } else {
      res = <span style={{ color: 'red' }}>题目类型丢失，请打回重新切割</span>;
    }
    // log(res, 'question type');
    return res;
  }

  render() {
    const { pageSize } = this.props;
    const tablebodydata = (this.props.paperList || fromJS([]))
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
          paperState: item.state || 2,
          control: item.state || 2,
        };
      });
    const questionMsgList = this.props.questionMsgList || fromJS([]);
    const questionIndex = this.props.questionSelectedIndex - 1;
    const currentQuestion = questionMsgList.get(questionIndex);
    return (
      <RootWrapper>
        {this.props.pageState === 0 ? (<Table
          source={'papercutverify'}
          trItemList={trItemList}  // 必填，每列中取的属性名，数组形式
          rowList={rowList}  // 必填，
          headerItem={fromJS(this.headerItem())} // 必填，头部切换页 item
          tablebodydata={fromJS(tablebodydata)}  // 必填
          stateItem={this.stateItem()}  // stateItem：具有不同状态的某一项数据，可以添加 click 事件
          paperState={this.props.paperState - 2}
          changeReceiveState={(index) => {
            // console.log(index + 2, 'index');
            this.props.dispatch(changePageIndexAction(1));
            if (index === 1) {
              this.props.dispatch(changePaperStateAction(3));
            } else {
              this.props.dispatch(changePaperStateAction(2));
            }
            setTimeout(() => {
              this.props.dispatch(getPaperMsgAction());
              document.addEventListener('keydown', this.keyDownEvent);
            }, 30);
          }}
          paperCount={this.props.paperState === 2 ? this.props.notGetPaperCount : this.props.hasGetPaperCount}  // 总试卷数量
          whoCanBeClick={this.props.paperState === 2 ? [2, 12] : []}  // 哪个状态的可以点击
          changePageNum={this.changePage}
          orderItemsClick={(orderIndex) => {
            this.props.dispatch(changeSortAction(orderIndex));
          }}
          idLoading={this.props.dataIsGetting}
          pageIndex={this.props.pageIndex}
          pageSize={pageSize}
        />) : ''}
        {this.props.pageState === 1 ? (<CutPaperWrapper>
          <TopButtonsBox>
            <Button showtype={6} onClick={() => this.props.changeAlertShowOrHide(true)}>{'<'} 返回</Button>
            <PlaceHolderBox></PlaceHolderBox>
            <Button
              showtype={5} onClick={() => {
                downloadFile({
                  fileUrl: this.props.paperDownloadMsg.get('fileUrl'),
                  fileName: this.props.paperDownloadMsg.get('fileName')
                }, this.props.dispatch);
              }}
            >下载本试卷</Button>
            {this.props.showSubmitBtn ? (this.props.btnCanClick ?
              <Button showtype={4} style={{ marginLeft: 20 }} onClick={this.submitClick}>提交</Button> :
              <Button style={{ marginLeft: 20 }} showtype={8}>提交</Button>) : ''}
          </TopButtonsBox>
          <PaperWrapper>
            <PaperWrapperBox>
              <ImageCutWrapper innerRef={el => { this.scrollDom = el }}>
                <QuestionPreviewScroll>
                  <QuestionPreview src={this.props.previewImgSrc} />
                </QuestionPreviewScroll>
              </ImageCutWrapper>
              <QuestionMsg>
                <QuestionMsgWrapper>
                  <BigQuestionWrapper>
                    <BigName>{`大题编号与名称：${numberToChinese(currentQuestion.get('bigNum'))}、${currentQuestion.get('bigName')}`}</BigName>
                  </BigQuestionWrapper>
                  <SmallQuestionWrapper>
                    <SmallNum>题号：{currentQuestion.get('serialNumber')}</SmallNum>
                    <SmallType>题型：{this.getTypeId(currentQuestion)}</SmallType>
                  </SmallQuestionWrapper>
                </QuestionMsgWrapper>
                <ButtonsWrapper>
                  <PlaceHolderBox />
                  {<QuestionRightWrapper
                    // onClick={() => {
                    //   const errItem = questionResult[questionIndex];
                    //   errItem.auditResult = false;
                    //   errItem.errState = 0;
                    //   questionResult[questionIndex] = errItem;
                    //   this.props.changeQuestionResult(questionResult);
                    //   this.props.changeErrTextareaShow(true);
                    //   this.scrollDom.style.height = '435px';
                    //   this.props.changeQuestionResultState(0);
                    // }}
                    onClick={() => this.verifyMe('err')}
                  ><QuestionRadiusBox
                    me={'err'}
                    right={this.props.questionResultState}
                  /><span>审核不通过</span></QuestionRightWrapper>}
                  <QuestionRightWrapper
                    // onClick={() => {
                    //   const errItem = questionResult[questionIndex];
                    //   errItem.auditResult = true;
                    //   errItem.errReason = '';
                    //   errItem.errState = 1;
                    //   questionResult[questionIndex] = errItem;
                    //   this.props.changeQuestionResult(questionResult);
                    //   this.props.changeErrTextareaShow(false);
                    //   this.scrollDom.style.height = '620px';
                    //   this.props.changeQuestionResultState(1);
                    //   setTimeout(() => {
                    //     this.nextQuestionClick();
                    //   }, 30);
                    // }}
                    onClick={() => this.verifyMe('right')}
                  ><QuestionRadiusBox
                    me={'right'}
                    right={this.props.questionResultState}
                  /><span>审核通过</span></QuestionRightWrapper>
                </ButtonsWrapper>
              </QuestionMsg>
              {this.props.errTextareaShow ? <ErrDescriptWrapper>
                <ErrMsgWrapper>
                  <ErrMsgTitleValue>填写错误描述：</ErrMsgTitleValue>
                  <Textarea><ErrTextDescription
                    value={this.props.questionResult.get(questionIndex).get('errReason')}
                    innerRef={x => { this.errInputArea = x }}
                    onKeyDown={(e) => {
                      if (e.ctrlKey && e.key === 'Enter') {
                        // console.log(e.ctrlKey, e.key, 'eee --- eee');
                        this.nextQuestionClick();
                      }
                    }} onChange={this.textareaInput}
                  ></ErrTextDescription></Textarea>
                </ErrMsgWrapper>
              </ErrDescriptWrapper> : ''}
              <QuestionChangeButtons>
                {/* <Button showtype={5} style={{ margin: '0 50px' }} onClick={this.preQuestionClick}>上一题</Button>
                <Button showtype={4} style={{ margin: '0 50px' }} onClick={this.nextQuestionClick}>下一题</Button> */}
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
              source={'papercutverify'}
              questionsList={this.props.questionsList}
              questionSelectedIndex={this.props.questionSelectedIndex}
              questionItemIndexClick={this.questionItemIndexClick}
              toSeePaperMsg={() => {
                return {
                  name: this.props.currentPaperItem.get('name'),
                  questionCount: this.props.currentPaperItem.get(
                      'questionAmount',
                    ),
                  realQuestionsCount: this.props.realQuestionsCount,
                };
              }}
              othersData={{
                questionResult: this.props.questionResult,
              }}
            />
          </PaperWrapper>
        </CutPaperWrapper>
        ) : (
          ''
        )}
        <Alert
          properties={{
            buttonsType: '2-21',
            isOpen: this.props.getAlertShowOrHide,
            title: '系统提示',
            titleStyle: { fontSize: '20px', fontWeight: 600, color: '#333' },
            leftClick: this.closeAlert,
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

PaperCutVerify.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pageState: PropTypes.number.isRequired, // 当前页是待审核还是已审核页面
  changePageState: PropTypes.func.isRequired, // 切换当前页是待审核还是已审核页面
  // questionsList: ...
  questionSelectedIndex: PropTypes.number.isRequired, // 当前选中的题号
  imgSrc: PropTypes.string.isRequired, // 当前显示图片的 src
  changeImgSrc: PropTypes.func.isRequired, // 切换当前显示的图片的 src
  getAlertShowOrHide: PropTypes.bool.isRequired, // 控制弹框出现
  changeAlertShowOrHide: PropTypes.func.isRequired, // 控制领取任务显示状态
  paperState: PropTypes.number.isRequired, // 页面状态
  paperList: PropTypes.instanceOf(immutable.List).isRequired, // 表格数据列表
  notGetPaperCount: PropTypes.number.isRequired, // 未领取试卷数量
  hasGetPaperCount: PropTypes.number.isRequired, // 已领取试卷数量
  changeSelectedQuestionIndex: PropTypes.func.isRequired, // 切换被点击的题目的题号
  questionsList: PropTypes.instanceOf(immutable.List).isRequired, // 题目信息列表
  changeQuestionList: PropTypes.func.isRequired, // 设置大题信息列表
  changeQuestionMsgList: PropTypes.func.isRequired, // 设置所有题目数据
  questionMsgList: PropTypes.instanceOf(immutable.List).isRequired, // 所有题目数据
  currentPaperItem: PropTypes.instanceOf(immutable.Map).isRequired, // 当前正在审核的试卷
  changePreviewImgSrc: PropTypes.func.isRequired, // 切换预览图片
  previewImgSrc: PropTypes.string.isRequired, // 要预览的图片
  errTextareaShow: PropTypes.bool.isRequired, // 报错填写框显示状态
  changeErrTextareaShow: PropTypes.func.isRequired, // 切换报错填写框的显示
  questionTypeList: PropTypes.instanceOf(immutable.List).isRequired, // 所有题型列表
  questionResult: PropTypes.instanceOf(immutable.List).isRequired, // 题目错误信息列表
  changeQuestionResult: PropTypes.func.isRequired, // 更新 questionResult
  realQuestionsCount: PropTypes.number.isRequired, // 实际上题目的数量
  changeQuestionResultState: PropTypes.func.isRequired, // 更换当前题目通过与否状态
  questionResultState: PropTypes.number.isRequired, // 当前题目通过与否状态
  paperDownloadMsg: PropTypes.instanceOf(immutable.Map).isRequired, // 下载所需的参数
  dataIsGetting: PropTypes.bool.isRequired, // 加载数据中...
  pageIndex: PropTypes.number.isRequired,
  showSubmitBtn: PropTypes.bool.isRequired,
  btnCanClick: PropTypes.bool.isRequired,
  pageSize: PropTypes.number.isRequired,
};

const mapStateToProps = createStructuredSelector({
  pageState: makePageState(),
  imgSrc: makeImgSrc(),
  getAlertShowOrHide: makeGetAlertShowOrHide(),
  paperState: makePaperState(),
  paperList: makePaperList(),
  notGetPaperCount: makeNotGetPaperCount(),
  hasGetPaperCount: makeHasGetPaperCount(),
  questionSelectedIndex: makeQuestionSelectedIndex(),
  questionsList: makeQuestionsList(),
  currentPaperItem: makeCurrentPaperItem(),
  questionMsgList: makeQuestionMsgList(),
  previewImgSrc: makePreviewImgSrc(),
  errTextareaShow: makeErrTextareaShow(),
  questionTypeList: makeQuestionTypeList(),
  questionResult: makeQuestionResult(),
  realQuestionsCount: makeRealQuestionsCount(),
  questionResultState: makeQuestionResultState(),
  paperDownloadMsg: makePaperDownloadMsg(),
  dataIsGetting: makeDataIsGetting(),
  pageIndex: makePageIndex(),
  showSubmitBtn: makeShowSubmitBtn(),
  btnCanClick: makeBtnCanClick(),
  pageSize: makePageSize(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    changePageState: num => dispatch(changePageStateAction(num)),
    changeImgSrc: src => dispatch(changeImgSrcAction(src)),
    changeAlertShowOrHide: bol => dispatch(changeAlertShowOrHideAction(bol)),
    changeSelectedQuestionIndex: num =>
      dispatch(changeSelectedQuestionIndexAction(num)),
    changeQuestionList: item =>
      dispatch(changeQuestionListAction(fromJS(item))),
    changeQuestionMsgList: item =>
      dispatch(changeQuestionMsgListAction(fromJS(item))),
    changePreviewImgSrc: str => dispatch(changePreviewImgSrcAction(str)),
    changeErrTextareaShow: bol => dispatch(changeErrTextareaShowAction(bol)),
    changeQuestionResult: item =>
      dispatch(changeQuestionResultAction(fromJS(item))),
    changeQuestionResultState: num =>
      dispatch(changeQuestionResultStateAction(num)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaperCutVerify);
