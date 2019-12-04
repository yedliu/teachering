import React from 'react';
import { Row, Col, Input, Button, Icon, message } from 'antd';
import InputNumber from 'components/InputNumber';

import { Wrapper, Title, Section, Label, ShortLine, MidRow } from './style';

export default class MentalityEdit extends React.PureComponent {
  addRate = () => {
    const { rateList, item, onChange } = this.props;
    if (rateList.count() > 9) {
      message.info('不能再添加了');
      return;
    }
    onChange(rateList.push(item));
  }

  removeRate = (item, index) => {
    const { rateList, onChange } = this.props;
    if (rateList.count() < 2) {
      message.info('请至少保留一项');
      return;
    }
    onChange(rateList.delete(index));
  }

  changeMinScore = (index, e) => {
    const { rateList, onChange } = this.props;
    onChange(rateList.setIn([index, 'minScore'], e || 0));
  }

  setInWithName = (index, name, val) => {
    const { rateList, onChange } = this.props;
    onChange(rateList.setIn([index, name], val));
  }

  changeMaxScore = (index, e) => {
    this.setInWithName(index, 'maxScore', e || 0);
  }

  changeGrade = (index, e) => {
    const val = e.target.value;
    if (val.length > 20) {
      return;
    }
    this.setInWithName(index, 'grade', val);
  }

  changeComment = (index, e) => {
    const val = e.target.value;
    if (val.length > 500) {
      return;
    }
    this.setInWithName(index, 'comment', val);
  }

  render() {
    const { visible, rateList, totalScore, minScore, isPreview } = this.props;
    return (
      <Wrapper style={{ display: visible ? 'block' : 'none' }}>
        <Title>当前试卷总分为<span>{totalScore}</span>分，最低分为<span>{minScore}</span>分</Title>
        {rateList.map((item, index) => {
          const min = item.get('minScore');
          const max = item.get('maxScore');
          const grade = item.get('grade');
          const comment = item.get('comment');
          const isFirstRange = index === 0;
          const isFloat = ((index === rateList.count() - 1) && (totalScore % 1 !== 0));
          return (
            <Section key={index}>
              {isPreview || isFirstRange ? null : <Icon type="close-circle" onClick={() => this.removeRate(item, index)} />}
              <MidRow gutter={16}>
                <Col span={2}>
                  <Label required>分数范围:</Label>
                </Col>
                <Col span={10}>
                  <MidRow>
                    {isPreview ? min || '0' : <InputNumber disabled={isFirstRange} min={0} max={totalScore} precision={0} step={1} value={min} onChange={(e) => this.changeMinScore(index, e)}></InputNumber>}
                    <ShortLine />
                    {isPreview ? max || '0' : <InputNumber min={0} precision={isFloat ? 1 : 0} step={isFloat ? 0.5 : 1} value={max} onChange={(e) => this.changeMaxScore(index, e)}></InputNumber>}
                  </MidRow>
                </Col>
              </MidRow>
              <MidRow gutter={16}>
                <Col span={2}>
                  <Label>评定等级:</Label>
                </Col>
                <Col span={15}>
                  {isPreview ? grade : <Input value={grade} onChange={(e) => this.changeGrade(index, e)} />}
                </Col>
              </MidRow>
              <Row gutter={16}>
                <Col span={2}>
                  <Label required>评语:</Label>
                </Col>
                <Col span={15}>
                  {isPreview ? comment : <textarea value={comment} onChange={(e) => this.changeComment(index, e)} />}
                </Col>
              </Row>
            </Section>
          );
        })}
        {isPreview || rateList.count() > 9 ? null : <Button type="primary" onClick={this.addRate}>新增区间</Button>}
      </Wrapper>
    );
  }
}