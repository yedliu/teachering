# 题目

## 功能说明

单题录入、修改模块

## 功能路径

题库管理 =》已入库题目管理 =》添加题目

向课件/切片中添加题目：/iframe/question-picker =》新增题目

## 模板

新题型的交互模式比较特别，是通过鼠标拖拽来交互的

```js
{ id: 1,name: '复合题' }, // 听力题
{ id: 2,name: '选择题' }, // 听力题
{ id: 3,name: '填空题' },
{ id: 4,name: '简答题' },
{ id: 5,name: '分类题' },// new
{ id: 6,name: '配对题' },// new
{ id: 7,name: '选词填空' },// new
{ id: 8,name: '主观选择题' },// 学习力训练
{ id: 9,name: '互动判断题' },// 少儿
```

## 题型

老接口

```bash
https://qb-test.zmlearn.com/api/questionType
```

新接口

```js
http://10.80.63.108:8080/api/sysDict/queryDictsByGroup?groupCode=QB_QUESTION_TYPE
```

```js
    {"id":1,"name":"单选题"},
    {"id":2,"name":"多选题"},
    {"id":3,"name":"填空题"},
    {"id":4,"name":"解答题"},
    {"id":5,"name":"翻译题"},
    {"id":6,"name":"判断题"},
    {"id":7,"name":"连线题"},
    {"id":8,"name":"实验题"},
    {"id":9,"name":"实践探究"},
    {"id":10,"name":"句子变形"},
    {"id":11,"name":"作图题"},
    {"id":12,"name":"口算题"},
    {"id":13,"name":"计算题"},
    {"id":14,"name":"应用题"},
    {"id":15,"name":"完形填空"},
    {"id":16,"name":"阅读理解"},
    {"id":17,"name":"句型转换"},
    {"id":18,"name":"书面表达"},
    {"id":19,"name":"七选五"},
    {"id":20,"name":"任务型阅读"},
    {"id":21,"name":"短文改错"},
    {"id":22,"name":"句子改错"},
    {"id":24,"name":"问答题"},
    {"id":25,"name":"材料题"},
    {"id":27,"name":"简答题"},
    {"id":28,"name":"排序题"},
    {"id":32,"name":"语法填空"},
    {"id":33,"name":"读后续写"},
    {"id":34,"name":"概要写作"},
    {"id":35,"name":"选词填空"},
    {"id":36,"name":"分类题"},
    {"id":37,"name":"配对题"},
    {"id":47,"name":"主观选择题"}
```

## index.js 传入参数说明

### EditItemQuestion

参数 | 说明 | 类型 | 默认值 | 是否必填
---|---|---|---|---
questionTypeList | 题型列表（需要外部传入） | {id:number,name:string}[] | [] | yes
newQuestion | 需要添加、修改的题目数据 | Immutable.Map | Immutable.Map({}) | yes
soucre | 来源 | 根据来源决定功能 | string | - | yes
setNewQuestionData | 每次编辑题目内容时触发 | () => void | - | yes
isJiucuo | 是否是纠错时的编辑 | boolean | false | no
clickTarget | 用于记录当前操作的目标（即编辑器位置的确定） | string | "" | yes
setClickTarget | 切换编辑内容时触发（对应外部需要更改clickTarget） | () => void | yes
isOpen | 是否显示 | boolean | false | yes
pointList | 需要编辑知识点和考点时，由外部传入 | {knowledgeIdList: number[],examPointIdList: number[]} | {knowledgeIdList: [],examPointIdList: []} | no
questionEditState | 标题状态：1（编辑题目）!1（添加题目） | number | - | no
changeQuestionEditState | 更改编辑状态（questionEditState）
submitQuestionItem | 点击提交保存按钮时回调 | () => void | - | no
source2 | 来源（用于区分是否为 zml 课件使用） | string | - | no
