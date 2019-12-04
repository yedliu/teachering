/**
 * 此文件暂不可用
 */

import React from 'react';
import { fromJS } from 'immutable';
import { FlexRow } from 'components/FlexBox';
import {
  PointWrapper,
  PointBox,
  PointItem,
  QuestionTypeName,
  // ToolsWtapper,
  // ToolItemBox,
  // ButtonWrapper,
  // WidthBox,
  // ScoreBox,
} from 'containers/StandHomeWork/AIHomework/AIHomeworkEdit/AIHomeworkEditStyle';

const emptyList = fromJS([]);

class Menu extends React.Component {
  render() {
    const { questionDataList = emptyList } = this.props;
    const pointList = questionDataList.map((item, index) => item.set('questionIndex', index)).groupBy((item) => item.get('parentTypeName')).entrySeq();
    return (
      <PointWrapper>
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
          </PointBox>);
        })}
      </PointWrapper>
    );
  }
}

export default Menu;