#### 业务场景
这是一个顶部的加载进度条

#### 功能说明
顶部进度条：已经加载过的页面不会再次显示，配置 noNeedProcess 中的路径顶部不显示进度条

#### 实现方式
这是一个高阶组件，传入一个组件，返回一个顶部有进度条的组件。
进度条是通过监听的router的变化，改变进度条的状态。

#### 参数说明
参数 | 说明 | 类型 | 默认值
--- | --- | --- | ---
WrappedComponent |  | React.Node | -

#### 用法示例
```javascript
import withProgressBar from 'components/ProgressBar';
const Content = () => <div>App</div>
const App = withProgressBar(Content);

const rootRoute = {
  component: App,
  childRoutes: createRoutes(),
};
// ...
```

#### 改进方向
解除对 react-router 的依赖
不显示加载进度条的页面通过外部参数传入，不要在组件内部维护
代码优化

#### 缺陷，局限性
现在的组件依赖 react-router, 复用性一般
不显示加载进度条的页面需要配置在当前组件内
