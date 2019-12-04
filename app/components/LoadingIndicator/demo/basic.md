---
order:0

title: 基础样例
---

````jsx harmony
import React from 'react';
import LoadingIndicator from 'components/LoadingIndicator';
class Demo extends React.Component{

    render(){
      return (
         <div>
              {LoadingIndicator()}
         </div>
      )
    }
}
export default Demo
````
