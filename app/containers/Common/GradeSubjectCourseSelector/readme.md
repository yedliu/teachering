### 树形选择器用来筛选出课程体系
- 级联路径：年级→学科→版本→课程
- 归属：1对1
- 输出结果：课程体系id

### index.js
参数 | 说明 | 类型 | 默认值 | 是否必填
---|---|---|---|---
courseOnSelect | 点击树节点输出选中的课程体系 | function(selectedKeys, e:{selected: bool, selectedNodes, node, event}) | - | yes

