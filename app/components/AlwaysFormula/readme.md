### 功能说明
公式选择，选择公式，进行预览或编辑

### index.js
#### AlwaysFormula

参数 | 说明 | 类型 | 默认值 | 是否必填
---|---|---|---|---
formulaBoxPosition | 窗口相对位置 | object{x: any, y: any} | {} | yes
changeFormulaBoxPosition | 拖动窗口时的回调 | ({ x, y }) => void | - | yes
momeryPosition | 记录的上次的位置，用于配合 changeFormulaBoxPosition 使用 | object{x: any, y: any} | - | no
changeMomeryPosition | 变化 momeryPosition 时的回调 | ({ detX, detY, x, y }) => void | - | no
subjectId | 学科 id | number | - | no
gradeId | 年级 id | number | - | no
insertText | 插入文本操作 | (text: string) => void | - | yes
closeFormulaBox | 关闭窗口的回调 | () => void | - | no
soucre | 来源，用于决定不同的展示方案 | string<br>可选值：'finalVerify' \| 'apperInputVerify' \| 'questionPicker' \| 'h5courseware' \|'scourseware'\| | - | yes
