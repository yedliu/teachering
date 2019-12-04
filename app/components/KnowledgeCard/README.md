## 功能说明
知识点卡片，提供对知识点进行增删改等功能；

### index.js

参数 | 说明 | 类型 | 默认值
---|---|---|---
index | 知识点等级| number | -
currentIdx| 当前选中的知识点id | number | -
bodyList| 知识点列表数据 | array | -
onChange| 点击知识点获取当前知识点数据 | function(index:number, currentIndex:number, id:number) |-
editing| 是否编辑状态 | boolean | false
adding| 是否新增状态| boolean |false
activeLevel|当前激活的知识点等级|boolean|false
onDragStart| 开始拖拽钩子函数|function(e, level:number, itemIndex:number)|-
onDrop|拖放动作的钩子函数|function(e, level:number, itemIndex:number, list:array)|-
onDragEnd| 拖放结束时的钩子函数|function(e, level:number, itemIndex:number)|-
batchDelete|删除知识点（点击确认删除执行）|function(level:number, list:array)|-
beforeDelete|点击删除执行|function(index:number)|-
tab|标志当前组件的使用场景|String|-
status|用来控制新增按钮是否显示，仅在其值为1时显示|number|-

