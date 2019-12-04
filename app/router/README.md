#### BU 拆分的路由
现在的路由是按照 BU 拆分的模块进行划分的，一个模块一个的路由放到一个文件里面:
- 一对一BU：1v1BU.js
- 基础数据管理： basicData.js
- 少儿 BU：childBU.js
- 优课资源管理：qualityCourse.js
- 陪练 BU：practicePartner.js
- 本地化教研：localTR.js
- 用户权限管理：userPermission.js
- 数据看板：dashboard.js
- 其他不在侧边栏的BU：commonRoutes.js

#### 功能实现
主要通过 utils 下的 renderRouteFactory 方法加载的路由

#### 注意事项
由于需要 BU 拆分，现在每个 BU 有自己的菜单模块，所以现在每个 BU 的表示都声明在每个模块之中：
```js
export default routes({ type: 'QualityCourse' });
```
在 BU 的模块中传入 type 就是每个模块的标识，这个标识需要和 `/lib/menu/contants.js` 中的值保持一致。