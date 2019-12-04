/* eslint-disable complexity */
/* eslint-disable no-case-declarations */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { toString, toNumber, numberToLetter, renderToKatex as iRenderToKatex, filterHtmlForm, numberToChinese, homeworkGradeList } from 'components/CommonFn';
import { PlaceHolderBox, WidthBox } from 'components/CommonFn/style';
import { RunLoading } from 'components/LoadingIndicator';
import QuestionSearchData from 'components/QuestionSearchData';
import { FlexRow, FlexColumn, FlexCenter, FlexRowCenter } from 'components/FlexBox';
import immutable, { fromJS } from 'immutable';
import { ratingList } from 'utils/zmConfig';
// import styled from 'styled-components';
import Modal from 'react-modal';
import { Select, message, Pagination, InputNumber, Button, Icon } from 'antd';
const finishImg = window._baseUrl.imgCdn + 'd4dccd7e-94ab-4b38-9b51-b4303a991306.png';
const emptyImg = window._baseUrl.imgCdn + '2cfcc00d-8360-42c7-b371-4253fd4735cb.png';
const loadImg = window._baseUrl.imgCdn + '02f36e7d-35d2-4a79-a407-847ed60a6923.gif';
const viewresolutionimg = window._baseUrl.imgCdn + 'a0709621-feda-4cc8-a94c-57f84427408a.png';
const viewresolutionimghover = window._baseUrl.imgCdn + '2c73257b-12c9-4776-bffe-235d6c99b380.png';
const deleteimg = window._baseUrl.imgCdn + 'dbd0d230-3372-40e2-991b-d00379bbbfd7.png';
const deleteimghover = window._baseUrl.imgCdn + 'b878b0a1-b767-414b-a0a1-f5731791e729.png';
const moveimg = window._baseUrl.imgCdn + '814b67ab-96e8-4307-9508-0ea558bec776.png';
const moveimghover = window._baseUrl.imgCdn + 'a77e0f68-95f5-4981-87ba-c78334682184.png';
const downimg = window._baseUrl.imgCdn + '3cd833e5-18c7-41eb-84f5-b2b780d92e1d.png';
const downimghover = window._baseUrl.imgCdn + 'bd44292e-8147-4888-9274-d02c1be8b76b.png';
import 'katex/dist/katex.min.css';
import HomeworkTree from './TreeRender';
import AIHomework from './AIHomework';
import { homeworkColorConfig } from './AIHomework/AIHomeworkStyle';
import ErrorCorrect from 'components/ErrorCorrect';
import sourceModule from 'components/ErrorCorrect/sourceModule';

import {
  customStyles,
  CreateHeader,
  HeaderTitle,
  CloseBox,
  ConentWrapper,
  StepOneLeftWrapper,
  StepOneRightWrapper,
  TreeWrapper,
  SearchQesWrapper,
  ControlWrapper,
  FilterQuestionNumber,
  SeeAnalysisWrapper,
  ClickBox,
  SeeAnalysisValue,
  AddAllQuestionWrappper,
  EditorHomeworkHeader,
  TopButtons,
  EditorHomeworkValue,
  EditorHomeworkContent,
  FinishHwBox,
  QuestionContentWrapper,
  QuestionListWrapper,
  PaginationWrapper,
  HomeworkInforContent,
  QuestionInfoWrapper,
  QuestionsCount,
  QuestionContent,
  QuestionOptions,
  OptionsWrapper,
  OptionsOrder,
  Options,
  AnalysisWrapper,
  AnalysisItem,
  AnswerTitle,
  AnswerConten,
  ControlButtons,
  ChildreWrapper,
  CutLine,
  HomeworkSkepMsgBox,
  TitleBox,
  SkepContent,
  HeadColumn,
  HeadColumnTwoLight,
  HeadColumnLight,
  BascketContentItem,
  ChooseGroup,
  ChooseGroupHeader,
  ChooseGroupHeaderNumTip,
  ChooseGroupHeaderToolWrap,
  ImgWrap,
  Img,
  OperDiv,
  OneQuestionWrap,
  HomeworkWrapperTitleItem,
  FilterQuestionOrder,
  StepOneSession,
  SkepTextWrapper,
  SkepTextValue,
  SkepQuestionCountValue,
  IconLongArrowLeft,
  SkepMsgBoxWrapper,
  SkepControlWrapper,
  SkepControlItem,
  IconArrow,
} from './createHomeWorkStyle';
import { SelectColumn } from './indexStyle';
import { makeSerachParams } from './selectors';
import {
  PromptText,
  SplitSpan,
} from './AIHomework/AIHomeworkEdit/AIHomeworkEditStyle';
import { backPathArr, pathFinish, verifyStandHomeworkParams } from './common';

const { mainColorBlue, promptColorGray } = homeworkColorConfig;
// const Step = Steps.Step;
const Option = Select.Option;
const renderToKatex = (str) => {
  return iRenderToKatex(str).replace(/^(<p[^>]*>(<br\/>)?<\/p>){1,3}/, '').replace(/(<p[^>]*>(<br\/>)?<\/p>){1,3}$/, '').replace(/^(<br\s?\/>){1,3}/, '').replace(/(<br\s?\/>){1,3}$/, '');
};
const getQuestionType = (typeList, typeId) => {
  return (typeList.find((item) => item.get('id') === typeId) || fromJS({ id: -1, name: '未知题型' })).get('name');
};
const backChildren = (dataList, id, level) => {
  if (dataList.count() <= 0) {
    return fromJS([{ id: -1, name: '该列表为空', level, children: null }]);
  }
  let res = (dataList.find((item) => item.get('id') === id) || dataList.first()).get('children');
  if (!res || res.count() <= 0) {
    res = fromJS([{ id: -1, name: '该列表为空', level, children: null }]);
  }
  return res;
};

export class CreateHomeWork extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.makeHomeworkStep = this.makeHomeworkStep.bind(this);
    this.selectSearchQuestionParams = this.selectSearchQuestionParams.bind(this);
    this.changeCreateHomeworkStepParams = this.changeCreateHomeworkStepParams.bind(this);
    this.makeEditorChooseQuestion = this.makeEditorChooseQuestion.bind(this);
    this.makeChoosePreViewQuestion = this.makeChoosePreViewQuestion.bind(this);
    this.setHomeworkSkep = this.setHomeworkSkep.bind(this);
    this.setHomeworkSkepForChild = this.setHomeworkSkepForChild.bind(this);
    this.changeHomeworkType = this.changeHomeworkType.bind(this);
    this.makeHeaderforAIHw = this.makeHeaderforAIHw.bind(this);
    this.makeHeaderforStandHw = this.makeHeaderforStandHw.bind(this);
    this.changeSort = this.changeSort.bind(this);
    this.state = {
      showSkepMsgBox: false,
    };
  }
  componentDidMount() {
    // this.props.getKnowledgeList();
  }
  setHomeworkSkep(items, type, value, flag) {
    const { createHomeworkStepParams } = this.props;
    const homeworkSkep = createHomeworkStepParams.get('homeworkSkep') || fromJS([]);
    let newHomeworkSkep = homeworkSkep;
    if (type === 'delete') {
      items.forEach((item) => {
        const itemIndex = newHomeworkSkep.indexOf(item);
        newHomeworkSkep = newHomeworkSkep.delete(itemIndex);
      });
      if (newHomeworkSkep.count() <= 0) {
        message.warn('作业中至少得有一道题目，若要清空，请至选题阶段删除。');
        return;
      }
    } else if (type === 'up') {
      items.forEach((item) => {
        const itemIndex = newHomeworkSkep.indexOf(item);
        const preIndex = newHomeworkSkep.indexOf(value);
        newHomeworkSkep = newHomeworkSkep.splice(itemIndex, 1).splice(preIndex, 0, item);
      });
    } else if (type === 'down') {
      items.forEach((item) => {
        const itemIndex = newHomeworkSkep.indexOf(item);
        const preIndex = newHomeworkSkep.indexOf(value);
        newHomeworkSkep = newHomeworkSkep.splice(preIndex + 1, 0, item).splice(itemIndex, 1);
      });
    } else {
      items.forEach((item) => {
        let newItem = item;
        if (['showAnalysis', 'showChild'].indexOf(type) > -1) {
          newItem = item.set(type, !item.get(type));
        } else if (type === 'score') {
          if (flag === 'lotSet') {
            const itemChild = item.get('children');
            if (!itemChild || itemChild.count() <= 0) {
              newItem = item.set(type, value);
            }
          } else {
            newItem = item.set(type, value);
          }
        }
        const itemIndex = newHomeworkSkep.indexOf(item);
        newHomeworkSkep = newHomeworkSkep.set(itemIndex, newItem);
      });
    }
    this.changeCreateHomeworkStepParams(newHomeworkSkep, 'homeworkSkep');
  }
  setHomeworkSkepForChild(items, i, type, value) {
    const { createHomeworkStepParams } = this.props;
    const homeworkSkep = createHomeworkStepParams.get('homeworkSkep') || fromJS([]);
    let newHomeworkSkep = homeworkSkep;
    if (i < 0) {
      const itemIndex = newHomeworkSkep.indexOf(items);
      const itemChildren = items.get('children');
      if (itemChildren && itemChildren.count() > 0) {
        const newChildren = itemChildren.map((it) => it.set(type, value));
        let newItem = items.set('children', newChildren);
        newItem = newItem.set(type, newChildren.count() * value);
        newHomeworkSkep = newHomeworkSkep.set(itemIndex, newItem);
      }
    } else if (type === 'score') {
      const itemIndex = newHomeworkSkep.indexOf(items);
      let newItem = items.setIn(['children', i, type], value);
      const itemChildren = newItem.get('children');
      newItem = newItem.set(type, itemChildren.map((it) => it.get(type)).reduce((a, b) => a + b));
      newHomeworkSkep = newHomeworkSkep.set(itemIndex, newItem);
    }
    this.changeCreateHomeworkStepParams(newHomeworkSkep, 'homeworkSkep');
  }
  changeHomeworkType(num) {
    const { changeHomeworkType } = this.props;
    changeHomeworkType(num);
  }
  selectSearchQuestionParams(value, type, listType) {
    const { searchQuestionParams, setSearchQuestionParams, createHomeworkStepParams, prviewSelectObj } = this.props;
    const homeworkName = createHomeworkStepParams.get('homeworkName');
    let newSelect = fromJS({ id: -1, name: '请选择学段' });
    if (type === 'selectKnowledge') {  // 选择知识点
      newSelect = fromJS({ id: toNumber(value.key), name: value.label, idList: value.idList, path: value.path });
    } else if (type === 'selectPhaseSubject') {  // 选择学段
      const list = searchQuestionParams.get(listType) || fromJS([]);
      newSelect = list.find((item) => item.get('id') === toNumber(value.key));
      const newGradeList = homeworkGradeList(this.props.allGradeList, newSelect);
      setSearchQuestionParams(searchQuestionParams.set(type, newSelect).set('gradeList', newGradeList).set('selectedGrade', fromJS({ id: -1, name: '全部' })), type);
      return;
    } else if (['selectType', 'selectDiff', 'selectedition', 'selectedGrade'].includes(type)) {  // 原本的下拉框选择，已经不用
      const list = searchQuestionParams.get(listType) || fromJS([]);
      newSelect = list.find((item) => item.get('id') === toNumber(value.key || value.id));
    } else if (type === 'selectCourseSystemPath') {  // 切换课程体系
      const index = listType;
      const selectCourseSystemPath = searchQuestionParams.get('selectCourseSystemPath');
      const courseSystemList = prviewSelectObj.get('treeList') || fromJS([]);
      const id = toNumber(value.key) || -1;
      let backPath = [];
      const [path0, path1, path2] = selectCourseSystemPath.toJS();
      const classTypeList = courseSystemList;
      const courseTypeList = backChildren(classTypeList, path0, 1);
      const moduloList = backChildren(courseTypeList, path1, 2);
      const courseList = backChildren(moduloList, path2, 3);
      let newHomeworkName = homeworkName;
      let finishPath = [-1, -1, -1, -1];
      switch (index) {
        case 0:
          backPath = backPathArr((classTypeList.find((item) => item.get('id') === id).get('children') || fromJS([])).toJS());
          finishPath = pathFinish([id].concat(backPath));
          newSelect = fromJS(finishPath);
          break;
        case 1:
          backPath = backPathArr((courseTypeList.find((item) => item.get('id') === id).get('children') || fromJS([])).toJS());
          finishPath = pathFinish(selectCourseSystemPath.slice(0, 1).push(id).toJS().concat(backPath));
          newSelect = fromJS(finishPath);
          break;
        case 2:
          backPath = backPathArr((moduloList.find((item) => item.get('id') === id).get('children') || fromJS([])).toJS());
          finishPath = pathFinish(selectCourseSystemPath.slice(0, 2).push(id).toJS().concat(backPath));
          newSelect = fromJS(finishPath);
          break;
        case 3:
          backPath = backPathArr((courseList.find((item) => item.get('id') === id).get('children') || fromJS([])).toJS());
          finishPath = pathFinish(selectCourseSystemPath.slice(0, 3).push(id).toJS().concat(backPath));
          newSelect = fromJS(finishPath);
          break;
        default:
          break;
      }
      if (finishPath[3] > 0) {
        const knowledgeName = backChildren(backChildren(backChildren(classTypeList, finishPath[0]), finishPath[1]), finishPath[2]).find((it) => it.get('id') === finishPath[3]).get('name') || '';
        newHomeworkName = homeworkName.set('knowledge', knowledgeName);
      } else {
        newHomeworkName = homeworkName.set('knowledge', 'null');
      }
      this.changeCreateHomeworkStepParams(newHomeworkName, 'homeworkName');
    } else {
      newSelect = value;
    }
    setSearchQuestionParams(searchQuestionParams.set(type, newSelect), type);
  }
  changeCreateHomeworkStepParams(value1, type1, value2, type2, value3, type3) {
    const { createHomeworkStepParams, setCreateHomeworkStepParams } = this.props;
    let newParams = createHomeworkStepParams;
    if (!type2) {
      newParams = createHomeworkStepParams.set(type1, value1);
    } else if (!type3) {
      newParams = createHomeworkStepParams.set(type1, value1).set(type2, value2);
    } else {
      newParams = createHomeworkStepParams.set(type1, value1).set(type2, value2).set(type3, value3);
    }
    setCreateHomeworkStepParams(newParams);
  }
  makeEditorChooseQuestion() {
    const { createHomeworkStepParams } = this.props;
    const homeworkStep = createHomeworkStepParams.get('homeworkStep') || 1;
    const homeworkSkep = createHomeworkStepParams.get('homeworkSkep') || fromJS([]);
    const skepGroup = homeworkSkep.groupBy((value) => value.get('questionType')).entrySeq();
    return skepGroup.map(([key, value], index) => {
      const defaultAllScore = value.get('score');
      const notLotSet = homeworkSkep.filter((it) => it.get('questionType') === key).every((it) => it.get('children') && it.get('children').count() > 0);
      return (<ChooseGroup key={index}>
        <ChooseGroupHeader>
          {`${numberToChinese(index + 1)}、${key}`}
          <ChooseGroupHeaderNumTip>（共{value.count()}小题）</ChooseGroupHeaderNumTip>
          {homeworkStep === 2 ? <ChooseGroupHeaderToolWrap className={'headtool'}>
            <FlexRowCenter>
              <div style={{ minWidth: 70 }}>批量设置分数：</div>
              <InputNumber
                disabled={notLotSet} min={1} max={100} step={1} type="number" defaultValue={defaultAllScore || 3} onChange={(val) => {
                  this.setHomeworkSkep(value, 'score', val, 'lotSet');
                }}
              />
            </FlexRowCenter>
            <ImgWrap><Img
              src={viewresolutionimg} imgsrc={viewresolutionimghover} onClick={() => {
                this.setHomeworkSkep(value, 'showAnalysis');
              }} alt="查看解析" title="查看解析"
            /></ImgWrap>
            <ImgWrap><Img
              src={deleteimg} onClick={() => {
                this.setHomeworkSkep(value, 'delete');
              }} imgsrc={deleteimghover} alt="删除" title="删除"
            /></ImgWrap>
            <ImgWrap><Img
              src={moveimg} imgsrc={moveimghover} onClick={() => {
                if (index > 0) {
                  const preValue = skepGroup.get(index - 1)[1];
                  this.setHomeworkSkep(value, 'up', preValue.get(0));
                }
              }} alt="上移" title="上移"
            /></ImgWrap>
            <ImgWrap><Img
              src={downimg} imgsrc={downimghover} onClick={() => {
                if (index < skepGroup.size - 1) {
                  const nextValue = skepGroup.get(index + 1)[1];
                  this.setHomeworkSkep(value, 'down', nextValue.get(nextValue.count() - 1));
                }
              }} alt="下移" title="下移"
            /></ImgWrap>
          </ChooseGroupHeaderToolWrap> : ''}
        </ChooseGroupHeader>
        {value.map((item, ix) => {
          const hasChild = item.get('children') && item.get('children').count() > 0;
          const showAnalysis = item.get('showAnalysis');
          const showChild = item.get('showChild');
          return (<OneQuestionWrap bgTransparent key={ix}>
            <QuestionInfoWrapper bgTransparent>
              <QuestionsCount>{`${ix + 1}、`}</QuestionsCount>
              <QuestionContent dangerouslySetInnerHTML={{ __html: renderToKatex(item.get('title') || '') }} />
              <QuestionOptions>
                {item.get('optionList').filter((it) => filterHtmlForm(it)).count() > 0 ? (item.get('optionList') || fromJS([])).map((iit, ii) => (
                  <OptionsWrapper key={ii}>
                    <OptionsOrder>{`${numberToLetter(ii)}、`}</OptionsOrder>
                    <Options dangerouslySetInnerHTML={{ __html: renderToKatex(iit) }} />
                  </OptionsWrapper>
                )) : ''}
              </QuestionOptions>
              {!hasChild ? <AnalysisWrapper show={showAnalysis}>
                <AnalysisItem>
                  <AnswerTitle>解析：</AnswerTitle>
                  <AnswerConten dangerouslySetInnerHTML={{ __html: renderToKatex((item.get('analysis') || '').replace(/(【解析】<br \/>)|(【解析】)|(【分析】)/g, '')) || '' }} />
                </AnalysisItem>
                <CutLine />
                <AnalysisItem>
                  <AnswerTitle>答案：</AnswerTitle>
                  {item.get('optionList').filter((iit) => filterHtmlForm(iit)).count() > 0 ?
                    <AnswerConten>{(item.get('answerList') || fromJS([])).join('、')}</AnswerConten>
                    : <FlexColumn style={{ flex: 1 }}>
                      {(item.get('answerList') || fromJS([])).map((itt, ii) => {
                        return (<AnswerConten key={ii} className={'rightAnswer'} dangerouslySetInnerHTML={{ __html: renderToKatex((itt).replace(/(【答案】)|(【解答】)/g, '')) || '' }}></AnswerConten>);
                      })}
                    </FlexColumn>}
                </AnalysisItem>
              </AnalysisWrapper> : ''}
              {hasChild && item.get('showChild') ? <ChildreWrapper>
                {item.get('children').map((it, i) => {
                  return (<QuestionInfoWrapper bgTransparent style={{ paddingBottom: 50 }} key={i}>
                    <QuestionsCount>{`(${i + 1})、`}</QuestionsCount>
                    <QuestionContent dangerouslySetInnerHTML={{ __html: renderToKatex(it.get('title') || '') }} />
                    <QuestionOptions>
                      {it.get('typeId') === 2 ? fromJS(it.get('optionList') || []).map((iit, ii) => (
                        <OptionsWrapper key={ii}>
                          <OptionsOrder>{`${numberToLetter(ii)}、`}</OptionsOrder>
                          <Options dangerouslySetInnerHTML={{ __html: renderToKatex(iit) }} />
                        </OptionsWrapper>
                      )) : ''}
                    </QuestionOptions>
                    <AnalysisWrapper show={showAnalysis}>
                      <AnalysisItem>
                        <AnswerTitle>解析：</AnswerTitle>
                        <AnswerConten dangerouslySetInnerHTML={{ __html: renderToKatex((it.get('analysis') || '').replace(/(【解析】<br \/>)|(【解析】)|(【分析】)/g, '')) || '' }} />
                      </AnalysisItem>
                      <CutLine />
                      <AnalysisItem>
                        <AnswerTitle>答案：</AnswerTitle>
                        {it.get('optionList').filter((iit) => filterHtmlForm(iit)).count() > 0 ?
                          <AnswerConten>{(it.get('answerList') || fromJS([])).join('、')}</AnswerConten>
                          : <FlexColumn style={{ flex: 1 }}>
                            {(it.get('answerList') || fromJS([])).map((itt, ii) => {
                              return (<AnswerConten key={ii} className={'rightAnswer'} dangerouslySetInnerHTML={{ __html: renderToKatex((itt).replace(/(【答案】)|(【解答】)/g, '')) || '' }}></AnswerConten>);
                            })}
                          </FlexColumn>}
                      </AnalysisItem>
                    </AnalysisWrapper>
                    <OperDiv className={'operdiv'}>
                      <FlexRowCenter>
                        <div style={{ minWidth: 70 }}>设置分数：</div>
                        <InputNumber
                          min={1} max={100} step={1} type="number" value={it.get('score') || 3} onChange={(val) => {
                            this.setHomeworkSkepForChild(item, i, 'score', val);
                          }}
                        />
                      </FlexRowCenter>
                    </OperDiv>
                  </QuestionInfoWrapper>);
                })}
              </ChildreWrapper> : ''}
            </QuestionInfoWrapper>
            <OperDiv className={'operdiv'}>
              {hasChild ? <FlexRowCenter>
                <div style={{ minWidth: 70 }}>批量设置子题分数：</div>
                <InputNumber
                  min={1} max={100} step={1} type="number" defaultValue={3} onChange={(val) => {
                    // this.setHomeworkSkep([item], 'score', val);
                    this.setHomeworkSkepForChild(item, -1, 'score', toNumber(val));
                  }}
                />
              </FlexRowCenter> : ''}
              <FlexRowCenter>
                <div style={{ minWidth: 70 }}>{hasChild ? '本题' : '设置'}分数：</div>
                <InputNumber
                  disabled={hasChild} min={1} max={100} step={1} type="number" value={item.get('score')} onChange={(val) => {
                    this.setHomeworkSkep([item], 'score', val);
                  }}
                />
              </FlexRowCenter>
              {hasChild ? <ImgWrap
                style={{ maxWidth: 60, color: 'blue', textDecoration: 'underLine' }} onClick={() => {
                  this.setHomeworkSkep([item], 'showChild');
                }}
              >{showChild ? '收起子题' : '查看子题'}</ImgWrap> : ''}
              {!hasChild || showChild ? <ImgWrap><Img
                src={viewresolutionimg} onClick={() => {
                  this.setHomeworkSkep([item], 'showAnalysis');
                }} imgsrc={viewresolutionimghover} alt="查看解析" title="查看解析"
              /></ImgWrap> : ''}
              <ImgWrap><Img
                src={deleteimg} onClick={() => {
                  this.setHomeworkSkep([item], 'delete');
                }} imgsrc={deleteimghover} alt="删除" title="删除"
              /></ImgWrap>
              <ImgWrap><Img
                src={moveimg} onClick={() => {
                  const count = value.count();
                  if (count > 1 && ix > 0) {
                    this.setHomeworkSkep([item], 'up', value.get(ix - 1));
                  }
                }} imgsrc={moveimghover} alt="上移" title="上移"
              /></ImgWrap>
              <ImgWrap><Img
                src={downimg} onClick={() => {
                  const count = value.count();
                  if (count > 1 && ix < count - 1) {
                    this.setHomeworkSkep([item], 'up', value.get(ix + 1));
                  }
                }} imgsrc={downimghover} alt="下移" title="下移"
              /></ImgWrap>
            </OperDiv>
          </OneQuestionWrap>
          );
        })}
      </ChooseGroup>);
    });
  }
  makeChoosePreViewQuestion() {
    const { createHomeworkStepParams } = this.props;
    const homeworkStep = createHomeworkStepParams.get('homeworkStep') || 1;
    const questionDataList = createHomeworkStepParams.get('questionDataList') || fromJS([]);
    const homeworkSkep = createHomeworkStepParams.get('homeworkSkep') || fromJS([]);
    let questionsList = questionDataList;
    if (homeworkStep === 1) {
      questionsList = questionDataList;
    } else if (homeworkStep === 3) {
      questionsList = homeworkSkep;
    }
    if (!questionsList || questionsList.count() === 0) return '';
    return (<HomeworkInforContent>
      {(questionsList || fromJS([])).map((item, index) => { // eslint-disable-line
        const hasChild = item.get('children') && item.get('children').count() > 0;
        const showAnalysis = item.get('showAnalysis');
        const showChild = item.get('showChild');
        const hasThisQuestion = homeworkSkep.some((it) => it.get('id') === item.get('id'));
        return (
          <QuestionInfoWrapper bgTransparent key={index} homeworkStep={homeworkStep}>
            <QuestionsCount>{`${index + 1}、`}</QuestionsCount>
            <QuestionContent dangerouslySetInnerHTML={{ __html: renderToKatex(item.get('title') || '') }} />
            <QuestionOptions>
              {item.get('optionList').count() > 0 ? (item.get('optionList') || fromJS([])).map((value, i) => (
                <OptionsWrapper key={i}>
                  <OptionsOrder>{`${numberToLetter(i)}、`}</OptionsOrder>
                  <Options dangerouslySetInnerHTML={{ __html: renderToKatex(value) }} />
                </OptionsWrapper>
              )) : ''}
            </QuestionOptions>
            {!hasChild ? <AnalysisWrapper show={showAnalysis}>
              <AnalysisItem>
                <AnswerTitle>解析：</AnswerTitle>
                <AnswerConten dangerouslySetInnerHTML={{ __html: renderToKatex((item.get('analysis') || '').replace(/(【解析】<br \/>)|(【解析】)|(【分析】)/g, '')) || '' }} />
              </AnalysisItem>
              <CutLine />
              <AnalysisItem>
                <AnswerTitle>答案：</AnswerTitle>
                {item.get('optionList').count() > 0 ?
                  <AnswerConten>{(item.get('answerList') || fromJS([])).join('、')}</AnswerConten>
                  : <FlexColumn style={{ flex: 1 }}>
                    {(item.get('answerList') || fromJS([])).map((it, i) => {
                      return (<AnswerConten key={i} className={'rightAnswer'} dangerouslySetInnerHTML={{ __html: renderToKatex((it).replace(/(【答案】)|(【解答】)/g, '')) || '' }}></AnswerConten>);
                    })}
                  </FlexColumn>}
              </AnalysisItem>
            </AnalysisWrapper> : ''}
            {item.get('showChild') ? <ChildreWrapper>
              {item.get('children').map((it, i) => {
                return (<QuestionInfoWrapper bgTransparent key={i}>
                  <QuestionsCount>{`(${i + 1})、`}</QuestionsCount>
                  <QuestionContent dangerouslySetInnerHTML={{ __html: renderToKatex(it.get('title') || '') }} />
                  <QuestionOptions>
                    {it.get('typeId') === 2 ? fromJS(it.get('optionList') || []).map((value, ii) => (
                      <OptionsWrapper key={ii}>
                        <OptionsOrder>{`${numberToLetter(ii)}、`}</OptionsOrder>
                        <Options dangerouslySetInnerHTML={{ __html: renderToKatex(value) }} />
                      </OptionsWrapper>
                    )) : ''}
                  </QuestionOptions>
                  <AnalysisWrapper show={showAnalysis}>
                    <AnalysisItem>
                      <AnswerTitle>解析：</AnswerTitle>
                      <AnswerConten dangerouslySetInnerHTML={{ __html: renderToKatex((it.get('analysis') || '').replace(/(【解析】<br \/>)|(【解析】)|(【分析】)/g, '')) || '' }} />
                    </AnalysisItem>
                    <CutLine />
                    <AnalysisItem>
                      <AnswerTitle>答案：</AnswerTitle>
                      {it.get('optionList').filter((iit) => filterHtmlForm(iit)).count() > 0 ?
                        <AnswerConten>{(it.get('answerList') || fromJS([])).join('、')}</AnswerConten>
                        : <FlexColumn style={{ flex: 1 }}>
                          {(it.get('answerList') || fromJS([])).map((itt, ii) => {
                            return (<AnswerConten key={ii} className={'rightAnswer'} dangerouslySetInnerHTML={{ __html: renderToKatex((itt).replace(/(【答案】)|(【解答】)/g, '')) || '' }}></AnswerConten>);
                          })}
                        </FlexColumn>}
                    </AnalysisItem>
                  </AnalysisWrapper>
                </QuestionInfoWrapper>);
              })}
            </ChildreWrapper> : ''}
            <ControlButtons analysisShow={showAnalysis} hasChild={hasChild} showChild={showChild} className="buttons">
              <PromptText>
                题型：{item.get('questionType')}
                <SplitSpan />
                题类：{ratingList[item.get('rating') || 1].name}
                <SplitSpan />
                组卷次数：{item.get('quoteCount') || 0}次
              </PromptText>
              <PlaceHolderBox />
              {hasChild ? <p
                style={{ color: 'rgb(24, 144, 255)', cursor: 'pointer', margin: '0 20px' }}
                type={showChild ? 'default' : 'primary'}
                onClick={() => {
                  switch (homeworkStep) {
                    case 1: // eslint-disable-line
                      const newQuestionDataList = questionDataList.setIn([index, 'showChild'], !showChild);
                      this.changeCreateHomeworkStepParams(newQuestionDataList, 'questionDataList');
                      break;
                    case 3: // eslint-disable-line
                      const newHomeworkSkep = homeworkSkep.setIn([index, 'showChild'], !showChild);
                      this.changeCreateHomeworkStepParams(newHomeworkSkep, 'homeworkSkep');
                      break;
                    default:
                      break;
                  }
                }}
              >{showChild ? '隐藏子题' : '查看子题'}</p> : ''}
              {!hasChild || showChild ? <p
                style={{ color: 'rgb(24, 144, 255)', cursor: 'pointer', margin: '0 20px' }}
                // type={showAnalysis ? 'default' : 'primary'}
                onClick={() => {
                  setTimeout(() => {
                    let allShowAnlysis = false;
                    switch (homeworkStep) {
                      case 1: // eslint-disable-line
                        const newQuestionDataList = questionDataList.setIn([index, 'showAnalysis'], !showAnalysis);
                        this.changeCreateHomeworkStepParams(newQuestionDataList, 'questionDataList');
                        allShowAnlysis = this.props.createHomeworkStepParams.get('questionDataList').every((it) => it.get('showAnalysis'));
                        this.changeCreateHomeworkStepParams(allShowAnlysis, 'showStepOneAnalyze');
                        break;
                      case 3: // eslint-disable-line
                        const newHomeworkSkep = homeworkSkep.setIn([index, 'showAnalysis'], !showAnalysis);
                        this.changeCreateHomeworkStepParams(newHomeworkSkep, 'homeworkSkep');
                        allShowAnlysis = this.props.createHomeworkStepParams.get('homeworkSkep').every((it) => it.get('showAnalysis'));
                        this.changeCreateHomeworkStepParams(allShowAnlysis, 'showStepTwoAnalyze');
                        break;
                      default:
                        break;
                    }
                  }, 50);
                }}
              >{showAnalysis ? '隐藏解析' : '查看解析'}</p> : ''}
              <ErrorCorrect
                questionId={item.get('id')}
                sourceModule={sourceModule.homework.standHomework.id}
              />
              {homeworkStep === 1 ? <Button
                style={{ marginLeft: 10 }}
                type={hasThisQuestion ? 'default' : 'primary'}
                onClick={() => {
                  if (hasThisQuestion) {
                    const questionFilter = homeworkSkep.find((it) => it.get('id') === item.get('id'));
                    const itemIndex = homeworkSkep.indexOf(questionFilter);
                    const newHomeworkSkep = homeworkSkep.delete(itemIndex);
                    this.changeCreateHomeworkStepParams(newHomeworkSkep, 'homeworkSkep');
                  } else {
                    let newHomeworkSkep = homeworkSkep;
                    if (!newHomeworkSkep.some((it) => it.get('id') === item.get('id'))) {
                      const itemChildren = item.get('children');
                      if (itemChildren && itemChildren.count() > 0) {
                        const newIitemChildren = itemChildren.map((itt) => itt.set('score', 3));
                        const newItem = item.set('showAnalysis', false).set('showChild', true).set('score', newIitemChildren.count() * 3).set('children', newIitemChildren);
                        newHomeworkSkep = newHomeworkSkep.push(newItem);
                      } else {
                        newHomeworkSkep = homeworkSkep.push(item.set('showAnalysis', false).set('score', 3).set('showChild', false)).sortBy((value) => value.get('parentTypeId'));
                      }
                      this.changeCreateHomeworkStepParams(newHomeworkSkep, 'homeworkSkep');
                    }
                  }
                }}
              >{`${hasThisQuestion ? '移出' : '加入'}作业篮`}</Button> : ''}
            </ControlButtons>
          </QuestionInfoWrapper>
        );
      })}
    </HomeworkInforContent>);
  }
  changeSort(type, value) {
    const { changeSortWay } = this.props;
    changeSortWay(type, value);
  }
  // eslint-disable-next-line complexity
  makeHomeworkStep(step) {
    const {
      searchQuestionParams, prviewSelectObj, createHomeworkStepParams,
      saveStandHomework,
      homeworkType,
      allGradeList,
      setCreateHomeworkStepParamsItem,
      setSearchQuestionParams,
      setCreateHomeworkStepParams,
      getChangeItemDataList,
    } = this.props;
    const { showSkepMsgBox } = this.state;
    const selectPhaseSubject = searchQuestionParams.get('selectPhaseSubject') || fromJS({});
    const phaseSubjectList = searchQuestionParams.get('phaseSubjectList') || fromJS([]);
    const selectKnowledge = searchQuestionParams.get('selectKnowledge') || fromJS({});
    const knowledgeList = searchQuestionParams.get('knowledgeList') || fromJS([]);
    const editionList = searchQuestionParams.get('editionList') || fromJS([]);
    const selectedGrade = searchQuestionParams.get('selectedGrade') || fromJS({});
    const gradeList = searchQuestionParams.get('gradeList') || fromJS([]);
    const showStepOneAnalyze = createHomeworkStepParams.get('showStepOneAnalyze');
    const showStepThreeAnalyze = createHomeworkStepParams.get('showStepThreeAnalyze');
    const homeworkSkep = createHomeworkStepParams.get('homeworkSkep') || fromJS([]);
    const questionTotal = createHomeworkStepParams.get('questionTotal') || 0;
    const homeworkDiff = createHomeworkStepParams.get('homeworkDiff');
    const homeworkName = createHomeworkStepParams.get('homeworkName');
    const schoolType = createHomeworkStepParams.get('schoolType');
    const saveSubject = createHomeworkStepParams.get('saveSubject');
    const saveGrade = createHomeworkStepParams.get('saveGrade');
    const homeworkScore = homeworkSkep.map((item) => item.get('score')).reduce((a, b) => a + b) || 0;
    const updatedTimeSort = searchQuestionParams.get('updatedTime');
    const quoteCountSort = searchQuestionParams.get('quoteCount');
    let res = '';
    switch (step) {
      case 1: // eslint-disable-line
        const questionDataList = createHomeworkStepParams.get('questionDataList') || fromJS([]);
        const questionCount = questionDataList.count() || 0;
        const questionListLoadingOver = createHomeworkStepParams.get('questionListLoadingOver');
        const typeList = searchQuestionParams.get('questionTypeList') || fromJS([]);
        res = (<FlexRow style={{ flex: 1, position: 'relative' }}>
          <StepOneLeftWrapper>
            <FlexRowCenter style={{ height: 30, padding: '0 20px' }}>您正在组建作业</FlexRowCenter>
            <SelectColumn style={{ padding: '10px 20px 0', height: 40 }}>
              <Select
                labelInValue value={{ key: toString(selectPhaseSubject.get('id')) || '' }} style={{ flex: 1 }} onChange={(value) => {
                  this.selectSearchQuestionParams(value, 'selectPhaseSubject', 'phaseSubjectList');
                  // setTimeout(() => getKnowledgeList(), 20);
                }}
              >{phaseSubjectList.map((item) => <Option key={toString(item.get('id')) || ''} value={toString(item.get('id'))}>{item.get('name')}</Option>)}
              </Select>
            </SelectColumn>
            <TreeWrapper>
              {searchQuestionParams.get('knowledgeListIsLoading') ? <FlexCenter>{RunLoading()}</FlexCenter> : <div>
                {knowledgeList.count() > 0 ? <HomeworkTree
                  soucre="standHomework"
                  selectTree={selectKnowledge}
                  treeList={knowledgeList}
                  onSelect={(value) => this.selectSearchQuestionParams(value, 'selectKnowledge', 'knowledgeList')}
                ></HomeworkTree>
                  : <FlexCenter style={{ flex: 1, height: '100%', width: '100%' }}>
                    <div style={{ textAlign: 'center' }}><img role="presentation" src={emptyImg} style={{ width: 100 }} /><h5 style={{ color: '#999', textAlign: 'center' }}>没有找到相关知识点哦</h5></div>
                  </FlexCenter>}
              </div>}
            </TreeWrapper>
          </StepOneLeftWrapper>
          <StepOneRightWrapper>
            <SearchQesWrapper>
              {/* <SearchCol style={{ position: 'relative', zIndex: 999 }}>
                <PlaceHolderBox />
                <FlexRowCenter style={{ position: 'relative' }}>
                  <HomeworkSkep
                    onClick={() => {

                    }}
                  ><span>作业篮</span>
                    <HomeworkSkepMsg className="homeworkSkepMsg" relocate={homeworkSkep.count() > 0}>
                      <HomeworkSkepMsgBox>
                        <TitleBox><SkepTitleItemTwo>已选试题</SkepTitleItemTwo><SkepTitleItem>数量</SkepTitleItem><SkepTitleItem>操作</SkepTitleItem></TitleBox>
                        <SkepContent>
                          {homeworkSkep.groupBy((value) => value.get('typeId')).entrySeq().map(([key, value], index) => (<BascketContentItem key={index}>
                            <HeadColumnTwoLight>{getQuestionType(typeList, key)}</HeadColumnTwoLight>
                            <HeadColumn style={{ textAlign: 'center' }}>{value.count()}</HeadColumn>
                            <HeadColumnLight
                              onClick={() => {
                                const newHomeworkSkep = homeworkSkep.filter((item) => {
                                  return value.indexOf(item) === -1;
                                });
                                this.changeCreateHomeworkStepParams(newHomeworkSkep, 'homeworkSkep');
                              }}
                            >清除</HeadColumnLight>
                          </BascketContentItem>))}
                          {homeworkSkep.count() > 0 ? <CountBox><HeadColumnTwoLight>合计</HeadColumnTwoLight><HeadColumn style={{ textAlign: 'center' }}>{homeworkSkep.count()}</HeadColumn><HeadColumnLight></HeadColumnLight></CountBox> : ''}
                        </SkepContent>
                      </HomeworkSkepMsgBox>
                    </HomeworkSkepMsg>
                  </HomeworkSkep>
                  {homeworkSkep.count() > 0 ? <HomeworkSkep
                    onClick={() => {
                      if (homeworkSkep.count() > 0) {
                        this.changeCreateHomeworkStepParams(2, 'homeworkStep');
                      }
                    }}
                  ><span>编辑作业信息</span></HomeworkSkep> : ''}
                </FlexRowCenter>
              </SearchCol> */}
              <QuestionSearchData
                source="SchoolHomeWork"
                searchStyle={{ wrapper: { width: '100%' }, item: { height: 35 }}}
                whoseShow={['area', 'grade', 'year', 'term', 'paperType', 'examType', 'questionType', 'difficulty', 'input', 'search']}
                dataList={{ grade: gradeList.toJS().slice(1), edition: editionList.toJS().slice(1) }}
                searchDate={{
                  placeholder: '请输入关键字',
                  inputName: '关键字',
                }}
                selectType={{
                  grade: selectedGrade.toJS(),
                  year: searchQuestionParams.get('year').toJS(),
                  term: searchQuestionParams.get('term').toJS(),
                  paperType: searchQuestionParams.get('paperType').toJS(),
                  examType: searchQuestionParams.get('examType').toJS(),
                  province: searchQuestionParams.get('province').toJS(),
                  city: searchQuestionParams.get('city').toJS(),
                  county: searchQuestionParams.get('county').toJS(),
                  difficulty: searchQuestionParams.get('difficulty').toJS(),
                  questionType: searchQuestionParams.get('questionType').toJS(),
                }}
                noFetch={{ grade: true }}
                changeSelect={(value, type) => {
                  if (type === 'search') {
                    this.selectSearchQuestionParams(1, 'pageIndex');
                    // getQuestionList();
                  } else if (type === 'grade') {
                    this.selectSearchQuestionParams(value, 'selectedGrade', 'gradeList');
                  } else if (type === 'edition') {
                    this.selectSearchQuestionParams(fromJS(value), 'selectedition', 'editionList');
                  } else {
                    this.selectSearchQuestionParams(fromJS(value), type);
                  }
                }}
              ></QuestionSearchData>
              <ControlWrapper>
                <FilterQuestionOrder>排序：
                  <span>题目使用量<IconArrow onClick={() => this.changeSort('updatedTime', 'ASC')} type="arrow-up" selected={updatedTimeSort === 'ASC'} /><IconArrow onClick={() => this.changeSort('updatedTime', 'DESC')} type="arrow-down" selected={updatedTimeSort === 'DESC'} /></span>
                  <span>时间<IconArrow onClick={() => this.changeSort('quoteCount', 'ASC')} type="arrow-up" selected={quoteCountSort === 'ASC'} /><IconArrow onClick={() => this.changeSort('quoteCount', 'DESC')} type="arrow-down" selected={quoteCountSort === 'DESC'} /></span>
                </FilterQuestionOrder>
                <FilterQuestionNumber>{`共有符合条件的题目${questionTotal}个`}</FilterQuestionNumber>
                <PlaceHolderBox />
                <SeeAnalysisWrapper
                  onClick={() => {
                    const newShowAnalysis = !showStepOneAnalyze;
                    if (questionDataList.count() <= 0 || !questionListLoadingOver) return;
                    this.changeCreateHomeworkStepParams(newShowAnalysis, 'showStepOneAnalyze', questionDataList.map((item) => item.set('showAnalysis', newShowAnalysis)), 'questionDataList');
                  }}
                >
                  <ClickBox selected={showStepOneAnalyze}></ClickBox><SeeAnalysisValue>显示全部答案与解析</SeeAnalysisValue>
                </SeeAnalysisWrapper>
                <AddAllQuestionWrappper>
                  <Button
                    onClick={() => {
                      let newHomeworkSkep = fromJS([]);
                      questionDataList.forEach((item) => {
                        if (!homeworkSkep.some((it) => it.get('id') === item.get('id'))) {
                          const itemChildren = item.get('children');
                          if (itemChildren && itemChildren.count() > 0) {
                            const newIitemChildren = itemChildren.map((itt) => itt.set('score', 3));
                            const newItem = item.set('showAnalysis', false).set('showChild', true).set('score', newIitemChildren.count() * 3).set('children', newIitemChildren);
                            newHomeworkSkep = newHomeworkSkep.push(newItem);
                          } else {
                            newHomeworkSkep = newHomeworkSkep.push(item.set('showAnalysis', false).set('score', 3).set('showChild', false));
                          }
                        }
                      });
                      this.changeCreateHomeworkStepParams(homeworkSkep.concat(newHomeworkSkep).sortBy((it) => it.get('parentTypeId')), 'homeworkSkep');
                    }}
                  >选择本页全部试题</Button>
                </AddAllQuestionWrappper>
              </ControlWrapper>
            </SearchQesWrapper>
            <QuestionContentWrapper>
              {questionListLoadingOver ? <QuestionListWrapper>
                {questionCount > 0 ? this.makeChoosePreViewQuestion() : <FlexCenter style={{ flex: 1 }}>
                  <div><img role="presentation" src={emptyImg} /><h2 style={{ color: '#999', textAlign: 'center' }}>这里空空如也！</h2></div>
                </FlexCenter>}
                {questionTotal > searchQuestionParams.get('pageSize') ? <PaginationWrapper>
                  <Pagination
                    defaultCurrent={1} total={questionTotal} current={searchQuestionParams.get('pageIndex')} defaultPageSize={searchQuestionParams.get('pageSize')}
                    onChange={(page, pageSize) => {
                      this.selectSearchQuestionParams(page, 'pageIndex');
                    }}
                  /></PaginationWrapper> : ''}
              </QuestionListWrapper>
                : <FlexCenter style={{ flex: 1, width: '100%', height: '100%' }}>
                  <div><img role="presentation" src={loadImg} /></div>
                </FlexCenter>}
            </QuestionContentWrapper>
          </StepOneRightWrapper>
          <StepOneSession style={{ width: showSkepMsgBox ? 200 : 36 }}>
            <SkepTextWrapper onClick={() => this.setState({ showSkepMsgBox: !showSkepMsgBox })}>
              <div>
                <SkepTextValue>作业篮</SkepTextValue>
                <SkepQuestionCountValue>{homeworkSkep.count()}</SkepQuestionCountValue>
                <IconLongArrowLeft className={`fa ${showSkepMsgBox ? 'fa-long-arrow-right' : 'fa-long-arrow-left'}`} aria-hidden="true"></IconLongArrowLeft>
              </div>
            </SkepTextWrapper>
            <SkepMsgBoxWrapper>
              <HomeworkSkepMsgBox>
                <TitleBox>已选<span style={{ textAlign: 'center', color: mainColorBlue, display: 'inline-block', margin: '0 3px' }}>{homeworkSkep.count()}</span>题</TitleBox>
                <SkepContent>
                  {homeworkSkep.groupBy((value) => value.get('typeId')).entrySeq().map(([key, value], index) => (<BascketContentItem key={index}>
                    <HeadColumnTwoLight>{getQuestionType(typeList, key)}</HeadColumnTwoLight>
                    <HeadColumn style={{ textAlign: 'center' }}>{value.count()}</HeadColumn>
                    <HeadColumnLight
                      onClick={() => {
                        const newHomeworkSkep = homeworkSkep.filter((item) => {
                          return value.indexOf(item) === -1;
                        });
                        this.changeCreateHomeworkStepParams(newHomeworkSkep, 'homeworkSkep');
                      }}
                    >清除</HeadColumnLight>
                  </BascketContentItem>))}
                </SkepContent>
                <SkepControlWrapper>
                  <SkepControlItem style={{ color: promptColorGray }} onClick={() => (homeworkSkep.count() > 0 ? this.changeCreateHomeworkStepParams(2, 'homeworkStep') : '')}>前往编辑</SkepControlItem>
                </SkepControlWrapper>
              </HomeworkSkepMsgBox>
            </SkepMsgBoxWrapper>
          </StepOneSession>
        </FlexRow>);
        break;
      case 2:
        // const selectGrade = prviewSelectObj.get('selectGrade') || fromJS({});
        // const selectSubject = prviewSelectObj.get('selectSubject') || fromJS({});
        // const selectEdition = prviewSelectObj.get('selectEdition') || fromJS({});
        // const selectCourseSystemPath = searchQuestionParams.get('selectCourseSystemPath');
        // const homeworkDiffList = createHomeworkStepParams.get('homeworkDiffList');
        // let [path0, path1, path2, path3] = selectCourseSystemPath.toJS();
        // const courseSystemList = prviewSelectObj.get('treeList') || fromJS([]);
        // const classTypeList = courseSystemList;
        // if (classTypeList.count() > 0 && path1 === -1) path0 = classTypeList.getIn([0, 'id']);
        // const courseTypeList = backChildren(classTypeList, path0, 1);
        // if (courseTypeList.count() > 0 && path1 === -1) path1 = courseTypeList.getIn([0, 'id']);
        // const moduloList = backChildren(courseTypeList, path1, 2);
        // if (moduloList.count() > 0 && path2 === -1) path2 = moduloList.getIn([0, 'id']);
        // const courseList = backChildren(moduloList, path2, 3);
        // if (courseList.count() > 0 && path3 === -1) path3 = courseList.getIn([0, 'id']);
        res = (<FlexColumn style={{ width: '100%', height: '100%', background: '#fff' }}>
          {/* <EditorHomeworkHeader>
            <TopButtons style={{ padding: '0', height: 40 }}>
              <Button
                size="large"
                onClick={() => {
                  this.changeCreateHomeworkStepParams(1, 'homeworkStep');
                  if (isReEditHomeWork) {
                    getPhaseSubject();
                  }
                }}
              >{`< 返回选题`}</Button>
              <WidthBox width={100}></WidthBox>
              <PlaceHolderBox />
              <EditorHomeworkValue style={{ fontWeight: 600 }}>制作标准作业</EditorHomeworkValue>
              <PlaceHolderBox />
              <Button
                type="primary"
                onClick={() => {
                  const newHomeworkSkep = homeworkSkep.map((item) => item.set('showAnalysis', showStepThreeAnalyze).set('showChild', false));
                  this.changeCreateHomeworkStepParams(newHomeworkSkep, 'homeworkSkep', 3, 'homeworkStep');
                }}
              >预览</Button>
              <Button
                disabled={!(btnCanClick && homeworkSkep.count() > 0 && path3 > 0)}
                style={{ marginLeft: 20 }}
                type="primary"
                onClick={() => {
                  const knowledgeName = homeworkName.get('knowledge');
                  if (['未找到课程体系', 'null'].indexOf(knowledgeName) === -1) {
                    saveStandHomework();
                  } else {
                    message.warning('请选择课程后提交');
                  }
                }}
              >保存</Button>
            </TopButtons>
            <PaperNameWrapper>
              <MustInput><span>*</span></MustInput><TextValue style={{ minWidth: 65 }}>试卷名称：</TextValue><Input
                disabled type="text" style={{ width: 300 }} value={`${homeworkName.get('knowledge')}--${homeworkName.get('diff')}`}
              ></Input>
            </PaperNameWrapper>
            <PaperMsgWrapper>
              <MustInput><span>*</span></MustInput><TextValue>年级：</TextValue><TextValue style={{ color: '#999' }}>{selectGrade.get('name') || '年级未选择'}</TextValue>
              <WidthBox></WidthBox>
              <MustInput><span>*</span></MustInput><TextValue>学科：</TextValue><TextValue style={{ color: '#999' }}>{selectSubject.get('name') || '学科未选择'}</TextValue>
              <WidthBox></WidthBox>
              <MustInput><span>*</span></MustInput><TextValue>版本：</TextValue><TextValue style={{ color: '#999' }}>{selectEdition.get('name') || '版本未选择'}</TextValue>
              <WidthBox width={88}></WidthBox>
              <MustInput><span>*</span></MustInput><TextValue>难度：</TextValue>
              <Select
                style={{ minWidth: 120 }} labelInValue value={{ key: toString(homeworkDiff.get('id')) || 1 }} onChange={(value) => {
                  const newHomeworkName = homeworkName.set('diff', value.label);
                  this.changeCreateHomeworkStepParams(fromJS({ id: toNumber(value.key), name: value.babel }), 'homeworkDiff', newHomeworkName, 'homeworkName');
                }}
              >{homeworkDiffList.map((item) => <Option key={toString(item.get('id')) || ''} value={toString(item.get('id'))}>{item.get('name')}</Option>)}
              </Select>
            </PaperMsgWrapper>
            <PaperMsgWrapper>
              <MustInput><span>*</span></MustInput><TextValue>班型：</TextValue>
              <Select style={{ minWidth: 120 }} labelInValue value={{ key: toString(path0) || '' }} onChange={(value) => this.selectSearchQuestionParams(value, 'selectCourseSystemPath', 0)}>
                {classTypeList.map((item) => <Option key={toString(item.get('id')) || ''} value={toString(item.get('id'))}>{item.get('name')}</Option>)}
              </Select>
              <WidthBox></WidthBox>
              <MustInput><span>*</span></MustInput><TextValue>课程类型：</TextValue>
              <Select style={{ minWidth: 120 }} labelInValue value={{ key: toString(path1) || '' }} onChange={(value) => this.selectSearchQuestionParams(value, 'selectCourseSystemPath', 1)}>
                {courseTypeList.map((item) => <Option key={toString(item.get('id')) || ''} value={toString(item.get('id'))}>{item.get('name')}</Option>)}
              </Select>
              <WidthBox></WidthBox>
              <MustInput><span>*</span></MustInput><TextValue>模块：</TextValue>
              <Select style={{ minWidth: 120 }} labelInValue value={{ key: toString(path2) || '' }} onChange={(value) => this.selectSearchQuestionParams(value, 'selectCourseSystemPath', 2)}>
                {moduloList.map((item) => <Option key={toString(item.get('id')) || ''} value={toString(item.get('id'))}>{item.get('name')}</Option>)}
              </Select>
              <WidthBox></WidthBox>
              <MustInput><span>*</span></MustInput><TextValue>课程：</TextValue>
              <Select style={{ minWidth: 120 }} labelInValue value={{ key: toString(path3) || '' }} onChange={(value) => this.selectSearchQuestionParams(value, 'selectCourseSystemPath', 3)}>
                {courseList.map((item) => <Option key={toString(item.get('id')) || ''} value={toString(item.get('id'))}>{item.get('name')}</Option>)}
              </Select>
              <WidthBox></WidthBox>
            </PaperMsgWrapper>
            <ControlWrapper style={{ padding: 0 }}>
              <FilterQuestionNumber>{`本作业共 ${homeworkSkep.count()} 道题目`}{`，共计 ${homeworkScore} 分`}</FilterQuestionNumber>
              <PlaceHolderBox />
              <SeeAnalysisWrapper
                onClick={() => {
                  const newShowAnalysis = !showStepTwoAnalyze;
                  if (homeworkSkep.count() <= 0) return;
                  this.changeCreateHomeworkStepParams(newShowAnalysis, 'showStepTwoAnalyze', homeworkSkep.map((item) => item.set('showAnalysis', newShowAnalysis)), 'homeworkSkep');
                }}
              >
                <ClickBox selected={showStepTwoAnalyze}></ClickBox><SeeAnalysisValue>显示答案与解析</SeeAnalysisValue>
              </SeeAnalysisWrapper>
            </ControlWrapper>
          </EditorHomeworkHeader>
          <EditorHomeworkContent>
            {this.makeEditorChooseQuestion()}
          </EditorHomeworkContent> */}
          <AIHomework
            homeworkType={homeworkType}
            homeworkStep={step}
            searchQuestionParams={searchQuestionParams}
            AIHomeworkParams={createHomeworkStepParams
              .set('AIHWQuestionList', homeworkSkep)
              .set('homeworkName', homeworkName)
              .set('homeworkDiff', homeworkDiff)
              .set('schoolType', schoolType)
              .set('selectedItem', createHomeworkStepParams.get('selectedItem'))
              .set('saveGrade', saveGrade)
              .set('saveSubject', saveSubject)
            }
            allGradeList={allGradeList}
            setAIHWParamsItem={(type, value) => {
              if (type === 'AIHWQuestionList') {
                setCreateHomeworkStepParamsItem('homeworkSkep', value);
              } else if (type === 'homeworkDiff') {
                setCreateHomeworkStepParams(createHomeworkStepParams
                  .set(type, value)
                  .set('homeworkName', `${prviewSelectObj.getIn(['selectTree', 'name'])}--${value.get('name')}`));
              } else {
                // console.log(type, value, 'AIChangeQuestionList - ');
                setCreateHomeworkStepParamsItem(type, value);
              }
            }}
            setSearchQuestionParams={setSearchQuestionParams}
            saveAIHomework={() => {
              if (!homeworkName) {
                message.warning('请填写作业名后再发布作业！');
                return;
              } else if (homeworkSkep.count() <= 0) {
                message.error('请添加题目后再发布作业');
                return;
              }
              const homeworkSkepErrorList = verifyStandHomeworkParams(homeworkSkep);
              if (homeworkSkepErrorList.length <= 0) {
                saveStandHomework();
              } else {
                // message.error('请确保所选题目以及设置无误后再次提交');
                // 后续纠错上线请使用下面的提示
                const msg = homeworkSkepErrorList[0];
                message.warning(`第 ${msg.index + 1} 题，${msg.value}`);
              }
            }}
            getChangeItemDataList={getChangeItemDataList}
          ></AIHomework>
        </FlexColumn>);
        break;
      // step 3 和 step 4 都已经不复存在了哦，由于 step 2 就已经提交了。
      case 3:
        res = (<FlexColumn style={{ width: '100%', height: '100%', background: '#fff' }}>
          {/* <AIHomework
            homeworkType={homeworkType}
            homeworkStep={step}
            searchQuestionParams={searchQuestionParams}
            AIHomeworkParams={fromJS({}).set('AIHWQuestionList', homeworkSkep)}
            allGradeList={allGradeList}
            setAIHWParamsItem={(type, value) => {
              if (type === 'AIHWQuestionList') {
                setCreateHomeworkStepParamsItem('homeworkSkep', value);
              }
            }}
            setAIHWParams={() => ''}
            setSearchQuestionParams={() => ''}
            getQuestion4AIHW={() => ''}
            getQuestionType4AiHw={() => ''}
            saveAIHomework={() => ''}
          ></AIHomework> */}
          <EditorHomeworkHeader>
            <TopButtons style={{ padding: '0', height: 50 }}>
              <Button
                size="large"
                onClick={() => {
                  const newHomeworkSkep = homeworkSkep.map((item) => item.set('showAnalysis', showStepTwoAnalyze).set('showChild', false));
                  this.changeCreateHomeworkStepParams(2, 'homeworkStep', newHomeworkSkep, 'homeworkSkep');
                }}
              >{`< 返回编辑`}</Button>
              <PlaceHolderBox />
              <EditorHomeworkValue style={{ fontWeight: 600 }}>制作标准作业</EditorHomeworkValue>
              <PlaceHolderBox />
              <WidthBox width={100}></WidthBox>
            </TopButtons>
            {/* <h2>{`${homeworkName.get('knowledge')}--${homeworkName.get('diff')}`}</h2> */}
            <h2>{homeworkName}</h2>
            <ControlWrapper style={{ padding: 0 }}>
              <FilterQuestionNumber>{`本作业共 ${homeworkSkep.count()} 道题目`}{`，共计${homeworkScore}分`}</FilterQuestionNumber>
              <PlaceHolderBox />
              <SeeAnalysisWrapper
                onClick={() => {
                  const newAnalysis = !showStepThreeAnalyze;
                  const newHomeworkSkep = homeworkSkep.map((item) => item.set('showAnalysis', newAnalysis));
                  this.changeCreateHomeworkStepParams(newHomeworkSkep, 'homeworkSkep', newAnalysis, 'showStepThreeAnalyze');
                }}
              >
                <ClickBox selected={showStepThreeAnalyze}></ClickBox><SeeAnalysisValue>显示答案与解析</SeeAnalysisValue>
              </SeeAnalysisWrapper>
            </ControlWrapper>
          </EditorHomeworkHeader>
          <EditorHomeworkContent>
            {this.makeChoosePreViewQuestion()}
          </EditorHomeworkContent>
        </FlexColumn>);
        break;
      case 4: // eslint-disable-line
        const { initDataWhenClose, getStandhomeworkList } = this.props;
        res = (<FlexCenter style={{ flex: 1, margin: '0 20px 20px', background: '#fff' }}>
          <FinishHwBox>
            <img src={finishImg} role="presentation" />
            {/* <p style={{ fontFamily: 'Microsoft YaHei' }}>{`课后作业《${`${homeworkName.get('knowledge')}--${homeworkName.get('diff')}`}》发布成功`}</p> */}
            <p style={{ fontFamily: 'Microsoft YaHei' }}>{`课后作业《${homeworkName}》发布成功`}</p>
            <div><Button
              type="primary"
              size="large"
              style={{ marginTop: 15 }} onClick={() => {
                initDataWhenClose();
                getStandhomeworkList();
              }}
            >完成</Button></div>
          </FinishHwBox>
        </FlexCenter>);
        break;
      default:
        break;
    }
    return <ConentWrapper>{res}</ConentWrapper>;
  }
  makeHeaderforAIHw() {
    const { createHomeworkStepParams, initDataWhenClose, getStandhomeworkList, AIHomeworkParams, setAIHWParamsItem } = this.props;
    const homeworkStep = createHomeworkStepParams.get('homeworkStep') || 1;
    const AIHomeworkState = AIHomeworkParams.get('state');
    const AIHomeworkName = AIHomeworkParams.get('homeworkName') || '';
    let res = '';
    switch (AIHomeworkState) {
      case 1:
        res = (<HeaderTitle>
          {/* <HomeworkWrapperTitleItem>手动作业</HomeworkWrapperTitleItem> */}
          <HomeworkWrapperTitleItem selected>智能作业</HomeworkWrapperTitleItem>
          <PlaceHolderBox />
          <CloseBox
            onClick={() => {
              initDataWhenClose();
              if (homeworkStep === 4) getStandhomeworkList();
            }}
          >×</CloseBox>
        </HeaderTitle>);
        break;
      case 2:
        res = (<HeaderTitle>
          <HomeworkWrapperTitleItem style={{ cursor: 'pointer' }} onClick={() => setAIHWParamsItem('state', 1)}>
            <Icon style={{ fontSize: 20 }} type="left" />上一步
          </HomeworkWrapperTitleItem>
          <PlaceHolderBox />
          <HomeworkWrapperTitleItem>{AIHomeworkName}</HomeworkWrapperTitleItem>
          <PlaceHolderBox />
          <CloseBox
            onClick={() => {
              initDataWhenClose();
            }}
          >×</CloseBox>
        </HeaderTitle>);
        break;
      default:
        break;
    }
    return res;
  }
  makeHeaderforStandHw() {
    const { createHomeworkStepParams, initDataWhenClose, setCreateHomeworkStepParamsItem, getPhaseSubject } = this.props;
    const homeworkStep = createHomeworkStepParams.get('homeworkStep') || 1;
    const homeworkName = createHomeworkStepParams.get('homeworkName');
    let res = '';
    switch (homeworkStep) {
      case 2:
        res = (<HeaderTitle>
          <HomeworkWrapperTitleItem
            style={{ cursor: 'pointer' }} onClick={() => {
              setCreateHomeworkStepParamsItem('homeworkStep', 1);
              setTimeout(() => getPhaseSubject());
            }}
          >
            <Icon style={{ fontSize: 20 }} type="left" />上一步
        </HomeworkWrapperTitleItem>
          <PlaceHolderBox />
          <HomeworkWrapperTitleItem>{homeworkName}</HomeworkWrapperTitleItem>
          <PlaceHolderBox />
          <CloseBox
            onClick={() => {
              initDataWhenClose();
            }}
          >×</CloseBox>
        </HeaderTitle>);
        break;
      default:
        res = (<HeaderTitle>
          <HomeworkWrapperTitleItem selected>学堂作业</HomeworkWrapperTitleItem>
          <PlaceHolderBox />
          {/* <HomeworkWrapperTitleItem>{`${homeworkName.get('knowledge')}--${homeworkName.get('diff')}`}</HomeworkWrapperTitleItem> */}
          <PlaceHolderBox />
          <CloseBox
            onClick={() => {
              initDataWhenClose();
            }}
          >×</CloseBox>
        </HeaderTitle>);
        break;
    }
    return res;
  }
  render() {
    const {
      createHomeworkStepParams,
      setSearchQuestionParams,
      homeworkType,
      searchQuestionParams,
      AIHomeworkParams,
      setAIHWParams,
      setAIHWParamsItem,
      allGradeList,
      getQuestion4AIHW,
      getQuestionType4AiHw,
      saveAIHomework,
      getChangeItemDataList,
    } = this.props;
    const homeworkStep = createHomeworkStepParams.get('homeworkStep') || 1;
    const customHomework = homeworkType === 1;                                // 手动选题
    const AIAutoHomework = homeworkType === 2;                                // 智能作业
    // const AIHomeworkOne = AIHomeworkParams.get('state') === 1;
    // const AIHomeworkTwo = AIHomeworkParams.get('state') === 2;
    return (<Modal
      isOpen={this.props.isOpen || false}
      style={customStyles}
      contentLabel="create homework"
    >
      <CreateHeader>
        {customHomework ? this.makeHeaderforStandHw() : ''}
        {AIAutoHomework ? this.makeHeaderforAIHw() : ''}
      </CreateHeader>
      {customHomework ? this.makeHomeworkStep(homeworkStep) :
        (<FlexColumn style={{ flex: 1 }}>
          <AIHomework
            searchQuestionParams={searchQuestionParams}
            AIHomeworkParams={AIHomeworkParams}
            setAIHWParams={setAIHWParams}
            setAIHWParamsItem={(type, value) => {
              setAIHWParamsItem(type, value);
            }}
            setSearchQuestionParams={setSearchQuestionParams}
            allGradeList={allGradeList}
            getQuestion4AIHW={getQuestion4AIHW}
            getQuestionType4AiHw={getQuestionType4AiHw}
            saveAIHomework={() => {
              const homeworkName = AIHomeworkParams.get('homeworkName');
              const AIHWQuestionList = AIHomeworkParams.get('AIHWQuestionList');
              if (!homeworkName) {
                message.warning('请填写作业名后再发布作业！');
                return;
              } else if (AIHWQuestionList.count() <= 0) {
                message.error('请添加题目后再发布作业');
                return;
              }
              saveAIHomework();
            }}
            homeworkType={homeworkType}
            getChangeItemDataList={getChangeItemDataList}
          ></AIHomework>
        </FlexColumn>)}
    </Modal>);
  }
}

CreateHomeWork.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  searchQuestionParams: PropTypes.instanceOf(immutable.Map).isRequired,
  setSearchQuestionParams: PropTypes.func.isRequired,
  prviewSelectObj: PropTypes.instanceOf(immutable.Map).isRequired,
  createHomeworkStepParams: PropTypes.instanceOf(immutable.Map).isRequired,
  setCreateHomeworkStepParams: PropTypes.func.isRequired,
  getQuestionList: PropTypes.func.isRequired,
  saveStandHomework: PropTypes.func.isRequired,
  initDataWhenClose: PropTypes.func.isRequired,
  btnCanClick: PropTypes.bool.isRequired,
  getStandhomeworkList: PropTypes.func.isRequired,
  getKnowledgeList: PropTypes.func.isRequired,
  allGradeList: PropTypes.instanceOf(immutable.List).isRequired,
  getPhaseSubject: PropTypes.func.isRequired,
  isReEditHomeWork: PropTypes.bool.isRequired,
  homeworkType: PropTypes.number.isRequired,
  changeHomeworkType: PropTypes.func.isRequired,
  AIHomeworkParams: PropTypes.instanceOf(immutable.Map).isRequired,
  setAIHWParams: PropTypes.func.isRequired,
  setAIHWParamsItem: PropTypes.func.isRequired,
  getQuestion4AIHW: PropTypes.func.isRequired,
  getQuestionType4AiHw: PropTypes.func.isRequired,
  saveAIHomework: PropTypes.func.isRequired,
  changeSortWay: PropTypes.func.isRequired,
  setCreateHomeworkStepParamsItem: PropTypes.func,
  getChangeItemDataList: PropTypes.func,
};
const mapStateToProps = createStructuredSelector({
  serachParams: makeSerachParams(),
});
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateHomeWork);
