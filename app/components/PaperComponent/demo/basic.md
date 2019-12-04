---
order:0

title: 基础样例
---
````jsx harmony
import React from 'react';
import PaperComponent from 'components/PaperComponent';

class Demo extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      gradeId: 1,
      subjectId: 1,
      teachingEditionId: 1,
      editionId: 1,
      gradeList: [],
      versionValue: {},
      systemValue: {},
      showSystemList: [],
      teachingEditionName: '--'
    }
  }
  render(){
    const { gradeId, subjectId, teachingEditionId, editionId, gradeList, versionValue, systemValue, showSystemList, teachingEditionName } = this.state
    return (
       <PaperComponent
                  hasTeachingVersion={true}
                  hasCourseSystem={true}
                  gradeId={gradeId}
                  subjectId={subjectId}
                  teachingEditionId={teachingEditionId}
                  editionId={editionId}
                  gradeList={gradeList}
                  versionValue={versionValue}
                  systemValue={systemValue}
                  onOk={( )=>{}}
                  showSystemList={showSystemList}
                  teachingEditionName={teachingEditionName} 
                >
       </PaperComponent>
    )
  }
}

export default Demo
````
