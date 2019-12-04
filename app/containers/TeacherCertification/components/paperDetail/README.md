#### 功能说明
教资题库的试卷详情

#### index.js

参数 | 说明 | 类型 |是否必填| 默认值
---|---|---|---|---
data|试卷详情数据|object|是|-
edit|是否编辑状态|boolean|是|-
formData|右侧头部的表单数据|array|是|-
onDel|删除题目事件|function|是|-
onOrder|题目上移下移|function|是|-
onShowAnalysis|显示题目解析答案|function|是|-
onBatchShowAnalysis|批量显示题目解析答案|function|是|-
onDeleteBig|删除大题|function|是|-
onSubmit|提交数据|function|是|-
onBack|返回试卷列表并保存数据|function|是|-
onDirectBack|直接返回试卷列表|function|是|-
onSetScore|设置分数|function(target, isBatch, targetScore, i)|是|-
onAddSmall|添加小题|function(smallQuestion)|是|-

