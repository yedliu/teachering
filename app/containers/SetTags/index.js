/*
 *
 * SetTags
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import immutable, { fromJS } from 'immutable';
import styled from 'styled-components';
import { FlexColumn } from 'components/FlexBox';
import { createStructuredSelector } from 'reselect';
import {
  formatDate,
  paperStates,
  paperStatesControl,
} from 'components/CommonFn';
import { makeDataIsGetting } from 'containers/LeftNavC/selectors';
import { setBackAlertStatesAction } from 'containers/LeftNavC/actions';
import LoadingIndicator from 'components/LoadingIndicator';
import PaperShowPage from 'containers/PaperShowPage';
import makeSelectSetTags, {
  makePageState,
  makeAlertModalState,
  makePaperState,
  makePaperList,
  makeHasGetPaperCount,
  makeNotGetPaperCount,
  makePageSize,
  makePageIndex,
  makePaperVerifyRes,
  makePaperMsg,
  makeQuestionTypeList,
  makeCommonInfo,
  makeBigMsg,
  getExamPointList,
  getKnowledgeList,
  makeSelectedPaperStateIndex,
} from './selectors';
import {
  changePaperStateAction,
  getPaperMsgAction,
  setEpid,
  changePageState,
  toggleDialogModal,
  toGetPaper,
  setPageIndex,
  setSort,
  getCurPaperAction,
  getPaperMsgToSeeAction,
  getQuestionTypeListAction,
  changeSelectedPaperStateIndexAction,
} from './actions';
import { Modal, message } from 'antd';
import EditTag from './tags';
import Table from 'components/Table';
import { receiveTagByGeetest } from './server';
import { gtInit } from 'utils/gtInit';
// import Alert from 'components/Alert';
require('katex/dist/katex.min.css');

const Wrapper = styled(FlexColumn)`
  background: #fff;
  padding: ${props => (props.pageState === 2 ? '0' : '20px')};
`;
const trItemList1 = [
  'paperName',
  'insertPerson',
  'refleshTime',
  'paperState',
  'control',
];
const trItemList = [
  'paperName',
  'questionCount',
  'insertPerson',
  'refleshTime',
  'paperState',
  'control',
];
const rowList1 = [
  {
    name: '试卷名称',
    scale: 4,
  },
  {
    name: '上传者',
    scale: 1.5,
  },
  {
    name: '更新时间',
    scale: 1.5,
  },
  {
    name: '状态',
    scale: 1.5,
  },
  {
    name: '操作',
    scale: 2,
  },
];
const rowList = [
  {
    name: '试卷名称',
    scale: 4,
  },
  {
    name: '题目数量',
    scale: 1,
  },
  {
    name: '上传者',
    scale: 1.5,
  },
  {
    name: '更新时间',
    scale: 1.5,
  },
  {
    name: '状态',
    scale: 1.5,
  },
  {
    name: '操作',
    scale: 2,
  },
];

export class SetTags extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.markPaperList = this.markPaperList.bind(this);
    this.headerItem = this.headerItem.bind(this);
    this.stateItem = this.stateItem.bind(this);
    this.verifySuccess = this.verifySuccess.bind(this);
    this.captchaObj = null;
    this.state = {
      paperId: '',
    };
    // this.closeAlert = this.closeAlert.bind(this);
    // this.alertSureClick = this.alertSureClick.bind(this);
  }
  componentDidMount() {
    this.props.dispatch(getQuestionTypeListAction());
    // 极验验证码配置
    this.verifyInit();
  }

  verifyInit() {
    // 请求配置接口
    gtInit().then(captchaObj => {
      this.captchaObj = captchaObj;
      // 绑定验证成功失败事件
      this.captchaObj.onSuccess(this.verifySuccess);
      this.captchaObj.onError(e => {
        message.error(e.message || '系统错误');
      });
    });
  }

  verifySuccess() {
    let result = this.captchaObj.getValidate();
    if (!result) {
      return message.error('请完成验证');
    }
    receiveTagByGeetest({
      id: this.state.paperId,
      challenge: result.geetest_challenge,
      validate: result.geetest_validate,
      seccode: result.geetest_seccode,
    }).then(res => {
      if (res.code !== '0') {
        return message.error(res.message || '系统异常');
      }
      // 重新请求试卷列表
      this.props.dispatch(getPaperMsgAction());
      // 调用该接口进行重置验证码
      this.captchaObj.reset();
    });
  }

  // componentWillUpdate() {
  //   return true;
  // }
  headerItem() {
    return [
      {
        name: '待领取',
        num: this.props.notGetPaperCount,
      },
      {
        name: '已领取',
        num: this.props.hasGetPaperCount,
      },
    ];
  }
  stateItem() {
    let res = [];
    const state = this.props.paperState || 0;
    if (state === 8) {
      res = [
        { name: 'paperState', state: { 8: '待领取', 9: '已领取' }},
        {
          name: 'control',
          state: { 8: '领取', 9: '--' },
          clickBack: (paperState, val, index, i) => {
            // console.log(paperState, val, index, i);
            if (paperState === 8) {
              this.captchaObj.verify();
              const paperItem =
                this.props.paperList.get(index) || fromJS({ id: -1 });
              const paperId = paperItem.get('id');
              this.setState({
                paperId,
              });
              /* const paperItem = this.props.paperList.get(index) || fromJS({ id: -1 });
            const id = paperItem.get('id');
            this.props.dispatch(setToGet(id));
            // this.props.dispatch(toggleDialogModal(true));
            const verifyCode = fromJS({
              source: 'setTags',
              onOk: () => dispatch(toGetPaper()),
              title: '领取标注任务',
            });
            dispatch(changeVerifyCodeAction('all', verifyCode));
            setTimeout(() => {
              dispatch(getVerifyCodeAction());
            }, 20); */
            }
          },
          // changePaper: () => this.props.dispatch(getPaperMsgAction()),
        },
      ];
    } else if (state === 9) {
      res = [
        {
          name: 'paperState',
          state: Object.assign({}, paperStates, { 8: '待领取', 9: '已领取' }),
        },
        {
          name: 'control',
          state: Object.assign({}, paperStatesControl, {
            8: '— —',
            9: '标注试卷',
            11: '查看详情',
            18: '查看详情',
            17: '查看详情',
          }),
          clickBack: (paperState, val, index, i) => {
            // console.log(paperState, val, index, i, 'clickBack');
            if (paperState === 9) {
              const paperItem =
                this.props.paperList.get(index) || fromJS({ id: -1 });
              const id = paperItem.get('id');
              if (id === -1) {
                alert('警告，获取试卷信息错误');
                return;
              }
              this.props.dispatch(setEpid(id));
              // this.props.dispatch(getCurPaper())
              // this.props.changePageState(1);
              setTimeout(() => {
                this.props.dispatch(getCurPaperAction());
                this.props.dispatch(
                  setBackAlertStatesAction(
                    fromJS({
                      buttonsType: '0',
                      title: '试卷数据获取中...',
                      titleStyle: {
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#333',
                        textAlign: 'center',
                      },
                      setChildren: () => (
                        <LoadingIndicator style={{ marginTop: 15 }} />
                      ),
                    }),
                  ),
                );
                // this.props.dispatch(changeBackPromptAlertShowAction(true));
              }, 30);
            } else if ([11, 17, 18].includes(paperState)) {
              // console.log('这里是不是该看详情了？');
              const paperItem =
                this.props.paperList.get(index) || fromJS({ id: -1 });
              const id = paperItem.get('id');
              this.props.dispatch(setEpid(id));
              if (id === -1) alert('警告，获取试卷信息错误');
              setTimeout(() => {
                this.props.dispatch(getPaperMsgToSeeAction());
                this.props.dispatch(
                  setBackAlertStatesAction(
                    fromJS({
                      buttonsType: '0',
                      title: '试卷数据获取中...',
                      titleStyle: {
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#333',
                        textAlign: 'center',
                      },
                      setChildren: () => (
                        <LoadingIndicator style={{ marginTop: 15 }} />
                      ),
                    }),
                  ),
                );
                // this.props.dispatch(changeBackPromptAlertShowAction(true));
              }, 30);
              // const paperItem = this.props.paperList.get(index) || fromJS({ id: -1 });
              // const id = paperItem.get('id');
              // this.props.dispatch(setToGet(id));
              // this.props.dispatch(toggleDialogModal(true));
            }
          },
        },
      ];
    }
    return res;
  }
  markPaperList() {
    let content = '';
    let tablebodydata = fromJS([]);
    switch (this.props.pageState) {
      case 0:
        tablebodydata = this.props.paperList.toJS().map(item => {
          return {
            paperName: item.name || '该试卷未输入名称',
            questionCount: item.questionAmount || 0,
            insertPerson: item.createUserName || ' ',
            refleshTime: formatDate(
              'yyyy-MM-dd',
              new Date(item.updatedTime || new Date()),
            ),
            paperState: item.state || 8,
            control: item.state || 8,
          };
        });
        content = (
          <Table
            // source={'getandinputpaper'}
            source={'paperSetTags'}
            trItemList={this.props.paperState === 8 ? trItemList1 : trItemList} // 必填，每列中取的属性名，数组形式
            rowList={this.props.paperState === 8 ? rowList1 : rowList} // 必填，
            headerItem={fromJS(this.headerItem())} // 必填，头部切换页 item
            tablebodydata={fromJS(tablebodydata)} // 必填
            stateItem={this.stateItem()} // stateItem：具有不同状态的某一项数据，可以添加 click 事件
            paperState={this.props.paperState - 8}
            changeReceiveState={index => {
              // console.log(index + 8, this.props.paperState, 'index');
              if (index + 8 !== this.props.paperState) {
                this.props.dispatch(setPageIndex(1));
              }
              this.props.dispatch(changePaperStateAction(index + 8));
              setTimeout(() => {
                this.props.dispatch(getPaperMsgAction());
              }, 30);
            }}
            orderItemsClick={num => this.props.changeOrder(num)}
            changePageNum={this.props.changePageNum}
            paperCount={
              this.props.paperState === 8
                ? this.props.notGetPaperCount
                : this.props.hasGetPaperCount
            } // 总试卷数量
            whoCanBeClick={[this.props.paperState, 11, 17, 18]} // 哪个状态的可以点击
            idLoading={this.props.dataIsGetting}
            pageIndex={this.props.pageIndex}
            noPageTurning={this.props.paperState === 8 ? true : false}
            selectedIndex={this.props.selectedPaperStateIndex}
            changeSelectedPaperStateIndex={num => {
              // console.log(num, 'changeSelectedPaperStateIndex - setTags');
              this.props.dispatch(changeSelectedPaperStateIndexAction(num));
            }}
          />
        );
        break;
      case 1:
        content = <EditTag />;
        break;
      case 2:
        content = (
          <PaperShowPage
            dataList={this.props.paperVerifyRes}
            changePaperState={this.props.changePageState}
            paperMsg={this.props.paperMsg}
            typeList={this.props.questionTypeList}
            commonInfo={this.props.commonInfo}
            bigMsg={this.props.bigMsg}
            knowledgeList={this.props.knowledgeList}
            examPointList={this.props.examPointList}
          />
        );
        break;
      default:
        break;
    }
    return content;
  }
  render() {
    /*
      const { pageState } = this.props;
      let res = '';
      if (pageState === 0) {
        res = this.markPaperList();
      } else if (pageState === 1) {
        res = <EditTag />;
      } else if (pageState === 2) {
        res = (<PaperShowPage
          dataList={this.props.paperVerifyRes}
          changePaperState={this.props.changePageState}
          paperMsg={this.props.paperMsg}
          typeList={this.props.questionTypeList}
          commonInfo={this.props.commonInfo}
          bigMsg={this.props.bigMsg}
          knowledgeList={this.props.knowledgeList}
          examPointList={this.props.examPointList}
        />);
      }
      const res = this.markPaperList();
    */
    return (
      <Wrapper pageState={this.props.pageState}>
        {/* {pageState === 0 ? this.markPaperList() : <EditTag />} */}
        {/* {res} */}
        {this.markPaperList()}
        <Modal
          title="确认领取？"
          visible={this.props.alertModalStates}
          onOk={() => {
            this.props.dispatch(toggleDialogModal(false));
            this.props.dispatch(toGetPaper());
          }}
          onCancel={() => this.props.dispatch(toggleDialogModal(false))}
        >
          <p>是否确定领取试卷？</p>
          <p>领取后任务将保存至已领取列表。</p>
        </Modal>
        {/* <ChildrenTags /> */}
      </Wrapper>
    );
  }
}
SetTags.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pageState: PropTypes.number.isRequired,
  paperList: PropTypes.instanceOf(immutable.List).isRequired,
  pageIndex: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  changePageState: PropTypes.func.isRequired,
  changePageNum: PropTypes.func.isRequired,
  dataIsGetting: PropTypes.bool.isRequired, // 加载数据中...
  paperState: PropTypes.number.isRequired,
  changeOrder: PropTypes.func.isRequired,
  notGetPaperCount: PropTypes.number.isRequired,
  hasGetPaperCount: PropTypes.number.isRequired,
  alertModalStates: PropTypes.bool.isRequired,
  paperVerifyRes: PropTypes.instanceOf(immutable.List).isRequired,
  paperMsg: PropTypes.instanceOf(immutable.Map).isRequired,
  questionTypeList: PropTypes.instanceOf(immutable.List).isRequired,
  commonInfo: PropTypes.instanceOf(immutable.Map).isRequired,
  bigMsg: PropTypes.instanceOf(immutable.List).isRequired,
  examPointList: PropTypes.instanceOf(immutable.List).isRequired,
  knowledgeList: PropTypes.instanceOf(immutable.List).isRequired,
  selectedPaperStateIndex: PropTypes.number.isRequired,
};

const mapStateToProps = createStructuredSelector({
  SetTags: makeSelectSetTags(),
  pageState: makePageState(),
  alertModalStates: makeAlertModalState(),
  paperState: makePaperState(),
  paperList: makePaperList(),
  hasGetPaperCount: makeHasGetPaperCount(),
  notGetPaperCount: makeNotGetPaperCount(),
  pageIndex: makePageIndex(),
  pageSize: makePageSize(),
  dataIsGetting: makeDataIsGetting(),
  paperVerifyRes: makePaperVerifyRes(),
  paperMsg: makePaperMsg(),
  questionTypeList: makeQuestionTypeList(),
  commonInfo: makeCommonInfo(),
  bigMsg: makeBigMsg(),
  examPointList: getExamPointList(),
  knowledgeList: getKnowledgeList(),
  selectedPaperStateIndex: makeSelectedPaperStateIndex(),
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SetTags);
