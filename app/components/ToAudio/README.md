## 模块说明

用于将文本转换成音频文件

## 参数说明

### Upload

| 属性 | 说明 | 类型 | 默认值 |备注
| --- | --- | --- | --- | --- |
| text | 要转换成音频的字符串 | string |  |
| questionId | 题目ID | string | null |
| getAudioPath | 获取转换成音频的访问链接 | func |(url) => {} | () => {} |
| clearAudioPath | 清空音频的访问链接 | func | () => {} | () => {} |
