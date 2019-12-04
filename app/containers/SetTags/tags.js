/*
 *
 * SetTags
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import immutable, { fromJS } from 'immutable';
import styled from 'styled-components';
import { FlexRow, FlexRowCenter, FlexColumn, FlexCenter } from 'components/FlexBox';
import { createStructuredSelector } from 'reselect';
import { numberToChinese, toNumber, toString, limitCount, isArray, getParentKeyForKeyword, getParentKeyForIdList, searchCount } from 'components/CommonFn';
import { PlaceHolderBox, WidthBox, wangStyle, questionStyle, listStyle } from 'components/CommonFn/style';
import { getDefaultTemplate } from 'utils/templateMapper';
import { makeBtnCanClick } from 'containers/LeftNavC/selectors';
import ShowQuestionItem from 'components/ShowQuestionItem';
import PaperQuestionList from 'components/PaperQuestionList';
import { Button, Form, Select, Row, Col, Input, Tree, message, Switch } from 'antd';
import { MakeErrorWrapper } from 'containers/TagsVerify/tags';
import ChildrenTags, { getQuestionType } from './childrenTags';
// import { pointToUnity } from './verifyPointRule';
import
makeSelectSetTags,
{
  makeInputDTO,
  makeModalShow,
  makeEditionList,
  makeCourseSystem,
  makeCourseChecked,
  makeQuestionIndex,
  makeQuestionList,
  makeQuestionListOrigin,
  makePaperTitle,
  makePaperDownloadMsg,
  getExamPointList,
  getKnowledgeList,
  makeQuestionTypeList,
  makeBigMsg,
  makeIsOpenChildrenTags,
  makeChildrenTags,
  makeShowTree,
  makeCommonInfo,
  makeHighlightItem,
} from './selectors';
import {
  setInputDTOAction,
  getEditionList,
  setCourseCheckedAction,
  submitAction,
  nextQuesAction,
  initCurInputAction,
  setQuestionIndex,
  changePageState,
  submitVerify,
  changeIsOpenAction,
  setChildrenQuestionMsgAction,
  setChildrenTagsAction,
  setTagsMemoryAction,
  setHighlightItemAction,
  initHighlightItemAction,
} from './actions';


const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const Textarea = Input.TextArea;

const VerifyWrapper = styled(FlexColumn)``;
const TopButtonsBox = styled(FlexRowCenter)`
  justify-content:space-between;
  height: 50px;
  flex-shrink:0;
  background: #eee;
  padding: 0 10px;
`;
const MainContent = styled(FlexColumn)`
  padding:15px;
  width:100%;
`;
const PaperWrapper = styled(FlexRow)`
  width:100%;
  height: 100%;
`;
const PaperInfo = styled(FlexColumn)`
  width: calc(100vw - 560px);
  background:#EEEEEE;
  margin-right:10px;
`;
const PaperCatalog = styled(FlexColumn)`
  min-width: 260px;
  max-width: 260px;
  padding-left: 10px;
  background: #eee;
`;
const Detail = styled(FlexColumn)`
  font-size:14px;
  margin:15px;
  padding:10px;
  background:#FFF;
`;
const TagEditor = styled(FlexColumn)`
  position: relative;
  font-size:14px;
  margin:15px;
  padding:10px;
  background:#FFF;
`;
const CommonRow = styled(FlexRow)`
  font-size:12px;
  justify-content:flex-start;
  p {
    line-height: 2;
  }
`;
const Label = styled.span`
  font-weight:bold;
  color:#000;
`;
const InfoItem = styled.div`
  height: 30px;
  line-height: 30px;
  margin: 0 20px;
  font-family: Microsoft YaHei;
`;
const SubDetail = styled(FlexColumn)`
`;
const TextValue = styled.p`
  font-size: 14px;
  font-weight: 600;
`;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const formItemLayoutRow = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
  },
};
const QuestionContentWrapper = styled(FlexColumn)`
  flex: 1;
  ${questionStyle}
  ${listStyle}
  ${wangStyle}
  box-sizing: border-box;
  min-height: 200px;
  margin-top: 10px;
  padding: 5px;
  border: 1px solid #ddd;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.08);
  overflow-y: auto;
`;
const ShowButton = styled(FlexRowCenter)`
  height: 40px;
`;
const SearchButton = styled(Button)`
  margin: 0 10px;
`;
export const strToArr = (str, flag) => {
  let res = [];
  if (typeof str === 'string' && str.length > 0) {
    res = str.split(flag);
  }
  return res.map((it) => toNumber(it));
};

export class EditTag extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.changeSearch = this.changeSearch.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.onExpand = this.onExpand.bind(this);
    this.renderTreeNodes = this.renderTreeNodes.bind(this);
    this.searchPoint = this.searchPoint.bind(this);
    this.state = {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      showAllChildren: false,
      limtShow: 5,
      seeMobile: false,
    };
  }
  componentWillMount() {
    this.props.dispatch(getEditionList());
  }
  onCheck = (checkedKeys, e, o_checked) => {
    let n_checked = o_checked.toJS();
    this.setState({ checkedKeys });
    n_checked.checkedNodes = e.checkedNodes;
    n_checked.halfChecked = e.halfCheckedKeys;
    this.props.dispatch(setCourseCheckedAction(fromJS(n_checked)));
  }
  onSelect(selectedKeys, info) {
    this.setState({ selectedKeys });
  }
  onExpand(expandedKeys, type) {
    const { dispatch, highlightItem } = this.props;
    if (type === 'knowledge') {
      dispatch(setHighlightItemAction(highlightItem.set('knowledgeExpandedKeys', fromJS(expandedKeys)).set('knowledgeAutoExpandParent', false)));
    } else {
      dispatch(setHighlightItemAction(highlightItem.set('examPointExpandedKeys', fromJS(expandedKeys)).set('examPointAutoExpandParent', false)));
    }
  }
  changeSearch(e, type, listType) {
    const { dispatch, highlightItem } = this.props;
    const value = e.target.value;
    dispatch(setHighlightItemAction(highlightItem.set(type === 'knowledge' ? 'knowledgeKeyword' : 'exampointKeyword', value)));
  }
  searchPoint(type, listType) {
    const { dispatch, highlightItem, inputDTO } = this.props;
    const dataList = this.props[listType].toJS();
    const inputDTOJS = inputDTO.toJS();
    const knowledgeIdList = (inputDTOJS.knowledgeIdList || []);
    const examPointIdList = (inputDTOJS.examPointIdList || []);
    let expandedKeys = [];
    const value = highlightItem.get(type === 'knowledge' ? 'knowledgeKeyword' : 'exampointKeyword');
    if (!value) {
      expandedKeys = getParentKeyForIdList(dataList, (type === 'knowledge' ? knowledgeIdList : examPointIdList).map((it) => toNumber(it)));
    } else {
      expandedKeys = getParentKeyForKeyword(dataList, value);
    }
    if (type === 'knowledge') {
      dispatch(setHighlightItemAction(highlightItem.set('knowledgeExpandedKeys', expandedKeys.map((it) => toString(it))).set('knowledgeAutoExpandParent', true)));
    } else {
      dispatch(setHighlightItemAction(highlightItem.set('examPointExpandedKeys', expandedKeys.map((it) => toString(it))).set('examPointAutoExpandParent', true)));
    }
  }
  treeCheck(name, keys, e) {
    const Obj = {};
    const checked = keys.checked;
    const notAllLeaf = e.checkedNodes.some((item) => {
      return !item.props.isLeaf;
    });
    const { questionList, quesIndex } = this.props;
    // const curQues = questionList.get(quesIndex) || fromJS({});
    // console.log(curQues.toJS(), 'curQues for limit');
    const noLimit = questionList.getIn([quesIndex, 'questionOutputDTO', 'templateType']) === 1;
    if (notAllLeaf) {
      message.warning('只能选择最后一级的知识点或考点，请重新选择。');
      return;
    } else if (!noLimit && (checked.length > limitCount)) {
      message.warning(`知识点或考点最多只能选择 ${limitCount} 个。`);
      return;
    }
    Obj[name] = { value: checked };
    this.props.formChange(this.props, Obj);
  }
  renderTreeNodes(data, keyword, type) {
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
            {this.renderTreeNodes(item.children, keyword, type)}
          </TreeNode>
        );
      }
      return <TreeNode isLeaf title={title} key={toString(item.id)} />;
    });
  }
  renderQuesItem(data, templateType, typeId) {
    let frage = [];
    frage.push(<hr />);
    if (data.title) {
      frage.push(
        <FlexColumn>
          <CommonRow>
            <InfoItem>
              <Label>题干：</Label>
            </InfoItem>
          </CommonRow>
          <CommonRow>
            <div style={{ background: '#fff', width: '100%', margin: '0 30px' }} dangerouslySetInnerHTML={{ __html: data.title }}></div>
          </CommonRow>
        </FlexColumn>
      );
    }
    if (templateType === 2 || (templateType === void 0 && typeId === 2)) {
      frage.push(<FlexColumn>
        <CommonRow>
          <InfoItem>
            <Label>选项</Label>
          </InfoItem>
        </CommonRow>
        {data.optionList.map((e, i) => {
          return (<CommonRow key={i} style={{ margin: '5px 35px', lineHeight: '30px', flexShrink: 0 }}>
            <Button type="primary" style={{ marginRight: 10, minWidth: 20 }} size="small" shape="circle">{String.fromCharCode(i + 65)}</Button><div dangerouslySetInnerHTML={{ __html: e }}></div>
          </CommonRow>);
        })}
      </FlexColumn>);
    }
    if (data.answerList && data.answerList.length) {
      frage.push(
        <FlexColumn>
          <CommonRow>
            <InfoItem>
              <Label>答案</Label>
            </InfoItem>
          </CommonRow>
          {data.answerList.map((e, i) => {
            return (<CommonRow key={i} style={{ margin: '5px 35px', lineHeight: '25px', flexShrink: 0 }}>
              <Button type="primary" style={{ marginRight: 10 }} size="small" shape="circle">
                {data.optionList && data.optionList.length ? String.fromCharCode(i + 65) : i + 1}
              </Button>
              <div dangerouslySetInnerHTML={{ __html: e }}></div>
            </CommonRow>);
          })}
        </FlexColumn>
      );
    }
    if (data.analysis) {
      frage.push(
        <FlexColumn>
          <CommonRow>
            <InfoItem>
              <Label>解析：</Label>
            </InfoItem>
          </CommonRow>
          <CommonRow>
            <div style={{ background: '#fff', width: '100%', margin: '10px 30px' }} dangerouslySetInnerHTML={{ __html: data.analysis }}></div>
          </CommonRow>
        </FlexColumn>
      );
    }
    frage.push(<hr />);
    return frage;
  }
  changeTagSearch = (a, b, c) => {
    console.log(a, b, c, 'a, b, c');
  }

  // eslint-disable-next-line
  render() {
    // console.log(this.props.childrenTags.toJS(), 'childrenTags');
    const {
      questionList, quesIndex, inputDTO, paperTitle,
      examPointList, knowledgeList, highlightItem,
      bigMsg, commonInfo,
    } = this.props;
    const inputDTOJS = inputDTO.toJS();
    const examPointIdList = (inputDTOJS.examPointIdList || []).map((e, i) => {
      return toString(e);
    });
    const knowledgeIdList = (inputDTOJS.knowledgeIdList || []).map((e, i) => {
      return toString(e);
    });
    const knowledgeJS = knowledgeList.toJS();
    const examPointJS = examPointList.toJS();
    const { knowledgeKeyword, knowledgeExpandedKeys, knowledgeAutoExpandParent, exampointKeyword, examPointExpandedKeys, examPointAutoExpandParent } = highlightItem.toJS();
    const treeToRender2 = (<Tree
      checkable
      autoExpandParent={knowledgeAutoExpandParent}
      expandedKeys={!knowledgeKeyword ? getParentKeyForIdList(knowledgeJS, (knowledgeIdList || []).map((it) => toNumber(it))).map((it) => toString(it)).concat(knowledgeExpandedKeys) : knowledgeExpandedKeys}
      checkedKeys={knowledgeIdList}
      checkStrictly
      selectable={false}
      onExpand={(keys) => this.onExpand(keys, 'knowledge')}
      onCheck={(keys, e) => this.treeCheck('knowledgeIdList', keys, e)}
    >
      {this.renderTreeNodes(knowledgeJS, knowledgeKeyword, 'knowledge')}
    </Tree>);
    /*
      const treeToRender2 = (<TreeSelect
        allowClear
        multiple
        searchPlaceholder="请搜索知识点"
        notFoundContent="未找到对应数据"
        value={knowledgeIdList}
        treeDefaultExpandedKeys={knowledgeIdList}
        treeData={knowledgeJS.map((node) => {
          const children = node.children;
          return {
            value: node.name,
            label: node.name,
            key: toString(node.id),
            children,
          };
        })}
        onChange={this.changeTagSearch}
        getPopupContainer={() => this.editContentBox}
      />);
    */
    const treeToRender3 = (<Tree
      checkable
      autoExpandParent={examPointAutoExpandParent}
      expandedKeys={!exampointKeyword ? getParentKeyForIdList(examPointJS, (examPointIdList || []).map((it) => toNumber(it))).map((it) => toString(it)).concat(examPointExpandedKeys) : examPointExpandedKeys}
      checkedKeys={examPointIdList}
      checkStrictly
      selectable={false}
      onExpand={(keys) => this.onExpand(keys, 'exampoint')}
      onCheck={(keys, e) => this.treeCheck('examPointIdList', keys, e)}
    >
      {this.renderTreeNodes(examPointJS, exampointKeyword, 'exampoint')}
    </Tree>);
    const questionListJS = questionList.toJS();
    const curQues = questionListJS[quesIndex] || {};
    const curQuesDetail = curQues.questionOutputDTO || {};
    const selectedType = toNumber(curQuesDetail.templateType);
    const templateType = selectedType > 0 ? selectedType : Number(getDefaultTemplate(curQuesDetail.typeId));
    const isComplex = templateType === 1 && ((curQuesDetail.children || []).length > 0);
    const allDone = questionListJS.every((item) => item.questionOutputDTO.errState === 1);
    const allChildrenCount = (curQuesDetail.children || []).length;
    const ChildrenHadTagCout = this.props.childrenTags.filter((item) => {
      let res = false;
      if (knowledgeJS.length > 0 && examPointJS.length.length > 0) {
        res = item.get('knowledgeIdList').count() > 0 && item.get('examPointIdList').count() > 0;
      } else {
        res = item.get('knowledgeIdList').count() > 0 || item.get('examPointIdList').count() > 0;
      }
      return res;
    }).count();
    const showTextArea = inputDTO.get('showTextArea') || false;
    const errReason = inputDTO.get('errReason') || '';
    const seeMobile = this.state.seeMobile;
    return (
      <VerifyWrapper>
        <TopButtonsBox className="topButtomBox">
          <Button
            onClick={() => {
              this.props.changePageState(0);
              this.props.dispatch(initHighlightItemAction());
            }}
          >{'<'} 返回</Button>
          <PlaceHolderBox />
          <WidthBox />
          <div>
            {allDone ? (this.props.btnCanClick ? <Button type="danger" onClick={() => this.props.submitToVerify()}>提交审核</Button> : <Button disabled>提交审核</Button>) : ''}
          </div>
        </TopButtonsBox>
        <MainContent>
          <PaperWrapper>
            <PaperInfo>
              <div style={{ flex: 3, overflow: 'auto' }}>
                <Detail>
                  <CommonRow>
                    <InfoItem><Label>大题编号与名称：</Label>{numberToChinese(curQues.supSerialNumber) || '*'}、 {curQues.caption}</InfoItem>
                  </CommonRow>
                  <CommonRow>
                    <InfoItem><Label> 当前题号：</Label>{curQues.serialNumber}</InfoItem>
                    <InfoItem><Label>题型：</Label>{getQuestionType(this.props.questionTypeList, curQuesDetail.typeId)}</InfoItem>
                  </CommonRow>
                  <SubDetail>
                    <QuestionContentWrapper>
                      <FlexRowCenter style={{ height: 30 }}><PlaceHolderBox /><Switch onChange={(ckicked) => this.setState({ seeMobile: ckicked })} checked={seeMobile} checkedChildren="移动端预览" unCheckedChildren="PC预览" /></FlexRowCenter>
                      <ShowQuestionItem
                        limtShow={this.state.limtShow}
                        showAllChildren={this.state.showAllChildren}
                        subjectId={commonInfo.get('subjectId')}
                        questionOutputDTO={questionList.getIn([quesIndex, 'questionOutputDTO']) || fromJS({})}
                        seeMobile={seeMobile}
                      />
                      {(curQuesDetail.children || []).length >= this.state.limtShow ? <ShowButton><PlaceHolderBox /><Button
                        type={this.state.showAllChildren ? '' : 'primary'}
                        onClick={() => {
                          const showFlag = this.state.showAllChildren;
                          this.setState({ showAllChildren: !showFlag });
                        }}
                      >{this.state.showAllChildren ? '显示部分子题' : '显示全部子题'}</Button></ShowButton> : ''}
                    </QuestionContentWrapper>
                  </SubDetail>
                </Detail>
                <MakeErrorWrapper showTextArea={showTextArea} style={{ marginTop: 5, marginRight: 15 }}>
                  <Button
                    type={showTextArea ? '' : 'primary'} onClick={() => {
                      if (showTextArea) {
                        this.props.dispatch(setInputDTOAction(inputDTO.set('showTextArea', false).set('errReason', '')));
                      } else {
                        this.props.dispatch(setInputDTOAction(inputDTO.set('showTextArea', true)));
                      }
                    }}
                  >{showTextArea ? '放弃纠错' : '我要纠错'}</Button>
                  {showTextArea ? <Textarea style={{ height: 100, resize: 'none', border: '1px solid #ddd', marginTop: 5 }} value={errReason || ''} onChange={(e) => this.props.dispatch(setInputDTOAction(inputDTO.set('errReason', e.target.value)))}></Textarea> : ''}
                </MakeErrorWrapper>
                <TagEditor style={{ minHeight: 545 }} innerRef={x => { this.editContentBox = x }}>
                  <CommonRow>
                    <h3>题目标签</h3>
                  </CommonRow>
                  {this.props.showTree.get('itemTree') ? <TagsForm
                    {...this.props.inputDTO.toJS()}
                    {...this.props}
                    formChange={(value) => this.props.formChange(this.props, value)}
                    treeToRender2={treeToRender2}
                    knowledgeJS={knowledgeJS}
                    showTreeToRender2={knowledgeJS.length > 0}
                    treeToRender3={treeToRender3}
                    showTreeToRender3={examPointJS.length > 0}
                    examPointJS={examPointJS}
                    changeSearch={this.changeSearch}
                    searchPoint={this.searchPoint}
                    notShowPrompt={isComplex}
                  ></TagsForm> : ''}
                  {isComplex ? <FlexRowCenter style={{ height: '50px', background: '#f2f2f2', marginBottom: '10px', padding: '0 10px' }}>
                    <TextValue style={{ marginRight: 20 }}>子题标注</TextValue><span>当前已标注:{`${ChildrenHadTagCout}/${allChildrenCount}`}</span>
                    <PlaceHolderBox />
                    <Button
                      size="large" type="primary" onClick={() => {
                        const children = curQuesDetail.children || [];
                        this.props.dispatch(setChildrenQuestionMsgAction(fromJS(children)));
                        let childrenTags = [];
                        const tags = this.props.childrenTags.toJS();
                        const noTagEveryOne = tags.every((item) => {
                          let noTag = false;
                          if (!item) {
                            noTag = true;
                          } else if (!item.examPointIdList || !item.knowledgeIdList) {
                            noTag = true;
                          } else if (item.examPointIdList.length <= 0 || item.knowledgeIdList.length <= 0) {
                            noTag = true;
                          }
                          // console.log('item: ', item, item.examPointIdList, item.knowledgeIdList);
                          // console.log('noTag:', noTag);
                          return noTag;
                        });
                        if (tags.length !== children.length || noTagEveryOne) {
                          // eslint-disable-next-line
                          children.map((it, i) => {
                            const submitTag = (curQuesDetail.questionTag || { children: [] }).children || [];
                            const tagExamPaperSubQuesInputDTOList = submitTag[i] || {};
                            childrenTags.push({
                              subQuestionId: it.id,
                              knowledgeIdList: strToArr(tagExamPaperSubQuesInputDTOList.knowledgeIds, ','),
                              examPointIdList: strToArr(tagExamPaperSubQuesInputDTOList.examPointIds, ','),
                            });
                          });
                          this.props.dispatch(setChildrenTagsAction(fromJS(childrenTags)));
                        } else {
                          childrenTags = tags;
                        }
                        // console.log(tags.length, children.length, noTagEveryOne);
                        // console.log(tags, childrenTags);
                        this.props.dispatch(setTagsMemoryAction(fromJS(childrenTags)));
                        // this.props.dispatch(setChildrenTagsAction(fromJS(childrenTags)));
                        this.props.dispatch(changeIsOpenAction(true));
                      }}
                    >标注子题</Button>
                  </FlexRowCenter> : ''}
                  <FlexCenter style={{ width: '100%' }}>
                    <Button type="primary" onClick={() => this.props.preQues(this.props)} style={{ marginRight: 20 }}>上一题</Button>
                    <WidthBox width={50}></WidthBox>
                    {this.props.btnCanClick ? <Button
                      type="primary"
                      onClick={() => {
                        this.props.submit();
                        this.props.dispatch(initHighlightItemAction());
                      }}
                    >下一题</Button> : <Button disabled>下一题</Button>}
                  </FlexCenter>
                </TagEditor>
              </div>
            </PaperInfo>
            <PaperCatalog>
              <PaperQuestionList
                questionsList={bigMsg}
                source={'paperSetTags'}
                questionSelectedIndex={this.props.quesIndex + 1}
                questionItemIndexClick={this.props.jumpTo}
                toSeePaperMsg={() => {
                  return commonInfo.toJS();
                }}
                othersData={{ questionResult: questionList.map((item) => item.get('questionOutputDTO')), paperTitle }}
              ></PaperQuestionList>
            </PaperCatalog>
          </PaperWrapper>
        </MainContent>
        {this.props.isOpenChildrenTags && isComplex ? (
          <ChildrenTags
            curQuesDetail={curQuesDetail} bigTitle={curQuesDetail.title || ''}
          ></ChildrenTags>
        ) : null}
      </VerifyWrapper>
    );
  }
}
let flag = true;
const TagsForm = Form.create({
  onFieldsChange(props, changedFields) {
    try {
      if (!flag) {
        return;
      }
      props.formChange(changedFields);
      flag = false;
      setTimeout(() => {
        flag = true;
      }, 100);
    } catch (err) {
      flag = true;
    }
  },
  mapPropsToFields(props) {
    return {
      difficulty: {
        ...props.difficulty,
        value: props.difficulty.toString(),
      },
      distinction: {
        ...props.distinction,
        value: props.distinction.toString(),
      },
      recommendationIndex: {
        ...props.recommendationIndex,
        value: props.recommendationIndex.toString(),
      },
      rating: {
        ...props.rating,
        value: props.rating.toString(),
      },
      abilityIdList: {
        ...props.abilityIdList,
        value: props.abilityIdList.map((e) => e.toString()),
      },
      comprehensiveDegreeId: {
        ...props.comprehensiveDegreeId,
        value: props.comprehensiveDegreeId.toString(),
      },
    };
  },
})(
  (props) => {
    const {
      form, treeToRender2, treeToRender3,
      showTreeToRender2, showTreeToRender3,
      changeSearch, highlightItem, searchPoint,
      knowledgeJS, examPointJS, notShowPrompt,
    } = props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="horizontal" style={{ width: '100%', flexAlign: 'flex-start' }}>
        <Row>
          <Col span={8}>
            <FormItem label="难度" {...formItemLayout} >
              {getFieldDecorator('difficulty', {
                rules: [{ required: true, message: '请选择难度' }, { whitespace: true, message: '' }],
                options: {
                  initialValue: '',
                },
              })(
                <Select defaultActiveFirstOption>
                  <Select.Option value={'1'}>一级</Select.Option>
                  <Select.Option value={'2'}>二级</Select.Option>
                  <Select.Option value={'3'}>三级</Select.Option>
                  <Select.Option value={'4'}>四级</Select.Option>
                  <Select.Option value={'5'}>五级</Select.Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8} >
            <FormItem label="区分度" {...formItemLayout} >
              {getFieldDecorator('distinction', {
                rules: [{ required: true, message: '请选择区分度' }, { whitespace: true, message: '请选择区分度' }],
                options: {
                  initialValue: '',
                },
              })(
                <Select defaultActiveFirstOption>
                  <Select.Option value={'1'}>差</Select.Option>
                  <Select.Option value={'2'}>一般</Select.Option>
                  <Select.Option value={'3'}>好</Select.Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8} >
            <FormItem label="综合度" {...formItemLayout} >
              {getFieldDecorator('comprehensiveDegreeId', {
                rules: [{ required: true, message: '请选择综合度' }, { whitespace: true, message: '请选择综合度' }],
                options: {
                  initialValue: '',
                },
              })(
                <Select defaultActiveFirstOption>
                  <Select.Option value={'1'}>1</Select.Option>
                  <Select.Option value={'2'}>2</Select.Option>
                  <Select.Option value={'3'}>3</Select.Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="题目评级" {...formItemLayout} >
              {getFieldDecorator('rating', {
                rules: [{ required: true, message: '请选择题目评级' }, { whitespace: true, message: '请选择题目评级' }],
                options: {
                  initialValue: '',
                },
              })(
                <Select defaultActiveFirstOption>
                  <Select.Option value={'1'}>基础题</Select.Option>
                  <Select.Option value={'2'}>常规题</Select.Option>
                  <Select.Option value={'3'}>压轴题</Select.Option>
                  <Select.Option value={'4'}>易错题</Select.Option>
                  <Select.Option value={'5'}>经典题</Select.Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        {notShowPrompt ? null : <Row style={{ color: 'red', margin: '5px 11%' }}>注意：知识点、考点最多只能选择 3 个且只能选择最后一级的节点内容。</Row>}
        {showTreeToRender2 ? <Row>
          <Col span={21}>
            <FormItem label="知识点" {...formItemLayoutRow}>
              <FlexRow style={{ marginBottom: 8 }}>
                <Input
                  placeholder="搜索知识点" value={highlightItem.get('knowledgeKeyword')} onChange={(e) => changeSearch(e, 'knowledge', 'knowledgeList')}
                  onKeyDown={(e) => ((e.code === 'Enter' || e.keyCode === 13) ? searchPoint('knowledge', 'knowledgeList') : '')}
                />
                <SearchButton type="primary" ghost onClick={() => searchPoint('knowledge', 'knowledgeList')}>展开</SearchButton>
              </FlexRow>
              <p style={{ color: '#999', fontSize: 12, lineHeight: '16px' }}>共搜索到 {searchCount(knowledgeJS, highlightItem.get('knowledgeKeyword'))} 个相关知识点</p>
              <Row style={{ height: 'auto', maxHeight: 600, overflow: 'auto', background: '#eee' }}>
                {treeToRender2}
              </Row>
            </FormItem>
          </Col>
        </Row> : ''}
        {showTreeToRender3 ? <Row>
          <Col span={21}>
            <FormItem label="考点" {...formItemLayoutRow}>
              <FlexRow style={{ marginBottom: 8 }}>
                <Input
                  placeholder="搜索考点" value={highlightItem.get('exampointKeyword')} onChange={(e) => changeSearch(e, 'exampoint', 'examPointList')}
                  onKeyDown={(e) => ((e.code === 'Enter' || e.keyCode === 13) ? searchPoint('exampoint', 'examPointList') : '')}
                />
                <SearchButton type="primary" ghost onClick={() => searchPoint('exampoint', 'examPointList')}>展开</SearchButton>
              </FlexRow>
              <p style={{ color: '#999', fontSize: 12, lineHeight: '16px' }}>共搜索到 {searchCount(examPointJS, highlightItem.get('exampointKeyword'))} 个相关知识点</p>
              <Row style={{ height: 'auto', maxHeight: 600, overflow: 'auto', background: '#eee' }}>
                {treeToRender3}
              </Row>
            </FormItem>
          </Col>
        </Row> : ''}
      </Form>
    );
  });
EditTag.propTypes = {
  dispatch: PropTypes.func.isRequired,
  inputDTO: PropTypes.instanceOf(immutable.Map).isRequired,
  questionList: PropTypes.instanceOf(immutable.List).isRequired,
  questionListOrigin: PropTypes.instanceOf(immutable.List).isRequired,
  formChange: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  preQues: PropTypes.func.isRequired,
  jumpTo: PropTypes.func.isRequired,
  changePageState: PropTypes.func.isRequired,
  paperDownloadMsg: PropTypes.instanceOf(immutable.Map).isRequired,  // 下载所需的参数
  questionTypeList: PropTypes.instanceOf(immutable.List).isRequired,
  bigMsg: PropTypes.instanceOf(immutable.List).isRequired,
  submitToVerify: PropTypes.func.isRequired,
  quesIndex: PropTypes.number.isRequired,
  isOpenChildrenTags: PropTypes.bool.isRequired,
  btnCanClick: PropTypes.bool.isRequired,
  childrenTags: PropTypes.instanceOf(immutable.List).isRequired,
  showTree: PropTypes.instanceOf(immutable.Map).isRequired,
  examPointList: PropTypes.instanceOf(immutable.List).isRequired,
  knowledgeList: PropTypes.instanceOf(immutable.List).isRequired,
  paperTitle: PropTypes.string.isRequired,
  commonInfo: PropTypes.instanceOf(immutable.Map).isRequired,
  highlightItem: PropTypes.instanceOf(immutable.Map).isRequired,
};

const mapStateToProps = createStructuredSelector({
  SetTags: makeSelectSetTags(),
  inputDTO: makeInputDTO(),
  modalShow: makeModalShow(),
  editionList: makeEditionList(),
  courseSystemList: makeCourseSystem(),
  checkedCourse: makeCourseChecked(),
  quesIndex: makeQuestionIndex(),
  questionList: makeQuestionList(),
  questionListOrigin: makeQuestionListOrigin(),
  paperTitle: makePaperTitle(),
  paperDownloadMsg: makePaperDownloadMsg(),
  examPointList: getExamPointList(),
  knowledgeList: getKnowledgeList(),
  questionTypeList: makeQuestionTypeList(),
  bigMsg: makeBigMsg(),
  isOpenChildrenTags: makeIsOpenChildrenTags(),
  btnCanClick: makeBtnCanClick(),
  childrenTags: makeChildrenTags(),
  showTree: makeShowTree(),
  commonInfo: makeCommonInfo(),
  highlightItem: makeHighlightItem(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    formChange(props, value) {
      let dto = props.inputDTO.toJS();
      if (value.difficulty) {
        dto.difficulty = value.difficulty.value;
      }
      if (value.distinction) {
        dto.distinction = value.distinction.value;
      }
      if (value.rating) {
        dto.rating = value.rating.value;
      }
      if (value.comprehensiveDegreeId) {
        dto.comprehensiveDegreeId = value.comprehensiveDegreeId.value;
      }
      if (value.examPointIdList) {
        dto.examPointIdList = value.examPointIdList.value;
      }
      if (value.knowledgeIdList) {
        dto.knowledgeIdList = value.knowledgeIdList.value;
      }
      dispatch(setInputDTOAction(fromJS(dto)));
    },
    submit() {
      dispatch(submitAction());
    },
    submitToVerify() {
      dispatch(submitVerify());
    },
    preQues(props) {
      const index = props.quesIndex;
      if (index === 0) {
        message.warning('没有上一题了！');
        return false;
      }
      dispatch(nextQuesAction(index - 1));
      setTimeout(() => {
        dispatch(initCurInputAction());
      }, 0);
    },
    jumpTo(index, i, questionCount, item, cur) {
      dispatch(initHighlightItemAction());
      dispatch(setQuestionIndex(cur - 1));
      setTimeout(() => {
        dispatch(initCurInputAction());
      }, 10);
    },
    changePageState(num) {
      dispatch(changePageState(num));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTag);
