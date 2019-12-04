/*
 *
 * PersonMsgManager
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import immutable, { fromJS } from 'immutable';
import { filterHtmlForm } from 'components/CommonFn';
import styled from 'styled-components';
import { RootWrapper, PlaceHolderBox, WidthBox } from 'components/CommonFn/style';
import { FlexRow, FlexRowCenter, FlexCenter, FlexColumn } from 'components/FlexBox';
import {
  Button, message, Form, Input, Select,
  DatePicker, Table, Icon, Switch, Tag,
  Tabs, Alert, Spin,
} from 'antd';

import QRCode from 'qrcode.react';
import ShowQuestionItem from 'components/ShowQuestionItem';
import PaperQuestionList from 'components/PaperQuestionList';
import {
  changeEditStateAction, setUserMsgAction, submitChangeMsgAction, getUserMsgAction, setTagIndexAction,
  getPaymentInfo,
  getBankList,
  setPayInputDto,
  getProvinceIdAction,
  getAreaListAction,
  submitAction,
  setAreaListAction,
  getPersonPay,
  handleSelected,
  setPageIndex,
  setShowPaperMsgAction,
  setPersonalMsgAction,
  getPersonalMsgAction,
} from './actions';
import {
  makeUserMsg, makeEditState, makeStateNum, makeTagIndex,
  makePayInfo,
  makeInputDTO,
  makeBankList,
  makeProvinceList,
  makeAreaList,
  makeQrcodeUrl,
  makeSelectedDate,
  makePageIndex,
  makeSalarydata,
  makePaperdata,
  makeShowPaperMsg,
  makePersonalTableMsg,
} from './selectors';
import { SelectBox } from 'containers/StandardWagesManagement';
import { ButtonWrapper, ViewModal, ContentBox } from 'containers/addPaper';
import moment from 'moment';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const HeaderItem = styled(SelectBox)`
  width: 500px;
  margin-right:20px;
`;
const QRCodeImg = styled.div`
  width:128px;
  height:128px;
  margin-top:20px;
  display:${(props) => props.show ? 'block' : 'none'};
`;
const QRCodeWrap = styled(FlexColumn)`
  align-items:flex-start;
`;
const Header = styled(FlexRow)`
  padding: 0 20px;
  height: 50px;
  font-size: 16px;
  border-bottom: 3px solid #ddd;
  background: #fff;
`;
const MessageBoxWrapper = styled(FlexColumn)`
  flex: 1;
  padding: 20px;
  background: #fff;
  overflow-y:auto;
`;
const TopButton = styled(FlexRowCenter)`
  height: 50px;
`;
const ItemValue = styled.span`
  font-family: Microsoft YaHei;
  text-align: left;
  color: #333;
`;
const ButtonsWrapper = styled(FlexRowCenter)`
  padding-left: 100px;
  margin: 10px 0;
`;
const TableWrap = styled.div`
  margin: 15px auto;
  width: 90%;
`;
const FlexRowFoot = styled(FlexRow)`
  margin-top: 10px;
  justify-content: center;
  button {
    margin: 0 10px;
  }
`;
const Tips = styled.b`
  font-size: 16px;
  margin-right: 40px;
`;
const Item = styled(FlexRow)`
  margin: 5px 0;
  font-size: 16;
`;
const ItemLabel = styled.span`
  display: inline-block;
  min-width: 80px;
  text-align: right;
  margin-right: 20px;
`;
const showArr = [{
  type: 'name',
  value: '姓名',
}, {
  type: 'mobile',
  value: '电话',
}, {
  type: 'power',
  value: '角色',
}, {
  type: 'dataPower',
  value: '数据权限',
}];
const payFields = [
  { type: 'idCardNumber', name: '身份证' },
  { type: 'bankAccount', name: '银行账号' },
  { type: 'bankName', name: '开户银行' },
  { type: 'bankProvince', name: '' },
  { type: 'bankCity', name: '' },
  { type: 'bankBranch', name: '开户支行' },
  { type: 'bankAccountMobile', name: '预留电话' },
  { type: 'remark', name: '备注信息' }
];
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};

export class PersonMsgManager extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.makeMsg = this.makeMsg.bind(this);
    this.searchPersonPay = this.searchPersonPay.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.state = {
      clickIndex: -1,
      momery: {},
      questionIndexInner: 0,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.dispatch(getUserMsgAction());
    }, 1000);
    this.props.dispatch(getProvinceIdAction());
    this.props.dispatch(getBankList());
    this.props.dispatch(getPaymentInfo());
  }
  pageChange(current, size) {
    const { dispatch, personalTableMsg } = this.props;
    dispatch(setPersonalMsgAction(personalTableMsg.set('currentPageNumber', current)));
    setTimeout(() => {
      dispatch(getPersonalMsgAction());
    }, 30);
  }
  makeMsg() {
    const { userMsg, editState, dispatch } = this.props;
    let res = '';
    switch (this.props.stateNum) {
      case 0: // 加载
        res = (
          <MessageBoxWrapper style={{ minHeight: 250 }}>
            <FlexCenter style={{ flex: 1 }}>
              <Spin />
            </FlexCenter>
          </MessageBoxWrapper>
        );
        break;
      case 2:
        res = (
          <MessageBoxWrapper>
            {showArr.map((item, index) => (
              <Item style={{ alignItems: item.type === 'dataPower' ? 'flex-start' : 'center' }} key={index}>
                <ItemLabel>{item.value}:</ItemLabel>
                <span style={{ overflowY: item.type === 'dataPower' ? 'auto' : '' }}>
                  {editState && [0, 4].indexOf(index) > -1 ? (
                    <Input
                      placeholder={`请输入${item.value}`}
                      style={{ fontSize: 14 }}
                      value={userMsg.get(item.type)}
                      onChange={(e) => dispatch(setUserMsgAction(userMsg.set(item.type, e.target.value)))}
                    />
                  ) : (item.type === 'dataPower' ? userMsg.get(item.type).map((e, i) => <Tag key={i} style={{ marginBottom: 5 }} color="#87d068">{e}</Tag>) : userMsg.get(item.type) || '-')}</span>
              </Item>
            ))}
            <ButtonsWrapper>
              {editState ? (
                <FlexRow>
                  <Button type="primary" onClick={() => dispatch(submitChangeMsgAction())}>保存</Button>
                  <WidthBox width={20}></WidthBox>
                  <Button
                    onClick={() => {
                      dispatch(setUserMsgAction(fromJS(this.state.momery)));
                      dispatch(changeEditStateAction(false));
                    }}
                  >取消</Button>
                </FlexRow>
              )
                : (
                  <Button
                    type="danger"
                    onClick={() => {
                      this.setState({ momery: userMsg.toJS() });
                      dispatch(changeEditStateAction(true));
                    }}
                  >编辑</Button>
                )}
            </ButtonsWrapper>
          </MessageBoxWrapper>
        );
        break;
      case 3: // 数据异常
        res = (
          <MessageBoxWrapper style={{ minHeight: 250 }}>
            <FlexCenter style={{ flex: 1 }}>
              <Alert message="数据获取失败" type="error" showIcon />
            </FlexCenter>
          </MessageBoxWrapper>
        );
        break;
      default:
        break;
    }
    return res;
  }

  searchPersonPay() {
    const { dispatch } = this.props;
    setTimeout(() => {
      dispatch(getPersonPay());
    }, 10);
  }

  render() {
    const {
      dispatch, payInputDto, payInfo,
      setTagIndex, tagIndex, editState, bankList,
      formChange, areaList, provinceList, submit,
      qrcodeUrl, pageIndex, salarydata, showPaperMsg,
      selectedDate,
    } = this.props;
    const salarydataList = salarydata.getIn(['page', 'list']) || fromJS([]);
    // console.log('payInfo', payInfo);
    const payInfoFrage = () => {
      if (!editState) {
        return (
          <MessageBoxWrapper>
            {payFields.map((item, index) => {
              if (item.type === 'bankProvince') {
                return (
                  <Item key={index}>
                    <ItemLabel>开户地</ItemLabel>
                    <ItemValue>{`${payInfo.get('bankProvince') || ''}  ${payInfo.get('bankCity') || ''}`}</ItemValue>
                  </Item>
                );
              } else if (item.type === 'bankCity') {
                return '';
              } else {
                return (
                  <Item key={index}>
                    <ItemLabel>{item.name}</ItemLabel>
                    <ItemValue>{payInfo.get(item.type) || '-'}</ItemValue>
                  </Item>
                );
              }
            })}
            <ButtonsWrapper>
              {editState ? '' : <Button
                type="danger" onClick={() => {
                  dispatch(changeEditStateAction(true));
                }}
              >编辑</Button>}
            </ButtonsWrapper>
          </MessageBoxWrapper>
        );
      } else {
        return (
          <MessageBoxWrapper className="MessageBoxWrapper">
            <EditForm
              ref={(form) => {
                this.editform = form;
              }} {...payInputDto.toJS()}
              bankList={bankList}
              formChange={(v) => formChange(this.props, v)} provinceList={provinceList}
              areaList={areaList}
            >
            </EditForm>
            {qrcodeUrl ? (
              <div style={{ marginLeft: '17%' }}>
                <p style={{ color: 'red' }}>重要提示：请用手机扫描下方的二维码进行签约：</p>
                <QRCodeWrap>
                  <QRCodeImg show>
                    <QRCode value={qrcodeUrl} />
                  </QRCodeImg>
                </QRCodeWrap>
              </div>
            ) : ''}
            <ButtonsWrapper>
              <Button
                type="danger"
                onClick={() => {
                  submit(this);
                }}
              >提交</Button>
            </ButtonsWrapper>
          </MessageBoxWrapper>
        );
      }
    };

    // console.log('showPaperMsg', showPaperMsg.toJS());
    const paperData = showPaperMsg.get('paperData');
    const questionList = showPaperMsg.get('questionList') || fromJS([]);
    const bigMsg = showPaperMsg.get('bigMsg') || fromJS([]);
    const questionOutputDTO = questionList.getIn([this.state.questionIndexInner, 'questionOutputDTO']) || fromJS({});
    const showView = showPaperMsg.get('showView') || false;
    // console.log(salarydataList.toJS(), 'salarydataList');
    const handleOperationType = (operationType) => {
      let operation = '';
      switch (operationType) {
        case 1:
          operation = '切割';
          break;
        case 2:
          operation = '切割审核';
          break;
        case 3:
          operation = '录入';
          break;
        case 4:
          operation = '录入审核';
          break;
        case 5:
          operation = '贴标签';
          break;
        case 6:
          operation = '贴标签审核';
          break;
        case 7:
          operation = '系统判定切割逾期';
          break;
        case 8:
          operation = '系统判定录入逾期';
          break;
        case 9:
          operation = '系统判定贴标签逾期';
          break;
        case 10:
          operation = '终审';
          break;
        case 11:
          operation = '强制释放';
          break;
        default:
          break;
      }
      return operation;
    };
    const data = salarydataList.toJS().map((item, index) => {
      return {
        key: index,
        name: item.epName,
        number: item.questionAmount,
        operate: item.operationType,
        time: item.takeEffectTime,
        pay: item.salary,
        // operate2: item.id,
        // children: item.children.map((it) => ({ name: '-', number: '-', operate: '-', time: '', pay: it.salary, key: it.id })),
      };
    });
    // console.log(data, 'data');
    const columns = [{
      title: '试卷名称',
      dataIndex: 'name',
      // key: 'name',
      render: (text) => text || '-',
    }, {
      title: '题目数量',
      dataIndex: 'number',
      // key: 'number',
      render: (text) => text || '-',
    }, {
      title: '操作',
      dataIndex: 'operate',
      // key: 'operate',
      render: (text) => text ? handleOperationType(text) : '-',
    }, {
      title: '通过/完成时间',
      // key: 'time',
      dataIndex: 'time',
      render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm') : '-',
    }, {
      title: '工资金额',
      dataIndex: 'pay',
      // key: 'pay',
      render: (text) => text || '-',
    },
    ];

    const payDetail = () => {
      // 具体审核明细
      const stateEnum = {
        1: '通过',
        2: '未通过',
      };
      const expandedRowRender = (record, index) => {
        const children = salarydataList.getIn([index, 'children']);
        const columns = [
          { title: '题目编号', dataIndex: 'questionId' },
          { title: '通过/未通过', dataIndex: 'state', render: (state) => stateEnum[String(state)] },
          { title: '完成时间', dataIndex: 'updatedTime', render: (time) => time ? moment(time).format('YYYY-MM-DD HH:mm') : '-' },
          { title: '薪资明细', dataIndex: 'salary' },
          { title: '备注', dataIndex: 'remarks' },
        ];
        const data = [];
        children && children.map(it => {
          data.push({
            questionId: it.get('questionId'),
            state: it.get('state'),
            updatedTime: it.get('updatedTime'),
            salary: it.get('salary'),
            remarks: it.get('remarks') || '-',
          });
        });
        return (
          <Table
            columns={columns}
            dataSource={data}
            rowKey={record => record.id}
            pagination={false}
          />
        );
      };
      return (
        <MessageBoxWrapper style={{ padding: '10px 0' }}>
          <Header style={{ alignItems: 'center', minHeight: 50, borderWidth: '1px', paddingLeft: 48 }}>
            <HeaderItem>
              <span>开始时间：</span>
              <DatePicker
                allowClear={false}
                style={{ marginRight: 10 }}
                value={moment(selectedDate.get('startDate'), 'YYYY/MM/DD')}
                size="default" format="YYYY/MM/DD" onChange={(date) => {
                  // console.log(date, 'startDate');
                  if (date) {
                    dispatch(handleSelected('startDate', date));
                  }
                }}
              /><span>结束时间：</span>
              <DatePicker
                allowClear={false}
                value={moment(selectedDate.get('endDate'), 'YYYY/MM/DD')}
                size="default" format="YYYY/MM/DD" onChange={(date) => {
                  // console.log(data, 'endDate');
                  if (date) {
                    dispatch(handleSelected('endDate', date));
                  }
                }}
              />
            </HeaderItem>
            <Button
              type="primary" style={{ marginRight: 10 }} onClick={() => {
                dispatch(setPageIndex(1));
                this.searchPersonPay();
              }}
            >查询</Button>
            {/* <Button type='primary'>导出</Button> */}
          </Header>
          {/* <InfoWrap>
            <InfoBox>
            <header>基础薪资</header>
            <section>12345元</section>
          </InfoBox>
          <InfoBox>
            <header>奖惩补贴</header>
            <section>12345元</section>
          </InfoBox>
          <InfoBox>
            <header>应发薪资</header>
            <section>12345元</section>
          </InfoBox>
          </InfoWrap> */}
          <TableWrap>
            <Tips><Tag color="#2db7f5">试卷套数:</Tag>{salarydata.get('epCount')}</Tips>
            <Tips><Tag color="#2db7f5">题目总量:</Tag>{salarydata.get('questionCount')}</Tips>
            <Tips><Tag color="#2db7f5">复合题总量:</Tag>{salarydata.get('complexCount')}</Tips>
            <Table
              style={{ margin: '10px 0' }}
              columns={columns}
              dataSource={data}
              pagination={false}
              expandedRowRender={expandedRowRender}
              rowKey={(record) => record.key}
            />
          </TableWrap>
          <FlexRowFoot>
            <Button
              onClick={() => {
                dispatch(setPageIndex(1));
                this.searchPersonPay();
              }}
            >首页</Button>
            <Button
              onClick={() => {
                if (pageIndex === 1) {
                  message.info('已经是第一页了');
                } else {
                  dispatch(setPageIndex(pageIndex - 1));
                  this.searchPersonPay();
                }
              }}
            >上一页</Button>
            <Button
              onClick={() => {
                if (salarydataList.count() < 10) {
                  message.info('没有更多数据了');
                } else {
                  dispatch(setPageIndex(pageIndex + 1));
                  this.searchPersonPay();
                }
              }}
            >下一页</Button>
          </FlexRowFoot>
        </MessageBoxWrapper>
      );
    };
    return (<RootWrapper style={{ padding: 0 }}>
      {showView ? <ViewModal style={{ zIndex: 10 }}>
        <ButtonWrapper><PlaceHolderBox /><Button
          onClick={() => {
            const newShowPaperMsg = showPaperMsg.set('showView', false);
            this.props.dispatch(setShowPaperMsgAction(newShowPaperMsg));
            this.setState({ questionIndexInner: 1 });
          }}
        >返回</Button></ButtonWrapper>
        <ContentBox>
          <FlexColumn style={{ flex: 999 }}>
            <FlexRowCenter style={{ height: 40 }}>
              <PlaceHolderBox />
              <Switch
                onChange={(ckicked) => this.setState({ seeMobile: ckicked })} checked={this.state.seeMobile}
                checkedChildren="移动端预览" unCheckedChildren="PC预览"
              />
            </FlexRowCenter>
            <ShowQuestionItem
              subjectId={paperData.get('subjectId')}
              style={{ overflowY: 'auto' }}
              questionOutputDTO={questionOutputDTO}
              seeMobile={this.state.seeMobile}
              soucre="addpaper"
            />
          </FlexColumn>
          <div style={{ width: 0 }}></div>
          <FlexColumn style={{ border: '1px solid #ddd', marginLeft: '10px' }}>
            <PaperQuestionList
              source={'paperinputverify'}
              questionsList={bigMsg}
              questionSelectedIndex={this.state.questionIndexInner + 1}
              questionItemIndexClick={(a, b, c, d, e) => {
                // console.log(a, b, c, d, e, 'a, b, c, d, e');
                if (!filterHtmlForm(questionList.getIn([this.state.questionIndexInner, 'questionOutputDTO', 'title']))) {
                  message.warn('本题尚未录入。');
                }
                this.setState({ questionIndexInner: e - 1 });
              }}
              toSeePaperMsg={() => {
                return {
                  name: paperData.get('name'),
                  questionCount: paperData.get('questionAmount'),
                  realQuestionsCount: questionList.count(),
                  entryUserName: paperData.get('entryUserName')
                };
              }}
              othersData={{ questionResult: questionList.map((item) => item.get('questionOutputDTO')) }}
            />
          </FlexColumn>
        </ContentBox>
      </ViewModal> : ''}
      <Tabs animated defaultActiveKey="1" type="card" onChange={(key) => setTagIndex(key)} tabBarStyle={{ marginBottom: 0 }}>
        <TabPane tab={<span><Icon type="user" />个人信息</span>} key="1">{this.makeMsg()}</TabPane>
        <TabPane tab={<span><Icon type="pay-circle" />薪资与支付</span>} key="2" >{payInfoFrage()}</TabPane>
        <TabPane
          tab={<span><Icon type="pay-circle" />个人薪资明细</span>}
          key="3"
          onClick={() => {
            dispatch(setPageIndex(1));
            this.searchPersonPay();
          }}
        >{payDetail()}</TabPane>
      </Tabs>
    </RootWrapper>);
  }
}

const EditForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.formChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      bankAccountUsername: {
        ...props.bankAccountUsername,
        value: props.bankAccountUsername.value
      },
      idCardNumber: {
        ...props.idCardNumber,
        value: props.idCardNumber.value
      },
      bankAccount: {
        ...props.bankAccount,
        value: props.bankAccount.value
      },
      bankName: {
        ...props.bankName,
        value: props.bankName.value
      },
      bankProvince: {
        ...props.bankProvince,
        value: props.bankProvince.value
      },
      bankCity: {
        ...props.bankCity,
        value: props.bankCity.value
      },
      bankBranch: {
        ...props.bankBranch,
        value: props.bankBranch.value
      },
      bankAccountMobile: {
        ...props.bankAccountMobile,
        value: props.bankAccountMobile.value
      },
      remark: {
        ...props.remark,
        value: props.remark.value
      },
    };
  },
})(
  (props) => {
    const { form, bankList, provinceList, areaList } = props
    const { getFieldDecorator } = form
    let bank_option = bankList.toJS().map((e, i) => {
      return <Select.Option key={e.itemValue.toString()} value={e.itemValue.toString()}>{e.itemValue}</Select.Option>;
    });
    const proviceForm = provinceList.toJS().map((item, index) => {
      return <Select.Option key={index} value={item.name.toString()} title={item.name}>{item.name}</Select.Option>;
    });
    const cityForm = areaList.toJS().map((item, index) => {
      return <Select.Option key={index} value={item.name.toString()} title={item.name}>{item.name}</Select.Option>;
    });
    return (
      <div style={{ display: 'inline-block', width: '100%', verticalAlign: 'middle' }}>
        <Form className="form" style={{ width: '100%', height: 'auto' }}>
          <FlexColumn style={{ width: '100%', height: 'auto' }}>
            <FormItem {...formItemLayout} label="账户姓名">
              {getFieldDecorator('bankAccountUsername', {
                rules: [
                  {
                    required: true, message: '请输入账户姓名', validator: (rule, value, cb) => {
                      if ((!/^([\u4e00-\u9fa5])((·|[\u4e00-\u9fa5]+){1,4})?[\u4e00-\u9fa5]+([（(][\u4e00-\u9fa5]+[）)])?$/.test(value) || value.length < 2 || value.length > 10)) {
                        cb('请输入账户姓名');
                      } else {
                        cb();
                      }
                    }
                  }
                ],
                options: {
                  initialValue: ''
                }
              })(
                <Input placeholder="请输入账户姓名"></Input>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="身份证">
              {getFieldDecorator('idCardNumber', {
                rules: [
                  {
                    required: true, message: '请输入身份证', validator: (rule, value, cb) => {
                      if (/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/g.test(value)) {
                        cb();
                      } else {
                        cb('请输入身份证');
                      }
                    }
                  }
                ],
                options: {
                  initialValue: ''
                }
              })(
                <Input placeholder="请输入身份证"></Input>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="银行账号">
              {getFieldDecorator('bankAccount', {
                rules: [
                  {
                    required: true, message: '请输入正确银行账号', validator: (rule, value, cb) => {
                      if (/\d{15}|\d{19}/g.test(value)) {
                        cb();
                      } else {
                        cb('请输入正确银行账号');
                      }
                    }
                  }
                ],
                options: {
                  initialValue: ''
                }
              })(
                <Input placeholder="请输入银行账号"></Input>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="开户银行">
              {getFieldDecorator('bankName', {
                rules: [{
                  required: true, message: '请选择开户银行', validator: (rule, value, cb) => {
                    if (/[\u4e00-\u9fa5a-zA-Z]{2}$/g.test(value)) {
                      cb();
                    } else {
                      cb('请选择开户银行');
                    }
                  }
                }],
                options: {
                  initialValue: '-1'
                }
              })(
                <Select>
                  {bank_option}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="开户地 省">
              {getFieldDecorator('bankProvince', {
                rules: [{
                  required: true, message: '请选择', validator: (rule, value, cb) => {
                    if (value === '请选择') {
                      cb('请选择');
                    } else {
                      cb();
                    }
                  }
                }],
                options: {
                  initialValue: '请选择'
                }
              })(
                <Select>
                  <Select.Option key="-1" value="请选择">请选择</Select.Option>
                  {proviceForm}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="市">
              {getFieldDecorator('bankCity', {
                rules: [{
                  required: true, message: '请选择', validator: (rule, value, cb) => {
                    if (value === '请选择') {
                      cb('请选择');
                    } else {
                      cb();
                    }
                  }
                }],
                options: {
                  initialValue: '请选择'
                }
              })(
                <Select>
                  <Select.Option key="-1" value="请选择">请选择</Select.Option>
                  {cityForm}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="开户支行">
              {getFieldDecorator('bankBranch', {
                rules: [
                  {
                    required: true, message: '请输入开户支行'
                  }
                ],
                options: {
                  initialValue: ''
                }
              })(
                <Input placeholder="请输入开户支行"></Input>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="预留电话">
              {getFieldDecorator('bankAccountMobile', {
                rules: [
                  {
                    required: true, message: '请输入预留电话', validator: (rule, value, cb) => {
                      if (/^1\d{10}$/g.test(value)) {
                        cb();
                      } else {
                        cb('请输入预留电话');
                      }
                    }
                  }
                ],
                options: {
                  initialValue: ''
                }
              })(
                <Input placeholder="请输入预留电话"></Input>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="备注信息">
              {getFieldDecorator('remark', {
                rules: [
                  {
                    required: false
                  }
                ],
                options: {
                  initialValue: ''
                }
              })(
                <Input placeholder="备注信息"></Input>
              )}
            </FormItem>
          </FlexColumn>

        </Form>
      </div>
    );
  }
);

PersonMsgManager.propTypes = {
  dispatch: PropTypes.func.isRequired,
  userMsg: PropTypes.instanceOf(immutable.Map).isRequired,
  editState: PropTypes.bool.isRequired,
  stateNum: PropTypes.number.isRequired,
  showPaperMsg: PropTypes.instanceOf(immutable.Map).isRequired,
  personalTableMsg: PropTypes.instanceOf(immutable.Map).isRequired,
  selectedDate: PropTypes.instanceOf(immutable.Map).isRequired,
};

const mapStateToProps = createStructuredSelector({
  // PersonMsgManager: makeSelectPersonMsgManager(),
  userMsg: makeUserMsg(),
  editState: makeEditState(),
  stateNum: makeStateNum(),
  tagIndex: makeTagIndex(),
  payInfo: makePayInfo(),
  payInputDto: makeInputDTO(),
  bankList: makeBankList(),
  provinceList: makeProvinceList(),
  areaList: makeAreaList(),
  qrcodeUrl: makeQrcodeUrl(),
  selectedDate: makeSelectedDate(),
  pageIndex: makePageIndex(),
  salarydata: makeSalarydata(),
  paperdata: makePaperdata(),
  showPaperMsg: makeShowPaperMsg(),
  personalTableMsg: makePersonalTableMsg(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    setTagIndex(num) {
      dispatch(setTagIndexAction(num));
    },
    formChange(props, value) {
      let inputDTO = props.payInputDto;
      // console.log('formChange', value);
      if (value.idCardNumber) {
        inputDTO = inputDTO.set('idCardNumber', value.idCardNumber);
      }
      if (value.bankAccount) {
        inputDTO = inputDTO.set('bankAccount', value.bankAccount);
      }
      if (value.bankName) {
        inputDTO = inputDTO.set('bankName', value.bankName);
      }
      if (value.bankAccountUsername) {
        inputDTO = inputDTO.set('bankAccountUsername', value.bankAccountUsername);
      }
      if (value.bankProvince) {
        inputDTO = inputDTO.set('bankProvince', value.bankProvince).set('bankCity', { value: '请选择' });
        if (value.bankProvince.value && value.bankProvince.value !== '请选择') {
          setTimeout(() => {
            dispatch(getAreaListAction());
            dispatch(setAreaListAction(fromJS([])));
          }, 30);
        }
      }
      if (value.bankCity) {
        inputDTO = inputDTO.set('bankCity', value.bankCity);
      }
      if (value.bankBranch) {
        inputDTO = inputDTO.set('bankBranch', value.bankBranch);
      }
      if (value.bankAccountMobile) {
        inputDTO = inputDTO.set('bankAccountMobile', value.bankAccountMobile);
      }
      if (value.remark) {
        inputDTO = inputDTO.set('remark', value.remark);
      }
      dispatch(setPayInputDto(inputDTO));
    },
    submit(me) {
      // console.log('submit');
      me.editform.validateFields((err, values) => {
        if (err) {
          message.warning('请完善内容');
          return;
        }
        dispatch(submitAction());
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonMsgManager);
