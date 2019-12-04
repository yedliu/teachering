### 带3个select组件和一个tree组件的级联选择器组件


参数 | 说明 | 类型 | 默认值 | 是否必填
---|---|---|---|---
selectOne | 第一个select组件的相关参数 | { data: array, placeholder: string, defaultValue: string  } | - | yes
selectTwo | 第一个select组件的相关参数 | { data: array, placeholder: string, defaultValue: string  } | - | yes
selectThree | 第一个select组件的相关参数 | { data: array, placeholder: string, defaultValue: string  } | - | yes
treeData | tree组件相关参数 | { data: array, defaultNode: string, defaultExpand: string } | - | yes
loading | 获取课程体系时的loading| boolean | - | yes
selectOnChange | 所有select组件的onChange事件 | func（e, i）| - | yes
treeOnChange | tree组件的onSelect事件 | function(selectedKeys, e:{selected: bool, selectedNodes, node, event})|-|yes
