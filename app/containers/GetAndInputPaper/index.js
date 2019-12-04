/*
 *
 * GetAndInputPaper
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import immutable, { fromJS } from 'immutable';
import { FlexRow, FlexRowCenter, FlexColumn, FlexCenter, FadeIn, FadeOut, DivShadow } from 'components/FlexBox';
import { RootWrapper, PlaceHolderBox } from 'components/CommonFn/style';
import { formatDate, fetchUpdateImg, paperStates, paperStatesControl } from 'components/CommonFn';
import Table from 'components/Table';
import Alert from 'components/Alert';
import { makeDataIsGetting } from 'containers/LeftNavC/selectors';
import { changeVerifyCodeAction, getVerifyCodeAction } from 'containers/Header/actions';
import { message } from 'antd';
import { receiveEntryByGeetest } from './server';
import { gtInit } from 'utils/gtInit';

import { changePageStateAction, getPaperMsgAction, changePaperStateAction, changeAlertModalShowAction, changePaperNeedGetAction,
  getInputPaperTaskAction, changeNeedInputPaperAction, getCurPaper, changeSortAction, changePageIndexAction,
  setEpid
} from './actions';
import {
  makePageState, makeNotGetPaperCount, makeHasGetPaperCount, makePaperList, makePaperState, makeAlertModalShow,
  makeAlertModalStates,
  makePageIndex,
} from './selectors';
import EnteringWrapper from './enteringWrapper';

const ChildWrapper = styled.div`
  font-size: 14px;
  &>p {
    line-height: 2em!important;
  }
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

export class GetAndInputPaper extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.makeInputPaper = this.makeInputPaper.bind(this);
    this.headerItem = this.headerItem.bind(this);
    this.stateItem = this.stateItem.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.alertSureClick = this.alertSureClick.bind(this);
    this.changePage = this.changePage.bind(this);
    this.verifySuccess = this.verifySuccess.bind(this);
    this.captchaObj = null;
    this.state = {
      paperId: ''
    };
  }
  componentDidMount() {
    // this.props.dispatch(getPaperMsgAction());
    // 极验验证码配置
    this.verifyInit();
  }
  componentWillUnmount() {
    this.props.changePageState(0);
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
    receiveEntryByGeetest({
      id: this.state.paperId,
      challenge: result.geetest_challenge,
      validate: result.geetest_validate,
      seccode: result.geetest_seccode,
    }).then((res) => {
      if (res.code !== '0') {
        return message.error(res.message || '系统异常');
      }
      // 重新请求试卷列表
      this.props.dispatch(getPaperMsgAction());
      // 调用该接口进行重置验证码
      this.captchaObj.reset();
    });
  }

  headerItem() {
    return [{
      name: '待领取',
      num: this.props.notGetPaperCount,
    }, {
      name: '已领取',
      num: this.props.hasGetPaperCount,
    }];
  }
  stateItem() {
    const { dispatch, paperList } = this.props;
    let res = [];
    const state = this.props.paperState || 0;
    if (state === 4) {
      res = [{ name: 'paperState', state: { 4: '待领取' } }, {
        name: 'control',
        state: { 4: '领取' },
        clickBack: (paperState, val, index, i) => {
          // console.log(paperState, val, index, i);
          if (paperState === 4) {
            this.captchaObj.verify();
            const paperId = paperList.getIn([index, 'id']);
            this.setState({
              paperId
            });
            // this.props.changeAlertModalShow(true);
            /* const verifyCode = fromJS({
              source: 'inputPaper',
              onOk: () => {
                const id = paperList.getIn([index, 'id']);  // 获取该试卷数据
                dispatch(changePaperNeedGetAction(id));
                dispatch(getInputPaperTaskAction());
              },
              title: '领取录入任务',
            });
            dispatch(changeVerifyCodeAction('all', verifyCode));
            setTimeout(() => {
              dispatch(getVerifyCodeAction());
            }, 20); */
          }
        },
      }];
    } else if (state === 5) {
      res = [{ name: 'paperState', state: Object.assign({}, paperStates, { 5: '已领取', 6: '待审核', 7: '录入未通过', 13: '审核中' }) }, {
        name: 'control',
        state: Object.assign({}, paperStatesControl, { 5: '录入试卷', 6: '— —', 7: '重新录入', 13: '— —' }),
        clickBack: (paperState, val, index, i) => {
          if (paperState === 5 || paperState === 7) {
            const paperItem = this.props.paperList.get(index) || fromJS({ id: -1 });
            const id = paperItem.get('id');
            this.props.dispatch(changeNeedInputPaperAction(id, paperItem));
            this.props.dispatch(setEpid(id));
            this.props.dispatch(getCurPaper());
            if (id === -1) {
              alert('获取试卷信息错误');
            }
          }
        },
      }];
    }
    return res;
  }
  closeAlert() {
    this.props.changeAlertModalShow(false);
  }
  alertSureClick() {
    // 发领取请求
    this.props.dispatch(getInputPaperTaskAction());
    this.props.changeAlertModalShow(false);
  }
  changePage(pageIndex, pageSize) {
    console.log(pageIndex, pageSize, 'changePage');
    this.props.dispatch(changePageIndexAction(pageIndex));
    setTimeout(() => {
      this.props.dispatch(getPaperMsgAction());
    }, 10);
  }
  makeInputPaper() {
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
            paperState: item.state || 4,
            control: item.state || 4,
          };
        });
        content = (<Table
          source={'getandinputpaper'}
          trItemList={trItemList}  // 必填，每列中取的属性名，数组形式
          rowList={rowList}  // 必填，
          headerItem={fromJS(this.headerItem())} // 必填，头部切换页 item
          tablebodydata={fromJS(tablebodydata)}  // 必填
          stateItem={this.stateItem()}  // stateItem：具有不同状态的某一项数据，可以添加 click 事件
          paperState={this.props.paperState - 4}
          changeReceiveState={(index) => {
            if (index + 4 !== this.props.paperState) {
              this.props.dispatch(changePageIndexAction(1));
            }
            this.props.dispatch(changePaperStateAction(index + 4));
            setTimeout(() => {
              this.props.dispatch(getPaperMsgAction());
            }, 30);
          }}
          paperCount={this.props.paperState === 4 ? this.props.notGetPaperCount : this.props.hasGetPaperCount}  // 总试卷数量
          whoCanBeClick={[this.props.paperState, 7]}  // 哪个状态的可以点击
          changePageNum={this.changePage}
          orderItemsClick={(orderIndex) => {
            this.props.dispatch(changeSortAction(orderIndex));
          }}
          idLoading={this.props.dataIsGetting}
          pageIndex={this.props.pageIndex}
        />);
        break;
      case 2:
        content = <EnteringWrapper ></EnteringWrapper>;
        break;
      default:
        break;
    }
    return content;
  }
  render() {
    return (
      <RootWrapper className="root">
        {this.makeInputPaper()}
        {this.props.alertModalShow ? <Alert
          properties={Object.assign({
            buttonsType: '2-21',
            isOpen: this.props.alertModalShow,
            title: '领取录入任务',
            titleStyle: { fontSize: '20px', fontWeight: 600, color: '#333' },
            leftClick: this.closeAlert,
            rightClick: this.alertSureClick,
            child: ['取消', '确认'],
            buttonsIndent: 30,
          }, this.props.alertModalStates.toJS() || {})}
        ><ChildWrapper><p>是否确定领取试卷？</p><p>领取后任务将保存至已领取列表。</p></ChildWrapper></Alert> : ''}
      </RootWrapper>
    );
  }
}

GetAndInputPaper.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pageState: PropTypes.number.isRequired,
  changePageState: PropTypes.func.isRequired,
  notGetPaperCount: PropTypes.number.isRequired,  // 未领取试卷数量
  hasGetPaperCount: PropTypes.number.isRequired,  // 已领取试卷数量
  paperList: PropTypes.instanceOf(immutable.List).isRequired, // 表格数据列表
  paperState: PropTypes.number.isRequired,  // 页面状态
  alertModalShow: PropTypes.bool.isRequired,  // 弹框显示状态
  alertModalStates: PropTypes.instanceOf(immutable.Map).isRequired,  // 弹框可以覆盖的属性对象
  changeAlertModalShow: PropTypes.func.isRequired,  // 控制弹框显示状态
  dataIsGetting: PropTypes.bool.isRequired,  // 加载数据中...
  pageIndex: PropTypes.number.isRequired,
};

const mapStateToProps = createStructuredSelector({
  // GetAndInputPaper: makeSelectGetAndInputPaper(),
  pageState: makePageState(),

  notGetPaperCount: makeNotGetPaperCount(),
  hasGetPaperCount: makeHasGetPaperCount(),
  paperList: makePaperList(),
  paperState: makePaperState(),
  alertModalShow: makeAlertModalShow(),
  alertModalStates: makeAlertModalStates(),
  dataIsGetting: makeDataIsGetting(),
  pageIndex: makePageIndex(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    changePageState: (num) => dispatch(changePageStateAction(num)),
    changeAlertModalShow: (bol) => dispatch(changeAlertModalShowAction(bol)),
    // 点击事件进入录入
    goToEntering(epid) {
      // 设置epid
      dispatch(setEpid(epid));
      // 拉取试卷信息
      dispatch(getCurPaper());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GetAndInputPaper);
