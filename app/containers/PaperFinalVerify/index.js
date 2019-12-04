/*
 *
 * PaperFinalVerify
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import immutable, { fromJS } from 'immutable';
import styled from 'styled-components';
import { Button as AntdButton, Switch, message, Checkbox, Input } from 'antd';
import { FlexRowCenter, FlexCenter } from 'components/FlexBox';
import ShowQuestionItem from 'components/ShowQuestionItem';
import Table from 'components/Table';
import { handleFormulaCaos } from 'utils/helpfunc';
import {
  formatDate,
  paperStates,
  paperStatesControl,
  trItemList,
  rowList,
  downloadFile,
  toBoolean,
} from 'components/CommonFn';
import { RootWrapper, PlaceHolderBox } from 'components/CommonFn/style';
import PaperQuestionList from 'components/PaperQuestionList';
import { setBackAlertStatesAction, changeBackPromptAlertShowAction } from 'containers/LeftNavC/actions';
import { backChooseItem } from 'containers/TagsVerify/verifyChildren';
import { makeDataIsGetting, makeBtnCanClick } from 'containers/LeftNavC/selectors';
import { tagsName } from 'containers/TagsVerify/tags';
import LoadingIndicator from 'components/LoadingIndicator';
import Alert from 'components/Alert';
import EditItemQuestion from 'components/EditItemQuestion';
import { addQuestionCountByExamPaper } from 'utils/request';
import {
  setPaperParams,
  getPaperListAction,
  changeNeedVerifyPaperIdAction,
  setQuestionParamsAction,
  removeBigQuestionAction,
  removeSmallQuestionAction,
  setRemoveIndexAction,
  getAllQuestionTypeListAction,
  setNewQuestionMsgAction,
  changeQuestionEditStateAction,
  setQuestionsListAction,
  submitQuestionItemAction,
  setClickTargetAction,
  setBigQuestionAction,
  saveWarehouseAction,
  getPaperMsgListAction,
  setIsAddOrEditAction,
  changeBigNameAction,
  submitAdoptFeedbackAction,
} from './actions';
import {
  makePaperNumber,
  makePaperList,
  makePaperParams,
  makePaperIndex,
  makePaperMsgData,
  makeQuestionParams,
  makeCommoninfo,
  makeQuestionsList,
  makeBigQuestionMsg,
  makeRemoveIndex,
  makeQuestionTypeList,
  makeNewQuestion,
  makePointList,
  makeQuestionEditState,
  makePaperDownloadMsg,
  makeClickTarget,
  makeInputDto,
  makePaperMsgList,
  maekIsAddOrEdit,
  makePointIdList,
  makePaperNeedVerifyId,
} from './selectors';
import {
  PreViewWrapper,
  HeaderBox,
  PreViewBody,
  ContentLeft,
  ContentRight,
  CompileWrapper,
  QuestionContentWrapper,
  TagsWrapper,
  TagsItemWrapper,
  TagsItemBox,
  ValueRight,
  ValueLeft,
  ShowButton,
  BigQuestionMsgBox,
  BigQuestionTitleBox,
  TextValue,
} from './paperStyle';
import { feedBackMsgTypeList, submitAdoptTypeList } from './finalConfig';

const Button = styled(AntdButton)`
  margin-right: 20px;
`;
const getValue = (questionTag, type) => {
  let res = '';
  if ((questionTag.get(type) || 0) > 0) {
    res = tagsName[type][(questionTag.get(type) || 0)];
  } else {
    res = '数据异常，请重新编辑';
  }
  return res;
};
const FeedBackMsg = styled.p``;

export class PaperFinalVerify extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.markPaperList = this.markPaperList.bind(this);
    this.makeEditOrAddQuestion = this.makeEditOrAddQuestion.bind(this);
    this.headerItem = this.headerItem.bind(this);
    this.changePage = this.changePage.bind(this);
    this.changeQuestionsIndex = this.changeQuestionsIndex.bind(this);
    this.addOrEditQuestion = this.addOrEditQuestion.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
    this.insertFormula = this.insertFormula.bind(this);
    this.setQuestionsList = this.setQuestionsList.bind(this);
    this.saveadoptfeedback = this.saveadoptfeedback.bind(this);
    this.state = {
      seeMobile: false,
      isAddOrEdit: {
        type: '',
        todo: '',
        oldMsg: {},
        openAlert: false,
      },
      editorAlertMsg: {
        title: '新增大题',
        buttonsType: '1',
      },
      showAllChildren: false,
      limtShow: 5,
      isOpen: true,
      smallMsgList: [],
      newQuestionInsertWay: 1,
      showTree: {
        show: false,
        type: '',
        degree: '',
        index: -1,
        oldValue: '',
      },
      showEditor: true,
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
      seeFormulaModal: false,
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
    const dispatch = this.props.dispatch;
    dispatch(getAllQuestionTypeListAction());
    dispatch(getPaperMsgListAction());
  }
  headerItem() {
    return [{
      name: '待终审',
      num: this.props.paperNumber.get('notGetPaperCount'),
    }, {
      name: '已入库',
      num: this.props.paperNumber.get('hasGetPaperCount'),
    }];
  }
  stateItem() {
    const { dispatch } = this.props;
    let res = [];
    const state = this.props.paperParams.get('paperState') || 11;
    if (state === 11) {
      res = [{ name: 'paperState', state: { 11: '待终审', 17: '审核中', 18: '已入库', 99: '需重审' }}, {
        name: 'control',
        state: { 11: '最终审核', 17: '继续审核', 18: '— —', 99: '重审' },
        clickBack: (paperState, val, index, i) => {
          // console.log('终审', index);
          if ([11, 17, 99].includes(paperState)) {
            const paperItem = this.props.paperList.get(index);  // 获取该试卷数据
            dispatch(changeNeedVerifyPaperIdAction(paperItem));  // 设置为当前试卷
          } else {
            message.warning('功能尚未开发');
          }
        },
      }];
    } else if (state === 18) {
      res = [{ name: 'paperState', state: Object.assign({}, paperStates, { 18: '已入库' }) }, {
        name: 'control',
        state: Object.assign({}, paperStatesControl, { 18: '— —' }),
      }];
    }
    return res;
  }
  changePage(pageIndex, pageSize) {
    const { dispatch, paperParams } = this.props;
    dispatch(setPaperParams(paperParams.set('pageIndex', pageIndex)));
    setTimeout(() => dispatch(getPaperListAction()), 20);
  }
  changeQuestionsIndex(type, index) {
    const questionParams = this.props.questionParams;
    if (type === 'itemClick') {
      this.props.dispatch(setQuestionParamsAction(questionParams.set('questionIndex', index - 1)));
    }
  }
  setQuestionsList(index, type, value, property, proValue) {
    if (!type || !value) return;
    const { questionsList } = this.props;
    let newQuestionsList = questionsList;
    if (!property) {
      newQuestionsList = questionsList.setIn([index, type], value);
    }
    this.props.setQuestionsList(newQuestionsList);
  }
  addOrEditQuestion(type, todo, msg) {
    const { questionsList, questionParams, dispatch, isAddOrEdit } = this.props;
    if (type === 'big') {
      if (todo === 'edit') {
        const newIsAddOrEdit = isAddOrEdit.set('type', 'big').set('todo', 'edit').set('oldMsg', fromJS(msg)).set('openAlert', true);
        dispatch(setIsAddOrEditAction(newIsAddOrEdit));
        this.setState({ editorAlertMsg: { buttonsType: '1', title: '修改大题名称' }});
      }
    } else if (type === 'small') {
      if (todo === 'add') {
        // you can do here.
      } else if (todo === 'edit') {
        const questionItem = questionsList.get(questionParams.get('questionIndex')) || fromJS([]);
        const questionOutputDTO = questionItem.get('questionOutputDTO') || fromJS({});
        if (!questionOutputDTO.get('id')) {
          message.error('执行错误，请刷新后重试');
        } else {
          this.props.setNewQuestionData(questionOutputDTO.set('epcId', questionItem.get('bigId')).set('epId', questionItem.get('epId')));
          setTimeout(() => {
            dispatch(changeQuestionEditStateAction(1));
          }, 20);
        }
      }
    }
  }
  removeQuestion(type, index) {
    const { dispatch, removeIndex } = this.props;
    // log(type, index, 'removeQuestion');
    if (type === 'big') {
      dispatch(setRemoveIndexAction(removeIndex.set('bigIndex', index)));
      setTimeout(() => {
        dispatch(removeBigQuestionAction());
      }, 20);
    } else if (type === 'small') {
      dispatch(setRemoveIndexAction(removeIndex.set('smallIndex', index)));
      setTimeout(() => {
        dispatch(removeSmallQuestionAction());
      }, 20);
    }
  }
  insertFormula(formula) {
    const content = window.UE.getEditor('editor1');
    if ((formula || '').replace(/\s/g, '').length > 0) {
      content.execCommand('insertHtml', ` <zmlatex contenteditable="false">${formula}</zmlatex> `);
      handleFormulaCaos(content);
    } else {
      // console.log('未输入内容');
    }
  }
  saveadoptfeedback(checked, i) {
    const { questionsList, questionParams, setQuestionsList } = this.props;
    const questionsIndex = questionParams.get('questionIndex') || 0;
    const newQuestionsList = questionsList.setIn([questionsIndex, 'questionOutputDTO', submitAdoptTypeList[i]], checked);
    setQuestionsList(newQuestionsList);
  }
  markPaperList() {
    const { dispatch, paperParams, paperNumber, paperList, questionsList, questionParams, commonInfo, pointList, btnCanClick } = this.props;
    const paperState = paperParams.get('paperState');
    const pageState = paperParams.get('pageState');
    const questionsIndex = questionParams.get('questionIndex') || 0;
    const paperId = this.props.paperNeedVerify.get('id');
    let res = '';
    let tablebodydata = fromJS([]);
    // console.log(paperNumber.toJS());
    switch (pageState) {
      case 0:
        tablebodydata = paperList.toJS().map((item) => {
          return {
            paperName: item.name || '该试卷未输入名称',
            questionCount: item.questionAmount || 0,
            insertPerson: item.createUserName || ' ',
            refleshTime: formatDate('yyyy-MM-dd', new Date(item.updatedTime || new Date())),
            paperState: item.wrongFlag ? 99 : (item.state || 11),
            control: item.wrongFlag ? 99 : (item.state || 11),
          };
        });
        res = (<Table
          source={'paperfinalverify'}
          trItemList={trItemList}  // 必填，每列中取的属性名，数组形式
          rowList={rowList}  // 必填
          headerItem={fromJS(this.headerItem())} // 必填，头部切换页 item
          tablebodydata={fromJS(tablebodydata)}  // 必填
          stateItem={this.stateItem()}  // stateItem：具有不同状态的某一项数据，可以添加 click 事件
          paperState={paperState === 11 ? 0 : 1}
          changeReceiveState={(index) => {
            // console.log(index, paperState, 'index');
            if (index === 0) {
              this.props.dispatch(setPaperParams(paperParams.set('paperState', 11).set('pageIndex', 1)));
            } else {
              this.props.dispatch(setPaperParams(paperParams.set('paperState', 18).set('pageIndex', 1)));
            }
            setTimeout(() => {
              this.props.dispatch(getPaperListAction());
              this.props.dispatch(setBackAlertStatesAction(fromJS({
                buttonsType: '0',
                title: '试卷数据获取中...',
                titleStyle: { fontSize: '20px', fontWeight: 600, color: '#333', textAlign: 'center' },
                setChildren: () => <LoadingIndicator style={{ marginTop: 15 }} />,
              })));
              // this.props.dispatch(changeBackPromptAlertShowAction(true));
            });
          }}
          orderItemsClick={(orderIndex) => {
            dispatch(setPaperParams(paperParams.set('sort', orderIndex)));
            // console.log(orderIndex, 'orderIndex');
            setTimeout(() => {
              dispatch(getPaperListAction());
            }, 20);
            // this.props.dispatch(changeSortAction(orderIndex));
          }}
          changePageNum={this.changePage}
          paperCount={paperState === 11 ? paperNumber.get('notGetPaperCount') : paperNumber.get('hasGetPaperCount')}  // 总试卷数量
          // whoCanBeClick={paperState === 11 ? [11, 17] : []}  // 哪个状态的可以点击
          whoCanBeClick={[11, 17]}  // 哪个状态的可以点击
          idLoading={this.props.dataIsGetting}
          pageIndex={this.props.pageIndex + 1}
          pageSize={paperParams.get('pageSize')}
        />);
        break;
      case 1:  // eslint-disable-line
        const currentQuestion = questionsList.getIn([questionsIndex, 'questionOutputDTO']) || fromJS({});
        // console.log(currentQuestion.toJS(), 'currentQuestion');
        // const questionTag = currentQuestion.get('questionTag') || fromJS({});
        const children = currentQuestion.get('children') || fromJS([]);
        // const errReason = currentQuestion.get('errReason');
        const errReasonList = [currentQuestion.get(feedBackMsgTypeList[0]), currentQuestion.get(feedBackMsgTypeList[1]), currentQuestion.get(feedBackMsgTypeList[2])];
        res = (<PreViewWrapper>
          <HeaderBox><Button
            style={{ marginLeft: 20 }} onClick={() => {
              dispatch(setQuestionParamsAction(questionParams.set('questionIndex', 0)));
              dispatch(setPaperParams(paperParams.set('pageState', 0).set('pageIndex', 0)));
            }}
          >返回</Button><PlaceHolderBox />
            <Button
              onClick={() => downloadFile({ fileUrl: this.props.paperDownloadMsg.get('fileUrl'), fileName: this.props.paperDownloadMsg.get('fileName') }, this.props.dispatch)}
            >下载试卷</Button>
            {btnCanClick ? <Button
              type="danger"
              onClick={() => {
                dispatch(submitAdoptFeedbackAction());
                dispatch(saveWarehouseAction());
                addQuestionCountByExamPaper(paperId);
              }}
            >保存入库</Button> : <Button disabled>保存入库</Button>}
          </HeaderBox>
          <PreViewBody>
            <ContentLeft>
              <CompileWrapper>
                <PlaceHolderBox />
                <Button onClick={() => this.addOrEditQuestion('small', 'edit', { index: questionsIndex, memory: currentQuestion })}>编辑本题</Button>
                <Button
                  onClick={() => {
                    dispatch(setBackAlertStatesAction(fromJS({
                      title: '删除本题',
                      setChildren: () => {
                        return (<FlexCenter style={{ fontSize: 16, color: '#333', fontWeight: 600, height: 80 }}>确认要删除当前题目吗？</FlexCenter>);
                      },
                      titleStyle: { fontSize: '20px', fontWeight: 600, color: '#333', textAlign: 'left' },
                      leftClick: () => {
                        // this.props.promptAlertShow(false);
                        dispatch(changeBackPromptAlertShowAction(false));
                      },
                      rightClick: () => {
                        dispatch(changeBackPromptAlertShowAction(false));
                        this.removeQuestion('small', questionsIndex);
                      },
                    })));
                    dispatch(changeBackPromptAlertShowAction(true));
                  }}
                >删除本题</Button>
              </CompileWrapper>
              <FlexRowCenter style={{ minHeight: 30 }}><PlaceHolderBox /><Switch onChange={(ckicked) => this.setState({ seeMobile: ckicked })} checked={this.state.seeMobile} checkedChildren="移动端预览" unCheckedChildren="PC预览" /></FlexRowCenter>
              <QuestionContentWrapper>
                {errReasonList.map((it, i) => {
                  const hasFeedBack = toBoolean((it || '').replace(/\s+/g, ''));
                  return hasFeedBack ? (<FlexRowCenter key={i} style={{ minHeight: 30, borderBottom: '1px solid #efefef' }}>
                    <FeedBackMsg style={{ color: 'red', fontSize: 14 }}>{`纠错信息：${it}`}</FeedBackMsg><PlaceHolderBox />
                    <Checkbox style={{ margin: '0 10px' }} checked={toBoolean(currentQuestion.get(submitAdoptTypeList[i]))} onChange={(e) => this.saveadoptfeedback(e.target.checked, i)}>采纳此意见</Checkbox>
                  </FlexRowCenter>) : '';
                })}
                <ShowQuestionItem
                  soucre="paperfinalverify"
                  subjectId={commonInfo.get('subjectId') || 1}
                  questionOutputDTO={currentQuestion}
                  seeMobile={this.state.seeMobile}
                  limtShow={this.state.limtShow}
                  showAllChildren={this.state.showAllChildren}
                  pointList={pointList}
                />
                {(currentQuestion.get('templateType') === 1) && (children.count() >= this.state.limtShow) ? <ShowButton><PlaceHolderBox /><Button
                  type={this.state.showAllChildren ? '' : 'primary'}
                  onClick={() => {
                    const showFlag = this.state.showAllChildren;
                    this.setState({ showAllChildren: !showFlag });
                  }}
                >{this.state.showAllChildren ? '显示部分子题' : '显示全部子题'}</Button></ShowButton> : ''}
              </QuestionContentWrapper>
              <TagsWrapper>
                <h2>题目标签</h2>
                <TagsItemWrapper><TagsItemBox><ValueRight style={{ fontWeight: 600 }}>难度：</ValueRight><ValueLeft>{getValue(currentQuestion, 'difficulty')}</ValueLeft></TagsItemBox><TagsItemBox><ValueRight style={{ fontWeight: 600 }}>区分度：</ValueRight><ValueLeft>{getValue(currentQuestion, 'distinction')}</ValueLeft></TagsItemBox></TagsItemWrapper>
                <TagsItemWrapper><TagsItemBox><ValueRight style={{ fontWeight: 600 }}>题目评级：</ValueRight><ValueLeft>{getValue(currentQuestion, 'rating')}</ValueLeft></TagsItemBox><TagsItemBox><ValueRight style={{ fontWeight: 600 }}>综合度：</ValueRight><ValueLeft>{getValue(currentQuestion, 'comprehensiveDegreeId')}</ValueLeft></TagsItemBox></TagsItemWrapper>
                <TagsItemWrapper><TagsItemBox style={{ width: 440 }}><ValueRight style={{ fontWeight: 600 }}>知识点：</ValueRight><ValueLeft>
                  {backChooseItem(pointList.get('knowledgeIdList'), (currentQuestion.get('knowledgeIdList') || fromJS([])).toJS(), [], 'examPointIdList').join('、')}
                </ValueLeft></TagsItemBox></TagsItemWrapper>
                <TagsItemWrapper><TagsItemBox style={{ width: 440 }}><ValueRight style={{ fontWeight: 600 }}>考点：</ValueRight><ValueLeft>
                  {backChooseItem(pointList.get('examPointIdList'), (currentQuestion.get('examPointIdList') || fromJS([])).toJS(), [], 'examPointIdList').join('、')}
                </ValueLeft></TagsItemBox></TagsItemWrapper>
              </TagsWrapper>
              <FlexCenter style={{ minHeight: 40, border: '1px solid #ddd', background: '#fff' }}>
                <Button
                  type="primary"
                  style={{ margin: '0 30px' }}
                  onClick={() => {
                    if (questionsIndex > 0) {
                      this.changeQuestionsIndex('itemClick', questionsIndex);
                    }
                  }}
                >上一题</Button>
                <Button
                  type="primary"
                  style={{ margin: '0 30px' }}
                  onClick={() => {
                    if (questionsIndex < questionsList.count() - 1) {
                      // console.log(questionsIndex, questionsList.count() - 1);
                      this.changeQuestionsIndex('itemClick', questionsIndex + 2);
                    }
                  }}
                >下一题</Button>
              </FlexCenter>
            </ContentLeft>
            <ContentRight>
              <PaperQuestionList
                source={'paperFinalVerify'}
                questionsList={this.props.bigQuestionMsg}
                questionSelectedIndex={questionsIndex + 1}
                questionItemIndexClick={(a, b, c, d, e) => this.changeQuestionsIndex('itemClick', e)}
                toSeePaperMsg={() => commonInfo.toJS()}
                othersData={{}}
                removeQuestion={this.removeQuestion}
                wantAddQuestion={this.addOrEditQuestion}
                promptAlertShow={(bol) => dispatch(changeBackPromptAlertShowAction(bol))}
                setPromptAlertStates={(item) => dispatch(setBackAlertStatesAction(item))}
              />
            </ContentRight>
          </PreViewBody>
        </PreViewWrapper >);
        break;
      default:
        break;
    }
    return res;
  }
  makeEditOrAddQuestion() {
    const { dispatch, clickTarget, newQuestion, setNewQuestionData, pointList, questionTypeList, questionEditState } = this.props;
    // console.log('clickTarget: ', clickTarget);
    // console.log('newQuestion: ', newQuestion.toJS());
    // console.log('setNewQuestionData: ', setNewQuestionData);
    // console.log('pointList: ', pointList.toJS());
    // console.log('questionTypeList: ', questionTypeList.toJS());
    // console.log('questionEditState: ', questionEditState);
    return (<EditItemQuestion
      clickTarget={clickTarget}
      newQuestion={newQuestion}
      setNewQuestionData={setNewQuestionData}
      pointList={pointList}
      questionTypeList={questionTypeList}
      questionEditState={questionEditState}
      isOpen={this.state.isOpen}
      changeQuestionEditState={() => dispatch(changeQuestionEditStateAction(0))}
      setClickTarget={(str) => dispatch(setClickTargetAction(str))}
      soucre="finalVerify"
      submitQuestionItem={() => {
        dispatch(setBackAlertStatesAction(fromJS({
          buttonsType: '0',
          title: '数据保存中...',
          titleStyle: { fontSize: '20px', fontWeight: 600, color: '#333', textAlign: 'center' },
          setChildren: () => <LoadingIndicator style={{ marginTop: 15 }} />,
        })));
        dispatch(submitQuestionItemAction());
      }}
    />);
  }
  render() {
    const { paperParams, questionEditState, dispatch, bigQuestionMsg, isAddOrEdit } = this.props;
    const pageState = paperParams.get('pageState');
    const editorAlertMsg = this.state.editorAlertMsg;
    return (<RootWrapper style={{ padding: pageState === 1 ? '0' : '' }}>
      {this.markPaperList()}
      {questionEditState !== 0 ? this.makeEditOrAddQuestion() : ''}
      <Alert
        properties={{
          buttonsType: editorAlertMsg.buttonsType,
          isOpen: isAddOrEdit.get('openAlert') || false,
          title: editorAlertMsg.title,
          titleStyle: { textAlign: 'center', fontSize: '16px', color: '#333', fontWeight: 600 },
          child: ['保存'],
          rightClose: this.props.questionsList.count() > 0,
          closeClick: () => {
            dispatch(setIsAddOrEditAction(fromJS(isAddOrEdit.set('openAlert', false))));
            const newBigMsgList = bigQuestionMsg.setIn([isAddOrEdit.getIn(['oldMsg', 'index']), 'name'], isAddOrEdit.getIn(['oldMsg', 'name']) || '');
            dispatch(setBigQuestionAction(newBigMsgList));
          },
          oneClick: () => {
            dispatch(changeBigNameAction());
          },
        }}
      >
        <BigQuestionMsgBox>
          <BigQuestionTitleBox>
            <TextValue minWidth={50}>标题：</TextValue>
            <Input
              defaultValue="请输入大题标题" value={bigQuestionMsg.getIn([isAddOrEdit.getIn(['oldMsg', 'index']), 'name']) || ''} onChange={(e) => {
                const newBigMsgList = bigQuestionMsg.setIn([isAddOrEdit.getIn(['oldMsg', 'index']), 'name'], e.target.value);
                dispatch(setBigQuestionAction(newBigMsgList));
              }}
            ></Input>
          </BigQuestionTitleBox>
        </BigQuestionMsgBox>
      </Alert>
    </RootWrapper>);
  }
}

PaperFinalVerify.propTypes = {
  dispatch: PropTypes.func.isRequired,
  paperParams: PropTypes.instanceOf(immutable.Map).isRequired,
  paperNumber: PropTypes.instanceOf(immutable.Map).isRequired,
  paperList: PropTypes.instanceOf(immutable.List).isRequired,
  dataIsGetting: PropTypes.bool.isRequired,
  pageIndex: PropTypes.number.isRequired,
  paperMsgData: PropTypes.instanceOf(immutable.Map).isRequired,
  questionsList: PropTypes.instanceOf(immutable.List).isRequired,
  questionParams: PropTypes.instanceOf(immutable.Map).isRequired,
  commonInfo: PropTypes.instanceOf(immutable.Map).isRequired,
  bigQuestionMsg: PropTypes.instanceOf(immutable.List).isRequired,
  removeIndex: PropTypes.instanceOf(immutable.Map).isRequired,
  questionTypeList: PropTypes.instanceOf(immutable.List).isRequired,
  newQuestion: PropTypes.instanceOf(immutable.Map).isRequired,
  pointList: PropTypes.instanceOf(immutable.Map).isRequired,
  questionEditState: PropTypes.number.isRequired,
  setNewQuestionData: PropTypes.func.isRequired,
  setQuestionsList: PropTypes.func.isRequired,
  paperDownloadMsg: PropTypes.instanceOf(immutable.Map).isRequired,  // 下载所需的参数
  clickTarget: PropTypes.string.isRequired,
  inputDto: PropTypes.instanceOf(immutable.Map).isRequired,
  paperMsgList: PropTypes.instanceOf(immutable.Map).isRequired,
  btnCanClick: PropTypes.bool.isRequired,
  isAddOrEdit: PropTypes.instanceOf(immutable.Map).isRequired,
  pointIdList: PropTypes.instanceOf(immutable.Map).isRequired,
  paperNeedVerify: PropTypes.instanceOf(immutable.Map),
};

const mapStateToProps = createStructuredSelector({
  paperList: makePaperList(),
  dataIsGetting: makeDataIsGetting(),
  paperParams: makePaperParams(),
  paperNumber: makePaperNumber(),
  pageIndex: makePaperIndex(),
  paperMsgData: makePaperMsgData(),
  questionsList: makeQuestionsList(),
  questionParams: makeQuestionParams(),
  commonInfo: makeCommoninfo(),
  bigQuestionMsg: makeBigQuestionMsg(),
  removeIndex: makeRemoveIndex(),
  questionTypeList: makeQuestionTypeList(),
  newQuestion: makeNewQuestion(),
  pointList: makePointList(),
  questionEditState: makeQuestionEditState(),
  paperDownloadMsg: makePaperDownloadMsg(),
  clickTarget: makeClickTarget(),
  inputDto: makeInputDto(),
  paperMsgList: makePaperMsgList(),
  btnCanClick: makeBtnCanClick(),
  isAddOrEdit: maekIsAddOrEdit(),
  pointIdList: makePointIdList(),
  paperNeedVerify: makePaperNeedVerifyId(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    setNewQuestionData: (item) => dispatch(setNewQuestionMsgAction(item)),
    setQuestionsList: (item) => dispatch(setQuestionsListAction(item)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaperFinalVerify);
