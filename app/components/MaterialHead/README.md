#### 功能
素材内容管理的工具栏，包括按分类筛选，名称筛选，回收站按钮，上传图库按钮

#### index.js
参数|说明|类型|默认值
---|---|---|---
headList|待选参数列表|array|-
checkList|已选参数，用来加控制已选高亮|array|-
uploadPermission|上传文件的权限|boolean|-
cateClick|处理分类的点击事件|function(value: object, idx:number , pos: number)|-
searchChange|搜索框onChange事件|function(value: object)|-
searchClick|搜索按钮点击事件|function()|-
uploadClick|上传按钮点击事件|function()|-
