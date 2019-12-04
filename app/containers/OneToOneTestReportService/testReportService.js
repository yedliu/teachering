import React from 'react';
import { Wrapper, TableBox } from './style';
import DataProcess from './dataProcess';
import FormSelect from './searchForm';
import DataTable from './dataTable';
// import UploadImg from './uploadImg';
import ViewImg from './viewImg';

class OneToOneTestReportService extends DataProcess {
  componentDidMount() {
    this.getData();
    this.initTableScrollHeight();
    window.addEventListener('resize', this.addEventListerForResize);
  }
  componentWillUnMount() {
    window.removeEventListener('resize', this.addEventListerForResize);
    clearTimeout(this.resizeTimer);
  }
  /**
   * 监听 resize 事件调整滚动区域高度
   */
  addEventListerForResize = () => {
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
    this.resizeTimer = setTimeout(() => {
      this.initTableScrollHeight();
      this.resizeTimer = null;
    }, 100);
  }
  getData = () => {
    this.getGrade();
  }
  changeFormData = (state, type) => {
    if (type === 'grade') {
      this.changeData(state, this.getSubject);
    } else if (type === 'subject' || type === 'serach') {
      this.changeData(state, this.getReport);
    }
  }
  closeView=() => {
    this.changeData({ showImgView: false }, () => this.changeData({ imgView: {}}));
  }
  previewImg=(imgView) => {
    this.changeData({
      showImgView: true,
      imgView,
    });
  }
  preUploadImg = (imgView) => {
    this.changeData({ imgView });
  }
  finishUpload = (imgUrl) => {
    if (typeof imgUrl === 'string' && imgUrl.length > 10) {
      const { imgView } = this.state;
      this.previewImg(Object.assign({}, imgView, { url: imgUrl }));
    } else {
      this.closeView();
    }
    this.getReportData();
  }
  render() {
    const {
      gradeList,
      selectedGradeId,
      subjectList,
      selectedSubjectId,
      moduleList,
      loading,
      tableScrollY,
      imgView,
      showImgView,
    } = this.state;
    return (
      <Wrapper>
        <FormSelect
          gradeList={gradeList}
          selectedGradeId={selectedGradeId}
          subjectList={subjectList}
          selectedSubjectId={selectedSubjectId}
          changeFormData={this.changeFormData}
        ></FormSelect>
        <TableBox innerRef={x => { this.tableBox = x }}>
          <DataTable
            dataList={moduleList}
            loading={loading}
            tableScrollY={tableScrollY}
            previewImg={this.previewImg}
            preUploadImg={this.preUploadImg}
            finishUpload={this.finishUpload}
          />
        </TableBox>
        <ViewImg
          show={showImgView}
          closeView={this.closeView}
          viewImg={imgView}
          finishUpload={this.finishUpload}
        />
      </Wrapper>
    );
  }
}

export default OneToOneTestReportService;