import React from 'react';
import { fromJS } from 'immutable';
import { Select } from 'antd';
import { toString } from 'lodash';
import { FlexCenter } from 'components/FlexBox';
import HomeworkTree from 'containers/StandHomeWork/TreeRender';
import { RunLoading } from 'components/LoadingIndicator';
const emptyImg = window._baseUrl.imgCdn + '2cfcc00d-8360-42c7-b371-4253fd4735cb.png';

import {
  LeftWrapper,
  TreeWrapper,
  SelectColumn,
} from './knowledgesStyle';

const emptyMap = fromJS({});
const emptyList = fromJS([]);

const Option = Select.Option;

class Knowledges extends React.Component {
  selectChange = (value, type) => {
    const { selectChange } = this.props;
    selectChange(type, value);
  }
  render() {
    const {
      courseSystemIsGetting,
      grade,
      subject,
      edition,
      courseSystem,
    } = this.props;
    const { selectedGrade = emptyMap, gradeList = emptyList } = grade;
    const { selectedSubject = emptyMap, sudjectList = emptyList } = subject;
    const { selectedEdition = emptyMap, editionList = emptyList } = edition;
    const { selectedCourseSystem = emptyMap, courseSystemList = emptyList } = courseSystem;
    return (
      <LeftWrapper>
        <SelectColumn>
          <Select labelInValue value={{ key: toString(selectedGrade.get('id')) || '' }} style={{ flex: 1, marginRight: 5 }} onChange={(value) => this.selectChange(value, 'grade')}>
            {gradeList.map((item) => (<Option key={toString(item.get('id')) || ''} value={toString(item.get('id'))}>{item.get('name')}</Option>))}
          </Select>
          <Select labelInValue value={{ key: toString(selectedSubject.get('id')) || '' }} style={{ flex: 1 }} onChange={(value) => this.selectChange(value, 'subject')}>
            {sudjectList.map((item) => (<Option key={toString(item.get('id')) || ''} value={toString(item.get('id'))}>{item.get('name')}</Option>))}
          </Select>
        </SelectColumn>
        <SelectColumn>
          <Select labelInValue value={{ key: toString(selectedEdition.get('id') > 0 ? selectedEdition.get('id') : '') || '' }} style={{ flex: 1 }} onChange={(value) => {
            this.selectChange(value, 'edition');
          }}>
            {editionList.map((item) => <Option key={toString(item.get('id')) || ''} value={toString(item.get('id'))}>{item.get('name')}</Option>)}
          </Select>
        </SelectColumn>
        <TreeWrapper>
          {courseSystemIsGetting ? <FlexCenter>{RunLoading()}</FlexCenter> : <div>
            {courseSystemList.count() > 0 ? <HomeworkTree
              selectTree={selectedCourseSystem}
              treeList={courseSystemList}
              onSelect={(value, selectedKnowledge) => {
                this.selectChange(value, 'courseSystem');
              }}
            />
                : <FlexCenter style={{ flex: 1, height: '100%', width: '100%' }}>
                  <div style={{ textAlign: 'center' }}><img role="presentation" src={emptyImg} style={{ width: 100 }} /><h5 style={{ color: '#999', textAlign: 'center' }}>没有找到相关课程体系哦</h5></div>
                </FlexCenter>}
          </div>}
        </TreeWrapper>
      </LeftWrapper>
    );
  }
}

export default Knowledges;
