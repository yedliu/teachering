#### 功能说明
教资题库展示题目

#### index.js

参数 | 说明 | 类型 |是否必填| 默认值
---|---|---|---|---
index|当前大题索引|number|是|-
bigQuestionList|大题列表|array|是|-
selectedSmallId|选中的小题id|number|否|-
preview|是否是预览页|boolean|否|-
onShowAnalysis|展示解析答案|function(id,status)|是|-
onDel|删除小题|function(id)|是|-
onOrder|上移下移题目|function(id, type, bigId)|是|-
onBatchSetScore|批量设置题目分数|function(target, type, defaultScore, i)|是|-

