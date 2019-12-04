---
order:0

title: 基础样例
---
````jsx harmony
import React from 'react';
import MaterialHead from 'components/MaterialHead';

class Demo extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      headList: [],
      checkList: []
    }
  }
  render(){
    const { headList, checkList } = this.state
    return (
       <MaterialHead
                  headList={headList}
                  checkList={checkList}
                  uploadPermission={true}
                  cateClick={(value, idx, pos) => { console.log(value, idx, pos) }}
                  searchChange={(value) => { console.log(value)}}
                  searchClick={() => {}}
                  uploadClick={() => {}}
                >
       </MaterialHead>
    )
  }
}

export default Demo
````
