#### 功能说明
教资题库设置题目分数

#### index.js

参数 | 说明 | 类型 |是否必填| 默认值
---|---|---|---|---
isBatch|是否批量改分数|boolean|否|-
onCancel|取消|function|是|-
onOk|确定|function(target, isBatch, targetScore, currentIndex)|是|-
target|目标题目id|number|是|-
score|默认分数|number|是|-
currentIndex|目标题目index|number|是|-
