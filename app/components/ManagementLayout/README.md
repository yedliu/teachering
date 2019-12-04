#### 数据管理使用的 Layout

通过传入一个 Array 以及 children 渲染出对应的页面。

##### props
 list: Array
 children: React.children

#### list的格式
```js
[
  {
    label: 'string',
    value: 'string',
    type: 'select' || 'button',
    list: 'array',
    method: 'function',
    buttonType: 'default | primary | dashed |danger'
  },
  ...
];
```
type: select => 显示的就是一个下拉库筛选项
type: button => 渲染的是 Antd 的 Button

组件会优先渲染 select。

#### 使用方法
```js
import React from 'react';
import ManagementLayout from 'components/ManagementLayout';

const FormalCourseSystemManagement = () => {

}
export default class ManagementLayoutDemo  extends React.Component {
  state = {
    subjectList: [],
    gradeList: [],
    subjectId: '',
    gradeId: '',
  };

  handleSubjectChange = value => {
    this.setState({ subjectId: value });
  };

  handleGradeChange = value => {
    this.setState({ gradeId: value });
  };

  handleSearch = () => {
    console.log('clicl search')
  }

  render() {
    const {
      subjectList,
      gradeList,
      subjectId,
      gradeId,
    } = this.state;

    const list = [
      {
        label: '学科',
        value: subjectId,
        type: 'select',
        list: subjectList,
        method: this.handleSubjectChange
      },
      {
        label: '年级',
        value: gradeId,
        type: 'select',
        list: gradeList,
        method: this.handleGradeChange
      },
      {
        label: '搜索',
        type: 'button',
        buttonType: 'primary',
        method: this.handleSearch
      }
    ];

    return (
      <div style={{ background: '#fff' }}>
        <ManagementLayout list={list}>
          <div>Content</div>
        </ManagementLayout>
      </div>
    );
  }
}
```