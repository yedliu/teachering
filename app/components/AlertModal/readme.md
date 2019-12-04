<!--
 * @Description: README
 * @Author: yinjie.zhang
 * @LastEditors: yinjie.zhang
 * @Date: 2019-04-08 15:03:25
 * @LastEditTime: 2019-04-08 15:34:12
 -->


### 功能说明
模态框，在组件内使用的模态弹框函数

### index.js

#### AlertModal: () => ReactDOM
参数 | 说明 | 类型 | 默认值 | 是否必填
---|---|---|---|---
me | 当前组件 | ReactClass | - | yes
child | content 内容 | any | - | yes
options | 弹框config | OptionConfig | - | yes
message | 按钮的文字内容 | string[] | no


#### OptionConfig
参数 | 说明 | 类型 | 默认值 | 是否必填
---|---|---|---|---
imgtype | 图片类型 | string<br>可选值：'warning' \| 'tip' \| 'success' \| 'error' \| 'passwdwarn \| 'happy' | - | no
smallGrade | 是否是少儿，根据是否是少儿选择不同的图片 | boolean | false | no
styles | content 部分的样式 | object | {} | no
showtype | 按钮的显示方案 | string<br>可选值：'confirm' \| 'choose' \| 'success' \| 'error' \| 'change' \| 'submitsuccess' | - | yes
cancelFunc | 一个按钮或两个按钮时右边的按钮的回调，没有时回去寻找 me.props.onAlertModalClose | () => void | yes
sureFunc | 两个按钮时左边的按钮的回调，没有时回去寻找 me.props.onAlertModalSure | () => void | yes
submitSuccessCallback | 仅当 showtype 为 'submitsuccess' 时且找不到 options.cancelFunc 时调用 | () => void | false
