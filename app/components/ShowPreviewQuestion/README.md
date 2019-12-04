#### 业务场景
预览以及编辑作业中题目的组件

#### 功能说明
题目展示使用了 ZmExamda 解析题目
预览作业中的题目、知识点、考试频率、建议与评价，可以查看答案和解析
编辑功能只能编辑知识点、考试频率、建议与评价，不能编辑题目

*获取子题的数据可能有问题, 应该通过 item 获取*
#### 参数说明
参数 | 说明 | 类型 | 默认值
--- | --- | --- | ---
item | 题目信息 | immutable.map | -
index | 当前题目编号 | number | -
showAllAnalysis | 是否显示解析 | bool | -
changeShowAnalysis | 显示/隐藏解析 | func | -
homeworkMsg | 作业的信息 | immutable.map | -
soucre | 题目来源 | string | -

#### 用法示例
```javascript
import { fromJS } from 'immutable';
import ShowPreviewQuestion from 'components/ShowPreviewQuestion';
class App extends React.Component{
  state = {
    showAllAnalysis: false
  }
  changeShowAnalysis = (id, showAnalysis) => {
    console.log(id, showAnalysis)
  }
  changeShowAllAnalysis = () => {
    this.setState({ showAllAnalysis: true })
  }
  render() {
    const { visible } = this.state
    const question = fromJS({
      children: [], // 子题
      optionList: ["<p>111<br/></p>", "<p>222<br/></p>", "<p>333<br/></p>", "<p>444<br/></p>"],
      templateType: 2, // 配合 typeId 判断题型
      typeId: 2,       //
      title: "<p>243243<br/></p>", // 主题干
    });

    homeworkMsg = fromJS({
      type: 0,
      children: [{
        questionId: 123,
        name: '知识点1',
        starLevel: 4,
        rightEstimate: '对的评价1',
        wrongEstimate: '错的评价1',
      }, {
        questionId: 456,
        name: '知识点2',
        starLevel: 4,
        rightEstimate: '对的评价2',
        wrongEstimate: '错的评价2',
      }]
    })
    const { showAllAnalysis } = this.state;
    soucre

    return (
      <div>
        <button onClick={this.changeShowAllAnalysis}>显示所有的解析</button>
        <ShowPreviewQuestion
          item={question}
          index={0}
          showAllAnalysis={showAllAnalysis}
          changeShowAnalysis={this.changeShowAnalysis}
          homeworkMsg={homeworkMsg}
        />
        <ShowPreviewQuestion
          item={question}
          index={1}
          showAllAnalysis={showAllAnalysis}
          changeShowAnalysis={this.changeShowAnalysis}
          homeworkMsg={homeworkMsg}
        />
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.body)
```
