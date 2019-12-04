### 功能说明
提供几个基本的元素及布局用的样式元素

### index.js

变量 | 说明 | 类型 | 默认值
--- | --- | --- | ---
FlexBox | flex 默认布局的 div | HTMLDivEmelemt | display:flex;
FlexRow | flex 横向布局的 div | HTMLDivEmelemt | display:flex;flex-direction: row;
FlexRowCenter | flex横向布局，纵向居中 | HTMLDivEmelemt | styled(FlexRow)\`align-items: center;`
FlexColumn | flex 纵向布局的 div | HTMLDivEmelemt | styled(FlexBox)\`flex-direction: column;`
FlexColumnCenter | flex 纵向布局，横向居中 | HTMLDivEmelemt | styled(FlexColumn)\`align-items: center;`
FlexCenter | flex 默认布局垂直水平居中 | HTMLDivEmelemt | styled(FlexBox)\`justify-content: center;align-items: center;`
fadeIn | 渐入动画 | keyframes | opacity: 0->1
fadeOut | 渐出动画 | keyframes | opacity: 1->0
FadeIn | 渐入样式 | css | animation: fadeIn 0.3s linear;
FadeOut | 渐出动画 | css | animation: fadeOut 0.3s linear;
DivShadow | 元素阴影 | css | box-shadow: 0px 2px 4px rgba(233, 236, 244, .5);border-radius: 6px;

