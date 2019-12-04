import React from 'react';
import Knowledges from './Knowledge';
import Content from './Content';
import {
  RootWrapper,
} from './indexStyle';

class QueryHomework extends React.Component {
  componentDidMount() {
    this.getFormData();
  }
  getFormData() {
    const { getData } = this.props;
    if (getData) {
      getData();
    }
  }
  paramsChange = (type, value) => {
    const { selectChange } = this.props;
    if (selectChange) {
      selectChange('hw', type, value);
    }
  }
  render() {
    const {
      formData, formDataParams,
      courseSystemIsGetting, homeworkIsGetting,
    } = this.props;
    const grade = {
      selectedGrade: formDataParams.get('grade'),
      gradeList: formData.get('gradeList'),
    };
    const subject = {
      selectedSubject: formDataParams.get('subject'),
      sudjectList: formData.get('subjectList'),
    };
    const edition = {
      selectedEdition: formDataParams.get('edition'),
      editionList: formData.get('editionList'),
    };
    const courseSystem = {
      selectedCourseSystem: formDataParams.get('courseSystem'),
      courseSystemList: formData.get('courseSystemList'),
    };
    const homework = {
      selectedHomework: formDataParams.get('homework'),
      homeworkList: formData.get('homeworkList'),
    };
    return (
      <RootWrapper>
        <Knowledges
          courseSystemIsGetting={courseSystemIsGetting}
          grade={grade}
          subject={subject}
          edition={edition}
          courseSystem={courseSystem}
          selectChange={this.paramsChange}
        />
        <Content
          homework={homework}
          homeworkIsGetting={homeworkIsGetting}
          pageIndex={formDataParams.get('pageIndex')}
          pageCount={formDataParams.get('total')}
          paramsChange={this.paramsChange}
        />
      </RootWrapper>
    );
  }
}

export default QueryHomework;