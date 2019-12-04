import React from 'react';
import { message } from 'antd';
import { fromJS } from 'immutable';
import E from 'wangeditor';
import Config from 'utils/config';
import { FlexRowCenter, FlexColumn } from 'components/FlexBox';
import { ifLessThan, renderToKatex, filterHtmlForm } from 'components/CommonFn';
import {
  ValueLeft,
  ListItem,
  FillLeftWrapper,
  ItemTitle,
  PromptText,
  MustSel,
  ContentBox,
  TextArea,
} from './style';
import ZmTip from '../tools/tip';
import { windowWhen } from 'rxjs/operator/windowWhen';

export const fillConfig = {
  minAnswerCount: 3,  // 正确答案的最少数量
  maxAnswerCount: 10,  // 正确答案的最大数量
  minErrAnswerCount: 1,  // 错误答案的最小数量
  maxErrAnswerCount: 3,  // 错误答案的最大数量
  maxQuestionContentCount: 200,  // 题干内容最大值
  maxWordLength: 15, // 一个词最长限制
};


class FillAnswerList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.changeText = this.changeText.bind(this);
    this.changeSelected = this.changeSelected.bind(this);
    this.addAnswer = this.addAnswer.bind(this);
    this.getSelection = this.getSelection.bind(this);
    this.getText = this.getText.bind(this);
    this.state = {
      selectionValue: '',
      showTip: false,
      selectPosition: {
        top: '',
        left: '',
      },
    };
  }
  componentDidMount() {
    const editor = new E('', this.textEditor);

    editor.customConfig.pasteFilterStyle = true;
    editor.customConfig.pasteIgnoreImg = true;
    editor.customConfig.zIndex = 9;
    editor.customConfig.onchangeTimeout = 100;
    editor.customConfig.onchange = (html) => this.changeText(html);
    editor.customConfig.pasteTextHandle = function (content) {
      return content.replace(/<[^<z]+>/g, '');
    };
    editor.create();

    editor.txt.html(this.getText()); // 设置默认数据内容
    editor.$textElem[0].addEventListener('mouseup', (e) => {  // 绑定事件获取到选中内容
      const userSelection = this.getSelection();
      if (userSelection.toString().length <= 0) {
        this.setState({ showTip: false });
        return;
      }
      // console.dir(userSelection, 'userSelection');
      this.setState({ selectionValue: userSelection.toString() || '', userRange: userSelection.getRangeAt(0) });
      this.changeSelected(e);
    });

    window.wangeditor = this.editor = editor;
  }
  componentWillUnmount() {
    window.wangeditor = this.editor = null;
  }
  getSelection(e) {
    let userSelection = '';
    if (window.getSelection) { // 主流浏览器
      userSelection = window.getSelection();
    } else if (document.selection) { // IE浏览器、Opera
      userSelection = document.selection.createRange();
    }
    return userSelection;
  }
  getText() {
    const { newQuestion } = this.props;
    return newQuestion.get('content') || '';
  }
  changeText(value) { // 输入内容变化
    const { newQuestion } = this.props;
    const { index, degree, setNewQuestionMsg } = this.props;

    if (filterHtmlForm(value).length > fillConfig.maxQuestionContentCount) {
      message.info(`题干内容最多不能超过${fillConfig.maxQuestionContentCount}！`);
      const textValue = newQuestion.get('content') || '';
      this.editor.txt.html(textValue);
      return;
    }
    setNewQuestionMsg(degree, index, 'content', value);
  }
  changeSelected(e) { // 选中文本时
    const { newQuestion, setNewQuestionData } = this.props;
    const { selectionValue } = this.state;

    // 如果没有选中内容
    if (!selectionValue) {
      this.setState({ selectionValue: '', showTip: false });
      return;
    }

    // 设置“添加答案”的位置
    this.setState({ selectionValue, selectPosition: { top: e.offsetY + e.target.offsetTop - 8, left: e.offsetX - 25 }, showTip: true });
  }
  addAnswer() {
    const { newQuestion, setNewQuestionData } = this.props;
    const { userRange, selectionValue } = this.state;

    // 获取到现有的选项与答案
    const optionList = (newQuestion.get('optionList') || fromJS([])).filter((it) => filterHtmlForm(it));
    const answerList = (newQuestion.get('answerList') || fromJS([])).filter((it) => filterHtmlForm(it));

    if (/\n/.test(selectionValue)) { // 禁止跨段落选词
      message.warn('请不要跨段落选词！');
      this.setState({ showTip: false });
      return;
    } else if (selectionValue.length > fillConfig.maxWordLength) { // 限制选词的长度
      message.info(`单个空最长允许${fillConfig.maxWordLength}个字。`);
      this.setState({ showTip: false });
      return;
    } else if (answerList.count() >= fillConfig.maxAnswerCount) {
      message.info(`填空项最多可添加${fillConfig.maxAnswerCount}个选项。`);
      this.setState({ showTip: false });
      return;
    } else if ((userRange.startContainer.wholeText !== userRange.endContainer.wholeText)) {
      message.info('请选择连续的字(词)作为答案。');
      this.setState({ showTip: false });
      return;
    }

    // 如果已经在选项中，则提示
    if (optionList.includes(selectionValue)) {
      message.info('该答案已经包含在选项中。');
      this.setState({ showTip: false });
      return;
    }

    // 插入节点
    const zmfill = document.createElement('zmfill');
    zmfill.setAttribute('answerString', selectionValue);
    this.editor.cmd._insertElem([zmfill]);

    // 获取到新的选项与答案数据
    const newAnswerList = fromJS(Array.from($('.w-e-text zmfill').map(function sortAnswer() {
      return this.getAttribute('answerString');
    })));
    const errorAnswerList = optionList.filter((it) => !answerList.includes(it));
    const newOptionList = newAnswerList.concat(errorAnswerList);
    // 设置保存现在的选项与答案
    setNewQuestionData(newQuestion.set('optionList', newOptionList).set('answerList', newAnswerList).set('score', newAnswerList.count() * newQuestion.get('itemScore')));
    this.setState({ showTip: false }, () => {
      // 每次设置后更新下保存的数据
      this.editor.change();
    });
  }
  render() {
    const { index, i, degree, type, newQuestion, mustSel, width } = this.props;
    const { showTip, selectionValue, selectPosition } = this.state;
    return (<FillLeftWrapper>
      <ItemTitle>{mustSel ? <MustSel>*</MustSel> : ''}题干： <PromptText>(最多200字)</PromptText></ItemTitle>
      <ContentBox>
        <TextArea innerRef={x => this.textEditor = x} id="textEditor"></TextArea>
        {showTip ? <ZmTip addAnswer={this.addAnswer} style={selectPosition} selectionValue={selectionValue}></ZmTip> : ''}
      </ContentBox>
    </FillLeftWrapper>);
  }
}

export default FillAnswerList;
