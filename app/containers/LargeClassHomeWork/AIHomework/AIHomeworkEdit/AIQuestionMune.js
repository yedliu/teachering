import React, { PropTypes } from 'react';
import immutable, { fromJS } from 'immutable';
import { Modal, Button, InputNumber, Icon } from 'antd';

import { FlexRow } from 'components/FlexBox';
import { numberToChinese } from 'components/CommonFn';

import {
  PointWrapper,
  PointBox,
  PointItem,
  QuestionTypeName,
  ToolsWtapper,
  ToolItemBox,
  ButtonWrapper,
  WidthBox,
  ScoreBox,
} from './AIHomeworkEditStyle';

export class AIQuestionMune extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.showChangeScore = this.showChangeScore.bind(this);
    this.removeQUestionItem = this.removeQUestionItem.bind(this);
    this.changeScore = this.changeScore.bind(this);
    this.changeForm = this.changeForm.bind(this);
    this.drapMuneStart = this.drapMuneStart.bind(this);
    this.drapMuneEnd = this.drapMuneEnd.bind(this);
    this.state = {
      showDelteModal: false,         // 显示删除提示
      showChangeScoreModal: false,   // 设置分数弹框
      momeryGroupKey: '',            // 记录当前分组
      setScore: 3,                   // 设置为的分数【非复合题】
      momeryDropItem: fromJS({}),    // 记录当前拖拽的对象
    };
  }
  showChangeScore(key) {
    this.setState({ momeryGroupKey: key, showChangeScoreModal: true });
  }
  removeQUestionItem(key) {
    this.setState({ momeryGroupKey: key, showDelteModal: true });
  }
  drapMuneStart(questionItem) {
    this.setState({ momeryDropItem: questionItem });
  }
  drapMuneEnd(questionIndex, it) {
    const { AIHomeworkParams } = this.props;
    const { momeryDropItem } = this.state;
    if (momeryDropItem.get('parentTypeName') !== it.get('parentTypeName')) return;
    const newAIHWQuestionList = (AIHomeworkParams.get('AIHWQuestionList') || fromJS([]))
      .filter((item) => item.get('id') !== momeryDropItem.get('id'))
      .insert(questionIndex, momeryDropItem);
    this.changeForm('AIHWQuestionList', newAIHWQuestionList);
  }
  changeScore(value) {
    this.setState({ setScore: value });
  }
  changeSelectItem(questionItem) {
    this.changeForm('selectedItem', questionItem);
  }
  changeForm(type, value) {
    const { setAIHWParamsItem } = this.props;
    setAIHWParamsItem(type, value);
  }
  render() {
    const { AIHomeworkParams } = this.props;
    const { momeryGroupKey, setScore } = this.state;
    const questionDataList = AIHomeworkParams.get('AIHWQuestionList') || fromJS([]);
    const selectedItem = AIHomeworkParams.get('selectedItem');
    const pointList = questionDataList.map((item, index) => item.set('questionIndex', index)).groupBy((item) => item.get('parentTypeName')).entrySeq();
    return (<PointWrapper>
      {pointList.map(([key, item], index) => {
        return (<PointBox key={index}>
          <QuestionTypeName>{numberToChinese(index + 1)}、{key}</QuestionTypeName>
          <FlexRow style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {item.map((it, i) => {
              const questionIndex = it.get('questionIndex');
              return (<PointItem
                key={i}
                draggable
                selected={selectedItem.get('id') === it.get('id')}
                onClick={() => this.changeSelectItem(it)}
                onDragStart={() => this.drapMuneStart(it)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  this.drapMuneEnd(questionIndex, it);
                }}
              >{questionIndex + 1}</PointItem>);
            })}
          </FlexRow>
          <ToolsWtapper className="toolsWrapper-mune" style={{ top: -1, right: 0, height: '24px' }}>
            <ToolItemBox onClick={() => this.showChangeScore(key, index, item)}>批量设置分数</ToolItemBox>
            <ToolItemBox hasRightBorder onClick={() => this.removeQUestionItem(key, index, item)}>删除</ToolItemBox>
          </ToolsWtapper>
        </PointBox>);
      })}
      <Modal
        title="批量设置分数"
        visible={this.state.showChangeScoreModal}
        footer={null}
        maskClosable={false}
        style={{ top: 'calc(50% - 100px)' }}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        onCancel={() => this.setState({ showChangeScoreModal: false })}
      >
        <ScoreBox>
          <p>设定分数：</p>
          <InputNumber min={1} max={99} step={1} value={setScore} onChange={(value) => {
            if (value < 100 && value > 0) {
              this.changeScore(value)
            }
          }}></InputNumber>
        </ScoreBox>
        <ScoreBox>
          <p style={{ color: 'red' }}><Icon type="info-circle-o" /> 复合题的分数需要您手动设置。</p>
        </ScoreBox>
        <ButtonWrapper style={{ lineHeight: '2em' }}>
          <Button onClick={() => this.setState({ showChangeScoreModal: false })}>取消</Button>
          <WidthBox width={20}></WidthBox>
          <Button
            type="primary" onClick={() => {
              const newAIHWQuestionList = questionDataList.map((item) => {
                if (item.get('parentTypeName') === momeryGroupKey && item.get('templateType') !== 1) {
                  return item.set('score', setScore);
                }
                return item;
              });
              this.changeForm('AIHWQuestionList', newAIHWQuestionList);
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
          const newQuestionList = questionDataList.filter((item) => item.get('parentTypeName') !== momeryGroupKey);
          this.changeForm('AIHWQuestionList', newQuestionList);
          this.setState({ showDelteModal: false });
        }}
      >
        <p>您确认要删除该题吗？</p>
      </Modal>
    </PointWrapper>);
  }
}

AIQuestionMune.propTypes = {
  AIHomeworkParams: PropTypes.instanceOf(immutable.Map).isRequired,
  setAIHWParamsItem: PropTypes.func.isRequired,
};

export default AIQuestionMune;
