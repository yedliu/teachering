import React from 'react';
import { fromJS } from 'immutable';
import AIQuestionItemEdit from 'containers/StandHomeWork/AIHomework/AIHomeworkEdit/AIQuestionItemShow';
import ErrorCorrect from 'components/ErrorCorrect';
import sourceModule from 'components/ErrorCorrect/sourceModule';
import { BackTop } from 'antd';
import {
  QuestionListWrapper,
  QuestionControlBox,
  QuestionItemMask,
  ToolsWtapper,
  ToolItemBox,
} from './questionListStyle';

import {
  HwCommonConfig,
  toolsConfig,
} from './previewConfig';

const emptyList = fromJS([]);


class QuestionListComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      toolstop: -toolsConfig.toolsOffsetHeight,
      toolslelt: 0,
      toolsright: 0,
      toolsbottom: 0,
      toolsPosition: ['top', 'right'],
      positionType: 1,
    };
  }
  changeShowAnalysis = (questionItem) => {
    const { changeQuestionState } = this.props;
    if (changeQuestionState) {
      changeQuestionState('item', questionItem.get('id'), 'showAnalysis', !questionItem.get('showAnalysis'));
    }
  }
  deleteQuestion = (questionItem) => {
    const { selectQuestion } = this.props;
    if (selectQuestion) {
      selectQuestion('removeFromSkep', questionItem);
    }
  }
  changeToolsPosition = (e) => {
    /*
    // 如果需要添加编辑模式
    const { mode } = this.props;
    const isEditMode = mode === 'edit';
    const isEditMode = false;
    const id = isEditMode ? 'changeAllQuestion' : 'showAnalysisBtn';
    const changeAllBtn = document.querySelector(`#${id}`);
    if (changeAllBtn) {
      const rectObj = changeAllBtn.getBoundingClientRect();
      const targetRectObj = e.target.getBoundingClientRect();
      const toolsHeight = toolsConfig.toolsOffsetHeight;
      const changeAllBtnBottomTop = rectObj.top + rectObj.height;     // 换一批 按钮的底部的高度值
      const targetTop = targetRectObj.top;                            // 当前题目的高度值
      const targetBottomTop = targetTop + targetRectObj.height;       // 当前题目的底部高度值
      // console.log(changeAllBtnBottomTop, targetBottomTop, targetTop);
      if (targetTop >= changeAllBtnBottomTop && targetTop - changeAllBtnBottomTop <= toolsHeight) {
        this.setState({ toolstop: 0, toolsPosition: ['top', 'right'], positionType: 2 });
      } else if (targetTop < changeAllBtnBottomTop && targetBottomTop >= changeAllBtnBottomTop && targetBottomTop - changeAllBtnBottomTop >= toolsHeight) {
        this.setState({ toolsbottom: 0, toolsPosition: ['bottom', 'right'], positionType: 3 });
      } else if (targetTop < changeAllBtnBottomTop && targetBottomTop >= changeAllBtnBottomTop && targetBottomTop - changeAllBtnBottomTop >= 0) {
        this.setState({ toolsbottom: -toolsHeight, toolsPosition: ['bottom', 'right'], positionType: 4 });
      } else {
        this.setState({ toolstop: -toolsHeight, toolsPosition: ['top', 'right'], positionType: 1 });
      }
    } else {
    */
    const questionScrollWrapperRect = document.querySelector('#questionScrollWrapper').getBoundingClientRect();
    const targetRectObj = e.target.getBoundingClientRect();
    const toolsHeight = toolsConfig.toolsOffsetHeight;
    const changeAllBtnBottomTop = questionScrollWrapperRect.top || HwCommonConfig;// 当前滚动区域距离页面顶部高度;
    const targetTop = targetRectObj.top;                            // 当前题目的高度值
    const targetBottomTop = targetTop + targetRectObj.height;       // 当前题目的底部高度值
    // 计算 tooltip 应该出现的位置
    if (targetTop >= changeAllBtnBottomTop && targetTop - changeAllBtnBottomTop <= toolsHeight) {
      this.setState({ toolstop: 0, toolsPosition: ['top', 'right'], positionType: 2 });
    } else if (targetTop < changeAllBtnBottomTop && targetBottomTop >= changeAllBtnBottomTop && targetBottomTop - changeAllBtnBottomTop >= toolsHeight) {
      this.setState({ toolsbottom: 0, toolsPosition: ['bottom', 'right'], positionType: 3 });
    } else if (targetTop < changeAllBtnBottomTop && targetBottomTop >= changeAllBtnBottomTop && targetBottomTop - changeAllBtnBottomTop >= 0) {
      this.setState({ toolsbottom: -toolsHeight, toolsPosition: ['bottom', 'right'], positionType: 4 });
    } else {
      this.setState({ toolstop: -toolsHeight, toolsPosition: ['top', 'right'], positionType: 1 });
    }
    // }
  }
  filterTollItemBox = (type, component) => {
    const { toolConfig = {}} = this.props;
    if ((type in toolConfig) && !toolConfig[type]) {
      return null;
    }
    return component;
  }
  render() {
    const { toolsPosition, positionType } = this.state;
    const {
      questionsList = emptyList,
    } = this.props;
    const analysisNotSomeShow = !questionsList.some((item) => item.get('showAnalysis'));
    const toolsPositionStyle = {};
    toolsPositionStyle[toolsPosition[0]] = `${this.state[`tools${toolsPosition[0]}`]}px`;
    toolsPositionStyle[toolsPosition[1]] = `${this.state[`tools${toolsPosition[1]}`]}px`;
    return (
      <QuestionListWrapper>
        <BackTop target={() => document.querySelector('#questionScrollWrapper')} />
        {/* {isEditMode ? '' : <ShowAllAnalysis id="showAnalysisBtn" onClick={() => this.changeShowAnalysis()}>{analysisHadAllShow ? '隐藏' : '查看'}解析</ShowAllAnalysis>} */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px', background: '#f9fafb' }} id="questionScrollWrapper">
          <div id="questionEditWrapper">
            <div style={{ height: 30 }}></div>
            {questionsList.map((item, index) => {
              const itShowAnalysis = item.get('showAnalysis');
              return (<QuestionControlBox
                className="questionEditItem"
                showAnalysis={itShowAnalysis}
                showHighlight={analysisNotSomeShow}
                // isSelected={selectedHwQuestionItem.get('id') === item.get('id')}
                key={index}
                onMouseEnter={this.changeToolsPosition}
              >
                <AIQuestionItemEdit
                  questionMsgShowAlone
                  questionData={item}
                  index={item.get('questionIndex') + 1}
                />
                <QuestionItemMask></QuestionItemMask>
                <ToolsWtapper positionType={positionType} showAnalysis={itShowAnalysis} className="toolsWtapper" style={Object.assign({}, toolsPositionStyle)}>
                  {this.filterTollItemBox('showAnalysis', <ToolItemBox onClick={() => this.changeShowAnalysis(item)}>{itShowAnalysis ? '隐藏解析' : '查看解析'}</ToolItemBox>)}
                  {this.filterTollItemBox('correct', <ToolItemBox onClick={() => this.setState({ errorQuestionId: item.get('id'), showErrorCorrect: true })}>
                    <ErrorCorrect
                      questionId={item.get('id')}
                      transparent
                      style={{ color: 'rgb(24, 144, 255)' }}
                      sourceModule={sourceModule.tk.universalTopicSelection.id}
                    />
                  </ToolItemBox>)}
                  {this.filterTollItemBox('delete', <ToolItemBox onClick={() => this.deleteQuestion(item)}>删除</ToolItemBox>)}
                </ToolsWtapper>
              </QuestionControlBox>);
            })}
          </div>
        </div>
      </QuestionListWrapper>
    );
  }
}

export default QuestionListComponent;