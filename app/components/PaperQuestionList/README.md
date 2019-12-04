#### 功能
试卷题目信息展示（预览）
试卷基本信息：试卷名，题目数量，可操作数量，录入者等，操作大题，编辑删除添加，预览

#### index.js


参数|说明|类型|默认值
---|---|---|---
source|来源（所处的页面）|string|-
questionsList|题目列表|immutable.List|-
questionSelectedIndex|选择的题目index|number|-
questionItemIndexClick|点击选择题目的handle|function(index:number, i:number, questionCount:number, selectedIndex:number, cur:number)|-
seePaperMsg|查看试卷信息按钮click事件handle|function|-
othersData|用于传输非必需参数|object|-
removeQuestion|移除题目|function('big',index:number)|-
wantAddQuestion|添加题目|function('big','add')|-
promptAlertShow|显示消息弹框|function(status:boolean)|-
setPromptAlertStates|设置消息弹框状态|function(fromJS(object))|-
toSeePaperMsg|查看试卷信息|function|-
