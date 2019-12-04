import React from 'react';
import { toString } from 'lodash';
import { SelectBox } from './style';
import { Select, Button } from 'antd';

const Option = Select.Option;
const selectStyle = { width: 120, marginRight: 20 };

class FormSelect extends React.Component {
  changeData = (params, type) => {
    const { changeFormData } = this.props;
    if (changeFormData) changeFormData(params, type);
  }
  changeGrade = (gradeId) => {
    this.changeData({ selectedGradeId: gradeId }, 'grade');
  }
  changeSubject = (subjectId) => {
    this.changeData({ selectedSubjectId: subjectId }, 'subject');
  }
  searchData = () => {
    this.changeData({}, 'serach');
  }
  render() {
    const {
      gradeList = [],
      subjectList = [],
      selectedGradeId = '',
      selectedSubjectId = '',
    } = this.props;
    return (
      <SelectBox>
        <label>年级：</label>
        <Select style={selectStyle} value={selectedGradeId} onChange={this.changeGrade}>
          {gradeList.map((grade) => (<Option value={toString(grade.gradeDictCode)} key={toString(grade.gradeDictCode)}>{grade.gradeName || ''}</Option>))}
        </Select>
        <label>学科：</label>
        <Select style={selectStyle} value={selectedSubjectId} onChange={this.changeSubject}>
          {subjectList.map((subject) => (<Option value={toString(subject.subjectDictCode)} key={toString(subject.subjectDictCode)}>{subject.subjectName || ''}</Option>))}
        </Select>
        <Button onClick={this.searchData} type="primary">查询</Button>
      </SelectBox>
    );
  }
}

export default FormSelect;