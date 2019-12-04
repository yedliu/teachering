#### 业务场景
筛选条件的组合。

#### 功能说明
组件支持的筛选条件 type 及 name：
```js
[{
  type: 'grade',
  name: '年级',
}, {
  type: 'year',
  name: '年份',
}, {
  type: 'subject',
  name: '学科',
}, {
  type: 'term',
  name: '学期',
}, {
  type: 'edition',
  name: '版本',
}, {
  type: 'province',
  name: '省',
}, {
  type: 'city',
  name: '市',
}, {
  type: 'county',
  name: '县',
}, {
  type: 'paperType',
  name: '试卷类型',
  minWidth: 78,
}, {
  type: 'examType',
  name: '卷型',
}, {
  type: 'difficulty',
  name: '难度',
}, {
  type: 'questionType',
  name: '题型',
}, {
  type: 'source',
  name: '题目来源',
  minWidth: 78,
}, {
  type: 'distinction',
  name: '区分度',
  minWidth: 60,
}, {
  type: 'comprehensiveDegree',
  name: '综合度',
  minWidth: 68,
}, {
  type: 'rating',
  name: '题目评级',
}, {
  type: 'scene',
  name: '使用场景',
}, {
  type: 'businessCard',
  name: '试卷名片',
}, {
  type: 'input',
  name: '关键字',
}, {
  type: 'search',
  name: '搜索',
}, {
  type: 'purpose',
  name: '用途'
}, {
  type: 'examPaperSource',
  name: '试卷来源',
}, {
  type: 'id',
  name: '试卷id',
}]
```
省份会加上 '全国' option。

支持从服务器获取数据的字段：
  年级、学科、年份、难度、使用场景、综合度、区分度、评级、试卷名片、用途、学期、版本、省市区、题型、题目来源、卷型、试卷来源

#### 参数说明
参数 | 说明 | 类型 | 默认值
--- | --- | --- | ---
whoseShow | 当前显示哪些下拉框 | PropTypes.array.isRequired | -
searchDate | 查询用的参数  searchData.inputName 和 searchData.placeholder 都是给搜索框用的 | PropTypes.object | -
searchStyle | 输入框的样式 | PropTypes.object | -
noFetch | 哪些是不需要请求数据，完全由外部传入 | PropTypes.object | -
dataList | 传入的数据列表，要想生效必须在 noFetch 中有传入对应的项 | PropTypes.object | -
selectType | 当前选中的项 | PropTypes.object | -
changeSelect | 下拉框切换时的回调 | PropTypes.func.isRequired | -
deviSelect | 必选的有哪些 | PropTypes.array | -
backDataList | 返回获取到的数据 | PropTypes.func | -

#### 用法示例
```javascript
import QuestionSearchData from 'components/QuestionSearchData';
class App extends React.Component{
  state = {
    selectData: {}
  }
  changeSelectType(value, type) {
    const selectData = this.state.selectData;
    selectData[type] = value;
    this.setState({selectData});
  }
  render() {
    const whoseShow = [
      'paperType', 'questionType', 'difficulty', 'grade', 'term',
      'year', 'source', 'examType', 'input', 'area',
      'distinction', 'comprehensiveDegree', 'rating', 'scene'
    ];

    const questionType = [
      {"id":1,"name":"课标Ⅰ卷"},
      {"id":2,"name":"全国Ⅰ卷"},
      {"id":3,"name":"全国Ⅱ卷"},
      {"id":4,"name":"北京卷"},
      {"id":5,"name":"上海卷"},
      {"id":6,"name":"江苏卷"},
      {"id":7,"name":"预赛"},{"id":8,"name":"复赛"},
      {"id":9,"name":"决赛"}
    ];

    return (
      <QuestionSearchData
        searchStyle={{ wrapper: { width: '100%' }, item: { height: 35 } }}
        whoseShow={whoseShow}
        dataList={{
          questionType,
        }}
        searchDate={{
          placeholder: '请输入关键字',
          inputName: '关键字',
        }}
        selectType={{
          paperType: { id: selectData.paperType || -1 },
          questionType: { id: selectData.questionType || -1 },
          difficulty: { id: selectData.difficulty || -1 },
          grade: { id: selectData.grade || -1 },
          term: { id: selectData.term || -1 },
          year: { id: selectData.year || -1 },
          source: { id: selectData.source || -1 },
          examType: { id: selectData.examType || -1 },
          province: { id: selectData.province || -1 },
          city: { id: selectData.city || -1 },
          county: { id: selectData.county || -1 },
          distinction: { id: selectData.distinction || -1 },
          comprehensiveDegree: { id: selectData.comprehensiveDegree || -1 },
          rating: { id: selectData.rating || -1 },
          scene: { id: selectData.scene || -1 },
        }}
        noFetch={{ questionType: true }}
        changeSelect={this.changeSelectType}
      >
    )
  }
}

ReactDOM.render(<App/>, document.body)
```

#### 改进方向
解耦后端请求与组件的耦合，数据通过外部传入

#### 缺陷，局限性
后端请求与组件耦合比较严重、现在只会渲染指定的字段，筛选条件的名字也是指定的
