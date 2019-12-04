import React, { PropTypes } from 'react';
import { toNumber } from 'lodash';
import immutable, { fromJS } from 'immutable';
import { Input, Radio, Button, message, Icon } from 'antd';
import styled from 'styled-components';
import { FlexRow, FlexCenter } from 'components/FlexBox';
import { PlaceHolderBox } from 'components/CommonFn/style';

const emptyImg = window._baseUrl.imgCdn + '2cfcc00d-8360-42c7-b371-4253fd4735cb.png';

import { VerifyAIHomeworkParams, difficultyList } from '../common';
import {
  AIHomeworkFormWrapper,
  FormGroupItem,
  FormTextValue,
  HalfCircleDiv,
  FormItemTitle,
  RowTowBox,
  FormTextSmallValue,
  QuestionTypeClassItem,
  IconClose,
} from './AIHomeworkStyle';

const RadioGroup = styled(Radio.Group)`
  font-size: 16px;
  color: #333;
`;
const InputQNum = styled(Input)`
  width: 40px;
  height: 20px;
  margin-right: 5px;
`;

export class AIHomeworkForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.changeForm = this.changeForm.bind(this);
    this.changeHWName = this.changeHWName.bind(this);
    this.getQuestion4AIHW = this.getQuestion4AIHW.bind(this);
    this.changeSelectQuestionTypeList = this.changeSelectQuestionTypeList.bind(this);
    this.deleteSelectedKnowledge = this.deleteSelectedKnowledge.bind(this);
    this.state = {
      canGetQuestion4AIHW: true,
    };
  }
  componentWillUnmount() {
    clearTimeout(this.getQuestion4AIHWTimer);
  }
  getQuestion4AIHW() {
    const { getQuestion4AIHW, AIHomeworkParams } = this.props;
    const needGetQuestionCount = AIHomeworkParams.get('questionTypeList').filter((item) => item.get('isActive')).map((item) => item.get('questionAmount')).reduce((a, b) => a + b);
    // console.log(needGetQuestionCount, 'needGetQuestionCount');
    if (needGetQuestionCount > 100) {
      message.warning('试题数量超过限制，最多100道试题');
      return;
    } else if (needGetQuestionCount <= 0) {
      message.warning('没有题目无法生成作业');
      return;
    } else if (!AIHomeworkParams.get('homeworkName')) {
      message.warning('请填写作业名称');
      return;
    }
    if (this.state.canGetQuestion4AIHW) {
      this.setState({ canGetQuestion4AIHW: false });
      getQuestion4AIHW();
      this.getQuestion4AIHWTimer = setTimeout(() => {
        this.setState({ canGetQuestion4AIHW: true });
      }, 2000);
    }
  }
  deleteSelectedKnowledge(knowledgeItem) {
    const { AIHomeworkParams } = this.props;
    // console.log(knowledgeItem.toJS(), AIHomeworkParams.get('AIknowledgeList').toJS(), 'GGG');
    const newAIknowledgeList = AIHomeworkParams.get('AIknowledgeList').filter((item) => item.get('id') !== knowledgeItem.get('id'));
    this.changeForm(newAIknowledgeList, 'AIknowledgeList');
  }
  changeHWName(e) {
    this.changeForm(e.target.value, 'homeworkName');
  }
  changeSelectQuestionTypeList(item, type, value) {
    const { AIHomeworkParams } = this.props;
    // console.log(item.toJS(), value, 'changeSelectQuestionTypeList');
    if (type === 'questionAmount' && value > item.get('questionCount')) {
      message.warning('选取题目数量不可以超过题目总数！');
      return;
    }
    const questionTypeList = (AIHomeworkParams.get('questionTypeList') || fromJS([])).map((it) => {
      if (it.get('id') === item.get('id')) {
        return it.set(type, value);
      }
      return it;
    });
    this.changeForm(questionTypeList, 'questionTypeList', type);
  }
  changeForm(value, type, iType) {
    const { setAIHWParamsItem, getQuestionType4AiHw, AIHomeworkParams, setAIHWParams } = this.props;
    if (type === 'difficulty') { // 选择难度时需要自动设置作业名
      // console.log(AIHomeworkParams.toJS(), 'AIHomeworkParams');
      const difficulty = toNumber(value.target.value);
      setAIHWParams(AIHomeworkParams
        .set('difficulty', difficulty)
        .set('homeworkDiff', fromJS({ id: difficulty, name: difficultyList[difficulty - 1] }))
        .set('homeworkName', `${AIHomeworkParams.getIn(['selectCourseSystem', 'name'])}--${difficultyList[difficulty - 1]}`));
    } else if (['homeworkName', 'questionTypeList', 'AIknowledgeList'].includes(type)) { // 更改作业名或者题型时原样设置
      setAIHWParamsItem(type, value);
    } else { // 默认都是设置 number 数值
      const valueRes = toNumber(value.target.value);
      setAIHWParamsItem(type, valueRes);
    }
    if (!['questionAmount', 'isActive'].includes(iType)) { // 除了设置题目数量和题型种类，其他的都需要同步获取题型以及题目数量
      getQuestionType4AiHw();
    }
  }
  render() {
    const { AIHomeworkParams, searchQuestionParams } = this.props;
    const AIknowledgeList = AIHomeworkParams.get('AIknowledgeList') || fromJS([]);
    const questionTypeList = AIHomeworkParams.get('questionTypeList') || fromJS([]);
    const selectQuestionTypeList = questionTypeList.filter((item) => item.get('isActive'));
    const gradeList = (searchQuestionParams.get('gradeList') || fromJS([])).filter((item) => item.get('id') >= 0);

    const canSubmitForCreateHomework = VerifyAIHomeworkParams(AIHomeworkParams);
    return (<AIHomeworkFormWrapper>
      <div style={{ width: '100%', overflowY: 'auto' }}>
        <FormGroupItem>
          <FormTextValue>已选知识点</FormTextValue>
          <FlexRow style={{ alignItems: 'flex-start', flexWrap: 'wrap', width: 'calc(100% - 120px)' }}>
            {AIknowledgeList.map((item, index) => (<HalfCircleDiv style={{ position: 'relative' }} key={index}>{item.get('name')}
              <IconClose
                type="close"
                onClick={() => this.deleteSelectedKnowledge(item)}
              />
            </HalfCircleDiv>))}
          </FlexRow>
        </FormGroupItem>
        <FormGroupItem>
          <FormTextValue>作业标题</FormTextValue>
          <Input style={{ width: 200 }} value={AIHomeworkParams.get('homeworkName')} onChange={this.changeHWName} placeholder="请输入作业名称"></Input>
        </FormGroupItem>
        <FormItemTitle>作业设置</FormItemTitle>
        <FormGroupItem>
          <FormTextValue>作业难度：</FormTextValue>
          <RadioGroup onChange={(value) => this.changeForm(value, 'difficulty')} value={AIHomeworkParams.get('difficulty')}>
            <Radio value={1}>简单</Radio>
            <Radio value={2}>中等</Radio>
            <Radio value={3}>困难</Radio>
          </RadioGroup>
        </FormGroupItem>
        <FormGroupItem>
          <FormTextValue>考察范围：</FormTextValue>
          <RadioGroup onChange={(value) => this.changeForm(value, 'investigateScope')} value={AIHomeworkParams.get('investigateScope')}>
            <Radio value={1}>精准出题<Icon style={{ color: 'rgb(68, 165, 255)', fontSize: 16, marginLeft: 3 }} type="question-circle-o" title="匹配出来的试题包含的知识点都在已选的知识点中，这个方式保证了作业的精准性避免超纲试题的出现，适用于同步学习的学生。" /></Radio>
            <Radio value={2}>关联出题<Icon style={{ color: 'rgb(68, 165, 255)', fontSize: 16, marginLeft: 3 }} type="question-circle-o" title="匹配出来的试题包含的知识点，最少有一个在已知的知识点中，出题综合性较强，这个方法适用于毕业班的学生。" /></Radio>
          </RadioGroup>
        </FormGroupItem>
        <FormGroupItem>
          <FormTextValue>使用年级：</FormTextValue>
          <RadioGroup onChange={(value) => this.changeForm(value, 'gradeId')} value={AIHomeworkParams.get('gradeId')}>
            <Radio value={0}>不限</Radio>
            {gradeList.map((item, index) => <Radio key={index} value={item.get('id')}>{item.get('name') || ''}</Radio>)}
          </RadioGroup>
        </FormGroupItem>
        <FormGroupItem>
          <FormTextValue>使用学期：</FormTextValue>
          <RadioGroup onChange={(value) => this.changeForm(value, 'termId')} value={AIHomeworkParams.get('termId')}>
            <Radio value={0}>不限</Radio>
            <Radio value={1}>上学期</Radio>
            <Radio value={2}>下学期</Radio>
          </RadioGroup>
        </FormGroupItem>
        <FormItemTitle>题型/题量设置</FormItemTitle>
        {selectQuestionTypeList.count() ? <RowTowBox leftWidth="290px" rightWidth="250px">
          <div className="questionTypesLeft">
            {selectQuestionTypeList.map((item, index) => (<FormGroupItem key={index}>
              <FormTextValue>{item.get('name') || ''}：</FormTextValue>
              <FormTextSmallValue>{item.get('questionCount') || 0}道题可用</FormTextSmallValue>
              <FormTextSmallValue>
                <InputQNum type="number" value={item.get('questionAmount') || 0} min={0} max={100} onChange={(e) => this.changeSelectQuestionTypeList(item, 'questionAmount', toNumber(e.target.value))} />道
              </FormTextSmallValue>
            </FormGroupItem>))}
          </div>
          <div className="questionTypesright">
            {questionTypeList.map((item, index) => {
              const isActive = item.get('isActive');
              return (<QuestionTypeClassItem
                key={index}
                isActive={isActive}
                style={{ textIndent: isActive ? '-10px' : '0' }}
                onClick={(e) => {
                  e.stopPropagation();
                  this.changeSelectQuestionTypeList(item, 'isActive', true);
                }}
              >
                {item.get('name') || ''}
                {isActive ? <IconClose
                  type="close"
                  onClick={(e) => {
                    e.stopPropagation();
                    this.changeSelectQuestionTypeList(item, 'isActive', false);
                  }}
                /> : ''}
              </QuestionTypeClassItem>);
            })}
          </div>
        </RowTowBox> :
        <FlexCenter style={{ fontSize: 15 }}>
          <img role="presentation" src={emptyImg} />
        </FlexCenter>}
      </div>
      <PlaceHolderBox flex={1}></PlaceHolderBox>
      <FlexCenter style={{ height: 50 }}>
        <Button size="large" type="primary" disabled={!this.state.canGetQuestion4AIHW || !canSubmitForCreateHomework} onClick={this.getQuestion4AIHW}>生成作业</Button>
      </FlexCenter>
    </AIHomeworkFormWrapper>);
  }
}

AIHomeworkForm.propTypes = {
  AIHomeworkParams: PropTypes.instanceOf(immutable.Map).isRequired,
  searchQuestionParams: PropTypes.instanceOf(immutable.Map).isRequired,
  setAIHWParamsItem: PropTypes.func.isRequired,
  setAIHWParams: PropTypes.func.isRequired,
  getQuestion4AIHW: PropTypes.func.isRequired,
  getQuestionType4AiHw: PropTypes.func.isRequired,
};

export default AIHomeworkForm;
