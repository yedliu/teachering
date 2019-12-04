import React, { PropTypes } from 'react';
import immutable, { fromJS } from 'immutable';
import { Modal, Select, Input, message, Button, message as antdMessage } from 'antd';
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
import { makeSerachParams, makePrviewSelectObj, makeIsReEditHomeWork } from '../../selectors';
import EditItemQuestion from 'components/EditItemQuestion/index';
import QuestionTag from 'components/QuestionTag';
import {
  getQuestionTypes,
} from '../../server';
import { validateClassifyAndMatch, validateSavedQuestion } from 'components/EditItemQuestion/common';
import { getQuestionListAction } from '../../actions';
import questionApi from 'api/qb-cloud/question-endpoint';

const Option = Select.Option;

export class AIHomeworkEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.changeAllQuestion = this.changeAllQuestion.bind(this);
    this.changeHwDiff = this.changeHwDiff.bind(this);
    this.changeHomeWorkName = this.changeHomeWorkName.bind(this);
    this.changeSaveParam = this.changeSaveParam.bind(this);
    this.state = {
      showChangeQuestionItem: false,
      filterQuestionTypes: [],
      newQuestion: fromJS({}),
      curTagQ: fromJS({}),
      clickTarget: '',
      showQuestionTag: false,
      visible: true,
      clssTypeCode: '',
      getProvinceData: [],
    };
  }
  componentDidMount() {
    // 获取题型
    getQuestionTypes().then(res => {
      const { code, message, data } = res;
      // data && data.unshift({ id: '', value: '全部' });
      let list = ['单选题', '多选题', '判断题', '选词填空', '分类题', '配对题'];

      // 少儿BU开发单题录入时的听力题型选择
      // const isChildBU = /childBU\/homework-standard/.test(window.location.pathname);
      // if (isChildBU) {
      //   list = list.concat(['听力题', '互动排序题', '互动判断题']);
      // }
      let filterData = data.filter((item) => {
        return list.indexOf(item.name) > -1;
      });
      code !== '0' ? window.zmAlert(message || '获取题型信息出错') : this.setState({ filterQuestionTypes: filterData });
    });
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
    const TITLE_MAX_LENGTH = 50;
    const value =  e.target.value;
    if (value && value.length > TITLE_MAX_LENGTH) {
      antdMessage.warning('作业标题最大长度为50');
      return;
    }
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
  // 开关新增题目面板
  closeOrOpenItemQuestion = (isOpen) => {
    this.setState({
      showItemQuestion: isOpen,
    });
    // 关闭的时候把弹窗恢复默认状态
    if (!isOpen) {
      this.setState({
        visible: true,
        showQuestionTag: false
      });
    }
  }
  openOrCloseTagWindow = (bool) => {
    this.setState({
      showQuestionTag: bool,
    });
  }
  editQuestionSubmit = (type) => {
    const { newQuestion } = this.state;
    // const typeId = newQuestion.get('typeId');
    if ([5, 6].includes(newQuestion.get('templateType'))) {
      const response = validateClassifyAndMatch(newQuestion);
      if (response.errorMsg) {
        antdMessage.warning(response.errorMsg || '录入有误，请检查');
        return false;
      } else {
        this.setState({
          curTagQ: response.data
        });
      }
    } else {
      const errorMsg = validateSavedQuestion(newQuestion);
      if (errorMsg) {
        antdMessage.info(errorMsg);
        return false;
      }
      this.setState({
        curTagQ: newQuestion,
      });
    }
    if (!(type === 'view')) {
      this.openOrCloseTagWindow(true);
      this.setState({
        visible: true
      });
    }
    return true;
  }
  setNewQuestionData = (data) => {
    this.setState({
      newQuestion: data
    });
  }
  setClickTargetAction = (str) => {
    this.setState({
      clickTarget: str,
    });
  }
  changeQuestionEditState = () => {
    this.closeOrOpenItemQuestion(false);
    this.setState({
      newQuestion: fromJS({}),
      curTagQ: fromJS({}),
    });
  }

  async submitSingleQuestion(tags) {
    const { curTagQ } = this.state;
    const res = await questionApi.saveQuestion(Object.assign(curTagQ.toJS(), tags));
    const { dispatch, setAIHWParamsItem, AIHomeworkParams } = this.props;
    const { code, data } = res;
    if (code !== '0') {
      antdMessage.warning(res.message || '保存出错');
    } else {
      antdMessage.success(res.message || '保存成功');
      this.setState({
        showQuestionTag: false,
        showItemQuestion: false,
        newQuestion: fromJS({}),
      }, () => {
        setAIHWParamsItem('AIHWQuestionList',
          AIHomeworkParams
            .get('AIHWQuestionList')
            .push(fromJS(data)
              .set('showTools', false)
              .set('showAnalysis', false)
            ).sortBy((item) => item.get('parentTypeId')));
      });

      dispatch(getQuestionListAction());
    }
    this.setState({ clickTarget: '' });
  }
  // 单题录入弹框
  makeEditOrAddQuestion() {
    const { filterQuestionTypes, questionEditState, newQuestion, clickTarget } = this.state;
    return (
      <EditItemQuestion
        isOpen={true}
        curTagQ={this.state.curTagQ}
        questionEditState={questionEditState || 0}
        newQuestion={newQuestion}
        questionTypeList={fromJS(filterQuestionTypes)}
        clickTarget={clickTarget}
        setNewQuestionData={this.setNewQuestionData}
        changeQuestionEditState={this.changeQuestionEditState}
        setClickTarget={this.setClickTargetAction}
        soucre="questionPicker"
        source2="questionManagement"
        submitQuestionItem={this.editQuestionSubmit}
      />
    );
  }
  // 展示标签
  makeEditQuestionTag() {
    const { curTagQ, isCacheWhenClose, visible } = this.state;
    return (
      <QuestionTag
        question={curTagQ.toJS()}
        visible={visible}
        cancelText={isCacheWhenClose ? '上一步' : '取消'}
        close={() => {
          if (isCacheWhenClose) {
            this.setState({
              visible: false,
            });
            this.closeOrOpenItemQuestion(true);
          } else {
            this.setState({
              showQuestionTag: false,
            });
          }
        }}
        submitTags={(tags) => {
          this.submitSingleQuestion(tags);
        }}
      />
    );
  }
  render() {
    const {
      AIHomeworkParams, setAIHWParamsItem, saveAIHomework,
      homeworkType, getChangeItemDataList,
      classTypeCode
    } = this.props;
    const { showChangeQuestionItem, showItemQuestion, showQuestionTag } = this.state;
    const AIHWQuestionList = AIHomeworkParams.get('AIHWQuestionList') || fromJS([]);
    const homeworkDiff = AIHomeworkParams.get('homeworkDiff') || fromJS({});
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
        {String(classTypeCode) === '2' ?
          <FlexRowCenterBox>
            <Button
              type="primary"
              style={{ marginBottom: 15 }}
              onClick={() => {
                this.setState({
                  isCacheWhenClose: true,
                });
                this.closeOrOpenItemQuestion(true);
              }}
            >
              单题录入
          </Button>
          </FlexRowCenterBox> : ''
        }
        {customHomework ? <FlexRowCenterBox>
          作业标题：<Input placeholder="请输入标题" value={homeworkName} onChange={this.changeHomeWorkName} style={{ width: 160 }}></Input>
        </FlexRowCenterBox> : ''}
        <FlexRowCenter style={{ height: 50, paddingLeft: 15 }}>
          作业难度：
          <Select value={toString(homeworkDiff.get('id'))} style={{ width: 100 }} onChange={this.changeHwDiff}>
            {homeworkDiffList.map((it, i) => {
              return (<Option key={i} value={toString(it.get('id'))}>{it.get('name')}</Option>);
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
      {showItemQuestion ? this.makeEditOrAddQuestion() : ''}
      {showQuestionTag ? this.makeEditQuestionTag() : ''}
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
