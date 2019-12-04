// 配置不同题型加载不同模块题型
import React from 'react';
import Answer from './fragment/answer';
import Analysis from './fragment/analysis';
import AnswerList from './fragment/answerList';
import OptionList from './fragment/optionList';
import CheckBoxs from './fragment/checkboxs';
import FillQuestion from './fragment/chioceAndFill';

class QuestionLayoutChoice extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.choiceChild = this.choiceChild.bind(this);
    this.questionLayoutChoice = this.questionLayoutChoice.bind(this);
  }
  choiceChild(childTypeId) {
    let res = [];
    switch (childTypeId) {
      case 2:
        res = [<OptionList {...this.props} key={1}></OptionList>, <CheckBoxs {...this.props} key={2}></CheckBoxs>, <Analysis {...this.props} key={3}></Analysis>];
        break;
      case 3:
        res = [<AnswerList {...this.props} key={1}></AnswerList>, <Analysis {...this.props} key={2}></Analysis>];
        break;
      case 4:
        res = [<Answer {...this.props}  key={1}></Answer>, <Analysis {...this.props} key={2}></Analysis>];
        break;
      default:
        break;
    }
    return res;
  }
  questionLayoutChoice(templateType, childTypeList) {
    let res = {};
    switch (templateType) {
      case 7:
        res = (<div>
          <FillQuestion {...this.props}></FillQuestion>
        </div>);
        break;
      default:
        res = {
          parent: ['TemplateTypeError'],
          children: [],
        };
        break;
    }
    return res;
  }
  render() {
    const { templateType, childTypeList } = this.props;
    return (<div style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>
      {this.questionLayoutChoice(templateType, childTypeList)}
    </div>);
  }
}

export default QuestionLayoutChoice;
