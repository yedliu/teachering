#### 功能
用来关联教材版本和课程体系

#### index.js
参数|说明|类型|默认值
---|---|---|---
hasTeachingVersion|是否有教材版本，有则显示选择教材版本类型和节点|boolean|false
hasCourseSystem|是否有课程内容，有则显示选择课程和课程体系|boolean|false
gradeId|年级id,作为后端api传参|number|-
subjectId|课程id,作为后端api传参|number|-
teachingEditionId|教材版本id,作为后端api传参|number|-
editionId|课程内容版本id,作为后端api传参|number|-
gradeList|年级列表数据，作为下拉框内容|array|-
versionValue|教材版本节点value|object|-
systemValue|课程体系value|object|-
onOk|确认按钮click 事件的 handler|function|-
showSystemList|展示区域（name集合）形如{name: '课程A'}|array|-
teachingEditionName|教材版本名称|string|-


####common.js
判断该试卷类型下是否有某个字段

####server.js
接口

####备注
该组件包含server
