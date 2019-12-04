#### 模块介绍
模块名称：正式课体系管理
对应路由：/childBU/formalCourseSystemManagement

这个页面主要是 正式课体系 的增删改查。

这里的筛选条件 '年级' 是根据学科获取的。

##### server.js
这个文件下面主要是多个子级菜单都需要使用的接口请求的处理（主要是头部的筛选条件请求的接口）。
每个子级菜单下面都有一个 server.js 用来处理当前模块的数据的增删改查。

方法 | 用途 | 备注
---|--- | ---
getEdition | 获取课程体系 | -
createEdition | 创建课程体系 | 这个方法会 reslove 一个 success 的状态，用来判断创建成功还是失败
updateEdition | 更新课程体系 | 这个方法会 reslove 一个 success 的状态，用来判断更新成功还是失败
deleteEdition | 删除课程体系 | 这个方法会 reslove 一个 success 的状态，用来判断删除成功还是失败

