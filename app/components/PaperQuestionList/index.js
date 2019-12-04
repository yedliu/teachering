/**
 *
 * PaperQuestionList
 *
 */

import React from 'react';
import styled from 'styled-components';
import immutable, { fromJS } from 'immutable';
import { FlexRow, FlexRowCenter, FlexColumn, FlexCenter } from 'components/FlexBox';
import { numberToChinese } from 'components/CommonFn';
import { PlaceHolderBox, textEllipsis } from 'components/CommonFn/style';
import Button from 'components/Button';
import AppLocalStorage from 'utils/localStorage';
import { Modal, Button as SmallBtn } from 'antd';
const deleteicon = window._baseUrl.imgCdn + '8de6436a-8a26-425d-b4b7-cfd7fc5a0155.png';
const deletehover = window._baseUrl.imgCdn + 'dbd0d230-3372-40e2-991b-d00379bbbfd7.png';
const deleteactive = window._baseUrl.imgCdn + 'b878b0a1-b767-414b-a0a1-f5731791e729.png';
const editicon = window._baseUrl.imgCdn + '0e4b5dad-ab61-4704-ae04-8e85fcad5f63.png';
const edithover = window._baseUrl.imgCdn + '43446367-5d98-4be4-bce7-bac3e1e0f096.png';
const editactive = window._baseUrl.imgCdn + 'aec806d0-4fc9-4eca-bf2b-a5add2101b6b.png';

// 右边
const PaperMsgWrapper = styled(FlexColumn)`
  min-width: 240px;
  max-width: 248px;
  margin-right: 10px;
  padding: 10px;
  // padding-right: 0;
  background: #fff;
  overflow-y: auto;
`;
const PaperMsgBox = styled.div`
  p {
    font-family: Microsoft YaHei;
  }
`;
const PageMsgValue = styled.p`
  padding: 5px 0;
  font-size: 15px;
  font-weight: 600;
  ${textEllipsis}
`;
const ButtonSeePaperMsg = styled(FlexCenter)`
  width: 102px;
  height: 22px;
  // padding: 0 15px;
  margin-top: 5px;
  color: #fff;
  border-radius: 6px;
  background: #ef414f;
  cursor: pointer;
  &:hover {
    background-color: #ff6c78;
  }
  &:active {
    background-color: #e43b49;
  }
`;
const QuestionArea = styled.div`
  margin-top: 20px;
`;
const QuestionAreaTitle = styled.p`
  padding: 3px 0;
  ${textEllipsis}
`;
const QuestionAreaContent = styled(FlexRow)`
  flex-flow: wrap;
  user-select: none;
`;
const QuestionItemIndex = styled(FlexCenter)`
  width: 30px;
  height: 30px;
  margin: ${(props) => (props.areaIndex % 6 === 5 ? '4px 0 4px' : '4px 8px 4px 0')};
  cursor: pointer;
  border-radius: 6px;
  background-color: ${(props) => backOneStyle(props, ['#fff', '#fff', '#ef4c4f', '#48A534'])};
  border: ${(props) => backOneStyle(props, ['1px solid #ef4c4f', '1px solid #ccc', 'none', 'none'])};
  color: ${(props) => backOneStyle(props, ['#ef4c4f', '#ccc', '#fff', '#fff'])};
  `;
const PaperSeeMsgWrapper = styled(FlexColumn) `
  min-height: 100px;
  border-bottom: 1px solid #ccc;
`;
const ButtonWrapper = styled(FlexRowCenter) ``;
const AddQuestionWrapper = styled(FlexColumn) `
  margin-top: 20px;
`;
const QuestionTitleWrapper = styled(FlexRowCenter) ``;
const ControlBox = styled(FlexRowCenter) ``;
const IconItem = styled.div`
  margin: 0 5px;
  width: 14px;
  height: 14px;
  background: #fff url(${props => props.icons.def}) no-repeat center center;
  background-size: 100%;
  cursor: pointer;
  &:hover {
    background: #fff url(${props => props.icons.hover}) no-repeat center center;
    background-size: 100%;
  };
  &:active {
    background: #fff url(${(props) => props.icons.active}) no-repeat center center;
    background-size: 100%;
  }
`;
const MsgItem = styled.p`
  margin: 0.5em 0;
`;

export const backOneStyle = (props, arr) => {
  let res = '';
  if (props.selected === props.index) {
    res = arr[0]; // 选中的
  } else if (props.errType === -1) {
    res = arr[1]; // 还未处理
  } else if (props.errType === 0) {
    res = arr[2]; // 处理-正确
  } else if (props.errType === 1) {
    res = arr[3]; // 处理-错误
  } else {
    res = arr[1];
  }
  return res;
};
const verifySourceList1 = ['papercutverify', 'paperinputverify'];
const verifySourceList2 = ['paperSetTags', 'paperTagsverify', 'paperShowPage'];

class PaperQuestionList extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      addBigQuestion: false,
      selectedBigIndex: -1,
      selectedSmallIndex: -1,
    };
    // 平行组卷权限
    this.parallelPermission = AppLocalStorage.getPermissions().includes('parallel_group_exam_paper');
  }
  componentDidMount() {
    const source = this.props.source;
    if (verifySourceList1.indexOf(source) > -1) {
      this.props.questionItemIndexClick(
        0,
        0,
        0,
        (this.props.questionsList || fromJS([{}])).get(0).toJS(),
        1,
      );
    } else if (source === 'getandcutpaper') {
      // this.props.questionItemIndexClick(0, 0, 0, (this.props.questionsList || fromJS([{}])).get(0).toJS());
    }
    this.questionList.addEventListener('contextmenu', e => {
      e.stopPropagation();
      e.preventDefault();
      console.dir(e.target, e.target.classList);
      if (Array.from(e.target.classList).indexOf('indexItem') > -1) {
        log('indexItem', e.target.innerText);
      }
      return false;
    });
  }
  render() {
    const { parallelMakePaper, showParallelBtn } = this.props;
    const othersData = this.props.othersData;
    let questionCount = 0;
    let errReasonList = fromJS([]);
    const questionResult = Boolean(othersData.questionResult);
    if (questionResult) {
      errReasonList = (othersData.questionResult || fromJS([])).map(item =>
        item.get('errState'),
      );
    }
    const questionList = this.props.questionsList || fromJS([]);
    // console.log(questionList.toJS(), 'questionList');
    const source = this.props.source;
    const questionSelectedIndex = this.props.questionSelectedIndex;
    // const userInfo = AppLocalStorage.getUserInfo() || {};
    // console.log(errReasonList.toJS(), 'errState');
    const PaperSimpleMsg =
      verifySourceList1.indexOf(source) > -1 ||
      verifySourceList2.indexOf(source) > -1
        ? this.props.toSeePaperMsg()
        : {};
    return (
      <PaperMsgWrapper innerRef={x => { this.questionList = x }}>
        <PaperMsgBox>
          {/* {['paperinputverify', 'paperSetTags', 'paperTagsverify'].indexOf(source) > -1 ? <PageMsgValue>试卷名称：<span style={{ color: '#333', fontFamily: 'Microsoft YaHei' }}>{this.props.othersData.paperTitle || ''}</span></PageMsgValue> :
            <PageMsgValue>试卷基本信息:</PageMsgValue>} */}
          {source === 'getandcutpaper' ? <ButtonSeePaperMsg onClick={this.props.seePaperMsg}>查看试卷信息</ButtonSeePaperMsg> : ''}
          {(verifySourceList1.indexOf(source) > -1) || verifySourceList2.indexOf(source) > -1 ? <PageMsgValue>试卷基本信息:</PageMsgValue> : ''}
          {(verifySourceList1.indexOf(source) > -1) || verifySourceList2.indexOf(source) > -1 ? <PaperSeeMsgWrapper>
            <MsgItem>{`试卷名：${PaperSimpleMsg.name || ''}`}</MsgItem>
            <MsgItem>{`试卷题目数量：${PaperSimpleMsg.questionCount || 0}`}</MsgItem>
            {source === 'paperShowPage' ? <MsgItem>{`审核通过题数：${PaperSimpleMsg.adoptNumber || 0}`}</MsgItem> : <MsgItem>{`可操作题目数：${PaperSimpleMsg.realQuestionsCount || 0}`}</MsgItem>}
            {source === 'paperinputverify' ? <MsgItem>{`录入者姓名：${PaperSimpleMsg.entryUserName || '— — —'}`}</MsgItem> : ''}
            {showParallelBtn && this.parallelPermission ? <MsgItem><SmallBtn type="primary" onClick={parallelMakePaper}>平行组卷</SmallBtn></MsgItem> : ''}
          </PaperSeeMsgWrapper> : ''}
          {questionList.map((item, index) => {
            return (
              <QuestionArea key={index}>
                <QuestionTitleWrapper>
                  <QuestionAreaTitle>{`${numberToChinese(
                    item.get('serialNumber'),
                  )}、${item.get('name')}`}</QuestionAreaTitle>
                  <PlaceHolderBox />
                  {['getandcutpaper', 'paperFinalVerify'].indexOf(source) >
                  -1 ? (
                    <ControlBox>
                      <IconItem
                        icons={{
                          def: editicon,
                          hover: edithover,
                          active: editactive,
                        }}
                        onClick={() => {
                          this.props.wantAddQuestion('big', 'edit', {
                            index,
                            name: item.get('name'),
                          });
                        }}
                      />
                      <IconItem
                        icons={{
                          def: deleteicon,
                          hover: deletehover,
                          active: deleteactive,
                        }}
                        onClick={() => {
                          if (questionList.count() <= 1) {
                            Modal.warning({
                              title: '系统提示',
                              content:
                                '试卷至少得有一道大题，如必须改动，请使用修改功能，或先添加大题再删除本题。',
                            });
                            return;
                          }
                          this.props.setPromptAlertStates(
                            fromJS({
                              // buttonsType: '1',
                              title: '删除大题',
                              setChildren: () => {
                                return (
                                  <FlexCenter
                                    style={{
                                      fontSize: 16,
                                      color: '#333',
                                      fontWeight: 600,
                                      height: 80,
                                    }}
                                  >
                                    确认要删除所选大题及其所有小题吗？
                                  </FlexCenter>
                                );
                              },
                              titleStyle: {
                                fontSize: '20px',
                                fontWeight: 600,
                                color: '#333',
                                textAlign: 'left',
                              },
                              leftClick: () => {
                                this.props.promptAlertShow(false);
                              },
                              rightClick: () => {
                                this.props.promptAlertShow(false);
                                this.props.removeQuestion('big', index);
                              },
                            }),
                          );
                          this.props.promptAlertShow(true);
                        }}
                      />
                    </ControlBox>
                  ) : (
                    ''
                  )}
                </QuestionTitleWrapper>
                <QuestionAreaContent>
                  {fromJS(new Array(item.get('count'))).map((it, i) => {
                    questionCount += 1;
                    let cur = questionCount;
                    // console.log(questionCount, 'questionCount -- 185');
                    return (
                      <QuestionItemIndex
                        className="indexItem"
                        index={questionCount}
                        selected={questionSelectedIndex}
                        errType={
                          questionResult
                            ? errReasonList.get(questionCount - 1)
                            : -1
                        }
                        areaIndex={i}
                        onClick={() => {
                          const selectedIndex = {
                            selectedBigIndex: index,
                            selectedSmallIndex: i,
                          };
                          this.props.questionItemIndexClick(
                            index,
                            i,
                            questionCount,
                            selectedIndex,
                            cur,
                          );
                        }}
                        key={i}
                      >
                        {questionCount}
                      </QuestionItemIndex>
                    );
                  })}
                </QuestionAreaContent>
              </QuestionArea>
            );
          })}
          {['getandcutpaper'].indexOf(source) > -1 ? (
            <AddQuestionWrapper>
              {/* 如果需要添加添加大题以及小题功能的话，请将上面一行注释，下面一行解注释后再编写具体逻辑 */}
              {/* {['getandcutpaper', 'paperFinalVerify'].indexOf(source) > -1 ? <AddQuestionWrapper> */}
              {/* {this.state.addBigQuestion ? <InputWrapper>
              <Input ref="input" placeholder="请输入大题名称"></Input>
              <BtnItem
                type="sure" onClick={() => {
                  this.props.addQuestion('big', this.refs.input.refs.input.value, questionList.count() + 1);
                  this.setState({ addBigQuestion: false });
                }}
              >确定</BtnItem>
              <BtnItem type="cancel" onClick={() => this.setState({ addBigQuestion: false })}>取消</BtnItem>
            </InputWrapper> :  */}
              <ButtonWrapper>
                <Button
                  showtype={4}
                  onClick={() => this.props.wantAddQuestion('big', 'add')}
                >
                  添加大题
                </Button>
                <PlaceHolderBox />
                {/* {source === 'paperFinalVerify' ? <SmallBtn onClick={() => this.props.wantAddQuestion('small', 'add')}>添加小题</SmallBtn> : ''} */}
              </ButtonWrapper>
            </AddQuestionWrapper>
          ) : (
            ''
          )}
        </PaperMsgBox>
      </PaperMsgWrapper>
    );
  }
}

PaperQuestionList.propTypes = {
  source: React.PropTypes.string.isRequired,
  questionsList: React.PropTypes.instanceOf(immutable.List).isRequired,
  questionSelectedIndex: React.PropTypes.number.isRequired,
  questionItemIndexClick: React.PropTypes.func.isRequired,
  seePaperMsg: React.PropTypes.func, // 查看试卷信息
  othersData: React.PropTypes.object.isRequired, // 用于传输非必需参数
  // addQuestion: React.PropTypes.func,   // 添加题目
  removeQuestion: React.PropTypes.func, // 移除题目
  wantAddQuestion: React.PropTypes.func, // 添加题目
  promptAlertShow: React.PropTypes.func,
  setPromptAlertStates: React.PropTypes.func,
  toSeePaperMsg: React.PropTypes.func,
};

export default PaperQuestionList;
