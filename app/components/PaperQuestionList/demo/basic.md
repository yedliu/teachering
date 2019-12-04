---
order:0

title: 基础样例
---
````jsx harmony
import React from 'react';
import PaperQuestionList from 'components/PaperQuestionList';

class Demo extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      questionIndex:0,
      bigMsg
    }
  }
  render(){
    const { paperData, questionList } = this.props
    return (
       <PaperQuestionList
            source={'paperinputverify'}
            questionsList={this.state.bigMsg}
            questionSelectedIndex={this.state.questionIndex + 1}
            questionItemIndexClick={(a, b, c, d, e) => {
                   this.setState({ questionIndex: e - 1 });
                 }}
            toSeePaperMsg={() => {
                   return { name: paperData.get('name'), questionCount: paperData.get('questionAmount'), realQuestionsCount: questionList.count(), entryUserName: paperData.get('entryUserName') };
                 }}
            othersData={{ questionResult: questionList.map((item) => item.get('questionOutputDTO')) }}         
                >
       </PaperQuestionList>
    )
  }
}

export default Demo
````
