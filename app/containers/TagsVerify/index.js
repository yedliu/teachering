/*
 *
 * TagsVerify
 *
 */
/* eslint-disable max-nested-callbacks */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import immutable, { fromJS } from 'immutable';
import styled from 'styled-components';
import { FlexColumn } from 'components/FlexBox';
import { createStructuredSelector } from 'reselect';
import { formatDate, paperStates, paperStatesControl, backArr, backfromZmStand } from 'components/CommonFn';
import { makeDataIsGetting } from 'containers/LeftNavC/selectors';
import { setBackAlertStatesAction, changeBackPromptAlertShowAction } from 'containers/LeftNavC/actions';
import LoadingIndicator from 'components/LoadingIndicator';
import { strToArr } from 'containers/SetTags/tags';
import makeSelectTagsVerify, {
  makePageState,
  makeAlertModalState,
  makePaperState,
  makePaperList,
  makeHasGetPaperCount,
  makeNotGetPaperCount,
  makePageSize,
  makePageIndex,
} from './selectors';
import {
  changePaperStateAction,
  getPaperMsgAction,
  setEpid,
  getCurPaper,
  changePageState,
  setToGet,
  toggleDialogModal,
  setPageIndex,
  toGetPaper,
  setSort,
  setCurrentPaperAction,
  setCommonInfo,
  setPaperTitle,
  setBigQuestionAction,
  setQuestionsListAction,
  getKnowledgeAction,
  getExamPointAction
} from './actions';
import { Modal, message } from 'antd';
import EditTag from './tags';
import Table from 'components/Table';
import { preAuditTagByGeetest } from './server';
import { gtInit } from 'utils/gtInit';

require('katex/dist/katex.min.css');

const Wrapper = styled(FlexColumn) `
   background: #fff;
   padding: 20px;
`;

const trItemList = ['paperName', 'questionCount', 'insertPerson', 'refleshTime', 'paperState', 'control'];
const rowList = [{
  name: '试卷名称',
  scale: 4,
}, {
  name: '题目数量',
  scale: 1,
}, {
  name: '上传者',
  scale: 1.5,
}, {
  name: '更新时间',
  scale: 1.5,
}, {
  name: '状态',
  scale: 1.5,
}, {
  name: '操作',
  scale: 2,
}];

export class TagsVerify extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.markPaperList = this.markPaperList.bind(this);
    this.headerItem = this.headerItem.bind(this);
    this.stateItem = this.stateItem.bind(this);
    this.verifySuccess = this.verifySuccess.bind(this);
    this.captchaObj = null;
    this.state = {
      paper: null
    };
  }

  componentDidMount() {
    // 极验验证码配置
    this.verifyInit();
    // this.props.dispatch(getCurPaper()); // 记得去掉,调试时配合 pageState 状态使用 mock 数据.
  }

  verifyInit() {
    // 请求配置接口
    gtInit().then((captchaObj) => {
      this.captchaObj = captchaObj;
      // 绑定验证成功失败事件
      this.captchaObj.onSuccess(this.verifySuccess);
      this.captchaObj.onError((e) => {
        message.error(e.message || '系统错误');
      });
    });
  }

  verifySuccess() {
    let result = this.captchaObj.getValidate();
    if (!result) {
      return message.error('请完成验证');
    }
    preAuditTagByGeetest({
      id: this.state.paper.get('id'),
      challenge: result.geetest_challenge,
      validate: result.geetest_validate,
      seccode: result.geetest_seccode,
    }).then((res) => {
      const { dispatch } = this.props;
      const { data } = res;
      const questionsList = [];
      const bigMsg = [];
      let realQuestionsCount = 0;
      if (res.code !== '0') {
        return message.error(res.message || '系统异常');
      }
      dispatch(setEpid(this.state.paper));
      dispatch(setCurrentPaperAction(fromJS(data)));
      data.examPaperContentOutputDTOList.forEach((item, index) => {
        bigMsg.push({
          count: item.examPaperContentQuestionOutputDTOList.length,
          name: item.name,
          serialNumber: index + 1,
        });
        item.examPaperContentQuestionOutputDTOList.forEach((it, i) => {
          realQuestionsCount += 1;
          const childrenCount = (it.questionOutputDTO.children || []).length;
          if (!it.questionOutputDTO.questionTag1) {
            // console.log('未找到部分标签内容,系统将使用默认参数替代', `第${index + 1}大题`, `低${i + 1} 小题`, 'examPaperContentQuestionOutputDTOList', 'tag1');
            it.questionOutputDTO.questionTag1 = {
              comprehensiveDegreeId: 1,
              difficulty: 1,
              distinction: 1,
              rating: 1,
              examPointIds: null,
              knowledgeIds: null,
            };
          }
          if (!it.questionOutputDTO.questionTag2) {
            // console.log('未找到部分标签内容,系统将使用默认参数替代', `第${index + 1}大题`, `低${i + 1} 小题`, 'examPaperContentQuestionOutputDTOList', 'tag2');
            it.questionOutputDTO.questionTag2 = {
              comprehensiveDegreeId: 1,
              difficulty: 1,
              distinction: 1,
              rating: 1,
              examPointIds: null,
              knowledgeIds: null,
            };
          }
          const knowledgeIdList1 = strToArr(it.questionOutputDTO.questionTag1.knowledgeIds, ',');
          const examPointIdList1 = strToArr(it.questionOutputDTO.questionTag1.examPointIds, ',');
          const knowledgeIdList2 = strToArr(it.questionOutputDTO.questionTag2.knowledgeIds, ',');
          const examPointIdList2 = strToArr(it.questionOutputDTO.questionTag2.examPointIds, ',');
          const knowledgeIdList = new Set([].concat(knowledgeIdList1, knowledgeIdList2));
          const examPointIdList = new Set([].concat(examPointIdList1, examPointIdList2));
          const children1 = it.questionOutputDTO.questionTag1.children || [];
          const children2 = it.questionOutputDTO.questionTag2.children || [];
          const newIt = it;
          newIt.questionOutputDTO.errState = -1;
          newIt.questionOutputDTO.verifyTagsSelect = {
            difficulty: 0,
            distinction: 0,
            comprehensiveDegreeId: 0,
            rating: 0,
            knowledgeIdList: 0,
            examPointIdList: 0,
          };
          newIt.questionOutputDTO.verifyTagsSelectDrop = {
            difficulty: 0,
            distinction: 0,
            comprehensiveDegreeId: 0,
            rating: 0,
            knowledgeIdList: [],
            examPointIdList: [],
          };
          newIt.questionOutputDTO.questionTag = {
            difficulty: 0,
            distinction: 0,
            comprehensiveDegreeId: 0,
            rating: 0,
            knowledgeIdList: Array.from(knowledgeIdList),
            // knowledgeIdList: [],
            examPointIdList: Array.from(examPointIdList),
            // examPointIdList: [],
            tagAdopt: 0,
            tagReason: '',
            questionId: it.questionId,
            errReason: '',
            showTextArea: false,
            children: backArr(childrenCount > 0, () =>
              // console.log(children1, children2, 'children');
               new Array(childrenCount).fill('').map((iit, ii) => {
                 const childrenKnowledgeList1 = strToArr((children1[ii] || {}).knowledgeIds, ',');
                 const childrenExampointList1 = strToArr((children1[ii] || {}).examPointIds, ',');
                 const childrenKnowledgeList2 = strToArr((children2[ii] || {}).knowledgeIds, ',');
                 const childrenExampointList2 = strToArr((children2[ii] || {}).examPointIds, ',');
                 const childrenKnowledgeList = new Set([].concat(childrenKnowledgeList1, childrenKnowledgeList2));
                 const childrenExampointList = new Set([].concat(childrenExampointList1, childrenExampointList2));
                 return {
                   knowledgeIdList: Array.from(childrenKnowledgeList),
                   examPointIdList: Array.from(childrenExampointList),
                   subQuestionId: it.questionOutputDTO.children[ii].id,
                 };
               })),
          };
          const newQuestionOutputDTO = {
            title: backfromZmStand(it.questionOutputDTO.title || ''),
            analysis: backfromZmStand(it.questionOutputDTO.analysis || ''),
            answerList: (it.questionOutputDTO.answerList || []).map((iit) => backfromZmStand(iit || '')),
            optionList: (it.questionOutputDTO.optionList || []).map((iit) => backfromZmStand(iit || '')),
          };
          if (it.questionOutputDTO.children && it.questionOutputDTO.children.length > 0) {
            newQuestionOutputDTO.children = it.questionOutputDTO.children.map((itt) => {
              return {
                score: itt.score,
                title: backfromZmStand(itt.title || ''),
                optionList: (itt.optionList || []).map((iit) => backfromZmStand(iit || '')),
                answerList: (itt.answerList || []).map((iit) => backfromZmStand(iit || '')),
                analysis: backfromZmStand(itt.analysis || ''),
                typeId: itt.typeId,
              };
            });
          }
          newIt.questionOutputDTO = Object.assign({}, newIt.questionOutputDTO, newQuestionOutputDTO);
          questionsList.push(newIt);
        });
        item.examPaperContentQuestionOutputDTOList.map((it) => {
          const newIt = it;
          newIt.questionOutputDTO.questionTag1.knowledgeIdList = strToArr(it.questionOutputDTO.questionTag1.knowledgeIds, ',');
          newIt.questionOutputDTO.questionTag1.examPointIdList = strToArr(it.questionOutputDTO.questionTag1.examPointIds, ',');
          newIt.questionOutputDTO.questionTag1.children = (it.questionOutputDTO.questionTag1.children || []).map((iit) => {
            return {
              knowledgeIdList: strToArr(iit.knowledgeIds, ','),
              examPointIdList: strToArr(iit.examPointIds, ','),
            };
          });
          newIt.questionOutputDTO.questionTag2.knowledgeIdList = strToArr(it.questionOutputDTO.questionTag2.knowledgeIds, ',');
          newIt.questionOutputDTO.questionTag2.examPointIdList = strToArr(it.questionOutputDTO.questionTag2.examPointIds, ',');
          newIt.questionOutputDTO.questionTag2.children = (it.questionOutputDTO.questionTag2.children || []).map((iit) => {
            return {
              knowledgeIdList: strToArr(iit.knowledgeIds, ','),
              examPointIdList: strToArr(iit.examPointIds, ','),
            };
          });
          return newIt;
        });
      });
      const commoninfo = {
        gradeId: data.gradeId,
        subjectId: data.subjectId,
        name: data.name,
        questionCount: data.questionAmount,
        realQuestionsCount,
      };
      dispatch(setCommonInfo(fromJS(commoninfo)));
      dispatch(setPaperTitle(data.name));
      dispatch(setBigQuestionAction(fromJS(bigMsg)));
      dispatch(setQuestionsListAction(fromJS(questionsList)));
      dispatch(changePageState(1));
      // yield put(changeRealQuestionsCountAction(realQuestionsCount));
      dispatch(getKnowledgeAction());
      dispatch(getExamPointAction());

      // 调用该接口进行重置验证码
      this.captchaObj.reset();
    });
  }

  headerItem() {
    return [{
      name: '待审核',
      num: this.props.notGetPaperCount,
    }, {
      name: '已审核',
      num: this.props.hasGetPaperCount,
    }];
  }

  stateItem() {
    let res = [];
    const state = this.props.paperState || 0;
    if (state === 10) {
      res = [{ name: 'paperState', state: { 10: '待审核', 11: '已审核', 14: '审核中' }}, {
        name: 'control',
        state: { 10: '去审核', 11: '— —', 14: '继续审核' },
        clickBack: (paperState, val, index, i) => {
          // console.log(paperState, val, index, i, 'hhaah');
          if (paperState === 10) {
            this.captchaObj.verify();
            const paper = this.props.paperList.get(index);
            this.setState({
              paper
            });
          } else if (paperState === 14) {
            const paperItem = this.props.paperList.get(index) || fromJS({ id: -1 });
            // const id = paperItem.get('id');
            if (paperItem.get('id') === -1) {
              alert('获取试卷信息失败，请刷新后重试。');
              return;
            }
            this.props.dispatch(setEpid(paperItem));
            setTimeout(() => {
              this.props.dispatch(setBackAlertStatesAction(fromJS({
                buttonsType: '0',
                title: '试卷数据获取中...',
                titleStyle: { fontSize: '20px', fontWeight: 600, color: '#333', textAlign: 'center' },
                setChildren: () => <LoadingIndicator style={{ marginTop: 15 }} />,
              })));
              this.props.dispatch(changeBackPromptAlertShowAction(true));
              this.props.dispatch(getCurPaper());
            }, 20);
            // this.props.changePageState(1);
          } else if (paperState === 11) {
            // return fasle
            const paperItem = this.props.paperList.get(index) || fromJS({ id: -1 });
            const id = paperItem.get('id');
            this.props.dispatch(setToGet(id));
            this.props.dispatch(toggleDialogModal(true));
          }
        },
      }];
    } else if (state === 11) {
      res = [{
        name: 'paperState',
        state: Object.assign({}, paperStates, { 10: '待审核', 11: '已审核', 14: '审核中' })
      }, {
        name: 'control',
        state: Object.assign({}, paperStatesControl, { 10: '去审核', 11: '— —', 14: '— —' }),
        clickBack: (paperState, val, index, i) => {
          // console.log(paperState, val, index, i);
          // return false;
          if (paperState === 10) {
            const paperItem = this.props.paperList.get(index) || fromJS({ id: -1 });
            const id = paperItem.get('id');
            this.props.dispatch(setToGet(id));
            this.props.dispatch(toggleDialogModal(true));
          }
        },
      }];
    }
    return res;
  }

  markPaperList() {
    let content = '';
    let tablebodydata = fromJS([]);
    switch (this.props.pageState) {
      case 0:
        tablebodydata = this.props.paperList.toJS().map((item) => {
          return {
            paperName: item.name || '该试卷未输入名称',
            questionCount: item.questionAmount || 0,
            insertPerson: item.createUserName || ' ',
            refleshTime: formatDate('yyyy-MM-dd', new Date(item.updatedTime || new Date())),
            paperState: item.state || 10,
            control: item.state || 10,
          };
        });
        content = (<Table
          source={'paperTagsverify'}
          trItemList={trItemList}  // 必填，每列中取的属性名，数组形式
          rowList={rowList}  // 必填，
          headerItem={fromJS(this.headerItem())} // 必填，头部切换页 item
          tablebodydata={fromJS(tablebodydata)}  // 必填
          stateItem={this.stateItem()}  // stateItem：具有不同状态的某一项数据，可以添加 click 事件
          paperState={this.props.paperState - 10}
          changeReceiveState={(index) => {
            // console.log(index + 10, 'index');
            if (index + 10 !== this.props.paperState) {
              this.props.dispatch(setPageIndex(1));
            }
            this.props.dispatch(changePaperStateAction(index + 10));
            setTimeout(() => {
              this.props.dispatch(getPaperMsgAction());
            }, 30);
          }}
          orderItemsClick={(num) => this.props.changeOrder(num)}
          changePageNum={this.props.changePageNum}
          paperCount={this.props.paperState === 10 ? this.props.notGetPaperCount : this.props.hasGetPaperCount}  // 总试卷数量
          whoCanBeClick={this.props.paperState === 10 ? [10, 14] : []}  // 哪个状态的可以点击
          idLoading={this.props.dataIsGetting}
          pageIndex={this.props.pageIndex}
        />);
        break;
      default:
        break;
    }
    return content;
  }

  render() {
    const { pageState } = this.props;
    return (
      <Wrapper>
        {pageState === 0 ? this.markPaperList() : <EditTag />}
        <Modal
          title="确认领取？"
          visible={this.props.alertModalStates}
          onOk={() => {
            this.props.dispatch(toggleDialogModal(false));
            this.props.dispatch(toGetPaper());
          }}
          onCancel={() => this.props.dispatch(toggleDialogModal(false))}
        >
          <p>是否确定领取试卷？</p><p>领取后任务将保存至已审核列表。</p>
        </Modal>
      </Wrapper>

    );
  }
}

TagsVerify.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pageState: PropTypes.number.isRequired,
  paperList: PropTypes.instanceOf(immutable.List).isRequired,
  pageIndex: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  changePageState: PropTypes.func.isRequired,
  changePageNum: PropTypes.func.isRequired,
  dataIsGetting: PropTypes.bool.isRequired,  // 加载数据中...
  paperState: PropTypes.number.isRequired,
  notGetPaperCount: PropTypes.number.isRequired,
  hasGetPaperCount: PropTypes.number.isRequired,
  changeOrder: PropTypes.func.isRequired,
  alertModalStates: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  TagsVerify: makeSelectTagsVerify(),
  pageState: makePageState(),
  alertModalStates: makeAlertModalState(),
  paperState: makePaperState(),
  paperList: makePaperList(),
  hasGetPaperCount: makeHasGetPaperCount(),
  notGetPaperCount: makeNotGetPaperCount(),
  pageIndex: makePageIndex(),
  pageSize: makePageSize(),
  dataIsGetting: makeDataIsGetting(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    changePageState(num) {
      dispatch(changePageState(num));
    },
    changePageNum(page, size) {
      // console.log('changePageNum', page, size);
      dispatch(setPageIndex({ page, size }));
      dispatch(getPaperMsgAction());
    },
    changeOrder(num) {
      dispatch(setSort(num));
      dispatch(getPaperMsgAction());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TagsVerify);
