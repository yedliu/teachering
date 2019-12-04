import {
  Select,
} from 'antd';
import React from 'react';
import {
  TagsWrapper,
  TagsItemWrapper,
  TagsItemBox,
  ValueRight,
  ValueLeft,
} from 'containers/PaperFinalVerify/paperStyle';
import {
  toString
} from 'components/CommonFn';
import {
  AddPoint,
} from './style';
const Option = Select.Option;
export default class Tags extends React.Component {
  render() {
    const {
      newQuestion,
      tagsName,
      setNewQuestionTags,
      pointList,
      knowledgeIdList,
      examPointIdList,
      backChooseItem
    } = this.props;
    return (
      <TagsWrapper style={{ minHeight: 92 }}>
        <TagsItemWrapper>
          <TagsItemBox><ValueRight>难度：</ValueRight>
            <Select labelInValue value={{ key: toString(newQuestion.get('difficulty') || 0) }} style={{ width: 120 }} onChange={(e) => setNewQuestionTags('parent', 'difficulty', e)}>
              {tagsName.difficulty.map((it, i) => <Option key={i} value={toString(i)}>{it}</Option>)}
            </Select>
          </TagsItemBox>
          <TagsItemBox><ValueRight>区分度：</ValueRight>
            <Select labelInValue value={{ key: toString(newQuestion.get('distinction') || 0) }} style={{ width: 120 }} onChange={(e) => setNewQuestionTags('parent', 'distinction', e)}>
              {tagsName.distinction.map((it, i) => <Option key={i} value={toString(i)}>{it}</Option>)}
            </Select>
          </TagsItemBox>
          <TagsItemBox><ValueRight>题目评级：</ValueRight>
            <Select labelInValue value={{ key: toString(newQuestion.get('rating') || 0) }} style={{ width: 120 }} onChange={(e) => setNewQuestionTags('parent', 'rating', e)}>
              {tagsName.rating.map((it, i) => <Option key={i} value={toString(i)}>{it}</Option>)}
            </Select>
          </TagsItemBox>
          <TagsItemBox><ValueRight>综合度：</ValueRight>
            <Select labelInValue value={{ key: toString(newQuestion.get('comprehensiveDegreeId') || 0) }} style={{ width: 120 }} onChange={(e) => setNewQuestionTags('parent', 'comprehensiveDegreeId', e)}>
              {tagsName.comprehensiveDegreeId.map((it, i) => <Option key={i} value={toString(i)}>{it}</Option>)}
            </Select>
          </TagsItemBox>
        </TagsItemWrapper>
        <TagsItemWrapper>
          <TagsItemBox style={{ width: 'auto', minWidth: 300, maxWidth: '50%' }}><ValueRight style={{ color: '#e33', minWidth: 80 }}>知识点：</ValueRight>
            <ValueLeft flex="none" style={{ wordBreak: 'keep-all' }}>
              {backChooseItem(pointList.get('knowledgeIdList'), knowledgeIdList.toJS(), []).join('、')}
            </ValueLeft>
            <AddPoint onClick={() => setNewQuestionTags('parent', 'knowledgeIdList', knowledgeIdList.toJS(), -1)}>+</AddPoint>
          </TagsItemBox>
          <TagsItemBox style={{ width: 'auto', minWidth: 300, maxWidth: '50%' }}><ValueRight style={{ color: '#e33', minWidth: 80 }}>考点：</ValueRight>
            <ValueLeft flex="none" style={{ wordBreak: 'keep-all' }}>
              {backChooseItem(pointList.get('examPointIdList'), examPointIdList.toJS(), []).join('、')}
            </ValueLeft>
            <AddPoint onClick={() => setNewQuestionTags('parent', 'examPointIdList', examPointIdList.toJS(), -1)}>+</AddPoint>
          </TagsItemBox>
        </TagsItemWrapper>
      </TagsWrapper>
    );
  }
}
