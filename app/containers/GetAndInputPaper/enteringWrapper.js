/* eslint-disable no-script-url */
/* eslint-disable complexity */
/* eslint-disable array-callback-return */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import immutable, { fromJS } from 'immutable';
import { handleFormulaCaos } from 'utils/helpfunc';
import {
  FlexRow,
  FlexRowCenter,
  FlexColumn,
  FlexCenter,
} from 'components/FlexBox';
import {
  PlaceHolderBox,
  WidthBox,
  wangStyle,
  questionItemCss,
} from 'components/CommonFn/style';
import {
  toNumber,
  downloadFile,
  toString,
} from 'components/CommonFn';
import { renderToKatex, numberToLetter, compatibleForKatexUpgrade } from 'zm-tk-ace/utils';
import { Select, Input, Button, InputNumber, message, Switch } from 'antd';
import Ueditor from 'components/Ueditor';
import AlwaysFormula from 'components/AlwaysFormula';
import ShowQuestionItem from 'components/ShowQuestionItem';
import { makeBtnCanClick } from 'containers/LeftNavC/selectors';
import { changeBtnCanClickAction } from 'containers/LeftNavC/actions';
import Katex from 'katex';
import {
  changePageStateAction,
  getAllQuestionListAction,
  submitPaperVerify,
  changeQuestionsIndexAction,
  setQuestionsListAction,
  submitCurrentQuestionAction,
  setSubmitAllDone,
  changeTemplateList,
} from './actions';
import {
  makeAllDone,
  makePaperDownloadMsg,
  makeTemplateList,
  makeSlectedTemplate,
  makeErrList,
  makeOthersData,
  makeQuestionsList,
  makeQuestionsIndex,
  makeAllQuestionTypeList,
} from './selectors';

import EnteringComplex from './enteringComplex';
import EnteringWenDa from './enteringWenDa';
import EnteringTianKong from './enteringTianKong';
import EnteringXuanZe from './enteringXuanZe';
import { getTemplatesByTypeId, getDefaultTemplate } from 'utils/templateMapper';
require('katex/dist/katex.min.css');

const Wrapper = styled(FlexColumn)`
  flex: 1;
  background: #fff;
`;

const TopButtonsBox = styled(FlexRowCenter)`
  height: 50px;
  background: #fff;
  padding: 0 10px;
`;
const BodyWrapper = styled(FlexColumn)`
  align-items: stretch;
  flex: 1;
`;
const CapHeader = styled(FlexRowCenter)`
  height: 50px;
  justify-content: center;
`;
const FlexRowCC = styled(FlexRowCenter)`
  height: 50px;
  justify-content: space-around;
  align-items: center;
`;
const Content = styled(FlexRow)`
  height: 100%;
  flex-direction: row;
  align-items: stretch;
  flex: 1;
`;
const View = styled(FlexColumn)`
  flex: 3;
  margin: 10px;
  padding: 10px;
  background: #ddd;
  // border: 1px solid #ddd;
  overflow-y: auto;
`;
const InputContent = styled(questionItemCss)`
  flex: 2;
  padding: 10px;
  margin: 10px;
  border: 1px solid #ccc;
  ${wangStyle}
  zmblank, zmsubline {
    height: 1.5em;
    line-height: 1.5em;
  }
`;
const CommonInput = styled(FlexColumn)`
  padding: 10px 0;
`;
const FormIt = styled(FlexColumn)`
  flex: 1;
  padding: 0 20px;
`;
const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  min-height: 600px;
  background: #fff;
`;
const EditorWrapper = styled.div`
  // position: absolute;
  // top: 0;
  // left: 0;
  margin: 10px 10px 0 0;
  width: 750px;
  height: 500px;
  padding-bottom: 50px;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.4);
  background: #ccc;
  z-index: 10;
  position: relative;
  // cursor: move;
`;
const ButtonWrapper = styled(FlexRowCenter)`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  padding: 0 20px;
  // cursor: move;
`;
const ProptBox = styled(FlexCenter)`
  flex: 9;
  p {
    font-size: 12px !important;
  }
`;
const Pitem = styled.p`
  margin: 0;
`;
const TemplateSelect = styled(FlexRowCenter)`
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
  justify-content: space-around;
`;
const TextValue = styled.p`
  margin: 0;
  font-family: Microsoft YaHei;
`;
const ErrMsgBox = styled(FlexColumn)`
  min-height: 125px;
  // height: 125px;
  max-height: 200px;
  margin-top: 10px;
  padding: 10px 0;
  font-size: 14px;
  border: 1px solid #ddd;
  background: #fff;
`;
const ErrMsg = styled.p`
  margin-top: 10px;
  // flex: 1;
  overflow-y: auto;
`;
const PrevViewWrapper = styled.div`
  flex: 1;
  margin: 10px;
  padding: 20px;
  border: 1px solid #ddd;
  font-size: 12pt;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.05);
  .katex-html {
    background: #9ff;
  }
`;
const FormulaWrapper = styled.div`
  width: 750px;
  // height: 500px;
  min-height: 440px;
  border: 3px solid #ddd;
  margin-top: 20px;
  padding: 0 20px;
  border-radius: 6px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.4);
  background: rgba(233, 233, 233, 0.3);
`;
const FormulaBox = styled.div`
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  background: #fff;
  width: 100%;
  min-height: 200px;
  color: #000;
  font-size: 10.5pt;
  .katex {
    font-size: 1.3em;
  }
`;
const ButtonBox = styled(FlexRowCenter)`
  height: 50px;
`;
const TextArea = Input.TextArea;
const QuestionItemBox = styled(FlexRow)`
  align-items: flex-start;
  min-height: 1em;
  margin: 5px 0;
  border: 1px solid #ddd;
  background: #fff;
`;
const QuestionTitle = styled(QuestionItemBox)``;
const QuestionOptions = styled(QuestionItemBox)``;
const QuestionAnswers = styled(QuestionItemBox)``;
const QuestionAnalysis = styled(QuestionItemBox)``;
const QuestionValue = styled.div`
  min-width: 60px;
  // line-height: 21pt;
`;
const ContentValue = styled.div`
  flex: 1;
  padding: 0 5px;
  width: ${props => (props.seeMobile ? '375px' : 'auto')};
  min-width: 375px;
`;
const ItemValue = styled.div``;
const PreViewBox = styled.div`
  height: 300px;
  padding: 3px;
  border: 1px solid #ddd;
  margin-bottom: 5px;
  background: #fff;
`;
const ChildrenItem = styled.div`
  padding: 0 10px;
`;

const stopEvent = event => {
  event.dataTransfer.dropEffect = 'none';
  event.stopPropagation();
  event.preventDefault();
};

export const validateTemplate = (list, tempId) => {
  console.log(list, tempId);
  if (!tempId) return;
  let hasThisTemp = false;
  list.map(it => {
    if (toNumber(it.id) === toNumber(tempId)) {
      hasThisTemp = true;
    }
  });
  if (!hasThisTemp) {
    message.error('此题题型暂不支持所选模板，请更换题型或者模板。');
  }
};

export class EnteringWrapper extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.chooseTemplate = this.chooseTemplate.bind(this);
    this.changeQuestionIndex = this.changeQuestionIndex.bind(this);
    this.setQuestionsList = this.setQuestionsList.bind(this);
    this.setClickTarget = this.setClickTarget.bind(this);
    this.editorClick = this.editorClick.bind(this);
    this.setEditorPosition = this.setEditorPosition.bind(this);
    this.showEditor = this.showEditor.bind(this);
    this.showFormulaEditor = this.showFormulaEditor.bind(this);
    this.finishFormulaEdit = this.finishFormulaEdit.bind(this);
    this.showChildren = this.showChildren.bind(this);
    this.insertText = this.insertText.bind(this);
    this.setRange = this.setRange.bind(this);
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
        index: -1,
        i: -1,
        type: '',
        property: '',
      },
      memory: '',
      formulaData: '',
      formatFormula: '',
      analyze: false,
      saveEditor: null,
      showFormulaEditor: false,
      seeMobile: false,
      seeFormulaModal: false,
      selection: {
        start: 0,
        end: 0,
      },
      formulaBoxPosition: {
        x: '100px',
        y: '100px',
      },
      momeryPosition: {
        detX: 0,
        detY: 0,
        x: 0,
        y: 0,
      },
    };
  }
  componentDidMount() {
    // this.initEditor();
    // this.setState(Object.assign({}, this.state, { visible: false }));
    // this.setState(Object.assign({}, this.state, { initShow: 'block' }));
    const { dispatch, questionsList, questionsIndex } = this.props;
    dispatch(getAllQuestionListAction());
    // 设置模板
    const question =
      questionsList.getIn([questionsIndex, 'questionOutputDTO']) || fromJS({});
    const temps = getTemplatesByTypeId(question.get('typeId'));
    validateTemplate(temps, question.get('templateType'));
    dispatch(changeTemplateList(fromJS(temps)));

    this.editorWrapper.addEventListener(
      'dragstart',
      this.handleDragStart,
      false,
    );
    this.editorWrapper.addEventListener('dragend', this.handleDrop, false);
  }
  setEditorPosition(obj) {
    const editorPosition = this.state.editorPosition;
    this.setState({ editorPosition: Object.assign({}, editorPosition, obj) });
  }
  setQuestionsList(...argus) {
    const [
      flag,
      index,
      type1,
      value1,
      type2,
      value2,
      type3,
      value3,
      type4,
      value4,
    ] = argus;
    const { errList, questionsIndex, questionsList } = this.props;
    if (errList.count() > 0) {
      if (!errList.includes(questionsIndex + 1)) {
        message.warning('不可以修改未标错的题目。');
        return;
      }
    }
    let newQuestionsList = questionsList;
    if (!type1) return;
    if (flag === 'parent') {
      const questionOutputDTO = questionsList.getIn([
        questionsIndex,
        'questionOutputDTO',
      ]);
      let newQuestionOutputDTO = questionOutputDTO;
      const propertyIndex = this.state.clickTarget.i;
      if (propertyIndex === -1 || index === -1) {
        if (!type2) {
          newQuestionOutputDTO = questionOutputDTO.set(type1, value1);
        } else if (!type3) {
          newQuestionOutputDTO = questionOutputDTO
            .set(type1, value1)
            .set(type2, value2);
        } else if (!type4) {
          newQuestionOutputDTO = questionOutputDTO
            .set(type1, value1)
            .set(type2, value2)
            .set(type3, value3);
        } else {
          newQuestionOutputDTO = questionOutputDTO
            .set(type1, value1)
            .set(type2, value2)
            .set(type3, value3)
            .set(type4, value4);
        }
      } else if (propertyIndex > -1) {
        if (!type2) {
          newQuestionOutputDTO = questionOutputDTO.setIn(
            [type1, propertyIndex],
            value1,
          );
        } else if (!type3) {
          newQuestionOutputDTO = questionOutputDTO
            .setIn([type1, propertyIndex], value1)
            .setIn([type2, propertyIndex], value2);
        } else {
          newQuestionOutputDTO = questionOutputDTO
            .setIn([type1, propertyIndex], value1)
            .setIn([type2, propertyIndex], value2)
            .setIn([type3, propertyIndex], value3);
        }
      }
      newQuestionsList = questionsList.setIn(
        [questionsIndex, 'questionOutputDTO'],
        newQuestionOutputDTO,
      );
    } else if (flag === 'children') {
      const childrenItem = questionsList.getIn([
        questionsIndex,
        'questionOutputDTO',
        'children',
        index,
      ]);
      let newChildrenItem = childrenItem;
      const childrenIndex = this.state.clickTarget.i;
      if (childrenIndex === -1) {
        if (!type2) {
          newChildrenItem = childrenItem.set(type1, value1);
        } else if (!type3) {
          newChildrenItem = childrenItem.set(type1, value1).set(type2, value2);
        } else {
          newChildrenItem = childrenItem
            .set(type1, value1)
            .set(type2, value2)
            .set(type3, value3);
        }
      } else if (childrenIndex > -1) {
        if (!type2) {
          newChildrenItem = childrenItem.setIn([type1, childrenIndex], value1);
        } else if (!type3) {
          newChildrenItem = childrenItem
            .setIn([type1, childrenIndex], value1)
            .setIn([type2, childrenIndex], value2);
        } else {
          newChildrenItem = childrenItem
            .setIn([type1, childrenIndex], value1)
            .setIn([type2, childrenIndex], value2)
            .setIn([type3, childrenIndex], value3);
        }
      }
      newQuestionsList = questionsList.setIn(
        [questionsIndex, 'questionOutputDTO', 'children', index],
        newChildrenItem,
      );
    } else if (flag === 'childrenType') {
      const childrenItem = questionsList.getIn([
        questionsIndex,
        'questionOutputDTO',
        'children',
        index,
      ]);
      let newChildrenItem = childrenItem;
      if (!type2) {
        newChildrenItem = childrenItem.set(type1, value1);
      } else if (!type3) {
        newChildrenItem = childrenItem.set(type1, value1).set(type2, value2);
      } else {
        newChildrenItem = childrenItem
          .set(type1, value1)
          .set(type2, value2)
          .set(type3, value3);
      }
      newQuestionsList = questionsList.setIn(
        [questionsIndex, 'questionOutputDTO', 'children', index],
        newChildrenItem,
      );
    }
    this.props.dispatch(setQuestionsListAction(newQuestionsList));
  }
  setClickTarget(obj) {
    this.setState({ clickTarget: obj });
  }
  editorClick(e, index, questionItem, i, property, type) {
    this.setClickTarget({ index, questionItem, i, property, type });
    const questionsList = this.props.questionsList;
    const questionsIndex = this.props.questionsIndex;
    let html = '';
    if (type === 'questionMsg') {
      if (i === -1) {
        html = questionsList.getIn([
          questionsIndex,
          'questionOutputDTO',
          property,
        ]);
      } else {
        html = questionsList.getIn([
          questionsIndex,
          'questionOutputDTO',
          property,
          i,
        ]);
      }
    } else if (i === -1) {
      html = questionsList.getIn([
        questionsIndex,
        'questionOutputDTO',
        'children',
        index,
        property,
      ]);
    } else {
      html = questionsList.getIn([
        questionsIndex,
        'questionOutputDTO',
        'children',
        index,
        property,
        i,
      ]);
    }
    const UE = window.UE;
    const content = UE.getEditor('content');
    content.setContent(html);
    this.setState({ memory: html });
    this.showEditor(true);
  }
  showEditor(flag) {
    this.setEditorPosition({ show: flag });
    if (!flag) {
      this.setClickTarget({}, this.state.clickTarget, { index: -1, i: -1 });
    }
  }
  // 改变模板
  changeTemplate(e) {
    const templateTypeId = toNumber(e.key);
    if (templateTypeId === 1) {
      this.setQuestionsList(
        'parent',
        -1,
        'children',
        fromJS([
          {
            score: 3,
            title: '',
            optionList: ['', '', '', ''],
            answerList: [],
            analysis: '',
            typeId: -1,
          },
        ]),
        'score',
        3,
        'templateType',
        templateTypeId,
        'answerList',
        fromJS([]),
      );
    } else if (templateTypeId === 2) {
      this.setQuestionsList(
        'parent',
        -1,
        'children',
        null,
        'templateType',
        templateTypeId,
        'answerList',
        fromJS([]),
      );
    } else {
      this.setQuestionsList(
        'parent',
        -1,
        'children',
        null,
        'templateType',
        templateTypeId,
        'answerList',
        fromJS(['']),
      );
    }
  }
  // 改变题型要做的事
  changeType(value) {
    const { dispatch } = this.props;
    // 根据value获取可以选择的模板 重置模板list
    const temps = getTemplatesByTypeId(value);
    dispatch(changeTemplateList(fromJS(temps)));
    // 根据value设置默认模板id
    this.changeTemplate({
      key: getDefaultTemplate(value),
    });
    // 改编question里的typeId
    setTimeout(() => {
      this.setQuestionsList('parent', -1, 'typeId', value);
    }, 200);
  }
  chooseTemplate(type, curItem) {
    const templateType = type;
    const currentQuestion = curItem;
    let res = '';
    let currentTemplate = this.props.templateList
      .filter(item => item.get('id') === templateType)
      .get(0);
    if (!currentTemplate) {
      currentTemplate = fromJS({
        key: templateType,
        name: '',
      });
    }
    const chooseBox = (
      <TemplateSelect>
        <FlexRowCenter style={{ alignItems: 'center' }}>
          <span>选择题型：</span>
          <Select
            value={String(
              currentQuestion.getIn(['questionOutputDTO', 'typeId']),
            )}
            style={{ width: 120 }}
            onChange={this.changeType.bind(this)}
          >
            {this.props.questionTypeList.map((it, i) => {
              return (
                <Select.Option key={i} value={toString(it.get('id'))}>
                  {it.get('name')}
                </Select.Option>
              );
            })}
          </Select>
        </FlexRowCenter>
        <FlexRowCenter style={{ alignItems: 'center' }}>
          <span>选择模板：</span>
          <Select
            labelInValue
            value={{
              key: toString(currentTemplate.get('id')),
              label: currentTemplate.get('name'),
            }}
            style={{ width: 120 }}
            onChange={this.changeTemplate.bind(this)}
          >
            {this.props.templateList.map((it, i) => {
              return (
                <Select.Option key={i} value={toString(it.get('id'))}>
                  {it.get('name')}
                </Select.Option>
              );
            })}
          </Select>
        </FlexRowCenter>
      </TemplateSelect>
    );
    const questionMsgTitle =
      [2, 3, 4].indexOf(templateType) > -1 ? (
        <CommonInput>
          <FlexRowCC>
            <FormIt>
              <label htmlFor>大题编号：</label>
              <Input
                placeholder="大题编号"
                disabled
                value={currentQuestion.get('bigNum') || 1}
              />
            </FormIt>
            <FormIt>
              <label htmlFor>大题名称：</label>
              <Input
                placeholder="大题名称"
                disabled
                value={currentQuestion.get('bigName') || '— —'}
              />
            </FormIt>
          </FlexRowCC>
          <FlexRowCC>
            <FormIt>
              <label htmlFor>题号：</label>
              <Input
                placeholder="题号"
                disabled
                value={currentQuestion.get('serialNumber') || 1}
              />
            </FormIt>
            <FormIt>
              <label htmlFor>分值：</label>
              <InputNumber
                style={{ width: '100%' }}
                min={0.5}
                max={99}
                step={0.5}
                value={currentQuestion.getIn(['questionOutputDTO', 'score'])}
                placeholder="请输入分值"
                onChange={value => {
                  this.setQuestionsList('parent', -1, 'score', value);
                }}
              />
            </FormIt>
          </FlexRowCC>
        </CommonInput>
      ) : (
        ''
      );
    switch (templateType) {
      case 1:
        res = (
          <EnteringComplex
            currentQuestion={currentQuestion}
            editorClick={this.editorClick}
            setQuestionsList={this.setQuestionsList}
          />
        );
        break;
      case 2:
        res = (
          <EnteringXuanZe
            data={currentQuestion}
            editorClick={this.editorClick}
            setQuestionsList={this.setQuestionsList}
          />
        );
        break;
      case 3:
        res = (
          <EnteringTianKong
            data={currentQuestion}
            editorClick={this.editorClick}
            setQuestionsList={this.setQuestionsList}
          />
        );
        break;
      case 4:
        res = (
          <EnteringWenDa
            data={currentQuestion}
            editorClick={this.editorClick}
            setQuestionsList={this.setQuestionsList}
          />
        );
        break;
      default:
        res = '';
        break;
    }
    return (
      <div style={{ height: '100%', overflow: 'auto', padding: 5 }}>
        {chooseBox}
        {questionMsgTitle}
        {res}
      </div>
    );
  }
  changeQuestionIndex(type) {
    const {
      dispatch,
      questionsIndex,
      othersData,
      questionsList,
      errList,
    } = this.props;
    // const questionsIndex = this.props.questionsIndex;
    const realQuestionCount =
      othersData.get('realQuestionCount') || questionsList.count();
    switch (type) {
      case 'prev':
        if (questionsIndex > 0) {
          dispatch(changeQuestionsIndexAction(questionsIndex - 1));
        } else {
          message.warn('这已经是第一题了，没有上一题了哦。');
        }
        // }
        break;
      case 'next':
        if (errList.count() > 0) {
          if (errList.includes(questionsIndex + 1)) {
            dispatch(submitCurrentQuestionAction());
          } else if (questionsIndex < realQuestionCount - 1) {
            dispatch(changeQuestionsIndexAction(questionsIndex + 1));
          } else {
            message.warn('已经是最后一道错题了，没有更多错题了哦。');
            dispatch(setSubmitAllDone(true));
          }
        } else {
          if (questionsIndex <= realQuestionCount - 1) {
            // submit this question
            dispatch(submitCurrentQuestionAction());
          } else {
            message.warn('已经是最后一题了，没有下一题了哦。');
          }
        }
        break;
      default:
        break;
    }
  }
  showFormulaEditor() {
    this.setState({ showFormulaEditor: true });
    // console.log('弹出公式输入');
  }
  finishFormulaEdit(editor) {
    if ((this.state.formulaData || '').replace(/\s/g, '').length > 0) {
      editor.execCommand(
        'insertHtml',
        ` <zmlatex contenteditable="false"> ${
          this.state.formulaData
            .replace(/\\text{([^}]+)}/g, '$1')
            .replace(/\s?([^\x00-\xff]+)/g, (e, $1) => {
              return ` \\text{${$1}}`;
            })
        } </zmlatex> `,
      );
      handleFormulaCaos(editor);
    } else {
      console.log('未输入内容');
    }
  }
  showChildren(children, seeMobile) {
    return children.map((item, index) => {
      const type = item.get('typeId');
      return (
        <ChildrenItem key={index}>
          <h3>子题 {index + 1}</h3>
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
              <ContentValue seeMobile={seeMobile}>
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
              <ContentValue seeMobile={seeMobile}>
                {(item.get('answerList') || fromJS([])).join('、')}
              </ContentValue>
            </QuestionAnswers>
          ) : (
            ''
          )}
          {type === 3 ? (
            <QuestionAnswers>
              <QuestionValue>答案：</QuestionValue>
              <ContentValue seeMobile={seeMobile}>
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
                seeMobile={seeMobile}
                dangerouslySetInnerHTML={{
                  __html: (item.get('answerList') || fromJS([''])).get(0),
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
        </ChildrenItem>
      );
    });
  }
  insertText(txt) {
    const selection = this.state.selection;
    console.log(txt, selection, '+++++');
    const value =
      (selection.value || '').slice(0, selection.start) +
      txt +
      (selection.value || '').slice(selection.end);
    let formatFormula = '';
    const newSelection = {
      start: selection.start + txt.length,
      end: selection.end + txt.length,
      value,
    };
    try {
      formatFormula = Katex.renderToString(compatibleForKatexUpgrade(value));
      this.setState({
        formulaData: value,
        formatFormula,
        selection: newSelection,
      });
    } catch (err) {
      this.setState({ formulaData: value, selection: newSelection });
    }
  }
  setRange() {
    setTimeout(() => {
      let oTxt1 = document.getElementById('textArea');
      if (
        typeof oTxt1.selectionStart === 'number' &&
        oTxt1.selectionStart >= 0
      ) {
        let selection = { start: 0, end: 0, value: '' };
        if (this.state.formulaData.replace(/\s/g, '').length > 0) {
          selection = {
            start: oTxt1.selectionStart,
            end: oTxt1.selectionEnd,
            value: oTxt1.value || '',
          };
        }
        this.setState({ selection });
        oTxt1 = null;
      }
    }, 20);
  }
  render() {
    const UE = window.UE;
    const {
      dispatch,
      errList,
      questionsList,
      questionsIndex,
      othersData,
    } = this.props;
    const currentQuestion = questionsList.get(questionsIndex) || fromJS({});
    const questionOutputDTO =
      currentQuestion.get('questionOutputDTO') || fromJS({});
    const errReason = questionOutputDTO.get('errReason') || '';
    const templateType = questionOutputDTO.get('templateType') || 1;
    const seeMobile = this.state.seeMobile;
    return (
      <Wrapper subjectId={othersData.get('subjectId')}>
        <TopButtonsBox>
          <Button onClick={() => dispatch(changePageStateAction(0))}>
            {'<'} 返回
          </Button>
          <PlaceHolderBox />
          <h3>第{questionsIndex + 1 || '*'}题</h3>
          <PlaceHolderBox />
          <Button
            onClick={() => {
              downloadFile(
                {
                  fileUrl: this.props.paperDownloadMsg.get('fileUrl'),
                  fileName: this.props.paperDownloadMsg.get('fileName'),
                },
                dispatch,
              );
            }}
          >
            下载本试卷
          </Button>
          <WidthBox />
          {this.props.allDone && this.props.btnCanClick ? (
            <Button
              type="danger"
              onClick={() => {
                dispatch(submitPaperVerify());
                dispatch(changeBtnCanClickAction(false));
              }}
            >
              提交审核
            </Button>
          ) : (
            <Button disabled>提交审核</Button>
          )}
        </TopButtonsBox>
        <BodyWrapper style={{ alignItems: 'stretch' }}>
          <Content className="content">
            <View>
              <div style={{ flex: 1, overflow: 'auto', textAlign: 'center' }}>
                <img
                  role="presentation"
                  style={{ width: '100%', maxWidth: '100%' }}
                  src={currentQuestion.get('questionOutputDTO').get('picUrl')}
                />
              </div>
              {errList.count() > 0 ? (
                <ErrMsgBox>
                  <TextValue
                    style={{
                      marginBottom: 10,
                      marginLeft: 20,
                      flex: 1,
                      minHeight: 50,
                      maxHeight: 100,
                      overflowY: 'auto',
                    }}
                  >
                    该试卷共录入错误&nbsp;
                    <span style={{ fontWeight: 600 }}>{errList.count()}</span>
                    &nbsp;道题，题号为：{errList.toJS().join('、')}
                  </TextValue>
                  <div style={{ borderBottom: '1px solid #ddd' }} />
                  {errReason ? (
                    <ErrMsg
                      style={{ marginLeft: 20, minHeight: 50, maxHeight: 150 }}
                    >
                      <span style={{ color: 'red' }}>错误信息：</span>
                      <span style={{ borderBottom: '1px solid red' }}>
                        {errReason}
                      </span>
                    </ErrMsg>
                  ) : (
                    <ErrMsg
                      style={{
                        height: 50,
                        color: 'yellowgreen',
                        marginLeft: 20,
                      }}
                    >
                      本题录入正确，无需更改
                    </ErrMsg>
                  )}
                </ErrMsgBox>
              ) : (
                ''
              )}
            </View>
            <InputContent>
              {this.chooseTemplate(templateType, currentQuestion)}
            </InputContent>
          </Content>
        </BodyWrapper>
        <CapHeader>
          <Button
            type="primary"
            onClick={() => this.changeQuestionIndex('prev')}
          >
            上一题
          </Button>
          {this.props.btnCanClick ? (
            <Button
              type="primary"
              style={{ margin: 10 }}
              onClick={() => {
                this.changeQuestionIndex('next');
              }}
            >
              下一题
            </Button>
          ) : (
            <Button style={{ margin: 10 }} disabled>
              下一题
            </Button>
          )}
        </CapHeader>
        <ModalWrapper
          innerRef={x => {
            this.modalWrapper = x;
          }}
          style={{ display: this.state.editorPosition.show ? 'block' : 'none' }}
        >
          <FlexRow style={{ height: '100%' }}>
            <PrevViewWrapper>
              <PreViewBox style={{ minWidth: 455 }}>
                <div
                  style={{
                    height: '100%',
                    width: '100%',
                    overflow: 'auto',
                    textAlign: 'center',
                  }}
                >
                  <img
                    role="presentation"
                    style={{ width: '100%', maxWidth: '100%' }}
                    src={currentQuestion.get('questionOutputDTO').get('picUrl')}
                  />
                </div>
              </PreViewBox>
              <FlexRowCenter>
                <PlaceHolderBox />
                <Switch
                  onChange={ckicked => this.setState({ seeMobile: ckicked })}
                  checked={seeMobile}
                  checkedChildren="移动端预览"
                  unCheckedChildren="PC预览"
                />
              </FlexRowCenter>
              <ShowQuestionItem
                subjectId={this.props.othersData.get('subjectId')}
                style={{ overflowY: 'auto' }}
                questionOutputDTO={questionOutputDTO}
                seeMobile={seeMobile}
              />
            </PrevViewWrapper>
            <div style={{ overflowY: 'auto' }}>
              <EditorWrapper
                innerRef={x => {
                  this.editorWrapper = x;
                }}
              >
                <Ueditor
                  draggable="false"
                  onDrop={stopEvent}
                  onDragstart={stopEvent}
                  onDragover={stopEvent}
                  onDragenter={stopEvent}
                  id="content"
                  showFormulaEditor={this.showFormulaEditor}
                  saveEditorData={newHtml => {
                    const clickTarget = this.state.clickTarget;
                    if (
                      clickTarget.type &&
                      clickTarget.type === 'questionMsg'
                    ) {
                      this.setQuestionsList(
                        'parent',
                        this.props.questionsIndex,
                        clickTarget.property,
                        newHtml,
                      );
                    } else {
                      this.setQuestionsList(
                        'children',
                        this.state.clickTarget.index,
                        clickTarget.property,
                        newHtml,
                      );
                    }
                  }}
                />
                <ButtonWrapper>
                  <Button
                    type="primary"
                    ghost
                    onClick={() => {
                      // 取消
                      const clickTarget = this.state.clickTarget;
                      if (clickTarget.type === 'questionMsg') {
                        this.setQuestionsList(
                          'parent',
                          questionsIndex,
                          clickTarget.property,
                          this.state.memory,
                        );
                      } else if (clickTarget.i === -1) {
                        this.setQuestionsList(
                          'children',
                          clickTarget.index,
                          clickTarget.property,
                          this.state.memory,
                        );
                      } else {
                        this.setQuestionsList(
                          'children',
                          clickTarget.index,
                          clickTarget.property,
                          this.state.memory,
                        );
                      }
                      this.showEditor(false);
                      this.setState({ showFormulaEditor: false });
                    }}
                  >
                    取消编辑
                  </Button>
                  <ProptBox>
                    <Pitem
                      style={{ textAlign: 'left' }}
                      onClick={() =>
                        window.open(
                          'https://khan.github.io/KaTeX/function-support.html',
                          '_blank',
                          'toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=800, height=600',
                          false,
                        )
                      }
                    >
                      <a href="javascript:void(0)">&gt;&gt;语法参考&lt;&lt;</a>
                    </Pitem>
                  </ProptBox>
                  <Button
                    type="primary"
                    onClick={() => {
                      const editor = UE.getEditor('content');
                      const content = editor.getContent();
                      const clickTarget = this.state.clickTarget;
                      if (
                        clickTarget.type &&
                        clickTarget.type === 'questionMsg'
                      ) {
                        this.setQuestionsList(
                          'parent',
                          this.props.questionsIndex,
                          clickTarget.property,
                          content,
                        );
                      } else {
                        this.setQuestionsList(
                          'children',
                          this.state.clickTarget.index,
                          clickTarget.property,
                          content,
                        );
                      }
                      this.showEditor(false);
                      this.setState({ showFormulaEditor: false });
                    }}
                  >
                    确认编辑
                  </Button>
                </ButtonWrapper>
              </EditorWrapper>
              <FormulaWrapper>
                <ButtonBox>
                  <FlexRowCenter
                    style={{ fontSize: 16, color: 'black', padding: '0 5px' }}
                  >
                    公式编辑处：
                  </FlexRowCenter>
                  <PlaceHolderBox />
                  <Button
                    type="primary"
                    style={{ marginRight: 5 }}
                    onClick={() => this.setState({ seeFormulaModal: true })}
                  >
                    常用公式
                  </Button>
                  <Button
                    onClick={() => {
                      const editor = UE.getEditor('content');
                      if (
                        this.state.analyze ||
                        this.state.formatFormula !== '解析失败'
                      ) {
                        this.finishFormulaEdit(editor);
                        return;
                      }
                      message.warn('请确保公式输入正确');
                    }}
                  >
                    插入公式
                  </Button>
                </ButtonBox>
                <TextArea
                  id="textArea"
                  onClick={this.setRange}
                  onKeyDown={e => {
                    if ([8, 13, 32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                      this.setRange();
                    }
                  }}
                  style={{
                    width: 705,
                    height: 120,
                    borderRadius: 0,
                    resize: 'none',
                  }}
                  value={this.state.formulaData}
                  onChange={e => {
                    let formatFormula = '';
                    const value = e.target.value || '';
                    try {
                      formatFormula = Katex.renderToString(compatibleForKatexUpgrade(value));
                      this.setState({
                        formulaData: value,
                        formatFormula,
                        analyze: true,
                      });
                    } catch (err) {
                      this.setState({
                        formulaData: value,
                        formatFormula: '解析失败',
                        analyze: false,
                      });
                    }
                    this.setRange();
                  }}
                />
                <FlexRowCenter
                  style={{ fontSize: 16, color: 'black', padding: '5px' }}
                >
                  公式预览：
                </FlexRowCenter>
                <FormulaBox
                  dangerouslySetInnerHTML={{ __html: this.state.formatFormula }}
                />
              </FormulaWrapper>
            </div>
          </FlexRow>
          {this.state.seeFormulaModal ? (
            <AlwaysFormula
              subjectId={questionOutputDTO.get('subjectId')}
              gradeId={questionOutputDTO.get('gradeId')}
              insertText={this.insertText}
              formulaBoxPosition={this.state.formulaBoxPosition}
              changeFormulaBoxPosition={obj =>
                this.setState({ formulaBoxPosition: obj })
              }
              momeryPosition={this.state.momeryPosition}
              changeMomeryPosition={obj =>
                this.setState({ momeryPosition: obj })
              }
              closeFormulaBox={bol => this.setState({ seeFormulaModal: bol })}
            />
          ) : (
            ''
          )}
        </ModalWrapper>
      </Wrapper>
    );
  }
}
EnteringWrapper.propTypes = {
  dispatch: PropTypes.func.isRequired,
  paperDownloadMsg: PropTypes.instanceOf(immutable.Map).isRequired, // 下载所需数据
  templateList: PropTypes.instanceOf(immutable.List).isRequired,
  errList: PropTypes.instanceOf(immutable.List).isRequired,
  btnCanClick: PropTypes.bool.isRequired,
  othersData: PropTypes.instanceOf(immutable.Map).isRequired,
  questionsList: PropTypes.instanceOf(immutable.List).isRequired,
  questionsIndex: PropTypes.number.isRequired,
  allDone: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  allDone: makeAllDone(),
  paperDownloadMsg: makePaperDownloadMsg(),
  templateList: makeTemplateList(),
  slectedTemplate: makeSlectedTemplate(),
  errList: makeErrList(),
  btnCanClick: makeBtnCanClick(),
  othersData: makeOthersData(),
  questionsList: makeQuestionsList(),
  questionsIndex: makeQuestionsIndex(),
  questionTypeList: makeAllQuestionTypeList(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EnteringWrapper);
