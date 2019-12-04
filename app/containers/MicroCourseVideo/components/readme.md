#### 组件名
UploadImg
#### 功能说明
微课上传封面图片

#### UploadImg.js

参数 | 说明 | 类型 |是否必填| 默认值
---|---|---|---|---
btnClass|上传按钮的类名|string|是|-
onChange|图片变化时的回调|function(url, size, objectName)|是|-
imgUrl|默认图片地址|string|是|-


#### 组件名
UploadVideo
#### 功能说明
微课上传视频

#### UploadVideo.js

参数 | 说明 | 类型 |是否必填| 默认值
---|---|---|---|---
onChange|视频变化时的回调|function(url, fileSize)|是|-


#### 组件名
VideoDetail
#### 功能说明
微课的视频详情和内容详情

#### VideoDetail.js

参数 | 说明 | 类型 |是否必填| 默认值
---|---|---|---|---
data|默认数据|{}|否|{}
status|操作状态|edit或者add|是|-
onClose|关闭回调|function|是|-
onSave|保存回调|function(value)|是|-
type|使用类型|microCourseVideo或microCourseContent|是|-


