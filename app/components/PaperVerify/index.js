/**
 *
 * PaperVerify
 *
 */

import React from 'react';
import { fromJS } from 'immutable';
import styled from 'styled-components';
import {
  FlexRow,
  FlexRowCenter,
  FlexColumn,
  FlexCenter,
} from 'components/FlexBox';
import { numberToChinese } from 'components/CommonFn';
import { PlaceHolderBox } from 'components/CommonFn/style';
import PaperQuestionList from 'components/PaperQuestionList';
import Button from 'components/Button';

const CutPaperWrapper = styled(FlexColumn)`
  height: 100%;
  width: 100%;
  span {
    user-select: none;
  }
`;
const TopButtonsBox = styled(FlexRowCenter)`
  height: 50px;
  background: #fff;
  padding: 0 10px;
`;
const PaperWrapper = styled(FlexRow)`
  flex: 1;
  padding: 15px 0;
  background: #eee;
`;
// 左边
const PaperWrapperBox = styled(FlexColumn)`
  flex: 1;
  margin: 0 10px;
  background: white;
  overflow-y: auto;
`;
const ImageCutWrapper = styled(FlexColumn)`
  height: 620px;
  padding: 5px;
  border-bottom: 1px solid #ddd;
`;
const QuestionPreviewScroll = styled.div`
  flex: 1;
  overflow-y: auto;
`;
const QuestionPreview = styled.img`
  max-width: 100%;
  height: auto;
`;
const QuestionMsg = styled.div`
  // height: 200px;
  overflow-y: auto;
`;
const QuestionMsgWrapper = styled(FlexRowCenter)`
  height: 40px;
  border: 1px solid #eee;
`;
const BigQuestionWrapper = styled(FlexRowCenter)`
  font-size: 16px;
  font-weight: 600;
`;
const BigName = styled.span`
  text-indent: 20px;
`;
const SmallQuestionWrapper = styled(FlexRowCenter)`
  margin-left: 40px;
  font-size: 14px;
`;
const SmallNum = styled.span`
  margin-right: 20px;
`;
const SmallType = styled.span``;
const ButtonsWrapper = styled(FlexRowCenter)`
  height: 50px;
  font-size: 16px;
  padding-right: 20px;
`;
const ErrDescriptWrapper = styled(FlexColumn)`
  flex: 1;
  padding: 0 20px;
`;
const ErrMsgWrapper = styled(FlexColumn)`
  flex: 1;
`;
const ErrMsgTitleValue = styled.p`
  font-size: 14px;
`;
const Textarea = styled.div`
  flex: 1;
  padding-top: 10px;
`;
const ErrTextDescription = styled.textarea`
  width: 460px;
  height: 150px;
  border: 1px solid #ccc;
  resize: none;
  padding: 10px;
  outline: none;
`;
const QuestionChangeButtons = styled(FlexCenter)`
  height: 80px;
`;
const QuestionRightWrapper = styled(FlexRowCenter)``;
const QuestionRadiusBox = styled.div`
  width: 16px;
  height: 16px;
  margin: 0 5px 0 20px;
  border: ${props => {
    let res = '';
    if (props.me === 'err') {
      res = props.right === 0 ? '4px solid #EF4C4F' : '1px solid #ccc';
    } else if (props.me === 'right') {
      res = props.right === 1 ? '4px solid #2EAC43' : '1px solid #ccc';
    }
    return res;
  }};
  border-radius: 50%;
`;

function PaperVerify(me) {
  const questionMsgList = me.props.questionMsgList || fromJS([]);
  const questionIndex = me.props.questionSelectedIndex - 1;
  const currentQuestion = questionMsgList.get(questionIndex);
  const questionResult = me.props.questionResult.toJS();
  return (
    <CutPaperWrapper>
      <TopButtonsBox>
        <Button showtype={6} onClick={() => me.props.changePageState(0)}>
          {'<'} 返回
        </Button>
        <PlaceHolderBox />
        <Button showtype={4} onClick={me.submitClick}>
          提交
        </Button>
      </TopButtonsBox>
      <PaperWrapper>
        <PaperWrapperBox>
          <ImageCutWrapper innerRef={el => { me.scrollDom = el }}>
            <QuestionPreviewScroll>
              <QuestionPreview src={me.props.previewImgSrc} />
            </QuestionPreviewScroll>
          </ImageCutWrapper>
          <QuestionMsg>
            <QuestionMsgWrapper>
              <BigQuestionWrapper>
                <BigName>{`大题编号与名称：${numberToChinese(
                  currentQuestion.get('bigNum'),
                )}、${currentQuestion.get('bigName')}`}</BigName>
              </BigQuestionWrapper>
              <SmallQuestionWrapper>
                <SmallNum>题号：{currentQuestion.get('serialNumber')}</SmallNum>
                <SmallType>
                  题型：
                  {me.props.questionTypeList
                    .filter(
                      item =>
                        item.get('id') ===
                        Number(currentQuestion.get('questionTypeId')),
                    )
                    .get(0)
                    .get('name')}
                </SmallType>
              </SmallQuestionWrapper>
            </QuestionMsgWrapper>
            <ButtonsWrapper>
              <PlaceHolderBox />
              {
                <QuestionRightWrapper
                  onClick={() => {
                    const errItem = questionResult[questionIndex];
                    errItem.auditResult = false;
                    errItem.errState = 0;
                    questionResult[questionIndex] = errItem;
                    me.props.changeQuestionResult(questionResult);
                    me.props.changeErrTextareaShow(true);
                    me.scrollDom.style.height = '435px';
                    me.props.cahngeQuestionResultState(0);
                  }}
                >
                  <QuestionRadiusBox
                    me={'err'}
                    right={me.props.questionResultState}
                  />
                  <span>审核不通过</span>
                </QuestionRightWrapper>
              }
              <QuestionRightWrapper
                onClick={() => {
                  // const questionResult = me.props.questionResult.toJS();
                  const errItem = questionResult[questionIndex];
                  errItem.auditResult = true;
                  errItem.errReason = '';
                  errItem.errState = 1;
                  questionResult[questionIndex] = errItem;
                  me.props.changeQuestionResult(questionResult);
                  me.props.changeErrTextareaShow(false);
                  me.scrollDom.style.height = '620px';
                  me.props.cahngeQuestionResultState(1);
                }}
              >
                <QuestionRadiusBox
                  me={'right'}
                  right={me.props.questionResultState}
                />
                <span>审核通过</span>
              </QuestionRightWrapper>
            </ButtonsWrapper>
          </QuestionMsg>
          {me.props.errTextareaShow ? (
            <ErrDescriptWrapper>
              <ErrMsgWrapper>
                <ErrMsgTitleValue>填写错误描述：</ErrMsgTitleValue>
                <Textarea>
                  <ErrTextDescription
                    defaultValue={me.props.questionResult
                      .get(questionIndex)
                      .get('errReason')}
                    onInput={me.textareaInput}
                  />
                </Textarea>
              </ErrMsgWrapper>
            </ErrDescriptWrapper>
          ) : (
            ''
          )}
          <QuestionChangeButtons>
            <Button
              showtype={5}
              style={{ margin: '0 50px' }}
              onClick={me.preQuestionClick}
            >
              上一题
            </Button>
            <Button
              showtype={4}
              style={{ margin: '0 50px' }}
              onClick={me.nextQuestionClick}
            >
              下一题
            </Button>
          </QuestionChangeButtons>
        </PaperWrapperBox>
        <PaperQuestionList
          source={'papercutverify'}
          questionsList={me.props.questionsList}
          questionSelectedIndex={me.props.questionSelectedIndex}
          questionItemIndexClick={me.questionItemIndexClick}
          seePaperMsg={() => ''}
          othersData={{
            questionResult: me.props.questionResult,
          }}
        />
      </PaperWrapper>
    </CutPaperWrapper>
  );
}

PaperVerify.propTypes = {};

export default PaperVerify;
