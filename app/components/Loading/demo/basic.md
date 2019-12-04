---
order:0

title: 基础样例
---

````jsx harmony
import React from 'react';
import { MaskLoading } from 'components/Loading';

class demo extends React.Component{
  constructor(props){
    super(props)
    this.state={
      toPaperLoading: false
    }
  }
  render(){
  const { toPaperLoading } = this.state
  return (
    <div>
      {toPaperLoading ? <MaskLoading text="加载试卷中..." /> : null}
    </div>
    )
  }
}

export default demo
````
