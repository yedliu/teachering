import styled from 'styled-components';
import { Icon } from 'antd';
import { FlexRow, FlexColumn, FlexCenter, FadeIn, FlexRowCenter } from 'components/FlexBox';
import { questionStyle, listStyle, wangStyle, questionItemCss } from 'components/CommonFn/style';

const searchIcon = window._baseUrl.imgCdn + 'bf398b31-a478-4e94-98b2-527e19da6acf.jpg';



export const customStyles = {
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    animation: `${FadeIn} .5s linear`,
    boxShadow: 'none',
    borderRadius: 0,
    padding: 0,
    margin: 0,
    border: 'none',
    background: 'rgb(244, 245, 247)',
    // overflow: 'hidden',
    // top: '50%',
    // left: '50%',
    // right: 'auto',
    // bottom: 'auto',
    // marginRight: '-50%',
    // minHeight: '400px',
    // minWidth: '1060px',
    // width: '80%',
    // height: '90%',
    // animation: `${FadeIn} .5s linear`,
    // transform: 'translate(-50%, -50%)',
    // boxShadow: '0px 8px 24px rgba(0, 0, 0, .2)',
    // borderRadius: '6px',
    // display: 'flex',
    // flexDirection: 'column',
    // padding: 0,
    // background: 'rgb(244, 245, 247)',
    // overflow: 'hidden',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 90,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
};
export const HomeworkWrapperTitleItem = styled(FlexCenter)`
  font-size: 16px;
  color: ${(props) => (props.selected ? 'rgb(24, 144, 255)' : '#666')};
  font-weight: 600;
  padding-right: 30px;
  /* cursor: pointer; */
`;
export const ClearFix = styled.div`
  &::after {
    content: '';
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
  }
`;
export const CreateHeader = styled.div`
  height: 50px;
`;
export const HeaderTitle = styled(FlexRowCenter)`
  height: 50px;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #ddd;
`;
export const CloseBox = styled.div`
  box-sizing: border-box;
  width: 30px;
  height: 30px;
  // border: 1px solid #ddd;
  margin-left: 5px;
  line-height: 24px;
  text-align: center;
  font-size: 30px;
  user-select: none;
  cursor: pointer;
`;
export const StepWrapper = styled(FlexCenter)`
  height: 60px;
  padding: 10px;
`;
export const ConentWrapper = styled(FlexColumn)`
  flex: 1;
  width: 100%;
  min-width: 1000px;
  max-height: 100%;
  p {
    work-wrap: break-work;
    word-break: break-all;
  }
`;
export const StepOneLeftWrapper = styled(FlexColumn)`
  min-width: 305px;
  height: 100%;
  background: #fff;
`;
export const StepOneRightWrapper = styled(FlexColumn)`
  flex: 1;
  height: 100%;
  margin-right: 36px;
  border-left: 1px solid #ddd;
  background: #fff;
`;
export const StepOneSession = styled(FlexCenter)`
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  overflow: hidden;
  transition: width .3s ease-out;
`;
export const SkepTextWrapper = styled(FlexCenter)`
  width: 36px;
  height: 100%;
  background: rgb(24, 144, 255);
  border-radius: 6px 0 0 6px;
  position: absolute;
  left: 0;
  top: 0;
  cursor: pointer;
`;
export const SkepTextValue = styled.p`
  margin: 0;
  font-size: 20px;
  color: #fff;
  writing-mode: tb;
  height: 80px;
  line-height: 1em;
  word-spacing: 10px;
`;
export const SkepQuestionCountValue = styled.p`
  margin: 0;
  width: 26px;
  height: 26px;
  background: rgb(255, 255, 255);
  border-radius: 50%;
  vertical-align: middle;
  text-align: center;
  color: rgb(24, 144, 255);
  font-size: 18px;
`;
export const IconLongArrowLeft = styled.i`
  position: absolute;
  font-size: 28px!important;
  right: 50%;
  transform: translateX(50%);
  color: #fff;
  margin-top: 10px;
`;
export const SkepMsgBoxWrapper = styled.div`
  position: absolute;
  left: 36px;
  top: 0;
  width: 164px;
  height: 100%;
`;
export const TreeWrapper = styled.div`
  flex: 1;
  margin: 0px 20px 10px;
  overflow: auto;
`;
export const SearchQesWrapper = styled.div`
  // min-height: 155px;
  padding: 10px 20px 0;
  border-bottom: 1px solid #ddd;
`;
export const SearchCol = styled(FlexRowCenter)`
  height: 45px;
`;
export const SearchIcon = styled.div`
  width: 16px;
  height: 16px;
  background: url(${searchIcon}) 0 center no-repeat;
  position: relative;
  left: -20px;
`;
export const HomeworkSkep = styled(FlexCenter) `
  margin-left: 10px;
  padding: 0 15px;
  min-width: 80px;
  height: 30px;
  border-radius: 15px;
  background: #EF4C4F;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  user-select: none;
  &:hover {
    background: #ff6c78;
  }
  &:hover .homeworkSkepMsg {
    display: block;
  }
  &:active {
    background: #EF4C4F;
  }
  position: relative;
`;
export const ControlWrapper = styled(FlexRowCenter) `
  height: 40px;
  // padding: 0 20px;
  // border-bottom: 1px solid #ddd;
`;
export const FilterQuestionNumber = styled.div`
  font-size: 13px;
  color: #999999;
`;
export const FilterQuestionOrder = styled(FilterQuestionNumber)`
  span {
    display: inline-block;
    margin-right: 5px;
    padding: 3px 5px;
  }
`;
export const SeeAnalysisWrapper = styled(FlexRowCenter) `
  width: 140px;
  cursor: pointer;
  user-select: none;
`;
export const ClickBox = styled.div`
  width: 12px;
  height: 12px;
  margin-right: 3px;
  border-radius: 50%;
  border: ${(props) => (props.selected ? '2px solid #EF4C4F' : '1px solid #ddd')};
`;
export const SeeAnalysisValue = styled.div``;
export const AddAllQuestionWrappper = styled(FlexCenter) `
  width: 120px;
`;
export const EditorHomeworkHeader = styled(FlexColumn) `
  padding: 0 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
`;
export const TopButtons = styled(FlexRowCenter) `
  padding: 0 20px;
  width: 100%;
  height: 30px;
`;
export const EditorHomeworkValue = styled.div`
  font-size: 14px;
`;
export const EditorHomeworkContent = styled(FlexColumn) `
  flex: 1;
  padding: 10px 20px 10px;
  overflow-y: auto;
`;
export const PaperNameWrapper = styled(FlexRowCenter) `
  height: 34px;
`;
export const MustInput = styled(FlexCenter) `
  width: 12px;
  height: 12px;
  font-size: 12px;
  color: red;
`;
export const PaperMsgWrapper = styled(PaperNameWrapper) ``;
export const TextValue = styled.div`
  min-width: 42px;
  font-size: 14px;
  color: #333;
`;
export const FinishHwBox = styled(FlexColumn) `
  text-align: center;
  font-size: 16px;
  color: #999;
`;
export const QuestionContentWrapper = styled.div`
  flex: 1;
  width: 100%;
  // padding: 10px;
  overflow-y: auto;
`;
export const QuestionListWrapper = styled(FlexColumn) `
  width: 100%;
  height: 100%;
  padding: 10px 20px;
`;
export const PaginationWrapper = styled(FlexCenter) `
  min-height: 40px;
  padding: 10px;
  margin-bottom: 10px;
`;
export const HomeworkInforContent = styled.div`
  img {
    max-width: 100%;
  }
  ${questionStyle}
  ${listStyle}
  ${wangStyle}
`;
export const QuestionInfoWrapper = styled(questionItemCss)`
  flex: 1;
  position: relative;
  width: 100%;
  margin: 10px 0;
  padding: 12px;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.08);
  font-size: 10.5pt;
  line-height: 2em;
  color: #000;
  img {
    max-width: 350px;
    max-height: 400px;
  }
  min-height: ${(props) => (props.homeworkStep === 3 ? 50 : 0)}px;
  border: 1px solid #ddd;
  zmblank {
    box-sizing: border-box;
    display: inline-block;
    width: 4em;
    height: 1em;
    text-align: center;
    border: none;
    user-select: none;
  }
  .katex-html {
    background: transparent;
  }
  &:hover {
    background: #eee;
  }
  &:hover .buttons {
    display: flex;
    line-height: 1.5em;
  }
  img {
    vertical-align: middle;
  }
  ${listStyle}
`;
export const QuestionsCount = styled.div`
   float: left;
   line-height: 2em;
`;
export const QuestionContent = styled(ClearFix) `
  // display: block;
`;
export const QuestionOptions = styled(FlexColumn) `
  padding-left: 20px;
`;
export const OptionsWrapper = styled.div`
  flex: 1;
`;
export const OptionsOrder = styled.div`
  // display: inline-block;
  float: left;
  line-height: 2em;
  font-size: 10.5pt;
`;
export const Options = styled.div`
  // display: ionline-block;
  float: left;
`;
export const AnalysisWrapper = styled.div`
  margin: 12px 0 10px 0;
  padding: 12px;
  border-radius: 2px;
  border: 1px solid #E8E2D8;
  background: #FFFBF2;
  font-family: MicrosoftYaHei;
  line-height: 19px;
  font-size: 14px;
  &::after {
    content: '';
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
  }
  display: ${(props) => (props.show ? 'block' : 'none')};
`;
export const AnalysisItem = styled(FlexRow) `
  font-size: 14px;
  line-height: 20px;
  color: #7A593C;
  letter-spacing: -0.21px;
  line-height: 20px;
  &::after {
    content: '';
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
  }
`;
export const AnswerTitle = styled.div`
  width: 42px;
  line-height: 2em;
  font-family: PingFangSC-Medium;
  color: #7A593C;
`;
export const AnswerConten = styled(ClearFix) `
  flex: 1;
  font-family: SourceHanSansCN-Normal;
  color: #000000;
  line-height: 2;
  font-size: 10.5pt;
  p:first-of-type {
    margin-top: 0;
  }
  p:last-of-type {
    margin-bottom: 0;
  }
  &.rightAnswer {
    padding-top: 2px;
  }
  display: block;
`;
export const ControlButtons = styled(FlexRowCenter) `
  /* position: absolute; */
  padding: 0 10px;
  /* width: ${(props) => (props.hasChild && props.showChild && !props.isPreview ? 300 : 220)}px; */
  height: 30px;
  /* bottom: ${(props) => (props.analysisShow ? 30 : 10)}px; */
  /* right: 0; */
  /* display: none; */
`;
export const ChildreWrapper = styled.div`
  border: 1px solid #ddd;
  padding: 10px;
`;
export const CutLine = styled.div`
  height: 1px;
  width: 100%;
  background: #ddd;
`;
/* export const HomeworkSkepMsg = styled.div`
  position: absolute;
  top: 30px;
  right: ${(props) => props.relocate ? '-120px' : '4px'};
  width: 200px;
  height: auto;
  padding-top: 5px;
  background: transparent;
  display: none;
`; */
export const HomeworkSkepMsgBox = styled(FlexColumn) `
  width: 100%;
  height: 100%;
  background: #fff;
`;
export const TitleBox = styled.p `
  margin: 5px 0 0 0;
  color: #000;
  font-size: 16px;
  height: 40px;
  line-height: 40px;
  text-align: center;
`;
export const SkepTitleItem = styled.div`
  font-size: 14px;
  font-weight: 600;
  flex: 1;
`;
export const SkepTitleItemTwo = styled(SkepTitleItem) `
    flex: 2;
`;
export const SkepContent = styled(FlexColumn) `
  flex: 1;
  background: #fff;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  overflow-y: auto;
  overflow-x: hidden;
`;
export const SkepControlWrapper = styled(FlexRowCenter)`
  height: 30px;
  width: 100%;
`;
export const SkepControlItem = styled(FlexCenter)`
  margin: 0;
  width: 50%;
  height: 100%;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
`;
export const HeadColumn = styled.div`
  font-size: 13px;
  color: #666666;
  flex:1;
`;
export const HeadColumnTwo = styled(HeadColumn) `
  flex:2;
`;
export const HeadColumnTwoLight = styled(HeadColumnTwo) `
  color: #999999;
`;
export const HeadColumnLight = styled(HeadColumn) `
  cursor: pointer;
  color: #999999;
`;
export const CountBox = styled(FlexRowCenter) `
  height: 30px;
  font-weight: 600;
`;
export const BascketContentItem = styled(FlexRow) `
  min-height: 37px;
  padding: 0 10px;
  align-items: center;
  &:hover {
    background: #ddd;
  }
`;
export const ChooseGroup = styled.div`
  border: 1px solid #DDDDDD;
  position:relative;
  margin-top:10px;
  width:100%;
  height:auto;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.08);
  .ant-input-number-handler-wrap {
    display: none;
  }
  img {
    max-width: 100%;
  }
  ${questionStyle}
  ${listStyle}
  ${wangStyle}
`;
export const ChooseGroupHeader = styled(FlexRow) `
  font-size: 14px;
  min-height:40px;
  margin:0px 12px 0px 12px;
  align-items:center;
  &:hover{
    background: #FAFAFA;
    .headtool{
      display:flex;
    }
  }
  color: #333333;
  letter-spacing: -0.21px;
`;
export const ChooseGroupHeaderNumTip = styled.span`
  font-size: 14px;
  color: #999999;
  letter-spacing: -0.21px;
  line-height: 19px;
`;
export const ChooseGroupHeaderToolWrap = styled(FlexRow) `
  flex:auto;
  display:none;
  justify-content: flex-end;
  height:40px;
  align-items: center;
`;
export const ImgWrap = styled(FlexColumn) `
  min-width:15px;
  max-width:15px;
  min-height:15px;
  max-height:15px;
  margin-left:30px;
  cursor:pointer;
  align-self: center;
`;
export const Img = styled.img`
  height:100%;
  width:100%;
  &:hover{
    content: ${(props) => `url(${props.imgsrc})`};
  }
`;
export const OperDiv = styled(FlexRow) `
  justify-content: flex-end;
  align-items: center;
  min-height:40px;
  max-height:40px;
  position: absolute;
  right: 50px;
  bottom: 5px;
  z-index: 10;
`;
const BasicOneQuestionWrap = styled(questionItemCss)`
  position:relative;
  //display: inline-block;
  //width:100%;
  margin-bottom:16px;
  margin-right:20px;
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
  zmblank {
    box-sizing: border-box;
    display: inline-block;
    width: 4em;
    height: 1em;
    text-align: center;
    border: none;
    user-select: none;
  }
  ${listStyle}
`;
export const OneQuestionWrap = styled(BasicOneQuestionWrap) `
  padding: 16px 0px 50px;
  margin-left: 20px;
  &:hover{
    .operdiv{
        visibility: visible;
    }
  }
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.08);
`;
export const IconArrow = styled(Icon)`
  color: ${(props) => (props.selected ? '#333' : '#999')};
  cursor: pointer;
`;
