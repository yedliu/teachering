#### 业务场景
预览以及编辑作业中题目的组件

#### 功能说明


#### 参数说明
参数 | 说明 | 类型 | 默认值
--- | --- | --- | ---
questionOutputDTO | 题目信息 | immutable.map | -
seeMobile | 是否是移动端预览 | bool | -
subjectId | 学科 Id, 这个参数没发现有什么用 | number | -
soucre | 来源, 值为 'paperfinalverify' 时有特殊处理 | string | -
showAllChildren | 子题可见状态 | bool | -
limtShow | 最多显示多少子题 | number | -
pointList | 子题显示的知识点列表, soucre 为 paperfinalverify 时才显示知识点、考点 | immutable.map | -

#### 用法示例
```javascript
import { fromJS } from 'immutable';
import ShowQuestionItem from 'components/ShowQuestionItem';
class App extends React.Component{
  state = {
    seeMobile: false
  }

  changeSeeMobile = () => {
    const { seeMobile } = this.state;
    this.setState({ seeMobile: !seeMobile })
  }

  render() {
    const { seeMobile } = this.state;
    const question = fromJS({
      analysis: "<p>312313</p>", // 解析
      answerList: ["B"], // 答案
      children: [], // 子题
      optionList: ["<p>111<br/></p>", "<p>222<br/></p>", "<p>333<br/></p>", "<p>444<br/></p>"],
      subjectId: 1,
      templateType: 2, // 配合 typeId 判断题型
      typeId: 2,       //
      title: "<p>243243<br/></p>", // 主题干
    });

    const pointList = fromJS({
      knowledgeIdList: [{id: 1, name: '知识点1'}, {id: 2, name: '知识点2'}, {id: 3, name: '知识点3'}],
      examPointIdList: [{id: 1, name: '考点1'}, {id: 2, name: '考点2'}, {id: 3, name: '考点3'}],
    })

    const children = [{
      analysis: "<p>312313</p>", // 解析
      answerList: ["B"], // 答案
      children: [], // 子题
      optionList: ["<p>111<br/></p>", "<p>222<br/></p>", "<p>333<br/></p>", "<p>444<br/></p>"],
      subjectId: 1,
      templateType: 2, // 配合 typeId 判断题型
      typeId: 2,       //
      title: "<p>243243<br/></p>", // 主题干
      knowledgeIdList: [1, 2],
      examPointIdList:[1, 2, 3]
    }];

    const question1 = question.set('children', children)

    return (
      <div>
        <button onClick={this.changeSeeMobile}>切换到{seeMobile ? 'PC' : '移动'}端预览</button>
        <ShowQuestionItem
          item={question}
          seeMobile={seeMobile}
        />
        <ShowQuestionItem
          item={question1}
          seeMobile={seeMobile}
          soucre="paperfinalverify"
          pointList={pointList}
        />
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.body)
```
