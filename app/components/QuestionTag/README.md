#### 业务场景
QuestionTag：业务组件
编辑题目标签的弹框组件

#### 功能说明
当前组件支持编辑的题目标签属性有：
  题目来源、年级、学科、题目评级、区分度、难度、综合度、年份、卷型、试卷类型、省、市、区、建议用时、试卷名称、适用场景、能力维度、知识点、考点

如果当前题目是复合题，主题干和子题都会有 知识点和考点 的标签属性。
#### 实现方式
主要是使用了 antd 的 form 对整个表单进行控制，通过 question 传入的数值 设置各个选项的默认值。
组件中的各个状态是 form 组件进行管理， 通过 setFieldsValue 改变组件的状态

#### 参数说明
参数 | 说明 | 类型 | 默认值
--- | --- | --- | ---
question | 题目的属性, 组件中的各项显示的默认值 | object | -
visible | 控制弹框的显示隐藏 | bool | -
cancelText | 取消按钮的文本 | object | 取消
close | 点击取消按钮和关闭按钮的回调 | func | -
submitTags | 点击确定按钮的回调，会把当前 form 表单的值传入进去 | func | -

#### 用法示例
```javascript
import { fromJS } from 'immutable';
import QuestionTag from 'components/QuestionTag';
class App extends React.Component{
  state = {
    visible: false
  }
  handleShowQuestionTag = () => {
    this.setState({ visible: true })
  }
  handleClose = () => {
    this.setState({ visible: false })
  }
  handleSubmit = (values) => {
    console.log(values);
  }
  render() {
    const { visible } = this.state
    const question = fromJS({
      abilityIdList: (3) [0, 1, 2], // 能力维度
      comprehensiveDegreeId: 1, // 综合度
      children: [], // 子题
      difficulty: 2, // 难度
      distinction: 2, // 区分度
      examPaperTypeId: 1, // 试卷类型
      examPointIdList: [], // 考点
      examTypeId: 1, // 卷型
      gradeId: 2, // 年级
      knowledgeIdList: [175485, 176873, 176877], // 知识点
      phaseId: 1,
      rating: 1, // 题目评级
      sourceId: 1, // 题目来源,
      subjectId: 1, // 学科
      suggestTime: 3 // 建议用时, 默认值是 3
      templateType: 2, // 配合 typeId 判断题型
      typeId: 2,       //
      title: "<p>243243<br/></p>", // 主题干
      year: 2019, // 年份
    });
    return (
      <div>
        <button onClick={this.handleShowQuestionTag}>显示QuestionTag</button>
        <QuestionTag
          question={question}
          visible={visible}
          cancelText="关闭"
          close={this.handleClose}
          submitTags={this.handleSubmit}
        />
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.body)
```

#### 改进方向
解耦后端请求与组件的耦合，数据通过外部传入

#### 缺陷，局限性
后端请求与组件耦合比较严重、现在只会渲染指定的字段，筛选条件的名字也是指定的
