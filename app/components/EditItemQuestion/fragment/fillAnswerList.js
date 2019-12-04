import React from 'react';
import { Icon, message } from 'antd';
import { FlexRowCenter, FlexColumn } from 'components/FlexBox';
import { ifLessThan, renderToKatex, filterHtmlForm } from 'components/CommonFn';
import { fromJS } from 'immutable';
import {
  FillRightWrapper,
  ItemTitle,
  PromptText,
  MustSel,
  OptionListBox,
  AllOptionList,
  OptionItem,
  AddErrorAnswerWrapper,
  InputWrapper,
  AddBtnWrapper,
  AddBtn,
  InputDiv,
  MyBtn,
  AllOptionListWrapper,
} from './style';
import {
  doNothing,
} from './common';
import { fillConfig } from './fillContent';


class FillAnswerList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.deleteOption = this.deleteOption.bind(this);
    this.showMyBtn = this.showMyBtn.bind(this);
    this.addErrorAnswer = this.addErrorAnswer.bind(this);
    this.inputErrorOption = this.inputErrorOption.bind(this);
    this.state = {
      errorAnswer: '',
      showInput: false,
    };
  }
  deleteOption(value, index) {  // 删除选项
    this.props.removeAnswer(value, index);
    // const { newQuestion, setNewQuestionData } = this.props;
    // const optionList = (newQuestion.get('optionList') || fromJS([])).filter((it) => it !== value);
    // const answerList = (newQuestion.get('answerList') || fromJS([])).filter((it) => it !== value);
    // setNewQuestionData(newQuestion.set('optionList', optionList).set('answerList', answerList));
  }
  showMyBtn() { // 显示输入干扰项的输入框与按钮
    const { showInput } = this.state;
    this.setState({ showInput: !showInput, errorAnswer: '' });
  }
  addErrorAnswer() { // 点击添加干扰项
    const { newQuestion, setNewQuestionData } = this.props;
    const { errorAnswer } = this.state;
    const optionList = (newQuestion.get('optionList') || fromJS([])).filter((it) => filterHtmlForm(it));
    const answerList = (newQuestion.get('answerList') || fromJS([])).filter((it) => filterHtmlForm(it));
    if (optionList.count() - answerList.count() >= fillConfig.maxErrAnswerCount) {
      message.info(`最多添加${fillConfig.maxErrAnswerCount}个干扰项。`);
      this.setState({ errorAnswer: '' });
      return;
    } else if (answerList.includes(errorAnswer)) {
      message.info('干扰项内容不应该和正确答案相同');
      this.setState({ errorAnswer: '' });
      return;
    } else if (optionList.includes(errorAnswer)) {
      message.info('该干扰项内容已经存在');
      this.setState({ errorAnswer: '' });
      return;
    }

    setNewQuestionData(newQuestion.set('optionList', optionList.push(errorAnswer)));
    this.setState({ errorAnswer: '' });
  }
  inputErrorOption(e) { // 输入干扰项内容
    const value = e.target.value;
    if (value.length > fillConfig.maxWordLength) {
      message.info(`单个空最长允许${fillConfig.maxWordLength}个字。`);
      return;
    }
    this.setState({ errorAnswer: e.target.value });
  }
  render() {
    const { index, i, degree, type, newQuestion, mustSel, width, clickEditItem, getUeditor, showInput } = this.props;
    const optionList = (newQuestion.get('optionList') || fromJS([])).filter((it) => filterHtmlForm(it));
    const answerList = (newQuestion.get('answerList') || fromJS([])).filter((it) => filterHtmlForm(it));
    return (<FillRightWrapper>
      <ItemTitle>{mustSel ? <MustSel>*</MustSel> : ''}填空项： <PromptText>(可设置3到10个)</PromptText></ItemTitle>
      <OptionListBox>
        <AllOptionListWrapper>
          <AllOptionList>
            {optionList.map((it, iit) => {
              const isRightAnswer = answerList.includes(it);
              return (<OptionItem title={isRightAnswer ? '正确答案' : '干扰项'} isRightAnswer={isRightAnswer} key={iit}>{it}
                <Icon onClick={() => this.deleteOption(it, iit)} type="close-circle" style={{ fontSize: 12, marginLeft: 3, color: '#777' }} />
              </OptionItem>);
            })}
          </AllOptionList>
        </AllOptionListWrapper>
        <AddErrorAnswerWrapper>
          {this.state.showInput ? <InputWrapper>
            <InputDiv
              placeholder="请输入干扰项"
              value={this.state.errorAnswer}
              onChange={this.inputErrorOption}
            ></InputDiv><MyBtn onClick={this.addErrorAnswer}>确定</MyBtn>
          </InputWrapper> : ''}
          <AddBtnWrapper>
            <AddBtn onClick={this.showMyBtn}>添加干扰项</AddBtn>
          </AddBtnWrapper>
        </AddErrorAnswerWrapper>
      </OptionListBox>
    </FillRightWrapper>);
  }
}

export default FillAnswerList;
