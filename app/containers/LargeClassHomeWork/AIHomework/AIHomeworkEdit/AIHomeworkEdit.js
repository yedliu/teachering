import React, { PropTypes } from 'react';
import immutable, { fromJS } from 'immutable';
import { Modal, Select, Input, message } from 'antd';
import { toNumber } from 'lodash';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { FlexCenter, FlexRowCenter } from 'components/FlexBox';
import ReplaceQuestionModal from './AIQuestionChangeItem';
import { sceneList } from '../../common';
import AIQuestionMune from './AIQuestionMune';
import AIQuestionsEdit from './AIQuestionsEdit';
import {
  AIHomeworkEditWrapper,
  AIEditLeft,
  AIEditRight,
  WidthBox,
  ChangeQuestion,
  IconReload,
  IconFontDefault,
  FlexRowCenterBox,
  MainColorSpan,
} from './AIHomeworkEditStyle';
import { makeSerachParams, makePrviewSelectObj, makeIsReEditHomeWork } from '../../selectors';

const Option = Select.Option;

export class AIHomeworkEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.changeAllQuestion = this.changeAllQuestion.bind(this);
    this.changeHwScene = this.changeHwScene.bind(this);
    this.changeHomeWorkName = this.changeHomeWorkName.bind(this);
    this.changeSaveParam = this.changeSaveParam.bind(this);
    this.state = {
      showChangeQuestionItem: false,
      // momeryChangeQuestionItem: fromJS({}),
    };
  }
  changeAllQuestion() {
    const { getQuestion4AIHW } = this.props;
    getQuestion4AIHW();
  }
  changeHwScene(value) {
    const { setAIHWParamsItem } = this.props;
    console.log('value', value);
    const selectedScene = sceneList.find((item) => item.get('id') === value);
    setAIHWParamsItem('homeworkScene', selectedScene);
  }
  changeHomeWorkName(e) {
    const { setAIHWParamsItem } = this.props;
    setAIHWParamsItem('homeworkName', e.target.value || '');
  }
  changeSaveParam(value, type) {
    const { setAIHWParamsItem, prviewSelectObj } = this.props;
    const gradeList = prviewSelectObj.get('gradeList') || fromJS([]);
    const sudjectList = prviewSelectObj.get('sudjectList') || fromJS([]);
    let select = fromJS({});
    if (type === 'saveGrade') {
      select = gradeList.find((item) => item.get('id') === toNumber(value));
    } else if (type === 'saveSubject') {
      console.log('sudjectList', sudjectList.toJS(), value);
      select = sudjectList.find((item) => item.get('id') === toNumber(value));
    }
    setAIHWParamsItem(type, select);
  }
  render() {
    const { AIHomeworkParams, setAIHWParamsItem, saveAIHomework,
      getChangeItemDataList,
      homeworkType } = this.props;
    const { showChangeQuestionItem } = this.state;
    const AIHWQuestionList = AIHomeworkParams.get('AIHWQuestionList') || fromJS([]);
    const homeworkScene = AIHomeworkParams.get('homeworkScene') || fromJS({});
    const homeworkName = AIHomeworkParams.get('homeworkName') || '';
    // const saveGrade = AIHomeworkParams.get('saveGrade') || fromJS({});
    // const saveSubject = AIHomeworkParams.get('saveSubject') || fromJS({});
    // console.log('AIHomeworkParams', AIHomeworkParams.toJS());
    const allScore = AIHWQuestionList.map((item) => item.get('score')).reduce((a, b) => a + b);
    const isGettingAIHWQuestionList = AIHomeworkParams.get('isGettingAIHWQuestionList');
    const customHomework = homeworkType === 1;
    // const gradeList = prviewSelectObj.get('gradeList') || fromJS([]);
    // const sudjectList = prviewSelectObj.get('sudjectList') || fromJS([]);
    // console.log('sudjectListRender', sudjectList.toJS());
    // const AIAutoHomework = homeworkType === 2;                                // 智能作业
    return (<AIHomeworkEditWrapper>
      <AIEditLeft>
        {customHomework ? <FlexRowCenterBox>
          作业标题：<Input placeholder="请输入标题" value={homeworkName} onChange={this.changeHomeWorkName} style={{ width: 160 }}></Input>
        </FlexRowCenterBox> : ''}
        <FlexRowCenter style={{ height: 50, paddingLeft: 15 }}>
          适用场景：
          <Select placeholder="请选择适用场景" value={homeworkScene.get('id')} style={{ width: 160 }} onChange={this.changeHwScene}>
            {sceneList.map((it, i) => {
              return (<Option key={i} value={it.get('id')}>{it.get('name')}</Option>);
            })}
          </Select>
        </FlexRowCenter>
        <FlexRowCenterBox>
          分数：<MainColorSpan>{allScore}</MainColorSpan>
          <WidthBox></WidthBox>
          题数：<MainColorSpan>{AIHWQuestionList.count()}</MainColorSpan>
        </FlexRowCenterBox>
        <AIQuestionMune
          AIHomeworkParams={AIHomeworkParams}
          setAIHWParamsItem={setAIHWParamsItem}
        ></AIQuestionMune>
      </AIEditLeft>
      <AIEditRight>
        <AIQuestionsEdit
          AIHomeworkParams={AIHomeworkParams}
          setAIHWParamsItem={setAIHWParamsItem}
          saveAIHomework={saveAIHomework}
          showChangeItemModal={() => this.setState({ showChangeQuestionItem: true })}
          // getChangeItemDataList={getChangeItemDataList}
        ></AIQuestionsEdit>
        {customHomework ? '' : <ChangeQuestion onClick={this.changeAllQuestion}><IconReload type="reload" />换一批</ChangeQuestion>}
      </AIEditRight>
      {showChangeQuestionItem ? <ReplaceQuestionModal
        close={() => this.setState({ showChangeQuestionItem: false })}
        choose={(newQuestion) => {
          const changeItemTarget = AIHomeworkParams.get('AIChangeQuestionTarget');
          let questionNum = 0;
          const newQuestionId = newQuestion.get('id');
          const newAIHWQuestionList = AIHWQuestionList.map((item, index) => {
            if (newQuestionId === item.get('id')) {
              questionNum = index + 1;
            }
            if (item.get('id') === changeItemTarget.get('toBeReplaceId')) {
              // 增加一个aiReplaceOriginId记录原始题目id
              let target = newQuestion.set('showAnalysis', false);
              if (!item.get('aiReplaceOriginId')) {
                target = target.set('aiReplaceOriginId', item.get('id'));
              }
              return target;
            }
            return item;
          });
          if (questionNum > 0) {
            message.warning(`该题目已在作业中第${questionNum}题，不可重复添加。`);
            return;
          }
          setAIHWParamsItem('AIHWQuestionList', newAIHWQuestionList);
          this.setState({ showChangeQuestionItem: false });
          message.success('换题成功');
          setAIHWParamsItem('AIChangeQuestionTarget', fromJS({}));
          setAIHWParamsItem('AIChangeQuestionList', fromJS([]));
        }}
        switchBatch={getChangeItemDataList}
        AIHomeworkParams={AIHomeworkParams}
        homeworkType={homeworkType}
      /> : ''}
      <Modal
        title="批量换题"
        visible={isGettingAIHWQuestionList}
        footer={null}
        mask={false}
        maskClosable={false}
        closable={false}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        style={{ top: 'calc(50% - 80px)' }}
        onCancel={() => setAIHWParamsItem('isGettingAIHWQuestionList', false)}
      >
        <FlexCenter style={{ height: 130, fontSize: 15 }}>
          <IconFontDefault spin type="loading" />
          <span style={{ marginLeft: 10 }}>正在为您更换，请稍等...</span>
        </FlexCenter>
      </Modal>
    </AIHomeworkEditWrapper>);
  }
}

const mapStateToProps = createStructuredSelector({
  serachParams: makeSerachParams(),
  prviewSelectObj: makePrviewSelectObj(),
  isReEditHomeWork: makeIsReEditHomeWork(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

AIHomeworkEdit.propTypes = {
  AIHomeworkParams: PropTypes.instanceOf(immutable.Map).isRequired,
  setAIHWParamsItem: PropTypes.func.isRequired,
  getQuestion4AIHW: PropTypes.func,
  saveAIHomework: PropTypes.func.isRequired,
  homeworkType: PropTypes.number,
  getChangeItemDataList: PropTypes.func,
};
export default connect(mapStateToProps, mapDispatchToProps)(AIHomeworkEdit);
