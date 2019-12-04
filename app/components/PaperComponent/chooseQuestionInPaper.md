## ChooseQuestionInPaper
*编辑试卷中的选做题*

```jsx
// 组
class GroupItem {
  name: string;
  groupIndex: number;
  count: number;
  id: number;
  list: number[];
}
// 设置分组
class changeGroup {
  selectedType: number;           // delete 时不是必须
  questionIndexList?: number[];   // delete 时不是必须
  groupIndex: number;
  type: string;
}

// 使用如下
<ChooseQuestionInPaper
  changeRuleGroup={(data, closeCallback) => {
    if (data) {
      console.log(data);
      closeCallback();          // 关闭选做题编辑弹框
    } else {
      message('好像有什么问题？');
    }
  }}
  groupList={[]}
  max={20}
  onlyView
/>
```

### 参数说明
|参数|数据格式|备注|
|--|--|--|
|changeRuleGroup|(data: changeGroup, closeCallback) => void|设置或修改选做题的类型和分组规则|
|groupList|GroupItem[]|已经分组的分组数据|
|max|number|允许填入的题号的最大值(应当取题目数量)|
|onlyView|boolean|是否为只读(即非编辑模式)|