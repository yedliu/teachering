import React from 'react';
import TreeSelector from 'components/TreeSelector/index.js';
import { getGrade, getSubject, getEdition, getCourse } from './server';
import { findLastLevel } from 'utils/helpfunc';
class GradeSubjectCourseSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gradeList: [],
      subjectList: [],
      editionList: [],
      courseList: [],
      defaultGradeId: '',
      defaultSubjectId: '',
      defaultEditionId: '',
      loading: false,
      defaultCourse: '',
      defaultExpand: ''
    };
  }
  componentDidMount() {
    this.init().then(() => {
      this.treeOnChange([this.state.defaultCourse]);
    });
  }
  /**
   * select组件onChange事件
   * @param e 选中项的值
   * @param i 标志第几个select组件
   */
  selectOnChange = (e, i) => {
    switch (i) {
      case 1:
        this.setState({ defaultGradeId: e.key });
        this.selectGrade(e.key);
        break;
      case 2:
        this.setState({ defaultSubjectId: e.key });
        this.selectSubject(this.state.defaultGradeId, e.key);
        break;
      default:
        this.setState({ defaultEditionId: e.key });
        this.selectEdition(this.state.defaultGradeId, this.state.defaultSubjectId, e.key);
    }
  }
  // 初始化，默认所有数据都选第一个
  init = async () => {
    let gradeList = await getGrade();
    if (gradeList.length > 0) {
      let gradeId = gradeList[0].id;
      this.setState({ gradeList,  defaultGradeId: gradeId });
      this.selectGrade(gradeId);
    }
  }
  /**
   * 选择年级
   * @param gradeId 年级id
   * @returns {Promise<void>}
   */
  selectGrade= async (gradeId) => {
    let subjectList = await getSubject(gradeId);
    if (subjectList.length > 0) {
      let subjectId = subjectList[0].id;
      this.setState({ subjectList, defaultSubjectId: subjectId });
      this.selectSubject(gradeId, subjectId);
    } else {
      this.setState({ subjectList: [], defaultSubjectId: '', editionList: [], defaultEditionId: '', courseList: [], defaultCourse: '', defaultExpand: '' });
    }
  }
  /**
   * 选择学科
   * @param gradeId 年级id
   * @param subjectId 学科id
   * @returns {Promise<void>}
   */
  selectSubject = async (gradeId, subjectId) => {
    let params = { gradeId,
      subjectId };
    let editionList = await getEdition(params);
    if (editionList.length > 0) {
      let editionId = editionList[0].id;
      this.setState({ editionList, defaultEditionId: editionId });
      this.selectEdition(gradeId, subjectId, editionId);
    } else {
      this.setState({ editionList: [], defaultEditionId: '', courseList: [], defaultCourse: '', defaultExpand: '' });
    }
  }
  /**
   * 选择版本
   * @param gradeId
   * @param subjectId
   * @param editionId 版本id
   * @returns {Promise<void>}
   */
  selectEdition = async (gradeId, subjectId, editionId) => {
    let params = { gradeId, subjectId, editionId };
    this.setState({ loading: true });
    let courseList = await getCourse(params);
    this.setState({ loading: false });
    if (courseList.length > 0) {
      let lastNode = findLastLevel(courseList);
      this.setState({ courseList: [] }, () => {
        this.setState({ courseList,  defaultCourse: lastNode.id, defaultExpand: lastNode.pid === 0 ? lastNode.id : lastNode.pid });
      });
    } else {
      this.setState({ courseList: [], defaultCourse: '', defaultExpand: '' });
    }
  }
  /**
   * 点击树节点（选择课程体系）
   * @param selectedKeys
   * @param e
   */
  treeOnChange = (selectedKeys, e) => {
    const { courseOnSelect } = this.props;
    console.log(selectedKeys, e);
    // 输出课程体系id
    if (courseOnSelect) {
      courseOnSelect(selectedKeys, e);
    }
  }
  render() {
    const { gradeList, subjectList, editionList, courseList, defaultGradeId, defaultSubjectId, defaultEditionId, defaultCourse, loading, defaultExpand } = this.state;
    return (
      <div>
        <TreeSelector
          selectOne={{ data: gradeList, placeholder: '选择年级', defaultValue: defaultGradeId  }}
          selectTwo={{ data: subjectList, placeholder: '选择学科', defaultValue: defaultSubjectId }}
          selectThree={{ data: editionList, placeholder: '选择版本', defaultValue: defaultEditionId }}
          treeData={{ data: courseList, defaultNode: defaultCourse, defaultExpand }}
          loading={loading}
          selectOnChange={ this.selectOnChange}
          treeOnChange={this.treeOnChange}
        />
      </div>
    );
  }
}

export default GradeSubjectCourseSelector;
