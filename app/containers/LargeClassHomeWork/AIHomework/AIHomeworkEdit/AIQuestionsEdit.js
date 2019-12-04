import React, { PropTypes } from 'react';
import immutable, { fromJS } from 'immutable';
import { Modal, Button, InputNumber } from 'antd';

import { FlexCenter, FlexRowCenter } from 'components/FlexBox';
import { numberToChinese } from 'components/CommonFn';

import AIQuestionItemEdit from './AIQuestionItemShow';
// import AIQuestionSetScore from './AIQuesitonSetScore';
import ErrorCorrect from 'components/ErrorCorrect';
import sourceModule from 'components/ErrorCorrect/sourceModule';

import {
  QuestionListWrapper,
  QuestionBox,
  QuestionItem,
  QuestionTypeName,
  QuestionControlBox,
  ToolsWtapper,
  ToolItemBox,
  ButtonWrapper,
  WidthBox,
  ScoreBox,
  ScoreItemBtn,
  QuestionItemMask,
} from './AIHomeworkEditStyle';
import { makeQuestionList } from 'utils/helpfunc';

export class AIQuestionsEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.controlBoxMouseEnter = this.controlBoxMouseEnter.bind(this);
    this.controlBoxMouseLeave = this.controlBoxMouseLeave.bind(this);
    this.changeShowAnalysis = this.changeShowAnalysis.bind(this);
    this.changeScore = this.changeScore.bind(this);
    this.changeQuestionItemData = this.changeQuestionItemData.bind(this);
    this.showChangeScore = this.showChangeScore.bind(this);
    this.removeQUestionItem = this.removeQUestionItem.bind(this);
    this.aIChangeQuestion = this.aIChangeQuestion.bind(this);
    this.state = {
      momeryQuestionItem: fromJS({}),
      // 删除题目
      showDelteModal: false,
      // 修改分数
      showChangeScoreModal: false, // 修改分数的弹框
      changeScoreWay: 1,           // 修改分数方式; 1:当前为非复合题，直接修改； 2：当前为复合题，批量修改子题分数； 3：当前为复合题，单独修改每个子题分数。
      // defaultScore: 3,
      // 定位题目工具菜单位置
      toolstop: -30,
      toolslelt: 0,
      toolsright: 0,
      toolsbottom: 0,
      toolsPosition: ['top', 'right'],
    };
    this.originQuestionList = null;// 智能换题只换第一次的题
  }
  componentDidMount() {
    const { AIHomeworkParams } = this.props;
    this.originQuestionList = makeQuestionList(AIHomeworkParams).questionDataList;
  }
  controlBoxMouseEnter(questionItem) {
    this.changeQuestionItemData(questionItem, 'showTools', true);
  }
  controlBoxMouseLeave(questionItem) {
    this.changeQuestionItemData(questionItem, 'showTools', false);
  }
  changeShowAnalysis(questionItem) {
    this.changeQuestionItemData(questionItem, 'showAnalysis', !questionItem.get('showAnalysis'));
  }
  showChangeScore(questionItem) {
    this.setState({
      momeryQuestionItem: questionItem,
      changeScoreWay: questionItem.get('templateType') !== 1 ? 1 : 2,
      showChangeScoreModal: true,
    });
  }
  aIChangeQuestion(questionItem, bigIndex, smallIndex) {
    const { setAIHWParamsItem, showChangeItemModal } = this.props;
    // console.log(questionItem.toJS(), 'questionItem');
    // 增加一个aiReplaceOriginId字段保存原始题目id
    let target = questionItem;
    let aiReplaceOriginId = questionItem.get('aiReplaceOriginId');
    if (aiReplaceOriginId) {
      target = this.originQuestionList.find(item => item.get('id') === aiReplaceOriginId) || questionItem;
    }
    target = target.set('toBeReplaceId', questionItem.get('id'));
    setAIHWParamsItem('AIChangeQuestionTarget', target);
    showChangeItemModal();
  }
  changeScore(value, type, i) {
    const { momeryQuestionItem } = this.state;
    let newMomeryQuestionItem = momeryQuestionItem;
    if (type === 'item') {
      newMomeryQuestionItem = newMomeryQuestionItem.set('score', value);
    } else if (type === 'each') {
      const children = (newMomeryQuestionItem.get('children') || fromJS([])).map((it) => it.set('score', value));
      newMomeryQuestionItem = newMomeryQuestionItem.set('children', children).set('score', children.count() * value);
    } else if (type === 'only') {
      const children = (newMomeryQuestionItem.get('children') || fromJS([])).setIn([i, 'score'], value);
      const scoreAll = children.map((it) => it.get('score')).reduce((a, b) => a + b);
      newMomeryQuestionItem = newMomeryQuestionItem.set('children', children).set('score', scoreAll);
    }
    this.setState({ momeryQuestionItem: newMomeryQuestionItem });
  }
  changeQuestionItemData(questionItem, type, value) {
    const { AIHomeworkParams, setAIHWParamsItem } = this.props;
    const questionList = AIHomeworkParams.get('AIHWQuestionList');
    const newQuestionList = questionList.map((item) => {
      if (item.get('id') === questionItem.get('id')) {
        return item.set(type, value);
      }
      return type === 'showTools' ? item.set('showTools', false) : item;
    });
    setAIHWParamsItem('AIHWQuestionList', newQuestionList);
  }
  removeQUestionItem(questionItem) {
    this.setState({
      momeryQuestionItem: questionItem,
      showDelteModal: true,
    });
  }
  render() {
    const { AIHomeworkParams, saveAIHomework, setAIHWParamsItem } = this.props;
    const { momeryQuestionItem, toolsPosition, changeScoreWay } = this.state;
    const isSaveAIHomeworking = AIHomeworkParams.get('isSaveAIHomeworking');
    const questionDataList = AIHomeworkParams.get('AIHWQuestionList') || fromJS([]);
    const selectedItem = AIHomeworkParams.get('selectedItem');
    const questionList = makeQuestionList(AIHomeworkParams).questionList;
    const toolsPositionStyle = {};
    toolsPositionStyle[toolsPosition[0]] = `${this.state[`tools${toolsPosition[0]}`]}px`;
    toolsPositionStyle[toolsPosition[1]] = `${this.state[`tools${toolsPosition[1]}`]}px`;
    return (<QuestionListWrapper>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 30px' }}>
        {questionList.map(([key, item], index) => {
          const itemScore = item.map((it) => {
            // if (it.get('templateType') === 1) return it.get('score') || 3;
            // const children = it.get('childre') || fromJS([]);
            // return children.map(() => )
            return it.get('score') || 3;
          }).reduce((a, b) => a + b);
          return (<QuestionBox key={index}>
            <QuestionTypeName style={{ lineHeight: '50px' }}>{numberToChinese(index + 1)}、{key}(共{item.count() || 0}题，共{itemScore}分)</QuestionTypeName>
            <QuestionItem>
              {item.map((it, i) => {
                return (<QuestionControlBox
                  selected={selectedItem.get('id') === it.get('id')}
                  key={i}
                  // onMouseEnter={() => this.controlBoxMouseEnter(it)}
                  // onMouseLeave={() => this.controlBoxMouseLeave(it)}
                >
                  <AIQuestionItemEdit questionData={it} index={it.get('questionIndex') + 1}></AIQuestionItemEdit>
                  <QuestionItemMask></QuestionItemMask>
                  <ToolsWtapper className="toolsWtapper" style={Object.assign({}, toolsPositionStyle)}>
                    <ToolItemBox onClick={() => this.changeShowAnalysis(it)}>{it.get('showAnalysis') ? '隐藏解析' : '查看解析'}</ToolItemBox>
                    <ToolItemBox onClick={() => this.showChangeScore(it)}>设定分数</ToolItemBox>
                    <ToolItemBox onClick={() => this.aIChangeQuestion(it)}>智能换题</ToolItemBox>
                    <ToolItemBox>
                      <ErrorCorrect
                        questionId={it.get('id')}
                        transparent={true}
                        style={{ color: 'rgb(24, 144, 255)' }}
                        sourceModule={sourceModule.homework.largeClassHomework.id}
                      />
                    </ToolItemBox>
                    <ToolItemBox hasRightBorder onClick={() => this.removeQUestionItem(it)}>删除</ToolItemBox>
                  </ToolsWtapper>
                </QuestionControlBox>);
              })}
            </QuestionItem>
          </QuestionBox>);
        })}
      </div>
      <FlexCenter style={{ height: 80 }}>
        <Button onClick={saveAIHomework} type="primary" disabled={isSaveAIHomeworking || questionDataList.count() <= 0} size="large">保存并发布</Button>
      </FlexCenter>
      <Modal
        title="设置分数"
        visible={this.state.showChangeScoreModal}
        footer={null}
        maskClosable={false}
        style={{ top: 'calc(50% - 100px)' }}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        onCancel={() => this.setState({ showChangeScoreModal: false })}
      >
        {changeScoreWay === 1 ? <ScoreBox>
          <p>设置分数：</p>
          <InputNumber min={1} max={99} step={1} value={momeryQuestionItem.get('score') || 3} onChange={(value) => this.changeScore(value, 'item')}></InputNumber>
        </ScoreBox> : <div>
          <FlexRowCenter>
            <ScoreItemBtn active={changeScoreWay === 2} onClick={() => this.setState({ changeScoreWay: 2 })}>批量设置子题分数</ScoreItemBtn>
            <ScoreItemBtn active={changeScoreWay === 3} onClick={() => this.setState({ changeScoreWay: 3 })}>单独设置子题分数</ScoreItemBtn>
          </FlexRowCenter>
          {changeScoreWay === 2 ? <ScoreBox>
            <p>子题分数：</p>
            <InputNumber min={1} max={99} step={1} defaultValue={3} onChange={(value) => this.changeScore(value, 'each')}></InputNumber>
          </ScoreBox> :
          <div style={{ margin: '5px 10px' }}>
            {(momeryQuestionItem.get('children') || fromJS([])).map((it, i) => {
              return (<FlexRowCenter style={{ height: 30 }} key={i}>
                <p style={{ margin: '0 10px', fontSize: 14 }}>({i + 1})</p>
                <InputNumber min={1} max={99} step={1} value={it.get('score') || 3} onChange={(value) => this.changeScore(value, 'only', i)}></InputNumber>
              </FlexRowCenter>);
            })}
          </div>}
        </div>}
        <ButtonWrapper style={{ lineHeight: '2em' }}>
          <Button onClick={() => this.setState({ showChangeScoreModal: false })}>取消</Button>
          <WidthBox width={20}></WidthBox>
          <Button
            type="primary" onClick={() => {
              const newAIHWQuestionList = questionDataList.map((item) => {
                if (item.get('id') === momeryQuestionItem.get('id')) {
                  return momeryQuestionItem;
                }
                return item;
              });
              setAIHWParamsItem('AIHWQuestionList', newAIHWQuestionList);
              this.setState({ showChangeScoreModal: false });
            }}
          >确定</Button>
        </ButtonWrapper>
      </Modal>
      <Modal
        title="系统提示"
        maskClosable={false}
        visible={this.state.showDelteModal}
        style={{ top: 'calc(50% - 100px)' }}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        onCancel={() => this.setState({ showDelteModal: false })}
        onOk={() => {
          const newQuestionList = questionDataList.filter((item) => item.get('id') !== momeryQuestionItem.get('id'));
          setAIHWParamsItem('AIHWQuestionList', newQuestionList);
          this.setState({ showDelteModal: false });
        }}
      >
        <p>您确认要删除该题吗？</p>
      </Modal>
    </QuestionListWrapper>);
  }
}

AIQuestionsEdit.propTypes = {
  AIHomeworkParams: PropTypes.instanceOf(immutable.Map).isRequired,
  setAIHWParamsItem: PropTypes.func.isRequired,
  saveAIHomework: PropTypes.func.isRequired,
  // getChangeItemDataList: PropTypes.func,
  showChangeItemModal: PropTypes.func.isRequired,
};

export default AIQuestionsEdit;
