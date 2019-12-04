## 教资题库录题组件
这是录题的组件，如果需要直接使用可以使用 QuestionModal 这个组件，具体用法也可以参考 QuestionModal 组件

#### 参数说明
参数 | 说明 | 类型 | 默认值
--- | --- | --- | ---
questionType | 题型 | string | -
optionType | 选项的类型 | string | text
options | 选项 | array | ['', '', '', '']
questionTitle | 题干 | string | -
subQuestion | 问题 | array | ['']
materials | 材料 | string | -
analysis | 解析 | string | -
answer | 答案 | string | -
referenceAnswer | 参考答案 | string | -
questionTypeList | 题型列表 | array | -
loading | 完成的按钮的 loading | bool | false
okText | 完成按钮的文本 | string | 完成
selectDisabled | 是否禁用选择题型的下拉框 | bool | false
onCancel | 取消事件 | function | -
onSave | 保存事件 | funtion | -

onSave 方法传入的数据只包含当前题型需要的字段
