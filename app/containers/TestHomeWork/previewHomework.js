/*
 *
 * PreviewHomeWork
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import Helmet from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import immutable, { fromJS } from 'immutable';
import { createStructuredSelector } from 'reselect';
import { FlexRow, FlexRowCenter, FlexColumn, FlexCenter, FadeIn, FadeOut, DivShadow } from 'components/FlexBox';
import { PlaceHolderBox, WidthBox, questionContentStyle, filterHtmlForm, renderToKatex } from 'components/CommonFn/style';
import { letterOptions, addImgSrc } from 'components/CommonFn';
import Button from 'components/Button';
import styled, { css } from 'styled-components';
import { Select, Tree, Pagination, Input, InputNumber, Icon, message } from 'antd';
import Modal from 'react-modal';
import ShowPreviewQuestion from 'components/ShowPreviewQuestion';
import { HomeworkInforContent, customStyles } from 'containers/StandHomeWork/createHomeWorkStyle';
// import {
//   changePreviewModalShowStateAction,
//   editorHomeworkAction,
//   changeShowAnalysisAction,
//   setTestHomeworkItemAction,
//   changeHomeworkPaperItemAcction,
//   changeIsEditorOrReviseStateAction,
//   changeHomeworkTypeAction,
// } from './actions';
// import {
//   makeShowAnalysis,
// } from './selectors';
// import messages from './messages';

const PreviewWrapper = styled(FlexColumn) `
  min-width: 800px;
  height: 100%;
  .question-index {
    font-size: 16px;
  }
  .title-content {
    padding: 0;
  }
`;
const PreviewHeaderWrapper = styled(FlexColumn) `
  border-bottom: 1px solid #ddd;
  padding: 0 20px;
  min-height: 140px;
`;
const HeaderButtons = styled(FlexRowCenter) `
  height: 50px;
`;
const PaperName = styled.div`
  line-height: 30px;
  font-size: 17px;
  font-weight: 600;
`;

// const customStyles = {
//   content: {
//     top: '50%',
//     left: '50%',
//     right: 'auto',
//     bottom: 'auto',
//     padding: 0,
//     marginRight: '-50%',
//     minHeight: '240px',
//     maxHeight: '80%',
//     minWidth: '485px',
//     maxWidth: '80%',
//     animation: `${FadeIn} .5s linear`,
//     transform: 'translate(-50%, -50%)',
//     // boxShadow: '0px 8px 24px rgba(0, 0, 0, .2)',
//     borderRadius: '6px',
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   overlay: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: 99,
//     backgroundColor: 'rgba(0, 0, 0, 0.3)',
//   },
// };
const QuestionNumWrapper = styled(FlexRowCenter) `
  height: 30px;
`;
const QuestionCount = styled.div`
  color: rgb(255, 126, 48);
`;
const QuestionUsetCount = styled(QuestionCount) ``;
const ControlWrapper = styled(FlexRowCenter) `
  height: 40px;
  padding: 0 20px;
`;
const FilterQuestionNumber = styled.div`
  font-size: 13px;
  color: #999999;
`;
const SeeAnalysisWrapper = styled(FlexRowCenter) `
  width: 120px;
  cursor: pointer;
  user-select: none;
`;
const ClickBox = styled.div`
  width: 12px;
  height: 12px;
  margin-right: 3px;
  border-radius: 50%;
  border: ${(props) => props.selected ? '2px solid #EF4C4F' : '1px solid #ddd'};
`;
const SeeAnalysisValue = styled.div``;
const PreviewContent = styled(FlexColumn) `
  flex: 1;
  padding: 20px 20px;
  overflow-y: auto;
  background: #fff;
`;
const TextValue = styled.div`
  min-width: 36px;
`;
const AwnserDiv = styled(FlexColumn) `
  background: #FFFBF2;
  border: 1px solid #E8E2D8;
  border-radius: 2px;
  font-size: 14px;
  color: #000000;
  letter-spacing: -0.21px;
  line-height: 20px;
  padding:0px 10px 0px 10px;
`;
const MethodTipDiv = styled(FlexColumn) `
  // min-width: 44px;
  width: 44px;
  color:#B8A490;
  font-weight:bold;
`;
const MethodContentDiv = styled.div`
  flex:auto;
  color:#402308;
  align-items: flex-start;
  p{
    margin:0;
  }
`;
const BasicOneQuestionWrap = styled.div`
  position:relative;
  //display: inline-block;
  //width:100%;
  margin-bottom:16px;
  marginRight:20px;
  padding:16px 16px 16px 12px;
  height:auto;
  border: 1px solid #EEEEEE;
  color: #666666;
  font-size:14px;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.08);
  &:hover{
    background-color:#f6f6f6;
    .operdiv{
      display:flex;
    }
  }
`;
const OneQuestionWrap = styled(BasicOneQuestionWrap) `
  padding: 16px 0px 50px;
  marginLeft:20px;
  &:hover{
    .operdiv{
        visibility: visible;
    }
  }
  table tr {
    border: 1px solid #ddd;
  }
  ${questionContentStyle}
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.08);
  &:first-child {
    margin-top: 0;
  }
  p:first-of-type {
    margin-top: 0;
  }
  p:last-of-type {
    margin-bottom: 0;
  }
  span {
    display: inline-block;
    vertical-align: middle;
    table {
      display: inline-block;
      vertical-align: middle;
    }
  }
  img {
    vertical-align: middle;
  }
`;
const NoDiv = styled.div`
  display: inline-block;
  vertical-align: top;
`;
const ChooseGroup = styled.div`
  border: 1px solid #DDDDDD;
  position:relative;
  padding-top: 15px;
  width:100%;
  height:auto;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.08);
`;
const BasicContentDiv = styled.div`
  display:inline-block;
  width:calc(100% - 22px);
  vertical-align: top;
  p{
    margin:0;
  }
`;
const ContentDiv = styled(BasicContentDiv) `
  margin:0px 0px 0px 0px;
  width:calc(100% - 32px);
`;
const EditorWrapper = styled(FlexColumn) `
  margin: 5px 16px 0;
  padding: 10px;
  border: 1px solid #ddd;
  background: ${(props) => props.step === 2 ? '#fff' : '#FFFBF2'};
`;
const QuestionKnowledgeItem = styled(FlexRow) ``;
const QuestionKnowledgeStar = styled(FlexRowCenter) `
  margin-top: 10px;
`;
const QuestionKnowledgeTextArea = styled(FlexRow) `
  margin-top: 10px;
  align-items: flex-start;
`;

export class PreviewHomeWork extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.makeQuestionList = this.makeQuestionList.bind(this);
    this.makeNewQuestionList = this.makeNewQuestionList.bind(this);
  }
  makeQuestionList() {
    const { homeworkMsg, showAnalysis } = this.props.properties;
    // const homeworkMsg = this.props.properties.homeworkMsg;
    // const showAnalysis = this.props.properties.showAnalysis;
    // console.log(homeworkMsg, 'homeworkMsg - makeQuestionList');
    console.log(homeworkMsg.toJS(), 'homeworkMsg - makeQuestionList');
    const questionList = homeworkMsg.get('children') || fromJS([]);
    const starArr = new Array(5).fill('');
    const skepGroup = questionList.groupBy((value) => (value.get('questionEsDto')).get('CateName')).entrySeq();
    return skepGroup.map(([key, value], index) => (
      <ChooseGroup key={index}>
        {value.map((item, ix) => {
          const questionEsDto = item.get('questionEsDto');
          let content = '';
          let analysis = '';
          let method = '';
          let awnser = '';
          const isChoose = questionEsDto.get('Cate') === 1;
          if (isChoose) {
            content = addImgSrc(`${questionEsDto.get('Content')}<br>${questionEsDto.get('Options').filter((it) => it !== null).map((it, ix) => `${letterOptions[ix]}.${it}`).join('<br>')}` || '');
          } else {
            content = addImgSrc(questionEsDto.get('Content') || '');
          }
          if (questionEsDto.get('Analyse')) {
            analysis = addImgSrc(questionEsDto.get('Analyse') || '').replace(/(【解析】<br \/>)|(【解析】)|(【分析】)/g, '');
          }
          if (questionEsDto.get('Answer')) {
            awnser = addImgSrc(questionEsDto.get('Answer') || '').replace(/(【答案】)|(【解答】)/g, '').split('|').join('、');
          }
          if (questionEsDto.get('Method')) {
            method = addImgSrc(questionEsDto.get('Method') || '').replace(/(【答案】)|(【解答】)/g, '');
          }
          return (
            <OneQuestionWrap key={ix}>
              <NoDiv>{`${ix + 1}.`}</NoDiv>
              <ContentDiv dangerouslySetInnerHTML={{ __html: content }}></ContentDiv>
              {showAnalysis ? <AwnserDiv style={{ marginBottom: '12px', marginTop: '5px', marginLeft: '16px', marginRight: '16px', paddingTop: '13px', paddingBottom: '12px' }}>
                <FlexRow>
                  <MethodTipDiv>分析：</MethodTipDiv>
                  <MethodContentDiv dangerouslySetInnerHTML={{ __html: analysis }}></MethodContentDiv>
                </FlexRow>
                <FlexRow>
                  <MethodTipDiv>解答：</MethodTipDiv>
                  <MethodContentDiv dangerouslySetInnerHTML={{ __html: isChoose ? awnser : method }}></MethodContentDiv>
                </FlexRow>
              </AwnserDiv> : ''}
              {/* 课前测评才显示 */}
              {homeworkMsg.get('type') === 0 ? <EditorWrapper>
                <QuestionKnowledgeItem><TextValue style={{ minWidth: 60, color: '#B8A490' }}>知识点：</TextValue><TextValue dangerouslySetInnerHTML={{ __html: item.get('name') }}></TextValue></QuestionKnowledgeItem>
                <QuestionKnowledgeStar>
                  <TextValue style={{ width: 80, color: '#B8A490' }}>考试频率：</TextValue>
                  {starArr.map((val, iix) => {
                    return (<Icon key={iix} type="star" style={{ color: iix < item.get('starLevel') ? '#ff6c78' : '#ddd', marginRight: 5, cursor: 'pointer' }} />);
                  })}
                </QuestionKnowledgeStar>
                <QuestionKnowledgeTextArea><TextValue style={{ minWidth: 184, color: '#B8A490' }}>建议与评价（做对的评价）：</TextValue><TextValue dangerouslySetInnerHTML={{ __html: item.get('rightEstimate') }}></TextValue></QuestionKnowledgeTextArea>
                <QuestionKnowledgeTextArea><TextValue style={{ minWidth: 184, color: '#B8A490' }}>建议与评价（做错的评价）：</TextValue><TextValue dangerouslySetInnerHTML={{ __html: item.get('wrongEstimate') }}></TextValue></QuestionKnowledgeTextArea>
              </EditorWrapper> : ''}
            </OneQuestionWrap>
          );
        })}
      </ChooseGroup>
    ));
  }
  makeNewQuestionList() {
    const { homeworkMsg, showAnalysis, soucre } = this.props.properties;
    const { showItemAnalysis } = this.props.methods;
    const questionList = homeworkMsg.get('children') || fromJS([]);
    return questionList.map((item, index) => {
      const questionOutputDTO = item.get('questionOutputDTO');
      return (<HomeworkInforContent key={index}>
        <ShowPreviewQuestion
          ref={`showChildItem-${index}`}
          item={questionOutputDTO}
          index={index}
          showAllAnalysis={showAnalysis}
          showChild={false}
          changeShowAnalysis={(id, bol) => {
            const newItem = questionList.find((it) => it.getIn(['questionOutputDTO', 'id']) === id);
            if (newItem) {
              const itemIndex = questionList.indexOf(newItem);
              showItemAnalysis(itemIndex, bol);
            }
          }}
          homeworkMsg={homeworkMsg}
          soucre={soucre}
        />
      </HomeworkInforContent>);
    });
  }
  render() {
    // const homeworkMsg = this.props.properties.homeworkMsg;
    // const showAnalysis = this.props.properties.showAnalysis;
    const properties = this.props.properties;
    const { homeworkMsg, showAnalysis, isOpen } = properties;
    const { showAllAnalysis } = this.props.methods;
    const questionList = homeworkMsg.get('children') || fromJS([]);
    const isNewQuestion = (homeworkMsg.get('questionSource') || homeworkMsg.getIn(['children', 0, 'questionSource'])) === 2;
    // console.log(homeworkMsg.toJS(), showAnalysis, isOpen, isNewQuestion, 'isNewQuestion - isNewQuestion - isNewQuestion');
    return (<Modal
      isOpen={isOpen || false}
      style={customStyles}
      contentLabel="Alert Modal"
    >
      <PreviewWrapper>
        <PreviewHeaderWrapper>
          <HeaderButtons>
            <Button
              showtype={6} onClick={() => {
                this.props.methods.backClick();
              }}
            >{`< 返回`}</Button>
            <PlaceHolderBox />
            <Button
              showtype={5} onClick={() => {
                this.props.methods.goEdit(homeworkMsg.get('type'));
              }}
            >编辑</Button>
          </HeaderButtons>
          <PaperName>{homeworkMsg.get('name') || '作业名称'}</PaperName>
          <QuestionNumWrapper>
            <QuestionCount>题目数量：{questionList.count()}</QuestionCount>
            <WidthBox></WidthBox>
            <QuestionUsetCount>使用：{homeworkMsg.get('useCount') || 0}</QuestionUsetCount>
          </QuestionNumWrapper>
          <ControlWrapper style={{ padding: 0 }}>
            <FilterQuestionNumber>{`本作业共 ${questionList.count()} 道题目`}{homeworkMsg.get('type') !== 1 ? `，共计 ${questionList.map((item) => item.get('score')).reduce((a, b) => a + b) || 0} 分` : ''}</FilterQuestionNumber>
            <PlaceHolderBox />
            <SeeAnalysisWrapper
              onClick={() => {
                // console.log(showAnalysis, 'showAnalysis');
                showAllAnalysis(!showAnalysis);
              }}
            ><ClickBox selected={showAnalysis}></ClickBox><SeeAnalysisValue>显示答案与解析</SeeAnalysisValue>
            </SeeAnalysisWrapper>
          </ControlWrapper>
        </PreviewHeaderWrapper>
        <PreviewContent>
          {isNewQuestion ? this.makeNewQuestionList() : this.makeQuestionList()}
        </PreviewContent>
      </PreviewWrapper>
    </Modal>);
  }
}

PreviewHomeWork.propTypes = {
  dispatch: PropTypes.func.isRequired,
  properties: PropTypes.object.isRequired,  // 传入的参数
  // showAnalysis: PropTypes.bool.isRequired,  // 显示解析与答案
  // initMsg: PropTypes.func.isRequired,
  methods: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  // showAnalysis: makeShowAnalysis(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    // initMsg: () => {
    //   dispatch(setTestHomeworkItemAction(fromJS({})));
    //   dispatch(changeShowAnalysisAction(false));
    //   dispatch(changeHomeworkPaperItemAcction(fromJS({})));
    // },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PreviewHomeWork);
