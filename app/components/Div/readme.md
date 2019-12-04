### 功能说明
提供几个基本的元素及布局用的样式元素（这里的主要为脚手架自带，请使用 FlexBox 样式元素）

### index.js

变量 | 说明 | 类型 | 默认值
--- | --- | --- | ---
fadeIn | 动画渐入 | keyframes | opacity: 0->1
Div | div元素 | HTMLDivEmelemt | background-color:white;
FadeInDiv | 动画渐入的div | HTMLDivEmelemt | animation: ${fadeIn} .3s linear;
FlexRowDiv | flex 横向布局的 div | HTMLDivEmelemt | display:flex; flex-direction: row;
FlexColumnDiv | flex 纵向布局的 div | HTMLDivEmelemt | display:flex; flex-direction: column;
DivShadow | 阴影样式 | css | box-shadow:  0px 2px 4px rgba(233, 236, 244, .5); border-radius: 6px;
DialogLargeDiv | dialog 弹框样式的 div | HTMLDivEmelemt | width:800px;height:610px;background: #FFF;border: 1px solid #DDD;box-shadow: 0 8px 24px 0 rgba(0,0,0,0.20);border-radius: 6px;
