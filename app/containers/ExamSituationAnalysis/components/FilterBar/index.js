import React from 'react';
import { Select, Button, message } from 'antd';
import { YearWrapper, Minus, FormWrapper, FormItem, Label, BoxLabel, RequiredSymbol } from './style';
import Area from './Area';
import ExamType from './ExamType';
const Option = Select.Option;
const dict = {
  'subject': '学科',
  'grade': '年级',
  'term': '学期'
};
const required = ['subject', 'year'];
class  FilterBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: { ...this.initParams },
      disableSearch: false,
      filterList: []
    };
    this.initParams = {
      examPaperType: '',
      subject: '',
      grade: '',
      term: '',
      province: '',
      city: '',
      startYear: '',
      endYear: '',
      examType: ''
    };
  }
  /**
   * 渲染筛选条件
   * @returns {Array}
   */
  getFields = () => {
    const {  disableSearch, filterList, params } = this.state;
    const {  filterData } = this.props;
    let children = [];
    filterList.forEach(item => {
      if (['subject', 'grade', 'term'].includes(item)) {
        children.push(
          <FormItem key={item}>
            <Label>
              {required.includes(item) && <RequiredSymbol>*</RequiredSymbol>}
              {`${dict[item]}：`}
            </Label>
            <Select style={{ width: 200 }} allowClear  placeholder={`选择${dict[item]}`} onChange={(e) => { this.selectParams(e, item) }} value={params[item]}>
              {filterData[item].map(it => <Option value={String(it.key)} key={it.key}>{it.value}</Option>)}
            </Select>
          </FormItem>
        );
      } else if (item === 'year') {
        children.push(
          <YearWrapper key="year">
            <FormItem style={{ verticalAlign: 'middle' }}>
              <Label><RequiredSymbol>*</RequiredSymbol>年份：</Label>
              <Select style={{ width: 100 }} allowClear  placeholder="选择年份" onChange={(e) => { this.selectParams(e, 'startYear') }} value={params.startYear}>
                {filterData.year.map(it => <Option value={String(it.key)} key={it.key}>{it.value}</Option>)}
              </Select>
              <Minus type="minus" />
              <Select style={{ width: 100 }} allowClear  placeholder="选择年份" onChange={(e) => { this.selectParams(e, 'endYear') }} disabled={!params.startYear} value={params.endYear}>
                {filterData.year.map(it => <Option value={String(it.key)} key={it.key}>{it.value}</Option>)}
              </Select>
            </FormItem>
          </YearWrapper>
        );
      }
    });
    if (filterList.length > 0) {
      children.push(
        <FormItem key="btn">
          <Button type="primary" icon="search" onClick={this.selectAllParams} disabled={disableSearch}>查询</Button>
        </FormItem>
      );
    }
    if (filterList.some(item => item === 'province')) {
      children.push(
        <FormItem key="area" style={{ width: '100%' }}>
          <BoxLabel>
            <strong>地区：</strong>
          </BoxLabel>
          <Area
            province={filterData.provinceList}
            city={filterData.cityList}
            selectProvince={this.selectProvince}
            selectCity={this.selectCity}
            onClear={this.handleClearArea}
            data={{ province: params.province, city: params.city }}
          />
        </FormItem>
      );
    }
    if (filterList.some(item => item === 'examType')) {
      children.push(
        <FormItem style={{ width: '100%' }} key="examType">
          <BoxLabel><strong>卷型：</strong></BoxLabel>
          <ExamType
            examTypeList={ filterData.examType}
            select={this.selectExamType}
          />
        </FormItem>
      );
    }
    return children;
  }
  /**
   * 选择试卷类型
   * @param e
   */
  selectPaperType = (e) => {
    let target = {};
    if (e) {
      target = this.props.filterData.examPaperType.find(item => String(item.key) === e);
      this.setState({ params: { ...this.initParams }}, () => {
        this.selectParams(target.key, 'examPaperType');
      });
      this.props.clearArea();
    }
    this.setState({ filterList: target.extra ? target.extra.split(',') : [] });
    this.props.onSelectPaperType();
  }
  /**
   * 选择省份
   * @param id
   */
  selectProvince=(id) => {
    const { selectProvince } = this.props;
    selectProvince(id);
    this.selectParams(id, 'province');
    this.selectParams('', 'city');
  }
  /**
   * 选择城市
   * @param id
   */
  selectCity=(id) => {
    this.selectParams(id, 'city');
  }
  handleClearArea=() => {
    console.log('----');
    this.selectParams('', 'province');
    this.selectParams('', 'city');
    this.props.clearArea();
  }
  /**
   * 选择卷型
   * @param id
   */
  selectExamType = (id) => {
    this.selectParams(id, 'examType');
  }
  /**
   * 设置选好的筛选条件
   * @param value
   * @param k
   */
  selectParams = (value, k) => {
    let params = this.state.params;
    if (k === 'endYear' && params.startYear) {
      this.checkYears(params.startYear, value);
    }
    if (k === 'startYear' &&  params.endYear) {
      this.checkYears(value, params.endYear);
    }
    params[k] = value;
    this.setState({ params });
  }
  /**
   * 点击查询按钮
   */
  selectAllParams = () => {
    const { selectAllParams } = this.props;
    const { params } = this.state;
    if (!params.endYear || !params.startYear) {
      message.warning('年份必选');
      return;
    }
    if (!this.checkYears(params.startYear, params.endYear)) {
      return;
    }
    if (!this.state.params.subject) {
      message.warning('请选择学科');
      return;
    }
    let targetParams = {
      examPaperTypeId: params.examPaperType,
      subjectId: params.subject,
      gradeId: params.grade,
      termId: params.term,
      provinceId: params.province,
      cityId: params.city,
      startYear: params.startYear,
      endYear: params.endYear,
      examTypeId: params.examType,
    };
    // let targetParams = {
    //   'subjectId': 1,
    //   'gradeId': 9,
    //   'examPaperTypeId': 14,
    //   'termId': 2,
    //   'provinceId': 3,
    //   'cityId': 0,
    //   'startYear': 2016,
    //   'endYear': 2019
    // };
    selectAllParams(targetParams);
  }
  checkYears = (start, end) => {
    let result = true;
    if (end - start + 1 > 5) {
      message.warning('最多跨度5年');
      // this.setState({ disableSearch: true });
      result = false;
    }
    if (end < start) {
      message.warning('结束年份不能小于开始年份');
      // this.setState({ disableSearch: true });
      result = false;
    }
    return result;
  }
  render() {
    const { filterData } = this.props;
    const examPaperType = filterData.examPaperType || [];
    return (
      <div>
        <FormWrapper>
          <FormItem>
            <Label>试卷类型：</Label>
            <Select style={{ width: 200 }} allowClear onChange={this.selectPaperType} placeholder="选择试卷类型">
              {examPaperType.map(item => <Option value={String(item.key)} key={item.key}>{item.value}</Option>)}
            </Select>
          </FormItem>
          {this.getFields()}
        </FormWrapper>
      </div>
    );
  }
}
export default FilterBar;
