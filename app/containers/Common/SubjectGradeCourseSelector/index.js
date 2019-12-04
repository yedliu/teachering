import React from 'react';
import TreeSelector from 'components/TreeSelector/index.js';
import {  getChildSubjectGrade, getEdition, getCourse } from './server';
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
      console.log(this.state.defaultCourse, 'defaultCourse');
      this.treeOnChange([this.state.defaultCourse]);
    });
  }
  /**
   * select组件onChange事件
   * @param e 选中项的值
   * @param i 标志第几个select组件
   */
  selectOnChange = (e, i) => {
    let target = null;
    switch (i) {
      case 1:
        this.setState({ defaultSubjectId: e.key });
        // 要获取children
        target = this.state.subjectList.find(item => item.value === e.key);
        this.selectSubject(e.key, target.children);
        break;
      case 2:
        this.setState({ defaultGradeId: e.key });
        this.selectGrade(this.state.defaultSubjectId, e.key);
        break;
      default:
        this.setState({ defaultEditionId: e.key });
        this.selectEdition(this.state.defaultGradeId, this.state.defaultSubjectId, e.key);
    }
  }
  // 初始化，默认所有数据都选第一个
  init = async () => {
    let subjectList = await getChildSubjectGrade();
    if (subjectList.length > 0) {
      let subjectId = subjectList[0].value;
      let children = subjectList[0].children;
      this.setState({ subjectList,  defaultSubjectId: subjectId });
      await this.selectSubject(subjectId, children);
    }
  }
  /**
   * 选择年级
   * @param gradeId 年级id
   * @returns {Promise<void>}
   */
  selectSubject = async (subjectId, children) => {
    let gradeList = children;
    if (gradeList.length > 0) {
      let gradeId = gradeList[0].value;
      this.setState({ gradeList, defaultGradeId: gradeId });
      await this.selectGrade(subjectId, gradeId);
    } else {
      this.setState({ subjectList: [], defaultSubjectId: '', editionList: [], defaultEditionId: '', courseList: [], defaultCourse: '', defaultExpand: '' });
    }
  }
  /**
   * 选择年级
   * @param gradeId 年级id
   * @param subjectId 学科id
   * @returns {Promise<void>}
   */
  selectGrade = async (subjectId, gradeId) => {
    let params = { gradeDictCode: gradeId,
      subjectDictCode: subjectId };
    let editionList = await getEdition(params);
    if (editionList.length > 0) {
      let editionId = editionList[0].id;
      this.setState({ editionList, defaultEditionId: editionId });
      await this.selectEdition(subjectId, gradeId, editionId);
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
    let params = { gradeDictCode: gradeId, subjectDictCode: subjectId, editionId, level: 0 };
    this.setState({ loading: true });
    let courseList = await getCourse(params);
    this.setState({ loading: false });
    if (courseList.length > 0) {
      let lastNode = findLastLevel(courseList);
      this.setState({ courseList: [] }, () => {
        this.setState({ courseList,  defaultCourse: lastNode.id, defaultExpand: lastNode.pid === 0 ? lastNode.id : lastNode.pid }, () => {
          this.treeOnChange([lastNode.id]);
        });
      });
    } else {
      this.setState({ courseList: [], defaultCourse: '', defaultExpand: '' }, () => {
        this.treeOnChange([]);
      });
    }
  }
  /**
   * 点击树节点（选择课程体系）
   * @param selectedKeys
   * @param e
   */
  treeOnChange = (selectedKeys, e) => {
    const { courseOnSelect } = this.props;
    // 输出课程体系id
    let level = this.handleFindLevel(this.state.courseList, Number(selectedKeys[0]));
    if (courseOnSelect) {
      courseOnSelect(selectedKeys, e, level, this.state.courseList);
    }
  }
  handleFindLevel = (data, id) => {
    let level = 0;
    let findLevel = (data, id) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          level = data[i].level;
          break;
        } else {
          if (data[i].children) {
            findLevel(data[i].children, id);
          }
        }
      }
    };
    findLevel(data, id);
    return level;
  };
  render() {
    const { gradeList, subjectList, editionList, courseList, defaultGradeId, defaultSubjectId, defaultEditionId, defaultCourse, loading, defaultExpand } = this.state;
    return (
      <div>
        <TreeSelector
          selectOne={{ data: subjectList, placeholder: '选择学科', defaultValue: defaultSubjectId }}
          selectTwo={{ data: gradeList, placeholder: '选择年级', defaultValue: defaultGradeId  }}
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
