import React from 'react';
import { Input } from 'antd';
import NewType from './newTypeQuestionStyle';

const {
  QuestionWrapper,
  TitleWrapper,
} = NewType;

class NewTypeQuestion extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.changeContent = this.changeContent.bind(this);
  }
  changeContent(value, type) {
    console.log('changeContent', type, value);
    switch (type) {
      case 'title':
        break;
      default:
        break;
    }
  }
  render() {
    const { newQuestion } = this.props;
    const templateType = newQuestion.get('templateType') || 1;
    return (<QuestionWrapper>
      <TitleWrapper>
        <span style={{ color: 'red' }}>*</span>
        <span style={{ minWidth: 44 }}>标题：</span>
        <Input placeholder="请输入标题描述" onChange={(e) => this.changeContent('title', e.target.value || '')}></Input>
        
      </TitleWrapper>
    </QuestionWrapper>);
  }
}

export default NewTypeQuestion;
