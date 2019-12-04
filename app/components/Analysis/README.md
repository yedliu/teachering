# Analysis

#### 业务场景

Analysis：业务组件
用于展示题目的“解析”及“答案”

#### 实现方式

默认是显示 “解析” 和 “答案” 的，可以通过传入对应的参数来控制其显示隐藏。
解析和答案的解析都通过 CommonFn 中的 renderToKatex 对公式进行了相应的转义。

#### 参数说明

参数 | 说明 | 类型 | 默认值
--- | --- | --- | ---
isShow | 控制 Analysis 组件的显隐 | bool | true
showAnswer | 是否显示答案 | bool | true
optional | 题目本身是否是有选项的，如选择题 | bool | false
answerList | 题目的答案数据 | object or array | fromJS([])
analysis | 题目的解析数据 | string | ''

#### 改进方向

没有事件监听，暂时业务功能还不涉及，后期可以根据需要完善
