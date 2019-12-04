### 功能说明
带删除，编辑，显示图谱等功能的列表行
### index.js
ListView

参数 | 说明 | 类型 | 默认值
---|---|---|---
style|自定义样式|object|-
className|自定义类名|string|-
title|标题|string|-
children|子组件|ReactNode|-
onFooterBtnClick|添加按钮点击事件|function(index:number, props:object)|-
hiddenFooter|控制是否显示添加按钮|boolean|-
showDelete| 控制是否显示删除按钮|boolean|-

ListViewItem

参数 | 说明 | 类型 | 默认值
---|---|---|---
inputNum|是否显示输入框|boolean|-
num|课时数|number|-
style|自定义样式|object|-
className|自定义类名|string|-
name|标题内容|string|-
editable|是否可编辑|boolean|-
draggable|是否可拖动|boolean|-
onClick|点击事件|function(item:object, index2:number, props:object)|-
onDragStart|拖动开始的钩子函数|function(e:object, level:number, index:number)|-
onDrop|拖放钩子函数|function(e:object, index:number, index2:number, props:object)|-
onDragOver|拖动结束钩子函数|function(e: object)|-
save|编辑保存|function()|-
cancel|编辑取消|function()|-
onChange|输入框onChange事件|function(value:string, props:object)|-
onMouseOver|鼠标上移事件|function(index:number, index2:number, props:object)|-
onMouseLeave|鼠标离开事件|function(level:number, props:object)|-
toolBarVisible|控制是否显示工具栏|boolean|-
goToUpdate|修改按钮点击事件|function(e:object, item:object, index2:number, props:object)|-
goToDelete|删除按钮点击事件|function(e:object, index:number, index2:number, props:object)|-
handleDelete|确认删除按钮点击事件|function(e:object, item:object, index:number, props:object)|-
handlePopCancel|取消删除按钮点击事件|function(e:object)|-
inputNumChange|课时输入框onChange事件|function(e:object, value: number &VerticalLine; string)|-
selected|用来判断是否选中，选中改变背景色|boolean|false
lookMap|图谱按钮点击事件|function(item:object, itemList:array)

messages.js

国际化相关文件




                     
