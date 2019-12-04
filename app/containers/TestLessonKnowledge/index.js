import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Immutable from 'immutable';
import { createStructuredSelector } from 'reselect';
import { Checkbox, Form, Input, Button, Select, Table, Modal, Popconfirm } from 'antd';
import makeSelectTestLessonKnowledge, {
    makeSelectGrade,
    makeSelectGradeList,
    makeSelectInputDto,
    makeSelectModalAttr,
    makeSelectPhase,
    makeSelectPhaseList,
    makeSelectSubject,
    makeSelectSubjectList,
    makeSelectTestLessonKnowledgeList,
    makeSelectBuObject,
    makeSelectClassTypeList,
    makeSelectTextbookEditionList,
    makeSelectTextbookEdition,
    makeSelectLoading
} from './selectors';
import { FlexColumn, FlexRow, FlexRowCenter } from 'components/FlexBox';
import {
    deleteAction,
    getGradeListAction,
    getPhaseListAction,
    getSubjectListAction,
    getTestLessonKnowledgeListAction,
    saveAction,
    setCrudIdAction,
    setGradeAction,
    setInputDtoAction,
    setModalAttrAction,
    setPhaseAction,
    setBuAction,
    setSubjectAction,
    setTestLessonKnowledgeListAction,
    sortAction,
    getClassTypeListAction,
    getTextbookEditionListAction,
    setTextbookEditionAction,
    updateHot
} from './actions';

const Wrapper = styled(FlexColumn)`
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: white;
`;

const HeaderWrapper = styled(FlexRowCenter)`
  width: 100%;
  height: 60px;
  border-bottom: 2px solid #efefef;
  background-color: white;
`;

const BodyWrapper = styled(FlexRow)`
  flex: 1;
  width: 100%;
  height: 80%;
  margin-top: 15px;
  border: 1px solid #ddd;
  background-color: white;
  .ant-table-wrapper {
    flex: 1!important;
  }
`;

// Hot 标识
const Hot = styled.em`
  display: inline-block;
  padding: 0 2px;
  border-radius: 2px;
  height: 14px;
  line-height: 14px;
  font-size: 12px;
  background: #f54545;
  margin-right: 5px;
  color: #fff;
`;

let yHeight = 0;

const FormItem = Form.Item;

export class TestLessonKnowledge extends React.PureComponent {
    // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.dispatch(getPhaseListAction());
    this.props.dispatch(getClassTypeListAction());
    this.props.dispatch(getTextbookEditionListAction());
    yHeight = this.bodyWrapper.offsetHeight - 50;
  }

  render() {
    const {
      // buObject,
      // phase,
      // phaseList,
      grade,
      gradeList,
      loading,
      handleGradeSelectOnChange,
    } = this.props;
    // const antDom = document.querySelector('.ant-table-wrapper');
    // console.log(phase.toJS(), buObject.toJS(), phaseList.toJS());
    // if (antDom && antDom.clientHeight > 700) {
    //   // yHeight = antDom.clientHeight - 50;
    //   console.log(yHeight, 'dfasfsafaw -- 69');
    // } else {
    //   // yHeight = 600
    // }
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 250,
        render: (text, record) => {
          const isHot = record.isHot;
          if (isHot) {
            return <span><Hot>Hot</Hot>{text}</span>;
          }
          return text;
        }
      },
      {
        title: '难度',
        dataIndex: 'difficulty',
        key: 'difficulty',
        width: 100,
        render: (text, record) => {
          const diff = record.difficulty;
          if (diff === 0) {
            // eslint-disable-next-line no-param-reassign
            text = '默认';
          } else if (diff === 1) {
            // eslint-disable-next-line no-param-reassign
            text = '容易';
          } else if (diff === 2) {
            // eslint-disable-next-line no-param-reassign
            text = '中等';
          } else if (diff === 3) {
            // eslint-disable-next-line no-param-reassign
            text = '困难';
          }
          return text;
        }
      },
      {
        title: '适用年级',
        dataIndex: 'gradeIdList',
        key: 'gradeIdList',
        width: 150,
        render: (text, record) => {
          const gradeList = record.gradeOutputDTOList;
          // eslint-disable-next-line no-param-reassign
          text = gradeList.map((item) => item.name).join('/');
          return text;
        }
      },
      {
        title: '适用版本',
        dataIndex: 'textbookEditionIdList',
        key: 'textbookEditionIdList',
        width: 150,
        render: (text, record) => {
          const textbookEditionList = record.textbookEditionOutputDTOList;
          // eslint-disable-next-line no-param-reassign
          text = textbookEditionList.map((item) => item.name).join('/');
          return text;
        }
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        key: 'remarks',
        width: 250
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => (
          <span>
            <a href="#" onClick={() => this.props.goToUpdate(index, this.form, this.props)}>
              修改
            </a>
            <span className="ant-divider" />
            <a href="#" onClick={(e) => {
              e.preventDefault();
              this.props.onUpdateHot(record.id, record.isHot ? 0 : 1); }
            }>
              {record.isHot ? '取消' : '设置'}HOT
            </a>
            <span className="ant-divider" />
            <Popconfirm title="确定删除吗?" onConfirm={() => this.props.goToDelete(index, this.props)}>
              <a href="#">删除</a>
            </Popconfirm>
          </span>
                )
      }
    ];
    return (
      <Wrapper>
        <HeaderWrapper>
          <Select
            style={{ width: 120, marginRight: 20 }}
            value={{
              key: this.props.buObject.get('code').toString(),
              label: this.props.buObject.get('value')
            }}
            labelInValue
            onChange={(value) => {
              if (value.key === '2') {
                this.props.handlePhaseSelectOnChange({ key: 1, name: '小学' }, this.props);
                // this.props.dispatch(setPhaseAction(this.props.phase.set('id', '1').set('name', '小学')));
              }
              this.props.handleBuOnChange(value, this.props);
            }}
          >
            {this.props.classTypeList.map((bu) => (
              <Select.Option
                value={bu.get('code').toString()}
                key={bu.get('code')}
                title={bu.get('value')}
              >
                {bu.get('value')}
              </Select.Option>
            ))}
          </Select>

          <Select
            style={{ width: 120, marginRight: 20 }}
            value={{ key: this.props.phase.get('id').toString(), label: this.props.phase.get('name') }}
            labelInValue
            onChange={(value) => this.props.handlePhaseSelectOnChange(value, this.props)}
          >
            {this.props.buObject.get('code').toString() === '1' ? (
                            this.props.phaseList.map((phase) => (
                              <Select.Option
                                value={phase.get('id').toString()}
                                key={phase.get('id')}
                                title={phase.get('name')}
                                >
                                {phase.get('name')}
                              </Select.Option>
                            ))
                        ) : (
                            this.props.phaseList
                              .filter((item) => {
                                return ['1', '5'].includes(item.get('id').toString());
                              })
                              .map((phase) => (
                                <Select.Option
                                  value={phase.get('id').toString()}
                                  key={phase.get('id')}
                                  title={phase.get('name')}
                                    >
                                  {phase.get('name')}
                                </Select.Option>
                                ))
                        )}
          </Select>
          <Select
            style={{ width: 120, marginRight: 20 }}
            value={{ key: grade.get('id').toString() || '-1', label: grade.get('name') || '全部年级' }}
            labelInValue
            onChange={(value) => handleGradeSelectOnChange(value, this.props)}
          >
            <Select.Option
              value={'-1'}
              key={'-1'}
              title={'全部年级'}
            >
              全部年级
            </Select.Option>
            {
              gradeList.map((item) => (
                <Select.Option
                  value={item.get('id').toString()}
                  key={item.get('id')}
                  title={item.get('name')}
                  >
                  {item.get('name')}
                </Select.Option>
              ))
            }
          </Select>

          <Select
            style={{ width: 120, marginRight: 20 }}
            value={{ key: this.props.subject.get('id').toString(), label: this.props.subject.get('name') }}
            labelInValue
            onChange={(value) => this.props.handleSubjectSelectOnChange(value, this.props)}
                    >
            {this.props.subjectList.map((subject) => (
              <Select.Option
                value={subject.get('id').toString()}
                key={subject.get('id')}
                title={subject.get('name')}
                            >
                {subject.get('name')}
              </Select.Option>
                        ))}
          </Select>

          <Select
            style={{ width: 120, marginRight: 20 }}
            value={{ key: this.props.textbookEdition.get('id').toString(), label: this.props.textbookEdition.get('name') }}
            labelInValue
            onChange={(value) => this.props.handleEditionSelectOnChange(value, this.props)}
                    >
            {this.props.textbookEditionList.map((item) => (
              <Select.Option
                value={item.get('id').toString()}
                key={item.get('id')}
                title={item.get('name')}
                            >
                {item.get('name')}
              </Select.Option>
                        ))}
          </Select>

          <Button type={'primary'} onClick={() => this.props.handleSaveBtnOnClick(this.props)}>
            新增
          </Button>
        </HeaderWrapper>
        <BodyWrapper innerRef={(w) => { this.bodyWrapper = w }}>
          <Table
            dataSource={this.props.testLessonKnowledgeList.toJS()}
            columns={columns}
            scroll={{ y: yHeight }}
            rowKey={(record) => record.id}
            loading={loading}
            pagination={false}
          />
        </BodyWrapper>
        <CollectionCreateForm
          {...this.props.inputDto.toJS()}
          ref={(form) => { this.form = form }}
          visible={this.props.modalAttr.get('visible')}
          onChange={(values) => this.props.onChange(this.props, values)}
          onCancel={() => this.props.handleModalOnCancel(this.props)}
          onCreate={() => this.props.handleModalOnOk(this.form, this.props)}
          gradeList={this.props.gradeList}
          textbookEditionList={this.props.textbookEditionList}
        />
      </Wrapper>
    );
  }
}

const CollectionCreateForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    // console.log('props', props);
    return {
      name: {
        ...props.name,
        value: props.name
      },
      difficulty: {
        ...props.difficulty,
        value: props.difficulty.toString()
      },
      gradeIdList: {
        ...props.gradeIdList,
        value: props.gradeIdList
      },
      remarks: {
        ...props.remarks,
        value: props.remarks
      },
      textbookEditionIdList: {
        ...props.textbookEditionIdList,
        value: props.textbookEditionIdList
      }
    };
  }
})((props) => {
  const { visible, onCancel, onCreate, form } = props;
  const { getFieldDecorator } = form;
  const gradeOptions = props.gradeList.map((item) => (
    <Checkbox key={item.get('id')} value={item.get('id')}>
      {item.get('name')}
    </Checkbox>
    ));
  const editionList = props.textbookEditionList.shift();
  const editionOptions = editionList.map((item) => (
    <Checkbox key={item.get('id')} value={item.get('id')}>
      {item.get('name')}
    </Checkbox>
    ));
  return (
    <Modal visible={visible} onOk={onCreate} onCancel={onCancel}>
      <Form layout="vertical">
        <FormItem label="名称">
          {getFieldDecorator('name', {
            rules: [
              { required: true, message: '请输入名称' },
              { whitespace: true, message: '请输入名称' } /* , { max: 20, message: '不能超过20个字符' } */
            ]
          })(<Input placeholder="请输入名称" />)}
        </FormItem>
        <FormItem label="难度">
          {getFieldDecorator('difficulty')(
            <Select>
              <Select.Option key={0} value={'0'} title={'默认'}>
                  默认
              </Select.Option>
              <Select.Option key={1} value={'1'} title={'容易'}>
                  容易
              </Select.Option>
              <Select.Option key={2} value={'2'} title={'中等'}>
                  中等
              </Select.Option>
              <Select.Option key={3} value={'3'} title={'困难'}>
                  困难
              </Select.Option>
            </Select>
                    )}
        </FormItem>
        <FormItem label="适用年级">
          {getFieldDecorator('gradeIdList')(<Checkbox.Group>{gradeOptions}</Checkbox.Group>)}
        </FormItem>
        <FormItem label="适用版本">
          { editionList.size > 0
                ? getFieldDecorator('textbookEditionIdList')(<Checkbox.Group>{editionOptions}</Checkbox.Group>)
                : <p>当前条件下无教材版本</p>}
        </FormItem>
        <FormItem label="备注">{getFieldDecorator('remarks')(<Input placeholder="请输入备注" />)}</FormItem>
      </Form>
    </Modal>
  );
});

TestLessonKnowledge.propTypes = {
  dispatch: PropTypes.func.isRequired,
  handlePhaseSelectOnChange: PropTypes.func.isRequired,
  handleGradeSelectOnChange: PropTypes.func.isRequired,
  handleSubjectSelectOnChange: PropTypes.func.isRequired,
  handleBuOnChange: PropTypes.func.isRequired,
  phaseList: PropTypes.instanceOf(Immutable.List).isRequired,
  gradeList: PropTypes.instanceOf(Immutable.List).isRequired,
  classTypeList: PropTypes.instanceOf(Immutable.List).isRequired,
  subjectList: PropTypes.instanceOf(Immutable.List).isRequired,
  phase: PropTypes.instanceOf(Immutable.Map).isRequired,
  grade: PropTypes.instanceOf(Immutable.Map).isRequired,
  buObject: PropTypes.instanceOf(Immutable.Map).isRequired,
  subject: PropTypes.instanceOf(Immutable.Map).isRequired,
  testLessonKnowledgeList: PropTypes.instanceOf(Immutable.List).isRequired,
  testLessonKnowledge: PropTypes.instanceOf(Immutable.Map).isRequired,
  onChange: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  inputDto: PropTypes.instanceOf(Immutable.Map).isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  goToUpdate: PropTypes.func.isRequired,
  goToDelete: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
  handleSaveBtnOnClick: PropTypes.func.isRequired,
  modalAttr: PropTypes.instanceOf(Immutable.Map).isRequired,
  handleModalOnOk: PropTypes.func.isRequired,
  handleModalOnCancel: PropTypes.func.isRequired,
  form: PropTypes.object
};

const mapStateToProps = createStructuredSelector({
    // TestLessonKnowledge: makeSelectTestLessonKnowledge(),
  phaseList: makeSelectPhaseList(),
  classTypeList: makeSelectClassTypeList(),
  gradeList: makeSelectGradeList(),
  subjectList: makeSelectSubjectList(),
  phase: makeSelectPhase(),
  grade: makeSelectGrade(),
  buObject: makeSelectBuObject(),
  subject: makeSelectSubject(),
  testLessonKnowledgeList: makeSelectTestLessonKnowledgeList(),
  testLessonKnowledge: makeSelectTestLessonKnowledge(),
  inputDto: makeSelectInputDto(),
  modalAttr: makeSelectModalAttr(),
  textbookEditionList: makeSelectTextbookEditionList(),
  textbookEdition: makeSelectTextbookEdition(),
  loading: makeSelectLoading(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    handlePhaseSelectOnChange: (value, props) => {
      dispatch(setPhaseAction(props.phase.set('id', value.key).set('name', value.label)));
      dispatch(getGradeListAction());
      dispatch(getSubjectListAction());
      // dispatch(getTextbookEditionListAction())
    },
    handleBuOnChange: (value, props) => {
      dispatch(setBuAction(props.buObject.set('code', value.key).set('value', value.label)));
      dispatch(getTestLessonKnowledgeListAction());
    },
    handleGradeSelectOnChange: (value, props) => {
      // console.log(value.key, 'handleGradeSelectOnChange');
      dispatch(setGradeAction(props.grade.set('id', value.key).set('name', value.label)));
      dispatch(getTestLessonKnowledgeListAction());
      // dispatch(getTextbookEditionListAction())
    },
    handleSubjectSelectOnChange: (value, props) => {
      dispatch(setSubjectAction(props.subject.set('id', value.key).set('name', value.label)));
      dispatch(getTextbookEditionListAction());
      // dispatch(getTestLessonKnowledgeListAction());
    },
    handleEditionSelectOnChange: (value, props) => {
      dispatch(setTextbookEditionAction(props.textbookEdition.set('id', value.key).set('name', value.label)));
      dispatch(getTestLessonKnowledgeListAction());
    },
    handleSaveBtnOnClick: (props) => {
      dispatch(setCrudIdAction(0));
      dispatch(getGradeListAction());
      dispatch(setModalAttrAction(props.modalAttr.set('visible', true)));
      dispatch(setInputDtoAction(props.inputDto.set('name', '').set('gradeIdList', []).set('difficulty', 0).set('remarks', '').set('textbookEditionIdList', []))
);
      console.log('handleSaveBtnOnClick');
    },
    handleModalOnOk: (form, props) => {
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        console.log('props.inputDto:', props.inputDto.toJS());
        dispatch(saveAction());
      });
    },
    handleModalOnCancel: (props) => {
      dispatch(setModalAttrAction(props.modalAttr.set('visible', false)));
      console.log('handleModalOnCancel');
    },
    onChange: (props, values) => {
      console.log('form表单变动：', values);
      let dto = props.inputDto;
      if (values.name) {
        dto = dto.set('name', values.name.value);
      }
      if (values.difficulty) {
        dto = dto.set('difficulty', values.difficulty.value);
      }
      if (values.gradeIdList) {
        dto = dto.set('gradeIdList', values.gradeIdList.value);
      }
      if (values.remarks) {
        dto = dto.set('remarks', values.remarks.value);
      }
      if (values.textbookEditionIdList) {
        dto = dto.set('textbookEditionIdList', values.textbookEditionIdList.value);
      }
      dispatch(setInputDtoAction(dto));
    },
    save: () => {
      console.log('save');
      dispatch(saveAction());
    },
    cancel: () => {
      console.log('cancel');
      dispatch(getTestLessonKnowledgeListAction());
    },
    goToUpdate: (index, form, props) => {
      const testLessonKnowledge = props.testLessonKnowledgeList.get(index);
      dispatch(setCrudIdAction(testLessonKnowledge.get('id')));
      dispatch(setModalAttrAction(props.modalAttr.set('visible', true)));
      dispatch(
                setInputDtoAction(
                    props.inputDto
                      .set('name', testLessonKnowledge.get('name'))
                      .set('gradeIdList', testLessonKnowledge.get('gradeIdList'))
                      .set('difficulty', testLessonKnowledge.get('difficulty'))
                      .set('remarks', testLessonKnowledge.get('remarks'))
                      .set('textbookEditionIdList', testLessonKnowledge.get('textbookEditionIdList'))
                )
            );
      console.log('获取需要修改的值：', props.inputDto.toJS());
    },
    goToDelete: (index, props) => {
      const deleteId = props.testLessonKnowledgeList.get(index).get('id');
      dispatch(setCrudIdAction(deleteId));
      dispatch(deleteAction());
      console.log('deleteId:', deleteId);
    },
    onMouseOver: (index, props) => {
      const editor = props.testLessonKnowledgeList.find((value) => value.get('editable') === true);
      if (editor) {
        return;
      }
      const list = props.testLessonKnowledgeList.map((value, index2) =>
                value.set('toolBarVisible', index === index2)
            );
      dispatch(setTestLessonKnowledgeListAction(list));
      console.log('我来了');
    },
    onMouseLeave: (props) => {
      const list = props.testLessonKnowledgeList.map((value) => value.set('toolBarVisible', false));
      dispatch(setTestLessonKnowledgeListAction(list));
      console.log('我又走了');
    },
    handleSwitchOnChange: (checked) => {
      console.log('课程体系显示？', checked);
    },
    onDragStart: (e, index) => {
      e.stopPropagation();
      console.log('拖动开始', index);
      e.dataTransfer.setData('text', index);
    },
    onDrop: (e, index, props) => {
      e.preventDefault();
      const data = JSON.parse(e.dataTransfer.getData('text'));
      const list = props.testLessonKnowledgeList;
      const oldData = list.get(data);
      const newData = list.get(index);
      const arr = list.set(data, newData).set(index, oldData);
      dispatch(setTestLessonKnowledgeListAction(arr));
      dispatch(sortAction());
      console.log('拖动结束', index, arr.toJS());
    },
    onDragOver: (e) => {
      e.preventDefault();
    },
    onUpdateHot: (id, isHot) => {
      dispatch(updateHot(id, isHot));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TestLessonKnowledge);
