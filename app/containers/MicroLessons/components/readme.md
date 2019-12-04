#### 组件名
DraggbleTable
#### 功能说明
微课内容的视频列表，支持拖拽排序

#### DraggbleTable.js

参数 | 说明 | 类型 |是否必填| 默认值
---|---|---|---|---
data|视频列表|[]|是|-
onEdit|编辑按钮回调|function(item)|是|-
onDel|删除按钮回调|function(item)|是|-
onDragSort|拖拽排序回调|function(dragIndex, originTargetIndex, targetId)|是|-



#### 组件名
VideoDetail
#### 功能说明
微课内容视频详情

#### VideoDetail.js

参数 | 说明 | 类型 |是否必填| 默认值
---|---|---|---|---
status|操作状态|edit或add|是|-
onClose|关闭回调|function|是|-
onSelectVideo|添加视频按钮回调|function|是|-
selectedVideo|已选视频|{}|是|-
onClearVideo|清除视频回调|function|是|-
onSave|保存视频|function(params)|是|-
data|当前选中的视频|{}|是|-
