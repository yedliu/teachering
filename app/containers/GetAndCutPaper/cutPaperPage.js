import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import Helmet from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import immutable, { fromJS } from 'immutable';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
// import Scroll from 'react-scroll';
import { FlexRow, FlexRowCenter, FlexColumn, FlexCenter } from 'components/FlexBox';
import { PlaceHolderBox } from 'components/CommonFn/style';
import { formatDate, fetchUpdateImg, numberToChinese, downloadFile, toNumber, toString } from 'components/CommonFn';
import Button from 'components/Button';
import Config from 'utils/config';
import PaperPreview from 'components/PaperPreview';
import PaperQuestionList from 'components/PaperQuestionList';
import Alert from 'components/Alert';
import { message, Select, Input, Modal } from 'antd';
import { makeBtnCanClick } from 'containers/LeftNavC/selectors';
import { changeBtnCanClickAction, setBackAlertStatesAction, changeBackPromptAlertShowAction } from 'containers/LeftNavC/actions';

import {
  changePageStateAction, previewWrapperShowOrHideAction, changeSelectedQuestionIndexAction,
  changeImgSrcAction, changeCurrentCutPaperImgAction, getCutPaperItemAction, getAllQuestionTypeListAction,
  changeSelectedQuestionTypeAction, changeBigQuestionAction, changeSmallQuestionAction, saveQuestionMsgListAction,
  saveQuestionListAction, changeQuestionPreviewShowAction, changePreviewImgSrcAction, changePaperPreviewShowAction,
  submitCutPaperAction, backInitDataAction, changeImgStartIndexAction,
  setSelectBigQuestionAction, setSelectedIndexAction, setSelectedInsertIndexAction, changeBigQuestiolnMsgShowAction,
  setEditorBigQuestionAction,
  changeBigPicIndexAction,
  addBigImgAction,
} from './actions';
import {
  makeQuestionsList, makeImgSrc, makePageState, makePreviewShow, makePicUrlList, makeQuestionTypeList,
  makeQuestionSelectedIndex, makeCurrentCutPaperImg, makeSelectedTquestionType,
  makeSmallQuestion, makePreviewPaperMsgShow, makePaperIsBeCutItem, makeImgStartIndex, makeImgStep,
  makeImgCountCritical, makeSelectedBigQuestion, makeSelectedIndex, makeSetBigQuestionMsgShow,
  makleSelectedInsertIndex,
  makeEditorBigQuestion,
  makePicInputDTOList,
  makeBigPicIndex,
  makeNeedCutPaperId,
  makeNeedCutPaperMsg,
} from './selectors';

// import messages from './messages';
import { loadImage } from './loadImages';
const loading = window._baseUrl.imgCdn + '02f36e7d-35d2-4a79-a407-847ed60a6923.gif';

const CutPaperWrapper = styled(FlexColumn) `
  height: 100%;
  width: 100%;
`;
const TopButtonsBox = styled(FlexRowCenter) `
  height: 50px;
  background: #fff;
  padding: 0 10px;
`;
const PaperWrapper = styled(FlexRow) `
  flex: 1;
  padding: 15px 0;
  background: #eee;
`;
// 左边
const PaperWrapperBox = styled(FlexColumn) `
  flex: 1;
  margin: 0 10px;
  background: white;
`;
const ImageCutWrapper = styled.div`
  flex: 1;
  position: relative;
  overflow-y: auto;
`;
const CutButtonWrapper = styled(FlexCenter) `
  height: 80px;
  padding: 20px;
`;
const Canvas = styled.canvas`
  display: none;
`;
/* const ShowPaperWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .3);
`; */
const PaperMsgPreviewWrapper = styled(FlexColumn) `
  width: 400px;
  max-width: 800px;
  height: 400px;
  max-height: 550px;
  padding: 0 10px;
  background: rgba(44, 44, 44, 0.3);
  overflow-y: auto;
`;
const BigQuestinBox = styled(FlexColumn) `
  margin-top: 20px;
`;
const BigQuestionTitle = styled(FlexRowCenter) `
  font-size: 16px;
  color: #333;
  font-weight: 600;
  font-family: Microsoft YaHei;
`;
/* const SmallQuestionWrapper = styled(FlexColumn) `
  text-indent: 2em;
`; */
const SmallQuestionMsgBox = styled(FlexRowCenter) `
  line-height: 24px;
  min-height: 24px;
  margin-left: 20px;
`;
const SmallQuestionItem = styled.span``;
const BigQuestionMsgBox = styled.div`
  width: 100%;
`;
const InputItem = styled(FlexRowCenter) `
  font-size: 16px;
  color: #333;
  font-weight: 600;
  font-family: Microsoft Yahei;
  padding: 10px 0;
`;
const BigQuestionIndex = styled(InputItem) ``;
const BigQuestionTitleBox = styled(InputItem) ``;
const TextValue = styled.p`
  font-family: Microsoft Yahei;
  margin: 0;
  min-width: ${(props) => (props.minWidth ? props.minWidth : 0)}px;
`;

let timer = null;
let timer1 = null;

export class CutPaperPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.cutPaperClick = this.cutPaperClick.bind(this);
    this.QuestionItemCutSure = this.QuestionItemCutSure.bind(this);
    this.questionItemIndexClick = this.questionItemIndexClick.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.canvasImgs = this.canvasImgs.bind(this);
    this.previewImg = this.previewImg.bind(this);
    this.seePaperMsg = this.seePaperMsg.bind(this);
    this.submitClick = this.submitClick.bind(this);
    this.lazyLoadImgs = this.lazyLoadImgs.bind(this);
    this.nextCutImg = this.nextCutImg.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
    this.selectQuestionAndType = this.selectQuestionAndType.bind(this);
    this.upLoadCutImg = this.upLoadCutImg.bind(this);
    this.wantAddQuestion = this.wantAddQuestion.bind(this);
    this.getTypeId = this.getTypeId.bind(this);
    this.cropperChange = this.cropperChange.bind(this);
    this.resetCropBoxData = this.resetCropBoxData.bind(this);
    this.state = {
      isAddOrEdit: {
        addBig: true,
        oldBigMsg: {},
        addSmall: true,
      },
      editorAlertMsg: {
        title: '新增大题',
        buttonsType: '1',
      },
      smallQuestionPicData: {},
    };
  }
  componentWillMount() {
    console.time('CutPaperPage');
    this.props.dispatch(getAllQuestionTypeListAction());
  }
  componentDidMount() {
    this.props.dispatch(getCutPaperItemAction());
    const questionsList = this.props.questionsList;
    this.props.dispatch(setEditorBigQuestionAction(this.props.editorBigQuestion.set(fromJS({ name: toString(questionsList.count() + 1), id: toString(questionsList.count() + 1), value: '' }))));
    setTimeout(() => {
      const width = window.getComputedStyle(this.cropper.cropper.container, null).getPropertyValue('width');
      this.canvas.width = Number(width.replace(/[a-zA-Z]./g, ''));
      this.canvasImgs();
      console.timeEnd('CutPaperPage');
    }, 400);
  }
  componentWillUnmount() {
    clearTimeout(timer);
    clearTimeout(timer1);
    clearTimeout(this.timer3);
  }
  resetCropBoxData() {
    this.timer3 = setTimeout(() => {
      this.cropper.setCropBoxData({
        top: 10,
        left: 100,
        width: 300,
        height: 200,
      });
    }, 500);
  }
  /**
   * 图片的翻页加载
   * @param {*} startIndex 渲染的开始页数
   * @param {*} endIndex 渲染的结束页数
   */
  lazyLoadImgs(startIndex, stopIndex) {
    const { dispatch, picUrlList, changeImgSrc, picInputDTOList, needCutPaperId, needCutPaperMsg } = this.props;
    // const imgList = this.props.picUrlList.toJS();
    const obj = { imgUrlArr: picUrlList.toJS(), canvas: this.canvas, startIndex, stopIndex };
    // 判断是否已经存在当前图片。
    const hasThisImg = picInputDTOList.find((item) => {
      // const children = item.get('children') || fromJS([]);
      return (startIndex === item.get('start') && item.get('end') > item.get('start') && item.get('longPicUrl'));
    });
    // console.log(picInputDTOList.toJS(), 'picInputDTOList');
    // console.log(hasThisImg, ' hasThisImg');
    // console.log(startIndex, stopIndex, hasThisImg, 'hasThisImg');
    console.log(needCutPaperMsg.toJS(), 'needCutPaperMsg');
    if (hasThisImg && needCutPaperMsg.get('state') !== 3) {
      // console.log(hasThisImg.toJS(), ' hasThisImg.toJS()');
      // const image = new Image();
      // image.addEventListener('load', () => {
      changeImgSrc(hasThisImg.get('longPicUrl'));
      this.resetCropBoxData();
      // });
      // image.src = hasThisImg.get('longPicUrl');
      // this.cropper.replace(hasThisImg.get('longPicUrl'), false);
      return;
    }
    // 如果不存在，则直接合成并且上传。
    loadImage(obj, (data) => {
      changeImgSrc(data.dataURL);
      this.resetCropBoxData();
      const index = picInputDTOList.count();
      const start = startIndex;
      const end = stopIndex;
      const splitList = data.splitList;
      const blob = data.blob;
      fetchUpdateImg(`${Config.trlink_qb}/api/question/fileUpload`, blob, (json) => {
        let img = new Image();
        img.addEventListener('load', () => {
          // let newPicInputDTOList = picInputDTOList;
          // const itemIndex = newPicInputDTOList.findIndex((item) => item.get('start') === start);
          const newItem = fromJS({
            index,
            start,
            end,
            children: splitList.map((it, i) => { // eslint-disable-line
              return {
                index: i + start,
                ySplit: it,
              };
            }),
            longPicUrl: json.data,
            xLength: img.width,
            yLength: img.height,
          });
          // if (itemIndex > -1) {
          //   newPicInputDTOList = newPicInputDTOList.set(itemIndex, newItem.set('index', itemIndex)).map((item, i) => item.set('index', i));
          // } else if (newPicInputDTOList.last() && start <= newPicInputDTOList.last().get('start')) {
          //   const nextIndex = newPicInputDTOList.findIndex((item) => item.get('start') > start);
          //   newPicInputDTOList = newPicInputDTOList.splice(nextIndex, 1, newItem).map((item, i) => item.set('index', i));
          // } else {
          //   newPicInputDTOList = newPicInputDTOList.push(newItem).map((item, i) => item.set('index', i));
          // }
          dispatch(addBigImgAction(needCutPaperId, newItem, start));
          img = null;
        });
        img.src = json.data;
        console.log(json, 'longPic upload back - json');
      }, (err) => {
        console.log('fetchUpdateImg', err);
      });
    });
  }
  /**
   * 渲染图片
   */
  canvasImgs() {
    const { picUrlList, imgStartIndex, imgCountCritical } = this.props;
    const count = picUrlList.count();
    // const imgStartIndex = this.props.imgStartIndex;
    // const imgCountCritical = this.props.imgCountCritical;
    if (count > 0 && count <= imgCountCritical) {
      this.lazyLoadImgs(0, count);
    } else if (count > imgCountCritical) {
      this.lazyLoadImgs(imgStartIndex, imgCountCritical);
    } else {
      timer = setTimeout(() => {
        timer = null;
        console.log('loading...');
        this.canvasImgs();
      }, 100);
    }
  }
  /**
    * 点击每一题题号时
    */
  questionItemIndexClick(index, i, countNum, item) {
    // console.time('questionItemIndexClick');
    let itemIndex = 0;
    const questionCountList = this.props.questionsList;
    for (let num = 0; num < questionCountList.count(); num += 1) {
      if (num < index) {
        itemIndex += questionCountList.get(num).get('children').count();
        // console.log(questionCountList.get(num).get('children').count(), 'questionCountList.get(num).count()');
      } else {
        break;
      }
    }
    itemIndex += i + 1;
    // console.log(index, i, itemIndex, countNum, item);
    const questionsList = this.props.questionsList;
    const smallItem = questionsList.get(index).get('children').get(i).toJS();
    // log(smallItem, 'smallItem -- smallItem');
    this.props.dispatch(setSelectedIndexAction(fromJS(Object.assign(item, { itemIndex, smallItem }))));
    this.props.changeSelectedQuestionIndex(itemIndex);
    const selectItemTypeId = toNumber(questionsList.get(index).get('children').get(i).get('smallTypeId')) || -1;
    // log(selectItemTypeId, 'selectItemTypeId -- selectItemTypeId');
    const selectedTYpe = this.props.questionTypeList.filter((it) => it.get('id') === selectItemTypeId).get(0);
    // log(selectedTYpe, selectedTYpe.toJS(), 'selectedTYpe -- selectedTYpe -- 242');
    this.props.dispatch(changeSelectedQuestionTypeAction(selectedTYpe));
    // console.timeEnd('questionItemIndexClick');
    setTimeout(() => {
      this.previewImg();
    }, 50);
  }
  /**
  * 点击切割按钮
  */
  cutPaperClick() {
    if (this.props.questionsList.count() <= 0) {
      const modal = Modal.warning({
        title: '系统提示',
        content: '请先从右边添加大题后再进行切割！',
      });
      setTimeout(() => modal.destroy(), 1500);
      return;
    }
    let questionCount = 0;
    this.props.questionsList.forEach((item) => {
      questionCount += item.get('children').count();
    });
    // console.log(questionCount, 'questionCount -- 203');
    // const questionMsgList = this.props.questionMsgList;
    // const questionCount = questionMsgList.count();
    if (questionCount < this.props.paperIsBeCutItem.get('questionAmount') && questionCount > 0) {
      console.log('已录入题数与总题数', questionCount, this.props.paperIsBeCutItem.get('questionAmount'));
    }
    const cropper = this.cropper.getCroppedCanvas();
    this.props.changeCurrentCutPaperImg(cropper.toDataURL('image/jpeg', 0.75));
    this.props.previewWrapperShowOrHide(true);
  }
  /**
  * 预览时确认切割
  */
  QuestionItemCutSure(addWayIndex) {
    const { dispatch, questionsList, selectedBigQuestion, selectedInsertIndex, bigPicIndex } = this.props;
    const { smallQuestionPicData } = this.state;
    dispatch(changeBtnCanClickAction(false));
    console.log('cut question start');
    // const questionsList = this.props.questionsList;
    const bigQuestionIndex = toNumber(selectedBigQuestion.get('id'));
    const insertIndex = toNumber(selectedInsertIndex.get('id'));
    const smallQuestionMsg = this.props.smallQuestion;
    const selectedquestionType = toNumber(this.props.selectedquestionType.get('id'));
    // console.log(insertIndex, 'insertIndex -- insertIndex');
    // console.log(smallQuestionMsg.toJS());
    const errTypeList = [];
    if (bigQuestionIndex < 0) {
      errTypeList.push({ type: 'selectError', value: '请选择本题所在的大题！' });
    }
    if (selectedquestionType < 0) {
      errTypeList.push({ type: 'selectError', value: '请选择题型！' });
    }
    if (errTypeList.length > 0) {
      message.warning(`${errTypeList[0].value}`);
      dispatch(changeBtnCanClickAction(true));
      console.log(`${errTypeList[0].type}：${errTypeList[0].value}`);
      return;
    }
    this.upLoadCutImg((json) => {
      // console.log(json, 'json  ---  235');
      if (toString(json.code) === '0') {
        const questionIndex = questionsList.get(bigQuestionIndex);
        let img = new Image();
        img.addEventListener('load', () => {
          // console.log(this.cropper, 'this.cropper');
          const changeItem = fromJS({
            picUrl: json.data,
            smallTypeId: smallQuestionMsg.get('questionTypeId'),
            errState: -1,
            errReason: '',
            longPicIndex: bigPicIndex,
            x1: smallQuestionPicData.x,
            y1: smallQuestionPicData.y,
            x2: smallQuestionPicData.x + smallQuestionPicData.width,
            y2: smallQuestionPicData.y + smallQuestionPicData.height,
          });
          let newChildren = fromJS([]);
          if (insertIndex < 0) {
            newChildren = questionIndex.get('children').push(changeItem);
          } else if (insertIndex >= 0) {
            if (addWayIndex === 1) {
              newChildren = questionIndex.get('children').splice(insertIndex - 1, 0, changeItem);
            } else if (addWayIndex === 2) {
              newChildren = questionIndex.get('children').splice(insertIndex - 1, 1, changeItem);
            }
          }
          const newQuestionIndex = questionIndex.set('children', newChildren);
          this.props.previewWrapperShowOrHide(false);
          this.addQuestion('small', newQuestionIndex, bigQuestionIndex);
          console.log(newQuestionIndex.toJS(), 'newQuestionIndex');
          img = null;
        });
        img.src = json.data;
      } else {
        message.error('图片上传失败，请重新切割，然后预览查看是否切割成功。');
        // errTypeList.push({ type: 'server error', value: json.message || `未知错误 code:${json.code}` });
      }
      dispatch(changeBtnCanClickAction(true));
    }, (err) => {
      dispatch(changeBtnCanClickAction(true));
      message.error('图片上传出错');
      console.log(err);
    });
  }
  upLoadCutImg(cb, errFn) {
    const cropper = this.cropper.getCroppedCanvas();
    cropper.toBlob((blob) => fetchUpdateImg(`${Config.trlink_qb}/api/question/fileUpload`, blob, cb, errFn));
  }
  cropperChange(e) {
    clearTimeout(timer1);
    timer1 = setTimeout(() => {
      this.setState({ smallQuestionPicData: e.detail });
    }, 200);
  }
  /**
   * 预览
   */
  previewImg() {
    const selectedQuestionIndex = this.props.questionSelectedIndex;
    console.log(selectedQuestionIndex, 'selectedQuestionIndex');
    if (selectedQuestionIndex < 1) {
      alert('请选中您想预览的已切割的题目！');
      return;
    }
    const questionMsgList = [];
    this.props.questionsList.toJS().forEach((item) => {
      // console.log(item, 'questionsList -- 376');
      item.children.forEach((it) => {
        questionMsgList.push(it);
      });
    });
    const newPic = questionMsgList[Number(selectedQuestionIndex - 1)].picUrl;
    // console.log(ques)
    this.props.changePreviewImgSrc(newPic);
    setTimeout(() => {
      this.props.changeQuestionPreviewShow(true);
    }, 30);
  }
  // 预览试卷信息
  seePaperMsg() {
    console.log('预览试卷信息');
    this.props.changePaperPreviewShow(true);
  }
  submitClick() {
    // this.props.changeIsSubmitIng(true);
    this.props.dispatch(submitCutPaperAction());
  }
  nextCutImg(nextIndex) {
    this.props.changeImgSrc(loading);
    this.props.dispatch(changeImgStartIndexAction(nextIndex));
    // console.log(nextIndex, 'nextIndex -- 343');
    setTimeout(() => {
      this.canvasImgs();
    }, 30);
  }
  addQuestion(type, value, index) {
    // show add Alert
    // const questionMsgList = this.props.questionMsgList;
    const questionsList = this.props.questionsList;
    let newList = fromJS([]);
    // const count = questionMsgList.filter((item) => item.get('bigNum') === index).count();
    if (type === 'big') {
      if (this.state.isAddOrEdit.addBig) {
        const newBigQuestionItem = fromJS({
          name: value,
          children: [],
        });
        newList = questionsList.splice(index, 0, newBigQuestionItem);
      } else {
        const oldIndex = this.state.isAddOrEdit.oldBigMsg.index;
        const newBigQuestionItem = questionsList.get(oldIndex).set('name', value);
        const newQuestionsList = questionsList.delete(oldIndex);
        newList = newQuestionsList.splice(index, 0, newBigQuestionItem);
      }
      // log(type, value, index, 'addQuestion -- addQuestion');
    } else if (type === 'small') {
      newList = questionsList.set(index, value);
      // log(type, value.toJS(), index, 'addQuestion -- addQuestion');
    }
    this.props.saveQuestionList(newList);
  }
  removeQuestion(type, index, i) {
    const questionsList = this.props.questionsList;
    let newList = fromJS([]);
    if (type === 'big') {
      newList = questionsList.splice(index, 1);
    } else if (type === 'small') {
      const questionIndex = questionsList.get(index);
      const newChildren = questionIndex.get('children').splice(i, 1);
      newList = questionsList.set(index, questionIndex.set('children', newChildren));
      console.log(questionIndex.toJS(), newChildren.toJS());
    }
    console.log(newList.toJS(), 'newList -- 381');
    this.props.saveQuestionList(newList);
  }
  selectQuestionAndType(value) {
    // console.log(value, type);
    // if (type === 'big') {
    this.props.dispatch(setSelectBigQuestionAction(fromJS({ name: value.label, id: value.key })));
    // } else if (type === 'way') {
    // this.props.dispatch(setSelectInsertWayAction(fromJS({ name: value.label, id: value.key })));
    // }
  }
  wantAddQuestion(typeOne, typeTwo, msg) {
    const questionsList = this.props.questionsList;
    if (typeOne === 'big') {
      if (typeTwo === 'add') {
        this.setState({ isAddOrEdit: { addBig: true }});
        this.props.dispatch(setEditorBigQuestionAction(fromJS({ name: toString(questionsList.count() + 1), id: toString(questionsList.count() + 1), value: '' })));
        this.props.dispatch(changeBigQuestiolnMsgShowAction(true));
      } else if (typeTwo === 'edit') {
        this.setState({ isAddOrEdit: { addBig: false, oldBigMsg: msg }});
        this.props.dispatch(setEditorBigQuestionAction(fromJS({ name: toString(msg.index + 1), id: toString(msg.index + 1), value: msg.name })));
        this.props.dispatch(changeBigQuestiolnMsgShowAction(true));
      }
    }
  }
  getTypeId(currentQuestion) {
    // const idItemList = this.props.questionTypeList.filter((item) => item.get('id') === Number(currentQuestion.get('questionTypeId')));
    const idItemList = this.props.questionTypeList.filter((item) => item.get('id') === Number(currentQuestion.get('smallTypeId')));
    let res = '';
    if (idItemList.count() > 0) {
      res = idItemList.get(0).get('name');
    } else {
      res = <span style={{ color: 'red' }}>题目类型丢失，请重新选择</span>;
    }
    return res;
  }
  render() {
    const paperWillCutMsg = this.props.paperIsBeCutItem.toJS();
    const count = this.props.picUrlList.count();
    const nowStartIndex = this.props.imgStartIndex;
    const step = this.props.imgStep;
    const imgCountCritical = this.props.imgCountCritical;
    let questionCount = 0;
    const questionMsgList = [];
    const questionsList = this.props.questionsList;
    questionsList.toJS().forEach((item) => {
      // console.log(item, 'questionsList -- 376');
      item.children.forEach((it) => {
        questionMsgList.push(it);
      });
    });
    const bigQuestionList = questionsList.map((item, index) => {
      return fromJS({ name: toString(index + 1), id: toString(index + 1), value: item.get('name') });
    });
    const editorBigQuestion = this.props.editorBigQuestion;
    const dispatch = this.props.dispatch;
    const bigPicIndex = this.props.bigPicIndex;
    return (<CutPaperWrapper>
      <TopButtonsBox>
        <Button
          showtype={6} onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            this.props.dispatch(setBackAlertStatesAction(fromJS({
              rightClick: () => {
                this.props.changeBackPromptAlertShow(false);
                this.props.changePageState(0);
                this.props.backInitData();
                this.props.dispatch(setBackAlertStatesAction(fromJS({})));
              },
              setChildren: () => {
                return (<div style={{ fontSize: 14, lineHeight: '2em!important' }}>
                  <p>是否确认退出</p>
                  <p>退出将无法保存当前切割数据</p>
                </div>);
              }
            })));
            this.props.changeBackPromptAlertShow(true);
          }}
        >{'<'} 返回</Button>
        <PlaceHolderBox></PlaceHolderBox>
        <Button
          showtype={5} style={{ marginRight: 20 }} onClick={() => {
            downloadFile({ fileUrl: this.props.paperIsBeCutItem.get('fileUrl'), fileName: `${this.props.paperIsBeCutItem.get('name')}(${this.props.paperIsBeCutItem.get('year')})` }, this.props.dispatch);
          }}
        >下载本试卷</Button>
        {/* <Button showtype={4} style={{ marginRight: 20 }} onClick={this.previewImg}>预览单题</Button> */}
        {this.props.isSubmit ? <Button showtype={8} onClick={() => ''}></Button> : <Button showtype={4} onClick={this.submitClick}>提交</Button>}
      </TopButtonsBox>
      <PaperWrapper>
        <PaperWrapperBox>
          <ImageCutWrapper innerRef={el => { this.scrollDom = el }}>
            <Cropper
              innerRef={x => { this.cropper = x }}
              ref={x => {
                this.cropper = x;
              }}
              // Cropper.js options
              src={this.props.imgSrc}
              style={{ width: '100%', position: 'absolute' }}
              // aspectRatio={16 / 9}
              guides={false}
              background={false}
              // autoCropArea={0.3}
              zoomable={false}
              movable={false}
              /* rotatable={true} */
              scalable={false}
              modal={false}
              restore   // resize 时重置图片位置，否则在缩小窗口时会被挤下来
              autoCrop  // 自动裁剪
              // center={false} // 裁剪器显示中心点位置
              // viewMode={1}
              // dragMode="crop"
              // minContainerWidth={200}
              // minContainerHeight={200}
              crop={this.cropperChange}
            />
            <Canvas innerRef={x => { this.canvas = x }}></Canvas>
          </ImageCutWrapper>
          <CutButtonWrapper>
            {count > imgCountCritical && nowStartIndex > 0 ? <Button
              showtype={5}
              onClick={() => {
                if (nowStartIndex > 0) {
                  const nextIndex = nowStartIndex > step ? nowStartIndex - step : 0;
                  this.nextCutImg(nextIndex);
                  const newBigPicindex = (nextIndex >= nowStartIndex) && (nowStartIndex >= 1) ? bigPicIndex - 1 : 0;
                  dispatch(changeBigPicIndexAction(newBigPicindex));
                } else {
                  message.warning('没有上一页可以翻页了');
                }
              }}
            >前一页</Button> : <Button showtype={8} onClick={() => { }}>前一页</Button>}
            <PlaceHolderBox />
            <Button onClick={this.cutPaperClick} showtype={1}>切割</Button>
            <PlaceHolderBox />
            {count > imgCountCritical && nowStartIndex < count - 1 - step ? <Button
              showtype={5}
              onClick={() => {
                if (nowStartIndex < count - step) {
                  const nextIndex = count - imgCountCritical < nowStartIndex ? nowStartIndex : nowStartIndex + step;
                  this.nextCutImg(nextIndex);
                  if (nextIndex > nowStartIndex) {
                    const newBigPicindex = bigPicIndex + 1;
                    dispatch(changeBigPicIndexAction(newBigPicindex));
                  }
                } else {
                  message.warning('没有更多页了可以翻页了');
                }
              }}
            >后一页</Button> : <Button showtype={8} onClick={() => { }}>后一页</Button>}
          </CutButtonWrapper>
        </PaperWrapperBox>
        <PaperQuestionList
          source={'getandcutpaper'}
          questionsList={questionsList.map((item, index) => {
            // console.log(item.toJS(), 'item');
            return fromJS({
              serialNumber: index + 1,
              name: item.get('name'),
              count: item.get('children').count(),
            });
          })}
          questionSelectedIndex={this.props.questionSelectedIndex}
          questionItemIndexClick={this.questionItemIndexClick}
          seePaperMsg={this.seePaperMsg}
          othersData={{
            questionResult: fromJS(questionMsgList).map((item) => {
              return fromJS({ errState: item.get('errState') });
            }),
            selectedIndex: this.props.selectedIndex,
          }}
          // addQuestion={this.addQuestion}
          removeQuestion={this.removeQuestion}
          wantAddQuestion={this.wantAddQuestion}
          promptAlertShow={this.props.changeBackPromptAlertShow}
          setPromptAlertStates={this.props.setBackAlertStates}
        /* questionMsgList={this.props.questionMsgList} */
        />
      </PaperWrapper>
      {this.props.previewWrapperShow ?
        <PaperPreview
          source={'getandcutpaper'}
          currentCutPaperImg={this.props.currentCutPaperImg}
          // questionMsgList={fromJS(questionMsgList)}
          previewWrapperShowOrHide={this.props.previewWrapperShowOrHide}
          QuestionItemCutSure={this.QuestionItemCutSure}
          questionCountAll={paperWillCutMsg.questionAmount || 0}
          questionTypeList={this.props.questionTypeList || fromJS([])}
          selectedquestionType={this.props.selectedquestionType}
          changeSelectedQuestionType={this.props.changeSelectedQuestionType}
          // bigQuestion={this.props.bigQuestion}
          changeBigQuestion={this.props.changeBigQuestion}
          changeSmallQuestion={this.props.changeSmallQuestion}
          smallQuestion={this.props.smallQuestion}
          seePaperMsg={this.seePaperMsg}
          selectedBigQuestion={this.props.selectedBigQuestion}
          questionsList={questionsList}
          // selectedInsertWay={this.props.selectedInsertWay}
          // selectInsertWayList={this.props.selectInsertWayList}
          selectQuestionAndType={this.selectQuestionAndType}
          selectedInsertIndex={this.props.selectedInsertIndex}
          changeInsertIndex={this.props.changeInsertIndex}
          isAddOrEdit={this.state.isAddOrEdit}
          btnCanClick={this.props.btnCanClick}
        /> : ''}
      {questionsList.count() > 0 && this.props.previewPaperMsgShow ?
        <Alert
          properties={{
            buttonsType: '1',
            isOpen: this.props.previewPaperMsgShow,
            title: paperWillCutMsg.name || '未命名试卷',
            titleStyle: { textAlign: 'center', fontSize: '16px', color: '#333', fontWeight: 600 },
            child: ['返回'],
            oneClick: () => {
              this.props.changePaperPreviewShow(false);
            },
          }}
        >
          <PaperMsgPreviewWrapper>
            <div>
              <p style={{ textAlign: 'right', margin: '5px 10px' }}>{`上传者：${paperWillCutMsg.createUserName || '无名氏'}  上传时间：${formatDate('yyyy-MM-dd HH:mm:ss', new Date(paperWillCutMsg.updatedTime || new Date()))}`}</p>
              {questionsList.map((item, index) => {
                return (<BigQuestinBox key={index}>
                  <BigQuestionTitle>{`${numberToChinese(index + 1)}、${item.get('name')}`}</BigQuestionTitle>
                  <SmallQuestionItem>
                    {item.get('children').map((it, i) => {
                      questionCount += 1;
                      return (<SmallQuestionMsgBox key={i}>
                        <SmallQuestionItem>{`第 ${questionCount} 题：`}{this.getTypeId(it)}</SmallQuestionItem>
                      </SmallQuestionMsgBox>);
                    })}
                  </SmallQuestionItem>
                </BigQuestinBox>);
              })}
            </div>
          </PaperMsgPreviewWrapper>
        </Alert>
        : ''}
      <Alert
        properties={{
          buttonsType: this.state.editorAlertMsg.buttonsType,
          isOpen: this.props.setBigQuestionMsgShow,
          title: this.state.editorAlertMsg.title,
          titleStyle: { textAlign: 'center', fontSize: '16px', color: '#333', fontWeight: 600 },
          child: ['保存'],
          rightClose: this.props.questionsList.count() > 0,
          closeClick: () => {
            this.props.dispatch(changeBigQuestiolnMsgShowAction(false));
            this.setState({ isAddOrEdit: { addBig: true }});
          },
          oneClick: () => {
            if (editorBigQuestion.get('value').replace(/\s/g, '').length <= 0) {
              message.warning('请输入大题标题');
              return;
            }
            this.addQuestion('big', editorBigQuestion.get('value'), toNumber(editorBigQuestion.get('id') - 1));
            this.props.changeBigShow(false);
          },
        }}
      >
        <BigQuestionMsgBox>
          <BigQuestionIndex>
            <TextValue minWidth={50}>题号：</TextValue>
            {this.state.isAddOrEdit.addBig ? <TextValue>{editorBigQuestion.get('id')}</TextValue> : <Select
              labelInValue defaultValue={{ key: '请选择大题', label: '-1' }} style={{ width: 200 }} value={{ key: toString(editorBigQuestion.get('id')), label: toString(editorBigQuestion.get('name')) }}
              onChange={(value) => {
                // const bigItem = questionsList.get(toNumber(value.key) - 1);
                dispatch(setEditorBigQuestionAction(editorBigQuestion.set('name', value.label).set('id', value.key)));
              }}
            >
              {(bigQuestionList || fromJS([])).map((it, i) => <Select.Option key={i} value={it.get('id')}>{it.get('name')}</Select.Option>)}
            </Select>}
          </BigQuestionIndex>
          <BigQuestionTitleBox>
            <TextValue minWidth={50}>标题：</TextValue>
            <Input defaultValue="请输入大题标题" value={editorBigQuestion.get('value')} onChange={(e) => dispatch(setEditorBigQuestionAction(editorBigQuestion.set('value', e.target.value)))}></Input>
          </BigQuestionTitleBox>
        </BigQuestionMsgBox>
      </Alert>
    </CutPaperWrapper>);
  }
}

CutPaperPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pageState: PropTypes.number.isRequired,
  imgSrc: PropTypes.string.isRequired,
  questionsList: PropTypes.instanceOf(immutable.List).isRequired,  // 记录多少道大题，每道大题的数量及名称信息
  changePageState: PropTypes.func.isRequired,  // 切换当前是领取时间还是进入切割试卷页面
  previewWrapperShow: PropTypes.bool.isRequired,  // 当前是否显示切割预览状态
  previewWrapperShowOrHide: PropTypes.func.isRequired,  // 控制当前是否显示切割预览状态
  // questionMsgList: PropTypes.instanceOf(immutable.List).isRequired,  // 题目列表
  questionSelectedIndex: PropTypes.number.isRequired,  // 当前选中的时第多少题
  changeSelectedQuestionIndex: PropTypes.func.isRequired,  // 切换当前选中的题号
  changeImgSrc: PropTypes.func.isRequired,  // 切换当前要切割的图片
  currentCutPaperImg: PropTypes.string.isRequired,  // 当前题目切割下来的图片的 base64
  changeCurrentCutPaperImg: PropTypes.func.isRequired, // 切换当前题目切割下来的图片的 base64
  picUrlList: PropTypes.instanceOf(immutable.List).isRequired,  // 图片列表
  questionTypeList: PropTypes.instanceOf(immutable.List).isRequired,  // 所有题型
  changeSelectedQuestionType: PropTypes.func.isRequired,  // 切换题型
  selectedquestionType: PropTypes.instanceOf(immutable.Map).isRequired,  // 选中的题型
  changeBigQuestion: PropTypes.func.isRequired,  // 保存大题信息
  // bigQuestion: PropTypes.instanceOf(immutable.Map).isRequired,  // 大题信息
  changeSmallQuestion: PropTypes.func.isRequired,  // 保存小题信息
  smallQuestion: PropTypes.instanceOf(immutable.Map).isRequired,  // 小题信息
  saveQuestionMsgList: PropTypes.func.isRequired,  // 保存试卷信息
  saveQuestionList: PropTypes.func.isRequired,  // 保存题目数量列表
  changeQuestionPreviewShow: PropTypes.func.isRequired,  // 切换题目预览框显示状态
  changePreviewImgSrc: PropTypes.func.isRequired,  // 切换预览题目的图片
  previewPaperMsgShow: PropTypes.bool.isRequired,  // 预览试卷内容显示状态
  changePaperPreviewShow: PropTypes.func.isRequired,  // 切换预览试卷的显示状态
  paperIsBeCutItem: PropTypes.instanceOf(immutable.Map).isRequired,  // 当前正在切割的试卷返回值
  backInitData: PropTypes.func.isRequired,  // 点击返回时初始化数据
  changeIsSubmitIng: PropTypes.func.isRequired,  // 改变正在提交的状态
  imgStartIndex: PropTypes.number.isRequired,  // 当图片数量大于 10 的时候记录当前加载到第多少张图片用
  imgStep: PropTypes.number.isRequired,  // 一次翻页跳过多少页
  imgCountCritical: PropTypes.number.isRequired,  // 展示图片数量的临界值
  // selectInsertWayList: PropTypes.instanceOf(immutable.List).isRequired,  // 选择插入方式列表
  selectedBigQuestion: PropTypes.instanceOf(immutable.Map).isRequired,  // 选择的大题
  // selectedInsertWay: PropTypes.instanceOf(immutable.Map).isRequired,  // 插入的方式
  selectedIndex: PropTypes.instanceOf(immutable.Map).isRequired,  // 选择的 index
  selectedInsertIndex: PropTypes.instanceOf(immutable.Map).isRequired,  // 要插入的位置
  changeInsertIndex: PropTypes.func.isRequired,  // 切换当前插入位置
  setBigQuestionMsgShow: PropTypes.bool.isRequired,  // 输入大题信息弹框状态
  changeBigShow: PropTypes.func.isRequired,  // 切换弹框状态
  editorBigQuestion: PropTypes.instanceOf(immutable.Map).isRequired,  // 编辑大题
  changeBackPromptAlertShow: PropTypes.func.isRequired,
  setBackAlertStates: PropTypes.func.isRequired,
  btnCanClick: PropTypes.bool.isRequired,
  isSubmit: PropTypes.bool.isRequired,
  picInputDTOList: PropTypes.instanceOf(immutable.List).isRequired,  // 保存大图的数据
  bigPicIndex: PropTypes.number.isRequired,  // 大图的 index
  needCutPaperId: PropTypes.number.isRequired,
  paperState: PropTypes.number,
  needCutPaperMsg: PropTypes.instanceOf(immutable.Map).isRequired,
};

const mapStateToProps = createStructuredSelector({
  // GetAndCutPaper: makeSelectGetAndCutPaper(),
  questionsList: makeQuestionsList(),
  imgSrc: makeImgSrc(),
  pageState: makePageState(),
  previewWrapperShow: makePreviewShow(),
  // makeImgSrcList: makeImgSrcList(),
  // questionMsgList: makeQuestionMsgList(),
  questionSelectedIndex: makeQuestionSelectedIndex(),
  currentCutPaperImg: makeCurrentCutPaperImg(),
  picUrlList: makePicUrlList(),
  questionTypeList: makeQuestionTypeList(),
  selectedquestionType: makeSelectedTquestionType(),
  // bigQuestion: makeBigQuestion(),
  smallQuestion: makeSmallQuestion(),
  previewPaperMsgShow: makePreviewPaperMsgShow(),
  paperIsBeCutItem: makePaperIsBeCutItem(),
  imgStartIndex: makeImgStartIndex(),
  imgStep: makeImgStep(),
  imgCountCritical: makeImgCountCritical(),
  // selectInsertWayList: makeSelectInsertWayList(),
  selectedBigQuestion: makeSelectedBigQuestion(),
  // selectedInsertWay: makeSelectedInsertWay(),
  selectedIndex: makeSelectedIndex(),
  selectedInsertIndex: makleSelectedInsertIndex(),
  setBigQuestionMsgShow: makeSetBigQuestionMsgShow(),
  editorBigQuestion: makeEditorBigQuestion(),
  btnCanClick: makeBtnCanClick(),
  picInputDTOList: makePicInputDTOList(),
  bigPicIndex: makeBigPicIndex(),
  needCutPaperId: makeNeedCutPaperId(),
  needCutPaperMsg: makeNeedCutPaperMsg(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    changePageState: (num) => dispatch(changePageStateAction(num)),
    previewWrapperShowOrHide: (bol) => dispatch(previewWrapperShowOrHideAction(bol)),
    changeSelectedQuestionIndex: (num) => dispatch(changeSelectedQuestionIndexAction(num)),
    changeImgSrc: (str) => dispatch(changeImgSrcAction(str)),
    changeCurrentCutPaperImg: (str) => dispatch(changeCurrentCutPaperImgAction(str)),
    changeSelectedQuestionType: (item) => dispatch(changeSelectedQuestionTypeAction(fromJS({ id: item.key, name: item.label }))),
    changeBigQuestion: (item) => dispatch(changeBigQuestionAction(fromJS(item))),
    changeSmallQuestion: (item) => dispatch(changeSmallQuestionAction(fromJS(item))),
    saveQuestionMsgList: (item) => dispatch(saveQuestionMsgListAction(fromJS(item))),
    saveQuestionList: (item) => dispatch(saveQuestionListAction(fromJS(item))),
    changeQuestionPreviewShow: (bol) => dispatch(changeQuestionPreviewShowAction(bol)),
    changePreviewImgSrc: (str) => dispatch(changePreviewImgSrcAction(str)),
    changePaperPreviewShow: (bol) => dispatch(changePaperPreviewShowAction(bol)),
    backInitData: () => dispatch(backInitDataAction()),
    // changeIsSubmitIng: (bol) => dispatch(changeIsSubmitIngAction(bol)),
    changeInsertIndex: (item) => dispatch(setSelectedInsertIndexAction(fromJS({ id: item.key, name: item.label }))),
    changeBigShow: (bol) => dispatch(changeBigQuestiolnMsgShowAction(bol)),
    changeBackPromptAlertShow: (bol) => dispatch(changeBackPromptAlertShowAction(bol)),
    setBackAlertStates: (item) => dispatch(setBackAlertStatesAction(item)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CutPaperPage);
