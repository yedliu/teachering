#### 业务场景
下拉选择框
封装了一层 antd 的 Select 组件

#### 参数说明
参数 | 说明 | 类型 | 默认值
--- | --- | --- | ---
opts | 渲染 select 的数组, 数组内的元素需要是： immutable.map | array | -
style | 样式 | object | -
selectId | 当前选择的 option | string &#124; number | -
onChange | select 发生改变的回调 | func | -

#### 用法示例
```javascript
import SelectBox from 'components/SelectBox';
import { fromJS } from 'immutable';
class App extends React.Component{
  state = {
    selectId: 1
  }
  handleChange = (selectId) => {
    console.log(selectId);
    this.setState({ selectId })
  }
  render() {
    const { visible } = this.state
    const list = fromJS([
      {id: 1, name: '测试1'},
      {id: 2, name: '测试2'},
      {id: 3, name: '测试3'},
      {id: 4, name: '测试4'},
      {id: 5, name: '测试5'},
      {id: 6, name: '测试6'},
      {id: 7, name: '测试7'},
    ]);

    return (
      <div>
        <SelectBox
          opts={list}
          selectId={selectId}
          onChange={this.handleChange}
        />
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.body)
```
