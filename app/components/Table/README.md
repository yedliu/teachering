#### 业务场景
这是一个表格组件，有 Tab、切换排序方式、分页

#### 功能说明
这个表格组件样式基本上是固定的，试题录入的表格都是使用的这个组件

#### 参数说明
参数 | 说明 | 类型 | 默认值
--- | --- | --- | ---
rowList | 表头 | array | -
headerItem | Tab栏 | immutable.list | -
source | 来源 | string | -
pageSize | 分页使用的 pageSize | number | -
pageIndex | 当前页 | number | 1
paperCount | 总共有多少条数据 | number | -
selected | 表格中选中的列数 | bool | -
tablebodydata | 表格 body 的数据 | immutable.list | -
paperState | 选中的 Tab 栏 | number | -
changeSelectedPaperStateIndex | 改变选中的 Tab 栏 | func | -
changeReceiveState | 切换表格上面的选项时的回调 | func | -
changePageNum | 改变当前的页码 | func | -
stateItem | 状态栏以及操作栏所需要的数据 | array | -
orderItemsClick | 改变排序方式的回调 | func | -
idLoading | 加载中 | bool | false
trItemList | table tr 中各项的属性名 | array | -
whoCanBeClick | 控制 操作栏 哪些状态可以点击 | array | -
noPageTurning | 是否隐藏分页 | bool | false

#### 用法示例

完善点击事件
```javascript
import { fromJS } from 'immutable';
import ShowQuestionItem from 'components/ShowQuestionItem';
class App extends React.Component{
  state = {
    paperState: 1,
    loading: false,
    tablebodydata: fromJS([]),
    pageIndex: 1,
  }

  changePaperState = () => {
    const { paperState } = this.state;
    const newPaperState = paperState === 0 ? 1 : 0;
    this.setState({ paperState: newPaperState }, () => {
      this.getData();
    })
  }

  changePageNum = (value) => {
    this.setState({ pageIndex: value }, () => {
      this.getData();
    })
  }

  getData = () => {
    this.setState({ loading: true });
    const { paperState, pageIndex, pageIndex } = this.state;
    const data = fromJS(Array.from({length: 10}).map((el, index) => ({
      control: paperState,
      insertPerson: `测试${pageIndex}${index}号`,
      paperName: `试卷名称${pageIndex}${index}`,
      paperState,
      questionCount: index,
      refleshTime: "2018-10-15"
    })));
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 1000);
    }).then((data) => {
      this.setState({ tablebodydata: data, loading: false })
    })
  }

  render() {
    const { tablebodydata, loading,  } = this.state;
    const trItemList = [
      "paperName",
      "questionCount",
      "insertPerson",
      "refleshTime",
      "paperState",
      "control",
    ];
    const rowList = [
      {name: "试卷名称", scale: 4},
      {name: "题目数量", scale: 1.1},
      {name: "上传者", scale: "150px"},
      {name: "更新时间", scale: 1.5},
      {name: "状态", scale: 1.5},
      {name: "操作", scale: 2},
    ];
    const paperState = 0;

    const headerItem = fromJS([
      {name: "待领取", num: 20},
      {name: "已领取", num: 20},
    ]);


    const stateItem = [
      {name: "paperState", state: {0: "待领取",  1: "已领取"}},
      {name: "control", state: {0: "领取", 1: "已领取"}, clickBack: () => {console.log('click')} }
    ];
    const paperCount = 20;
    const whoCanBeClick = [0];

    return (
      <div>
        <Table
          source={'getandcutpaper'}
          trItemList={trItemList}
          rowList={rowList}
          headerItem={headerItem}
          tablebodydata={tablebodydata}
          stateItem={stateItem}
          paperState={paperState}
          changeReceiveState={this.changePaperState}
          paperCount={paperCount}
          whoCanBeClick={whoCanBeClick}
          changePageNum={this.changePageNum}
          orderItemsClick={this.getData}
          idLoading={loading}
          pageIndex={pageIndex}
          pageSize={10}
        />
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.body)
```
