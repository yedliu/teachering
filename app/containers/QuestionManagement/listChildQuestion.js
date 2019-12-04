import React from 'react';
import styled from 'styled-components';
import { fromJS } from 'immutable';
import { FlexRow } from 'components/FlexBox';
import { Switch, InputNumber } from 'antd';
import {
  QuestionInfoWrapper, QuestionsCount, QuestionOptions,
  OptionsWrapper, OptionsOrder,
} from '../StandHomeWork/createHomeWorkStyle';
import { renderToKatex, filterHtmlForm, numberToLetter, backfromZmStandPrev } from 'components/CommonFn';
import Analysis from 'components/Analysis';
const Options = styled.div``;
const QuestionContent = styled.div`
  &::after {
    content: '';
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
  }
`;
const Root = styled.div`
  margin-top: 15px;
`;
const FlexEndRow = styled(FlexRow)`
  justify-content: flex-end;
  .ant-input-number {
    width: 50px;
    margin: 0 10px;
  }
`;
export class ListChildQuestion extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showAnalysis: false,
    };
  }

  render() {
    const { children, onEditScore, pageStatus, showScore } = this.props;
    const { showAnalysis } = this.state;
    if (!children) {
      return (<div style={{ color: 'red' }}>该题为复合题，但是子题数据为空</div>);
    }
    return (
      <Root>
        <span style={{ color: '#b34d10' }}>子题答案</span>
        <Switch
          checked={showAnalysis}
          checkedChildren="显示" unCheckedChildren="隐藏"
          onChange={(val) => {
            this.setState({
              showAnalysis: val
            });
          }}
          style={{ marginLeft: 5 }}
        ></Switch>
        {children.map((item, index) => {
          // const childScore = item.get('epScore') === null || item.get('epScore') === void 0  ? item.get('score') : item.get('epScore');
          return (
            <QuestionInfoWrapper key={index}>
              <QuestionsCount>{`${index + 1}、`}</QuestionsCount>
              {item.get('title') ? (
                <QuestionContent dangerouslySetInnerHTML={{ __html: renderToKatex(backfromZmStandPrev(item.get('title') || '', 'createHw')) }} />
              ) : ''}
              <QuestionOptions style={{ minHeight: 20 }}>
                {item.get('optionList') && item.get('optionList').filter((it) => filterHtmlForm(it)).count() > 0 ? (item.get('optionList') || fromJS([])).map((iit, ii) => (
                  <OptionsWrapper key={ii}>
                    <OptionsOrder>{`${numberToLetter(ii)}、`}</OptionsOrder>
                    <Options dangerouslySetInnerHTML={{ __html: renderToKatex(backfromZmStandPrev(iit || '', 'createHw')) }} />
                  </OptionsWrapper>
                )) : ''}
              </QuestionOptions>
              {
                showScore ? <FlexEndRow>
                  <div>
                    {
                      pageStatus === 'edit' ? (
                        <div>
                          设置分数
                          <InputNumber
                            min={0.5}
                            max={100}
                            step={0.5}
                            precision={1}
                            type="number"
                            value={item.get('epScore')}
                            onChange={epScore => {
                              onEditScore(epScore, index);
                            }}
                            style={{ border: item.get('epScore') ? '' : '1px solid red' }}
                          />
                        </div>
                      ) : <div>本题分数：{item.get('epScore')}</div>
                    }

                  </div>
                </FlexEndRow> : null
              }
              <Analysis
                isShow={showAnalysis}
                optional={item.get('optionList') && item.get('optionList').filter((iit) => filterHtmlForm(iit)).count() > 0}
                answerList={item.get('answerList') || fromJS([])}
                analysis={item.get('analysis') || ''}
              />
            </QuestionInfoWrapper>
          );
        })}
      </Root>
    );
  }
}
