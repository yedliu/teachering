import React, { PropTypes } from 'react';
import _ from 'lodash';
import Immutable, { fromJS } from 'immutable';
import { Modal, Input, Select, Button, message, Card  } from 'antd';
import { FlexRowCenter } from 'components/FlexBox';
import {
  getCityListForCreateAction,
  setPaperMsgSelectAction,
  getCountyListForCreateAction,
  getEditionAction,
  setPaperMsgValueAction,
  setTeachingVersion,
  setCourseSystem,
  getTextBookEditionAction,
  getSubjectsAction
} from './actions';
import {
  inputStyle,
  selectStyle,
  FlexRowCenter40,
  InputTitle,
  MustBox,
  SearchItem,
  SearchWrapper,
} from './paperMsgModalStyle';
import { verifyData } from './verifyPaperMsg';
import PaperComponent from 'components/PaperComponent';
import { getGradeAndSubjectMapper } from 'utils/helpfunc';
import { getPaperFields, getRequired } from 'utils/paperUtils';

const getPaperFieldsFn = getPaperFields(2);
const getRequiredFn = getRequired();

const Option = Select.Option;

export class PaperMsgModal extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      phaseSet: new Set(), // 当有兼职人员 存放允许的学段
      allowSubjectMap: {}, // 存放允许的学科
    };
    this.onChange = this.onChange.bind(this);
    this.modalConfirm = this.modalConfirm.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const mapper = getGradeAndSubjectMapper();
    if (mapper) {
      this.setState(mapper);
    }
    dispatch(setPaperMsgSelectAction('source', 1));
  }

  modalConfirm(teachingVersion, courseSystem) {
    const { dispatch } = this.props;
    dispatch(setTeachingVersion(teachingVersion));
    setTimeout(() => {
      dispatch(setCourseSystem(courseSystem));
    }, 50);
  }

  onChange(value = -1, item) {
    const { dispatch, teachingVersion, courseSystem } = this.props;
    const iType = item.get('type');
    if (iType === 'year') {
      const selectItem = item.get('data').find((it) => _.toNumber(it.get('id')) === _.toNumber(value));
      dispatch(setPaperMsgSelectAction(iType, _.toNumber(selectItem ? selectItem.get('name') : -1)));
    } else if (iType === 'provinceId') {
      dispatch(setPaperMsgValueAction({ provinceId: _.toNumber(value), cityId: -1, countyId: -1 }));
      setTimeout(() => {
        console.log(11111);
        dispatch(getCityListForCreateAction());
      }, 30);
    } else if (iType === 'cityId') {
      dispatch(setPaperMsgValueAction({ cityId: _.toNumber(value), countyId: -1 }));
      setTimeout(() => {
        dispatch(getCountyListForCreateAction());
      }, 30);
    } else if (iType === 'gradeId' || iType === 'subjectId') {
      if (iType === 'gradeId') {
        dispatch(setPaperMsgSelectAction('subjectId', -1));
      }
      dispatch(setPaperMsgSelectAction(iType, _.toNumber(value)));
      // 清空所有和年级学科有关联的数据
      dispatch(setCourseSystem(courseSystem
        .set('selectedId', '')
        .set('editionName', '')
        .set('systemValue', this.DEFAULTVALUE)
        .set('systemTreeData', fromJS([]))
        .set('showSystemList', fromJS([]))));
      dispatch(setTeachingVersion(teachingVersion
        .set('selectedId', '')
        .set('versionValue', this.DEFAULTVALUE)
        .set('versionTreeData', fromJS([]))
        .set('teachingEditionName', '')));

      setTimeout(() => {
        dispatch(getEditionAction());
      }, 30);
      setTimeout(() => {
        dispatch(getTextBookEditionAction());
      }, 100);
    } else {
      dispatch(setPaperMsgSelectAction(iType, _.toNumber(value)));
    }
  }

  render() {
    const { visible, onCancel, data, onOk, dispatch,
      teachingVersion, courseSystem } = this.props;
    /* 教材版本和课程体系数据start */
    const { isPartTimePersion, phaseSet, allowSubjectMap } = this.state;
    const versionValue = teachingVersion.get('versionValue') ? teachingVersion.get('versionValue').toJS() : null;
    const editionName = courseSystem.get('editionName');
    const teachingEditionName = teachingVersion.get('teachingEditionName');
    const systemValue = courseSystem.get('systemValue') ? courseSystem.get('systemValue').toJS() : null;
    const showSystemList = courseSystem.get('showSystemList');
    /* 教材版本和课程体系数据end */
    const paperName = data.get(0) || fromJS({});
    let selectList = data.slice(1) || fromJS([]);
    const paperType = selectList.find((item) => item.get('type') === 'paperTypeId'); // 试卷类型
    const paperTypeSelected = paperType.get('value') > 0;
    // console.log(data.toJS())
    let needFields = [];
    let requiredRules = {};
    if (paperTypeSelected) {
      const paperTypeList = paperType.get('data').toJS();
      console.log(paperType.get('value'), paperTypeList, 111111);
      needFields = getPaperFieldsFn(paperType.get('value'), paperTypeList, 'extra');
      requiredRules = getRequiredFn(paperType.get('value'), paperTypeList, 'extra');
    }
    console.log(needFields);
    const grede = data.find((item) => item.get('type') === 'gradeId');
    const gradeId = grede.get('value');
    const selectGrade = grede.get('data').find((item) => item.get('id') == gradeId) || fromJS({}); // eslint-disable-line

    const subject = data.find((item) => item.get('type') === 'subjectId');
    const subjectId = subject.get('value');
    console.log('needFields', needFields);
    const hasTeachingVersion = needFields.includes('teachingEditionId');
    const hasCourseSystem = needFields.includes('editionId');
    return (<Modal
      visible={visible}
      style={{ minWidth: 750 }}
      maskClosable={false}
      title="创建试卷"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" size="large" onClick={onCancel}>取消</Button>,
        <Button key="nextStep" type="primary" size="large"
          disabled={!paperTypeSelected}
          onClick={() => {
            const requiredList = needFields.filter(el => requiredRules[el]);
            const res = verifyData(data.toJS(), requiredList);
            if (res.pass) {
              onOk();
            } else {
              message.warning(res.msg || '请检查试卷信息');
            }
            console.log('创建试卷', requiredList);
          }}>
          下一步
        </Button>,
      ]}
    >
      <FlexRowCenter style={{ height: 50 }}>
        <InputTitle><MustBox>*</MustBox>试卷类型：</InputTitle>
        <Select
          showSearch
          allowClear
          optionFilterProp="children"
          style={{ width: 200 }}
          placeholder="请先选择试卷类型"
          value={paperTypeSelected && paperType.get('value') > 0 ? _.toString(paperType.get('value')) : undefined} // eslint-disable-line
          onChange={(value) => {
            dispatch(setPaperMsgSelectAction('paperTypeId', _.toNumber(value)));
            dispatch(setPaperMsgSelectAction('subjectId', null)); // 重置已选择学科
            dispatch(getSubjectsAction(_.toNumber(value)));
          }}
        >
          {paperType.get('data').map(item => <Option key={item.get('id')} value={_.toString(item.get('id'))}>{item.get('name')}</Option>)}
        </Select>
      </FlexRowCenter>
      {!paperTypeSelected ? <Card loading></Card> : (
        <div>
          <FlexRowCenter40><InputTitle><MustBox>*</MustBox>{paperName.get('name')}：</InputTitle><Input
            value={paperName.get('value') || ''}
            style={inputStyle} placeholder="请输入试卷名" onChange={(e) => {
              dispatch(setPaperMsgSelectAction('epName', e.target.value));
            }}
          ></Input></FlexRowCenter40>
          <SearchWrapper>
            {selectList.map((item) => {
              const type = item.get('type');
              if (type === 'paperTypeId') return null; // 不再渲染试卷类型
              const isGradePartTimeNoPermission = (e) => type === 'gradeId' && isPartTimePersion && !phaseSet.has(e.phaseId);
              const allAllowSubject = allowSubjectMap[selectGrade.get('phaseId')] || [];
              const isSubjectPartTimeNoPermission = (e) => type === 'subjectId' && isPartTimePersion && allAllowSubject.indexOf(e.id) === -1;
              // 根据试卷类型动态加载
              if (!needFields.includes(type)) {
                return null;
              }
              const isProvince = item.get('type') === 'provinceId';
              const value = item.get('value');
              const realVal = (isProvince ? (value > 0 || value === 0) : value > 0) ? String(value) : undefined; // eslint-disable-line
              return (<SearchItem key={type}>
                <InputTitle>
                  { requiredRules[item.get('type')]
                    ? <MustBox>*</MustBox>
                    : ''}
                  {item.get('name')}：
                </InputTitle>
                <Select
                  allowClear
                  value={realVal}
                  style={selectStyle}
                  disabled={['source'].includes(type)}
                  placeholder={`请选择${item.get('name')}`}
                  onChange={(e) => { this.onChange(e, item) }}
                >
                  {item.get('data').map((it, i) => {
                    return isGradePartTimeNoPermission(it.toJS()) || isSubjectPartTimeNoPermission(it.toJS()) ?
                    null :
                    <Option key={i} value={_.toString(it.get('id'))}>{_.toString(it.get('name') || '')}</Option>;
                  })}
                </Select>
              </SearchItem>);
            })}
          </SearchWrapper>
          {/* 教材版本和课程体系 */}
          {hasTeachingVersion || hasCourseSystem ? (
            <div>
              <PaperComponent
                hasTeachingVersion={hasTeachingVersion}
                hasCourseSystem={hasCourseSystem}
                gradeId={gradeId}
                subjectId={subjectId}
                teachingEditionId={teachingVersion.get('selectedId')}
                editionId={courseSystem.get('selectedId')}
                gradeList={grede.get('data').toJS()}
                versionValue={versionValue}
                systemValue={systemValue}
                onOk={this.modalConfirm}
                showSystemList={showSystemList}
                editionName={editionName}
                teachingEditionName={teachingEditionName}
              />
            </div>
          ) : ''}
        </div>
      )}
    </Modal>);
  }
}

PaperMsgModal.propTypes = {
  dispatch: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func,
  data: PropTypes.instanceOf(Immutable.List).isRequired,
};

export default PaperMsgModal;
