import { Component } from 'react';
import { toString } from 'lodash';
import gradeApi from 'api/tr-cloud/grade-endpoint';
import subjectApi from 'api/tr-cloud/subject-endpoint';
import testReportApi from 'api/tr-cloud/test-lesson-recommended-content-endpoint';
import { message } from 'antd';
// import { message } from 'antd';
// import moment from 'moment';
// import reportApi from 'api/qb-cloud/report-end-point';

class DataProcess extends Component {
  state = {
    gradeList: [],          // 年纪列表
    selectedGradeId: '',    // 选中的年纪
    subjectList: [],        // 学科列表
    selectedSubjectId: '',  // 选中的学科
    moduleList: [],         // 数据列表 [模块1,模块2, ...]
    loading: false,         // 正在加载数据
    tableScrollY: 600,      // 默认滚动区域高度
    showImgView: false,     // 预览图片
    imgView: {},            // 显示上传图片的 modal
    // selectedType: '',       // 当前操作的类型 PC | mobile
    // fileList: [],
  }
  getGrade = () => {
    this.getGradeData().then(this.getSubject);
  }
  getSubject = () => {
    this.getSubjectData().then(this.getReport);
  }
  getReport = () => {
    this.getReportData();
  }
  getGradeData = async () => {
    return gradeApi.findNonPreschoolGrades().then((res) => {
      if (toString(res.code) === '0') {
        const data = res.data || [{ gradeDictCode: '' }];
        this.setState({
          gradeList: data,
          selectedGradeId: data.length > 0 ? toString(data[0].gradeDictCode) : '',
        });
      } else {
        message.error(res.message || '年级获取失败');
      }
      // return res;
    });
  }
  getSubjectData = async () => {
    const { selectedGradeId } = this.state;
    return subjectApi.findSubjectByGradeDictCode(selectedGradeId).then((res) => {
      if (toString(res.code) === '0') {
        const data = res.data || [{ subjectDictCode: '' }];
        this.setState({
          subjectList: data,
          selectedSubjectId: data.length > 0 ? toString(data[0].subjectDictCode) : '',
        });
      } else {
        message.error(res.message || '学科获取失败');
      }
    });
  }
  getReportData = () => {
    const { selectedGradeId, selectedSubjectId } = this.state;
    if (selectedGradeId && selectedSubjectId) {
      this.setState({ loading: true }, () => {
        testReportApi.getReportData({
          gradeDictCode: selectedGradeId,
          subjectDictCode: selectedSubjectId,
        }).then((res) => {
          if (toString(res.code) === '0') {
            const data = res.data || [];
            this.setState({
              moduleList: data,
            });
            console.log(JSON.stringify(data, null, ' '));
          } else {
            message.error(res.message || '数据获取失败');
          }
        }).finally(() => {
          this.setState({ loading: false });
        });
      });
    } else {
      message.warn('请先选择年级和学科');
    }
  }
  changeData = (newState, cb) => {
    this.setState(newState, cb);
  }
  initTableScrollHeight = () => {
    if (this.tableBox) {
      this.setState({
        tableScrollY: this.tableBox.offsetHeight - document.querySelector('.ant-table-header').offsetHeight,
      });
    }
  }
}


export default DataProcess;
