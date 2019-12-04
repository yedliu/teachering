<!--
 * @Description: README
 * @Author: yinjie.zhang
 * @LastEditors: yinjie.zhang
 * @Date: 2019-04-08 12:02:35
 * @LastEditTime: 2019-04-08 15:34:38
 -->
 
### 功能说明
模态框，组建内使用的模态弹框


### index.js
#### Alert

参数 | 说明 | 类型 | 默认值 | 是否必填
---|---|---|---|---
properties | 弹窗的config参数 | AlertConfig | defaultConfig | yes
children | 弹框中内容 | any | - | no


#### AlertConfig
参数 | 说明 | 类型 | 默认值 | 是否必填(仅对于当前属性可操作时)
--- | --- | --- | --- | ---
buttonsType | 按钮的形式,'1-1'(一个按钮，类型1) | '2-12'(两个按钮，类型分别为 1 和 2 ) | string | - | no
btnClassName | 按钮的 className | string[] | [] | no
buttonsIndent | 设置按钮的 padding | any | - | no
child | 自定义的按钮文字内容 | string[] | ['确定', '取消'] | no
title | 标题 | string | '警告!' | no
titleStyle | 标题的样式 | object | {} | no
oneClick | buttonsType 为 '1' 时的点击回调 | () => void | - | yes
leftClick | buttonsType 为 reg`2-\d{2}` 时的左侧按钮点击回调 | () => void | - | yes
rightClick | buttonsType 为 reg`2-\d{2}` 时的右侧按钮点击回调 | () => void | - | yes
href | 为按钮添加跳转连接 | string[] | - | no
imgType | 提示中图片类型(优先级高于 children) | 'success' \| 'error' \| 'loading' \| 'warning' | - | no
showDouble | 是否同时显示图片以及 children | boolean | - | no
isOpen | 是否显示 modal | boolean | false | yes
rightClose | 是否在显示右上角的关闭按钮 | boolean | - | yes
closeClick | 右上角关闭按钮的回调 | () => void | - | yes
lineColor | 弹窗标题与内容之间的横线的颜色 | string | #ccc | no
