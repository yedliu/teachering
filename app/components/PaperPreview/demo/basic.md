---
order:0

title: 基础样例
---
````jsx harmony
import React from 'react';
import PaperPreview from 'components/PaperPreview';

class Demo extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      questionsList: [],
      isAddOrEdit: {}
    }
  }
  QuestionItemCutSure = () => {}
  selectQuestionAndType = (item) => {}
  render(){
    const { questionsList } = this.state
    return (
       <PaperPreview
           source={'getandcutpaper'}
           currentCutPaperImg={this.props.currentCutPaperImg}
           previewWrapperShowOrHide={this.props.previewWrapperShowOrHide}
           QuestionItemCutSure={this.QuestionItemCutSure}
           questionCountAll={ 0 }
           questionTypeList={this.props.questionTypeList || fromJS([])}
           selectedquestionType={this.props.selectedquestionType}
           changeSelectedQuestionType={this.props.changeSelectedQuestionType}
           changeBigQuestion={this.props.changeBigQuestion}
           changeSmallQuestion={this.props.changeSmallQuestion}
           smallQuestion={this.props.smallQuestion}
           selectedBigQuestion={this.props.selectedBigQuestion}
           questionsList={questionsList}
           selectQuestionAndType={this.selectQuestionAndType}
           selectedInsertIndex={this.props.selectedInsertIndex}
           changeInsertIndex={this.props.changeInsertIndex}
           isAddOrEdit={this.state.isAddOrEdit}
           btnCanClick={this.props.btnCanClick}                 
                >
       </PaperPreview>
    )
  }
}

export default Demo
````
