import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import immutable, { fromJS } from 'immutable';
import { Button } from 'antd';
import { numberToChinese, getQuestionType, numberToLetter, strToArr, backChooseItem, toNumber, toString } from 'components/CommonFn';
import { PlaceHolderBox } from 'components/CommonFn/style';
import { FlexRow, FlexRowCenter, FlexColumn, FlexCenter, FadeIn, FadeOut, DivShadow, WidthBox } from 'components/FlexBox';
import { getTemplateTypeByTypeId } from 'containers/GetAndInputPaper/enteringWrapper';
import PaperQuestionList from 'components/PaperQuestionList';
import Modal from 'react-modal';

import {
  customStyles,
  Header,
  ContentBody,
  QuestionContentLeft,
  MainTitleWrapper,
  QuestionTitleValue,
  MainQuestionTitle,
  MainTitleContent,
  ChildrenTitleAndContent,
  ChildrenTitleWrapper,
  ChildrenTitle,
  ContentValue,
  QuestionContentRight,
  ChooseOptionsWrapper,
  OptionsItem,
  OptionContent,
  AnswerWrapper,
  AnalysisWrapper,
  DivBox,
  ChildrenItemListWrapper,
  BigTitle,
  BigType,
  IconsBtnWrapper,
  ChildrenTagsWrapper,
  IconsItem,
  ButtonsWrapper,
  CircleBtn,
} from 'containers/SetTags/childrenTags';
import {
  TagsShowWrapper,
  TagsItemWrapper,
  ItemTitle,
  TextValue,
  PointItemSpan,
  ChildrenQuestionWrapper,
} from './paperStyle';
import {
  flexObj,
  bgStyle,
} from './common';
import {
  makeIndex,
} from './selectors';

export class ChildrenShow extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { currentQuestion, changeShowChildren, openShow, knowledgeList, examPointList, index, changeQuestion, bigTitle } = this.props;
    const childrenIndex = index.get('childrenIndex') || 0;
    const children = currentQuestion.getIn(['questionOutputDTO', 'children']) || fromJS([]);
    const childrenItem = children.get(childrenIndex) || fromJS({});
    const type = childrenItem.get('typeId') || 0;
    const questionTags = currentQuestion.getIn(['questionOutputDTO', 'questionTag']);
    const knowledgeIdList = strToArr(questionTags.getIn(['children', childrenIndex, 'knowledgeIds']), ',').map((it) => toNumber(it));
    const examPointIdList = strToArr(questionTags.getIn(['children', childrenIndex, 'examPointIds']), ',').map((it) => toNumber(it));
    // console.log('currentQuestion:', currentQuestion.toJS(), 'children:', children.toJS(), 'childrenIndex:', childrenIndex, 'childrenItem:', childrenItem.toJS(), 'typeId:', type, 'questionTags:', questionTags.toJS());
    // console.log(knowledgeIdList, examPointIdList, 'knowledgeIdList, examPointIdList');
    return (<Modal
      isOpen={openShow || false}
      style={customStyles}
      contentLabel="Alert Modal"
    >
      <Header>
        <PlaceHolderBox />
        <Button
          onClick={() => {
            changeShowChildren(false);
            changeQuestion(0, 'childrenIndex');
          }}
        >返回</Button>
      </Header>
      <ContentBody>
        <QuestionContentLeft>
          <ChildrenQuestionWrapper>
            <MainTitleWrapper>
              <MainQuestionTitle>主题干：</MainQuestionTitle>
              <MainTitleContent><OptionContent dangerouslySetInnerHTML={{ __html: currentQuestion.getIn(['questionOutputDTO', 'title']) || '' }} /></MainTitleContent>
            </MainTitleWrapper>
            <ChildrenTitleAndContent>
              <ChildrenTitleWrapper>
                <ChildrenTitle>
                  <QuestionTitleValue>题干：</QuestionTitleValue>
                  <ContentValue style={Object.assign({}, bgStyle, { marginLeft: 0, flex: 1 })} dangerouslySetInnerHTML={{ __html: toString(childrenItem.get('title') || '') }}></ContentValue>
                </ChildrenTitle>
                {type === 2 ? <ChooseOptionsWrapper>
                  <QuestionTitleValue>选项：</QuestionTitleValue>
                  <DivBox style={bgStyle}>
                    {(childrenItem.get('optionList') || fromJS([])).map((it, i) => {
                      return (<OptionsItem key={i}><CircleBtn type="primary" shape="circle">{numberToLetter(i)}</CircleBtn><OptionContent dangerouslySetInnerHTML={{ __html: it.replace(/\u5b8b\u4f53/g, '思源黑体 CN Normal') || '' }} /></OptionsItem>);
                    })}
                  </DivBox>
                </ChooseOptionsWrapper> : ''}
                <AnswerWrapper>
                  <QuestionTitleValue>答案：</QuestionTitleValue>
                  {type === 2 ? <DivBox style={bgStyle}><OptionContent>{(childrenItem.get('answerList') || fromJS([])).join('、')}</OptionContent></DivBox> : <DivBox style={bgStyle}>
                    {(childrenItem.get('answerList') || fromJS([])).map((it, i) => {
                      return (<OptionsItem key={i}><CircleBtn type="primary" shape="circle">{i + 1}</CircleBtn><OptionContent dangerouslySetInnerHTML={{ __html: it || '' }} /></OptionsItem>);
                    })}
                  </DivBox>}
                </AnswerWrapper>
                <AnalysisWrapper>
                  <QuestionTitleValue>解析：</QuestionTitleValue>
                  <DivBox style={bgStyle}>
                    <OptionContent dangerouslySetInnerHTML={{ __html: childrenItem.get('analysis') || '' }}></OptionContent>
                  </DivBox>
                </AnalysisWrapper>
              </ChildrenTitleWrapper>
            </ChildrenTitleAndContent>
            <ChildrenTagsWrapper>
              {knowledgeIdList.length > 0 ? <TagsItemWrapper>
                <ItemTitle>知识点：</ItemTitle><TextValue style={flexObj}>{backChooseItem(knowledgeList, knowledgeIdList, [], 'knowledgeIdList').map((it, i) => <PointItemSpan key={i}>{it}</PointItemSpan>)}</TextValue>
              </TagsItemWrapper> : ''}
              {examPointIdList.length > 0 ? <TagsItemWrapper>
                <ItemTitle>考点：</ItemTitle><TextValue style={flexObj}>{backChooseItem(examPointList, examPointIdList, [], 'examPointIdList').map((it, i) => <PointItemSpan key={i}>{it}</PointItemSpan>)}</TextValue>
              </TagsItemWrapper> : ''}
            </ChildrenTagsWrapper>
          </ChildrenQuestionWrapper>
          <ButtonsWrapper>
            {childrenIndex > 0 ? <Button type="primary" onClick={() => changeQuestion('prev', 'childrenIndex')}>上一题</Button> : <Button type="primary" disabled>上一题</Button>}
            <div style={{ width: 100 }}></div>
            {childrenIndex < children.count() - 1 ? <Button type="primary" onClick={() => changeQuestion('next', 'childrenIndex')}>下一题</Button> : <Button type="primary" disabled>下一题</Button>}
          </ButtonsWrapper>
        </QuestionContentLeft>
        <QuestionContentRight>
          <ChildrenItemListWrapper>
            <BigTitle>{`试卷名：${bigTitle || ''}`}</BigTitle>
            <BigType>题型：复合题</BigType>
            <BigType>{`子题题型：${['选择题', '填空题', '简答题'][type - 2 || 0]}`}</BigType>
            <IconsBtnWrapper>
              {questionTags.get('children').map((it, i) => {
                const errType = -1;
                return (<IconsItem
                  selected={childrenIndex} index={i} errType={errType} areaIndex={i} key={i}
                  onClick={() => changeQuestion(i, 'childrenIndex')}
                >{i + 1}</IconsItem>);
              })}
            </IconsBtnWrapper>
          </ChildrenItemListWrapper>
        </QuestionContentRight>
      </ContentBody>
    </Modal>);
  }
}

ChildrenShow.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  openShow: PropTypes.bool.isRequired,
  changeShowChildren: PropTypes.func.isRequired,
  currentQuestion: PropTypes.instanceOf(immutable.Map).isRequired,
  // dataList: PropTypes.instanceOf(immutable.List).isRequired,
  // changePaperState: PropTypes.func.isRequired,
  // paperMsg: PropTypes.instanceOf(immutable.Map),
  // typeList: PropTypes.instanceOf(immutable.List).isRequired,
  // commonInfo: PropTypes.instanceOf(immutable.Map),
  // bigMsg: PropTypes.instanceOf(immutable.List),
  knowledgeList: PropTypes.instanceOf(immutable.List),
  examPointList: PropTypes.instanceOf(immutable.List),
  index: PropTypes.instanceOf(immutable.Map),
  changeQuestion: PropTypes.func.isRequired,
  bigTitle: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  index: makeIndex(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChildrenShow);
