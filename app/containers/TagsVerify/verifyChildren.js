import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import immutable, { fromJS } from 'immutable';
import styled from 'styled-components';
import { FlexRow } from 'components/FlexBox';
import { createStructuredSelector } from 'reselect';
import { numberToLetter, toString, limitCount } from 'components/CommonFn';
import { PlaceHolderBox, WidthBox } from 'components/CommonFn/style';
import Modal from 'react-modal';
import { message, Button } from 'antd';
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
import TreeComponent from './TreeComponent';

import {
  getExamPointList,
  getKnowledgeList,
  makeQuestionsList,
  makeQuestionsIndex,
  maekChildrenIndex,
  makeShowTree,
} from './selectors';
import {
  changeShowChildrenVerifyAction,
  changeChildrenSelectIndexACtion,
  setShowQuestionTreeAction,
} from './actions';

const treesList = ['knowledgeIdList', 'examPointIdList'];

const TagsShowWrapper = styled.div`
  margin-top: 10px;
  border-top: 1px solid #ddd;
  padding: 10px;
  background: #fff;
`;
const TreeShowWrapper = styled.div`
  margin-top: 10px;
  padding: 1px;
  border: 1px solid #ddd;
`;
const TreeGroupWrapper = styled.div`
  margin: 10px;
`;
const TreeGroupBox = styled(FlexRow)`
  justify-content: space-around;
`;
const TreeItemBox = styled.div`
  flex: ${(props) => props.flex};
  height: 300px;
  margin: 5px 10px;
  background: #f0f0f0;
  overflow: auto;
`;

export const backChooseItem = (treeData, idList, backRes = []) => {
  const res = backRes;
  const iIdList = idList;
  if (iIdList.length <= 0) {
    return res;
  }
  treeData.forEach((item) => {
    const signIndex = idList.indexOf(item.get('id'));
    if (signIndex > -1) {
      res.push(item.get('name'));
      idList.splice(signIndex, 1);
    }
    const children = item.get('children');
    if (children && children.count() > 0) {
      res.concat(backChooseItem(children, idList, res));
    }
  });
  return res;
};

export class VerifyChildren extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.showTree = this.showTree.bind(this);
    this.changeChildrenIndex = this.changeChildrenIndex.bind(this);
  }
  changeChildrenIndex(index) {
    const showTree = this.props.showTree;
    this.props.dispatch(setShowQuestionTreeAction(showTree.set('childrenTree', false)));
    this.props.dispatch(changeChildrenSelectIndexACtion(index));
    setTimeout(() => {
      this.props.dispatch(setShowQuestionTreeAction(showTree.set('childrenTree', true)));
    }, 20);
  }
  showTree(currentQuestion = fromJS({}), attrList = []) {
    const childrenIndex = this.props.childrenIndex;
    const tags1 = currentQuestion.getIn(['questionOutputDTO', 'questionTag1', 'children', childrenIndex]) || fromJS({});
    const tags2 = currentQuestion.getIn(['questionOutputDTO', 'questionTag2', 'children', childrenIndex]) || fromJS({});
    const tags = currentQuestion.getIn(['questionOutputDTO', 'questionTag', 'children', childrenIndex]) || fromJS({});
    // console.log(childrenIndex, tags1.toJS(), tags2.toJS(), tags.toJS(), 'sdfsafasfsdfsdfs');
    return (<TreeShowWrapper>
      {attrList.map((item, index) => {
        return (this.props[item] || fromJS([])).count() > 0 ? <TreeGroupWrapper key={index}>
          <p>{`${['知识点', '考点'][index]}：`}</p>
          <TreeGroupBox>
            <TreeItemBox flex={1}>{backChooseItem(this.props[item], (tags1.get(item) || fromJS([])).toJS(), [], item).map((it, i) => <p style={{ paddingLeft: 10, lineHeight: 2 }} key={i}>{it}</p>)}</TreeItemBox>
            <TreeItemBox flex={1}>{backChooseItem(this.props[item], (tags2.get(item) || fromJS([])).toJS(), [], item).map((it, i) => <p style={{ paddingLeft: 10, lineHeight: 2 }} key={i}>{it}</p>)}</TreeItemBox>
            {this.props.showTree.get('childrenTree') ? (<TreeItemBox style={{ width: 250 }}>
              <TreeComponent defaultData={tags.get(item) || fromJS([])} type={item} index={3} childrenIndex={this.props.childrenIndex} source="children" />
            </TreeItemBox>) : ''}
          </TreeGroupBox>
        </TreeGroupWrapper> : '';
      })}
    </TreeShowWrapper>);
  }
  render() {
    const allChildrenSubmit = true; //
    const questionsIndex = this.props.questionsIndex;
    const currentQuestion = this.props.questionsList.get(questionsIndex) || fromJS({});
    const childrenIndex = this.props.childrenIndex;
    const childrenList = currentQuestion.getIn(['questionOutputDTO', 'children']) || fromJS([]);
    const childrenItem = childrenList.get(childrenIndex) || fromJS({});
    const type = childrenItem.get('typeId') || 0;
    const childrenTags = currentQuestion.getIn(['questionOutputDTO', 'questionTag', 'children']) || fromJS([]);
    // log(questionsIndex, childrenIndex, type, currentQuestion.toJS(), childrenList.toJS(), childrenItem.toJS(), 'currentQuestion type');
    return (<Modal
      isOpen={this.props.openShow || false}
      style={customStyles}
      contentLabel="Alert Modal"
    >
      <Header>
        {/* <Button onClick={() => this.props.dispatch(changeIsOpenAction(false))}>{`> 返回`}</Button> */}
        <PlaceHolderBox />
        {allChildrenSubmit ? <Button
          type="primary" onClick={() => {
            // log('submit children item');
            // console.log(childrenTags.toJS(), 'childrenTags');
            if (childrenTags.some((item) => (item.get('examPointIdList').count() > 3) || (item.get('knowledgeIdList').count() > 3))) {
              message.warn('知识点（考点）选择不可以超过3个');
              return;
            }
            this.props.dispatch(changeShowChildrenVerifyAction(false));
            this.props.dispatch(changeChildrenSelectIndexACtion(0));
          }}
        >完成</Button> : ''}
      </Header>
      <ContentBody>
        <QuestionContentLeft>
          <div style={{ overflowY: 'auto' }}>
            <MainTitleWrapper>
              <MainQuestionTitle>主题干：</MainQuestionTitle>
              <MainTitleContent><OptionContent dangerouslySetInnerHTML={{ __html: currentQuestion.getIn(['questionOutputDTO', 'title']) || '' }} /></MainTitleContent>
            </MainTitleWrapper>
            <ChildrenTitleAndContent>
              <ChildrenTitleWrapper>
                <ChildrenTitle>
                  <QuestionTitleValue>题干：</QuestionTitleValue>
                  <ContentValue dangerouslySetInnerHTML={{ __html: toString(childrenItem.get('title') || '') }}></ContentValue>
                </ChildrenTitle>
                {type === 2 ? <ChooseOptionsWrapper>
                  <QuestionTitleValue>选项：</QuestionTitleValue>
                  <DivBox style={{ paddingLeft: '2.5em' }}>
                    {(childrenItem.get('optionList') || fromJS([])).map((it, index) => {
                      return (<OptionsItem key={index}><CircleBtn type="primary" shape="circle">{numberToLetter(index)}</CircleBtn><OptionContent dangerouslySetInnerHTML={{ __html: it || '' }} /></OptionsItem>);
                    })}
                  </DivBox>
                </ChooseOptionsWrapper> : ''}
                <AnswerWrapper>
                  <QuestionTitleValue>答案：</QuestionTitleValue>
                  {type === 2 ? <DivBox style={{ paddingLeft: '2.5em' }}><OptionContent>{(childrenItem.get('answerList') || fromJS([])).join('、')}</OptionContent></DivBox> : <DivBox style={{ paddingLeft: '2.5em' }}>
                    {(childrenItem.get('answerList') || fromJS([])).map((it, index) => {
                      return (<OptionsItem key={index}><CircleBtn type="primary" shape="circle">{index + 1}</CircleBtn><OptionContent dangerouslySetInnerHTML={{ __html: it || '' }} /></OptionsItem>);
                    })}
                  </DivBox>}
                </AnswerWrapper>
                <AnalysisWrapper>
                  <QuestionTitleValue>解析：</QuestionTitleValue>
                  <DivBox style={{ paddingLeft: '2.5em' }}>
                    <OptionContent dangerouslySetInnerHTML={{ __html: childrenItem.get('analysis') || '' }}></OptionContent>
                  </DivBox>
                </AnalysisWrapper>
              </ChildrenTitleWrapper>
            </ChildrenTitleAndContent>
            <ChildrenTagsWrapper>
              <h2>子题标签</h2>
              <TagsShowWrapper>
                {this.showTree(currentQuestion, treesList)}
              </TagsShowWrapper>
            </ChildrenTagsWrapper>
            <ButtonsWrapper>
              <Button
                type="primary" onClick={() => {
                  if (childrenIndex <= 0) {
                    message.warn('已经是第一题了，没有上一题了哦！');
                    return;
                  }
                  this.changeChildrenIndex(childrenIndex - 1);
                }}
              >上一题</Button>
              <WidthBox width={100}></WidthBox>
              <Button
                type="primary" onClick={() => {
                  if (childrenIndex === childrenList.count() - 1) {
                    message.warn('已经是最后一题了，没有下一题了哦！');
                    return;
                  }
                  if (childrenTags.getIn([childrenIndex, 'knowledgeIdList']).count() > limitCount || childrenTags.getIn([childrenIndex, 'examPointIdList']).count() > limitCount) {
                    message.warn('知识点以及考点最多只能选择 3 个哦！，请检查是否多选了。');
                  }
                  this.changeChildrenIndex(childrenIndex + 1);
                }}
              >下一题</Button>
            </ButtonsWrapper>
          </div>
        </QuestionContentLeft>
        <QuestionContentRight>
          <ChildrenItemListWrapper>
            <BigTitle>{`试卷名：${this.props.bigTitle || ''}`}</BigTitle>
            <BigType>题型：复合题</BigType>
            <BigType>{`子题题型：${['选择题', '填空题', '简答题'][(childrenList.getIn([childrenIndex, 'typeId']) - 2 || 0)]}`}</BigType>
            <IconsBtnWrapper>
              {childrenTags.map((it, i) => {
                const errType = it.get('knowledgeIdList').count() > 0 && it.get('examPointIdList').count() > 0 ? 1 : -1;
                // const errType = -1;
                return (<IconsItem
                  selected={childrenIndex} index={i} errType={errType} areaIndex={i} key={i}
                  onClick={() => {
                    this.changeChildrenIndex(i);
                  }}
                >{i + 1}</IconsItem>);
              })}
            </IconsBtnWrapper>
          </ChildrenItemListWrapper>
        </QuestionContentRight>
      </ContentBody>
    </Modal>);
  }
}

VerifyChildren.propTypes = {
  dispatch: PropTypes.func.isRequired,
  openShow: PropTypes.bool.isRequired,
  // defaultData: PropTypes.instanceOf(immutable.List).isRequired,
  knowledgeIdList: PropTypes.instanceOf(immutable.List).isRequired,
  examPointIdList: PropTypes.instanceOf(immutable.List).isRequired,
  // type: PropTypes.string.isRequired,
  // index: PropTypes.number.isRequired,
  questionsList: PropTypes.instanceOf(immutable.List).isRequired,
  questionsIndex: PropTypes.number.isRequired,
  bigTitle: PropTypes.string,
  childrenIndex: PropTypes.number.isRequired,
  showTree: PropTypes.instanceOf(immutable.Map).isRequired,
};
const mapStateToProps = createStructuredSelector({
  knowledgeIdList: getKnowledgeList(),
  examPointIdList: getExamPointList(),
  questionsList: makeQuestionsList(),
  questionsIndex: makeQuestionsIndex(),
  childrenIndex: maekChildrenIndex(),
  showTree: makeShowTree(),
});
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(VerifyChildren);
