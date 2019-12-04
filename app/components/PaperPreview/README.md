#### 功能
试卷切割后的预览弹框，可以设置所属大题，小题题号，小题题型，保存方式

#### index.js

参数|说明|类型|默认值
---|---|---|---
source|来源（当前所使用的页面）|string|-
currentCutPaperImg|预览的图片|string(图片url)|-
previewWrapperShowOrHide|是否显示|boolean|false
QuestionItemCutSure|确定按钮的click事件handle|function|-
questionTypeList|题型列表数据|immutable.List|-
selectedquestionType|选中的题型|immutable.Map|-
changeSelectedQuestionType|切换题型的handle|function(item: object)|-
changeSmallQuestion|保存小题信息|function(item:object)|-
smallQuestion|小题信息|immutable.Map|-
selectedBigQuestion|选择的大题|immutable.Map|-
questionsList|大题列表|immutable.List|-
selectQuestionAndType|选择大题或插入方式|function(value: object)|-
changeInsertIndex|切换插入的位置|function(item:object)|-
selectedInsertIndex|插入的位置|immutable.Map|-
isAddOrEdit|插入与修改相关|object|-
btnCanClick|按钮是否可以点击|boolean|true
