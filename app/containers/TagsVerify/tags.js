/*
 *
 * TagsVerify
 * author: bin
 * change author: yinjie.zhang
 *
 */
/* eslint-disable no-case-declarations */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import immutable, { fromJS } from 'immutable';
import styled from 'styled-components';
import { FlexRowCenter } from 'components/FlexBox';
import { createStructuredSelector } from 'reselect';
import {
  // downloadFile, // 如果你需要下载试卷功能,那就使用这个方法吧
  numberToLetter, toString, toNumber, limitCount
} from 'components/CommonFn';
import { pointToUnity } from 'containers/SetTags/verifyPointRule';
import { PlaceHolderBox, WidthBox } from 'components/CommonFn/style';
import { setBackAlertStatesAction, changeBackPromptAlertShowAction } from 'containers/LeftNavC/actions';
import { getDefaultTemplate } from 'utils/templateMapper';
import { makeBtnCanClick } from 'containers/LeftNavC/selectors';
import ShowQuestionItem from 'components/ShowQuestionItem';
import AppLocalStorage from 'utils/localStorage';
import TreeComponent from './TreeComponent';
import VerifyChildren, { backChooseItem } from './verifyChildren';
import TagsUseWho from './TagsUseWho';
import { addQuestionCountByExamPaper } from 'utils/request';
import
makeSelectSetTags,
{
  makePaperTitle,
  makePaperDownloadMsg,
  getExamPointList,
  getKnowledgeList,
  makeBigQuestionMsg,
  makeQuestionsList,
  makeQuestionsIndex,
  makeShowChildrenVerify,
  makeShowTree,
  makeCommonInfo,
  makeCurrentPaperData,
} from './selectors';
import {
  getEditionList,
  getCourseSystemAction,
  changePageState,
  setQuestionsListAction,
  changeQuestionsIndexAction,
  changeShowChildrenVerifyAction,
  submitVerifyPaperAction,
  setShowQuestionTreeAction,
  justInToDepotAction,
} from './actions';
import PaperQuestionList from 'components/PaperQuestionList';
import { Button, Select, Modal, Switch } from 'antd';
import {
  VerifyWrapper,
  TopButtonsBox,
  QuestionContentBox,
  QuestionOptions,
  OptionsWrapper,
  OptionsOrder,
  Options,
  AnalysisWrapper,
  QuestionAnalysis,
  QUestionAnswer,
  AnswerTitle,
  AnswerConten,
  QuestionItemWrapper,
  QuestionTitleContent,
  ChildrenItem,
  AnswerBox,
  ShowButton,
  ContentWrapper,
  LeftWrapper,
  RightWrapper,
  QuestionWrapper,
  TagsShowWrapper,
  TagsShowRow,
  TagsItemBox,
  Option,
  RadioBox,
  TagsItemContent,
  TreeShowWrapper,
  TreeGroupWrapper,
  TreeGroupBox,
  TreeItemBox,
  ButtonsWrapper,
  VerifyChildrenButton,
  TextValue,
  Textarea,
  RadioGroup,
  TreeNode,
} from './tagsStyle';


export const tagsList = ['difficulty', 'distinction', 'comprehensiveDegreeId', 'rating'];
export const tagsName = {
  difficulty: ['请选择', '一级', '二级', '三级', '四级', '五级'],
  distinction: ['请选择', '差', '一般', '好'],
  comprehensiveDegreeId: ['请选择', '1', '2', '3'],
  rating: ['请选择', '基础题', '常规题', '压轴题', '易错题', '经典题'],
};
const treesList = ['knowledgeIdList', 'examPointIdList'];


export const MakeErrorWrapper = styled.div`
  min-height: ${(props) => (props.showTextArea ? 170 : 50)}px;
  background: #fff;
  padding: 10px;
`;


export class EditTag extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.questionItemforType = this.questionItemforType.bind(this);
    this.makeQuestionItem = this.makeQuestionItem.bind(this);
    this.showTags = this.showTags.bind(this);
    this.setQuestionTags = this.setQuestionTags.bind(this);
    this.showTree = this.showTree.bind(this);
    this.changeQuestionsIndex = this.changeQuestionsIndex.bind(this);
    this.setQuestionTagsSelect = this.setQuestionTagsSelect.bind(this);
    this.verifyCurrentTags = this.verifyCurrentTags.bind(this);
    this.state = {
      showAllChildren: false,
      limtShow: 5,
      seeMobile: false,
      ModalText: '您确定要将该试卷直接入库吗？',
      visible: false,
    };
  }
  componentDidMount() {
    this.props.dispatch(getEditionList());
    this.props.dispatch(getCourseSystemAction());
  }
  setQuestionTags(type, value) {
    const questionsIndex = this.props.questionsIndex;
    const newQuestionsList = this.props.questionsList.setIn([questionsIndex, 'questionOutputDTO', 'questionTag', type], value);
    this.props.dispatch(setQuestionsListAction(newQuestionsList));
  }
  setQuestionTagsSelect(...vars) {
    const [item1, type1, value1, item2, type2, value2, item3, type3, value3] = vars;
    // console.log(item1, type1, value1, item2, type2, value2, item3, type3, value3);
    const questionsIndex = this.props.questionsIndex;
    const questionsList = this.props.questionsList;
    let newQuestionsList = questionsList;
    if (item1 !== void 0 && item2 === void 0) {
      newQuestionsList = questionsList.setIn([questionsIndex, 'questionOutputDTO', item1, type1], value1);
    } else if (item2 !== void 0 && item3 === void 0) {
      newQuestionsList = questionsList.setIn([questionsIndex, 'questionOutputDTO', item1, type1], value1).setIn([questionsIndex, 'questionOutputDTO', item2, type2], value2);
    } else if (item3 && type3 && value3 !== void 0) {
      newQuestionsList = questionsList.setIn([questionsIndex, 'questionOutputDTO', item1, type1], value1).setIn([questionsIndex, 'questionOutputDTO', item2, type2], value2).setIn([questionsIndex, 'questionOutputDTO', item3, type3], value3);
    } else {
      alert('亲，你确认没搞错什么吗？');
    }
    this.props.dispatch(setQuestionsListAction(newQuestionsList));
    setTimeout(() => {
      console.log(this.props.questionsList.getIn([questionsIndex, 'questionOutputDTO', item1]).toJS());
    }, 100);
  }
  makeQuestionItem(currentQuestion, questionIndex) {
    let res = '';
    const { typeId, templateType } = currentQuestion.toJS();
    const templateTypeId = templateType > 0 ? templateType : Number(getDefaultTemplate(typeId));
    if (templateTypeId === 2) {
      res = this.questionItemforType(currentQuestion, 1, questionIndex);
    } else if (templateTypeId === 3) {
      res = this.questionItemforType(currentQuestion, 2, questionIndex);
    } else if (templateTypeId === 4) {
      res = this.questionItemforType(currentQuestion, 3, questionIndex);
    } else if (templateTypeId === 1) {
      res = this.questionItemforType(currentQuestion, 4, questionIndex);
    }
    return res;
  }
  questionItemforType(currentQuestion, type, index) {
    let res = '';
    switch (type) {
      case 1:
        res = (<QuestionItemWrapper>
          <QuestionTitleContent><div>{`${index + 1}、`}</div><QuestionContentBox dangerouslySetInnerHTML={{ __html: currentQuestion.get('title') || '' }} /></QuestionTitleContent>
          <QuestionOptions>
            {fromJS(currentQuestion.get('optionList') || []).map((value, i) => (
              <OptionsWrapper key={i}>
                <OptionsOrder>{`${numberToLetter(i)}、`}</OptionsOrder>
                <Options dangerouslySetInnerHTML={{ __html: value.replace(/<br>/g, '') }} />
              </OptionsWrapper>
            ))}
          </QuestionOptions>
          <AnalysisWrapper>
            <QuestionAnalysis>
              <AnswerTitle><span>解析：</span></AnswerTitle>
              <AnswerConten dangerouslySetInnerHTML={{ __html: currentQuestion.get('analysis') || '' }} />
            </QuestionAnalysis>
            <QUestionAnswer>
              <AnswerTitle><span>答案：</span></AnswerTitle>
              {currentQuestion.get('answerList').map((value, i) => {
                return (<AnswerConten key={i} style={{ maxWidth: 30 }} className={'rightAnswer'} dangerouslySetInnerHTML={{ __html: value || '' }} />);
              })}
            </QUestionAnswer>
          </AnalysisWrapper>
        </QuestionItemWrapper>);
        break;
      case 2:
        res = (<QuestionItemWrapper>
          <QuestionTitleContent><div>{`${index + 1}、`}</div><QuestionContentBox dangerouslySetInnerHTML={{ __html: currentQuestion.get('title') || '' }} /></QuestionTitleContent>
          <AnalysisWrapper>
            <QuestionAnalysis>
              <AnswerTitle><span>解析：</span></AnswerTitle>
              <AnswerConten dangerouslySetInnerHTML={{ __html: currentQuestion.get('analysis') || '' }} />
            </QuestionAnalysis>
            <QUestionAnswer>
              <AnswerTitle><span style={{ marginTop: '6px' }}>答案：</span></AnswerTitle>
              <AnswerBox>
                {currentQuestion.get('answerList').map((value, i) => {
                  return (<AnswerConten style={{ display: 'block' }} key={i} className={'rightAnswer'} dangerouslySetInnerHTML={{ __html: value || '' }} />);
                })}
              </AnswerBox>
            </QUestionAnswer>
          </AnalysisWrapper>
        </QuestionItemWrapper>);
        break;
      case 3:
        res = (<QuestionItemWrapper>
          <QuestionTitleContent><div>{`${index + 1}、`}</div><QuestionContentBox dangerouslySetInnerHTML={{ __html: currentQuestion.get('title') || '' }} /></QuestionTitleContent>
          <AnalysisWrapper>
            <QuestionAnalysis>
              <AnswerTitle><span>解析：</span></AnswerTitle>
              <AnswerConten dangerouslySetInnerHTML={{ __html: currentQuestion.get('analysis') || '' }} />
            </QuestionAnalysis>
            <QUestionAnswer>
              <AnswerTitle><span style={{ marginTop: '6px' }}>答案：</span></AnswerTitle>
              <AnswerBox>
                {currentQuestion.get('answerList').map((value, i) => {
                  return (<AnswerConten key={i} className={'rightAnswer'} dangerouslySetInnerHTML={{ __html: value || '' }} />);
                })}
              </AnswerBox>
            </QUestionAnswer>
          </AnalysisWrapper>
        </QuestionItemWrapper>);
        break;
      case 4: // eslint-disable-line
        const children = currentQuestion.get('children') || fromJS([]);
        res = (<QuestionItemWrapper>
          <QuestionTitleContent><div style={{ fontSize: 14, fontWeight: 600 }}>{`${index + 1}、`}</div><QuestionContentBox style={{ fontSize: 14 }} dangerouslySetInnerHTML={{ __html: currentQuestion.get('title') || '' }} /></QuestionTitleContent>
          {children.count() > 0 ? children.map((item, i) => {
            let result = '';
            const limit = this.state.showAllChildren ? children.count() : this.state.limtShow;
            if (i < limit) {
              result = (<ChildrenItem key={i}>{this.questionItemforType(item, item.get('typeId') - 1, i)}</ChildrenItem>);
            }
            return result;
          }) : ''}
        </QuestionItemWrapper>);
        break;
      default:
        break;
    }
    return res;
  }
  tagsChange(e, type) {
    if (['tagAdopt', 'tagReason'].indexOf(type) > -1) {
      this.setQuestionTagsSelect('questionTag', type, e.target.value);
      return;
    } else if (type === 'errReason') {
      this.setQuestionTags(type, e.target.value);
      return;
    } else if (['errState', 'showTextArea'].indexOf(type) > -1) {
      this.setQuestionTags(type, e);
      return;
    }
    const selectIndex = e.target.value;
    let value = 0;
    if (selectIndex === 3) {
      this.setQuestionTagsSelect('verifyTagsSelect', type, selectIndex, 'verifyTagsSelectDrop', type, 0);
    } else {
      const questionsIndex = this.props.questionsIndex;
      const tags1 = this.props.questionsList.getIn([questionsIndex, 'questionOutputDTO', 'questionTag1']) || fromJS({});
      const tags2 = this.props.questionsList.getIn([questionsIndex, 'questionOutputDTO', 'questionTag2']) || fromJS({});
      if (selectIndex === 1) {
        value = tags1.get(type);
      } else {
        value = tags2.get(type);
      }
      this.setQuestionTagsSelect('verifyTagsSelect', type, selectIndex, 'verifyTagsSelectDrop', type, 0, 'questionTag', type, value);
    }
  }
  selectTags(value, type) {
    const num = toNumber(value.key);
    this.setQuestionTagsSelect('verifyTagsSelectDrop', type, num, 'questionTag', type, num);
  }
  showTags(currentQuestion = fromJS({}), attrList = []) {
    const tags1 = currentQuestion.get('questionTag1') || fromJS({});
    const tags2 = currentQuestion.get('questionTag2') || fromJS({});
    const verifyTagsSelect = currentQuestion.get('verifyTagsSelect') || fromJS({});
    return (<TagsShowRow>
      {attrList.map((item, index) => {
        const selectKey = currentQuestion.getIn(['verifyTagsSelectDrop', item], 0);
        return (<TagsItemBox key={index}>
          <p>{`${['难度', '区分度', '综合度', '题目评级'][index]}：`}</p>
          <RadioGroup value={verifyTagsSelect.get(item) || 0} style={{ display: 'block' }} onChange={(e) => this.tagsChange(e, item, currentQuestion)}>
            <RadioBox value={1}><span style={{ color: '#999' }}>结果一：</span><TagsItemContent index={1}>{tagsName[item][(tags1.get(item) || 0)]}</TagsItemContent></RadioBox>
            <RadioBox value={2}><span style={{ color: '#999' }}>结果二：</span><TagsItemContent index={2}>{tagsName[item][(tags2.get(item) || 0)]}</TagsItemContent></RadioBox>
            <RadioBox value={3}>
              <Select disabled={verifyTagsSelect.get(item) === 3 ? false : true} style={{ width: 120 }} labelInValue value={{ key: toString(selectKey), label: tagsName[item][selectKey] }} onChange={(value) => this.selectTags(value, item, currentQuestion)}>
                {tagsName[item].map((it, i) => {
                  return (<Option key={i} value={toString(i) || '0'}>{it}</Option>);
                })}
              </Select>
            </RadioBox>
          </RadioGroup>
        </TagsItemBox>);
      })}
    </TagsShowRow>);
  }
  showTree(currentQuestion = fromJS({}), attrList = []) {
    const noLimit = currentQuestion.get('templateType') === 1;
    const tags1 = currentQuestion.get('questionTag1') || fromJS({});
    const tags2 = currentQuestion.get('questionTag2') || fromJS({});
    const tags = currentQuestion.get('questionTag') || fromJS({});
    return (<TreeShowWrapper>
      {attrList.map((item, index) => {
        return (this.props[item] || fromJS([])).count() > 0 ? <TreeGroupWrapper key={index}>
          <p>{`${['知识点', '考点'][index]}：`}</p>
          <TreeGroupBox>
            <TreeItemBox flex={2}>{backChooseItem(this.props[item], tags1.get(item).toJS(), [], item).map((it, i) => <p title={it} style={{ paddingLeft: 10, lineHeight: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} key={i}>{it}</p>)}</TreeItemBox>
            <TreeItemBox flex={2}>{backChooseItem(this.props[item], tags2.get(item).toJS(), [], item).map((it, i) => <p title={it} style={{ paddingLeft: 10, lineHeight: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} key={i}>{it}</p>)}</TreeItemBox>
            {this.props.showTree.get('itemTree') ? (<TreeItemBox style={{ width: 300 }}>
              <TreeComponent noLimit={noLimit} defaultData={tags.get(item)} type={item} index={3} source="parent" />
            </TreeItemBox>) : ''}
          </TreeGroupBox>
        </TreeGroupWrapper> : '';
      })}
    </TreeShowWrapper>);
  }
  verifyCurrentTags() {
    const { questionsList, questionsIndex, commonInfo, knowledgeIdList } = this.props;
    const errList = [];
    const currentQuestion = questionsList.getIn([questionsIndex, 'questionOutputDTO']);
    const itemTags = currentQuestion.get('questionTag').toJS();
    const noLimit = currentQuestion.get('templateType') === 1;
    if (itemTags.difficulty <= 0) errList.push({ type: 'select', value: '难度未选择' });
    if (itemTags.distinction <= 0) errList.push({ type: 'select', value: '区分度未选择' });
    if (itemTags.comprehensiveDegreeId <= 0) errList.push({ type: 'select', value: '综合度未选择' });
    if (itemTags.rating <= 0) errList.push({ type: 'select', value: '题目评级未选择' });
    if (itemTags.questionId <= 0) errList.push({ type: 'questionId', value: '题目id获取失败' });
    if (itemTags.tagAdopt <= 0) errList.push({ type: 'tagAdopt', value: '未选择满足需求的标签人员' });
    if (!itemTags.tagReason.replace(/\s|\n/g, '') && itemTags.tagAdopt !== 3) errList.push({ type: 'input', value: '不满足需求的原因未填写' });
    if (!pointToUnity(commonInfo.get('subjectId'), commonInfo.get('gradeId'))) {
      if (itemTags.knowledgeIdList.length <= 0) errList.push({ type: 'knowledgeIdList', value: '知识点未选则' });
      if (!noLimit && (itemTags.knowledgeIdList.length > limitCount)) errList.push({ type: 'knowledgeIdList', value: `知识点不可以超过 ${limitCount} 个` });
      if (itemTags.examPointIdList.length <= 0) errList.push({ type: 'examPointIdList', value: '考点未选择' });
      if (!noLimit && (itemTags.examPointIdList.length > limitCount)) errList.push({ type: 'examPointIdList', value: `考点不可以超过 ${limitCount} 个` });
      itemTags.children.forEach((it, i) => {
        if (it.knowledgeIdList.length > limitCount) errList.push({ type: 'knowledgeIdList', value: `知识点不可以超过 ${limitCount} 个`, i: i + 1 });
        if (it.examPointIdList.length > limitCount) errList.push({ type: 'examPointIdList', value: `考点不可以超过 ${limitCount} 个`, i: i + 1 });
      });
    } else {
      if (knowledgeIdList.count() > 0 && (itemTags.knowledgeIdList.length <= 0 || (!noLimit && itemTags.knowledgeIdList.length > limitCount))) {
        errList.push({ type: 'knowledgeIdList', value: '请检查知识点勾选数量，必须为1-3个' });
      }
    }
    if (errList.length > 0) {
      const item = errList[0];
      const childrenErr = item.i ? `第${item.i}小题；` : '';
      const content = `${item.value}；${childrenErr}`;
      Modal.warning({
        title: '信息校验',
        content,
      });
      console.log(`错误类型：${item.type}Error；错误信息：${item.value}；${childrenErr}`);
      return false;
    }
    const newQuestionsList = questionsList.setIn([questionsIndex, 'questionOutputDTO', 'errState'], 1);
    this.props.dispatch(setQuestionsListAction(newQuestionsList));
    return true;
  }
  changeQuestionsIndex(type, index) {
    let num = index;
    const questionsIndex = this.props.questionsIndex;
    const countNum = this.props.questionsList.count();
    if (type === 'prev' && index > 0) {
      num = index - 1;
    } else if (type === 'next' && index < countNum - 1 && this.verifyCurrentTags()) {
      num = index + 1;
    } else if (type === 'itemClick') {
      if ((index - 1 > questionsIndex && this.verifyCurrentTags()) || index - 1 < questionsIndex) {
        num = index - 1;
      } else {
        return;
      }
    }
    if (num !== index) {
      const showTree = this.props.showTree;
      this.props.dispatch(setShowQuestionTreeAction(showTree.set('itemTree', false)));
      this.props.dispatch(changeQuestionsIndexAction(num));
      setTimeout(() => {
        this.props.dispatch(setShowQuestionTreeAction(showTree.set('itemTree', true)));
      }, 20);
    }
  }
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} {...item} />;
    });
  }
  render() {
    const permissions = AppLocalStorage.getPermissions() || [];
    const questionsList = this.props.questionsList;
    const errStateList = questionsList.map((item) => {
      return fromJS({ errState: (item.getIn(['questionOutputDTO', 'errState'])) || -1 });
    });
    const questionsIndex = this.props.questionsIndex;
    const currentQuestion = questionsList.getIn([questionsIndex, 'questionOutputDTO']) || fromJS({ templateType: 0, typeId: 0 });
    const children = currentQuestion.get('children') || fromJS([]);
    const selectedType = toNumber(currentQuestion.get('templateType'));
    const templateType = selectedType > 0 ? selectedType : Number(getDefaultTemplate(currentQuestion.get('typeId')));
    const seeMobile = this.state.seeMobile;
    const questionTag = currentQuestion.get('questionTag') || fromJS({});
    const showTextArea = questionTag.get('showTextArea');
    const { ModalText, visible } = this.state;
    const btnCanClick = this.props.btnCanClick;
    const paperId = this.props.currentPaperData.get('id');
    console.log('贴标签', paperId);
    return (
      <VerifyWrapper>
        <TopButtonsBox >
          <Button
            onClick={() => {
              this.props.dispatch(setBackAlertStatesAction(fromJS({
                rightClick: () => {
                  this.props.dispatch(changeBackPromptAlertShowAction(false));
                  this.props.dispatch(changeQuestionsIndexAction(0));
                  this.props.changePageState(0);
                  this.props.dispatch(setBackAlertStatesAction(fromJS({})));
                },
              })));
              this.props.dispatch(changeBackPromptAlertShowAction(true));
            }}
          >{'<'} 返回</Button>
          <PlaceHolderBox />
          {/* 并不知道以后会不会开放下载功能,所以这个button就不删了 */}
          {/* <Button
            onClick={() => {
              downloadFile({ fileUrl: this.props.paperDownloadMsg.get('fileUrl'), fileName: this.props.paperDownloadMsg.get('fileName') }, this.props.dispatch);
            }}
          >下载本试卷</Button>
          <WidthBox /> */}
          <div>
            {permissions.includes('direct_storage') ? <Button
              disabled={!btnCanClick}
              type="primary" style={{ marginRight: 20 }}
              onClick={() => {
                if (!btnCanClick) return;
                this.setState({ visible: true });
              }}
            >直接入库</Button> : ''}
            <Button
              disabled={!btnCanClick}
              type="primary" onClick={() => {
                if (!btnCanClick) return;
                this.props.dispatch(submitVerifyPaperAction());
              }}
            >提交终审</Button>
          </div>
        </TopButtonsBox>
        <ContentWrapper>
          <LeftWrapper>
            <QuestionWrapper>
              {/* {this.makeQuestionItem(currentQuestion, questionsIndex)} */}
              <FlexRowCenter style={{ height: 30 }}><PlaceHolderBox /><Switch onChange={(ckicked) => this.setState({ seeMobile: ckicked })} checked={seeMobile} checkedChildren="移动端预览" unCheckedChildren="PC预览" /></FlexRowCenter>
              <ShowQuestionItem
                subjectId={this.props.commonInfo.get('subjectId')}
                // style={{ overflowY: 'auto' }}
                questionOutputDTO={currentQuestion}
                seeMobile={seeMobile}
                showAllChildren={this.state.showAllChildren}
                limtShow={this.state.limtShow}
              />
              {children && children.count() >= this.state.limtShow ? <ShowButton><PlaceHolderBox /><Button
                type={this.state.showAllChildren ? '' : 'primary'}
                onClick={() => {
                  const showFlag = this.state.showAllChildren;
                  this.setState({ showAllChildren: !showFlag });
                }}
              >{this.state.showAllChildren ? '显示部分子题' : '显示全部子题'}</Button></ShowButton> : ''}
            </QuestionWrapper>
            <MakeErrorWrapper showTextArea={showTextArea} style={{ marginTop: 5 }}>
              <Button
                type={showTextArea ? '' : 'primary'} onClick={() => {
                  if (showTextArea) {
                    this.setQuestionTagsSelect('questionTag', 'showTextArea', false, 'questionTag', 'errReason', '');
                  } else {
                    this.tagsChange(true, 'showTextArea');
                  }
                }}
              >{showTextArea ? '放弃纠错' : '我要纠错'}</Button>
              {showTextArea ? <Textarea style={{ height: 100, resize: 'none', border: '1px solid #ddd', marginTop: 5 }} value={questionTag.get('errReason') || ''} onChange={(e) => this.tagsChange(e, 'errReason')}></Textarea> : ''}
            </MakeErrorWrapper>
            <TagsShowWrapper>
              {this.showTags(currentQuestion, tagsList)}
              {this.showTree(currentQuestion, treesList)}
            </TagsShowWrapper>
            {templateType === 1 && ((currentQuestion.get('children') || fromJS([])).count() > 0) ? <VerifyChildrenButton>
              <FlexRowCenter style={{ height: '50px', background: '#f2f2f2', padding: '0 10px' }}>
                <TextValue style={{ marginRight: 20 }}>审核子题标签</TextValue>
                <PlaceHolderBox />
                <Button
                  size="large" type="primary"
                  onClick={() => {
                    // log('changeShowChildrenVerifyAction');
                    this.props.dispatch(changeShowChildrenVerifyAction(true));
                  }}
                >审核子题</Button>
              </FlexRowCenter>
            </VerifyChildrenButton> : ''}
            <TagsUseWho />
            <ButtonsWrapper>
              <Button disabled={questionsIndex === 0} type="primary" onClick={() => this.changeQuestionsIndex('prev', questionsIndex)}>上一题</Button>
              <WidthBox width={180}></WidthBox>
              <Button disabled={questionsIndex === questionsList.count() - 1} type="primary" onClick={() => this.changeQuestionsIndex('next', questionsIndex)}>下一题</Button>
            </ButtonsWrapper>
          </LeftWrapper>
          <RightWrapper>
            <PaperQuestionList
              source={'paperTagsverify'}
              questionsList={this.props.bigQuestionMsg}
              questionSelectedIndex={questionsIndex + 1}
              questionItemIndexClick={(a, b, c, d, e) => this.changeQuestionsIndex('itemClick', e)}
              toSeePaperMsg={() => {
                // console.log(this.props.commonInfo.toJS(), 'toSeePaperMsg');
                return this.props.commonInfo.toJS();
              }}
              othersData={{
                questionResult: errStateList,
                paperTitle: this.props.paperTitle,
              }}
            />
          </RightWrapper>
        </ContentWrapper>
        {/* {this.deleteSave()} if you need, use it. */}
        {/* <Modal
          visible={this.props.modalShow}
          title="修改课程体系"
          onCancel={()=>{this.props.dispatch(setToggleModalAction())}}
          >
                  <Row  gutter={16}>

                     <Col span={12} style={{background:'#eee'}}>
                          <p>版本：xxx版</p>
                          <Tree
                              checkable
                              onExpand={this.onExpand.bind(this)}
                              expandedKeys={this.state.expandedKeys}
                              autoExpandParent={true}
                              onCheck={(checked,e)=>{this.onCheck(checked,e,this.props.checkedCourse)}}
                              defaultCheckedKeys={this.state.checkedKeys}
                              onSelect={this.onSelect.bind(this)}
                              selectedKeys={this.state.selectedKeys}
                          >
                            {this.renderTreeNodes(this.props.courseSystemList.toJS())}
                          </Tree>
                    </Col>
                  </Row>
        </Modal> */}
        {this.props.showChildrenVerify ? <VerifyChildren openShow={this.props.showChildrenVerify} bigTitle={this.props.paperTitle || ''}></VerifyChildren> : ''}
        <Modal
          title="系统提示"
          visible={visible}
          onOk={() => {
            this.setState({ visible: false });
            addQuestionCountByExamPaper(paperId);
            this.props.dispatch(justInToDepotAction());
          }}
          onCancel={() => this.setState({ visible: false })}
          okText="确认"
          cancelText="取消"
        ><p>{ModalText}</p></Modal>
      </VerifyWrapper>
    );
  }
}

EditTag.propTypes = {
  dispatch: PropTypes.func.isRequired,
  changePageState: PropTypes.func.isRequired,
  paperDownloadMsg: PropTypes.instanceOf(immutable.Map).isRequired,  // 下载所需的参数
  paperTitle: PropTypes.string.isRequired,
  bigQuestionMsg: PropTypes.instanceOf(immutable.List).isRequired,
  questionsList: PropTypes.instanceOf(immutable.List).isRequired,
  questionsIndex: PropTypes.number.isRequired,
  knowledgeIdList: PropTypes.instanceOf(immutable.List).isRequired,
  examPointIdList: PropTypes.instanceOf(immutable.List).isRequired,
  showChildrenVerify: PropTypes.bool.isRequired,
  btnCanClick: PropTypes.bool.isRequired,
  showTree: PropTypes.instanceOf(immutable.Map).isRequired,
  commonInfo: PropTypes.instanceOf(immutable.Map).isRequired,
  currentPaperData: PropTypes.instanceOf(immutable.List).isRequired,
};

const mapStateToProps = createStructuredSelector({
  SetTags: makeSelectSetTags(),
  paperTitle: makePaperTitle(),
  paperDownloadMsg: makePaperDownloadMsg(),
  examPointIdList: getExamPointList(),
  knowledgeIdList: getKnowledgeList(),
  bigQuestionMsg: makeBigQuestionMsg(),
  questionsList: makeQuestionsList(),
  questionsIndex: makeQuestionsIndex(),
  showChildrenVerify: makeShowChildrenVerify(),
  btnCanClick: makeBtnCanClick(),
  showTree: makeShowTree(),
  commonInfo: makeCommonInfo(),
  currentPaperData: makeCurrentPaperData(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    changePageState(num) {
      dispatch(changePageState(num));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTag);
