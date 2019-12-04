/*
 *
 * ExamPoint
 *
 */

import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { Checkbox, Form, Input, Select, Modal, message, Spin } from 'antd';
import { BgModal, CenterDiv } from 'components/CommonFn/style';
import { makeIsLoading } from 'containers/LeftNavC/selectors';
import {
  makeSelectPhaseSubjectList,
  makeSelectPhaseSubject,
  makeSelectExamPointList,
  makeSelectInputDto,
  makeSelectSelectedExamPointList,
  makeSelectModalAttr,
  makeSelectCrudId,
} from './selectors';
import {
  getPhaseSubjectListAction,
  getExaminationPoint,
  setPhaseSubjectAction,
  setExamPointListAction,
  setCrudIdAction,
  setInputDtoAction,
  getExamPointAction,
  setSelectedExaminationListAction,
  saveAction,
  deleteAction,
  sortAction,
  setModalAttrAction,
} from './actions';
import { FlexColumn, FlexRowCenter, FlexRow } from '../../components/FlexBox';
import ListView, { ListViewItem } from '../../components/ListView/index';
const picNull = window._baseUrl.imgCdn + '18cdee41-78a4-4873-b815-17cbf07aaab2.png';
const FormItem = Form.Item;

const Wrapper = styled(FlexColumn) `
width: 100%;
height: 100%;
background-color: white;
`;

const HeaderWrapper = styled(FlexRowCenter) `
  width: 100%;
  height: auto;
  background-color: white;
  padding:20px 0 15px;
  padding-left: 20px;
  flex-wrap:wrap
`;

const BodyWrapper = styled(FlexRow) `
  justify-content:flex-start;
  width: 100%;
  // min-width:1300;
  height: auto;
  background-color: #f5f6f8;
  flex-grow:1;
  overflow:auto;
  // flex-wrap:wrap;
  .iySlzp {
    min-height: 60px!important;
  }
`;

export class ExamPoint extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.dispatch(getPhaseSubjectListAction());
  }
  render() {
    let bodyItems = [];
    let examPointList = this.props.examPointList.toJS();
    if (examPointList.length < 5) {
      examPointList = examPointList.concat([[], [], [], [], []]).slice(0, 5);
    }
    if (examPointList.length > 0) {
      bodyItems = examPointList.map((itemList, index) => {
        let listViewList = [];
        let hiddenFooter = false;
        if (itemList.length === 0) {
          listViewList.push(<div key={1} style={{ textAlign: 'center', marginTop: '80px', fontSize: '14px' }}><img src={picNull} alt="暂无数据" /><p style={{ color: '#999', marginTop: 20 }}>暂无数据</p></div>);
        } else {
          listViewList = itemList.map((item, index2) => {
            const style = {};
            const curLevelItem = this.props.selectedExamPointList.get(index);
            let selected = false;
            if (item.editable) {
              return <ListViewItem key={index2} name={this.props.inputDto.get('name')} editable={true} onChange={(e) => this.props.onChange(e, this.props.inputDto)} save={this.props.save} cancel={this.props.cancel} />;
            } else {
              if (curLevelItem && (item.id === curLevelItem.get('id'))) {
                selected = true;
              }
              return <ListViewItem
                selected={selected} style={style} key={index2} name={item.name} toolBarVisible={item.toolBarVisible}
                editable={item.editable} onMouseOver={() => this.props.onMouseOver(index, index2, this.props)}
                onMouseLeave={() => this.props.onMouseLeave(index, this.props)} draggable
                onDragStart={(e) => this.props.onDragStart(e, index, index2)}
                onDrop={(e) => this.props.onDrop(e, index, index2, this.props)}
                onDragOver={(e) => this.props.onDragOver(e)}
                onClick={() => this.props.handleItemOnClick(index, index2, item.id, this.props)}
                goToUpdate={(e) => this.props.goToUpdate(e, index, index2, this.props)}
                goToDelete={(e) => this.props.goToDelete(e, index, index2, this.props)}
                handleDelete={(e) => this.props.handleDelete(e, index, index2, this.props)}
                handlePopCancel={(e) => this.props.handlePopCancel(e)}
              />;
            }
          });
        }
        if (index && (examPointList[index - 1].length === 0)) {
          hiddenFooter = true;
        }
        return <ListView key={index} title={index + 1 + '级考点'} onFooterBtnClick={() => this.props.handleOnFooterBtnClick(index, this.props)} hiddenFooter={hiddenFooter}>{listViewList}</ListView>;
      });
    } else {
      bodyItems.push(<div key={1} style={{ textAlign: 'center', marginTop: 80, fontSize: 14 }}><img src={picNull} alt="暂无数据" /><p style={{ color: '#999', marginTop: 20 }}>暂无数据</p></div>);
    }
    return (
      <Wrapper>
        <HeaderWrapper>
          <Select style={{ width: 120, height: 40 }} size="large" value={{ key: this.props.phaseSubject.get('id').toString(), label: this.props.phaseSubject.get('name') }} labelInValue={true} onChange={(value) => this.props.handlePhaseSubjectSelectOnChange(value, this.props)}>
            {
              this.props.phaseSubjectList.map((phaseSubject) => {
                return <Select.Option value={phaseSubject.get('id').toString()} key={phaseSubject.get('id')} title={phaseSubject.get('name')}>{phaseSubject.get('name')}</Select.Option>;
              })
            }
          </Select>
        </HeaderWrapper>
        <BodyWrapper>
          <div style={{ whiteSpace: 'nowrap', textAlign: 'center', width: '100%' }}>
            {bodyItems}
          </div>
        </BodyWrapper>
        <CollectionCreateForm {...this.props.inputDto.toJS() }
          ref={(form) => { this.form = form }}
          visible={this.props.modalAttr.get('visible')}
          onChange={(values) => this.props.onChange(this.props, values)}
          onCancel={() => this.props.handleModalOnCancel(this.props)}
          onCreate={() => this.props.handleModalOnOk(this.form, this.props)}
          phase={this.props.phase}
        />
        {this.props.isLoading ? <BgModal>
          <CenterDiv>
            <Spin size="large" />
          </CenterDiv>
        </BgModal> : ''}
      </Wrapper>
    );
  }
}
const CollectionCreateForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      name: {
        ...props.name,
        value: props.name,
      },
      comprehensiveDegree: {
        ...props.comprehensiveDegree,
        value: props.comprehensiveDegree.toString(),
      },
      examFrequency: {
        ...props.examFrequency,
        value: props.examFrequency.toString(),
      },
      labelList: {
        ...props.labelList,
        value: props.labelList,
      },
      sceneList: {
        ...props.sceneList,
        value: props.sceneList,
      },
    };
  },
})(
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal visible={visible} onOk={onCreate} onCancel={onCancel}>
        <Form layout="vertical">
          <FormItem label="名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入名称' }, { whitespace: true, message: '请输入名称' }],
            })(
              <Input placeholder="请输入名称" />
              )}
          </FormItem>
          <FormItem label="综合度">
            {getFieldDecorator('comprehensiveDegree', {
              rules: [{ required: true, message: '请选择' }],
            })(
              <Select>
                <Select.Option key={1} value={'1'} title={'L1'}>L1</Select.Option>
                <Select.Option key={2} value={'2'} title={'L2'}>L2</Select.Option>
                <Select.Option key={3} value={'3'} title={'L3'}>L3</Select.Option>
                <Select.Option key={4} value={'4'} title={'L4'}>L4</Select.Option>
              </Select>
              )}
          </FormItem>
          <FormItem label="考试频率">
            {getFieldDecorator('examFrequency', {
              rules: [{ required: true, message: '请选择' }],
            })(

              <Select>
                <Select.Option key={1} value={'1'} title={'低'}>低</Select.Option>
                <Select.Option key={2} value={'2'} title={'中'}>中</Select.Option>
                <Select.Option key={3} value={'3'} title={'高'}>高</Select.Option>
              </Select>
              )}
          </FormItem>
          <FormItem label="场景">
            {getFieldDecorator('sceneList', {
              rules: [{ required: true, message: '请选择至少一项' }],
            })(
              <Checkbox.Group>
                <Checkbox key={1} value={1}>新课</Checkbox>
                <Checkbox key={2} value={2}>同步</Checkbox>
                <Checkbox key={3} value={3}>单元复习</Checkbox>
                <Checkbox key={4} value={4}>期中复习</Checkbox>
                <Checkbox key={5} value={5}>期末复习</Checkbox>
                <Checkbox key={6} value={6}>中考复习</Checkbox>
                <Checkbox key={7} value={7}>高考复习</Checkbox>
                <Checkbox key={8} value={8}>竞赛</Checkbox>
                <Checkbox key={9} value={9}>会考</Checkbox>
                <Checkbox key={10} value={10}>杯赛</Checkbox>
                <Checkbox key={11} value={11}>日校衔接</Checkbox>
                <Checkbox key={12} value={12}>小升初</Checkbox>
              </Checkbox.Group>
              )}
          </FormItem>
          <FormItem label="标签">
            {getFieldDecorator('labelList', {
              rules: [{ required: true, message: '请选择至少一项' }],
            })(
              <Checkbox.Group>
                <Checkbox key={1} value={1} >高频</Checkbox>
                <Checkbox key={2} value={2} >创新</Checkbox>
                <Checkbox key={3} value={3} >压轴</Checkbox>
                <Checkbox key={4} value={4} >核心</Checkbox>
                <Checkbox key={5} value={5} >期中</Checkbox>
                <Checkbox key={6} value={6} >期末</Checkbox>
                <Checkbox key={7} value={7} >易错</Checkbox>
                <Checkbox key={8} value={8}>常识</Checkbox>
                <Checkbox key={9} value={9}>基础</Checkbox>
                <Checkbox key={10} value={10}>必考</Checkbox>
              </Checkbox.Group>
              )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
  );
ExamPoint.propTypes = {
  dispatch: PropTypes.func.isRequired,
  phaseSubjectList: PropTypes.instanceOf(Immutable.List).isRequired,
  phaseSubject: PropTypes.instanceOf(Immutable.Map).isRequired,
  examPointList: PropTypes.instanceOf(Immutable.List).isRequired,
  selectedExamPointList: PropTypes.instanceOf(Immutable.List).isRequired,
  handleOnFooterBtnClick: PropTypes.func.isRequired,
  inputDto: PropTypes.instanceOf(Immutable.Map).isRequired,
  onChange: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  goToUpdate: PropTypes.func.isRequired,
  goToDelete: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
  handleItemOnClick: PropTypes.func.isRequired,
  modalAttr: PropTypes.instanceOf(Immutable.Map).isRequired,
  handleModalOnOk: PropTypes.func.isRequired,
  handleModalOnCancel: PropTypes.func.isRequired,
  form: PropTypes.object,
  handlePopCancel: PropTypes.func.isRequired,
  handleDelete: PropTypes.func,
  isLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  // ExamPoint: makeSelectKnowledge(),
  phaseSubjectList: makeSelectPhaseSubjectList(),
  phaseSubject: makeSelectPhaseSubject(),
  examPointList: makeSelectExamPointList(),
  selectedExamPointList: makeSelectSelectedExamPointList(),
  inputDto: makeSelectInputDto(),
  modalAttr: makeSelectModalAttr(),
  crudId: makeSelectCrudId(),
  isLoading: makeIsLoading(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    handleModalOnCancel: (props) => {
      dispatch(setModalAttrAction(props.modalAttr.set('visible', false)));
      console.log('handleModalOnCancel');
    },
    handleModalOnOk: (form, props) => {
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        // console.log('props.inputDto:', props.inputDto.toJS());
        dispatch(saveAction());
      });
    },
    handlePhaseSubjectSelectOnChange: (value, props) => {
      dispatch(setPhaseSubjectAction(props.phaseSubject.set('id', value.key).set('name', value.label)));
      dispatch(getExaminationPoint());
    },
    handleItemOnClick: (level, index, value, props) => {
      console.log('点击了：', level, value);
      dispatch(setCrudIdAction(value));
      dispatch(setInputDtoAction(props.inputDto.set('level', level)));
      dispatch(setSelectedExaminationListAction(props.selectedExamPointList.set(level, props.examPointList.get(level).get(index))));
      dispatch(getExamPointAction());
    },
    handleOnFooterBtnClick: (level, props) => {
      dispatch(setCrudIdAction(0));
      dispatch(setInputDtoAction(
        props.inputDto.set('name', '')
          .set('comprehensiveDegree', '1')
          .set('examFrequency', '1')
          .set('sort', '')
          .set('sceneList', [])
          .set('labelList', [])
          .set('level', level)
      )
      );
      dispatch(setModalAttrAction(props.modalAttr.set('visible', true)));

    },
    onChange: (props, values) => {
      let dto = props.inputDto;
      if (values.name) {
        dto = dto.set('name', values.name.value);
      }
      if (values.comprehensiveDegree) {
        dto = dto.set('comprehensiveDegree', values.comprehensiveDegree.value);
      }
      if (values.examFrequency) {
        dto = dto.set('examFrequency', values.examFrequency.value);
      }
      if (values.labelList) {
        dto = dto.set('labelList', values.labelList.value);
      }
      if (values.sceneList) {
        dto = dto.set('sceneList', values.sceneList.value);
      }
      dispatch(setInputDtoAction(dto));
    },
    save: () => {
      console.log('save');
      dispatch(saveAction());
    },
    cancel: () => {
      console.log('cancel');
      dispatch(getExaminationPoint());
    },
    onMouseOver: (level, index, props) => {
      const editor = props.examPointList.get(level).find((value) => value.get('editable') === true);
      if (editor) {
        return;
      }
      const list = props.examPointList.get(level).map((value, index2) =>
        value.set('toolBarVisible', index === index2)
      );
      dispatch(setExamPointListAction(props.examPointList.set(level, list)));
      // console.log('我来了');
    },
    onMouseLeave: (level, props) => {
      if (props.crudId !== 0) {
        return;
      }
      const list = props.examPointList.get(level).map((value) =>
        value.set('toolBarVisible', false)
      );
      dispatch(setExamPointListAction(props.examPointList.set(level, list)));
    },
    goToUpdate: (e, level, index, props) => {
      e.stopPropagation();
      const examPoint = props.examPointList.get(level).get(index);
      const sceneList = examPoint.get('scene') && examPoint.get('scene').split(',').map(val => Number(val));
      const labelList = examPoint.get('label') && examPoint.get('label').split(',').map(val => Number(val));
      const inputDto = props.inputDto.set('name', examPoint.get('name'))
        .set('comprehensiveDegree', examPoint.get('comprehensiveDegree'))
        .set('examFrequency', examPoint.get('examFrequency'))
        .set('sort', examPoint.get('sort'))
        .set('sceneList', examPoint.get('sceneList') || sceneList || [0, 1])
        .set('labelList', examPoint.get('labelList') || labelList || [0, 1])
        .set('level', level)
        .set('index', index);
      dispatch(setCrudIdAction(examPoint.get('id')));
      dispatch(setModalAttrAction(props.modalAttr.set('visible', true)));
      dispatch(setInputDtoAction(inputDto));
      console.log('修改的值：', inputDto);
    },
    goToDelete: (e, level, index, props) => {
      e.stopPropagation();
      dispatch(setInputDtoAction(props.inputDto.set('level', level)));
      const deleteId = props.examPointList.get(level).get(index).get('id');
      console.log('goToDelete:', deleteId);
      dispatch(setCrudIdAction(deleteId));
    },
    handleDelete: (e, level, index, props) => {
      console.log('do delete!!!!!!!!!');
      e.stopPropagation();
      dispatch(setInputDtoAction(props.inputDto.set('level', level).set('index', index)));
      const deleteId = props.examPointList.get(level).get(index).get('id');
      dispatch(setCrudIdAction(deleteId));
      dispatch(deleteAction());
    },
    handlePopCancel: (e) => {
      e.stopPropagation();
      dispatch(setCrudIdAction(0));
    },
    onDragStart: (e, level, index) => {
      e.stopPropagation();
      console.log('拖动开始', level, index);
      e.dataTransfer.setData('text', JSON.stringify({ level, index }));
    },
    onDrop: (e, level, index, props) => {
      e.preventDefault();
      const data = JSON.parse(e.dataTransfer.getData('text'));
      if (level !== data.level) {
        message.warning('不同层级之间不可移动');
        return;
      }
      const allList = props.examPointList;
      const idList = allList.toJS()[level].map((item) => item.id);
      console.log('before sort', idList);
      const curList = allList.get(level);
      const oldData = curList.get(data.index);
      const newData = curList.get(index);
      const arr = curList.set(data.index, newData).set(index, oldData);
      const mewAll = allList.set(level, arr);

      dispatch(setInputDtoAction(props.inputDto.set('level', level)));
      dispatch(setExamPointListAction(mewAll));
      dispatch(sortAction());

      console.log('拖动结束', level, index, arr.toJS());
    },
    onDragOver: (e) => {
      e.preventDefault();
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExamPoint);
