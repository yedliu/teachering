/**
 * 少儿测评课侧边
 */
import React from 'react';
import { Select, Icon, Spin } from 'antd';
import { fromJS } from 'immutable';
import styled from 'styled-components';
import { LeftListWrapper, TreeWrapper } from '../indexStyle';

const Option = Select.Option;

const Item = styled.li`
  font-size: 12px;
  color: #666;
  padding: 0 5px;
  line-height: 1.5;
  margin-bottom: 3px;
  cursor: pointer;
  .content {
    margin-left: 6px;
    padding: 3px 5px;
    background-color: ${props => (props.selected ? '#d2eafb' : 'none')};
    border-radius: 2px;
  }
`;

const TestHomeworkSlider = ({
  subjectList = fromJS([]),
  gradeList = fromJS([]),
  courseSystemList = [],
  subjectDictCode,
  gradeDictCode,
  courseSystemId,
  handleSubjectChange,
  handleGradeChange,
  handleCourseClick,
  loading
}) => {
  const SubjectOption = subjectList.map(subject => (
    <Option key={subject.id} value={`${subject.id}`}>
      {subject.name}
    </Option>
  ));
  const GradeOption = gradeList.map(grade => (
    <Option key={grade.id} value={`${grade.id}`}>
      {grade.name}
    </Option>
  ));
  return (
    <LeftListWrapper>
      <div style={{ display: 'flex', marginBottom: 10 }}>
        <Select
          value={subjectDictCode}
          style={{ flex: 1, marginRight: 5 }}
          onChange={subjectDictCode => { handleSubjectChange(subjectDictCode) }}
        >
          {SubjectOption}
        </Select>
        <Select
          value={gradeDictCode}
          style={{ flex: 1, }}
          onChange={gradeDictCode => { handleGradeChange(gradeDictCode) }}
        >
          {GradeOption}
        </Select>
      </div>
      <TreeWrapper>
        <Spin spinning={loading}>
          {courseSystemList.length > 0 ? (
            <ul style={{ marginTop: 5, flex: 1, overflow: 'auto' }}>
              {courseSystemList.map(el => (
                <Item
                  selected={courseSystemId === el.id}
                  key={el.id}
                  onClick={() => {
                    if (el.id === courseSystemId) return;
                    handleCourseClick(el.id, el.name);
                  }}
                >
                  <Icon type="file" />
                  <span className="content">{el.name}</span>
                </Item>
              ))}
            </ul>
          ) : (
            <div style={{ textAlign: 'center' }}>暂无数据</div>
          )}
        </Spin>
      </TreeWrapper>
    </LeftListWrapper>
  );
};

export default TestHomeworkSlider;
