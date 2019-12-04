/* eslint-disable no-undefined */
/**
 *
 * PaperPreview
 *
 */

import React from 'react';
import styled from 'styled-components';
import immutable, { fromJS } from 'immutable';
import { FlexRowCenter, FlexColumn, FlexCenter } from 'components/FlexBox';
import { toString, toNumber } from 'components/CommonFn';
// import { WidthBox } from 'components/CommonFn/style';
import Button from 'components/Button';
import { Select } from 'antd';

// 预览
const PreviewWrapper = styled(FlexCenter)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  user-select: none;
`;
const PreviewBox = styled(FlexColumn)`
  min-width: 800px;
  min-height: 500px;
  background: #f0f0f0;
`;
const PreviewImgBox = styled(FlexColumn)`
  max-height: 500px;
  min-width: 1000px;
  padding: 10px;
  border: 1px solid #ccc;
  flex: 1;
`;
const PreviewImg = styled(FlexColumn)`
  align-items: center;
  width: 100%;
  padding: 5px;
  text-align: center;
  background: #afbfcf;
  overflow: auto;
  flex: 1;
`;
const QuestionMsgWrapper = styled(FlexColumn)`
  min-height: 165px;
  max-height: 260px;
  // padding: 0 20px;
  // overflow-y: auto;
  background: #fff;
`;
const WeightQuestion = styled(FlexRowCenter)`
  height: 60px;
  min-height: 60px;
  padding: 0 20px;
  justify-content: space-between;
`;
const QuestionItemScroll = styled(FlexColumn)`
  height: 50px;
  padding: 0 20px;
  border-bottom: 1px solid #ccc;
`;
const QuestionItemValueText = styled.div`
  min-width: 80px;
  text-align: right;
  font-size: 16px;
`;
const QuestionItemType = styled(FlexRowCenter)`
  height: 100%;
  min-width: 200px;
  max-width: 400px;
  padding-left: 20px;
`;
const ButtonItem = styled(Button)`
  margin: 0 40px;
`;
const RadioSelectBoxItem = styled(FlexRowCenter)``;
const RadioSelectBox = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin: 0 10px;
  cursor: pointer;
  border: ${(props) => (props.index === props.selectIndex ? '4px solid #ef414f' : '1px solid #ddd')};
`;
const TextValue = styled.p`
  margin: 0;
`;

class PaperPreview extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.smallQuestionType = this.smallQuestionType.bind(this);
    this.initQuestionIndex = this.initQuestionIndex.bind(this);
    this.state = {
      addWayIndex: 1, // 当前切割的小题的插入方式： 1 插入， 2 替换
      lastQuestionItem: { name: '1', id: '1' },
      smallQuestionIndexList: [],
    };
  }
  componentDidMount() {
    console.log(this.props.source);
    this.initQuestionIndex();
  }
  smallQuestionType(value, type) {
    console.log(value);
    if (type === 'type') {
      const smallQuestionMsg = this.props.smallQuestion;
      this.props.changeSelectedQuestionType(value);
      this.props.changeSmallQuestion(
        smallQuestionMsg.set('questionTypeId', value.key),
      );
    } else if (type === 'index') {
      this.props.changeInsertIndex(value);
    }
  }
  initQuestionIndex() {
    const questionsList = this.props.questionsList || fromJS([]);
    const smallQuestionIndexList = [];
    const selectedBigQuestionIndex = toNumber(
      this.props.selectedBigQuestion.get('id'),
    );
    if (selectedBigQuestionIndex > -1) {
      let beforeCount = 0;
      questionsList.forEach((item, index) => {
        if (index < selectedBigQuestionIndex) {
          beforeCount += item.get('children').count();
        }
      });
      questionsList
        .get(selectedBigQuestionIndex)
        .get('children')
        .toJS()
        .forEach((it, i) => {
          smallQuestionIndexList.push({
            name: toString(beforeCount + i + 1),
            id: toString(i + 1),
          });
        });
      const len = smallQuestionIndexList.length;
      smallQuestionIndexList.push({
        name: toString(beforeCount + len + 1),
        id: toString(len + 1),
      });
      this.smallQuestionType(
        { label: toString(len + beforeCount + 1), key: toString(len + 1) },
        'index',
      );
      this.setState({ smallQuestionIndexList });
    }
  }
  render() {
    const questionsList = this.props.questionsList || fromJS([]);
    // console.log(questionsList.toJS());
    const bigQuestionList = questionsList.map((item, index) => {
      return fromJS({ name: item.get('name'), id: String(index) });
    });
    return (
      <PreviewWrapper>
        <PreviewBox>
          <PreviewImgBox>
            <PreviewImg>
              <img role="presentation" src={this.props.currentCutPaperImg} />
            </PreviewImg>
          </PreviewImgBox>
          <QuestionMsgWrapper>
            <WeightQuestion>
              <QuestionItemType style={{ padding: 0 }}>
                <QuestionItemValueText>所属大题：</QuestionItemValueText>
                <Select
                  labelInValue
                  defaultValue={{ key: '请选择大题', label: '-1' }}
                  style={{ width: 200 }}
                  value={{
                    key: toString(this.props.selectedBigQuestion.get('id')),
                    label: toString(this.props.selectedBigQuestion.get('name')),
                  }}
                  onChange={value => {
                    this.props.selectQuestionAndType(value);
                    setTimeout(() => {
                      this.initQuestionIndex();
                    }, 100);
                  }}
                >
                  {(bigQuestionList || fromJS([])).map((it, i) => (
                    <Select.Option key={i} value={toString(it.get('id'))}>
                      {it.get('name')}
                    </Select.Option>
                  ))}
                </Select>
              </QuestionItemType>
              <QuestionItemType>
                <QuestionItemValueText>小题题号：</QuestionItemValueText>
                <Select
                  labelInValue
                  defaultValue={{ key: '请选择插入位置', label: '-1' }}
                  style={{ width: 200 }}
                  value={{
                    key: toString(this.props.selectedInsertIndex.get('id')),
                    label: toString(this.props.selectedInsertIndex.get('name')),
                  }}
                  onChange={value => this.smallQuestionType(value, 'index')}
                >
                  {fromJS(this.state.smallQuestionIndexList).map((it, i) => (
                    <Select.Option key={i} value={toString(it.get('id'))}>
                      {it.get('name')}
                    </Select.Option>
                  ))}
                </Select>
              </QuestionItemType>
              <QuestionItemType>
                <QuestionItemValueText>小题题型：</QuestionItemValueText>
                <Select
                  labelInValue
                  defaultValue={{ key: '请选择题型', label: '-1' }}
                  style={{ width: 200 }}
                  value={{
                    key: toString(this.props.selectedquestionType.get('id')),
                    label: toString(
                      this.props.selectedquestionType.get('name'),
                    ),
                  }}
                  onChange={value => this.smallQuestionType(value, 'type')}
                >
                  {(this.props.questionTypeList || fromJS([])).map((it, i) => (
                    <Select.Option key={i} value={toString(it.get('id'))}>
                      {it.get('name')}
                    </Select.Option>
                  ))}
                </Select>
              </QuestionItemType>
            </WeightQuestion>
            <QuestionItemScroll>
              <QuestionItemType style={{ maxWidth: '100%', padding: 0 }}>
                <QuestionItemValueText>保存方式：</QuestionItemValueText>
                <RadioSelectBoxItem>
                  <RadioSelectBox
                    index={1}
                    selectIndex={this.state.addWayIndex}
                    onClick={() => this.setState({ addWayIndex: 1 })}
                  />
                  <TextValue>
                    新增（插入所选位置，原有题目题号向后顺延）
                  </TextValue>
                </RadioSelectBoxItem>
                <RadioSelectBoxItem style={{ marginLeft: '30px' }}>
                  <RadioSelectBox
                    index={2}
                    selectIndex={this.state.addWayIndex}
                    onClick={() => this.setState({ addWayIndex: 2 })}
                  />
                  <TextValue>替换（直接替换所选位置原有题目）</TextValue>
                </RadioSelectBoxItem>
              </QuestionItemType>
            </QuestionItemScroll>
            <FlexCenter style={{ height: '50px', minHeight: '50px' }}>
              <ButtonItem
                showtype={5}
                onClick={() => this.props.previewWrapperShowOrHide(false)}
              >
                取消
              </ButtonItem>
              {this.props.btnCanClick ||
              this.props.btnCanClick === undefined ? (
                <ButtonItem
                  showtype={4}
                  onClick={() =>
                    this.props.QuestionItemCutSure(this.state.addWayIndex)
                  }
                >
                  确定
                </ButtonItem>
              ) : (
                <ButtonItem showtype={8} onClick={() => {}}>
                  确定
                </ButtonItem>
              )}
              {/* <ButtonItem showtype={4} onClick={() => this.props.QuestionItemCutSure(this.state.addWayIndex)}>确定</ButtonItem> */}
            </FlexCenter>
          </QuestionMsgWrapper>
        </PreviewBox>
      </PreviewWrapper>
    );
  }
}

PaperPreview.propTypes = {
  source: React.PropTypes.string.isRequired, // 来源
  currentCutPaperImg: React.PropTypes.string.isRequired, // 预览的图片
  // questionMsgList: React.PropTypes.instanceOf(immutable.List).isRequired,  // 来源是切割时预览时的题目信息
  previewWrapperShowOrHide: React.PropTypes.func.isRequired, // 控制是否显示当前 component
  QuestionItemCutSure: React.PropTypes.func.isRequired, // 点击确认按钮
  // addQuestion: React.PropTypes.func.isRequired,  // 添加题目
  // handleChange: React.PropTypes.func.isRequired,  // 选择器 change 事件
  questionTypeList: React.PropTypes.instanceOf(immutable.List).isRequired, // 所有题型
  selectedquestionType: React.PropTypes.instanceOf(immutable.Map).isRequired, // 选中的题型
  changeSelectedQuestionType: React.PropTypes.func.isRequired, // 切换题型
  // changeBigQuestion: React.PropTypes.func.isRequired,  // 保存大题信息
  // bigQuestion: React.PropTypes.instanceOf(immutable.Map).isRequired,  // 大题信息
  changeSmallQuestion: React.PropTypes.func.isRequired, // 保存小题信息
  smallQuestion: React.PropTypes.instanceOf(immutable.Map).isRequired, // 小题信息
  // questionCountAll: React.PropTypes.number.isRequired,  // 题目数量
  selectedBigQuestion: React.PropTypes.instanceOf(immutable.Map), // 选择的大题
  questionsList: React.PropTypes.instanceOf(immutable.List), // 大题列表
  // selectedInsertWay: React.PropTypes.instanceOf(immutable.Map),   // 选择的大题
  // selectInsertWayList: React.PropTypes.instanceOf(immutable.List),  // 选择插入方式列表
  selectQuestionAndType: React.PropTypes.func, // 选择大题或插入方式
  changeInsertIndex: React.PropTypes.func, // 切换插入的位置
  selectedInsertIndex: React.PropTypes.instanceOf(immutable.Map), // 插入的位置
  isAddOrEdit: React.PropTypes.object, // 插入与修改相关
  btnCanClick: React.PropTypes.bool,
};

export default PaperPreview;
