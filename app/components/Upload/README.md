## 模块说明

分为文本、图片、音频

## 参数说明

### Upload

| 属性 | 说明 | 类型 | 默认值 |备注
| --- | --- | --- | --- | --- |
| serialMark | 确定序号的类型,支持英文和数字 | string | `A` | `1`
| optionList | 选项数据 | array | [] | --
| editorText | 传入富文本编辑器选项元素 | ReactDOM | -- | --
| answerOption | 是否显示答案,0代表不显示，1代表显示 | [] | [0, 0, 0] | text/img/audio
| type | 模板类型是听力题还是判断题 | string | `listen` | `judge`
| max | 选项最多出现几条 | number | 5 |
| fileUpload | 上传文件 | func | 5 |
| action | 上传的地址 | string|(file) => Promise | 无 |
| headers | 设置上传的请求头部，IE10 以上有效 | object | 无 |

### Text

| 属性 | 说明 | 类型 | 默认值 |备注
| --- | --- | --- | --- | --- |
| serialMark | 确定序号的类型,支持英文和数字 | string | `A` | `1`
| optionList | 选项数据 | array | [] | --

### Img

上传图片

### Audio

上传音频

| 属性 | 说明 | 类型 | 默认值 |备注
| --- | --- | --- | --- | --- |
| isPlay | 是否是播放状态 | bool | - | true or false

### JudgAnswer

"判断题"答案录入

| 属性 | 说明 | 类型 | 默认值 |备注
| --- | --- | --- | --- | --- |
| getAnswer | 获取答案数据 | func | () => {} | @return{index, value}



