#### 功能说明
试卷列表

#### index.js

参数 | 说明 | 类型 |是否必填| 默认值
---|---|---|---|---
data|试卷列表数据|array|否|[]
pagination|分页配置|object|否|{}
dict|字典数据|object|是|{}
onPage|翻页|function(selectedRowKeys, selectedRows)|是|-
onHandleOnOff|上下架|function(id)|是|-
onDelete|删除|function(id)|是|-
onPreview|预览|function(id)|是|-
onEdit|编辑|function(id)|是|-
