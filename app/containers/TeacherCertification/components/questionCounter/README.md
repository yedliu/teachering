#### 功能说明
题目索引枚举选择器

#### index.js

参数 | 说明 | 类型 |是否必填| 默认值
---|---|---|---|---
index|大题索引|number|否|1
bigQuestion|题目数据|object|是|-
onBatchSetScore|批量设置分数|function(id,isBatch,defaultScore,i)|是|-
currentId|当前选择的小题id|number|否|-
onDeleteBig|删除大题|function(id)|是|-
onSelect|选择小题|function(id)|是|-

