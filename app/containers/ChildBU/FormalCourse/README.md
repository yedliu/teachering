#### 模块介绍
模块名称：课程体系管理
子级菜单：
  - 正式课体系管理：/childBU/formalCourseSystemManagement
  - 正式课课程管理：/childBU/formalCourseManagement
  - 测评课课程管理：/childBU/evaluationCourseManagement

##### commonServer.js
这个文件下面主要是多个子级菜单都需要使用的接口请求的处理（主要是头部的筛选条件请求的接口）。
每个方法都返回值进行了一次处理, 处理成了 '[{ id: id , name: 'name' }, ... ]' 这种格式的数据。
这样做的主要原因是每个子模块都调用了 ManagementLayout(/components/ManagementLayout) 这个组件。

每个子级菜单下面都有一个 server.js 用来处理当前模块的数据的增删改查。

方法 | 用途 | 备注
---|--- | ---
getSubjectGrade | 获取学科以及学科对应的年级 | 年级是在每个学科数据的 'children' 字段中
getState | 获取上下架状态 | 这个数据是前端写死的，返回了一个 Promise, 主要是为了防止以后从接口获取后其他地方改动太大
getDifficulty | 获取难度 | 这个也是前端写死的
