import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import immutable, { fromJS } from 'immutable';
import styled from 'styled-components';
import { FlexRow, FlexRowCenter, FlexColumn, FlexCenter, FadeIn } from 'components/FlexBox';
import { createStructuredSelector } from 'reselect';
import {
  toString, toNumber, numberToLetter, renderToKatex,
  getParentKeyForIdList, getParentKeyForKeyword,
  isArray, searchCount, limitCount,
} from 'components/CommonFn';
import { backOneStyle } from 'components/PaperQuestionList';
import { PlaceHolderBox, WidthBox, wangStyle, questionStyle, listStyle, breakword, questionItemCss } from 'components/CommonFn/style';
import Modal from 'react-modal';
import { Button, Select, Tree, message, Input } from 'antd';
import { questionChildrenType } from 'utils/zmConfig';
import { pointToUnity } from './verifyPointRule';
import {
  changeIsOpenAction,
  changeChildrenSelectedIndexAction,
  setChildrenTagsAction,
  setShowQuestionTreeAction,
  setInputDTOAction,
  setHighlightItemAction,
} from './actions';
import {
  makeIsOpenChildrenTags,
  makeChildrenSelectedIndex,
  getKnowledgeList,
  getExamPointList,
  makeChildrenQuestionMsg,
  makeChildrenTags,
  makeShowTree,
  makeInputDTO,
  makeChildrenTagsMemory,
  makeCommonInfo,
  makeHighlightItem,
} from './selectors';

const TreeNode = Tree.TreeNode;
export const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    width: '80%',
    minWidth: '950px',
    height: '90%',
    padding: '0 20px 10px',
    animation: `${FadeIn} .5s linear`,
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    background: '#f0f0f0',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: '72px',
    paddingLeft: '230px',
    zIndex: 9,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
};
export const Header = styled(FlexRowCenter) `
  min-height: 50px;
`;
export const ContentBody = styled(FlexRow) `
  flex: 1;
`;
export const QuestionContentLeft = styled(FlexColumn) `
  // min-height: 100%;
  flex: 3;
  padding: 10px;
  background-color: #d2d2d2;
  overflow-y: auto;
`;
export const MainTitleWrapper = styled(questionItemCss) `
  min-height: 100px;
  padding: 10px;
  background: #f2f2f2;
  ${listStyle}
  ${breakword}
`;
export const QuestionTitleValue = styled.h3`
  min-width: 43px;
`;
export const MainQuestionTitle = styled(QuestionTitleValue) `
  min-width: 60px;
`;
export const MainTitleContent = styled.div`
  margin-top: 5px;
  padding: 10px;
  border: 1px solid #ddd;
  background: #fff;
`;
export const ChildrenTitleAndContent = styled(questionItemCss) `
  margin-top: 10px;
  padding: 10px;
  background: #f2f2f2;
  ${listStyle}
  ${breakword}
`;
export const ChildrenTitleWrapper = styled(FlexColumn) ``;
export const ChildrenTitle = styled(FlexRow) `
  justify-content: flex-start;
`;
export const TextValue = styled.p``;
export const ContentValue = styled.div`
  p {
    line-height: 2;
  }
  ${breakword}
`;
export const QuestionContentRight = styled.div`
  // box-sizing: border-box;
  width: 250px;
  height: 100%;
  padding-left: 10px;
  overflow-y: auto;
`;
export const ChooseOptionsWrapper = styled.div`
  margin-top: 10px;
`;
export const OptionsItem = styled(FlexRow) `
  margin: 10px 0;
`;
export const OptionContent = styled.div`
  // border: 1px solid #ddd;
  padding: 5px;
`;
export const AnswerWrapper = styled(ChooseOptionsWrapper) ``;
export const AnalysisWrapper = styled(ChooseOptionsWrapper) ``;
export const DivBox = styled.div``;
export const ChildrenItemListWrapper = styled.div`
  padding: 10px;
  width: 100%;
  height: 100%;
  background: #fff;
`;
export const BigTitle = styled.h3`
  line-height: 30px;
`;
export const BigType = styled.h3`
  line-height: 30px;
  color: #666;
  border-bottom: 1px solid #ddd;
`;
export const IconsBtnWrapper = styled(FlexRow) `
  margin-top: 10px;
  flex-flow: wrap;
  user-select: none;
  overflow-y: auto;
`;
export const ChildrenTagsWrapper = styled.div`
  // height: 575px;
  margin-top: 20px;
  padding: 10px;
  background: #f2f2f2;
`;
export const IconsItem = styled(FlexCenter) `
  width: 30px;
  height: 30px;
  margin: ${(props) => props.areaIndex % 6 === 5 ? '4px 0 4px' : '4px 8px 4px 0'};
  cursor: pointer;
  border-radius: 6px;
  background-color: ${(props) => backOneStyle(props, ['#fff', '#fff', '#ef4c4f', '#48A534'])};
  border: ${(props) => backOneStyle(props, ['1px solid #ef4c4f', '1px solid #ccc', 'none', 'none'])};
  color: ${(props) => backOneStyle(props, ['#ef4c4f', '#ccc', '#fff', '#fff'])};
`;
export const TagsWrapper = styled.div``;
const SelectWrapper = styled(FlexRow) `
  flex-wrap: wrap;
`;
const SelectItemBox = styled(FlexRowCenter) `
  width: 33%;
  margin-top: 10px;
`;
export const TextBox = styled(FlexRowCenter) `
  justify-content: flex-end;
  min-width: 70px;
`;
const MostIcon = styled(FlexCenter) `
  min-width: 10px;
  color: red;
`;
export const KnowledgeWrapper = styled(FlexRow) `
  max-height: 500px;
  min-height: 250px;
  // margin-top: 10px;
  align-items: flex-start;
`;
export const TreeWrapper = styled.div`
  background: #fff;
`;
export const ExamPointTreeWrapper = styled(KnowledgeWrapper) ``;
export const ButtonsWrapper = styled(FlexCenter) `
  margin-top: 10px;
  min-height: 50px;
  background: #f2f2f2;
`;
export const CircleBtn = styled(Button) `
  width: 16px;
  height: 16px;
  margin: 4px 5px 0 0;
  font-size: 12px;
`;
export const SearchButton = styled(Button) `
  margin: 0 10px;
`;
export const getQuestionType = (questionTypeList, currenId) => {
  const idItemList = questionTypeList.filter((item) => item.get('id') === toNumber(currenId));
  // log(idItemList.toJS(), 'idItemList -- idItemList');
  let res = '';
  if (idItemList.count() > 0) {
    res = idItemList.get(0).get('name');
  } else {
    res = '*';
    // res = <span style={{ color: 'red' }}>题目类型丢失，请打回重新切割</span>;
  }
  // log(res, 'question type');
  return res;
};

export class ChildrenTags extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.renderTreeNode = this.renderTreeNode.bind(this);
    this.treeCheck = this.treeCheck.bind(this);
    this.changeChildrenIndex = this.changeChildrenIndex.bind(this);
    this.changeSearch = this.changeSearch.bind(this);
    this.onExpand = this.onExpand.bind(this);
    this.searchPoint = this.searchPoint.bind(this);
  }
  onExpand(expandedKeys, type) {
    // console.log('onExpand', expandedKeys);
    const { dispatch, highlightItem } = this.props;
    if (type === 'knowledge') {
      dispatch(setHighlightItemAction(highlightItem.set('childKnowledgeExpandedKeys', expandedKeys).set('childKnowledgeAutoExpandParent', false)));
    } else {
      dispatch(setHighlightItemAction(highlightItem.set('childExamPointExpandedKeys', expandedKeys).set('childExamPointAutoExpandParent', false)));
    }
  }
  changeChildrenIndex(index) {
    // const showTree = this.props.showTree;
    const { showTree, highlightItem } = this.props;
    this.props.dispatch(setShowQuestionTreeAction(showTree.set('childrenTrree', false)));
    this.props.changeChildrenSelectedIndex(index);
    setTimeout(() => {
      this.props.dispatch(setShowQuestionTreeAction(showTree.set('childrenTrree', true)));
    }, 10);
    this.props.initChildHighlightItem(highlightItem);
  }
  changeSearch(e, type, listType) {
    const { dispatch, highlightItem, inputDTO } = this.props;

    const value = e.target.value;
    dispatch(setHighlightItemAction(highlightItem.set(type === 'knowledge' ? 'childKnowledgeKeyword' : 'childExampointKeyword', value)));
  }
  searchPoint(type, listType) {
    const { dispatch, highlightItem, inputDTO } = this.props;
    const dataList = this.props[listType].toJS();
    const inputDTOJS = inputDTO.toJS();
    const knowledgeIdList = (inputDTOJS.knowledgeIdList || []);
    const examPointIdList = (inputDTOJS.examPointIdList || []);
    let expandedKeys = [];
    const value = highlightItem.get(type === 'knowledge' ? 'childKnowledgeKeyword' : 'childExampointKeyword');
    if (!value) {
      expandedKeys = getParentKeyForIdList(dataList, (type === 'knowledge' ? knowledgeIdList : examPointIdList).map((it) => toNumber(it)));
    } else {
      expandedKeys = getParentKeyForKeyword(dataList, value);
    }
    if (type === 'knowledge') {
      dispatch(setHighlightItemAction(highlightItem.set('childKnowledgeExpandedKeys', expandedKeys.map((it) => toString(it))).set('childKnowledgeAutoExpandParent', true)));
    } else {
      dispatch(setHighlightItemAction(highlightItem.set('childExamPointExpandedKeys', expandedKeys.map((it) => toString(it))).set('childExamPointAutoExpandParent', true)));
    }
  }
  treeCheck(type, keys, e) {
    // log(type, keys, e);
    const notAllLeaf = e.checkedNodes.some((item) => {
      return !item.props.isLeaf;
    });
    const checked = keys.checked;
    if (notAllLeaf) {
      message.warning('只能选择最后一级的知识点或考点，请重新选择。');
      return;
    } else if (checked.length > limitCount) {
      message.warning(`知识点或考点最多只能选择 ${limitCount} 个。`);
      return;
    }
    const childrenIndex = this.props.childrenSelectedIndex;
    const newChildrenTags = this.props.childrenTags.setIn([childrenIndex - 1, type], fromJS(checked));
    // console.log(newChildrenTags.toJS(), 'newChildrenTags');
    this.props.setTags(newChildrenTags);
  }
  renderTreeNode(data, keyword, type) {
    return data.map((item, index) => {
      const startIndex = item.name.indexOf(keyword);
      const beforeStr = item.name.substr(0, startIndex);
      const afterStr = item.name.substr(startIndex + keyword.length);
      const title = startIndex > -1 && keyword.length > 0 ? (<span style={{ backgroundColor: 'rgba(102,255,204,0.5)' }}>
        {beforeStr}
        <span style={{ color: 'red' }}>{keyword}</span>
        {afterStr}
      </span>) : <span>{item.name}</span>;
      if (isArray(item.children) && item.children.length > 0) {
        return (
          <TreeNode title={title} key={toString(item.id)} dataRef={item}>
            {this.renderTreeNode(item.children, keyword, type)}
          </TreeNode>
        );
      }
      return <TreeNode isLeaf title={title} key={toString(item.id)} />;
    });
  }
  render() {
    const { knowledgeList, examPointList, highlightItem, dispatch, changeChildrenSelectedIndex, curQuesDetail } = this.props;
    const children = this.props.childrenQuestionMsg;
    const childrenIndex = this.props.childrenSelectedIndex;
    const childrenItem = children.get(childrenIndex - 1) || fromJS({});
    const type = childrenItem.get('typeId') || 2;
    const childrenCount = children.count();
    const childrenTags = this.props.childrenTags || fromJS([]);
    const tagItem = childrenTags.get(childrenIndex - 1) || fromJS({ knowledgeIdList: [], examPointIdList: [] });
    const allChildrenSubmit = childrenTags.every((item) => {
      let res = false;
      if (pointToUnity(curQuesDetail.subjectId, curQuesDetail.gradeId)) {
        res = (item.get('knowledgeIdList').count() > 0 || knowledgeList.count() <= 0);
      } else {
        res = ((item.get('knowledgeIdList').count() > 0 || knowledgeList.count() <= 0) && (item.get('examPointIdList').count() > 0 || examPointList.count() <= 0)) && item.get('subQuestionId') > 0;
      }
      return res;
    });
    const { childKnowledgeKeyword, childKnowledgeExpandedKeys, childKnowledgeAutoExpandParent, childExampointKeyword, childExamPointExpandedKeys, childExamPointAutoExpandParent } = highlightItem.toJS();
    const knowledgeIdList = tagItem.get('knowledgeIdList').toJS().map((it) => toNumber(it));
    const exampointIdList = tagItem.get('examPointIdList').toJS().map((it) => toNumber(it));
    return (<Modal
      isOpen={this.props.isOpen || false}
      style={customStyles}
      contentLabel="Alert Modal"
    >
      <Header>
        <Button
          onClick={() => {
            const childrenTagsMemory = this.props.childrenTagsMemory;
            this.props.setTags(childrenTagsMemory);
            dispatch(changeIsOpenAction(false));
            changeChildrenSelectedIndex(1);
            this.props.initChildHighlightItem(highlightItem);
          }}
        >取消</Button>
        <PlaceHolderBox />
        {allChildrenSubmit ? <Button
          type="primary" onClick={() => {
            // log('submit children item');
            // const inputDto = this.props.inputDTO;
            // console.log(inputDto.toJS(), 'inputDto');
            // this.props.dispatch(setInputDTOAction(fromJS(newInputDto)));
            dispatch(changeIsOpenAction(false));
            changeChildrenSelectedIndex(1);
          }}
        >完成</Button> : <Button disabled>完成</Button>}
      </Header>
      <ContentBody>
        <QuestionContentLeft>
          <div style={{ overflowY: 'auto' }}>
            <MainTitleWrapper subjectId={this.props.commonInfo.get('subjectId') || 0}>
              <MainQuestionTitle>主题干：</MainQuestionTitle>
              <MainTitleContent><OptionContent dangerouslySetInnerHTML={{ __html: renderToKatex(this.props.bigTitle || '') }} /></MainTitleContent>
            </MainTitleWrapper>
            <ChildrenTitleAndContent subjectId={this.props.commonInfo.get('subjectId') || 0}>
              <ChildrenTitleWrapper>
                <ChildrenTitle>
                  <QuestionTitleValue>题干：</QuestionTitleValue>
                  <ContentValue dangerouslySetInnerHTML={{ __html: renderToKatex(toString(childrenItem.get('title') || '')) }}></ContentValue>
                </ChildrenTitle>
                {type === 2 ? <ChooseOptionsWrapper>
                  <QuestionTitleValue>选项：</QuestionTitleValue>
                  <DivBox style={{ paddingLeft: '2.5em' }}>
                    {(childrenItem.get('optionList') || fromJS([])).map((it, index) => {
                      return (<OptionsItem key={index}><CircleBtn type="primary" shape="circle">{numberToLetter(index)}</CircleBtn><OptionContent dangerouslySetInnerHTML={{ __html: renderToKatex(it || '') }} /></OptionsItem>);
                    })}
                  </DivBox>
                </ChooseOptionsWrapper> : ''}
                <AnswerWrapper>
                  <QuestionTitleValue>答案：</QuestionTitleValue>
                  {/* 选择题 与 非选择题 显示效果不一样 */}
                  {type === 2 ? <DivBox style={{ paddingLeft: '2.5em' }}><OptionContent>{(childrenItem.get('answerList') || fromJS([])).join('、')}</OptionContent></DivBox> : <DivBox style={{ paddingLeft: '2.5em' }}>
                    {(childrenItem.get('answerList') || fromJS([])).map((it, index) => {
                      return (<OptionsItem key={index}><CircleBtn type="primary" shape="circle">{index + 1}</CircleBtn><OptionContent dangerouslySetInnerHTML={{ __html: renderToKatex(it || '') }} /></OptionsItem>);
                    })}
                  </DivBox>}
                </AnswerWrapper>
                <AnalysisWrapper>
                  <QuestionTitleValue>解析：</QuestionTitleValue>
                  <DivBox style={{ paddingLeft: '2.5em' }}>
                    <OptionContent dangerouslySetInnerHTML={{ __html: renderToKatex(childrenItem.get('analysis') || '') }}></OptionContent>
                  </DivBox>
                </AnalysisWrapper>
              </ChildrenTitleWrapper>
            </ChildrenTitleAndContent>
            <ChildrenTagsWrapper>
              <h2>子题标签</h2>
              <TagsWrapper>
                {(knowledgeList || fromJS([])).count() > 0 || (examPointList || fromJS([])).count() > 0 ? <p style={{ color: 'red', margin: '5px 11%' }}>注意：知识点、考点最多只能选择 3 个且只能选择最后一级的节点内容。</p> : ''}
                {(knowledgeList || fromJS([])).count() > 0 ? <FlexRow style={{ margin: '8px 0 8px 70px' }}>
                  <Input
                    placeholder="搜索知识点" value={childKnowledgeKeyword} onChange={(e) => this.changeSearch(e, 'knowledge', 'knowledgeList')}
                    onKeyDown={(e) => (e.code === 'Enter' || e.keyCode === 13) ? this.searchPoint('knowledge', 'knowledgeList') : ''}
                  />
                  <SearchButton type="primary" ghost onClick={() => this.searchPoint('knowledge', 'knowledgeList')}>展开</SearchButton>
                </FlexRow> : ''}
                {(knowledgeList || fromJS([])).count() > 0 ? <p style={{ color: '#999', fontSize: 12, lineHeight: '16px', marginLeft: 70 }}>共搜索到 {searchCount(knowledgeList.toJS(), childKnowledgeKeyword)} 个相关知识点</p> : ''}
                {(knowledgeList || fromJS([])).count() > 0 ? <KnowledgeWrapper>
                  <TextBox>知识点：</TextBox>
                  <TreeWrapper style={{ height: 'auto', maxHeight: '500px', overflow: 'auto', border: '1px solid #ddd', flex: 1 }}>
                    <Tree
                      showLine
                      checkable
                      checkStrictly
                      expandParent={childKnowledgeAutoExpandParent}
                      expandedKeys={!childKnowledgeKeyword ? getParentKeyForIdList(knowledgeList.toJS(), (knowledgeIdList || []).map((it) => toNumber(it))).map((it) => toString(it)).concat(childKnowledgeExpandedKeys) : childKnowledgeExpandedKeys}
                      checkedKeys={knowledgeIdList.map((it) => toString(it))}
                      selectable={false}
                      onExpand={(keys) => this.onExpand(keys, 'knowledge')}
                      onCheck={(keys, e) => this.treeCheck('knowledgeIdList', keys, e)}
                    >{this.renderTreeNode((knowledgeList || fromJS([])).toJS(), childKnowledgeKeyword, 'knowledge')}</Tree>
                  </TreeWrapper>
                </KnowledgeWrapper> : ''}
                {(examPointList || fromJS([])).count() > 0 ? <FlexRow style={{ margin: '8px 0 8px 70px' }}>
                  <Input
                    placeholder="搜索考点" value={childExampointKeyword} onChange={(e) => this.changeSearch(e, 'exampoint', 'examPointList')}
                    onKeyDown={(e) => (e.code === 'Enter' || e.keyCode === 13) ? this.searchPoint('exampoint', 'examPointList') : ''}
                  />
                  <SearchButton type="primary" ghost onClick={() => this.searchPoint('exampoint', 'examPointList')}>展开</SearchButton>
                </FlexRow> : ''}
                {(examPointList || fromJS([])).count() > 0 ? <p style={{ color: '#999', fontSize: 12, lineHeight: '16px', marginLeft: 70 }}>共搜索到 {searchCount(examPointList.toJS(), childExampointKeyword)} 个相关考点</p> : ''}
                {(examPointList || fromJS([])).count() > 0 ? <ExamPointTreeWrapper>
                  <TextBox>考点：</TextBox>
                  <TreeWrapper style={{ height: 'auto', maxHeight: '500px', overflow: 'auto', border: '1px solid #ddd', flex: 1 }}>
                    <Tree
                      showLine
                      checkable
                      checkStrictly
                      expandParent={childExamPointAutoExpandParent}
                      expandedKeys={!childExampointKeyword ? getParentKeyForIdList(examPointList.toJS(), (exampointIdList || []).map((it) => toNumber(it))).map((it) => toString(it)).concat(childExamPointExpandedKeys) : childExamPointExpandedKeys}
                      checkedKeys={exampointIdList.map((it) => toString(it))}
                      selectable={false}
                      onExpand={(keys) => this.onExpand(keys, 'exampoint')}
                      onCheck={(keys, e) => this.treeCheck('examPointIdList', keys, e)}
                    >{this.renderTreeNode((examPointList || fromJS([])).toJS(), childExampointKeyword, 'exampoint')}</Tree>
                  </TreeWrapper>
                </ExamPointTreeWrapper> : ''}
              </TagsWrapper>
            </ChildrenTagsWrapper>
            <ButtonsWrapper>
              <Button
                type="primary" onClick={() => {
                  if (childrenIndex <= 1) {
                    message.warn('已经是第一题了，没有上一题了哦！');
                    return;
                  }
                  this.changeChildrenIndex(childrenIndex - 1);
                }}
              >上一题</Button>
              <WidthBox width={100}></WidthBox>
              <Button
                type="primary" onClick={() => {
                  if (childrenIndex === childrenCount) {
                    message.warn('已经是最后一题了，没有下一题了哦！');
                    return;
                  }
                  this.changeChildrenIndex(childrenIndex + 1);
                }}
              >下一题</Button>
            </ButtonsWrapper>
          </div>
        </QuestionContentLeft>
        <QuestionContentRight>
          <ChildrenItemListWrapper>
            <BigTitle>{`题目类型：${curQuesDetail.questionType}`}</BigTitle>
            <BigType>{`子题题型：${(questionChildrenType.find((item) => item.id === curQuesDetail.children[childrenIndex - 1].typeId) || { name: '未知题型' }).name}`}</BigType>
            <IconsBtnWrapper>
              {childrenTags.map((it, i) => {
                let errType = -1;
                if (this.props.examPointList.count() <= 0 || this.props.knowledgeList.count() <= 0) {
                  errType = it.get('knowledgeIdList').count() > 0 || it.get('examPointIdList').count() > 0 ? 1 : -1;
                } else {
                  errType = it.get('knowledgeIdList').count() > 0 && it.get('examPointIdList').count() > 0 ? 1 : -1;
                }
                // const errType = -1;
                return (<IconsItem
                  selected={childrenIndex} index={i + 1} errType={errType} areaIndex={i} key={i}
                  onClick={() => this.changeChildrenIndex(i + 1)}
                >{i + 1}</IconsItem>);
              })}
            </IconsBtnWrapper>
          </ChildrenItemListWrapper>
        </QuestionContentRight>
      </ContentBody>
    </Modal>);
  }
}

ChildrenTags.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  childrenSelectedIndex: PropTypes.number.isRequired,
  changeChildrenSelectedIndex: PropTypes.func.isRequired,
  knowledgeList: PropTypes.instanceOf(immutable.List).isRequired,
  examPointList: PropTypes.instanceOf(immutable.List).isRequired,
  childrenQuestionMsg: PropTypes.instanceOf(immutable.List).isRequired,
  bigTitle: PropTypes.string,
  childrenTags: PropTypes.instanceOf(immutable.List).isRequired,
  setTags: PropTypes.func.isRequired,
  showTree: PropTypes.instanceOf(immutable.Map).isRequired,
  inputDTO: PropTypes.instanceOf(immutable.Map).isRequired,
  childrenTagsMemory: PropTypes.instanceOf(immutable.List).isRequired,
  commonInfo: PropTypes.instanceOf(immutable.Map).isRequired,
  highlightItem: PropTypes.instanceOf(immutable.Map).isRequired,
  initChildHighlightItem: PropTypes.func.isRequired,
  // curQuesDetail: PropTypes.object.isRequired, //
};
const mapStateToProps = createStructuredSelector({
  isOpen: makeIsOpenChildrenTags(),
  childrenSelectedIndex: makeChildrenSelectedIndex(),
  knowledgeList: getKnowledgeList(),
  examPointList: getExamPointList(),
  childrenQuestionMsg: makeChildrenQuestionMsg(),
  childrenTags: makeChildrenTags(),
  showTree: makeShowTree(),
  inputDTO: makeInputDTO(),
  childrenTagsMemory: makeChildrenTagsMemory(),
  commonInfo: makeCommonInfo(),
  highlightItem: makeHighlightItem(),
});
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    changeChildrenSelectedIndex: (num) => dispatch(changeChildrenSelectedIndexAction(num)),
    setTags: (item) => dispatch(setChildrenTagsAction(item)),
    initChildHighlightItem: (item) => {
      dispatch(setHighlightItemAction(item
        .set('childKnowledgeKeyword', '')
        .set('childKnowledgeExpandedKeys', fromJS([]))
        .set('childKnowledgeAutoExpandParent', true)
        .set('childExampointKeyword', '')
        .set('childExamPointExpandedKeys', fromJS([]))
        .set('childExamPointAutoExpandParent', true)
      ));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChildrenTags);
