## 前置知识点选择

### 使用demo
```jsx
<SelectKnowledgeModal
  originKnowledgeList={originKnowledgeList}
  selectedKnowledge={selectedKnowledge} // ，
  curKnowledge={curKnowledge} // 当前正在编辑的知识点，Immutable.Map
  onOk={(selectedKnowledge) => console.log(selectedKnowledge)}
  onCancel={() => console.log('close Modal')}
/>
```

### API
| 参数                | 类型                                    | 说明                 | 备注                        |
| ------------------- | --------------------------------------- | -------------------- | --------------------------- |
| originKnowledgeList | Immutable.List                           | 知识点数据           | 如需使用Array则需要修改组件 |
| selectedKnowledge   | string[]                                | 已经勾选的知识点数组 | --                          |
| curKnowledge        | Immutable.Map<{ id: number \| string }> | 当前正在编辑的知识点 | --                          |
| onOk                | (selectedKnowledge) => void             | 更新选中知识点的回调 | --                          |
| onCancel            | () => void                              | 关闭选择弹框         | --                          |