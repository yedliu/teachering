### 功能说明
模态框，组建内使用的模态弹框

### index.js
#### Button

参数 | 说明 | 类型 | 默认值 | 是否必填
---|---|---|---|---
data | 所需数据 | Immutable<questionChild> | - | yes
textMax | 最多有几处文字 | number | - | no
ImgMax | 最多有几张图片 | number | - | no
allMax | 最多有几个元素 | number | - | no
title | 标题 | string | - | no
hasTitleInput | 标题有没有输出框 | bool | false | no
setClassify | 改变内容回调方法 | () => void | - | no
sequence | 该框位于第几个 | number | | no
layoutStyle | 2表示图文都可以 1表示文字 3表示图片 | string | - | yes
closeBox | 关闭窗口是的回调 | () => void | - | yes
