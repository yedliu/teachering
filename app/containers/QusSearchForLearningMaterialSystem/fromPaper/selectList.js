import React from 'react';
import { toString } from 'lodash';
import { fromJS } from 'immutable';
import { Select, Button, Input } from 'antd';

import {
  SelectListWrapper,
  SelectListBox,
  FieldsDiv,
  Collapse,
} from './selectListStyle';

const emptyMap = fromJS({});

class SelectList extends React.Component {
  constructor() {
    super();
    this.state = {
      collapse: true,
    };
  }
  componentDidMount() {
    // 每次切换走了后回来时都清理掉原先的选项
    this.resetProperty();
  }
  selectChange = (key, value) => {
    const { selectChange } = this.props;
    if (selectChange) selectChange(key, value);
  }
  changeKeyword = (e) => {
    const value = e.target.value;
    this.selectChange('keyword', value);
  }
  searchClick = () => {
    this.selectChange('searchExamPaper', '');
  }
  collapseChange = () => {
    const { collapse } = this.state;
    this.setState({ collapse: !collapse });
  }
  resetProperty = () => {
    this.selectChange('resetSelect', '');
  }
  renderSelect = ({ key, name, data, style, idKey, nameKey, placeholder, value, msg }) => {
    const { paramsData } = this.props;
    return (
      <oneFild style={style ? style : {}}>
        <filedLabel>{name}：</filedLabel>
        <Select
          style={{ width: 150 }}
          placeholder={placeholder || `请选择${name}`}
          allowClear
          // eslint-disable-next-line no-undefined
          value={toString(paramsData.getIn([key, 'id'])) || undefined}
          onChange={(val) => this.selectChange(key, val)}
        >
          {data.map(item => <Select.Option key={item[idKey ? idKey : 'id']} value={String(item[idKey ? idKey : 'id'])}>{item[nameKey ? nameKey : 'name']}</Select.Option>)}
        </Select>
        {msg}
      </oneFild>
    );
  }
  render() {
    const { collapse } = this.state;
    const { listData = emptyMap, paramsData = emptyMap } = this.props;
    const {
      examPaperTypeList = [],
      examPaperDifficultyList = [],
      examTypeList = [],
      examCardList = [],
      yearList = [],
      gradeList = [],
      subjectList = [],
      termList = [],
      provinceList = [],
      cityList = [],
      countyList = [],
      textbookEditionList = [],
      editionList = [],
    } = listData.toJS();
    return (
      <SelectListWrapper>
        <SelectListBox collapse={collapse}>
          <FieldsDiv>
            {this.renderSelect({ key: 'examPaperType', name: '试卷类型', data: examPaperTypeList, style: { display: 'block' }, msg: (<oneFild>
              <Button style={{ margin: '0 10px' }} type="dashed" onClick={this.resetProperty}>重置</Button>
              <Button
                style={{ margin: '0 10px' }}
                type="primary"
                icon="search"
                onClick={this.searchClick}
              >查询</Button>
            </oneFild>) })}
            {this.renderSelect({ key: 'grade', name: '年级', data: gradeList })}
            {this.renderSelect({ key: 'subject', name: '学科', data: subjectList })}
            {this.renderSelect({ key: 'textbookEdition', name: '教材版本', data: textbookEditionList })}
            {this.renderSelect({ key: 'edition', name: '课程版本', data: editionList })}
            {this.renderSelect({ key: 'examPaperDifficulty', name: '试卷难度', data: examPaperDifficultyList })}
            {this.renderSelect({ key: 'year', name: '年份', data: yearList })}
            {this.renderSelect({ key: 'term', name: '学期', data: termList })}
            {this.renderSelect({ key: 'examType', name: '卷型', data: examTypeList })}
            {this.renderSelect({ key: 'province', name: '省份', data: provinceList })}
            {this.renderSelect({ key: 'city', name: '城市', data: cityList })}
            {this.renderSelect({ key: 'county', name: '地区', data: countyList })}
            {this.renderSelect({ key: 'examCard', name: '试卷名片', data: examCardList })}
            <oneFild>
              <filedLabel>试卷名称：</filedLabel>
              <Input placeholder="试卷名或关键字" value={paramsData.get('keyword')} onChange={this.changeKeyword} style={{ width: 150 }} />
            </oneFild>
          </FieldsDiv>
        </SelectListBox>
        <Collapse onClick={this.collapseChange}>{collapse ? '更多' : '收起'}筛选项</Collapse>
      </SelectListWrapper>
    );
  }
}

export default SelectList;