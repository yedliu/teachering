## 项目结构

```txt
.
├── app                     // source源码
│   ├── api                 // 服务层接口
│   ├── components          // 存放原子组件
│   │   ├── CommonFn        // 通用函数
│   ├── containers          // 存放聚合组件
│   ├── images              // 静态资源集中管理？
│   ├── lib                 // 额外资源
│   ├── map-routes          // 本地化教研路由及独立组件
│   ├── tests
│   ├── translations
│   ├── utils
│   │   ├── asyncInjectors.js
│   │   ├── config.js
│   │   ├── gtInit.js
│   │   ├── helpfunc.js
│   │   ├── immutableEnum.js
│   │   ├── localStorage.js
│   │   ├── request.js
│   │   ├── templateMapper.js
│   │   └── zmConfig.js
│   ├── app.js                // 项目入口文件
│   ├── index.html            // 页面模版
│   ├── appFunc.js
│   ├── reducers.js           // reducer 配置入口
│   ├── routes.js             // 路由配置文件，按需加载
│   └── store.js
│
├── dist                     // 打包目录
│   ├── config.js             // 打包配置
│   ├── webpack.base.babel.js
│   ├── webpack.dev.babel.js
│   ├── webpack.dll.babel.js
│   ├── webpack.prod.babel.h5.js
│   └── webpack.prod.babel.js
├── docs // 脚手架相关说明文档
│   ├── css
│   ├── general
│   ├── js
│   └── testing
├── internals                 // 构建脚本及工具
│   ├── generators
│   ├── mocks
│   ├── scripts
│   ├── testing
│   └── webpack                       // 存放 webpack 编译脚本
|       ├──config.js                  // 打包配置
│       ├── webpack.base.babel.js
│       ├── webpack.dev.babel.js
│       ├── webpack.dll.babel.js
│       ├── webpack.prod.babel.h5.js
│       └── webpack.prod.babel.js
├── server                    // 本地 Node 静态资源服务
│   └── middlewares
├── eslint.js                 // Eslint 通用配置
├── .eslintrc.js              // Eslint 中 React 相关配置
├── .eslintignore             // 可忽略 Eslint 检测的配置文件
├── .gitignore                // 可忽略 git 跟踪的配置文件
├── .editorconfig             // 默认编辑器配置文件
└── babel.config.js           // babel 编译配置相关
```

## **使用规则**

```bash
yarn                        # 安装依赖
yarn start                  # 本地启动（默认调用 test 接口）
yarn startTest              # 本地启动（调用 test 接口）
yarn startUat               # 本地启动（调用 uat 接口）
yarn startPro               # 本地启动（调用生产接口）
yarn build                  # 打包（默认调用 uat 接口）
yarn buildTest              # 打包（调用 test 接口）
yarn buildUat               # 打包（调用 uat 接口）
yarn buildPro               # 打包（调用生产接口）
```

## git操作

```bash
# 添加到暂存库
git add .

# 提交到本地仓库
git commit -m "message"

# 本地仓库推到线上仓库
git push
# 若当前分支未关联线上分支可以用以下方式关联并 push
git push --set-upstream origin <online_branch>
# 只关联已有分支不进行代码 push
git branch --set-upstream-to=origin/<online_branch> <local_branch>

# 合并分支请尽可能使用
git merge 分支名 --no-ff
# 默认 merge 会在分支删除后丢失提交信息
# --no-ff 会保留分支提交信息
# --squash 会丢失所有分支提交只保留本次合并后的一次提交信息
# --abort 撤销上一次的合并
```

## 业务项目拆分

教研后台是给老师用的一套后台管理系统。是掌门所有题目，试卷，作业等等数据的来源.

根据角色，老师分为全职老师和兼职老师.


## 新项目拆分

通过配置多个打包配置，按照路由把项目打包多份，在侧边导航中配置路由跳转。后期增加统一的模板管理，实现子项目独立管理

### 域名配置文件 app/utils/config 中，现有原则：
- start 启动，本地启动皆默认为由启动命令决定环境；查看详情，请到 config.js 中查看，如需要更改本地启动环境请修改 getHost 方法中的 devType 的值,或在 localStorage 中添加 devType 的值，可修改的值在文件中有注释说明；
- build 构建项目，本地访问构建后的话则为构建命令决定，如果想要调用指定环境借口，同上述一致，修改 localStorage 中的 devType 的值即可，发布到线上默认根据当前域名自动判断选用的接口配置；

## 本项目常用 npm 包
- [styled-components](https://www.styled-components.com/)【英】
- [antd](https://2x.ant.design/)【中】
- [immutable](https://facebook.github.io/immutable-js/docs/)【英】
- [katex](https://khan.github.io/KaTeX/)【英】
- [lodash](https://www.lodashjs.com/)【中】
- [moment](http://momentjs.cn/)【中】
- [react-cropper](https://github.com/TAPP-TV/react-cropperjs)【github】详细功能及API请见[cropperjs](https://github.com/fengyuanchen/cropperjs)
- [react-draggable](https://github.com/mzabriskie/react-draggable)【github】
- [react-fontawesome](https://github.com/danawoodman/react-fontawesome)【github】详细图标使用请见[font-awesome](http://www.fontawesome.com.cn/)【中】
- [react-modal](https://github.com/reactjs/react-modal)【github】
- [react-quill](https://github.com/zenoamaro/react-quill)【github】富文本编辑器，可以认为是富文本编辑器的基础组件，可以用来二次封装自己的富文本编辑器
- [ueditor](http://fex.baidu.com/ueditor/)【中】百度出品的老牌富文本编辑器（功能强大，文档并不算友好）
- [wangeditor](https://www.kancloud.cn/wangfupeng/wangeditor3/332599)【中】简洁化富文本编辑器（简洁友好的文档说明，更多功能可以在源码或未压缩代码中找到，例如document指令操作等，当然能实现的功能ueditor中基本都有）


