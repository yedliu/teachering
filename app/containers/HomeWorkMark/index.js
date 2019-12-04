/* eslint-disable array-callback-return */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Immutable, { fromJS } from 'immutable';
import { FormattedMessage } from 'react-intl';
import styled, { css, keyframes } from 'styled-components';
import moment from 'moment';
import Button from 'components/Button';
import { AlertModal } from 'components/AlertModal';
import 'rc-tree/assets/index.css';
import { letterOptions, renderToKatex, chooseFont } from 'components/CommonFn';

import { FlexColumnDiv, FlexRowDiv } from 'components/Div';
import {
  makeSelectHomeWorkMarkData,
  makeSelectStudentItem,
  makeSelectTeaTotalComment,
  makeSelectAlertMsg,
} from './selectors';
import {
  updateMarkQuestionItemAction,
  sendMarkHomeWorkDataAction,
  setTeaTotalCommentAction,
  getHomeWorkMarkListAction,
  setSelectStudent,
  setAlertMsg,
} from './actions';

import messages from './messages';

const righticon = window._baseUrl.imgCdn + 'e0eae0f0-11fa-4b34-81f7-2b66b5544fc6.png';
const wrongicon = window._baseUrl.imgCdn + 'a28019e3-46da-4822-8231-d44615cf5b7c.png';
import { WangEditorCSS } from 'containers/HomeWorkInfo/WangEditorCSS';
import {
  handleAnswersList,
  getQueryString,
} from 'containers/HomeWorkInfo/helperfunc';

export const wangStyle = css`
  table {
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
  }
  table td,
  table th {
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding: 3px 5px;
  }
  table th {
    border-bottom: 2px solid #ccc;
    text-align: center;
  }
  blockquote {
    display: block;
    border-left: 8px solid #d0e5f2;
    padding: 5px 10px;
    margin: 10px 0;
    line-height: 1.4;
    font-size: 100%;
    background-color: #f1f1f1;
  }
  code {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    background-color: #f1f1f1;
    border-radius: 3px;
    padding: 3px 5px;
    margin: 0 3px;
  }
  pre code {
    display: block;
  }
  ul,
  ol {
    margin: 10px 0 10px 20px;
  }
`;

export const listStyle = css`
  ul {
    list-style-type: disc;
    list-style-position: inside;
  }
  ol {
    list-style-type: decimal;
    list-style-position: inside;
  }
`;

export const questionItemCss = styled.div`
  word-break: break-all;
  word-wrap: break-word;
  flex: 1;
  width: 100%;
  font-size: 10.5pt;
  line-height: 2em;
  min-height: ${(props) => (props.homeworkStep === 3 ? 50 : 0)}px;
  p {
    font-family: ${props => chooseFont(props.subjectId)};
    font-size: 10.5pt;
    line-height: 2em;
    .mord.text {
      font-family: ${props => chooseFont(props.subjectId)};
      font-size: 9pt;
    }
  }
  img {
    max-width: 350px;
    max-height: 400px;
  }
  img[zmtype='small'] {
    vertical-align: middle;
  }
  zmindent {
    display: inline-block;
    width: 2em;
    height: 1em;
    overflow: hidden;
    vertical-align: middle;
    color: transparent;
    user-select: none;
  }
  zmblank {
    box-sizing: border-box;
    display: inline-block;
    width: 4em;
    height: 1em;
    text-align: center;
    border: none;
    user-select: none;
  }
  zmsubline {
    box-sizing: border-box;
    display: inline-block;
    width: 4em;
    text-align: center;
    border-bottom: 1px solid #000;
  }
  .katex-html {
    background: transparent;
  }
  // &:hover {
  //   background: #eee;
  // }
  &:hover .buttons {
    display: flex;
  }
  img {
    vertical-align: middle;
  }
  ${wangStyle}
  ${listStyle}
`;

const OneQuestionWrap1 = styled.div`
  position: relative;
  //display: inline-block;
  //width:100%;
  margin-bottom: 16px;
  marginright: 20px;
  padding: 16px 16px 16px 12px;
  height: auto;
  border: 1px solid #eeeeee;
  color: #666666;
  font-size: 14px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
  &:hover {
    background-color: #f6f6f6;
    .operdiv {
      display: flex;
    }
  }
`;

export const NoDiv = styled.div`
  display: inline-block;
  vertical-align: top;
`;

export const ContentDiv = styled.div`
  display: inline-block;
  width: calc(100% - 22px);
  vertical-align: top;
  p {
    margin: 0;
  }
`;

export const MethodTip = styled.div`
  border-top: 1px solid #dddddd;
  color: #fd5b59;
`;

const OneQuestionWrap = styled(OneQuestionWrap1)`
  &:hover {
    background-color: white;
  }
  margin-left: 20px;
  margin-right: 20px;
  width: auto;
  position: relative;
  display: block;
`;

const Img = styled.img`
  width: 14px;
  height: 14px;
`;

export const shakeAnimal = keyframes`
    0% {
        transform: translate(0, 0) scale(1);
    }
    25% {
        transform: translate(1px, 0) scale(1.05);
    }
    50% {
        transform: translate(1px, 1px) scale(1);
    }
    75% {
        transform: translate(0, 1px) scale(1.05);
    }
    100% {
        transform: translate(0, 0) scale(1);
    }
`;

const HeaderLine = styled(FlexRowDiv)`
  height: 30px;
  padding: 0px 0px 0px 0px;
`;
const Name = styled(FlexColumnDiv)`
  font-size: 20px;
  color: #333333;
`;
const StudentName = styled(FlexColumnDiv)`
  font-size: 14px;
  color: #ff7e30;
`;
const SubMitTime = styled(FlexColumnDiv)`
  // margin-left:84px;
  font-size: 14px;
  color: #666666;
`;
const AnswerTip = styled.div`
  display: inline-block;
  font-size: 14px;
  color: #666666;
  align-items: center;
`;
const TipInfo = styled(FlexColumnDiv)`
  font-size: 14px;
  color: #999999;
`;
export const HomeWorkContent = styled(FlexRowDiv)`
  width: 100%;
  flex: auto;
`;
const ShadowCss = css`
  background-color: #ffffff;
  border: 1px solid #eeeeee;
  box-shadow: 0 2px 4px 0 rgba(233, 236, 244, 0.5);
  border-radius: 2px;
`;

const HomeWorkEditContent = styled(FlexColumnDiv)`
  //height:100%;
  flex: auto;
  //margin:20px 20px 20px 20px;
  ${ShadowCss}
`;
export const HomeWorkPreviewContent = styled(HomeWorkEditContent)``;

export const TitleHeader = styled(FlexColumnDiv)`
  min-height: 40px;
  justify-content: center;
  background-color: white;
  padding-left: 20px;
  border-bottom: 1px solid #dddddd;
  font-size: 16px;
  color: #333333;
`;
export const HomeWorkEditHeader = styled(FlexColumnDiv)`
  padding: 0px 20px 0px 20px;
  margin-top: 10px;
  border-bottom: 1px solid #dddddd;
  background-color: white;
`;
export const ContentWrap = styled(FlexColumnDiv)`
  flex: 1;
  height: 100%;
  background: #fff;
`;
export const HomeWorkEditContentList = styled(FlexColumnDiv)`
  overflow-y: auto;
  flex: auto;
  height: 200px;
  position: relative;
  /***题目内含的样式** */
  .MathJye table {
    border-collapse: collapse;
    margin: 0;
    padding: 0;
    text-align: center;
    vertical-align: middle;
    line-height: normal;
    font-size: inherit;
    _font-size: 100%;
    font-style: normal;
    font-weight: normal;
    border: 0;
    float: none;
    display: inline-block;

    zoom: 0;
  }

  table.edittable {
    font-size: small !important;
    border-collapse: collapse;
    text-align: center;
    margin: 2px;
    word-wrap: break-word !important;
    td {
      word-wrap: break-word !important;
    }
  }
  table.edittable td,
  table.edittable th {
    line-height: 30px;
    padding: 5px;
    white-space: normal;
    word-break: break-all;
    border: 1px solid #000;
    vertical-align: middle;
  }
  table.composition {
    border-collapse: collapse;
    text-align: left;
    margin: 2px;
    width: 98%;
  }
  table.composition td,
  table.composition th {
    line-height: 30px;
    white-space: normal;
    word-break: break-all;
    border-width: 0;
    vertical-align: middle;
  }
  table.composition2 {
    border-collapse: collapse;
    width: auto;
  }
  table.composition2 td,
  table.composition2 th {
    text-align: left;
    line-height: 30px;
    white-space: normal;
    word-break: break-all;
    border: none;
    border-width: 0;
    vertical-align: middle;
  }
`;

export const EditHeaderLine = styled(FlexRowDiv)`
  margin-top: 8px;
  min-height: 30px;
`;

const AwnserDiv = styled.div`
  background: #fffbf2;
  border: 1px solid #e8e2d8;
  border-radius: 2px;
  font-size: 14px;
  color: #000000;
  letter-spacing: -0.21px;
  line-height: 20px;
  padding: 5px 10px;
  margin-top: 10px;
`;
const MethodTipDiv = styled(FlexColumnDiv)`
  min-width: 50px;
  color: #b8a490;
  font-weight: bold;
`;
const MethodContentDiv = styled.div`
  flex: auto;
  color: #b8a490;
  p {
    margin: 0;
  }
  display: block;
  div {
    display: inline-block !important;
  }
`;

const AwnserText = styled(FlexColumnDiv)`
  color:${(props) => (props.isok ? '#44B84D' : 'red')};
`;

const ScoreText = styled(FlexRowDiv)`
  font-size: 14px;
  color: #999999;
  margin-left: 40px;
`;

const ButtonWrap1 = styled(Button)`
  margin-right:10px;
  color:${(props) => (props.isok ? '#fff' : '#666')};
  background-color:${(props) => (props.isok ? '#44B84D' : '#fff')};

`;
const ButtonWrap2 = styled(ButtonWrap1)`
 background-color:${(props) => (props.isok ? 'red' : '#fff')};
`;
const ButtonWrap3 = styled(ButtonWrap1)`
background-color:${(props) => (props.isok ? '#FF7E30' : '#fff')};
`;
const EditScore = styled.input`
  max-width: 30px;
  border: 1px solid lightgray;
  justify-content: flex-end;
  text-align: right;
`;

const HomeWorkSummaryInfo = styled(FlexColumnDiv)`
  font-size: 16px;
  color: #333333;
  letter-spacing: -0.24px;
  background: #ffffff;
  border: 1px solid #dddddd;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
  min-height: 287px;
  padding: 10px 0px 20px 20px;
  margin: 0px 20px 20px 20px;
  border-bottom-right-radius: 15px;
  border-bottom-left-radius: 15px;
`;

export const GroupNameEnum = [
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
  '十',
  '十一',
  '十二',
  '十三',
  '十四',
  '十五',
  '十六',
  '十七',
  '十八',
  '十九',
  '二十',
];

const SummaryScoreTip = styled(FlexColumnDiv)`
  font-size: 13px;
  color: #999999;
  justify-content: center;
  letter-spacing: -0.19px;
`;
const SummaryAwnserTip = styled(FlexRowDiv)`
  align-items: center;
  font-size: 14px;
  color: #666666;
  letter-spacing: -0.21px;
`;
const SummaryTextArea = styled.textarea`
  border: 1px solid lightgray;
  width: 60%;
  color: #666666;
  resize: none;
`;
const SummaryScoreValue = styled(FlexColumnDiv)`
  font-size: 20px;
  color: #2385EE;
  letter-spacing: -0.3px;
`;

const DisableButton = styled(FlexColumnDiv)`
  backgroundcolor: lightgray;
  text-align: center;
  color: #666666;
  width: 130px;
  justify-content: center;
  height: 40px;
  border-radius: 4px;
`;
const StuAnswerConten = styled.div`
  // display: inline-block;
  flex: 1;
  p:first-child {
    margin-top: 0;
  }
  ${WangEditorCSS}
  img {
    max-width: 100%;
  }
`;
const AnswerTipFlexRow = styled(AnswerTip)`
  display: flex;
`;
const AbleButton = styled(FlexColumnDiv)`
  background-color: #ef414f;
  text-align: center;
  color: #ffffff;
  width: 130px;
  justify-content: center;
  height: 40px;
  border-radius: 4px;
  &:hover {
    cursor: pointer;
    background-color: #ff6c78;
  }
  &:active {
    background-color: #e43b49;
  }
`;

const KatexQuestionWrap = styled(questionItemCss)``;

export class HomeWorkMark extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    // console.log('props.source',props.source)

    this.makeOneQuestion = this.makeOneQuestion.bind(this);
    this.makeAwnserTip = this.makeAwnserTip.bind(this);
    this.makeOneQuestionChildren = this.makeOneQuestionChildren.bind(this);
    this.makeAwnserTipChildren = this.makeAwnserTipChildren.bind(this);
    this.button1Click = this.button1Click.bind(this);
    this.button2Click = this.button2Click.bind(this);
    this.button3Click = this.button3Click.bind(this);
    this.button4Click = this.button4Click.bind(this);
    this.getScore = this.getScore.bind(this);
    this.getCorrect = this.getCorrect.bind(this);
    this.getCorrectRadio = this.getCorrectRadio.bind(this);
    this.getDown = this.getDown.bind(this);
    this.getTotal = this.getTotal.bind(this);
    this.cancelFunc = this.cancelFunc.bind(this);
    // this.state = { nameshake: true };
  }

  componentDidMount() {
    //
    // this.props.dispatch(getHomeWorkNewCourseListAction());
    // this.props.dispatch(setHomeWorkSourceAction(this.props.source));
    const getQueryStringArr = getQueryString();
    console.log('getQueryStringArr');// tr/homeworkmark?hwid=1&stuname=小二黑
    const alertmsg = this.props.alertmsg;
    if (!getQueryStringArr.id) {
      // alert('请传作业id');
      this.props.dispatch(
        setAlertMsg(
          alertmsg.set('alertmessage', '请传作业id').set('open', true),
        ),
      );
    }
    // else if (!getQueryStringArr.stuname) {
    //  // alert('请传学生姓名');
    //  this.props.dispatch(setAlertMsg(alertmsg.set('alertmessage', '请传学生姓名').set('open', true)));
    // }
    else {
      this.props.dispatch(
        setSelectStudent(
          this.props.selectstudent
            .set('id', getQueryStringArr.id)
            .set('studentName', getQueryStringArr.stuname),
        ),
      );
      this.props.dispatch(getHomeWorkMarkListAction());
    }
  }

  cancelFunc() {
    const alertmsg = this.props.alertmsg;
    this.props.dispatch(setAlertMsg(alertmsg.set('open', false)));
  }

  makeAwnserTip(item, index) {
    const halfRightScore = Math.ceil((item.get('score') || 0) / 2);
    if (item.getIn(['questionEsDto', 'Cate']) === 1) {
      const answerList = item.getIn(['questionEsDto', 'answerList']) ? item.getIn(['questionEsDto', 'answerList']).toJS() : [];
      const isok = item.getIn(['questionEsDto', 'stuAns']) === answerList.join(',');
      const correctResult = isok ? 1 : 2;
      const score = isok ? item.get('score') : 0;
      this.props.dispatch(updateMarkQuestionItemAction(index, item.set('correctResult', correctResult).set('stuGetScore', score)));
      return (<AnswerTipFlexRow><FormattedMessage {...messages.TeacherHomeWorkC19} />
        <AwnserText isok={isok}>{isok ? <FormattedMessage {...messages.TeacherHomeWorkC20} /> : <FormattedMessage {...messages.TeacherHomeWorkC21} />}</AwnserText>
        <ScoreText><FormattedMessage {...messages.TeacherHomeWorkC22} />{isok ? item.get('score') : 0}/{item.get('score')}</ScoreText>
      </AnswerTipFlexRow>);
    } else {
      return (<AnswerTipFlexRow style={{ padding: '0px 0px 10px 0px' }}>
        <FormattedMessage {...messages.TeacherHomeWorkC19} />
        <ButtonWrap1 onClick={() => { this.props.dispatch(updateMarkQuestionItemAction(index, item.set('correctResult', 1).set('stuGetScore', item.get('score')))) }} isok={item.get('correctResult') === 1} showtype={6} ><FormattedMessage {...messages.TeacherHomeWorkC20} /></ButtonWrap1>
        <ButtonWrap2 onClick={() => { this.props.dispatch(updateMarkQuestionItemAction(index, item.set('correctResult', 2).set('stuGetScore', 0))) }} isok={item.get('correctResult') === 2} showtype={6}><FormattedMessage {...messages.TeacherHomeWorkC21} /></ButtonWrap2>
        <ButtonWrap3 onClick={() => { this.props.dispatch(updateMarkQuestionItemAction(index, item.set('correctResult', 3).set('stuGetScore', halfRightScore))) }} isok={item.get('correctResult') === 3} showtype={6}><FormattedMessage {...messages.TeacherHomeWorkC23} /></ButtonWrap3>
        <ScoreText><FormattedMessage {...messages.TeacherHomeWorkC22} /><EditScore
          value={item.get('stuGetScore') ? item.get('stuGetScore') : 0}
          type="number"
          min="1"
          max={item.get('score') - 1}
          onChange={(evt) => {
          // console.log('onChange', evt.target.value);
            if (parseInt(evt.target.value) < item.get('score')) { // eslint-disable-line
              this.props.dispatch(updateMarkQuestionItemAction(index, item.set('stuGetScore', parseInt(evt.target.value)))); // eslint-disable-line
            }

       // return true;
          }}
          readOnly={item.get('correctResult') !== 3}
      ></EditScore>/{item.get('score')}</ScoreText>
      </AnswerTipFlexRow>);
    }
  }

  getScore() {
    let list = [];
    this.props.homeworkmarkdata.get('homeworkLessonQuestionDTOList').forEach((it) => {
      if (!it.get('questionOutputDTO').get('sub')) {
        list.push(it.get('stuGetScore'));
      } else {
        (it.get('questionOutputDTO').get('children') || fromJS([])).forEach((it2) => {
          list.push(it2.get('stuGetScore'));
        });
      }
    });
    let num = list.reduce((p, n) => (n ? n : 0) + (p ? p : 0), 0);

    return num;
  }

  getCorrect(type) {
    const list = this.props.homeworkmarkdata.get('homeworkLessonQuestionDTOList').filter((it) => {
      if (!it.get('questionOutputDTO').get('sub')) {
        return type ? (it.get('correctResult') === 2 || it.get('correctResult') === 3) : it.get('correctResult') === 1;
      } else {
        let valid = true;
        const children = (it.get('questionOutputDTO').get('children') || fromJS([]));
        for (let i = 0; i < children.count(); i++) {
          const it2 = children.get(i);
          if (!type) {
            valid =  it2.get('correctResult') === 1;
            if (!valid) {
              break;
            }
          } else {
            if (i === 0) {
              valid = false;
            }
            if (it2.get('correctResult') === 2 || it2.get('correctResult') === 3) {
              valid = true;
              break;
            }
          }
          return valid;
        }
      }
    });

    return list.count();
  }

  getCorrectRadio() {
    //  (this.props.homeworkmarkdata
    //    .get('homeworkLessonQuestionDTOList').map((it) => it.get('stuGetScore')).reduce((p, n) => (n ? n : 0) + (p ? p : 0))
    // / this.props.homeworkmarkdata
    //    .get('homeworkLessonQuestionDTOList').map((it) => it.get('score')).reduce((p, n) => (n ? n : 0) + (p ? p : 0)) * 100).toFixed(1)

    let list = [];
    let listTotal = [];
    this.props.homeworkmarkdata.get('homeworkLessonQuestionDTOList').forEach((it) => {
      if (!it.get('questionOutputDTO').get('sub')) {
        list.push(it.get('stuGetScore'));
        listTotal.push(it.get('score'));
      } else {
        (it.get('questionOutputDTO').get('children') || fromJS([])).forEach((it2) => {
          list.push(it2.get('stuGetScore'));
          listTotal.push(it2.get('score'));
        });
      }
    });
    let num = list.reduce((p, n) => (n ? n : 0) + (p ? p : 0), 0);
    let numTotal = listTotal.reduce((p, n) => (n ? n : 0) + (p ? p : 0), 0);
    return (num * 100 / numTotal).toFixed(1);
  }

  getDown() {
    let i = 0;
    this.props.homeworkmarkdata.get('homeworkLessonQuestionDTOList').forEach((it) => {
      if (!it.get('questionOutputDTO').get('sub')) {
        if (it.get('correctResult') === 2 || it.get('correctResult') === 3 || it.get('correctResult') === 1) i++;
      } else {
        const children = (it.get('questionOutputDTO').get('children') || fromJS([]));
        children.filter((it2) => { // eslint-disable-line
          if (it2.get('correctResult') === 2 || it2.get('correctResult') === 3 || it2.get('correctResult') === 1) i++;
        });
      }
    });
    return i;
  }

  getTotal() {
    let i = 0;
    this.props.homeworkmarkdata.get('homeworkLessonQuestionDTOList').forEach((it) => {
      if (!it.get('questionOutputDTO').get('sub')) {
        i++;
      } else {
        const children = (it.get('questionOutputDTO').get('children') || fromJS([]));
        children.filter((it2) => { // eslint-disable-line
          i++;
        });
      }
    });
    return i;
  }

  button1Click(item, index, item1, index1) {
    let val = item1.get('questionOutputDTO').get('children').get(index);
    // console.log(item1.get('questionOutputDTO').toJS(),item1.get('questionOutputDTO').get('children').toJS(),item1.get('questionOutputDTO').get('children').get(index).toJS());
    val = val.set('correctResult', 1).set('stuGetScore', item.get('score'));
    const children = item1.get('questionOutputDTO').get('children').set(index, val);
    const questionOutputDTO = item1.get('questionOutputDTO').set('children', children);
    this.props.dispatch(updateMarkQuestionItemAction(index1, item1.set('questionOutputDTO', questionOutputDTO)));
  }

  button2Click(item, index, item1, index1) {
    let val = item1.get('questionOutputDTO').get('children').get(index);
    val = val.set('correctResult', 2).set('stuGetScore', 0);
    const children = item1.get('questionOutputDTO').get('children').set(index, val);
    const questionOutputDTO = item1.get('questionOutputDTO').set('children', children);
    this.props.dispatch(updateMarkQuestionItemAction(index1, item1.set('questionOutputDTO', questionOutputDTO)));
  }

  button3Click(item, index, item1, index1, halfRightScore) {
    let val =  item1.get('questionOutputDTO').get('children').get(index);
    val = val.set('correctResult', 3).set('stuGetScore', halfRightScore);
    const children =  item1.get('questionOutputDTO').get('children').set(index, val);
    const questionOutputDTO = item1.get('questionOutputDTO').set('children', children);
    this.props.dispatch(updateMarkQuestionItemAction(index1, item1.set('questionOutputDTO', questionOutputDTO)));
  }

  button4Click(item, index, item1, index1, score) {
    let val = item1.get('questionOutputDTO').get('children').get(index);
    val = val.set('stuGetScore', score);
    const children = item1.get('questionOutputDTO').get('children').set(index, val);
    const questionOutputDTO = item1.get('questionOutputDTO').set('children', children);
    this.props.dispatch(updateMarkQuestionItemAction(index1, item1.set('questionOutputDTO', questionOutputDTO)));
  }

  makeAwnserTipChildren(item, index, index1, item1) {
    const halfRightScore = Math.ceil((item.get('score') || 0) / 2);
    if (item.get('typeId') === 2 || item.get('typeId') === 1) {
      const answerList = item.get('answerList')
        ? item.get('answerList').toJS()
        : [];
      const isok = item.get('stuAnswer') === answerList.join(',');
      const correctResult = isok ? 1 : 2;
      const score = isok ? item.get('score') : 0;
      // this.props.dispatch(updateMarkQuestionItemAction(index, item.set('correctResult', correctResult).set('stuGetScore', score)));
      let val = item1.get('questionOutputDTO').get('children').get(index);
      val = val.set('correctResult', correctResult).set('stuGetScore', score);
      const children = item1.get('questionOutputDTO').get('children').set(index, val); // eslint-disable-line
      const questionOutputDTO = item1.get('questionOutputDTO');
      this.props.dispatch(updateMarkQuestionItemAction(index1, item1.set('questionOutputDTO', questionOutputDTO)));
      return (<AnswerTipFlexRow><FormattedMessage {...messages.TeacherHomeWorkC19} />
        <AwnserText isok={isok}>{isok ? <FormattedMessage {...messages.TeacherHomeWorkC20} /> : <FormattedMessage {...messages.TeacherHomeWorkC21} />}</AwnserText>
        <ScoreText><FormattedMessage {...messages.TeacherHomeWorkC22} />{isok ? item.get('score') : 0}/{item.get('score')}</ScoreText>
      </AnswerTipFlexRow>);
    } else {
      return (<AnswerTipFlexRow style={{ padding: '0px 0px 10px 0px' }}>
        <FormattedMessage {...messages.TeacherHomeWorkC19} />
        <ButtonWrap1 onClick={() => { this.button1Click(item, index, item1, index1) }} isok={item.get('correctResult') === 1} showtype={6} ><FormattedMessage {...messages.TeacherHomeWorkC20} /></ButtonWrap1>
        <ButtonWrap2 onClick={() => { this.button2Click(item, index, item1, index1) }} isok={item.get('correctResult') === 2} showtype={6}><FormattedMessage {...messages.TeacherHomeWorkC21} /></ButtonWrap2>
        <ButtonWrap3 onClick={() => { this.button3Click(item, index, item1, index1, halfRightScore) }} isok={item.get('correctResult') === 3} showtype={6}><FormattedMessage {...messages.TeacherHomeWorkC23} /></ButtonWrap3>
        <ScoreText><FormattedMessage {...messages.TeacherHomeWorkC22} /><EditScore
          value={item.get('stuGetScore') ? item.get('stuGetScore') : 0}
          type="number"
          min="1"
          max={item.get('score') - 1}
          onChange={(evt) => {
            // console.log('onChange', evt.target.value);
            if (parseInt(evt.target.value) < item.get('score')) { // eslint-disable-line
              this.button4Click(item, index, item1, index1, parseInt(evt.target.value)); // eslint-disable-line
              // this.props.dispatch(updateMarkQuestionItemAction(index, item.set('stuGetScore', parseInt(evt.target.value))));
            }

            // return true;
          }}
          readOnly={item.get('correctResult') !== 3}
        ></EditScore>/{item.get('score')}</ScoreText>
      </AnswerTipFlexRow>);
    }
  }

  makeOneQuestionChildren(item, index, questionSource, subjectId, index1, item1) {
    let content = '';
    let awnser = '';
    let analysis = '';
    if (item.get('typeId') === 2 || item.get('typeId') === 1) { // 1单选 2多选
      if (questionSource === 2) {
        content =
          `${item.get('title')}${item
            .get('optionList')
            .filter(it => it !== null)
            .map((it, ix) => it.replace('<p>', `<p>${letterOptions[ix]}.`))
            .join('')}` || '';
      } else {
        content =
          `${item.get('title')}${item
            .get('optionList')
            .filter(it => it !== null)
            .map((it, ix) => `${letterOptions[ix]}.${it}`)
            .join('')}` || '';
      }
      // .replace(/src="|src=/g, `src="${Config.tkurl}/api/jyeoo/proxyImage?urlImage=`)
      // .replace(/background: url\('/g, `background: url('${Config.tkurl}/api/jyeoo/proxyImage?urlImage=`);
    } else {
      content = item.get('title') || '';
      // .replace(/src="|src=/g, `src="${Config.tkurl}/api/jyeoo/proxyImage?urlImage=`)
      // .replace(/background: url\('/g, `background: url('${Config.tkurl}/api/jyeoo/proxyImage?urlImage=`);
    }

    analysis = item.get('analysis') || '';
    // .replace(/src="|src=/g, `src="${Config.tkurl}/api/jyeoo/proxyImage?urlImage=`)
    // .replace(/background: url\('/g, `background: url('${Config.tkurl}/api/jyeoo/proxyImage?urlImage=`);
    if (item.get('typeId') === 2 || item.get('typeId') === 1) {
      awnser = (item.get('answerList') || []).join('');
      // .replace(/src="|src=/g, `src="${Config.tkurl}/api/jyeoo/proxyImage?urlImage=`)
      // .replace(/background: url\('/g, `background: url('${Config.tkurl}/api/jyeoo/proxyImage?urlImage=`);
    } else {
      awnser = (item.get('answerList') || []).join('');
      // .replace(/src="|src=/g, `src="${Config.tkurl}/api/jyeoo/proxyImage?urlImage=`)
      // .replace(/background: url\('/g, `background: url('${Config.tkurl}/api/jyeoo/proxyImage?urlImage=`);
    }
    // console.log(item.toJS());
    return (
      <OneQuestionWrap key={index}>
        {questionSource === 2 ? (
          <KatexQuestionWrap subjectId={subjectId}>
            <NoDiv>{`${index + 1}.`}</NoDiv>
            <ContentDiv
              className="ContentDiv"
              dangerouslySetInnerHTML={{ __html: renderToKatex(content) }}
            />
            <AwnserDiv>
              <FlexRowDiv>
                <MethodTipDiv>分析：</MethodTipDiv>
                <MethodContentDiv
                  dangerouslySetInnerHTML={{ __html: renderToKatex(analysis) }}
                />
              </FlexRowDiv>
              <FlexRowDiv>
                <MethodTipDiv>解答：</MethodTipDiv>
                <MethodContentDiv
                  dangerouslySetInnerHTML={{ __html: renderToKatex(awnser) }}
                />
              </FlexRowDiv>
            </AwnserDiv>
          </KatexQuestionWrap>
        ) : (
          <div>
            <NoDiv>{`${index + 1}.`}</NoDiv>
            <ContentDiv dangerouslySetInnerHTML={{ __html: content }} />
            <AwnserDiv>
              <FlexRowDiv>
                <MethodTipDiv>分析：</MethodTipDiv>
                <MethodContentDiv
                  dangerouslySetInnerHTML={{ __html: analysis }}
                />
              </FlexRowDiv>
              <FlexRowDiv>
                <MethodTipDiv>解答：</MethodTipDiv>
                <MethodContentDiv
                  dangerouslySetInnerHTML={{ __html: awnser }}
                />
              </FlexRowDiv>
            </AwnserDiv>
          </div>
        )}

        <HeaderLine
          className={'margin10px'}
          style={{
            marginTop: '10px',
            padding: '0px 10px 0px 10px',
            height: 'auto',
          }}
        >
          <AnswerTip>
            <FormattedMessage {...messages.TeacherHomeWorkC18} />{' '}
          </AnswerTip>
          <StuAnswerConten
            dangerouslySetInnerHTML={{ __html: item.get('stuAnswer') }}
          />
        </HeaderLine>
        <HeaderLine style={{ marginTop: '5px', padding: '0px 10px 0px 10px', height: 'auto' }}>
          {this.makeAwnserTipChildren(item, index, index1, item1)}
        </HeaderLine>
      </OneQuestionWrap>
    );
  }

  makeOneQuestion(item, index) {
    let content = '';
    let awnser = '';
    let analysis = '';
    const questionSource = item.get('questionSource');
    const questionOutputDTO = item.get('questionOutputDTO');
    if (item.getIn(['questionEsDto', 'Cate']) === 1) {
      if (questionSource === 2) {
        content = (`${item.getIn(['questionEsDto', 'Content'])}${item.getIn(['questionEsDto', 'Options']).filter((it) => it !== null).map((it, ix) => it.replace('<p>', `<p>${letterOptions[ix]}.`)).join('')}` || '');
      } else {
        content = (`${item.getIn(['questionEsDto', 'Content'])}${item.getIn(['questionEsDto', 'Options']).filter((it) => it !== null).map((it, ix) => `${letterOptions[ix]}.${it}`).join('')}` || '');
      }
        // .replace(/src="|src=/g, `src="${Config.tkurl}/api/jyeoo/proxyImage?urlImage=`)
        // .replace(/background: url\('/g, `background: url('${Config.tkurl}/api/jyeoo/proxyImage?urlImage=`);
    } else {
      content = (item.getIn(['questionEsDto', 'Content']) || '');
        // .replace(/src="|src=/g, `src="${Config.tkurl}/api/jyeoo/proxyImage?urlImage=`)
        // .replace(/background: url\('/g, `background: url('${Config.tkurl}/api/jyeoo/proxyImage?urlImage=`);
    }

    analysis = (item.getIn(['questionEsDto', 'Analyse']) || '');
      // .replace(/src="|src=/g, `src="${Config.tkurl}/api/jyeoo/proxyImage?urlImage=`)
      // .replace(/background: url\('/g, `background: url('${Config.tkurl}/api/jyeoo/proxyImage?urlImage=`);
    if (item.getIn(['questionEsDto', 'Cate']) === 1) {
      awnser = (item.getIn(['questionEsDto', 'Answer']) || '').replace(/\|/g, '、');
        // .replace(/src="|src=/g, `src="${Config.tkurl}/api/jyeoo/proxyImage?urlImage=`)
        // .replace(/background: url\('/g, `background: url('${Config.tkurl}/api/jyeoo/proxyImage?urlImage=`);
    } else {
      awnser = (item.getIn(['questionEsDto', 'Method']) || '');
        // .replace(/src="|src=/g, `src="${Config.tkurl}/api/jyeoo/proxyImage?urlImage=`)
        // .replace(/background: url\('/g, `background: url('${Config.tkurl}/api/jyeoo/proxyImage?urlImage=`);
    }
      // console.log(item.toJS());
    return (
      <OneQuestionWrap key={index}>
        {questionSource === 2 ? (<KatexQuestionWrap subjectId={item.getIn(['questionEsDto', 'subjectId']) || 0}>
          <NoDiv>{`${index + 1}.`}</NoDiv>
          <ContentDiv className="ContentDiv" dangerouslySetInnerHTML={{ __html: renderToKatex(content) }}></ContentDiv>
          {!questionOutputDTO.get('sub') ? <AwnserDiv>
            <FlexRowDiv>
              <MethodTipDiv>分析：</MethodTipDiv>
              <MethodContentDiv dangerouslySetInnerHTML={{ __html: renderToKatex(analysis) }}></MethodContentDiv>
            </FlexRowDiv>
            <FlexRowDiv>
              <MethodTipDiv>解答：</MethodTipDiv>
              <MethodContentDiv dangerouslySetInnerHTML={{ __html: renderToKatex(handleAnswersList(item.getIn(['questionEsDto', 'answerList']).toJS()).replace(/\|/g, '、')) }}></MethodContentDiv>
            </FlexRowDiv>
          </AwnserDiv> : (questionOutputDTO.get('children') || fromJS([])).map((item2, index2) => {
            return this.makeOneQuestionChildren(item2, index2, questionSource, item.getIn(['questionEsDto', 'subjectId']) || 0, index, item);
          })}
        </KatexQuestionWrap>) : (<div><NoDiv>{`${index + 1}.`}</NoDiv>
          <ContentDiv dangerouslySetInnerHTML={{ __html: content }}></ContentDiv>
          {!questionOutputDTO.get('sub') ? <AwnserDiv>
            <FlexRowDiv>
              <MethodTipDiv>分析：</MethodTipDiv>
              <MethodContentDiv dangerouslySetInnerHTML={{ __html: analysis }}></MethodContentDiv>
            </FlexRowDiv>
            <FlexRowDiv>
              <MethodTipDiv>解答：</MethodTipDiv>
              <MethodContentDiv dangerouslySetInnerHTML={{ __html: awnser }}></MethodContentDiv>
            </FlexRowDiv>
          </AwnserDiv> : (questionOutputDTO.get('children') || fromJS([])).map((item2, index2) => {
            return this.makeOneQuestionChildren(item2, index2, questionSource, item.getIn(['questionEsDto', 'subjectId']) || 0, index, item);
          })}</div>)}

        {!questionOutputDTO.get('sub') && <HeaderLine className={'margin10px'} style={{ marginTop: '10px', padding: '0px 10px 0px 10px', height: 'auto' }}>
          <AnswerTip><FormattedMessage {...messages.TeacherHomeWorkC18} /> </AnswerTip><StuAnswerConten dangerouslySetInnerHTML={{ __html: item.getIn(['questionEsDto', 'stuAns']) }} />
          </HeaderLine>}
        {!questionOutputDTO.get('sub') && <HeaderLine style={{ marginTop: '5px', padding: '0px 10px 0px 10px', height: 'auto' }}>
            {this.makeAwnserTip(item, index)}
          </HeaderLine>}
      </OneQuestionWrap>
    );
  }

  makeHomeWorkMarkModal() {
    const correct = this.getCorrect();
    const wrong = this.getCorrect(1);
    return (
      <ContentWrap>
        <TitleHeader>
          <FormattedMessage {...messages.TeacherHomeWorkC11} />
        </TitleHeader>
        <HomeWorkEditContent>
          <HomeWorkEditHeader>
            <HeaderLine>
              <Name>{this.props.homeworkmarkdata.get('name')}</Name>
            </HeaderLine>
            <HeaderLine>
              {this.props.selectstudent.get('studentName') ? <StudentName><FormattedMessage {...messages.TeacherHomeWorkC16} values={{ v: this.props.selectstudent.get('studentName') }} /></StudentName> : ''}
              <SubMitTime>{this.props.homeworkmarkdata.get('submitTime') ? moment(this.props.homeworkmarkdata.get('submitTime')).format('YYYY-MM-DD  HH:mm') : ''}</SubMitTime>
            </HeaderLine>
            <HeaderLine>
              {/* <TipInfo><FormattedMessage
                {...messages.TeacherHomeWorkC17} values={{ v1: `${this.props.homeworkmarkdata
                .get('homeworkLessonQuestionDTOList').filter((it, ix) => it.getIn(['questionEsDto', 'Cate']) === 1 || it.get('correctResult')).count()}`, v2: `${this.props.homeworkmarkdata
                .get('homeworkLessonQuestionDTOList').filter((it, ix) => it.getIn(['questionEsDto', 'Cate']) !== 1 && !it.get('correctResult')).count()}` }}
              /></TipInfo> */}
              <TipInfo><FormattedMessage
                {...messages.TeacherHomeWorkC17} values={{ v1: `${this.props.homeworkmarkdata.get('autoCorrectAmount') || 0}`, v2: `${this.props.homeworkmarkdata.get('waitCorrectAmount') || 0}` }}
              /></TipInfo>
            </HeaderLine>
          </HomeWorkEditHeader>

          <HomeWorkEditContentList>
            {this.props.homeworkmarkdata.get('homeworkLessonQuestionDTOList')
              .map((it, idx) => this.makeOneQuestion(it, idx))}

            <HomeWorkSummaryInfo>
              <HeaderLine>
                <FormattedMessage {...messages.TeacherHomeWorkC24} />
              </HeaderLine>
              <HeaderLine>
                <SummaryScoreTip>
                  <FormattedMessage {...messages.TeacherHomeWorkC25} />
                </SummaryScoreTip>
                <SummaryScoreValue>{this.getScore()}</SummaryScoreValue>
                <SummaryScoreTip><FormattedMessage {...messages.TeacherHomeWorkC26} /></SummaryScoreTip>
                {/* <SummaryScoreTip style={{ marginLeft: '32px' }}><FormattedMessage {...messages.TeacherHomeWorkC27} /></SummaryScoreTip>
                <SummarySpendTime>{this.props.homeworkmarkdata.get('costTime') ? parseInt(this.props.homeworkmarkdata.get('costTime') / 60000) : '0'}</SummarySpendTime>
                <SummaryScoreTip><FormattedMessage {...messages.TeacherHomeWorkC28} /></SummaryScoreTip> */}
              </HeaderLine>
              <HeaderLine>
                <SummaryAwnserTip>
                  <FormattedMessage
                    {...messages.TeacherHomeWorkC29} values={{ v: `${this.getCorrectRadio()}%`,
                    }}
                  />
                </SummaryAwnserTip>
                <SummaryAwnserTip style={{ marginLeft: '21px' }}><Img src={righticon} /><FormattedMessage {...messages.TeacherHomeWorkC30} values={{ v: `${correct}` }} /></SummaryAwnserTip>
                <SummaryAwnserTip style={{ marginLeft: '30px' }}><Img src={wrongicon} /><FormattedMessage {...messages.TeacherHomeWorkC31} values={{ v: `${wrong}` }} /></SummaryAwnserTip>
              </HeaderLine>
              <HeaderLine>
                <SummaryAwnserTip>
                  <FormattedMessage {...messages.TeacherHomeWorkC32} />
                </SummaryAwnserTip>
              </HeaderLine>
              <HeaderLine style={{ height: '80px' }}>
                <SummaryTextArea
                  onChange={e =>
                    this.props.dispatch(
                      setTeaTotalCommentAction(e.target.value),
                    )
                  }
                  value={this.props.teaTotalComment}
                  maxLength="400"
                  rows="3"
                />
              </HeaderLine>
              <HeaderLine>
                {this.getDown() === this.getTotal() ?
                  <AbleButton onClick={() => { this.props.dispatch(sendMarkHomeWorkDataAction()); this.props.dispatch(setTeaTotalCommentAction('')) }} style={{ marginTop: '10px' }} showtype={1}><FormattedMessage {...messages.TeacherHomeWorkC33} /></AbleButton>
                  :
                  <DisableButton style={{ marginTop: '10px' }}><FormattedMessage {...messages.TeacherHomeWorkC33} /></DisableButton>
                }

              </HeaderLine>
            </HomeWorkSummaryInfo>
          </HomeWorkEditContentList>
        </HomeWorkEditContent>

        {AlertModal(this,
          this.props.alertmsg.get('alertmessage'),
          { cancelFunc: this.cancelFunc,
            sureFunc: this.sureFunc,
            styles: { fontSize: '18px', paddingLeft: '45px', paddingRight: '45px' },
            showtype: 'submitsuccess', imgtype: 'warning', isOpen: this.props.alertmsg.get('open') })}
      </ContentWrap>
    );
  }

  render() {
    // console.log('render,',this.props.homeworkmarkdata.toJS());
    return this.makeHomeWorkMarkModal();
  }
}

HomeWorkMark.propTypes = {
  dispatch: PropTypes.func.isRequired,
  homeworkmarkdata: PropTypes.instanceOf(Immutable.Map).isRequired,
  selectstudent: PropTypes.instanceOf(Immutable.Map),
  // getscoretype: PropTypes.number.isRequired,
  teaTotalComment: PropTypes.string.isRequired,
  // closeDivFn: PropTypes.func.isRequired,
  // selectedhomeworknewcourse: PropTypes.instanceOf(Immutable.Map).isRequired,
  alertmsg: PropTypes.instanceOf(Immutable.Map).isRequired,
};

const mapStateToProps = createStructuredSelector({
  homeworkmarkdata: makeSelectHomeWorkMarkData(),
  selectstudent: makeSelectStudentItem(),
  // getscoretype: makeSelectScoreType(),
  teaTotalComment: makeSelectTeaTotalComment(),
  alertmsg: makeSelectAlertMsg(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeWorkMark);
