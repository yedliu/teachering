/*
 *
 * GetAndCutPaper
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import Helmet from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import immutable, { fromJS } from 'immutable';
// import Cropper from 'react-cropper';
// import 'cropperjs/dist/cropper.css';
// import Scroll from 'react-scroll';
import { FlexRowCenter, FlexColumn, FlexCenter } from 'components/FlexBox';
import { RootWrapper } from 'components/CommonFn/style';
import { formatDate, toString, paperStates, paperStatesControl } from 'components/CommonFn';
// import Button from 'components/Button';
import Table from 'components/Table';
import Alert from 'components/Alert';
import LoadingIndicator from 'components/LoadingIndicator';
import { Select, message } from 'antd';

import { setBackAlertStatesAction, changeBackPromptAlertShowAction } from 'containers/LeftNavC/actions';
import { makeDataIsGetting } from 'containers/LeftNavC/selectors';
// import { changeVerifyCodeAction, getVerifyCodeAction } from 'containers/Header/actions';
import 'lib/gt'; // 极验验证码第三方库

import {
  changePageStateAction,
  previewWrapperShowOrHideAction,
  changeSelectedQuestionIndexAction,
  changeImgSrcAction,
  getPaperMsgAction,
  changePageIndexAction,
  changePaperStateAction,
  changeAlertShowOrHideAction,
  changeCurrentPaperIdAction,
  getCutPaperTaskAction,
  changeNeedCutPaperAction,
  changeQuestionPreviewShowAction,
  changeIsSubmitIngAction,
  changeSortAction,
  backInitDataAction,
  changeSelectedQuestionTypeAction,
  changeSmallQuestionAction,
  saveQuestionListAction,
  setNeedCutPaperAction,
} from './actions';
import {
  makeQuestionsList,
  makeImgSrc,
  makePageState,
  makeAlertShowOrHide,
  makePaperList,
  makePaperCount,
  makePaperState,
  makePaperPreviewShow,
  makePreviewImgSrc,
  makeHasGetPaperCount,
  makeIsSubmitIng,
  makeAlertStates,
  makeQuestionTypeList,
  makeSelectedTquestionType,
  makeSmallQuestion,
  makeSelectedIndex,
  makePageIndex,
  makeCurrentPaperItem,
} from './selectors';
import CutPaperPage from './cutPaperPage';
import { receiveCut } from './server';
import { gtInit } from 'utils/gtInit';



/* const ChildWrapper = styled.div`
  font-size: 14px;
  &>p {
    line-height: 2em!important;
  }
`; */
const PaperPreview = styled(FlexColumn) `
  align-items: center;
  padding: 10px;
  max-width: 800px;
  max-height: 400px;
  background: #eee;
  overflow-y: auto;
`;
const PreviewWrapper = styled.div`
  border-top: 1px solid #ddd;
`;
const WeightQuestion = styled(FlexRowCenter) `
  height: 60px;
  min-height: 60px;
  // padding: 0 20px;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
`;
const QuestionItemType = styled(FlexRowCenter) `
  height: 100%;
  min-width: 200px;
  max-width: 400px;
  // padding-left: 20px;
`;
const QuestionItemValueText = styled.div`
  min-width: 80px;
  text-align: right;
  font-size: 16px;
`;
const TextValue = styled.p`
  margin: 0;
  font-size: 15px;
`;
// const RadioSelectBoxItem = styled(FlexRowCenter) ``;
/* const RadioSelectBox = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin: 0 10px;
  cursor: pointer;
  border: ${(props) => props.index === props.selectIndex ? '4px solid #ef414f' : '1px solid #ddd'};
`; */
const ErrorMsg = styled.div`
  padding: 10px;
  font-size: 14px;
  color: #999;
  font-family: Microsoft YaHei;
`;

const rowList = [{
  name: '试卷名称',
  scale: 4,
}, {
  name: '题目数量',
  scale: 1.1,
}, {
  name: '上传者',
  scale: '150px',
}, {
  name: '更新时间',
  scale: 1.5,
}, {
  name: '状态',
  scale: 1.5,
}, {
  name: '操作',
  scale: 2,
}];

const trItemList = ['paperName', 'questionCount', 'insertPerson', 'refleshTime', 'paperState', 'control'];


export class GetAndCutPaper extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.closeAlert = this.closeAlert.bind(this);
    this.alertSureClick = this.alertSureClick.bind(this);
    this.stateItem = this.stateItem.bind(this);
    this.changePage = this.changePage.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
    this.changeSmallType = this.changeSmallType.bind(this);
    this.verifySuccess = this.verifySuccess.bind(this);
    this.state = {
      addWayIndex: 1,
    };
    this.captchaObj = null;
  }

  componentDidMount() {
    this.verifyInit();
    // this.props.dispatch(getPaperMsgAction());
  }

  componentWillUnmount() {
    this.props.changePageState(0);
    this.props.dispatch(backInitDataAction());
  }

  // 极验验证码配置
  verifyInit() {
    // 请求配置接口
    gtInit().then((captchaObj) => {
      this.captchaObj = captchaObj;
      // 绑定验证成功失败事件
      this.captchaObj.onSuccess(this.verifySuccess);
      this.captchaObj.onError((e) => {
        message.error(e.message || '系统错误');
      });
    });
  }

  // 极验验证码成功后
  verifySuccess() {
    let result = this.captchaObj.getValidate();
    if (!result) {
      return message.error('请完成验证');
    }
    receiveCut({
      id: this.props.currentPaperItem,
      challenge: result.geetest_challenge,
      validate: result.geetest_validate,
      seccode: result.geetest_seccode,
    }).then((res) => {
      if (res.code !== '0') {
        return message.error(res.message || '系统异常');
      }
      // 重新请求试卷列表
      this.props.dispatch(getPaperMsgAction());
      // 调用该接口进行重置验证码
      this.captchaObj.reset();
    });
  }

  /**
   * 点击每一题题号时
   */
  questionItemIndexClick(index, i, countNum, item) {
    console.log(index, i, countNum, item);
    // console.time('questionItemIndexClick');
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
    // console.timeEnd('questionItemIndexClick');
    this.props.changeSelectedQuestionIndex(itemIndex);
  }

  /**
   * 点击弹框取消按钮
   * @param {*} e 事件对象
   */
  closeAlert() {
    this.props.dispatch(changeAlertShowOrHideAction(false));
  }

  /**
   * 点击弹框确定按钮
   * @param {*} e 事件对象
   */
  alertSureClick() {
    this.props.dispatch(getCutPaperTaskAction());
    // this.props.dispatch(changeAlertShowOrHideAction(false));
    // this.props.dispatch(getPaperMsgAction());
  }

  changePage(pageIndex, pageSize) {
    console.log(pageIndex, pageSize);
    this.props.dispatch(changePageIndexAction(pageIndex));
    setTimeout(() => {
      this.props.dispatch(getPaperMsgAction());
    }, 10);
  }

  headerItem() {
    return [{
      name: '待领取',
      num: this.props.paperCount,
    }, {
      name: '已领取',
      num: this.props.hasGetPaperCount,
    }];
  }

  stateItem() {
    const { dispatch, paperList, changePageState } = this.props;
    let res = [];
    const state = this.props.paperState || 0;
    if (state === 0) {
      res = [{ name: 'paperState', state: { 0: '待领取' }}, {
        name: 'control',
        state: { 0: '领取' },
        clickBack: (paperState, val, index, i) => {
          console.log(paperState, val, index, i);
          if (paperState === 0) {
            const paperItem = paperList.get(index);
            dispatch(changeCurrentPaperIdAction(paperItem.get('id')));
            this.captchaObj.verify();
            /* dispatch(changeCurrentPaperIdAction(paperItem.get('id')));
            dispatch(changeAlertShowOrHideAction(true));
            const verifyCode = fromJS({
              source: 'cutPaper',
              onOk: () => dispatch(getCutPaperTaskAction()),
              title: '领取切割任务',
            });
            dispatch(changeVerifyCodeAction('all', verifyCode));
            setTimeout(() => {
              dispatch(getVerifyCodeAction());
            }, 20); */
          }
        },
      }];
    } else if (state === 1) {
      res = [{
        name: 'paperState',
        state: Object.assign({}, paperStates, { 1: '待切割', 2: '已提交', 3: '切割未通过', 12: '审核中' })
      }, {
        name: 'control',
        state: Object.assign({}, paperStatesControl, { 1: '切割', 2: '— —', 3: '重新切割', 12: '— —' }),
        clickBack: (paperState, val, index, i) => {
          console.log(paperState, val, index, i);
          if (paperState === 1 || paperState === 3) {
            const id = paperList.get(index).get('id') || 0;
            if (id === -1) {
              message.error('警告，获取试卷信息错误');
              return;
            }
            dispatch(changeNeedCutPaperAction(id));
            dispatch(setNeedCutPaperAction(paperList.get(index)));
            changePageState(1);
          } else if (paperState === 2) {
            message.error('敬请期待功能开放');
          }
        },
      }];
    }
    return res;
  }

  removeQuestion(type, index1, i1) {
    const questionsList = this.props.questionsList;
    const selectedIndex = this.props.selectedIndex;
    const [index, i] = (index1 && i1) ? [index1, i1] : [selectedIndex.get('selectedBigIndex'), selectedIndex.get('selectedSmallIndex')];
    let newList = fromJS([]);
    if (type === 'big') {
      newList = questionsList.splice(index, 1);
    } else if (type === 'small') {
      const questionIndex = questionsList.get(index);
      const newChildren = questionIndex.get('children').splice(i, 1);
      newList = questionsList.set(index, questionIndex.set('children', newChildren));
      // console.log(questionIndex.toJS(), newChildren.toJS());
    }
    // console.log(newList.toJS(), 'newList -- 381');
    this.props.saveQuestionList(newList);
    this.props.changeSelectedQuestionIndex(0);
  }

  changeSmallType() {
    const questionsList = this.props.questionsList;
    const selectedIndex = this.props.selectedIndex;
    const selectedquestionType = this.props.selectedquestionType;
    const questionIndex = questionsList.get(selectedIndex.get('selectedBigIndex'));
    const indexChildren = questionIndex.get('children');
    const smallItem = indexChildren.get(selectedIndex.get('selectedSmallIndex'));
    const newSmallItem = smallItem.set('smallTypeId', selectedquestionType.get('id'));
    const newChildren = indexChildren.set(selectedIndex.get('selectedSmallIndex'), newSmallItem);
    const newQuestionIndex = questionIndex.set('children', newChildren);
    const newList = questionsList.set(selectedIndex.get('selectedBigIndex'), newQuestionIndex);
    this.props.saveQuestionList(newList);
  }

  render() {
    const tablebodydata = (this.props.paperList || fromJS([])).toJS().map((item) => {
      return {
        paperName: item.name || '该试卷未输入名称',
        questionCount: item.questionAmount || 0,
        insertPerson: item.createUserName || ' ',
        refleshTime: formatDate('yyyy-MM-dd', new Date(item.updatedTime || new Date())),
        paperState: item.state || 0,
        control: item.state || 0,
      };
    });
    // console.log(this.props.paperState, 'paperState -- 175');
    return (
      <RootWrapper>
        {this.props.pageState === 0 ? <Table
          source={'getandcutpaper'}
          trItemList={trItemList}  // 必填，每列中取的属性名，数组形式
          rowList={rowList}  // 必填，
          headerItem={fromJS(this.headerItem())} // 必填，头部切换页 item
          tablebodydata={fromJS(tablebodydata)}  // 必填
          stateItem={this.stateItem()}  // stateItem：具有不同状态的某一项数据，可以添加 click 事件
          paperState={this.props.paperState}
          changeReceiveState={(index) => {  // 点击头部状态时触发
            if (index !== this.props.paperState) {
              this.props.dispatch(changePageIndexAction(1));
            }
            this.props.dispatch(changePaperStateAction(index));
            setTimeout(() => {
              this.props.dispatch(getPaperMsgAction());
            }, 30);
          }}
          paperCount={this.props.paperState === 0 ? this.props.paperCount : this.props.hasGetPaperCount}  // 总试卷数量
          whoCanBeClick={[this.props.paperState || 0, 3]}  // 那个状态的可以点击
          changePageNum={this.changePage}
          orderItemsClick={(orderIndex) => {
            this.props.dispatch(changeSortAction(orderIndex));
          }}
          idLoading={this.props.dataIsGetting}
          pageIndex={this.props.pageIndex}
        /> : ''}
        {this.props.pageState === 1 ?
          <CutPaperPage
            isSubmit={this.props.isSubmit} changeIsSubmitIng={this.props.changeIsSubmitIng}
            paperState={this.props.paperState}
          /> : ''}
        {/* <Alert
          properties={{
            buttonsType: '2-21',
            isOpen: this.props.alertShowOrHide,
            title: '领取切割任务',
            titleStyle: { fontSize: '20px', fontWeight: 600, color: '#333' },
            leftClick: this.closeAlert,
            rightClick: this.alertSureClick,
            child: ['取消', '确认'],
            buttonsIndent: 30,
          }}
        ><ChildWrapper><p>是否确定领取试卷？</p><p>领取后任务将保存至已领取列表。</p></ChildWrapper></Alert> */}
        {this.props.paperPreviewShow ? <Alert
          properties={{
            isOpen: this.props.paperPreviewShow,
            title: '试题信息',
            rightClose: true,
            titleStyle: { textAlign: 'left', fontSize: '16px', color: '#333', fontWeight: 600 },
            buttonsType: '2-54',
            child: ['删除本题', '保存'],
            closeClick: () => {
              this.props.changeQuestionPreviewShow(false);
              this.props.changeSelectedQuestionIndex(0);
            },
            leftClick: () => {
              console.log('delete item');
              this.props.changeQuestionPreviewShow(false);
              // this.removeQuestion('small');
              this.props.setPromptAlertStates(fromJS({
                // buttonsType: '1',
                title: '删除小题',
                setChildren: () => (<FlexCenter
                  style={{ fontSize: 16, color: '#333', fontWeight: 600, height: 80 }}
                >确认要删除所选小题吗？</FlexCenter>),
                titleStyle: { fontSize: '20px', fontWeight: 600, color: '#333', textAlign: 'left' },
                leftClick: () => {
                  this.props.changePromptAlertShow(false);
                  this.props.changeSelectedQuestionIndex(0);
                },
                rightClick: () => {
                  this.props.changePromptAlertShow(false);
                  this.removeQuestion('small');
                  // this.props.changeSelectedQuestionIndex(0);
                },
              }));
              this.props.changePromptAlertShow(true);
            },
            rightClick: () => {
              console.log('save item');
              this.props.changeQuestionPreviewShow(false);
              // save opreate
              this.changeSmallType();
              this.props.changeSelectedQuestionIndex(0);
            },
          }}
        >
          <PreviewWrapper>
            <PaperPreview>
              <img src={this.props.previewImgSrc} alt="试卷预览" />
            </PaperPreview>
            <WeightQuestion>
              <QuestionItemType>
                <QuestionItemValueText>所属大题：</QuestionItemValueText><TextValue>{this.props.questionsList.get(this.props.selectedIndex.get('selectedBigIndex')).get('name')}</TextValue>
              </QuestionItemType>
              <QuestionItemType>
                <QuestionItemValueText>小题题号：</QuestionItemValueText><TextValue>{this.props.selectedIndex.get('itemIndex')}</TextValue>
              </QuestionItemType>
              <QuestionItemType>
                <QuestionItemValueText>小题题型：</QuestionItemValueText>
                <Select
                  labelInValue style={{ width: 200 }} value={{
                    key: toString(this.props.selectedquestionType.get('id')),
                    label: toString(this.props.selectedquestionType.get('name'))
                  }} onChange={(value) => {
                    const smallQuestionMsg = this.props.smallQuestion;
                    this.props.changeSelectedQuestionType(value);
                    this.props.changeSmallQuestion(smallQuestionMsg.set('questionTypeId', value.key));
                  }}
                >
                  {(this.props.questionTypeList || fromJS([])).map((it, i) => <Select.Option
                    key={toString(it.get('id'))} value={toString(it.get('id'))}
                  >{it.get('name')}</Select.Option>)}
                </Select>
              </QuestionItemType>
            </WeightQuestion>
            <QuestionItemType style={{ maxWidth: '100%', background: '#efefef', border: '1px solid #ddd' }}>
              {this.props.selectedIndex.get('smallItem').get('errReason') && this.props.selectedIndex.get('smallItem').get('errState') === 0 ?
                <ErrorMsg>{this.props.selectedIndex.get('smallItem').get('errReason')}</ErrorMsg> : ''}
            </QuestionItemType>
          </PreviewWrapper>
        </Alert> : ''}
        {this.props.isSubmit ? <Alert
          properties={Object.assign({
            // buttonsType: '1',
            // imgType: 'success',
            title: '试卷上传中...',
            isOpen: this.props.isSubmit,
            titleStyle: { textAlign: 'center', fontSize: '16px', color: '#333', fontWeight: 600 },
            child: ['知道了'],
            oneClick: () => {
              this.props.changeIsSubmitIng(false);
              this.props.changePageState(0);
              this.props.dispatch(backInitDataAction());
            },
          }, this.props.alertStates.toJS() || {})}
        >
          {this.props.alertStates.get('warningMsg') ? <FlexCenter>
            <div>{this.props.alertStates.get('warningMsg')}</div>
          </FlexCenter> : LoadingIndicator()}
        </Alert> : ''}
      </RootWrapper>
    );
  }
}

GetAndCutPaper.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pageState: PropTypes.number.isRequired,
  imgSrc: PropTypes.string.isRequired,
  questionsList: PropTypes.instanceOf(immutable.List).isRequired,
  changePageState: PropTypes.func.isRequired,  // 切换当前是领取时间还是进入切割试卷页面
  // previewWrapperShow: PropTypes.bool.isRequired,  // 当前是否显示切割预览状态
  previewWrapperShowOrHide: PropTypes.func.isRequired,  // 控制当前是否显示切割预览状态
  // questionMsgList: PropTypes.instanceOf(immutable.List).isRequired,  // 题目列表
  // questionSelectedIndex: PropTypes.number.isRequired,  // 当前选中的时第多少题
  changeSelectedQuestionIndex: PropTypes.func.isRequired,  // 切换当前选中的题号
  changeImgSrc: PropTypes.func.isRequired,  // 切换当前要切割的图片
  // currentCutPaperImg: PropTypes.string.isRequired,  // 当前题目切割下来的图片的 base64
  // changeCurrentCutPaperImg: PropTypes.func.isRequired, // 切换当前题目切割下来的图片的 base64
  alertShowOrHide: PropTypes.bool.isRequired,  // 显示或隐藏弹框
  paperList: PropTypes.instanceOf(immutable.List).isRequired,  // 试卷列表
  paperCount: PropTypes.number.isRequired,  // 未领取试卷总数
  paperState: PropTypes.number.isRequired,  // 查询未领取还是已领取
  paperPreviewShow: PropTypes.bool.isRequired,  // 预览框显示状态
  changeQuestionPreviewShow: PropTypes.func.isRequired,  // 切换预览框显示状态
  previewImgSrc: PropTypes.string.isRequired,  // 当前要预览的图片链接
  hasGetPaperCount: PropTypes.number.isRequired,  // 已领取试卷的总页数
  isSubmit: PropTypes.bool.isRequired,  // 是否正在提交中
  changeIsSubmitIng: PropTypes.func.isRequired,  // 改变正在提交的状态
  alertStates: PropTypes.instanceOf(immutable.Map).isRequired,  // 弹框状态对象
  dataIsGetting: PropTypes.bool.isRequired,  // 加载数据中...
  questionTypeList: PropTypes.instanceOf(immutable.List).isRequired,  // 所有题型
  selectedquestionType: PropTypes.instanceOf(immutable.Map).isRequired,  // 选中的题型
  changeSelectedQuestionType: PropTypes.func.isRequired,  // 切换题型
  changeSmallQuestion: PropTypes.func.isRequired,  // 保存小题信息
  smallQuestion: PropTypes.instanceOf(immutable.Map).isRequired,  // 小题信息
  selectedIndex: PropTypes.instanceOf(immutable.Map).isRequired,  // 选中的题目的大小提序号
  saveQuestionList: PropTypes.func.isRequired,  // 保存题目数量列表
  changePromptAlertShow: PropTypes.func.isRequired,
  setPromptAlertStates: PropTypes.func.isRequired,
  pageIndex: PropTypes.number.isRequired,
};

const mapStateToProps = createStructuredSelector({
  questionsList: makeQuestionsList(),
  imgSrc: makeImgSrc(),
  pageState: makePageState(),
  // previewWrapperShow: makePreviewShow(),
  // questionMsgList: makeQuestionMsgList(),
  // questionSelectedIndex: makeQuestionSelectedIndex(),
  // currentCutPaperImg: makeCurrentCutPaperImg(),
  alertShowOrHide: makeAlertShowOrHide(),
  paperList: makePaperList(),
  paperCount: makePaperCount(),
  paperState: makePaperState(),
  paperPreviewShow: makePaperPreviewShow(),
  previewImgSrc: makePreviewImgSrc(),
  hasGetPaperCount: makeHasGetPaperCount(),
  isSubmit: makeIsSubmitIng(),
  alertStates: makeAlertStates(),
  dataIsGetting: makeDataIsGetting(),
  questionTypeList: makeQuestionTypeList(),
  selectedquestionType: makeSelectedTquestionType(),
  smallQuestion: makeSmallQuestion(),
  selectedIndex: makeSelectedIndex(),
  pageIndex: makePageIndex(),
  currentPaperItem: makeCurrentPaperItem()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    changePageState: (num) => dispatch(changePageStateAction(num)),
    previewWrapperShowOrHide: (bol) => dispatch(previewWrapperShowOrHideAction(bol)),
    changeSelectedQuestionIndex: (num) => dispatch(changeSelectedQuestionIndexAction(num)),
    changeImgSrc: (str) => dispatch(changeImgSrcAction(str)),
    // changeCurrentCutPaperImg: (str) => dispatch(changeCurrentCutPaperImgAction(str)),
    changeQuestionPreviewShow: (bol) => dispatch(changeQuestionPreviewShowAction(bol)),
    changeIsSubmitIng: (bol) => dispatch(changeIsSubmitIngAction(bol)),
    changeSelectedQuestionType: (item) => dispatch(changeSelectedQuestionTypeAction(fromJS({
      id: item.key,
      name: item.label
    }))),
    changeSmallQuestion: (item) => dispatch(changeSmallQuestionAction(fromJS(item))),
    saveQuestionList: (item) => dispatch(saveQuestionListAction(fromJS(item))),
    changePromptAlertShow: (bol) => dispatch(changeBackPromptAlertShowAction(bol)),
    setPromptAlertStates: (item) => dispatch(setBackAlertStatesAction(item)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GetAndCutPaper);
