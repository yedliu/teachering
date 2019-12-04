import React, { PropTypes } from 'react';
import immutable, { fromJS } from 'immutable';
import { Modal, Select, Input, message } from 'antd';
import { toString, toNumber } from 'lodash';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { FlexCenter, FlexRowCenter } from 'components/FlexBox';
import ReplaceQuestionModal from './AIQuestionChangeItem';
import { homeworkDiffList } from '../../common';
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
import { zmSchoolType } from 'utils/zmConfig';
import { makeSerachParams, makePrviewSelectObj, makeIsReEditHomeWork } from '../../selectors';

const Option = Select.Option;

export class AIHomeworkEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.changeAllQuestion = this.changeAllQuestion.bind(this);
    this.changeHwDiff = this.changeHwDiff.bind(this);
    this.changeHomeWorkName = this.changeHomeWorkName.bind(this);
    this.changeHomeWorkZmxtType = this.changeHomeWorkZmxtType.bind(this);
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
  changeHwDiff(value) {
    const { setAIHWParamsItem } = this.props;
    const selectedDiff = homeworkDiffList.find((item) => item.get('id') === toNumber(value));
    setAIHWParamsItem('homeworkDiff', selectedDiff);
  }
  changeHomeWorkName(e) {
    const { setAIHWParamsItem } = this.props;
    setAIHWParamsItem('homeworkName', e.target.value || '');
  }
  changeHomeWorkZmxtType(value) {
    const { setAIHWParamsItem } = this.props;
    setAIHWParamsItem('schoolType', value || '4');
  }
  changeSaveParam(value, type) {
    const { setAIHWParamsItem, prviewSelectObj } = this.props;
    const gradeList = prviewSelectObj.get('gradeList') || fromJS([]);
    const sudjectList = prviewSelectObj.get('sudjectList') || fromJS([]);
    let select = fromJS({});
    if (type == 'saveGrade') {
      select = gradeList.find((item) => item.get('id') === toNumber(value));
    } else if (type == 'saveSubject') {
      console.log('sudjectList', sudjectList.toJS(), value);
      select = sudjectList.find((item) => item.get('id') === toNumber(value));
    }
    setAIHWParamsItem(type, select);
  }
  componentDidMount() {
    // 把外面的类型带进来
    const { serachParams, prviewSelectObj } = this.props;
    const schoolType = serachParams.get('schoolType');
    this.changeHomeWorkZmxtType(schoolType);
    const selectGrade = prviewSelectObj.get('selectGrade') || fromJS({});
    const selectSubject = prviewSelectObj.get('selectSubject') || fromJS({});
    this.changeSaveParam(selectGrade.get('id'), 'saveGrade');
    this.changeSaveParam(selectSubject.get('id'), 'saveSubject');
    if (!this.props.isReEditHomeWork) {
      this.changeHomeWorkName({target: {value: ''}});
    }
  }
  render() {
    const { AIHomeworkParams, setAIHWParamsItem, saveAIHomework,
      getChangeItemDataList,
      homeworkType, prviewSelectObj } = this.props;
      const { showChangeQuestionItem } = this.state;
    const AIHWQuestionList = AIHomeworkParams.get('AIHWQuestionList') || fromJS([]);
    const homeworkDiff = AIHomeworkParams.get('homeworkDiff') || fromJS({});
    const homeworkName = AIHomeworkParams.get('homeworkName') || '';
    const zmxtType = AIHomeworkParams.get('schoolType') || '4';
    const saveGrade = AIHomeworkParams.get('saveGrade') || fromJS({});
    const saveSubject = AIHomeworkParams.get('saveSubject') || fromJS({});
    //console.log('AIHomeworkParams', AIHomeworkParams.toJS());
    const allScore = AIHWQuestionList.map((item) => item.get('score')).reduce((a, b) => a + b);
    const isGettingAIHWQuestionList = AIHomeworkParams.get('isGettingAIHWQuestionList');
    const customHomework = homeworkType === 1;
    const gradeList = prviewSelectObj.get('gradeList') || fromJS([]);
    const sudjectList = prviewSelectObj.get('sudjectList') || fromJS([]);
    //console.log('sudjectListRender', sudjectList.toJS());
    // const AIAutoHomework = homeworkType === 2;                                // 智能作业
    return (<AIHomeworkEditWrapper>
      <AIEditLeft>
        {customHomework ? <FlexRowCenterBox>
          作业标题：<Input placeholder='请输入标题' value={homeworkName} onChange={this.changeHomeWorkName} style={{ width: 160 }}></Input>
        </FlexRowCenterBox> : ''}
        <div>
          <FlexRowCenter style={{ height: 50, paddingLeft: 15 }}>
            类型：
            <Select value={String(zmxtType)} style={{ width: 100 }} onChange={this.changeHomeWorkZmxtType}>
              {zmSchoolType.map((it, i) => {
                return (<Option key={it.value} value={toString(it.value)}>{it.label}</Option>);
              })}
            </Select>
          </FlexRowCenter>
          <FlexRowCenter style={{ height: 50, paddingLeft: 15 }}>
            学科：
            <Select value={toString(saveSubject.get('id'))} style={{ width: 100 }} onChange={(e) => this.changeSaveParam(e, 'saveSubject')}>
              {sudjectList.toJS().map((it, i) => {
                return (<Option key={it.id} value={toString(it.id)}>{it.name}</Option>);
              })}
            </Select>
          </FlexRowCenter>
          <FlexRowCenter style={{ height: 50, paddingLeft: 15 }}>
            年级：
            <Select value={toString(saveGrade.get('id'))} style={{ width: 100 }} onChange={(e) => this.changeSaveParam(e, 'saveGrade')}>
              {gradeList.toJS().map((it, i) => {
                return (<Option key={it.id} value={toString(it.id)}>{it.name}</Option>);
              })}
            </Select>
          </FlexRowCenter>
        </div>
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
            if (item.get('id') === changeItemTarget.get('id')) {
              return newQuestion.set('showAnalysis', false);
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
