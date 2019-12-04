import React, { PropTypes } from 'react';
import immutable, { fromJS } from 'immutable';
import { Select } from 'antd';
import { toNumber, toString } from 'lodash';

import { homeworkGradeList } from 'components/CommonFn';

import AIHomeworkTree from './AITreeRender';
import AIHomeworkForm from './AIFormRender';
import AIHomeworkEdit from './AIHomeworkEdit/AIHomeworkEdit';
import {
  AIWrapper,
  AILeftWrapper,
  AIRightWrapper,
} from './AIHomeworkStyle';

const Option = Select.Option;

export class AIHomework extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.checkTree = this.checkTree.bind(this);
    this.changePhaseSubject = this.changePhaseSubject.bind(this);
  }
  checkTree(checked, event) {
    const { getQuestionType4AiHw, setAIHWParamsItem } = this.props;
    const newCheckedList = event.checkedNodes.map((item) => ({ id: toNumber(item.key), level: item.props.level, name: item.props.title })) || [];
    setAIHWParamsItem('AIknowledgeList', fromJS(newCheckedList));
    getQuestionType4AiHw();
  }
  changePhaseSubject(value) {
    // console.log(value, 'value');
    const { AIHomeworkParams, setAIHWParams, searchQuestionParams, setSearchQuestionParams, allGradeList, getQuestionType4AiHw } = this.props;
    const type = 'selectPhaseSubject';
    const typeList = 'phaseSubjectList';
    const list = searchQuestionParams.get(typeList) || fromJS([]);
    const newSelect = list.find((item) => item.get('id') === toNumber(value));
    const newGradeList = homeworkGradeList(allGradeList, newSelect);
    setSearchQuestionParams(searchQuestionParams.set(type, newSelect).set('gradeList', newGradeList).set('selectedGrade', fromJS({ id: -1, name: '全部' })), type);
    const nowSelectGrade = AIHomeworkParams.get('gradeId');
    if (!newGradeList.find((item) => toNumber(item.get('id') === toNumber(nowSelectGrade)))) {
      setAIHWParams(AIHomeworkParams.set('gradeId', 0).set('termId', 0).set('AIknowledgeList', fromJS([])).set('AIHWQuestionList', fromJS([])));
    }
    getQuestionType4AiHw();
  }
  render() {
    const {
      AIHomeworkParams, searchQuestionParams, getQuestion4AIHW,
      getQuestionType4AiHw, setAIHWParams, setAIHWParamsItem,
      saveAIHomework, homeworkType,
      getChangeItemDataList,
    } = this.props;
    const phaseSubjectList = searchQuestionParams.get('phaseSubjectList') || fromJS([]);
    const knowledgeList = searchQuestionParams.get('knowledgeList') || fromJS([]);
    const selectPhaseSubject = searchQuestionParams.get('selectPhaseSubject') || fromJS({});
    // console.log(homeworkType, 'homeworkType');
    const AIHWStateOne = AIHomeworkParams.get('state') === 1 && homeworkType === 2;
    const AIHWStateTwo = homeworkType === 1 || AIHomeworkParams.get('state') === 2;
    return (<AIWrapper id="AIWRAPPER">
      {AIHWStateOne ? <AILeftWrapper>
        <Select value={toString(selectPhaseSubject.get('id'))} style={{ margin: '10px 20px' }} onChange={this.changePhaseSubject}>
          {phaseSubjectList.map((item, index) => {
            return (<Option key={index} value={toString(item.get('id'))}>{item.get('name')}</Option>);
          })}
        </Select>
        <div style={{ flex: 1, overflow: 'auto', margin: '0 0 20px 20px' }}>
          <AIHomeworkTree
            treeList={knowledgeList}
            checkedTree={AIHomeworkParams.get('AIknowledgeList')}
            onCheck={this.checkTree}
          ></AIHomeworkTree></div>
      </AILeftWrapper> : ''}
      {AIHWStateOne ? <AIRightWrapper>
        <AIHomeworkForm
          searchQuestionParams={searchQuestionParams}
          AIHomeworkParams={AIHomeworkParams}
          setAIHWParamsItem={setAIHWParamsItem}
          getQuestion4AIHW={getQuestion4AIHW}
          getQuestionType4AiHw={getQuestionType4AiHw}
          setAIHWParams={setAIHWParams}
        ></AIHomeworkForm>
      </AIRightWrapper> : ''}
      {AIHWStateTwo ? <AIHomeworkEdit
        AIHomeworkParams={AIHomeworkParams}
        setAIHWParamsItem={setAIHWParamsItem}
        getQuestion4AIHW={getQuestion4AIHW}
        saveAIHomework={saveAIHomework}
        homeworkType={homeworkType}
        getChangeItemDataList={getChangeItemDataList}
      ></AIHomeworkEdit> : ''}
    </AIWrapper>);
  }
}

AIHomework.propTypes = {
  AIHomeworkParams: PropTypes.instanceOf(immutable.Map).isRequired,
  setAIHWParamsItem: PropTypes.func.isRequired,
  setAIHWParams: PropTypes.func,
  searchQuestionParams: PropTypes.instanceOf(immutable.Map).isRequired,
  setSearchQuestionParams: PropTypes.func.isRequired,
  allGradeList: PropTypes.instanceOf(immutable.List).isRequired,
  getQuestion4AIHW: PropTypes.func,
  getQuestionType4AiHw: PropTypes.func,
  saveAIHomework: PropTypes.func.isRequired,
  homeworkType: PropTypes.number,
  getChangeItemDataList: PropTypes.func,
};

export default AIHomework;
