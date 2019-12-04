/**
 * EnteringComplex
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import immutable, { fromJS } from 'immutable';
import { FlexRowCenter, FlexColumn, FlexCenter } from 'components/FlexBox';
import {
  PlaceHolderBox,
  wangStyle,
  textEllipsis,
  MinWidthBox,
  listStyle,
  questionStyle,
} from 'components/CommonFn/style';
import {
  filterHtmlForm,
  toString,
  toNumber,
  numberToLetter,
  findParentIsDiv,
} from 'components/CommonFn';
import { Select, Button, message, InputNumber, Checkbox } from 'antd';
import { AppLocalStorage } from 'utils/localStorage';
import Config from 'utils/config';
import Editor from 'wangeditor';
import Katex from 'katex';

import { childTemplateType } from './config';
import {
  setComplexQuestionItemMsgAction,
  setComplexQuestionItemAction,
} from './actions';
import {
  makeComplexQuestionItemMsg,
  makeComplexQuestionItem,
  makeAllQuestionTypeList,
} from './selectors';
import { compatibleForKatexUpgrade } from 'zm-tk-ace/utils';
require('katex/dist/katex.min.css');

const ComplexWrapper = styled(FlexColumn)`
  flex: 1;
  // overflow-y: auto;
  height: 100%;
  width: 100%;
  position: relative;
`;
const QuestionWrapper = styled(FlexColumn)`
  flex: 1;
  position: absolute;
  width: 100%;
`;
const BigQuestionMsgBox = styled(FlexColumn)`
  min-height: 200px;
`;
const QuestionMsgBox = styled(FlexRowCenter)`
  height: 34px;
`;
const QuestionMsgValue = styled(FlexRowCenter)`
  flex: 1;
  height: 34px;
`;
const PlaceHolder20px = styled.div`
  width: 20px;
`;
const MainQuestionContent = styled(FlexRowCenter)`
  margin-top: 5px;
  height: 34px;
`;
const MustInput = styled(FlexCenter)`
  margin: 0;
  width: 10px;
  & > div {
    color: red;
  }
`;
// const MainQuestionValue = styled.span``;
const MainQuestionTextArea = styled.div`
  flex: 1;
  min-height: 150px;
  border: 1px solid #eee;
  padding: 5px;
  cursor: text;
  // p {
  //   line-height: 2.5;
  // }
  .katex {
    font-size: 1.1em;
  }
  ${questionStyle}
  ${listStyle}
  ${wangStyle}
`;
const SmallQuestionBox = styled(FlexColumn)`
  min-height: 300px;
  padding-bottom: 15px;
  border-bottom: 1px solid #999;
`;
const Indent2em = styled.p`
  // width: 50%;
  text-indent: 0.5em;
  overflow: hidden;
  ${textEllipsis}
`;
const SmallQuestionTitleValue = styled.p`
  font-family: Microsoft YaHei;
  margin-top: 10px;
  font-size: 16px;
  line-height: 26px;
`;
const ValueBox = styled.div`
  min-width: 40px;
  text-align: right;
`;
const ChooseOptionsWrapper = styled(FlexColumn)`
  padding: 10px 0;
`;
const ChooseTitleValue = styled.div`
  height: 34px;
`;
const OptionsBox = styled(FlexRowCenter)`
  min-height: 40px;
`;
const AddOptions = styled(FlexRowCenter)``;
const AnswerListBox = styled(FlexRowCenter)`
  min-height: 30px;
  flex-wrap: wrap;
  // justify-content: space-around;
`;
const OptionBox = styled(FlexCenter)`
  flex: 1;
  min-width: 50px;
  padding-left: 20px;
`;
const DelBox = styled(ValueBox)`
  text-decoration: underline;
  color: #108ee9;
  text-align: center;
  cursor: pointer;
`;
const QuestionItemWrapper = styled(FlexColumn)`
  min-height: 300px;
`;
const HeightOrder = styled.div`
  height: ${props => props.boxHeight}px;
`;
const ImitationInput = styled.div`
  flex: 1;
  min-height: 30px;
  line-height: 24px;
  border: 1px solid #eee;
  padding: 2px 5px;
  border-radius: 3px;
  cursor: text;
  &:hover {
    border: 1px solid #108ee9;
  }
`;
const AddSmallQuestionBox = styled(FlexCenter)`
  height: 50px;
  justify-content: space-between;
`;

/**
 * 获取到该题的题型
 * @param {*} typeList Map
 * @param {*} index number
 */
const getQuestionType = (typeList, id) => {
  let res = fromJS({});
  if (typeList.count() > 0) {
    res =
      typeList.filter(item => toNumber(item.get('id')) === id).get(0) ||
      fromJS({ name: '请选择题型', id: -1 });
  } else {
    res = fromJS({ name: '请选择题型', id: -1 });
  }
  return res;
};

export class EnteringComplex extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.initEditor = this.initEditor.bind(this);
    // this.addMath = this.addMath.bind(this);
    this.complexItem = this.complexItem.bind(this);
    this.clickAnswerItem = this.clickAnswerItem.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.editorClick = this.editorClick.bind(this);
    this.editSuccess = this.editSuccess.bind(this);
    this.addSmallQuestion = this.addSmallQuestion.bind(this);
    this.setEditorPosition = this.setEditorPosition.bind(this);
    this.showEditor = this.showEditor.bind(this);
    this.setClickTarget = this.setClickTarget.bind(this);
    this.setQuestionList = this.setQuestionList.bind(this);
    this.setQuestionMsg = this.setQuestionMsg.bind(this);
    this.removeSmallQuestion = this.removeSmallQuestion.bind(this);
    this.cancelEditor = this.cancelEditor.bind(this);
    this.state = {
      editorPosition: {
        show: false,
        left: 300,
        top: 50,
        startLeft: '',
        startTop: '',
      },
      clickTarget: {
        questionItem: '',
        index: '',
        i: '',
        type: '',
        property: '',
      },
      memory: '',
    };
  }
  /**
   * 设置编辑器位置相关参数
   * @param {*} obj Object
   */
  setEditorPosition(obj) {
    const editorPosition = this.state.editorPosition;
    this.setState({ editorPosition: Object.assign({}, editorPosition, obj) });
  }
  setClickTarget(obj) {
    this.setState({ clickTarget: obj });
  }
  setQuestionList(index, obj, complete) {
    if (typeof index !== 'number') {
      alert(`${index} is not a number`);
      return;
    }
    let newQuestionList = null;
    if (complete) {
      newQuestionList = obj;
    } else {
      const questionList = this.props.complexQuestionItem;
      newQuestionList = questionList.set(index, obj);
    }
    this.props.saveComplexQuestion(newQuestionList);
  }
  setQuestionMsg(property, value) {
    const newComplexQuestionMsg = this.props.complexQuestionItemMsg.set(
      property,
      value,
    );
    this.props.saveComplexQuestionMsg(newComplexQuestionMsg);
  }
  showEditor(flag) {
    this.setEditorPosition({ show: flag });
  }
  initEditor() {
    const editor = new Editor(this.editor);
    const config = {
      menus: [
        'head', // 标题
        'bold', // 粗体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
      ],
      onchangeTimeout: 10,
      onchange: html => {
        let hasFormula = false;
        const newHtml = html.replace(/\\\$([^\$]+)\\\$/g, (e, $1) => {
          let formulaPaste = '';
          try {
            formulaPaste = Katex.renderToString(compatibleForKatexUpgrade(filterHtmlForm($1)));
          } catch (err) {
            formulaPaste = `<span>${$1}<span>
                  <span class=“prompt” style="color: #999!important">transform error, please inspect your input</span>`;
          }
          hasFormula = true;
          return `<span>&nbsp;</span>${formulaPaste}<span>&nbsp;</span>`;
        });
        setTimeout(() => {
          if (hasFormula) {
            editor.txt.html(newHtml);
          }
          const clickTarget = this.state.clickTarget;
          if (clickTarget.type && clickTarget.type === 'questionMsg') {
            const questionMsg = this.props.complexQuestionItemMsg.set(
              clickTarget.property,
              newHtml,
            );
            questionMsg[clickTarget.property] = newHtml;
            this.props.saveComplexQuestionMsg(fromJS(questionMsg));
          } else {
            const questionItem = clickTarget.questionItem.toJS();
            if (clickTarget.i === -1) {
              questionItem[clickTarget.property] = newHtml;
            } else {
              questionItem[clickTarget.property][clickTarget.i] = newHtml;
            }
            this.setQuestionList(clickTarget.index, fromJS(questionItem));
          }
        }, 100);
      },
      pasteFilterStyle: false,
      pasteTextHandle: content => {
        const htmlSring = content.toString();
        const pList = htmlSring.match(
          /<body\s[^>]*>(?:(?!<\/body>)[\s\S])*<\/body>/gi,
        ) || [htmlSring];
        const htmlStr = Array.from(pList)[0]
          .replace(/<img[^>]+alt=["|']学科网[^>]+>/gi, '')
          .replace(/<!--\[if[^>]*>(?:(?!endif]-->)[\s\S])*endif]-->/gi, '')
          .replace(/<o:p><\/o:p>/gi, '')
          .replace(/<v:[^>]*>([\s\S])*<\/v:[^>]*>/gi, '');
        const html = htmlStr
          .replace(/\\\[|\\]/g, (e, $1) => '\\$')
          .replace(/\\\$([^\$]+)\\\$/g, (ev, $1) => {
            let formulaPaste = '';
            try {
              formulaPaste = Katex.renderToString(compatibleForKatexUpgrade(filterHtmlForm(
                $1.replace(/\s?([\u4e00-\u9fa5]+)/g, (e, $1) => {
                  return `\\text{${$1}}`;
                }),
              )));
            } catch (err) {
              formulaPaste = `<span>${$1}<span>
                      <span class="prompt" style="color: #999!important">transform error, please inspect your input</span>`;
            }
            return `<span>&nbsp;</span>${formulaPaste}<span>&nbsp;</span>`;
          });
        return html || content;
      },
      customUploadImg: (files, insert) => {
        const form = new FormData();
        form.append('file', files[0]);
        fetch(`${Config.trlink_qb}/api/question/fileUpload`, {
          method: 'POST',
          headers: {
            mobile: AppLocalStorage.getMobile(),
            password: AppLocalStorage.getPassWord(),
          },
          body: form,
        })
          .then(response => {
            return response.json();
          })
          .then(res => {
            if (res && res.code.toString() === '0') {
              insert(res.data);
            } else {
              message.warning(res.message || '图片上传失败！');
            }
          });
      },
      uploadImgShowBase64: false,
    };
    editor.customConfig = Object.assign(editor.customConfig, config);
    editor.create();
    this.Editor = editor;
    this.editorWrapper.addEventListener(
      'dragstart',
      this.handleDragStart,
      false,
    );
    this.editorWrapper.addEventListener('dragend', this.handleDrop, false);
  }
  /**
   * 开始拖拽编辑器时触发，用于记录初始编辑器的位置
   * @param {*} e 事件对象
   */
  handleDragStart(e) {
    e.stopPropagation();
    this.setEditorPosition({ startLeft: e.clientX, startTop: e.clientY });
  }
  /**
   * dropEnd时触发事件
   * @param {*} e 事件对象 Object
   */
  handleDrop(e) {
    e.stopPropagation();
    const editorPosition = this.state.editorPosition;
    const deltaX = e.clientX - editorPosition.startLeft;
    const deltaY = e.clientY - editorPosition.startTop;
    this.setEditorPosition({
      left: editorPosition.left + deltaX,
      top: editorPosition.top + deltaY,
    });
  }
  /**
   * 添加子题
   */
  addSmallQuestion() {
    const children = this.props.currentQuestion.getIn([
      'questionOutputDTO',
      'children',
    ]);
    const newChildren = children.push(
      fromJS({
        score: 3,
        title: '',
        optionList: ['', '', '', ''],
        answerList: [''],
        analysis: '',
        typeId: -1,
      }),
    );
    this.props.setQuestionsList('parent', -1, 'children', newChildren);
  }
  /**
   * 删除最后一个子题
   */
  removeSmallQuestion() {
    const children = this.props.currentQuestion.getIn([
      'questionOutputDTO',
      'children',
    ]);
    if (children.count() <= 1) {
      message.warning('子题至少得有一个');
      return;
    }
    const newChildren = children.pop();
    this.props.setQuestionsList('parent', -1, 'children', newChildren);
  }
  /**
   * 选择题-增加选项
   * @param {Map} questionItem 当前小题信息
   * @param {int} index 当前小题的序号
   */
  addOption(questionItem, index) {
    if (questionItem.get('optionList').count() > 25) {
      alert('不可以增加更多选项了');
      return;
    }
    const newOptionList = questionItem.get('optionList').push('');
    this.props.setQuestionsList(
      'childrenType',
      index,
      'optionList',
      newOptionList,
    );
  }
  /**
   * 删除选项
   */
  removeOptionItem(e, index, questionItem, i, type) {
    if (questionItem.get(type).count() <= 1) {
      alert('选项已经只剩 1 个了， 不能再少了！');
      return;
    }
    const newAnswerList = questionItem.get(type).splice(i, 1);
    this.props.setQuestionsList('childrenType', index, type, newAnswerList); // e, index, questionItem, i, 'optionList'
  }
  /**
   * 填空题增加填空-默认增加空的选项
   * @param {Map} questionItem 当前小题信息
   * @param {int} index 当前小题的序号
   */
  addEmptyOption(questionItem, index) {
    if (questionItem.get('answerList').count() > 25) {
      message.warn('已经达到最大数量上线，不可以增加更多了。');
      return;
    }
    const newAnswerList = questionItem.get('answerList').push('');
    this.props.setQuestionsList(
      'childrenType',
      index,
      'answerList',
      newAnswerList,
    );
  }
  /**
   * 选择题点击答案选项
   * @param {Map} questionItem 当前小题信息
   * @param {int} index 当前小题的序号
   * @param {int} i 档期那选项的序号
   */
  clickAnswerItem(questionItem, index, i) {
    const answerList = questionItem
      .get('answerList')
      .filter(it => filterHtmlForm(it));
    let newAnswerList = [];
    const answerIndex = answerList.indexOf(numberToLetter(i));
    if (answerIndex > -1) {
      newAnswerList = answerList.delete(answerIndex);
    } else {
      newAnswerList = answerList.push(numberToLetter(i)).sort();
    }
    const newQuestionItem = questionItem.set('answerList', newAnswerList);
    const questionList = this.props.complexQuestionItem;
    const newQuestionList = questionList.set(index, newQuestionItem);
    this.setQuestionList(-1, newQuestionList, true);
  }
  /**
   * 点击输入框开始编辑
   * @param {int} index 当前子题序号
   * @param {Map} questionItem 当前子题项内容
   * @param {int} i 选项在选项中的序号
   * @param {string} property 判断是子题中哪个属性
   * @param {*} type 判断类型（用于判断题目信息还是子题信息）
   */
  editorClick(e, index, questionItem, i, property, type) {
    this.setClickTarget({ index, questionItem, i, property, type });
    const html = findParentIsDiv(e.target).innerHTML;
    this.Editor.txt.html(html);
    this.setState({ memory: html });
    this.showEditor(true);
  }
  // 点击完成编辑
  editSuccess() {
    this.showEditor(false);
  }
  // 取消编辑
  cancelEditor() {
    const clickTarget = this.state.clickTarget;
    const content = this.state.memory;
    if (clickTarget.type && clickTarget.type === 'questionMsg') {
      const questionMsg = this.props.complexQuestionItemMsg.set(
        clickTarget.property,
        content,
      );
      questionMsg[clickTarget.property] = content;
      this.props.saveComplexQuestionMsg(fromJS(questionMsg));
    } else {
      const questionItem = clickTarget.questionItem.toJS();
      if (clickTarget.i === -1) {
        questionItem[clickTarget.property] = content;
      } else {
        questionItem[clickTarget.property][clickTarget.i] = content;
      }
      this.setQuestionList(clickTarget.index, fromJS(questionItem));
    }
    this.showEditor(false);
  }
  /**
   * 每一个小题
   * @param {Map} questionItem 小题信息
   * @param {int} index 小题的序号
   */
  complexItem(questionItem, index) {
    let res = '';
    const questionTypeItem = getQuestionType(
      this.props.questionTypeList,
      questionItem.get('typeId'),
    );
    const questionTypeId = questionTypeItem.get('id');
    switch (questionTypeId) {
      case 2:
        res = (
          <QuestionItemWrapper>
            <QuestionMsgValue>题干：</QuestionMsgValue>
            <MainQuestionTextArea
              dangerouslySetInnerHTML={{ __html: questionItem.get('title') }}
              onClick={e =>
                this.props.editorClick(e, index, questionItem, -1, 'title')
              }
            />
            <ChooseOptionsWrapper>
              <FlexRowCenter style={{ height: '34px' }}>
                <MustInput>
                  <div>*</div>
                </MustInput>
                <ChooseTitleValue style={{ height: 'auto' }}>
                  选项：
                </ChooseTitleValue>
              </FlexRowCenter>
              {questionItem.get('optionList').map((it, i) => {
                return (
                  <OptionsBox key={i}>
                    <ValueBox style={{ textAlign: 'center' }}>
                      {numberToLetter(i)}
                    </ValueBox>
                    <ImitationInput
                      dangerouslySetInnerHTML={{ __html: it }}
                      onClick={e =>
                        this.props.editorClick(
                          e,
                          index,
                          questionItem,
                          i,
                          'optionList',
                        )
                      }
                    />
                    <DelBox
                      onClick={e =>
                        this.removeOptionItem(
                          e,
                          index,
                          questionItem,
                          i,
                          'optionList',
                        )
                      }
                    >
                      删除
                    </DelBox>
                  </OptionsBox>
                );
              })}
              <AddOptions style={{ paddingLeft: 40 }}>
                <Button
                  type="primary"
                  ghost
                  onClick={() => this.addOption(questionItem, index)}
                >
                  添加选项
                </Button>
              </AddOptions>
            </ChooseOptionsWrapper>
            <QuestionMsgValue>
              <MustInput>
                <div>*</div>
              </MustInput>
              答案：
            </QuestionMsgValue>
            <Checkbox.Group
              style={{ width: '100%' }}
              value={questionItem.get('answerList').toJS()}
              onChange={answerList => {
                this.props.setQuestionsList(
                  'childrenType',
                  index,
                  'answerList',
                  fromJS(answerList.filter(it => /^[A-Z]$/.exec(it)).sort()),
                );
              }}
            >
              <AnswerListBox>
                {new Array(questionItem.get('optionList').count())
                  .fill('')
                  .map((it, i) => {
                    return (
                      <OptionBox key={i}>
                        {numberToLetter(i)}
                        <Checkbox
                          style={{ marginLeft: 4 }}
                          value={numberToLetter(i)}
                        />
                      </OptionBox>
                    );
                  })}
              </AnswerListBox>
            </Checkbox.Group>
            <QuestionMsgValue>
              <MustInput>
                <div>*</div>
              </MustInput>
              解析：
            </QuestionMsgValue>
            <MainQuestionTextArea
              dangerouslySetInnerHTML={{ __html: questionItem.get('analysis') }}
              onClick={e =>
                this.props.editorClick(e, index, questionItem, -1, 'analysis')
              }
            />
          </QuestionItemWrapper>
        );
        break;
      case 3:
        res = (
          <QuestionItemWrapper>
            <QuestionMsgValue>题干：</QuestionMsgValue>
            <MainQuestionTextArea
              dangerouslySetInnerHTML={{ __html: questionItem.get('title') }}
              onClick={e =>
                this.props.editorClick(e, index, questionItem, -1, 'title')
              }
            />
            <FlexRowCenter style={{ minHeight: 40 }}>
              <PlaceHolderBox />
              <Button
                type="primary"
                ghost
                onClick={() => this.addEmptyOption(questionItem, index)}
              >
                添加空选项
              </Button>
            </FlexRowCenter>
            <ChooseOptionsWrapper>
              <QuestionMsgValue>
                <MustInput>
                  <div>*</div>
                </MustInput>
                答案：
              </QuestionMsgValue>
              {questionItem.get('answerList').map((it, i) => {
                return (
                  <OptionsBox key={i}>
                    <ValueBox style={{ textAlign: 'center' }}>{i + 1}</ValueBox>
                    <ImitationInput
                      dangerouslySetInnerHTML={{
                        __html: questionItem.get('answerList').get(i),
                      }}
                      onClick={e =>
                        this.props.editorClick(
                          e,
                          index,
                          questionItem,
                          i,
                          'answerList',
                        )
                      }
                    />
                    <DelBox
                      onClick={e =>
                        this.removeOptionItem(
                          e,
                          index,
                          questionItem,
                          i,
                          'answerList',
                        )
                      }
                    >
                      删除
                    </DelBox>
                  </OptionsBox>
                );
              })}
            </ChooseOptionsWrapper>
            <QuestionMsgValue>
              <MustInput>
                <div>*</div>
              </MustInput>
              解析：
            </QuestionMsgValue>
            <MainQuestionTextArea
              dangerouslySetInnerHTML={{ __html: questionItem.get('analysis') }}
              onClick={e =>
                this.props.editorClick(e, index, questionItem, -1, 'analysis')
              }
            />
          </QuestionItemWrapper>
        );
        break;
      case 4:
        res = (
          <QuestionItemWrapper>
            <HeightOrder boxHeight={10} /> {/* 设置间隔 */}
            <QuestionMsgValue>题干：</QuestionMsgValue>
            <MainQuestionTextArea
              dangerouslySetInnerHTML={{ __html: questionItem.get('title') }}
              onClick={e =>
                this.props.editorClick(e, index, questionItem, -1, 'title')
              }
            />
            <HeightOrder boxHeight={10} />
            <QuestionMsgValue>
              <MustInput>
                <div>*</div>
              </MustInput>
              答案：
            </QuestionMsgValue>
            <MainQuestionTextArea
              dangerouslySetInnerHTML={{
                __html: questionItem.get('answerList').get(0),
              }}
              onClick={e =>
                this.props.editorClick(e, index, questionItem, 0, 'answerList')
              }
            />
            <HeightOrder boxHeight={10} />
            <QuestionMsgValue>
              <MustInput>
                <div>*</div>
              </MustInput>
              解析：
            </QuestionMsgValue>
            <MainQuestionTextArea
              dangerouslySetInnerHTML={{ __html: questionItem.get('analysis') }}
              onClick={e =>
                this.props.editorClick(e, index, questionItem, -1, 'analysis')
              }
            />
          </QuestionItemWrapper>
        );
        break;
      default:
        break;
    }
    return (
      <SmallQuestionBox>
        <SmallQuestionTitleValue>子题{index + 1}</SmallQuestionTitleValue>
        <QuestionMsgBox>
          <QuestionMsgValue style={{ flex: 0.5 }}>
            <ValueBox>题号：</ValueBox>
            <Indent2em>{index + 1}</Indent2em>
          </QuestionMsgValue>
          <QuestionMsgValue>
            <ValueBox>分值：</ValueBox>
            <InputNumber
              style={{ flex: 1 }}
              min={0}
              max={30}
              step={0.5}
              value={toNumber(questionItem.get('score'))}
              placeholder="请输入分值"
              onChange={value => {
                this.props.setQuestionsList(
                  'childrenType',
                  index,
                  'score',
                  toNumber(value),
                );
                setTimeout(() => {
                  let allScore = 0;
                  (
                    this.props.currentQuestion.getIn([
                      'questionOutputDTO',
                      'children',
                    ]) || fromJS([])
                  ).forEach(item => {
                    allScore += item.get('score') || 3;
                  });
                  this.props.setQuestionsList('parent', -1, 'score', allScore);
                }, 50);
              }}
            />
          </QuestionMsgValue>
          <PlaceHolder20px />
          <QuestionMsgValue>
            <MustInput>
              <div>*</div>
            </MustInput>
            <ValueBox>题型：</ValueBox>
            <Select
              labelInValue
              defaultValue={{ key: '请选择题型', label: '-1' }}
              style={{ flex: 1 }}
              value={{
                key: toString(questionTypeItem.get('id')),
                label: toString(questionTypeItem.get('name')),
              }}
              onChange={value => {
                const typeId = toNumber(value.key);
                if (typeId === 2) {
                  this.props.setQuestionsList(
                    'childrenType',
                    index,
                    'answerList',
                    fromJS([]),
                    'typeId',
                    typeId,
                    'optionList',
                    fromJS(['', '', '', '']),
                  );
                } else {
                  this.props.setQuestionsList(
                    'childrenType',
                    index,
                    'answerList',
                    fromJS(['']),
                    'typeId',
                    typeId,
                    'optionList',
                    fromJS([]),
                  );
                }
              }}
            >
              {this.props.questionTypeList.map((it, i) => (
                <Select.Option key={i} value={toString(it.get('id'))}>
                  {it.get('name')}
                </Select.Option>
              ))}
            </Select>
          </QuestionMsgValue>
        </QuestionMsgBox>
        {res}
      </SmallQuestionBox>
    );
  }
  render() {
    const questionData = this.props.currentQuestion;
    const allQuestionTypeItem = getQuestionType(
      this.props.allQuestionTypeList,
      questionData.getIn(['questionOutputDTO', 'typeId']),
    );
    return (
      <ComplexWrapper>
        <QuestionWrapper>
          <BigQuestionMsgBox>
            <QuestionMsgBox>
              <QuestionMsgValue>
                <MinWidthBox width={60}>大题编号：</MinWidthBox>
                <Indent2em>{questionData.get('bigNum')}</Indent2em>
              </QuestionMsgValue>
              <QuestionMsgValue>
                <MinWidthBox width={60}>题目名称：</MinWidthBox>
                <Indent2em>{questionData.get('bigName')}</Indent2em>
              </QuestionMsgValue>
            </QuestionMsgBox>
            <QuestionMsgBox>
              <QuestionMsgValue>
                <MinWidthBox width={60}>题目编号：</MinWidthBox>
                <Indent2em>{questionData.get('serialNumber')}</Indent2em>
              </QuestionMsgValue>
              <QuestionMsgValue>
                <MinWidthBox width={60}>题目类型：</MinWidthBox>
                <Indent2em>{allQuestionTypeItem.get('name')}</Indent2em>
              </QuestionMsgValue>
            </QuestionMsgBox>
            <QuestionMsgBox>
              <QuestionMsgValue>
                <MinWidthBox width={60}>题目总分：</MinWidthBox>
                <Indent2em>
                  {questionData.getIn(['questionOutputDTO', 'score'])}
                </Indent2em>
              </QuestionMsgValue>
              <QuestionMsgValue />
            </QuestionMsgBox>
            <MainQuestionContent>
              <MustInput>
                <div>*</div>
              </MustInput>
              主题干：
            </MainQuestionContent>
            <MainQuestionTextArea
              dangerouslySetInnerHTML={{
                __html:
                  questionData.getIn(['questionOutputDTO', 'title']) || '',
              }}
              onClick={e =>
                this.props.editorClick(
                  e,
                  -1,
                  fromJS({}),
                  -1,
                  'title',
                  'questionMsg',
                )
              }
            />
          </BigQuestionMsgBox>
          {(
            questionData.getIn(['questionOutputDTO', 'children']) || fromJS([])
          ).map((item, index) => {
            return <div key={index}>{this.complexItem(item, index)}</div>;
          })}
          <AddSmallQuestionBox>
            <Button size="large" type="primary" onClick={this.addSmallQuestion}>
              添加子题
            </Button>
            <Button size="large" onClick={this.removeSmallQuestion}>
              删除子题
            </Button>
          </AddSmallQuestionBox>
        </QuestionWrapper>
      </ComplexWrapper>
    );
  }
}

EnteringComplex.propTypes = {
  dispatch: PropTypes.func.isRequired,
  questionTypeList: PropTypes.instanceOf(immutable.List).isRequired, // 所有题型 -- List
  saveComplexQuestionMsg: PropTypes.func.isRequired, // 保存复合题信息
  saveComplexQuestion: PropTypes.func.isRequired, // 保存复合题
  complexQuestionItemMsg: PropTypes.instanceOf(immutable.Map).isRequired, // 复合题信息
  complexQuestionItem: PropTypes.instanceOf(immutable.List).isRequired, // 复合题信息
  allQuestionTypeList: PropTypes.instanceOf(immutable.List).isRequired, // 所有题型
  currentQuestion: PropTypes.instanceOf(immutable.Map).isRequired,
  editorClick: PropTypes.func.isRequired,
  setQuestionsList: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  questionTypeList: () => fromJS(childTemplateType),
  allQuestionTypeList: makeAllQuestionTypeList(),
  complexQuestionItemMsg: makeComplexQuestionItemMsg(),
  complexQuestionItem: makeComplexQuestionItem(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    saveComplexQuestionMsg: item =>
      dispatch(setComplexQuestionItemMsgAction(item)),
    saveComplexQuestion: item => dispatch(setComplexQuestionItemAction(item)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EnteringComplex);
