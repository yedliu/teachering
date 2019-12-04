/* eslint-disable complexity */
/**
* isJiucuo 纠错特殊处理（单选多选都是复选组件）
* soucre 一般情况是questionPicker finalVerify表示终审 有一些特殊处理
* source2 判断是否有预览功能
*/

import React, { PropTypes } from 'react';
import { fromJS } from 'immutable';
// import styled from 'styled-components';

import {
  Select, Radio,
  message, Checkbox,
  Modal as AntModel, Tooltip,
} from 'antd';
import { FlexRow, FlexRowCenter, FlexCenter } from 'components/FlexBox';
import PreviewSlide from 'containers/H5Share/previewSlide';
import {
  toString, toNumber, ifLessThan, letterOptions,
  ZmToHtml,
} from 'components/CommonFn';
import { renderToKatex as RenderKatex, numberToChinese, numberToLetter, backfromZmStand } from 'zm-tk-ace/utils';
import { handleFormulaCaos } from 'utils/helpfunc';
import { PlaceHolderBox } from 'components/CommonFn/style';
import { backChooseItem } from 'containers/TagsVerify/verifyChildren';
import AlwaysFormula from 'components/AlwaysFormula';
import { tagsName } from 'containers/TagsVerify/tags';
import Ueditor from 'components/Ueditor';
import ToAudio from 'components/ToAudio';
import Modal from 'react-modal';
import Tree from '../Tree';
import QuestionLayoutChoice from './questionLayout';
import {
  HeaderBox, TagsItemWrapper, TagsItemBox,
  ValueRight, ValueLeft, customStyles, CloseBox,
  MainQuestionTextArea, QuestionItemWrapper,
  ContentWrapper, DivBox, ListItem, AnswerListBox, OptionBox,
  DeleteItem
} from 'containers/PaperFinalVerify/paperStyle';
import { configOption } from 'containers/PaperFinalVerify/ueditorConfig';
import ClassifyBox from 'components/ClassifyBox';
import { getTemplatesByTypeId, templateTypes, getDefaultTemplate } from 'utils/templateMapper';
import { updateQuestionByTemplate } from './common';
import queryNode from 'api/qb-cloud/sys-dict-end-point';
import util from 'api/util';
import InputNumber from '../InputNumber';
import Listen from './child/listen';
import ViceTitle from 'components/vice-title';
import Judge from './child/judge';
import OptionTab from './child/optionTab';
import ChildSortQuestion from './questions/ChildSortQuestion';
import { contentTypeMap } from '../../utils/immutableEnum';
import { filterCartoonForGroupPaper } from '../../utils/templateMapper';
import {
  defaultNewQuestion,
  initState
} from './initData';
import {
  AddPoint,
  Button,
  CheckGroup,
  NewQuestionWrapper,
  AddBox,
  BoxWrapper,
  QuestionMsgContainer,
  Wrapper,
} from './style';
import Tags from './tags';
import PreviewChildQuestion from './PreviewChildQuestion';
import { audioPathEnum } from './childBU-quesTypes';
// import { toAudioSubject } from './dataOperate';

const Option = Select.Option;
const renderToKatex = (str) => {
  return RenderKatex(backfromZmStand(str || ''));
};

const listBoxStyle = {
  minHeight: '30px',
  width: '100%',
  border: '1px solid #ddd',
  padding: '5px',
};
const matchType = ['文字配对', '图文配对', '图图配对'];
class EditItemQuestion extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.getUeditor = this.getUeditor.bind(this);
    this.setNewQuestionMsg = this.setNewQuestionMsg.bind(this);
    this.clickEditItem = this.clickEditItem.bind(this);
    this.setNewQuestionTags = this.setNewQuestionTags.bind(this);
    this.makeSelectTree = this.makeSelectTree.bind(this);
    this.closeEditOrAddQuestion = this.closeEditOrAddQuestion.bind(this);
    this.insertFormula = this.insertFormula.bind(this);
    this.setTemplateType = this.setTemplateType.bind(this);
    this.setTemplateAndType = this.setTemplateAndType.bind(this);
    this.addChildQuestion = this.addChildQuestion.bind(this);
    this.remvoeChildQuestion = this.remvoeChildQuestion.bind(this);
    this.closeBox = this.closeBox.bind(this);
    this.setClassify = this.setClassify.bind(this);
    this.transformQ = this.transformQ.bind(this);
    this.finishStep = this.finishStep.bind(this);
    // 新题模板
    this.defaultNewQuestion = defaultNewQuestion;
    // 获取选项的 contentType
    const optionElementType = props.newQuestion.get('optionElementType');
    const stemElementType = props.newQuestion.get('stemElementType');
    const isJudge = ['52'].includes(String(props.newQuestion.get('typeId')));
    const typeList = isJudge ? stemElementType : optionElementType;
    const children = props.newQuestion.get('children');
    // console.log('typeList', typeList.toJS());
    const genContentType = (typeList) => {
      if (!typeList) {
        // console.error('后端接口未返回 optionElementType');
        return;
      }
      const nTypeList = typeList.toJS();
      // console.log('contentTypeMap', nTypeList,
      // nTypeList[0], contentTypeMap.get(String(typeList.get(0))));
      if (!children) {
        const _ = contentTypeMap.get(String(nTypeList[0]));

        // console.log('---------------------------------');
        // console.log('contentType', _, String(nTypeList[0]));
        return { '-1': _ || 'text' };
      }
      let contentType = {};
      // console.log('---------------------------------');
      nTypeList.forEach((value, i) => {
        // console.log(value, i, contentTypeMap.get(String(value)));
        contentType = {
          ...contentType,
          [i]: contentTypeMap.get(String(value))
        };
      });
      // console.log('contentType', contentType);
      return contentType;
    };
    const contentType = genContentType(typeList) || {};
    this.state = {
      ...initState,
      questionTypeList: this.props.questionTypeList || fromJS([]),
      contentType,
      showPreviewChild: false,
      showImgModal: false,
      currentFormula: ''
    };
  }
  componentDidMount() {
    // console.log(this.props, 'componentDidMount - EditItemQuestion', /\/iframe\/question-picker/.test(location.pathname));
    const { newQuestion, isEditChildBUQuestion } = this.props;
    const { questionTypeList } = this.state;
    // 获取题型
    if (questionTypeList.count() === 0) {
      const typeFetch = {
        fetch: isEditChildBUQuestion ? queryNode.queryChildQuestionType : queryNode.queryAllQuestionType,  // 少儿的需要区别一下
        cb: (data) => {
          const questionTypeList = /\/iframe\/question-picker/.test(location.pathname) ? fromJS(filterCartoonForGroupPaper(data)) : fromJS(data);
          this.setState({ questionTypeList });
        },
        name: '题型',
      };
      util.fetchData(typeFetch);
    }
    // 设置选择题模板 4是改编题目 这个时候不用重置题目
    let type = newQuestion.get('typeId');
    const validateTemplate = (list, tempId) => {
      if (!tempId) return;
      let hasThisTemp = false;
      list.map(it => { // eslint-disable-line
        if (Number(it.id) === Number(tempId)) {
          hasThisTemp = true;
        }
      });
      if (!hasThisTemp) {
        message.error('此题题型暂不支持所选模板，系统已调整到对应模板');
        this.setState({
          curTypeId: newQuestion.get('typeId')
        }, () => {
          this.setTemplateAndType(getDefaultTemplate(newQuestion.get('typeId')));
        });
      }
    };
    // 新增题目时初始化 newQuestion 数据
    if (this.props.soucre === 'questionPicker'
      && !newQuestion.get('id')
      && Number(newQuestion.get('sourceId')) !== 4) {
      type = 2; // 默认选择题
      const defalutQ = updateQuestionByTemplate(newQuestion, String(type));
      this.props.setNewQuestionData(defalutQ.set('typeId', type).set('templateType', type));
    }
    const list = getTemplatesByTypeId(type);
    validateTemplate(list, newQuestion.get('templateType'));
    this.setState({
      choosableTmplates: list
    });
    // 选词填空设置一下每道题分数
    if (newQuestion.get('templateType') === 7) {
      this.props.setNewQuestionData(newQuestion.set('itemScore', newQuestion.get('score') / newQuestion.get('answerList').count()));
    }

  }
  saveEditorData = (value, clickTarget) => {
    const { newQuestion } = this.props;
    if (newQuestion.get('templateType') === 7 && (value || '').length > 100) {
      message.info('标题内容最多只能为100字');
    }
    // console.log('saveEditorData: ', clickTarget);
    this.setNewQuestionMsg(clickTarget.degree, clickTarget.i, clickTarget.property, value);

  }
  getUeditor(target) {
    const clickTarget = this.state.clickTarget;
    const { soucre } = this.props;

    return this.props.clickTarget === target ? <div style={{ position: 'relative' }}>
      <Ueditor
        innerRef={x => { this.ueditorbox = x }}
        soucre={soucre}
        height={120} editorheight="auto" editorWidth="100%" editorMargin="0" id="editor1" option={configOption}
        saveEditorData={(value) => this.saveEditorData(value, clickTarget)}
        showformulaWrapper={() => {
          const nowSeeFormulaModal = this.state.seeFormulaModal;
          this.setState({ seeFormulaModal: !nowSeeFormulaModal });
        }}
        initOver={() => {
          this.contentwrapper.scrollTop = clickTarget.scrollTop;
          const newQuestion = this.props.newQuestion;
          let html = '';
          // console.log('target', clickTarget, target);
          if (clickTarget.degree === 'parent') {
            if (clickTarget.i === -1) {
              html = newQuestion.get(clickTarget.property) || '';
            } else {
              html = newQuestion.getIn([clickTarget.property, clickTarget.i]) || '';
            }
          } else if (clickTarget.degree === 'children') {
            if (clickTarget.i === -1) {
              html = newQuestion.getIn([clickTarget.degree, clickTarget.index, clickTarget.property]) || '';
            } else {
              html = newQuestion.getIn([clickTarget.degree, clickTarget.index, clickTarget.property, clickTarget.i]) || '';
            }
          }
          const content = window.UE.getEditor('editor1');
          html = html.replace(/<br>|(&#8203;)/, '');
          content.setContent(ZmToHtml(html));
          this.setState({ memory: ZmToHtml(html) });
        }}
      ></Ueditor>
    </div> : '';
  }
  setNewQuestionMsg(flag, index, type1, value1, type2, value2, type3, value3, type4, value4) { // eslint-disable-line
    // console.log('setNewQuestionMsg : ', flag, index, type1, value1, type2, value2, type3, value3, type4, value4);
    const { setNewQuestionData, newQuestion } = this.props;
    let newQuestionData = newQuestion;
    // debugger;
    if (!type1) return;
    if (flag === 'parent') {
      if (index === -1) {
        if (!type2) {
          newQuestionData = newQuestion.set(type1, value1);
        } else if (!type3) {
          newQuestionData = newQuestion.set(type1, value1).set(type2, value2);
        } else if (!type4) {
          newQuestionData = newQuestion.set(type1, value1).set(type2, value2).set(type3, value3);
        } else if (type4) {
          newQuestionData = newQuestion.set(type1, value1).set(type2, value2).set(type3, value3).set(type4, value4);
        }
      } else if (index > -1) {
        if (!type2) {
          newQuestionData = newQuestion.setIn([type1, index], value1);
        } else if (!type3) {
          newQuestionData = newQuestion.setIn([type1, index], value1).setIn([type2, index], value2);
        } else {
          newQuestionData = newQuestion.setIn([type1, index], value1).setIn([type2, index], value2).setIn([type3, index], value3);
        }
      }
      const isChildPaper = /childBU\/child-paper/.test(window.location.pathname);
      // console.log('setNewQuestionMsg - isChildPaper', isChildPaper);
      const questionContent = newQuestionData.get('questionContent');
      if (isChildPaper || questionContent) {
        if (type1 === 'title') {
          newQuestionData = newQuestionData.mergeDeep(fromJS({
            titleAudioPath: questionContent.get('questionTitleUploadAudioPath') ? questionContent.get('questionTitleUploadAudioPath') : void 0,
            questionContent: {
              questionTitleAudioFlag: questionContent.get('questionTitleUploadAudioPath') ? 2 : 3,
              questionTitleAudioPath: void 0,
            }
          }));
        } else if (type1 === 'optionList') {
          const questionOptionList = newQuestionData.get('questionOptionList') || fromJS([]);
          const questionOptionItem = questionOptionList.get(index) || fromJS({});
          newQuestionData = newQuestionData.set('questionOptionList', questionOptionList.set(index, questionOptionItem.merge(fromJS({
            audioFlag: questionOptionItem.get('uploadAudioPath') ? 2 : 3,
            audioPath: void 0,
            questionOption: value1,
          }))));
        }
      }
    } else if (flag === 'children') {
      const childrenItem = newQuestion.getIn(['children', this.state.clickTarget.index]);
      let newChildrenItem = childrenItem;
      if (index === -1) {
        if (!type2) {
          newChildrenItem = childrenItem.set(type1, value1);
        } else if (!type3) {
          newChildrenItem = childrenItem.set(type1, value1).set(type2, value2);
        } else if (!type4) {
          newChildrenItem = childrenItem.set(type1, value1).set(type2, value2).set(type3, value3);
        } else if (type4) {
          newChildrenItem = childrenItem.set(type1, value1).set(type2, value2).set(type3, value3).set(type4, value4);
        }
      } else if (index > -1) {
        if (!type2) {
          newChildrenItem = childrenItem.setIn([type1, index], value1);
        } else if (!type3) {
          newChildrenItem = childrenItem.setIn([type1, index], value1).setIn([type2, index], value2);
        } else {
          newChildrenItem = childrenItem.setIn([type1, index], value1).setIn([type2, index], value2).setIn([type3, index], value3);
        }
      }
      newQuestionData = newQuestion.setIn(['children', this.state.clickTarget.index], newChildrenItem);
    }
    // console.log('setNewQuestionMsg - newQuestionData', newQuestionData.toJS());
    setNewQuestionData(newQuestionData);
  }
  setNewQuestionTags(degree, type, value, index) {
    if (['knowledgeIdList', 'examPointIdList'].indexOf(type) > -1) {
      this.setState({ showTree: { type, show: true, degree, index, value }});
    } else {
      this.setNewQuestionMsg(degree, -1, type, toNumber(value.key) || 0);
    }
  }
  getCheckBox(degree, answerList, count, index, parentTypeId) {
    const { setNewQuestionData, newQuestion, isJiucuo } = this.props;
    const isSingle = newQuestion.get('typeId') === 1 ? true : false;
    const typeId = parentTypeId || newQuestion.get('typeId');
    // 听力题只支持单选
    const isAudio = [50].includes(typeId);
    return (<CheckGroup style={{ width: '100%' }}>
      {((isSingle && !isJiucuo && degree !== 'children') || isAudio) ? (
        <Radio.Group
          style={{ width: '100%' }} value={answerList[0] || ''} onChange={(list) => {
            const _answerList = [list.target.value];
            let newQuestionData = newQuestion;
            if (degree === 'parent') {
              newQuestionData = newQuestion.set('answerList', fromJS(_answerList));
            } else {
              newQuestionData = newQuestion.setIn(['children', index, 'answerList'], fromJS(_answerList));
            }
            setNewQuestionData(newQuestionData);
          }}
        >
          <AnswerListBox>
            {new Array(count).fill('').map((it, i) => {
              return (<Radio key={i} value={numberToLetter(i)}>{numberToLetter(i)}</Radio>);
            })}
          </AnswerListBox>
        </Radio.Group>
      )
        : (
          <Checkbox.Group
            style={{ width: '100%' }} value={answerList || []} onChange={(list) => {
              let newQuestionData = newQuestion;
              if (degree === 'parent') {
                newQuestionData = newQuestion.set('answerList', fromJS(list.filter((it) => /^[A-Z]$/.exec(it) && (letterOptions.indexOf(it) < count)).sort()));
              } else {
                newQuestionData = newQuestion.setIn(['children', index, 'answerList'], fromJS(list.filter((it) => /^[A-Z]$/.exec(it) && (letterOptions.indexOf(it) < count)).sort()));
              }
              setNewQuestionData(newQuestionData);
            }}
          >
            <AnswerListBox>
              {new Array(count).fill('').map((it, i) => {
                return (<OptionBox style={{ minWidth: 80, flex: 0 }} key={i}><Checkbox style={{ marginLeft: 4 }} value={numberToLetter(i)}>{numberToLetter(i)}</Checkbox></OptionBox>);
              })}
            </AnswerListBox>
          </Checkbox.Group>
        )}
    </CheckGroup>);
  }
  clickEditItem(degree, property, index, i, e) {
    this.setState({ clickTarget: { target: `${degree}${property}${ifLessThan(index)}${ifLessThan(i)}`, degree, index, i, property, scrollTop: this.contentwrapper.scrollTop - (this.ueditorbox || { scrollHeight: 0 }).scrollHeight }});
    this.props.setClickTarget(`${degree}${property}${ifLessThan(index)}${ifLessThan(i)}`);
    const { formulaBoxPositionX } = this.state.formulaBoxPosition;
    const modalInnerBox = this.contentwrapper.parentNode;
    if (modalInnerBox) {
      const formulaBoxPositionY = `${modalInnerBox.scrollTop + 100}px`;
      this.setState({ formulaBoxPosition: { x: formulaBoxPositionX, y: formulaBoxPositionY }});
    }
  }
  insertFormula(formula) {
    const content = window.UE.getEditor('editor1');
    // console.log(content.getContent(), 'content');
    content.focus();
    if ((formula || '').replace(/\s/g, '').length > 0) {
      content.execCommand('insertHtml', ` <zmlatex contenteditable="false">${formula}</zmlatex> `);
      handleFormulaCaos(content);
    }
  }
  makeSelectTree() {
    const { pointList, newQuestion, isOpen } = this.props;
    // console.log(pointList.toJS(), newQuestion.toJS(), 'pointList');
    const showTree = this.state.showTree;
    const noLimit = newQuestion.get('templateType') === 1 && showTree.degree === 'parent';
    const newStyle = Object.assign({}, { overlay: Object.assign({}, customStyles.overlay, { background: 'transparent', zIndex: 100 }), content: Object.assign({}, customStyles.content, { width: 600, minHeight: 600 }) });
    const defaultData = showTree.degree === 'parent' ? newQuestion.get(showTree.type) || fromJS([]) : newQuestion.getIn(['children', showTree.index, showTree.type]) || fromJS([]);
    // console.log(defaultData.toJS(), 'defaultData');
    const treeDataList = pointList.get(showTree.type) || fromJS([]);
    // console.log(treeDataList.toJS(), 'treeDataList');
    return (<Modal
      isOpen={isOpen || false}
      style={newStyle}
      contentLabel="Alert Modal2"
    >
      <Tree.SearchTree
        style={{
          height: '100%',
          padding: 20,
        }}
        noLimit={noLimit}
        searchType={showTree.type === 'knowledgeIdList' ? '知识点' : '考点'}
        treeData={treeDataList.toJS()}
        checkedKeys={defaultData.toJS().map((it) => toString(it))}
        onOk={(checked) => {
          this.setNewQuestionMsg(showTree.degree, -1, showTree.type, fromJS(checked.filter((it) => typeof it === 'number') || []));
          this.setState({ showTree: Object.assign({}, showTree, { show: false }) });
        }}
        onCancel={() => {
          this.setNewQuestionMsg(showTree.degree, -1, showTree.type, fromJS(showTree.value || []));
          this.setState({ showTree: Object.assign({}, showTree, { show: false }) });
        }}
      />
    </Modal>);
  }
  changeOptionOrAnswer = (degree, type, way, index, i) => {
    // debugger
    // console.log(degree, type, way, index, i);
    const { newQuestion, setNewQuestionData } = this.props;
    const typeId = newQuestion.get('typeId');
    // 听力题的选项数量最少两个，最多10个，默认三个
    const minMaxWarn = (min, max, list) => {
      if (list.count() <= min && way === 'remove') {
        message.warn(`至少得有 ${min} 个${[52].includes(typeId) ? '子题' : '选项'}哦！`);
        return true;
      } else if (list.count() >= max && way === 'add') {
        message.warn(`${[52].includes(typeId) ? '子题' : '选项'}不可以超过 ${max} 个哦！`);
        return true;
      }
      return false;
    };
    if (degree === 'parent') {
      const oldList = newQuestion.get(type);
      if ([50].includes(typeId) && minMaxWarn(2, 10, oldList)) return;
      if ([52].includes(typeId) && minMaxWarn(1, 5, oldList)) return;
      if (minMaxWarn(1, 26, oldList)) return;
      let newList = way === 'add' ? oldList.push('') : oldList.splice(i, 1);

      let newQuestionData = newQuestion.set(type, newList);

      // 处理相关联的数据
      if (type === 'optionList' && newQuestion.get('answerList')) {
        // 主观选择题没有答案 特殊处理
        const answerList = newQuestion.get('answerList');
        const newAnswerList = answerList.filter((it) => it !== numberToLetter(i)).filter((it) => letterOptions.indexOf(it) < newList.count() && letterOptions.indexOf(it) > -1);
        newQuestionData = newQuestion.set(type, newList).set('answerList', newAnswerList);
        if (type === 'optionList') {
          // console.log(newQuestionData.toJS(), 'newQuestionData');
          const questionOptionList = newQuestionData.get('questionOptionList') || fromJS([]);
          // console.log(questionOptionList.toJS(), newQuestionData.get('optionList').toJS(), '-----------');
          let newQuestionOptionList = questionOptionList;
          const questionList = newQuestionData.get('optionList');
          // 材料无论如何只要比选项少就给补充上
          if (questionOptionList.count() < questionList.count()) {
            newQuestionOptionList = questionOptionList.concat(fromJS(new Array(questionList.count() - questionOptionList.count()).fill({
              questionOption: '',
              audioPath: void 0,
              uploadAudioPath: void 0,
              audioFlag: 3,
            })));
            newQuestionData = newQuestionData.set('questionOptionList', newQuestionOptionList);
          } else if (way === 'remove' && questionOptionList.count() > questionList.count()) {
            newQuestionOptionList = questionOptionList.splice(i, 1);
            newQuestionData = newQuestionData.set('questionOptionList', newQuestionOptionList);
          }
        }
      } else {
        newQuestionData = newQuestion.set(type, newList);
      }
      // console.log('newQuestionData before set: ', newQuestionData.toJS());
      setNewQuestionData(newQuestionData);
    } else if (degree === 'children') {
      const oldList = newQuestion.getIn([degree, index, type]) || fromJS([]);
      if ([50].includes(typeId) && minMaxWarn(2, 10, oldList)) return;
      if ([52].includes(typeId) && minMaxWarn(1, 5, oldList)) return;
      if (minMaxWarn(1, 26, oldList)) return;
      const newList = way === 'add' ? oldList.push('') : oldList.splice(i, 1);
      let newQuestionData = newQuestion;
      // console.log('newQuestion', newQuestion);
      if (type === 'optionList') {
        const answerList = newQuestion.getIn([degree, index, 'answerList']);
        const newAnswerList = answerList.filter((it) => it !== numberToLetter(i)).filter((it) => letterOptions.indexOf(it) < newList.count() && letterOptions.indexOf(it) > -1);
        // console.log(answerList.toJS(), newAnswerList.toJS(), 'answerList old and new');
        newQuestionData = newQuestion.setIn([degree, index, type], newList).setIn([degree, index, 'answerList'], newAnswerList);
      } else {
        newQuestionData = newQuestion.setIn([degree, index, type], newList);
      }
      setNewQuestionData(newQuestionData);
    }
  }
  closeEditOrAddQuestion() {
    const { changeQuestionEditState, setClickTarget } = this.props;
    changeQuestionEditState();
    this.setState({
      clickTarget: {
        target: '',
        index: -1,
        i: -1,
        property: '',
        scrollTop: 0,
        degree: '',
        value: '',
        questionItem: '',
      },
    });
    setClickTarget('');
  }
  // 弹框选择后设置题型
  // templateId: 模板
  // typeId: 题型
  setTemplateAndType(templateId, typeId) {
    // 选择了某一个类型
    const { setNewQuestionData, newQuestion } = this.props;
    const { curTypeId } = this.state;
    const changeQ = updateQuestionByTemplate(newQuestion, String(templateId), typeId).toJS();
    // console.log('updateQuestionByTemplate', newQuestion.get('typeId'), newQuestion.get('sourceId'));
    const sourceId = newQuestion.get('sourceId');
    if ([36, 37].includes(curTypeId)) {
      // 复合题中分类和配对默认子题typeId是自身
      changeQ.children[0].typeId = curTypeId;
    }
    changeQ.typeId = curTypeId;
    changeQ.templateType = templateId;
    changeQ.title = newQuestion.get('title') || '';
    if (Number(sourceId) === 4) {
      // 改编的题目不改变来源
      changeQ.sourceId = '4';
    }
    if ([50].includes(curTypeId)) {
      changeQ.optionElementList = fromJS(Array(3).fill(''));
      changeQ.optionList = fromJS(Array(3).fill(''));
      changeQ.stemElementList = fromJS([]);
      // console.log('changeQ.templateType', changeQ.templateType);
      if (changeQ.templateType === '1') {
        changeQ.children = [{
          'optionList': fromJS([]),
          'optionElementList': fromJS(Array(8).fill('')),
        }];
      }
    }
    console.log('changeQ: ', changeQ);
    setNewQuestionData(fromJS(changeQ));
  }

  // 选择“小题题型”、"录入模板”、复合题切换子题题型时触发
  // value 可能是 typeId 也可能是 templateType
  // type是template说明是直接改变模板的
  // 其他的要根据typeid来判断模板
  setTemplateType(value, type, index, isTemplate) {
    // console.log(value, type, index, isTemplate, 'value, type, index, isTemplate');
    // const clickTarget = this.state.clickTarget;
    const { newQuestion } = this.props;
    // debugger;
    const sourceId = newQuestion.get('sourceId');
    if (type === 'template') {
      let template = value;
      const changeQ = updateQuestionByTemplate(newQuestion, String(template), newQuestion.get('typeId')).toJS();
      changeQ.typeId = newQuestion.get('typeId');
      changeQ.title = newQuestion.get('title') || '';
      const isListen = String(newQuestion.get('typeId')) === '50';
      if (isListen) {
        changeQ.stemElementList[0].stemElementDesc = newQuestion.getIn(['stemElementList', 0, 'stemElementDesc']) || '';
        changeQ.stemElementList[0].stemElementContent = newQuestion.getIn(['stemElementList', 0, 'stemElementContent']) || '';
        changeQ.stemElementList[1].stemElementContent = newQuestion.getIn(['stemElementList', 1, 'stemElementContent']) || '';
      }
      // console.log(changeQ)
      if (Number(sourceId) === 4) {
        // 改编的题目不改变来源
        changeQ.sourceId = '4';
      }
      if (newQuestion.get('id')) {
        changeQ.id = newQuestion.get('id');
      }
      changeQ.templateType = Number(template);
      this.props.setNewQuestionData(fromJS(changeQ));
    } else {
      if (type === 'children') {
        // 复合题改变模板
        const newChild = updateQuestionByTemplate(fromJS({}), String(value)).toJS();
        const id = newQuestion.getIn(['children', index, 'id']);
        if (id) newChild.id = id;
        newChild.title = newQuestion.getIn(['children', index, 'title']) || '';
        newChild.templateType = Number(value);
        newChild.typeId = value;
        newChild.score = 3;
        const newChildConst = newQuestion.setIn(['children', index], fromJS(newChild));
        // console.log('更新模板數據', newQuestion.toJS(), newChildConst.toJS(), newChild);
        this.props.setNewQuestionData(newChildConst);
      } else {
        // this.setTemplateAndType(value, template);
        const temps = getTemplatesByTypeId(value);
        // console.log('temps value', temps, value);
        this.setState({
          choosableTmplates: temps,
          curTypeId: value
        }, () => {
          // 重置题目 给个默认模板
          this.setTemplateAndType(getDefaultTemplate(value), value);
        });
      }
    }
    this.props.setClickTarget('');
  }

  addChildQuestion() {
    const { newQuestion } = this.props;
    const parentId = newQuestion.get('typeId');
    const child = updateQuestionByTemplate(fromJS({}), '1', parentId).getIn(['children', 0]);
    const newChildren = newQuestion.get('children').push(child);
    const changQ = newQuestion.set('children', newChildren);
    this.props.setNewQuestionData(changQ);
  }
  // 只有判斷題增加子題會走這裡
  addStemChildQuestion = () => {
    const { newQuestion } = this.props;
    const child = updateQuestionByTemplate(fromJS({}), '9', 52).getIn(['children', 0]);
    const newChildren = newQuestion.get('children').push(child);
    if (newChildren.count() > 5) {
      message.error('判断题最多只能添加5个子题！');
      return;
    }
    const changQ = newQuestion.set('children', newChildren);

    // console.log('contentType', newChildren.count(), this.state.contentType);
    // debugger
    const value = this.state.contentType ? this.state.contentType[0] : 'text';
    this.addJudgeContentType(newChildren.count() - 1, value);
    this.props.setNewQuestionData(changQ);
  }
  addJudgeContentType = (key, value) => {
    // debugger
    this.setState((prevState) => ({
      contentType: {
        ...prevState.contentType,
        [key]: value
      }
    }), () => console.log('contentType', this.state.contentType));
  }
  remvoeChildQuestion(index) {
    const { newQuestion } = this.props;
    const children = newQuestion.get('children').toJS();
    if (children && children.length === 1) {
      message.info('复合题至少保留一道小题');
      return;
    }
    const newChildren = newQuestion.get('children').splice(index, 1);
    const changQ = newQuestion.set('children', newChildren);
    // console.log('remvoeChildQuestion', changQ.toJS(), this.state.contentType);
    this.setState((prevState) => {
      delete prevState.contentType[newChildren.count()];
      return {
        contentType: prevState.contentType,
      };
    }, () => console.log('remvoeChildQuestion', this.state.contentType));
    this.props.setNewQuestionData(changQ);
  }
  closeBox(index) {
    const { setNewQuestionData, newQuestion } = this.props;
    if (newQuestion.get('children').count() < 3) {
      message.info('请至少保留2项！');
      return;
    }
    const q = newQuestion.deleteIn(['children', index]);
    setNewQuestionData(q);
  }
  setClassify(sequence, value) {
    const { newQuestion, setNewQuestionData } = this.props;
    setNewQuestionData(newQuestion.setIn(['children', Number(sequence)], value));
  }
  transformQ(question) {
    // console.log('question', question);
    const children = question.children;
    let parentId = 100;
    let childId = 200;
    children && children.map(child => { // eslint-disable-line
      child.id = parentId;
      child.subQuestionMemberList = child.subQuestionItemInputDTOList || child.members;
      child.subQuestionMemberList && child.subQuestionMemberList.map(item => { // eslint-disable-line
        item.subQuestionId = parentId;
        item.id = childId;
        childId++;
      });
      parentId++;
    });
    // console.log('children', children);
    return question;
  }
  finishStep(type) {
    const { newQuestion, setNewQuestionData, submitQuestionItem } = this.props;
    if (newQuestion.get('templateType') === 1) {
      const totalScore = newQuestion.get('children').reduce((pre, next) => pre + next.get('score'), 0);
      setNewQuestionData(newQuestion.set('score', totalScore));
    }
    const isOk = submitQuestionItem(type);
    if (isOk && type === 'view') {
      this.setState({ showPreview: true });
    }
  }
  handleOption = (degree, i, e) => {
    // console.log(e.target.value, 'handleOption');
    // debugger;
    this.setState({
      contentType: {
        ...this.state.contentType,
        [i]: e.target.value
      }
    }, this.clearData(degree, i));
  }
  clearData = (degree, i) => {
    this.setNewQuestionMsg(degree, i, 'optionElementList', fromJS(Array(3).fill({})));
  }
  getAudioPath = (audioData) => {
    const { setNewQuestionData, newQuestion } = this.props;
    console.log('getAudioPath: ', newQuestion.toJS(), audioData);
    const questionContent = audioData.content || {};
    setNewQuestionData(
      newQuestion
        .merge(
          fromJS({ titleAudioPath: audioData.audioPath }).mergeDeep(
            fromJS({
              questionContent: {
                questionTitleAudioFlag: questionContent.audioFlag || 3,
                questionTitleAudioPath: questionContent.syntheticalAudioPath || null,
                questionTitleUploadAudioPath: questionContent.uploadAudioPath || null,
              }
            })
          )
        )
    );
  }
  getAudioPathForOptions = (i, audioData) => {
    const { setNewQuestionData, newQuestion } = this.props;
    console.log('getAudioPathForOptions: ', i, audioData);
    const questionOptionItem = newQuestion.getIn(['questionOptionList', i]) || fromJS({});
    const questionItemContent = audioData.content || {};
    const questionListItem = questionOptionItem.merge(fromJS({
      // questionOption: audioData.text,
      audioPath: questionItemContent.syntheticalAudioPath,
      uploadAudioPath: questionItemContent.uploadAudioPath,
      audioFlag: questionItemContent.audioFlag || 3,
    }));
    // console.log('questionOptionList: ', newQuestion.get('questionOptionList'));
    // console.log('questionListItem: ', questionListItem);
    let newQues = newQuestion;
    // console.log((newQuestion.setIn(['questionOptionList', i]), fromJS(questionListItem)).toJS(), 'toJS - toJS');
    if (newQuestion.get('questionOptionList')) {
      newQues = newQuestion.setIn(['questionOptionList', i], fromJS(questionListItem));
    } else {
      newQues = newQuestion.set('questionOptionList', fromJS(new Array(newQuestion.get('optionList').count()).fill({
        questionOption: '',
        audioPath: void 0,
        uploadAudioPath: void 0,
        audioFlag: 3,
      })).set(i, fromJS(questionListItem)));
    }
    console.log('getAudioPathForOptions - newQues.toJS(): ', newQues.toJS());
    setNewQuestionData(newQues);
  }
  clearAudioPath = () => {
    const { setNewQuestionData, newQuestion } = this.props;
    const newQ = newQuestion.delete('titleAudioPath');
    setNewQuestionData(newQ);
  }
  getOptionElementContent = (degree, index, i, data) => {
    // console.log('getOptionElementContent', degree, index, i, data);
    const { setNewQuestionData, newQuestion } = this.props;
    degree === 'parent'
      ? setNewQuestionData(newQuestion.setIn(['optionElementList', i], fromJS(data)))
      : setNewQuestionData(newQuestion.setIn([degree, index, 'optionElementList', i], fromJS(data)));
  }
  getStemElementContent = (degree, index, i, data) => {
    // console.log('getOptionElementContent', degree, index, i, data);
    const { setNewQuestionData, newQuestion } = this.props;
    degree === 'parent'
      ? setNewQuestionData(newQuestion.setIn(['stemElementList', i], fromJS(data)))
      : setNewQuestionData(newQuestion.setIn([degree, index, 'stemElementList', i], fromJS(data)));
  }

  getJudgeAns = (degree, index, i, ans) => {
    const { setNewQuestionData, newQuestion } = this.props;
    // console.log('getJudgeAns', degree, index, i, ans);
    const answer = ans['value'];
    setNewQuestionData(newQuestion.setIn([degree, index, 'answerList', i], answer));
  }
  handleDelItem = (degree, index, i) => {
    const { newQuestion, setNewQuestionData } = this.props;
    degree === 'parent'
      ? setNewQuestionData(newQuestion.set('answerList', fromJS([])))
      : setNewQuestionData(newQuestion.setIn([degree, index, 'answerList'], fromJS([])));
    setTimeout(() => {
      this.changeOptionOrAnswer(degree, 'optionElementList', 'remove', index, i);
    }, 0);
  }
  handleViceTitle = (data, i) => {
    const { newQuestion, setNewQuestionData } = this.props;
    data && setNewQuestionData(newQuestion.setIn(['stemElementList', i], fromJS(data)));
  }

  setContentType = (i, value) => {
    this.setState({
      contentType: {
        ...this.state.contentType,
        [i]: value
      }
    });
  }
  setJudgeContentType = (i, value, length) => {
    Array(length).fill('').map((item, key) => (
      this.setState((prevState) => ({
        contentType: {
          ...prevState.contentType,
          [key]: value,
        }
      }), console.log('setJudgeContentType', this.state.contentType))
    ));

  }

  getAnswerList = (degree, i, value) => {
    const {
      setNewQuestionData,
      newQuestion
    } = this.props;
    // debugger
    degree === 'parent'
      ? setNewQuestionData(newQuestion.set('answerList', fromJS(value)))
      : setNewQuestionData(newQuestion.setIn([degree, i, 'answerList'], fromJS(value)));
  }
  render() { // eslint-disable-line
    const {
      newQuestion,
      pointList,
      questionEditState,
      isOpen,
      soucre,
      setNewQuestionData,
      curTagQ
    } = this.props;
    const {
      choosableTmplates = templateTypes,
      questionTypeList,
      contentType,
      showPreviewChild
    } = this.state;
    const optionList = newQuestion.get('optionList') || fromJS([]);
    const answerList = newQuestion.get('answerList') || fromJS([]);
    const analysis = newQuestion.get('analysis') || '';
    const templateType = newQuestion.get('templateType');
    const isNewType = [5, 6, 7].includes(templateType); // 是否为新题型
    // console.log('newQuestion', newQuestion.toJS(), 'contentType', this.state.contentType);
    const children = newQuestion.get('children') || fromJS([]);
    const knowledgeIdList = newQuestion.get('knowledgeIdList') || fromJS([]);
    const examPointIdList = newQuestion.get('examPointIdList') || fromJS([]);
    const isFinalVerify = soucre === 'finalVerify';
    const isQuestionPicker = soucre === 'questionPicker';
    const childTypeList = (newQuestion.get('children') || fromJS([])).map((item) => item.get('typeId'));
    const layoutStyle = `${newQuestion.get('layoutStyle')}`;
    const parentTypeId = newQuestion.get('typeId');
    const isListen = [50].includes(newQuestion.get('typeId'));
    // console.log('clickTarget', this.state.clickTarget, ![1, 8, 9].includes(templateType) || isListen, isListen);

    // 判断是否少儿BU
    const isChildBU = /childBU/.test(window.location.pathname);
    const isChildPaper = /childBU\/child-paper/.test(window.location.pathname);
    const questionContent = newQuestion.get('questionContent') || fromJS({});
    // console.log('添加题目 state', this.state);
    return (<Wrapper>
      <Modal
        isOpen={isOpen || false}
        style={customStyles}
        contentLabel="Alert Modal1"
      >
        <FlexRowCenter innerRef={x => { this.contentwrapper = x }} style={{ position: 'absolute', top: 0, left: 0, height: 0, visibility: 'hidden' }}></FlexRowCenter>
        <div>
          <HeaderBox style={{ padding: '0 20px' }}><h2>{`${questionEditState === 1 ? '编辑' : '添加'}题目`}</h2><PlaceHolderBox /><CloseBox onClick={this.closeEditOrAddQuestion}>×</CloseBox></HeaderBox>
          <QuestionMsgContainer>
            {isNewType ? (
              <ContentWrapper>
                <FlexRowCenter style={{ minHeight: 30, marginBottom: 5 }}><ValueLeft style={{ fontSize: 16, fontWeight: 600, color: '#333', minWidth: 65 }}>标题：</ValueLeft><PlaceHolderBox />
                  <Tooltip placement="top" title="修改题型会清空部分数据" arrowPointAtCenter>
                    <TagsItemBox style={{ width: 200 }}>
                      <ValueRight>小题题型：</ValueRight>
                      <Select
                        value={toString(newQuestion.get('typeId'))}
                        style={{ width: 120 }}
                        onChange={(value) => {
                          this.setTemplateType(toNumber(value));
                        }}
                      >
                        {questionTypeList.map((item, index) => {
                          const itemCode = toString(item.get('itemCode') || item.get('id'));
                          return itemCode === '-1' ? '' : <Option key={index} value={itemCode}>{item.get('itemName') || item.get('name')}</Option>;
                        })}
                      </Select>
                    </TagsItemBox>
                  </Tooltip>
                  <TagsItemBox style={{ width: isChildBU ? 130 : 350 }}>
                    <Tooltip placement="top" title="修改模板会清空部分数据" arrowPointAtCenter>
                      <TagsItemBox style={{ display: isChildBU ? 'none' : '' }}>
                        <ValueRight>录入模板：</ValueRight>
                        <Select
                          value={toString(templateType)} style={{ width: 120 }} onChange={(value) => {
                            this.setTemplateType(toNumber(value), 'template');
                          }}
                        >
                          {choosableTmplates.map((item, index) => <Option key={item.id} value={String(item.id)}>{item.name}</Option>)}
                        </Select>
                      </TagsItemBox>
                    </Tooltip>
                    <ValueRight>总分：</ValueRight>
                    {newQuestion.get('children') ? (newQuestion.get('children').reduce((pre, next) => pre + parseFloat(next.get('score')), 0)).toFixed(1) : newQuestion.get('score').toFixed(1)}
                  </TagsItemBox>
                </FlexRowCenter>
                <MainQuestionTextArea dangerouslySetInnerHTML={{ __html: renderToKatex(newQuestion.get('title') || '') }} onClick={(e) => this.clickEditItem('parent', 'title', -1, -1, e)} ></MainQuestionTextArea>
                {this.getUeditor('parenttitle-1-1')}
                {(isChildPaper || newQuestion.get('questionContent')) ?
                  <ToAudio
                    isChildPaper={isChildPaper}
                    text={newQuestion.get('title')}
                    audioFlag={newQuestion.getIn(['questionContent', 'questionTitleAudioFlag'])}
                    audioUrl={newQuestion.get('titleAudioPath')}
                    audio={[
                      {
                        audioPath: questionContent.get('questionTitleAudioPath') || void 0,
                        status: questionContent.get('questionTitleAudioPath') ? 2 : 0,
                      },
                      {
                        audioPath: questionContent.get('questionTitleUploadAudioPath'),
                        status: questionContent.get('questionTitleUploadAudioPath') ? 2 : 0,
                      }
                    ]}
                    setAudio={this.getAudioPath}
                  /> : null}
                {/* 新题型start */}
                {templateType === 7 ? <QuestionLayoutChoice
                  templateType={templateType}
                  getUeditor={this.getUeditor}
                  clickEditItem={this.clickEditItem}
                  setNewQuestionMsg={this.setNewQuestionMsg}
                  setNewQuestionData={setNewQuestionData}
                  // parentTypeId={newQuestion.get('typeId')}
                  parentTypeId={35}
                  childTypeList={childTypeList}
                  newQuestion={newQuestion}
                  {...this.state.clickTarget}
                ></QuestionLayoutChoice>
                  : <NewQuestionWrapper>
                    <TagsItemBox>
                      <ValueRight style={{ textAlign: 'left', width: 100 }}>设置每项分数：</ValueRight>
                      <InputNumber
                        value={newQuestion.getIn(['children', 0, 'score'])}
                        min={0.5}
                        max={100}
                        step={0.5}
                        onChange={(value) => {
                          let q = newQuestion;
                          let score = 0;
                          newQuestion.get('children').map((item, index) => { // eslint-disable-line
                            q = q.setIn(['children', index, 'score'], value);
                            score += value;
                          });
                          setNewQuestionData(q.set('score', score));
                        }}
                      />
                    </TagsItemBox>
                    {templateType === 6 ? (<TagsItemBox style={{ width: 'auto' }}>
                      <ValueRight style={{ textAlign: 'left', width: 100 }}>选择配对类型：</ValueRight>
                      <Select
                        style={{ width: 120 }}
                        value={layoutStyle}
                        onChange={(value) => {
                          setNewQuestionData(newQuestion
                            .set('layoutStyle', value)
                            .set('score', 1)
                            .set('children', fromJS([
                              {
                                score: 1,
                                members: [],
                                typeId: 37,
                              },
                              {
                                score: 1,
                                members: [],
                                typeId: 37,
                              }
                            ])));
                        }}
                      >
                        {matchType.map((item, index) => <Option key={index} value={String(index + 1)}>{item}</Option>)}
                      </Select>
                      <span className="tips">(可添加2~{Number(layoutStyle) === 1 ? 6 : (Number(layoutStyle) === 2 ? 5 : 8)}个配对)</span>
                    </TagsItemBox>)
                      : (
                        <TagsItemBox style={{ width: 'auto' }}>
                          分类：<span className="tips">(可添加2~5个分类)</span>
                        </TagsItemBox>
                      )}
                    <BoxWrapper>
                      {newQuestion.get('children').map((it, index) => {
                        // console.log('it', it.toJS());
                        return templateType === 6 ? (
                          <ClassifyBox
                            data={it}
                            closeBox={this.closeBox}
                            key={index}
                            sequence={index}
                            setClassify={this.setClassify}
                            layoutStyle={layoutStyle}
                            title={`配对${numberToChinese(index + 1)}`}
                            templateType={6}
                            hasTitleInput={false}
                            textMax={Number(layoutStyle) === 2 ? 1 : 2}
                            ImgMax={Number(layoutStyle) === 2 ? 1 : 2}
                          />
                        )
                          : (
                            <ClassifyBox
                              data={it}
                              closeBox={this.closeBox}
                              key={index}
                              sequence={index}
                              setClassify={this.setClassify}
                              layoutStyle={'2'}
                              templateType={5}
                              title={`分类${numberToChinese(index + 1)}`}
                              hasTitleInput
                              allMax={4}
                            />
                          );
                      })}
                      {newQuestion.get('children').count() >= (templateType === 6 ? (Number(layoutStyle) === 1 ? 6 : (Number(layoutStyle) === 2 ? 5 : 8)) : 5) ? '' : (
                        <AddBox
                          onClick={() => {
                            let score = newQuestion.getIn(['children', 0, 'score']);
                            // console.log('child', newQuestion.get('children').toJS());
                            const child = newQuestion.get('children').push(fromJS({
                              score,
                              members: [],
                              typeId: newQuestion.get('typeId')
                            }));
                            if (child.count() > 8) {
                              message.info('不能再添加啦！');
                              return;
                            }
                            setNewQuestionData(newQuestion.set('children', child).set('score', score * child.count()));
                          }}
                        >
                          <div className="across"></div>
                          <div className="vertical"></div>
                          <div className="text tips">添加{templateType === 5 ? '分类' : '配对'}</div>
                        </AddBox>
                      )}
                    </BoxWrapper>
                  </NewQuestionWrapper>}

                {/* 新题型end */}
                {/* 按产品要求，去掉新题型的解析 - 2018-6-27 */}
                {/* {templateType === 6 ? <div>
                  <FlexRowCenter style={{ minHeight: 30, fontSize: 16, fontWeight: 600, color: '#333' }}>解析：</FlexRowCenter>
                  <MainQuestionTextArea dangerouslySetInnerHTML={{ __html: renderToKatex(analysis) }} onClick={(e) => this.clickEditItem('parent', 'analysis', -1, -1, e)} ></MainQuestionTextArea>
                  {this.getUeditor('parentanalysis-1-1')}
                </div> : ''} */}
              </ContentWrapper>
            )
              : (
                <ContentWrapper>
                  <FlexRowCenter style={{ minHeight: 30, marginBottom: 5 }}><ValueLeft style={{ fontSize: 16, fontWeight: 600, color: '#333', minWidth: 65 }}>主题干：</ValueLeft><PlaceHolderBox />
                    <Tooltip placement="top" title="修改题型会清空部分数据" arrowPointAtCenter>
                      <TagsItemBox style={{ width: 200 }}>
                        <ValueRight>小题题型：</ValueRight>
                        <Select
                          value={toString(newQuestion.get('typeId'))} style={{ width: 120 }} onChange={(value) => {
                            this.setTemplateType(Number(value));
                          }}
                        >
                          {questionTypeList.map((item, index) => {
                            const itemCode = toString(item.get('itemCode') || item.get('id'));
                            return itemCode === '-1' ? '' : <Option key={index} value={itemCode}>{item.get('itemName') || item.get('name')}</Option>;
                          })}
                        </Select>
                      </TagsItemBox>
                    </Tooltip>
                    {templateType === 1 ? (
                      <TagsItemBox style={{ width: isChildBU ? 130 : 350 }}>
                        <Tooltip placement="top" title="修改模板会清空部分数据" arrowPointAtCenter>
                          <TagsItemBox style={{ display: isChildBU ? 'none' : '' }}>
                            <ValueRight>录入模板：</ValueRight>
                            <Select
                              value={toString(templateType)} style={{ width: 120 }} onChange={(value) => {
                                this.setTemplateType(Number(value), 'template');
                              }}
                            >
                              {choosableTmplates.map((item, index) => <Option key={item.id} value={String(item.id)}>{item.name}</Option>)}
                            </Select>
                          </TagsItemBox>
                        </Tooltip>
                        <ValueRight>总分：</ValueRight>
                        {newQuestion.get('children') && (newQuestion.get('children').reduce((pre, next) => pre + next.get('score'), 0)).toFixed(1)}
                      </TagsItemBox>
                    )
                      : (
                        <TagsItemBox style={{ width: isChildBU ? 130 : 350 }}>
                          <Tooltip placement="top" title="修改模板会清空部分数据" arrowPointAtCenter>
                            <TagsItemBox style={{ display: isChildBU ? 'none' : '' }}>
                              <ValueRight>录入模板：</ValueRight>
                              <Select
                                value={toString(templateType)}
                                style={{ width: 120 }}
                                onChange={(value) => {
                                  const newTemplateType = toNumber(value);
                                  this.setTemplateType(value, 'template');
                                  // console.log('type - type', newTemplateType);
                                  if ([5, 6, 7].includes(newTemplateType)) {
                                    // console.log('is newType Question');
                                    let childType = toNumber(newQuestion.get('typeId'));
                                    switch (newTemplateType) {
                                      case 5:
                                        childType = 36;
                                        break;
                                      case 6:
                                        childType = 37;
                                        break;
                                      case 7:
                                        childType = 35;
                                        break;
                                      default:
                                        break;
                                    }
                                    this.setTemplateType(childType);
                                  }
                                }}
                              >
                                {choosableTmplates.map((item, index) => <Option key={item.id} value={String(item.id)}>{item.name}</Option>)}
                              </Select>
                            </TagsItemBox>
                          </Tooltip>
                          <ValueRight>设置分数：</ValueRight>
                          <InputNumber
                            value={newQuestion.get('score')}
                            min={0.5}
                            max={100}
                            step={0.5}
                            onChange={(value) => {
                              if (isQuestionPicker) {
                                this.props.setNewQuestionData(newQuestion.set('score', value));
                              } else {
                                this.setNewQuestionMsg('parent', -1, 'score', toNumber(value) || 1);
                              }
                            }}
                          />
                        </TagsItemBox>
                      )}
                  </FlexRowCenter>
                  <MainQuestionTextArea
                    dangerouslySetInnerHTML={{ __html: renderToKatex(newQuestion.get('title') || '') }}
                    onClick={(e) => this.clickEditItem('parent', 'title', -1, -1, e)}
                  ></MainQuestionTextArea>
                  {this.getUeditor('parenttitle-1-1')}
                  {/* 只有少儿BU录入的时候支持主题干转音频，在已入库题目管理中修改 */}
                  {(isChildPaper || newQuestion.get('questionContent')) ?
                    <ToAudio
                      isChildPaper={isChildPaper}
                      text={newQuestion.get('title')}
                      setAudio={this.getAudioPath}
                      audioFlag={questionContent.get('questionTitleAudioFlag')}
                      audioUrl={newQuestion.get('titleAudioPath')}
                      audio={[
                        {
                          audioPath: questionContent.get('questionTitleAudioPath') || void 0,
                          status: questionContent.get('questionTitleAudioPath') ? 2 : 0,
                        },
                        {
                          audioPath: questionContent.get('questionTitleUploadAudioPath'),
                          status: questionContent.get('questionTitleUploadAudioPath') ? 2 : 0,
                        }
                      ]}
                    /> : null}
                  {[50, 52].includes(parentTypeId)
                    ? <ViceTitle
                      getContent={this.handleViceTitle}
                      stemElementList={newQuestion.get('stemElementList')}
                    /> : ''}

                  {/* </FlexRowCenter> */}
                  {/* 选择题和主观选择题的选项 */}
                  {[2, 8].includes(templateType) && ![50, 52].includes(Number(parentTypeId)) ? <div>
                    <FlexRowCenter style={{ minHeight: 30, fontSize: 16, fontWeight: 600, color: '#333' }}>
                      <ValueLeft style={{ fontSize: 16, fontWeight: 600, color: '#333', minWidth: 65 }}>
                        选项：
                      </ValueLeft>
                      <PlaceHolderBox />
                      <Button style={{ margin: 0 }} onClick={() => this.changeOptionOrAnswer('parent', 'optionList', 'add', -1, -1)}>添加选项</Button>
                    </FlexRowCenter>
                    <DivBox>
                      {
                        optionList.map((it, i) => {
                          const questionOptionItem = newQuestion.getIn(['questionOptionList', i]) || fromJS({});
                          return (<div key={i} style={{ marginTop: 10, padding: 4 }}>
                            <FlexRow>
                              <ValueRight style={{ maxWidth: 30, width: 30, fontSize: '10.5pt', lineHeight: '2em', padding: '5px 0' }}>{`${numberToLetter(i)}、`}</ValueRight>
                              <ListItem dangerouslySetInnerHTML={{ __html: renderToKatex(it || '') }} onClick={(e) => this.clickEditItem('parent', 'optionList', -1, i, e)} ></ListItem>
                              <DeleteItem onClick={() => this.changeOptionOrAnswer('parent', 'optionList', 'remove', -1, i)}>删除</DeleteItem>
                            </FlexRow>
                            {this.getUeditor(`parentoptionList-1${ifLessThan(i)}`)}
                            {(isChildPaper || newQuestion.get('questionContent')) ?
                              <ToAudio
                                isChildPaper={isChildPaper}
                                text={it}
                                audioFlag={questionOptionItem.get('audioFlag')}
                                audioUrl={questionOptionItem.get(audioPathEnum[questionOptionItem.get('audioFlag')])}
                                audio={[
                                  {
                                    audioPath: questionOptionItem.get('audioPath') || void 0,
                                    status: questionOptionItem.get('audioPath') ? 2 : 0,
                                  },
                                  {
                                    audioPath: questionOptionItem.get('uploadAudioPath'),
                                    status: questionOptionItem.get('uploadAudioPath') ? 2 : 0,
                                  }
                                ]}
                                setAudio={(audioData) => this.getAudioPathForOptions(i, audioData)}
                              /> : null}
                          </div>);
                        })
                      }
                    </DivBox>
                  </div> : ''}
                  {/* {听力及判断题的选项} */}
                  {/* 2多选题删掉 */}
                  {isListen && ![1].includes(templateType)
                    ? <Listen
                      contentType={contentType}
                      newQuestion={newQuestion}
                      setNewQuestionData={setNewQuestionData}
                      changeOptionOrAnswer={this.changeOptionOrAnswer}
                      setContentType={this.setContentType}
                      answerList={newQuestion.get('answerList') || fromJS([])}
                      optionElementList={newQuestion.get('optionElementList') || fromJS([])}
                      getOptionElementContent={this.getOptionElementContent}
                      handleDelItem={this.handleDelItem}
                      getJudgeAns={this.getJudgeAns}
                      getAnswerList={(value) => this.getAnswerList('parent', -1, value)}
                      target={{
                        degree: 'parent',
                        index: -1,
                      }}
                    /> : ''}
                  {/* 判断题子题 */}
                  {/* {[9].includes(templateType) && judgeWrapper()} */}
                  {[9].includes(templateType) && children.count() > 0
                    ? <div>
                      <OptionTab
                        judge
                        contentType={contentType}
                        newQuestion={newQuestion}
                        setNewQuestionData={setNewQuestionData}
                        setContentType={(i, value) => this.setJudgeContentType(i, value, children.count())}
                        target={{
                          degree: 'children',
                          index: -1,
                          type: 'stemElementList',
                          i: -1,
                        }}
                      />
                      {children.map((it, index) => {
                        const item = fromJS(it);
                        const isImg = this.state.contentType && this.state.contentType[0] === 'img';
                        return (
                          <QuestionItemWrapper key={index} style={isImg ? { display: 'inline-block', margin: '0 6px' } : { display: 'block' }}>
                            <Judge
                              contentType={contentType}
                              newQuestion={newQuestion}
                              setNewQuestionData={setNewQuestionData}
                              answerList={item.get('answerList') || fromJS([])}
                              optionElementList={item.get('stemElementList') || fromJS([])}
                              getOptionElementContent={this.getStemElementContent}
                              handleDelItem={this.remvoeChildQuestion}
                              getJudgeAns={this.getJudgeAns}
                              getAnswerList={(value) => this.getAnswerList('children', index, value)}
                              target={{
                                degree: 'children',
                                index: index,
                              }}
                            />
                          </QuestionItemWrapper>
                        );
                      })}</div> : ''}
                  {[9].includes(templateType) && <Button style={{ marginTop: '6px' }} type="primary" onClick={() => this.addStemChildQuestion()}>添加子题</Button>
                  }
                  {/* 主观选择题和复合题不需要答案 */}
                  {![1, 8, 9, 10].includes(templateType) && !isListen ? <div>
                    {templateType === 3 ? <FlexRowCenter style={{ minHeight: 30, fontSize: 16, fontWeight: 600, color: '#333' }}><ValueLeft style={{ fontSize: 16, fontWeight: 600, color: '#333', minWidth: 65 }}>答案：</ValueLeft><PlaceHolderBox />
                      <Button style={{ margin: 0 }} onClick={() => this.changeOptionOrAnswer('parent', 'answerList', 'add', -1, -1)}>添加答案</Button>
                    </FlexRowCenter> : <FlexRowCenter style={{ minHeight: 30, fontSize: 16, fontWeight: 600, color: '#333' }}>答案：</FlexRowCenter>}
                    {templateType === 2 ? this.getCheckBox('parent', answerList.toJS(), optionList.count(), -1) : <DivBox style={listBoxStyle}>
                      {answerList.map((it, i) => {
                        return (<div key={i}>
                          <FlexRow>
                            <ValueRight style={{ maxWidth: 30, width: 30, fontSize: '10.5pt', lineHeight: '2em', padding: '5px 0' }}>{`${i + 1}、`}</ValueRight>
                            <ListItem dangerouslySetInnerHTML={{ __html: renderToKatex(it || '') }} onClick={(e) => this.clickEditItem('parent', 'answerList', -1, i, e)} ></ListItem>
                            <DeleteItem onClick={() => this.changeOptionOrAnswer('parent', 'answerList', 'remove', -1, i)}>删除</DeleteItem>
                          </FlexRow>
                          {this.getUeditor(`parentanswerList-1${ifLessThan(i)}`)}
                        </div>);
                      })}
                    </DivBox>}
                  </div> : ''}
                  {/* 复合题没有解析，因为解析放到子题里面去了,判断题的解析是在主题干中的 */}
                  {/* 互动排序题 */}
                  {templateType === 10 && (
                    <ChildSortQuestion
                      setNewQuestionMsg={this.setNewQuestionMsg}
                      optionElementList={newQuestion.get('optionElementList') || fromJS([])}
                    />)
                  }
                  {templateType !== 1 ? <div>
                    <FlexRowCenter style={{ minHeight: 30, fontSize: 16, fontWeight: 600, color: '#333' }}>解析：</FlexRowCenter>
                    <MainQuestionTextArea dangerouslySetInnerHTML={{ __html: renderToKatex(analysis || '') }} onClick={(e) => this.clickEditItem('parent', 'analysis', -1, -1, e)} ></MainQuestionTextArea>
                    {this.getUeditor('parentanalysis-1-1')}
                  </div> : ''}
                  {/* 复合题 */}
                  {[1].includes(templateType) && children.count() > 0 ? children.map((it, index) => {
                    const item = fromJS(it);
                    const childrenTitle = item.get('title') || '';
                    const childrenOptionList = item.get('optionList') || fromJS([]);
                    // const childrenOptionElementList = item.get('optionElementList') || fromJS(Array(5).fill(''));
                    const childrenAnswerList = item.get('answerList') || fromJS([]);
                    const childrenAnalysis = item.get('analysis') || '';
                    const childrenKnowledgeIdList = item.get('knowledgeIdList') || fromJS([]);
                    const childrenExamPointIdList = item.get('examPointIdList') || fromJS([]);
                    const typeId = Number(item.get('typeId')) || 1;
                    return (<QuestionItemWrapper key={index}>
                      <FlexRowCenter style={{ minHeight: 30, fontSize: 16, fontWeight: 600, color: '#333' }}>{`第${index + 1}子题`}</FlexRowCenter>
                      <FlexRowCenter style={{ minHeight: 30, fontSize: 16, fontWeight: 600, color: '#333', marginBottom: 5 }}><ValueLeft>题干：</ValueLeft>
                        <FlexRowCenter>
                          <Button onClick={() => this.remvoeChildQuestion(index)}>删除子题{index + 1}</Button>
                          <TagsItemBox style={{ width: 320 }}>
                            <ValueRight style={{ fontSize: 12, fontWeight: 400, width: 120 }}>子题题型：</ValueRight>
                            <Select
                              labelInValue
                              defaultValue={{ key: toString(typeId) || '4' }}
                              style={{ width: 120 }}
                              onChange={(value) => {
                                this.setTemplateType(Number(value.key), 'children', index);
                              }}
                            >
                              <Option key={index} value="2">选择题</Option>
                              {[50, 52].includes(parentTypeId) ? '' : <Option key={index} value="3">填空题</Option>}
                              {[50, 52].includes(parentTypeId) ? '' : <Option key={index} value="4">简答题</Option>}
                            </Select>
                            <ValueRight style={{ fontSize: 12, fontWeight: 400, width: 120 }}>设置分数：</ValueRight>
                            <InputNumber
                              value={newQuestion.getIn(['children', index, 'score'])} min={0.5} max={100} step={0.5} onChange={(value) => {
                                this.props.setNewQuestionData(newQuestion.setIn(['children', index, 'score'], value));
                              }}
                            />
                          </TagsItemBox>
                        </FlexRowCenter>
                      </FlexRowCenter>
                      <MainQuestionTextArea dangerouslySetInnerHTML={{ __html: renderToKatex(childrenTitle || '') }} onClick={(e) => this.clickEditItem('children', 'title', index, -1, e)}></MainQuestionTextArea>
                      {this.getUeditor(`childrentitle${ifLessThan(index)}-1`)}
                      {typeId === 2 ? <div>
                        <DivBox style={listBoxStyle}>
                          {isListen
                            ? <Listen
                              contentType={contentType}
                              newQuestion={newQuestion}
                              setNewQuestionData={setNewQuestionData}
                              changeOptionOrAnswer={this.changeOptionOrAnswer}
                              setContentType={this.setContentType}
                              answerList={item.get('answerList') || fromJS([])}
                              optionElementList={item.get('optionElementList') || fromJS([])}
                              getOptionElementContent={this.getOptionElementContent}
                              handleDelItem={this.handleDelItem}
                              getJudgeAns={this.getJudgeAns}
                              getAnswerList={(value) => this.getAnswerList('children', index, value)}
                              noAudio={true}
                              target={{
                                degree: 'children',
                                index: index,
                              }}
                            />

                            : childrenOptionList.map((it, i) => {
                              return (<div key={i}>
                                <FlexRow>
                                  <ValueRight style={{ maxWidth: 30, width: 30, fontSize: '10.5pt', lineHeight: '2em', padding: '5px 0' }}>{`${numberToLetter(i)}、`}</ValueRight>
                                  <ListItem dangerouslySetInnerHTML={{ __html: renderToKatex(it || '') }} onClick={(e) => this.clickEditItem('children', 'optionList', index, i, e)} ></ListItem>
                                  <DeleteItem onClick={() => this.changeOptionOrAnswer('children', 'optionList', 'remove', index, i)}>删除</DeleteItem>
                                </FlexRow>
                                {this.getUeditor(`childrenoptionList${ifLessThan(index)}${ifLessThan(i)}`)}
                              </div>);
                            })
                          }
                        </DivBox>
                      </div> : ''}
                      {isListen ? '' :
                        typeId === 3
                          ? <FlexRowCenter style={{ minHeight: 30, fontSize: 16, fontWeight: 600, color: '#333' }}>
                            <ValueLeft style={{ fontSize: 16, fontWeight: 600, color: '#333', minWidth: 65 }}>答案：</ValueLeft>
                            <PlaceHolderBox />
                            <Button style={{ margin: 0 }} onClick={() => this.changeOptionOrAnswer('children', 'answerList', 'add', index, -1)}>添加答案</Button>
                          </FlexRowCenter>
                          : <FlexRowCenter style={{ minHeight: 30, fontSize: 16, fontWeight: 600, color: '#333' }}>答案：</FlexRowCenter>}
                      {isListen ? '' :
                        [2].includes(typeId)
                          ? this.getCheckBox('children', childrenAnswerList.toJS(), childrenOptionList.count(), index)
                          : childrenAnswerList.count() > 0
                            ? (<DivBox style={listBoxStyle}>
                              {childrenAnswerList.map((it, i) => {
                                return (<div key={i}>
                                  <FlexRow>
                                    <ValueRight style={{ maxWidth: 30, width: 30, fontSize: '10.5pt', lineHeight: '2em', padding: '5px 0' }}>{`${i + 1}、`}</ValueRight>
                                    <ListItem dangerouslySetInnerHTML={{ __html: renderToKatex(it || '') }} onClick={(e) => this.clickEditItem('children', 'answerList', index, i, e)} ></ListItem>
                                    {typeId === 3 ? <DeleteItem onClick={() => this.changeOptionOrAnswer('children', 'answerList', 'remove', index, i)}>删除</DeleteItem> : ''}
                                  </FlexRow>
                                  {this.getUeditor(`childrenanswerList${ifLessThan(index)}${ifLessThan(i)}`)}
                                </div>);
                              })}
                            </DivBox>) : null}
                      <FlexRowCenter style={{ minHeight: 30, fontSize: 16, fontWeight: 600, color: '#333' }}>解析：</FlexRowCenter>
                      <MainQuestionTextArea dangerouslySetInnerHTML={{ __html: renderToKatex(childrenAnalysis || '') }} onClick={(e) => this.clickEditItem('children', 'analysis', index, -1, e)} ></MainQuestionTextArea>
                      {this.getUeditor(`childrenanalysis${ifLessThan(index)}-1`)}
                      {isFinalVerify ? <TagsItemWrapper style={{ border: '1px solid #ddd' }}>
                        {pointList.get('knowledgeIdList').count() > 0 ? <TagsItemBox style={{ width: 'auto', minWidth: 300 }}><ValueRight style={{ fontWeight: 600, fontSize: 14, color: '#f33' }}>知识点：</ValueRight>
                          <ValueLeft flex="none">
                            {backChooseItem(pointList.get('knowledgeIdList'), childrenKnowledgeIdList.toJS(), []).join('、')}
                          </ValueLeft>
                          <AddPoint
                            onClick={(e) => {
                              this.setNewQuestionTags('children', 'knowledgeIdList', childrenKnowledgeIdList.toJS(), index);
                              this.clickEditItem('children', 'knowledgeIdList', index, -1, e);
                            }}
                          >+</AddPoint>
                        </TagsItemBox> : ''}
                        {pointList.get('examPointIdList').count() > 0 ? <TagsItemBox style={{ width: 'auto', minWidth: 300 }}><ValueRight style={{ fontWeight: 600, fontSize: 14, color: '#f33' }}>考点：</ValueRight>
                          <ValueLeft flex="none">
                            {backChooseItem(pointList.get('examPointIdList'), childrenExamPointIdList.toJS(), []).join('、')}
                          </ValueLeft>
                          <AddPoint
                            onClick={(e) => {
                              this.setNewQuestionTags('children', 'examPointIdList', childrenExamPointIdList.toJS(), index);
                              this.clickEditItem('children', 'examPointIdList', index, -1, e);
                            }}
                          >+</AddPoint>
                        </TagsItemBox> : ''}
                      </TagsItemWrapper> : ''}
                    </QuestionItemWrapper>);
                  }) : ''}
                  {[1].includes(templateType) ? <Button type="primary" onClick={() => this.addChildQuestion()}>新增子题</Button> : ''}
                </ContentWrapper>
              )}
            {isFinalVerify
              ? <Tags
                newQuestion={newQuestion}
                tagsName={tagsName}
                setNewQuestionTags={this.setNewQuestionTags}
                pointList={pointList}
                knowledgeIdList={knowledgeIdList}
                examPointIdList={examPointIdList}
                backChooseItem={backChooseItem}
              />
              : ''}
            <FlexCenter style={{ height: 40, marginTop: 5 }}>
              {isChildBU && <Button onClick={() => { this.setState({ showPreviewChild: true }) }}>预览题目</Button>}
              <Button
                type="primary" style={{ margin: '0 40px' }}
                onClick={() => {
                  this.finishStep();
                }}
              >{isQuestionPicker ? '下一步' : '保存'}</Button>
              {this.props.source2 === 'zmlPicker' ? <Button onClick={() => this.finishStep('view')}>预览</Button> : ''}
              <Button style={{ margin: '0 40px' }} onClick={this.closeEditOrAddQuestion}>取消</Button>
            </FlexCenter>
          </QuestionMsgContainer>
        </div>
        {this.state.seeFormulaModal ? <AlwaysFormula
          subjectId={newQuestion.get('subjectId')}
          gradeId={newQuestion.get('gradeId')}
          insertText={this.insertFormula}
          formulaBoxPosition={this.state.formulaBoxPosition}
          changeFormulaBoxPosition={(obj) => this.setState({ formulaBoxPosition: obj })}
          momeryPosition={this.state.momeryPosition}
          changeMomeryPosition={(obj) => this.setState({ momeryPosition: obj })}
          closeFormulaBox={(bol) => this.setState({ seeFormulaModal: bol })}
          soucre={soucre}
        /> : ''}
      </Modal>
      {this.state.showTree.show ? this.makeSelectTree() : ''}
      <AntModel visible={this.state.showPreview} footer={null} onCancel={() => this.setState({ showPreview: false })} width={1232}>
        <div style={{ width: '1200px', height: '675px' }} >
          {this.state.showPreview && <PreviewSlide question={this.transformQ(curTagQ.toJS())} />}
        </div>
      </AntModel>
      {showPreviewChild && (
        <PreviewChildQuestion
          questionTypeList={questionTypeList}
          data={newQuestion.toJS()}
          onClose={() => { this.setState({ showPreviewChild: false }) }}
        />)}
    </Wrapper>);
  }
}

EditItemQuestion.propTypes = {
  submitQuestionItem: PropTypes.func,
};

export default EditItemQuestion;
